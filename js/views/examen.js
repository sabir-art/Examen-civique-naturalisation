/** Examens blancs : trois formats, 40 questions en 45 minutes. */

import { h, icon } from '../lib/dom.js';
import { formatDateShort, duration, pct } from '../lib/util.js';
import { EXAM } from '../data/programme.js';
import { EXAM_MODES, EXAM_MODE_LIST, modeOf } from '../engine.js';
import { navigate } from '../app.js';
import { runQuiz } from './reviser.js';
import * as store from '../store.js';

export default function renderExamen({ params }) {
  const target = params[0];
  if (target && target.startsWith('run/')) {
    const key = target.slice(4);
    if (EXAM_MODES[key]) return run(key);
  }
  if (target && EXAM_MODES[target]) return presentation(target);
  return choix();
}

/* ------------------------------------------------------- choix du format */

function choix() {
  const history = store.exams();

  const stats = (key) => {
    const list = history.filter((e) => modeOf(e) === key);
    return {
      count: list.length,
      best: list.length ? Math.max(...list.map((e) => e.score)) : null,
      passed: list.filter((e) => e.score >= EXAM.passing).length,
    };
  };

  const cards = EXAM_MODE_LIST.map((m) => {
    const s = stats(m.key);
    return h('a', { class: 'item', href: `#/examen/${m.key}`, style: 'align-items:flex-start' }, [
      h('span', {
        class: 'item__icon',
        style: m.accent ? 'background:var(--accent-100);color:var(--accent)' : '',
      }, icon(m.icon)),
      h('span', { class: 'item__body' }, [
        h('span', { class: 'item__title', text: m.title }),
        h('span', { class: 'item__sub', text: m.blurb }),
        h('span', { class: 'item__sub', style: 'margin-top:6px', text: m.source() }),
        s.count ? h('div', { class: 'row', style: 'margin-top:8px;gap:6px;flex-wrap:wrap' }, [
          h('span', { class: `badge badge--${s.best >= EXAM.passing ? 'ok' : 'bad'}`, text: `Meilleur ${s.best}/${EXAM.questions}` }),
          h('span', { class: 'badge', text: `${s.count} passé${s.count > 1 ? 's' : ''}` }),
        ]) : null,
      ].filter(Boolean)),
      h('span', { class: 'item__chev', style: 'margin-top:10px' }, icon('chevron')),
    ]);
  });

  const recent = history.slice(0, 8);

  return {
    node: h('div', { class: 'stack' }, [
      h('div', { class: 'hero' }, [
        h('p', { class: 'hero__eyebrow', text: 'Conditions réelles' }),
        h('h1', { class: 'hero__title', text: 'Examen blanc' }),
        h('p', { class: 'hero__sub', text: `Trois formats, tous en ${EXAM.questions} questions et ${EXAM.minutes} minutes, avec le même seuil de réussite : ${EXAM.passing}/${EXAM.questions}.` }),
      ]),

      h('p', { class: 'section-title', text: 'Choisir un format' }),
      h('div', { class: 'list' }, cards),

      recent.length ? h('div', { class: 'card' }, [
        h('h2', { class: 'card__title', text: 'Derniers résultats' }),
        h('div', { class: 'mt' }, recent.map((e) => {
          const ok = e.score >= EXAM.passing;
          const m = EXAM_MODES[modeOf(e)];
          return h('div', { class: 'histrow' }, [
            h('div', { class: 'histrow__score', style: `color:var(--${ok ? 'ok' : 'bad'})`, text: String(e.score) }),
            h('div', { class: 'histrow__meta' }, [
              h('div', { text: `${m.short} — ${pct(e.score, e.total)} %` }),
              h('div', { class: 'histrow__date', text: `${formatDateShort(e.date)} · ${duration(e.durationSec)}${e.timedOut ? ' · temps écoulé' : ''}` }),
            ]),
            h('span', { class: `badge badge--${ok ? 'ok' : 'bad'}`, text: ok ? 'Reçu' : 'Échec' }),
          ]);
        })),
      ]) : null,

      h('p', { class: 'hint center', text: "Seuls les résultats du format officiel entrent dans l'estimation de préparation, car lui seul respecte la composition de l'épreuve." }),
    ].filter(Boolean)),
    title: 'Examen blanc',
  };
}

/* ------------------------------------------------ présentation d'un format */

