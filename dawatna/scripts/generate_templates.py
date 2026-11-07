import os

designs = [
    {
        'slug': 'chinar', 'id': 'kashmir-chinar', 'name': 'Kashmir Chinar', 'nameUrdu': 'کشمیر چنار',
        'meta': 'Hand Embroidery & Ivory Linen', 'tier': 'Atelier', 'gesture': 'curtain',
        'primary': '#2D4A3E', 'accent': '#CFA954', 'bg': '#F7F4EE', 'text': '#1F2923',
        'tagline': 'Sage, olive and lake blue hand-embroidery on pure ivory linen.',
        'audio': '/music/mu08ueox-229c3cea.mp3'
    },
    {
        'slug': 'baradari', 'id': 'mughal-baradari', 'name': 'Mughal Baradari', 'nameUrdu': 'مغل بارہ دری',
        'meta': 'Garden Pavilion & Forest Green', 'tier': 'Atelier', 'gesture': 'door_knock',
        'primary': '#1D3B2B', 'accent': '#D4AF37', 'bg': '#F5F2EB', 'text': '#19281F',
        'tagline': 'Ivory and deep forest green. Carved doors open onto a serene Mughal pavilion.',
        'audio': '/music/mu08wkik-948bb477.mp3'
    },
    {
        'slug': 'neelum', 'id': 'neelum-valley', 'name': 'Neelum Moorish', 'nameUrdu': 'نیلم مورِش',
        'meta': 'Sapphire Cobalt & Lemon Arch', 'tier': 'Cinematic', 'gesture': 'ribbon',
        'primary': '#1A365D', 'accent': '#E2B13C', 'bg': '#FAF8F5', 'text': '#102A43',
        'tagline': 'Sapphire cobalt and lemon yellow on warm cream with hand-painted Moorish tiles.',
        'audio': '/music/mu08ueox-229c3cea.mp3'
    },
    {
        'slug': 'gulaab', 'id': 'gulab-botanical', 'name': 'Gulaab Botanical', 'nameUrdu': 'گلاب نباتاتی',
        'meta': 'Burgundy Roses & Scratch Foil', 'tier': 'Atelier', 'gesture': 'wax_seal',
        'primary': '#5B1425', 'accent': '#CFA954', 'bg': '#FAF5F2', 'text': '#330B15',
        'tagline': 'Deep burgundy and olive botanical ink with shimmering rose gold medallion.',
        'audio': '/music/mu08wkik-948bb477.mp3'
    },
    {
        'slug': 'sahar', 'id': 'sahar-regency', 'name': 'Sahar Regency', 'nameUrdu': 'سحر ریجنسی',
        'meta': 'Powder Blue & Pearl Lace', 'tier': 'Cinematic', 'gesture': 'ribbon',
        'primary': '#2C4A6F', 'accent': '#D4AF37', 'bg': '#F4F7FB', 'text': '#1E324B',
        'tagline': 'Powder blue and pearl damask paper edged in delicate French lace.',
        'audio': '/music/mu08ueox-229c3cea.mp3'
    },
    {
        'slug': 'kaghaz', 'id': 'kaghaz-haveli', 'name': 'Kaghaz Haveli', 'nameUrdu': 'کاغذ حویلی',
        'meta': 'Cut Paper & 3D Shadow Layers', 'tier': 'Atelier', 'gesture': 'origami',
        'primary': '#1F3A52', 'accent': '#CFA954', 'bg': '#F8F6F0', 'text': '#16283B',
        'tagline': 'Hand-sculpted cut and folded paper haveli lit by ambient courtyard shadows.',
        'audio': '/music/mu08wkik-948bb477.mp3'
    },
    {
        'slug': 'qasr', 'id': 'qasr-e-khuld', 'name': 'Qasr-e-Khuld', 'nameUrdu': 'قصرِ خلد',
        'meta': 'Sage Green Palace & Chandelier', 'tier': 'Atelier', 'gesture': 'wax_seal',
        'primary': '#2B4234', 'accent': '#D4AF37', 'bg': '#F5F5ED', 'text': '#1E2F25',
        'tagline': 'Sage green and warm cream. Olive palace gates open onto chandeliers and drapes.',
        'audio': '/music/mu08ueox-229c3cea.mp3'
    },
    {
        'slug': 'firdaus', 'id': 'firdaus-medallion', 'name': 'Firdaus Medallion', 'nameUrdu': 'فردوس تمغہ',
        'meta': 'Bas Relief Roses & Gold Seal', 'tier': 'Atelier', 'gesture': 'wax_seal',
        'primary': '#4A2E18', 'accent': '#D4AF37', 'bg': '#F9F6F0', 'text': '#2C1B0E',
        'tagline': 'Cream paper, bas relief sculpted roses, and an authentic gold wax medallion.',
        'audio': '/music/mu08wkik-948bb477.mp3'
    },
    {
        'slug': 'gulkari', 'id': 'gulkari-chikankari', 'name': 'Gulkari Chikankari', 'nameUrdu': 'گلکاری چکن کاری',
        'meta': 'Ivory Lace Doors & Pearl Cameo', 'tier': 'Atelier', 'gesture': 'curtain',
        'primary': '#3E2F20', 'accent': '#CFA954', 'bg': '#FAF7F2', 'text': '#281E15',
        'tagline': 'Ivory lace and warm gold chikankari needlework with opening embroidered doors.',
        'audio': '/music/mu08ueox-229c3cea.mp3'
    },
    {
        'slug': 'moti-bagh', 'id': 'moti-bagh-silk', 'name': 'Moti Bagh', 'nameUrdu': 'موتی باغ',
        'meta': 'Pearl Beaded Curtains & Sage', 'tier': 'Atelier', 'gesture': 'curtain',
        'primary': '#314438', 'accent': '#CFA954', 'bg': '#F6F5F0', 'text': '#202D25',
        'tagline': 'Ivory, pearl and sage. Beaded pearl curtains part onto an illuminated royal banquet.',
        'audio': '/music/mu08wkik-948bb477.mp3'
    },
    {
        'slug': 'parda', 'id': 'parda-sultana', 'name': 'Parda-e-Sultana', 'nameUrdu': 'پردہ سلطانہ',
        'meta': 'Oxblood Velvet & Gilded Drapes', 'tier': 'Atelier', 'gesture': 'curtain',
        'primary': '#520B18', 'accent': '#E5C158', 'bg': '#1A0408', 'text': '#FFFDF9',
        'tagline': 'Deep oxblood ceremonial velvet drapes that draw apart with theatrical grandeur.',
        'audio': '/music/mu08ueox-229c3cea.mp3'
    },
    {
        'slug': 'saahil', 'id': 'saahil-breeze', 'name': 'Saahil Breeze', 'nameUrdu': 'ساحل نسیم',
        'meta': 'Warm Sand & Sea Glass Envelope', 'tier': 'Cinematic', 'gesture': 'wax_seal',
        'primary': '#2A4356', 'accent': '#CFA954', 'bg': '#F6F5F2', 'text': '#1D2E3B',
        'tagline': 'Warm coastal sand and sea glass blue. Wax-sealed envelope opening with coastal grace.',
        'audio': '/music/mu08wkik-948bb477.mp3'
    },
    {
        'slug': 'roshni', 'id': 'roshni-diya', 'name': 'Roshni Diya', 'nameUrdu': 'روشنی دیا',
        'meta': 'Press & Hold Brass Diya', 'tier': 'Atelier', 'gesture': 'diya',
        'primary': '#4D1D10', 'accent': '#FFAA33', 'bg': '#190A06', 'text': '#FFFDF8',
        'tagline': 'Press and hold the antique brass diya to light the flame and awaken the royal palace.',
        'audio': '/music/mu08ueox-229c3cea.mp3'
    },
    {
        'slug': 'bahaar', 'id': 'bahar-watercolor', 'name': 'Bahaar Botanical', 'nameUrdu': 'بہار گلزار',
        'meta': 'Lilac & Coastal Watercolour', 'tier': 'Cinematic', 'gesture': 'ribbon',
        'primary': '#43304F', 'accent': '#CFA954', 'bg': '#F8F5F9', 'text': '#2E1E38',
        'tagline': 'Soft lilac and coastal watercolour washes with gold foil borders.',
        'audio': '/music/mu08wkik-948bb477.mp3'
    },
    {
        'slug': 'gulbadan', 'id': 'gulbadan-zardozi', 'name': 'Gulbadan Zardozi', 'nameUrdu': 'گلبدن زردوزی',
        'meta': 'Ivory Silk & Rose Zardozi', 'tier': 'Atelier', 'gesture': 'curtain',
        'primary': '#5C1E2B', 'accent': '#D4AF37', 'bg': '#FAF5F2', 'text': '#381019',
        'tagline': 'Raw silk woven with pure gold zardozi wire and crimson rosebuds.',
        'audio': '/music/mu08ueox-229c3cea.mp3'
    },
    {
        'slug': 'dehleez', 'id': 'dehleez-haveli', 'name': 'Dehleez-e-Khas', 'nameUrdu': 'دہلیزِ خاص',
        'meta': 'Knock Three Times to Enter', 'tier': 'Atelier', 'gesture': 'door_knock',
        'primary': '#331F14', 'accent': '#D4AF37', 'bg': '#1F130B', 'text': '#FFFDF8',
        'tagline': 'Carved oak double doors. Knock three times with the brass knocker to enter the grand courtyard.',
        'audio': '/music/mu08wkik-948bb477.mp3'
    },
    {
        'slug': 'ajrak', 'id': 'ajrak-sindh', 'name': 'Ajrak Sindh', 'nameUrdu': 'اجرک سندھ',
        'meta': 'Sindhi Block Print & Indigo', 'tier': 'Atelier', 'gesture': 'curtain',
        'primary': '#1A2952', 'accent': '#B83232', 'bg': '#0F1833', 'text': '#FFFDF8',
        'tagline': 'Centuries of heritage block printing: indigo and madder red geometric fabric unfurling.',
        'audio': '/music/mu08ueox-229c3cea.mp3'
    },
    {
        'slug': 'aangan', 'id': 'aangan-jali', 'name': 'Aangan-e-Noor', 'nameUrdu': 'آنگنِ نور',
        'meta': 'Night Palace & Marble Jali', 'tier': 'Atelier', 'gesture': 'lantern',
        'primary': '#1E1B38', 'accent': '#D4AF37', 'bg': '#0E0C1C', 'text': '#FFFDF8',
        'tagline': 'Courtyard under starry night with illuminated white marble jali screens.',
        'audio': '/music/mu08ueox-229c3cea.mp3'
    },
    {
        'slug': 'sahil-e-rang', 'id': 'sahil-bougainvillea', 'name': 'Sahil-e-Rang', 'nameUrdu': 'ساحلِ رنگ',
        'meta': 'Cobalt & Hot Bougainvillea', 'tier': 'Cinematic', 'gesture': 'ribbon',
        'primary': '#1A3B66', 'accent': '#D92365', 'bg': '#F5F8FC', 'text': '#112540',
        'tagline': 'Mediterranean vibrancy meets Pakistani joy: Aegean cobalt draped in vivid bougainvillea.',
        'audio': '/music/mu08ueox-229c3cea.mp3'
    },
    {
        'slug': 'haveli', 'id': 'purani-haveli', 'name': 'Purani Haveli', 'nameUrdu': 'پرانی حویلی',
        'meta': 'Swing the Brass Lantern', 'tier': 'Cinematic', 'gesture': 'lantern',
        'primary': '#382215', 'accent': '#FFAA33', 'bg': '#1A1009', 'text': '#FFFDF8',
        'tagline': 'Gently swing the hanging brass lantern to cast warm light across the haveli terrace.',
        'audio': '/music/mu08wkik-948bb477.mp3'
    },
    {
        'slug': 'chandni', 'id': 'chandni-ripple', 'name': 'Chandni Lake', 'nameUrdu': 'چاندنی جھیل',
        'meta': 'Touch the Starlit Lotus Pool', 'tier': 'Cinematic', 'gesture': 'water_ripple',
        'primary': '#132238', 'accent': '#A5C4D4', 'bg': '#09121F', 'text': '#FFFDF9',
        'tagline': 'Touch the moonlit lotus pool to send crystal ripples across the tranquil water.',
        'audio': '/music/mu08ueox-229c3cea.mp3'
    },
    {
        'slug': 'chunri', 'id': 'chunri-mehndi', 'name': 'Chunri Bandhani', 'nameUrdu': 'چنری بندھنی',
        'meta': 'Draw the Silk Cloth Aside', 'tier': 'Cinematic', 'gesture': 'curtain',
        'primary': '#70102B', 'accent': '#E5A93C', 'bg': '#2B0610', 'text': '#FFFDF9',
        'tagline': 'Fuchsia and saffron bandhani silk cloth with gold gota borders, pulled aside on touch.',
        'audio': '/music/mu08ueox-229c3cea.mp3'
    },
    {
        'slug': 'farmaan', 'id': 'shahi-scroll', 'name': 'Shahi Farmaan', 'nameUrdu': 'شاہی فرمان',
        'meta': 'Unroll the Royal Proclamation', 'tier': 'Cinematic', 'gesture': 'scroll',
        'primary': '#422818', 'accent': '#D4AF37', 'bg': '#FAF5EB', 'text': '#2A170C',
        'tagline': 'Gold-finialled royal Mughal decree lying on aged vellum paper. Touch to unroll.',
        'audio': '/music/mu08ueox-229c3cea.mp3'
    },
    {
        'slug': 'dilkusha', 'id': 'dilkusha-palace', 'name': 'Dilkusha Palace', 'nameUrdu': 'دلکشا محل',
        'meta': 'Pale Gold & Palace Archway', 'tier': 'Cinematic', 'gesture': 'door_knock',
        'primary': '#3E3224', 'accent': '#CFA954', 'bg': '#FAF7F0', 'text': '#261F16',
        'tagline': 'Pale gold filigree and regal archways opening into the celebration terrace.',
        'audio': '/music/mu08wkik-948bb477.mp3'
    }
]

