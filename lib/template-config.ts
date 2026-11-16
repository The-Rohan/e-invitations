import manifest from "./template-manifest.json";
export type Copy = { en: string; ur: string };
export type TemplateOptions = {
  language?: "en" | "ur";
  music?: boolean;
  musicUrl?: string;
  accent?: string;
  textSize?: "standard" | "large";
  hiddenSections?: string[];
  copy?: Record<string, Copy>;
  images?: Record<string, string>;
};
export const templateManifest = manifest;
export type TemplateId = keyof typeof manifest;
export const gestures: Record<TemplateId, string> = {
  gulistan: "Embroidered garden · scratch three date discs",
  baradari: "Garden pavilion · drag or turn a brass key",
  shabistan: "Moonlit courtyard · light three lanterns",
  basant: "Rooftop celebration · release three kites",
  charkha: "Indigo courtyard · spin the wheel and wind three bobbins",
  khat: "Personal letter · hold to break the wax seal",
  riwaj: "Traditional invitation · hold the date seals",
  androon: "Old-city haveli · press and hold wax seals",
  phoolpatti: "Truck-art celebration · hold the bells to reveal the date",
  safar: "Railway journey · punch three tickets to reveal the date",
};
export function manifestFor(id: string) {
  return templateManifest[id as TemplateId] || templateManifest.gulistan;
}
export const mediaSlots = [
  ["hero", "Opening still"],
  ["venue", "Venue illustration"],
  ["dress", "Dress illustration"],
  ["stay", "Accommodation illustration"],
] as const;
export function eventId(e: { id?: string }, index: number) {
  return e.id || `event-${index + 1}`;
}
type LinkEvent = { id?: string; name: string; publicSlug?: string };
export function eventSlugs(events: LinkEvent[], reserved: string[] = []) {
  const used = new Set([
    ...reserved,
    ...events.flatMap((e) => (e.publicSlug ? [e.publicSlug] : [])),
  ]);
  return events.map((e) => {
    if (e.publicSlug) return e.publicSlug;
    const base =
      e.name
        .normalize("NFKD")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 60) || "celebration";
    let slug = base,
      suffix = 2;
    while (used.has(slug)) slug = base + "-" + suffix++;
    used.add(slug);
    return slug;
  });
}
export function invitationLink(
  order: {
    id: string;
    slug?: string;
    eventLinks?: Record<string, string>;
    details?: { events: LinkEvent[] };
  },
  event?: string,
  preview = false,
) {
  if (event && order.eventLinks?.[event])
    return (
      "/event/" +
      encodeURIComponent(order.eventLinks[event]) +
      (preview ? "?preview=1" : "")
    );
  const p = new URLSearchParams();
  const events = order.details?.events || [];
  const index = events.findIndex((e, i) => eventId(e, i) === event);
  const eventPath =
    index >= 0 ? "/" + encodeURIComponent(eventSlugs(events)[index]) : "";
  // Preserve callers with only an ID; old query links remain supported.
  if (event && index < 0) p.set("event", event);
  if (preview) p.set("preview", "1");
  return (
    "/invite/" +
    encodeURIComponent(order.slug || order.id) +
    eventPath +
    (p.size ? "?" + p : "")
  );
}
export function deliverables(order: {
  eventLinks?: Record<string, string>;
  id: string;
  slug?: string;
  details: { events: LinkEvent[] };
}) {
  return [
    {
      key: "combined",
      label: "Complete invitation",
      href: invitationLink(order),
    },
    ...order.details.events.map((e, i) => ({
      key: eventId(e, i),
      label: e.name + " only",
      href: invitationLink(order, eventId(e, i)),
    })),
  ];
}
