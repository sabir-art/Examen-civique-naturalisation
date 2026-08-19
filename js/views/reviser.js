/** Entraînement : choix du thème, révision espacée, reprise des erreurs. */

import { h, toast, spot } from '../lib/dom.js';
import {
  Card, Button, Chip, Badge, SectionHeader, Icon,
  SegmentedControl, ThemeCard, LessonRow,
} from '../ds/index.js';

/** Aplat de la carte d'en-tête d'un thème, dans la famille de ce thème. */
const SURFACE = {
  'principes-valeurs': 'butter',
  institutions: 'mint',
  'droits-devoirs': 'lavender-soft',
  'histoire-geo-culture': 'lavender',
  'vivre-societe': 'blush',
};

/** Pastel de chaque thème du programme, fixé une fois pour toutes. */
const SUJET = {
  'principes-valeurs': 'valeurs',
  institutions: 'institutions',
  'droits-devoirs': 'societe',
  'histoire-geo-culture': 'histoire',
  'vivre-societe': 'symboles',
};
import { THEMES, SUBS } from '../data/programme.js';
import { pool } from '../data/questions.js';
import { TOUTES_LES_QUESTIONS, poolTheme, phraseComposition } from '../data/banques.js';
import { CHAPITRES } from '../data/livret.js';
import { TOTAL_TERMES } from '../data/glossaire.js';
import { buildTraining, mastery, coverage, planRevision, planErreurs, compositionSeance, resteSeance } from '../engine.js';
import { createQuiz } from '../components/quiz.js';
import { createResults } from '../components/results.js';
import { setGuard, refresh, masquerOnglets } from '../app.js';

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
  const plan = planRevision(20);
  // Le même calcul que la séance : le badge ne peut plus annoncer une erreur
  // que l'écran suivant ne trouve pas.
  const err = planErreurs(20);

  /* --------------------------------------------- séances recommandées */

  const quick = h('div', { class: 'list' }, [
    // Le badge porte la taille de la SÉANCE : le nombre auquel on va
    // effectivement répondre en appuyant. Ce qui reste à revoir au-delà est
    // écrit sous l'intitulé, sans être confondu avec lui.
    LessonRow({
      icon: 'refresh-cw',
      title: 'Révision du jour',
      meta: [
        plan.total > 0 ? compositionSeance(plan) : 'Rien à revoir dans l’immédiat',
        resteSeance(plan),
      ].filter(Boolean).join(' · '),
      href: '#/reviser/revision',
      trailing: plan.total > 0
        ? Badge({ tone: 'info', label: String(plan.total) })
        : Icon({ name: 'chevron-right', size: 18, className: 'ds-lesson__chev' }),
    }),
    LessonRow({
      icon: 'list-checks',
      title: 'Cartes mémoire',
      meta: 'Répondre de tête, puis retourner la carte',
      href: '#/cartes',
      trailing: Icon({ name: 'chevron-right', size: 18, className: 'ds-lesson__chev' }),
    }),
    err.total > 0 ? LessonRow({
      icon: 'target',
      title: 'Mes erreurs',
      meta: err.reste > 0
        ? `${err.questions.length} dans cette séance, ${err.reste} après`
        : `${err.total} question${err.total > 1 ? 's' : ''} pas encore acquise${err.total > 1 ? 's' : ''}`,
      href: '#/reviser/erreurs',
      trailing: Badge({ tone: 'wrong', label: String(err.total) }),
    }) : null,
  ].filter(Boolean));

  /* ------------------------------------------ thèmes du programme */

  // Filtres repris des maquettes : on ne veut pas relire toute la liste pour
  // retrouver le thème qu'on a commencé.
  const FILTRES = [
    { key: 'tous', label: 'Tous', match: () => true },
    { key: 'commences', label: 'En cours', match: (s) => s.cov > 0 && s.m < 70 },
    { key: 'nouveaux', label: 'Non commencés', match: (s) => s.cov === 0 },
    { key: 'acquis', label: 'Acquis', match: (s) => s.m >= 70 },
  ];
  let filtre = 'tous';

  const themes = h('div', { class: 'list' });
  const chips = h('div', { class: 'chips' });

  function drawThemes() {
    const lignes = Object.entries(THEMES).map(([key, t]) => ({
      key, t,
      m: Math.round(mastery(key) * 100),
      cov: Math.round(coverage(key) * 100),
      n: poolTheme(key).length,
    }));
    const f = FILTRES.find((x) => x.key === filtre);
    const visibles = lignes.filter(f.match);

    chips.replaceChildren(...FILTRES.map((x) => Chip({
      label: `${x.label} (${lignes.filter(x.match).length})`,
      pressed: filtre === x.key,
      onClick: () => { filtre = x.key; drawThemes(); },
    })));

    // `ThemeCard` : le composant que le système donne pour un thème de
    // révision, avec son pastel, son glyphe et son avancement.
    themes.replaceChildren(visibles.length
      ? h('div', { class: 'list' }, visibles.map((s) => ThemeCard({
        title: s.t.short,
        topic: SUJET[s.key] || 'histoire',
        icon: s.t.icon,
        progress: s.m,
        meta: `${s.n} questions · ${s.t.count} tirées à l'examen`,
        href: `#/reviser/t/${s.key}`,
      })))
      : h('p', { class: 'hint center', style: 'padding:14px 0', text: 'Aucun thème dans cette catégorie.' }));
  }

  drawThemes();

  /* ------------------------------------------------------------ à lire */

  const lire = h('div', { class: 'list' }, [
    LessonRow({
      icon: 'landmark',
      title: 'Livret du citoyen',
      meta: `Le document officiel du ministère, ${CHAPITRES.length} chapitres`,
      href: '#/livret',
      trailing: Icon({ name: 'chevron-right', size: 18, className: 'ds-lesson__chev' }),
    }),
    LessonRow({
      icon: 'flag',
      title: 'Fiches de révision',
      meta: 'Le programme résumé, thème par thème',
      href: '#/cours',
      trailing: Icon({ name: 'chevron-right', size: 18, className: 'ds-lesson__chev' }),
    }),
    LessonRow({
      icon: 'pin',
      title: 'Les tableaux d’enquête',
      meta: 'Les dates, les noms et les rôles reliés entre eux',
      href: '#/tableaux',
      trailing: Icon({ name: 'chevron-right', size: 18, className: 'ds-lesson__chev' }),
    }),
    LessonRow({
      icon: 'lightbulb',
      title: 'Les mots difficiles',
      meta: `${TOTAL_TERMES} mots expliqués simplement, en français et en arabe`,
      href: '#/histoire/glossaire',
      trailing: Icon({ name: 'chevron-right', size: 18, className: 'ds-lesson__chev' }),
    }),
  ]);

  return {
    node: h('div', { class: 'stack' }, [
      Card({
        surface: 'mint', radius: 'hero', padding: 'lg', className: 'banner',
        children: [
          h('div', { class: 'banner__text' }, [
            h('p', { class: 'banner__title', text: 'Réviser' }),
            h('p', { class: 'banner__sub', text: `${TOUTES_LES_QUESTIONS.length} questions, reprises quand il le faut` }),
          ]),
          spot('revision'),
        ],
      }),
      SectionHeader({ title: 'Séances recommandées' }),
      quick,
      SectionHeader({ title: 'Thèmes du programme officiel' }),
      chips,
      themes,
      SectionHeader({ title: 'À lire' }),
      lire,
      h('p', { class: 'hint center', text: "La maîtrise augmente quand vous répondez juste plusieurs fois à intervalles croissants." }),
    ]),
    title: 'Réviser',
  };
}

