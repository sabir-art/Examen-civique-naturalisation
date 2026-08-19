#!/usr/bin/env node
/**
 * Contrôle de la date de publication et du journal des versions.
 *   node scripts/check-version.mjs
 *
 * L'écran « Version et nouveautés » répond à une question de confiance :
 * « ces informations datent de quand ? ». Une réponse fausse y est pire que
 * pas de réponse — on croirait à jour un contenu qui ne l'est pas. Trois
 * façons de mentir sont possibles, et toutes les trois sont muettes :
 *
 *   1. une date bricolée à la main, qui ne correspond à rien ;
 *   2. version.json et js/data/build.js qui se contredisent — l'application
 *      se croirait alors périmée (ou à jour) sans raison ;
 *   3. un contenu modifié sans que le journal en dise un mot : la date de
 *      mise à jour avance, et le lecteur ne sait pas ce qui a changé.
 */
import { readFileSync } from 'node:fs';

const { PUBLICATION, CONTENUS } = await import('../js/data/build.js');
const { NOUVEAUTES } = await import('../js/data/nouveautes.js');

let failed = false;
const fail = (msg) => { console.error(`  ✗ ${msg}`); failed = true; };
const JOUR = /^\d{4}-\d{2}-\d{2}$/;

console.log(`Version ${PUBLICATION.commit} du ${PUBLICATION.jour}\n`);

console.log('Fichier de version');
if (!/^[0-9a-f]{7,40}$/.test(PUBLICATION.commit || '')) fail(`repère de version invalide : « ${PUBLICATION.commit} »`);
if (Number.isNaN(Date.parse(PUBLICATION.date || ''))) fail(`date de publication illisible : « ${PUBLICATION.date} »`);
if (!JOUR.test(PUBLICATION.jour || '')) fail(`jour de publication illisible : « ${PUBLICATION.jour} »`);
if (!failed) console.log('  ✓ date et repère de version lisibles');

/* Les deux fichiers sortent du même script ; s'ils divergent, c'est que l'un
   des deux a été écrit à la main ou oublié à la publication. */
console.log('\nAccord entre l’application et le serveur');
let json = null;
try {
  json = JSON.parse(readFileSync('version.json', 'utf8'));
} catch (e) {
  fail(`version.json illisible : ${e.message}`);
}
if (json) {
  if (json.commit !== PUBLICATION.commit) fail(`version.json annonce ${json.commit}, l'application ${PUBLICATION.commit}`);
  else if (json.jour !== PUBLICATION.jour) fail(`version.json date du ${json.jour}, l'application du ${PUBLICATION.jour}`);
  else console.log('  ✓ version.json dit la même chose que js/data/build.js');
}

console.log('\nDates des contenus');
for (const c of CONTENUS) {
  if (!c.date) { fail(`${c.libelle} : aucune date`); continue; }
  if (!JOUR.test(c.date)) { fail(`${c.libelle} : date illisible (${c.date})`); continue; }
  if (c.date > PUBLICATION.jour) fail(`${c.libelle} : daté du ${c.date}, après la publication (${PUBLICATION.jour})`);
  else console.log(`  ✓ ${c.date}  ${c.libelle}`);
}

console.log('\nJournal des versions');
if (!NOUVEAUTES.length) fail('le journal est vide');
for (const [i, n] of NOUVEAUTES.entries()) {
  const at = `entrée ${i + 1} (${n.date})`;
  if (!JOUR.test(n.date || '')) fail(`${at} : date illisible`);
  if (!n.titre?.trim()) fail(`${at} : titre manquant`);
  if (!n.lignes?.length || n.lignes.some((l) => !l.trim())) fail(`${at} : texte manquant`);
  if (i > 0 && n.date > NOUVEAUTES[i - 1].date) fail(`${at} : le journal doit aller du plus récent au plus ancien`);
}

/* La règle qui compte : si un contenu a bougé, le journal doit le dire. */
const dernierContenu = CONTENUS.map((c) => c.date).filter(Boolean).sort().pop();
const dernierJournal = NOUVEAUTES.map((n) => n.date).sort().pop();
if (dernierContenu && dernierJournal && dernierJournal < dernierContenu) {
  fail(`un contenu a changé le ${dernierContenu}, le journal s'arrête au ${dernierJournal} : ajoutez une entrée dans js/data/nouveautes.js`);
} else if (!failed) {
  console.log(`  ✓ ${NOUVEAUTES.length} entrées, la plus récente du ${dernierJournal}`);
}

console.log(failed ? '\n✗ Contrôle en échec' : '\n✓ Contrôle réussi');
process.exit(failed ? 1 : 0);
