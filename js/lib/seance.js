/**
 * « Il ne reste qu'une question nouvelle. Vous la voulez seule, ou vingt ? »
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *  Pourquoi ce module existe
 * ─────────────────────────────────────────────────────────────────────────────
 *  Une séance sert d'abord ce qui n'a jamais été vu, puis complète avec des
 *  révisions. C'est le bon comportement — la révision espacée est ce qui fait
 *  tenir les réponses dans la durée — mais il était appliqué sans le dire.
 *
 *  Vous demandez vingt questions, il n'en reste qu'une de neuve : vous en
 *  recevez vingt, dont dix-neuf déjà connues, sans qu'aucun écran ne l'annonce.
 *  Rien de faux dans les chiffres, mais une séance qui n'est pas celle qu'on
 *  croyait demander. Et le choix, lui, est légitime : certains jours on veut
 *  balayer ce qui reste, d'autres on veut consolider.
 *
 *  On pose donc la question — et seulement quand elle se pose vraiment :
 *  s'il ne reste rien de neuf, il n'y a rien à choisir ; s'il en reste assez
 *  pour remplir la demande, il n'y a rien à compléter.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { h, modal } from './dom.js';
import { compterInedites } from '../engine.js';

const s = (n) => (n > 1 ? 's' : '');

/**
 * Décide de la composition d'une séance, en demandant si nécessaire.
 *
 * @param {object[]} questions  l'ensemble dans lequel la séance sera tirée
 * @param {number}   demande    le nombre de questions souhaité
 * @returns {Promise<{count: number, inedites: boolean}|null>}
 *          `null` si la personne renonce.
 */
export async function composerLaSeance({ questions, demande }) {
  const possible = Math.min(demande, questions.length);
  const neuves = compterInedites(questions);

  // Rien de neuf : la séance est une révision, et le dire ne changerait rien.
  // Assez de neuf pour tout remplir : il n'y a rien à compléter.
  if (neuves === 0 || neuves >= possible) return { count: possible, inedites: false };

  const revisions = possible - neuves;
  const choix = await modal((close) => [
    h('h2', {
      class: 'modal__title',
      text: neuves === 1
        ? 'Il ne reste qu’une question nouvelle ici'
        : `Il ne reste que ${neuves} questions nouvelles ici`,
    }),
    h('p', {
      class: 'modal__text',
      text: `Vous en avez demandé ${possible}. On peut compléter avec ${revisions} question${s(revisions)} déjà vue${s(revisions)}, à revoir — c’est ce qui fait tenir les réponses dans la durée. Ou ne poser que ${neuves === 1 ? 'la nouvelle' : 'les nouvelles'}.`,
    }),
    h('div', { class: 'stack stack--tight' }, [
      h('button', {
        class: 'btn', type: 'button', onclick: () => close('melange'),
        text: `Les ${possible} (${neuves} nouvelle${s(neuves)}, ${revisions} à revoir)`,
      }),
      h('button', {
        class: 'btn btn--ghost', type: 'button', onclick: () => close('inedites'),
        text: neuves === 1 ? 'Seulement la nouvelle' : `Seulement les ${neuves} nouvelles`,
      }),
      h('button', { class: 'btn btn--quiet', type: 'button', text: 'Annuler', onclick: () => close(null) }),
    ]),
  ]);

  if (!choix) return null;
  return choix === 'inedites'
    ? { count: neuves, inedites: true }
    : { count: possible, inedites: false };
}