function presentation(key) {
  const m = EXAM_MODES[key];
  const history = store.exams().filter((e) => modeOf(e) === key);
  const best = history.length ? Math.max(...history.map((e) => e.score)) : null;
  const passedCount = history.filter((e) => e.score >= EXAM.passing).length;

  const rules = [
    [`${EXAM.questions} questions`, 'à choix multiples, une seule bonne réponse'],
    [`${EXAM.minutes} minutes`, 'le chronomètre tourne, comme le jour J'],
    [`${EXAM.passing} bonnes réponses`, `soit ${EXAM.passingPct} %, pour être reçu`],
  ];

  return {
    node: h('div', { class: 'stack' }, [
      h('div', { class: 'hero' }, [
        h('p', { class: 'hero__eyebrow', text: 'Format choisi' }),
        h('h1', { class: 'hero__title', text: m.title }),
        h('p', { class: 'hero__sub', text: m.blurb }),
      ]),

      h('div', { class: 'card' }, [
        h('h2', { class: 'card__title', text: 'Composition' }),
        h('p', { class: 'card__sub', text: m.source() }),
        h('div', { class: 'stack stack--tight mt' }, m.details.map((d) => h('div', { class: 'row' }, [
          h('span', { class: 'item__icon', style: 'width:28px;height:28px;border-radius:8px' }, icon('check')),
          h('span', { class: 'grow small', text: d }),
        ]))),
      ]),

      h('div', { class: 'card' }, [
        h('h2', { class: 'card__title', text: "Règles de l'épreuve" }),
        h('div', { class: 'stack stack--tight mt' }, rules.map(([k, v]) => h('div', { class: 'row' }, [
          h('span', { class: 'item__icon', style: 'width:32px;height:32px;border-radius:9px' }, icon('clock')),
          h('span', { class: 'grow small' }, [
            h('strong', { text: k }),
            h('span', { class: 'muted', text: ` — ${v}` }),
          ]),
        ]))),
      ]),

      h('button', {
        class: 'btn btn--accent', type: 'button',
        onclick: () => navigate(`#/examen/run/${key}`),
      }, [icon('play'), h('span', { text: 'Démarrer' })]),

      h('p', { class: 'hint center', text: "Prévoyez 45 minutes au calme. Vous pouvez passer une question, mais pas y revenir : la correction n'arrive qu'à la fin, comme à l'examen." }),

      history.length ? h('div', { class: 'card' }, [
        h('div', { class: 'row row--between' }, [
          h('h2', { class: 'card__title', text: 'Vos résultats sur ce format' }),
          h('span', { class: 'badge', text: `${passedCount}/${history.length} réussis` }),
        ]),
        best !== null ? h('p', { class: 'card__sub', text: `Meilleur score : ${best}/${EXAM.questions}` }) : null,
        h('div', { class: 'mt' }, history.slice(0, 6).map((e) => {
          const ok = e.score >= EXAM.passing;
          return h('div', { class: 'histrow' }, [
            h('div', { class: 'histrow__score', style: `color:var(--${ok ? 'ok' : 'bad'})`, text: String(e.score) }),
            h('div', { class: 'histrow__meta' }, [
              h('div', { text: `${e.score}/${e.total} — ${pct(e.score, e.total)} %` }),
              h('div', { class: 'histrow__date', text: `${formatDateShort(e.date)} · ${duration(e.durationSec)}${e.timedOut ? ' · temps écoulé' : ''}` }),
            ]),
            h('span', { class: `badge badge--${ok ? 'ok' : 'bad'}`, text: ok ? 'Reçu' : 'Échec' }),
          ]);
        })),
      ].filter(Boolean)) : null,

      h('a', { class: 'btn btn--quiet', href: '#/examen', text: 'Changer de format' }),
    ].filter(Boolean)),
    title: m.short,
    back: '#/examen',
  };
}

/* ------------------------------------------------------------ passation */

function run(key) {
  const m = EXAM_MODES[key];
  const container = h('div', { class: 'stack' });

  function start() {
    runQuiz({
      container,
      cards: m.build(),
      immediate: false,
      isExam: true,
      timeLimitSec: EXAM.minutes * 60,
      label: m.short,
      backTo: `#/examen/${key}`,
      onRestart: start,
      onFinished: (result) => {
        store.saveExam({
          id: `e${result.date}`,
          mode: key,
          date: result.date,
          score: result.score,
          total: result.total,
          durationSec: result.durationSec,
          timedOut: result.timedOut,
          byTheme: result.byTheme,
        });
      },
    });
  }

  start();
  return { node: container, title: `${m.short} en cours`, back: `#/examen/${key}`, hideTabs: true };
}
