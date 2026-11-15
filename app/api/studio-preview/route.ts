import { isSameAppOrigin } from "@/lib/request-origin";
import { NextRequest } from "next/server";
import { identity } from "@/lib/platform-server";
import { collection, type Order } from "@/lib/platform";
import { detailIssues, customizationIssues } from "@/lib/invitation-validation";
import { eventId } from "@/lib/template-config";
import { renderInvitation, escapeHTML } from "@/lib/invitation-renderer";
import fs from "node:fs";
import path from "node:path";
export async function POST(req: NextRequest) {
  if (!isSameAppOrigin(req.headers))
    return Response.json({ error: "Invalid origin" }, { status: 403 });
  const { admin } = await identity();
  if (!admin)
    return Response.json({ error: "Admin sign-in required" }, { status: 403 });
  try {
    const b = await req.json();
    if (!collection.some((t) => t.id === b.template))
      return Response.json(
        { error: "Choose a valid design." },
        { status: 400 },
      );
    const baseIssues = detailIssues(b.details, 3);
    if (baseIssues.length)
      return Response.json(
        { error: baseIssues.map((i) => i.message).join(" ") },
        { status: 400 },
      );
    const details = {
      ...b.details,
      events: b.details.events.map((e: { id?: string }, i: number) => ({
        ...e,
        id: eventId(e, i),
      })),
    };
    const issues = customizationIssues(details);
    if (issues.length)
      return Response.json(
        { error: issues.map((i) => i.message).join(" ") },
        { status: 400 },
      );
    const order = {
      id: "studio-preview",
      created: new Date().toISOString(),
      template: b.template,
      details,
    } as Order;
    const html = renderInvitation(order, b.event || undefined);
    let shell = fs.readFileSync(
      path.join(process.cwd(), "public/collection", b.template + ".html"),
      "utf8",
    );
    shell = shell
      .replace("<head>", '<head><base href="/collection/">')
      .replace(
        /(<iframe\b[^>]*\bsrc=")[^"]*"/,
        (_, a) => a + 'about:blank" srcdoc="' + escapeHTML(html) + '"',
      )
      .replace(
        "</head>",
        "<style>.demo-book,.ios-safari .buy{display:none!important}</style></head>",
      );
    shell = shell.replace(
      "</body>",
      `<script>window.addEventListener('message',function(e){var frame=document.querySelector('iframe');if(frame&&e.source===frame.contentWindow&&e.data&&e.data.type==='open-rsvp')parent.postMessage({type:'studio-preview-rsvp'},new URL(document.baseURI).origin)});</script></body>`,
    );
    return new Response(shell, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return Response.json(
      { error: "Complete the invitation details before previewing." },
      { status: 400 },
    );
  }
}
