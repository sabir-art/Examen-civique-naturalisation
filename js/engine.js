/**
 * Moteur de tirage et de mesure de la progression.
 *
 * - `buildExam()` compose un examen blanc respectant la répartition officielle.
 * - `buildTraining()` compose une série d'entraînement ou de révision.
 * - `mastery()` / `readiness()` estiment le niveau de préparation.
 */

import { QUESTIONS, BY_ID, pool } from './data/questions.js';
import { BLUEPRINT, THEMES, EXAM, blueprintCount } from './data/programme.js';
import { shuffle, sample, pct } from './lib/util.js';
import * as store from './store.js';

/**
 * Prépare une question pour l'affichage : les propositions sont mélangées
 * pour que la bonne réponse ne soit jamais à la même place.
 */
export function toCard(q) {
  const order = shuffle(q.c.map((_, i) => i));
  return {
    id: q.id,
    q,
    choices: order.map((i) => q.c[i]),
    correct: order.indexOf(q.a),
  };
}

/** Compose un examen blanc de 40 questions conforme au plan officiel. */
export function buildExam() {
  const picked = [];
  const used = new Set();

  for (const line of BLUEPRINT) {
    const candidates = pool({ theme: line.theme, subs: line.subs, type: line.type })
      .filter((q) => !used.has(q.id));
    let chosen = sample(candidates, line.n);

    // Filet de sécurité si un sous-thème venait à manquer de questions.
    if (chosen.length < line.n) {
      const extra = pool({ theme: line.theme, type: line.type })
        .filter((q) => !used.has(q.id) && !chosen.includes(q));
      chosen = chosen.concat(sample(extra, line.n - chosen.length));
    }
    chosen.forEach((q) => used.add(q.id));
    picked.push(...chosen);
  }

  return shuffle(picked).map(toCard);
}

/**
 * Compose une série d'entraînement.
 * mode : 'theme' | 'revision' | 'erreurs' | 'examen-erreurs'
 */
export function buildTraining({ mode = 'theme', theme = null, sub = null, count = 20, ids = null } = {}) {
  if (ids) {
    return ids.map((id) => BY_ID.get(id)).filter(Boolean).slice(0, count).map(toCard);
  }

  if (mode === 'revision') {
    const due = store.dueIds().map((id) => BY_ID.get(id)).filter(Boolean);
    if (due.length >= count) return due.slice(0, count).map(toCard);
    // On complète avec des questions jamais vues, thème le moins travaillé d'abord.
    const fresh = unseen().sort((a, b) => themeGap(b.theme) - themeGap(a.theme));
    return due.concat(fresh.slice(0, count - due.length)).map(toCard);
  }

  if (mode === 'erreurs') {
    return store.weakIds().map((id) => BY_ID.get(id)).filter(Boolean).slice(0, count).map(toCard);
  }

  const candidates = pool({ theme, sub });
  // Priorité : jamais vues, puis dues, puis le reste — le tout mélangé dans chaque groupe.
  const never = [];
  const due = [];
  const rest = [];
  const now = Date.now();
  for (const q of candidates) {
    const r = store.progressOf(q.id);
    if (!r) never.push(q);
    else if (r.due <= now) due.push(q);
    else rest.push(q);
  }
  const ordered = [...shuffle(never), ...shuffle(due), ...shuffle(rest)];
  return ordered.slice(0, count).map(toCard);
}

function unseen() {
  return QUESTIONS.filter((q) => !store.progressOf(q.id));
}

function themeGap(theme) {
  return blueprintCount(theme) * (1 - mastery(theme));
}

/* ------------------------------------------------------------- niveaux */

function scoreOf(qid) {
  const r = store.progressOf(qid);
  if (!r) return 0;
  return Math.max(0, Math.min(1, (r.box - 1) / (store.MAX_BOX - 1)));
}

/** Maîtrise d'un thème (0 à 1). Sans argument : maîtrise globale de la banque. */
export function mastery(theme = null) {
  const qs = theme ? pool({ theme }) : QUESTIONS;
  if (!qs.length) return 0;
  return qs.reduce((s, q) => s + scoreOf(q.id), 0) / qs.length;
}

