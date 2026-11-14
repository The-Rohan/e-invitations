import { prices } from "./platform";
export type OfferId = keyof typeof prices;
export const offers = [
  {
    id: "basic" as const,
    name: "One celebration",
    label: "For a Nikah, Mehndi or reception",
    price: prices.basic,
    events: 1,
    summary: "One beautifully presented event, on your own invitation website.",
    includes: [
      "Your chosen design, personalized by our studio",
      "1 event with its date, time and venue",
      "Custom invitation link, maps & calendar",
      "Guest replies, countdown & English / Urdu",
      "2 edit requests through WhatsApp",
    ],
    deliverables: "1 personalized website",
    extra: "Status images and videos are optional extras.",
  },
  {
    id: "premium" as const,
    name: "The wedding website",
    label: "For your wedding celebrations together",
    price: prices.premium,
    events: 3,
    summary:
      "Bring up to three celebrations together in one easy-to-share website.",
    includes: [
      "Everything in One celebration",
      "Up to 3 events, each with its own details",
      "Individual venue maps & calendar buttons",
      "One link for your whole wedding schedule",
      "2 edit requests through WhatsApp",
    ],
    deliverables: "1 website · up to 3 events",
    extra: "Status images and videos are optional extras.",
  },
  {
    id: "full" as const,
    name: "The complete suite",
    label: "For the website, the status & every event",
    price: prices.full,
    events: 3,
    summary:
      "Your wedding website, plus a coordinated set of invitations to share everywhere.",
    includes: [
      "The wedding website with up to 3 events",
      "2 WhatsApp status images",
      "1 WhatsApp status invitation video",
      "3 separate event invitation images",
      "Coordinated artwork & 2 edit requests",
    ],
    deliverables: "1 website + 6 ready-to-share files",
    extra: "All listed image and video deliverables are included.",
  },
];
export const offerById = (id: OfferId) => offers.find((o) => o.id === id)!;
export function offerInquiry(design: string | undefined, id: OfferId) {
  const o = offerById(id);
  return (
    "https://wa.me/923001063545?text=" +
    encodeURIComponent(
      `Assalam o Alaikum! I’d like ${design ? `the ${design} design with ` : ""}${o.name} package (Rs. ${o.price.toLocaleString("en-PK")}). ${o.deliverables}. Please help me with the details and next steps.`,
    )
  );
}
