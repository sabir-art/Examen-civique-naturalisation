/**
 * Niveaux, points d'expérience et badges.
 *
 * Tout est CALCULÉ à partir de ce qui est déjà enregistré : réponses, chapitres
 * lus, examens blancs, jours d'activité. Rien de neuf n'est stocké.
 *
 * Ce choix a une conséquence agréable : les points ne peuvent pas se
 * désynchroniser de la progression réelle, une sauvegarde importée retrouve
 * exactement le même niveau, et une remise à zéro remet aussi les badges à
 * zéro sans code supplémentaire.
 */

import * as store from '../store.js';
import { QUESTIONS } from '../data/questions.js';
import { LIVRET_QUESTIONS } from '../data/q-livret.js';
import { CHAPITRES as ROMAN_CHAPITRES } from '../data/roman.js';
import { THEMES, EXAM } from '../data/programme.js';

/** Barème. Volontairement simple : répondre rapporte, réussir rapporte plus. */
const POINTS = {
  bonneReponse: 10,
  mauvaiseReponse: 2,     // l'effort compte : sinon on est puni d'essayer
  chapitreLu: 40,
  examenPasse: 60,
  examenReussi: 150,
  journeeActive: 15,
};

/** Le même barème, rédigé pour être affiché tel quel. */
export const POINTS_AIDE = [
  ['Bonne réponse', `+${POINTS.bonneReponse}`],
  ['Réponse fausse (l’essai compte)', `+${POINTS.mauvaiseReponse}`],
  ['Chapitre du récit lu', `+${POINTS.chapitreLu}`],
  ['Examen blanc passé', `+${POINTS.examenPasse}`],
  ['Examen blanc réussi', `+${POINTS.examenReussi}`],
  ['Journée de révision', `+${POINTS.journeeActive}`],
];

/** Paliers. L'écart grandit, mais jamais au point de bloquer. */
export const NIVEAUX = [
  { seuil: 0, nom: 'Premiers pas' },
  { seuil: 300, nom: 'Débutant' },
  { seuil: 800, nom: 'Apprenti' },
  { seuil: 1600, nom: 'Confirmé' },
  { seuil: 2800, nom: 'Averti' },
  { seuil: 4500, nom: 'Chevronné' },
  { seuil: 7000, nom: 'Expert' },
  { seuil: 10000, nom: 'Prêt pour l\'examen' },
];

/** Total de points du profil courant. */
export function points() {
  const p = store.current();
  if (!p) return 0;
  let total = 0;

  for (const r of Object.values(p.progress || {})) {
    total += (r.ok || 0) * POINTS.bonneReponse + (r.ko || 0) * POINTS.mauvaiseReponse;
  }
  total += Object.keys(p.read || {}).length * POINTS.chapitreLu;
  for (const e of p.exams || []) {
    total += POINTS.examenPasse;
    if (e.score >= EXAM.passing) total += POINTS.examenReussi;
  }
  total += Object.keys(p.days || {}).length * POINTS.journeeActive;
  return total;
}

/** Niveau atteint, et ce qu'il reste avant le suivant. */
export function niveau() {
  const xp = points();
  let i = 0;
  while (i + 1 < NIVEAUX.length && xp >= NIVEAUX[i + 1].seuil) i += 1;
  const actuel = NIVEAUX[i];
  const suivant = NIVEAUX[i + 1] || null;
  const base = actuel.seuil;
  const cible = suivant ? suivant.seuil : actuel.seuil;
  return {
    rang: i + 1,
    total: NIVEAUX.length,
    nom: actuel.nom,
    xp,
    depuis: xp - base,
    requis: suivant ? cible - base : 0,
    versLeSuivant: suivant ? cible - xp : 0,
    suivant: suivant?.nom || null,
    pct: suivant ? Math.min(100, Math.round(((xp - base) / (cible - base)) * 100)) : 100,
  };
}

/* ---------------------------------------------------------------- badges */

/**
 * Chaque badge sait se calculer lui-même. `valeur` et `cible` alimentent la
 * barre de progression des badges pas encore obtenus.
 */
