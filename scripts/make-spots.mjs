#!/usr/bin/env node
/**
 * Vignettes décoratives des cartes — l'« habillage » de l'application.
 *
 *   node scripts/make-spots.mjs
 *
 * Ce sont de petites scènes plates, sur fond transparent, posées dans le coin
 * des cartes : monuments pour « La France », balance pour les valeurs,
 * hémicycle pour les institutions… Elles donnent son caractère à l'écran sans
 * gêner la lecture, à la manière des maquettes de référence.
 *
 * Chaque vignette est déclinée en deux fichiers : une version claire et une
 * version sombre, choisies par la feuille de style. Un SVG chargé en <img>
 * n'hérite pas des couleurs de la page, d'où le doublon.
 */

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = resolve(ROOT, 'assets/spot');
mkdirSync(OUT, { recursive: true });

const W = 300;
const H = 170;

/**
 * Deux ambiances. En clair, des aplats pastel sur du blanc ; en sombre, les
 * mêmes formes remontées en luminosité pour rester lisibles sur #121b2d.
 */
const MODES = {
  clair: { deep: '#1e3a8a', mid: '#4f7bd4', soft: '#c3d5f5', pale: '#e8eefb', red: '#d8322b', gold: '#e9a23b', green: '#15803d', ink: '#0f1b33' },
  sombre: { deep: '#7d9cf5', mid: '#5678c8', soft: '#2b3b60', pale: '#1b2743', red: '#f4756d', gold: '#f0b45c', green: '#63d392', ink: '#cdd8e8' },
};

/* ------------------------------------------------------------- fragments */

/** Bâtiment à fronton et colonnes — mairie, assemblée, tribunal. */
function palais(c, { x = 150, y = 148, w = 150, h = 96, fill, colonnes = 6 } = {}) {
  const f = fill || c.deep;
  let out = `<path d="M${x - w / 2 - 10} ${y - h} l${w / 2 + 10} -32 l${w / 2 + 10} 32Z" fill="${f}"/>`;
  out += `<rect x="${x - w / 2}" y="${y - h}" width="${w}" height="12" fill="${f}"/>`;
  for (let i = 0; i < colonnes; i++) {
    const cw = w / (colonnes * 2);
    const cx = x - w / 2 + (w - cw) * (i / (colonnes - 1));
    out += `<rect x="${cx.toFixed(1)}" y="${y - h + 12}" width="${cw.toFixed(1)}" height="${h - 24}" rx="${(cw / 2).toFixed(1)}" fill="${f}"/>`;
  }
  out += `<rect x="${x - w / 2 - 12}" y="${y - 12}" width="${w + 24}" height="12" rx="3" fill="${f}"/>`;
  return out;
}

/** Drapeau tricolore sur sa hampe. */
function drapeau(x, y, w = 62, h = 42) {
  const t = w / 3;
  return `<g transform="translate(${x} ${y})">
    <rect x="-3" y="-6" width="5" height="${h + 44}" rx="2.5" fill="#94a3b8"/>
    <rect x="2" y="-6" width="${t}" height="${h}" fill="#1e3a8a"/>
    <rect x="${2 + t}" y="-6" width="${t}" height="${h}" fill="#f1f5f9"/>
    <rect x="${2 + 2 * t}" y="-6" width="${t}" height="${h}" fill="#d8322b"/>
  </g>`;
}

/** Colline douce de fond. */
function colline(c, { cx = 150, w = 300, h = 46, y = 148, fill } = {}) {
  return `<path d="M${cx - w / 2} ${y} Q ${cx} ${y - h * 2} ${cx + w / 2} ${y}Z" fill="${fill || c.pale}"/>`;
}

/** Ligne de sol. */
function sol(c, y = 148) {
  return `<rect x="0" y="${y}" width="${W}" height="4" rx="2" fill="${c.soft}"/>`;
}

/** Étoile à cinq branches. */
function etoile(x, y, r, fill) {
  const pts = [];
  for (let i = 0; i < 10; i++) {
    const a = (Math.PI / 5) * i - Math.PI / 2;
    const rr = i % 2 ? r * 0.42 : r;
    pts.push(`${(x + Math.cos(a) * rr).toFixed(1)},${(y + Math.sin(a) * rr).toFixed(1)}`);
  }
  return `<polygon points="${pts.join(' ')}" fill="${fill}"/>`;
}

