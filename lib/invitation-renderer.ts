import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { type Order, type EventInfo } from "./platform";
import { eventId, manifestFor } from "./template-config";
export const escapeHTML = (s: string) =>
  s.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ]!,
  );
const json = (v: unknown) => JSON.stringify(v).replace(/</g, "\\u003c");
const stamp = (d: Date) =>
  d.toISOString().replace(/[-:]/g, "").slice(0, 15) + "Z";
const locale = (d: Date, lang: string, options: Intl.DateTimeFormatOptions) =>
  d.toLocaleString(lang, { timeZone: "Asia/Karachi", ...options });
export function scopedEvents(o: Order, scope?: string) {
  const events = o.details.events.map((e, i) => ({ ...e, id: eventId(e, i) }));
  return scope ? events.filter((e) => e.id === scope) : events;
}
function eventData(e: EventInfo, index: number, o: Order) {
  const start = new Date(e.date + "T" + e.time + ":00+05:00");
  const end = e.endTime
    ? new Date((e.endDate || e.date) + "T" + e.endTime + ":00+05:00")
    : new Date(start.getTime() + 3 * 3600000);
  const text = (en: string, ur?: string) => ({
    en: escapeHTML(en),
    ur: escapeHTML(ur || en),
  });
  const art =
    e.art ||
    (/mehndi|mayun/i.test(e.name)
      ? "mehndi"
      : /walima/i.test(e.name)
        ? "walima"
        : /bara[at]|barat|nikah/i.test(e.name)
          ? "baraat"
          : (["mehndi", "baraat", "walima"] as const)[index % 3]);
  const motifs =
    o.template === "baradari"
      ? ["fountain", "jali", "pomegranate"]
      : ["lantern", "arch", "cypress"];
  const motif =
    e.motif && motifs.includes(e.motif)
      ? e.motif
      : motifs[["mehndi", "baraat", "walima"].indexOf(art)];
  const blurb = text(
    e.description || o.details.family || "",
    e.descriptionUr || o.details.familyUr,
  );
  for (const item of e.schedule || []) {
    blurb.en += "<br>" + escapeHTML(item.time + " · " + item.title);
    blurb.ur +=
      "<br>" + escapeHTML(item.time + " · " + (item.titleUr || item.title));
  }
  return {
    key: e.id,
    art,
    motif,
    name: text(e.name, e.nameUr),
    kind: text(e.name, e.nameUr),
    day: e.date.slice(8),
    mon: {
      en: locale(start, "en", { month: "long" }),
      ur: locale(start, "ur", { month: "long" }),
    },
    yr: e.date.slice(0, 4),
    wd: {
      en: locale(start, "en", { weekday: "long" }),
      ur: locale(start, "ur", { weekday: "long" }),
    },
    hr: {
      en: locale(start, "en", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
      ur: locale(start, "ur", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
    },
    blurb,
    venue: text(e.venue, e.venueUr),
    addr: text(e.address || "", e.addressUr),
    q: encodeURIComponent([e.venue, e.address].filter(Boolean).join(" ")),
    mapUrl:
      e.mapUrl ||
      "https://www.google.com/maps/search/?api=1&query=" +
        encodeURIComponent([e.venue, e.address].filter(Boolean).join(" ")),
    pardah: !!e.separateSeating,
    wear: text(e.dressCode || "", e.dressCodeUr),
    sw: e.colors || ["#d0aa71", "#809575", "#f5eedf"],
    schedule: e.schedule || [],
    ics: {
      uid: o.id + "-" + e.id + "@wedinvite.pk",
      t: e.name + " — " + o.details.groom + " & " + o.details.bride,
      s: stamp(start),
      e: stamp(end),
      loc: [e.venue, e.address].filter(Boolean).join(", "),
      description: e.description || "",
      updated: stamp(new Date(o.created)),
    },
  };
}
export function renderInvitation(o: Order, scope?: string) {
  const events = scopedEvents(o, scope);
  if (!events.length) throw Error("Event not found");
  const first =
    events.find((e) => e.id === o.details.primaryEventId) || events[0];
  const d = o.details,
    opts = d.templateOptions?.[o.template] || {};
  const chosen = new Date(first.date + "T" + first.time + ":00+05:00");
  const data = events.map((e, i) => eventData(e, i, o));
  const primary = data.find((e) => e.key === first.id)!;
  const dateEn = locale(chosen, "en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    dateUr = locale(chosen, "ur-PK", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  const place = [first.venue, first.address].filter(Boolean).join(" · ");
  const reveal = [
    { en: first.date.slice(8), ur: locale(chosen, "ur", { day: "2-digit" }) },
    {
      en: locale(chosen, "en", { month: "short" }),
      ur: locale(chosen, "ur", { month: "short" }),
    },
    {
      en: first.date.slice(0, 4),
      ur: locale(chosen, "ur", { year: "numeric" }),
    },
  ];
  const nameMap: Record<string, string> = {
    Bilal: d.groom,
    Mahrukh: d.bride,
    بلال: d.groomUr || d.groom,
    "ماہ رخ": d.brideUr || d.bride,
  };
  const jsText = (v: string) => json(v).slice(1, -1).replace(/'/g, "\\'");
  const names = (s: string, esc: (v: string) => string) =>
    s.replace(/Bilal|Mahrukh|بلال|ماہ رخ/g, (n) => esc(nameMap[n]));
  const patch = (source: string) => {
    let s = names(source, jsText)
      .replace(
        /var EVENTS\s*=\s*\[[\s\S]*?\n\s*\];/,
        () => "var EVENTS=" + json(data) + ";",
      )
      .replace(
        /var REVEAL\s*=\s*\[[^;]+;/g,
        () => "var REVEAL=" + json(reveal) + ";",
      )
      .replace(
        /2027-06-12T17:00:00\+05:00/g,
        first.date + "T" + first.time + ":00+05:00",
      )
      .replace(/var d=EVENTS\[1\];/g, () => "var d=" + json(primary) + ";")
      .replace(/EVENTS\[([12])\]/g, "(EVENTS[$1]||EVENTS[0])")
      .replace(
        /num\('12'\)\+' · '\+num\('06'\)\+' · '\+num\('2027'\)/g,
        () =>
          `num(${json(first.date.slice(8))})+' · '+num(${json(first.date.slice(5, 7))})+' · '+num(${json(first.date.slice(0, 4))})`,
      )
      .replace(
        /dateSub.textContent=[^;]+;/g,
        () => "dateSub.textContent=" + json(place) + ";",
      )
      .replace(
        /function gcal\(v\)\s*\{[\s\S]*?\}/g,
        "function gcal(v){ return window.WI.gcal(v); }",
      )
      .replace(
        /function icsHref\(v\)\s*\{[\s\S]*?\}/g,
        "function icsHref(v){ return window.WI.icsHref(v); }",
      )
      .replace(
        /https:\/\/www.google.com\/maps\/search\/\?api=1&query='\+v.q/g,
        "'+window.WI.esc(v.mapUrl)",
      )
      .replace(/'ev ev-'\+v.key/g, "'ev ev-'+v.art")
      .replace(/class="mk '\+v.key/g, "class=\"mk '+v.art")
      .replace(
        /'[^']+-lang'/g,
        "'" + o.id + "-" + (scope || "combined") + "-lang'",
      )
      .replace(
        /function setLang\(l\)\s*\{/,
        "function setLang(l){document.documentElement.lang=l;",
      )
      .replace(
        /(localStorage.getItem\('[^']+-lang'\)\|\|)'en'/g,
        "$1" + json(opts.language || "en"),
      )
      .replace(
        /var musicWanted=true;/g,
        "var musicWanted=" + json(opts.music !== false) + ";",
      );
    // Keep all visible name characters as text, including Urdu ligatures, emoji, & and <.
    if (s.includes("function writeNames()")) {
      const a = s.indexOf("  function writeNames()"),
        b = s.indexOf("\n  function renderAll()", a);
      if (a >= 0 && b > a)
        s =
          s.slice(0, a) +
          "  function writeNames(){window.WI.writeNames(lang);}\n" +
          s.slice(b);
    }
    // Optional sections remain in the DOM for their original scripts, but never appear in navigation.
    s = s.replace(
      /SECTIONS.forEach\(function\(s,i\)\{/,
      "SECTIONS.filter(function(s){var el=document.getElementById(s.id);return el&&!el.hidden;}).forEach(function(s,i){",
    );
    return s;
  };
  let html = fs.readFileSync(
    path.join(process.cwd(), "public/collection/card-" + o.template + ".html"),
    "utf8",
  );
  const manifest = manifestFor(o.template);
  if (createHash("sha256").update(html).digest("hex") !== manifest.sourceHash)
    throw Error(
      "Original template changed; regenerate and verify its content inventory.",
    );
  const scripts: string[] = [];
  html = html.replace(
    /<script\b([^>]*)>([\s\S]*?)<\/script>/g,
    (whole, attrs, body) => {
      const src = /src="assets\/([^"?]+\.js)(?:[^" ]*)"/.exec(attrs);
      if (src && ["card-boot.js", "card-celebration.js"].includes(src[1]))
        return whole;
      let source = body;
      if (src) {
        const filename = path.join(
          process.cwd(),
          "public/collection/assets",
          src[1],
        );
        if (!fs.existsSync(filename)) return whole;
        source = fs.readFileSync(filename, "utf8");
      }
      scripts.push(
        "<script>" +
          patch(source).replace(/<\/script/gi, "<\\/script") +
          "</script>",
      );
      return "<!--wi-script-" + (scripts.length - 1) + "-->";
    },
  );
  let ci = 0,
    si = 0;
  html = html.replace(
    /<([a-z][\w:-]*)\b((?:[^"'<>]|"[^"]*"|'[^']*')*)>/gi,
    (whole, tag, attrs) => {
      let extra = "";
      if (/\bdata-ur=/.test(attrs))
        extra += ' data-wi-copy="copy-' + ci++ + '"';
      if (tag.toLowerCase() === "section")
        extra += ' data-wi-section="section-' + si++ + '"';
      return "<" + tag + attrs + extra + ">";
    },
  );
  if (ci !== manifest.fields.length || si !== manifest.sections.length)
    throw Error(
      "Template inventory changed; regenerate the manifest before delivering.",
    );
  html = names(html, escapeHTML).replace(
    /<title>[\s\S]*?<\/title>/,
    "<title>" +
      escapeHTML(
        d.groom + " & " + d.bride + (scope ? " · " + first.name : ""),
      ) +
      "</title>",
  );
  const config = {
    events: data,
    primary,
    scope: scope || "",
    dateEn,
    dateUr,
    place,
    placeUr: [first.venueUr || first.venue, first.addressUr || first.address]
      .filter(Boolean)
      .join(" · "),
    template: o.template,
    options: opts,
    sections: manifest.sections,
    fields: manifest.fields
      .filter((f) => f.managed)
      .map((f) => ({
        key: f.key,
        group: f.group,
        className: f.className,
        en: f.en,
        ur: f.ur,
      })),
    groom: d.groom,
    bride: d.bride,
    groomUr: d.groomUr || d.groom,
    brideUr: d.brideUr || d.bride,
    family: d.family || "Together with their families",
    familyUr: d.familyUr || d.family || "اہلِ خانہ کی جانب سے",
    welcome: d.welcome || "",
    welcomeUr: d.welcomeUr || d.welcome || "",
    travel: d.travel || "",
    travelUr: d.travelUr || d.travel || "",
    accommodation: d.accommodation || "",
    accommodationUr: d.accommodationUr || d.accommodation || "",
    accommodationName: d.accommodationName || "",
    accommodationAddress: d.accommodationAddress || "",
    accommodationMap: d.accommodationMap || "",
    rsvpEnabled: d.rsvpEnabled !== false,
    rsvpDeadline: d.rsvpDeadline || "",
  };
  const setup =
    "<script>window.WI=" +
    json(config) +
    '</script><script src="/collection/assets/studio-personalize.js"></script>';
  html = html
    .replace("<!--wi-script-0-->", setup + "<!--wi-script-0-->")
    .replace(/<!--wi-script-(\d+)-->/g, (_, i) => scripts[Number(i)]);
  html = html
    .replace("<head>", '<head><base href="/collection/">')
    .replace(
      "</head>",
      `<link rel="stylesheet" href="/collection/assets/studio-personalize.css"></head>`,
    );
  return html;
}
