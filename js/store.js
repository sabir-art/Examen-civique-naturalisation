/**
 * Stockage local des comptes et de la progression.
 *
 * Tout est conservé dans le navigateur (localStorage), profil par profil.
 * Aucune donnée n'est envoyée ailleurs, sauf si la synchronisation optionnelle
 * est activée dans les réglages (voir js/sync.js).
 */

import { uid, startOfDay, DAY } from './lib/util.js';

const KEY = 'examen-civique.v1';
const MIRROR = 'examen-civique.v1.backup';

/** Intervalles de la révision espacée (méthode de Leitner), en jours. */
export const BOXES = [0, 0, 1, 3, 7, 16, 35];
export const MAX_BOX = 6;

const listeners = new Set();
let state = load();

/* ------------------------------------------------------------ persistance */

function blank() {
  return { version: 1, activeProfile: null, profiles: {}, cloud: null };
}

function load() {
  for (const key of [KEY, MIRROR]) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) continue;
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object' && parsed.profiles) return migrate(parsed);
    } catch {
      /* entrée illisible : on essaie la copie de secours */
    }
  }
  return blank();
}

function migrate(s) {
  s.version = 1;
  s.profiles = s.profiles || {};
  for (const p of Object.values(s.profiles)) {
    p.progress = p.progress || {};
    p.exams = p.exams || [];
    p.days = p.days || {};
    p.read = p.read || {};
    p.settings = { theme: 'auto', ...(p.settings || {}) };
    // `badgeAt` reste volontairement absent tant qu'il n'a jamais été écrit :
    // c'est ce qui distingue un profil neuf d'un profil dont les badges ont
    // déjà été horodatés (voir stampBadges).
  }
  return s;
}

let saveTimer;
function persist() {
  const payload = JSON.stringify(state);
  try {
    localStorage.setItem(KEY, payload);
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      try { localStorage.setItem(MIRROR, payload); } catch { /* quota : la copie est optionnelle */ }
    }, 1500);
  } catch (err) {
    console.warn('Sauvegarde impossible', err);
  }
  listeners.forEach((fn) => fn(state));
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/* ---------------------------------------------------------------- profils */

export function profiles() {
  return Object.values(state.profiles).sort((a, b) => a.createdAt - b.createdAt);
}

export function current() {
  return state.activeProfile ? state.profiles[state.activeProfile] || null : null;
}

export function createProfile(name, goalDate = null) {
  const id = uid('p');
  state.profiles[id] = {
    id,
    name: (name || '').trim() || 'Mon compte',
    goalDate,
    createdAt: Date.now(),
    progress: {},   // qid -> { box, seen, ok, ko, last, due }
    exams: [],      // historique des examens blancs
    days: {},       // 'AAAA-MM-JJ' -> nombre de questions traitées
    read: {},       // clé de chapitre lu -> horodatage
    badgeAt: {},    // identifiant de badge -> horodatage de l'obtention
    seenAt: Date.now(), // dernière consultation du journal d'activité
    settings: { theme: 'auto' },
  };
  state.activeProfile = id;
  persist();
  return state.profiles[id];
}

export function switchProfile(id) {
  if (!state.profiles[id]) return;
  state.activeProfile = id;
  persist();
}

export function updateProfile(patch) {
  const p = current();
  if (!p) return;
  Object.assign(p, patch);
  persist();
}

export function deleteProfile(id) {
  delete state.profiles[id];
  if (state.activeProfile === id) state.activeProfile = profiles()[0]?.id || null;
  persist();
}

export function setSetting(key, value) {
  const p = current();
  if (!p) return;
  p.settings[key] = value;
  persist();
}

/* ------------------------------------------------------- suivi par question */

export function progressOf(qid) {
  const p = current();
  return p?.progress[qid] || null;
}

