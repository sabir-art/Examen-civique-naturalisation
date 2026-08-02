/**
 * Banque de questions : agrégation des fichiers thématiques.
 *
 * Format d'une question :
 *   id       identifiant stable (sert au suivi de progression)
 *   theme    clé de THEMES
 *   sub      clé de SUBS
 *   type     'connaissance' | 'situation'
 *   scenario texte de mise en situation (facultatif)
 *   q        énoncé
 *   c        tableau des propositions (la bonne est à l'index `a` dans les
 *            données ; les propositions sont mélangées à l'affichage)
 *   a        index de la bonne réponse
 *   why      explication affichée après la réponse
 */

import principes from './q-principes.js';
import principesSituations from './q-principes-situations.js';
import institutions from './q-institutions.js';
import droits from './q-droits.js';
import droitsSituations from './q-droits-situations.js';
import histoire from './q-histoire.js';
import societe from './q-societe.js';

export const QUESTIONS = [
  ...principes,
  ...principesSituations,
  ...institutions,
  ...droits,
  ...droitsSituations,
  ...histoire,
  ...societe,
];

export const BY_ID = new Map(QUESTIONS.map((q) => [q.id, q]));

/** Sélection filtrée de la banque. */
export function pool({ theme, sub, subs, type } = {}) {
  return QUESTIONS.filter((q) => {
    if (theme && q.theme !== theme) return false;
    if (sub && q.sub !== sub) return false;
    if (subs && !subs.includes(q.sub)) return false;
    if (type && q.type !== type) return false;
    return true;
  });
}

/** Contrôle d'intégrité — exécuté en développement (voir scripts/check-bank.mjs). */
export function audit() {
  const problems = [];
  const seen = new Set();
  for (const q of QUESTIONS) {
    const at = `${q.id} — ${(q.q || '').slice(0, 50)}`;
    if (seen.has(q.id)) problems.push(`Identifiant dupliqué : ${at}`);
    seen.add(q.id);
    if (!q.theme || !q.sub || !q.type) problems.push(`Métadonnées manquantes : ${at}`);
    if (!Array.isArray(q.c) || q.c.length < 3) problems.push(`Moins de 3 propositions : ${at}`);
    if (typeof q.a !== 'number' || q.a < 0 || q.a >= (q.c || []).length) problems.push(`Index de réponse invalide : ${at}`);
    if (new Set(q.c).size !== q.c.length) problems.push(`Propositions identiques : ${at}`);
    if (!q.why) problems.push(`Explication manquante : ${at}`);
    if (q.type === 'situation' && !q.scenario) problems.push(`Mise en situation sans scénario : ${at}`);
  }
  return problems;
}