/* --------------------------------------------------------------- scènes */

const SPOTS = {
  /* ---- thèmes du programme -------------------------------------------- */

  'principes-valeurs': (c) => `
    ${colline(c, { cx: 60, w: 200 })}
    ${sol(c)}
    <!-- la balance de l'égalité -->
    <g transform="translate(150 148)">
      <rect x="-30" y="-10" width="60" height="10" rx="5" fill="${c.deep}"/>
      <rect x="-4" y="-116" width="8" height="108" rx="4" fill="${c.deep}"/>
      <rect x="-76" y="-118" width="152" height="8" rx="4" fill="${c.deep}"/>
      ${[-76, 76].map((x) => `<rect x="${x - 1.5}" y="-114" width="3" height="26" fill="${c.mid}"/>
        <path d="M${x - 26} -88 h52 l-13 24 h-26Z" fill="${c.gold}"/>`).join('')}
      <circle cx="0" cy="-126" r="9" fill="${c.gold}"/>
    </g>
    ${drapeau(238, 66)}`,

  institutions: (c) => `
    ${colline(c, { cx: 240, w: 220 })}
    ${sol(c)}
    ${palais(c, { x: 132, y: 148, w: 158, h: 100 })}
    <rect x="118" y="112" width="28" height="36" rx="2" fill="${c.pale}"/>
    ${drapeau(232, 52, 54, 36)}
    ${etoile(48, 40, 9, c.soft)}${etoile(76, 66, 6, c.soft)}`,

  'droits-devoirs': (c) => `
    ${colline(c, { cx: 250, w: 200 })}
    ${sol(c)}
    <!-- un livre de droit ouvert -->
    <g transform="translate(142 106)">
      <path d="M-92 0 q46 -20 92 -4 q46 -16 92 4 l0 44 q-46 -20 -92 -4 q-46 -16 -92 4Z" fill="${c.deep}"/>
      <path d="M0 -4 l0 44" stroke="${c.pale}" stroke-width="3"/>
      ${[0, 1].map((s) => Array.from({ length: 3 }, (_, i) =>
    `<rect x="${s ? 14 : -80}" y="${6 + i * 10}" width="${66 - i * 12}" height="3.5" rx="1.75" fill="${c.pale}" opacity=".6"/>`).join('')).join('')}
    </g>
    <!-- le sceau -->
    <circle cx="238" cy="128" r="20" fill="${c.red}"/>
    <circle cx="238" cy="128" r="12" fill="none" stroke="${c.pale}" stroke-width="2.5" opacity=".7"/>
    ${etoile(60, 36, 8, c.soft)}`,

  'histoire-geo-culture': (c) => `
    ${colline(c, { cx: 210, w: 240, h: 40 })}
    ${sol(c)}
    <!-- silhouette de monuments -->
    <g fill="${c.deep}">
      <path d="M46 148 l0 -58 l14 -46 l14 46 l0 58Z"/>
      <path d="M38 108 h44" stroke="${c.pale}" stroke-width="4"/>
      <rect x="104" y="76" width="56" height="72" rx="2"/>
      <path d="M100 76 l32 -30 l32 30Z"/>
      <rect x="128" y="112" width="16" height="36" rx="2" fill="${c.pale}"/>
      <path d="M198 148 l0 -46 a22 22 0 0 1 44 0 l0 46Z"/>
      <rect x="192" y="96" width="56" height="8" rx="4"/>
      <rect x="216" y="52" width="8" height="42" rx="4"/>
      <circle cx="220" cy="46" r="9"/>
    </g>
    ${etoile(272, 34, 9, c.gold)}`,

  'vivre-societe': (c) => `
    ${colline(c, { cx: 70, w: 220 })}
    ${sol(c)}
    <!-- une maison et deux personnes -->
    <g transform="translate(96 148)" fill="${c.deep}">
      <rect x="-52" y="-76" width="104" height="76" rx="4"/>
      <path d="M-62 -76 l62 -38 l62 38Z"/>
      <rect x="-14" y="-40" width="28" height="40" rx="3" fill="${c.pale}"/>
      <rect x="-42" y="-64" width="20" height="18" rx="3" fill="${c.gold}"/>
      <rect x="22" y="-64" width="20" height="18" rx="3" fill="${c.gold}"/>
    </g>
    ${[[208, 1], [242, 0.86], [268, 0.94]].map(([x, s]) => `<g transform="translate(${x} 148) scale(${s})" fill="${c.mid}">
      <circle cx="0" cy="-58" r="12"/>
      <path d="M-15 -44 q15 -8 30 0 l4 32 -9 2 -3 10 -14 0 -3 -10 -9 -2Z"/>
    </g>`).join('')}`,

  /* ---- sections de l'application -------------------------------------- */

  examen: (c) => `
    ${sol(c)}
    <!-- chronomètre et copie -->
    <g transform="translate(198 92)">
      <circle cx="0" cy="0" r="52" fill="${c.pale}"/>
      <circle cx="0" cy="0" r="52" fill="none" stroke="${c.red}" stroke-width="9"
              stroke-dasharray="${(2 * Math.PI * 52).toFixed(1)}" stroke-dashoffset="${(2 * Math.PI * 52 * 0.28).toFixed(1)}"
              stroke-linecap="round" transform="rotate(-90)"/>
      <rect x="-4" y="-34" width="8" height="38" rx="4" fill="${c.deep}"/>
      <rect x="-3" y="-3" width="30" height="7" rx="3.5" fill="${c.deep}"/>
      <rect x="-14" y="-66" width="28" height="10" rx="4" fill="${c.deep}"/>
    </g>
    <g transform="translate(72 96)">
      <rect x="-44" y="-56" width="88" height="112" rx="7" fill="${c.deep}"/>
      ${Array.from({ length: 5 }, (_, i) => `<rect x="-30" y="${-38 + i * 18}" width="${60 - (i % 2) * 18}" height="5" rx="2.5" fill="${c.pale}" opacity=".65"/>`).join('')}
      <circle cx="30" cy="40" r="15" fill="${c.green}"/>
      <path d="M23 40 l5 5 l10 -11" stroke="#fff" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    </g>`,

  revision: (c) => `
    ${sol(c)}
    <!-- pile de cartes mémoire -->
    ${[[0, 22, c.soft], [10, 12, c.mid], [20, 0, c.deep]].map(([dx, dy, f]) =>
    `<rect x="${58 + dx}" y="${34 + dy}" width="128" height="94" rx="12" fill="${f}"/>`).join('')}
    ${Array.from({ length: 3 }, (_, i) => `<rect x="96" y="${58 + i * 18}" width="${76 - i * 20}" height="6" rx="3" fill="${c.pale}" opacity=".7"/>`).join('')}
    <!-- flèche du retour espacé -->
    <g transform="translate(238 84)">
      <path d="M0 -30 a30 30 0 1 1 -26 45" fill="none" stroke="${c.gold}" stroke-width="8" stroke-linecap="round"/>
      <path d="M-2 -34 l14 4 l-12 10Z" fill="${c.gold}"/>
    </g>`,

  livret: (c) => `
    ${sol(c)}
    <!-- le livret officiel -->
    <g transform="translate(150 92)">
      <rect x="-62" y="-62" width="124" height="124" rx="8" fill="${c.deep}"/>
      <rect x="-62" y="-62" width="14" height="124" rx="7" fill="${c.mid}"/>
      <rect x="-34" y="-40" width="76" height="7" rx="3.5" fill="${c.pale}"/>
      <rect x="-34" y="-24" width="54" height="5" rx="2.5" fill="${c.pale}" opacity=".65"/>
      ${Array.from({ length: 4 }, (_, i) => `<rect x="-34" y="${2 + i * 13}" width="${76 - (i % 2) * 22}" height="4.5" rx="2.25" fill="${c.pale}" opacity=".45"/>`).join('')}
      <rect x="-14" y="-74" width="28" height="26" rx="2" fill="${c.red}"/>
      <path d="M-14 -48 l14 -9 l14 9Z" fill="${c.red}"/>
    </g>
    ${drapeau(244, 40, 48, 32)}`,

  histoire: (c) => `
    ${sol(c)}
    <!-- un château sort des pages du livre -->
    <g transform="translate(150 96)" fill="${c.mid}">
      <rect x="-46" y="-38" width="92" height="38"/>
      <rect x="-58" y="-58" width="24" height="58"/>
      <rect x="34" y="-58" width="24" height="58"/>
      <path d="M-58 -58 l12 -22 l12 22Z"/><path d="M34 -58 l12 -22 l12 22Z"/>
      <path d="M-46 -38 l46 -30 l46 30Z"/>
      <rect x="-9" y="-18" width="18" height="18" rx="9" fill="${c.pale}"/>
    </g>
    <!-- le livre ouvert, au premier plan -->
    <g transform="translate(150 130)">
      <path d="M-96 0 q48 -26 96 -8 q48 -18 96 8 l0 22 q-48 -26 -96 -8 q-48 -18 -96 8Z" fill="${c.deep}"/>
      <path d="M0 -8 l0 22" stroke="${c.pale}" stroke-width="3"/>
    </g>
    ${etoile(150, 30, 14, c.gold)}
    ${[[86, 44], [214, 40], [64, 78], [236, 74]].map(([x, y], i) => etoile(x, y, 8 - (i % 2) * 3, c.soft)).join('')}`,

  progres: (c) => `
    ${sol(c)}
    <!-- histogramme montant -->
    ${[42, 66, 96, 130].map((hh, i) => `<rect x="${52 + i * 44}" y="${148 - hh}" width="30" height="${hh}" rx="7" fill="${i === 3 ? c.green : c.mid}"/>`).join('')}
    <path d="M60 ${148 - 52} L104 ${148 - 76} L148 ${148 - 106} L192 ${148 - 140}" fill="none" stroke="${c.gold}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
    ${[[60, 96], [104, 72], [148, 42], [192, 8]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="6" fill="${c.gold}"/>`).join('')}
    ${etoile(244, 36, 13, c.gold)}`,

  assistant: (c) => `
    ${sol(c)}
    <!-- bulle de conversation et étincelles -->
    <g transform="translate(132 88)">
      <path d="M-74 -50 h148 a14 14 0 0 1 14 14 v62 a14 14 0 0 1 -14 14 h-102 l-32 26 v-26 h-14 a14 14 0 0 1 -14 -14 v-62 a14 14 0 0 1 14 -14Z" fill="${c.deep}"/>
      ${Array.from({ length: 3 }, (_, i) => `<rect x="-52" y="${-30 + i * 18}" width="${104 - i * 30}" height="6" rx="3" fill="${c.pale}" opacity=".7"/>`).join('')}
    </g>
    ${etoile(242, 52, 18, c.gold)}${etoile(272, 92, 10, c.gold)}${etoile(252, 118, 7, c.soft)}`,

  compte: (c) => `
    ${sol(c)}
    <g transform="translate(150 92)">
      <circle cx="0" cy="0" r="56" fill="${c.pale}"/>
      <circle cx="0" cy="-16" r="22" fill="${c.deep}"/>
      <path d="M-36 42 a36 36 0 0 1 72 0Z" fill="${c.deep}"/>
    </g>
    ${etoile(238, 46, 12, c.gold)}${etoile(62, 130, 8, c.soft)}`,
};

/* ---------------------------------------------------------- génération */

let total = 0;
let n = 0;
for (const [key, scene] of Object.entries(SPOTS)) {
  for (const [mode, c] of Object.entries(MODES)) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" fill="none" role="img" aria-hidden="true">
${scene(c)}
</svg>`.replace(/\n\s*\n/g, '\n');
    writeFileSync(resolve(OUT, `${key}-${mode}.svg`), svg);
    total += Buffer.byteLength(svg);
    n += 1;
  }
  console.log(`  ${key}`);
}

console.log(`\n${n} fichiers (${Object.keys(SPOTS).length} vignettes × 2 thèmes), ${(total / 1024).toFixed(0)} Ko au total.`);
console.log(`Écrits dans ${OUT.replace(ROOT + '/', '')}`);