out_dir = '/Users/rohanalvi/Downloads/E-INVITATIONS/dawatna/public/templates'
os.makedirs(out_dir, exist_ok=True)

HTML_TEMPLATE = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>__NAME__ (__NAME_URDU__) | WedInvite.pk</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Montserrat:wght@300;400;500;600;700&family=Noto+Nastaliq+Urdu:wght@400;700&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
        body {
            background: __BG__;
            color: __TEXT_COLOR__;
            font-family: 'Montserrat', sans-serif;
            overflow-x: hidden;
            position: relative;
            min-height: 100vh;
        }
        .font-serif { font-family: 'Playfair Display', serif; }
        .font-cinzel { font-family: 'Cinzel', serif; }
        .font-urdu { font-family: 'Noto Nastaliq Urdu', serif; }
        
        #dustCanvas {
            position: fixed;
            inset: 0;
            pointer-events: none;
            z-index: 10;
        }

        .audio-toggle {
            position: fixed;
            bottom: 24px;
            right: 24px;
            z-index: 100;
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background: #CFA954;
            color: #2B211D;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 8px 24px rgba(0,0,0,0.4);
            cursor: pointer;
            border: 2px solid #FFFDF8;
            transition: transform 0.2s;
        }
        .audio-toggle:active { transform: scale(0.92); }

        .cover-screen {
            position: fixed;
            inset: 0;
            z-index: 999;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: opacity 0.8s ease, visibility 0.8s;
            cursor: pointer;
            overflow: hidden;
        }
        .cover-screen.opened {
            opacity: 0;
            visibility: hidden;
            pointer-events: none;
        }
        .gesture-prompt {
            font-family: 'Cinzel', serif;
            font-size: 15px;
            font-weight: 700;
            letter-spacing: 0.15em;
            text-transform: uppercase;
            color: #CFA954;
            margin-top: 20px;
            text-align: center;
        }
        .gesture-sub {
            font-size: 11px;
            color: rgba(255,255,255,0.7);
            letter-spacing: 0.08em;
            margin-top: 6px;
            text-align: center;
        }

        .diya-container {
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        .diya-halo {
            position: absolute;
            top: -20px;
            width: 140px;
            height: 140px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(255,170,51,0.6) 0%, transparent 70%);
            opacity: 0.2;
            transition: opacity 0.2s;
            pointer-events: none;
        }
        .diya-flame {
            width: 24px;
            height: 48px;
            background: linear-gradient(to top, #FFAA33, #FFF0B3);
            border-radius: 50% 50% 20% 20% / 80% 80% 20% 20%;
            filter: drop-shadow(0 0 12px #FFAA33);
            animation: flicker 1.8s infinite ease-in-out;
            transform-origin: bottom center;
            transition: transform 0.2s;
        }
        .diya-bowl {
            width: 76px;
            height: 28px;
            background: linear-gradient(135deg, #D4AF37, #8C6A1E);
            border-radius: 0 0 38px 38px;
            margin-top: 4px;
            border: 1px solid #FFE680;
            box-shadow: inset 0 -4px 8px rgba(0,0,0,0.5);
        }
        @keyframes flicker {
            0%, 100% { transform: scale(1) rotate(-1deg); }
            50% { transform: scale(1.06) rotate(1.5deg); }
        }

        .curtain-stage {
            position: absolute;
            inset: 0;
            display: flex;
        }
        .curtain {
            flex: 1;
            height: 100%;
            box-shadow: 0 0 30px rgba(0,0,0,0.8);
            transition: transform 1s cubic-bezier(0.77, 0, 0.175, 1);
        }
        .curtain-stage.parted .curtain-left { transform: translateX(-100%); }
        .curtain-stage.parted .curtain-right { transform: translateX(100%); }
        .curtain-center-prompt {
            position: absolute;
            inset: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 10;
        }
        .gold-crest { font-size: 36px; margin-bottom: 8px; }

        .doors-wrapper {
            position: absolute;
            inset: 0;
            display: flex;
            perspective: 1000px;
        }
        .door {
            flex: 1;
            height: 100%;
            background: #2D1A10;
            border: 4px solid #D4AF37;
            position: relative;
            transition: transform 1.2s cubic-bezier(0.77, 0, 0.175, 1);
            transform-origin: left center;
        }
        .door.door-right { transform-origin: right center; }
        .cover-screen.opened .door-left { transform: rotateY(-95deg); }
        .cover-screen.opened .door-right { transform: rotateY(95deg); }
        .knocker-assembly {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            display: flex;
            flex-direction: column;
            align-items: center;
            z-index: 20;
        }
        .knocker-ring {
            width: 60px;
            height: 60px;
            border: 6px solid #D4AF37;
            border-radius: 50%;
            transition: transform 0.15s;
        }
        .knocker-ring.knocking { transform: translateY(8px) scale(0.95); }
        .knocker-plate {
            width: 24px;
            height: 24px;
            background: #8C6A1E;
            border-radius: 50%;
            margin-top: -12px;
        }

        .wax-medallion {
            width: 80px;
            height: 80px;
            background: radial-gradient(circle, #D4AF37 0%, #8C6A1E 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #2B211D;
            font-family: 'Cinzel', serif;
            font-size: 32px;
            font-weight: 900;
            border: 3px solid #FFF0B3;
            box-shadow: 0 10px 25px rgba(0,0,0,0.5);
            margin: 0 auto;
            transition: transform 0.4s;
        }
        .wax-medallion.breaking { transform: scale(1.3) rotate(15deg); opacity: 0; }

        .scroll-wrap {
            width: 280px;
            background: #FAF5EB;
            color: #2B211D;
            padding: 30px 20px;
            border-radius: 8px;
            box-shadow: 0 20px 50px rgba(0,0,0,0.6);
            text-align: center;
            border: 2px solid #CFA954;
            transition: transform 0.6s ease;
        }
        .scroll-wrap.unrolling { transform: scaleY(1.3); opacity: 0; }
        .scroll-emblem { font-size: 40px; margin-bottom: 12px; }

        .card-stage {
            max-width: 480px;
            margin: 0 auto;
            padding: 24px 16px 80px;
            position: relative;
            z-index: 5;
        }
        .art-hero {
            width: 100%;
            aspect-ratio: 1/1;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 20px 45px rgba(0,0,0,0.3);
            border: 2px solid __ACCENT__;
            margin-bottom: 24px;
            position: relative;
            background: #111;
        }
        .art-hero img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
        }
        .bismillah {
            font-family: 'Noto Nastaliq Urdu', serif;
            font-size: 20px;
            color: __ACCENT__;
            text-align: center;
            margin: 16px 0 8px;
        }
        .tier-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 999px;
            font-size: 10px;
            font-weight: 700;
            letter-spacing: 0.15em;
            text-transform: uppercase;
            background: __ACCENT__;
            color: #2B211D;
            margin: 0 auto 12px;
        }
        .couple-names {
            text-align: center;
            margin-bottom: 16px;
        }
        .couple-names h1 {
            font-family: 'Playfair Display', serif;
            font-size: 34px;
            font-weight: 700;
            line-height: 1.15;
            color: __ACCENT__;
        }
        .couple-names .urdu-names {
            font-family: 'Noto Nastaliq Urdu', serif;
            font-size: 24px;
            color: __TEXT_COLOR__;
            margin-top: 8px;
        }
        .parents-wording {
            text-align: center;
            font-size: 12px;
            line-height: 1.8;
            color: __SUBTEXT_COLOR__;
            margin-bottom: 28px;
            padding: 0 12px;
        }

        .event-card {
            background: __CARD_BG__;
            border: 1px solid __CARD_BORDER__;
            border-radius: 16px;
            padding: 20px;
            margin-bottom: 16px;
            box-shadow: 0 8px 24px rgba(0,0,0,0.15);
            text-align: center;
        }
        .event-title {
            font-family: 'Cinzel', serif;
            font-size: 16px;
            font-weight: 700;
            letter-spacing: 0.1em;
            color: __ACCENT__;
            text-transform: uppercase;
            margin-bottom: 4px;
        }
        .event-urdu {
            font-family: 'Noto Nastaliq Urdu', serif;
            font-size: 14px;
            color: __SUBTEXT_COLOR__;
            margin-bottom: 12px;
        }
        .event-detail {
            font-size: 13px;
            margin-bottom: 6px;
            color: __TEXT_COLOR__;
        }
        .event-venue {
            font-size: 12px;
            color: __SUBTEXT_COLOR__;
            margin-bottom: 14px;
        }
        .btn-action {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 8px 16px;
            border-radius: 999px;
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            background: __ACCENT__;
            color: #2B211D;
            text-decoration: none;
            border: none;
            cursor: pointer;
            transition: all 0.2s;
        }
        .btn-action:hover { filter: brightness(1.1); transform: translateY(-1px); }

        .countdown-wrap {
            background: __CARD_BG__;
            border: 1px solid __CARD_BORDER__;
            border-radius: 16px;
            padding: 20px;
            margin-bottom: 20px;
            text-align: center;
        }
        .cd-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 8px;
            margin-top: 14px;
        }
        .cd-box {
            background: rgba(207,169,84,0.1);
            border: 1px solid __CARD_BORDER__;
            border-radius: 10px;
            padding: 10px 4px;
        }
        .cd-num {
            font-family: 'Playfair Display', serif;
            font-size: 22px;
            font-weight: 700;
            color: __ACCENT__;
        }
        .cd-label {
            font-size: 9px;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            color: __SUBTEXT_COLOR__;
        }

        .rsvp-box {
            background: __CARD_BG__;
            border: 1px solid __CARD_BORDER__;
            border-radius: 16px;
            padding: 24px 20px;
            margin-bottom: 24px;
            text-align: center;
        }
        .form-input {
            width: 100%;
            padding: 12px 14px;
            border-radius: 8px;
            border: 1px solid __CARD_BORDER__;
            background: rgba(0,0,0,0.1);
            color: __TEXT_COLOR__;
            font-family: inherit;
            font-size: 13px;
            margin-bottom: 12px;
            outline: none;
        }
        .rsvp-toggle {
            display: flex;
            gap: 8px;
            margin-bottom: 14px;
        }
        .rsvp-btn-opt {
            flex: 1;
            padding: 10px 8px;
            border-radius: 8px;
            border: 1px solid __CARD_BORDER__;
            background: transparent;
            color: __TEXT_COLOR__;
            font-size: 11px;
            font-weight: 600;
            cursor: pointer;
        }
        .rsvp-btn-opt.active {
            background: __ACCENT__;
            color: #2B211D;
            border-color: __ACCENT__;
        }

        .card-footer {
            text-align: center;
            padding-top: 24px;
            border-top: 1px solid __CARD_BORDER__;
        }
        .card-footer a {
            color: __ACCENT__;
            text-decoration: none;
            font-weight: 700;
            letter-spacing: 0.1em;
            font-size: 12px;
            text-transform: uppercase;
        }
        .card-footer p {
            font-size: 10px;
            color: __SUBTEXT_COLOR__;
            margin-top: 6px;
        }
    </style>
</head>
<body>
    <canvas id="dustCanvas"></canvas>

    <audio id="bgMusic" loop preload="auto">
        <source src="__AUDIO__" type="audio/mp3">
    </audio>

    <button class="audio-toggle" id="audioToggle" aria-label="Toggle Audio">
        <svg id="musicIcon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 18V5l12-2v13"></path>
            <circle cx="6" cy="18" r="3"></circle>
            <circle cx="18" cy="16" r="3"></circle>
        </svg>
    </button>

    <!-- PHYSICAL ENTRANCE GESTURE -->
    __GESTURE_HTML__

    <!-- MAIN INVITATION CARD -->
    <div class="card-stage">
        <div class="art-hero">
            <img src="__THUMB_PATH__" alt="__NAME__">
        </div>

        <div class="bismillah">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>
        <div style="text-align:center;">
            <span class="tier-badge">__TIER__ Edition · __META__</span>
        </div>

        <div class="couple-names">
            <h1>Hamza & Ayesha</h1>
            <div class="urdu-names">حمزہ اور عائشہ</div>
        </div>

        <p class="parents-wording">
            Together with Mr. & Mrs. Tariq Mahmood Chaudhry<br>
            and Mr. & Mrs. Salman Farooq Khan<br>
            request the honour of your presence at the wedding celebrations of their beloved children.
        </p>

        <!-- LIVE COUNTDOWN -->
        <div class="countdown-wrap">
            <div style="font-size:11px; font-weight:700; letter-spacing:0.15em; text-transform:uppercase; color:__ACCENT__;">
                The Big Celebration In
            </div>
            <div class="cd-grid">
                <div class="cd-box"><div class="cd-num" id="days">48</div><div class="cd-label">Days</div></div>
                <div class="cd-box"><div class="cd-num" id="hours">14</div><div class="cd-label">Hours</div></div>
                <div class="cd-box"><div class="cd-num" id="mins">32</div><div class="cd-label">Mins</div></div>
                <div class="cd-box"><div class="cd-num" id="secs">19</div><div class="cd-label">Secs</div></div>
            </div>
        </div>

        <!-- EVENTS SCHEDULE -->
        <div class="event-card">
            <div class="event-title">Mehndi & Sangeet</div>
            <div class="event-urdu">مَہندی اور سنگِیت</div>
            <div class="event-detail">Friday, 18 December 2026 · 8:00 PM</div>
            <div class="event-venue">Royal Palm Golf & Country Club, Lahore</div>
            <a href="https://maps.google.com" target="_blank" class="btn-action">📍 View Map & Directions</a>
        </div>

        <div class="event-card">
            <div class="event-title">Barat & Nikah</div>
            <div class="event-urdu">بَارات اور نِکاح</div>
            <div class="event-detail">Saturday, 19 December 2026 · 7:30 PM</div>
            <div class="event-venue">Pearl Continental Grand Ballroom, Lahore</div>
            <a href="https://maps.google.com" target="_blank" class="btn-action">📍 View Map & Directions</a>
        </div>

        <div class="event-card">
            <div class="event-title">Walima Reception</div>
            <div class="event-urdu">وَلیمہ ریسیپشن</div>
            <div class="event-detail">Sunday, 20 December 2026 · 8:00 PM</div>
            <div class="event-venue">Mughal Haveli, Fort Road, Lahore</div>
            <a href="https://maps.google.com" target="_blank" class="btn-action">📍 View Map & Directions</a>
        </div>

        <!-- RSVP -->
        <div class="rsvp-box">
            <div style="font-family:'Cinzel',serif; font-size:15px; font-weight:700; color:__ACCENT__; margin-bottom:12px; text-transform:uppercase;">
                RSVP & Confirmation
            </div>
            <p style="font-size:12px; color:__SUBTEXT_COLOR__; margin-bottom:16px;">
                Kindly respond by 1st December to assist us with guest seating.
            </p>
            <input type="text" id="guestName" class="form-input" placeholder="Your Family / Guest Name" value="Chaudhry Aslam & Family">
            <div class="rsvp-toggle">
                <button type="button" class="rsvp-btn-opt active" id="btnAccept" onclick="setRsvp('attending')">Attending with Joy</button>
                <button type="button" class="rsvp-btn-opt" id="btnRegret" onclick="setRsvp('regret')">Regretfully Decline</button>
            </div>
            <button type="button" class="btn-action" style="width:100%; justify-content:center; padding:12px;" onclick="submitRsvp()">
                Send RSVP via WhatsApp 💬
            </button>
        </div>

        <!-- FOOTER -->
        <div class="card-footer">
            <a href="https://wedinvite.pk">WedInvite.pk</a>
            <p>Pakistan's Luxury Digital Wedding Invitation Platform</p>
        </div>
    </div>

    <script>
        const audio = document.getElementById('bgMusic');
        const audioBtn = document.getElementById('audioToggle');
        let isPlaying = false;
        
        function playMusic() {
            if (!isPlaying) {
                audio.play().then(() => {
                    isPlaying = true;
                }).catch(() => {});
            }
        }

        audioBtn.addEventListener('click', () => {
            if (isPlaying) {
                audio.pause();
                isPlaying = false;
                audioBtn.style.opacity = '0.5';
            } else {
                audio.play();
                isPlaying = true;
                audioBtn.style.opacity = '1';
            }
        });

        __GESTURE_JS__

        const weddingDate = new Date('2026-12-19T19:30:00+05:00').getTime();
        setInterval(() => {
            const now = new Date().getTime();
            const dist = weddingDate - now;
            if (dist > 0) {
                document.getElementById('days').textContent = Math.floor(dist / (1000 * 60 * 60 * 24));
                document.getElementById('hours').textContent = Math.floor((dist % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                document.getElementById('mins').textContent = Math.floor((dist % (1000 * 60 * 60)) / (1000 * 60));
                document.getElementById('secs').textContent = Math.floor((dist % (1000 * 60)) / 1000);
            }
        }, 1000);

        let currentStatus = 'attending';
        function setRsvp(s) {
            currentStatus = s;
            document.getElementById('btnAccept').classList.toggle('active', s === 'attending');
            document.getElementById('btnRegret').classList.toggle('active', s === 'regret');
        }

        function submitRsvp() {
            const name = document.getElementById('guestName').value || 'Guest';
            const msg = `Salam Hamza & Ayesha! ${name} will be ${currentStatus === 'attending' ? 'joining with joy for the celebrations!' : 'unable to attend in person but sending heartfelt prayers.'}`;
            const url = `https://wa.me/923001234567?text=${encodeURIComponent(msg)}`;
            window.open(url, '_blank');
        }

        const canvas = document.getElementById('dustCanvas');
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;
        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });
        const particles = Array.from({length: 30}, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            size: Math.random() * 2 + 1,
            speedY: Math.random() * 0.4 + 0.1,
            speedX: (Math.random() - 0.5) * 0.2,
            opacity: Math.random() * 0.6 + 0.2
        }));
        function animateDust() {
            ctx.clearRect(0, 0, width, height);
            ctx.fillStyle = '__ACCENT__';
            particles.forEach(p => {
                p.y -= p.speedY;
                p.x += p.speedX;
                if (p.y < 0) p.y = height;
                if (p.x < 0) p.x = width;
                if (p.x > width) p.x = 0;
                ctx.globalAlpha = p.opacity;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
            });
            requestAnimationFrame(animateDust);
        }
        animateDust();
    </script>
