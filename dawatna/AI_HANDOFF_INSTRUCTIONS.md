# AI HANDOFF PROMPT & MASTER RUN GUIDE — WEDINVITE.PK

> **Instructions for the AI Assistant receiving this project:**
> Read this entire document carefully before taking any action. You are inheriting a production-ready, highly sophisticated luxury digital wedding platform called **WedInvite.pk** (`wedinvite.pk`). Your job is to extract the project archive, install dependencies, spin up the server on localhost, verify its health, and continue development or user requests seamlessly without breaking any existing features, branding, or 60fps animations.

---

## ⚡ 1. QUICK SETUP & RUN INSTRUCTIONS

If the user provides you with the path to `wedinvite-pk.zip`, execute the following steps:

### Step 1: Extract the Archive
Extract `wedinvite-pk.zip` into your chosen workspace directory:
```bash
# On macOS / Linux:
unzip wedinvite-pk.zip -d ./
cd wedinvite-pk

# On Windows (PowerShell):
Expand-Archive -Path wedinvite-pk.zip -DestinationPath .\
cd wedinvite-pk
```

### Step 2: Install Node.js Dependencies
```bash
npm install
```
*(Node.js v18+ or v20+ recommended)*

### Step 3: Start the Development Server
```bash
npm run dev
```

The application will be live at: **`http://localhost:3000`**

### Step 4: Verify Localhost Health
Ensure all key routes return HTTP 200:
- Homepage: `http://localhost:3000`
- Master Catalog (45 Templates): `http://localhost:3000/templates`
- Customization Studio: `http://localhost:3000/studio`
- Product Page: `http://localhost:3000/templates/darbar-e-shahi`
- Live Preview: `http://localhost:3000/preview/darbar-e-shahi`
- Live Wedding Card: `http://localhost:3000/w/ahmad-mawra`
- Guest Pass with Headcount: `http://localhost:3000/g/sample-guest`
- Couple Dashboard: `http://localhost:3000/dashboard`

---

## 🏛️ 2. PROJECT OVERVIEW & BRAND IDENTITY

* **Brand Name:** **WedInvite.pk** (`WedInvite`)
* **Domain:** `wedinvite.pk`
* **Target Audience:** High-profile Pakistani weddings (Karachi, Lahore, Islamabad, Faisalabad, Peshawar, Overseas Diaspora in UK/US/UAE).
* **Core Value Proposition:** Living, bilingual digital wedding websites featuring fluid cloth physics, 3D envelope unboxings, interactive entrance rituals, private guest headcount allocations, Google Maps venue directions, digital salami (Raast), and instant WhatsApp RSVP.
* **Pricing Tiers:**
  - **Standard Tier (Rs. 4,999):** Living bilingual website, countdown, maps, digital salami, and basic WhatsApp RSVP.
  - **Royal All-Inclusive (Rs. 7,999):** Everything in Standard + 9:16 vertical video invitation, individual guest name & seat allocation links, meal preference selector, and 1-year hosting.
* **Testing Mode:** **VIP Instant Test Mode is 100% active.** Users and testers can bypass bank checkout by clicking `"⚡ Instant VIP Test & Publish (Free)"` in the Studio or Checkout to immediately test live wedding cards, guest links, and dashboards without payment approval.

> ⚠️ **STRICT GUARDRAIL:** Do **NOT** reintroduce competitor brand names (`Ceremonia`, `Ceremonia Invites`, `Niru`, `Niru Studio`, `Dawatna`, `Sehra`, `OSInvites`). The platform is 100% unified under **WedInvite.pk**.

---

## 📂 3. ARCHITECTURE & CODEBASE STRUCTURE

```
wedinvite-pk/
├── app/                              # Next.js 16 App Router (Turbopack)
│   ├── page.tsx                      # High-converting landing page with 3D device showcase
│   ├── templates/
│   │   ├── page.tsx                  # Master Catalog page with filter tabs & unclipped thumbnails
│   │   └── [slug]/page.tsx           # Dedicated conversion product page for every template
│   ├── studio/page.tsx               # 4-step real-time Customization Studio with live iframe sync
│   ├── preview/[slug]/page.tsx       # Fullscreen template preview wrapper
│   ├── w/[slug]/page.tsx             # Public wedding route (e.g. /w/ahmad-mawra)
│   ├── g/[token]/page.tsx            # Private guest route with personalized name & seat count
│   ├── checkout/page.tsx             # Payment flow with instant VIP test bypass
│   ├── dashboard/page.tsx            # Couple guest manager, RSVP tracker, and salami log
│   ├── admin/page.tsx                # Back-office order & template management
│   └── scanner/page.tsx              # Gatekeeper QR code ticket scanner
│
├── lib/
│   ├── templates.ts                  # Master registry defining all 45 template metadata & palettes
│   ├── store.ts                      # Sample weddings, dummy guest lists, and state models
│   └── types.ts                      # TypeScript definitions for templates, events, guests
│
├── public/
│   ├── templates/                    # 45 standalone, 60fps HTML master templates
│   ├── videos/luxury/                # 4K unwatermarked master motion videos:
│   │   ├── curtain.mp4               # Grand golden sheer silk curtains parting with morning sunlight
│   │   ├── royal-prestige-opening.mp4# Embossed dusty rose floral envelope opening with wax seal
│   │   ├── mehndi.mp4                # Bride & family singing dholki under glowing lanterns
│   │   ├── baraat.mp4                # Royal groom on white horse under moonlit Taj Mahal
│   │   └── walima.mp4                # Royal couple dancing under exploding gold fireworks
│   ├── music/                        # 11 authentic Pakistani wedding MP3s (shehnai, sitar, bansuri)
│   ├── img/home/phones/              # Unclipped device mockup webp frames
│   └── css-sample/                   # 3D folding envelope CSS styles
│
├── project-plans/                    # 6 Master Architectural Blueprints & Reports:
│   ├── MASTER_LUXURY_TEMPLATES_ARCHITECTURE_AND_PLAN.md
│   ├── WEDINVITE_PK_LAUNCH_READINESS_REPORT.md
│   ├── MASTER_PROMPT_STACK_AND_TEMPLATES.md
│   ├── CUSTOM_PLATFORM_BLUEPRINT.md
│   ├── PAKISTANI_E_INVITATIONS_MASTER_BLUEPRINT.md
│   └── PAKISTANI_E_INVITATIONS_MASTER_REPORT.md
│
└── scripts/                          # Python template compiler & asset maintenance scripts
```

