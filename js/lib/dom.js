/** Petites aides pour construire l'interface sans dépendance externe. */

import { ICONS } from './icons.js';

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
  svg.innerHTML = ICONS[name] || ICONS.info;
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
      document.removeEventListener('keydown', onKey);
      resolve(value);
    };
    const onKey = (e) => { if (e.key === 'Escape') close(undefined); };
    document.addEventListener('keydown', onKey);

    const panel = h('div', { class: 'modal__panel', role: 'dialog', 'aria-modal': 'true' }, render(close));
    root.append(h('div', { class: 'modal' }, [
      h('div', { class: 'modal__scrim', onclick: () => close(undefined) }),
      panel,
    ]));
    const focusable = panel.querySelector('input, button, select, textarea');
    if (focusable) setTimeout(() => focusable.focus(), 60);
  });
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
