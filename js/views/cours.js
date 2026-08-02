/** Fiches de cours : liste et lecture d'une fiche. */

import { h, icon } from '../lib/dom.js';
import { COURS, COURS_BY_KEY } from '../data/cours.js';
import { THEMES } from '../data/programme.js';
import { pool } from '../data/questions.js';
import { mastery, livretOverview } from '../engine.js';
import { LIVRET, PARTIES, CHAPITRES } from '../data/livret.js';

export default function renderCours({ params }) {
  const key = params[0];
  if (key && COURS_BY_KEY.has(key)) return fiche(key);
  return liste();
}

function liste() {
  const lo = livretOverview();

  const officiel = h('div', { class: 'stack stack--tight' }, [
    h('p', { class: 'section-title', text: 'Document officiel' }),
    h('a', { class: 'item', href: '#/livret', style: 'align-items:flex-start' }, [
      h('span', { class: 'item__icon', style: 'background:var(--accent-100);color:var(--accent)' }, icon('star')),
      h('span', { class: 'item__body' }, [
        h('span', { class: 'item__title', text: LIVRET.titre }),
        h('span', { class: 'item__sub', text: `${LIVRET.edition} · ${LIVRET.editeur}` }),
        h('span', { class: 'item__sub', style: 'margin-top:6px', text: `${PARTIES.length} parties, ${CHAPITRES.length} chapitres, ${lo.total} questions dédiées` }),
        h('div', { class: 'bar', style: 'margin-top:8px' }, h('div', {
          class: `bar__fill bar__fill--${lo.mastery >= 70 ? 'ok' : lo.mastery >= 35 ? 'warn' : 'bad'}`,
          style: `width:${lo.mastery}%`,
        })),
        h('span', { class: 'item__sub', style: 'margin-top:5px', text: `Maîtrise du livret : ${lo.mastery} %` }),
      ]),
      h('span', { class: 'item__chev', style: 'margin-top:10px' }, icon('chevron')),
    ]),
    h('p', { class: 'hint', text: "Le texte du ministère de l'Intérieur, repris intégralement, avec un quiz par chapitre." }),
  ]);

  return {
    node: h('div', { class: 'stack' }, [
      officiel,
      h('div', { class: 'divider' }),
      h('p', { class: 'section-title', text: 'Fiches de révision' }),
      h('div', { class: 'card card--pad-sm' }, [
        h('p', { class: 'card__sub', text: "Synthèses rédigées pour l'entraînement : cinq fiches calquées sur le référentiel officiel, plus une fiche pratique sur l'épreuve. Elles complètent le livret sans le remplacer." }),
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
    title: 'Cours',
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