/* -------------------------------------------------- configuration d'un thème */

function themeSetup(theme, preSub) {
  const t = THEMES[theme];
  // Le thème entier — les trois banques —, mais les sous-thèmes ne viennent
  // que de la banque d'examen : elle seule en porte.
  const all = poolTheme(theme);
  const subs = [...new Set(pool({ theme }).map((q) => q.sub))];
  let chosenSub = preSub && subs.includes(preSub) ? preSub : null;
  let count = 20;

  const container = h('div', { class: 'stack' });

  function draw() {
    const available = chosenSub ? pool({ theme, sub: chosenSub }).length : all.length;
    const counts = COUNTS.filter((c) => c <= available);
    if (!counts.includes(count)) count = counts[counts.length - 1] || available;

    container.replaceChildren(
      Card({
        surface: SURFACE[theme] || 'lavender', radius: 'hero', padding: 'lg',
        children: [
          h('h2', { class: 'card__title', text: t.label }),
          h('p', { class: 'card__sub', text: t.blurb }),
          h('p', { class: 'card__sub', style: 'margin-top:8px', text: `${t.count} des 40 questions de l'examen portent sur ce thème.` }),
          // Sur quoi porte le pourcentage affiché ailleurs : dit ici une fois,
          // plutôt que laissé à deviner.
          h('p', { class: 'card__sub', style: 'margin-top:4px', text: phraseComposition(theme) }),
        ],
      }),

      subs.length > 1 ? h('div', { class: 'stack stack--tight' }, [
        SectionHeader({ title: 'Sous-thème' }),
        h('div', { class: 'chips' }, [
          Chip({
            label: `Tout le thème (${all.length})`,
            pressed: chosenSub === null,
            onClick: () => { chosenSub = null; draw(); },
          }),
          ...subs.map((x) => Chip({
            label: `${SUBS[x] || x} (${pool({ theme, sub: x }).length})`,
            pressed: chosenSub === x,
            onClick: () => { chosenSub = x; draw(); },
          })),
        ]),
        h('p', { class: 'hint', text: "Les sous-thèmes ne découpent que les questions d'examen ; le livret et le récit restent dans « tout le thème »." }),
      ]) : null,

      h('div', { class: 'stack stack--tight' }, [
        SectionHeader({ title: 'Nombre de questions' }),
        SegmentedControl({
          options: counts.map((c) => ({ value: c, label: String(c) })),
          value: count,
          onChange: (c) => { count = c; draw(); },
        }),
      ]),

      Button({
        variant: 'primary', size: 'lg', fullWidth: true, iconLeft: 'play',
        label: `Commencer (${count} questions)`, onClick: () => start(),
      }),

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
      h('div', { class: 'empty__icon' }, Icon({ name: 'check', size: 26 })),
      h('p', { text: mode === 'erreurs' ? "Aucune erreur en attente. Tout est acquis pour l'instant." : "Rien à réviser dans l'immédiat." }),
      Button({ variant: 'primary', size: 'lg', href: '#/reviser', label: 'Choisir un thème', className: 'mt' }),
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
  // Un questionnaire occupe tout l'écran, d'où qu'il vienne.
  masquerOnglets();
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
          Button({ variant: 'secondary', size: 'lg', fullWidth: true, href: backTo || '#/', label: 'Retour' }),
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
