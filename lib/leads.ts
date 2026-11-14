export const steps = [
  "Your details",
  "Design & package",
  "Payment",
  "WhatsApp handoff",
];
export const stages = [
  "New",
  "Contacted",
  "Awaiting payment",
  "In production",
  "Ready",
  "Delivered",
  "Lost",
] as const;
export type Stage = (typeof stages)[number];
export type LeadInput = {
  name: string;
  phone: string;
  email: string;
  template: string;
  tier: "basic" | "premium" | "full";
  addons: string[];
  paymentMethod: string;
  paymentClaimed: boolean;
  transaction: string;
  step: number;
  whatsappOpened: boolean;
};
export type Lead = LeadInput & {
  id: string;
  tokenHash: string;
  revision: number;
  adminRevision: number;
  created: string;
  updated: string;
  lastSeen: string;
  maxStep: number;
  stage: Stage;
  assignee: string;
  followUp: string;
  paymentVerified: boolean;
  orderId?: string;
  notes: { text: string; at: string }[];
  timeline: { text: string; at: string }[];
};
export type PublicLead = Omit<Lead, "tokenHash">;
export const emptyLead: LeadInput = {
  name: "",
  phone: "",
  email: "",
  template: "gulistan",
  tier: "premium",
  addons: [],
  paymentMethod: "Easypaisa",
  paymentClaimed: false,
  transaction: "",
  step: 0,
  whatsappOpened: false,
};
export const inactivityMinutes = 15;
export function total(tier: LeadInput["tier"], addons: string[]) {
  return (
    { basic: 4999, premium: 7999, full: 11999 }[tier] +
    (tier === "full"
      ? 0
      : [...new Set(addons)].reduce(
          (n, a) => n + ({ image: 300, video: 500, events: 3000 }[a] || 0),
          0,
        ))
  );
}