</body>
</html>"""

def get_gesture_markup(d):
    if d['gesture'] == 'diya':
        html = f"""
        <div id="cover" class="cover-screen" style="background: radial-gradient(circle at center, #2B1209 0%, {d['bg']} 100%);">
            <div class="diya-container">
                <div class="diya-halo" id="diyaHalo"></div>
                <div class="diya-flame" id="diyaFlame"></div>
                <div class="diya-bowl"></div>
                <div class="gesture-prompt" id="promptText">Touch & Hold the Diya</div>
                <div class="gesture-sub">To illuminate the royal invitation</div>
            </div>
        </div>
        """
        js = """
        const cover = document.getElementById('cover');
        const flame = document.getElementById('diyaFlame');
        const halo = document.getElementById('diyaHalo');
        const prompt = document.getElementById('promptText');
        let timer = null, progress = 0;
        
        function startHold(e) {
            e.preventDefault();
            timer = setInterval(() => {
                progress += 10;
                flame.style.transform = `scale(${1 + progress/50})`;
                halo.style.opacity = progress/100;
                prompt.textContent = `Awakening... ${progress}%`;
                if (progress >= 100) {
                    clearInterval(timer);
                    playMusic();
                    cover.classList.add('opened');
                }
            }, 80);
        }
        function cancelHold() {
            if (progress < 100) {
                clearInterval(timer);
                progress = 0;
                flame.style.transform = 'scale(1)';
                halo.style.opacity = '0.2';
                prompt.textContent = 'Touch & Hold the Diya';
            }
        }
        cover.addEventListener('mousedown', startHold);
        cover.addEventListener('touchstart', startHold, {passive:false});
        window.addEventListener('mouseup', cancelHold);
        window.addEventListener('touchend', cancelHold);
        """
        return html, js
    elif d['gesture'] == 'door_knock':
        html = f"""
        <div id="cover" class="cover-screen" style="background: {d['bg']};">
            <div class="doors-wrapper" id="doorsWrap">
                <div class="door door-left"></div>
                <div class="door door-right"></div>
                <div class="knocker-assembly" id="knocker">
                    <div class="knocker-ring" id="knockerRing"></div>
                    <div class="knocker-plate"></div>
                    <div class="gesture-prompt" id="promptText">Knock 3 Times</div>
                    <div class="gesture-sub">To enter the private ceremony</div>
                </div>
            </div>
        </div>
        """
        js = """
        let knocks = 0;
        const knocker = document.getElementById('knocker');
        const ring = document.getElementById('knockerRing');
        const prompt = document.getElementById('promptText');
        const cover = document.getElementById('cover');
        
        knocker.addEventListener('click', () => {
            knocks++;
            ring.classList.add('knocking');
            setTimeout(() => ring.classList.remove('knocking'), 300);
            if (knocks < 3) {
                prompt.textContent = `Knock again (${knocks}/3)`;
            } else {
                prompt.textContent = 'Opening Haveli Gates...';
                playMusic();
                setTimeout(() => {
                    cover.classList.add('opened');
                }, 400);
            }
        });
        """
        return html, js
    elif d['gesture'] == 'wax_seal':
        html = f"""
        <div id="cover" class="cover-screen" style="background: {d['bg']};">
            <div class="envelope-wrap" style="text-align:center;">
                <div class="wax-medallion" id="waxSeal">
                    W
                </div>
                <div class="gesture-prompt">Break the Royal Wax Seal</div>
                <div class="gesture-sub">Tap to open private invitation</div>
            </div>
        </div>
        """
        js = """
        const seal = document.getElementById('waxSeal');
        const cover = document.getElementById('cover');
        seal.addEventListener('click', () => {
            seal.classList.add('breaking');
            playMusic();
            setTimeout(() => {
                cover.classList.add('opened');
            }, 500);
        });
        """
        return html, js
    elif d['gesture'] == 'scroll':
        html = f"""
        <div id="cover" class="cover-screen" style="background: {d['bg']};">
            <div class="scroll-wrap" id="scrollWrap">
                <div class="scroll-emblem">📜</div>
                <div class="gesture-prompt">Unroll Royal Farmaan</div>
                <div class="gesture-sub">Tap to unfurl the proclamation</div>
            </div>
        </div>
        """
        js = """
        const scroll = document.getElementById('scrollWrap');
        const cover = document.getElementById('cover');
        scroll.addEventListener('click', () => {
            scroll.classList.add('unrolling');
            playMusic();
            setTimeout(() => {
                cover.classList.add('opened');
            }, 600);
        });
        """
        return html, js
    else: # curtain
        html = f"""
        <div id="cover" class="cover-screen" style="background: {d['bg']};">
            <div class="curtain-stage" id="curtainStage">
                <div class="curtain curtain-left" style="background: linear-gradient(90deg, #1A0307 0%, {d['primary']} 50%, #1A0307 100%);"></div>
                <div class="curtain curtain-right" style="background: linear-gradient(90deg, #1A0307 0%, {d['primary']} 50%, #1A0307 100%);"></div>
                <div class="curtain-center-prompt">
                    <div class="gold-crest">⚜️</div>
                    <div class="gesture-prompt">Part the Royal Velvet</div>
                    <div class="gesture-sub">Tap to unveil the celebration</div>
                </div>
            </div>
        </div>
        """
        js = """
        const stage = document.getElementById('curtainStage');
        const cover = document.getElementById('cover');
        stage.addEventListener('click', () => {
            stage.classList.add('parted');
            playMusic();
            setTimeout(() => {
                cover.classList.add('opened');
            }, 700);
        });
        """
        return html, js

count = 0
for d in designs:
    is_dark = d['bg'].startswith('#1') or d['bg'].startswith('#0') or d['bg'].startswith('#2')
    card_bg = '#1F1410' if is_dark else '#FFFFFF'
    card_border = 'rgba(212,175,55,0.3)' if is_dark else '#EAE1D5'
    text_color = '#FFFDF8' if is_dark else '#2B211D'
    subtext_color = 'rgba(255,253,248,0.7)' if is_dark else '#6B584E'
    thumb_path = f"/atelier/thumbs/thumb-{d['slug']}-480.webp"
    
    gesture_html, gesture_js = get_gesture_markup(d)
    
    html = HTML_TEMPLATE
    html = html.replace('__NAME__', d['name'])
    html = html.replace('__NAME_URDU__', d['nameUrdu'])
    html = html.replace('__BG__', d['bg'])
    html = html.replace('__PRIMARY__', d['primary'])
    html = html.replace('__ACCENT__', d['accent'])
    html = html.replace('__TEXT_COLOR__', text_color)
    html = html.replace('__SUBTEXT_COLOR__', subtext_color)
    html = html.replace('__CARD_BG__', card_bg)
    html = html.replace('__CARD_BORDER__', card_border)
    html = html.replace('__THUMB_PATH__', thumb_path)
    html = html.replace('__TIER__', d['tier'])
    html = html.replace('__META__', d['meta'])
    html = html.replace('__AUDIO__', d['audio'])
    html = html.replace('__GESTURE_HTML__', gesture_html)
    html = html.replace('__GESTURE_JS__', gesture_js)
    
    p1 = os.path.join(out_dir, f"{d['slug']}.html")
    p2 = os.path.join(out_dir, f"{d['id']}.html")
    with open(p1, 'w') as f:
        f.write(html)
    with open(p2, 'w') as f:
        f.write(html)
    count += 1

print(f"Generated {count} standalone templates successfully into {out_dir}")
