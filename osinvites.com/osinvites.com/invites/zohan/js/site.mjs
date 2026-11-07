import { countdownParts } from './reveal.mjs';
import { initScratchReveal } from './scratch-reveal.mjs';

document.documentElement.classList.add('js');

const data = window.INVITE_DATA || {};
const couple = data.couple || {};
const copy = data.copy || {};
const event = data.event || {};
const venue = data.venue || {};
const media = data.media || {};
const appearance = data.appearance || {};

const setText = (selector, value) => {
  if (typeof value !== 'string') return;
  document.querySelectorAll(selector).forEach((node) => { node.textContent = value; });
};

const safeWebUrl = (value) => {
  try {
    const url = new URL(value, window.location.href);
    return ['http:', 'https:'].includes(url.protocol) ? url.href : '';
  } catch {
    return '';
  }
};

const cssUrl = (value) => {
  if (typeof value !== 'string' || !value.trim()) return '';
  return `url(${JSON.stringify(value.trim())})`;
};

if (data.page?.title) document.title = data.page.title;
if (data.page?.description) document.querySelector('meta[name="description"]')?.setAttribute('content', data.page.description);

setText('[data-cover-line]', copy.coverLine);
setText('[data-hero-line-one]', copy.heroLine1);
setText('[data-hero-line-two]', copy.heroLine2);
setText('[data-hero-message]', copy.heroMessage);
setText('[data-groom-name], [data-closing-groom]', couple.groom);
setText('[data-bride-name], [data-closing-bride]', couple.bride);
setText('[data-scratch-kicker]', copy.scratchKicker);
setText('[data-scratch-title]', copy.scratchTitle);
setText('[data-scratch-help]', copy.scratchHelp);
setText('[data-scratch-greeting]', copy.scratchGreeting);
setText('[data-event-day]', event.dayNumber);
setText('[data-event-month]', event.monthYear);
setText('[data-event-time]', event.dayTime);
setText('[data-countdown-kicker]', copy.countdownKicker);
setText('[data-countdown-title]', copy.countdownTitle);
setText('[data-countdown-status]', event.countdownLabel);
setText('[data-programme-kicker]', copy.programmeKicker);
setText('[data-programme-title]', copy.programmeTitle);
setText('[data-events-kicker]', copy.eventsKicker);
setText('[data-events-title]', copy.eventsTitle);
setText('[data-events-note]', copy.eventsNote);
setText('[data-venue-kicker]', copy.venueKicker);
setText('[data-venue-name]', venue.name);
setText('[data-venue-address]', venue.address);
setText('[data-venue-date]', venue.dateLine);
setText('[data-map-button]', copy.mapButton);
setText('[data-closing-kicker]', copy.closingKicker);
setText('[data-closing-note]', copy.closingNote);
setText('[data-closing-message]', copy.closingMessage);

const openButton = document.querySelector('[data-open-invite]');
if (openButton && couple.groom && couple.bride) openButton.setAttribute('aria-label', `Open ${couple.groom} and ${couple.bride}'s wedding invitation`);

const mapButton = document.querySelector('[data-map-button]');
const mapUrl = safeWebUrl(venue.mapLink);
if (mapButton && mapUrl) mapButton.href = mapUrl;
if (mapButton && !mapUrl) mapButton.hidden = true;

const root = document.documentElement;
const variables = {
  '--hero-name-font': appearance.namesFont,
  '--hero-name-color': appearance.namesColor,
  '--hero-name-mobile': appearance.namesSizeMobile,
  '--hero-name-desktop': appearance.namesSizeDesktop,
  '--hero-name-offset': appearance.namesOffsetY,
  '--burgundy': appearance.accentColor,
  '--background-position': appearance.backgroundPosition,
  '--cover-art': cssUrl(media.coverImage),
  '--hero-art': cssUrl(media.backgroundImage)
};
for (const [name, value] of Object.entries(variables)) {
  if (typeof value === 'string' && value.trim()) root.style.setProperty(name, value);
}

const openingVideo = document.querySelector('[data-opening-video]');
const videoSource = openingVideo?.querySelector('source');
if (openingVideo && media.coverImage) openingVideo.poster = media.coverImage;
if (videoSource && media.openingVideo) {
  videoSource.src = media.openingVideo;
  openingVideo.load();
}

const buildProgramme = () => {
  const list = document.querySelector('[data-programme-list]');
  if (!list || !Array.isArray(data.programme) || !data.programme.length) return;
  list.replaceChildren();
  data.programme.forEach((item, index) => {
    const li = document.createElement('li');
    li.setAttribute('data-scroll-reveal', '');
    const time = document.createElement('time');
    if (item.iso) time.dateTime = item.iso;
    time.textContent = item.time || '';
    const card = document.createElement('div');
    const number = document.createElement('span');
    number.textContent = String(index + 1).padStart(2, '0');
    const title = document.createElement('h3');
    title.textContent = item.title || '';
    const description = document.createElement('p');
    description.textContent = item.description || '';
    card.append(number, title, description);
    li.append(time, card);
    list.append(li);
  });
};

