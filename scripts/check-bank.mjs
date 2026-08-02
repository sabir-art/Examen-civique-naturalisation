#!/usr/bin/env node
/**
 * Contrôle de la banque de questions : intégrité des données et couverture
 * suffisante pour composer un examen blanc conforme à la répartition officielle.
 *   node scripts/check-bank.mjs
 */
import { QUESTIONS, audit, pool } from '../js/data/questions.js';
import { BLUEPRINT, THEMES, EXAM, blueprintCount } from '../js/data/programme.js';
import { LIVRET_QUESTIONS, questionsOf } from '../js/data/q-livret.js';
import { PARTIES, CHAPITRES, TOTAL_SECTIONS } from '../js/data/livret.js';
import {
  ACTES, CHAPITRES as ROMAN_CHAPITRES, TOTAL_MINUTES,
  ROMAN_QUESTIONS, questionsOf as romanQuestionsOf,
} from '../js/data/roman.js';

let failed = false;
const fail = (msg) => { console.error(`  ✗ ${msg}`); failed = true; };

console.log(`Banque : ${QUESTIONS.length} questions\n`);

console.log('Intégrité');
const problems = audit();
if (problems.length === 0) console.log('  ✓ aucune anomalie');
else problems.forEach(fail);

console.log('\nRépartition par thème');
for (const [key, t] of Object.entries(THEMES)) {
  const n = pool({ theme: key }).length;
  const drawn = blueprintCount(key);
  const flag = n >= drawn * 3 ? '✓' : n >= drawn ? '~' : '✗';
  if (n < drawn) fail(`${t.short} : ${n} questions pour ${drawn} tirées`);
  else console.log(`  ${flag} ${t.short.padEnd(22)} ${String(n).padStart(3)} en banque · ${drawn} tirées à l'examen`);
}

console.log('\nCouverture de chaque case du plan de tirage');
let total = 0;
for (const b of BLUEPRINT) {
  const available = pool({ theme: b.theme, subs: b.subs, type: b.type }).length;
  total += b.n;
  const label = `${THEMES[b.theme].short} / ${b.subs ? b.subs.join('+') : b.type}`;
  if (available < b.n) fail(`${label} : ${available} disponibles pour ${b.n} requises`);
  else console.log(`  ✓ ${label.padEnd(46)} ${String(available).padStart(3)} dispo · ${b.n} tirées`);
}

console.log(`\nTotal du plan de tirage : ${total} (attendu ${EXAM.questions})`);
if (total !== EXAM.questions) fail(`le plan de tirage produit ${total} questions au lieu de ${EXAM.questions}`);

const situations = pool({ type: 'situation' }).length;
const connaissances = pool({ type: 'connaissance' }).length;
const plannedSit = BLUEPRINT.filter((b) => b.type === 'situation').reduce((s, b) => s + b.n, 0);
console.log(`Connaissances : ${connaissances} · Mises en situation : ${situations} (12 attendues par examen, ${plannedSit} planifiées)`);
if (plannedSit !== 12) fail(`le plan prévoit ${plannedSit} mises en situation au lieu de 12`);

/* ------------------------------------------------- livret du citoyen ---- */

console.log(`\nLivret du citoyen : ${PARTIES.length} parties, ${CHAPITRES.length} chapitres, ${TOTAL_SECTIONS} sections`);
console.log(`Banque du livret : ${LIVRET_QUESTIONS.length} questions`);

const livretIds = new Set();
const examIds = new Set(QUESTIONS.map((q) => q.id));
for (const q of LIVRET_QUESTIONS) {
  const at = `${q.id} — ${(q.q || '').slice(0, 45)}`;
  if (livretIds.has(q.id)) fail(`Identifiant dupliqué dans le livret : ${at}`);
  livretIds.add(q.id);
  if (examIds.has(q.id)) fail(`Collision d'identifiant avec la banque d'examen : ${at}`);
  if (!Array.isArray(q.c) || q.c.length < 3) fail(`Moins de 3 propositions : ${at}`);
  if (typeof q.a !== 'number' || q.a < 0 || q.a >= (q.c || []).length) fail(`Index de réponse invalide : ${at}`);
  if (new Set(q.c).size !== q.c.length) fail(`Propositions identiques : ${at}`);
  if (!q.why) fail(`Explication manquante : ${at}`);
  if (!CHAPITRES.some((c) => c.key === q.chapter)) fail(`Chapitre inconnu (${q.chapter}) : ${at}`);
}

console.log('\nCouverture des chapitres du livret');
for (const c of CHAPITRES) {
  const n = questionsOf(c.key).length;
  const label = `${c.partieTitle} / ${c.num}. ${c.title}`;
  if (n === 0 && c.key !== 'ax-i' && c.key !== 'ax-iii') fail(`${label} : aucune question`);
  else console.log(`  ${n ? '✓' : '·'} ${label.slice(0, 62).padEnd(64)} ${String(n).padStart(3)} questions`);
}

/* --------------------------------------------- « La France racontée » ---- */

console.log(`\nLa France racontée : ${ACTES.length} actes, ${ROMAN_CHAPITRES.length} chapitres, ~${TOTAL_MINUTES} min de lecture`);
console.log(`Banque du récit : ${ROMAN_QUESTIONS.length} questions`);

const romanIds = new Set();
for (const q of ROMAN_QUESTIONS) {
  const at = `${q.id} — ${(q.q || '').slice(0, 45)}`;
  if (romanIds.has(q.id)) fail(`Identifiant dupliqué dans le récit : ${at}`);
  romanIds.add(q.id);
  if (examIds.has(q.id)) fail(`Collision d'identifiant avec la banque d'examen : ${at}`);
  if (livretIds.has(q.id)) fail(`Collision d'identifiant avec la banque du livret : ${at}`);
  if (!Array.isArray(q.c) || q.c.length < 3) fail(`Moins de 3 propositions : ${at}`);
  if (typeof q.a !== 'number' || q.a < 0 || q.a >= (q.c || []).length) fail(`Index de réponse invalide : ${at}`);
  if (new Set(q.c).size !== q.c.length) fail(`Propositions identiques : ${at}`);
  if (!q.why) fail(`Explication manquante : ${at}`);
  if (!ROMAN_CHAPITRES.some((c) => c.key === q.chapitre)) fail(`Chapitre inconnu (${q.chapitre}) : ${at}`);
}

console.log('\nCouverture des chapitres du récit');
for (const c of ROMAN_CHAPITRES) {
  const n = romanQuestionsOf(c.key).length;
  const label = `Acte ${c.acteNum} / ${c.num}. ${c.titre}`;
  if (!c.html || c.html.trim().length < 400) fail(`${label} : texte absent ou trop court`);
  if (!Array.isArray(c.retenir) || !c.retenir.length) fail(`${label} : encadré « à retenir » manquant`);
  if (n < 3) fail(`${label} : ${n} question(s), 3 minimum`);
  else console.log(`  ✓ ${label.slice(0, 62).padEnd(64)} ${String(n).padStart(3)} questions`);
}

console.log(`\nTotal des trois banques : ${QUESTIONS.length + LIVRET_QUESTIONS.length + ROMAN_QUESTIONS.length} questions`);

console.log(failed ? '\n✗ Contrôle en échec' : '\n✓ Contrôle réussi');
process.exit(failed ? 1 : 0);
