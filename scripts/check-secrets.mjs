#!/usr/bin/env node
/**
 * Garde-fou anti-secrets.
 *
 * Le site est public : tout fichier publié est lisible par n'importe qui. Ce
 * script parcourt les fichiers suivis par Git et refuse la publication si une
 * clé d'API, un jeton ou un mot de passe s'y est glissé.
 *
 *   node scripts/check-secrets.mjs
 *
 * Il est lancé par le workflow de déploiement avant toute mise en ligne, et
 * peut aussi être installé comme hook local :
 *   git config core.hooksPath .githooks
 */

import { execFileSync } from 'node:child_process';
import { readFileSync, statSync } from 'node:fs';
import { extname } from 'node:path';

/** Motifs recherchés. Le premier groupe capturant sert à l'affichage tronqué. */
const RULES = [
  { name: 'clé API Anthropic', re: /\bsk-ant-[A-Za-z0-9_-]{20,}/g },
  { name: 'clé API OpenAI', re: /\bsk-(?:proj-)?[A-Za-z0-9]{32,}/g },
  { name: 'jeton GitHub', re: /\b(?:ghp|gho|ghu|ghs|ghr|github_pat)_[A-Za-z0-9_]{20,}/g },
  { name: 'clé AWS', re: /\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/g },
  { name: 'clé Google', re: /\bAIza[A-Za-z0-9_-]{35}\b/g },
  { name: 'jeton Slack', re: /\bxox[abposr]-[A-Za-z0-9-]{10,}/g },
  { name: 'clé privée', re: /-----BEGIN (?:RSA |EC |OPENSSH |PGP )?PRIVATE KEY-----/g },
  { name: 'jeton JWT', re: /\beyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/g },
  {
    name: 'secret affecté en dur',
    re: /\b(?:api[_-]?key|apikey|secret|password|passwd|token|authorization)\s*[:=]\s*['"`][^'"`\s$]{16,}['"`]/gi,
  },
];

/** Extensions binaires : rien à y chercher. */
const BINARY = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp', '.ico', '.pdf', '.woff', '.woff2', '.ttf', '.zip']);

/**
 * Faux positifs connus, vérifiés à la main. Chaque entrée doit rester la plus
 * étroite possible : c'est une dérogation, pas une mise en sourdine.
 */
const ALLOW = [
  // Le motif de validation de la clé saisie par l'utilisateur, et l'exemple
  // affiché dans le champ : ils ne contiennent aucune clé réelle.
  /sk-ant-\[A-Za-z0-9_-\]/,
  /'sk-ant-…'/,
  /« sk-ant- »/,
  // Le contrôle lui-même, ci-dessus.
  /^\s*\{ name: /,
];

function tracked() {
  const out = execFileSync('git', ['ls-files', '-z'], { encoding: 'utf8' });
  return out.split('\0').filter(Boolean);
}

let failed = false;
let scanned = 0;

console.log('Recherche de secrets dans les fichiers suivis par Git\n');

for (const file of tracked()) {
  if (BINARY.has(extname(file).toLowerCase())) continue;
  let size;
  try { size = statSync(file).size; } catch { continue; }
  if (size > 2_000_000) continue;

  let text;
  try { text = readFileSync(file, 'utf8'); } catch { continue; }
  scanned += 1;

  const lines = text.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (ALLOW.some((re) => re.test(line))) continue;

    for (const rule of RULES) {
      rule.re.lastIndex = 0;
      const m = rule.re.exec(line);
      if (!m) continue;
      const found = m[0];
      const shown = found.length > 18 ? `${found.slice(0, 12)}…${found.slice(-4)}` : found;
      console.error(`  ✗ ${file}:${i + 1} — ${rule.name} : ${shown}`);
      failed = true;
    }
  }
}

console.log(`${scanned} fichiers analysés.`);

if (failed) {
  console.error(`
✗ Un secret figure dans un fichier suivi par Git.

  Ce dépôt publie un site statique : ce qui est ici est public. Il ne suffit
  pas de supprimer la ligne — la valeur reste dans l'historique.

  1. Révoquez immédiatement la clé concernée chez son fournisseur.
  2. Retirez-la du fichier.
  3. Créez-en une nouvelle si nécessaire, et saisissez-la dans l'application
     (Mon compte → Assistant IA) : elle restera sur votre appareil.
`);
  process.exit(1);
}

console.log('\n✓ Aucun secret détecté');
