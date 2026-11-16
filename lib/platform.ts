export const collection = [
  [
    "gulistan",
    "Gulistan",
    "A love letter from the garden",
    "Sage & rose",
    "bl",
  ],
  [
    "baradari",
    "Baradari",
    "Where forever finds its home",
    "Marble & forest",
    "baradari",
  ],
  [
    "shabistan",
    "Shabistan",
    "Written in the stars",
    "Midnight & gold",
    "shabistan",
  ],
  ["basant", "Basant", "Let your love take flight", "Marigold & sky", "basant"],
  [
    "charkha",
    "Charkha",
    "Two lives, beautifully woven",
    "Indigo & linen",
    "charkha",
  ],
  ["khat", "Khat", "Some stories deserve a letter", "Parchment & ink", "khat"],
  [
    "riwaj",
    "Riwaj",
    "A beautiful new tradition",
    "Plum & antique gold",
    "riwaj",
  ],
  [
    "androon",
    "Androon",
    "Old streets. New beginnings.",
    "Terracotta & dusk",
    "androon",
  ],
  [
    "phoolpatti",
    "Phool Patti",
    "A little colour. A lot of love.",
    "Truck art & florals",
    "phoolpatti",
  ],
  [
    "safar",
    "Safar",
    "The loveliest journey begins",
    "Teal & parchment",
    "safar",
  ],
].map(([id, name, line, palette, asset]) => ({
  id,
  name,
  line,
  palette,
  asset,
}));
export const prices = { basic: 4999, premium: 7999, full: 11999 };
export function normalizeWhatsApp(value: string) {
  const digits = value.trim().replace(/\D/g, "").replace(/^00/, "");
  if (/^0\d{10}$/.test(digits)) return "92" + digits.slice(1);
  if (/^3\d{9}$/.test(digits)) return "92" + digits;
  return digits;
}
export function isCalendarDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(value + "T12:00:00Z");
  return (
    Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value
  );
}
export type EventInfo = {
  id?: string;
  publicSlug?: string;
  nameUr?: string;
  venueUr?: string;
  addressUr?: string;
  endDate?: string;
  endTime?: string;
  mapUrl?: string;
  description?: string;
  descriptionUr?: string;
  dressCode?: string;
  dressCodeUr?: string;
  separateSeating?: boolean;
  art?: "mehndi" | "baraat" | "walima";
  motif?: string;
  colors?: string[];
  schedule?: { time: string; title: string; titleUr?: string }[];
  name: string;
  date: string;
  time: string;
  venue: string;
  address: string;
};
export type Details = {
  primaryEventId?: string;
  familyUr?: string;
  welcome?: string;
  welcomeUr?: string;
  rsvpDeadline?: string;
  rsvpEnabled?: boolean;
  travel?: string;
  travelUr?: string;
  accommodation?: string;
  accommodationUr?: string;
  accommodationName?: string;
  accommodationAddress?: string;
  accommodationMap?: string;
  templateOptions?: Record<string, import("./template-config").TemplateOptions>;
  groom: string;
  bride: string;
  groomUr: string;
  brideUr: string;
  family: string;
  phone: string;
  events: EventInfo[];
};
export type Order = {
  retiredEventSlugs?: string[];
  suiteVersion?: number;
  contentRevision?: number;
  reviewedDeliverables?: Record<string, number>;
  fulfillment?: "not_started" | "in_progress" | "ready" | "delivered";
  fulfilledAt?: string;
  leadId?: string;
  id: string;
  slug?: string;
  userId: string;
  template: string;
  tier: keyof typeof prices;
  addons: string[];
  amount: number;
  details: Details;
  status: "draft" | "pending" | "approved" | "changes";
  transaction: string;
  created: string;
  note: string;
};
