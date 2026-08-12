/**
 * Composants de retour — `components/feedback/` du système.
 *
 * Le système ne connaît qu'une forme de fenêtre : la feuille qui monte du
 * bas. Pas de boîte centrée.
 */

import { h } from '../lib/dom.js';

/* --------------------------------------------------------------- Sheet */

/**
 * Feuille du bas. Rend `{ node, close }` : appeler `close()` la retire du
 * document, et la promesse `fermee` se résout — l'appelant peut donc
 * attendre la réponse sans gérer lui-même les écouteurs.
 */
export function Sheet({ title, children, footer, onClose, className = '' } = {}) {
  let resoudre;
  const fermee = new Promise((r) => { resoudre = r; });

  const panneau = h('div', {
    class: `ds-sheet__panel${className ? ` ${className}` : ''}`,
    role: 'dialog',
    'aria-modal': 'true',
    'aria-label': title || null,
  }, [
    h('span', { class: 'ds-sheet__grip' }),
    title ? h('h2', { class: 'ds-sheet__title', text: title }) : null,
    h('div', { class: 'ds-sheet__body' }, children),
    footer ? h('div', { class: 'ds-sheet__footer' }, footer) : null,
  ].filter(Boolean));

  const voile = h('div', { class: 'ds-sheet__scrim' });
  const node = h('div', { class: 'ds-sheet' }, [voile, panneau]);

  const close = (valeur) => {
    node.remove();
    document.body.classList.remove('is-locked');
    resoudre(valeur);
    if (onClose) onClose(valeur);
  };
  voile.addEventListener('click', () => close(null));

  return { node, close, fermee };
}