/**
 * Enregistre une réponse et met à jour la boîte de révision espacée.
 * Bonne réponse : la question monte d'une boîte et revient plus tard.
 * Mauvaise réponse : retour en boîte 1, à revoir le jour même.
 */
export function recordAnswer(qid, correct) {
  const p = current();
  if (!p) return;
  const now = Date.now();
  const rec = p.progress[qid] || { box: 1, seen: 0, ok: 0, ko: 0, last: 0, due: 0 };
  rec.seen += 1;
  // `lastOk` retient uniquement la dernière réponse. C'est lui qui décide de la
  // présence dans « Mes erreurs » : une question à laquelle on vient de
  // répondre juste en sort immédiatement, ce qui est la seule règle
  // compréhensible sans connaître le fonctionnement des boîtes.
  rec.lastOk = Boolean(correct);
  if (correct) {
    rec.ok += 1;
    rec.box = Math.min(MAX_BOX, rec.box + 1);
  } else {
    rec.ko += 1;
    rec.box = 1;
  }
  rec.last = now;
  rec.due = startOfDay(now) + BOXES[rec.box] * DAY;
  p.progress[qid] = rec;

  const key = dayKey(now);
  p.days[key] = (p.days[key] || 0) + 1;
  persist();
}

export function dayKey(ts = Date.now()) {
  const d = new Date(ts);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** Questions dues aujourd'hui (déjà vues et arrivées à échéance). */
export function dueIds(now = Date.now()) {
  const p = current();
  if (!p) return [];
  const limit = startOfDay(now) + DAY - 1;
  return Object.entries(p.progress)
    .filter(([, r]) => r.due <= limit)
    .sort((a, b) => a[1].due - b[1].due || a[1].box - b[1].box)
    .map(([id]) => id);
}

/**
 * Questions dont la DERNIÈRE réponse était fausse.
 *
 * Règle volontairement simple : on répond juste, la question sort de la liste ;
 * on répond faux, elle y entre. L'ancienne version gardait aussi les questions
 * encore dans les premières boîtes de révision, si bien qu'après une bonne
 * réponse certaines partaient et d'autres restaient sans raison visible.
 */
export function weakIds() {
  const p = current();
  if (!p) return [];
  return Object.entries(p.progress)
    .filter(([, r]) => (r.lastOk === undefined ? r.ko > 0 && r.box <= 2 : r.lastOk === false))
    .sort((a, b) => b[1].ko - a[1].ko || a[1].box - b[1].box)
    .map(([id]) => id);
}

/* -------------------------------------------------------- lecture suivie */

/** Marque un chapitre comme lu (récit, livret…). */
export function markRead(key) {
  const p = current();
  if (!p || !key) return;
  p.read = p.read || {};
  if (p.read[key]) return;
  p.read[key] = Date.now();
  persist();
}

export function isRead(key) {
  return Boolean(current()?.read?.[key]);
}

/** Nombre de clés lues parmi celles fournies. */
export function readCount(keys) {
  const read = current()?.read || {};
  return keys.filter((k) => read[k]).length;
}

/* --------------------------------------------------- badges et activité */

/**
 * Horodate les badges nouvellement obtenus et renvoie ceux qui viennent de
 * l'être.
 *
 * Les badges eux-mêmes restent calculés (js/lib/xp.js) : seule la DATE
 * d'obtention est conservée, parce qu'elle ne se déduit d'aucune donnée.
 *
 * Le premier appel sur un profil existant — ou sur une sauvegarde importée —
 * horodate en silence : sans cela, quelqu'un qui a déjà beaucoup travaillé
 * verrait quinze badges « obtenus à l'instant » à la première ouverture.
 */
export function stampBadges(ids) {
  const p = current();
  if (!p) return [];
  const premierPassage = p.badgeAt === undefined;
  p.badgeAt = p.badgeAt || {};
  const nouveaux = ids.filter((id) => !p.badgeAt[id]);
  if (!nouveaux.length) return [];
  const now = Date.now();
  for (const id of nouveaux) p.badgeAt[id] = now;
  if (premierPassage) {
    // Ce lot-là n'a pas été gagné maintenant : il était déjà acquis avant que
    // l'application ne sache dater les badges. On retient l'instant du
    // rattrapage pour pouvoir écrire « obtenu » au lieu d'une fausse date.
    p.badgeBase = now;
    p.seenAt = now;
  }
  persist();
  return premierPassage ? [] : nouveaux;
}

export function badgeDates() {
  return current()?.badgeAt || {};
}

/**
 * Vrai si la date enregistrée pour ce badge est celle du rattrapage initial,
 * donc sans rapport avec le moment où il a réellement été obtenu.
 */
export function badgeDateInconnue(id) {
  const p = current();
  return Boolean(p?.badgeBase && p.badgeAt?.[id] === p.badgeBase);
}

/** Horodatage de la dernière consultation du journal d'activité. */
export function activitySeenAt() {
  return current()?.seenAt || 0;
}

export function markActivitySeen() {
  const p = current();
  if (!p) return;
  p.seenAt = Date.now();
  persist();
}

/* ------------------------------------------------------------- examens */

export function saveExam(result) {
  const p = current();
  if (!p) return;
  p.exams.unshift(result);
  p.exams = p.exams.slice(0, 60);
  persist();
}

export function exams() {
  return current()?.exams || [];
}

/* ------------------------------------------------------------ assiduité */

/** Nombre de jours consécutifs de révision, aujourd'hui inclus s'il y a lieu. */
export function streak() {
  const p = current();
  if (!p) return 0;
  let n = 0;
  let cursor = startOfDay();
  if (!p.days[dayKey(cursor)]) cursor -= DAY;         // la journée en cours peut être vide
  while (p.days[dayKey(cursor)]) { n += 1; cursor -= DAY; }
  return n;
}

export function answeredToday() {
  const p = current();
  return p?.days[dayKey()] || 0;
}

/* ------------------------------------------------------ export / import */

export function exportPayload() {
  const p = current();
  if (!p) return null;
  return {
    format: 'examen-civique/profil',
    version: 1,
    exportedAt: new Date().toISOString(),
    profile: p,
  };
}

/** Importe une sauvegarde. `mode` vaut 'nouveau' ou 'remplacer'. */
export function importPayload(payload, mode = 'nouveau') {
  const incoming = payload?.profile;
  if (!incoming || typeof incoming !== 'object' || !incoming.progress) {
    throw new Error("Ce fichier n'est pas une sauvegarde valide.");
  }
  if (mode === 'remplacer' && current()) {
    const p = current();
    Object.assign(p, { ...incoming, id: p.id });
  } else {
    const id = uid('p');
    state.profiles[id] = { ...incoming, id, name: `${incoming.name || 'Compte'} (importé)`, createdAt: Date.now() };
    state.activeProfile = id;
  }
  persist();
}

/** Remplace la progression du profil courant (utilisé par la synchronisation). */
export function replaceCurrentProfileData(data) {
  const p = current();
  if (!p || !data) return;
  p.progress = data.progress || {};
  p.exams = data.exams || [];
  p.days = data.days || {};
  p.read = data.read || {};
  p.badgeAt = data.badgeAt || {};
  p.badgeBase = data.badgeBase;
  if (data.goalDate !== undefined) p.goalDate = data.goalDate;
  persist();
}

/* --------------------------------------------------- réglages de synchro */

export function cloudConfig() {
  return state.cloud;
}

export function setCloudConfig(cfg) {
  state.cloud = cfg;
  persist();
}

export function resetProgress() {
  const p = current();
  if (!p) return;
  p.progress = {};
  p.exams = [];
  p.days = {};
  p.read = {};
  p.badgeAt = {};
  delete p.badgeBase;
  p.seenAt = Date.now();
  persist();
}
