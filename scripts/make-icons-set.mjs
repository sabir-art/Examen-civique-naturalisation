#!/usr/bin/env node
/**
 * Construit js/lib/icons.js à partir du jeu Lucide.
 *
 *   node scripts/make-icons-set.mjs /chemin/vers/lucide/icons
 *
 * Pourquoi passer par un jeu existant : les icônes dessinées à la main de la
 * première version étaient irrégulières — la flamme et la double flèche
 * circulaire notamment. Lucide est sous licence ISC, régulier au pixel près,
 * et tracé sur la même grille de 24 avec un trait de 2.
 *
 * Seules les icônes réellement utilisées sont embarquées : le fichier produit
 * pèse quelques kilo-octets, pas les 3 500 icônes du jeu complet.
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = process.argv[2];

if (!SRC || !existsSync(SRC)) {
  console.error('Usage : node scripts/make-icons-set.mjs <dossier icons de lucide>');
  console.error('  git clone --depth 1 --filter=blob:none --sparse https://github.com/lucide-icons/lucide.git');
  console.error('  cd lucide && git sparse-checkout set icons');
  process.exit(1);
}

/** nom utilisé dans l'application → nom du fichier Lucide */
const MAP = {
  home: 'house',
  flag: 'flag',
  bank: 'landmark',
  scale: 'scale',
  book: 'book-open',
  clock: 'timer',
  chevron: 'chevron-right',
  back: 'chevron-left',
  check: 'check',
  cross: 'x',
  chart: 'chart-column',
  user: 'user',
  cog: 'settings',
  refresh: 'refresh-cw',
  play: 'play',
  pause: 'pause',
  target: 'target',
  fire: 'flame',
  download: 'download',
  upload: 'upload',
  warn: 'triangle-alert',
  info: 'info',
  logout: 'log-out',
  cloud: 'cloud',
  inbox: 'inbox',
  trash: 'trash-2',
  plus: 'plus',
  star: 'star',
  sparkles: 'sparkles',
  sound: 'volume-2',
  mute: 'volume-x',
  bulb: 'lightbulb',
  bookmark: 'bookmark',
  award: 'award',
  trophy: 'trophy',
  school: 'graduation-cap',
  pin: 'map-pin',
  calendar: 'calendar',
  bell: 'bell',
  search: 'search',
  ok: 'circle-check',
  ko: 'circle-x',
  lock: 'lock',
  chat: 'message-circle',
  mic: 'mic',
  edit: 'square-pen',
  list: 'list-checks',
  bolt: 'zap',
  heart: 'heart',
  shield: 'shield',
  users: 'users',
  vote: 'vote',
};

/** Extrait le contenu interne d'un SVG Lucide (tout ce qui est entre <svg> et </svg>). */
function corps(svg) {
  const m = svg.match(/<svg[^>]*>([\s\S]*?)<\/svg>/);
  if (!m) throw new Error('SVG illisible');
  return m[1]
    .replace(/<!--[\s\S]*?-->/g, '')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .join('');
}

const sorties = [];
let manquants = 0;

for (const [nom, fichier] of Object.entries(MAP)) {
  const p = join(SRC, `${fichier}.svg`);
  if (!existsSync(p)) { console.error(`  manquant : ${fichier}.svg`); manquants += 1; continue; }
  sorties.push(`  ${JSON.stringify(nom)}: '${corps(readFileSync(p, 'utf8')).replace(/'/g, "\\'")}',`);
}

const out = `/**
 * Jeu d'icônes — extrait de Lucide (https://lucide.dev), licence ISC.
 *
 * Fichier ENGENDRÉ par scripts/make-icons-set.mjs : ne pas modifier à la main.
 * Pour ajouter une icône, compléter la table MAP du script et le relancer.
 *
 * Toutes sont tracées sur une grille de 24 avec un trait de 2, sans remplissage :
 * la couleur suit \`currentColor\` et l'épaisseur se règle en CSS.
 */

export const ICONS = {
${sorties.join('\n')}
};

export const ICON_NAMES = Object.keys(ICONS);
`;

writeFileSync(resolve(ROOT, 'js/lib/icons.js'), out);
console.log(`${sorties.length} icônes écrites dans js/lib/icons.js (${(Buffer.byteLength(out) / 1024).toFixed(1)} Ko)`);
if (manquants) { console.error(`${manquants} manquante(s)`); process.exit(1); }
