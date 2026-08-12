/**
 * Composants de base du système de design — `components/core/` du système.
 *
 * Portage fidèle des `.jsx` fournis : mêmes noms, mêmes propriétés, mêmes
 * variantes, même structure de DOM. Deux différences de forme, aucune de fond :
 *
 *  — l'application n'a pas d'étape de compilation, donc les composants sont
 *    des fonctions qui rendent un élément du document au lieu de JSX ;
 *  — les styles vivent dans `assets/css/civica-components.css` et non dans
 *    l'attribut `style`. Les valeurs sont recopiées une par une depuis les
 *    fichiers du système ; le style en ligne des `.jsx` est une commodité de
 *    maquette, pas une règle du système, et il rendait le survol, l'appui et
 *    le thème sombre impossibles à écrire sans JavaScript.
 *
 * La règle de fond reste : on ne redessine pas un composant dans une vue. Si
 * une vue a besoin d'autre chose, elle ajoute une variante ICI.
 */

import { h, icon as glyphe } from '../lib/dom.js';

/* --------------------------------------------------------------- Icon */

/**
 * Enveloppe d'icône. Le système passe par Lucide ; l'application embarque le
 * même jeu, extrait pour ne garder que les icônes utilisées.
 */
export function Icon({ name, size = 20, strokeWidth = 2, className = '' } = {}) {
  const svg = glyphe(name, size);
  svg.setAttribute('class', `ds-icon ${className}`.trim());
  if (strokeWidth !== 2) svg.style.strokeWidth = String(strokeWidth);
  return svg;
}

/* ------------------------------------------------------------- Button */

/**
 * La pilule d'action.
 * `primary` est l'encre — une seule par écran. `tonal`, `mint` et `butter`
 * portent les pastels. `secondary` est blanche avec un filet.
 */
export function Button({
  label, children, variant = 'primary', size = 'md', iconLeft, iconRight,
  fullWidth = false, disabled = false, href, onClick, className = '', ...reste
} = {}) {
  const tag = href ? 'a' : 'button';
  const el = h(tag, {
    class: `ds-btn ds-btn--${variant} ds-btn--${size}${fullWidth ? ' ds-btn--full' : ''}${className ? ` ${className}` : ''}`,
    type: href ? null : 'button',
    href: href || null,
    disabled: !href && disabled ? true : null,
    'aria-disabled': href && disabled ? 'true' : null,
    onclick: onClick || null,
    ...reste,
  }, [
    iconLeft ? Icon({ name: iconLeft, size: size === 'sm' ? 16 : size === 'lg' ? 20 : 18 }) : null,
    children !== undefined ? children : h('span', { text: label ?? '' }),
    iconRight ? Icon({ name: iconRight, size: size === 'sm' ? 16 : size === 'lg' ? 20 : 18 }) : null,
  ].filter((x) => x !== null));
  return el;
}

/* --------------------------------------------------------- IconButton */

/** Action ronde à un seul glyphe — barres du haut, coins de carte. */
export function IconButton({
  icon: nom, variant = 'white', size = 'md', badge = false, label,
  shape = 'circle', onClick, className = '', ...reste
} = {}) {
  return h('button', {
    class: `ds-iconbtn ds-iconbtn--${variant} ds-iconbtn--${size} ds-iconbtn--${shape}${className ? ` ${className}` : ''}`,
    type: 'button',
    'aria-label': label,
    onclick: onClick || null,
    ...reste,
  }, [
    Icon({ name: nom, size: size === 'sm' ? 16 : size === 'lg' ? 22 : 18 }),
    badge ? h('span', { class: 'ds-iconbtn__dot' }) : null,
  ].filter(Boolean));
}

/* --------------------------------------------------------------- Chip */

/** Petite pilule d'information : difficulté, thème, date, compte. */
export function Chip({
  label, children, tone = 'white', icon: nom, iconRight, size = 'md',
  elevated = false, pressed, onClick, href, className = '', ...reste
} = {}) {
  const tag = href ? 'a' : onClick ? 'button' : 'span';
  return h(tag, {
    class: `ds-chip ds-chip--${tone} ds-chip--${size}${elevated ? ' ds-chip--elev' : ''}${className ? ` ${className}` : ''}`,
    type: tag === 'button' ? 'button' : null,
    href: href || null,
    'aria-pressed': pressed === undefined ? null : String(pressed),
    onclick: onClick || null,
    ...reste,
  }, [
    nom ? Icon({ name: nom, size: size === 'sm' ? 12 : 14 }) : null,
    children !== undefined ? children : h('span', { text: label ?? '' }),
    iconRight ? Icon({ name: iconRight, size: size === 'sm' ? 12 : 14 }) : null,
  ].filter((x) => x !== null));
}

/* -------------------------------------------------------------- Badge */

