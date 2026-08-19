/**
 * Composants de données — `components/data/` du système.
 * Barre et anneau de progression, tuile de chiffre, calendrier de série.
 */

import { h } from '../lib/dom.js';
import { Icon } from './core.js';

/* -------------------------------------------------------- ProgressBar */

/**
 * Piste arrondie épaisse — avancement d'étude, position dans un quiz,
 * objectif du jour. `onTint` la pose sur un aplat pastel, où la piste devient
 * du blanc translucide.
 */
export function ProgressBar({
  value = 0, max = 100, height = 10, tone = 'ink', onTint = false,
  label, showValue = false, className = '',
} = {}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return h('div', { class: `ds-pbar${className ? ` ${className}` : ''}` }, [
    label || showValue ? h('div', { class: 'ds-pbar__head' }, [
      label ? h('span', { class: 'ds-pbar__label', text: label }) : h('span'),
      showValue ? h('span', { class: 'ds-pbar__value', text: `${Math.round(pct)} %` }) : null,
    ].filter(Boolean)) : null,
    h('div', {
      class: `ds-pbar__track${onTint ? ' ds-pbar__track--tint' : ''}`,
      role: 'progressbar',
      'aria-valuenow': String(Math.round(value)),
      'aria-valuemin': '0',
      'aria-valuemax': String(max),
      style: `height:${height}px`,
    }, h('div', { class: `ds-pbar__fill ds-pbar__fill--${tone}`, style: `width:${pct}%` })),
  ].filter(Boolean));
}

/* ------------------------------------------------------- ProgressRing */

/** Cadran circulaire — chiffres de profil et objectif du jour. */
export function ProgressRing({
  value = 0, max = 100, size = 96, thickness = 10,
  tone = 'ink', children, label, caption, className = '',
} = {}) {
  const pct = Math.max(0, Math.min(1, value / max));
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', String(size));
  svg.setAttribute('height', String(size));
  svg.setAttribute('class', 'ds-ring__svg');
  svg.innerHTML = `
    <circle class="ds-ring__track" cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke-width="${thickness}"/>
    <circle class="ds-ring__value ds-ring__value--${tone}" cx="${size / 2}" cy="${size / 2}" r="${r}"
            fill="none" stroke-width="${thickness}" stroke-linecap="round"
            stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - pct)}"/>`;
  return h('div', {
    class: `ds-ring${className ? ` ${className}` : ''}`,
    style: `width:${size}px;height:${size}px`,
  }, [
    svg,
    h('div', { class: 'ds-ring__center' }, [
      h('span', {
        class: 'ds-ring__label',
        style: `font-size:${Math.round(size * 0.24)}px`,
        text: children != null ? String(children) : (label ?? `${Math.round(pct * 100)} %`),
      }),
      caption ? h('span', { class: 'ds-ring__caption', text: caption }) : null,
    ].filter(Boolean)),
  ]);
}

/* ----------------------------------------------------------- StatTile */

/** Un chiffre et son intitulé — la grille de statistiques du profil. */
export function StatTile({
  value, unit, label, icon: nom, surface = 'white', delta, align = 'left', href, className = '',
} = {}) {
  const chiffre = String(value);
  // Le chiffre garde sa taille tant qu'il est court, puis descend d'un cran,
  // de deux, de trois : trois tuiles se partagent la largeur d'un téléphone,
  // et « 233/735 » à la taille d'un titre sortait de sa carte pour se poser
  // sur la voisine. Aucune règle CSS ne sait compter des caractères ; c'est
  // donc ici, où la valeur est connue, que la mesure se fait.
  //
  // La longueur qui compte est celle du TOUT, unité comprise : « 233 » tient
  // largement, « 233/735 » non, et c'est pourtant ce qui est affiché.
  const largeur = chiffre.length + String(unit || '').length;
  const cran = largeur >= 12 ? ' ds-stat__value--minuscule'
    : largeur >= 8 ? ' ds-stat__value--petit'
      : largeur >= 5 ? ' ds-stat__value--moyen' : '';
  return h(href ? 'a' : 'div', {
    class: `ds-stat ds-stat--${surface}${align === 'center' ? ' ds-stat--center' : ''}${className ? ` ${className}` : ''}`,
    href: href || null,
  }, [
    nom ? Icon({ name: nom, size: 18, className: 'ds-stat__icon' }) : null,
    h('span', { class: `ds-stat__value${cran}` }, [
      h('span', { text: chiffre }),
      // L'unité est un élément à part, plus petit : « 233 » reste un nombre
      // qu'on lit d'un coup d'œil, « /735 » l'accompagne sans l'écraser.
      unit ? h('span', { class: 'ds-stat__unit', text: unit }) : null,
    ].filter(Boolean)),
    h('span', { class: 'ds-stat__foot' }, [
      h('span', { class: 'ds-stat__label', text: label }),
      delta ? h('span', { class: 'ds-stat__delta', text: delta }) : null,
    ].filter(Boolean)),
  ].filter(Boolean));
}

/* ---------------------------------------------------- StreakCalendar */

const JOURS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

/**
 * Grille du mois marquant les jours travaillés : beurre pour un jour
 * travaillé, encre pour aujourd'hui.
 */
export function StreakCalendar({
  month = '', firstWeekday = 1, daysInMonth = 30,
  studied = [], today, onPrev, onNext, onSelect, className = '',
} = {}) {
  const cases = [];
  for (let i = 0; i < firstWeekday - 1; i += 1) cases.push(null);
  for (let d = 1; d <= daysInMonth; d += 1) cases.push(d);
  while (cases.length % 7 !== 0) cases.push(null);

  return h('div', { class: `ds-cal${className ? ` ${className}` : ''}` }, [
    h('div', { class: 'ds-cal__head' }, [
      onPrev ? h('button', { class: 'ds-cal__nav', type: 'button', 'aria-label': 'Mois précédent', onclick: onPrev },
        Icon({ name: 'chevron-left', size: 16 })) : h('span'),
      h('span', { class: 'ds-cal__month', text: month }),
      onNext ? h('button', { class: 'ds-cal__nav', type: 'button', 'aria-label': 'Mois suivant', onclick: onNext },
        Icon({ name: 'chevron-right', size: 16 })) : h('span'),
    ]),
    h('div', { class: 'ds-cal__grid' }, [
      ...JOURS.map((j) => h('span', { class: 'ds-cal__dow', text: j })),
      ...cases.map((d) => {
        if (d == null) return h('span');
        const cls = d === today ? 'ds-cal__day ds-cal__day--today'
          : studied.includes(d) ? 'ds-cal__day ds-cal__day--on'
            : 'ds-cal__day';
        return h('button', {
          class: cls, type: 'button', text: String(d),
          onclick: onSelect ? () => onSelect(d) : null,
        });
      }),
    ]),
  ]);
}
