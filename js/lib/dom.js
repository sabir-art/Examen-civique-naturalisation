/** Petites aides pour construire l'interface sans dépendance externe. */

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

/** Icône SVG issue du jeu interne. */
export function icon(name, size) {
  const paths = {
    home: 'M4 11l8-7 8 7v9a1 1 0 0 1-1 1h-5v-6h-4v6H5a1 1 0 0 1-1-1z',
    flag: 'M5 21V4m0 0h11l-2 4 2 4H5',
    bank: 'M3 10h18M5 10v8m4-8v8m6-8v8m4-8v8M2 21h20M12 3l9 5H3z',
    scale: 'M12 4v17M7 21h10M12 6l-6 2m6-2l6 2M6 8l-3 6h6zm12 0l-3 6h6z',
    book: 'M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3zM19 17H8a3 3 0 0 0-3 3',
    clock: 'M12 3a9 9 0 1 0 9 9M12 7v5l3.5 2.5M16 3h5v5',
    chevron: 'M9 5l7 7-7 7',
    back: 'M15 5l-7 7 7 7',
    check: 'M4 12.5l5 5L20 6.5',
    cross: 'M6 6l12 12M18 6L6 18',
    chart: 'M4 20V10M10 20V4M16 20v-7M22 20H2',
    user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0',
    cog: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5v.2a2 2 0 0 1-4 0v-.1a1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1a1.6 1.6 0 0 0 1.5-1 1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3H9a1.6 1.6 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V9a1.6 1.6 0 0 0 1.5 1h.2a2 2 0 0 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z',
    refresh: 'M20 11A8 8 0 0 0 6.3 6.3L3 9m1 4a8 8 0 0 0 13.7 4.7L21 15M21 4v5h-5M3 20v-5h5',
    play: 'M6 4l14 8-14 8z',
    target: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zm0-4a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0-4a1 1 0 1 0 0-2 1 1 0 0 0 0 2z',
    fire: 'M12 22c4 0 7-2.7 7-6.5 0-4.5-4-6.5-3-11.5-3 1-6 4.2-6 8 0-1.5-1-3-2-3.5-.7 1.4-1 2.8-1 4.5C7 19.3 8 22 12 22z',
    download: 'M12 3v12m0 0l-4-4m4 4l4-4M4 21h16',
    upload: 'M12 21V9m0 0l-4 4m4-4l4 4M4 3h16',
    warn: 'M12 9v5m0 3h.01M10.3 3.9L2.4 17.5A2 2 0 0 0 4.1 20.5h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z',
    info: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zm0-13h.01M11 12h1v5h1',
    logout: 'M15 17l5-5-5-5M20 12H9M12 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h6',
    cloud: 'M6.5 19a4.5 4.5 0 0 1-.4-9A6 6 0 0 1 17.7 9.3 4 4 0 0 1 17.5 19z',
    inbox: 'M3 13h4l2 3h6l2-3h4M3 13l2.6-7.3A2 2 0 0 1 7.5 4.4h9a2 2 0 0 1 1.9 1.3L21 13v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
    trash: 'M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m2 0v13a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V7',
    plus: 'M12 5v14M5 12h14',
    star: 'M12 3.5l2.6 5.6 6 .8-4.4 4.2 1.1 6.1-5.3-3-5.3 3 1.1-6.1L3.4 9.9l6-.8z',
  };
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('aria-hidden', 'true');
  if (size) { svg.style.width = `${size}px`; svg.style.height = `${size}px`; }
  const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  p.setAttribute('d', paths[name] || paths.info);
  svg.append(p);
  return svg;
}

/**
 * Vignette décorative d'une carte.
 *
 * Les deux versions (claire et sombre) sont posées dans le document et c'est la
 * feuille de style qui montre la bonne : un SVG chargé en `<img>` n'hérite pas
 * des couleurs de la page, et le thème « automatique » peut basculer sans
 * rechargement. L'ensemble des vignettes pèse 28 Ko, le doublon est indolore.
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
