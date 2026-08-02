/**
 * Bloc de réponse de l'IA : demande, affichage au fil de l'eau, lecture à voix
 * haute. Utilisé par l'écran Assistant et par le panneau « approfondir »
 * affiché sous les explications du quiz.
 */

import { h, icon, toast } from '../lib/dom.js';
import * as ai from '../ai.js';

const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

/**
 * Mise en forme minimale d'une réponse. Le texte est intégralement échappé
 * avant toute conversion : rien de ce qui revient de l'API n'est interprété
 * comme du HTML.
 */
export function format(text) {
  const safe = String(text).replace(/[&<>"']/g, (c) => ESCAPES[c]);
  return safe
    .split(/\n{2,}/)
    .map((block) => {
      const lines = block.split('\n');
      if (lines.every((l) => /^\s*([-*•]|\d+[.)])\s+/.test(l))) {
        const items = lines.map((l) => `<li>${inline(l.replace(/^\s*([-*•]|\d+[.)])\s+/, ''))}</li>`).join('');
        return `<ul>${items}</ul>`;
      }
      return `<p>${inline(lines.join('<br>'))}</p>`;
    })
    .join('');
}

function inline(s) {
  return s
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[\s(])\*([^*\n]+)\*/g, '$1<em>$2</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>');
}

/** Trois points animés, le temps que la réponse arrive. */
export function dots() {
  return h('span', { class: 'dots', html: '<i></i><i></i><i></i>' });
}

/**
 * Bouton de lecture à voix haute. Il apparaît toujours : avec une clé
 * ElevenLabs il utilise la voix choisie, sinon celle du téléphone.
 */
export function boutonVoix(getText) {
  let audio = null;
  let playing = false;

  const btn = h('button', { class: 'iconbtn', type: 'button', 'aria-label': 'Écouter' }, icon('play'));

  const stop = () => {
    ai.stopSpeaking();
    if (audio) { audio.pause(); audio = null; }
    playing = false;
    btn.replaceChildren(icon('play'));
    btn.setAttribute('aria-label', 'Écouter');
  };

  btn.addEventListener('click', async () => {
    if (playing) { stop(); return; }
    const texte = getText();
    if (!texte?.trim()) return;
    playing = true;
    btn.replaceChildren(icon('cross'));
    btn.setAttribute('aria-label', 'Arrêter la lecture');
    try {
      const out = await ai.speak(texte);
      if (out instanceof HTMLAudioElement) {
        audio = out;
        out.addEventListener('ended', stop, { once: true });
      } else if (out) {
        out.addEventListener?.('end', stop, { once: true });
      } else {
        stop();
      }
    } catch (err) {
      toast(err.message);
      stop();
    }
  });

  btn.stop = stop;
  return btn;
}

/**
 * Lance une demande et remplit `body` au fil de l'eau.
 *
 * @returns {{promise: Promise<string>, abort: Function}}
 */
export function stream({ system, messages, body, onDone }) {
  const controller = new AbortController();
  body.replaceChildren(dots());

  const promise = ai.ask({
    system,
    messages,
    signal: controller.signal,
    onText: (_chunk, full) => { body.innerHTML = format(full); },
  })
    .then((out) => {
      body.innerHTML = format(out.text);
      if (onDone) onDone(out.text);
      return out.text;
    })
    .catch((err) => {
      if (err?.name === 'AbortError') return '';
      body.replaceChildren(h('p', { class: 'msgerr', text: err.message }));
      throw err;
    });

  return { promise, abort: () => controller.abort() };
}
