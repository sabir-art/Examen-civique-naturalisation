/**
 * Point d'entrée : thème, service worker, routeur et coquille de l'application.
 */

import * as store from './store.js';
import { amorcer } from './lib/feedback.js';
import { h, icon, toast } from './lib/dom.js';
import { badgesObtenus } from './lib/xp.js';
import * as rappel from './lib/rappel.js';

import renderOnboarding from './views/onboarding.js';
import renderHome from './views/home.js';
import renderReviser from './views/reviser.js';
import renderExamen from './views/examen.js';
import renderCours from './views/cours.js';
import renderLivret from './views/livret.js';
import renderRoman from './views/roman.js';
import renderCartes from './views/cartes.js';
import renderProgres from './views/progres.js';
import renderParcours from './views/parcours.js';
import renderCompte from './views/compte.js';
import renderAssistant from './views/assistant.js';
import renderRecherche from './views/recherche.js';
import renderActivite, { nonLus } from './views/activite.js';

const appEl = document.getElementById('app');
const bootEl = document.getElementById('boot');
const bootTextEl = document.getElementById('boot-text');
const appbar = document.getElementById('appbar');
const tabbar = document.getElementById('tabbar');
const titleEl = document.getElementById('appbar-title');
const backEl = document.getElementById('appbar-back');
const avatarEl = document.getElementById('appbar-avatar');
const profileBtn = document.getElementById('appbar-profile');
const searchBtn = document.getElementById('appbar-search');
const bellBtn = document.getElementById('appbar-bell');
const dotEl = document.getElementById('appbar-dot');

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
  { path: /^\/cartes$/, view: renderCartes, title: 'Cartes mémoire', tab: '/reviser', back: '#/reviser' },
  { path: /^\/cartes\/(.+)$/, view: renderCartes, title: 'Cartes mémoire', tab: '/reviser', back: '#/reviser' },
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
  { path: /^\/parcours$/, view: renderParcours, title: 'Mon parcours', tab: '/progres', back: '#/progres' },
  { path: /^\/recherche$/, view: renderRecherche, title: 'Rechercher', back: '#/' },
  { path: /^\/activite$/, view: renderActivite, title: 'Activité', back: '#/' },
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

  // Les badges sont calculés, mais leur date d'obtention ne se devine pas :
  // on l'inscrit au passage, ce qui alimente le journal d'activité.
  store.stampBadges(badgesObtenus().map((b) => b.id));

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
  hideSplash();
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
  // Recherche et activité n'apparaissent que sur les écrans de premier niveau :
  // sur une page de détail, quatre boutons ne laisseraient plus la place au
  // titre, et l'on y vient pour lire, pas pour chercher ailleurs.
  const racine = chrome && !back;
  searchBtn.hidden = !racine;
  bellBtn.hidden = !racine;
  if (racine) majPastille();

  appEl.replaceChildren(node);
  appEl.scrollTop = 0;
  window.scrollTo(0, 0);
}

/** Pastille du carillon : nombre d'évènements depuis la dernière visite. */
function majPastille() {
  let n = 0;
  try { n = nonLus(); } catch { n = 0; }
  dotEl.hidden = n === 0;
  bellBtn.setAttribute('aria-label', n > 0 ? `Activité — ${n} nouveauté${n > 1 ? 's' : ''}` : 'Activité');
}

/** Redessine la vue courante (après un changement de données). */
export function refresh() {
  lastPath = null;
  route();
}

profileBtn.addEventListener('click', () => navigate('#/compte'));
searchBtn.addEventListener('click', () => navigate('#/recherche'));
bellBtn.addEventListener('click', () => navigate('#/activite'));
window.addEventListener('hashchange', route);
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyTheme);

/* ------------------------------------------------------ écran d'ouverture */

/*
 * L'écran d'ouverture tient un temps minimum, même si l'application est prête
 * avant. Ce n'est pas de la lenteur ajoutée pour faire joli : sans ce délai,
 * la cocarde apparaît et disparaît dans le même seizième de seconde, et l'on
 * ne sait pas si l'application vient d'être ouverte ou n'a jamais été fermée.
 *
 * Il revient aussi au retour au premier plan après une absence prolongée : sur
 * iPhone, une application installée n'est pas rechargée quand on y revient,
 * elle est simplement dégelée. Sans ce rappel, rouvrir l'application le
 * lendemain donnerait exactement l'écran de la veille, sans transition.
 */
const MOUVEMENT_REDUIT = matchMedia('(prefers-reduced-motion: reduce)');
const TENUE_DEMARRAGE = 1250;   // première ouverture
const TENUE_RETOUR = 950;       // retour au premier plan
const ABSENCE_MIN = 4 * 60 * 1000;

const demarreA = Date.now();
let splashMasque = false;
let sortieEnCours = null;

function tenue(base) {
  return MOUVEMENT_REDUIT.matches ? Math.min(400, base) : base;
}

function masquerMaintenant() {
  bootEl.classList.add('is-leaving');
  clearTimeout(sortieEnCours);
  sortieEnCours = setTimeout(() => {
    bootEl.hidden = true;
    bootEl.classList.remove('is-leaving');
  }, 400);
}

function hideSplash() {
  if (splashMasque) return;
  splashMasque = true;
  const reste = Math.max(0, tenue(TENUE_DEMARRAGE) - (Date.now() - demarreA));
  setTimeout(masquerMaintenant, reste);
}

/** Rejoue l'écran d'ouverture, avec un mot d'accueil. */
function rejouerSplash() {
  clearTimeout(sortieEnCours);
  const nom = store.current()?.name;
  const heure = new Date().getHours();
  bootTextEl.textContent = nom
    ? `${heure < 18 ? 'Bon retour' : 'Bonsoir'}, ${nom}`
    : 'Préparation à la naturalisation';

  bootEl.classList.remove('is-leaving');
  bootEl.hidden = false;
  // Forcer un recalcul relance les animations d'entrée : sans cela, le
  // navigateur considère qu'elles ont déjà été jouées et n'affiche rien.
  void bootEl.offsetWidth;
  for (const el of bootEl.querySelectorAll('.boot__ring, .boot__spark, .boot__name, .boot__text, .boot__load')) {
    el.style.animation = 'none';
    void el.offsetWidth;
    el.style.animation = '';
  }
  setTimeout(masquerMaintenant, tenue(TENUE_RETOUR));
}

let masqueA = null;
document.addEventListener('visibilitychange', () => {
  if (document.hidden) { masqueA = Date.now(); return; }
  const absence = masqueA ? Date.now() - masqueA : 0;
  masqueA = null;
  if (absence > ABSENCE_MIN && store.current()) {
    rejouerSplash();
    refresh();          // la série, les échéances et le journal ont pu changer
  }
  rappel.verifier().catch(() => { /* notification refusée : sans conséquence */ });
});

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

// Mot d'accueil avant même le premier rendu : la personne se reconnaît tout de
// suite, et l'écran d'ouverture ne ressemble plus à un simple chargement.
const accueilli = store.current()?.name;
if (accueilli) {
  bootTextEl.textContent = `${new Date().getHours() < 18 ? 'Bon retour' : 'Bonsoir'}, ${accueilli}`;
}

route();
rappel.verifier().catch(() => { /* notification refusée : sans conséquence */ });

// Expose l'icône aux vues chargées dynamiquement (confort de débogage).
window.__ec = { icon, store };
