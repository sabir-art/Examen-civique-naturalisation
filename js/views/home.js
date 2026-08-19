/**
 * Accueil : état de préparation, reprise en un geste, accès aux sections.
 *
 * Composé avec les composants du système de design, dans l'ordre de son écran
 * `HomeScreen` : bandeau pastel avec une carte encre imbriquée, carte de
 * progression, liste de thèmes, bloc d'entretien blanc. S'y ajoute ce que le
 * système ne connaît pas — le récit, le livret, l'assistant — construit avec
 * les mêmes composants.
 */

import { h, spot } from '../lib/dom.js';
import { daysBetween, plural, formatDate } from '../lib/util.js';
import * as store from '../store.js';
import * as ai from '../ai.js';
import {
  readiness, overview, advice, themeStats, romanOverview, nextUnread,
  planRevision, compositionSeance, resteSeance,
} from '../engine.js';
import { niveau, badgesObtenus } from '../lib/xp.js';
import { EXAM, THEMES } from '../data/programme.js';
import { PUBLICATION } from '../data/build.js';
import {
  Card, Button, Chip, Badge, IconTile, SectionHeader, Icon,
  ProgressBar, StatTile, ThemeCard, LessonRow, ResultBanner,
} from '../ds/index.js';

/** Pastel de chaque thème du programme, fixé une fois pour toutes. */
const SUJET = {
  'principes-valeurs': 'valeurs',
  institutions: 'institutions',
  'droits-devoirs': 'societe',
  'histoire-geo-culture': 'histoire',
  'vivre-societe': 'symboles',
};

