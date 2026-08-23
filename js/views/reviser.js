/** Entraînement : choix du thème, révision espacée, reprise des erreurs. */

import { h, toast, spot } from '../lib/dom.js';
import {
  Card, Button, Chip, Badge, SectionHeader, Icon, ProgressBar,
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
import { TOUTES_LES_QUESTIONS, poolTheme, phraseComposition, SOURCES, LIBELLE_SOURCE, SOURCE_APRES_DANS } from '../data/banques.js';
import { CHAPITRES } from '../data/livret.js';
import { TOTAL_TERMES } from '../data/glossaire.js';
import { buildTraining, mastery, coverage, avancementTheme, planRevision, planErreurs, compositionSeance, resteSeance } from '../engine.js';
import { createQuiz } from '../components/quiz.js';
import { createResults } from '../components/results.js';
import { setGuard, refresh, masquerOnglets } from '../app.js';
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
      vus: avancementTheme(key).vus,
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
        // Ce qu'on a déjà répondu passe devant : c'est la question qu'on se
        // pose en arrivant, et le pourcentage à droite n'y répond pas — il
        // mesure la mémorisation, qui monte par paliers de plusieurs jours.
        meta: `${s.vus}/${s.n} questions vues · ${s.t.count} tirées à l'examen`,
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

/**
 * « Combien j'en ai déjà fait, et par où ? »
 *
 * Les questions d'un thème arrivent par trois portes — l'entraînement, le
 * livret, le récit — et une réponse compte quelle que soit la porte. Encore
 * faut-il pouvoir le constater : sans ce détail, on lit « 43/209 » sans savoir
 * si les 166 qui restent sont dans le livret qu'on n'a pas ouvert ou dans le
 * récit qu'on a fini.
 */
function avancement(a) {
  return Card({ surface: 'white', elevation: 'xs', children: [
    h('div', { class: 'row row--between' }, [
      h('h2', { class: 'card__title', text: 'Où vous en êtes' }),
      Badge({ tone: a.vus >= a.total ? 'correct' : 'info', label: `${a.vus}/${a.total}` }),
    ]),
    h('p', { class: 'card__sub', text: `${a.vus} question${a.vus > 1 ? 's' : ''} déjà répondue${a.vus > 1 ? 's' : ''} dans ce thème, toutes sections confondues.` }),
    h('div', { class: 'stack stack--tight mt' }, a.par.map(([, b]) => h('div', {}, [
      h('div', { class: 'row row--between' }, [
        h('span', { class: 'small', text: b.libelle }),
        h('span', { class: 'hint', text: `${b.vus}/${b.total}` }),
      ]),
      h('div', { style: 'margin-top:4px' }, ProgressBar({
        value: b.total ? Math.round((b.vus / b.total) * 100) : 0,
        height: 6,
        // Vert quand la section est entièrement parcourue, comme partout
        // ailleurs : c'est ce vert qui dit « rien ne reste ici ».
        tone: b.vus >= b.total ? 'correct' : 'ink',
      })),
    ]))),
    h('p', { class: 'hint mt', text: 'Vu n’est pas retenu : le pourcentage de maîtrise, lui, monte par paliers d’un jour, puis trois, puis sept.' }),
  ] });
}

/* -------------------------------------------------- configuration d'un thème */

function themeSetup(theme, preSub) {
  const t = THEMES[theme];
  // Le thème entier — les trois banques —, mais les sous-thèmes ne viennent
  // que de la banque d'examen : elle seule en porte.
  const all = poolTheme(theme);
  const subs = [...new Set(pool({ theme }).map((q) => q.sub))];
  let chosenSub = preSub && subs.includes(preSub) ? preSub : null;
  // Un sous-thème appelé depuis l'extérieur ne peut venir que de l'examen :
  // l'écran doit le dire, plutôt que d'afficher « toutes banques » en tirant
  // dans une seule.
  let chosenSource = chosenSub ? 'examen' : null;
  let count = 20;

  const container = h('div', { class: 'stack' });

  function draw() {
    const a = avancementTheme(theme);
    const retenues = chosenSub ? pool({ theme, sub: chosenSub }) : poolTheme(theme, chosenSource);
    const available = retenues.length;
    const counts = COUNTS.filter((c) => c <= available);
    // Une banque peut n'offrir qu'une poignée de questions dans un thème —
    // quatre pour le récit dans « Vivre en société ». Sans ce repli, le
    // sélecteur n'aurait aucune option à montrer.
    if (!counts.length && available) counts.push(available);
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

      avancement(a),

      banques(a, retenues),

      // Les sous-thèmes ne découpent que la banque d'examen. Les proposer
      // quand on révise le livret ou le récit offrirait un filtre qui, une
      // fois appuyé, changerait la banque sous les pieds de l'utilisateur.
      subs.length > 1 && (chosenSource === null || chosenSource === 'examen')
        ? h('div', { class: 'stack stack--tight' }, [
          SectionHeader({ title: 'Sous-thème' }),
          h('div', { class: 'chips' }, [
            Chip({
              label: `Tout${chosenSource === 'examen' ? '' : ' le thème'} (${poolTheme(theme, chosenSource).length})`,
              pressed: chosenSub === null,
              onClick: () => { chosenSub = null; draw(); },
            }),
            ...subs.map((x) => Chip({
              label: `${SUBS[x] || x} (${pool({ theme, sub: x }).length})`,
              pressed: chosenSub === x,
              // Choisir un sous-thème, c'est choisir la banque d'examen : on
              // l'inscrit au-dessus au lieu de le laisser deviner.
              onClick: () => { chosenSub = x; chosenSource = 'examen'; draw(); },
            })),
          ]),
          chosenSource === null
            ? h('p', { class: 'hint', text: "Choisir un sous-thème restreint à la banque d'examen : le livret et le récit n'en portent pas." })
            : null,
        ])
        : null,

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

  /**
   * Le choix de la banque.
   *
   * « Je veux juste les questions de l'examen » n'avait aucun moyen de
   * s'exprimer : une séance de vingt questions tirait dans les trois banques,
   * et on retombait sur un récit déjà terminé ou sur un livret qu'on ne
   * voulait pas encore ouvrir. Le thème continue de tout compter — c'est ce
   * que mesurent les barres au-dessus —, mais s'entraîner et mesurer sont
   * deux gestes différents, et le premier se choisit.
   */
  function banques(a, retenues) {
    const vus = Object.fromEntries(a.par.map(([cle, b]) => [cle, b]));
    const dispo = SOURCES.filter((x) => vus[x]?.total);
    if (dispo.length < 2) return null;

    const neuves = retenues.filter((q) => !store.progressOf(q.id)).length;
    const nom = chosenSource ? SOURCE_APRES_DANS[chosenSource] : 'ce thème';
    const phrase = neuves
      ? `${neuves} question${neuves > 1 ? 's' : ''} jamais vue${neuves > 1 ? 's' : ''} dans ${nom} — la séance commence par celles-là.`
      : `Tout est déjà vu dans ${nom} : la séance repassera d'anciennes questions, les plus anciennes d'abord.`;

    return h('div', { class: 'stack stack--tight' }, [
      SectionHeader({ title: 'Banque de questions' }),
      h('div', { class: 'chips' }, [
        Chip({
          label: `Les trois (${a.total})`,
          pressed: chosenSource === null,
          onClick: () => { chosenSource = null; draw(); },
        }),
        ...dispo.map((x) => Chip({
          label: `${LIBELLE_SOURCE[x]} (${vus[x].total})`,
          pressed: chosenSource === x,
          // Changer de banque annule le sous-thème : il n'existe que dans
          // celle de l'examen, et le garder afficherait un filtre inerte.
          onClick: () => { chosenSource = x; if (x !== 'examen') chosenSub = null; draw(); },
        })),
      ]),
      h('p', { class: 'hint', text: phrase }),
    ]);
  }

  function start() {
    const cards = buildTraining({ mode: 'theme', theme, sub: chosenSub, source: chosenSource, count });
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
