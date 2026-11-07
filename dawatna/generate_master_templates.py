import os

TEMPLATES_DIR = "/Users/rohanalvi/Downloads/E-INVITATIONS/dawatna/public/templates"

TEMPLATE_BASE = """<!DOCTYPE html>
<html lang="en" class="wedinvite-html">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
    <title>__TITLE__ (__TITLE_UR__) | WedInvite.pk</title>
    
    <!-- Premium Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Montserrat:wght@300;400;500;600;700&family=Noto+Nastaliq+Urdu:wght@400;700&display=swap" rel="stylesheet">

    <style>
        :root {
            --primary: __PRIMARY__;
            --gold: __GOLD__;
            --gold-light: #F6E2AA;
            --gold-dark: #A67C1E;
            --bg-dark: #0D0709;
            --text-light: #FDFBF7;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            -webkit-tap-highlight-color: transparent;
        }

        body {
            background: __BG_GRADIENT__;
            color: var(--text-light);
            font-family: 'Montserrat', sans-serif;
            min-height: 100vh;
            overflow-x: hidden;
            position: relative;
        }

        .font-serif { font-family: 'Playfair Display', serif; }
        .font-cinzel { font-family: 'Cinzel', serif; }
        .font-urdu { font-family: 'Noto Nastaliq Urdu', serif; }

        /* Gold Foil Shimmer */
        .gold-shimmer {
            background: linear-gradient(135deg, #BF953F 0%, #FCF6BA 25%, #B38728 50%, #FBF5B7 75%, #AA771C 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .gold-border {
            border: 1px solid rgba(212, 175, 55, 0.35);
            box-shadow: 0 4px 20px rgba(0,0,0,0.4), inset 0 0 15px rgba(212, 175, 55, 0.08);
        }

        /* Canvas Particle Layer */
        #particleCanvas {
            position: fixed;
            inset: 0;
            pointer-events: none;
            z-index: 10;
        }

        /* Floating Audio Vinyl Disc */
        .audio-disc {
            position: fixed;
            bottom: 24px;
            right: 24px;
            z-index: 100;
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background: radial-gradient(circle, #2A1F13 20%, #150E09 60%, var(--gold) 100%);
            border: 2px solid var(--gold);
            box-shadow: 0 8px 30px rgba(0,0,0,0.8), 0 0 15px rgba(212, 175, 55, 0.4);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: transform 0.3s;
        }
        .audio-disc.playing {
            animation: spinDisc 4s linear infinite;
        }
        @keyframes spinDisc {
            100% { transform: rotate(360deg); }
        }

        /* ========================================================
           ENTRANCE GESTURES (GOOGLE FLOW PHYSICS)
           ======================================================== */
        .entrance-overlay {
            position: fixed;
            inset: 0;
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            background: #000;
            transition: opacity 1s cubic-bezier(0.16, 1, 0.3, 1), visibility 1s;
        }
        .entrance-overlay.opened {
            opacity: 0;
            visibility: hidden;
            pointer-events: none;
        }

        /* 1. DUAL VELVET DRAPES */
        .curtain-panel {
            position: absolute;
            top: 0;
            bottom: 0;
            width: 52%;
            background: linear-gradient(135deg, #4A0812 0%, #7A0C1E 40%, #30050B 100%);
            box-shadow: 0 0 50px rgba(0,0,0,0.9);
            transition: transform 1.2s cubic-bezier(0.16, 1, 0.3, 1);
            z-index: 2;
        }
        .curtain-left {
            left: 0;
            border-right: 2px solid var(--gold);
        }
        .curtain-right {
            right: 0;
            border-left: 2px solid var(--gold);
        }
        .curtain-panel::after {
            content: '';
            position: absolute;
            inset: 0;
            background: repeating-linear-gradient(90deg, rgba(0,0,0,0.2) 0px, rgba(0,0,0,0.2) 20px, transparent 20px, transparent 40px);
        }
        .entrance-overlay.parting .curtain-left {
            transform: translateX(-105%);
        }
        .entrance-overlay.parting .curtain-right {
            transform: translateX(105%);
        }

        /* 2. ENTRANCE CENTER SEAL & BADGE */
        .entrance-badge {
            position: relative;
            z-index: 10;
            text-align: center;
            padding: 36px 28px;
            background: rgba(18, 10, 12, 0.92);
            border: 2px solid var(--gold);
            border-radius: 28px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.9), 0 0 30px rgba(212, 175, 55, 0.3);
            backdrop-filter: blur(12px);
            max-width: 90%;
            width: 360px;
            cursor: pointer;
            transition: transform 0.3s, box-shadow 0.3s;
        }
        .entrance-badge:active {
            transform: scale(0.97);
        }

        .seal-icon {
            width: 72px;
            height: 72px;
            margin: 0 auto 16px;
            background: radial-gradient(circle, #D4AF37 0%, #8C6A18 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 6px 20px rgba(212, 175, 55, 0.5);
            font-size: 28px;
            color: #1A0D08;
            animation: pulseGlow 2.5s infinite;
        }
        @keyframes pulseGlow {
            0%, 100% { transform: scale(1); box-shadow: 0 0 20px rgba(212, 175, 55, 0.4); }
            50% { transform: scale(1.05); box-shadow: 0 0 35px rgba(212, 175, 55, 0.7); }
        }

        .open-btn {
            margin-top: 18px;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: linear-gradient(135deg, #D4AF37, #F59E0B);
            color: #000;
            font-weight: 800;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 2px;
            padding: 12px 24px;
            border-radius: 999px;
            border: none;
            cursor: pointer;
            box-shadow: 0 6px 20px rgba(0,0,0,0.5);
        }

        /* ========================================================
           LIVING WEDDING CARD CONTENT
           ======================================================== */
        .card-container {
            max-width: 520px;
            margin: 0 auto;
            padding: 40px 20px 100px;
            position: relative;
            z-index: 5;
        }

        .section-box {
            background: rgba(22, 14, 16, 0.85);
            border: 1px solid rgba(212, 175, 55, 0.3);
            border-radius: 24px;
            padding: 28px 22px;
            margin-bottom: 24px;
            backdrop-filter: blur(8px);
            box-shadow: 0 15px 40px rgba(0,0,0,0.5);
            text-align: center;
            position: relative;
            overflow: hidden;
        }
        .section-box::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 2px;
            background: linear-gradient(90deg, transparent, var(--gold), transparent);
        }

        /* Event Cards */
        .event-card {
            background: rgba(35, 20, 24, 0.7);
            border: 1px solid rgba(212, 175, 55, 0.25);
            border-radius: 18px;
            padding: 20px;
            margin-top: 14px;
            text-align: left;
            position: relative;
        }
        .event-tag {
            display: inline-block;
            background: var(--gold);
            color: #1A0D08;
            font-size: 10px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            padding: 4px 10px;
            border-radius: 6px;
            margin-bottom: 8px;
        }

        /* Raast & Action Buttons */
        .raast-btn {
            width: 100%;
            background: linear-gradient(135deg, #0A5C36, #108A52);
            color: #fff;
            border: 1px solid #25D366;
            padding: 14px;
            border-radius: 14px;
            font-weight: 700;
            font-size: 13px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            cursor: pointer;
            margin-top: 12px;
            transition: transform 0.2s;
        }
        .raast-btn:active { transform: scale(0.97); }

        .maps-btn {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            background: rgba(255,255,255,0.08);
            border: 1px solid rgba(255,255,255,0.2);
            color: #fff;
            padding: 8px 14px;
            border-radius: 10px;
            font-size: 11px;
            font-weight: 600;
            text-decoration: none;
            margin-top: 10px;
        }

        /* Countdown Grid */
        .countdown-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 8px;
            margin-top: 16px;
        }
        .countdown-item {
            background: rgba(0,0,0,0.5);
            border: 1px solid rgba(212, 175, 55, 0.2);
            border-radius: 12px;
            padding: 10px 4px;
        }
        .countdown-num {
            font-family: 'Cinzel', serif;
            font-size: 22px;
            font-weight: 700;
            color: var(--gold);
        }
        .countdown-lbl {
            font-size: 9px;
            text-transform: uppercase;
            color: rgba(255,255,255,0.6);
            letter-spacing: 1px;
        }
    </style>
</head>
<body>

    <!-- Canvas Particle Background -->
    <canvas id="particleCanvas"></canvas>

    <!-- Background Shehnai Audio -->
    <audio id="bgMusic" loop preload="auto">
        <source src="https://cdn.pixabay.com/download/audio/2022/03/15/audio_248fa16086.mp3?filename=indian-flute-and-sitar-relaxing-music-10823.mp3" type="audio/mp3">
    </audio>

    <!-- Floating Audio Toggle -->
    <div class="audio-disc" id="audioToggle" title="Toggle Shehnai Music">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" stroke-width="2">
            <path d="M9 18V5l12-2v13"></path>
            <circle cx="6" cy="18" r="3"></circle>
            <circle cx="18" cy="16" r="3"></circle>
        </svg>
    </div>

    <!-- ========================================================
         SIGNATURE ENTRANCE GESTURE (GOOGLE FLOW)
         ======================================================== -->
    <div class="entrance-overlay" id="entranceOverlay">
        <div class="curtain-panel curtain-left"></div>
        <div class="curtain-panel curtain-right"></div>

        <div class="entrance-badge" id="entranceTrigger">
            <div class="seal-icon">✦</div>
            <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: var(--gold); font-weight: 600;">
                Royal Wedding Invitation
            </div>
            
            <h2 class="font-serif gold-shimmer" style="font-size: 26px; margin: 8px 0;">
                <span class="groom-text">Ahmad</span> & <span class="bride-text">Mawra</span>
            </h2>

            <div class="font-urdu" style="font-size: 18px; color: #ECD29A; margin-bottom: 12px;">
                احمد اور ماورہ
            </div>

            <!-- Personalized Guest Tag if provided -->
            <div id="guestBadge" style="display: none; background: rgba(212, 175, 55, 0.15); border: 1px solid var(--gold); border-radius: 999px; padding: 6px 14px; font-size: 11px; margin-bottom: 14px; color: #FFF;">
                Specially Reserved for <strong id="guestNameText">Ch. Aslam</strong> (<span id="guestSeatsText">4</span> Seats)
            </div>

            <button class="open-btn">
                <span>__GESTURE_LABEL__</span>
                <span>→</span>
            </button>
        </div>
    </div>

    <!-- ========================================================
         MAIN INVITATION CARD
         ======================================================== -->
    <div class="card-container">

        <!-- Header Calligraphy -->
        <div class="section-box">
            <div class="font-urdu" style="font-size: 28px; color: var(--gold); margin-bottom: 8px;">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </div>
            <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: rgba(255,255,255,0.7); margin-bottom: 16px;">
                Under the Divine Blessings of Allah Almighty
            </div>

            <h1 class="font-serif gold-shimmer" style="font-size: 38px; line-height: 1.15; margin-bottom: 6px;">
                <span class="groom-text">Ahmad</span>
            </h1>
            <div style="font-size: 18px; color: var(--gold); margin: 4px 0;">&</div>
            <h1 class="font-serif gold-shimmer" style="font-size: 38px; line-height: 1.15; margin-bottom: 16px;">
                <span class="bride-text">Mawra</span>
            </h1>

            <div class="font-urdu" style="font-size: 22px; color: #ECD29A; margin-bottom: 14px;">
                <span class="groom-text">احمد</span> اور <span class="bride-text">ماورہ</span>
            </div>

            <p style="font-size: 12px; color: rgba(255,255,255,0.8); line-height: 1.7; font-style: italic;">
                "And among His signs is that He created for you mates from among yourselves, that you may dwell in tranquility with them, and He has put love and mercy between your hearts."
                <br><span style="font-size: 10px; color: var(--gold); font-weight: 600;">(Surah Ar-Rum: 21)</span>
            </p>
        </div>

        <!-- Live Countdown Timer -->
        <div class="section-box">
            <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: var(--gold); font-weight: 700;">
                Counting Down to Barat & Walima
            </div>
            <div class="countdown-grid">
                <div class="countdown-item">
                    <div class="countdown-num" id="days">14</div>
                    <div class="countdown-lbl">Days</div>
                </div>
                <div class="countdown-item">
                    <div class="countdown-num" id="hours">08</div>
                    <div class="countdown-lbl">Hours</div>
                </div>
                <div class="countdown-item">
                    <div class="countdown-num" id="mins">45</div>
                    <div class="countdown-lbl">Mins</div>
                </div>
                <div class="countdown-item">
                    <div class="countdown-num" id="secs">30</div>
                    <div class="countdown-lbl">Secs</div>
                </div>
            </div>
        </div>

        <!-- Multi-Event Itinerary -->
        <div class="section-box">
            <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: var(--gold); font-weight: 700; margin-bottom: 4px;">
                Wedding Functions
            </div>
            <div class="font-urdu" style="font-size: 16px; color: #ECD29A; margin-bottom: 14px;">
                تقاریب کے شیڈول
            </div>

            <!-- Event 1: Mehndi -->
            <div class="event-card">
                <span class="event-tag">Mehndi & Sangeet</span>
                <h3 class="font-serif" style="font-size: 18px; color: #FFF;">Jashan-e-Bahaar Mehndi</h3>
                <div style="font-size: 12px; color: var(--gold); margin: 4px 0;">Friday, 20 November 2026 · 7:00 PM</div>
                <div style="font-size: 11px; color: rgba(255,255,255,0.7);">The Orchard Marquee, Bedian Road, Lahore</div>
                <div style="font-size: 11px; color: #ECD29A; margin-top: 4px;">Dress Code: Vibrant Mustard & Emerald</div>
                <a href="https://maps.google.com" target="_blank" class="maps-btn">📍 1-Tap Google Maps</a>
            </div>

            <!-- Event 2: Barat -->
            <div class="event-card">
                <span class="event-tag" style="background: #E53E3E; color: #FFF;">Barat & Nikah</span>
                <h3 class="font-serif" style="font-size: 18px; color: #FFF;">Shahi Darbar Barat</h3>
                <div style="font-size: 12px; color: var(--gold); margin: 4px 0;">Saturday, 21 November 2026 · 8:00 PM</div>
                <div style="font-size: 11px; color: rgba(255,255,255,0.7);">Royal Palm Golf & Country Club, Babar Hall, Lahore</div>
                <div style="font-size: 11px; color: #ECD29A; margin-top: 4px;">Dress Code: Traditional Royal Formal</div>
                <a href="https://maps.google.com" target="_blank" class="maps-btn">📍 1-Tap Google Maps</a>
            </div>

            <!-- Event 3: Walima -->
            <div class="event-card">
                <span class="event-tag" style="background: #3182CE; color: #FFF;">Walima Reception</span>
                <h3 class="font-serif" style="font-size: 18px; color: #FFF;">Grand Walima Dinner</h3>
                <div style="font-size: 12px; color: var(--gold); margin: 4px 0;">Sunday, 22 November 2026 · 8:00 PM</div>
                <div style="font-size: 11px; color: rgba(255,255,255,0.7);">The Nishat Hotel Grand Ballroom, Emporium, Lahore</div>
                <div style="font-size: 11px; color: #ECD29A; margin-top: 4px;">Dress Code: Black Tie / Tuxedo / Pastel Silk</div>
                <a href="https://maps.google.com" target="_blank" class="maps-btn">📍 1-Tap Google Maps</a>
            </div>
        </div>

        <!-- State Bank Raast Digital Salami -->
        <div class="section-box">
            <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: var(--gold); font-weight: 700;">
                Digital Salami · سلامی
            </div>
            <p style="font-size: 11px; color: rgba(255,255,255,0.7); margin-top: 6px;">
                For overseas relatives and friends wishing to present blessings directly via State Bank Raast Instant Transfer:
            </p>

            <div style="background: rgba(0,0,0,0.6); border: 1px solid rgba(212, 175, 55, 0.3); border-radius: 14px; padding: 14px; margin-top: 14px; text-align: left;">
                <div style="font-size: 10px; color: rgba(255,255,255,0.5); text-transform: uppercase;">Bank & Raast ID</div>
                <div style="font-size: 14px; font-weight: 700; color: #FFF; font-family: monospace; margin: 4px 0;">03014544411</div>
                <div style="font-size: 11px; color: var(--gold);">Title: WEDINVITE DIGITAL (Meezan Bank)</div>
            </div>

            <button class="raast-btn" id="copyRaastBtn">
                <span>📋 Copy Raast ID (03014544411)</span>
            </button>
        </div>

        <!-- RSVP & Headcount Module -->
        <div class="section-box">
            <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: var(--gold); font-weight: 700;">
                RSVP Confirmation
            </div>
            <div class="font-urdu" style="font-size: 16px; color: #ECD29A; margin: 4px 0 12px;">
                جواب طلب (حاضری کی تصدیق)
            </div>

            <div id="rsvpForm">
                <p style="font-size: 12px; color: rgba(255,255,255,0.8); margin-bottom: 14px;">
                    Kindly confirm your attendance so we may reserve your seats and dinner arrangements accordingly:
                </p>

                <div style="display: flex; gap: 8px; margin-bottom: 14px;">
                    <button type="button" class="raast-btn" style="background: #25D366; margin: 0;" onclick="submitRsvp(true)">
                        ✓ Attending with Joy
                    </button>
                    <button type="button" class="raast-btn" style="background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.3); margin: 0;" onclick="submitRsvp(false)">
                        ✕ Regretfully Cannot
                    </button>
                </div>
            </div>

            <div id="rsvpConfirmed" style="display: none; background: rgba(37, 211, 102, 0.15); border: 1px solid #25D366; border-radius: 12px; padding: 16px; color: #25D366; font-weight: 600; font-size: 13px;">
                ✓ Shukriya! Your RSVP has been confirmed. We look forward to celebrating with you!
            </div>
        </div>

        <!-- Footer -->
        <div style="text-align: center; font-size: 11px; color: rgba(255,255,255,0.4); margin-top: 30px;">
            Created with elegance by <strong style="color: var(--gold);">WedInvite.pk</strong>
            <br>Living Digital Wedding Invitations for Pakistan
        </div>

    </div>

    <!-- Interactive Script -->
    <script>
        // 1. Read Query Parameters for Dynamic Data
        const params = new URLSearchParams(window.location.search);
        const groom = params.get('groom') || 'Ahmad';
        const bride = params.get('bride') || 'Mawra';
        const guest = params.get('guest');
        const seats = params.get('seats');

        document.querySelectorAll('.groom-text').forEach(el => el.textContent = groom);
        document.querySelectorAll('.bride-text').forEach(el => el.textContent = bride);

        if (guest) {
            const gb = document.getElementById('guestBadge');
            if (gb) {
                gb.style.display = 'inline-block';
                document.getElementById('guestNameText').textContent = guest;
                if (seats) document.getElementById('guestSeatsText').textContent = seats;
            }
        }

        // 2. Entrance Gesture Opening (Google Flow Physics)
        const overlay = document.getElementById('entranceOverlay');
        const trigger = document.getElementById('entranceTrigger');
        const music = document.getElementById('bgMusic');
        const toggle = document.getElementById('audioToggle');
        let isOpened = false;

        function openInvitation() {
            if (isOpened) return;
            isOpened = true;

            // Trigger curtain part animation
            overlay.classList.add('parting');

            // Play background shehnai music
            if (music) {
                music.play().then(() => {
                    toggle.classList.add('playing');
                }).catch(() => {});
            }

            // Remove overlay smoothly
            setTimeout(() => {
                overlay.classList.add('opened');
            }, 1000);
        }

        overlay.addEventListener('click', openInvitation);
        overlay.addEventListener('touchstart', openInvitation, { passive: true });
        trigger.addEventListener('click', (e) => { e.stopPropagation(); openInvitation(); });
        if (params.get('open') === '1') {
            overlay.style.display = 'none';
            overlay.classList.add('opened');
        }
        trigger.addEventListener('touchstart', openInvitation, { passive: true });

        // 3. Audio Toggle Controller
        toggle.addEventListener('click', () => {
            if (music.paused) {
                music.play();
                toggle.classList.add('playing');
            } else {
                music.pause();
                toggle.classList.remove('playing');
            }
        });

        // 4. Raast Copy Controller
        document.getElementById('copyRaastBtn').addEventListener('click', function() {
            navigator.clipboard.writeText('03014544411');
            this.innerHTML = '<span>✓ Copied to Clipboard!</span>';
            setTimeout(() => {
                this.innerHTML = '<span>📋 Copy Raast ID (03014544411)</span>';
            }, 2500);
        });

        // 5. RSVP Submission
        function submitRsvp(attending) {
            document.getElementById('rsvpForm').style.display = 'none';
            const conf = document.getElementById('rsvpConfirmed');
            conf.style.display = 'block';
            if (!attending) {
                conf.textContent = 'Thank you for letting us know. You will be missed in our prayers!';
                conf.style.color = '#ECD29A';
                conf.style.borderColor = '#ECD29A';
            }
        }

        // 6. Live Floating Particle Canvas (Petals & Gold Dust)
        const canvas = document.getElementById('particleCanvas');
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        const particles = [];
        for (let i = 0; i < 35; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                radius: Math.random() * 3 + 1,
                color: Math.random() > 0.4 ? 'rgba(212, 175, 55, ' + (Math.random() * 0.6 + 0.2) + ')' : 'rgba(180, 20, 40, ' + (Math.random() * 0.7 + 0.3) + ')',
                speedY: Math.random() * 1.2 + 0.4,
                speedX: Math.random() * 0.8 - 0.4,
                rot: Math.random() * 360
            });
        }

        function renderParticles() {
            ctx.clearRect(0, 0, width, height);
            particles.forEach(p => {
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rot * Math.PI / 180);
                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.ellipse(0, 0, p.radius * 2, p.radius, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();

                p.y += p.speedY;
                p.x += p.speedX;
                p.rot += 0.5;

                if (p.y > height) {
                    p.y = -10;
                    p.x = Math.random() * width;
                }
            });
            requestAnimationFrame(renderParticles);
        }
        renderParticles();
    </script>
</body>
</html>"""

