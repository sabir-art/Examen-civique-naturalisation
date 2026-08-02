#!/usr/bin/env node
/**
 * Contrôle de la banque de questions : intégrité des données et couverture
 * suffisante pour composer un examen blanc conforme à la répartition officielle.
 *   node scripts/check-bank.mjs
 */
import { QUESTIONS, audit, pool } from '../js/data/questions.js';
import { BLUEPRINT, THEMES, EXAM, blueprintCount } from '../js/data/programme.js';

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

console.log(failed ? '\n✗ Contrôle en échec' : '\n✓ Contrôle réussi');
process.exit(failed ? 1 : 0);
