/**
 * Composants d'apprentissage — `components/learning/` du système.
 *
 * Ce groupe n'est pas générique : c'est le vocabulaire propre à une
 * application de révision. Carte de thème, carte de question, réponse,
 * ligne de leçon, bandeau de verdict.
 */

import { h } from '../lib/dom.js';
import { Icon, IconTile } from './core.js';
import { ProgressBar } from './data.js';

/* ----------------------------------------------------------- ThemeCard */

/**
 * Un thème de révision : glyphe, intitulé, nombre de questions, avancement.
 * L'objet principal de l'application.
 *
 * `topic` porte le pastel, et cette correspondance ne bouge jamais — c'est
 * elle qui permet de reconnaître un domaine avant de l'avoir lu.
 */
export function ThemeCard({
  title, topic = 'histoire', icon = 'book-open', count, progress = 0,
  layout = 'row', locked = false, meta, href, onClick, className = '',
} = {}) {
  const grille = layout === 'tile';
  return h(href ? 'a' : 'div', {
    class: [
      'ds-theme',
      `ds-theme--${topic}`,
      grille ? 'ds-theme--tile' : 'ds-theme--row',
      locked ? 'ds-theme--locked' : '',
      href || onClick ? 'ds-theme--tap' : '',
      className,
    ].filter(Boolean).join(' '),
    href: locked ? null : (href || null),
    onclick: locked ? null : (onClick || null),
  }, [
    h('span', { class: 'ds-theme__glyph' }, Icon({ name: locked ? 'lock' : icon, size: 22 })),
    h('div', { class: 'ds-theme__body' }, [
      h('div', { class: 'ds-theme__head' }, [
        h('span', { class: 'ds-theme__title', text: title }),
        !grille && !locked ? h('span', { class: 'ds-theme__pct', text: `${Math.round(progress)} %` }) : null,
      ].filter(Boolean)),
      locked
        ? h('span', { class: 'ds-theme__meta', text: 'Terminez le thème précédent' })
        : h('div', { class: 'ds-theme__prog' }, [
          ProgressBar({ value: progress, height: 6, onTint: true }),
          count != null || meta
            ? h('span', { class: 'ds-theme__meta', text: meta || `${count} questions` })
            : null,
        ].filter(Boolean)),
    ]),
  ]);
}

/* -------------------------------------------------------- QuestionCard */

/**
 * Le bloc de question au-dessus de la liste des réponses : position dans la
 * série, chronomètre, énoncé. `surface` prend le pastel du sujet.
 */
export function QuestionCard({
  index, total, question, topic, timeLeft, surface = 'lavender', extra, className = '',
} = {}) {
  return h('div', {
    class: `ds-qcard ds-qcard--${surface}${className ? ` ${className}` : ''}`,
  }, [
    h('div', { class: 'ds-qcard__head' }, [
      h('span', {
        class: 'ds-qcard__pos',
        text: `${topic ? `${topic} · ` : ''}Question ${index}/${total}`,
      }),
      timeLeft ? h('span', { class: 'ds-qcard__timer' }, [
        Icon({ name: 'clock', size: 13 }),
        h('span', { text: timeLeft }),
      ]) : null,
    ].filter(Boolean)),
    extra || null,
    h('p', { class: 'ds-qcard__q', text: question }),
  ].filter(Boolean));
}

/* -------------------------------------------------------- AnswerOption */

/**
 * Une réponse d'un quiz. Pastille de lettre à gauche, glyphe de retour à
 * droite. Les cinq états sont ceux du système : au repos, cochée, juste,
 * fausse, effacée.
 */
export function AnswerOption({
  letter, label, children, state = 'idle', onClick, disabled = false, className = '',
} = {}) {
  const retour = state === 'correct' ? 'check' : state === 'wrong' ? 'x' : null;
  return h('button', {
    class: `ds-answer ds-answer--${state}${className ? ` ${className}` : ''}`,
    type: 'button',
    disabled: disabled ? true : null,
    'aria-pressed': state === 'selected' ? 'true' : 'false',
    onclick: onClick || null,
  }, [
    h('span', { class: 'ds-answer__letter', text: letter }),
    h('span', { class: 'ds-answer__text' }, children !== undefined ? children : h('span', { text: label ?? '' })),
    retour ? Icon({ name: retour, size: 18, strokeWidth: 2.5 }) : null,
  ].filter(Boolean));
}

/* ----------------------------------------------------------- LessonRow */

/**
 * Une fiche ou une leçon dans une liste : pastille d'état, intitulé, source,
 * complément à droite.
 */
export function LessonRow({
  title, meta, status = 'todo', icon: nom, trailing, href, onClick, onMore, className = '',
} = {}) {
  const glyphe = { todo: 'circle', progress: 'circle-dashed', done: 'circle-check' }[status] || 'circle';
  return h(href ? 'a' : 'div', {
    class: `ds-lesson${href || onClick ? ' ds-lesson--tap' : ''}${className ? ` ${className}` : ''}`,
    href: href || null,
    onclick: onClick || null,
  }, [
    nom
      ? IconTile({ icon: nom, tone: 'sunken', size: 38 })
      : h('span', { class: `ds-lesson__state ds-lesson__state--${status}` },
        Icon({ name: glyphe, size: 18, strokeWidth: 2.25 })),
    h('div', { class: 'ds-lesson__body' }, [
      h('div', { class: 'ds-lesson__title', text: title }),
      meta ? h('div', { class: 'ds-lesson__meta', text: meta }) : null,
    ].filter(Boolean)),
    trailing || null,
    onMore ? h('button', {
      class: 'ds-lesson__more', type: 'button', 'aria-label': "Plus d'options",
      onclick: (e) => { e.stopPropagation(); e.preventDefault(); onMore(); },
    }, Icon({ name: 'ellipsis-vertical', size: 16 })) : null,
  ].filter(Boolean));
}

/* -------------------------------------------------------- ResultBanner */

/**
 * Verdict et explication après une réponse, et l'avis d'état ailleurs.
 * Le ton faux ne gronde pas : il annonce, et propose de revoir la fiche.
 */
export function ResultBanner({
  tone = 'correct', title, children, text, icon: nom, action, href, onAction, className = '',
} = {}) {
  const parDefaut = {
    correct: 'circle-check', wrong: 'circle-x', info: 'info', warning: 'triangle-alert',
  }[tone] || 'circle-check';
  return h('div', {
    class: `ds-verdict ds-verdict--${tone}${className ? ` ${className}` : ''}`,
    role: 'status',
  }, [
    Icon({ name: nom || parDefaut, size: 20, strokeWidth: 2.25, className: 'ds-verdict__icon' }),
    h('div', { class: 'ds-verdict__body' }, [
      title ? h('span', { class: 'ds-verdict__title', text: title }) : null,
      children !== undefined ? children : (text ? h('span', { class: 'ds-verdict__text', text }) : null),
      action ? h(href ? 'a' : 'button', {
        class: 'ds-verdict__action', type: href ? null : 'button',
        href: href || null, onclick: onAction || null, text: action,
      }) : null,
    ].filter(Boolean)),
  ]);
}
