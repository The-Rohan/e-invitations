import { initInvitationReveal, countdownParts } from './assets/reveal.mjs';
import { initScratchReveal } from './assets/scratch-reveal.mjs';

const documentRoot = document;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

const disposeReveal = initInvitationReveal(documentRoot);
const disposeScratch = initScratchReveal(documentRoot, {
  overlayColor: '#b86779',
  labelColor: '#fff8ef',
  label: 'Scratch to reveal',
  particleCount: 26,
  threshold: 0.38
});

const markEntered = () => {
  document.body.classList.add('invite-entered');
  startLeaves();
};

document.querySelector('[data-open-invite]')?.addEventListener('click', () => {
  window.setTimeout(markEntered, reducedMotion.matches ? 0 : 650);
}, { once: true });

document.querySelector('[data-skip-invite]')?.addEventListener('click', markEntered, { once: true });

if (reducedMotion.matches) markEntered();

const countdownTarget = '2026-12-12T21:30:00+05:00';
const countdown = document.querySelector('[data-countdown]');
const countdownMessage = document.querySelector('[data-countdown-message]');
const counters = {
  days: document.querySelector('[data-countdown-days]'),
  hours: document.querySelector('[data-countdown-hours]'),
  minutes: document.querySelector('[data-countdown-minutes]'),
  seconds: document.querySelector('[data-countdown-seconds]')
};

let countdownTimer;

function updateCountdown() {
  const parts = countdownParts(countdownTarget);
  if (!parts) {
    countdown?.setAttribute('hidden', '');
    if (countdownMessage) {
      countdownMessage.hidden = false;
      countdownMessage.textContent = 'The celebration date will be announced soon.';
    }
    window.clearInterval(countdownTimer);
    return;
  }

  for (const key of ['days', 'hours', 'minutes', 'seconds']) {
    if (counters[key]) counters[key].textContent = String(parts[key]).padStart(2, '0');
  }

  if (parts.expired) {
    countdown?.setAttribute('hidden', '');
    if (countdownMessage) countdownMessage.hidden = false;
    window.clearInterval(countdownTimer);
  }
}

updateCountdown();
countdownTimer = window.setInterval(updateCountdown, 1000);

const revealItems = [...document.querySelectorAll('.reveal-item')];
if ('IntersectionObserver' in window && !reducedMotion.matches) {
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  }, { threshold: 0.13, rootMargin: '0px 0px -8% 0px' });
  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

let leavesStarted = false;
function startLeaves() {
  if (leavesStarted || reducedMotion.matches) return;
  leavesStarted = true;
  const layer = document.querySelector('[data-leaf-layer]');
  if (!layer) return;

  const count = window.innerWidth < 620 ? 9 : 14;
  for (let index = 0; index < count; index += 1) {
    const leaf = document.createElement('span');
    leaf.className = 'leaf';
    const direction = index % 2 === 0 ? 1 : -1;
    leaf.style.setProperty('--leaf-left', `${4 + Math.random() * 92}%`);
    leaf.style.setProperty('--leaf-size', `${10 + Math.random() * 11}px`);
    leaf.style.setProperty('--leaf-opacity', `${0.28 + Math.random() * 0.34}`);
    leaf.style.setProperty('--leaf-duration', `${14 + Math.random() * 12}s`);
    leaf.style.setProperty('--leaf-delay', `${-Math.random() * 20}s`);
    leaf.style.setProperty('--leaf-drift-a', `${direction * (18 + Math.random() * 42)}px`);
    leaf.style.setProperty('--leaf-drift-b', `${-direction * (12 + Math.random() * 35)}px`);
    leaf.style.setProperty('--leaf-drift-c', `${direction * (8 + Math.random() * 28)}px`);
    layer.append(leaf);
  }
}

document.addEventListener('visibilitychange', () => {
  const layer = document.querySelector('[data-leaf-layer]');
  if (layer) layer.style.animationPlayState = document.hidden ? 'paused' : 'running';
});

window.addEventListener('pagehide', () => {
  disposeReveal();
  disposeScratch();
  window.clearInterval(countdownTimer);
}, { once: true });
