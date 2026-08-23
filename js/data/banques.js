/**
 * Les trois banques réunies, vues par thème.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *  Pourquoi ce module existe
 * ─────────────────────────────────────────────────────────────────────────────
 *  L'application pose les mêmes questions par trois chemins : la banque
 *  d'entraînement à l'examen, le livret du citoyen, le récit « La France
 *  racontée ». La progression, elle, n'a jamais eu qu'un seul carnet : un
 *  identifiant, une boîte, une échéance.
 *
 *  Mais la MESURE, elle, ne regardait qu'une banque. « Principes et valeurs :
 *  24 % » se calculait sur les seules 92 questions d'examen du thème : quarante
 *  questions travaillées dans le livret ou dans le récit ne déplaçaient rien,
 *  et la barre semblait cassée. Elle ne l'était pas — elle mesurait autre chose
 *  que ce qu'on venait de faire.
 *
 *  Ici, un thème est l'ensemble de ses questions, d'où qu'elles viennent. Le
 *  rattachement est décidé chez elles : THEME_DE_PARTIE dans livret.js (les
 *  parties du livret portent les titres exacts des thèmes officiels),
 *  THEME_DE_CHAPITRE dans roman.js (un choix éditorial, écrit et commenté).
 *
 *  Ce qui NE change pas : l'examen blanc officiel continue de tirer dans la
 *  seule banque d'examen — c'est la composition de l'épreuve réelle, elle ne se
 *  négocie pas. Et les sous-thèmes restent une affaire de la banque d'examen,
 *  seule à en porter.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { QUESTIONS, BY_ID } from './questions.js';
import { LIVRET_QUESTIONS, LIVRET_BY_ID } from './q-livret.js';
import { ROMAN_QUESTIONS, ROMAN_BY_ID } from './roman.js';
import { THEMES } from './programme.js';

/** Tout ce à quoi on peut répondre dans l'application. */
export const TOUTES_LES_QUESTIONS = [...QUESTIONS, ...LIVRET_QUESTIONS, ...ROMAN_QUESTIONS];

/**
 * Une question, quelle que soit sa banque.
 *
 * Les identifiants ne se croisent pas (`his12`, `lv001`, `rm001`), et c'est
 * cette garantie — vérifiée par scripts/check-bank.mjs — qui permet un seul
 * carnet de progression pour trois banques.
 */
export function trouverQuestion(id) {
  return BY_ID.get(id) || LIVRET_BY_ID.get(id) || ROMAN_BY_ID.get(id) || null;
}

/**
 * D'où vient une question.
 *
 * Les questions d'examen ne portent pas de marque : elles sont la banque
 * d'origine, et tout le reste est venu se poser à côté. Le nom rendu ici est
 * celui qu'on emploie partout ailleurs — écrans, filtres, statistiques — pour
 * qu'un seul vocabulaire serve à tout.
 */
export function sourceDe(q) {
  if (q.source === 'livret') return 'livret';
  if (q.source === 'roman') return 'recit';
  return 'examen';
}

/** Les trois banques, dans l'ordre où elles se présentent à l'écran. */
export const SOURCES = ['examen', 'livret', 'recit'];

/** Comment chaque banque se nomme devant l'utilisateur. */
export const LIBELLE_SOURCE = {
  examen: "Banque d'examen",
  livret: 'Livret du citoyen',
  recit: 'La France racontée',
};

/**
 * Le nom court, pour une puce de filtre.
 *
 * « La France racontée (48) » et « Banque d'examen (45) » côte à côte
 * dépassaient la largeur d'un téléphone et repoussaient les puces à la ligne
 * suivante. Le nom entier reste écrit juste au-dessus, dans le relevé
 * d'avancement, et dans le bilan juste en dessous : rien ne se perd.
 */
export const COURT_SOURCE = {
  examen: 'Examen',
  livret: 'Livret',
  recit: 'Récit',
};

/**
 * Le même nom, prêt à suivre une préposition : « … dans le livret du citoyen ».
 *
 * Une mise en minuscules automatique donnait « dans la france racontée » : le
 * titre d'un livre ne se décapitalise pas. Chaque forme est donc écrite, avec
 * son article.
 */