/** Marqueur d'état compact — comptes, « Nouveau », écarts de score. */
export function Badge({ label, children, tone = 'neutral', dot = false, className = '', ...reste } = {}) {
  return h('span', {
    class: `ds-badge ds-badge--${tone}${className ? ` ${className}` : ''}`,
    ...reste,
  }, [
    dot ? h('span', { class: 'ds-badge__dot' }) : null,
    children !== undefined ? children : h('span', { text: String(label ?? '') }),
  ].filter((x) => x !== null));
}

/* --------------------------------------------------------------- Card */

/**
 * Le conteneur de base. Tout, sur un écran du système, vit dans l'un d'eux.
 * `surface` choisit l'aplat, `padding` l'aération, `radius` la rondeur,
 * `elevation` l'ombre — et les pastels ne s'empilent pas.
 */
export function Card({
  children, surface = 'white', padding = 'md', radius = 'card',
  elevation = 'none', bordered = false, interactive = false,
  href, onClick, className = '', ...reste
} = {}) {
  const tag = href ? 'a' : 'div';
  const cliquable = interactive || !!onClick || !!href;
  return h(tag, {
    class: [
      'ds-card',
      `ds-card--${surface}`,
      `ds-card--pad-${padding}`,
      `ds-card--r-${radius}`,
      `ds-card--e-${elevation}`,
      bordered ? 'ds-card--bordered' : '',
      cliquable ? 'ds-card--interactive' : '',
      className,
    ].filter(Boolean).join(' '),
    href: href || null,
    onclick: onClick || null,
    ...reste,
  }, children);
}

/* ------------------------------------------------------------- Avatar */

const ANNEAUX = ['blush', 'lavender', 'mint', 'butter'];
const empreinte = (s) => String(s).split('').reduce((a, c) => a + c.charCodeAt(0), 0);

/** Portrait rond. À défaut d'image, les initiales sur un pastel tournant. */
export function Avatar({ name = '', src, size = 36, ring, className = '', ...reste } = {}) {
  const initiales = name.split(/\s+/).filter(Boolean).slice(0, 2).map((m) => m[0]).join('').toUpperCase();
  const teinte = ring || ANNEAUX[empreinte(name) % ANNEAUX.length];
  return h('span', {
    class: `ds-avatar ds-avatar--${teinte}${className ? ` ${className}` : ''}`,
    title: name || null,
    style: `width:${size}px;height:${size}px;font-size:${Math.max(10, Math.round(size * 0.34))}px`,
    ...reste,
  }, src
    ? h('img', { src, alt: name, width: size, height: size })
    : h('span', { text: initiales }));
}

/* -------------------------------------------------------- AvatarStack */

/** Rangée d'avatars qui se chevauchent, avec une pastille « +n ». */
export function AvatarStack({ people = [], max = 3, size = 30, overflowLabel, className = '' } = {}) {
  const montres = people.slice(0, max);
  const reste = people.length - montres.length;
  return h('span', { class: `ds-avatars${className ? ` ${className}` : ''}` }, [
    h('span', { class: 'ds-avatars__row' }, montres.map((p, i) => Avatar({
      name: typeof p === 'string' ? p : p.name,
      src: typeof p === 'string' ? undefined : p.src,
      size,
      className: 'ds-avatars__item',
      style: `width:${size}px;height:${size}px;font-size:${Math.max(10, Math.round(size * 0.34))}px;margin-left:${i === 0 ? 0 : -Math.round(size * 0.3)}px;z-index:${montres.length - i}`,
    }))),
    reste > 0 || overflowLabel
      ? h('span', { class: 'ds-avatars__more', text: overflowLabel || `+${reste}` })
      : null,
  ].filter(Boolean));
}

/* ----------------------------------------------------------- IconTile */

/** Porte-glyphe en carré arrondi qui étiquette une carte ou une ligne. */
export function IconTile({ icon: nom, tone = 'white', size = 40, radius, elevated = false, className = '' } = {}) {
  return h('span', {
    class: `ds-tile ds-tile--${tone}${elevated ? ' ds-tile--elev' : ''}${className ? ` ${className}` : ''}`,
    style: `width:${size}px;height:${size}px${radius ? `;border-radius:${radius}` : (size >= 48 ? ';border-radius:var(--radius-lg)' : '')}`,
  }, Icon({ name: nom, size: Math.round(size * 0.5) }));
}

/* ------------------------------------------------------ SectionHeader */

/** « Vos thèmes · Tout voir » — la ligne qui ouvre une section d'écran. */
export function SectionHeader({ title, action, href, onAction, count, className = '' } = {}) {
  return h('div', { class: `ds-sechead${className ? ` ${className}` : ''}` }, [
    h('div', { class: 'ds-sechead__left' }, [
      h('span', { class: 'ds-sechead__title', text: title }),
      count != null ? h('span', { class: 'ds-sechead__count', text: String(count) }) : null,
    ].filter(Boolean)),
    action ? h(href ? 'a' : 'button', {
      class: 'ds-sechead__action',
      type: href ? null : 'button',
      href: href || null,
      onclick: onAction || null,
    }, [h('span', { text: action }), Icon({ name: 'chevron-right', size: 14 })]) : null,
  ].filter(Boolean));
}