/** Couverture : part des questions du thème déjà rencontrées au moins une fois. */
export function coverage(theme = null) {
  const qs = theme ? pool({ theme }) : QUESTIONS;
  if (!qs.length) return 0;
  return qs.filter((q) => store.progressOf(q.id)).length / qs.length;
}

/**
 * Indicateur de préparation (0 à 100).
 * Combine la maîtrise pondérée par le poids de chaque thème à l'examen et,
 * si des examens blancs ont été passés, les résultats récents.
 */
export function readiness() {
  let weighted = 0;
  for (const key of Object.keys(THEMES)) {
    weighted += mastery(key) * (blueprintCount(key) / EXAM.questions);
  }
  const base = weighted * 100;

  const recent = store.exams().slice(0, 3);
  if (!recent.length) return Math.round(base);

  const avg = recent.reduce((s, e) => s + (e.score / e.total) * 100, 0) / recent.length;
  return Math.round(base * 0.55 + avg * 0.45);
}

/** Statistiques par thème pour l'écran de progression. */
export function themeStats() {
  return Object.entries(THEMES).map(([key, t]) => {
    const qs = pool({ theme: key });
    const seen = qs.filter((q) => store.progressOf(q.id));
    const ok = seen.reduce((s, q) => s + (store.progressOf(q.id)?.ok || 0), 0);
    const ko = seen.reduce((s, q) => s + (store.progressOf(q.id)?.ko || 0), 0);
    return {
      key,
      label: t.short,
      full: t.label,
      total: qs.length,
      seen: seen.length,
      mastery: mastery(key),
      accuracy: ok + ko > 0 ? ok / (ok + ko) : null,
      drawn: blueprintCount(key),
    };
  });
}

/** Chiffres-clés globaux. */
export function overview() {
  const all = QUESTIONS.length;
  let seen = 0, ok = 0, ko = 0, mastered = 0;
  for (const q of QUESTIONS) {
    const r = store.progressOf(q.id);
    if (!r) continue;
    seen += 1;
    ok += r.ok;
    ko += r.ko;
    if (r.box >= store.MAX_BOX - 1) mastered += 1;
  }
  const list = store.exams();
  const passed = list.filter((e) => e.score >= EXAM.passing).length;
  return {
    bankSize: all,
    seen,
    mastered,
    answers: ok + ko,
    accuracy: ok + ko > 0 ? pct(ok, ok + ko) : null,
    exams: list.length,
    passed,
    best: list.length ? Math.max(...list.map((e) => e.score)) : null,
    last: list[0] || null,
    due: store.dueIds().length,
    weak: store.weakIds().length,
  };
}

/** Message d'orientation affiché sur l'accueil. */
export function advice() {
  const o = overview();
  const r = readiness();
  if (o.answers === 0) {
    return { tone: 'brand', text: "Commencez par un entraînement par thème pour découvrir les questions, puis passez un premier examen blanc." };
  }
  if (o.due > 0) {
    return { tone: 'warn', text: `${o.due} question${o.due > 1 ? 's' : ''} à revoir aujourd'hui : c'est la révision qui ancre les réponses durablement.` };
  }
  if (o.weak > 5) {
    return { tone: 'warn', text: `Vous avez ${o.weak} questions encore fragiles. Le mode « Mes erreurs » les reprend en priorité.` };
  }
  if (r >= 85) {
    return { tone: 'ok', text: "Votre niveau est solide. Enchaînez des examens blancs complets pour tenir les 45 minutes sans faiblir." };
  }
  if (r >= 60) {
    return { tone: 'brand', text: "Bonne progression. Ciblez maintenant les thèmes dont la barre est la plus courte dans l'onglet Progrès." };
  }
  return { tone: 'brand', text: "Continuez l'entraînement thème par thème : chaque question vue une deuxième fois compte double." };
}

export { EXAM, THEMES };
