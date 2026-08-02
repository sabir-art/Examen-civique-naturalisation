/**
 * Assistant et voix : appels directs aux API depuis le navigateur.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *  SÉCURITÉ — à lire avant toute modification
 * ─────────────────────────────────────────────────────────────────────────────
 *  Ce site est statique : tout ce qu'il contient est public, y compris ce
 *  fichier. AUCUNE clé d'API ne doit y être écrite, ni dans un autre fichier du
 *  dépôt, ni injectée à la construction depuis un secret GitHub Actions — un
 *  secret publié dans une page web n'est plus un secret.
 *
 *  Les clés sont saisies par l'utilisateur et conservées uniquement dans le
 *  `localStorage` de son navigateur. Elles ne partent que vers l'API de leur
 *  fournisseur, et sont exclues de l'export de profil comme de la
 *  synchronisation. `scripts/check-secrets.mjs` refuse toute publication si une
 *  clé apparaît dans un fichier suivi par Git.
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Quatre fournisseurs de texte sont gérés. Le fournisseur est deviné à partir
 * de la forme de la clé, puis la liste des modèles est demandée à son API :
 * on n'affiche donc jamais un modèle auquel la clé n'a pas droit.
 */

const STORAGE_KEY = 'examen-civique.assistant';

/* ------------------------------------------------------------ fournisseurs */

/**
 * `stream` reçoit une ligne de données SSE déjà décodée en objet et renvoie
 * le fragment de texte qu'elle contient, ou null.
 */
