/**
 * Point d'entrée : thème, service worker, routeur et coquille de l'application.
 */

import * as store from './store.js';
import { amorcer } from './lib/feedback.js';
import { h, toast } from './lib/dom.js';
import { TopBar, BottomNav } from './ds/navigation.js';
import { Avatar } from './ds/core.js';
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
const hautEl = document.getElementById('chrome-top');
const basEl = document.getElementById('chrome-bottom');

/* --------------------------------------------------------------- châssis */

/**
 * Les cinq onglets, jamais plus : au-delà, les cibles tactiles deviennent trop
 * petites sur un petit téléphone. Les fiches et le livret restent accessibles
 * depuis Réviser et depuis l'accueil.
 */
const ONGLETS = [
  { value: '/', icon: 'house', label: 'Accueil', href: '#/' },
  { value: '/histoire', icon: 'star', label: 'Histoire', href: '#/histoire' },
  { value: '/reviser', icon: 'book-open', label: 'Réviser', href: '#/reviser' },
  { value: '/examen', icon: 'timer', label: 'Examen', href: '#/examen' },
  { value: '/progres', icon: 'chart-column', label: 'Progrès', href: '#/progres' },
];

/**
 * Dessine la barre du haut avec le composant `TopBar` du système.
 *
 * Deux formes, exactement celles qu'il prévoit : `profile` sur un onglet
 * racine — avatar, salutation, actions — et `title` dans un écran où l'on est
 * entré. Elle est redessinée à chaque navigation plutôt que modifiée sur
 * place : un composant se rend, il ne se rafistole pas.
 */
function dessinerHaut({ title, back, chrome }) {
  hautEl.replaceChildren();
  if (!chrome) return;
  const profil = store.current();
  const nom = profil?.name || '';
  const racine = !back;

  // Recherche et activité n'apparaissent que sur les écrans de premier
  // niveau : sur une page de détail, quatre boutons ne laisseraient plus la
  // place au titre, et l'on y vient pour lire, pas pour chercher ailleurs.
  const actions = [];
  if (racine) {
    actions.push({ icon: 'search', label: 'Rechercher', onClick: () => navigate('#/recherche') });
    let n = 0;
    try { n = nonLus(); } catch { n = 0; }
    actions.push({
      icon: 'bell',
      label: n > 0 ? `Activité — ${n} nouveauté${n > 1 ? 's' : ''}` : 'Activité',
      badge: n > 0,
      onClick: () => navigate('#/activite'),
    });
  }

  const avatar = h('button', {
    class: 'chrome__avatar', type: 'button', 'aria-label': 'Mon compte',
    onclick: () => navigate('#/compte'),
  }, Avatar({ name: nom, size: 40 }));

  hautEl.append(TopBar({
    variant: racine ? 'profile' : 'title',
    // Sur un onglet racine, la barre porte le nom de la personne sous une
    // salutation — la forme `profile` du système. Le titre de l'écran serait
    // redondant avec l'onglet allumé juste en dessous.
    title: racine ? nom : title,
    subtitle: racine ? salutation() : null,
    // Conservé pour les écrans où l'on entre : c'est là que le titre compte.
    name: nom,
    avatar,
    onBack: back ? () => navigate(back) : null,
    actions,
  }));
}

/** « Bonjour » avant 18 h, « Bonsoir » ensuite. */
function salutation() {
  return new Date().getHours() < 18 ? 'Bonjour' : 'Bonsoir';
}

/** Dessine la barre d'onglets avec le composant `BottomNav` du système. */
function dessinerBas(tab) {
  basEl.replaceChildren();
  if (!tab) return;
  basEl.append(BottomNav({ items: ONGLETS, value: tab }));
}

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

  dessinerHaut({ title, back, chrome });
  dessinerBas(chrome ? tab : null);

  document.title = title ? `${title} — Examen civique` : 'Examen civique';

  // Le système de design distingue deux fonds : les onglets racines posent
  // leurs cartes sur un fond teinté, les écrans dans lesquels on entre — quiz,
  // résultat, réglages — sur un fond neutre presque blanc. C'est ce qui fait
  // qu'un quiz se lit comme une feuille et pas comme une page de plus.
  document.body.classList.toggle('is-plain', !(chrome && tab));

  appEl.replaceChildren(node);
  appEl.scrollTop = 0;
  window.scrollTo(0, 0);
}

/**
 * Escamote la barre d'onglets pendant un questionnaire lancé depuis un écran
 * qui, lui, la garde — le choix d'un thème, par exemple.
 *
 * Un questionnaire en cours pose déjà un garde-fou : partir demande une
 * confirmation. La barre n'y mène donc nulle part, et les quatre-vingt-seize
 * pixels qu'elle réserve manquent en bas, là où la dernière réponse se cache
 * sous le bouton. Les autres modes la masquaient déjà par `hideTabs` ; celui-ci
 * ne le pouvait pas, le questionnaire naissant après le rendu de l'écran. Le
 * prochain passage du routeur rétablit l'état normal.
 */
export function masquerOnglets() {
  basEl.replaceChildren();
  document.body.classList.add('is-plain');
}

/** Redessine la vue courante (après un changement de données). */
export function refresh() {
  lastPath = null;
  route();
}

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

