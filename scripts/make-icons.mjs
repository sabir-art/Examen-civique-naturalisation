#!/usr/bin/env node
/**
 * Génère les icônes PNG de l'application (aucune dépendance externe).
 *   node scripts/make-icons.mjs
 *
 * Rendu analytique (SDF) avec anticrénelage : fond bleu nuit, case à cocher
 * blanche cochée, bandeau tricolore. Encodage PNG maison via zlib.
 */
import { deflateSync } from 'node:zlib';
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'assets', 'icons');

/* ---------------------------------------------------------------- PNG ---- */

const CRC_TABLE = (() => {
  const t = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return t;
})();

function crc32(buf) {
  let c = -1;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, 'latin1'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

function encodePng(width, height, rgba) {
  const raw = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (width * 4 + 1)] = 0; // filtre "None"
    rgba.copy(raw, y * (width * 4 + 1) + 1, y * width * 4, (y + 1) * width * 4);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;   // profondeur
  ihdr[9] = 6;   // RGBA
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

/* ------------------------------------------------------------- dessin ---- */

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const mix = (a, b, t) => a.map((c, i) => c + (b[i] - c) * t);

/** Distance signée à un rectangle arrondi centré en (cx, cy). */
function sdRoundRect(px, py, cx, cy, hw, hh, r) {
  const qx = Math.abs(px - cx) - (hw - r);
  const qy = Math.abs(py - cy) - (hh - r);
  const ax = Math.max(qx, 0), ay = Math.max(qy, 0);
  return Math.hypot(ax, ay) + Math.min(Math.max(qx, qy), 0) - r;
}

/** Distance signée à un segment [a, b]. */
function sdSegment(px, py, ax, ay, bx, by) {
  const vx = bx - ax, vy = by - ay;
  const wx = px - ax, wy = py - ay;
  const t = clamp((wx * vx + wy * vy) / (vx * vx + vy * vy), 0, 1);
  return Math.hypot(wx - vx * t, wy - vy * t);
}

function render(size, { inset = 0, bleed = true } = {}) {
  const rgba = Buffer.alloc(size * size * 4);
  const S = size;
  const aa = S / 220;                       // largeur d'anticrénelage
  const scale = 1 - inset;                  // zone utile (icône maskable)
  const u = (v) => S * (0.5 + (v - 0.5) * scale); // coordonnée normalisée -> px

  const NAVY_TOP = [23, 40, 84];
  const NAVY_BOT = [10, 17, 36];
  const WHITE = [246, 248, 253];
  const BLUE = [59, 111, 224];
  const RED = [224, 69, 60];

  // Géométrie (en unités normalisées puis converties)
  const boxHw = u(0.5 + 0.245) - u(0.5), boxHh = boxHw;
  const boxCx = S / 2, boxCy = u(0.455);
  const boxR = boxHw * 0.28;
  const boxStroke = S * 0.052 * scale;

  const checkW = S * 0.058 * scale;
  const c1 = [u(0.365), u(0.455)], c2 = [u(0.455), u(0.545)], c3 = [u(0.645), u(0.345)];

  const stripeY = u(0.845), stripeH = S * 0.052 * scale;
  const stripeX0 = u(0.29), stripeX1 = u(0.71);
  const stripeW = (stripeX1 - stripeX0) / 3;
  const stripeR = stripeH / 2;

  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      const px = x + 0.5, py = y + 0.5;
      let col;
      let alpha = 1;

      // Fond : dégradé diagonal, plein cadre (ou coins arrondis si non-maskable)
      const g = clamp((px / S) * 0.35 + (py / S) * 0.75, 0, 1);
      col = mix(NAVY_TOP, NAVY_BOT, g);
      if (!bleed) {
        const d = sdRoundRect(px, py, S / 2, S / 2, S / 2, S / 2, S * 0.22);
        alpha = clamp(0.5 - d / aa, 0, 1);
      }

      // Case à cocher (contour blanc)
      const dBox = Math.abs(sdRoundRect(px, py, boxCx, boxCy, boxHw, boxHh, boxR)) - boxStroke / 2;
      col = mix(col, WHITE, clamp(0.5 - dBox / aa, 0, 1));

      // Coche
      const dCheck = Math.min(
        sdSegment(px, py, c1[0], c1[1], c2[0], c2[1]),
        sdSegment(px, py, c2[0], c2[1], c3[0], c3[1]),
      ) - checkW / 2;
      col = mix(col, WHITE, clamp(0.5 - dCheck / aa, 0, 1));

      // Bandeau tricolore
      for (let i = 0; i < 3; i++) {
        const x0 = stripeX0 + i * stripeW;
        const cx = x0 + stripeW / 2;
        const d = sdRoundRect(px, py, cx, stripeY, stripeW / 2 - S * 0.006, stripeH / 2, stripeR * 0.7);
        col = mix(col, [BLUE, WHITE, RED][i], clamp(0.5 - d / aa, 0, 1));
      }

      const o = (y * S + x) * 4;
      rgba[o] = Math.round(clamp(col[0], 0, 255));
      rgba[o + 1] = Math.round(clamp(col[1], 0, 255));
      rgba[o + 2] = Math.round(clamp(col[2], 0, 255));
      rgba[o + 3] = Math.round(alpha * 255);
    }
  }
  return encodePng(S, S, rgba);
}

mkdirSync(OUT, { recursive: true });
const files = [
  ['icon-192.png', render(192, { bleed: false })],
  ['icon-512.png', render(512, { bleed: false })],
  ['maskable-512.png', render(512, { inset: 0.22, bleed: true })],
  ['favicon-32.png', render(32, { bleed: false })],
];
for (const [name, buf] of files) {
  writeFileSync(join(OUT, name), buf);
  console.log(`${name} — ${(buf.length / 1024).toFixed(1)} Kio`);
}
