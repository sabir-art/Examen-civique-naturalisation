/** Fiches de cours : liste et lecture d'une fiche. */

import { h, icon } from '../lib/dom.js';
import { COURS, COURS_BY_KEY } from '../data/cours.js';
import { THEMES } from '../data/programme.js';
import { pool } from '../data/questions.js';
import { mastery } from '../engine.js';

export default function renderCours({ params }) {
  const key = params[0];
  if (key && COURS_BY_KEY.has(key)) return fiche(key);
  return liste();
}

function liste() {
  return {
    node: h('div', { class: 'stack' }, [
      h('div', { class: 'card' }, [
        h('h2', { class: 'card__title', text: 'Le programme, résumé' }),
        h('p', { class: 'card__sub', text: "Cinq fiches calquées sur le livret du citoyen et le référentiel officiel, plus une fiche pratique sur l'épreuve elle-même." }),
      ]),
      h('div', { class: 'list' }, COURS.map((c) => {
        const m = c.theme ? Math.round(mastery(c.theme) * 100) : null;
        return h('a', { class: 'item', href: `#/cours/${c.key}` }, [
          h('span', { class: 'item__icon' }, icon(c.icon)),
          h('span', { class: 'item__body' }, [
            h('span', { class: 'item__title', text: c.title }),
            h('span', { class: 'item__sub', text: c.subtitle }),
          ]),
          m !== null ? h('span', { class: `badge badge--${m >= 70 ? 'ok' : m >= 35 ? 'warn' : 'bad'}`, text: `${m} %` }) : null,
          h('span', { class: 'item__chev' }, icon('chevron')),
        ].filter(Boolean));
      })),
    ]),
    title: 'Fiches de cours',
  };
}

function fiche(key) {
  const c = COURS_BY_KEY.get(key);
  const theme = c.theme ? THEMES[c.theme] : null;

  const toc = c.sections.length > 2 ? h('div', { class: 'card card--pad-sm' }, [
    h('p', { class: 'section-title', style: 'margin:0 0 8px', text: 'Dans cette fiche' }),
    h('div', { class: 'stack stack--tight' }, c.sections.map((s, i) => h('a', {
      class: 'small', href: `#/cours/${key}`, style: 'text-decoration:none',
      onclick: (e) => {
        e.preventDefault();
        document.getElementById(`sec-${i}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      },
      text: `${i + 1}. ${s.h}`,
    }))),
  ]) : null;

  return {
    node: h('div', { class: 'stack' }, [
      h('div', { class: 'card' }, [
        h('h1', { class: 'card__title', style: 'font-size:19px', text: c.title }),
        h('p', { class: 'card__sub', text: c.subtitle }),
        theme ? h('p', { class: 'card__sub', style: 'margin-top:8px', text: `${theme.count} des 40 questions de l'examen portent sur ce thème.` }) : null,
      ].filter(Boolean)),

      toc,

      ...c.sections.map((s, i) => h('div', { class: 'card', id: `sec-${i}` }, [
        h('h2', { class: 'card__title', style: 'font-size:16.5px;margin-bottom:10px', text: s.h }),
        h('div', { class: 'prose', html: s.html }),
      ])),

      theme ? h('a', {
        class: 'btn', href: `#/reviser/t/${c.theme}`,
      }, [icon('play'), h('span', { text: `S'entraîner sur ce thème (${pool({ theme: c.theme }).length} questions)` })]) : null,

      h('a', { class: 'btn btn--ghost', href: '#/cours', text: 'Toutes les fiches' }),
    ].filter(Boolean)),
    title: c.title,
    back: '#/cours',
  };
}
