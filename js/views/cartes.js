/**
 * Cartes mémoire.
 *
 * On lit la question, on essaie de répondre de tête, on retourne la carte,
 * puis on dit soi-même si c'était facile ou difficile. C'est le geste des
 * flashcards : pas de QCM, pas de propositions à reconnaître — il faut
 * retrouver la réponse, ce qui ancre bien mieux qu'un choix parmi quatre.
 *
 * Le jugement alimente la même révision espacée que le reste : « Facile » fait
 * monter la question d'une boîte, « Difficile » la ramène à revoir aujourd'hui.
 */

import { h, icon } from '../lib/dom.js';
import * as store from '../store.js';
import * as fx from '../lib/feedback.js';
import { THEMES } from '../data/programme.js';
import { pool } from '../data/questions.js';
import { shuffle } from '../lib/util.js';
import { refresh } from '../app.js';

export default function renderCartes({ params }) {
  const theme = params[0] && THEMES[params[0]] ? params[0] : null;
  return serie(theme);
}

/** Prépare un paquet : les questions dues d'abord, puis les jamais vues. */
function paquet(theme, taille = 12) {
  const candidates = pool(theme ? { theme } : {});
  const dues = [];
  const neuves = [];
  const reste = [];
  const now = Date.now();
  for (const q of candidates) {
    const r = store.progressOf(q.id);
    if (!r) neuves.push(q);
    else if (r.due <= now) dues.push(q);
    else reste.push(q);
  }
  return [...shuffle(dues), ...shuffle(neuves), ...shuffle(reste)].slice(0, taille);
}

function serie(theme) {
  const cartes = paquet(theme);
  const container = h('div', { class: 'stack' });
  const titre = theme ? THEMES[theme].short : 'Toutes les cartes';

  if (!cartes.length) {
    container.append(h('div', { class: 'empty' }, [
      h('div', { class: 'empty__icon' }, icon('list')),
      h('p', { text: 'Aucune carte disponible ici.' }),
      h('a', { class: 'btn mt', href: '#/reviser', text: 'Retour' }),
    ]));
    return { node: container, title: 'Cartes mémoire', back: '#/reviser' };
  }

  let index = 0;
  let retournee = false;
  let faciles = 0;

  function dessiner() {
    if (index >= cartes.length) return bilan();

    const q = cartes[index];
    const restantes = cartes.length - index;

    container.replaceChildren(
      h('div', { class: 'row row--between' }, [
        h('div', {}, [
          h('h1', { class: 'card__title', style: 'font-size:19px', text: titre }),
          h('p', { class: 'card__sub', text: `${restantes} carte${restantes > 1 ? 's' : ''} restante${restantes > 1 ? 's' : ''}` }),
        ]),
        h('span', { class: 'badge badge--brand', text: `${index + 1}/${cartes.length}` }),
      ]),

      h('div', { class: 'bar bar--thin' },
        h('span', { class: 'bar__fill', style: `width:${(index / cartes.length) * 100}%` })),

      // La carte elle-même : un seul bloc, qu'on retourne.
      h('button', {
        class: `flash ${retournee ? 'is-flipped' : ''}`, type: 'button',
        'aria-label': retournee ? 'Revenir à la question' : 'Retourner la carte',
        onclick: () => { retournee = !retournee; fx.tap(); dessiner(); },
      }, [
        h('div', { class: 'flash__face' }, [
          h('span', { class: 'flash__icon' }, icon(THEMES[q.theme]?.icon || 'star')),
          q.scenario ? h('p', { class: 'flash__scenario', text: q.scenario }) : null,
          h('p', { class: 'flash__q', text: q.q }),
          h('span', { class: 'flash__hint' }, [icon('refresh'), h('span', { text: 'Retourner la carte' })]),
        ].filter(Boolean)),
        h('div', { class: 'flash__face flash__face--back' }, [
          h('p', { class: 'flash__label', text: 'Réponse' }),
          h('p', { class: 'flash__a', text: q.c[q.a] }),
          q.why ? h('p', { class: 'flash__why', text: q.why }) : null,
        ].filter(Boolean)),
      ]),

      retournee
        ? h('div', { class: 'btn-row' }, [
          h('button', {
            class: 'btn btn--hard', type: 'button',
            onclick: () => juger(false),
          }, [icon('ko'), h('span', { text: 'Difficile' })]),
          h('button', {
            class: 'btn btn--easy', type: 'button',
            onclick: () => juger(true),
          }, [icon('ok'), h('span', { text: 'Facile' })]),
        ])
        : h('p', { class: 'hint center', text: 'Répondez de tête, puis retournez la carte pour vérifier.' }),
    );
  }

  function juger(facile) {
    store.recordAnswer(cartes[index].id, facile);
    if (facile) { faciles += 1; fx.bonneReponse(); } else fx.mauvaiseReponse();
    index += 1;
    retournee = false;
    dessiner();
    window.scrollTo(0, 0);
  }

  function bilan() {
    const pc = Math.round((faciles / cartes.length) * 100);
    container.replaceChildren(
      h('div', { class: `score ${pc >= 70 ? '' : 'score--fail'}` }, [
        h('p', { class: 'score__verdict', text: pc >= 70 ? 'Paquet bien maîtrisé' : 'Paquet à revoir' }),
        h('p', { class: 'score__detail', text: `${faciles} carte${faciles > 1 ? 's' : ''} jugée${faciles > 1 ? 's' : ''} facile${faciles > 1 ? 's' : ''} sur ${cartes.length}` }),
      ]),
      h('button', { class: 'btn', type: 'button', onclick: () => refresh() },
        [icon('refresh'), h('span', { text: 'Nouveau paquet' })]),
      h('a', { class: 'btn btn--ghost', href: '#/reviser', text: 'Retour' }),
    );
    (pc >= 70 ? fx.reussite : fx.echec)();
    window.scrollTo(0, 0);
  }

  dessiner();
  return { node: container, title: 'Cartes mémoire', back: '#/reviser' };
}
