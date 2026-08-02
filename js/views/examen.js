/** Examen blanc : 40 questions, 45 minutes, conditions réelles. */

import { h, icon } from '../lib/dom.js';
import { formatDateShort, duration, pct } from '../lib/util.js';
import { EXAM, THEMES, BLUEPRINT } from '../data/programme.js';
import { buildExam } from '../engine.js';
import { navigate } from '../app.js';
import { runQuiz } from './reviser.js';
import * as store from '../store.js';

export default function renderExamen({ params }) {
  if (params[0] === 'run') return run();
  return intro();
}

/* ---------------------------------------------------------------- intro */

function intro() {
  const history = store.exams();
  const best = history.length ? Math.max(...history.map((e) => e.score)) : null;
  const passedCount = history.filter((e) => e.score >= EXAM.passing).length;

  const composition = BLUEPRINT.reduce((acc, b) => {
    acc[b.theme] = (acc[b.theme] || 0) + b.n;
    return acc;
  }, {});

  const rules = [
    [`${EXAM.questions} questions`, 'à choix multiples, une seule bonne réponse'],
    [`${EXAM.minutes} minutes`, 'le chronomètre tourne, comme le jour J'],
    [`${EXAM.passing} bonnes réponses`, `soit ${EXAM.passingPct} %, pour être reçu`],
    ['12 mises en situation', 'et 28 questions de connaissances'],
  ];

  return {
    node: h('div', { class: 'stack' }, [
      h('div', { class: 'hero' }, [
        h('p', { class: 'hero__eyebrow', text: 'Conditions réelles' }),
        h('h1', { class: 'hero__title', text: 'Examen blanc' }),
        h('p', { class: 'hero__sub', text: "Le tirage respecte la répartition officielle des questions par thème fixée par l'arrêté du 10 octobre 2025." }),
      ]),

      h('div', { class: 'card' }, [
        h('h2', { class: 'card__title', text: "Règles de l'épreuve" }),
        h('div', { class: 'stack stack--tight mt' }, rules.map(([k, v]) => h('div', { class: 'row' }, [
          h('span', { class: 'item__icon', style: 'width:32px;height:32px;border-radius:9px' }, icon('check')),
          h('span', { class: 'grow small' }, [
            h('strong', { text: k }),
            h('span', { class: 'muted', text: ` — ${v}` }),
          ]),
        ]))),
      ]),

      h('div', { class: 'card' }, [
        h('h2', { class: 'card__title', text: 'Composition du questionnaire' }),
        h('div', { class: 'themestat mt' }, Object.entries(composition).map(([key, n]) => h('div', { class: 'themestat__row' }, [
          h('div', { class: 'themestat__head' }, [
            h('span', { class: 'themestat__name', text: THEMES[key].short }),
            h('span', { class: 'themestat__val', text: `${n} question${n > 1 ? 's' : ''}` }),
          ]),
          h('div', { class: 'bar' }, h('div', { class: 'bar__fill', style: `width:${(n / EXAM.questions) * 100}%` })),
        ]))),
      ]),

      h('button', {
        class: 'btn btn--accent', type: 'button',
        onclick: () => navigate('#/examen/run'),
      }, [icon('play'), h('span', { text: "Démarrer l'examen blanc" })]),

      h('p', { class: 'hint center', text: "Prévoyez 45 minutes au calme. Vous pouvez passer une question, mais vous ne pourrez pas y revenir : la correction n'arrive qu'à la fin, comme à l'examen." }),

      history.length ? h('div', { class: 'card' }, [
        h('div', { class: 'row row--between' }, [
          h('h2', { class: 'card__title', text: 'Vos examens blancs' }),
          h('span', { class: 'badge', text: `${passedCount}/${history.length} réussis` }),
        ]),
        h('p', { class: 'card__sub', text: best !== null ? `Meilleur score : ${best}/${EXAM.questions}` : '' }),
        h('div', { class: 'mt' }, history.slice(0, 6).map((e) => {
          const ok = e.score >= EXAM.passing;
          return h('div', { class: 'histrow' }, [
            h('div', { class: 'histrow__score', style: `color:var(--${ok ? 'ok' : 'bad'})`, text: `${e.score}` }),
            h('div', { class: 'histrow__meta' }, [
              h('div', { text: `${e.score}/${e.total} — ${pct(e.score, e.total)} %` }),
              h('div', { class: 'histrow__date', text: `${formatDateShort(e.date)} · ${duration(e.durationSec)}${e.timedOut ? ' · temps écoulé' : ''}` }),
            ]),
            h('span', { class: `badge badge--${ok ? 'ok' : 'bad'}`, text: ok ? 'Reçu' : 'Échec' }),
          ]);
        })),
      ]) : null,
    ].filter(Boolean)),
    title: 'Examen blanc',
  };
}

/* ------------------------------------------------------------ passation */

function run() {
  const container = h('div', { class: 'stack' });

  function start() {
    runQuiz({
      container,
      cards: buildExam(),
      immediate: false,
      isExam: true,
      timeLimitSec: EXAM.minutes * 60,
      label: 'Examen',
      backTo: '#/examen',
      onRestart: start,
      onFinished: (result) => {
        store.saveExam({
          id: `e${result.date}`,
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
  return { node: container, title: 'Examen en cours', back: '#/examen', hideTabs: true };
}
