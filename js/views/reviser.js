/** Entraînement : choix du thème, révision espacée, reprise des erreurs. */

import { h, icon, toast, spot } from '../lib/dom.js';
import { THEMES, SUBS } from '../data/programme.js';
import { pool } from '../data/questions.js';
import { CHAPITRES } from '../data/livret.js';
import { TOTAL_TERMES } from '../data/glossaire.js';
import { buildTraining, mastery, coverage } from '../engine.js';
import { createQuiz } from '../components/quiz.js';
import { createResults } from '../components/results.js';
import { setGuard, refresh } from '../app.js';
import * as store from '../store.js';

const COUNTS = [10, 20, 40];

export default function renderReviser({ params }) {
  const target = params[0];
  if (!target) return hub();
  if (target === 'revision') return session({ mode: 'revision', count: 20, label: 'Révision du jour' });
  if (target === 'erreurs') return session({ mode: 'erreurs', count: 20, label: 'Mes erreurs' });
  if (target.startsWith('t/')) {
    const [, theme, sub] = target.split('/');
    if (!THEMES[theme]) return hub();
    return themeSetup(theme, sub);
  }
  return hub();
}

/* ------------------------------------------------------------------ hub */

function hub() {
  const due = store.dueIds().length;
  const weak = store.weakIds().length;

  const quick = h('div', { class: 'list' }, [
    h('a', { class: 'item', href: '#/reviser/revision' }, [
      h('span', { class: 'item__icon' }, icon('refresh')),
      h('span', { class: 'item__body' }, [
        h('span', { class: 'item__title', text: 'Révision du jour' }),
        h('span', { class: 'item__sub', text: due > 0 ? `${due} question${due > 1 ? 's' : ''} à revoir maintenant` : 'Mélange de questions dues et de nouvelles' }),
      ]),
      due > 0 ? h('span', { class: 'badge badge--warn', text: String(due) }) : null,
      h('span', { class: 'item__chev' }, icon('chevron')),
    ].filter(Boolean)),
    h('a', { class: 'item item--revise', href: '#/cartes' }, [
      h('span', { class: 'item__icon' }, icon('list')),
      h('span', { class: 'item__body' }, [
        h('span', { class: 'item__title', text: 'Cartes mémoire' }),
        h('span', { class: 'item__sub', text: 'Répondre de tête, puis retourner la carte' }),
      ]),
      h('span', { class: 'item__chev' }, icon('chevron')),
    ]),
    weak > 0 ? h('a', { class: 'item', href: '#/reviser/erreurs' }, [
      h('span', { class: 'item__icon' }, icon('target')),
      h('span', { class: 'item__body' }, [
        h('span', { class: 'item__title', text: 'Mes erreurs' }),
        h('span', { class: 'item__sub', text: `${weak} question${weak > 1 ? 's' : ''} pas encore acquise${weak > 1 ? 's' : ''}` }),
      ]),
      h('span', { class: 'badge badge--bad', text: String(weak) }),
      h('span', { class: 'item__chev' }, icon('chevron')),
    ]) : null,
  ].filter(Boolean));

  // Filtres repris des maquettes : on ne veut pas relire toute la liste pour
  // retrouver le thème qu'on a commencé.
  const FILTRES = [
    { key: 'tous', label: 'Tous', match: () => true },
    { key: 'commences', label: 'En cours', match: (s) => s.cov > 0 && s.m < 70 },
    { key: 'nouveaux', label: 'Non commencés', match: (s) => s.cov === 0 },
    { key: 'acquis', label: 'Acquis', match: (s) => s.m >= 70 },
  ];
  let filtre = 'tous';

  const themes = h('div', { class: 'card card--pad-sm' });
  const chips = h('div', { class: 'chips' });

  function drawThemes() {
    const lignes = Object.entries(THEMES).map(([key, t]) => ({
      key, t,
      m: Math.round(mastery(key) * 100),
      cov: Math.round(coverage(key) * 100),
      n: pool({ theme: key }).length,
    }));
    const f = FILTRES.find((x) => x.key === filtre);
    const visibles = lignes.filter(f.match);

    chips.replaceChildren(...FILTRES.map((x) => h('button', {
      class: 'chip', type: 'button', 'aria-pressed': filtre === x.key ? 'true' : 'false',
      text: `${x.label} (${lignes.filter(x.match).length})`,
      onclick: () => { filtre = x.key; drawThemes(); },
    })));

    themes.replaceChildren(visibles.length
      ? h('div', { class: 'trows' }, visibles.map((s) => {
        const tone = s.m >= 70 ? 'ok' : s.m >= 35 ? 'warn' : 'bad';
        return h('a', { class: 'trow', href: `#/reviser/t/${s.key}` }, [
          h('span', { class: `trow__icon trow__icon--${s.key}` }, icon(s.t.icon)),
          h('span', { class: 'trow__body' }, [
            h('span', { class: 'trow__title', text: s.t.short }),
            h('span', { class: 'trow__sub', text: `${s.n} questions · ${s.t.count} tirées à l'examen` }),
            h('span', { class: 'bar bar--thin' }, h('span', { class: `bar__fill bar__fill--${tone}`, style: `width:${s.m}%` })),
          ]),
          h('span', { class: 'trow__pct', text: `${s.m}%` }),
        ]);
      }))
      : h('p', { class: 'hint center', style: 'padding:14px 0', text: 'Aucun thème dans cette catégorie.' }));
  }

  drawThemes();

  const lire = h('div', { class: 'list' }, [
    h('a', { class: 'item item--livret', href: '#/livret' }, [
      h('span', { class: 'item__icon' }, icon('bank')),
      h('span', { class: 'item__body' }, [
        h('span', { class: 'item__title', text: 'Livret du citoyen' }),
        h('span', { class: 'item__sub', text: `Le document officiel du ministère, ${CHAPITRES.length} chapitres` }),
      ]),
      h('span', { class: 'item__chev' }, icon('chevron')),
    ]),
    h('a', { class: 'item', href: '#/cours' }, [
      h('span', { class: 'item__icon' }, icon('flag')),
      h('span', { class: 'item__body' }, [
        h('span', { class: 'item__title', text: 'Fiches de révision' }),
        h('span', { class: 'item__sub', text: 'Le programme résumé, thème par thème' }),
      ]),
      h('span', { class: 'item__chev' }, icon('chevron')),
    ]),
    h('a', { class: 'item', href: '#/histoire/glossaire' }, [
      h('span', { class: 'item__icon item__icon--brand' }, icon('bulb')),
      h('span', { class: 'item__body' }, [
        h('span', { class: 'item__title', text: 'Les mots difficiles' }),
        h('span', { class: 'item__sub', text: `${TOTAL_TERMES} mots expliqués simplement, en français et en arabe` }),
      ]),
      h('span', { class: 'item__chev' }, icon('chevron')),
    ]),
  ]);

  return {
    node: h('div', { class: 'stack' }, [
      h('div', { class: 'banner' }, [
        h('div', { class: 'banner__text' }, [
          h('p', { class: 'banner__title', text: 'Réviser' }),
          h('p', { class: 'banner__sub', text: `${pool({}).length} questions, reprises quand il le faut` }),
        ]),
        spot('revision'),
      ]),
      h('p', { class: 'section-title', text: 'Séances recommandées' }),
      quick,
      h('p', { class: 'section-title', text: 'Thèmes du programme officiel' }),
      chips,
      themes,
      h('p', { class: 'section-title', text: 'À lire' }),
      lire,
      h('p', { class: 'hint center mt', text: "La maîtrise augmente quand vous répondez juste plusieurs fois à intervalles croissants." }),
    ]),
    title: 'Réviser',
  };
}

