/** Accueil : état de préparation et accès rapides. */

import { h, icon } from '../lib/dom.js';
import { daysBetween, plural } from '../lib/util.js';
import * as store from '../store.js';
import { readiness, overview, advice, romanOverview, nextUnread } from '../engine.js';
import { EXAM } from '../data/programme.js';

function ringLarge(value) {
  const r = 54;
  const c = 2 * Math.PI * r;
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 128 128');
  svg.setAttribute('class', 'ring');
  svg.innerHTML = `
    <circle class="ring__track" cx="64" cy="64" r="${r}" fill="none" stroke-width="11"/>
    <circle class="ring__value" cx="64" cy="64" r="${r}" fill="none" stroke-width="11" stroke-linecap="round"
            transform="rotate(-90 64 64)" stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - value / 100)}"/>
    <text class="ring__label" x="64" y="56" text-anchor="middle" dominant-baseline="middle">${value}%</text>
    <text class="ring__sub" x="64" y="93" text-anchor="middle">PRÊT</text>`;
  return svg;
}

function shortcut({ to, name, title, sub, badge }) {
  return h('a', { class: 'item', href: to }, [
    h('span', { class: 'item__icon' }, icon(name)),
    h('span', { class: 'item__body' }, [
      h('span', { class: 'item__title', text: title }),
      h('span', { class: 'item__sub', text: sub }),
    ]),
    badge ? h('span', { class: `badge badge--${badge.tone}`, text: badge.text }) : null,
    h('span', { class: 'item__chev' }, icon('chevron')),
  ]);
}

export default function renderHome() {
  const p = store.current();
  const o = overview();
  const r = readiness();
  const tip = advice();
  const days = p.goalDate ? daysBetween(Date.now(), new Date(p.goalDate).getTime()) : null;

  const hero = h('div', { class: 'hero' }, [
    h('div', { class: 'row row--between', style: 'align-items:flex-start' }, [
      h('div', { class: 'grow' }, [
        h('p', { class: 'hero__eyebrow', text: `Bonjour ${p.name}` }),
        h('h1', { class: 'hero__title', text: 'Votre préparation' }),
        h('p', {
          class: 'hero__sub',
          text: days === null
            ? `${o.seen} question${o.seen > 1 ? 's' : ''} vue${o.seen > 1 ? 's' : ''} sur ${o.bankSize}`
            : days > 0 ? `Examen dans ${days} ${plural(days, 'jour')}`
              : days === 0 ? "C'est aujourd'hui. Bon courage !"
                : `${o.seen} question${o.seen > 1 ? 's' : ''} vue${o.seen > 1 ? 's' : ''} sur ${o.bankSize}`,
        }),
      ]),
    ]),
    h('div', { style: 'margin-top:6px' }, ringLarge(r)),
  ]);

  const streakDays = store.streak();
  const kpis = h('div', { class: 'kpis' }, [
    h('div', { class: 'kpi' }, [
      h('div', { class: 'kpi__val', text: String(streakDays) }),
      h('div', { class: 'kpi__lab', text: `${plural(streakDays, 'jour')} d'affilée` }),
    ]),
    h('div', { class: 'kpi' }, [
      h('div', { class: 'kpi__val', text: o.accuracy === null ? '—' : `${o.accuracy}%` }),
      h('div', { class: 'kpi__lab', text: 'de bonnes réponses' }),
    ]),
    h('div', { class: 'kpi' }, [
      h('div', { class: 'kpi__val', text: o.last ? `${o.last.score}/${o.last.total}` : '—' }),
      h('div', { class: 'kpi__lab', text: 'dernier examen blanc' }),
    ]),
  ]);

  const roman = romanOverview();
  const suite = nextUnread();

  const shortcuts = h('div', { class: 'list' }, [
    shortcut({
      to: suite ? `#/histoire/c/${suite.key}` : '#/histoire',
      name: 'star', title: 'La France racontée',
      sub: suite
        ? (roman.lus === 0 ? `L'histoire du pays en ${roman.chapitres} chapitres — commencer` : `Chapitre ${suite.num} : ${suite.titre}`)
        : `${roman.chapitres} chapitres lus · mémorisation ${roman.mastery} %`,
      badge: roman.lus > 0 && suite ? { tone: 'brand', text: `${roman.lus}/${roman.chapitres}` } : null,
    }),
    shortcut({
      to: '#/examen', name: 'clock', title: 'Examen blanc',
      sub: `3 formats · ${EXAM.questions} questions · ${EXAM.minutes} min · seuil ${EXAM.passing}/${EXAM.questions}`,
    }),
    shortcut({
      to: '#/reviser/revision', name: 'refresh', title: 'Révision du jour',
      sub: o.due > 0 ? `${o.due} question${o.due > 1 ? 's' : ''} arrivée${o.due > 1 ? 's' : ''} à échéance` : 'Consolidez ce que vous avez déjà vu',
      badge: o.due > 0 ? { tone: 'warn', text: String(o.due) } : null,
    }),
    shortcut({
      to: '#/reviser', name: 'book', title: 'Entraînement par thème',
      sub: 'Choisissez un thème du programme officiel',
    }),
    o.weak > 0 ? shortcut({
      to: '#/reviser/erreurs', name: 'target', title: 'Mes erreurs',
      sub: `${o.weak} question${o.weak > 1 ? 's' : ''} encore fragile${o.weak > 1 ? 's' : ''}`,
      badge: { tone: 'bad', text: String(o.weak) },
    }) : null,
    shortcut({
      to: '#/livret', name: 'bank', title: 'Livret du citoyen',
      sub: 'Le document officiel, chapitre par chapitre',
    }),
    shortcut({
      to: '#/cours', name: 'flag', title: 'Fiches de révision',
      sub: 'Le programme résumé, thème par thème',
    }),
  ].filter(Boolean));

  return h('div', { class: 'stack' }, [
    hero,
    kpis,
    h('div', { class: `card card--pad-sm`, style: `border-left:3px solid var(--${tip.tone === 'ok' ? 'ok' : tip.tone === 'warn' ? 'warn' : 'brand'})` }, [
      h('p', { class: 'small', text: tip.text }),
    ]),
    h('p', { class: 'section-title', text: 'Continuer' }),
    shortcuts,
    o.exams > 0 ? h('a', { class: 'btn btn--quiet', href: '#/progres', text: `Voir mes ${o.exams} examen${o.exams > 1 ? 's' : ''} blanc${o.exams > 1 ? 's' : ''}` }) : null,
  ].filter(Boolean));
}
