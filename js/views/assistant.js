/**
 * Assistant : poser une question et obtenir une explication.
 *
 * Les clés se règlent dans Mon compte → Assistant et voix. Tant qu'aucune clé
 * n'est enregistrée, cet écran se contente d'y renvoyer ; le reste de
 * l'application fonctionne exactement pareil, avec ou sans assistant.
 */

import { h, icon, confirmDialog } from '../lib/dom.js';
import { Badge } from '../ds/index.js';
import * as ai from '../ai.js';
import * as fil from '../ai-thread.js';
import { findQuestion } from '../engine.js';
import { questionContext } from '../ai-context.js';
import { createConverser } from '../components/converser.js';
import { ecranPrecedent } from '../app.js';

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
  // L'écran d'où l'on vient, relevé maintenant : le routeur ne l'aura plus une
  // fois cette vue installée. C'est là que doit ramener la flèche de retour.
  const retour = ecranPrecedent();
  if (!ai.isConfigured()) { contexteEnAttente = null; return invitation(retour); }
  if (target && target.startsWith('q/')) return chat({ about: target.slice(2), retour });
  return chat({ retour });
}

/* ------------------------------------------------------------- invitation */

function invitation(retour = '#/') {
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
    back: retour,
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

function chat({ about = null, retour = '#/' }) {
  const container = h('div', { class: 'stack' });

  // Le contexte apporté par l'écran d'où l'on vient : un mot du glossaire, un
  // chapitre. Consommé une fois, ici.
  const c = contexteEnAttente;
  contexteEnAttente = null;

  const causerie = createConverser({ forme: 'plein', suggestions: SUGGESTIONS });

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
            if (ok) { fil.effacer(); causerie.redessiner(); drawHead(); }
          },
        }) : null,
        h('a', { class: 'linkbtn', href: '#/compte/ia', text: 'Réglages' }),
      ].filter(Boolean)),
    );
  }

  drawHead();
  container.append(head, causerie);

  // Arrivée depuis une question ratée : la demande est préparée, il ne reste
  // qu'à l'envoyer ou à la modifier.
  if (about) {
    const q = findQuestion(about);
    if (q) causerie.preremplir(`${questionContext(q)}\nExplique-moi pourquoi, avec un exemple concret.`);
  } else if (c) {
    causerie.preremplir([
      `À propos de : ${c.sujet}`,
      c.repere ? `Le passage : « ${c.repere} »` : null,
      c.amorce || 'Explique-moi ça simplement.',
    ].filter(Boolean).join('\n'));
  }

  return { node: container, title: 'Assistant', back: retour };
}
