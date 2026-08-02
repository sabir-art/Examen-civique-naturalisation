#!/usr/bin/env node
/**
 * Génère les illustrations SVG de « La France racontée ».
 *
 *   node scripts/make-illustrations.mjs
 *
 * Pourquoi du SVG dessiné plutôt que des photographies :
 *  - quelques kilo-octets par image au lieu de cent, ce qui compte pour une
 *    application qui doit fonctionner hors ligne sur un téléphone ;
 *  - net sur tous les écrans, sans version « 2x » ni « 3x » ;
 *  - aucune question de droits : rien n'est repris d'ailleurs.
 *
 * Chaque acte a sa palette. Les scènes sont volontairement simples : une
 * silhouette forte, deux ou trois plans, pas de visage. Elles servent de repère
 * visuel au chapitre, pas d'illustration documentaire.
 */

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = resolve(ROOT, 'assets/story');
mkdirSync(OUT, { recursive: true });

const W = 800;
const H = 420;

/* ------------------------------------------------------------- palettes */

/**
 * Une palette par acte, en cinq plans du plus lointain au plus proche.
 *
 * Règle de lisibilité, apprise en regardant les premiers essais : rien de ce
 * qui se tient SUR le sol ne doit être peint en `ink`, sinon la silhouette
 * disparaît dans le sol. Le premier plan utilise `fg`, un ton nettement plus
 * clair que `ink`.
 */
const ACTES = {
  1: { sky: ['#3b2a63', '#7c5aa8'], far: '#4a3574', near: '#2b1d49', ink: '#150d28', fg: '#6b4f9c', light: '#f5c86b', accent: '#e0876a' },
  2: { sky: ['#123a63', '#3d7ea6'], far: '#1d5480', near: '#0f2c4d', ink: '#06121f', fg: '#2f6f9e', light: '#ffd27a', accent: '#e0533c' },
  3: { sky: ['#0d4f57', '#3fa3a3'], far: '#176c73', near: '#0a373d', ink: '#04191d', fg: '#2e8d92', light: '#ffe08a', accent: '#e8664a' },
};

/* ------------------------------------------------------------- fragments */

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Ciel dégradé + halo lumineux, fond commun à toutes les scènes. */
function ciel(p, { sun = null } = {}) {
  return `
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${p.sky[0]}"/><stop offset="1" stop-color="${p.sky[1]}"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="52%" r="52%">
      <stop offset="0" stop-color="${p.light}" stop-opacity=".55"/>
      <stop offset="1" stop-color="${p.light}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#sky)"/>
  ${sun ? `<circle cx="${sun.x}" cy="${sun.y}" r="${sun.r || 260}" fill="url(#glow)"/>` : `<ellipse cx="${W / 2}" cy="${H * 0.62}" rx="330" ry="200" fill="url(#glow)"/>`}`;
}

/** Sol au premier plan. */
function sol(p, y = H - 62) {
  return `<path d="M0 ${y} Q ${W / 4} ${y - 14} ${W / 2} ${y} T ${W} ${y - 6} L${W} ${H} L0 ${H}Z" fill="${p.ink}"/>`;
}

/** Colline lointaine. */
function colline(p, { cx = 400, w = 520, h = 150, y = H - 62, fill = null } = {}) {
  return `<path d="M${cx - w / 2} ${y} Q ${cx} ${y - h} ${cx + w / 2} ${y} Z" fill="${fill || p.far}"/>`;
}