export default function renderHome() {
  const p = store.current();
  const o = overview();
  const r = readiness();
  const tip = advice();
  const stats = themeStats();
  const roman = romanOverview();
  const suite = nextUnread();
  const plan = planRevision(20);
  const days = p.goalDate ? daysBetween(Date.now(), new Date(p.goalDate).getTime()) : null;
  const streakDays = store.streak();

  /* ------------------------------------------------------------- bandeau */

  /*
   * La composition du système : un aplat lavande, un titre court, et à
   * l'intérieur une carte encre — la seule tache noire de l'écran, donc la
   * seule chose à faire ensuite. Les pastels ne s'empilent pas : dans le
   * lavande, il n'y a que de l'encre et du blanc.
   */
  // Des chiffres concrets, jamais « quelques » : c'est une règle de contenu du
  // système. Sans date d'examen, on rappelle le seuil à atteindre plutôt que
  // de répéter la question du titre.
  const echeance = days > 0 ? `Examen dans ${days} ${plural(days, 'jour')}.`
    : days === 0 ? "C'est aujourd'hui. Bon courage."
      : `Seuil de réussite : ${EXAM.passing}/${EXAM.questions}.`;

  const bandeau = Card({
    surface: 'lavender',
    radius: 'hero',
    padding: 'lg',
    className: 'accueil__hero',
    children: [
      h('div', { class: 'accueil__herohead' }, [
        h('div', {}, [
          h('h1', { class: 'accueil__titre', text: "Prêt pour l'examen ?" }),
          h('p', { class: 'accueil__sub', text: echeance }),
        ]),
        IconTile({ icon: 'graduation-cap', tone: 'white', size: 44 }),
      ]),
      Card({
        surface: 'ink',
        radius: 'inner',
        padding: 'md',
        href: '#/reviser/revision',
        className: 'accueil__seance',
        children: [
          h('div', { class: 'accueil__seancetxt' }, [
            h('div', {
              class: 'accueil__seancetitre',
              text: plan.total > 0 ? `Réviser ${plan.total} question${plan.total > 1 ? 's' : ''}` : 'Commencer à réviser',
            }),
            h('div', {
              class: 'accueil__seancemeta',
              text: plan.total > 0 ? compositionSeance(plan) : 'Découvrir les premières questions',
            }),
          ]),
          h('span', { class: 'accueil__go' }, Icon({ name: 'play', size: 18 })),
        ],
      }),
      resteSeance(plan) ? h('p', { class: 'accueil__reste', text: resteSeance(plan) }) : null,
    ].filter(Boolean),
  });

  /* --------------------------------------------------------- progression */

  const progression = h('div', { class: 'stack stack--tight' }, [
    SectionHeader({ title: 'Ma progression', action: 'Détails', href: '#/progres' }),
    Card({
      surface: 'white',
      elevation: 'xs',
      className: 'accueil__prog',
      children: [
        // La composition exacte de l'écran d'accueil du système : une ligne
        // « intitulé / valeur », la barre, puis les puces de détail.
        h('div', { class: 'accueil__progline' }, [
          h('span', { class: 'accueil__proglabel', text: 'Programme officiel' }),
          h('span', { class: 'accueil__progval', text: `${r} %` }),
        ]),
        ProgressBar({ value: r, height: 10 }),
        h('div', { class: 'accueil__chips' }, [
          Chip({ tone: 'mint', icon: 'check', size: 'sm', label: `${o.mastered} acquises` }),
          o.weak > 0 ? Chip({ tone: 'butter', icon: 'refresh-cw', size: 'sm', label: `${o.weak} à revoir` }) : null,
          Chip({ tone: 'outline', size: 'sm', label: `${o.bankSize - o.seen} restantes` }),
        ].filter(Boolean)),
      ],
    }),
  ]);

  /* -------------------------------------------------- les trois chiffres */

  /*
   * Trois `StatTile` : le composant que le système donne pour « un chiffre et
   * son intitulé ». Ils remplacent l'anneau, qui vit désormais sur l'écran de
   * progression — c'est là que le système le place.
   */
  const chiffres = h('div', { class: 'accueil__tiles' }, [
    StatTile({ value: o.seen, unit: `/${o.bankSize}`, label: 'questions vues', surface: 'white' }),
    StatTile({ value: o.accuracy === null ? '—' : o.accuracy, unit: o.accuracy === null ? null : '%', label: 'de bonnes réponses', surface: 'white' }),
    StatTile({ value: o.last ? o.last.score : '—', unit: o.last ? `/${EXAM.questions}` : null, label: 'dernier examen blanc', surface: 'white' }),
  ]);

  /* -------------------------------------------------------------- niveau */

  const niv = niveau();
  const gagnes = badgesObtenus().length;

  const parcours = LessonRow({
    icon: 'award',
    title: `Niveau ${niv.rang} — ${niv.nom}`,
    meta: `${niv.xp.toLocaleString('fr-FR')} points · ${gagnes} badge${gagnes > 1 ? 's' : ''}`,
    href: '#/parcours',
    trailing: Icon({ name: 'chevron-right', size: 18, className: 'ds-lesson__chev' }),
  });

  /* ------------------------------------------------------------ conseil */

  const conseil = ResultBanner({
    tone: tip.tone === 'ok' ? 'correct' : tip.tone === 'warn' ? 'warning' : 'info',
    text: tip.text,
  });

  /* -------------------------------------------------------------- thèmes */

  const themes = h('div', { class: 'stack stack--tight' }, [
    SectionHeader({ title: 'Mes thèmes', action: 'Tout voir', href: '#/reviser' }),
    h('div', { class: 'list' }, stats
      .slice()
      .sort((a, b) => a.mastery - b.mastery)
      .slice(0, 4)
      .map((s) => ThemeCard({
        title: s.label,
        topic: SUJET[s.key] || 'histoire',
        icon: THEMES[s.key].icon,
        progress: Math.round(s.mastery * 100),
        meta: `${s.seen}/${s.total} questions vues`,
        href: `#/reviser/t/${s.key}`,
      }))),
  ]);

  /* ------------------------------------------------------------- récit */

  const recit = Card({
    surface: 'white',
    elevation: 'xs',
    href: suite ? `#/histoire/c/${suite.key}` : '#/histoire',
    className: 'card--spot',
    children: [
      spot('histoire'),
      h('p', { class: 'card__eyebrow', text: 'La France racontée' }),
      h('h2', { class: 'card__title accueil__recittitre', text: suite ? suite.titre : 'Récit terminé' }),
      h('p', { class: 'card__sub', text: suite ? `Chapitre ${suite.num} · ${suite.minutes} min de lecture` : `${roman.chapitres} chapitres lus` }),
      h('div', { class: 'accueil__recitbar' },
        ProgressBar({ value: Math.round((roman.lus / roman.chapitres) * 100), height: 6 })),
      h('p', { class: 'card__sub', style: 'margin-top:6px', text: `${roman.lus}/${roman.chapitres} chapitres` }),
    ],
  });

  /* ------------------------------------------------------- examen blanc */

  const examen = Card({
    surface: 'butter',
    radius: 'hero',
    padding: 'lg',
    className: 'accueil__examen',
    children: [
      h('div', { class: 'accueil__examenhead' }, [
        IconTile({ icon: 'timer', tone: 'white', size: 40 }),
        h('div', { class: 'grow' }, [
          h('div', { class: 'accueil__examentitre', text: "Se mettre en conditions réelles" }),
          h('div', {
            class: 'accueil__examensub',
            text: `${EXAM.questions} questions · ${EXAM.minutes} min · seuil ${EXAM.passing}/${EXAM.questions}.`,
          }),
        ]),
      ]),
      Button({
        variant: 'secondary',
        size: 'lg',
        fullWidth: true,
        href: '#/examen',
        iconRight: 'chevron-right',
        // Libellé court : le système demande quatre mots au plus sur un
        // bouton, et à 320px de large un intitulé long élargit sa carte.
        label: o.exams > 0 ? 'Repasser un examen' : 'Lancer un examen',
      }),
      o.exams > 0
        ? h('p', { class: 'accueil__examenmeta', text: `${o.exams} passé${o.exams > 1 ? 's' : ''} · meilleur ${o.best}/${EXAM.questions}` })
        : null,
    ].filter(Boolean),
  });

  /* --------------------------------------------------------- raccourcis */

  const raccourcis = h('div', { class: 'list' }, [
    o.weak > 0 ? LessonRow({
      icon: 'target',
      title: 'Mes erreurs',
      meta: `${o.weak} question${o.weak > 1 ? 's' : ''} encore fragile${o.weak > 1 ? 's' : ''}`,
      href: '#/reviser/erreurs',
      trailing: Badge({ tone: 'wrong', label: String(o.weak) }),
    }) : null,
    LessonRow({
      icon: 'landmark',
      title: 'Livret du citoyen',
      meta: 'Le document officiel, chapitre par chapitre',
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
      icon: 'sparkles',
      title: 'Poser une question',
      meta: ai.isConfigured() ? "Demander une explication à l'assistant" : 'Assistant IA — facultatif, à activer',
      href: '#/assistant',
      trailing: Icon({ name: 'chevron-right', size: 18, className: 'ds-lesson__chev' }),
    }),
  ].filter(Boolean));

  /* ------------------------------------------------------------------ rendu */

  return h('div', { class: 'stack' }, [
    streakDays > 0 ? h('div', { class: 'accueil__serie' },
      Chip({ tone: 'butter', icon: 'flame', label: `Série de ${streakDays} jour${streakDays > 1 ? 's' : ''}` })) : null,
    bandeau,
    progression,
    chiffres,
    parcours,
    conseil,
    themes,
    h('p', { class: 'section-title', text: 'Continuer' }),
    recit,
    examen,
    raccourcis,
    // Un contenu qui suit un programme officiel doit dire de quand il date,
    // sans qu'on ait à le chercher. La ligne est discrète et mène au détail.
    h('a', {
      class: 'pied', href: '#/compte/nouveautes',
      text: `Application mise à jour le ${formatDate(PUBLICATION.date)} — voir les nouveautés`,
    }),
  ].filter(Boolean));
}
