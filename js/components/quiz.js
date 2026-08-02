/**
 * Composant de questionnaire, utilisé par l'entraînement et l'examen blanc.
 *
 * Deux comportements :
 *  - `immediate: true`  → correction et explication après chaque réponse ;
 *  - `immediate: false` → conditions d'examen, correction à la fin, chronomètre.
 */

import { h, icon, confirmDialog } from '../lib/dom.js';
import { clock, pct } from '../lib/util.js';
import { THEMES, SUBS } from '../data/programme.js';
import { createApprofondir } from './approfondir.js';
import * as fx from '../lib/feedback.js';
import * as store from '../store.js';

const LETTERS = ['A', 'B', 'C', 'D', 'E'];

export function createQuiz({
  cards,
  immediate = true,
  timeLimitSec = null,
  onFinish,
  onQuit = null,
  label = 'Entraînement',
}) {
  const root = h('div', { class: 'quiz' });
  const startedAt = Date.now();
  const answers = new Array(cards.length).fill(null); // index choisi
  let index = 0;
  let revealed = false;
  let finished = false;
  let remaining = timeLimitSec;
  let ticker = null;

  /* --------------------------------------------------------- chronomètre */

  const timerEl = h('span', { class: 'timer' }, [icon('clock'), h('span', { text: timeLimitSec ? clock(timeLimitSec) : '' })]);

  function startTimer() {
    if (!timeLimitSec) return;
    ticker = setInterval(() => {
      remaining -= 1;
      timerEl.lastChild.textContent = clock(remaining);
      timerEl.classList.toggle('timer--low', remaining <= 300);
      if (remaining <= 0) finish(true);
    }, 1000);
  }

  function stopTimer() { if (ticker) clearInterval(ticker); ticker = null; }

  /* ------------------------------------------------------------- rendu */

  const barFill = h('div', { class: 'bar__fill' });
  const countEl = h('span', { class: 'quizbar__count' });
  const header = h('div', { class: 'quizbar' }, [
    h('div', { class: 'quizbar__row' }, [
      countEl,
      timeLimitSec ? timerEl : h('span', { class: 'badge badge--brand', text: label }),
    ]),
    h('div', { class: 'bar' }, barFill),
  ]);

  const body = h('div', { class: 'quizbody' });
  const foot = h('div', { class: `quizfoot ${timeLimitSec ? 'quizfoot--nobar' : ''}` });
  root.append(header, body, foot);

  function draw() {
    const card = cards[index];
    const q = card.q;
    const chosen = answers[index];

    countEl.textContent = `Question ${index + 1} sur ${cards.length}`;
    barFill.style.width = `${pct(index + (revealed || chosen !== null ? 1 : 0), cards.length)}%`;

    const labels = card.tags || [
      { text: THEMES[q.theme]?.short || 'Question', tone: 'brand' },
      { text: q.type === 'situation' ? 'Mise en situation' : (SUBS[q.sub] || 'Connaissances'), tone: null },
    ];
    const tags = h('div', { class: 'qtag' }, labels.map((t) => h('span', {
      class: `badge${t.tone ? ` badge--${t.tone}` : ''}`, text: t.text,
    })));

    const choices = h('div', { class: 'choices' }, card.choices.map((text, i) => {
      const isChosen = chosen === i;
      const btn = h('button', {
        class: 'choice',
        type: 'button',
        'aria-pressed': isChosen ? 'true' : 'false',
        disabled: revealed,
        onclick: () => pick(i),
      }, [
        // Pastille ronde façon bouton radio : on voit d'un coup d'œil ce qui
        // est coché, et la lettre reste pour repérer la réponse à l'oral.
        h('span', { class: 'choice__key' }, [
          h('span', { class: 'choice__letter', text: LETTERS[i] }),
          h('span', { class: 'choice__mark' }, icon('check')),
        ]),
        h('span', { class: 'choice__text', text }),
      ]);
      if (revealed) {
        if (i === card.correct) btn.classList.add('is-correct');
        else if (isChosen) btn.classList.add('is-wrong');
        else btn.classList.add('is-dim');
      }
      return btn;
    }));

    const parts = [
      tags,
      q.scenario ? h('p', { class: 'qscenario', text: q.scenario }) : null,
      h('h2', { class: 'qtext', text: q.q }),
      choices,
    ];

    if (revealed) {
      const ok = chosen === card.correct;
      parts.push(h('div', { class: `feedback feedback--${ok ? 'ok' : 'bad'}` }, [
        h('div', { class: 'feedback__head' }, [
          icon(ok ? 'check' : 'cross'),
          h('span', { text: ok ? 'Bonne réponse' : (chosen === null ? 'Sans réponse' : 'Réponse incorrecte') }),
        ]),
        h('p', { class: 'feedback__body', text: q.why }),
      ]));
      // Approfondir : disponible que la réponse ait été juste ou fausse.
      deepen = createApprofondir(q, chosen === null ? null : card.choices[chosen]);
      parts.push(deepen);
    }

    body.replaceChildren(...parts.filter(Boolean));
    // Pendant qu'on choisit, la barre d'action reste collée en bas : « Valider »
    // doit toujours être sous le pouce. Dès que la correction s'affiche, elle
    // redescend dans le flux, sinon elle tranche l'explication en deux.
    root.classList.toggle('is-revealed', revealed);
    drawFoot();
  }

  /** Panneau d'approfondissement de la question affichée, s'il est ouvert. */
  let deepen = null;
  function closeDeepen() {
    if (deepen) { deepen.stop?.(); deepen = null; }
  }

  function drawFoot() {
    const chosen = answers[index];
    const last = index === cards.length - 1;
    const buttons = [];

    if (immediate && !revealed) {
      buttons.push(h('button', {
        class: 'btn', type: 'button', disabled: chosen === null,
        text: 'Valider', onclick: () => reveal(),
      }));
    } else {
      buttons.push(h('button', {
        class: `btn ${last ? 'btn--accent' : ''}`,
        type: 'button',
        disabled: !immediate && chosen === null,
        text: last ? 'Terminer' : 'Question suivante',
        onclick: () => next(),
      }));
    }

    if (!immediate && !last) {
      buttons.push(h('button', {
        class: 'btn btn--quiet', type: 'button',
        text: 'Passer cette question', onclick: () => next(),
      }));
    }

    foot.replaceChildren(h('div', { class: 'stack stack--tight' }, buttons));
  }

  /* ------------------------------------------------------------ actions */

  function pick(i) {
    if (revealed) return;
    if (answers[index] !== i) fx.tap();
    answers[index] = i;
    if (immediate) { draw(); return; }
    // En conditions d'examen, la réponse est enregistrée et l'on passe à la suite.
    draw();
  }

  function reveal() {
    revealed = true;
    const juste = answers[index] === cards[index].correct;
    store.recordAnswer(cards[index].id, juste);
    if (juste) fx.bonneReponse(); else fx.mauvaiseReponse();
    draw();
  }

  function next() {
    closeDeepen();
    if (!immediate) {
      store.recordAnswer(cards[index].id, answers[index] === cards[index].correct);
    }
    if (index === cards.length - 1) { finish(false); return; }
    index += 1;
    revealed = false;
    draw();
    root.scrollIntoView({ block: 'start', behavior: 'instant' });
    window.scrollTo(0, 0);
  }

  function finish(byTimeout) {
    if (finished) return;
    finished = true;
    stopTimer();
    closeDeepen();

    // Temps écoulé : les questions non atteintes comptent comme fausses. Celles
    // qui précèdent ont déjà été enregistrées au fil de la série.
    if (byTimeout) {
      for (let i = index; i < cards.length; i++) {
        if (i === index && revealed) continue;
        store.recordAnswer(cards[i].id, answers[i] === cards[i].correct);
      }
    }

    const detail = cards.map((c, i) => ({
      qid: c.id,
      theme: c.group || c.q.theme,
      ok: answers[i] === c.correct,
      chosen: answers[i] === null ? null : c.choices[answers[i]],
      correct: c.choices[c.correct],
    }));
    const score = detail.filter((d) => d.ok).length;

    const byTheme = {};
    for (const d of detail) {
      byTheme[d.theme] = byTheme[d.theme] || { ok: 0, total: 0 };
      byTheme[d.theme].total += 1;
      if (d.ok) byTheme[d.theme].ok += 1;
    }

    onFinish({
      score,
      total: cards.length,
      durationSec: Math.round((Date.now() - startedAt) / 1000),
      timedOut: Boolean(byTimeout),
      byTheme,
      detail,
      date: Date.now(),
    });
  }

  /** Confirmation avant d'abandonner une série en cours. */
  root.confirmLeave = async () => {
    if (finished) return true;
    const answered = answers.filter((a) => a !== null).length;
    if (answered === 0) { stopTimer(); return true; }
    const ok = await confirmDialog({
      title: 'Quitter la série ?',
      text: `Vous avez répondu à ${answered} question${answered > 1 ? 's' : ''}. Vos réponses déjà validées sont conservées, mais la série ne sera pas terminée.`,
      confirmLabel: 'Quitter',
      danger: true,
    });
    if (ok) { stopTimer(); if (onQuit) onQuit(); }
    return ok;
  };

  root.stop = () => { stopTimer(); closeDeepen(); };

  draw();
  startTimer();
  return root;
}
