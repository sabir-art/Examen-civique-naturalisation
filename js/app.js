/**
 * Point d'entrée : thème, service worker, routeur et coquille de l'application.
 */

import * as store from './store.js';
import { amorcer } from './lib/feedback.js';
import { h, icon, toast } from './lib/dom.js';

import renderOnboarding from './views/onboarding.js';
import renderHome from './views/home.js';
import renderReviser from './views/reviser.js';
import renderExamen from './views/examen.js';
import renderCours from './views/cours.js';
import renderLivret from './views/livret.js';
import renderRoman from './views/roman.js';
import renderProgres from './views/progres.js';
import renderCompte from './views/compte.js';
import renderAssistant from './views/assistant.js';

const appEl = document.getElementById('app');
const bootEl = document.getElementById('boot');
const appbar = document.getElementById('appbar');
const tabbar = document.getElementById('tabbar');
const titleEl = document.getElementById('appbar-title');
const backEl = document.getElementById('appbar-back');
const avatarEl = document.getElementById('appbar-avatar');
const profileBtn = document.getElementById('appbar-profile');

/* ------------------------------------------------------------------ thème */

export function applyTheme() {
  const pref = store.current()?.settings?.theme || 'auto';
  const root = document.documentElement;
  if (pref === 'auto') root.removeAttribute('data-theme');
  else root.setAttribute('data-theme', pref);
  const dark = pref === 'dark' || (pref === 'auto' && matchMedia('(prefers-color-scheme: dark)').matches);
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#0a1120' : '#ffffff');
}

/* ----------------------------------------------------------------- routeur */

const ROUTES = [
  { path: /^\/$/, view: renderHome, title: 'Examen civique', tab: '/' },
  { path: /^\/histoire$/, view: renderRoman, title: 'La France racontée', tab: '/histoire' },
  { path: /^\/histoire\/(.+)$/, view: renderRoman, title: 'La France racontée', tab: '/histoire', back: '#/histoire' },
  { path: /^\/reviser$/, view: renderReviser, title: 'Réviser', tab: '/reviser' },
  { path: /^\/reviser\/(.+)$/, view: renderReviser, title: 'Entraînement', tab: '/reviser', back: '#/reviser' },
  { path: /^\/examen$/, view: renderExamen, title: 'Examen blanc', tab: '/examen' },
  { path: /^\/examen\/(.+)$/, view: renderExamen, title: 'Examen blanc', tab: '/examen', back: '#/examen' },
  // Les fiches et le livret vivent sous l'onglet Réviser : cinq onglets
  // suffisent, et une cible tactile trop étroite devient inutilisable.
  { path: /^\/cours$/, view: renderCours, title: 'Fiches de révision', tab: '/reviser', back: '#/reviser' },
  { path: /^\/cours\/(.+)$/, view: renderCours, title: 'Fiche', tab: '/reviser', back: '#/cours' },
  { path: /^\/livret$/, view: renderLivret, title: 'Livret du citoyen', tab: '/reviser', back: '#/reviser' },
  { path: /^\/livret\/(.+)$/, view: renderLivret, title: 'Livret du citoyen', tab: '/reviser', back: '#/livret' },
  { path: /^\/progres$/, view: renderProgres, title: 'Ma progression', tab: '/progres' },
  { path: /^\/assistant$/, view: renderAssistant, title: 'Assistant', back: '#/' },
  { path: /^\/assistant\/(.+)$/, view: renderAssistant, title: 'Assistant', back: '#/assistant' },
  { path: /^\/compte$/, view: renderCompte, title: 'Mon compte', back: '#/' },
  { path: /^\/compte\/(.+)$/, view: renderCompte, title: 'Mon compte', back: '#/compte' },
];

/** Empêche de quitter un examen en cours par erreur. */
let guard = null;
export function setGuard(fn) { guard = fn; }

let lastPath = null;

function currentPath() {
  const raw = location.hash.replace(/^#/, '') || '/';
  return raw.startsWith('/') ? raw : `/${raw}`;
}

export function navigate(hash, { replace = false } = {}) {
  if (replace) location.replace(hash);
  else location.hash = hash;
}

async function route() {
  const path = currentPath();

  if (guard && path !== lastPath) {
    const allowed = await guard(path);
    if (!allowed) {
      history.replaceState(null, '', `#${lastPath}`);
      return;
    }
    guard = null;
  }

  if (!store.current()) {
    show({ node: renderOnboarding({ onDone: () => { applyTheme(); route(); } }), title: 'Bienvenue', chrome: false });
    lastPath = path;
    return;
  }

  const match = ROUTES.find((r) => r.path.test(path));
  if (!match) { navigate('#/', { replace: true }); return; }

  const params = path.match(match.path).slice(1).map(decodeURIComponent);
  let result;
  try {
    result = await match.view({ params, path });
  } catch (err) {
    console.error(err);
    toast("Une erreur est survenue.");
    result = h('div', { class: 'empty', text: "Impossible d'afficher cette page." });
  }

  const node = result?.node || result;
  show({
    node,
    title: result?.title || match.title,
    back: result?.back !== undefined ? result.back : match.back,
    tab: result?.hideTabs ? null : match.tab,
    chrome: true,
  });
  lastPath = path;
}

function show({ node, title, back, tab, chrome = true }) {
  bootEl.hidden = true;
  appEl.hidden = false;
  appbar.hidden = !chrome;
  tabbar.hidden = !chrome || !tab;

  titleEl.textContent = title || 'Examen civique';
  document.title = title ? `${title} — Examen civique` : 'Examen civique';

  if (back) {
    backEl.hidden = false;
    backEl.onclick = () => navigate(back);
  } else {
    backEl.hidden = true;
    backEl.onclick = null;
  }

  for (const a of tabbar.querySelectorAll('.tab')) {
    if (a.dataset.tab === tab) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  }

  const name = store.current()?.name || '?';
  avatarEl.textContent = name.trim().slice(0, 1) || '?';
  profileBtn.hidden = !chrome;

  appEl.replaceChildren(node);
  appEl.scrollTop = 0;
  window.scrollTo(0, 0);
}

/** Redessine la vue courante (après un changement de données). */
export function refresh() {
  lastPath = null;
  route();
}

profileBtn.addEventListener('click', () => navigate('#/compte'));
window.addEventListener('hashchange', route);
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyTheme);

/* --------------------------------------------------------- service worker */

if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => { /* hors ligne indisponible : sans gravité */ });
  });
}

/* ------------------------------------------------------- invite à installer */

let installPrompt = null;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  installPrompt = e;
});
export function canInstall() { return Boolean(installPrompt); }
export async function promptInstall() {
  if (!installPrompt) return false;
  installPrompt.prompt();
  const { outcome } = await installPrompt.userChoice;
  installPrompt = null;
  return outcome === 'accepted';
}

/* -------------------------------------------------------------- démarrage */

applyTheme();
amorcer();   // le contexte audio ne peut naître que d'un geste de l'utilisateur
route();

// Expose l'icône aux vues chargées dynamiquement (confort de débogage).
window.__ec = { icon, store };
