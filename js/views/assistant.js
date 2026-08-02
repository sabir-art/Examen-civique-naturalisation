/**
 * Assistant : poser une question à Claude et obtenir une explication.
 *
 * La clé de l'API est saisie ici par l'utilisateur et ne quitte jamais son
 * téléphone (voir l'en-tête de js/ai.js). Sans clé, l'écran de configuration
 * s'affiche à la place de la conversation ; le reste de l'application
 * fonctionne exactement pareil, avec ou sans assistant.
 */

import { h, icon, toast, confirmDialog } from '../lib/dom.js';
import * as ai from '../ai.js';
import * as store from '../store.js';
import { EXAM, THEMES } from '../data/programme.js';
import { readiness, themeStats, findQuestion, romanOverview } from '../engine.js';
import { refresh, navigate } from '../app.js';

/** La conversation vit le temps de la session : rien n'est écrit sur le disque. */
let thread = [];

export default function renderAssistant({ params }) {
  const target = params[0];
  if (!ai.isConfigured()) return setup(target);
  if (target === 'reglages') return setup(null, { fromSettings: true });
  if (target && target.startsWith('q/')) return chat({ about: target.slice(2) });
  return chat({});
}

/* ------------------------------------------------------------ configuration */

function setup(pending, { fromSettings = false } = {}) {
  const configured = ai.isConfigured();

  const input = h('input', {
    class: 'input', type: 'password', id: 'ai-key', autocomplete: 'off',
    spellcheck: 'false', placeholder: 'sk-ant-…',
    'aria-label': 'Clé API Anthropic',
  });

  const form = h('form', {
    class: 'stack stack--tight',
    onsubmit: (e) => {
      e.preventDefault();
      try {
        ai.setKey(input.value);
        input.value = '';
        toast('Assistant activé.');
        navigate(pending ? `#/assistant/${pending}` : '#/assistant');
        refresh();
      } catch (err) {
        toast(err.message);
      }
    },
  }, [
    h('label', { class: 'label', for: 'ai-key', text: 'Votre clé API' }),
    input,
    h('button', { class: 'btn', type: 'submit' }, [icon('star'), h('span', { text: configured ? 'Remplacer la clé' : "Activer l'assistant" })]),
  ]);

  const modelChoice = h('div', { class: 'stack stack--tight' }, [
    h('p', { class: 'section-title', text: 'Modèle' }),
    ...Object.values(ai.MODELS).map((m) => h('button', {
      class: 'item', type: 'button',
      'aria-pressed': ai.model() === m.id ? 'true' : 'false',
      style: 'text-align:left;width:100%;cursor:pointer',
      onclick: () => { ai.setModel(m.id); refresh(); },
    }, [
      h('span', { class: 'item__icon' }, icon(ai.model() === m.id ? 'check' : 'cog')),
      h('span', { class: 'item__body' }, [
        h('span', { class: 'item__title', text: m.label }),
        h('span', { class: 'item__sub', text: m.note }),
      ]),
    ])),
  ]);

  return {
    node: h('div', { class: 'stack' }, [
      h('div', { class: 'hero' }, [
        h('p', { class: 'hero__eyebrow', text: 'Facultatif' }),
        h('h1', { class: 'hero__title', text: 'Un assistant pour vous répondre' }),
        h('p', { class: 'hero__sub', text: "Poser une question sur une réponse que vous n'avez pas comprise, demander un exemple, faire réexpliquer autrement. L'application fonctionne très bien sans." }),
      ]),

      h('div', { class: 'card card--retenir' }, [
        h('h2', { class: 'card__title', style: 'font-size:16px', text: 'Pourquoi devez-vous fournir votre propre clé ?' }),
        h('div', { class: 'prose', style: 'margin-top:8px', html: `
<p>Ce site est un site <strong>statique et public</strong> : tout ce qu'il contient
est visible par n'importe qui, code compris. Une clé placée dans le code serait
donc lisible par tout le monde, et utilisable — à vos frais — par tout le monde.</p>
<p>C'est pour cette raison que la clé n'est pas dans l'application : <strong>vous
la saisissez ici</strong>, elle est conservée uniquement dans la mémoire de ce
navigateur, sur ce téléphone. Elle part vers <code>api.anthropic.com</code> et
nulle part ailleurs. Elle n'est ni synchronisée, ni incluse dans vos
sauvegardes.</p>` }),
      ]),

      h('div', { class: 'card' }, [
        h('h2', { class: 'card__title', style: 'font-size:16px', text: 'Obtenir une clé' }),
        h('ol', { class: 'retenir', style: 'padding-left:20px' }, [
          h('li', { html: 'Créez un compte sur <a href="https://console.anthropic.com" target="_blank" rel="noopener">console.anthropic.com</a>.' }),
          h('li', { html: 'Ajoutez quelques euros de crédit (<em>Billing</em>), et fixez-y une <strong>limite de dépense</strong>.' }),
          h('li', { html: 'Dans <em>API Keys</em>, créez une clé et copiez-la : elle ne sera plus affichée ensuite.' }),
          h('li', { html: 'Collez-la ci-dessous.' }),
        ]),
        h('p', { class: 'hint', style: 'margin-top:10px', text: "Les échanges vous sont facturés par Anthropic, à l'usage. Quelques centimes pour une session de questions. Si vous pensez qu'une clé a été vue par quelqu'un d'autre, supprimez-la depuis la console : elle devient aussitôt inutilisable." }),
      ]),

      form,
      modelChoice,

      configured ? h('button', {
        class: 'btn btn--danger', type: 'button',
        onclick: async () => {
          const ok = await confirmDialog({
            title: 'Supprimer la clé ?',
            text: "L'assistant sera désactivé sur cet appareil. Le reste de l'application n'est pas touché.",
            confirmLabel: 'Supprimer',
            danger: true,
          });
          if (ok) { ai.clearKey(); toast('Clé supprimée.'); refresh(); }
        },
      }, [icon('trash'), h('span', { text: `Supprimer la clé (${ai.keyHint()})` })]) : null,

      h('p', { class: 'hint center mt', text: "L'assistant peut se tromper. Pour tout ce qui touche à votre dossier (pièces, tarifs, rendez-vous), la seule source qui fait foi reste votre préfecture et service-public.fr." }),
    ].filter(Boolean)),
    title: 'Assistant',
    back: fromSettings ? '#/assistant' : '#/',
  };
}

