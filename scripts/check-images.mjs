#!/usr/bin/env node
/**
 * Contrôle du manifeste des illustrations.
 *
 * Les images ne sont pas insérées dans le HTML des chapitres : elles sont
 * ANCRÉES par un fragment de texte (`apres`), et l'application les pose après
 * le paragraphe qui le contient. Ce choix évite deux ennuis. D'abord, le texte
 * arabe et le texte français gardent exactement le même nombre de blocs, ce
 * dont dépend le mode bilingue. Ensuite, ajouter un paragraphe ne décale pas
 * les images.
 *
 * En échange, une ancre peut se périmer en silence : il suffit de retoucher
 * une phrase pour qu'elle ne corresponde plus, et l'image disparaît sans que
 * rien ne le signale. D'où ce contrôle, qui vérifie que chaque ancre tombe sur
 * un et un seul paragraphe, qu'aucune clé n'est en double, que chaque terme de
 * glossaire cité existe vraiment, et que rien d'essentiel ne manque.
 */

const { CHAPITRE_BY_KEY } = await import('../js/data/roman.js');
const { PAR_TERME } = await import('../js/data/glossaire.js');
const { readFileSync, existsSync, statSync } = await import('node:fs');
const { resolve, dirname } = await import('node:path');
const { fileURLToPath } = await import('node:url');

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DOSSIER = resolve(ROOT, 'assets/photos');
const manifeste = JSON.parse(readFileSync(resolve(DOSSIER, 'manifeste.json'), 'utf8'));
const images = manifeste.images || [];

const problemes = [];
const ko = (m) => problemes.push(m);

/** Blocs de premier niveau d'un chapitre, en texte brut. */
function blocsDe(html) {
  return [...html.matchAll(/<(p|h4|ul|ol|blockquote)[\s>][\s\S]*?<\/\1>/g)].map((m) => m[0]);
}

console.log('Contrôle du manifeste des illustrations\n');

const vues = new Set();
let presentes = 0;
let poids = 0;

for (const img of images) {
  const id = img.cle || '(sans clé)';

  if (!img.cle) { ko('une entrée n\'a pas de clé'); continue; }
  if (vues.has(img.cle)) { ko(`${id} — clé en double`); continue; }
  vues.add(img.cle);

  for (const champ of ['source', 'alt', 'legende', 'legende_ar']) {
    if (!img[champ]) ko(`${id} — champ « ${champ} » manquant`);
  }
  if (img.source && !['ia', 'libre'].includes(img.source)) {
    ko(`${id} — source « ${img.source} » inconnue (attendu : ia, libre)`);
  }
  if (img.legende_ar && !/[؀-ۿ]/.test(img.legende_ar)) {
    ko(`${id} — la légende arabe ne contient pas d'arabe`);
  }

  /* --- l'ancre doit tomber sur un seul bloc du chapitre --- */
  if (img.chapitre) {
    const c = CHAPITRE_BY_KEY.get(img.chapitre);
    if (!c) {
      ko(`${id} — chapitre « ${img.chapitre} » inconnu`);
    } else if (!img.apres) {
      ko(`${id} — pas d'ancre \`apres\``);
    } else {
      const blocs = blocsDe(c.html);
      const trouves = blocs.filter((b) => b.includes(img.apres));
      if (trouves.length === 0) {
        ko(`${id} — ancre introuvable dans ${img.chapitre} : « ${img.apres} »`);
      } else if (trouves.length > 1) {
        ko(`${id} — ancre ambiguë dans ${img.chapitre} (${trouves.length} paragraphes) : « ${img.apres} »`);
      }
    }
  }

  /* --- les termes de glossaire cités doivent exister --- */
  for (const t of img.glossaire || []) {
    if (!PAR_TERME.has(t)) ko(`${id} — terme de glossaire inconnu : « ${t} »`);
  }

  /* --- le fichier, s'il est déjà rapatrié --- */
  const fichier = resolve(DOSSIER, `${img.cle}.jpg`);
  if (existsSync(fichier)) {
    const t = statSync(fichier).size;
    presentes += 1;
    poids += t;
    if (t > 300 * 1024) ko(`${id} — ${Math.round(t / 1024)} Ko, trop lourd pour une application hors ligne`);
  } else if (!img.url) {
    ko(`${id} — ni fichier ni adresse de téléchargement`);
  }
}

/* --- une image par chapitre au minimum : c'était la demande --- */
const parChapitre = {};
for (const img of images) {
  if (img.chapitre) parChapitre[img.chapitre] = (parChapitre[img.chapitre] || 0) + 1;
}
const sansImage = [...CHAPITRE_BY_KEY.keys()].filter((k) => !parChapitre[k]);
if (sansImage.length) ko(`chapitres sans aucune illustration : ${sansImage.join(', ')}`);

console.log(`  ${images.length} images déclarées, ${presentes} déjà dans le dépôt (${Math.round(poids / 1024)} Ko)`);
console.log(`  ${Object.keys(parChapitre).length}/${CHAPITRE_BY_KEY.size} chapitres illustrés`);

if (problemes.length) {
  console.log(`\n✗ ${problemes.length} problème(s) :\n- ${problemes.join('\n- ')}`);
  process.exit(1);
}
console.log('\n✓ Manifeste cohérent');
