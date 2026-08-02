/**
 * Panneau « approfondir » affiché sous l'explication d'une question.
 *
 * Il s'ouvre sans quitter la question : demandes toutes prêtes, question libre,
 * et lecture à voix haute. Sans IA branchée, il propose seulement d'écouter
 * l'explication déjà écrite — la voix du téléphone suffit pour cela.
 */

import { h, icon } from '../lib/dom.js';
import * as ai from '../ai.js';
import { systemPrompt, questionContext, QUICK_ASKS } from '../ai-context.js';
import { format, dots, boutonVoix } from './reponse-ia.js';

/**
 * @param {object} q       la question posée
 * @param {string|null} chosen  la réponse donnée par l'utilisateur
 */
export function createApprofondir(q, chosen = null) {
  const root = h('div', { class: 'deepen' });

  // Sans IA : on se contente d'offrir l'écoute de l'explication.
  if (!ai.isConfigured()) {
    root.append(h('div', { class: 'deepen__row' }, [
      boutonVoix(() => q.why || q.q),
      h('span', { class: 'deepen__hint', text: "Écouter l'explication" }),
      h('a', { class: 'linkbtn', href: '#/compte/ia', text: 'Activer l\'IA' }),
    ]));
    return root;
  }

  const answer = h('div', { class: 'deepen__answer', hidden: true });
  const body = h('div', { class: 'msg__body' });
  const voix = boutonVoix(() => body.textContent);
  answer.append(body, h('div', { class: 'deepen__tools' }, [
    voix,
    h('span', { class: 'deepen__hint', text: 'Écouter la réponse' }),
  ]));

  // Le fil est propre à cette question : on ne mélange pas deux sujets.
  let thread = [];
  let busy = false;
  let controller = null;

  const chips = h('div', { class: 'chips' }, QUICK_ASKS.map((a) => h('button', {
    class: 'chip', type: 'button', text: a.label, onclick: () => ask(a.prompt),
  })));

  const field = h('input', {
    class: 'input', type: 'text', placeholder: 'Ou posez votre propre question…',
    'aria-label': 'Poser une question sur cette question',
    onkeydown: (e) => { if (e.key === 'Enter') { e.preventDefault(); ask(field.value); field.value = ''; } },
  });

  const envoyer = h('button', {
    class: 'iconbtn iconbtn--brand', type: 'button', 'aria-label': 'Envoyer',
    onclick: () => { ask(field.value); field.value = ''; },
  }, icon('play'));

  async function ask(prompt) {
    const texte = String(prompt || '').trim();
    if (!texte) return;
    if (busy) { controller?.abort(); }

    answer.hidden = false;
    voix.stop();
    body.replaceChildren(dots());
    busy = true;
    chips.setAttribute('aria-busy', 'true');

    // Le contexte de la question n'est envoyé qu'au premier message du fil.
    const contenu = thread.length ? texte : `${questionContext(q, chosen)}\n\n${texte}`;
    thread.push({ role: 'user', content: contenu });

    controller = new AbortController();
    try {
      const out = await ai.ask({
        system: systemPrompt(),
        messages: thread,
        signal: controller.signal,
        onText: (_c, full) => { body.innerHTML = format(full); },
      });
      thread.push({ role: 'assistant', content: out.text });
      body.innerHTML = format(out.text);
    } catch (err) {
      if (err?.name !== 'AbortError') {
        thread.pop();
        body.replaceChildren(h('p', { class: 'msgerr', text: err.message }));
      }
    } finally {
      busy = false;
      controller = null;
      chips.removeAttribute('aria-busy');
    }
  }

  const contenu = h('div', { class: 'deepen__inner stack stack--tight' }, [
    chips,
    h('div', { class: 'row', style: 'gap:8px' }, [field, envoyer]),
    answer,
  ]);

  const details = h('details', { class: 'deepen__box' }, [
    h('summary', { class: 'summary' }, [
      icon('star'),
      h('span', { text: 'Approfondir avec l\'IA' }),
    ]),
    contenu,
  ]);

  // Tant que le panneau est ouvert, la barre d'action quitte le mode collé et
  // redescend sous le contenu : sinon « Question suivante » reste en travers du
  // panneau et cache les propositions.
  details.addEventListener('toggle', () => {
    root.closest('.quiz')?.classList.toggle('is-deepened', details.open);
    if (!details.open) return;
    requestAnimationFrame(() => {
      details.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  });

  root.append(
    h('div', { class: 'deepen__row' }, [
      boutonVoix(() => q.why || q.q),
      h('span', { class: 'deepen__hint', text: "Écouter l'explication" }),
    ]),
    details,
  );

  // Un changement de question doit couper une réponse en cours.
  root.stop = () => { controller?.abort(); voix.stop(); ai.stopSpeaking(); };
  return root;
}
