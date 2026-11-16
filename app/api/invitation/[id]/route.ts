import { NextRequest } from "next/server";
import { identity, resolveInvitation } from "@/lib/platform-server";
import {
  renderInvitation,
  scopedEvents,
  escapeHTML,
} from "@/lib/invitation-renderer";
import fs from "node:fs";
import path from "node:path";
const headers = {
  "Content-Type": "text/html; charset=utf-8",
  "Cache-Control": "private, no-store",
  "X-Content-Type-Options": "nosniff",
};
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { db, admin } = await identity();
  const { order: o, scope } = resolveInvitation(
    db.orders,
    id,
    req.nextUrl.searchParams.get("event") || undefined,
  );
  if (!o || (o.status !== "approved" && !admin))
    return new Response(
      "This invitation is private until payment is confirmed.",
      { status: 403, headers },
    );
  if (!scope && o.combinedPublic === false && !admin)
    return new Response("This invitation is unavailable.", {
      status: 404,
      headers,
    });
  const events = scopedEvents(o, scope);
  if (!events.length)
    return new Response("This event invitation is unavailable.", {
      status: 404,
      headers,
    });
  if (req.nextUrl.searchParams.get("format") === "meta")
    return Response.json(
      {
        title: o.details.groom + " & " + o.details.bride,
        events: events.map((e) => ({ id: e.id, name: e.name })),
        rsvpEnabled: o.details.rsvpEnabled !== false,
      },
      { headers: { "Cache-Control": "private, no-store" } },
    );
  if (req.nextUrl.searchParams.get("preview") === "1") {
    const cardUrl =
      "/api/invitation/" +
      encodeURIComponent(id) +
      (scope ? "?event=" + encodeURIComponent(scope) : "");
    let shell = fs.readFileSync(
      path.join(process.cwd(), "public/collection", o.template + ".html"),
      "utf8",
    );
    shell = shell
      .replace("<head>", '<head><base href="/collection/">')
      .replace(
        /(<iframe\b[^>]*\bsrc=")[^"]*(")/,
        (_, a, b) => a + escapeHTML(cardUrl) + b,
      )
      .replace(
        /<title>[\s\S]*?<\/title>/,
        () =>
          "<title>" +
          escapeHTML(o.details.groom + " & " + o.details.bride) +
          " — Invitation preview</title>",
      )
      .replace(
        "</head>",
        "<style>.demo-book,.ios-safari .buy{display:none!important}</style></head>",
      )
      .replace(
        "</body>",
        `<script>window.addEventListener('message',function(e){var card=document.getElementById('frame');if(e.origin===location.origin&&e.source===card.contentWindow&&e.data&&e.data.type==='open-rsvp')parent.postMessage({type:'open-rsvp'},location.origin)});</script></body>`,
      );
    return new Response(shell, { headers });
  }
  try {
    return new Response(renderInvitation(o, scope), { headers });
  } catch (error) {
    console.error("Invitation render failed", o.template, error);
    return new Response(
      "This invitation needs a studio review before it can be displayed.",
      { status: 500, headers },
    );
  }
}
