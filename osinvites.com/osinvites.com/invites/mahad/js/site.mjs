import { initInvitationReveal, countdownParts } from './reveal.mjs';
import { initScratchReveal } from './scratch-reveal.mjs';

document.documentElement.classList.add('js');

const music = document.querySelector('[data-invite-music]');
const musicButton = document.querySelector('[data-music-toggle]');
const musicLabel = musicButton?.querySelector('[data-music-label]');
function updateMusicButton() {
  const playing = Boolean(music && !music.paused);
  musicButton?.setAttribute('aria-pressed', String(playing));
  musicButton?.setAttribute('aria-label', playing ? 'Pause background music' : 'Play background music');
  if (musicLabel) musicLabel.textContent = playing ? 'Music on' : 'Music off';
}
musicButton?.addEventListener('click', async () => {
  if (!music) return;
  if (!music.paused) {
    music.pause();
    return;
  }
  try { await music.play(); }
  catch { updateMusicButton(); }
});
music?.addEventListener('play', updateMusicButton);
music?.addEventListener('pause', updateMusicButton);

initInvitationReveal(document);
initScratchReveal(document, {
  overlayColor: '#a41f4c',
  labelColor: '#fff8ef',
  label: 'Scratch to reveal',
  threshold: 0.38,
  particleCount: 0
});

const target = '2026-11-20T21:00:00+05:00';
const countdown = document.querySelector('[data-countdown]');
const status = document.querySelector('[data-countdown-status]');
let countdownTimer;

function updateCountdown() {
  const parts = countdownParts(target);
  if (!parts || !countdown) {
    if (status) status.textContent = 'Date details are being confirmed.';
    return;
  }
  for (const key of ['days', 'hours', 'minutes', 'seconds']) {
    const node = countdown.querySelector(`[data-countdown-part="${key}"]`);
    if (node) node.textContent = String(parts[key]).padStart(2, '0');
  }
  if (parts.expired) {
    if (status) status.textContent = 'The celebration day has arrived.';
    window.clearInterval(countdownTimer);
  }
}

updateCountdown();
countdownTimer = window.setInterval(updateCountdown, 1000);

const revealNodes = [...document.querySelectorAll('[data-scroll-reveal]')];
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  }, { threshold: 0.15, rootMargin: '0px 0px -7% 0px' });
  revealNodes.forEach(node => observer.observe(node));
} else {
  revealNodes.forEach(node => node.classList.add('is-visible'));
}

const ambientLayer = document.querySelector('[data-ambient]');
if (ambientLayer && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const tones = ['#d74975', '#e5c986', '#f2a7bb'];
  for (let index = 0; index < 12; index += 1) {
    const dot = document.createElement('span');
    dot.className = 'ambient-dot';
    dot.style.left = `${4 + Math.random() * 92}%`;
    dot.style.setProperty('--size', `${5 + Math.random() * 9}px`);
    dot.style.setProperty('--tone', tones[index % tones.length]);
    dot.style.setProperty('--drift', `${-35 + Math.random() * 70}px`);
    dot.style.setProperty('--duration', `${12 + Math.random() * 8}s`);
    dot.style.setProperty('--delay', `${-Math.random() * 16}s`);
    ambientLayer.append(dot);
  }
}

function launchCelebration() {
  const layer = document.querySelector('[data-celebration-layer]');
  if (!layer || window.matchMedia('(prefers-reduced-motion: reduce)').matches || layer.childElementCount) return;
  const symbols = ['✦', '◆', '●', '✧'];
  const tones = ['#b78942', '#d74975', '#f4b7c7', '#e5c986'];
  const nodes = [];
  for (let index = 0; index < 30; index += 1) {
    const particle = document.createElement('span');
    particle.className = 'celebration-particle';
    particle.textContent = symbols[index % symbols.length];
    particle.style.setProperty('--left', `${2 + Math.random() * 96}%`);
    particle.style.setProperty('--color', tones[index % tones.length]);
    particle.style.setProperty('--size', `${8 + Math.random() * 13}px`);
    particle.style.setProperty('--drift', `${-70 + Math.random() * 140}px`);
    particle.style.setProperty('--spin', `${-540 + Math.random() * 1080}deg`);
    particle.style.setProperty('--duration', `${2.5 + Math.random() * 1.4}s`);
    particle.style.setProperty('--delay', `${Math.random() * .65}s`);
    layer.append(particle);
    nodes.push(particle);
  }
  window.setTimeout(() => nodes.forEach(node => node.remove()), 4800);
}

document.addEventListener('invite:scratch-revealed', launchCelebration, { once: true });
document.addEventListener('visibilitychange', () => {
  document.documentElement.classList.toggle('is-paused', document.hidden);
});
