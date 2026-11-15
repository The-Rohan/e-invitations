import { isSameAppOrigin } from "@/lib/request-origin";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { identity, identityFromCookies, writeDB } from "@/lib/platform-server";
import { deliverables } from "@/lib/template-config";
import { stages } from "@/lib/leads";

const reply = (data: unknown, status = 200) =>
  NextResponse.json(data, { status, headers: { "Cache-Control": "no-store" } });
export async function GET() {
  const { db, admin } = await identity();
  if (!admin) return reply({ error: "Admin sign-in required" }, 401);
  return reply({
    leads: (db.leads || []).map(({ tokenHash, ...l }) => {
      void tokenHash;
      return l;
    }),
    orders: db.orders.map((o) => ({
      id: o.id,
      slug: o.slug,
      status: o.status,
    })),
    now: new Date().toISOString(),
  });
}
export async function POST(req: NextRequest) {
  try {
    if (!isSameAppOrigin(req.headers))
      return reply({ error: "Invalid origin" }, 403);
    const b = await req.json();
    const jar = await cookies();
    const { db, admin } = identityFromCookies(jar);
    if (!admin) return reply({ error: "Admin sign-in required" }, 401);
    const l = db.leads?.find((l) => l.id === b.id);
    if (!l) return reply({ error: "Lead not found" }, 404);
    if (b.revision !== l.adminRevision)
      return reply(
        { error: "Another update was saved. Refresh and retry." },
        409,
      );
    const now = new Date().toISOString();
    const events: string[] = [];
    if (b.stage !== undefined) {
      if (!stages.includes(b.stage))
        return reply({ error: "Invalid stage" }, 400);
      const order = db.orders.find((o) => o.id === l.orderId);
      if (
        order &&
        ["Ready", "Delivered"].includes(b.stage) &&
        order.status !== "approved"
      )
        return reply(
          {
            error:
              "Verify payment and activate the invitation before marking it ready or delivered.",
          },
          400,
        );
      if (
        order &&
        ["Ready", "Delivered"].includes(b.stage) &&
        order.suiteVersion === 2 &&
        deliverables(order).some(
          (v) => order.reviewedDeliverables?.[v.key] !== order.contentRevision,
        )
      )
        return reply(
          {
            error:
              "Review every invitation version in the order delivery suite first.",
          },
          400,
        );
      if (l.stage !== b.stage) events.push("Stage changed to " + b.stage);
      l.stage = b.stage;
    }
    if (b.assignee !== undefined) {
      if (typeof b.assignee !== "string" || b.assignee.length > 100)
        return reply({ error: "Invalid owner" }, 400);
      l.assignee = b.assignee;
    }
    if (b.followUp !== undefined) {
      if (
        typeof b.followUp !== "string" ||
        (b.followUp && !Number.isFinite(Date.parse(b.followUp)))
      )
        return reply({ error: "Invalid follow-up" }, 400);
      l.followUp = b.followUp;
    }
    if (b.note !== undefined) {
      if (typeof b.note !== "string" || !b.note.trim() || b.note.length > 2000)
        return reply({ error: "Enter a note (max 2000 characters)" }, 400);
      l.notes.push({ at: now, text: b.note.trim() });
      events.push("Staff note added");
    }
    if (b.paymentVerified !== undefined) {
      if (typeof b.paymentVerified !== "boolean")
        return reply({ error: "Invalid payment status" }, 400);
      l.paymentVerified = b.paymentVerified;
      events.push(
        b.paymentVerified
          ? "Payment manually verified by admin"
          : "Payment verification cleared",
      );
    }
    if (b.orderId !== undefined) {
      const o = db.orders.find((o) => o.id === b.orderId);
      if (!o) return reply({ error: "Invitation not found" }, 400);
      if (db.leads?.some((x) => x.id !== l.id && x.orderId === o.id))
        return reply({ error: "Invitation already linked" }, 409);
      l.orderId = o.id;
      events.push("Invitation linked");
    }
    if (b.stage !== undefined) {
      const order = db.orders.find((o) => o.id === l.orderId);
      if (order) {
        const state = (
          {
            "In production": "in_progress",
            Ready: "ready",
            Delivered: "delivered",
          } as const
        )[b.stage as "In production" | "Ready" | "Delivered"];
        if (state) {
          if (
            ["ready", "delivered"].includes(state) &&
            order.status !== "approved"
          )
            return reply(
              {
                error:
                  "Activate the invitation before marking it ready or delivered.",
              },
              400,
            );
          if (
            ["ready", "delivered"].includes(state) &&
            order.suiteVersion === 2 &&
            deliverables(order).some(
              (v) =>
                order.reviewedDeliverables?.[v.key] !== order.contentRevision,
            )
          )
            return reply(
              {
                error:
                  "Review every invitation version in the order delivery suite first.",
              },
              400,
            );
          order.fulfillment = state;
          order.fulfilledAt =
            state === "delivered" ? order.fulfilledAt || now : undefined;
        }
      }
    }
    for (const text of events) l.timeline.push({ at: now, text });
    l.adminRevision++;
    writeDB(db);
    return reply({ ok: true });
  } catch {
    return reply({ error: "Unable to update lead" }, 400);
  }
}