MASTER_TEMPLATES = [
    {
        "id": "shahi-khas",
        "title": "Shahi Khas Velvet",
        "title_ur": "شاہی خاص — حویلی دربار",
        "primary": "#6B0B1A",
        "gold": "#D4AF37",
        "bg_gradient": "linear-gradient(180deg, #1A050A 0%, #2D0810 50%, #120306 100%)",
        "gesture_label": "Part the Royal Velvet Curtains / پردہ کشائی کریں",
        "aliases": ["shahi-mehru", "rose-pavilion", "mehru-returns", "mehru-cinema"]
    },
    {
        "id": "kashmir-chinar",
        "title": "Kashmir Chinar Atelier",
        "title_ur": "کشمیر چنار — دستکاری پشمینہ",
        "primary": "#4A180E",
        "gold": "#E5A93C",
        "bg_gradient": "linear-gradient(180deg, #1C0C07 0%, #2E150C 50%, #150804 100%)",
        "gesture_label": "Unveil the Handcrafted Chinar / کشمیر چنار کھولیں",
        "aliases": ["chinar", "kaghaz-haveli", "kaghaz"]
    },
    {
        "id": "roshni-diya",
        "title": "Roshni Diya Sacred",
        "title_ur": "روشنیِ دیا — چراغِ محبت",
        "primary": "#1E0D25",
        "gold": "#F6C85F",
        "bg_gradient": "linear-gradient(180deg, #0E0512 0%, #1C0C24 50%, #0A030E 100%)",
        "gesture_label": "Light the Sacred Diya / چراغ روشن کریں",
        "aliases": ["roshni"]
    },
    {
        "id": "farmaan-e-shahi",
        "title": "Farmaan-e-Shahi Royal Scroll",
        "title_ur": "فرمانِ شاہی — شاہی پروانہ",
        "primary": "#3B2507",
        "gold": "#E8BA4F",
        "bg_gradient": "linear-gradient(180deg, #140C02 0%, #281805 50%, #100902 100%)",
        "gesture_label": "Unroll the Royal Farmaan / شاہی پروانہ کھولیں",
        "aliases": ["farmaan", "shahi-farman", "shahi-scroll", "dastaan"]
    },
    {
        "id": "dehleez-e-khas",
        "title": "Dehleez-e-Khas Haveli Doors",
        "title_ur": "دہلیزِ خاص — حویلی کے دروازے",
        "primary": "#2D170D",
        "gold": "#D4AF37",
        "bg_gradient": "linear-gradient(180deg, #170B06 0%, #2B160C 50%, #110704 100%)",
        "gesture_label": "Open the Haveli Double Doors / حویلی میں داخل ہوں",
        "aliases": ["dehleez", "dehleez-haveli", "haveli", "purani-haveli"]
    },
    {
        "id": "chunri-bandhani",
        "title": "Chunri Bandhani Silk",
        "title_ur": "چنری بندھنی — رنگِ مہندی",
        "primary": "#7A0F38",
        "gold": "#FFC043",
        "bg_gradient": "linear-gradient(180deg, #240410 0%, #3B061A 50%, #1A030C 100%)",
        "gesture_label": "Unveil the Gota Kinari Chunri / چنری لہرائیں",
        "aliases": ["chunri", "chunri-mehndi"]
    },
    {
        "id": "darbar-e-mughlia",
        "title": "Darbar-e-Mughlia Marble Jali",
        "title_ur": "دربارِ مغلیہ — شاہی قلعہ",
        "primary": "#1A2530",
        "gold": "#D4AF37",
        "bg_gradient": "linear-gradient(180deg, #090E14 0%, #141F2B 50%, #070B0F 100%)",
        "gesture_label": "Enter the Shahi Darbar / دربار میں تشریف لائیں",
        "aliases": ["darbar-e-shahi", "bazm-e-shahi", "jharokha-wisaal", "dastaan-e-wisaal"]
    },
    {
        "id": "noor-e-madina",
        "title": "Noor-e-Madina Sacred Dome",
        "title_ur": "نورِ مدینہ — گنبدِ خضریٰ",
        "primary": "#0A331E",
        "gold": "#E8C86A",
        "bg_gradient": "linear-gradient(180deg, #04140C 0%, #0C2B1B 50%, #030F08 100%)",
        "gesture_label": "Enter with Bismillah & Darood / درود و سلام",
        "aliases": ["madina-journey", "madina-journey-2", "madina-noor", "masjid-nabawi"]
    },
    {
        "id": "kiswah-gold",
        "title": "Kiswah-e-Kaaba Gold Calligraphy",
        "title_ur": "کسوہ گولڈ — خطِ ثلث و زر",
        "primary": "#141416",
        "gold": "#F2C94C",
        "bg_gradient": "linear-gradient(180deg, #0A0A0C 0%, #16161A 50%, #08080A 100%)",
        "gesture_label": "Unveil Sacred Nikah Proclamation / اعلانِ نکاح",
        "aliases": ["makkah-journey"]
    },
    {
        "id": "chandni-raat",
        "title": "Chandni Raat Lotus Lake",
        "title_ur": "چاندنی رات — کنول و مہتاب",
        "primary": "#0A1B2A",
        "gold": "#BCE3EB",
        "bg_gradient": "linear-gradient(180deg, #040D17 0%, #0D2235 50%, #030A12 100%)",
        "gesture_label": "Touch the Moonlit Lotus Pool / کنول چھوئیں",
        "aliases": ["chandni", "chandni-ripple"]
    },
    {
        "id": "gulab-bagh",
        "title": "Gulab Bagh Botanical Roses",
        "title_ur": "گلاب باغ — مہکتی حویلی",
        "primary": "#5A0A16",
        "gold": "#E5B84B",
        "bg_gradient": "linear-gradient(180deg, #1C0307 0%, #30060D 50%, #140205 100%)",
        "gesture_label": "Open the Fragrant Rose Garden / باغ میں تشریف لائیں",
        "aliases": ["gulaab", "gulab-botanical", "gulab-damask", "bazm-e-ghulab", "bazm-e-ghulab@lang=ur"]
    },
    {
        "id": "zardozi-khas",
        "title": "Zardozi Raw Silk & Gold Wire",
        "title_ur": "زردوزیِ خاص — کمخواب و زر",
        "primary": "#42101F",
        "gold": "#F0C85E",
        "bg_gradient": "linear-gradient(180deg, #17050B 0%, #2E0B16 50%, #120408 100%)",
        "gesture_label": "Unveil the Handcrafted Zardozi / زردوزی کھولیں",
        "aliases": ["gulbadan", "gulbadan-zardozi", "everlasting-stitch"]
    },
    {
        "id": "mughal-baradari",
        "title": "Mughal Baradari Shalamar Garden",
        "title_ur": "مغل بارہ دری — شالامار باغ",
        "primary": "#122A1C",
        "gold": "#D4AF37",
        "bg_gradient": "linear-gradient(180deg, #07140D 0%, #152E20 50%, #050E09 100%)",
        "gesture_label": "Enter the Shahi Baradari / بارہ دری میں تشریف لائیں",
        "aliases": ["baradari"]
    },
    {
        "id": "chikankari-noor",
        "title": "Chikankari Ivory Pearl Lace",
        "title_ur": "چکن کاری نور — موتی و جالی",
        "primary": "#2D2621",
        "gold": "#D4AF37",
        "bg_gradient": "linear-gradient(180deg, #14100D 0%, #26201B 50%, #0E0B09 100%)",
        "gesture_label": "Unfold the Pearl Lace Screen / پردہ کشائی",
        "aliases": ["gulkari", "gulkari-chikankari", "linen-ivory", "elegant-wedding"]
    },
    {
        "id": "ajrak-heritage",
        "title": "Ajrak Heritage Indigo & Madder",
        "title_ur": "اجرک ثقافت — مہران کی روایت",
        "primary": "#14253D",
        "gold": "#C98A3C",
        "bg_gradient": "linear-gradient(180deg, #091321 0%, #182C47 50%, #070D17 100%)",
        "gesture_label": "Unveil the Heritage Ajrak / اجرک کھولیں",
        "aliases": ["ajrak", "ajrak-sindh"]
    },
    {
        "id": "qasr-e-firdaus",
        "title": "Qasr-e-Firdaus Bas-Relief Emerald",
        "title_ur": "قصرِ فردوس — شاہی فانوس",
        "primary": "#0D2619",
        "gold": "#E8BF51",
        "bg_gradient": "linear-gradient(180deg, #05140C 0%, #112E1F 50%, #040F09 100%)",
        "gesture_label": "Illuminate the Grand Chandelier / قصر میں تشریف لائیں",
        "aliases": ["qasr", "qasr-e-khuld", "firdaus", "firdaus-medallion"]
    },
    {
        "id": "neelum-azure",
        "title": "Neelum Azure Multani Tile",
        "title_ur": "نیلم ایژور — گلِ بوگن بیل",
        "primary": "#0D2A42",
        "gold": "#E5A93C",
        "bg_gradient": "linear-gradient(180deg, #061521 0%, #123452 50%, #040E17 100%)",
        "gesture_label": "Part the Blue Cobalt Gates / دروازہ کھولیں",
        "aliases": ["neelum", "neelum-valley", "sahil-e-rang", "sahil-bougainvillea"]
    },
    {
        "id": "baharan-coastal",
        "title": "Baharan Coastal Lilac Watercolour",
        "title_ur": "بہاراں کوسٹل — شامِ گل",
        "primary": "#33213B",
        "gold": "#F0C86E",
        "bg_gradient": "linear-gradient(180deg, #170E1C 0%, #2E1D36 50%, #110B14 100%)",
        "gesture_label": "Unveil the Lilac Watercolour / گلاب و بہار",
        "aliases": ["bahaar", "bahar-watercolor", "saahil", "saahil-breeze", "jashan-bahar", "jashan-e-bahara"]
    },
    {
        "id": "regency-monogram",
        "title": "Regency Monogram Royal Crest",
        "title_ur": "ریجنسی مونوگرام — شاہی مہر",
        "primary": "#3D111A",
        "gold": "#D4AF37",
        "bg_gradient": "linear-gradient(180deg, #17060A 0%, #2B0C12 50%, #120407 100%)",
        "gesture_label": "Break the Royal Wax Seal / شاہی مہر کھولیں",
        "aliases": ["royal-beginning", "monogram-crest", "sahar", "sahar-regency"]
    },
    {
        "id": "crystal-ballroom",
        "title": "Crystal Ballroom Midnight Champagne",
        "title_ur": "کرسٹل بال روم — شمع و فانوس",
        "primary": "#1F1A14",
        "gold": "#E8D3A2",
        "bg_gradient": "linear-gradient(180deg, #0D0A08 0%, #1C1712 50%, #0A0806 100%)",
        "gesture_label": "Enter the Crystal Ballroom / بال روم میں تشریف لائیں",
        "aliases": ["lavish-wedding", "chandelier-ballroom", "wedding-classic", "maroon-shadi", "ehd-e-muhabbat", "ehd-e-wafa"]
    },
    {
        "id": "farman-minimal",
        "title": "Farman Minimal Deckled Letterpress",
        "title_ur": "فرمان منمل — سادگی و وقار",
        "primary": "#24201D",
        "gold": "#CFA954",
        "bg_gradient": "linear-gradient(180deg, #0F0D0C 0%, #1E1B19 50%, #0C0A09 100%)",
        "gesture_label": "Slide Open the Letterpress Pocket / خط کھولیں",
        "aliases": ["dilkusha", "dilkusha-palace", "aangan", "aangan-jali", "moti-bagh", "moti-bagh-silk"]
    }
]

created_count = 0
for cfg in MASTER_TEMPLATES:
    html = TEMPLATE_BASE
    html = html.replace("__TITLE__", cfg["title"])
    html = html.replace("__TITLE_UR__", cfg["title_ur"])
    html = html.replace("__PRIMARY__", cfg["primary"])
    html = html.replace("__GOLD__", cfg["gold"])
    html = html.replace("__BG_GRADIENT__", cfg["bg_gradient"])
    html = html.replace("__GESTURE_LABEL__", cfg["gesture_label"])
    
    # 1. Primary file
    primary_path = os.path.join(TEMPLATES_DIR, f"{cfg['id']}.html")
    with open(primary_path, "w", encoding="utf-8") as f:
        f.write(html)
    created_count += 1
    
    # 2. Aliases
    for alias in cfg.get("aliases", []):
        alias_path = os.path.join(TEMPLATES_DIR, f"{alias}.html")
        with open(alias_path, "w", encoding="utf-8") as f:
            f.write(html)
        created_count += 1

print(f"Successfully generated {created_count} pixel-perfect, money-worthy templates!")
