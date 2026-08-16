/**
 * Composants de navigation — `components/navigation/` du système.
 *
 * `PhoneFrame` n'est pas porté : c'est un dispositif de présentation destiné
 * à montrer un écran à 390×844 dans une planche, pas de l'interface de
 * produit. L'application EST le téléphone.
 */

import { h } from '../lib/dom.js';
import { Icon, IconButton, Avatar } from './core.js';

/* -------------------------------------------------------------- TopBar */

/**
 * En-tête d'écran. Deux formes : `profile` (avatar, salutation, actions) pour
 * les onglets racines, `title` (retour et titre) pour les écrans dans
 * lesquels on entre.
 */
export function TopBar({
  variant = 'profile', title, subtitle, name, avatarSrc, avatar,
  onBack, backHref, actions = [], progress, className = '',
} = {}) {
  return h('header', { class: `ds-topbar${className ? ` ${className}` : ''}` }, [
    ...(variant === 'title' ? [
      IconButton({ icon: 'chevron-left', variant: 'white', label: 'Retour', onClick: onBack, href: backHref }),
      h('div', { class: `ds-topbar__mid${progress ? ' ds-topbar__mid--left' : ''}` }, [
        h('div', { class: 'ds-topbar__title', text: title }),
        subtitle ? h('div', { class: 'ds-topbar__sub', text: subtitle }) : null,
      ].filter(Boolean)),
    ] : [
      avatar || Avatar({ name: name || '', src: avatarSrc, size: 40 }),
      h('div', { class: 'ds-topbar__mid ds-topbar__mid--left' }, [
        subtitle ? h('div', { class: 'ds-topbar__sub', text: subtitle }) : null,
        h('div', { class: 'ds-topbar__title', text: title || name }),
      ].filter(Boolean)),
    ]),
    h('div', { class: 'ds-topbar__actions' }, [
      // `variant` est laissé au choix de l'appelant, avec le blanc du système
      // par défaut : une action qui doit se distinguer de ses voisines — trois
      // ronds blancs identiques ne se remarquent plus — prend un autre aplat.
      ...actions.map((a) => IconButton({
        icon: a.icon, label: a.label, badge: a.badge, variant: a.variant || 'white', onClick: a.onClick,
      })),
      progress ? h('span', { class: 'ds-topbar__streak' }, [
        Icon({ name: 'flame', size: 14, className: 'ds-topbar__flame' }),
        h('span', { text: progress }),
      ]) : null,
    ].filter(Boolean)),
  ]);
}

/* ----------------------------------------------------------- BottomNav */

/**
 * Barre de navigation sombre et flottante. Posée en bas de chaque écran,
 * détachée de 16px des bords, l'action principale en pastille séparée.
 */
export function BottomNav({
  items = [], value, onChange, action, onAction, actionHref, actionLabel, className = '',
} = {}) {
  const actif = value ?? items[0]?.value;
  return h('div', { class: `ds-bottomnav${className ? ` ${className}` : ''}` }, [
    h('nav', { class: 'ds-bottomnav__bar', 'aria-label': 'Navigation principale' },
      items.map((it) => {
        const on = it.value === actif;
        return h(it.href ? 'a' : 'button', {
          class: 'ds-bottomnav__tab',
          type: it.href ? null : 'button',
          href: it.href || null,
          'aria-label': it.label,
          'aria-current': on ? 'page' : null,
          dataset: it.value ? { tab: it.value } : null,
          onclick: onChange ? () => onChange(it.value) : null,
        }, [
          Icon({ name: it.icon, size: 20, strokeWidth: on ? 2.25 : 2 }),
          it.label ? h('span', { class: 'ds-bottomnav__label', text: it.label }) : null,
        ].filter(Boolean));
      })),
    action ? h(actionHref ? 'a' : 'button', {
      class: 'ds-bottomnav__action',
      type: actionHref ? null : 'button',
      href: actionHref || null,
      'aria-label': actionLabel,
      onclick: onAction || null,
    }, Icon({ name: action, size: 22 })) : null,
  ].filter(Boolean));
}

/* ---------------------------------------------------- SegmentedControl */

/** Bascule à deux ou trois voies dans une pilule blanche. */
export function SegmentedControl({
  options = [], value, onChange, fullWidth = true, className = '',
} = {}) {
  const items = options.map((o) => (typeof o === 'string' ? { value: o, label: o } : o));
  const actif = value ?? items[0]?.value;
  return h('div', {
    class: `ds-seg${fullWidth ? ' ds-seg--full' : ''}${className ? ` ${className}` : ''}`,
    role: 'tablist',
  }, items.map((o) => h('button', {
    class: 'ds-seg__btn',
    type: 'button',
    role: 'tab',
    'aria-selected': o.value === actif ? 'true' : 'false',
    onclick: onChange ? () => onChange(o.value) : null,
  }, h('span', { text: o.label }))));
}
