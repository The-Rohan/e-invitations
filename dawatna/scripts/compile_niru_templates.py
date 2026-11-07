import os

output_dir = '/Users/rohanalvi/Downloads/E-INVITATIONS/dawatna/public/templates'
os.makedirs(output_dir, exist_ok=True)

niru_designs = [
    {
        "id": "roshni",
        "name": "Roshni",
        "urdu": "روشنی",
        "subtitle": "Signature · Press & Hold the Diya",
        "ritual": "diya",
        "bg_color": "#0d0705",
        "accent": "#d4af37",
        "card_bg": "#1a0f0a",
        "tagline": "Every celebration begins with a single light.",
        "thumb": "/niru-assets/thumbs/thumb-roshni-480.webp",
        "music": "/music/mun64ene-7df6d778.mp3"
    },
    {
        "id": "dehleez",
        "name": "Dehleez",
        "urdu": "دہلیز",
        "subtitle": "Atelier · Knock Three Times",
        "ritual": "door",
        "bg_color": "#140c06",
        "accent": "#e5c158",
        "card_bg": "#221309",
        "tagline": "Three knocks to open a lifetime of grace.",
        "thumb": "/niru-assets/thumbs/thumb-dehleez-480.webp",
        "music": "/music/mu08ueox-229c3cea.mp3"
    },
    {
        "id": "parda",
        "name": "Parda",
        "urdu": "پردہ",
        "subtitle": "Signature · Draw the Velvet Aside",
        "ritual": "curtain",
        "bg_color": "#4a0e17",
        "accent": "#f3e6d6",
        "card_bg": "#fcf9f2",
        "tagline": "The crimson velvet parts to welcome you.",
        "thumb": "/niru-assets/thumbs/thumb-parda-480.webp",
        "music": "/music/mu33qo8n-fc382258.mp3"
    },
    {
        "id": "farmaan",
        "name": "Farmaan",
        "urdu": "فرمانِ شاہی",
        "subtitle": "Signature · Royal Mughal Scroll",
        "ritual": "scroll",
        "bg_color": "#1c140e",
        "accent": "#d4af37",
        "card_bg": "#faf4e8",
        "tagline": "A royal proclamation of love and wisaal.",
        "thumb": "/niru-assets/thumbs/thumb-farmaan-480.webp",
        "music": "/music/mux3cduy-92d0c70b.mp3"
    },
    {
        "id": "chunri",
        "name": "Chunri",
        "urdu": "چنری",
        "subtitle": "Signature · Draw the Silk Cloth Aside",
        "ritual": "chunri",
        "bg_color": "#610c27",
        "accent": "#ffd700",
        "card_bg": "#fffbf0",
        "tagline": "Vibrant Multani Bandhani draped in joy.",
        "thumb": "/niru-assets/thumbs/thumb-chunri-480.webp",
        "music": "/music/mu08wkik-948bb477.mp3"
    },
    {
        "id": "gulaab",
        "name": "Gulaab",
        "urdu": "گلاب",
        "subtitle": "Signature · Break the Wax Seal",
        "ritual": "curtain",
        "bg_color": "#1f0d12",
        "accent": "#e0a96d",
        "card_bg": "#faf5f0",
        "tagline": "Fresh rose essence in deep burgundy velvet.",
        "thumb": "/niru-assets/thumbs/thumb-gulaab-480.webp",
        "music": "/music/mu2n7pt2-d4c4e043.mp3"
    },
    {
        "id": "baradari",
        "name": "Baradari",
        "urdu": "بارہ دری",
        "subtitle": "Signature · Mughal Arches & Shehnai",
        "ritual": "curtain",
        "bg_color": "#18120c",
        "accent": "#c5a059",
        "card_bg": "#f9f5ed",
        "tagline": "Twelve arches under a moonlit Lahore sky.",
        "thumb": "/niru-assets/thumbs/thumb-baradari-480.webp",
        "music": "/music/mun64ene-7df6d778.mp3"
    },
    {
        "id": "chinar",
        "name": "Chinar",
        "urdu": "چنار",
        "subtitle": "Signature · Kashmir Golden Shimmer",
        "ritual": "curtain",
        "bg_color": "#26150b",
        "accent": "#e59866",
        "card_bg": "#fbf7f2",
        "tagline": "Golden autumn leaves fluttering over Shalimar.",
        "thumb": "/niru-assets/thumbs/thumb-chinar-480.webp",
        "music": "/music/mu2v1vt1-1018d383.mp3"
    },
    {
        "id": "firdaus",
        "name": "Firdaus",
        "urdu": "فردوس",
        "subtitle": "Signature · Garden of Paradise",
        "ritual": "curtain",
        "bg_color": "#0b1f17",
        "accent": "#52be80",
        "card_bg": "#f4fbf7",
        "tagline": "Emerald foliage, lotus pools and celestial serenity.",
        "thumb": "/niru-assets/thumbs/thumb-firdaus-480.webp",
        "music": "/music/muxrbl0l-5de95ea7.mp3"
    },
    {
        "id": "qasr",
        "name": "Qasr",
        "urdu": "قصر",
        "subtitle": "Signature · Shahi Qila Chandelier",
        "ritual": "diya",
        "bg_color": "#161009",
        "accent": "#d4af37",
        "card_bg": "#20170e",
        "tagline": "Crystal chandeliers reflecting off royal marble.",
        "thumb": "/niru-assets/thumbs/thumb-qasr-480.webp",
        "music": "/music/mu33tg5j-02dfd3e9.mp3"
    },
    {
        "id": "moti-bagh",
        "name": "Moti Bagh",
        "urdu": "موتی باغ",
        "subtitle": "Signature · Pearl Garden Ivory",
        "ritual": "curtain",
        "bg_color": "#1e1a14",
        "accent": "#f5b041",
        "card_bg": "#fcfaf6",
        "tagline": "Pristine white jasmine and pearls of timeless love.",
        "thumb": "/niru-assets/thumbs/thumb-moti-bagh-480.webp",
        "music": "/music/murg8k2h-29fb97e6.mp3"
    },
    {
        "id": "gulkari",
        "name": "Gulkari",
        "urdu": "گلکاری",
        "subtitle": "Signature · Kashmiri Tapestry",
        "ritual": "curtain",
        "bg_color": "#1f1015",
        "accent": "#e74c3c",
        "card_bg": "#fef9f9",
        "tagline": "Embroidered floral vine work in royal crimson.",
        "thumb": "/niru-assets/thumbs/thumb-gulkari-480.webp",
        "music": "/music/mu08ueox-229c3cea.mp3"
    },
    {
        "id": "gulbadan",
        "name": "Gulbadan",
        "urdu": "گلبدن",
        "subtitle": "Signature · Rose Petals Waterfall",
        "ritual": "curtain",
        "bg_color": "#2c0e18",
        "accent": "#f1948a",
        "card_bg": "#fdf7f8",
        "tagline": "Petals raining down as the shehnai plays.",
        "thumb": "/niru-assets/thumbs/thumb-gulbadan-480.webp",
        "music": "/music/mu2n7pt2-d4c4e043.mp3"
    },
    {
        "id": "dilkusha",
        "name": "Dilkusha",
        "urdu": "دلکشا",
        "subtitle": "Signature · Marigold Courtyard",
        "ritual": "chunri",
        "bg_color": "#291807",
        "accent": "#f39c12",
        "card_bg": "#fefaf2",
        "tagline": "Fragrant genda phool arches in joyous warmth.",
        "thumb": "/niru-assets/thumbs/thumb-dilkusha-480.webp",
        "music": "/music/mu08wkik-948bb477.mp3"
    },
    {
        "id": "sahar",
        "name": "Sahar",
        "urdu": "سحر",
        "subtitle": "Signature · Morning Dew & Bansuri",
        "ritual": "diya",
        "bg_color": "#0d1b2a",
        "accent": "#70b8d4",
        "card_bg": "#f4f8fb",
        "tagline": "First light of dawn breaking over tranquil courtyards.",
        "thumb": "/niru-assets/thumbs/thumb-sahar-480.webp",
        "music": "/music/mux3cduy-92d0c70b.mp3"
    },
    {
        "id": "kaghaz",
        "name": "Kaghaz",
        "urdu": "کاغذ",
        "subtitle": "Signature · Handmade Rice Paper",
        "ritual": "scroll",
        "bg_color": "#211a14",
        "accent": "#c5a059",
        "card_bg": "#f9f6ef",
        "tagline": "Deckled edge artisanal paper with gold calligraphy.",
        "thumb": "/niru-assets/thumbs/thumb-farmaan-480.webp",
        "music": "/music/mun64ene-7df6d778.mp3"
    },
    {
        "id": "haveli",
        "name": "Haveli",
        "urdu": "حویلی",
        "subtitle": "Signature · Brass Lantern Warm Glow",
        "ritual": "door",
        "bg_color": "#1a0f08",
        "accent": "#d4af37",
        "card_bg": "#25150c",
        "tagline": "An evening inside the walls of Old Lahore.",
        "thumb": "/niru-assets/thumbs/thumb-dehleez-480.webp",
        "music": "/music/mu08ueox-229c3cea.mp3"
    },
    {
        "id": "neelum",
        "name": "Neelum",
        "urdu": "نیلم",
        "subtitle": "Signature · Turquoise Mountain Stream",
        "ritual": "curtain",
        "bg_color": "#0a1924",
        "accent": "#48c9b0",
        "card_bg": "#f2faf8",
        "tagline": "Crystal blue waters reflecting snow peaks.",
        "thumb": "/niru-assets/thumbs/thumb-firdaus-480.webp",
        "music": "/music/muxrbl0l-5de95ea7.mp3"
    },
    {
        "id": "saahil",
        "name": "Saahil",
        "urdu": "ساحل",
        "subtitle": "Signature · Arabian Sea Sunset",
        "ritual": "curtain",
        "bg_color": "#1a121c",
        "accent": "#bb8fce",
        "card_bg": "#fbf7fc",
        "tagline": "Violet twilight on the Karachi coastline.",
        "thumb": "/niru-assets/thumbs/thumb-gulaab-480.webp",
        "music": "/music/mu2v1vt1-1018d383.mp3"
    },
    {
        "id": "bahaar",
        "name": "Bahaar",
        "urdu": "بہار",
        "subtitle": "Signature · Springtime Blossom Shower",
        "ritual": "curtain",
        "bg_color": "#1b2111",
        "accent": "#a9dfbf",
        "card_bg": "#f7fbf8",
        "tagline": "Flowers in bloom, celebrating a lifetime union.",
        "thumb": "/niru-assets/thumbs/thumb-baradari-480.webp",
        "music": "/music/mu33tg5j-02dfd3e9.mp3"
    },
    {
        "id": "chandni",
        "name": "Chandni",
        "urdu": "چاندنی",
        "subtitle": "Signature · Full Moon Night & Sitar",
        "ritual": "diya",
        "bg_color": "#090d16",
        "accent": "#d5d8dc",
        "card_bg": "#121926",
        "tagline": "Silver moonlight bathing the royal marble terrace.",
        "thumb": "/niru-assets/thumbs/thumb-roshni-480.webp",
        "music": "/music/mux3cduy-92d0c70b.mp3"
    },
    {
        "id": "ajrak",
        "name": "Ajrak",
        "urdu": "اجرک",
        "subtitle": "Signature · Sindhi Royal Indigo & Crimson",
        "ritual": "chunri",
        "bg_color": "#120917",
        "accent": "#e74c3c",
        "card_bg": "#faf4f6",
        "tagline": "Centuries of heritage block-printed in royal geometry.",
        "thumb": "/niru-assets/thumbs/thumb-chunri-480.webp",
        "music": "/music/mu08wkik-948bb477.mp3"
    },
    {
        "id": "aangan",
        "name": "Aangan",
        "urdu": "آنگن",
        "subtitle": "Signature · Traditional Haveli Courtyard",
        "ritual": "curtain",
        "bg_color": "#1c1209",
        "accent": "#e59866",
        "card_bg": "#fdf7f0",
        "tagline": "Family laughter echoing under fairy-lit trees.",
        "thumb": "/niru-assets/thumbs/thumb-chinar-480.webp",
        "music": "/music/mun64ene-7df6d778.mp3"
    },
    {
        "id": "sahil-e-rang",
        "name": "Sahil-e-Rang",
        "urdu": "ساحلِ رنگ",
        "subtitle": "Signature · Joyful Palette of Celebrations",
        "ritual": "chunri",
        "bg_color": "#200d1e",
        "accent": "#f4d03f",
        "card_bg": "#fefbf2",
        "tagline": "Colors of Mehndi, Baraat and Walima united.",
        "thumb": "/niru-assets/thumbs/thumb-dilkusha-480.webp",
        "music": "/music/mu08ueox-229c3cea.mp3"
    }
]

