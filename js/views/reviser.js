/** Entraînement : choix du thème, révision espacée, reprise des erreurs. */

import { h, icon, toast } from '../lib/dom.js';
import { THEMES, SUBS } from '../data/programme.js';
import { pool } from '../data/questions.js';
import { CHAPITRES } from '../data/livret.js';
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

  const themes = h('div', { class: 'list' }, Object.entries(THEMES).map(([key, t]) => {
    const m = Math.round(mastery(key) * 100);
    const cov = Math.round(coverage(key) * 100);
    const tone = m >= 70 ? 'ok' : m >= 35 ? 'warn' : 'bad';
    return h('a', { class: 'item', href: `#/reviser/t/${key}`, style: 'align-items:flex-start' }, [
      h('span', { class: 'item__icon' }, icon(t.icon)),
      h('span', { class: 'item__body' }, [
        h('span', { class: 'item__title', text: t.short }),
        h('span', { class: 'item__sub', text: `${pool({ theme: key }).length} questions · ${t.count} tirées à l'examen` }),
        h('div', { class: 'bar', style: 'margin-top:8px' }, h('div', { class: `bar__fill bar__fill--${tone}`, style: `width:${m}%` })),
        h('span', { class: 'item__sub', style: 'margin-top:5px', text: `Maîtrise ${m} % · ${cov} % du thème déjà vu` }),
      ]),
      h('span', { class: 'item__chev', style: 'margin-top:10px' }, icon('chevron')),
    ]);
  }));

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
  ]);

  return {
    node: h('div', { class: 'stack' }, [
      h('p', { class: 'section-title', text: 'Séances recommandées' }),
      quick,
      h('p', { class: 'section-title', text: 'Thèmes du programme officiel' }),
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
