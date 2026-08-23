/**
 * La banque d'examen face à la liste officielle du ministère.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *  Pourquoi ce contrôle existe
 * ─────────────────────────────────────────────────────────────────────────────
 *  Les 363 questions de la banque d'examen ont été RÉDIGÉES à partir du
 *  référentiel de l'arrêté du 10 octobre 2025 — le programme, c'est-à-dire la
 *  liste des connaissances exigibles. Elles ne sont pas la liste des questions
 *  posées : celle-là, le ministère l'a publiée à part, le 12 décembre 2025.
 *
 *  La différence n'est pas mince. Réviser le bon programme avec les mauvaises
 *  questions, c'est arriver à l'épreuve en terrain inconnu. Et rien, dans
 *  l'application, ne distinguait les deux : un intitulé « Banque d'examen » se
 *  lit « les questions de l'examen ».
 *
 *  Ce contrôle mesure l'écart et le dit en chiffres, pour qu'il ne puisse plus
 *  être ignoré ni supposé résorbé. Il se rejoue à chaque nouvelle publication
 *  du ministère : remplacez le fichier de docs/ et relancez.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { readFileSync, readdirSync } from 'node:fs';
import { QUESTIONS } from '../js/data/questions.js';

const REF = readdirSync('docs').filter((f) => /^questions-officielles-.*\.json$/.test(f)).sort().pop();
if (!REF) {
  console.error("Aucune liste officielle dans docs/ : rien à comparer.");
  process.exit(1);
}
const officiel = JSON.parse(readFileSync(`docs/${REF}`, 'utf8'));

/* Normalisation : c'est elle qui décide de ce qu'on appelle « la même
   question ». Accents, casse, ponctuation et espaces sautent ; le reste doit
   coïncider. Volontairement stricte — mieux vaut signaler un écart qui n'en
   est pas qu'en manquer un vrai. */
const norm = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
  .replace(/[^a-z0-9]+/g, ' ').trim();

const VIDES = new Set(('le la les un une des de du d l a au aux en et est ce que qui quoi quel '
  + 'quelle quels quelles pour par sur dans il elle on se sa son ses leur leurs plus ne pas y').split(' '));
const mots = (s) => new Set(norm(s).split(' ').filter((w) => w.length > 2 && !VIDES.has(w)));
const jaccard = (a, b) => { let i = 0; for (const x of a) if (b.has(x)) i += 1; return i / (a.size + b.size - i || 1); };

const banque = QUESTIONS.map((q) => ({ q, n: norm(q.q), mots: mots(q.q) }));
const rangs = { identique: [], proche: [], lointaine: [], absente: [] };

for (const o of officiel.questions) {
  const n = norm(o.intitule);
  const m = mots(o.intitule);
  let meilleur = null;
  let score = 0;
  for (const b of banque) {
    const s = b.n === n ? 1 : jaccard(m, b.mots);
    if (s > score) { score = s; meilleur = b; }
  }
  const entree = { ...o, score, voisine: meilleur?.q.q || null };
  if (score >= 0.75) rangs.identique.push(entree);
  else if (score >= 0.5) rangs.proche.push(entree);
  else if (score >= 0.3) rangs.lointaine.push(entree);
  else rangs.absente.push(entree);
}

const total = officiel.questions.length;
const couvertes = rangs.identique.length;
const pct = (n) => `${Math.round((n / total) * 100)} %`.padStart(5);

console.log(`\nListe officielle : ${REF}`);
console.log(`Publiée le ${officiel.publie_le} — ${total} questions de connaissance.`);
console.log(`Banque de l'application : ${QUESTIONS.length} questions.\n`);
console.log(`  reprises telles quelles   ${String(couvertes).padStart(4)}  ${pct(couvertes)}`);
console.log(`  formulation voisine       ${String(rangs.proche.length).padStart(4)}  ${pct(rangs.proche.length)}`);
console.log(`  sujet voisin seulement    ${String(rangs.lointaine.length).padStart(4)}  ${pct(rangs.lointaine.length)}`);
console.log(`  absentes de la banque     ${String(rangs.absente.length).padStart(4)}  ${pct(rangs.absente.length)}`);

console.log('\nPar thème :');
const THEMES = [...new Set(officiel.questions.map((q) => q.theme))];
for (const t of THEMES) {
  const dedans = officiel.questions.filter((q) => q.theme === t).length;
  const prises = rangs.identique.filter((q) => q.theme === t).length;
  console.log(`  ${t.padEnd(22)} ${String(prises).padStart(3)} / ${String(dedans).padStart(3)}`);
}

if (rangs.absente.length) {
  console.log('\nQuelques absentes, à titre d’exemple :');
  for (const q of rangs.absente.slice(0, 8)) console.log(`  · ${q.intitule}`);
  console.log(`  … et ${rangs.absente.length - 8} autres.`);
}

console.log(`\n${couvertes} des ${total} questions officielles figurent dans la banque.`);
console.log('Ce contrôle informe, il n’échoue pas : combler l’écart est un travail de');
console.log('contenu, pas une correction de code.\n');
