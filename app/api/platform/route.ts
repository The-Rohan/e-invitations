import { isSameAppOrigin } from "@/lib/request-origin";
import { detailIssues, customizationIssues } from "@/lib/invitation-validation";
import { eventId, deliverables } from "@/lib/template-config";
import { offerById } from "@/lib/offers";
import { NextRequest, NextResponse } from "next/server";
import {
  identity,
  identityFromCookies,
  writeDB,
  token,
  hash,
  equal,
} from "@/lib/platform-server";
import { cookies } from "next/headers";
import { collection, prices, type Details } from "@/lib/platform";
const loginAttempts = new Map<string, { count: number; until: number }>();
export async function GET() {
  const { db, user, admin } = await identity();
  return NextResponse.json({
    user: user ? { email: user.email } : null,
    admin,
    orders: admin
      ? db.orders.map((o) => ({
          ...o,
          leadId: db.leads?.find((l) => l.orderId === o.id)?.id,
        }))
      : user
        ? db.orders.filter((o) => o.userId === (user?.id || "studio"))
        : [],
    rsvps: db.rsvps.filter(
      (r) =>
        admin ||
        db.orders.some((o) => o.id === r.orderId && o.userId === user?.id),
    ),
  });
}
export async function POST(req: NextRequest) {
  if (!isSameAppOrigin(req.headers))
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  try {
    const b = await req.json();
    const jar = await cookies();
    // Keep the read, authorization and write synchronous for this single-instance store.
    const { db, user, admin } = identityFromCookies(jar);
    const fail = (error: string, status = 400) =>
      NextResponse.json({ error }, { status });
    if (b.action === "logout") {
      const revoked = new Set(
        ["wi-session", "wi-admin"].map((name) =>
          hash(jar.get(name)?.value || ""),
        ),
      );
      db.sessions = db.sessions.filter(
        (s) => !revoked.has(s.token) && s.expires > Date.now(),
      );
      writeDB(db);
      jar.delete("wi-session");
      jar.delete("wi-admin");
      return NextResponse.json({ ok: true });
    }
    if (b.action === "admin-login") {
      if (!process.env.WEDINVITE_ADMIN_KEY)
        return fail(
          "Admin access must be configured with WEDINVITE_ADMIN_KEY on the server.",
          503,
        );
      const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "local";
      const previous = loginAttempts.get(ip);
      const attempts =
        previous && previous.until > Date.now()
          ? previous
          : { count: 0, until: Date.now() + 900000 };
      if (attempts.count >= 10)
        return fail("Too many attempts. Please try again in 15 minutes.", 429);
      attempts.count++;
      loginAttempts.set(ip, attempts);
      if (loginAttempts.size > 10000) loginAttempts.clear();
      if (
        (process.env.WEDINVITE_ADMIN_USERNAME &&
          !equal(
            String(b.username || ""),
            process.env.WEDINVITE_ADMIN_USERNAME,
          )) ||
        !equal(
          String(b.password || b.key || ""),
          process.env.WEDINVITE_ADMIN_KEY,
        )
      )
        return fail("Username or password is incorrect", 401);
      loginAttempts.delete(ip);
      const adminToken = token();
      db.sessions = db.sessions.filter((s) => s.expires > Date.now());
      db.sessions.push({
        token: hash(adminToken),
        userId: "admin",
        expires: Date.now() + 28800000,
      });
      writeDB(db);
      jar.set("wi-admin", adminToken, {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
        maxAge: 28800,
        path: "/",
      });
      return NextResponse.json({ ok: true });
    }
    if (b.action === "register" || b.action === "login")
      return fail(
        "Customer accounts are not used. Please contact the studio on WhatsApp.",
        403,
      );
    if (b.action === "rsvp") {
      const o = db.orders.find(
        (o) => (o.id === b.id || o.slug === b.id) && o.status === "approved",
      );
      if (!o) return fail("Invitation unavailable", 404);
      if (
        typeof b.name !== "string" ||
        !b.name.trim() ||
        typeof b.attending !== "boolean" ||
        !Number.isInteger(b.count) ||
        b.count < 1 ||
        b.count > 20
      )
        return fail("Enter your name and 1–20 guests.");
      if (o.details.rsvpEnabled === false)
        return fail("Guest replies are closed for this invitation.", 400);
      const allowed = o.details.events
        .map((e, i) => ({ id: eventId(e, i), name: e.name }))
        .filter((e) => !b.eventId || e.id === b.eventId);
      if (!allowed.length) return fail("Event not found", 404);
      if (
        b.eventIds !== undefined &&
        (!Array.isArray(b.eventIds) ||
          b.eventIds.some(
            (id: unknown) =>
              typeof id !== "string" || !allowed.some((e) => e.id === id),
          ))
      )
        return fail("Choose events from this invitation.");
      const responses = allowed.map((e) => ({
        eventId: e.id,
        eventName: e.name,
        attending:
          b.attending &&
          (b.eventIds === undefined || b.eventIds.includes(e.id)),
        count:
          b.attending && (b.eventIds === undefined || b.eventIds.includes(e.id))
            ? b.count
            : 0,
      }));
      const requestId =
        typeof b.requestId === "string" &&
        /^[a-zA-Z0-9-]{8,80}$/.test(b.requestId)
          ? b.requestId
          : undefined;
      if (
        requestId &&
        db.rsvps.some((r) => r.orderId === o.id && r.requestId === requestId)
      )
        return NextResponse.json({ ok: true });
      db.rsvps.push({
        orderId: o.id,
        name: b.name.trim().slice(0, 100),
        count: b.count,
        attending: !!b.attending,
        requestId,
        eventId: b.eventId || undefined,
        responses,
      });
      writeDB(db);
      return NextResponse.json({ ok: true });
    }
    if (b.action === "approve" || b.action === "changes") {
      if (!admin) return fail("Admin sign-in required", 403);
      const o = db.orders.find((o) => o.id === b.id);
      if (!o) return fail("Order not found", 404);
      if (!["draft", "pending", "changes"].includes(o.status))
        return fail("Only submitted orders can be reviewed");
      o.status = b.action === "approve" ? "approved" : "changes";
      o.note = String(b.note || "").slice(0, 1000);
      const linkedLead = db.leads?.find((l) => l.orderId === o.id);
      if (linkedLead && b.action === "approve") {
        linkedLead.paymentVerified = true;
        linkedLead.adminRevision++;
        linkedLead.timeline.push({
          at: new Date().toISOString(),
          text: "Payment verified and invitation activated",
        });
      }
      writeDB(db);
      return NextResponse.json({ ok: true });
    }
    if (!admin) return fail("Admin sign-in required.", 403);
    if (b.action === "review-deliverable") {
      const o = db.orders.find((o) => o.id === b.id);
      if (!o) return fail("Order not found", 404);
      if (b.revision !== (o.contentRevision || 0))
        return fail(
          "The invitation changed. Reload and review the latest version.",
          409,
        );
      if (!deliverables(o).some((v) => v.key === b.version))
        return fail("Unknown invitation version");
      o.reviewedDeliverables = {
        ...o.reviewedDeliverables,
        [b.version]: o.contentRevision || 0,
      };
      writeDB(db);
      return NextResponse.json({ ok: true });
    }
    if (b.action === "fulfillment") {
      const o = db.orders.find((o) => o.id === b.id);
      if (!o) return fail("Order not found", 404);
      if (
        !["not_started", "in_progress", "ready", "delivered"].includes(
          b.fulfillment,
        )
      )
        return fail("Invalid fulfillment status");
      if (
        ["ready", "delivered"].includes(b.fulfillment) &&
        o.status !== "approved"
      )
        return fail(
          "Verify payment and activate the invitation before marking it ready or delivered.",
        );
      if (
        ["ready", "delivered"].includes(b.fulfillment) &&
        o.suiteVersion === 2 &&
        deliverables(o).some(
          (v) => o.reviewedDeliverables?.[v.key] !== o.contentRevision,
        )
      )
        return fail(
          "Review the current complete invitation and every standalone event before marking delivery ready.",
        );
      const changed = o.fulfillment !== b.fulfillment;
      o.fulfillment = b.fulfillment;
      o.fulfilledAt =
        b.fulfillment === "delivered"
          ? o.fulfilledAt || new Date().toISOString()
          : undefined;
      const lead = db.leads?.find((l) => l.orderId === o.id);
      if (lead && changed) {
        lead.stage = (
          {
            not_started: "Contacted",
            in_progress: "In production",
            ready: "Ready",
            delivered: "Delivered",
          } as const
        )[o.fulfillment!];
        lead.adminRevision++;
        lead.timeline.push({
          at: new Date().toISOString(),
          text: "Invitation fulfillment: " + b.fulfillment,
        });
      }
      writeDB(db);
      return NextResponse.json({ ok: true });
    }
    if (b.action === "save") {
      const lead = b.leadId
        ? db.leads?.find((l) => l.id === b.leadId)
        : undefined;
      if (b.leadId && !lead) return fail("Lead not found", 404);
      if (lead?.orderId && lead.orderId !== b.id)
        return fail(
          "This lead already has an invitation. Open it from the CRM.",
          409,
        );
      if (
        !collection.some((t) => t.id === b.template) ||
        !Object.hasOwn(prices, b.tier)
      )
        return fail("Choose a valid template and package");
      const d = b.details as Details;
      const issues = detailIssues(d, offerById(b.tier).events);
      if (issues.length)
        return NextResponse.json(
          { error: issues.map((i) => i.message).join(" "), fields: issues },
          { status: 400 },
        );
      d.events = d.events.map((e, i) => ({ ...e, id: eventId(e, i) }));
      const customIssues = customizationIssues(d);
      if (customIssues.length)
        return NextResponse.json(
          {
            error: customIssues.map((i) => i.message).join(" "),
            fields: customIssues,
          },
          { status: 400 },
        );
      let o = db.orders.find((o) => o.id === b.id);
      if (
        o &&
        b.contentRevision !== undefined &&
        b.contentRevision !== (o.contentRevision || 0)
      )
        return fail(
          "Someone saved a newer invitation. Reload before applying your changes.",
          409,
        );
      if (b.id && !o)
        return fail(
          "Order not found. Return to the studio desk before editing.",
          404,
        );
      if (o && !admin && o.status !== "draft" && o.status !== "changes")
        return fail(
          "Submitted invitations are locked. Request corrections through support.",
        );
      const addons = [
        ...new Set<string>(
          (Array.isArray(b.addons) ? b.addons : []).filter((x: string) =>
            ["image", "video", "events"].includes(x),
          ),
        ),
      ];
      const tier = b.tier as keyof typeof prices;
      if (d.events.length > offerById(tier).events)
        return fail(
          "One celebration includes 1 event. Remove extra events or select The wedding website.",
        );
      const amount =
        prices[tier] +
        (tier === "full"
          ? 0
          : [...new Set<string>(addons)].reduce(
              (n, x) => n + ({ image: 300, video: 500, events: 3000 }[x] || 0),
              0,
            ));
      const slug = String(b.slug || "");
      if (!/^[a-z0-9-]{3,80}$/.test(slug))
        return fail(
          "Use 3–80 lowercase letters, numbers or hyphens for the URL.",
        );
      if (
        db.orders.some(
          (x) => (x.slug === slug || x.id === slug) && x.id !== o?.id,
        )
      )
        return fail("This invitation URL is already taken.");
      if (!o) {
        o = {
          slug,
          id: token(),
          userId: user?.id || "studio",
          template: b.template,
          tier,
          addons,
          amount,
          details: d,
          status: lead?.paymentClaimed ? "pending" : "draft",
          transaction: lead?.transaction || "",
          fulfillment: lead ? "in_progress" : "not_started",
          created: new Date().toISOString(),
          note: "",
        };
        db.orders.push(o);
      } else
        Object.assign(o, {
          slug,
          template: b.template,
          tier,
          addons,
          amount,
          details: d,
        });
      o.contentRevision = (o.contentRevision || 0) + 1;
      if (b.suiteVersion === 2) o.suiteVersion = 2;
      if (o.suiteVersion === 2) {
        o.reviewedDeliverables = {};
        if (o.fulfillment === "ready" || o.fulfillment === "delivered") {
          o.fulfillment = "in_progress";
          delete o.fulfilledAt;
          const linked = db.leads?.find((l) => l.orderId === o.id);
          if (linked) {
            linked.stage = "In production";
            linked.adminRevision++;
            linked.timeline.push({
              at: new Date().toISOString(),
              text: "Invitation edited; delivery review reset",
            });
          }
        }
      }
      if (lead) {
        lead.orderId = o.id;
        lead.stage = "In production";
        lead.adminRevision++;
        lead.timeline.push({
          at: new Date().toISOString(),
          text: "Invitation created and linked",
        });
      }
      writeDB(db);
      return NextResponse.json({ ok: true, id: o.id });
    }
    if (b.action === "submit") {
      const o = db.orders.find(
        (o) => o.id === b.id && o.userId === (user?.id || "studio"),
      );
      if (!o || !["draft", "changes"].includes(o.status))
        return fail("Order cannot be submitted");
      if (!String(b.transaction || "").trim())
        return fail("Please enter your payment transaction reference.");
      o.transaction = String(b.transaction).slice(0, 150);
      o.status = "pending";
      writeDB(db);
      return NextResponse.json({ ok: true });
    }
    return fail("Unknown action");
  } catch {
    return NextResponse.json(
      { error: "Unable to process this request." },
      { status: 400 },
    );
  }
}
