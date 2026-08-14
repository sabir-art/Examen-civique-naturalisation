/**
 * Livret du citoyen — lecture du document officiel et quiz par chapitre.
 * Partie distincte des fiches de révision : ici, c'est le texte du ministère.
 */

import { h, icon } from '../lib/dom.js';
import { Card, Button, Badge, Icon, IconTile, StatTile, ProgressBar } from '../ds/index.js';
import { LIVRET, PARTIES, PARTIE_BY_KEY, CHAPITRE_BY_KEY, CHAPITRES } from '../data/livret.js';
import { questionsOf, LIVRET_QUESTIONS } from '../data/q-livret.js';
import { buildLivretSet, livretMastery, livretOverview, livretChapitreProgres, livretPartieProgres } from '../engine.js';
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

  const head = h('div', { class: 'hero hero--livret' }, [
    h('p', { class: 'hero__eyebrow', text: LIVRET.editeur }),
    h('h1', { class: 'hero__title', text: LIVRET.titre }),
    h('p', { class: 'hero__sub', text: `${LIVRET.edition} — le document de référence officiel de l'examen civique, repris ici intégralement : ${PARTIES.length} parties, ${o.chapters} chapitres.` }),
  ]);

  const termines = CHAPITRES.filter((c) => livretChapitreProgres(c.key).termine).length;
  const kpis = h('div', { class: 'tiles-3' }, [
    ['chapitres terminés', `${termines}/${o.chapters}`],
    ['maîtrise du livret', `${o.mastery} %`],
    ['bonnes réponses', o.accuracy === null ? '—' : `${o.accuracy} %`],
  ].map(([lab, val]) => StatTile({ value: val, label: lab, surface: 'white', align: 'center' })));

  const actions = h('div', { class: 'stack stack--tight' }, [
    Button({
      variant: 'primary', size: 'lg', fullWidth: true, iconLeft: 'play',
      href: '#/livret/quiz', label: `Quiz sur tout le livret (${LIVRET_QUESTIONS.length} questions)`,
    }),
    o.due > 0 ? h('p', { class: 'hint center', text: `${o.due} question${o.due > 1 ? 's' : ''} du livret à revoir aujourd'hui.` }) : null,
    // Les deux chiffres voisins n'avancent pas à la même vitesse : autant le
    // dire, sinon la « maîtrise » passe pour un compteur bloqué.
    o.seen > 0 ? h('p', {
      class: 'hint center',
      text: "« Chapitres terminés » se remplit dans la séance : répondre juste à toutes les questions d'un chapitre. La « maîtrise » monte plus lentement, à quelques jours d'intervalle — c'est elle qui fait tenir jusqu'à l'examen.",
    }) : null,
  ].filter(Boolean));

  const list = h('div', { class: 'list' }, PARTIES.map((p) => {
    const av = livretPartieProgres(p.key);
    return h('a', { class: 'ds-lesson ds-lesson--tap ligne--haute', href: `#/livret/p/${p.key}` }, [
      IconTile({ icon: p.icon, tone: 'butter', size: 44 }),
      h('div', { class: 'ds-lesson__body' }, [
        h('div', { class: 'ds-lesson__title ds-lesson__titre--long', text: `${p.num === 'A' ? '' : `Partie ${p.num} — `}${p.title}` }),
        h('div', { class: 'ds-lesson__meta', text: `${p.chapters.length} chapitre${p.chapters.length > 1 ? 's' : ''} · pages ${p.pages}` }),
        av.pct === null ? null
          : h('div', { class: 'ds-lesson__meta', text: av.termine ? 'Partie terminée' : `${av.termines}/${av.chapitres} chapitres terminés` }),
        av.pct === null ? null
          : h('div', { class: 'bar bar--thin', style: 'margin-top:8px' },
            h('div', { class: `bar__fill${av.termine ? ' bar__fill--ok' : ''}`, style: `width:${av.pct}%` })),
      ].filter(Boolean)),
      av.termine ? Badge({ tone: 'correct', label: 'Terminée', className: 'livret__etat' }) : null,
      Icon({ name: 'chevron-right', size: 18, className: 'ds-lesson__chev' }),
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
    back: '#/reviser',
  };
}

/* --------------------------------------------------------------- partie */

function partie(key) {
  const p = PARTIE_BY_KEY.get(key);
  if (!p) return sommaire();

  const list = h('div', { class: 'list' }, p.chapters.map((c) => {
    const av = livretChapitreProgres(c.key);
    const nq = questionsOf(c.key).length;
    return h('a', { class: 'ds-lesson ds-lesson--tap ligne--haute', href: `#/livret/c/${c.key}` }, [
      h('span', { class: 'ds-tile ds-tile--sunken livret__num', text: c.num }),
      h('div', { class: 'ds-lesson__body' }, [
        h('div', { class: 'ds-lesson__title ds-lesson__titre--long', text: c.title }),
        h('div', { class: 'ds-lesson__meta', text: `${c.sections.length} section${c.sections.length > 1 ? 's' : ''} · page${String(c.pages).includes('à') ? 's' : ''} ${c.pages}${nq ? ` · ${nq} questions` : ''}` }),
        av.pct === null ? null
          : h('div', { class: 'ds-lesson__meta', text: av.termine ? 'Chapitre terminé' : `${av.justes}/${av.total} questions justes` }),
        av.pct === null ? null
          : h('div', { class: 'bar bar--thin', style: 'margin-top:8px' },
            h('div', { class: `bar__fill${av.termine ? ' bar__fill--ok' : ''}`, style: `width:${av.pct}%` })),
      ].filter(Boolean)),
      av.termine ? Badge({ tone: 'correct', label: 'Terminé', className: 'livret__etat' }) : null,
      Icon({ name: 'chevron-right', size: 18, className: 'ds-lesson__chev' }),
    ].filter(Boolean));
  }));

  return {
    node: h('div', { class: 'stack' }, [
      h('div', { class: 'card card--info' }, [
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

  const toc = c.sections.length > 2 ? h('div', { class: 'card card--info card--pad-sm' }, [
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
          Badge({ tone: 'neutral', label: `${nq} questions` }),
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
