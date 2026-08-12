#!/usr/bin/env node
/**
 * Contrôle syntaxique des workflows GitHub.
 *
 * POURQUOI : un fichier de workflow invalide ne « plante » pas d'une manière
 * visible. GitHub crée bien une exécution, mais elle échoue instantanément
 * avec zéro job, sans log, sans message — il faut aller lire le YAML à la
 * main pour comprendre. C'est arrivé une fois : un message de commit sur
 * plusieurs lignes, mal indenté dans un bloc `run: |`, sortait du bloc et
 * cassait tout le fichier.
 *
 * Le contrôle décisif est une VRAIE analyse YAML, déléguée à Python : la
 * première version de ce script se contentait de règles d'indentation écrites
 * à la main, et elle a laissé passer le défaut même pour lequel elle avait été
 * écrite. Un contrôle approximatif sur une syntaxe exacte ne vaut rien — il
 * faut le parseur.
 *
 * Si Python ou PyYAML manquent, le script le dit et échoue : mieux vaut une
 * absence signalée qu'un feu vert qui ne repose sur rien.
 */

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DOSSIER = resolve(ROOT, '.github/workflows');

const problemes = [];
const ko = (f, l, m) => problemes.push(`${f}${l ? `:${l}` : ''} — ${m}`);

if (!existsSync(DOSSIER)) {
  console.log('Aucun workflow.');
  process.exit(0);
}

/**
 * Analyse réelle du YAML. Renvoie l'objet, ou lève avec le message du parseur.
 * On passe par Python : Node n'a pas de parseur YAML intégré, et PyYAML est
 * présent aussi bien ici que sur les runners GitHub.
 */
function analyser(chemin) {
  const code = `
import sys, json, yaml
try:
    d = yaml.safe_load(open(sys.argv[1], encoding='utf-8'))
except Exception as e:
    print(json.dumps({'erreur': str(e).replace('\\n', ' ')}))
    sys.exit(0)
print(json.dumps({'ok': True, 'jobs': list((d or {}).get('jobs', {}) or {}), 'cles': list((d or {}).keys())}))
`;
  const sortie = execFileSync('python3', ['-c', code, chemin], { encoding: 'utf8' });
  return JSON.parse(sortie);
}

try {
  execFileSync('python3', ['-c', 'import yaml'], { stdio: 'pipe' });
} catch {
  console.log('✗ python3 + PyYAML sont nécessaires pour analyser les workflows.');
  console.log('  Sans parseur, ce contrôle ne vaudrait rien : il vaut mieux échouer.');
  process.exit(1);
}

const fichiers = readdirSync(DOSSIER).filter((f) => /\.ya?ml$/.test(f));
console.log('Contrôle des workflows GitHub\n');

for (const nom of fichiers) {
  const chemin = resolve(DOSSIER, nom);
  const texte = readFileSync(chemin, 'utf8');
  const lignes = texte.split('\n');
  let signale = false;

  /* --- 1. le fichier doit se parser. C'est le contrôle qui compte. --- */
  const vu = analyser(chemin);
  if (vu.erreur) {
    ko(nom, 0, `YAML invalide — ${vu.erreur}`);
    // Inutile de poursuivre : tout le reste découlerait d'un fichier illisible.
    continue;
  }

  /* --- 2. tabulations : YAML les refuse, l'erreur est peu parlante --- */
  lignes.forEach((l, i) => {
    if (/^\s*\t/.test(l)) { ko(nom, i + 1, 'tabulation en début de ligne (YAML exige des espaces)'); signale = true; }
  });

  /* --- 3. structure minimale attendue --- */
  if (!/^name:/m.test(texte)) { ko(nom, 0, 'pas de `name:`'); signale = true; }
  if (!/^on:/m.test(texte)) { ko(nom, 0, 'pas de `on:`'); signale = true; }
  if (!/^jobs:/m.test(texte)) { ko(nom, 0, 'pas de `jobs:`'); signale = true; }
  if (/\$\{\{\s*secrets\.[A-Z_]+\s*\}\}/.test(texte) && !/permissions:/m.test(texte)) {
    ko(nom, 0, 'utilise un secret sans déclarer `permissions:`');
    signale = true;
  }

  /* --- 4. au moins un job, et chacun avec sa machine --- */
  if (!vu.jobs.length) { ko(nom, 0, 'aucun job'); signale = true; }
  const runsOn = (texte.match(/^ {4}runs-on:/gm) || []).length;
  if (vu.jobs.length && runsOn < vu.jobs.length) {
    ko(nom, 0, `${vu.jobs.length} job(s) mais ${runsOn} \`runs-on\``);
    signale = true;
  }

  if (!signale) console.log(`  ✓ ${nom.padEnd(14)} ${lignes.length} lignes · ${vu.jobs.join(', ')}`);
}

if (problemes.length) {
  console.log(`\n✗ ${problemes.length} problème(s) :\n- ${problemes.join('\n- ')}`);
  process.exit(1);
}
console.log('\n✓ Workflows syntaxiquement corrects');
