/**
 * La mémoire de l'assistant.
 *
 * Une seule conversation, qui suit la personne d'un écran à l'autre et d'un
 * jour au suivant : on peut lui demander quelque chose en lisant un chapitre,
 * fermer l'application, revenir le lendemain et poursuivre. Sans cela, chaque
 * question repartait de zéro et il fallait tout réexpliquer à chaque fois.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *  Où cela vit, et pourquoi
 * ─────────────────────────────────────────────────────────────────────────────
 *  Dans le `localStorage` de ce navigateur, sous une clé à part — jamais dans
 *  le profil. Le profil s'exporte en fichier et se synchronise ; une
 *  conversation, non. Ce qu'on demande à un professeur particulier ne regarde
 *  personne d'autre, et cela ne doit pas partir dans une sauvegarde qu'on
 *  transmet ou qu'on dépose sur un serveur.
 *
 *  La conversation part en revanche vers l'API du fournisseur choisi, comme
 *  toute question posée à une IA : c'est la condition pour qu'elle se souvienne
 *  de ce qui précède.
 * ─────────────────────────────────────────────────────────────────────────────
 */

const CLE = 'examen-civique.assistant.conversation';

/**
 * Ce qu'on garde sur le téléphone, et ce qu'on renvoie à l'IA.
 *
 * `GARDE` borne le stockage : une conversation qu'on ne vide jamais finirait
 * par peser lourd dans un espace de quelques mégaoctets.
 *
 * `RAPPEL` borne ce qu'on renvoie à chaque question. Tout renvoyer ferait
 * grossir la facture à chaque tour — c'est l'utilisateur qui paie sa propre
 * clé — et finirait par dépasser ce que le modèle accepte. Vingt messages,
 * soit une dizaine d'échanges, suffisent à tenir le fil d'une explication.
 */
const GARDE = 120;
const RAPPEL = 20;

let cache = null;

function charger() {
  if (cache) return cache;
  try {
    const brut = localStorage.getItem(CLE);
    const lu = brut ? JSON.parse(brut) : null;
    cache = Array.isArray(lu) ? lu.filter(estUnMessage) : [];
  } catch {
    // Stockage illisible ou refusé (navigation privée sur certains
    // navigateurs) : l'assistant marche encore, il oublie simplement.
    cache = [];
  }
  return cache;
}

function estUnMessage(m) {
  return m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string';
}

function ecrire() {
  try {
    localStorage.setItem(CLE, JSON.stringify(cache));
  } catch {
    /* Quota atteint ou écriture refusée : on garde la conversation en mémoire
       pour la session en cours plutôt que de faire échouer l'envoi. */
  }
}

/** Toute la conversation, du plus ancien au plus récent. */
export function messages() {
  return charger().slice();
}

export function estVide() {
  return charger().length === 0;
}

export function nombre() {
  return charger().length;
}

/** Ajoute un message et le conserve. */
export function ajouter(role, content) {
  const liste = charger();
  liste.push({ role, content, at: Date.now() });
  if (liste.length > GARDE) liste.splice(0, liste.length - GARDE);
  ecrire();
}

/**
 * Remplace le contenu du dernier message.
 *
 * Sert à la réponse qui s'écrit au fil de l'eau : on l'inscrit dès le premier
 * fragment, pour qu'une réponse interrompue ne soit pas perdue, puis on la
 * complète.
 */
export function completerDernier(content) {
  const liste = charger();
  if (!liste.length) return;
  liste[liste.length - 1].content = content;
  ecrire();
}

/** Retire le dernier message — une réponse avortée sans un mot écrit. */
export function retirerDernier() {
  const liste = charger();
  liste.pop();
  ecrire();
}

/** Vide la conversation. Le seul moyen de faire oublier. */
export function effacer() {
  cache = [];
  try { localStorage.removeItem(CLE); } catch { /* rien à faire */ }
}

/** Les derniers échanges, dans la forme attendue par l'API. */
export function pourEnvoi() {
  return charger().slice(-RAPPEL).map((m) => ({ role: m.role, content: m.content }));
}
