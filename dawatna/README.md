# WedInvite.pk — Luxury Digital Wedding & Event Invitations

Pakistan's premier digital wedding and event invitation platform. Living, interactive wedding websites with fluid cloth physics, 3D envelope openings, tactile ceremony rituals, private guest headcount allocations, Google Maps venue directions, digital salami (Raast), and instant WhatsApp RSVP.

---

## 🚀 Quick Start Guide

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Production Build
```bash
npm run build
npm start
```

---

## 📂 Project Architecture

```
wedinvite-pk/
├── app/                  # Next.js 16 App Router pages
│   ├── page.tsx          # Homepage with luxury hero, 3D phone showcase, and pricing
│   ├── templates/        # Master Catalog & dedicated product pages (/templates/[slug])
│   ├── studio/           # Live interactive 4-step customization studio
│   ├── preview/          # Fullscreen template preview mode (/preview/[slug])
│   ├── w/[slug]/         # Live couple wedding website (/w/ahmad-mawra)
│   ├── g/[token]/        # Personalized guest invitation with seat allocation
│   ├── checkout/         # Bank transfer & instant VIP test bypass
│   ├── dashboard/        # Couple guest manager, RSVP tracker, and salami log
│   ├── admin/            # Platform order management
│   └── scanner/          # QR code gatekeeper scanner
├── components/           # UI components, modals, audio players, action bars
├── lib/                  # Template definitions (45 designs), stores, types
├── public/               # Static assets
│   ├── templates/        # 45 standalone 60fps HTML master templates
│   ├── videos/luxury/    # 4K unwatermarked master motion videos
│   ├── music/            # Shehnai, sitar, bansuri royal wedding audio
│   └── img/              # Device frames, posters, textures, fonts
└── scripts/              # Template compilation & automation scripts
```

---

## 🌟 Key Features

* **45 Master Templates:** Crown Jewel 4K Curtain Flagships, Niru Interactive Tactile Collection, and Ceremonia Cinematic Film Collection.
* **Authentic Ritual Animations:** Diya press-and-hold radial flame bloom, 3-knock Haveli door swing, grand velvet curtains parting, royal farmaan scroll unrolling, and Bandhani chunri swipe.
* **Pakistani Localized Integrations:**
  - 💌 Instant WhatsApp RSVP with pre-filled guest name and reserved seats.
  - 📍 One-click Google Maps venue navigation.
  - 💳 Raast Salami ID clipboard copy with instant toast confirmation.
  - ✦ Dynamic VIP Guest Pass badge.
  - ⏳ Live wedding countdown timer.
