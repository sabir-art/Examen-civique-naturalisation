/**
 * Composant de questionnaire, utilisé par l'entraînement et l'examen blanc.
 *
 * Deux comportements :
 *  - `immediate: true`  → correction et explication après chaque réponse ;
 *  - `immediate: false` → conditions d'examen, correction à la fin, chronomètre.
 */

import { h, icon, confirmDialog } from '../lib/dom.js';
import { QuestionCard, AnswerOption, ResultBanner } from '../ds/learning.js';
import { Button, Badge, Chip, ProgressBar } from '../ds/index.js';
import { clock, pct } from '../lib/util.js';
import { THEMES, SUBS } from '../data/programme.js';
import { createApprofondir } from './approfondir.js';
import * as fx from '../lib/feedback.js';
import * as store from '../store.js';

const LETTERS = ['A', 'B', 'C', 'D', 'E'];

/**
 * Pastel de la carte de question.
 *
 * Le système attribue une couleur à chaque sujet, et demande qu'elle ne change
 * jamais : c'est ce qui permet de reconnaître un domaine avant de lire. Les
 * questions du livret et du récit prennent la couleur de leur section, celles
 * de l'examen la couleur de leur thème.
 */
function sujetDe(card) {
  if (card.q.source === 'livret') return 'livret';
  if (card.q.source === 'roman') return 'histoire';
  return card.q.theme || 'principes-valeurs';
}

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

  /**
   * Petit anneau qui se vide, à la place de l'icône d'horloge : on voit la part
   * de temps restante sans lire les chiffres, ce qui compte quand on est
   * absorbé par la question.
   */
  const RAYON = 9;
  const TOUR = 2 * Math.PI * RAYON;
  const anneau = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  anneau.setAttribute('viewBox', '0 0 24 24');
  anneau.setAttribute('class', 'timer__ring');
  anneau.setAttribute('aria-hidden', 'true');
  anneau.innerHTML = `
    <circle class="timer__ring-track" cx="12" cy="12" r="${RAYON}" fill="none"/>
    <circle class="timer__ring-value" cx="12" cy="12" r="${RAYON}" fill="none" stroke-linecap="round"
            transform="rotate(-90 12 12)" stroke-dasharray="${TOUR}" stroke-dashoffset="0"/>`;
  const anneauTrait = anneau.lastElementChild;

  const timerEl = h('span', {
    class: 'timer', role: 'timer', 'aria-live': 'off',
  }, [
    timeLimitSec ? anneau : icon('clock'),
    h('span', { text: timeLimitSec ? clock(timeLimitSec) : '' }),
  ]);

  function startTimer() {
    if (!timeLimitSec) return;
    ticker = setInterval(() => {
      remaining -= 1;
      timerEl.lastChild.textContent = clock(remaining);
      timerEl.classList.toggle('timer--low', remaining <= 300);
      anneauTrait.style.strokeDashoffset = String(TOUR * (1 - Math.max(0, remaining) / timeLimitSec));
      if (remaining <= 0) finish(true);
    }, 1000);
  }

  function stopTimer() { if (ticker) clearInterval(ticker); ticker = null; }

  /* ------------------------------------------------------------- rendu */

  const countEl = h('span', { class: 'quizbar__count' });
  const barre = ProgressBar({ value: 0, height: 8 });
  const barFill = barre.querySelector('.ds-pbar__fill');
  const header = h('div', { class: 'quizbar' }, [
    h('div', { class: 'quizbar__row' }, [
      countEl,
      timeLimitSec ? timerEl : Chip({ tone: 'lavender', size: 'sm', label }),
    ]),
    barre,
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
    // Étiquettes sur la carte pastel : des puces blanches, jamais un second
    // pastel. La première nomme le sujet et n'est plus répétée sous l'énoncé,
    // puisque `QuestionCard` la porte déjà.
    const tags = labels.slice(1).length
      ? h('div', { class: 'qtag' }, labels.slice(1).map((t) => Chip({ tone: 'white', size: 'sm', label: t.text })))
      : null;

    // Les cinq états du composant `AnswerOption` : au repos, cochée, juste,
    // fausse, effacée. Le système ne fait travailler la bordure qu'ici et sur
    // un champ au focus — la pastille de lettre porte le reste.
    const etatDe = (i) => {
      if (!revealed) return chosen === i ? 'selected' : 'idle';
      if (i === card.correct) return 'correct';
      if (i === chosen) return 'wrong';
      return 'muted';
    };
    const choices = h('div', { class: 'choices' }, card.choices.map((text, i) => AnswerOption({
      letter: LETTERS[i],
      label: text,
      state: etatDe(i),
      disabled: revealed,
      onClick: () => pick(i),
    })));

    // La question vit dans une carte pastel, les réponses en dessous sur le
    // fond neutre : c'est la composition du système, et elle sépare nettement
    // ce qu'on lit de ce sur quoi on appuie. Le pastel est celui du sujet,
    // donc on sait de quoi parle la question avant de l'avoir lue.
    const carte = QuestionCard({
      index: index + 1,
      total: cards.length,
      question: q.q,
      topic: labels[0]?.text,
      surface: sujetDe(card),
      // Propre à l'application : la mise en situation, qui n'existe pas dans
      // le système, est posée dans la carte sur un bloc clair — un pastel ne
      // se pose jamais sur un autre pastel.
      extra: h('div', { class: 'ds-qcard__extra' }, [
        tags,
        q.scenario ? h('p', { class: 'qscenario', text: q.scenario }) : null,
      ].filter(Boolean)),
    });

    const parts = [carte, choices];

    if (revealed) {
      const ok = chosen === card.correct;
      parts.push(ResultBanner({
        tone: ok ? 'correct' : 'wrong',
        title: ok ? 'Bonne réponse' : (chosen === null ? 'Sans réponse' : 'Réponse incorrecte'),
        text: q.why,
      }));
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
    ajusterBarre();
  }

  /**
   * La barre collée en bas recouvre ce qui passe dessous. Tant que la question
   * tient dans l'écran, cela ne coûte rien et « Valider » reste sous le pouce.
   * Dès que l'énoncé déborde — une mise en situation suivie de quatre réponses
   * longues —, la dernière réponse se retrouve masquée à l'arrivée : on la
   * croit absente. Dans ce cas la barre reprend sa place dans le flux, sous
   * les réponses. On y accède en défilant, ce qu'il faudra faire de toute façon
   * pour lire la question en entier.
   *
   * La mesure se fait la barre décollée, sinon on mesurerait la mise en page
   * qu'on est en train de décider.
   */
  function ajusterBarre() {
    requestAnimationFrame(() => {
      if (!root.isConnected) return;
      root.classList.add('is-debordant');
      const deborde = document.documentElement.scrollHeight > window.innerHeight + 1;
      root.classList.toggle('is-debordant', deborde);
    });
  }
  window.addEventListener('resize', ajusterBarre);

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
      buttons.push(Button({
        variant: 'primary', size: 'lg', fullWidth: true,
        disabled: chosen === null, label: 'Valider', onClick: () => reveal(),
      }));
    } else {
      buttons.push(Button({
        variant: last ? 'tonal' : 'primary', size: 'lg', fullWidth: true,
        iconRight: last ? null : 'chevron-right',
        disabled: !immediate && chosen === null,
        label: last ? 'Terminer' : 'Question suivante',
        onClick: () => next(),
      }));
    }

    if (!immediate && !last) {
      buttons.push(Button({
        variant: 'ghost', size: 'md', fullWidth: true,
        label: 'Passer cette question', onClick: () => next(),
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