/** Personnage : silhouette simple, debout. Par défaut en ton de premier plan. */
function figure(p, x, y, s = 1, fill = null) {
  const c = fill || p.fg;
  return `<g transform="translate(${x} ${y}) scale(${s})" fill="${c}">
    <circle cx="0" cy="-46" r="9"/>
    <path d="M-11 -36 q11 -6 22 0 l4 26 -8 2 -2 26 -5 0 -2 -22 -2 22 -5 0 -2 -26 -8 -2Z"/>
  </g>`;
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

/** Petites étoiles éparses dans le ciel. */
function poussiere(seed = 1, n = 26) {
  let s = seed * 9301 + 49297;
  const rnd = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  let out = '';
  for (let i = 0; i < n; i++) {
    const x = rnd() * W;
    const y = rnd() * H * 0.55;
    const r = 0.7 + rnd() * 1.5;
    out += `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${r.toFixed(1)}" fill="#fff" opacity="${(0.15 + rnd() * 0.4).toFixed(2)}"/>`;
  }
  return out;
}

/** Drapeau tricolore, flottant. */
function tricolore(x, y, w = 90, h = 58) {
  const t = w / 3;
  return `<g transform="translate(${x} ${y})">
    <rect x="-3" y="-14" width="5" height="${h + 60}" fill="#2b2b2b"/>
    <path d="M2 -10 h${t} v${h} h-${t}Z" fill="#0d3b8f"/>
    <path d="M${2 + t} -10 h${t} v${h} h-${t}Z" fill="#f4f4f4"/>
    <path d="M${2 + 2 * t} -10 h${t} v${h} h-${t}Z" fill="#d8322b"/>
  </g>`;
}

/** Bâtiment à colonnes (mairie, tribunal, temple). */
function fronton(p, x, y, w, h, fill) {
  const c = fill || p.near;
  const cols = 5;
  let out = `<path d="M${x} ${y} l${w / 2} -${h * 0.34} l${w / 2} ${h * 0.34}Z" fill="${c}"/>`;
  out += `<rect x="${x}" y="${y}" width="${w}" height="${h * 0.14}" fill="${c}"/>`;
  for (let i = 0; i < cols; i++) {
    const cw = w / (cols * 2.1);
    const cx = x + (w - cw) * (i / (cols - 1));
    out += `<rect x="${cx.toFixed(1)}" y="${y + h * 0.14}" width="${cw.toFixed(1)}" height="${h * 0.7}" fill="${c}"/>`;
  }
  out += `<rect x="${x - 6}" y="${y + h * 0.84}" width="${w + 12}" height="${h * 0.16}" fill="${c}"/>`;
  return out;
}

/** Livre ouvert vu de face. */
function livre(x, y, w, h, cover, page) {
  return `<g transform="translate(${x} ${y})">
    <path d="M0 0 q${w / 2} -14 ${w} 0 l0 ${h} q-${w / 2} 14 -${w} 0Z" fill="${cover}"/>
    <path d="M${w / 2} -7 l0 ${h}" stroke="${page}" stroke-width="2" opacity=".55"/>
    <path d="M8 6 q${w / 2 - 8} -12 ${w / 2 - 10} -3" stroke="${page}" stroke-width="2.5" fill="none" opacity=".5"/>
    <path d="M${w / 2 + 10} 3 q${w / 2 - 18} -9 ${w / 2 - 18} 3" stroke="${page}" stroke-width="2.5" fill="none" opacity=".5"/>
  </g>`;
}

/** Rouleau de parchemin. */
function parchemin(x, y, w, h, fill, line) {
  let out = `<g transform="translate(${x} ${y})">
    <rect x="0" y="0" width="${w}" height="${h}" rx="4" fill="${fill}"/>
    <rect x="-8" y="-7" width="${w + 16}" height="9" rx="4.5" fill="${fill}" opacity=".8"/>
    <rect x="-8" y="${h - 2}" width="${w + 16}" height="9" rx="4.5" fill="${fill}" opacity=".8"/>`;
  for (let i = 0; i < 6; i++) {
    out += `<rect x="12" y="${16 + i * 14}" width="${w - 24 - (i === 5 ? 40 : 0)}" height="3" rx="1.5" fill="${line}" opacity=".5"/>`;
  }
  return `${out}</g>`;
}

/* ------------------------------------------------------------- les scènes */

const SCENES = {
  /* ------------------------------------------------ Acte I : le temps des rois */

  ch01: (p) => `${ciel(p)}${poussiere(3)}
    ${colline(p, { cx: 400, w: 700, h: 190 })}
    <!-- double palissade romaine autour de la colline -->
    ${Array.from({ length: 26 }, (_, i) => {
    const x = 60 + i * 27;
    return `<path d="M${x} ${H - 96} l0 -30 l7 -10 l7 10 l0 30Z" fill="${p.near}"/>`;
  }).join('')}
    ${sol(p)}
    <!-- le vaincu debout, le vainqueur assis : deux silhouettes bien détachées -->
    ${figure(p, 236, H - 44, 1.25, p.light)}
    ${figure(p, 572, H - 44, 1.15, p.fg)}
    <!-- les armes déposées entre les deux -->
    <g transform="translate(400 ${H - 34})">
      <ellipse cx="0" cy="6" rx="86" ry="15" fill="${p.ink}" opacity=".5"/>
      <path d="M-74 -2 l138 -14" stroke="${p.light}" stroke-width="6" stroke-linecap="round"/>
      <path d="M64 -16 l24 -3 l-22 -9Z" fill="${p.light}"/>
      <rect x="-84" y="-8" width="26" height="8" rx="4" fill="${p.accent}"/>
      <path d="M-40 4 a44 30 0 0 1 88 0Z" fill="${p.accent}"/>
      <path d="M-40 4 a44 30 0 0 1 88 0" fill="none" stroke="${p.light}" stroke-width="3"/>
      <circle cx="4" cy="-8" r="7" fill="${p.light}"/>
    </g>`,

  ch02: (p) => `${ciel(p, { sun: { x: 400, y: 150, r: 240 } })}${poussiere(7)}
    ${colline(p, { cx: 130, w: 420, h: 110 })}
    ${colline(p, { cx: 690, w: 420, h: 96 })}
    <!-- cathédrale de Reims -->
    <g transform="translate(400 ${H - 62})" fill="${p.near}">
      <rect x="-92" y="-150" width="184" height="150"/>
      <rect x="-92" y="-210" width="46" height="60"/><path d="M-92 -210 l23 -34 l23 34Z"/>
      <rect x="46" y="-210" width="46" height="60"/><path d="M46 -210 l23 -34 l23 34Z"/>
      <path d="M-26 0 l0 -76 a26 26 0 0 1 52 0 l0 76Z" fill="${p.ink}"/>
      <circle cx="0" cy="-120" r="22" fill="${p.ink}"/>
      <circle cx="0" cy="-120" r="13" fill="${p.light}" opacity=".75"/>
    </g>
    ${sol(p)}
    <!-- la colombe et la couronne -->
    ${etoile(400, 104, 13, p.light)}
    <g transform="translate(400 150)" fill="${p.light}">
      <path d="M-34 0 l8 -22 l9 12 l9 -18 l9 18 l9 -12 l8 22Z" opacity=".95"/>
    </g>
    ${figure(p, 300, H - 46, 0.9)}`,

  ch03: (p) => `${ciel(p, { sun: { x: 400, y: 260, r: 280 } })}${poussiere(11)}
    <!-- remparts d'Orléans -->
    <g fill="${p.far}">
      <rect x="0" y="${H - 190}" width="${W}" height="128"/>
      ${Array.from({ length: 20 }, (_, i) => `<rect x="${i * 42}" y="${H - 208}" width="24" height="20"/>`).join('')}
      <rect x="330" y="${H - 150}" width="60" height="88" fill="${p.ink}"/>
    </g>
    ${sol(p)}
    <!-- bannière -->
    <g transform="translate(470 ${H - 60})">
      <rect x="-3" y="-215" width="6" height="215" fill="${p.ink}"/>
      <path d="M3 -212 l120 18 l-120 22Z" fill="#f4f4f4"/>
      ${etoile(52, -184, 11, p.accent)}
    </g>
    <!-- l'armure -->
    <g transform="translate(470 ${H - 62})" fill="${p.light}">
      <circle cx="0" cy="-58" r="12"/>
      <path d="M-15 -46 q15 -8 30 0 l5 34 -10 3 -3 34 -6 0 -3 -28 -3 28 -6 0 -3 -34 -10 -3Z"/>
    </g>
    <!-- le siège : flammes derrière le rempart -->
    ${Array.from({ length: 9 }, (_, i) => {
    const x = 90 + i * 34;
    const hh = 42 + (i % 3) * 20;
    return `<path d="M${x} ${H - 190} q-13 -${hh * 0.55} 0 -${hh} q5 ${hh * 0.3} 13 ${hh * 0.1} q7 ${hh * 0.45} -13 ${hh * 0.9}Z" fill="${p.accent}" opacity=".${5 + (i % 4)}"/>`;
  }).join('')}
    ${Array.from({ length: 14 }, (_, i) => {
    const x = 96 + i * 22;
    return `<circle cx="${x}" cy="${H - 250 - (i % 5) * 22}" r="${2 + (i % 3)}" fill="${p.light}" opacity=".6"/>`;
  }).join('')}`,

  ch04: (p) => `${ciel(p)}${poussiere(5)}
    ${colline(p, { cx: 400, w: 900, h: 120 })}
    <!-- deux lieux de culte, côte à côte -->
    <g transform="translate(180 ${H - 62})" fill="${p.near}">
      <rect x="-56" y="-112" width="112" height="112"/>
      <path d="M-56 -112 l56 -40 l56 40Z"/>
      <rect x="-6" y="-170" width="12" height="34"/><rect x="-20" y="-158" width="40" height="12"/>
    </g>
    <g transform="translate(620 ${H - 62})" fill="${p.near}">
      <rect x="-52" y="-98" width="104" height="98"/>
      <path d="M-52 -98 l52 -34 l52 34Z"/>
    </g>
    ${sol(p)}
    <!-- l'édit -->
    ${parchemin(330, H - 190, 140, 108, '#f2e6cf', p.ink)}
    <circle cx="400" cy="${H - 74}" r="17" fill="${p.accent}"/>
    <circle cx="400" cy="${H - 74}" r="9" fill="${p.ink}" opacity=".3"/>`,

  ch05: (p) => `${ciel(p, { sun: { x: 400, y: 120, r: 300 } })}
    <!-- soleil rayonnant -->
    ${Array.from({ length: 24 }, (_, i) => {
    const a = (Math.PI * 2 * i) / 24;
    const x1 = 400 + Math.cos(a) * 48;
    const y1 = 120 + Math.sin(a) * 48;
    const x2 = 400 + Math.cos(a) * 92;
    const y2 = 120 + Math.sin(a) * 92;
    return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${p.light}" stroke-width="3" opacity=".8"/>`;
  }).join('')}
    <circle cx="400" cy="120" r="42" fill="${p.light}"/>
    <!-- le château -->
    <g transform="translate(400 ${H - 62})" fill="${p.near}">
      <rect x="-300" y="-92" width="600" height="92"/>
      <rect x="-90" y="-128" width="180" height="128"/>
      <path d="M-96 -128 l96 -30 l96 30Z"/>
      ${Array.from({ length: 17 }, (_, i) => `<rect x="${-286 + i * 35}" y="-74" width="17" height="48" rx="8.5" fill="${p.ink}" opacity=".55"/>`).join('')}
    </g>
    ${sol(p, H - 40)}
    <!-- parterres -->
    ${Array.from({ length: 5 }, (_, i) => `<ellipse cx="${180 + i * 110}" cy="${H - 20}" rx="42" ry="9" fill="${p.far}" opacity=".5"/>`).join('')}`,

  ch06: (p) => `${ciel(p, { sun: { x: 400, y: 200, r: 250 } })}${poussiere(13)}
    ${sol(p)}
    <!-- pile de livres et lampe -->
    <g transform="translate(400 ${H - 62})">
      <rect x="-96" y="-26" width="192" height="26" rx="4" fill="${p.near}"/>
      <rect x="-84" y="-48" width="168" height="24" rx="4" fill="${p.far}"/>
      <rect x="-70" y="-68" width="140" height="22" rx="4" fill="${p.near}"/>
      <!-- la lampe -->
      <path d="M-34 -68 l68 0 l-10 -30 l-48 0Z" fill="${p.light}"/>
      <rect x="-5" y="-110" width="10" height="14" fill="${p.ink}"/>
      <circle cx="0" cy="-124" r="17" fill="${p.light}"/>
      <circle cx="0" cy="-124" r="38" fill="${p.light}" opacity=".22"/>
      <circle cx="0" cy="-124" r="62" fill="${p.light}" opacity=".1"/>
    </g>
    <!-- les idées circulent : des feuillets emportés vers le haut -->
    ${[[152, 190, -18], [636, 148, 14], [252, 108, 9], [560, 246, -11]].map(([x, y, r]) =>
    `<rect x="${x}" y="${y}" width="40" height="28" rx="2" fill="#f4f4f4" opacity=".8" transform="rotate(${r} ${x + 20} ${y + 14})"/>
     <rect x="${x + 6}" y="${y + 7}" width="26" height="2.5" fill="${p.ink}" opacity=".35" transform="rotate(${r} ${x + 20} ${y + 14})"/>
     <rect x="${x + 6}" y="${y + 14}" width="18" height="2.5" fill="${p.ink}" opacity=".35" transform="rotate(${r} ${x + 20} ${y + 14})"/>`).join('')}`,

  /* --------------------------------------------- Acte II : le temps du peuple */

  ch07: (p) => `${ciel(p, { sun: { x: 400, y: 190, r: 300 } })}${poussiere(17)}
    <!-- la Bastille : tours détachées par des liserés clairs -->
    <g transform="translate(400 ${H - 96})">
      ${[-206, -114, -22, 70, 162].map((x) => `<g>
        <rect x="${x}" y="-196" width="76" height="196" rx="3" fill="${p.near}"/>
        <rect x="${x}" y="-196" width="4" height="196" fill="${p.fg}" opacity=".65"/>
        <rect x="${x - 5}" y="-206" width="86" height="14" rx="3" fill="${p.fg}"/>
        <rect x="${x + 28}" y="-150" width="20" height="40" rx="10" fill="${p.ink}"/>
      </g>`).join('')}
    </g>
    ${sol(p, H - 96)}
    <!-- la foule et les piques, en contre-jour -->
    ${Array.from({ length: 15 }, (_, i) => {
    const x = 24 + i * 54;
    return `<line x1="${x}" y1="${H - 40}" x2="${x - 10}" y2="${H - 168 - (i % 3) * 22}" stroke="${p.fg}" stroke-width="4.5" stroke-linecap="round"/>`;
  }).join('')}
    ${Array.from({ length: 12 }, (_, i) => figure(p, 40 + i * 66, H - 16, 0.78, i % 3 ? p.fg : p.light)).join('')}
    ${tricolore(624, H - 300, 110, 70)}`,

  ch08: (p) => `${ciel(p, { sun: { x: 400, y: 130, r: 260 } })}${poussiere(23)}
    <!-- l'œil de la raison -->
    <g transform="translate(400 118)">
      <path d="M-56 0 l56 -46 l56 46Z" fill="none" stroke="${p.light}" stroke-width="4"/>
      <ellipse cx="0" cy="-18" rx="22" ry="13" fill="${p.light}"/>
      <circle cx="0" cy="-18" r="6" fill="${p.ink}"/>
      ${Array.from({ length: 16 }, (_, i) => {
    const a = (Math.PI * 2 * i) / 16;
    return `<line x1="${(Math.cos(a) * 78).toFixed(1)}" y1="${(-24 + Math.sin(a) * 78).toFixed(1)}" x2="${(Math.cos(a) * 106).toFixed(1)}" y2="${(-24 + Math.sin(a) * 106).toFixed(1)}" stroke="${p.light}" stroke-width="2.5" opacity=".55"/>`;
  }).join('')}
    </g>
    <!-- les tables des droits -->
    <g transform="translate(400 ${H - 46})">
      <path d="M-160 0 l0 -150 a72 72 0 0 1 144 0 l0 150Z" fill="#f2e6cf" transform="translate(-8 0)"/>
      <path d="M16 0 l0 -150 a72 72 0 0 1 144 0 l0 150Z" fill="#f2e6cf" transform="translate(8 0)"/>
      ${[0, 1].map((side) => Array.from({ length: 8 }, (_, i) =>
    `<rect x="${side ? 40 : -136}" y="${-118 + i * 15}" width="${88 - (i === 7 ? 34 : 0)}" height="3.5" rx="1.75" fill="${p.ink}" opacity=".45"/>`).join('')).join('')}
    </g>
    ${sol(p, H - 36)}`,

  ch09: (p) => `${ciel(p)}${poussiere(29)}
    ${colline(p, { cx: 400, w: 900, h: 100 })}
    ${sol(p)}
    <!-- le Code civil -->
    <g transform="translate(400 ${H - 150})">
      <rect x="-116" y="0" width="232" height="34" rx="4" fill="${p.ink}"/>
      <rect x="-108" y="-30" width="216" height="32" rx="4" fill="${p.accent}"/>
      <rect x="-100" y="-58" width="200" height="30" rx="4" fill="${p.near}"/>
      <rect x="-72" y="-49" width="144" height="4" rx="2" fill="${p.light}" opacity=".9"/>
      <rect x="-52" y="-40" width="104" height="3" rx="1.5" fill="${p.light}" opacity=".6"/>
    </g>
    <!-- la plume et l'encrier : c'est l'écriture du droit qui compte ici -->
    <g transform="translate(400 ${H - 216})">
      <path d="M18 0 q54 -22 84 -86 q-10 66 -70 96Z" fill="${p.light}"/>
      <path d="M22 -4 q46 -22 72 -74" stroke="${p.near}" stroke-width="2" fill="none" opacity=".5"/>
      <path d="M18 0 l-14 11" stroke="${p.light}" stroke-width="4" stroke-linecap="round"/>
    </g>
    <!-- l'encrier, posé à côté du code -->
    <g transform="translate(268 ${H - 172})">
      <path d="M-30 22 h60 l-7 -30 h-46Z" fill="${p.fg}"/>
      <ellipse cx="0" cy="-8" rx="23" ry="7" fill="${p.ink}"/>
      <ellipse cx="0" cy="-9" rx="15" ry="4" fill="${p.near}"/>
    </g>
    ${etoile(150, 116, 15, p.light)}${etoile(662, 92, 11, p.light)}`,

  ch10: (p) => `${ciel(p, { sun: { x: 400, y: 170, r: 300 } })}${poussiere(31)}
    ${sol(p)}
    <!-- la chaîne brisée : maillons nets, rupture au centre -->
    ${[-1, 1].map((s) => Array.from({ length: 4 }, (_, i) => {
    const cx = 400 + s * (56 + i * 42);
    return `<ellipse cx="${cx}" cy="${160 - s * 4 * i}" rx="23" ry="15" fill="none" stroke="${p.light}" stroke-width="9"
      transform="rotate(${s * (12 + i * 4)} ${cx} ${160})"/>`;
  }).join('')).join('')}
    <!-- les deux maillons rompus -->
    <path d="M370 152 a20 15 0 0 1 4 22" fill="none" stroke="${p.light}" stroke-width="9" stroke-linecap="round"/>
    <path d="M430 168 a20 15 0 0 0 -4 -22" fill="none" stroke="${p.light}" stroke-width="9" stroke-linecap="round"/>
    ${etoile(400, 160, 26, p.light)}
    ${[[358, 202, 4], [446, 208, 3], [400, 216, 2]].map(([x, y, r]) =>
    `<circle cx="${x}" cy="${y}" r="${r}" fill="${p.light}" opacity=".75"/>`).join('')}
    <!-- l'urne -->
    <g transform="translate(400 ${H - 62})">
      <rect x="-72" y="-96" width="144" height="96" rx="6" fill="${p.near}"/>
      <rect x="-60" y="-84" width="120" height="72" rx="4" fill="${p.ink}" opacity=".45"/>
      <rect x="-28" y="-104" width="56" height="9" rx="4.5" fill="${p.ink}"/>
      <rect x="-20" y="-138" width="40" height="30" rx="2" fill="#f4f4f4" transform="rotate(-11 0 -122)"/>
    </g>
    ${figure(p, 250, H - 46, 0.95)}${figure(p, 556, H - 46, 0.95)}`,

  ch11: (p) => `${ciel(p, { sun: { x: 400, y: 150, r: 250 } })}
    ${colline(p, { cx: 130, w: 400, h: 90 })}${colline(p, { cx: 700, w: 400, h: 78 })}
    <!-- l'école -->
    <g transform="translate(400 ${H - 62})" fill="${p.near}">
      <rect x="-150" y="-130" width="300" height="130"/>
      <path d="M-166 -130 l166 -54 l166 54Z"/>
      <rect x="-30" y="-64" width="60" height="64" fill="${p.ink}"/>
      ${[-110, -66, 66, 110].map((x) => `<rect x="${x - 18}" y="-104" width="36" height="36" rx="3" fill="${p.light}" opacity=".85"/>`).join('')}
      <rect x="-6" y="-206" width="12" height="26" fill="${p.ink}"/>
      <circle cx="0" cy="-214" r="9" fill="${p.light}"/>
    </g>
    ${tricolore(560, H - 250, 76, 50)}
    ${sol(p)}
    <!-- les enfants -->
    ${Array.from({ length: 6 }, (_, i) => figure(p, 128 + i * 42, H - 20, 0.5 + (i % 2) * 0.08)).join('')}
    ${Array.from({ length: 4 }, (_, i) => figure(p, 560 + i * 42, H - 20, 0.5 + (i % 2) * 0.08)).join('')}`,

  ch12: (p) => `${ciel(p)}${poussiere(37)}
    ${sol(p)}
    <!-- la balance : l'État d'un côté, les cultes de l'autre -->
    <g transform="translate(400 ${H - 62})">
      <rect x="-7" y="-232" width="14" height="232" fill="${p.ink}"/>
      <rect x="-70" y="-14" width="140" height="14" rx="7" fill="${p.ink}"/>
      <line x1="-176" y1="-224" x2="176" y2="-224" stroke="${p.ink}" stroke-width="9" stroke-linecap="round"/>
      <circle cx="0" cy="-240" r="13" fill="${p.light}"/>
      ${[-176, 176].map((x) => `<line x1="${x}" y1="-224" x2="${x}" y2="-176" stroke="${p.ink}" stroke-width="3"/>
        <path d="M${x - 46} -176 h92 l-24 40 h-44Z" fill="${p.near}"/>`).join('')}
    </g>
    ${fronton(p, 328, H - 302, 144, 78, p.light)}
    <g transform="translate(576 ${H - 262})" fill="${p.light}">
      <rect x="-30" y="-46" width="60" height="46"/><path d="M-30 -46 l30 -26 l30 26Z"/>
      <rect x="-3" y="-92" width="6" height="22"/><rect x="-13" y="-84" width="26" height="6"/>
    </g>`,

  ch13: (p) => `${ciel(p)}${poussiere(41, 14)}
    <!-- la ligne de tranchée -->
    <path d="M0 ${H - 120} h180 l30 -34 h140 l30 34 h180 l30 -30 h210" fill="none" stroke="${p.far}" stroke-width="7"/>
    ${sol(p, H - 96)}
    ${Array.from({ length: 9 }, (_, i) => `<path d="M${60 + i * 88} ${H - 96} l0 -34" stroke="${p.ink}" stroke-width="3"/>
      <path d="M${52 + i * 88} ${H - 130} h16" stroke="${p.ink}" stroke-width="3"/>`).join('')}
    <!-- le casque -->
    <g transform="translate(400 ${H - 108})" fill="${p.near}">
      <path d="M-62 0 a62 52 0 0 1 124 0Z"/>
      <rect x="-74" y="-4" width="148" height="12" rx="6"/>
      <path d="M-3 -52 l6 0 l0 -16 l-3 -8 l-3 8Z"/>
    </g>
    <!-- les coquelicots -->
    ${[[130, H - 60], [250, H - 40], [560, H - 52], [680, H - 34], [430, H - 30]].map(([x, y]) =>
    `<g transform="translate(${x} ${y})"><line x1="0" y1="0" x2="0" y2="-30" stroke="${p.far}" stroke-width="2.5"/>
      ${[0, 72, 144, 216, 288].map((a) => `<ellipse cx="0" cy="-40" rx="9" ry="12" fill="${p.accent}" transform="rotate(${a} 0 -32)"/>`).join('')}
      <circle cx="0" cy="-32" r="4" fill="${p.ink}"/></g>`).join('')}`,

  ch14: (p) => `${ciel(p)}${poussiere(43)}
    ${sol(p)}
    <!-- ondes radio -->
    ${[70, 110, 150, 190].map((r, i) =>
    `<circle cx="400" cy="176" r="${r}" fill="none" stroke="${p.light}" stroke-width="2.5" opacity="${(0.5 - i * 0.1).toFixed(2)}"/>`).join('')}
    <!-- le micro -->
    <g transform="translate(400 ${H - 62})">
      <rect x="-46" y="-14" width="92" height="14" rx="7" fill="${p.ink}"/>
      <rect x="-5" y="-104" width="10" height="92" fill="${p.ink}"/>
      <rect x="-38" y="-172" width="76" height="76" rx="12" fill="${p.near}"/>
      ${Array.from({ length: 5 }, (_, i) => `<line x1="-26" y1="${-160 + i * 14}" x2="26" y2="${-160 + i * 14}" stroke="${p.ink}" stroke-width="3.5" opacity=".7"/>`).join('')}
    </g>
    <!-- croix de Lorraine -->
    <g transform="translate(400 176)" fill="${p.light}">
      <rect x="-5" y="-72" width="10" height="132" opacity=".95"/>
      <rect x="-30" y="-48" width="60" height="10" opacity=".95"/>
      <rect x="-40" y="-4" width="80" height="10" opacity=".95"/>
    </g>`,

  ch15: (p) => `${ciel(p, { sun: { x: 400, y: 160, r: 260 } })}${poussiere(47)}
    ${sol(p)}
    <!-- trois pouvoirs, trois colonnes -->
    ${[210, 400, 590].map((x, i) => `<g transform="translate(${x} ${H - 62})" fill="${p.near}">
      <rect x="-40" y="-${140 - i * 0} " width="80" height="12"/>
      <rect x="-30" y="-128" width="60" height="112" rx="4"/>
      <rect x="-46" y="-16" width="92" height="16" rx="3"/>
      ${Array.from({ length: 4 }, (_, k) => `<line x1="${-18 + k * 12}" y1="-120" x2="${-18 + k * 12}" y2="-24" stroke="${p.ink}" stroke-width="2" opacity=".35"/>`).join('')}
    </g>`).join('')}
    <!-- la Constitution au-dessus -->
    ${livre(320, 130, 160, 66, p.light, p.ink)}
    <line x1="150" y1="${H - 200}" x2="650" y2="${H - 200}" stroke="${p.light}" stroke-width="4" opacity=".5"/>`,

  ch16: (p) => `${ciel(p, { sun: { x: 400, y: 190, r: 300 } })}${poussiere(53)}
    ${sol(p)}
    <!-- quatre marches, quatre lois -->
    ${[0, 1, 2, 3].map((i) => {
    const w = 150;
    const x = 100 + i * w * 0.82;
    const hh = 60 + i * 42;
    return `<rect x="${x}" y="${H - 62 - hh}" width="${w}" height="${hh}" rx="4" fill="${i % 2 ? p.near : p.far}"/>
      ${etoile(x + w / 2, H - 62 - hh - 22, 13, p.light)}`;
  }).join('')}
    ${figure(p, 596, H - 268, 0.95, p.ink)}`,

  /* --------------------------------- Acte III : la France d'aujourd'hui */

  ch17: (p) => `${ciel(p, { sun: { x: 400, y: 150, r: 260 } })}
    ${colline(p, { cx: 110, w: 380, h: 76 })}${colline(p, { cx: 720, w: 380, h: 66 })}
    <!-- la mairie -->
    ${fronton(p, 250, H - 190, 300, 128)}
    <g transform="translate(400 ${H - 62})">
      <rect x="-30" y="-62" width="60" height="62" fill="${p.ink}"/>
      <rect x="-142" y="-206" width="284" height="18" rx="4" fill="${p.light}" opacity=".92"/>
    </g>
    ${tricolore(268, H - 300, 84, 54)}
    ${tricolore(470, H - 300, 84, 54)}
    ${sol(p)}
    ${Array.from({ length: 5 }, (_, i) => figure(p, 190 + i * 106, H - 20, 0.62)).join('')}`,

  ch18: (p) => `${ciel(p)}${poussiere(59, 16)}
    ${sol(p)}
    <!-- l'isoloir -->
    <g transform="translate(250 ${H - 62})">
      <rect x="-96" y="-206" width="192" height="14" rx="4" fill="${p.ink}"/>
      <rect x="-88" y="-192" width="70" height="192" fill="${p.accent}" opacity=".9"/>
      <rect x="18" y="-192" width="70" height="192" fill="${p.accent}" opacity=".9"/>
      ${Array.from({ length: 8 }, (_, i) => `<line x1="${-84 + i * 9}" y1="-192" x2="${-84 + i * 9}" y2="0" stroke="${p.ink}" stroke-width="1.5" opacity=".25"/>`).join('')}
      ${figure(p, 0, -14, 1.05, p.ink)}
    </g>
    <!-- l'urne transparente -->
    <g transform="translate(580 ${H - 62})">
      <rect x="-78" y="-104" width="156" height="104" rx="6" fill="${p.light}" opacity=".22" stroke="${p.light}" stroke-width="3"/>
      <rect x="-30" y="-113" width="60" height="10" rx="5" fill="${p.ink}"/>
      ${[[-30, -50, -12], [6, -34, 9], [-6, -18, 3]].map(([x, y, r]) =>
    `<rect x="${x}" y="${y}" width="44" height="26" rx="2" fill="#f4f4f4" opacity=".9" transform="rotate(${r} ${x + 22} ${y + 13})"/>`).join('')}
      <rect x="-24" y="-152" width="48" height="30" rx="2" fill="#f4f4f4" transform="rotate(-13 0 -137)"/>
    </g>`,

  ch19: (p) => `${ciel(p, { sun: { x: 400, y: 180, r: 240 } })}
    ${sol(p)}
    <!-- le tableau -->
    <g transform="translate(400 ${H - 62})">
      <rect x="-260" y="-260" width="520" height="150" rx="6" fill="${p.ink}"/>
      <rect x="-250" y="-250" width="500" height="130" rx="4" fill="${p.far}" opacity=".55"/>
      <text x="0" y="-190" text-anchor="middle" font-family="Georgia,serif" font-size="30" fill="${p.light}" opacity=".95">Liberté</text>
      <text x="0" y="-152" text-anchor="middle" font-family="Georgia,serif" font-size="30" fill="${p.light}" opacity=".95">Égalité · Fraternité</text>
    </g>
    <!-- les pupitres et les élèves -->
    ${[[150, 1], [300, 0], [500, 1], [650, 0]].map(([x, alt]) => `<g transform="translate(${x} ${H - 62})">
      ${figure(p, 0, -46, 0.68, alt ? p.near : p.ink)}
      <rect x="-46" y="-40" width="92" height="12" rx="3" fill="${p.near}"/>
      <rect x="-38" y="-28" width="8" height="28" fill="${p.near}"/><rect x="30" y="-28" width="8" height="28" fill="${p.near}"/>
    </g>`).join('')}`,

  ch20: (p) => `${ciel(p)}${poussiere(61, 12)}
    ${sol(p)}
    <!-- la salle -->
    <rect x="0" y="${H - 250}" width="${W}" height="188" fill="${p.far}" opacity=".28"/>
    ${Array.from({ length: 6 }, (_, i) => `<rect x="${34 + i * 130}" y="${H - 250}" width="16" height="188" fill="${p.near}" opacity=".5"/>`).join('')}
    <!-- la balance de la justice -->
    <g transform="translate(400 ${H - 62})">
      <rect x="-58" y="-16" width="116" height="16" rx="4" fill="${p.ink}"/>
      <rect x="-6" y="-224" width="12" height="212" fill="${p.ink}"/>
      <line x1="-150" y1="-216" x2="150" y2="-216" stroke="${p.ink}" stroke-width="8" stroke-linecap="round"/>
      ${[-150, 150].map((x, i) => `<line x1="${x}" y1="-216" x2="${x}" y2="${-176 + i * 8}" stroke="${p.ink}" stroke-width="2.5"/>
        <path d="M${x - 40} ${-176 + i * 8} h80 l-20 34 h-40Z" fill="${p.light}"/>`).join('')}
      <circle cx="0" cy="-236" r="12" fill="${p.light}"/>
    </g>`,

  ch21: (p) => `${ciel(p, { sun: { x: 400, y: 170, r: 280 } })}
    ${colline(p, { cx: 640, w: 460, h: 92 })}
    <!-- la maison -->
    <g transform="translate(210 ${H - 62})" fill="${p.near}">
      <rect x="-84" y="-118" width="168" height="118"/>
      <path d="M-100 -118 l100 -56 l100 56Z"/>
      <rect x="-22" y="-58" width="44" height="58" fill="${p.ink}"/>
      <rect x="-70" y="-100" width="34" height="30" rx="3" fill="${p.light}" opacity=".85"/>
      <rect x="36" y="-100" width="34" height="30" rx="3" fill="${p.light}" opacity=".85"/>
    </g>
    ${sol(p)}
    <!-- la carte Vitale -->
    <g transform="translate(560 ${H - 150}) rotate(-8)">
      <rect x="-84" y="-52" width="168" height="104" rx="10" fill="${p.light}"/>
      <rect x="-84" y="-52" width="168" height="26" rx="10" fill="${p.accent}" opacity=".85"/>
      <rect x="-64" y="-8" width="46" height="34" rx="5" fill="${p.ink}" opacity=".35"/>
      ${Array.from({ length: 3 }, (_, i) => `<rect x="-4" y="${-4 + i * 13}" width="${76 - i * 18}" height="5" rx="2.5" fill="${p.ink}" opacity=".3"/>`).join('')}
    </g>
    ${figure(p, 390, H - 40, 0.85)}${figure(p, 440, H - 40, 0.7, p.far)}`,

  ch22: (p) => `${ciel(p, { sun: { x: 400, y: 190, r: 300 } })}${poussiere(67)}
    ${sol(p)}
    <!-- cercle de douze étoiles -->
    ${Array.from({ length: 12 }, (_, i) => {
    const a = (Math.PI * 2 * i) / 12 - Math.PI / 2;
    return etoile(400 + Math.cos(a) * 128, 186 + Math.sin(a) * 128, 17, '#ffd93d');
  }).join('')}
    <!-- vingt-sept pays côte à côte, sous le même cercle -->
    ${Array.from({ length: 9 }, (_, i) => figure(p, 232 + i * 42, H - 40, 0.74, i % 3 === 1 ? p.light : p.fg)).join('')}
    ${tricolore(150, H - 210, 78, 52)}
    <g transform="translate(628 ${H - 210})">
      <rect x="-3" y="-14" width="5" height="112" fill="#2b2b2b"/>
      <rect x="2" y="-10" width="78" height="52" fill="#003399"/>
      ${Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI * 2 * i) / 6 - Math.PI / 2;
    return etoile(41 + Math.cos(a) * 17, 16 + Math.sin(a) * 17, 4.5, '#ffd93d');
  }).join('')}
    </g>`,
};

/* ------------------------------------------------------------- génération */

const ACTE_DE = (key) => {
  const n = Number(key.slice(2));
  return n <= 6 ? 1 : n <= 16 ? 2 : 3;
};

let total = 0;
for (const [key, scene] of Object.entries(SCENES)) {
  const p = ACTES[ACTE_DE(key)];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-hidden="true">
${scene(p)}
</svg>`.replace(/\n\s*\n/g, '\n');
  writeFileSync(resolve(OUT, `${key}.svg`), svg);
  total += Buffer.byteLength(svg);
  console.log(`  ${key}.svg  ${(Buffer.byteLength(svg) / 1024).toFixed(1)} Ko`);
}

console.log(`\n${Object.keys(SCENES).length} illustrations, ${(total / 1024).toFixed(0)} Ko au total (moyenne ${(total / Object.keys(SCENES).length / 1024).toFixed(1)} Ko).`);
console.log(`Écrites dans ${OUT.replace(ROOT + '/', '')}`);

export { esc };
