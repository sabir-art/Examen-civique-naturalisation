/**
 * Écran de résultats, commun à l'examen blanc et aux séries d'entraînement.
 */

import { h, icon } from '../lib/dom.js';
import * as fx from '../lib/feedback.js';
import { duration, pct } from '../lib/util.js';
import { THEMES, EXAM } from '../data/programme.js';
import { BY_ID } from '../data/questions.js';
import { LIVRET_BY_ID } from '../data/q-livret.js';
import { CHAPITRE_BY_KEY, PARTIE_BY_KEY } from '../data/livret.js';
import { ROMAN_BY_ID, CHAPITRE_BY_KEY as ROMAN_BY_KEY, ACTE_BY_KEY } from '../data/roman.js';

/** Libellé d'un groupe de résultats : thème d'examen, partie du livret, chapitre du récit. */
const groupLabel = (key) =>
  THEMES[key]?.short
  || PARTIE_BY_KEY.get(key)?.title
  || CHAPITRE_BY_KEY.get(key)?.title
  || ROMAN_BY_KEY.get(key)?.titre
  || ACTE_BY_KEY.get(key)?.titre
  || key;

const findQuestion = (id) => BY_ID.get(id) || LIVRET_BY_ID.get(id) || ROMAN_BY_ID.get(id) || null;

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
 * Confettis d'une réussite. Purement décoratif, donc masqué aux lecteurs
 * d'écran et désactivé quand l'utilisateur limite les animations.
 */
function confettis() {
  const colors = ['#ffd166', '#ef476f', '#06d6a0', '#118ab2', '#f4f4f4'];
  const wrap = h('div', { class: 'confetti', 'aria-hidden': 'true' });
  for (let i = 0; i < 26; i++) {
    const left = (i * 37 + (i % 5) * 11) % 100;
    const delay = ((i % 7) * 90) / 1000;
    wrap.append(h('i', {
      style: `left:${left}%;background:${colors[i % colors.length]};animation-delay:${delay}s;`
        + `transform:rotate(${(i * 53) % 360}deg)`,
    }));
  }
  return wrap;
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

  // Le verdict s'annonce aussi à l'oreille.
  (passed ? fx.reussite : fx.echec)();

  const head = h('div', { class: `score ${passed ? '' : 'score--fail'}` }, [
    passed ? confettis() : null,
    ring(result.score, result.total),
    h('p', { class: 'score__verdict', text: verdict }),
    h('p', { class: 'score__detail', text: detailLine }),
    h('div', { class: 'scorestats' }, [
      { v: result.score, l: `bonne${result.score > 1 ? 's' : ''} réponse${result.score > 1 ? 's' : ''}` },
      { v: result.total - result.score, l: 'erreur' + (result.total - result.score > 1 ? 's' : '') },
      { v: duration(result.durationSec), l: 'temps total' },
    ].map((s) => h('div', { class: 'scorestat' }, [
      h('div', { class: 'scorestat__val', text: String(s.v) }),
      h('div', { class: 'scorestat__lab', text: s.l }),
    ]))),
  ].filter(Boolean));

  const themeRows = Object.entries(result.byTheme)
    .sort((a, b) => (a[1].ok / a[1].total) - (b[1].ok / b[1].total))
    .map(([key, v]) => {
      const p = pct(v.ok, v.total);
      const tone = p >= 80 ? 'ok' : p >= 50 ? 'warn' : 'bad';
      return h('div', { class: 'themestat__row' }, [
        h('div', { class: 'themestat__head' }, [
          h('span', { class: 'themestat__name', text: groupLabel(key) }),
          h('span', { class: 'themestat__val', text: `${v.ok}/${v.total}` }),
        ]),
        h('div', { class: 'bar' }, h('div', { class: `bar__fill bar__fill--${tone}`, style: `width:${p}%` })),
      ]);
    });

  const parts = [
    head,
    h('div', { class: 'card' }, [
      h('h3', { class: 'card__title', text: isExam ? 'Résultat par thème' : 'Résultat par partie' }),
      h('div', { class: 'themestat mt' }, themeRows),
    ]),
  ];

  if (wrong.length) {
    parts.push(h('div', { class: 'card' }, [
      h('h3', { class: 'card__title', text: `${wrong.length} question${wrong.length > 1 ? 's' : ''} à revoir` }),
      h('p', { class: 'card__sub', text: 'Relisez la bonne réponse et son explication : c\'est là que se joue la progression.' }),
      h('div', { class: 'stack stack--tight mt' }, wrong.map((d, i) => {
        const q = findQuestion(d.qid);
        if (!q) return null;
        return h('details', { class: 'correc' }, [
          h('summary', { class: 'correc__q' }, [
            h('span', { class: 'correc__num', text: String(i + 1) }),
            h('span', { text: q.scenario ? `${q.scenario} — ${q.q}` : q.q }),
          ]),
          h('div', { class: 'correc__body' }, [
            h('p', { class: 'correc__label', text: 'Votre réponse' }),
            h('div', { class: 'answerbox answerbox--bad' }, [
              icon('cross'),
              h('span', { text: d.chosen ?? 'Aucune réponse donnée' }),
            ]),
            h('p', { class: 'correc__label', text: 'Bonne réponse' }),
            h('div', { class: 'answerbox answerbox--ok' }, [
              icon('check'),
              h('span', { text: d.correct }),
            ]),
            h('p', { class: 'correc__label', text: 'Explication' }),
            h('p', { class: 'small muted', text: q.why }),
            h('a', {
              class: 'linkbtn', style: 'display:inline-block;margin-top:12px',
              href: `#/assistant/q/${encodeURIComponent(d.qid)}`,
              text: 'Faire expliquer autrement →',
            }),
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
