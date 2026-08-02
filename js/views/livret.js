/**
 * Livret du citoyen — lecture du document officiel et quiz par chapitre.
 * Partie distincte des fiches de révision : ici, c'est le texte du ministère.
 */

import { h, icon } from '../lib/dom.js';
import { LIVRET, PARTIES, PARTIE_BY_KEY, CHAPITRE_BY_KEY, CHAPITRES } from '../data/livret.js';
import { questionsOf, LIVRET_QUESTIONS } from '../data/q-livret.js';
import { buildLivretSet, livretMastery, livretOverview } from '../engine.js';
import { runQuiz } from './reviser.js';

export default function renderLivret({ params }) {
  const target = params[0];
  if (!target) return sommaire();
  if (target.startsWith('p/')) return partie(target.slice(2));
  if (target.startsWith('c/')) return chapitre(target.slice(2));
  if (target.startsWith('q/')) return quiz(target.slice(2));
  if (target === 'quiz') return quiz(null);
  return sommaire();
}

const tone = (m) => (m >= 70 ? 'ok' : m >= 35 ? 'warn' : 'bad');

/* ------------------------------------------------------------- sommaire */

function sommaire() {
  const o = livretOverview();

  const head = h('div', { class: 'hero' }, [
    h('p', { class: 'hero__eyebrow', text: LIVRET.editeur }),
    h('h1', { class: 'hero__title', text: LIVRET.titre }),
    h('p', { class: 'hero__sub', text: `${LIVRET.edition} — le document de référence officiel de l'examen civique, repris ici intégralement : ${PARTIES.length} parties, ${o.chapters} chapitres.` }),
  ]);

  const kpis = h('div', { class: 'kpis' }, [
    ['maîtrise du livret', `${o.mastery} %`],
    ['questions vues', `${o.seen}/${o.total}`],
    ['bonnes réponses', o.accuracy === null ? '—' : `${o.accuracy} %`],
  ].map(([lab, val]) => h('div', { class: 'kpi' }, [
    h('div', { class: 'kpi__val', text: val }),
    h('div', { class: 'kpi__lab', text: lab }),
  ])));

  const actions = h('div', { class: 'stack stack--tight' }, [
    h('a', { class: 'btn', href: '#/livret/quiz' }, [icon('play'), h('span', { text: `Quiz sur tout le livret (${LIVRET_QUESTIONS.length} questions)` })]),
    o.due > 0 ? h('p', { class: 'hint center', text: `${o.due} question${o.due > 1 ? 's' : ''} du livret à revoir aujourd'hui.` }) : null,
  ].filter(Boolean));

  const list = h('div', { class: 'list' }, PARTIES.map((p) => {
    const m = Math.round(
      p.chapters.reduce((s, c) => s + livretMastery(c.key), 0) / p.chapters.length * 100,
    );
    return h('a', { class: 'item', href: `#/livret/p/${p.key}`, style: 'align-items:flex-start' }, [
      h('span', { class: 'item__icon' }, icon(p.icon)),
      h('span', { class: 'item__body' }, [
        h('span', { class: 'item__title', text: `${p.num === 'A' ? '' : `Partie ${p.num} — `}${p.title}` }),
        h('span', { class: 'item__sub', text: `${p.chapters.length} chapitre${p.chapters.length > 1 ? 's' : ''} · pages ${p.pages}` }),
        h('div', { class: 'bar', style: 'margin-top:8px' }, h('div', { class: `bar__fill bar__fill--${tone(m)}`, style: `width:${m}%` })),
      ]),
      h('span', { class: 'item__chev', style: 'margin-top:10px' }, icon('chevron')),
    ]);
  }));

  return {
    node: h('div', { class: 'stack' }, [
      head,
      kpis,
      actions,
      h('p', { class: 'section-title', text: 'Sommaire du livret' }),
      list,
      h('p', { class: 'hint center mt' }, [
        'Transcription du livret officiel à des fins de révision. Le PDF de référence est téléchargeable gratuitement sur ',
        h('a', {
          href: 'https://www.immigration.interieur.gouv.fr/documentation/guides-textes-et-brochures/livret-du-citoyen.html',
          target: '_blank', rel: 'noopener',
          text: 'immigration.interieur.gouv.fr',
        }),
        '.',
      ]),
    ]),
    title: 'Livret du citoyen',
    back: '#/cours',
  };
}

/* --------------------------------------------------------------- partie */

