/**
 * Composants de formulaire — `components/forms/` du système.
 * Champ de saisie et interrupteur.
 */

import { h } from '../lib/dom.js';
import { Icon } from './core.js';

let compteur = 0;

/* ----------------------------------------------------------- TextField */

/**
 * Champ d'une ligne. Fond doux, aucune bordure jusqu'au focus — c'est l'un
 * des deux seuls endroits où le système fait travailler une bordure.
 *
 * Rend `{ node, input }` : la vue a besoin du champ lui-même pour lire sa
 * valeur, et le composant garde la main sur l'étiquette et l'aide.
 */
export function TextField({
  label, placeholder, value = '', onChange, icon: nom, type = 'text',
  hint, error, disabled = false, id, className = '', ...reste
} = {}) {
  compteur += 1;
  const champId = id || `ds-f${compteur}`;
  const input = h('input', {
    class: 'ds-field__input',
    id: champId,
    type,
    value,
    placeholder: placeholder || null,
    disabled: disabled ? true : null,
    oninput: onChange ? (e) => onChange(e.target.value) : null,
    ...reste,
  });
  const node = h('div', { class: `ds-field${className ? ` ${className}` : ''}` }, [
    label ? h('label', { class: 'ds-field__label', for: champId, text: label }) : null,
    h('div', { class: `ds-field__box${error ? ' ds-field__box--error' : ''}${disabled ? ' ds-field__box--off' : ''}` }, [
      nom ? Icon({ name: nom, size: 18, className: 'ds-field__icon' }) : null,
      input,
    ].filter(Boolean)),
    error || hint
      ? h('span', { class: `ds-field__hint${error ? ' ds-field__hint--error' : ''}`, text: error || hint })
      : null,
  ].filter(Boolean));
  return { node, input };
}

/* -------------------------------------------------------------- Switch */

/** Interrupteur binaire. Encre quand il est allumé. */
export function Switch({
  checked = false, onChange, disabled = false, label, description, className = '',
} = {}) {
  const bouton = h('button', {
    class: 'ds-switch',
    type: 'button',
    role: 'switch',
    'aria-checked': checked ? 'true' : 'false',
    'aria-label': label ? null : 'Activer',
    disabled: disabled ? true : null,
    onclick: onChange ? () => onChange(!checked) : null,
  }, h('span', { class: 'ds-switch__knob' }));

  if (!label) return h('span', { class: className || null }, bouton);

  return h('div', { class: `ds-switchrow${className ? ` ${className}` : ''}` }, [
    h('div', { class: 'ds-switchrow__body' }, [
      h('div', { class: 'ds-switchrow__label', text: label }),
      description ? h('div', { class: 'ds-switchrow__desc', text: description }) : null,
    ].filter(Boolean)),
    bouton,
  ]);
}
