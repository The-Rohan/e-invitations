import { initInvitationReveal, countdownParts } from './reveal.mjs';
import { initScratchReveal } from './scratch-reveal.mjs';

document.documentElement.classList.add('js');
const hero = document.querySelector('.hero');
const cover = document.querySelector('[data-invite-cover]');
const open = document.querySelector('[data-open-invite]');
const skip = document.querySelector('[data-skip-invite]');
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
let copyTimer;

// Keep a few matching red petals drifting over the entire scrolling invitation.
const petalField = document.querySelector('[data-petal-field]');
if (petalField && !reduced.matches) {
  const count = window.innerWidth < 700 ? 10 : 16;
  for (let index = 0; index < count; index += 1) {
    const petal = document.createElement('span');
    petal.className = 'falling-petal';
    petal.style.setProperty('--petal-left', `${4 + ((index * 37 + 13) % 92)}%`);
    petal.style.setProperty('--petal-size', `${17 + (index * 7 % 16)}px`);
    petal.style.setProperty('--petal-duration', `${14 + (index * 5 % 6)}s`);
    petal.style.setProperty('--petal-delay', `${-(index * 2.7 % 18)}s`);
    petal.style.setProperty('--petal-sway', `${index % 2 ? 28 : -32}px`);
    petal.style.setProperty('--petal-opacity', `${.38 + (index % 4) * .06}`);
    petalField.append(petal);
  }
}

const music = document.querySelector('[data-wedding-music]');
const musicControl = document.querySelector('[data-music-control]');
const musicLabel = document.querySelector('[data-music-label]');
if (music && musicControl && musicLabel) {
  music.volume = .42;
  musicControl.hidden = false;
  const syncMusic = () => {
    const playing = !music.paused;
    musicControl.setAttribute('aria-pressed', String(playing));
    musicControl.setAttribute('aria-label', playing ? 'Pause wedding music' : 'Play wedding music');
    musicLabel.textContent = playing ? 'Music On' : 'Music Off';
  };
  musicControl.addEventListener('click', async () => {
    if (music.paused) {
      try { await music.play(); } catch { /* A direct user tap may be required. */ }
    } else music.pause();
    syncMusic();
  });
  music.addEventListener('play', syncMusic);
  music.addEventListener('pause', syncMusic);
  music.addEventListener('error', () => {
    musicControl.hidden = true;
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && !music.paused) music.pause();
  });
}

function enterScene() {
  if (!hero || hero.classList.contains('is-entering')) return;
  hero.classList.add('is-entering');
  copyTimer = window.setTimeout(() => hero.classList.add('is-revealed'), reduced.matches ? 0 : 830);
}
open?.addEventListener('click', () => {
  cover?.classList.add('is-opening');
  enterScene();
});
skip?.addEventListener('click', () => {
  enterScene();
  hero?.classList.add('is-revealed');
});
const disposeReveal = initInvitationReveal(document);
if (reduced.matches) {
  enterScene();
  hero?.classList.add('is-revealed');
}
reduced.addEventListener?.('change', () => {
  if (reduced.matches) hero?.classList.add('is-revealed');
});

const disposeScratch = initScratchReveal(document, {
  overlayColor: '#a77747', labelColor: '#fff8e9', label: 'Scratch to reveal',
  particleCount: 30, threshold: .35
});

const countdown = document.querySelector('[data-countdown]');
const status = document.querySelector('[data-countdown-status]');
const target = '2026-11-28T21:00:00+05:00';
let interval;
function updateCountdown() {
  const parts = countdownParts(target);
  if (!parts || !countdown) {
    if (status) status.textContent = 'Event date unavailable';
    window.clearInterval(interval);
    return;
  }
  for (const key of ['days','hours','minutes','seconds']) {
    const node = countdown.querySelector(`[data-countdown-part="${key}"]`);
    if (node) node.textContent = String(parts[key]).padStart(2,'0');
  }
  if (parts.expired) {
    if (status) status.textContent = 'The celebration has begun';
    window.clearInterval(interval);
  }
}
updateCountdown();
interval = window.setInterval(updateCountdown, 1000);

const revealNodes = [...document.querySelectorAll('[data-scroll-reveal]')];
if ('IntersectionObserver' in window && !reduced.matches) {
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  }, { threshold:.12, rootMargin:'0px 0px -5% 0px' });
  revealNodes.forEach(node => observer.observe(node));
} else revealNodes.forEach(node => node.classList.add('is-visible'));

window.addEventListener('pagehide', () => {
  music?.pause();
  disposeReveal();
  disposeScratch();
  window.clearInterval(interval);
  window.clearTimeout(copyTimer);
}, { once:true });
