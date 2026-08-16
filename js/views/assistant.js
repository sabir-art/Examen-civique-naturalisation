/**
 * Assistant : poser une question et obtenir une explication.
 *
 * Les clés se règlent dans Mon compte → Assistant et voix. Tant qu'aucune clé
 * n'est enregistrée, cet écran se contente d'y renvoyer ; le reste de
 * l'application fonctionne exactement pareil, avec ou sans assistant.
 */

import { h, icon, confirmDialog } from '../lib/dom.js';
import { Card, Button, Badge, Icon, IconTile } from '../ds/index.js';
import * as ai from '../ai.js';
import * as fil from '../ai-thread.js';
import { findQuestion } from '../engine.js';
import { systemPrompt, questionContext } from '../ai-context.js';
import { format, dots, boutonVoix } from '../components/reponse-ia.js';

/**
 * Ce qu'on était en train de lire au moment d'appeler l'assistant.
 *
 * Passé par une variable et non par l'adresse : un chapitre entier ne tient
 * pas dans un fragment d'URL, et cela n'a rien à faire dans l'historique du
 * navigateur. Consommé une seule fois, à l'ouverture de l'écran.
 */
let contexteEnAttente = null;

/**
 * Prépare une question depuis n'importe quel écran, puis ouvre l'assistant.
 *
 * @param {object} o
 * @param {string} o.sujet    ce dont il est question, en une ligne
 * @param {string} [o.repere] le passage ou la définition sous les yeux
 * @param {string} [o.amorce] la question déjà écrite dans le champ
 */
export function preparerDemande({ sujet, repere = '', amorce = '' }) {
  contexteEnAttente = { sujet, repere, amorce };
}

export default function renderAssistant({ params }) {
  const target = params[0];
  if (!ai.isConfigured()) { contexteEnAttente = null; return invitation(); }
  if (target && target.startsWith('q/')) return chat({ about: target.slice(2) });
  return chat({});
}

/* ------------------------------------------------------------- invitation */

function invitation() {
  return {
    node: h('div', { class: 'stack' }, [
      h('div', { class: 'hero' }, [
        h('p', { class: 'hero__eyebrow', text: 'Facultatif' }),
        h('h1', { class: 'hero__title', text: 'Un assistant pour vous répondre' }),
        h('p', { class: 'hero__sub', text: "Faire réexpliquer une réponse que vous n'avez pas comprise, demander un exemple, un moyen de retenir. Et vous le faire lire à voix haute." }),
      ]),
      h('div', { class: 'card' }, [
        h('h2', { class: 'card__title', style: 'font-size:16px', text: "Il faut d'abord brancher une IA" }),
        h('p', { class: 'card__sub', style: 'margin-top:6px', text: "Claude, ChatGPT, Gemini ou Mistral — celle que vous voulez. Vous collez la clé de votre compte, elle reste sur ce téléphone." }),
        h('a', { class: 'btn mt', href: '#/compte/ia' }, [icon('cog'), h('span', { text: 'Ouvrir les réglages' })]),
      ]),
      h('p', { class: 'hint center', text: "L'application entière fonctionne sans assistant : questions, examens blancs, livret et récit sont complets." }),
    ]),
    title: 'Assistant',
    back: '#/',
  };
}

const SUGGESTIONS = [
  "Explique-moi la laïcité comme si j'avais 12 ans",
  'Quelle différence entre un député et un sénateur ?',
  'Raconte-moi la Révolution française en une minute',
  'Donne-moi un moyen de retenir les dates importantes',
  "Qu'est-ce qu'on attend de moi le jour de l'examen ?",
];

/* -------------------------------------------------------------- discussion */

