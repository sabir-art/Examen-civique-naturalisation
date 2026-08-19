#!/usr/bin/env node
/**
 * Fabrique l'image d'aperçu de partage (1200 × 630).
 *   node scripts/make-partage.mjs
 *
 * Quand on envoie le lien de l'application dans une conversation, la vignette
 * qui s'affiche est la première chose qu'on voit d'elle — souvent la seule, si
 * personne ne clique. Sans balise `og:image`, il n'y a pas de vignette : juste
 * une adresse grise, qui n'inspire pas d'ouvrir une application où l'on va
 * confier ses révisions.
 *
 * L'image est dessinée en HTML puis photographiée par le navigateur déjà
 * présent pour les contrôles : pas de dépendance nouvelle, et les couleurs
 * viennent des mêmes jetons que l'application.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import pw from '/opt/node22/lib/node_modules/playwright/index.js';

const { chromium } = pw;

/* La police est incorporée en clair dans la page : servie depuis une adresse,
   elle serait refusée (la page est construite en mémoire, sans origine), et
   l'image sortirait dans une police qui n'est pas celle de l'application. */
const POLICE = readFileSync('assets/fonts/plus-jakarta-sans-latin.woff2').toString('base64');

const PAGE = `<!doctype html><meta charset="utf-8">
<style>
  @font-face { font-family: Jakarta; src: url(data:font/woff2;base64,${POLICE}) format('woff2'); font-weight: 200 800; }
  * { margin: 0; box-sizing: border-box; }
  body { width: 1200px; height: 630px; background: #E9F1EF; font-family: Jakarta, system-ui, sans-serif;
         color: #141414; display: flex; align-items: center; gap: 56px; padding: 0 76px; }
  .mot { flex: 1; }
  .eyebrow { font-size: 25px; font-weight: 600; color: #3E8574; letter-spacing: .01em; }
  h1 { font-size: 62px; font-weight: 800; line-height: 1.06; letter-spacing: -.022em; margin: 16px 0 20px; }
  p { font-size: 27px; line-height: 1.42; color: #4A4A4A; font-weight: 500; max-width: 30ch; }
  .puces { display: flex; gap: 10px; margin-top: 34px; flex-wrap: wrap; }
  .puce { background: #fff; border-radius: 999px; padding: 12px 20px; font-size: 21px; font-weight: 600; }
  .puce--v { background: #DFEFEA; }
  .puce--l { background: #EDE1FC; }
  .puce--b { background: #FDF3C8; }
  .tel { width: 344px; height: 520px; border-radius: 46px; background: #fff; box-shadow: 0 26px 60px rgba(20,20,20,.13);
         padding: 30px 26px; display: flex; flex-direction: column; gap: 15px; flex: none; }
  .titre { font-size: 27px; font-weight: 800; letter-spacing: -.02em; }
  .bloc { border-radius: 22px; padding: 17px 19px; }
  .b1 { background: #FDF3C8; } .b2 { background: #EDE1FC; } .b3 { background: #DFEFEA; }
  .l { font-size: 19px; font-weight: 700; }
  .m { font-size: 14.5px; color: #4A4A4A; font-weight: 500; margin-top: 3px; white-space: nowrap; }
  .barre { height: 7px; border-radius: 99px; background: rgba(20,20,20,.12); margin-top: 11px; }
  .barre i { display: block; height: 7px; border-radius: 99px; background: #141414; }
</style>
<div class="mot">
  <div class="eyebrow">Naturalisation française</div>
  <h1>L'examen civique,<br>en s'entraînant</h1>
  <p>735 questions, des examens blancs en conditions réelles, le livret du citoyen et l'histoire de France racontée.</p>
  <div class="puces">
    <span class="puce puce--v">Gratuit</span>
    <span class="puce puce--l">Sans publicité</span>
    <span class="puce puce--b">Hors ligne</span>
  </div>
</div>
<div class="tel">
  <div class="titre">Réviser</div>
  <div class="bloc b1"><div class="l">Principes et valeurs</div><div class="m">145 questions · 11 tirées à l'examen</div><div class="barre"><i style="width:62%"></i></div></div>
  <div class="bloc b2"><div class="l">Histoire &amp; géo</div><div class="m">209 questions · 8 tirées à l'examen</div><div class="barre"><i style="width:41%"></i></div></div>
  <div class="bloc b3"><div class="l">Droits et devoirs</div><div class="m">143 questions · 11 tirées à l'examen</div><div class="barre"><i style="width:28%"></i></div></div>
</div>`;

const navigateur = await chromium.launch();
const page = await navigateur.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await page.setContent(PAGE, { waitUntil: 'networkidle' });
await page.waitForTimeout(400);
const png = await page.screenshot({ type: 'png' });
await navigateur.close();

writeFileSync('assets/og/partage.png', png);
console.log(`assets/og/partage.png — ${Math.round(png.length / 1024)} Ko`);
