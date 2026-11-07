import os
import re
import glob

preview_dir = '/Users/rohanalvi/Downloads/E-INVITATIONS/ceremoniainvites.com/ceremoniainvites.com/preview'
output_dir = '/Users/rohanalvi/Downloads/E-INVITATIONS/dawatna/public/templates'
os.makedirs(output_dir, exist_ok=True)

# Shared WedInvite Engine script that replaces all obfuscated competitor scripts
wedinvite_shared_script = '''
<script>
/**
 * WedInvite.pk Universal Luxury Template Engine
 * Ultra-smooth 60fps animations, video gates, gesture rituals, dynamic personalization & Pakistani features.
 */
(function() {
  'use strict';
  console.log('[WedInvite] Luxury Engine active.');

  // --- 1. DYNAMIC URL PARAMETER BINDING ---
  var params = new URLSearchParams(window.location.search);
  var groom = params.get('groom') || 'Ahmad';
  var bride = params.get('bride') || 'Mawra';
  var guest = params.get('guest') || '';
  var seats = params.get('seats') || '2';
  var dateStr = params.get('date') || 'Sunday, 24 December 2026';
  var venueStr = params.get('venue') || 'Royal Palm Golf & Country Club, Lahore';
  var phoneStr = params.get('phone') || '923213397889';
  var raastStr = params.get('raast') || '03213397889';
  var autoOpen = params.get('open') === 'true' || params.get('open') === '1';

  // Update couple names in all target selectors
  var groomSelectors = ['[data-bind="couple.groomShort"]', '[data-bind="groom"]', '.groom-name', '.bs-groom', '.mr-groom', '.rp-groom', '.dw-groom', '.jb-groom'];
  groomSelectors.forEach(function(sel) {
    document.querySelectorAll(sel).forEach(function(el) { el.textContent = groom; });
  });

  var brideSelectors = ['[data-bind="couple.brideShort"]', '[data-bind="bride"]', '.bride-name', '.bs-bride', '.mr-bride', '.rp-bride', '.dw-bride', '.jb-bride'];
  brideSelectors.forEach(function(sel) {
    document.querySelectorAll(sel).forEach(function(el) { el.textContent = bride; });
  });

  document.querySelectorAll('.couple-full, [data-bind="couple.full"]').forEach(function(el) {
    el.textContent = groom + ' & ' + bride;
  });

  document.title = groom + ' & ' + bride + ' — Wedding Invitation | WedInvite.pk';

  // VIP Guest Pass Header
  if (guest) {
    document.querySelectorAll('[data-bind="guest.name"], .guest-name').forEach(function(el) { el.textContent = guest; });
    var guestBadge = document.getElementById('wiGuestBadge');
    if (!guestBadge) {
      guestBadge = document.createElement('div');
      guestBadge.id = 'wiGuestBadge';
      guestBadge.style.cssText = 'position:fixed;top:16px;left:50%;transform:translateX(-50%);z-index:999999;background:rgba(25,12,12,0.88);backdrop-filter:blur(10px);border:1px solid #d4af37;color:#fdf4dc;padding:8px 20px;border-radius:30px;font-size:12px;font-family:Cinzel,serif;letter-spacing:1px;box-shadow:0 6px 25px rgba(0,0,0,0.6);display:flex;align-items:center;gap:8px;pointer-events:none;';
      guestBadge.innerHTML = '<span style="color:#ffd700">✦</span> VIP PASS: <strong>' + guest + '</strong> &bull; ' + seats + ' Seats Reserved';
      document.body.appendChild(guestBadge);
    }
  }

  // --- 2. AUDIO & EQUALIZER CONTROLLER ---
  var audio = document.getElementById('ciSong') || document.querySelector('audio');
  var songBtn = document.getElementById('ciSongBtn') || document.querySelector('.ci-song, .wi-song-btn');
  var isAudioPlaying = false;

  function toggleAudio(force) {
    if (!audio) return;
    if (force === true || (force === undefined && audio.paused)) {
      audio.play().then(function() {
        isAudioPlaying = true;
        if (songBtn) {
          songBtn.setAttribute('aria-pressed', 'true');
          songBtn.classList.add('is-playing');
        }
      }).catch(function(e) { console.log('Audio autoplay policy:', e); });
    } else if (force === false || (force === undefined && !audio.paused)) {
      audio.pause();
      isAudioPlaying = false;
      if (songBtn) {
        songBtn.setAttribute('aria-pressed', 'false');
        songBtn.classList.remove('is-playing');
      }
    }
  }

  if (songBtn) {
    songBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      toggleAudio();
    });
  }

  // --- 3. UNIVERSAL CINEMATIC GATE & 3D ENVELOPE OPENING ---
  var gate = document.querySelector(`
    #bsGate, #rpGate, #mrGate, #dwGate, #jbGate, #rwGate, #pbGate, #mjGate, #esGate,
    #bgCover, #docGate, #ewGate, #dstGate,
    .bs-gate, .rp-gate, .mr-gate, .dw-gate, .jb-gate, .rw-gate, .pb-gate, .mj-gate, .es-gate,
    .bg-cover, .rb-cover, .rb-hero, .doc-gate, .ew-gate, .ew-envelope, .dst-gate, .dst-envelope,
    .lw-envelope, .gate, .gate-cover, .wi-video-gate, [data-section="cover"], [data-gate]
  `);

  var film = gate ? gate.querySelector('video, .bs-gate-film, .rp-gate-film, .mr-gate-film, .dw-gate-film, .jb-gate-film, .rw-gate-film, .pb-gate-film, video.gate-film') : null;
  var html = document.documentElement;
  var body = document.body;

  var isOpened = false;

  function openInvitation() {
    if (isOpened) return;
    isOpened = true;
    console.log('[WedInvite] Opening invitation with luxury ceremony ritual...');

    // 1. Play background audio
    toggleAudio(true);

    if (gate) {
      gate.classList.add('is-opening');
      document.querySelectorAll('.bg-cover, .rb-hero, .ew-gate, .dst-gate, .dst-envelope, .es-gate, .doc-gate').forEach(function(el) {
        el.classList.add('is-opening');
      });

      // Special 3D envelope timing (bazm-e-ghulab)
      var bgCover = document.querySelector('.bg-cover');
      if (bgCover) {
        setTimeout(function() {
          bgCover.classList.add('is-fading');
        }, 550);
      }

      // Play gate video if present
      if (film) {
        film.style.opacity = '1';
        var mobSrc = film.getAttribute('data-mob') || film.src;
        if (mobSrc && (!film.src || film.src.indexOf('http') === -1)) {
          film.src = mobSrc;
        }
        film.play().catch(function(err) { console.log('Gate film play:', err); });
        film.onended = finishOpening;
      }
    }

    // Safety timeout ensures envelope and card unfold smoothly
    setTimeout(finishOpening, 2200);
  }

  function finishOpening() {
    if (!gate) return;
    gate.classList.add('is-opened', 'is-open');
    document.querySelectorAll('.bg-cover, .rb-hero, .ew-gate, .dst-gate, .dst-envelope, .es-gate, .doc-gate').forEach(function(el) {
      el.classList.add('is-opened', 'is-open');
    });

    gate.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
    gate.style.opacity = '0';
    gate.style.transform = 'scale(1.04)';
    gate.style.pointerEvents = 'none';

    setTimeout(function() {
      gate.style.display = 'none';

      // Unlock all sealed classes from html and body
      var sealedClasses = [
        'bs-sealed', 'rp-sealed', 'mr-sealed', 'dw-sealed', 'jb-sealed',
        'es-sealed', 'rw-sealed', 'pb-sealed', 'doc-sealed', 'ew-sealed',
        'rb-sealed', 'sealed', 'wi-locked'
      ];
      sealedClasses.forEach(function(c) {
        html.classList.remove(c);
        body.classList.remove(c);
      });
      html.style.overflow = 'auto';
      body.style.overflow = 'auto';

      var scrollCue = document.querySelector('.bs-scroll, .rp-scroll, .mr-scroll, .dw-scroll, .jb-scroll, .scroll-cue, #bsScroll');
      if (scrollCue) scrollCue.style.opacity = '1';
    }, 800);
  }

  if (gate) {
    gate.addEventListener('click', openInvitation);
    gate.addEventListener('touchend', openInvitation);
    gate.querySelectorAll('.bg-wax-btn, .rb-seal, .ew-seal-btn, .dst-seal-group, .bg-tap-cue, .rb-tap, .ew-tap, [data-open]').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        openInvitation();
      });
    });
  }

  if (autoOpen) {
    setTimeout(openInvitation, 250);
  }

  // --- 4. SECTION MOTION ART LOOPER (IntersectionObserver) ---
  var sectionVideos = document.querySelectorAll('video[data-mob], video[data-wide], .bs-film-video, .rp-film-video, .mr-film-video, .dw-film-video, .jb-film-video, .rw-film-video, .pb-film-video, .is-motion, .wi-section-video');
  if ('IntersectionObserver' in window && sectionVideos.length > 0) {
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        var v = entry.target;
        if (v === film || (gate && gate.contains(v))) return;

        if (entry.isIntersecting) {
          if (!v.src && v.getAttribute('data-mob')) {
            v.src = v.getAttribute('data-mob');
          }
          v.play().catch(function() {});
          v.classList.add('is-playing');
        } else {
          v.pause();
          v.classList.remove('is-playing');
        }
      });
    }, { threshold: 0.2 });

    sectionVideos.forEach(function(v) {
      if (v !== film && (!gate || !gate.contains(v))) {
        observer.observe(v);
      }
    });
  }

  // --- 5. SCROLL CUE NAVIGATION ---
  var scrollCue = document.querySelector('.bs-scroll, .rp-scroll, .mr-scroll, .dw-scroll, .jb-scroll, .scroll-cue, #bsScroll');
  if (scrollCue) {
    scrollCue.addEventListener('click', function() {
      window.scrollBy({ top: window.innerHeight * 0.85, behavior: 'smooth' });
    });
  }

  // --- 6. PAKISTANI WEDDING ACTION BAR & RSVP MODAL ---
  var actionBox = document.createElement('div');
  actionBox.id = 'wiActionBar';
  actionBox.style.cssText = 'position:fixed;bottom:20px;left:50%;transform:translateX(-50%);z-index:99999;display:flex;gap:10px;background:rgba(20,10,10,0.85);backdrop-filter:blur(12px);border:1px solid #d4af37;padding:8px 16px;border-radius:40px;box-shadow:0 8px 30px rgba(0,0,0,0.6);';
  actionBox.innerHTML = `
    <button id="wiRsvpBtn" style="background:linear-gradient(135deg,#c5a059,#e8d08d);border:none;color:#1c1308;padding:8px 18px;border-radius:20px;font-weight:700;font-size:12px;font-family:Cinzel,serif;cursor:pointer;letter-spacing:1px;display:flex;align-items:center;gap:6px;">
      💌 RSVP
    </button>
    <button id="wiMapBtn" style="background:rgba(255,255,255,0.1);border:1px solid rgba(212,175,55,0.4);color:#fdf4dc;padding:8px 14px;border-radius:20px;font-size:12px;cursor:pointer;display:flex;align-items:center;gap:5px;font-family:Cinzel,serif;">
      📍 Map
    </button>
    <button id="wiRaastBtn" style="background:rgba(255,255,255,0.1);border:1px solid rgba(212,175,55,0.4);color:#fdf4dc;padding:8px 14px;border-radius:20px;font-size:12px;cursor:pointer;display:flex;align-items:center;gap:5px;font-family:Cinzel,serif;">
      💳 Salami
    </button>
  `;
  document.body.appendChild(actionBox);

  // Google Maps
  document.getElementById('wiMapBtn').addEventListener('click', function(e) {
    e.stopPropagation();
    window.open('https://maps.google.com/?q=' + encodeURIComponent(venueStr), '_blank');
  });

  // Raast Salami Copy
  document.getElementById('wiRaastBtn').addEventListener('click', function(e) {
    e.stopPropagation();
    navigator.clipboard.writeText(raastStr).then(function() {
      showToast('✨ Raast ID Copied: ' + raastStr);
    }).catch(function() {
      alert('Raast ID: ' + raastStr);
    });
  });

  // RSVP WhatsApp Trigger
  document.getElementById('wiRsvpBtn').addEventListener('click', function(e) {
    e.stopPropagation();
    var msg = 'Assalam o Alaikum! I received the wedding invitation for ' + groom + ' & ' + bride + '. ' + 
              (guest ? 'This is ' + guest + ' confirming attendance for ' + seats + ' guests.' : 'Confirming our attendance with warm prayers!');
    window.open('https://wa.me/' + phoneStr + '?text=' + encodeURIComponent(msg), '_blank');
  });

  function showToast(text) {
    var toast = document.createElement('div');
    toast.style.cssText = 'position:fixed;bottom:85px;left:50%;transform:translateX(-50%);z-index:999999;background:#1a0f08;border:1px solid #d4af37;color:#f9ecd0;padding:10px 24px;border-radius:30px;font-size:13px;font-family:Cinzel,serif;letter-spacing:1px;box-shadow:0 8px 30px rgba(0,0,0,0.8);animation:fadeIn 0.3s ease;';
    toast.textContent = text;
    document.body.appendChild(toast);
    setTimeout(function() { toast.remove(); }, 2500);
  }

  // --- 7. LUXURY FOOTER BRANDING ---
  var footerTag = document.createElement('footer');
  footerTag.style.cssText = 'padding:50px 20px 100px;text-align:center;color:#d4af37;font-family:Cinzel,serif;font-size:12px;letter-spacing:2px;opacity:0.9;';
  footerTag.innerHTML = '✦ WEDINVITE.PK &bull; LUXURY DIGITAL INVITATION ATELIER ✦<br><span style="font-size:10px;opacity:0.7;letter-spacing:1px;font-family:Montserrat,sans-serif;">Designed exclusively for ' + groom + ' & ' + bride + '</span>';
  document.body.appendChild(footerTag);

})();
</script>
'''