/* -------------------------------------------------- configuration d'un thème */

function themeSetup(theme, preSub) {
  const t = THEMES[theme];
  const all = pool({ theme });
  const subs = [...new Set(all.map((q) => q.sub))];
  let chosenSub = preSub && subs.includes(preSub) ? preSub : null;
  let count = 20;

  const container = h('div', { class: 'stack' });

  function draw() {
    const available = pool({ theme, sub: chosenSub }).length;
    const counts = COUNTS.filter((c) => c <= available);
    if (!counts.includes(count)) count = counts[counts.length - 1] || available;

    container.replaceChildren(
      h('div', { class: 'card' }, [
        h('h2', { class: 'card__title', text: t.label }),
        h('p', { class: 'card__sub', text: t.blurb }),
        h('p', { class: 'card__sub', style: 'margin-top:8px', text: `${t.count} des 40 questions de l'examen portent sur ce thème.` }),
      ]),

      subs.length > 1 ? h('div', { class: 'stack stack--tight' }, [
        h('p', { class: 'section-title', text: 'Sous-thème' }),
        h('div', { class: 'chips' }, [
          h('button', {
            class: 'chip', type: 'button', 'aria-pressed': chosenSub === null ? 'true' : 'false',
            text: `Tout le thème (${all.length})`,
            onclick: () => { chosenSub = null; draw(); },
          }),
          ...subs.map((s) => h('button', {
            class: 'chip', type: 'button', 'aria-pressed': chosenSub === s ? 'true' : 'false',
            text: `${SUBS[s] || s} (${pool({ theme, sub: s }).length})`,
            onclick: () => { chosenSub = s; draw(); },
          })),
        ]),
      ]) : null,

      h('div', { class: 'stack stack--tight' }, [
        h('p', { class: 'section-title', text: 'Nombre de questions' }),
        h('div', { class: 'seg' }, counts.map((c) => h('button', {
          class: 'seg__btn', type: 'button', 'aria-pressed': count === c ? 'true' : 'false',
          text: String(c), onclick: () => { count = c; draw(); },
        }))),
      ]),

      h('button', {
        class: 'btn', type: 'button',
        onclick: () => start(),
      }, [icon('play'), h('span', { text: `Commencer (${count} questions)` })]),

      h('p', { class: 'hint center', text: 'Correction et explication après chaque réponse.' }),
    );
  }

  function start() {
    const cards = buildTraining({ mode: 'theme', theme, sub: chosenSub, count });
    if (!cards.length) { toast('Aucune question disponible.'); return; }
    runQuiz({
      container,
      cards,
      immediate: true,
      label: THEMES[theme].short,
      backTo: `#/reviser/t/${theme}`,
      onRestart: draw,
    });
  }

  draw();
  return { node: container, title: t.short, back: '#/reviser' };
}

