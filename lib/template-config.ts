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
export function invitationLink(
  order: { id: string; slug?: string },
  event?: string,
  preview = false,
) {
  const p = new URLSearchParams();
  if (event) p.set("event", event);
  if (preview) p.set("preview", "1");
  return (
    "/invite/" +
    encodeURIComponent(order.slug || order.id) +
    (p.size ? "?" + p : "")
  );
}
export function deliverables(order: {
  id: string;
  slug?: string;
  details: { events: { id?: string; name: string }[] };
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