# Process Ceremonia templates
ceremonia_files = glob.glob(os.path.join(preview_dir, '*.html'))
print(f"Compiling {len(ceremonia_files)} Ceremonia templates with clean WedInvite engine...")

for src_file in ceremonia_files:
    fname = os.path.basename(src_file)
    slug = fname.replace('.html', '').replace('@lang=ur', '-ur')
    dest_file = os.path.join(output_dir, f"{slug}.html")

    with open(src_file, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()

    # 1. Strip ALL <script data-from="...">...</script> tags completely
    content = re.sub(r'<script data-from=[^>]*>.*?</script>', '', content, flags=re.DOTALL)

    # 2. Strip any inline scripts containing competitor obfuscation or domain locks
    content = re.sub(r'<script>\s*\(function\s*\(\)\s*\{[^<]*?_0x.*?</script>', '', content, flags=re.DOTALL)

    # 3. Neutralize watermark
    content = re.sub(r'<style>\.ci-sample-mark\{.*?\}</style>', '<style>.ci-sample-mark { display: none !important; }</style>', content, flags=re.DOTALL)
    content = content.replace('<div class="ci-sample-mark" aria-hidden="true"></div>', '')
    content = content.replace('<div class="ci-credit" aria-hidden="true"></div>', '')

    # 4. Localize remote asset links
    content = content.replace('https://ceremonia-assets.pages.dev', '')
    content = content.replace('../music/', '/music/')

    # 5. Remove security tokens from video urls
    content = re.sub(r'data-mob=\"([^\"]+?)\?cg=[^\"]+\"', r'data-mob=\"\1\"', content)
    content = re.sub(r'data-wide=\"([^\"]+?)\?cg=[^\"]+\"', r'data-wide=\"\1\"', content)
    content = re.sub(r'src=\"([^\"]+?)\?cg=[^\"]+\"', r'src=\"\1\"', content)

    # 6. Debrand completely
    content = re.sub(r'data-cg=\"[^\"]*\"', '', content)
    content = re.sub(r'data-cg-sample=\"[^\"]*\"', '', content)
    content = re.sub(r'<meta name=\"copyright\" content=\"[^\"]*\">', '<meta name="copyright" content="WedInvite.pk">', content)
    content = re.sub(r'<meta name=\"author\" content=\"[^\"]*\">', '<meta name="author" content="WedInvite.pk">', content)
    content = content.replace('ceremoniainvites.com', 'wedinvite.pk')
    content = content.replace('Ceremonia Invites', 'WedInvite.pk')
    content = content.replace('Ceremonia', 'WedInvite.pk')
    content = content.replace('ceremonia', 'wedinvite')

    # 7. Append WedInvite shared luxury engine before </body>
    if '</body>' in content:
        content = content.replace('</body>', wedinvite_shared_script + '\n</body>')
    else:
        content = content + wedinvite_shared_script

    with open(dest_file, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"Generated {slug}.html ({len(content)} bytes)")

print("Ceremonia templates compiled with pristine engine successfully!")