export const SOURCE_APRES_DANS = {
  examen: "la banque d'examen",
  livret: 'le livret du citoyen',
  recit: '« La France racontée »',
};

const PAR_THEME = new Map(Object.keys(THEMES).map((k) => [k, []]));
// Un ensemble par thème ET par banque : c'est ce qui permet de s'entraîner sur
// « l'examen seul » sans recalculer ni recopier à chaque affichage.
const PAR_THEME_SOURCE = new Map();
for (const t of Object.keys(THEMES)) {
  for (const s of SOURCES) PAR_THEME_SOURCE.set(`${t}|${s}`, []);
}
for (const q of TOUTES_LES_QUESTIONS) {
  if (!PAR_THEME.has(q.theme)) continue;
  PAR_THEME.get(q.theme).push(q);
  PAR_THEME_SOURCE.get(`${q.theme}|${sourceDe(q)}`).push(q);
}

/**
 * Les questions d'un thème — les trois banques réunies, ou une seule.
 *
 * Sans second argument, le thème entier : c'est ce que mesurent les barres de
 * progression. Avec, une banque précise : « je révise l'examen, et rien
 * d'autre » est une demande légitime, et personne ne devrait avoir à traverser
 * le livret pour l'obtenir.
 *
 * Le tableau rendu est celui du cache : à ne pas trier ni modifier sur place.
 * Les appelants qui mélangent en font une copie (`shuffle` en rend une).
 */
export function poolTheme(theme, source = null) {
  if (!source) return PAR_THEME.get(theme) || [];
  return PAR_THEME_SOURCE.get(`${theme}|${source}`) || [];
}

/** Nombre de questions rattachées à un thème. */
export function tailleTheme(theme) {
  return poolTheme(theme).length;
}

/**
 * D'où viennent les questions d'un thème, banque par banque.
 *
 * Sert à l'écrire à l'écran : « 145 questions — 92 de l'examen, 41 du livret,
 * 12 du récit ». Un pourcentage dont on ne sait pas sur quoi il porte n'est
 * pas un renseignement, c'est une devinette.
 */
export function compositionTheme(theme) {
  return {
    total: tailleTheme(theme),
    examen: poolTheme(theme, 'examen').length,
    livret: poolTheme(theme, 'livret').length,
    recit: poolTheme(theme, 'recit').length,
  };
}

/** La même composition, en une phrase française. */
export function phraseComposition(theme) {
  const c = compositionTheme(theme);
  const bouts = [
    c.examen ? `${c.examen} de la banque d'examen` : null,
    c.livret ? `${c.livret} du livret` : null,
    c.recit ? `${c.recit} du récit` : null,
  ].filter(Boolean);
  const liste = bouts.length > 1
    ? `${bouts.slice(0, -1).join(', ')} et ${bouts[bouts.length - 1]}`
    : bouts[0] || 'aucune';
  return `${c.total} questions comptent dans ce thème : ${liste}.`;
}

/**
 * Contrôle d'intégrité (voir scripts/check-bank.mjs).
 *
 * Une question sans thème n'est comptée nulle part : elle disparaît des barres
 * de progression sans que rien ne le signale. C'est exactement la panne qu'on
 * vient de corriger, et ce contrôle est là pour qu'elle ne revienne pas.
 */
export function audit() {
  const problems = [];
  const rattachees = [...PAR_THEME.values()].reduce((n, l) => n + l.length, 0);
  for (const q of TOUTES_LES_QUESTIONS) {
    if (!q.theme) {
      problems.push(`Question sans thème : ${q.id} — ${(q.q || '').slice(0, 50)}`);
    } else if (!THEMES[q.theme]) {
      problems.push(`Thème inconnu « ${q.theme} » : ${q.id}`);
    }
  }
  if (rattachees !== TOUTES_LES_QUESTIONS.length) {
    problems.push(`${TOUTES_LES_QUESTIONS.length - rattachees} question(s) hors thème`);
  }
  return problems;
}
