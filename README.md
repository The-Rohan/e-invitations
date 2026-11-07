# 📜 Pakistani E-Invitations Market: Competitor Intelligence & Source Code Archive

A central repository compiling real-world source code, interactive web templates, design assets, and business intelligence from the top 7 commercial digital wedding invitation competitors in Pakistan, alongside the **WedInvite.pk (`dawatna`)** Next.js platform engine.

This repository is optimized for AI agents and engineering teams to analyze competitor mechanics, reverse-engineer interactive ceremony rituals, audit pricing strategies, and synthesize best-in-class digital invitation products.

---

## 🗂️ Repository Structure

### 1. Competitor Websites & Codebases

| Competitor | Business Model | Price Range (PKR) | Primary Fulfillment | Tech Stack / Architecture |
|---|---|---|---|---|
| **[`ceremoniainvites.com`](./ceremoniainvites.com/)** | Automated SaaS + VIP Concierge | Rs. 5,000 – Rs. 15,000 | Instant preview / 1 hr live | PHP / HTML5 / Video Hand-offs |
| **[`dawatlink.com`](./dawatlink.com/)** | Micro-transaction Budget SaaS | Rs. 100 – Rs. 500 | Instant automated (browser) | Static HTML / JavaScript |
| **[`dawatnama.app`](./dawatnama.app/)** | SaaS (Tayyab Tech, Karachi) | Rs. 0 – Rs. 5,999 | Instant / 15-min onboard | Next.js / Tailwind / SPA |
| **[`dawatnama.store`](./dawatnama.store/)** | Studio Boutique (Karachi) | Rs. 3,999 – Rs. 25,000+ | Live demo / Same day | Custom Web / Video Mockups |
| **[`niru.pk`](./niru.pk/)** | Luxury Design Studio (Lahore) | Rs. 5,900 – Rs. 19,490+ | 24–48 hrs draft / 50% split | Custom CSS / Canvas / Audio BGM |
| **[`osinvites.com`](./osinvites.com/)** | WhatsApp Direct Agency | Rs. 1,000 – Rs. 5,999 | Manual WhatsApp delivery | Static Multi-event HTML Pages |
| **[`sehra.pk`](./sehra.pk/)** | Studio Platform with 3-Day Trial | Rs. 2,000 – Rs. 5,500 | 3-Day Free Trial / Instant | Interactive JS Card Engine |
| **[`wedinvite-mehndi`](./wedinvite-mehndi/)** | Interactive Single-Event Card | Standalone Demo | Direct Web Card | Fluid Cloth & Diya Physics |

---

### 2. Platform Engine: `dawatna/` (WedInvite.pk Next.js App)

Located in [`dawatna/`](./dawatna/), this is the full Next.js 16 application incorporating:
* **45 Master Invitation Templates**: Standalone 60fps HTML master templates across Crown Jewel 4K, Niru Tactile, and Ceremonia Film series.
* **4-Step Customization Studio**: Real-time typography, Urdu nastaliq, palette, and audio preview at `/studio`.
* **Guest Management & RSVP**: Headcount allocation, private guest URLs (`/g/[token]`), Raast digital salami logging, and couple dashboard (`/dashboard`).
* **Ritual Animation Engine**: Diya flame bloom, wax seal breaking, velvet curtain parting, and royal farmaan scroll.
* **Reference Guide**: Full AI setup instructions in [`dawatna/AI_HANDOFF_INSTRUCTIONS.md`](./dawatna/AI_HANDOFF_INSTRUCTIONS.md).

---

### 3. Master Intelligence & Strategy Documents

* **[`PAKISTANI_E_INVITATIONS_MASTER_REPORT.md`](./PAKISTANI_E_INVITATIONS_MASTER_REPORT.md)**: Exhaustive 459-line teardown dissecting:
  * Macroeconomics of Pakistani wedding stationery (print vs WhatsApp web-links).
  * Feature matrices, pricing models, payment rails (Raast, JazzCash, Easypaisa, UBL/HBL bank transfer verification).
  * Strengths, weaknesses, and customer friction points across all competitors.
* **[`PAKISTANI_E_INVITATIONS_MASTER_BLUEPRINT.md`](./PAKISTANI_E_INVITATIONS_MASTER_BLUEPRINT.md)**: Product development roadmap, high-converting WhatsApp sales funnels, and viral guest acquisition loops.
* **Visual Reference Still Life**: [`Luxury Wedding Invitation Still Life.png`](./Luxury%20Wedding%20Invitation%20Still%20Life.png).

---

### 4. Rendered Frame & Ritual Previews

* `baraat-frame.png` — Baraat event agenda card layout.
* `curtain-frame.png` — Velvet curtain opening transition.
* `mehndi-frame.png` — Traditional yellow/green floral mehndi palette.
* `walima-frame.png` — Elegant evening reception typography.
* `dehleez-rendered.png` — Haveli door swing entrance.
* `bazm-shahi-rendered.png` & `bazm-opened-test.png` — Royal Mughal court gate animation.
* `roshni-rendered.png` & `roshni-opened-rendered.png` — Diya illumination reveal interaction.
* `w-ahmad-mawra-rendered.png` — Production couple card demonstration.

---

## 🤖 Instructions for AI Agents Connecting to this Repository

When you are queried to design, optimize, or code features for digital wedding invitations:
1. **To build high-converting landing pages or studios**: Reference [`dawatna/app/studio/`](./dawatna/app/studio/) and [`ceremoniainvites.com`](./ceremoniainvites.com/).
2. **To implement Pakistani payment rails & WhatsApp checkout**: Reference Section 4 of [`PAKISTANI_E_INVITATIONS_MASTER_REPORT.md`](./PAKISTANI_E_INVITATIONS_MASTER_REPORT.md) and [`dawatna/app/checkout/`](./dawatna/app/checkout/).
3. **To craft authentic cultural animations**: Examine CSS/JS ritual implementations in [`dawatna/public/templates/`](./dawatna/public/templates/) and [`niru.pk`](./niru.pk/).
4. **To write bilingual Urdu (Nastaliq) / English typography**: Review the font loading and bidirectional RTL stylesheets in [`dawatna/public/fonts/`](./dawatna/public/fonts/) and [`ceremoniainvites.com/ceremoniainvites.com/fonts/`](./ceremoniainvites.com/ceremoniainvites.com/fonts/).
