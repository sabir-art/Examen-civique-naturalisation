/** Suivi de la progression : indicateurs, thèmes, historique. */

import { h, icon } from '../lib/dom.js';
import { formatDateShort, duration, pct, plural } from '../lib/util.js';
import { EXAM } from '../data/programme.js';
import { CHAPITRES as ROMAN_CHAPITRES } from '../data/roman.js';
import { CHAPITRES as LIVRET_CHAPITRES } from '../data/livret.js';
import {
  overview, themeStats, readiness, EXAM_MODES, modeOf, livretOverview, romanOverview,
  romanChapitreProgres, livretChapitreProgres,
} from '../engine.js';
import { niveau, badgesObtenus, badges } from '../lib/xp.js';
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

  // Les deux sections annexes sont suivies séparément : elles ne modifient ni
  // la préparation globale ni la maîtrise par thème affichées plus haut.
  const lv = livretOverview();
  const rm = romanOverview();
  // La barre montre l'AVANCEMENT (chapitres terminés), pas la maîtrise : celle-ci
  // ne peut pas se remplir en une séance, et une barre qui reste au quart alors
  // que tout est fait se lit comme un compteur cassé. La maîtrise reste
  // affichée, mais nommée.
  const romanTermines = ROMAN_CHAPITRES.filter((c) => romanChapitreProgres(c.key).termine).length;
  const livretTermines = LIVRET_CHAPITRES.filter((c) => livretChapitreProgres(c.key).termine).length;

  const autres = h('div', { class: 'card' }, [
    h('h2', { class: 'card__title', text: 'Les autres sections' }),
    h('p', { class: 'card__sub', text: "Suivies à part : elles n'entrent pas dans l'estimation de préparation à l'épreuve." }),
    h('div', { class: 'themestat mt' }, [
      {
        href: '#/histoire', name: 'La France racontée',
        faits: romanTermines, sur: rm.chapitres, m: rm.mastery,
      },
      {
        href: '#/livret', name: 'Livret du citoyen',
        faits: livretTermines, sur: LIVRET_CHAPITRES.length, m: lv.mastery,
      },
    ].map((s) => {
      const p = s.sur ? Math.round((s.faits / s.sur) * 100) : 0;
      return h('a', { class: 'themestat__row', href: s.href, style: 'text-decoration:none;color:inherit' }, [
        h('div', { class: 'themestat__head' }, [
          h('span', { class: 'themestat__name', text: s.name }),
          h('span', { class: 'themestat__val', text: `${s.faits}/${s.sur} chapitres` }),
        ]),
        h('div', { class: 'bar' }, h('div', { class: `bar__fill${p === 100 ? ' bar__fill--ok' : ''}`, style: `width:${p}%` })),
        h('p', { class: 'hint', style: 'margin-top:5px', text: `Chapitres terminés. Mémorisation à long terme : ${s.m} %.` }),
      ]);
    })),
  ]);

  const officiels = history.filter((e) => modeOf(e) === 'officiel');
  const spark = officiels.length >= 2 ? h('div', { class: 'card' }, [
    h('h2', { class: 'card__title', text: 'Évolution au format officiel' }),
    h('div', { class: 'spark mt' }, officiels.slice(0, 12).reverse().map((e) => {
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
        h('span', { class: 'badge', text: EXAM_MODES[modeOf(e)].short }),
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

  /* ------------------------------------------------- les sept derniers jours */

  const JOURS = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
  const semaine = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    semaine.push({
      lettre: JOURS[d.getDay()],
      n: store.current()?.days?.[store.dayKey(d.getTime())] || 0,
      aujourdhui: i === 0,
    });
  }
  const maxJour = Math.max(1, ...semaine.map((j) => j.n));
  const totalSemaine = semaine.reduce((s, j) => s + j.n, 0);

  const hebdo = h('div', { class: 'card' }, [
    h('div', { class: 'row row--between' }, [
      h('h2', { class: 'card__title', text: 'Ces sept derniers jours' }),
      h('span', { class: 'badge badge--brand', text: `${totalSemaine} réponse${totalSemaine > 1 ? 's' : ''}` }),
    ]),
    h('div', { class: 'week' }, semaine.map((j) => h('div', { class: 'week__day' }, [
      h('div', {
        class: `week__bar ${j.aujourdhui ? 'week__bar--today' : j.n > 0 ? 'week__bar--on' : ''}`,
        style: `height:${Math.round((j.n / maxJour) * 74) + 5}px`,
        title: `${j.n} réponse${j.n > 1 ? 's' : ''}`,
      }),
      h('span', { class: 'week__lab', text: j.lettre }),
    ]))),
    h('p', { class: 'hint mt', text: totalSemaine === 0 ? "Rien cette semaine pour l'instant." : `Moyenne : ${Math.round(totalSemaine / 7)} par jour.` }),
  ]);

  /* ------------------------------------------------------ niveau et badges */

  const n = niveau();
  const gagnes = badgesObtenus().length;
  const total = badges().length;

  const parcours = h('a', { class: 'card card--link', href: '#/parcours' }, [
    h('div', { class: 'row', style: 'gap:13px' }, [
      h('span', { class: 'lvl__num', style: 'width:38px;height:38px;font-size:15px;background:var(--brand);color:var(--on-brand)', text: String(n.rang) }),
      h('div', { class: 'grow' }, [
        h('p', { class: 'card__eyebrow', text: `Niveau ${n.rang} sur ${n.total}` }),
        h('h2', { class: 'card__title', style: 'margin-top:2px', text: n.nom }),
      ]),
    ]),
    h('div', { class: 'bar bar--thin', style: 'margin-top:12px' },
      h('span', { class: 'bar__fill', style: `width:${n.pct}%` })),
    h('p', { class: 'card__sub', style: 'margin-top:7px', text: n.suivant
      ? `${n.xp.toLocaleString('fr-FR')} points · encore ${n.versLeSuivant.toLocaleString('fr-FR')} pour « ${n.suivant} » · ${gagnes}/${total} badges`
      : `${n.xp.toLocaleString('fr-FR')} points · ${gagnes}/${total} badges` }),
  ]);

  return {
    node: h('div', { class: 'stack' }, [
      head,
      parcours,
      h('div', { class: 'card card--pad-sm row', style: 'gap:12px' }, [
        h('span', { class: 'item__icon' }, icon('fire')),
        h('span', { class: 'grow small' }, [
          h('strong', { text: `${streakDays} ${plural(streakDays, 'jour')} d'affilée` }),
          h('span', { class: 'muted', text: today ? ` · ${today} ${plural(today, 'question')} aujourd'hui` : " · rien aujourd'hui pour l'instant" }),
        ]),
      ]),
      kpis,
      hebdo,
      empty,
      themes,
      autres,
      spark,
      historyCard,
    ].filter(Boolean)),
    title: 'Ma progression',
  };
}