template_raw = """<!doctype html>
<html lang="en" dir="ltr" class="wi-html">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
<title>__NAME__ — Wedding Invitation | WedInvite.pk</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;800&family=Montserrat:wght@300;400;500;600&family=Noto+Nastaliq+Urdu:wght@400;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&display=swap" rel="stylesheet">

<style>
* { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
html, body {
  width: 100%; min-height: 100vh;
  background-color: __BG_COLOR__;
  color: #f7ede2;
  font-family: 'Montserrat', sans-serif;
  overflow-x: hidden;
  user-select: none;
}
html.wi-locked, body.wi-locked { overflow: hidden !important; height: 100vh !important; }

.wi-entrance {
  position: fixed; inset: 0; z-index: 9999;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  background: __BG_COLOR__;
  transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  cursor: pointer;
}
.wi-entrance.is-dismissed {
  opacity: 0 !important; transform: scale(1.05) !important; pointer-events: none !important;
}

/* DIYA ENTRANCE */
.wi-entrance-diya {
  background: radial-gradient(circle at 50% 65%, #2a1208 0%, #0d0705 70%);
}
.wi-ambient-glow {
  position: absolute; inset: 0; pointer-events: none;
  background: radial-gradient(circle at 50% 62%, rgba(255,180,50,0) 0%, rgba(0,0,0,0.9) 75%);
  transition: background 0.2s ease;
}
.wi-entrance-content {
  position: relative; z-index: 2; display: flex; flex-direction: column; align-items: center; text-align: center;
  padding: 20px; max-width: 480px; width: 100%;
}
.wi-bismillah {
  font-family: 'Noto Nastaliq Urdu', serif; font-size: 20px; color: __ACCENT__; margin-bottom: 12px; opacity: 0.9;
}
.wi-ritual-tagline {
  font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: __ACCENT__; opacity: 0.75; margin-bottom: 16px;
}
.wi-couple-title {
  font-family: 'Cinzel', serif; font-size: 32px; font-weight: 700; letter-spacing: 2px; color: #fffaf0; margin-bottom: 40px;
  text-shadow: 0 4px 20px rgba(0,0,0,0.8);
}
.wi-diya-stage {
  position: relative; width: 140px; height: 110px; display: flex; flex-direction: column; align-items: center; justify-content: center;
  cursor: pointer; margin-bottom: 30px;
}
.wi-diya-flame {
  width: 22px; height: 42px; border-radius: 50% 50% 20% 20% / 60% 60% 40% 40%;
  background: linear-gradient(to top, #ff3300, #ff9900, #ffeeaa, #ffffff);
  box-shadow: 0 0 25px #ff8800, 0 0 50px rgba(255,150,0,0.6);
  transform-origin: 50% 90%;
  animation: diyaFlicker 1.8s infinite alternate ease-in-out;
  transition: transform 0.3s ease, filter 0.3s ease;
  margin-bottom: 2px;
}
@keyframes diyaFlicker {
  0% { transform: scale(1) rotate(-1deg); filter: brightness(1); }
  50% { transform: scale(1.08, 0.95) rotate(1.5deg); filter: brightness(1.2); }
  100% { transform: scale(0.96, 1.05) rotate(-1deg); filter: brightness(1.1); }
}
.wi-diya-flame.is-blooming {
  transform: scale(2.8) !important;
  box-shadow: 0 0 80px #ffbb33, 0 0 160px rgba(255,200,50,0.9) !important;
  filter: brightness(1.8) !important;
}
.wi-press-guide {
  display: flex; flex-direction: column; align-items: center; gap: 10px;
}
.wi-instruction {
  font-family: 'Cinzel', serif; font-size: 11px; letter-spacing: 3px; color: __ACCENT__; text-transform: uppercase;
}
.wi-progress-bar {
  width: 140px; height: 3px; background: rgba(255,255,255,0.15); border-radius: 3px; overflow: hidden;
}
.wi-progress-fill {
  width: 0%; height: 100%; background: linear-gradient(90deg, #d4af37, #fff); transition: width 0.05s linear;
}

/* HAVELI DOORS ENTRANCE */
.wi-entrance-door {
  perspective: 1200px;
}
.wi-doors-container {
  position: absolute; inset: 0; display: flex; width: 100%; height: 100%;
}
.wi-door {
  flex: 1; height: 100%; position: relative; background: #26140a;
  transform-style: preserve-3d; transition: transform 1.2s cubic-bezier(0.2, 0.8, 0.2, 1);
  box-shadow: inset 0 0 60px rgba(0,0,0,0.85);
}
.wi-door-left {
  border-right: 3px solid #100804; transform-origin: left center;
  background-image: linear-gradient(135deg, #2b180d 0%, #170b05 100%);
}
.wi-door-right {
  border-left: 3px solid #100804; transform-origin: right center;
  background-image: linear-gradient(225deg, #2b180d 0%, #170b05 100%);
}
.wi-doors-container.is-opened .wi-door-left { transform: rotateY(-82deg); }
.wi-doors-container.is-opened .wi-door-right { transform: rotateY(82deg); }

.wi-jali-pattern {
  position: absolute; inset: 24px; border: 2px solid rgba(212,175,55,0.4);
  background: radial-gradient(circle, rgba(212,175,55,0.15) 1px, transparent 1px);
  background-size: 16px 16px;
}
.wi-knocker {
  position: absolute; top: 48%; width: 50px; height: 50px; border-radius: 50%;
  border: 4px solid #d4af37; box-shadow: 0 4px 15px rgba(0,0,0,0.8);
}
.wi-knocker-left { right: 20px; }
.wi-knocker-right { left: 20px; }
.wi-door-hud {
  position: relative; z-index: 10; display: flex; flex-direction: column; align-items: center; text-align: center;
  padding: 30px; pointer-events: none;
}
.wi-knock-counter { display: flex; gap: 12px; margin: 18px 0; }
.wi-knock-dot {
  width: 14px; height: 14px; border-radius: 50%; border: 2px solid __ACCENT__; transition: all 0.3s ease;
}
.wi-knock-dot.active {
  background: __ACCENT__; box-shadow: 0 0 15px __ACCENT__; transform: scale(1.2);
}

/* PARDA VELVET ENTRANCE */
.wi-entrance-curtain {
  position: fixed; inset: 0; z-index: 9999; display: flex;
}
.wi-curtain {
  flex: 1; height: 100%; position: relative; background: linear-gradient(90deg, #400a12, #6b1420 50%, #30060d);
  box-shadow: inset 0 0 50px rgba(0,0,0,0.7);
  transition: transform 1.2s cubic-bezier(0.7, 0, 0.2, 1);
}
.wi-curtain-left { transform-origin: left; }
.wi-curtain-right { transform-origin: right; }
.wi-entrance.is-dismissed .wi-curtain-left { transform: translateX(-100%); }
.wi-entrance.is-dismissed .wi-curtain-right { transform: translateX(100%); }
.wi-curtain-seal-box {
  position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 10;
  display: flex; flex-direction: column; align-items: center; text-align: center;
  background: rgba(20,10,12,0.9); backdrop-filter: blur(10px); border: 2px solid #d4af37;
  padding: 24px 36px; border-radius: 20px; box-shadow: 0 10px 40px rgba(0,0,0,0.8);
}
.wi-wax-seal {
  width: 58px; height: 58px; border-radius: 50%; background: radial-gradient(circle, #e74c3c, #900c3f);
  border: 2px solid #f5b041; display: flex; flex-direction: column; align-items: center; justify-content: center;
  box-shadow: 0 4px 20px rgba(0,0,0,0.6); margin-bottom: 12px;
}
.wi-seal-icon { font-size: 18px; color: #fdf4dc; }
.wi-seal-text { font-size: 9px; font-weight: 800; letter-spacing: 2px; color: #fdf4dc; }

/* CHUNRI SILK ENTRANCE */
.wi-entrance-chunri {
  background: #2b0b18; overflow: hidden;
}
.wi-chunri-cloth {
  position: absolute; inset: 0;
  background: repeating-linear-gradient(45deg, #e91e63, #e91e63 40px, #ffeb3b 40px, #ffeb3b 80px, #4caf50 80px, #4caf50 120px);
  box-shadow: 0 10px 50px rgba(0,0,0,0.7);
  transition: transform 1.1s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex; align-items: center; justify-content: center;
}
.wi-chunri-texture {
  position: absolute; inset: 0; opacity: 0.25;
  background-image: radial-gradient(#fff 2px, transparent 2px);
  background-size: 18px 18px;
}
.wi-gota-border {
  position: absolute; bottom: 0; left: 0; right: 0; height: 18px;
  background: repeating-linear-gradient(90deg, #d4af37, #d4af37 10px, #f9e79f 10px, #f9e79f 20px);
  box-shadow: 0 -2px 10px rgba(0,0,0,0.4);
}
.wi-chunri-badge {
  position: relative; z-index: 5; background: rgba(20,10,15,0.92); border: 2px solid #ffd700;
  padding: 24px 32px; border-radius: 20px; text-align: center;
}

/* ROYAL FARMAAN SCROLL ENTRANCE */
.wi-entrance-scroll {
  background: #17100a;
}
.wi-scroll-wrapper {
  width: 90%; max-width: 420px; display: flex; flex-direction: column; align-items: center;
}
.wi-scroll-finial {
  width: 100%; height: 26px; background: linear-gradient(to right, #8b6508, #d4af37, #fdf4dc, #d4af37, #8b6508);
  border-radius: 13px; box-shadow: 0 4px 15px rgba(0,0,0,0.6); display: flex; justify-content: space-between; align-items: center;
  padding: 0 10px;
}
.wi-brass-knob { width: 14px; height: 14px; border-radius: 50%; background: #ffd700; border: 2px solid #5d4037; }
.wi-wood-rod { flex: 1; height: 8px; background: #3e2723; margin: 0 8px; border-radius: 4px; }
.wi-scroll-parchment {
  width: 92%; background: #faf4e8; color: #2c1d11; padding: 36px 24px; text-align: center;
  box-shadow: 0 8px 30px rgba(0,0,0,0.5); border-left: 2px solid #c5a059; border-right: 2px solid #c5a059;
  max-height: 520px; overflow-y: auto;
}
.wi-scroll-parchment .wi-bismillah { color: #8b6508; }
.wi-scroll-parchment .wi-couple-title { color: #1c1308; }
.wi-unroll-btn {
  background: linear-gradient(135deg, #b8860b, #d4af37); color: #1a0f05; font-family: 'Cinzel', serif;
  font-weight: 700; font-size: 11px; letter-spacing: 2px; padding: 10px 22px; border: none; border-radius: 20px;
  cursor: pointer; margin-top: 20px; box-shadow: 0 4px 15px rgba(184,134,11,0.4);
}

/* CARD CONTAINER */
.wi-card-container {
  max-width: 540px; margin: 0 auto; min-height: 100vh;
  background: __CARD_BG__;
  box-shadow: 0 0 60px rgba(0,0,0,0.7);
  display: flex; flex-direction: column;
}
.wi-hero-section {
  position: relative; width: 100%; min-height: 75vh; display: flex; flex-direction: column;
  align-items: center; justify-content: center; text-align: center; padding: 60px 24px 40px;
  background-image: radial-gradient(circle at 50% 30%, rgba(212,175,55,0.12), transparent 70%);
}
.wi-hero-thumb {
  width: 140px; height: 140px; border-radius: 50%; object-fit: cover; border: 3px solid __ACCENT__;
  box-shadow: 0 8px 30px rgba(0,0,0,0.6); margin-bottom: 24px;
}
.wi-hero-urdu {
  font-family: 'Noto Nastaliq Urdu', serif; font-size: 26px; color: __ACCENT__; margin-bottom: 8px;
}
.wi-hero-groom, .wi-hero-bride {
  font-family: 'Playfair Display', serif; font-size: 38px; font-weight: 700; color: #fffaf0; line-height: 1.1;
}
.wi-hero-amp {
  font-family: 'Playfair Display', serif; font-style: italic; font-size: 24px; color: __ACCENT__; margin: 4px 0;
}
.wi-countdown {
  display: flex; gap: 14px; margin: 30px 0;
}
.wi-count-box {
  background: rgba(255,255,255,0.06); border: 1px solid rgba(212,175,55,0.3); border-radius: 12px;
  padding: 10px 14px; text-align: center; min-width: 60px;
}
.wi-count-val {
  font-family: 'Cinzel', serif; font-size: 22px; font-weight: 700; color: __ACCENT__; display: block;
}
.wi-count-lbl {
  font-size: 9px; letter-spacing: 2px; text-transform: uppercase; color: #d4af37; opacity: 0.8;
}
.wi-events-section {
  padding: 30px 24px; display: flex; flex-direction: column; gap: 20px;
}
.wi-section-heading {
  font-family: 'Cinzel', serif; font-size: 16px; letter-spacing: 3px; text-align: center; color: __ACCENT__;
  margin-bottom: 10px; text-transform: uppercase;
}
.wi-event-card {
  background: rgba(255,255,255,0.04); border: 1px solid rgba(212,175,55,0.25); border-radius: 16px;
  padding: 20px; transition: transform 0.3s ease;
}
.wi-event-badge {
  display: inline-block; font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
  color: __ACCENT__; background: rgba(212,175,55,0.12); padding: 4px 10px; border-radius: 12px; margin-bottom: 10px;
}
.wi-event-title {
  font-family: 'Cinzel', serif; font-size: 20px; font-weight: 700; color: #fffaf0; margin-bottom: 6px;
}
.wi-event-date {
  font-size: 13px; color: __ACCENT__; font-weight: 500; margin-bottom: 6px;
}
.wi-event-venue {
  font-size: 12px; opacity: 0.8; line-height: 1.4;
}
.wi-action-bar {
  position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); z-index: 9999;
  display: flex; gap: 10px; background: rgba(20,10,10,0.88); backdrop-filter: blur(12px);
  border: 1px solid __ACCENT__; padding: 8px 16px; border-radius: 40px; box-shadow: 0 8px 30px rgba(0,0,0,0.7);
}
.wi-action-btn {
  background: rgba(255,255,255,0.1); border: 1px solid rgba(212,175,55,0.4); color: #fdf4dc;
  padding: 8px 16px; border-radius: 20px; font-size: 12px; cursor: pointer; display: flex; align-items: center;
  gap: 6px; font-family: 'Cinzel', serif; font-weight: 600;
}
.wi-action-primary {
  background: linear-gradient(135deg, __ACCENT__, #fff) !important; color: #1c1308 !important; border: none !important;
}
.wi-audio-disc {
  position: fixed; bottom: 24px; left: 24px; z-index: 99999; width: 44px; height: 44px; border-radius: 50%;
  background: #111; border: 2px solid __ACCENT__; display: flex; align-items: center; justify-content: center;
  cursor: pointer; box-shadow: 0 4px 20px rgba(0,0,0,0.6);
}
.wi-audio-disc.is-playing { animation: discSpin 4s linear infinite; }
@keyframes discSpin { 100% { transform: rotate(360deg); } }
</style>
</head>

<body class="wi-locked">

__ENTRANCE_HTML__

<audio id="wiAudio" loop preload="none" src="__MUSIC__"></audio>

<div class="wi-audio-disc" id="wiAudioBtn" title="Play / Pause Audio">
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="__ACCENT__" stroke-width="2">
    <circle cx="12" cy="12" r="10"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
</div>

<main class="wi-card-container">
  <header class="wi-hero-section">
    <img src="__THUMB__" class="wi-hero-thumb" alt="__NAME__">
    <p class="wi-bismillah">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
    <p class="wi-hero-urdu">__URDU__</p>
    <div style="margin: 16px 0;">
      <h1 class="wi-hero-groom groom-name">Ahmad</h1>
      <p class="wi-hero-amp">&amp;</p>
      <h1 class="wi-hero-bride bride-name">Mawra</h1>
    </div>
    <p style="font-size:12px; letter-spacing:2px; text-transform:uppercase; color:__ACCENT__; opacity:0.85;">
      Together with their families request the pleasure of your company
    </p>

    <div class="wi-countdown">
      <div class="wi-count-box"><span class="wi-count-val" id="cdDays">42</span><span class="wi-count-lbl">Days</span></div>
      <div class="wi-count-box"><span class="wi-count-val" id="cdHours">18</span><span class="wi-count-lbl">Hours</span></div>
      <div class="wi-count-box"><span class="wi-count-val" id="cdMins">34</span><span class="wi-count-lbl">Mins</span></div>
      <div class="wi-count-box"><span class="wi-count-val" id="cdSecs">50</span><span class="wi-count-lbl">Secs</span></div>
    </div>
  </header>

  <section class="wi-events-section">
    <h2 class="wi-section-heading">Program &bull; تقریبات</h2>

    <div class="wi-event-card">
      <span class="wi-event-badge">Night of Henna &bull; مہندی</span>
      <h3 class="wi-event-title">Mehndi Ceremony</h3>
      <p class="wi-event-date">Friday, 22 December 2026 &bull; 7:30 PM</p>
      <p class="wi-event-venue" id="wiVenueMehndi">Haveli Baradari, Lahore</p>
    </div>

    <div class="wi-event-card">
      <span class="wi-event-badge">The Wedding &bull; بارات</span>
      <h3 class="wi-event-title">Baraat &amp; Rukhsati</h3>
      <p class="wi-event-date">Sunday, 24 December 2026 &bull; 8:00 PM</p>
      <p class="wi-event-venue" id="wiVenueBaraat">Royal Palm Golf &amp; Country Club, Babar Hall, Lahore</p>
    </div>

    <div class="wi-event-card">
      <span class="wi-event-badge">The Reception &bull; ولیمہ</span>
      <h3 class="wi-event-title">Walima Reception</h3>
      <p class="wi-event-date">Tuesday, 26 December 2026 &bull; 8:00 PM</p>
      <p class="wi-event-venue" id="wiVenueWalima">Pearl Continental Grand Ballroom, Lahore</p>
    </div>
  </section>

  <footer style="padding: 40px 20px 100px; text-align: center; color: __ACCENT__; font-family: 'Cinzel', serif; font-size: 11px; letter-spacing: 2px;">
    ✦ WEDINVITE.PK &bull; LUXURY DIGITAL INVITATION ATELIER ✦<br>
    <span style="font-size:9px; opacity:0.7; letter-spacing:1px; font-family:'Montserrat',sans-serif;">Personalized for <span class="groom-name">Ahmad</span> &amp; <span class="bride-name">Mawra</span></span>
  </footer>
</main>

<div class="wi-action-bar">
  <button class="wi-action-btn wi-action-primary" id="btnRsvp">💌 RSVP</button>
  <button class="wi-action-btn" id="btnMap">📍 Map</button>
  <button class="wi-action-btn" id="btnRaast">💳 Salami</button>
</div>

<script>
(function() {
  'use strict';
  console.log('[WedInvite] Niru Design __NAME__ initialized.');

  var params = new URLSearchParams(window.location.search);
  var groom = params.get('groom') || 'Ahmad';
  var bride = params.get('bride') || 'Mawra';
  var guest = params.get('guest') || '';
  var seats = params.get('seats') || '2';
  var venueStr = params.get('venue') || 'Royal Palm Golf & Country Club, Lahore';
  var phoneStr = params.get('phone') || '923213397889';
  var raastStr = params.get('raast') || '03213397889';
  var autoOpen = params.get('open') === 'true' || params.get('open') === '1';

  document.querySelectorAll('.groom-name').forEach(function(el) { el.textContent = groom; });
  document.querySelectorAll('.bride-name').forEach(function(el) { el.textContent = bride; });
  document.title = groom + ' & ' + bride + ' — __NAME__ Invitation | WedInvite.pk';

  if (guest) {
    var guestBadge = document.createElement('div');
    guestBadge.style.cssText = 'position:fixed;top:16px;left:50%;transform:translateX(-50%);z-index:999999;background:rgba(25,12,12,0.92);backdrop-filter:blur(10px);border:1px solid #d4af37;color:#fdf4dc;padding:8px 20px;border-radius:30px;font-size:12px;font-family:Cinzel,serif;letter-spacing:1px;box-shadow:0 6px 25px rgba(0,0,0,0.6);display:flex;align-items:center;gap:8px;pointer-events:none;';
    guestBadge.innerHTML = '<span style="color:#ffd700">✦</span> VIP PASS: <strong>' + guest + '</strong> &bull; ' + seats + ' Seats Reserved';
    document.body.appendChild(guestBadge);
  }

  var audio = document.getElementById('wiAudio');
  var audioBtn = document.getElementById('wiAudioBtn');
  var isAudioPlaying = false;

  function toggleAudio(force) {
    if (!audio) return;
    if (force === true || (force === undefined && audio.paused)) {
      audio.play().then(function() {
        isAudioPlaying = true;
        if (audioBtn) audioBtn.classList.add('is-playing');
      }).catch(function(e) { console.log('Audio autoplay prevented:', e); });
    } else if (force === false || (force === undefined && !audio.paused)) {
      audio.pause();
      isAudioPlaying = false;
      if (audioBtn) audioBtn.classList.remove('is-playing');
    }
  }
  if (audioBtn) audioBtn.addEventListener('click', function(e) { e.stopPropagation(); toggleAudio(); });

  var targetDate = new Date('2026-12-24T20:00:00').getTime();
  setInterval(function() {
    var now = new Date().getTime();
    var diff = targetDate - now;
    if (diff > 0) {
      var days = Math.floor(diff / (1000 * 60 * 60 * 24));
      var hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      var secs = Math.floor((diff % (1000 * 60)) / 1000);
      document.getElementById('cdDays').textContent = days;
      document.getElementById('cdHours').textContent = hours;
      document.getElementById('cdMins').textContent = mins;
      document.getElementById('cdSecs').textContent = secs;
    }
  }, 1000);

  var entrance = document.getElementById('wiEntrance');

  function unlockPage() {
    if (!entrance || entrance.classList.contains('is-dismissed')) return;
    entrance.classList.add('is-dismissed');
    toggleAudio(true);
    setTimeout(function() {
      entrance.style.display = 'none';
      document.documentElement.classList.remove('wi-locked');
      document.body.classList.remove('wi-locked');
    }, 800);
  }

  var ritualType = '__RITUAL__';

  if (ritualType === 'diya') {
    var holdTimer = null;
    var progress = 0;
    var flame = document.getElementById('wiDiyaFlame');
    var fill = document.getElementById('wiProgressFill');
    var glow = document.getElementById('wiAmbientGlow');
    var instr = document.getElementById('wiInstruction');

    function startHold(e) {
      e.preventDefault();
      holdTimer = setInterval(function() {
        progress += 4;
        if (fill) fill.style.width = progress + '%';
        if (glow) glow.style.background = 'radial-gradient(circle at 50% 62%, rgba(255,180,50,' + (progress/100 * 0.8) + ') 0%, rgba(0,0,0,0.85) 75%)';
        if (progress >= 100) {
          clearInterval(holdTimer);
          if (flame) flame.classList.add('is-blooming');
          if (instr) instr.textContent = 'ILLUMINATING...';
          setTimeout(unlockPage, 600);
        }
      }, 30);
    }

    function endHold() {
      if (progress < 100) {
        clearInterval(holdTimer);
        progress = 0;
        if (fill) fill.style.width = '0%';
        if (glow) glow.style.background = 'radial-gradient(circle at 50% 62%, rgba(255,180,50,0) 0%, rgba(0,0,0,0.9) 75%)';
      }
    }

    if (entrance) {
      entrance.addEventListener('mousedown', startHold);
      entrance.addEventListener('touchstart', startHold);
      window.addEventListener('mouseup', endHold);
      window.addEventListener('touchend', endHold);
    }
  } else if (ritualType === 'door') {
    var knocks = 0;
    var dots = [document.getElementById('kd1'), document.getElementById('kd2'), document.getElementById('kd3')];
    var container = document.getElementById('wiDoorsContainer');
    var instr = document.getElementById('wiKnockInstruction');

    if (entrance) {
      entrance.addEventListener('click', function() {
        knocks++;
        if (knocks <= 3 && dots[knocks-1]) dots[knocks-1].classList.add('active');
        if (instr) instr.textContent = knocks === 1 ? 'KNOCK AGAIN (1/3)' : knocks === 2 ? 'ONE MORE KNOCK (2/3)' : 'OPENING THE DOORS...';
        if (knocks >= 3) {
          if (container) container.classList.add('is-opened');
          setTimeout(unlockPage, 900);
        }
      });
    }
  } else if (ritualType === 'chunri') {
    var cloth = document.getElementById('wiChunriCloth');
    if (entrance) {
      entrance.addEventListener('click', function() {
        if (cloth) cloth.style.transform = 'translateY(-100%)';
        setTimeout(unlockPage, 800);
      });
    }
  } else if (ritualType === 'scroll') {
    var unrollBtn = document.getElementById('wiUnrollBtn');
    if (unrollBtn) {
      unrollBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        unlockPage();
      });
    }
  } else {
    if (entrance) entrance.addEventListener('click', unlockPage);
  }

  if (autoOpen) {
    setTimeout(unlockPage, 400);
  }

  document.getElementById('btnMap').addEventListener('click', function() {
    window.open('https://maps.google.com/?q=' + encodeURIComponent(venueStr), '_blank');
  });
  document.getElementById('btnRaast').addEventListener('click', function() {
    navigator.clipboard.writeText(raastStr).then(function() {
      alert('✨ Raast ID Copied: ' + raastStr);
    }).catch(function() { alert('Raast ID: ' + raastStr); });
  });
  document.getElementById('btnRsvp').addEventListener('click', function() {
    var msg = 'Assalam o Alaikum! I received the wedding invitation for ' + groom + ' & ' + bride + '. ' + 
              (guest ? 'This is ' + guest + ' confirming attendance for ' + seats + ' guests.' : 'Confirming our attendance with warm prayers!');
    window.open('https://wa.me/' + phoneStr + '?text=' + encodeURIComponent(msg), '_blank');
  });

})();
</script>
</body>
</html>
"""

