import { collection } from "./platform";
const extra: Record<
  string,
  {
    category: string;
    gesture: string;
    colors: string[];
    description: string;
    occasion: string;
  }
> = {
  gulistan: {
    category: "Romantic",
    gesture: "Scratch to reveal a beautiful beginning",
    colors: ["#78876d", "#eee5ce", "#bda06d"],
    description:
      "An embroidered garden. A wedding date waiting to be discovered. Soft sage and heirloom florals surround your story, like a love letter kept between the pages of a favourite book.",
    occasion: "Garden weddings & intimate Nikahs",
  },
  baradari: {
    category: "Heritage",
    gesture: "Unlock the garden pavilion",
    colors: ["#384d3b", "#e9d8b5", "#b78c51"],
    description:
      "Beyond the carved doors, a marble pavilion waits. Light falls across the garden, water catches the sky, and your celebration finds a home in the grace of our architectural heritage.",
    occasion: "Classic Baraats & elegant Nikahs",
  },
  shabistan: {
    category: "Royal",
    gesture: "Three lanterns. One unforgettable date.",
    colors: ["#182e42", "#af8b55", "#d7d5cf"],
    description:
      "A courtyard under the stars. Lanterns that come alive at your guests’ touch. Deep midnight blues and warm gold turn your invitation into a moment of quiet wonder.",
    occasion: "Evening weddings & moonlit receptions",
  },
  basant: {
    category: "Festive",
    gesture: "Send three kites into the sky",
    colors: ["#d7a347", "#a9c9ca", "#e9dfb2"],
    description:
      "The rooftops are dressed for spring. Kites dance above the old city, marigolds catch the afternoon light, and every little detail feels like the beginning of a celebration.",
    occasion: "Mehndi, Mayun & spring weddings",
  },
  charkha: {
    category: "Heritage",
    gesture: "Two lives, woven together",
    colors: ["#183348", "#d9cba9", "#b3894d"],
    description:
      "Indigo threads and handwoven linen. A spinning wheel brings your date to life, celebrating the patient, beautiful craft of making a life together.",
    occasion: "Intimate weddings & craft lovers",
  },
  khat: {
    category: "Romantic",
    gesture: "Break the seal. Begin the story.",
    colors: ["#ded1bc", "#aa7b79", "#655d51"],
    description:
      "A letter worth keeping. Warm paper, a delicate botanical sprig and a wax seal invite your guests to slow down, open something special, and feel every word.",
    occasion: "Daytime Nikahs & understated celebrations",
  },
  riwaj: {
    category: "Royal",
    gesture: "Unseal a beautiful new tradition",
    colors: ["#442134", "#b5995e", "#e2d5be"],
    description:
      "Plum velvet and heirloom gold. Three ceremonial seals honour the traditions that bring your families together, before opening the door to a tradition of your own.",
    occasion: "Traditional Baraats & grand receptions",
  },
  androon: {
    category: "Heritage",
    gesture: "An old-city doorway to forever",
    colors: ["#b47c59", "#e1cdac", "#5e6a4a"],
    description:
      "Lantern-lit lanes, terracotta walls and the warmth of a familiar courtyard. Your invitation carries the romance of the old city into a beautiful new chapter.",
    occasion: "Heritage weddings & old-city romantics",
  },
  phoolpatti: {
    category: "Festive",
    gesture: "Ring in the celebration",
    colors: ["#cb4f79", "#ddaf41", "#276c6a"],
    description:
      "Painted florals, ghungroo bells and the joyful colour of Pakistani truck art. An invitation for the couple whose celebration was never going to be quiet.",
    occasion: "Colourful Mehndis & joyful celebrations",
  },
  safar: {
    category: "Heritage",
    gesture: "Your ticket to a new beginning",
    colors: ["#2e5b56", "#dacdb5", "#923e39"],
    description:
      "A vintage railway ticket. A little nostalgia. A journey that starts with the people you love. Teal, parchment and old-world details make this a story worth travelling for.",
    occasion: "Travel lovers & nostalgic wedding stories",
  },
};
export const designs = collection.map((t) => ({
  ...t,
  ...extra[t.id],
  poster:
    `/collection/assets/${t.asset}/` +
    (t.id === "gulistan"
      ? "intro-poster.jpg"
      : t.id === "baradari"
        ? "gate-poster.webp"
        : "gate-poster.jpg"),
  film:
    `/collection/assets/${t.asset}/` +
    (t.id === "gulistan" ? "intro-opt.mp4" : "gate.mp4"),
  image: `/showcase/${t.id}.png`,
  detailsImage: `/showcase/${t.id}-details.png`,
}));
export type Design = (typeof designs)[number];
export const inquiry = (design?: string, packageName?: string) =>
  "https://wa.me/923001063545?text=" +
  encodeURIComponent(
    `Assalam o Alaikum! I’m planning our wedding and ${design ? `love the ${design} invitation` : "would love your help choosing an invitation"}.${packageName ? ` I’m interested in the ${packageName} package.` : ""} Could you guide me through the details and next steps?`,
  );
