/**
 * Assistant : appel direct à l'API Claude depuis le navigateur.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *  SÉCURITÉ — à lire avant toute modification
 * ─────────────────────────────────────────────────────────────────────────────
 *  Ce site est un site statique : tout ce qu'il contient est public, y compris
 *  ce fichier. AUCUNE clé d'API ne doit donc jamais être écrite ici, ni dans un
 *  autre fichier du dépôt, ni dans un secret GitHub Actions destiné à être
 *  injecté dans la page — un secret publié dans une page web n'est plus un
 *  secret.
 *
 *  La clé est saisie par l'utilisateur dans l'application et conservée
 *  uniquement dans le `localStorage` de son navigateur. Elle n'est envoyée qu'à
 *  `api.anthropic.com`, jamais à ce site ni à un tiers, et elle est exclue de
 *  l'export de profil comme de la synchronisation.
 *
 *  Le script `scripts/check-secrets.mjs`, lancé avant chaque déploiement,
 *  refuse toute publication si une clé apparaît dans les fichiers suivis.
 * ─────────────────────────────────────────────────────────────────────────────
 */

const STORAGE_KEY = 'examen-civique.assistant';
const ENDPOINT = 'https://api.anthropic.com/v1/messages';
const API_VERSION = '2023-06-01';

/**
 * Modèles proposés. `effort` n'existe pas sur Haiku 4.5 : l'envoyer déclenche
 * une erreur 400, on l'omet donc pour ce modèle.
 */
export const MODELS = {
  'claude-opus-5': {
    id: 'claude-opus-5',
    label: 'Claude Opus 5',
    note: 'Le plus solide sur les questions de droit et d\'histoire. Recommandé.',
    effort: 'low',
    maxTokens: 8000,
  },
  'claude-haiku-4-5': {
    id: 'claude-haiku-4-5',
    label: 'Claude Haiku 4.5',
    note: 'Plus rapide et nettement moins cher, un peu moins précis.',
    effort: null,
    maxTokens: 4000,
  },
};

export const DEFAULT_MODEL = 'claude-opus-5';

/* ------------------------------------------------------------ réglages */

function read() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function write(cfg) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg));
  } catch {
    /* stockage plein ou navigation privée : l'assistant sera simplement à reconfigurer */
  }
}

export function isConfigured() {
  return Boolean(read().key);
}

/** Aperçu non sensible de la clé, pour l'affichage dans les réglages. */
export function keyHint() {
  const k = read().key;
  if (!k) return null;
  return `${k.slice(0, 14)}…${k.slice(-4)}`;
}

export function model() {
  const m = read().model;
  return MODELS[m] ? m : DEFAULT_MODEL;
}

export function setModel(id) {
  if (!MODELS[id]) return;
  write({ ...read(), model: id });
}

/**
 * Enregistre la clé de l'utilisateur. Le format est vérifié pour éviter
 * qu'une valeur collée de travers ne parte vers l'API.
 */
export function setKey(raw) {
  const key = String(raw || '').trim();
  if (!key) throw new Error('Collez votre clé pour continuer.');
  if (!/^sk-ant-[A-Za-z0-9_-]{20,}$/.test(key)) {
    throw new Error("Cette clé n'a pas le format attendu : elle doit commencer par « sk-ant- ».");
  }
  write({ ...read(), key });
}

export function clearKey() {
  const { model: m } = read();
  write(m ? { model: m } : {});
}

/* ------------------------------------------------------------ requête */

/**
 * Envoie une conversation et diffuse la réponse au fil de l'eau.
 *
 * @param {object}   opts
 * @param {Array}    opts.messages  [{ role: 'user'|'assistant', content: string }]
 * @param {string}   opts.system    consigne système
 * @param {Function} opts.onText    appelé à chaque fragment de texte reçu
 * @param {AbortSignal} [opts.signal]
 * @returns {Promise<{text: string, stopReason: string|null}>}
 */
export async function ask({ messages, system, onText, signal }) {
  const cfg = read();
  if (!cfg.key) throw new Error("L'assistant n'est pas configuré.");

  const m = MODELS[model()];
  const body = {
    model: m.id,
    max_tokens: m.maxTokens,
    system,
    messages,
    stream: true,
  };
  // La réflexion adaptative reste active par défaut sur Opus 5 ; on ne la
  // désactive pas. On demande en revanche un effort modéré : les réponses sont
  // courtes et il s'agit d'une conversation, pas d'une démonstration.
  if (m.effort) body.output_config = { effort: m.effort };

  let res;
  try {
    res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': cfg.key,
        'anthropic-version': API_VERSION,
        // Autorise l'appel direct depuis une page web, sans serveur intermédiaire.
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify(body),
      signal,
    });
  } catch (err) {
    if (err?.name === 'AbortError') throw err;
    throw new Error('Impossible de joindre l\'API. Vérifiez votre connexion internet.');
  }

  if (!res.ok) throw new Error(await httpMessage(res));
  if (!res.body) throw new Error('Réponse vide de l\'API.');

  return readStream(res.body, onText);
}

/** Traduit une erreur HTTP en message compréhensible. */
async function httpMessage(res) {
  let detail = '';
  try {
    const payload = await res.json();
    detail = payload?.error?.message || '';
  } catch {
    /* corps illisible : le code suffit */
  }
  switch (res.status) {
    case 400:
      return detail || 'Requête refusée par l\'API.';
    case 401:
      return 'Clé refusée. Vérifiez-la, ou créez-en une nouvelle sur console.anthropic.com.';
    case 403:
      return "Cette clé n'a pas le droit d'utiliser ce modèle.";
    case 404:
      return "Modèle introuvable. Choisissez-en un autre dans les réglages de l'assistant.";
    case 413:
      return 'Message trop long. Reformulez plus court.';
    case 429:
      return 'Trop de demandes d\'un coup, ou crédit épuisé. Réessayez dans un instant.';
    case 500:
    case 529:
      return 'L\'API est momentanément indisponible. Réessayez dans quelques secondes.';
    default:
      return detail || `Erreur ${res.status}.`;
  }
}

/** Lit un flux d'événements SSE et reconstitue le texte de la réponse. */
async function readStream(stream, onText) {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let text = '';
  let stopReason = null;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    // Les événements sont séparés par une ligne vide.
    let cut;
    while ((cut = buffer.indexOf('\n\n')) !== -1) {
      const block = buffer.slice(0, cut);
      buffer = buffer.slice(cut + 2);

      for (const line of block.split('\n')) {
        if (!line.startsWith('data:')) continue;
        const raw = line.slice(5).trim();
        if (!raw || raw === '[DONE]') continue;

        let ev;
        try { ev = JSON.parse(raw); } catch { continue; }

        if (ev.type === 'content_block_delta' && ev.delta?.type === 'text_delta') {
          text += ev.delta.text;
          if (onText) onText(ev.delta.text, text);
        } else if (ev.type === 'message_delta' && ev.delta?.stop_reason) {
          stopReason = ev.delta.stop_reason;
        } else if (ev.type === 'error') {
          throw new Error(ev.error?.message || 'Erreur pendant la réponse.');
        }
      }
    }
  }

  // Un refus arrive avec un code 200 : c'est le motif d'arrêt qui l'indique.
  if (stopReason === 'refusal') {
    throw new Error("L'assistant n'a pas pu répondre à cette demande. Reformulez-la autrement.");
  }
  if (!text.trim()) throw new Error('Aucune réponse reçue. Réessayez.');

  return { text, stopReason };
}
