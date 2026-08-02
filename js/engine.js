/**
 * Moteur de tirage et de mesure de la progression.
 *
 * - `buildExam()` compose un examen blanc respectant la répartition officielle.
 * - `buildTraining()` compose une série d'entraînement ou de révision.
 * - `mastery()` / `readiness()` estiment le niveau de préparation.
 */

import { QUESTIONS, BY_ID, pool } from './data/questions.js';
import { BLUEPRINT, THEMES, EXAM, blueprintCount } from './data/programme.js';
import { LIVRET_QUESTIONS, LIVRET_BY_ID, questionsOf } from './data/q-livret.js';
import { CHAPITRES, CHAPITRE_BY_KEY } from './data/livret.js';
import {
  ROMAN_QUESTIONS, ROMAN_BY_ID, CHAPITRES as ROMAN_CHAPITRES,
  CHAPITRE_BY_KEY as ROMAN_BY_KEY, questionsOf as romanQuestionsOf, questionsOfActe,
} from './data/roman.js';
import { shuffle, sample, pct } from './lib/util.js';
import * as store from './store.js';

/**
 * Prépare une question pour l'affichage : les propositions sont mélangées
 * pour que la bonne réponse ne soit jamais à la même place.
 */
export function toCard(q, { group = null } = {}) {
  const order = shuffle(q.c.map((_, i) => i));
  let tags;
  if (q.source === 'livret') {
    tags = [
      { text: 'Livret du citoyen', tone: 'brand' },
      { text: CHAPITRE_BY_KEY.get(q.chapter)?.title || 'Chapitre', tone: null },
    ];
  } else if (q.source === 'roman') {
    tags = [
      { text: 'La France racontée', tone: 'brand' },
      { text: ROMAN_BY_KEY.get(q.chapitre)?.titre || 'Chapitre', tone: null },
    ];
  } else {
    tags = [
      { text: THEMES[q.theme]?.short || 'Question', tone: 'brand' },
      { text: q.type === 'situation' ? 'Mise en situation' : 'Connaissances', tone: null },
    ];
  }
  return {
    id: q.id,
    q,
    tags,
    group: group || q.chapter || q.chapitre || q.theme,
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
 * Examen blanc tiré du seul livret du citoyen.
 * Même pondération officielle par thème, mais les questions proviennent
 * uniquement du document du ministère : chaque partie du livret alimente le
 * thème correspondant du référentiel.
 */
const LIVRET_BLUEPRINT = [
  { parts: ['p1'], n: 11 },
  { parts: ['p2'], n: 6 },
  { parts: ['p3', 'annexes'], n: 11 },
  { parts: ['p4'], n: 8 },
  { parts: ['p5'], n: 4 },
];

const CHAPTER_TO_PART = new Map(CHAPITRES.map((c) => [c.key, c.partieKey]));

export function buildExamLivret() {
  const picked = [];
  const used = new Set();

  for (const line of LIVRET_BLUEPRINT) {
    const candidates = LIVRET_QUESTIONS.filter(
      (q) => line.parts.includes(CHAPTER_TO_PART.get(q.chapter)) && !used.has(q.id),
    );
    const chosen = sample(candidates, line.n);
    chosen.forEach((q) => used.add(q.id));
    picked.push(...chosen.map((q) => [q, line.parts[0]]));
  }

  return shuffle(picked).map(([q, part]) => toCard(q, { group: part }));
}

/** Examen blanc entièrement aléatoire, tiré des deux banques réunies. */
export function buildExamMixte() {
  return sample([...QUESTIONS, ...LIVRET_QUESTIONS], EXAM.questions).map((q) => toCard(q));
}

/** Les trois formats d'examen blanc proposés. */
export const EXAM_MODES = {
  officiel: {
    key: 'officiel',
    title: 'Examen officiel',
    short: 'Officiel',
    icon: 'clock',
    accent: true,
    blurb: "Le format de l'épreuve réelle : tirage conforme à la répartition fixée par l'arrêté du 10 octobre 2025.",
    source: () => `${QUESTIONS.length} questions d'entraînement`,
    details: [
      '11 principes et valeurs, dont 6 mises en situation',
      '11 droits et devoirs, dont 6 mises en situation',
      '8 histoire, géographie et culture',
      '6 système institutionnel, 4 vivre en société',
    ],
    build: buildExam,
  },
  livret: {
    key: 'livret',
    title: 'Examen « livret du citoyen »',
    short: 'Livret',
    icon: 'star',
    blurb: "Uniquement des questions tirées du livret officiel du ministère, avec la même pondération par thème.",
    source: () => `${LIVRET_QUESTIONS.length} questions issues du livret`,
    details: [
      'Partie 1 : 11 questions · Partie 2 : 6 questions',
      'Partie 3 et annexes : 11 · Partie 4 : 8',
      'Partie 5 : 4 questions',
      'Pour vérifier que le document officiel est acquis',
    ],
    build: buildExamLivret,
  },
  mixte: {
    key: 'mixte',
    title: 'Examen aléatoire',
    short: 'Aléatoire',
    icon: 'refresh',
    blurb: "40 questions tirées au hasard dans les deux banques réunies, sans répartition imposée.",
    source: () => `${QUESTIONS.length + LIVRET_QUESTIONS.length} questions au total`,
    details: [
      'Aucune contrainte de thème : la composition change à chaque tirage',
      'Le plus exigeant des trois formats',
      'Utile pour ne rien laisser de côté avant le jour J',
    ],
    build: buildExamMixte,
  },
};

export const EXAM_MODE_LIST = Object.values(EXAM_MODES);

/** Mode d'un résultat enregistré (les anciens examens n'en portaient pas). */
export const modeOf = (exam) => (EXAM_MODES[exam?.mode] ? exam.mode : 'officiel');

/**
 * Compose une série d'entraînement.
 * mode : 'theme' | 'revision' | 'erreurs' | 'examen-erreurs'
 */
export function buildTraining({ mode = 'theme', theme = null, sub = null, count = 20, ids = null } = {}) {
  if (ids) {
    // Les trois banques sont acceptées : la reprise des erreurs sert aussi
    // aux séries du livret et du récit.
    return ids.map((id) => findQuestion(id)).filter(Boolean).slice(0, count).map((q) => toCard(q));
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

  // Seuls les examens au format officiel entrent dans l'estimation : les
  // formats « livret » et « aléatoire » n'ont pas la composition de l'épreuve.
  const recent = store.exams().filter((e) => modeOf(e) === 'officiel').slice(0, 3);
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

/* ------------------------------------------------- livret du citoyen ---- */

/**
 * Série de questions portant sur le livret officiel.
 * Banque distincte de celle des examens blancs : elle sert à vérifier
 * chapitre par chapitre la maîtrise du document du ministère.
 */
export function buildLivretSet({ chapter = null, count = 15 } = {}) {
  const candidates = chapter ? questionsOf(chapter) : LIVRET_QUESTIONS;
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
  return [...shuffle(never), ...shuffle(due), ...shuffle(rest)].slice(0, count).map(toCard);
}

/** Maîtrise d'un chapitre du livret (0 à 1). Sans argument : livret entier. */
export function livretMastery(chapter = null) {
  const qs = chapter ? questionsOf(chapter) : LIVRET_QUESTIONS;
  if (!qs.length) return 0;
  return qs.reduce((s, q) => s + scoreOf(q.id), 0) / qs.length;
}

/** Chiffres-clés de la partie livret. */
export function livretOverview() {
  let seen = 0, ok = 0, ko = 0, due = 0;
  const now = Date.now();
  for (const q of LIVRET_QUESTIONS) {
    const r = store.progressOf(q.id);
    if (!r) continue;
    seen += 1;
    ok += r.ok;
    ko += r.ko;
    if (r.due <= now) due += 1;
  }
  return {
    total: LIVRET_QUESTIONS.length,
    chapters: CHAPITRES.length,
    seen,
    due,
    accuracy: ok + ko > 0 ? pct(ok, ok + ko) : null,
    mastery: Math.round(livretMastery() * 100),
  };
}

/* ------------------------------------------------- la France racontée ---- */

/**
 * Questions du récit. Troisième banque, indépendante des deux autres :
 * elles vérifient ce qui a été retenu d'un chapitre qu'on vient de lire.
 */
export function buildRomanSet({ chapitre = null, acte = null, count = 20 } = {}) {
  let candidates = ROMAN_QUESTIONS;
  if (chapitre) candidates = romanQuestionsOf(chapitre);
  else if (acte) candidates = questionsOfActe(acte);

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
  return [...shuffle(never), ...shuffle(due), ...shuffle(rest)].slice(0, count).map((q) => toCard(q));
}

/** Maîtrise d'un chapitre du récit (0 à 1). Sans argument : récit entier. */
export function romanMastery(chapitre = null) {
  const qs = chapitre ? romanQuestionsOf(chapitre) : ROMAN_QUESTIONS;
  if (!qs.length) return 0;
  return qs.reduce((s, q) => s + scoreOf(q.id), 0) / qs.length;
}

export function romanActeMastery(acteKey) {
  const qs = questionsOfActe(acteKey);
  if (!qs.length) return 0;
  return qs.reduce((s, q) => s + scoreOf(q.id), 0) / qs.length;
}

/** Chiffres-clés de la partie récit, lecture comprise. */
export function romanOverview() {
  let seen = 0, ok = 0, ko = 0, due = 0;
  const now = Date.now();
  for (const q of ROMAN_QUESTIONS) {
    const r = store.progressOf(q.id);
    if (!r) continue;
    seen += 1;
    ok += r.ok;
    ko += r.ko;
    if (r.due <= now) due += 1;
  }
  const keys = ROMAN_CHAPITRES.map((c) => c.key);
  const lus = store.readCount(keys);
  return {
    total: ROMAN_QUESTIONS.length,
    chapitres: keys.length,
    lus,
    seen,
    due,
    accuracy: ok + ko > 0 ? pct(ok, ok + ko) : null,
    mastery: Math.round(romanMastery() * 100),
  };
}

/** Premier chapitre non lu — celui que l'on propose de reprendre. */
export function nextUnread() {
  return ROMAN_CHAPITRES.find((c) => !store.isRead(c.key)) || null;
}

/** Recherche d'une question dans l'une des trois banques. */
export function findQuestion(id) {
  return BY_ID.get(id) || LIVRET_BY_ID.get(id) || ROMAN_BY_ID.get(id) || null;
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