const buildEvents = () => {
  const list = document.querySelector('[data-event-stories]');
  if (!list || !Array.isArray(data.preWedding) || !data.preWedding.length) return;
  list.replaceChildren();
  data.preWedding.forEach((item, index) => {
    const article = document.createElement('article');
    article.setAttribute('data-scroll-reveal', '');
    const number = document.createElement('span');
    number.className = 'event-index';
    number.textContent = String(index + 1).padStart(2, '0');
    const title = document.createElement('h3');
    title.textContent = item.name || '';
    const date = document.createElement('time');
    if (item.iso) date.dateTime = item.iso;
    date.textContent = item.date || '';
    const time = document.createElement('p');
    time.textContent = item.time || '';
    const note = document.createElement('small');
    note.textContent = item.note || '';
    article.append(number, title, date, time, note);
    list.append(article);
  });
};

buildProgramme();
buildEvents();

const hero = document.querySelector('[data-hero]');
const skipButton = document.querySelector('[data-skip-intro]');
const coverAction = document.querySelector('[data-cover-action]');
const heroCopy = document.querySelector('[data-hero-copy]');
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
const music = document.querySelector('[data-background-music]');
const musicButton = document.querySelector('[data-music-toggle]');
let copyTimer;
let unlockTimer;
let sceneTimer;

const updateMusicButton = () => {
  if (!musicButton || !music) return;
  const playing = !music.paused;
  musicButton.textContent = playing ? (media.musicPauseLabel || 'Pause music') : (media.musicPlayLabel || 'Play music');
  musicButton.setAttribute('aria-pressed', String(playing));
  musicButton.classList.toggle('is-playing', playing);
};

if (music && musicButton && media.music) {
  music.src = media.music;
  musicButton.hidden = false;
  updateMusicButton();
  musicButton.addEventListener('click', async () => {
    if (music.paused) {
      try { await music.play(); } catch { /* Browser may require another direct tap. */ }
    } else {
      music.pause();
    }
    updateMusicButton();
  });
  music.addEventListener('play', updateMusicButton);
  music.addEventListener('pause', updateMusicButton);
}

const unlockPage = () => document.body.classList.remove('intro-locked');
const showHero = () => {
  window.clearTimeout(copyTimer);
  hero?.classList.add('show-scene');
  heroCopy?.classList.add('is-visible');
  coverAction?.setAttribute('hidden', '');
  skipButton?.setAttribute('hidden', '');
  unlockPage();
};

const skipIntro = () => {
  openingVideo?.pause();
  if (openingVideo) openingVideo.style.opacity = '0';
  showHero();
};

openButton?.addEventListener('click', () => {
  if (!openingVideo || reduced.matches) return skipIntro();
  hero?.classList.add('is-playing');
  openingVideo.currentTime = 0;
  const playback = openingVideo.play();
  playback?.catch?.(() => skipIntro());
  sceneTimer = window.setTimeout(() => hero?.classList.add('show-scene'), 2200);
  unlockTimer = window.setTimeout(unlockPage, 3000);
  copyTimer = window.setTimeout(showHero, 7900);
}, { once: true });

skipButton?.addEventListener('click', () => {
  skipIntro();
}, { once: true });
openingVideo?.addEventListener('ended', showHero, { once: true });
if (reduced.matches) skipIntro();

const scratchCard = document.querySelector('[data-scratch-card]');
if (scratchCard && appearance.scratchColor) scratchCard.dataset.scratchColor = appearance.scratchColor;
const disposeScratch = initScratchReveal(document, {
  overlayColor: appearance.scratchColor || '#a83c54',
  labelColor: '#fff8f5',
  label: 'Scratch to reveal',
  particleCount: 30,
  threshold: 0.36
});

const revealItems = [...document.querySelectorAll('[data-scroll-reveal]')];
if ('IntersectionObserver' in window && !reduced.matches) {
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  }, { threshold: 0.15, rootMargin: '0px 0px -7% 0px' });
  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

const target = event.countdownISO || '';
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
    if (countdownStatus) countdownStatus.textContent = event.completedMessage || 'The celebration has begun';
    window.clearInterval(countdownTimer);
  }
}
renderCountdown();
countdownTimer = window.setInterval(renderCountdown, 1000);

const sparkleField = document.querySelector('[data-sparkles]');
if (sparkleField && !reduced.matches) {
  const amount = window.innerWidth < 700 ? 10 : 18;
  for (let index = 0; index < amount; index += 1) {
    const sparkle = document.createElement('span');
    sparkle.className = 'sparkle';
    sparkle.style.setProperty('--x', `${7 + Math.random() * 86}%`);
    sparkle.style.setProperty('--y', `${6 + Math.random() * 82}%`);
    sparkle.style.setProperty('--s', `${2 + Math.random() * 4}px`);
    sparkle.style.setProperty('--d', `${2.4 + Math.random() * 3.4}s`);
    sparkle.style.setProperty('--delay', `${-Math.random() * 5}s`);
    sparkleField.append(sparkle);
  }
}

document.addEventListener('visibilitychange', () => {
  if (openingVideo && !openingVideo.ended && document.hidden) openingVideo.pause();
});

window.addEventListener('pagehide', () => {
  music?.pause();
  window.clearInterval(countdownTimer);
  window.clearTimeout(copyTimer);
  window.clearTimeout(unlockTimer);
  window.clearTimeout(sceneTimer);
  disposeScratch();
}, { once: true });
