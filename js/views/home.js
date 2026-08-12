/** Accueil : état de préparation, reprise en un geste, accès aux sections. */

import { h, icon, spot } from '../lib/dom.js';
import { daysBetween, plural } from '../lib/util.js';
import * as store from '../store.js';
import * as ai from '../ai.js';
import { readiness, overview, advice, themeStats, romanOverview, nextUnread, planRevision, compositionSeance, resteSeance } from '../engine.js';
import { niveau, badgesObtenus } from '../lib/xp.js';
import { EXAM, THEMES } from '../data/programme.js';

/** Anneau de progression. `size` en pixels, tracé sur une grille de 128. */
function ring(value, { size = 104, stroke = 10, label = null, sub = null } = {}) {
  const r = 54;
  const c = 2 * Math.PI * r;
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 128 128');
  svg.setAttribute('class', 'ring');
  svg.style.width = `${size}px`;
  svg.style.height = `${size}px`;
  svg.innerHTML = `
    <circle class="ring__track" cx="64" cy="64" r="${r}" fill="none" stroke-width="${stroke}"/>
    <circle class="ring__value" cx="64" cy="64" r="${r}" fill="none" stroke-width="${stroke}" stroke-linecap="round"
            transform="rotate(-90 64 64)" stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - value / 100)}"/>
    <text class="ring__label" x="64" y="${sub ? 58 : 64}" text-anchor="middle" dominant-baseline="middle">${label ?? `${value}%`}</text>
    ${sub ? `<text class="ring__sub" x="64" y="92" text-anchor="middle">${sub}</text>` : ''}`;
  return svg;
}

function shortcut({ to, name, title, sub, badge, tone }) {
  return h('a', { class: `item${tone ? ` item--${tone}` : ''}`, href: to }, [
    h('span', { class: 'item__icon' }, icon(name)),
    h('span', { class: 'item__body' }, [
      h('span', { class: 'item__title', text: title }),
      h('span', { class: 'item__sub', text: sub }),
    ]),
    badge ? h('span', { class: `badge badge--${badge.tone}`, text: badge.text }) : null,
    h('span', { class: 'item__chev' }, icon('chevron')),
  ]);
}

