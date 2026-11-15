import { isSameAppOrigin } from "@/lib/request-origin";
import { NextRequest, NextResponse } from "next/server";
import { readDB, writeDB, hash } from "@/lib/platform-server";
import { collection, prices } from "@/lib/platform";
import { emptyLead, type LeadInput } from "@/lib/leads";

const response = (data: unknown, status = 200) =>
  NextResponse.json(data, { status, headers: { "Cache-Control": "no-store" } });
function key(req: NextRequest) {
  const value = req.headers.get("authorization")?.replace(/^Bearer /, "") || "";
  return /^[a-f0-9]{64}$/.test(value) ? hash(value) : null;
}
export async function GET(req: NextRequest) {
  const k = key(req);
  if (!k) return response({ error: "Invalid session" }, 401);
  const lead = readDB().leads?.find((l) => l.tokenHash === k);
  if (!lead) return response({ lead: null });
  const input = Object.fromEntries(
    Object.keys(emptyLead).map((k) => [k, lead[k as keyof LeadInput]]),
  );
  return response({ lead: input, revision: lead.revision, id: lead.id });
}
export async function POST(req: NextRequest) {
  if (!isSameAppOrigin(req.headers))
    return response({ error: "Invalid origin" }, 403);
  const k = key(req);
  if (!k) return response({ error: "Invalid session" }, 401);
  try {
    const text = await req.text();
    if (text.length > 12000)
      return response({ error: "Request too large" }, 413);
    const b = JSON.parse(text);
    if (!Number.isSafeInteger(b.revision) || b.revision < 1)
      return response({ error: "Invalid revision" }, 400);
    const d = b.data;
    if (!d || typeof d !== "object")
      return response({ error: "Missing details" }, 400);
    const input = { ...emptyLead };
    for (const field of [
      "name",
      "phone",
      "email",
      "transaction",
      "paymentMethod",
    ] as const) {
      if (typeof d[field] !== "string" || d[field].length > 200)
        return response({ error: "Invalid " + field }, 400);
      input[field] = d[field];
    }
    if (
      !collection.some((t) => t.id === d.template) ||
      !Object.hasOwn(prices, d.tier) ||
      !Number.isInteger(d.step) ||
      d.step < 0 ||
      d.step > 3 ||
      !Array.isArray(d.addons) ||
      d.addons.some(
        (a: unknown) => !["image", "video", "events"].includes(String(a)),
      ) ||
      typeof d.paymentClaimed !== "boolean" ||
      typeof d.whatsappOpened !== "boolean"
    )
      return response({ error: "Invalid selection" }, 400);
    Object.assign(input, {
      template: d.template,
      tier: d.tier,
      step: d.step,
      addons: [...new Set(d.addons)],
      paymentClaimed: d.paymentClaimed,
      whatsappOpened: d.whatsappOpened,
    });
    // No awaits between read and atomic write: serialized within this single Node instance.
    const db = readDB();
    db.leads ??= [];
    let lead = db.leads.find((l) => l.tokenHash === k);
    const now = new Date().toISOString();
    if (
      lead &&
      b.revision === lead.revision &&
      Object.keys(input).every(
        (k) =>
          JSON.stringify(input[k as keyof LeadInput]) ===
          JSON.stringify(lead![k as keyof LeadInput]),
      )
    )
      return response({
        id: lead.id,
        revision: lead.revision,
        savedAt: lead.updated,
      });
    if (lead && b.revision <= lead.revision)
      return response(
        {
          error: "A newer version is saved. Reload to resume it.",
          revision: lead.revision,
        },
        409,
      );
    if (!lead) {
      lead = {
        ...input,
        id: "WI-" + k.slice(0, 12).toUpperCase(),
        tokenHash: k,
        revision: 0,
        adminRevision: 0,
        created: now,
        updated: now,
        lastSeen: now,
        maxStep: 0,
        stage: "New",
        assignee: "",
        followUp: "",
        paymentVerified: false,
        notes: [],
        timeline: [{ at: now, text: "Order journey started" }],
      };
      db.leads.push(lead);
    }
    const event = (text: string) => lead!.timeline.push({ at: now, text });
    if (input.step !== lead.step)
      event(
        "Reached " +
          ["Your details", "Design & package", "Payment", "WhatsApp handoff"][
            input.step
          ],
      );
    if (input.template !== lead.template || input.tier !== lead.tier)
      event("Selection updated: " + input.template + " / " + input.tier);
    if (input.paymentClaimed !== lead.paymentClaimed)
      event(
        input.paymentClaimed
          ? "Customer claimed payment — review required"
          : "Customer cleared payment claim",
      );
    if (input.whatsappOpened && !lead.whatsappOpened)
      event("WhatsApp link opened — message sending unconfirmed");
    if (
      input.paymentMethod !== lead.paymentMethod ||
      input.transaction !== lead.transaction ||
      input.paymentClaimed !== lead.paymentClaimed ||
      input.tier !== lead.tier ||
      input.template !== lead.template ||
      JSON.stringify(input.addons) !== JSON.stringify(lead.addons)
    )
      lead.paymentVerified = false;
    Object.assign(lead, input, {
      revision: b.revision,
      updated: now,
      lastSeen: now,
      maxStep: Math.max(lead.maxStep, input.step),
    });
    lead.timeline = lead.timeline.slice(-200);
    writeDB(db);
    return response({ id: lead.id, revision: lead.revision, savedAt: now });
  } catch {
    return response({ error: "Unable to save. Please retry." }, 400);
  }
}