---

## 🎭 4. HOW THE 45 TEMPLATES WORK (INTERACTION PATTERNS)

All 45 HTML templates located in `public/templates/` use the **`WedInvite.pk` Native Engine** (zero external dependencies, zero obfuscation, 60fps hardware accelerated):

### 1. Crown Jewel 4K Curtain Flagships
- **`darbar-e-shahi` & `shahi-khas`:** Tap gate triggers the 4K unwatermarked `curtain.mp4` silk drape parting, initiates royal shehnai audio, unlocks scrolling, and loops high-definition motion videos for Mehndi, Baraat, and Walima sections using `IntersectionObserver`.
- **`dastaan` & `shahi-envelope`:** Tap gate triggers `royal-prestige-opening.mp4` envelope unfolding.

### 2. Niru Tactile & Ritual Collection (24 Designs)
- **`roshni-diya`:** Pointerdown/touchhold animates flame bloom and radial warm candlelight over 1.2s, blooming the card open.
- **`dehleez-haveli`:** Double carved Sheesham Haveli doors with 3-knock counter (`○ ○ ○` ➔ `● ● ●`) with audio feedback. On 3rd knock, doors swing outward in 3D perspective.
- **`parda-sultana`:** Grand crimson velvet drapes part left and right on tap.
- **`shahi-scroll`:** Gold-embossed parchment unrolls smoothly from top to bottom.
- **`chunri-mehndi`:** Bandhani tie-dye silk fabric with golden gota border glides aside on swipe.

### 3. Ceremonia Cinematic Film & 3D Envelope Collection (21 Designs)
- **`shahi-mehru` / `rose-pavilion`:** Gilded Mughal archway and velvet floral borders.
- **`mehru-cinema` / `mehru-returns`:** Grand stage velvet curtains unveiling chandeliers.
- **`gulab-damask` / `bazm-e-ghulab`:** 3D 4-flap folding paper envelope with wax seal pop.
- **`maroon-shadi` / `royal-beginning`:** Monogrammed wax seal breaking open into palace doors.

---

## 🇵🇰 5. PAKISTANI CULTURAL & CONVERSION FEATURES

Every template is wired with dynamic URL parameters:
```
/templates/{template_id}.html?groom=Ahmad&bride=Mawra&guest=Uncle%20Tariq&seats=3&open=1
```
1. **Dynamic Couple & Guest Binding:** Automatically updates couple names, Urdu Nastaliq calligraphy, and displays a floating VIP Pass:
   `✦ VIP PASS: Uncle Tariq • 3 Seats Reserved`
2. **💌 Instant WhatsApp RSVP:** Floating bottom action bar button opens WhatsApp with pre-filled guest attendance:
   *`Assalam o Alaikum! I received the wedding invitation for Ahmad & Mawra. This is Uncle Tariq confirming attendance for 3 guests.`*
3. **📍 Google Maps Directions:** Opens Google Maps with exact venue coordinates (e.g. Royal Palm Golf & Country Club, Lahore).
4. **💳 Digital Salami (Raast ID & QR):** One-click clipboard copy of the couple's State Bank Raast ID with instant toast notification.
5. **⏳ Live Countdown Timer:** Real-time countdown to the wedding date.

---

## 🛠️ 6. COMMON DEVELOPMENT TASKS

### A. How to Add or Modify a Template
1. Edit or add template definition in `lib/templates.ts`.
2. Place the corresponding HTML template in `public/templates/{id}.html`.
3. If using aliases, run `python3 scripts/link_all_aliases.py`.
4. Test preview at `http://localhost:3000/preview/{id}`.

### B. How to Verify Production Build
```bash
npm run build
```
Ensure Next.js compiles with zero TypeScript or routing errors.

### C. Reference Blueprints
Whenever in doubt about design specs, pricing, AI prompts, or competitor teardowns, consult the documents in `project-plans/`:
- Architecture & Animation: `project-plans/MASTER_LUXURY_TEMPLATES_ARCHITECTURE_AND_PLAN.md`
- Generative AI Media Pipeline: `project-plans/MASTER_PROMPT_STACK_AND_TEMPLATES.md`
- Studio & Dashboard Specs: `project-plans/CUSTOM_PLATFORM_BLUEPRINT.md`

---

**You are now fully primed. Extract `wedinvite-pk.zip`, run `npm run dev`, and proceed with the user's instructions.**