function chat({ about = null }) {
  const container = h('div', { class: 'stack' });
  const list = h('div', { class: 'chat' });
  let busy = false;
  let controller = null;

  const field = h('textarea', {
    class: 'input chat__field', rows: '1', placeholder: 'Votre question…',
    'aria-label': 'Votre question',
    oninput: (e) => {
      e.target.style.height = 'auto';
      e.target.style.height = `${Math.min(140, e.target.scrollHeight)}px`;
    },
    onkeydown: (e) => {
      if (e.key === 'Enter' && !e.shiftKey && !busy) { e.preventDefault(); send(field.value); }
    },
  });

  const sendBtn = h('button', {
    class: 'chat__send', type: 'button', 'aria-label': 'Envoyer',
    onclick: () => (busy ? stop() : send(field.value)),
  }, icon('play'));

  function bubble(role, text) {
    const body = h('div', { class: 'msg__body', html: format(text) });
    const wrap = h('div', { class: `msg msg--${role}` }, body);
    if (role === 'assistant') {
      wrap.append(h('div', { class: 'msg__tools' }, boutonVoix(() => body.textContent)));
    }
    return wrap;
  }

  const head = h('div', { class: 'row row--between' });

  function drawHead() {
    const p = ai.PROVIDERS[ai.provider()];
    head.replaceChildren(
      Badge({ tone: 'info', label: `${p.label} · ${ai.model()}` }),
      h('div', { class: 'row', style: 'gap:14px' }, [
        !fil.estVide() ? h('button', {
          class: 'linkbtn', type: 'button', text: 'Nouvelle conversation',
          onclick: async () => {
            const ok = await confirmDialog({
              title: 'Tout oublier ?',
              text: "L'assistant repartira de zéro : il ne se souviendra plus de ce que vous vous êtes déjà dit.",
              confirmLabel: 'Nouvelle conversation',
            });
            if (ok) { fil.effacer(); drawThread(); }
          },
        }) : null,
        h('a', { class: 'linkbtn', href: '#/compte/ia', text: 'Réglages' }),
      ].filter(Boolean)),
    );
  }

  function drawThread() {
    drawHead();
    const messages = fil.messages();
    list.replaceChildren(...messages.map((m) => bubble(m.role, m.content)));
    if (!messages.length) list.append(welcome());
    scrollDown();
  }

  function welcome() {
    return h('div', { class: 'stack stack--tight' }, [
      h('div', { class: 'card card--info card--pad-sm' }, [
        h('p', { class: 'small', text: "Posez une question sur le programme, une réponse que vous n'avez pas comprise, ou demandez un exemple concret. L'assistant garde le fil de vos échanges sur ce téléphone : vous pouvez revenir plus tard et poursuivre." }),
      ]),
      h('div', { class: 'chips' }, SUGGESTIONS.map((s) => h('button', {
        class: 'chip', type: 'button', text: s, onclick: () => send(s),
      }))),
    ]);
  }

  function scrollDown() {
    requestAnimationFrame(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }));
  }

  async function send(raw) {
    const text = String(raw || '').trim();
    if (!text || busy) return;

    field.value = '';
    field.style.height = 'auto';
    fil.ajouter('user', text);
    drawThread();

    busy = true;
    sendBtn.replaceChildren(icon('cross'));
    sendBtn.setAttribute('aria-label', 'Arrêter');

    const answer = bubble('assistant', '');
    const body = answer.querySelector('.msg__body');
    body.replaceChildren(dots());
    list.append(answer);
    scrollDown();

    controller = new AbortController();
    let received = '';
    // Ce qu'on envoie est arrêté MAINTENANT, avant d'inscrire la réponse en
    // cours : sinon le dernier message transmis serait la bulle vide qu'on
    // vient d'ouvrir, et l'API refuse un tour sans contenu.
    const envoi = fil.pourEnvoi();
    // La réponse est inscrite vide, puis complétée au fil de l'eau : coupure de
    // réseau ou fermeture de l'application en cours de route, ce qui est déjà
    // arrivé sur l'écran n'est pas perdu.
    fil.ajouter('assistant', '');
    try {
      const out = await ai.ask({
        system: systemPrompt(),
        messages: envoi,
        signal: controller.signal,
        onText: (_chunk, full) => {
          received = full;
          fil.completerDernier(full);
          body.innerHTML = format(full);
          scrollDown();
        },
      });
      fil.completerDernier(out.text);
      body.innerHTML = format(out.text);
    } catch (err) {
      if (err?.name === 'AbortError') {
        if (received.trim()) {
          fil.completerDernier(received);
          body.innerHTML = format(received);
        } else {
          fil.retirerDernier();
          answer.remove();
        }
      } else {
        fil.retirerDernier();
        answer.remove();
        list.append(h('div', { class: 'msg msg--error' }, [
          h('div', { class: 'msg__body' }, [
            h('p', { text: err.message }),
            /clé|refusée|modèle/i.test(err.message)
              ? h('a', { class: 'btn btn--ghost mt', href: '#/compte/ia', text: 'Ouvrir les réglages' })
              : null,
          ].filter(Boolean)),
        ]));
      }
    } finally {
      busy = false;
      controller = null;
      sendBtn.replaceChildren(icon('play'));
      sendBtn.setAttribute('aria-label', 'Envoyer');
      scrollDown();
    }
  }

  function stop() {
    if (controller) controller.abort();
  }

  drawThread();

  container.append(head, list, h('div', { class: 'chatbar' }, [
    h('div', { class: 'chatbar__inner' }, [field, sendBtn]),
  ]));

  /** Écrit une demande dans le champ sans l'envoyer : on peut encore la changer. */
  function preremplir(texte) {
    field.value = texte;
    requestAnimationFrame(() => {
      field.style.height = 'auto';
      field.style.height = `${Math.min(140, field.scrollHeight)}px`;
      field.focus();
      field.setSelectionRange(field.value.length, field.value.length);
    });
  }

  // Arrivée depuis une question ratée : la demande est préparée, il ne reste
  // qu'à l'envoyer ou à la modifier.
  if (about) {
    const q = findQuestion(about);
    if (q) preremplir(`${questionContext(q)}\nExplique-moi pourquoi, avec un exemple concret.`);
  } else if (contexteEnAttente) {
    // Arrivée depuis une lecture : l'assistant sait de quoi on lui parle sans
    // qu'on ait à le lui récrire.
    const c = contexteEnAttente;
    contexteEnAttente = null;
    preremplir([
      `À propos de : ${c.sujet}`,
      c.repere ? `Le passage : « ${c.repere} »` : null,
      c.amorce || 'Explique-moi ça simplement.',
    ].filter(Boolean).join('\n'));
  }

  return { node: container, title: 'Assistant', back: '#/' };
}
