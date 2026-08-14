/** Fiches de cours : liste et lecture d'une fiche. */

import { h, icon } from '../lib/dom.js';
import { Card, Button, Icon, IconTile, LessonRow, ProgressBar } from '../ds/index.js';
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
    h('a', { class: 'ds-lesson ds-lesson--tap examen__mode', href: '#/livret' }, [
      IconTile({ icon: 'star', tone: 'lavender', size: 44 }),
      h('div', { class: 'ds-lesson__body' }, [
        h('div', { class: 'ds-lesson__title examen__titre', text: LIVRET.titre }),
        h('div', { class: 'ds-lesson__meta', text: `${LIVRET.edition} · ${LIVRET.editeur}` }),
        h('div', { class: 'ds-lesson__meta', style: 'margin-top:6px', text: `${PARTIES.length} parties, ${CHAPITRES.length} chapitres, ${lo.total} questions dédiées` }),
        h('div', { class: 'bar', style: 'margin-top:8px' }, h('div', {
          class: `bar__fill bar__fill--${lo.mastery >= 70 ? 'ok' : lo.mastery >= 35 ? 'warn' : 'bad'}`,
          style: `width:${lo.mastery}%`,
        })),
        h('div', { class: 'ds-lesson__meta', style: 'margin-top:5px', text: `Maîtrise du livret : ${lo.mastery} %` }),
      ]),
      Icon({ name: 'chevron-right', size: 18, className: 'ds-lesson__chev' }),
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
        return h('a', { class: 'ds-lesson ds-lesson--tap', href: `#/cours/${c.key}` }, [
          IconTile({ icon: c.icon, tone: 'sunken', size: 38 }),
          h('div', { class: 'ds-lesson__body' }, [
            // Deux lignes autorisées : les intitulés de fiche sont longs, et
            // la troncature de `LessonRow` est faite pour des titres courts.
            h('div', { class: 'ds-lesson__title examen__titre', text: c.title }),
            h('div', { class: 'ds-lesson__meta', text: c.subtitle }),
          ]),
          m !== null ? h('span', { class: `badge badge--${m >= 70 ? 'ok' : m >= 35 ? 'warn' : 'bad'}`, text: `${m} %` }) : null,
          Icon({ name: 'chevron-right', size: 18, className: 'ds-lesson__chev' }),
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
        class: 'ds-btn ds-btn--primary ds-btn--lg ds-btn--full', href: `#/reviser/t/${c.theme}`,
      }, [icon('play'), h('span', { text: `S'entraîner sur ce thème (${pool({ theme: c.theme }).length} questions)` })]) : null,

      Button({ variant: 'secondary', size: 'lg', fullWidth: true, href: '#/cours', label: 'Toutes les fiches' }),
    ].filter(Boolean)),
    title: c.title,
    back: '#/cours',
  };
}