function partie(key) {
  const p = PARTIE_BY_KEY.get(key);
  if (!p) return sommaire();

  const list = h('div', { class: 'list' }, p.chapters.map((c) => {
    const m = Math.round(livretMastery(c.key) * 100);
    const nq = questionsOf(c.key).length;
    return h('a', { class: 'item', href: `#/livret/c/${c.key}`, style: 'align-items:flex-start' }, [
      h('span', { class: 'item__icon', text: c.num, style: 'font-weight:700;font-size:13px' }),
      h('span', { class: 'item__body' }, [
        h('span', { class: 'item__title', text: c.title }),
        h('span', { class: 'item__sub', text: `${c.sections.length} section${c.sections.length > 1 ? 's' : ''} · page${String(c.pages).includes('à') ? 's' : ''} ${c.pages}${nq ? ` · ${nq} questions` : ''}` }),
        nq ? h('div', { class: 'bar', style: 'margin-top:8px' }, h('div', { class: `bar__fill bar__fill--${tone(m)}`, style: `width:${m}%` })) : null,
      ].filter(Boolean)),
      h('span', { class: 'item__chev', style: 'margin-top:10px' }, icon('chevron')),
    ]);
  }));

  return {
    node: h('div', { class: 'stack' }, [
      h('div', { class: 'card' }, [
        h('h1', { class: 'card__title', style: 'font-size:19px', text: p.num === 'A' ? p.title : `Partie ${p.num} — ${p.title}` }),
        h('p', { class: 'card__sub', text: `${LIVRET.titre}, ${LIVRET.edition} · pages ${p.pages}` }),
      ]),
      list,
    ]),
    title: p.title,
    back: '#/livret',
  };
}

/* ------------------------------------------------------------- chapitre */

function chapitre(key) {
  const c = CHAPITRE_BY_KEY.get(key);
  if (!c) return sommaire();

  const nq = questionsOf(key).length;
  const m = Math.round(livretMastery(key) * 100);
  const index = CHAPITRES.findIndex((x) => x.key === key);
  const prev = CHAPITRES[index - 1];
  const next = CHAPITRES[index + 1];

  const toc = c.sections.length > 2 ? h('div', { class: 'card card--pad-sm' }, [
    h('p', { class: 'section-title', style: 'margin:0 0 8px', text: 'Dans ce chapitre' }),
    h('div', { class: 'stack stack--tight' }, c.sections.map((s, i) => h('button', {
      class: 'small', type: 'button',
      style: 'background:none;border:0;padding:0;text-align:left;color:var(--brand);font:inherit;font-size:13.5px;cursor:pointer',
      onclick: () => document.getElementById(`lsec-${i}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
      html: `${i + 1}. ${s.h}`,
    }))),
  ]) : null;

  return {
    node: h('div', { class: 'stack' }, [
      h('div', { class: 'card' }, [
        h('p', { class: 'card__sub', text: `${c.partieTitle} · pages ${c.pages}` }),
        h('h1', { class: 'card__title', style: 'font-size:19px;margin-top:4px', text: `${c.num}. ${c.title}` }),
        nq ? h('div', { class: 'row', style: 'margin-top:10px;gap:8px' }, [
          h('span', { class: `badge badge--${tone(m)}`, text: `Maîtrise ${m} %` }),
          h('span', { class: 'badge', text: `${nq} questions` }),
        ]) : null,
      ].filter(Boolean)),

      toc,

      ...c.sections.map((s, i) => h('div', { class: 'card', id: `lsec-${i}` }, [
        h('h2', { class: 'card__title', style: 'font-size:16.5px;margin-bottom:10px', html: s.h }),
        h('div', { class: 'prose', html: s.html }),
      ])),

      nq ? h('a', { class: 'btn', href: `#/livret/q/${key}` }, [
        icon('play'), h('span', { text: `Se tester sur ce chapitre (${nq} questions)` }),
      ]) : null,

      h('div', { class: 'btn-row' }, [
        prev ? h('a', { class: 'btn btn--ghost', href: `#/livret/c/${prev.key}`, text: '← Précédent' }) : null,
        next ? h('a', { class: 'btn btn--ghost', href: `#/livret/c/${next.key}`, text: 'Suivant →' }) : null,
      ].filter(Boolean)),

      h('a', { class: 'btn btn--quiet', href: `#/livret/p/${c.partieKey}`, text: 'Retour à la partie' }),
    ].filter(Boolean)),
    title: c.title,
    back: `#/livret/p/${c.partieKey}`,
  };
}

/* ----------------------------------------------------------------- quiz */

function quiz(chapterKey) {
  const c = chapterKey ? CHAPITRE_BY_KEY.get(chapterKey) : null;
  const container = h('div', { class: 'stack' });
  const label = c ? c.title : 'Livret du citoyen';
  const backTo = c ? `#/livret/c/${chapterKey}` : '#/livret';

  function start() {
    const cards = buildLivretSet({
      chapter: chapterKey,
      count: chapterKey ? questionsOf(chapterKey).length : 20,
    });
    if (!cards.length) {
      container.replaceChildren(h('div', { class: 'empty' }, [
        h('div', { class: 'empty__icon' }, icon('book')),
        h('p', { text: 'Aucune question disponible pour ce chapitre.' }),
        h('a', { class: 'btn mt', href: backTo, text: 'Retour' }),
      ]));
      return;
    }
    runQuiz({
      container,
      cards,
      immediate: true,
      label: 'Livret',
      backTo,
      onRestart: () => { start(); },
    });
  }

  start();
  return { node: container, title: label, back: backTo, hideTabs: true };
}
