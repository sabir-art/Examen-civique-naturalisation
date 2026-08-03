/**
 * Synchronisation cloud optionnelle (Supabase).
 *
 * Entièrement facultative : l'application fonctionne sans. Activée, elle permet
 * de retrouver sa progression sur un autre téléphone ou après une réinstallation.
 * La configuration (adresse du projet et clé publique) est saisie par
 * l'utilisateur dans les réglages ; aucune clé n'est incluse dans le code.
 *
 * Table attendue côté Supabase (le SQL figure dans le README) :
 *   progression(user_id uuid primary key, data jsonb, updated_at timestamptz)
 */

import * as store from './store.js';

const TABLE = 'progression';

export function config() {
  return store.cloudConfig();
}

export function isConfigured() {
  const c = config();
  return Boolean(c?.url && c?.anonKey);
}

export function isSignedIn() {
  const c = config();
  return Boolean(c?.accessToken && c?.userId);
}

export function accountEmail() {
  return config()?.email || null;
}

export function configure({ url, anonKey }) {
  const clean = String(url || '').trim().replace(/\/+$/, '');
  if (!/^https:\/\/.+/.test(clean)) throw new Error("L'adresse du projet doit commencer par https://");
  if (!String(anonKey || '').trim()) throw new Error('La clé publique est obligatoire.');
  store.setCloudConfig({ ...(config() || {}), url: clean, anonKey: String(anonKey).trim() });
}

export function forget() {
  store.setCloudConfig(null);
}

export function signOut() {
  const c = config();
  if (!c) return;
  store.setCloudConfig({ url: c.url, anonKey: c.anonKey });
}

/* --------------------------------------------------------------- réseau */

async function call(path, { method = 'GET', body, auth = true, headers = {} } = {}) {
  const c = config();
  if (!c) throw new Error('La synchronisation n\'est pas configurée.');

  const h = { apikey: c.anonKey, 'Content-Type': 'application/json', ...headers };
  if (auth && c.accessToken) h.Authorization = `Bearer ${c.accessToken}`;

  const res = await fetch(`${c.url}${path}`, {
    method,
    headers: h,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (res.status === 401 && auth && c.refreshToken) {
    const refreshed = await refresh();
    if (refreshed) return call(path, { method, body, auth, headers });
  }

  const text = await res.text();
  const payload = text ? safeJson(text) : null;
  if (!res.ok) {
    throw new Error(payload?.error_description || payload?.msg || payload?.message || `Erreur ${res.status}`);
  }
  return payload;
}

function safeJson(text) {
  try { return JSON.parse(text); } catch { return null; }
}

function saveSession(session, email) {
  const c = config();
  store.setCloudConfig({
    ...c,
    email: email || session?.user?.email || c.email,
    userId: session?.user?.id || c.userId,
    accessToken: session?.access_token,
    refreshToken: session?.refresh_token,
  });
}

async function refresh() {
  const c = config();
  try {
    const session = await call(`/auth/v1/token?grant_type=refresh_token`, {
      method: 'POST',
      auth: false,
      body: { refresh_token: c.refreshToken },
    });
    if (session?.access_token) { saveSession(session); return true; }
  } catch { /* session expirée : nouvelle connexion nécessaire */ }
  return false;
}

/* ----------------------------------------------------------- comptes */

export async function signUp(email, password) {
  const out = await call('/auth/v1/signup', { method: 'POST', auth: false, body: { email, password } });
  if (out?.access_token) { saveSession(out, email); return { signedIn: true }; }
  // Le projet demande une confirmation par courriel avant la première connexion.
  return { signedIn: false, needsConfirmation: true };
}

export async function signIn(email, password) {
  const session = await call('/auth/v1/token?grant_type=password', {
    method: 'POST', auth: false, body: { email, password },
  });
  if (!session?.access_token) throw new Error('Connexion impossible.');
  saveSession(session, email);
  return true;
}

/* ------------------------------------------------------ envoi / réception */

export async function push() {
  const c = config();
  if (!isSignedIn()) throw new Error('Connectez-vous d\'abord.');
  const p = store.current();
  const data = {
    name: p.name,
    goalDate: p.goalDate,
    progress: p.progress,
    exams: p.exams,
    days: p.days,
    read: p.read,
    badgeAt: p.badgeAt,
    badgeBase: p.badgeBase,
  };
  // La clé de l'assistant n'est volontairement pas transmise : elle reste
  // sur l'appareil où elle a été saisie.
  await call(`/rest/v1/${TABLE}`, {
    method: 'POST',
    headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
    body: { user_id: c.userId, data, updated_at: new Date().toISOString() },
  });
  store.setCloudConfig({ ...config(), lastSync: Date.now() });
  return true;
}

export async function pull() {
  const c = config();
  if (!isSignedIn()) throw new Error('Connectez-vous d\'abord.');
  const rows = await call(`/rest/v1/${TABLE}?select=data,updated_at&user_id=eq.${encodeURIComponent(c.userId)}`);
  const row = Array.isArray(rows) ? rows[0] : null;
  if (!row?.data) return null;
  store.replaceCurrentProfileData(row.data);
  store.setCloudConfig({ ...config(), lastSync: Date.now() });
  return row.updated_at;
}

/** Nombre de réponses enregistrées, pour comparer local et distant. */
export function localWeight() {
  const p = store.current();
  if (!p) return 0;
  return Object.keys(p.progress || {}).length + (p.exams?.length || 0) * 10;
}