export function badges() {
  const p = store.current();
  if (!p) return [];

  const progress = Object.values(p.progress || {});
  const vues = progress.length;
  const justes = progress.reduce((s, r) => s + (r.ok || 0), 0);
  const acquises = progress.filter((r) => r.box >= store.MAX_BOX - 1).length;
  const lus = Object.keys(p.read || {}).length;
  const exams = p.exams || [];
  const recus = exams.filter((e) => e.score >= EXAM.passing);
  const parfait = exams.some((e) => e.score === e.total);
  const serie = store.streak();
  const jours = Object.keys(p.days || {}).length;

  // Un thème est « touché » dès qu'une de ses questions a été vue.
  const parTheme = {};
  for (const q of QUESTIONS) {
    if (p.progress?.[q.id]) parTheme[q.theme] = (parTheme[q.theme] || 0) + 1;
  }
  const themesTouches = Object.keys(parTheme).length;
  const themesFinis = Object.entries(THEMES).filter(([k]) => {
    const total = QUESTIONS.filter((q) => q.theme === k).length;
    return (parTheme[k] || 0) >= total;
  }).length;

  const vuesLivret = LIVRET_QUESTIONS.filter((q) => p.progress?.[q.id]).length;

  const liste = [
    { id: 'premier-pas', nom: 'Premier pas', icone: 'bolt', desc: 'Répondre à sa première question', valeur: vues, cible: 1 },
    { id: 'dix', nom: 'Ça démarre', icone: 'check', desc: 'Dix questions vues', valeur: vues, cible: 10 },
    { id: 'cent', nom: 'Centurion', icone: 'target', desc: 'Cent questions vues', valeur: vues, cible: 100 },
    { id: 'toute-la-banque', nom: 'Tout vu', icone: 'list', desc: 'Avoir vu les 363 questions d\'examen', valeur: vues, cible: QUESTIONS.length },

    { id: 'cinquante-justes', nom: 'Bonne pioche', icone: 'ok', desc: 'Cinquante bonnes réponses', valeur: justes, cible: 50 },
    { id: 'acquises', nom: 'Ancré', icone: 'shield', desc: 'Cinquante questions solidement acquises', valeur: acquises, cible: 50 },

    { id: 'serie-3', nom: 'Trois jours', icone: 'fire', desc: 'Trois jours de suite', valeur: serie, cible: 3 },
    { id: 'serie-7', nom: 'Une semaine', icone: 'fire', desc: 'Sept jours de suite', valeur: serie, cible: 7 },
    { id: 'serie-30', nom: 'Un mois entier', icone: 'fire', desc: 'Trente jours de suite', valeur: serie, cible: 30 },
    { id: 'assidu', nom: 'Habitué', icone: 'calendar', desc: 'Vingt journées de révision', valeur: jours, cible: 20 },

    { id: 'lecteur', nom: 'Lecteur', icone: 'book', desc: 'Lire un chapitre du récit', valeur: lus, cible: 1 },
    { id: 'acte-1', nom: 'Le temps des rois', icone: 'star', desc: 'Lire les six chapitres du premier acte', valeur: lus, cible: 6 },
    { id: 'historien', nom: 'Historien', icone: 'award', desc: 'Lire les vingt-deux chapitres', valeur: lus, cible: ROMAN_CHAPITRES.length },

    { id: 'livret', nom: 'Le livret ouvert', icone: 'bank', desc: 'Cent questions du livret officiel', valeur: vuesLivret, cible: 100 },

    { id: 'explorateur', nom: 'Explorateur', icone: 'pin', desc: 'Toucher aux cinq thèmes du programme', valeur: themesTouches, cible: Object.keys(THEMES).length },
    { id: 'complet', nom: 'Programme bouclé', icone: 'school', desc: 'Voir toutes les questions des cinq thèmes', valeur: themesFinis, cible: Object.keys(THEMES).length },

    { id: 'premier-examen', nom: 'Baptême du feu', icone: 'clock', desc: 'Passer un premier examen blanc', valeur: exams.length, cible: 1 },
    { id: 'recu', nom: 'Reçu', icone: 'trophy', desc: 'Réussir un examen blanc', valeur: recus.length, cible: 1 },
    { id: 'trois-fois', nom: 'Régulier au sommet', icone: 'trophy', desc: 'Réussir trois examens blancs', valeur: recus.length, cible: 3 },
    { id: 'sans-faute', nom: 'Sans faute', icone: 'sparkles', desc: 'Un examen blanc à 40 sur 40', valeur: parfait ? 1 : 0, cible: 1 },
  ];

  return liste.map((b) => ({
    ...b,
    obtenu: b.valeur >= b.cible,
    pct: Math.min(100, Math.round((b.valeur / b.cible) * 100)),
  }));
}

export function badgesObtenus() {
  return badges().filter((b) => b.obtenu);
}

/** Les trois prochains badges à portée, pour donner un cap. */
export function prochainsBadges(n = 3) {
  return badges()
    .filter((b) => !b.obtenu)
    .sort((a, b) => b.pct - a.pct)
    .slice(0, n);
}
