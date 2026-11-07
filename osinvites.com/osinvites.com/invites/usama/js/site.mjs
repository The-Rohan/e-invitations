import { countdownParts, initInvitationReveal } from './reveal.mjs';
import { initScratchReveal } from './scratch-reveal.mjs';

document.documentElement.classList.add('js');

const heroVideo = document.querySelector('[data-hero-video]');
const heroCopy = document.querySelector('[data-hero-copy]');
const openButton = document.querySelector('[data-open-invite]');
const skipButton = document.querySelector('[data-skip-invite]');
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
let heroTimer;

const music = document.querySelector('[data-invite-music]');
const musicButton = document.querySelector('[data-music-toggle]');
const musicLabel = musicButton?.querySelector('[data-music-label]');
const updateMusicButton = () => {
  const playing = Boolean(music && !music.paused);
  musicButton?.setAttribute('aria-pressed', String(playing));
  musicButton?.setAttribute('aria-label', playing ? 'Pause background music' : 'Play background music');
  if (musicLabel) musicLabel.textContent = playing ? 'Music on' : 'Music off';
};
musicButton?.addEventListener('click', async () => {
  if (!music) return;
  if (!music.paused) {
    music.pause();
    return;
  }
  try {
    await music.play();
  } catch {
    updateMusicButton();
  }
});
music?.addEventListener('play', updateMusicButton);
music?.addEventListener('pause', updateMusicButton);

const showHero = () => {
  window.clearTimeout(heroTimer);
  heroCopy?.classList.add('is-visible');
};

openButton?.addEventListener('click', () => {
  if (!heroVideo || reduced.matches) return showHero();
  heroVideo.currentTime = 0;
  const playback = heroVideo.play();
  playback?.catch?.(() => showHero());
  heroTimer = window.setTimeout(showHero, 7600);
}, { once: true });

skipButton?.addEventListener('click', () => {
  heroVideo?.pause();
  showHero();
}, { once: true });

heroVideo?.addEventListener('ended', showHero, { once: true });
if (reduced.matches) showHero();

const disposeReveal = initInvitationReveal(document);
const disposeScratch = initScratchReveal(document, {
  overlayColor: '#8f2337',
  labelColor: '#fff8ee',
  label: 'Scratch to reveal',
  particleCount: 28,
  threshold: 0.38
});

const revealItems = [...document.querySelectorAll('[data-scroll-reveal]')];
if ('IntersectionObserver' in window && !reduced.matches) {
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  }, { threshold: 0.16, rootMargin: '0px 0px -6% 0px' });
  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

const target = '2026-11-16T21:00:00+05:00';
const countdown = document.querySelector('[data-countdown]');
const countdownStatus = document.querySelector('[data-countdown-status]');
let countdownTimer;

function renderCountdown() {
  const parts = countdownParts(target);
  if (!parts || !countdown) {
    if (countdownStatus) countdownStatus.textContent = 'Event date unavailable';
    return;
  }
  for (const key of ['days', 'hours', 'minutes', 'seconds']) {
    const node = countdown.querySelector(`[data-countdown-part="${key}"]`);
    if (node) node.textContent = String(parts[key]).padStart(2, '0');
  }
  if (parts.expired) {
    if (countdownStatus) countdownStatus.textContent = 'The celebration has begun';
    window.clearInterval(countdownTimer);
  }
}
renderCountdown();
countdownTimer = window.setInterval(renderCountdown, 1000);

const ambient = document.querySelector('[data-ambient]');
if (ambient && !reduced.matches) {
  const palette = ['#ead7a6', '#c8a25a', '#f8efe2'];
  const amount = window.innerWidth < 700 ? 8 : 14;
  for (let index = 0; index < amount; index += 1) {
    const mote = document.createElement('span');
    mote.className = 'ambient-mote';
    mote.style.setProperty('--left', `${Math.random() * 100}%`);
    mote.style.setProperty('--size', `${3 + Math.random() * 5}px`);
    mote.style.setProperty('--tone', palette[index % palette.length]);
    mote.style.setProperty('--drift', `${-35 + Math.random() * 70}px`);
    mote.style.setProperty('--duration', `${12 + Math.random() * 8}s`);
    mote.style.setProperty('--delay', `${-Math.random() * 16}s`);
    ambient.append(mote);
  }
}

document.addEventListener('visibilitychange', () => {
  if (!heroVideo || heroVideo.ended) return;
  if (document.hidden) heroVideo.pause();
});

window.addEventListener('pagehide', () => {
  window.clearInterval(countdownTimer);
  window.clearTimeout(heroTimer);
  disposeScratch();
  disposeReveal();
}, { once: true });
