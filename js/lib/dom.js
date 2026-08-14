/** Petites aides pour construire l'interface sans dépendance externe. */

import { ICONS, nomIcone } from './icons.js';

/**
 * Crée un élément. `attrs` accepte class, html, text, dataset, aria-*, on*
 * (gestionnaires d'événements) et tout attribut HTML classique.
 */
export function h(tag, attrs = {}, children = []) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v === null || v === undefined || v === false) continue;
    if (k === 'class') el.className = v;
    else if (k === 'html') el.innerHTML = v;
    else if (k === 'text') el.textContent = v;
    else if (k === 'dataset') Object.assign(el.dataset, v);
    else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2).toLowerCase(), v);
    else if (v === true) el.setAttribute(k, '');
    else el.setAttribute(k, v);
  }
  for (const c of [].concat(children)) {
    if (c === null || c === undefined || c === false) continue;
    el.append(c instanceof Node ? c : document.createTextNode(String(c)));
  }
  return el;
}

/**
 * Icône SVG.
 *
 * Le jeu vient de Lucide (voir js/lib/icons.js) : les icônes dessinées à la
 * main de la première version étaient irrégulières. Toutes sont tracées sur la
 * même grille de 24, sans remplissage, et suivent `currentColor`.
 */
export function icon(name, size) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('aria-hidden', 'true');
  if (size) { svg.style.width = `${size}px`; svg.style.height = `${size}px`; }
  // `nomIcone` accepte les deux vocabulaires : le nôtre et celui de Lucide,
  // dont se servent les composants du système de design.
  svg.innerHTML = ICONS[nomIcone(name)] || ICONS.info;
  return svg;
}

/**
 * Vignette décorative d'une carte.
 *
 * Les deux versions (claire et sombre) sont posées dans le document et c'est la
 * feuille de style qui montre la bonne : un SVG chargé en `<img>` n'hérite pas
 * des couleurs de la page, et le thème « automatique » peut basculer sans
 * rechargement.
 */
export function spot(name, extraClass = '') {
  return h('span', { class: `spot ${extraClass}`.trim(), 'aria-hidden': 'true' }, [
    h('img', { class: 'spot__l', src: `./assets/spot/${name}-clair.svg`, alt: '', loading: 'lazy', width: '300', height: '170' }),
    h('img', { class: 'spot__d', src: `./assets/spot/${name}-sombre.svg`, alt: '', loading: 'lazy', width: '300', height: '170' }),
  ]);
}

let toastTimer;
export function toast(message, ms = 2600) {
  const el = document.getElementById('toast');
  el.textContent = message;
  el.classList.add('is-on');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('is-on'), ms);
}

/**
 * Feuille modale. `render(close)` doit renvoyer le contenu du panneau.
 * Renvoie une promesse résolue avec la valeur passée à close().
 */
export function modal(render) {
  return new Promise((resolve) => {
    const root = document.getElementById('modal-root');
    const close = (value) => {
      root.replaceChildren();
      document.body.classList.remove('is-locked');
      document.removeEventListener('keydown', onKey);
      resolve(value);
    };
    const onKey = (e) => { if (e.key === 'Escape') close(undefined); };
    document.addEventListener('keydown', onKey);

    const panel = h('div', { class: 'modal__panel', role: 'dialog', 'aria-modal': 'true' }, [
      h('span', { class: 'modal__grip', 'aria-hidden': 'true' }),
      ...[].concat(render(close)).filter(Boolean),
    ]);
    root.append(h('div', { class: 'modal' }, [
      h('div', { class: 'modal__scrim', onclick: () => close(undefined) }),
      panel,
    ]));

    // La page de derrière ne défile plus tant que la feuille est ouverte : sur
    // un téléphone, le doigt qui glisse sur la feuille entraînait le chapitre
    // en dessous, et l'on perdait sa place en lisant une définition.
    document.body.classList.add('is-locked');
    glisserPourFermer(panel, () => close(undefined));

    const focusable = panel.querySelector('input, button, select, textarea');
    if (focusable) setTimeout(() => focusable.focus(), 60);
  });
}

/**
 * Tirer la feuille vers le bas la ferme.
 *
 * Le geste ne prend la main QUE si le contenu est déjà en haut de sa course :
 * sinon on ne pourrait plus faire défiler une définition longue sans fermer la
 * feuille par accident. En dessous du seuil, elle revient en place.
 */
function glisserPourFermer(panneau, fermer) {
  const SEUIL = 90;
  const corps = panneau.querySelector('.ds-sheet__body, .modal__body') || panneau;
  let depart = null;
  let delta = 0;

  panneau.addEventListener('touchstart', (e) => {
    if (corps.scrollTop > 0) { depart = null; return; }
    depart = e.touches[0].clientY;
    delta = 0;
    panneau.style.transition = 'none';
  }, { passive: true });

  panneau.addEventListener('touchmove', (e) => {
    if (depart === null) return;
    delta = e.touches[0].clientY - depart;
    if (delta <= 0) { panneau.style.transform = ''; return; }
    // `preventDefault` : sans lui, Safari continue de faire défiler la page
    // derrière pendant que la feuille suit le doigt.
    if (e.cancelable) e.preventDefault();
    panneau.style.transform = `translateY(${delta}px)`;
  }, { passive: false });

  const relacher = () => {
    if (depart === null) return;
    panneau.style.transition = '';
    panneau.style.transform = '';
    depart = null;
    if (delta > SEUIL) fermer();
  };
  panneau.addEventListener('touchend', relacher);
  panneau.addEventListener('touchcancel', relacher);
}

/** Boîte de confirmation. */
export function confirmDialog({ title, text, confirmLabel = 'Confirmer', danger = false }) {
  return modal((close) => [
    h('h2', { class: 'modal__title', text: title }),
    text ? h('p', { class: 'modal__text', text }) : null,
    h('div', { class: 'stack stack--tight' }, [
      h('button', {
        class: `btn ${danger ? 'btn--danger' : ''}`,
        type: 'button',
        text: confirmLabel,
        onclick: () => close(true),
      }),
      h('button', { class: 'btn btn--ghost', type: 'button', text: 'Annuler', onclick: () => close(false) }),
    ]),
  ]);
}
