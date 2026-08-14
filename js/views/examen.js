/** Examens blancs : trois formats, 40 questions en 45 minutes. */

import { h, icon } from '../lib/dom.js';
import { Card, Button, Badge, Icon, IconTile } from '../ds/index.js';
import { formatDateShort, duration, pct } from '../lib/util.js';
import { EXAM } from '../data/programme.js';
import { EXAM_MODES, EXAM_MODE_LIST, modeOf } from '../engine.js';
import { navigate } from '../app.js';
import { runQuiz } from './reviser.js';
import * as store from '../store.js';

/**
 * Un pastel par format d'examen blanc. Les trois se ressemblent par leur
 * contenu — 40 questions, 45 minutes, même seuil — donc c'est la couleur qui
 * les distingue au premier coup d'œil.
 */
const TEINTE = { officiel: 'lavender', livret: 'butter', mixte: 'mint' };

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
    return h('a', { class: 'ds-lesson ds-lesson--tap ligne--haute', href: `#/examen/${m.key}` }, [
      // `IconTile` et non la classe posée à la main : la taille du composant
      // vient de sa propriété `size`, pas de la feuille de style. Écrite en
      // classe seule, la pastille se réduisait à la taille de son icône.
      IconTile({ icon: m.icon, tone: TEINTE[m.key] || 'sunken', size: 44 }),
      // `div` et non `span` : c'est la structure de `LessonRow`. En inline, le
      // texte ne se plie pas à la largeur de la colonne et déborde de l'écran.
      h('div', { class: 'ds-lesson__body' }, [
        h('div', { class: 'ds-lesson__title ds-lesson__titre--long', text: m.title }),
        h('div', { class: 'ds-lesson__meta', text: m.blurb }),
        h('div', { class: 'ds-lesson__meta', style: 'margin-top:6px', text: m.source() }),
        s.count ? h('div', { class: 'row', style: 'margin-top:8px;gap:6px;flex-wrap:wrap' }, [
          h('span', { class: `badge badge--${s.best >= EXAM.passing ? 'ok' : 'bad'}`, text: `Meilleur ${s.best}/${EXAM.questions}` }),
          Badge({ tone: 'neutral', label: `${s.count} passé${s.count > 1 ? 's' : ''}` }),
        ]) : null,
      ].filter(Boolean)),
      Icon({ name: 'chevron-right', size: 18, className: 'ds-lesson__chev' }),
    ]);
  });

  const recent = history.slice(0, 8);

  return {
    node: h('div', { class: 'stack' }, [
      h('div', { class: 'hero hero--blanc' }, [
        h('p', { class: 'hero__eyebrow', text: 'Conditions réelles' }),
        h('h1', { class: 'hero__title', text: 'Examen blanc' }),
        h('p', { class: 'hero__sub', text: `Trois formats, tous en ${EXAM.questions} questions et ${EXAM.minutes} minutes, avec le même seuil de réussite : ${EXAM.passing}/${EXAM.questions}.` }),
      ]),

      h('p', { class: 'section-title', text: 'Choisir un format' }),
      h('div', { class: 'list' }, cards),

      recent.length ? Card({ surface: 'white', elevation: 'xs', children: [
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
            Badge({ tone: ok ? 'correct' : 'wrong', label: ok ? 'Reçu' : 'Échec' }),
          ]);
        })),
      ] }) : null,

      h('p', { class: 'hint center', text: "Seuls les résultats du format officiel entrent dans l'estimation de préparation, car lui seul respecte la composition de l'épreuve." }),
    ].filter(Boolean)),
    title: 'Examen blanc',
  };
}

/* ------------------------------------------------ présentation d'un format */

/**
 * Grand cadran du temps imparti.
 *
 * Il ne tourne pas : c'est une illustration de la contrainte, affichée avant de
 * lancer l'épreuve. Le chronomètre qui tourne vraiment est dans la barre du
 * questionnaire, sous forme réduite.
 */
function anneauTemps(minutes) {
  const r = 54;
  const c = 2 * Math.PI * r;
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 128 128');
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', `${minutes} minutes imparties`);
  svg.innerHTML = `
    <circle class="timerring__track" cx="64" cy="64" r="${r}" fill="none" stroke-width="9"/>
    <circle class="timerring__value" cx="64" cy="64" r="${r}" fill="none" stroke-width="9" stroke-linecap="round"
            transform="rotate(-90 64 64)" stroke-dasharray="${c}" stroke-dashoffset="0"/>
    <text class="timerring__time" x="64" y="60" text-anchor="middle" dominant-baseline="middle">${minutes}:00</text>
    <text class="timerring__sub" x="64" y="88" text-anchor="middle">MINUTES IMPARTIES</text>`;
  return h('div', { class: 'timerring' }, svg);
}

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
      h('div', { class: 'hero hero--exam' }, [
        h('p', { class: 'hero__eyebrow', text: 'Format choisi' }),
        h('h1', { class: 'hero__title', text: m.title }),
        h('p', { class: 'hero__sub', text: m.blurb }),
      ]),

      Card({ surface: 'white', elevation: 'xs', children: [
        h('h2', { class: 'card__title', text: 'Composition' }),
        h('p', { class: 'card__sub', text: m.source() }),
        h('div', { class: 'stack stack--tight mt' }, m.details.map((d) => h('div', { class: 'row' }, [
          IconTile({ icon: 'check', tone: 'sunken', size: 28, radius: 'var(--radius-sm)' }),
          h('span', { class: 'grow small', text: d }),
        ]))),
      ] }),

      Card({ surface: 'white', elevation: 'xs', children: [
        h('h2', { class: 'card__title', text: "Règles de l'épreuve" }),
        anneauTemps(EXAM.minutes),
        h('div', { class: 'stack stack--tight mt' }, rules.map(([k, v]) => h('div', { class: 'row' }, [
          IconTile({ icon: 'timer', tone: 'sunken', size: 32, radius: 'var(--radius-sm)' }),
          h('span', { class: 'grow small' }, [
            h('strong', { text: k }),
            h('span', { class: 'muted', text: ` — ${v}` }),
          ]),
        ]))),
      ] }),

      h('button', {
        class: 'ds-btn ds-btn--primary ds-btn--lg ds-btn--full', type: 'button',
        onclick: () => navigate(`#/examen/run/${key}`),
      }, [icon('play'), h('span', { text: 'Démarrer' })]),

      h('p', { class: 'hint center', text: "Prévoyez 45 minutes au calme. Vous pouvez passer une question, mais pas y revenir : la correction n'arrive qu'à la fin, comme à l'examen." }),

      history.length ? Card({ surface: 'white', elevation: 'xs', children: [
        h('div', { class: 'row row--between' }, [
          h('h2', { class: 'card__title', text: 'Vos résultats sur ce format' }),
          Badge({ tone: 'neutral', label: `${passedCount}/${history.length} réussis` }),
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
            Badge({ tone: ok ? 'correct' : 'wrong', label: ok ? 'Reçu' : 'Échec' }),
          ]);
        })),
      ].filter(Boolean) }) : null,

      Button({ variant: 'ghost', size: 'md', fullWidth: true, href: '#/examen', label: 'Changer de format' }),
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