/* -------------------------------------------------------------- consigne */

function systemPrompt() {
  const p = store.current();
  const stats = themeStats().slice().sort((a, b) => a.mastery - b.mastery);
  const faible = stats[0];
  const rm = romanOverview();

  return [
    "Tu es le professeur particulier d'une personne qui prépare l'examen civique exigé pour la naturalisation française. Tu l'aides à comprendre et à mémoriser, dans une application d'entraînement qu'elle utilise déjà.",
    '',
    "L'épreuve : un QCM de " + EXAM.questions + ' questions en ' + EXAM.minutes + ' minutes, réussi à partir de ' + EXAM.passing + '/' + EXAM.questions + ". Programme fixé par l'arrêté du 10 octobre 2025, en cinq thèmes : "
      + Object.values(THEMES).map((t) => t.short).join(', ')
      + ". Le document de référence est le livret du citoyen du ministère de l'Intérieur.",
    '',
    'Comment répondre :',
    "- En français simple et direct. Cette personne apprend le français : phrases courtes, mots courants, et tu expliques un terme administratif dès que tu l'emploies.",
    "- Court : trois à six phrases en général. Elle lit sur un téléphone.",
    "- Elle retient beaucoup mieux par les histoires, les images et les scènes concrètes que par les listes. Quand c'est possible, accroche le fait à une scène, une comparaison ou une petite anecdote, puis donne le fait nu à la fin en une ligne.",
    "- Termine par un repère mémorisable : une date, un chiffre, une formule courte.",
    "- Pas de titres ni de tableaux. Le gras et les listes courtes sont acceptés, avec parcimonie.",
    '',
    'Exigences de fond :',
    "- Sur le droit, les dates et les institutions, sois exact. Si tu n'es pas certain d'un chiffre, dis-le plutôt que de l'inventer.",
    "- Pour les démarches personnelles (pièces à fournir, tarifs, délais, centres d'examen, rendez-vous), rappelle que seules la préfecture et service-public.fr font foi : ces informations changent souvent.",
    "- Tu n'as accès à aucun document de son dossier et tu ne peux pas agir à sa place.",
    "- Reste sur le programme de l'examen et sur son apprentissage.",
    '',
    'Ce que tu sais de sa préparation en ce moment :',
    `- Prénom : ${p?.name || 'inconnu'}.`,
    `- Estimation de préparation : ${readiness()} %.`,
    faible ? `- Thème le plus fragile : ${faible.full} (${Math.round(faible.mastery * 100)} % de maîtrise).` : '',
    `- Récit « La France racontée » : ${rm.lus} chapitre(s) lus sur ${rm.chapitres}.`,
    "N'évoque ces éléments que s'ils servent la réponse ; ne commence pas par un bilan.",
  ].filter(Boolean).join('\n');
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
    return h('div', { class: `msg msg--${role}` }, h('div', { class: 'msg__body', html: format(text) }));
  }

  const head = h('div', { class: 'row row--between' });

  function drawHead() {
    head.replaceChildren(
      h('span', { class: 'badge badge--brand', text: ai.MODELS[ai.model()].label }),
      h('div', { class: 'row', style: 'gap:14px' }, [
        thread.length ? h('button', {
          class: 'linkbtn', type: 'button', text: 'Nouvelle conversation',
          onclick: () => { thread = []; drawThread(); },
        }) : null,
        h('a', { class: 'linkbtn', href: '#/assistant/reglages', text: 'Réglages' }),
      ].filter(Boolean)),
    );
  }

  function drawThread() {
    drawHead();
    list.replaceChildren(...thread.map((m) => bubble(m.role, m.content)));
    if (!thread.length) list.append(welcome());
    scrollDown();
  }

  function welcome() {
    return h('div', { class: 'stack stack--tight' }, [
      h('div', { class: 'card card--pad-sm' }, [
        h('p', { class: 'small', text: "Posez une question sur le programme, une réponse que vous n'avez pas comprise, ou demandez un exemple concret. Les échanges ne sont pas conservés." }),
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
    thread.push({ role: 'user', content: text });
    drawThread();

    busy = true;
    sendBtn.replaceChildren(icon('cross'));
    sendBtn.setAttribute('aria-label', 'Arrêter');

    const answer = bubble('assistant', '');
    const body = answer.querySelector('.msg__body');
    body.replaceChildren(h('span', { class: 'dots', html: '<i></i><i></i><i></i>' }));
    list.append(answer);
    scrollDown();

    controller = new AbortController();
    let received = '';
    try {
      const out = await ai.ask({
        system: systemPrompt(),
        messages: thread.map((m) => ({ role: m.role, content: m.content })),
        signal: controller.signal,
        onText: (_chunk, full) => {
          received = full;
          body.innerHTML = format(full);
          scrollDown();
        },
      });
      thread.push({ role: 'assistant', content: out.text });
      body.innerHTML = format(out.text);
    } catch (err) {
      if (err?.name === 'AbortError') {
        if (received.trim()) {
          thread.push({ role: 'assistant', content: received });
          body.innerHTML = format(received);
        } else {
          answer.remove();
        }
      } else {
        answer.remove();
        list.append(h('div', { class: 'msg msg--error' }, [
          h('div', { class: 'msg__body' }, [
            h('p', { text: err.message }),
            /clé/i.test(err.message)
              ? h('a', { class: 'btn btn--ghost mt', href: '#/assistant/reglages', text: 'Ouvrir les réglages' })
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

  const bar = h('div', { class: 'chatbar' }, [
    h('div', { class: 'chatbar__inner' }, [field, sendBtn]),
  ]);

  container.append(head, list, bar);

  // Arrivée depuis une question ratée : on prépare la demande, l'utilisateur
  // n'a plus qu'à l'envoyer (ou à la modifier).
  if (about) {
    const q = findQuestion(about);
    if (q) {
      field.value = [
        q.scenario ? `Situation : ${q.scenario}` : null,
        `Question : ${q.q}`,
        `La bonne réponse est : « ${q.c[q.a]} ».`,
        "Je me suis trompé. Explique-moi pourquoi c'est celle-là, avec un exemple concret.",
      ].filter(Boolean).join('\n');
      requestAnimationFrame(() => { field.style.height = 'auto'; field.style.height = `${Math.min(140, field.scrollHeight)}px`; });
    }
  }

  return { node: container, title: 'Assistant', back: '#/' };
}

/* --------------------------------------------------------------- rendu */

const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

/**
 * Mise en forme minimale de la réponse. Le texte est intégralement échappé
 * avant toute conversion : rien de ce qui revient de l'API n'est interprété
 * comme du HTML.
 */
function format(text) {
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
