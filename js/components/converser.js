/**
 * Parler à l'assistant, sans quitter l'écran où l'on se trouve.
 *
 * Un seul composant sert partout : l'écran Assistant en entier, et la feuille
 * d'un mot du glossaire où l'on veut juste une précision. Poser une question ne
 * doit pas coûter la place qu'on occupait — c'est la règle qui a présidé ici.
 *
 * Ce qu'il apporte, et que trois copies éparpillées ne donnaient pas :
 *  — LA MÉMOIRE est la même partout (js/ai-thread.js). Ce qu'on demande depuis
 *    un mot du glossaire, l'écran Assistant s'en souvient, et l'inverse.
 *  — LE CONTEXTE est joint à la première question seulement : « à propos du mot
 *    préfet… ». Le répéter à chaque tour gonflerait la facture pour rien,
 *    puisque l'échange précédent est déjà renvoyé.
 *  — LA VOIX, quand le navigateur sait écouter. Dicter vaut mieux que taper
 *    pour qui apprend encore à écrire le français.
 *
 * La zone de saisie est un seul bloc arrondi, bordé, avec ses boutons DEDANS —
 * un champ gris pâle posé sur un fond presque blanc, flanqué d'un bouton qui
 * lui prend sa largeur, ne se voyait pas et se manipulait mal.
 */

import { h, icon, toast } from '../lib/dom.js';
import * as ai from '../ai.js';
import * as fil from '../ai-thread.js';
import { systemPrompt } from '../ai-context.js';
import { format, dots, boutonVoix } from './reponse-ia.js';

/**
 * Le moteur de dictée du navigateur — quand il en a un QUI MARCHE.
 *
 * Sur les navigateurs d'Apple, l'objet existe mais la dictée ne tient pas ses
 * promesses : elle peut ne jamais rendre la main, et l'application se retrouve
 * bloquée sur un bouton qui ne répond plus. La détection par présence de l'API
 * ne suffit donc pas — c'est le piège classique, et j'y suis tombé.
 *
 * Ce n'est pas une perte pour autant : sur iPhone, le clavier porte déjà son
 * propre micro, qui dicte dans n'importe quel champ et fonctionne, lui. Mieux
 * vaut le laisser faire que le refaire mal.
 *
 * Tous les navigateurs d'iOS reposent sur WebKit — y compris Chrome — d'où le
 * test sur le fournisseur plutôt que sur le nom du navigateur.
 */
const MOTEUR_APPLE = typeof navigator !== 'undefined'
  && navigator.vendor === 'Apple Computer, Inc.';

const Dictee = (typeof window !== 'undefined' && !MOTEUR_APPLE)
  ? (window.SpeechRecognition || window.webkitSpeechRecognition)
  : null;

export function dicteeDisponible() {
  return Boolean(Dictee);
}

/**
 * @param {object} o
 * @param {'plein'|'feuille'} [o.forme]  écran entier, ou encart dans une feuille
 * @param {object} [o.contexte]  { sujet, repere } joint à la première question
 * @param {string[]} [o.suggestions]  demandes proposées d'un seul geste
 * @param {string} [o.invite]  texte d'attente du champ
 * @param {Function} [o.onActivite]  appelé quand la hauteur du bloc change
 */