def build_entrance(d):
    ritual = d['ritual']
    tagline = d['tagline']
    accent = d['accent']
    if ritual == "diya":
        return f'''
        <div class="wi-entrance wi-entrance-diya" id="wiEntrance">
          <div class="wi-ambient-glow" id="wiAmbientGlow"></div>
          <div class="wi-entrance-content">
            <p class="wi-bismillah">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
            <p class="wi-ritual-tagline">{tagline}</p>
            <h1 class="wi-couple-title"><span class="groom-name">Ahmad</span> &bull; <span class="bride-name">Mawra</span></h1>
            
            <div class="wi-diya-stage">
              <div class="wi-diya-flame" id="wiDiyaFlame"></div>
              <div class="wi-diya-bowl">
                <svg viewBox="0 0 100 45" class="wi-diya-svg">
                  <path d="M10,15 C20,38 80,38 90,15 C95,12 85,10 50,10 C15,10 5,12 10,15 Z" fill="#b8860b" stroke="#e5c158" stroke-width="2"/>
                  <ellipse cx="50" cy="12" rx="35" ry="5" fill="#8b6508"/>
                </svg>
              </div>
            </div>

            <div class="wi-press-guide">
              <div class="wi-pulse-circle"></div>
              <p class="wi-instruction" id="wiInstruction">PRESS &amp; HOLD THE DIYA</p>
              <div class="wi-progress-bar"><div class="wi-progress-fill" id="wiProgressFill"></div></div>
            </div>
          </div>
        </div>
        '''
    elif ritual == "door":
        return f'''
        <div class="wi-entrance wi-entrance-door" id="wiEntrance">
          <div class="wi-doors-container" id="wiDoorsContainer">
            <div class="wi-door wi-door-left">
              <div class="wi-door-panel">
                <div class="wi-jali-pattern"></div>
                <div class="wi-knocker wi-knocker-left" id="wiKnocker">
                  <div class="wi-knocker-ring"></div>
                </div>
              </div>
            </div>
            <div class="wi-door wi-door-right">
              <div class="wi-door-panel">
                <div class="wi-jali-pattern"></div>
                <div class="wi-knocker wi-knocker-right">
                  <div class="wi-knocker-ring"></div>
                </div>
              </div>
            </div>
          </div>
          <div class="wi-door-hud">
            <p class="wi-bismillah">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
            <h1 class="wi-couple-title"><span class="groom-name">Ahmad</span> &bull; <span class="bride-name">Mawra</span></h1>
            <p class="wi-ritual-tagline">DEHLEEZ-E-KHAAS &bull; OLD LAHORE</p>
            <div class="wi-knock-counter" id="wiKnockHud">
              <span class="wi-knock-dot" id="kd1"></span>
              <span class="wi-knock-dot" id="kd2"></span>
              <span class="wi-knock-dot" id="kd3"></span>
            </div>
            <p class="wi-instruction" id="wiKnockInstruction">KNOCK THREE TIMES ON THE HAVELI DOOR</p>
          </div>
        </div>
        '''
    elif ritual == "chunri":
        return f'''
        <div class="wi-entrance wi-entrance-chunri" id="wiEntrance">
          <div class="wi-chunri-cloth" id="wiChunriCloth">
            <div class="wi-chunri-texture"></div>
            <div class="wi-gota-border"></div>
            <div class="wi-chunri-badge">
              <p class="wi-bismillah">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
              <h1 class="wi-couple-title"><span class="groom-name">Ahmad</span> &amp; <span class="bride-name">Mawra</span></h1>
              <p class="wi-instruction">TAP OR SWIPE TO DRAW THE CHUNRI ASIDE &rarr;</p>
            </div>
          </div>
        </div>
        '''
    elif ritual == "scroll":
        return f'''
        <div class="wi-entrance wi-entrance-scroll" id="wiEntrance">
          <div class="wi-scroll-wrapper" id="wiScrollWrapper">
            <div class="wi-scroll-finial wi-finial-top">
              <div class="wi-brass-knob"></div>
              <div class="wi-wood-rod"></div>
              <div class="wi-brass-knob"></div>
            </div>
            <div class="wi-scroll-parchment" id="wiParchment">
              <p class="wi-bismillah">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
              <p class="wi-farmaan-seal">ROYAL PROCLAMATION &bull; فرمانِ شاہی</p>
              <h1 class="wi-couple-title"><span class="groom-name">Ahmad</span> &amp; <span class="bride-name">Mawra</span></h1>
              <p class="wi-date-text" style="margin:8px 0; font-size:12px; color:#8b6508;">SUNDAY &bull; 24 DECEMBER 2026</p>
              <p class="wi-venue-text" style="font-size:11px; opacity:0.8;">ROYAL PALM GOLF &amp; COUNTRY CLUB, LAHORE</p>
              <button class="wi-unroll-btn" id="wiUnrollBtn">TAP TO UNROLL FARMAAN &darr;</button>
            </div>
            <div class="wi-scroll-finial wi-finial-bottom" id="wiFinialBottom">
              <div class="wi-brass-knob"></div>
              <div class="wi-wood-rod"></div>
              <div class="wi-brass-knob"></div>
            </div>
          </div>
        </div>
        '''
    else:
        return f'''
        <div class="wi-entrance wi-entrance-curtain" id="wiEntrance">
          <div class="wi-curtain wi-curtain-left" id="wiCurtainLeft">
            <div class="wi-velvet-creases"></div>
            <div class="wi-gold-fringe"></div>
          </div>
          <div class="wi-curtain wi-curtain-right" id="wiCurtainRight">
            <div class="wi-velvet-creases"></div>
            <div class="wi-gold-fringe"></div>
          </div>
          <div class="wi-curtain-seal-box" id="wiCurtainSeal">
            <div class="wi-wax-seal">
              <span class="wi-seal-icon">✦</span>
              <span class="wi-seal-text">OPEN</span>
            </div>
            <p class="wi-bismillah">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
            <h1 class="wi-couple-title"><span class="groom-name">Ahmad</span> &amp; <span class="bride-name">Mawra</span></h1>
            <p class="wi-instruction">TAP TO PART THE VELVET</p>
          </div>
        </div>
        '''

print(f"Generating {len(niru_designs)} Niru master templates...")
for d in niru_designs:
    entrance_html = build_entrance(d)
    html = template_raw
    html = html.replace('__NAME__', d['name'])
    html = html.replace('__URDU__', d['urdu'])
    html = html.replace('__BG_COLOR__', d['bg_color'])
    html = html.replace('__CARD_BG__', d['card_bg'])
    html = html.replace('__ACCENT__', d['accent'])
    html = html.replace('__THUMB__', d['thumb'])
    html = html.replace('__MUSIC__', d['music'])
    html = html.replace('__RITUAL__', d['ritual'])
    html = html.replace('__ENTRANCE_HTML__', entrance_html)

    out_file = os.path.join(output_dir, f"{d['id']}.html")
    with open(out_file, 'w', encoding='utf-8') as f:
        f.write(html)
    print(f"Generated {d['id']}.html ({len(html)} bytes)")

print("All Niru templates compiled successfully!")
