/**
 * Écran de résultats, commun à l'examen blanc et aux séries d'entraînement.
 */

import { h, icon } from '../lib/dom.js';
import { duration, pct } from '../lib/util.js';
import { THEMES, EXAM } from '../data/programme.js';
import { BY_ID } from '../data/questions.js';

function ring(value, total) {
  const r = 54;
  const c = 2 * Math.PI * r;
  const ratio = total ? value / total : 0;
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 128 128');
  svg.setAttribute('class', 'ring');
  svg.innerHTML = `
    <circle class="ring__track" cx="64" cy="64" r="${r}" fill="none" stroke-width="11"/>
    <circle class="ring__value" cx="64" cy="64" r="${r}" fill="none" stroke-width="11" stroke-linecap="round"
            transform="rotate(-90 64 64)" stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - ratio)}"/>
    <text class="ring__label" x="64" y="56" text-anchor="middle" dominant-baseline="middle">${value}/${total}</text>
    <text class="ring__sub" x="64" y="93" text-anchor="middle">${pct(value, total)} %</text>`;
  return svg;
}

/**
 * @param {object} result   résultat produit par le composant de quiz
 * @param {object} options  { isExam, onRetry, onReviewErrors, actions }
 */
export function createResults(result, { isExam = false, onRetry, onReviewErrors, actions = [] } = {}) {
  const passed = isExam ? result.score >= EXAM.passing : pct(result.score, result.total) >= 80;
  const wrong = result.detail.filter((d) => !d.ok);

  const verdict = isExam
    ? (passed ? 'Examen réussi' : 'Examen non réussi')
    : (passed ? 'Très bonne série' : 'Série à retravailler');

  const detailLine = isExam
    ? `Seuil de réussite : ${EXAM.passing}/${EXAM.questions} · Temps : ${duration(result.durationSec)}${result.timedOut ? ' (temps écoulé)' : ''}`
    : `${result.score} bonne${result.score > 1 ? 's' : ''} réponse${result.score > 1 ? 's' : ''} sur ${result.total} · ${duration(result.durationSec)}`;

  const head = h('div', { class: `score ${passed ? '' : 'score--fail'}` }, [
    ring(result.score, result.total),
    h('p', { class: 'score__verdict', text: verdict }),
    h('p', { class: 'score__detail', text: detailLine }),
  ]);

  const themeRows = Object.entries(result.byTheme)
    .sort((a, b) => (a[1].ok / a[1].total) - (b[1].ok / b[1].total))
    .map(([key, v]) => {
      const p = pct(v.ok, v.total);
      const tone = p >= 80 ? 'ok' : p >= 50 ? 'warn' : 'bad';
      return h('div', { class: 'themestat__row' }, [
        h('div', { class: 'themestat__head' }, [
          h('span', { class: 'themestat__name', text: THEMES[key]?.short || key }),
          h('span', { class: 'themestat__val', text: `${v.ok}/${v.total}` }),
        ]),
        h('div', { class: 'bar' }, h('div', { class: `bar__fill bar__fill--${tone}`, style: `width:${p}%` })),
      ]);
    });

  const parts = [
    head,
    h('div', { class: 'card' }, [
      h('h3', { class: 'card__title', text: 'Résultat par thème' }),
      h('div', { class: 'themestat mt' }, themeRows),
    ]),
  ];

  if (wrong.length) {
    parts.push(h('div', { class: 'card' }, [
      h('h3', { class: 'card__title', text: `${wrong.length} question${wrong.length > 1 ? 's' : ''} à revoir` }),
      h('p', { class: 'card__sub', text: 'Relisez la bonne réponse et son explication : c\'est là que se joue la progression.' }),
      h('div', { class: 'stack stack--tight mt' }, wrong.map((d) => {
        const q = BY_ID.get(d.qid);
        if (!q) return null;
        return h('details', { class: 'card card--flat card--pad-sm' }, [
          h('summary', { style: 'cursor:pointer;font-weight:600;font-size:14.5px', text: q.scenario ? `${q.scenario} — ${q.q}` : q.q }),
          h('div', { class: 'mt small' }, [
            d.chosen ? h('p', { class: 'muted', html: `Votre réponse : <strong>${escapeHtml(d.chosen)}</strong>` }) : h('p', { class: 'muted', text: 'Aucune réponse donnée.' }),
            h('p', { style: 'margin-top:6px', html: `Bonne réponse : <strong>${escapeHtml(d.correct)}</strong>` }),
            h('p', { class: 'muted', style: 'margin-top:8px', text: q.why }),
          ]),
        ]);
      }).filter(Boolean)),
    ]));
  }

  const buttons = [];
  if (wrong.length && onReviewErrors) {
    buttons.push(h('button', {
      class: 'btn', type: 'button',
      onclick: () => onReviewErrors(wrong.map((d) => d.qid)),
    }, [icon('refresh'), h('span', { text: 'Revoir ces questions maintenant' })]));
  }
  if (onRetry) {
    buttons.push(h('button', {
      class: `btn ${wrong.length && onReviewErrors ? 'btn--ghost' : ''}`, type: 'button',
      onclick: onRetry,
    }, [icon('play'), h('span', { text: isExam ? 'Nouvel examen blanc' : 'Nouvelle série' })]));
  }
  buttons.push(...actions);

  parts.push(h('div', { class: 'stack stack--tight' }, buttons));
  return h('div', { class: 'stack' }, parts);
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