export function createConverser({
  forme = 'plein',
  contexte = null,
  suggestions = [],
  invite = 'Votre question…',
  onActivite = null,
} = {}) {
  const root = h('div', { class: `causerie causerie--${forme}` });

  if (!ai.isConfigured()) {
    root.append(h('div', { class: 'causerie__absente' }, [
      h('p', { class: 'small', text: "Branchez une IA pour poser vos questions ici — la clé reste sur ce téléphone." }),
      h('a', { class: 'btn btn--ghost mt', href: '#/compte/ia', text: 'Ouvrir les réglages' }),
    ]));
    return root;
  }

  let occupe = false;
  let controleur = null;
  /** Le contexte n'accompagne que la première question de cette ouverture. */
  let contexteAJoindre = contexte;

  const liste = h('div', { class: 'causerie__fil' });

  /* ------------------------------------------------------------- saisie */

  const champ = h('textarea', {
    class: 'compose__field', rows: '1', placeholder: invite,
    'aria-label': 'Votre question',
    oninput: () => { ajusterChamp(); },
    onkeydown: (e) => {
      if (e.key === 'Enter' && !e.shiftKey && !occupe) { e.preventDefault(); envoyer(champ.value); }
    },
  });

  /**
   * Ajuste la hauteur du champ, puis publie celle du bloc entier.
   *
   * La valeur est posée SUR LE COMPOSANT, pas rendue à l'appelant : amarré en
   * bas de fenêtre, ce bloc recouvre ce qui passe dessous, et c'est au fil de
   * la conversation de lui rendre sa place. La faire remonter obligeait la vue
   * à lire une variable qu'elle était encore en train de construire.
   */
  function ajusterChamp() {
    champ.style.height = 'auto';
    champ.style.height = `${Math.min(148, champ.scrollHeight)}px`;
    root.style.setProperty('--compose-h', `${Math.ceil(compose.offsetHeight)}px`);
    onActivite?.();
  }

  const envoiBtn = h('button', {
    class: 'compose__send', type: 'button', 'aria-label': 'Envoyer',
    onclick: () => (occupe ? arreter() : envoyer(champ.value)),
  }, icon('play'));

  const micBtn = Dictee ? h('button', {
    class: 'compose__mic', type: 'button', 'aria-label': 'Dicter la question',
    onclick: () => basculerDictee(),
  }, icon('mic')) : null;

  const compose = h('div', { class: 'compose' }, [
    champ,
    h('div', { class: 'compose__actions' }, [micBtn, envoiBtn].filter(Boolean)),
  ]);

  /* ------------------------------------------------------------- dictée */

  let reco = null;
  let veille = null;

  /**
   * Rend l'interface, quoi qu'il arrive au moteur.
   *
   * Séparé de l'arrêt du moteur À DESSEIN : un moteur qui ne répond plus ne
   * doit pas emporter le bouton avec lui. L'écoute se coupe visuellement tout
   * de suite ; ce que la machine en fait ensuite ne concerne plus l'utilisateur.
   */
  function rendreLaMain() {
    if (veille) { clearTimeout(veille); veille = null; }
    reco = null;
    compose.classList.remove('is-ecoute');
    micBtn?.setAttribute('aria-label', 'Dicter la question');
  }

  function arreterDictee() {
    const moteur = reco;
    rendreLaMain();
    // `abort` avant `stop` : le premier coupe net, le second attend un dernier
    // résultat qui peut ne jamais venir.
    try { moteur?.abort?.(); } catch { /* moteur déjà parti */ }
    try { moteur?.stop?.(); } catch { /* idem */ }
  }

  function basculerDictee() {
    if (reco) { arreterDictee(); return; }

    try {
      reco = new Dictee();
    } catch {
      toast("La dictée n'est pas disponible ici.");
      rendreLaMain();
      return;
    }
    reco.lang = 'fr-FR';
    reco.interimResults = true;
    reco.continuous = false;

    // Ce qui est déjà écrit n'est pas effacé : on dicte à la suite.
    const debut = champ.value ? `${champ.value.trimEnd()} ` : '';

    reco.onresult = (e) => {
      let dit = '';
      for (let i = e.resultIndex; i < e.results.length; i++) dit += e.results[i][0].transcript;
      champ.value = debut + dit;
      ajusterChamp();
    };
    reco.onerror = (e) => {
      // `not-allowed` : le micro a été refusé. Le dire, plutôt que de laisser
      // croire que le bouton ne marche pas.
      if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
        toast("Le micro n'est pas autorisé pour ce site.");
      } else if (e.error !== 'aborted' && e.error !== 'no-speech') {
        toast("La dictée n'a pas fonctionné.");
      }
      rendreLaMain();
    };
    reco.onend = () => { rendreLaMain(); champ.focus(); };

    compose.classList.add('is-ecoute');
    micBtn?.setAttribute('aria-label', "Arrêter la dictée");

    try {
      reco.start();
    } catch {
      rendreLaMain();
      return;
    }
    // Filet de sécurité : un moteur qui ne signale ni résultat, ni erreur, ni
    // fin laisserait l'écoute allumée pour toujours. Au bout d'une minute, on
    // reprend la main de force.
    veille = setTimeout(() => arreterDictee(), 60000);
  }

  /* ------------------------------------------------------------- bulles */

  function bulle(role, texte) {
    const corps = h('div', { class: 'msg__body', html: format(texte) });
    const enveloppe = h('div', { class: `msg msg--${role}` }, corps);
    if (role === 'assistant') {
      enveloppe.append(h('div', { class: 'msg__tools' }, boutonVoix(() => corps.textContent)));
    }
    return enveloppe;
  }

  /**
   * Le nombre de messages déjà en mémoire à l'ouverture de ce bloc.
   *
   * C'est la frontière entre CE QUE L'IA SAIT et CE QU'ON MONTRE. Les deux ne
   * se confondent pas : la mémoire est globale et durable — l'assistant se
   * souvient de tout ce qu'on lui a dit —, mais un encart ouvert sur le mot
   * « outre-mer » n'a aucune raison d'afficher une discussion sur le Sénat.
   * On venait y lire une définition ; la conversation d'avant repoussait le
   * mot hors de l'écran et il fallait remonter pour le trouver.
   */
  const depart = fil.nombre();

  /**
   * Redessine ce qui est MONTRÉ.
   *
   * En plein écran, c'est toute la conversation : cet écran est fait pour ça.
   * Dans un encart, c'est seulement ce qui s'y est dit depuis son ouverture.
   */
  function dessiner() {
    const messages = fil.messages();
    const montres = forme === 'feuille' ? messages.slice(depart) : messages;
    liste.replaceChildren(...montres.map((m) => bulle(m.role, m.content)));
    if (!montres.length && chips) liste.append(chips);
    onActivite?.();
  }

  const chips = suggestions.length
    ? h('div', { class: 'chips causerie__suggestions' }, suggestions.map((s) => h('button', {
      class: 'chip', type: 'button', text: s, onclick: () => envoyer(s),
    })))
    : null;

  /* ------------------------------------------------------------- envoi */

  async function envoyer(brut) {
    const texte = String(brut || '').trim();
    if (!texte || occupe) return;
    if (reco) reco.stop();

    // Le contexte est collé devant la première question, puis oublié : les
    // tours suivants s'appuient sur l'échange déjà mémorisé.
    const complet = contexteAJoindre
      ? [
        `À propos de : ${contexteAJoindre.sujet}`,
        contexteAJoindre.repere ? `Le passage : « ${contexteAJoindre.repere} »` : null,
        texte,
      ].filter(Boolean).join('\n')
      : texte;
    contexteAJoindre = null;

    champ.value = '';
    ajusterChamp();
    fil.ajouter('user', complet);
    dessiner();

    occupe = true;
    envoiBtn.replaceChildren(icon('cross'));
    envoiBtn.setAttribute('aria-label', 'Arrêter');

    const reponse = bulle('assistant', '');
    const corps = reponse.querySelector('.msg__body');
    corps.replaceChildren(dots());
    liste.append(reponse);
    onActivite?.();

    // L'envoi est arrêté avant d'ouvrir la bulle vide : sinon le dernier
    // message transmis serait ce tour sans contenu, que l'API refuse.
    const envoi = fil.pourEnvoi();
    fil.ajouter('assistant', '');

    controleur = new AbortController();
    let recu = '';
    try {
      const out = await ai.ask({
        system: systemPrompt(),
        messages: envoi,
        signal: controleur.signal,
        onText: (_bout, tout) => {
          recu = tout;
          fil.completerDernier(tout);
          corps.innerHTML = format(tout);
          onActivite?.();
        },
      });
      fil.completerDernier(out.text);
      corps.innerHTML = format(out.text);
    } catch (err) {
      if (err?.name === 'AbortError') {
        if (recu.trim()) {
          fil.completerDernier(recu);
          corps.innerHTML = format(recu);
        } else {
          fil.retirerDernier();
          reponse.remove();
        }
      } else {
        fil.retirerDernier();
        reponse.remove();
        liste.append(h('div', { class: 'msg msg--error' }, [
          h('div', { class: 'msg__body' }, [
            h('p', { text: err.message }),
            /clé|refusée|modèle/i.test(err.message)
              ? h('a', { class: 'btn btn--ghost mt', href: '#/compte/ia', text: 'Ouvrir les réglages' })
              : null,
          ].filter(Boolean)),
        ]));
      }
    } finally {
      occupe = false;
      controleur = null;
      envoiBtn.replaceChildren(icon('play'));
      envoiBtn.setAttribute('aria-label', 'Envoyer');
      onActivite?.();
    }
  }

  function arreter() {
    if (controleur) controleur.abort();
  }

  dessiner();
  root.append(liste, compose);
  // Une fois posé dans la page : le bloc a enfin une hauteur mesurable.
  requestAnimationFrame(() => ajusterChamp());

  /** Écrit une demande sans l'envoyer : on peut encore la corriger. */
  root.preremplir = (texte) => {
    champ.value = texte;
    requestAnimationFrame(() => {
      ajusterChamp();
      champ.focus();
      champ.setSelectionRange(champ.value.length, champ.value.length);
    });
  };
  root.redessiner = dessiner;
  root.hauteurSaisie = () => compose.offsetHeight;
  /** À appeler quand l'écran disparaît : coupe la dictée et la requête. */
  root.stop = () => { arreterDictee(); arreter(); };

  return root;
}