/* ------------------------------------------------ séance directe (révision) */

function session({ mode, count, label }) {
  const container = h('div', { class: 'stack' });
  const cards = buildTraining({ mode, count });

  if (!cards.length) {
    container.append(h('div', { class: 'empty' }, [
      h('div', { class: 'empty__icon' }, icon('check')),
      h('p', { text: mode === 'erreurs' ? "Aucune erreur en attente. Tout est acquis pour l'instant." : "Rien à réviser dans l'immédiat." }),
      h('a', { class: 'btn mt', href: '#/reviser', text: 'Choisir un thème' }),
    ]));
    return { node: container, title: label, back: '#/reviser' };
  }

  runQuiz({
    container,
    cards,
    immediate: true,
    label,
    backTo: '#/reviser',
    onRestart: () => refresh(),
  });

  return { node: container, title: label, back: '#/reviser', hideTabs: true };
}

/* ---------------------------------------------------------- exécution */

export function runQuiz({ container, cards, immediate, label, backTo, onRestart, timeLimitSec = null, isExam = false, onFinished, extraActions = [] }) {
  const quiz = createQuiz({
    cards,
    immediate,
    timeLimitSec,
    label,
    onFinish: (result) => {
      setGuard(null);
      if (onFinished) onFinished(result);
      container.replaceChildren(createResults(result, {
        isExam,
        onRetry: onRestart,
        onReviewErrors: (ids) => {
          const again = buildTraining({ ids, count: ids.length });
          runQuiz({ container, cards: again, immediate: true, label: 'Reprise des erreurs', backTo, onRestart });
        },
        actions: [
          ...extraActions,
          h('a', { class: 'btn btn--ghost', href: backTo || '#/', text: 'Retour' }),
        ],
      }));
      window.scrollTo(0, 0);
    },
  });

  setGuard(async () => {
    const ok = await quiz.confirmLeave();
    return ok;
  });

  container.replaceChildren(quiz);
  window.scrollTo(0, 0);
  return quiz;
}