export const PROVIDERS = {
  anthropic: {
    id: 'anthropic',
    label: 'Claude (Anthropic)',
    console: 'https://console.anthropic.com',
    hint: 'sk-ant-…',
    match: (k) => /^sk-ant-[A-Za-z0-9_-]{20,}$/.test(k),
    fallbackModel: 'claude-opus-5',

    listUrl: 'https://api.anthropic.com/v1/models?limit=200',
    headers: (key) => ({
      'x-api-key': key,
      'anthropic-version': '2023-06-01',
      // Autorise l'appel direct depuis une page web, sans serveur intermédiaire.
      'anthropic-dangerous-direct-browser-access': 'true',
    }),
    parseModels: (json) => (json.data || []).map((m) => ({ id: m.id, label: m.display_name || m.id })),

    chatUrl: () => 'https://api.anthropic.com/v1/messages',
    body: ({ model, system, messages }) => {
      const out = {
        model,
        max_tokens: 8000,
        system,
        messages,
        stream: true,
      };
      // `effort` n'existe pas sur toute la gamme : l'envoyer à un modèle qui ne
      // le connaît pas renvoie une erreur 400. On le réserve aux Opus et Sonnet
      // récents, où il raccourcit utilement les réponses de conversation.
      if (/^claude-(opus|sonnet|fable)-(5|4-[6-9])/.test(model)) out.output_config = { effort: 'low' };
      return out;
    },
    stream: (ev) => {
      if (ev.type === 'content_block_delta' && ev.delta?.type === 'text_delta') return ev.delta.text;
      return null;
    },
    stopReason: (ev) => (ev.type === 'message_delta' ? ev.delta?.stop_reason : null),
  },

  openai: {
    id: 'openai',
    label: 'ChatGPT (OpenAI)',
    console: 'https://platform.openai.com/api-keys',
    hint: 'sk-proj-…',
    match: (k) => /^sk-[A-Za-z0-9_-]{20,}$/.test(k) && !k.startsWith('sk-ant-'),
    fallbackModel: 'gpt-4o',

    listUrl: 'https://api.openai.com/v1/models',
    headers: (key) => ({ authorization: `Bearer ${key}` }),
    parseModels: (json) => (json.data || [])
      // On écarte tout ce qui n'est pas un modèle de conversation : audio,
      // images, plongements, modération.
      .filter((m) => /^(gpt|o[1-9]|chatgpt)/.test(m.id))
      .filter((m) => !/(embed|whisper|tts|audio|image|dall-e|moderation|realtime|transcribe|search)/.test(m.id))
      .map((m) => ({ id: m.id, label: m.id })),

    chatUrl: () => 'https://api.openai.com/v1/chat/completions',
    body: ({ model, system, messages }) => ({
      model,
      // Pas de max_tokens ni de temperature : les modèles de raisonnement les
      // refusent, et les valeurs par défaut conviennent à une conversation.
      messages: [{ role: 'system', content: system }, ...messages],
      stream: true,
    }),
    stream: (ev) => ev.choices?.[0]?.delta?.content || null,
    stopReason: (ev) => ev.choices?.[0]?.finish_reason || null,
  },

  google: {
    id: 'google',
    label: 'Gemini (Google)',
    console: 'https://aistudio.google.com/apikey',
    hint: 'AIza…',
    match: (k) => /^AIza[A-Za-z0-9_-]{30,}$/.test(k),
    fallbackModel: 'gemini-2.0-flash',

    listUrl: (key) => `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(key)}&pageSize=200`,
    headers: () => ({}),
    parseModels: (json) => (json.models || [])
      .filter((m) => (m.supportedGenerationMethods || []).includes('generateContent'))
      .map((m) => ({ id: String(m.name).replace(/^models\//, ''), label: m.displayName || m.name })),

    chatUrl: ({ model, key }) =>
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:streamGenerateContent?alt=sse&key=${encodeURIComponent(key)}`,
    body: ({ system, messages }) => ({
      systemInstruction: { parts: [{ text: system }] },
      contents: messages.map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      })),
    }),
    stream: (ev) => (ev.candidates?.[0]?.content?.parts || []).map((p) => p.text || '').join('') || null,
    stopReason: (ev) => ev.candidates?.[0]?.finishReason || null,
  },

  mistral: {
    id: 'mistral',
    label: 'Mistral',
    console: 'https://console.mistral.ai/api-keys',
    hint: 'clé Mistral',
    match: () => false,   // pas de préfixe distinctif : sélection manuelle
    fallbackModel: 'mistral-large-latest',

    listUrl: 'https://api.mistral.ai/v1/models',
    headers: (key) => ({ authorization: `Bearer ${key}` }),
    parseModels: (json) => (json.data || [])
      .filter((m) => !/(embed|moderation|ocr)/.test(m.id))
      .map((m) => ({ id: m.id, label: m.name || m.id })),

    chatUrl: () => 'https://api.mistral.ai/v1/chat/completions',
    body: ({ model, system, messages }) => ({
      model,
      messages: [{ role: 'system', content: system }, ...messages],
      stream: true,
    }),
    stream: (ev) => ev.choices?.[0]?.delta?.content || null,
    stopReason: (ev) => ev.choices?.[0]?.finish_reason || null,
  },
};

export const PROVIDER_LIST = Object.values(PROVIDERS);

/** Devine le fournisseur à la forme de la clé. Null si le format est inconnu. */
export function detectProvider(key) {
  const k = String(key || '').trim();
  return PROVIDER_LIST.find((p) => p.match(k))?.id || null;
}

/* ---------------------------------------------------------------- réglages */

function read() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    if (!parsed || typeof parsed !== 'object') return {};
    // Ancien format : une seule clé Anthropic à la racine.
    if (parsed.key && !parsed.keys) {
      return { provider: 'anthropic', keys: { anthropic: parsed.key }, models: { anthropic: parsed.model || null } };
    }
    return parsed;
  } catch {
    return {};
  }
}

function write(cfg) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg));
  } catch {
    /* stockage plein ou navigation privée : les réglages seront à ressaisir */
  }
}

/** Fournisseur actif, ou le premier pour lequel une clé est enregistrée. */
export function provider() {
  const cfg = read();
  if (cfg.provider && PROVIDERS[cfg.provider] && cfg.keys?.[cfg.provider]) return cfg.provider;
  return Object.keys(cfg.keys || {}).find((p) => PROVIDERS[p]) || null;
}

export function isConfigured() {
  return Boolean(provider());
}

export function keyOf(providerId) {
  return read().keys?.[providerId] || null;
}

/** Aperçu non sensible d'une clé, pour l'affichage dans les réglages. */
export function keyHint(providerId = provider()) {
  const k = keyOf(providerId);
  return k ? `${k.slice(0, 10)}…${k.slice(-4)}` : null;
}

/**
 * Enregistre une clé. Le fournisseur est déduit de sa forme ; il peut être
 * imposé quand la clé n'a pas de préfixe reconnaissable (Mistral).
 */
export function setKey(rawKey, providerId = null) {
  const key = String(rawKey || '').trim();
  if (!key) throw new Error('Collez une clé pour continuer.');
  const id = providerId || detectProvider(key);
  if (!id) {
    throw new Error("Format de clé non reconnu. Choisissez le fournisseur à la main juste en dessous, puis recollez la clé.");
  }
  if (!PROVIDERS[id]) throw new Error('Fournisseur inconnu.');
  const cfg = read();
  write({ ...cfg, provider: id, keys: { ...(cfg.keys || {}), [id]: key } });
  return id;
}

export function useProvider(id) {
  if (!PROVIDERS[id]) return;
  write({ ...read(), provider: id });
}

export function forgetKey(providerId) {
  const cfg = read();
  const keys = { ...(cfg.keys || {}) };
  const models = { ...(cfg.models || {}) };
  delete keys[providerId];
  delete models[providerId];
  const next = { ...cfg, keys, models };
  if (next.provider === providerId) next.provider = Object.keys(keys)[0] || null;
  write(next);
}

export function model(providerId = provider()) {
  if (!providerId) return null;
  return read().models?.[providerId] || PROVIDERS[providerId].fallbackModel;
}

export function setModel(id, providerId = provider()) {
  if (!providerId || !id) return;
  const cfg = read();
  write({ ...cfg, models: { ...(cfg.models || {}), [providerId]: id } });
}

/** Modèles déjà téléchargés pour ce fournisseur (mémorisés entre les visites). */
export function cachedModels(providerId = provider()) {
  return read().catalog?.[providerId] || null;
}

/**
 * Demande à l'API du fournisseur la liste des modèles auxquels la clé donne
 * droit. Le résultat est mémorisé pour éviter un appel à chaque ouverture.
 */
export async function listModels(providerId = provider()) {
  const p = PROVIDERS[providerId];
  const key = keyOf(providerId);
  if (!p || !key) throw new Error('Aucune clé enregistrée pour ce fournisseur.');

  const url = typeof p.listUrl === 'function' ? p.listUrl(key) : p.listUrl;
  let res;
  try {
    res = await fetch(url, { headers: p.headers(key) });
  } catch {
    throw new Error(`Impossible de joindre ${p.label}. Vérifiez votre connexion.`);
  }
  if (!res.ok) throw new Error(await httpMessage(res, p));

  const json = await res.json();
  const models = p.parseModels(json)
    .filter((m) => m.id)
    .sort((a, b) => a.id.localeCompare(b.id));
  if (!models.length) throw new Error("Cette clé ne donne accès à aucun modèle de conversation.");

  const cfg = read();
  write({ ...cfg, catalog: { ...(cfg.catalog || {}), [providerId]: models } });
  // Si le modèle retenu n'est plus proposé, on repart sur le premier de la liste.
  if (!models.some((m) => m.id === model(providerId))) setModel(models[0].id, providerId);
  return models;
}

/* ------------------------------------------------------------ conversation */

/**
 * Envoie une conversation et diffuse la réponse au fil de l'eau.
 *
 * @param {object}   opts
 * @param {Array}    opts.messages  [{ role: 'user'|'assistant', content: string }]
 * @param {string}   opts.system    consigne système
 * @param {Function} opts.onText    appelé à chaque fragment reçu (fragment, texte complet)
 * @param {AbortSignal} [opts.signal]
 */
export async function ask({ messages, system, onText, signal }) {
  const id = provider();
  if (!id) throw new Error("L'assistant n'est pas configuré.");
  const p = PROVIDERS[id];
  const key = keyOf(id);
  const m = model(id);

  let res;
  try {
    res = await fetch(p.chatUrl({ model: m, key }), {
      method: 'POST',
      headers: { 'content-type': 'application/json', ...p.headers(key) },
      body: JSON.stringify(p.body({ model: m, system, messages })),
      signal,
    });
  } catch (err) {
    if (err?.name === 'AbortError') throw err;
    throw new Error(`Impossible de joindre ${p.label}. Vérifiez votre connexion internet.`);
  }

  if (!res.ok) throw new Error(await httpMessage(res, p));
  if (!res.body) throw new Error('Réponse vide.');

  return readStream(res.body, p, onText);
}

/** Traduit une erreur HTTP en message compréhensible. */
async function httpMessage(res, p) {
  let detail = '';
  try {
    const payload = await res.json();
    detail = payload?.error?.message || payload?.message || payload?.detail || '';
    if (typeof detail === 'object') detail = JSON.stringify(detail);
  } catch {
    /* corps illisible : le code suffit */
  }
  switch (res.status) {
    case 400: return detail || 'Requête refusée par l\'API.';
    case 401:
    case 403:
      return `Clé refusée par ${p.label}. Vérifiez-la, ou créez-en une nouvelle.`;
    case 404: return "Modèle introuvable. Choisissez-en un autre dans les réglages.";
    case 413: return 'Message trop long. Reformulez plus court.';
    case 429: return 'Trop de demandes d\'un coup, ou crédit épuisé. Réessayez dans un instant.';
    case 500:
    case 502:
    case 503:
    case 529:
      return `${p.label} est momentanément indisponible. Réessayez dans quelques secondes.`;
    default: return detail || `Erreur ${res.status}.`;
  }
}

/** Lit un flux d'événements SSE et reconstitue le texte de la réponse. */
async function readStream(stream, p, onText) {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let text = '';
  let stopReason = null;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

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

        if (ev.type === 'error' || ev.error) {
          throw new Error(ev.error?.message || 'Erreur pendant la réponse.');
        }
        const chunk = p.stream(ev);
        if (chunk) { text += chunk; if (onText) onText(chunk, text); }
        const stop = p.stopReason(ev);
        if (stop) stopReason = stop;
      }
    }
  }

  // Un refus arrive avec un code 200 : c'est le motif d'arrêt qui l'indique.
  if (/refusal|safety|blocked|prohibited/i.test(stopReason || '')) {
    throw new Error("L'assistant n'a pas pu répondre à cette demande. Reformulez-la autrement.");
  }
  if (!text.trim()) throw new Error('Aucune réponse reçue. Réessayez.');
  return { text, stopReason };
}

/* ------------------------------------------------------------------- voix */

const TTS_ENDPOINT = 'https://api.elevenlabs.io/v1';
/** Modèle multilingue : indispensable pour une prononciation française correcte. */
const TTS_MODEL = 'eleven_multilingual_v2';

export function voiceConfig() {
  return read().tts || {};
}

export function hasVoiceKey() {
  return Boolean(voiceConfig().key);
}

export function voiceKeyHint() {
  const k = voiceConfig().key;
  return k ? `${k.slice(0, 6)}…${k.slice(-4)}` : null;
}

export function setVoiceKey(rawKey) {
  const key = String(rawKey || '').trim();
  if (!key) throw new Error('Collez votre clé ElevenLabs.');
  const cfg = read();
  write({ ...cfg, tts: { ...(cfg.tts || {}), key } });
}

export function forgetVoiceKey() {
  const cfg = read();
  write({ ...cfg, tts: {} });
}

export function setVoice(voiceId, name) {
  const cfg = read();
  write({ ...cfg, tts: { ...(cfg.tts || {}), voiceId, voiceName: name } });
}

/**
 * Traduit une erreur ElevenLabs en message actionnable.
 *
 * Un 401 ne veut presque jamais dire « clé fausse » : le plus souvent la clé
 * est bonne mais a été créée avec des permissions restreintes, et ElevenLabs
 * le précise dans le corps de la réponse. On relaie donc ce détail, sinon
 * l'utilisateur cherche du mauvais côté.
 */
async function ttsMessage(res) {
  let detail = '';
  let code = '';
  try {
    const payload = await res.json();
    const d = payload?.detail ?? payload;
    code = d?.status || d?.code || '';
    detail = typeof d === 'string' ? d : (d?.message || '');
  } catch {
    /* corps illisible */
  }

  if (res.status === 401 || res.status === 403) {
    if (/permission/i.test(code) || /permission/i.test(detail)) {
      return `Cette clé ElevenLabs n'a pas les droits nécessaires. Sur elevenlabs.io → API Keys, modifiez-la et cochez « Voices : Read » et « Text to Speech ». ${detail}`.trim();
    }
    if (/quota|limit/i.test(code + detail)) return `Quota ElevenLabs atteint. ${detail}`.trim();
    return `Clé ElevenLabs refusée${detail ? ` : ${detail}` : '. Vérifiez-la sur elevenlabs.io → API Keys.'}`;
  }
  if (res.status === 429) return 'Trop de demandes, ou quota épuisé. Réessayez dans un instant.';
  return `ElevenLabs : erreur ${res.status}${detail ? ` — ${detail}` : ''}.`;
}

/** Voix disponibles sur le compte ElevenLabs de l'utilisateur. */
export async function listVoices() {
  const { key } = voiceConfig();
  if (!key) throw new Error('Aucune clé ElevenLabs enregistrée.');
  let res;
  try {
    res = await fetch(`${TTS_ENDPOINT}/voices`, { headers: { 'xi-api-key': key } });
  } catch {
    throw new Error("Impossible de joindre ElevenLabs. Vérifiez votre connexion.");
  }
  if (!res.ok) throw new Error(await ttsMessage(res));
  const json = await res.json();
  return (json.voices || []).map((v) => ({
    id: v.voice_id,
    name: v.name,
    note: [v.labels?.gender, v.labels?.accent, v.labels?.description].filter(Boolean).join(' · '),
  }));
}

/**
 * Vérifie la clé et dit précisément ce qui manque.
 * @returns {Promise<{ok: boolean, message: string}>}
 */
export async function testVoiceKey() {
  const { key } = voiceConfig();
  if (!key) return { ok: false, message: 'Aucune clé enregistrée.' };
  try {
    const res = await fetch(`${TTS_ENDPOINT}/user`, { headers: { 'xi-api-key': key } });
    if (res.ok) {
      const u = await res.json();
      const c = u?.subscription?.character_count;
      const lim = u?.subscription?.character_limit;
      return {
        ok: true,
        message: Number.isFinite(c) && Number.isFinite(lim)
          ? `Clé valide. ${lim - c} caractères restants ce mois-ci.`
          : 'Clé valide.',
      };
    }
    return { ok: false, message: await ttsMessage(res) };
  } catch {
    return { ok: false, message: "Impossible de joindre ElevenLabs. Vérifiez votre connexion." };
  }
}

/**
 * Lit un texte à voix haute.
 *
 * Avec une clé ElevenLabs, la voix est synthétisée par leur API. Sans clé, on
 * se rabat sur la synthèse vocale du téléphone : moins belle, mais gratuite,
 * hors ligne, et déjà présente sur tous les iPhone.
 */
export async function speak(text, { signal } = {}) {
  const clean = String(text || '').trim();
  if (!clean) return null;
  const { key, voiceId } = voiceConfig();

  if (key && voiceId) {
    const res = await fetch(`${TTS_ENDPOINT}/text-to-speech/${encodeURIComponent(voiceId)}`, {
      method: 'POST',
      headers: { 'xi-api-key': key, 'content-type': 'application/json', accept: 'audio/mpeg' },
      body: JSON.stringify({ text: clean, model_id: TTS_MODEL }),
      signal,
    });
    if (!res.ok) throw new Error(await ttsMessage(res));
    const url = URL.createObjectURL(await res.blob());
    const audio = new Audio(url);
    audio.addEventListener('ended', () => URL.revokeObjectURL(url), { once: true });
    try {
      await audio.play();
    } catch {
      // Son audio illisible, ou lecture refusée faute de geste de l'utilisateur :
      // la voix du téléphone permet au moins d'entendre le texte.
      URL.revokeObjectURL(url);
      return speakLocally(clean);
    }
    return audio;
  }

  return speakLocally(clean);
}

/** Synthèse vocale intégrée au téléphone, en français. */
export function speakLocally(text) {
  if (!('speechSynthesis' in window)) {
    throw new Error("Ce navigateur ne sait pas lire de texte à voix haute.");
  }
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'fr-FR';
  u.rate = 0.98;
  const fr = speechSynthesis.getVoices().find((v) => v.lang?.startsWith('fr'));
  if (fr) u.voice = fr;
  speechSynthesis.speak(u);
  return u;
}

export function stopSpeaking() {
  if ('speechSynthesis' in window) speechSynthesis.cancel();
}
