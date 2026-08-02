/** Suivi de la progression : indicateurs, thèmes, historique. */

import { h, icon } from '../lib/dom.js';
import { formatDateShort, duration, pct, plural } from '../lib/util.js';
import { EXAM } from '../data/programme.js';
import { overview, themeStats, readiness } from '../engine.js';
import * as store from '../store.js';

export default function renderProgres() {
  const o = overview();
  const r = readiness();
  const stats = themeStats();
  const history = store.exams();

  const tone = r >= 80 ? 'ok' : r >= 50 ? 'warn' : 'bad';

  const head = h('div', { class: 'card' }, [
    h('div', { class: 'row row--between' }, [
      h('div', {}, [
        h('h2', { class: 'card__title', text: 'Préparation globale' }),
        h('p', { class: 'card__sub', text: 'Maîtrise des questions, pondérée par le poids de chaque thème à l\'examen.' }),
      ]),
      h('span', { class: `badge badge--${tone}`, text: `${r} %` }),
    ]),
    h('div', { class: 'bar', style: 'margin-top:12px' }, h('div', { class: `bar__fill bar__fill--${tone}`, style: `width:${r}%` })),
  ]);

  const kpis = h('div', { class: 'kpis' }, [
    ['questions vues', `${o.seen}/${o.bankSize}`],
    ['réponses données', String(o.answers)],
    ['taux de réussite', o.accuracy === null ? '—' : `${o.accuracy} %`],
    ['questions acquises', String(o.mastered)],
    ['examens blancs', String(o.exams)],
    ['meilleur score', o.best === null ? '—' : `${o.best}/${EXAM.questions}`],
  ].map(([lab, val]) => h('div', { class: 'kpi' }, [
    h('div', { class: 'kpi__val', text: val }),
    h('div', { class: 'kpi__lab', text: lab }),
  ])));

  const themes = h('div', { class: 'card' }, [
    h('h2', { class: 'card__title', text: 'Maîtrise par thème' }),
    h('p', { class: 'card__sub', text: 'Travaillez en priorité les barres les plus courtes.' }),
    h('div', { class: 'themestat mt' }, stats
      .slice()
      .sort((a, b) => a.mastery - b.mastery)
      .map((s) => {
        const m = Math.round(s.mastery * 100);
        const t = m >= 70 ? 'ok' : m >= 35 ? 'warn' : 'bad';
        return h('a', { class: 'themestat__row', href: `#/reviser/t/${s.key}`, style: 'text-decoration:none;color:inherit' }, [
          h('div', { class: 'themestat__head' }, [
            h('span', { class: 'themestat__name', text: s.label }),
            h('span', { class: 'themestat__val', text: `${m} % · ${s.seen}/${s.total} vues` }),
          ]),
          h('div', { class: 'bar' }, h('div', { class: `bar__fill bar__fill--${t}`, style: `width:${m}%` })),
        ]);
      })),
  ]);

  const spark = history.length >= 2 ? h('div', { class: 'card' }, [
    h('h2', { class: 'card__title', text: 'Évolution des examens blancs' }),
    h('div', { class: 'spark mt' }, history.slice(0, 12).reverse().map((e) => {
      const ratio = e.score / e.total;
      return h('div', {
        class: `spark__bar spark__bar--${e.score >= EXAM.passing ? 'ok' : 'bad'}`,
        style: `height:${Math.max(8, ratio * 100)}%`,
        title: `${e.score}/${e.total} — ${formatDateShort(e.date)}`,
      });
    })),
    h('p', { class: 'hint mt', text: `Ligne de réussite : ${EXAM.passing}/${EXAM.questions}. Du plus ancien au plus récent.` }),
  ]) : null;

  const historyCard = history.length ? h('div', { class: 'card' }, [
    h('h2', { class: 'card__title', text: 'Historique' }),
    h('div', { class: 'mt' }, history.slice(0, 15).map((e) => {
      const ok = e.score >= EXAM.passing;
      return h('div', { class: 'histrow' }, [
        h('div', { class: 'histrow__score', style: `color:var(--${ok ? 'ok' : 'bad'})`, text: String(e.score) }),
        h('div', { class: 'histrow__meta' }, [
          h('div', { text: `${pct(e.score, e.total)} % — ${ok ? 'reçu' : 'échec'}` }),
          h('div', { class: 'histrow__date', text: `${formatDateShort(e.date)} · ${duration(e.durationSec)}` }),
        ]),
      ]);
    })),
  ]) : null;

  const empty = o.answers === 0 ? h('div', { class: 'empty' }, [
    h('div', { class: 'empty__icon' }, icon('chart')),
    h('p', { text: "Aucune donnée pour l'instant." }),
    h('a', { class: 'btn mt', href: '#/reviser', text: 'Commencer à réviser' }),
  ]) : null;

  const streakDays = store.streak();
  const today = store.answeredToday();

  return {
    node: h('div', { class: 'stack' }, [
      head,
      h('div', { class: 'card card--pad-sm row', style: 'gap:12px' }, [
        h('span', { class: 'item__icon' }, icon('fire')),
        h('span', { class: 'grow small' }, [
          h('strong', { text: `${streakDays} ${plural(streakDays, 'jour')} d'affilée` }),
          h('span', { class: 'muted', text: today ? ` · ${today} ${plural(today, 'question')} aujourd'hui` : " · rien aujourd'hui pour l'instant" }),
        ]),
      ]),
      kpis,
      empty,
      themes,
      spark,
      historyCard,
    ].filter(Boolean)),
    title: 'Ma progression',
  };
}