/** Ligne de thème : pastille, intitulé, barre et pourcentage. */
function themeRow(s) {
  const m = Math.round(s.mastery * 100);
  const tone = m >= 70 ? 'ok' : m >= 35 ? 'warn' : 'bad';
  return h('a', { class: 'trow', href: `#/reviser/t/${s.key}` }, [
    h('span', { class: `trow__icon trow__icon--${s.key}` }, icon(THEMES[s.key].icon)),
    h('span', { class: 'trow__body' }, [
      h('span', { class: 'trow__title', text: s.label }),
      h('span', { class: 'trow__sub', text: `${s.seen}/${s.total} questions vues` }),
      h('span', { class: 'bar bar--thin' }, h('span', { class: `bar__fill bar__fill--${tone}`, style: `width:${m}%` })),
    ]),
    h('span', { class: 'trow__pct', text: `${m}%` }),
  ]);
}

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

  /* ------------------------------------------------------------- salutation */

  const heure = new Date().getHours();
  const salut = heure < 18 ? 'Bonjour' : 'Bonsoir';

  const tete = h('div', { class: 'greet' }, [
    h('div', { class: 'grow' }, [
      // Aucun émoji : le système l'écrit noir sur blanc, et il a raison ici —
      // l'application prépare un entretien d'État, pas une messagerie.
      h('p', { class: 'greet__hello', text: `${salut} ${p.name}` }),
      h('p', {
        class: 'greet__line',
        text: days === null ? "Prêt à continuer votre préparation ?"
          : days > 0 ? `Examen dans ${days} ${plural(days, 'jour')}.`
            : days === 0 ? "C'est aujourd'hui. Bon courage !"
              : "Prêt à continuer votre préparation ?",
      }),
    ]),
    streakDays > 0 ? h('span', { class: 'streak' }, [icon('fire'), h('span', { text: String(streakDays) })]) : null,
  ].filter(Boolean));

  /* ------------------------------------------------------- niveau du moment */

  const niv = niveau();
  const gagnes = badgesObtenus().length;

  const parcours = h('a', { class: 'item', href: '#/parcours' }, [
    h('span', { class: 'item__icon item__icon--brand' }, icon('award')),
    h('span', { class: 'item__body' }, [
      h('span', { class: 'item__title', text: `Niveau ${niv.rang} — ${niv.nom}` }),
      h('span', { class: 'item__sub', text: `${niv.xp.toLocaleString('fr-FR')} points · ${gagnes} badge${gagnes > 1 ? 's' : ''}` }),
      h('span', { class: 'bar bar--thin', style: 'margin-top:7px' },
        h('span', { class: 'bar__fill', style: `width:${niv.pct}%` })),
    ]),
    h('span', { class: 'item__chev' }, icon('chevron')),
  ]);

  /* ------------------------------------------------------ carte progression */

  const progression = h('div', { class: 'card' }, [
    h('p', { class: 'section-title', style: 'margin:0 0 12px', text: 'Ma progression' }),
    h('div', { class: 'progrow' }, [
      ring(r, { size: 104, label: `${r}%` }),
      h('div', { class: 'progrow__stats' }, [
        h('div', { class: 'ministat' }, [
          h('div', { class: 'ministat__val', text: `${o.seen}` }),
          h('div', { class: 'ministat__lab', text: `question${o.seen > 1 ? 's' : ''} sur ${o.bankSize}` }),
        ]),
        h('div', { class: 'ministat' }, [
          h('div', { class: 'ministat__val', text: o.accuracy === null ? '—' : `${o.accuracy}%` }),
          h('div', { class: 'ministat__lab', text: 'de bonnes réponses' }),
        ]),
        h('div', { class: 'ministat' }, [
          h('div', { class: 'ministat__val', text: o.last ? `${o.last.score}/${o.last.total}` : '—' }),
          h('div', { class: 'ministat__lab', text: 'dernier examen blanc' }),
        ]),
      ]),
    ]),
    // Le nombre affiché est celui de la SÉANCE : c'est ce à quoi on va
    // répondre en appuyant, ni plus ni moins. Ce qu'il restera à revoir
    // ensuite est écrit en dessous, jamais confondu avec lui.
    h('a', {
      class: 'btn', style: 'margin-top:14px',
      href: '#/reviser/revision',
    }, [icon('play'), h('span', { text: plan.total > 0 ? `Réviser ${plan.total} question${plan.total > 1 ? 's' : ''}` : 'Commencer à réviser' })]),
    plan.total > 0 ? h('p', { class: 'hint center', style: 'margin-top:8px', text: compositionSeance(plan) }) : null,
    resteSeance(plan) ? h('p', { class: 'hint center', style: 'margin-top:3px', text: resteSeance(plan) }) : null,
  ].filter(Boolean));

  /* ------------------------------------------------------------ le conseil */

  const conseil = h('div', { class: `advice advice--${tip.tone}` }, [
    h('span', { class: 'advice__icon' }, icon(tip.tone === 'ok' ? 'check' : tip.tone === 'warn' ? 'warn' : 'info')),
    h('p', { class: 'small', text: tip.text }),
  ]);

  /* ------------------------------------------------------- carte du récit */

  const recit = h('a', { class: 'card card--spot card--link', href: suite ? `#/histoire/c/${suite.key}` : '#/histoire' }, [
    spot('histoire'),
    h('p', { class: 'card__eyebrow', text: 'La France racontée' }),
    h('h2', { class: 'card__title', style: 'font-size:17px;margin-top:3px', text: suite ? suite.titre : 'Récit terminé' }),
    h('p', { class: 'card__sub', text: suite ? `Chapitre ${suite.num} · ${suite.minutes} min de lecture` : `${roman.chapitres} chapitres lus` }),
    h('div', { class: 'bar bar--thin', style: 'margin-top:11px;max-width:62%' },
      h('span', { class: 'bar__fill bar__fill--story', style: `width:${Math.round((roman.lus / roman.chapitres) * 100)}%` })),
    h('p', { class: 'card__sub', style: 'margin-top:6px', text: `${roman.lus}/${roman.chapitres} chapitres` }),
  ]);

  /* -------------------------------------------------------- carte examen */

  const examen = h('a', { class: 'card card--spot card--link', href: '#/examen' }, [
    spot('examen'),
    h('p', { class: 'card__eyebrow', text: 'Examen blanc' }),
    h('h2', { class: 'card__title', style: 'font-size:17px;margin-top:3px', text: 'Se mettre en conditions réelles' }),
    h('p', { class: 'card__sub', text: `${EXAM.questions} questions · ${EXAM.minutes} min · seuil ${EXAM.passing}/${EXAM.questions}` }),
    h('p', { class: 'card__sub', style: 'margin-top:8px', text: o.exams > 0 ? `${o.exams} passé${o.exams > 1 ? 's' : ''} · meilleur ${o.best}/${EXAM.questions}` : '3 formats disponibles' }),
  ]);

  /* ------------------------------------------------------------- raccourcis */

  const raccourcis = h('div', { class: 'list' }, [
    o.weak > 0 ? shortcut({
      to: '#/reviser/erreurs', name: 'target', title: 'Mes erreurs',
      sub: `${o.weak} question${o.weak > 1 ? 's' : ''} encore fragile${o.weak > 1 ? 's' : ''}`,
      badge: { tone: 'bad', text: String(o.weak) },
    }) : null,
    shortcut({
      to: '#/livret', name: 'bank', title: 'Livret du citoyen', tone: 'livret',
      sub: 'Le document officiel, chapitre par chapitre',
    }),
    shortcut({
      to: '#/cours', name: 'flag', title: 'Fiches de révision', tone: 'revise',
      sub: 'Le programme résumé, thème par thème',
    }),
    shortcut({
      to: '#/assistant', name: 'info', title: 'Poser une question', tone: 'ai',
      sub: ai.isConfigured() ? "Demander une explication à l'assistant" : 'Assistant IA — facultatif, à activer',
    }),
  ].filter(Boolean));

  /* ------------------------------------------------------------------ rendu */

  return h('div', { class: 'stack' }, [
    tete,
    progression,
    parcours,
    conseil,
    h('div', { class: 'row row--between' }, [
      h('p', { class: 'section-title', style: 'margin:0', text: 'Mes thèmes' }),
      h('a', { class: 'linkbtn', href: '#/reviser', text: 'Voir tout' }),
    ]),
    h('div', { class: 'card card--pad-sm' }, h('div', { class: 'trows' },
      stats.slice().sort((a, b) => a.mastery - b.mastery).slice(0, 5).map(themeRow))),
    h('p', { class: 'section-title', style: 'margin:2px 0 0', text: 'Continuer' }),
    recit,
    examen,
    raccourcis,
  ]);
}
