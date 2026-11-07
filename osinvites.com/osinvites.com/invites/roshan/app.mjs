import { initInvitationReveal, countdownParts } from './assets/reveal.mjs';
import { initScratchReveal } from './assets/scratch-reveal.mjs';

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const disposeReveal = initInvitationReveal(document);
const disposeScratch = initScratchReveal(document, {
  overlayColor: '#b78a46',
  labelColor: '#fff5d8',
  label: 'Scratch to reveal',
  particleCount: 28,
  threshold: 0.36
});

const relatedEvents = [
  { day: 'Sunday', name: 'Mehndi', date: '13 December 2026', time: '7:30 PM', meta: 'Family celebration' },
  { day: 'Monday', name: 'Mayun', date: '14 December 2026', time: '8:00 PM', meta: 'Family celebration' }
];

const eventGrid = document.querySelector('[data-event-grid]');
for (const event of relatedEvents) {
  const card = document.createElement('article');
  card.className = 'event-card';
  const badge = document.createElement('span');
  badge.className = 'preview-badge';
  badge.textContent = 'Sample date';
  const day = document.createElement('p');
  day.className = 'event-day';
  day.textContent = event.day;
  const title = document.createElement('h3');
  title.textContent = event.name;
  const date = document.createElement('p');
  date.className = 'event-date';
  date.textContent = event.date;
  const meta = document.createElement('p');
  meta.className = 'event-meta';
  meta.textContent = `${event.time} · ${event.meta}`;
  card.append(badge, day, title, date, meta);
  eventGrid?.append(card);
}

const markEntered = () => {
  document.body.classList.add('invite-entered');
  startLeaves();
};

document.querySelector('[data-open-invite]')?.addEventListener('click', () => {
  window.setTimeout(markEntered, reducedMotion.matches ? 0 : 650);
}, { once: true });
document.querySelector('[data-skip-invite]')?.addEventListener('click', markEntered, { once: true });
if (reducedMotion.matches) markEntered();

const target = '2026-12-15T21:30:00+05:00';
const countdown = document.querySelector('[data-countdown]');
const message = document.querySelector('[data-countdown-message]');
const fields = {
  days: document.querySelector('[data-countdown-days]'),
  hours: document.querySelector('[data-countdown-hours]'),
  minutes: document.querySelector('[data-countdown-minutes]'),
  seconds: document.querySelector('[data-countdown-seconds]')
};

let timer;
function renderCountdown() {
  const parts = countdownParts(target);
  if (!parts) {
    countdown?.setAttribute('hidden', '');
    if (message) { message.hidden = false; message.textContent = 'The celebration date will be announced soon.'; }
    window.clearInterval(timer);
    return;
  }
  for (const key of Object.keys(fields)) if (fields[key]) fields[key].textContent = String(parts[key]).padStart(2, '0');
  if (parts.expired) {
    countdown?.setAttribute('hidden', '');
    if (message) message.hidden = false;
    window.clearInterval(timer);
  }
}
renderCountdown();
timer = window.setInterval(renderCountdown, 1000);

const items = [...document.querySelectorAll('.reveal-item')];
if ('IntersectionObserver' in window && !reducedMotion.matches) {
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  }, { threshold: .13, rootMargin: '0px 0px -8% 0px' });
  items.forEach((item) => observer.observe(item));
} else items.forEach((item) => item.classList.add('is-visible'));

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
    const direction = index % 2 ? -1 : 1;
    leaf.style.setProperty('--leaf-left', `${3 + Math.random() * 94}%`);
    leaf.style.setProperty('--leaf-size', `${10 + Math.random() * 12}px`);
    leaf.style.setProperty('--leaf-opacity', `${.28 + Math.random() * .35}`);
    leaf.style.setProperty('--leaf-duration', `${15 + Math.random() * 12}s`);
    leaf.style.setProperty('--leaf-delay', `${-Math.random() * 21}s`);
    leaf.style.setProperty('--leaf-drift-a', `${direction * (18 + Math.random() * 42)}px`);
    leaf.style.setProperty('--leaf-drift-b', `${-direction * (12 + Math.random() * 35)}px`);
    leaf.style.setProperty('--leaf-drift-c', `${direction * (8 + Math.random() * 28)}px`);
    layer.append(leaf);
  }
}

window.addEventListener('pagehide', () => {
  disposeReveal();
  disposeScratch();
  window.clearInterval(timer);
}, { once: true });
