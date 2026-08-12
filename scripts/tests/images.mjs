/**
 * Illustrations du récit.
 *
 * Le point fragile est l'ANCRAGE : les images ne sont pas dans le HTML des
 * chapitres, elles sont posées après le paragraphe qui contient un fragment de
 * texte donné. Si une phrase est retouchée, l'ancre ne correspond plus et
 * l'image disparaît — sans erreur, sans trace. scripts/check-images.mjs garde
 * les données ; celui-ci vérifie ce qui arrive réellement à l'écran.
 */
import pw from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pw;

const BASE = 'http://127.0.0.1:8099/';
const erreurs = [];
const ok = (m) => console.log(`  ok  ${m}`);
const ko = (m) => { erreurs.push(m); console.log(`  KO  ${m}`); };
const verifier = (cond, m) => (cond ? ok(m) : ko(m));

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, locale: 'fr-FR' });
const page = await ctx.newPage();
page.on('pageerror', (e) => ko(`erreur JS : ${e.message}`));
// Une image en `loading="lazy"` encore en vol quand on change d'écran est
// ANNULÉE par le navigateur, et Playwright la signale comme « échouée ». Ce
// n'est pas une ressource manquante : confondre les deux noierait un vrai
// 404 sous trente faux positifs. On ne retient donc que ce qui n'est pas une
// annulation — et le contrôle décisif reste `naturalWidth === 0`, plus bas,
// qui constate l'image réellement absente à l'écran.
page.on('requestfailed', (r) => {
  const raison = r.failure()?.errorText || '';
  if (!r.url().startsWith(BASE)) return;
  if (/ABORTED|CACHE_MISS/.test(raison)) return;
  ko(`ressource en échec : ${r.url().replace(BASE, '')} (${raison})`);
});

await page.goto(BASE, { waitUntil: 'networkidle' });
await page.waitForSelector('#boot', { state: 'hidden' });
await page.fill('#ob-name', 'Abdellah');
await page.click('button[type=submit]');
await page.waitForSelector('.greet__hello');

const manifeste = await page.evaluate(() => fetch('./assets/photos/manifeste.json').then((r) => r.json()));
const attendues = manifeste.images.filter((i) => i.chapitre);

/* ----------------------------------- 1. chaque chapitre reçoit ses images */

const CHAPS = Array.from({ length: 22 }, (_, i) => `ch${String(i + 1).padStart(2, '0')}`);
const manquantes = [];
const cassees = [];
let posees = 0;

for (const ch of CHAPS) {
  await page.goto(`${BASE}#/histoire/c/${ch}`);
  await page.waitForTimeout(420);
  const r = await page.evaluate(() => ({
    cles: [...document.querySelectorAll('.prose .fig__img')]
      .map((i) => i.getAttribute('src').split('/').pop().replace('.jpg', '')),
    cassees: [...document.querySelectorAll('.fig__img')].filter((i) => i.complete && i.naturalWidth === 0).length,
  }));
  posees += r.cles.length;
  if (r.cassees) cassees.push(`${ch} : ${r.cassees}`);

  const prevues = attendues.filter((i) => i.chapitre === ch).map((i) => i.cle);
  for (const cle of prevues) {
    if (!r.cles.includes(cle)) manquantes.push(`${ch}/${cle}`);
  }
}

verifier(manquantes.length === 0,
  `les ${attendues.length} images ancrées sont toutes posées (${posees} affichées)${manquantes.length ? ` — absentes : ${manquantes.slice(0, 4).join(', ')}` : ''}`);
verifier(cassees.length === 0, `aucun fichier image manquant${cassees.length ? ` — ${cassees.join(' ; ')}` : ''}`);
verifier(posees >= 22, `chaque chapitre en a au moins une (${posees} au total)`);

/* --------------------------------- 2. l'image tombe au bon endroit */

await page.goto(`${BASE}#/histoire/c/ch01`);
await page.waitForTimeout(600);
const ancrage = await page.evaluate(() => {
  const fig = [...document.querySelectorAll('.prose .fig')]
    .find((f) => f.querySelector('img').getAttribute('src').includes('aqueduc'));
  return fig ? fig.previousElementSibling?.textContent || '' : null;
});
verifier(ancrage && ancrage.includes('pont du Gard'),
  'l’aqueduc est posé juste après le paragraphe qui parle du pont du Gard');

/* -------------------------------- 3. la provenance est toujours écrite */

const provenance = await page.evaluate(() => {
  const figs = [...document.querySelectorAll('.fig')];
  return {
    total: figs.length,
    avecSource: figs.filter((f) => (f.querySelector('.fig__src')?.textContent || '').trim().length > 3).length,
    avecLegende: figs.filter((f) => (f.querySelector('.fig__txt')?.textContent || '').trim().length > 10).length,
    avecAlt: figs.filter((f) => (f.querySelector('img')?.getAttribute('alt') || '').length > 10).length,
  };
});
verifier(provenance.avecSource === provenance.total,
  `chaque image dit d'où elle vient (${provenance.avecSource}/${provenance.total})`);
verifier(provenance.avecLegende === provenance.total, 'chaque image a sa légende');
verifier(provenance.avecAlt === provenance.total, 'chaque image a une description pour les lecteurs d’écran');

/* --------------------------------------- 4. les images suivent la langue */

const LANGUES = { fr: 0, ar: 1, bi: 2 };
async function choisir(lng) {
  await page.locator('.seg--langue .seg__btn').nth(LANGUES[lng]).click();
  await page.waitForTimeout(450);
}

await choisir('ar');
const enArabe = await page.evaluate(() => {
  const caps = [...document.querySelectorAll('.prose .fig__txt')].map((e) => e.textContent);
  return { n: document.querySelectorAll('.prose .fig').length, ar: caps.filter((t) => /[؀-ۿ]/.test(t)).length };
});
verifier(enArabe.n > 0, `les images restent en lecture arabe (${enArabe.n})`);
verifier(enArabe.ar === enArabe.n, `les légendes passent en arabe (${enArabe.ar}/${enArabe.n})`);

await choisir('bi');
const bilingue = await page.evaluate(() => {
  const figs = [...document.querySelectorAll('.prose .fig')];
  return figs.filter((f) => f.querySelectorAll('.fig__txt').length === 2).length;
});
verifier(bilingue > 0, `en mode bilingue chaque image porte ses deux légendes (${bilingue})`);

// Les images ne doivent pas casser l'appariement des paragraphes.
const paires = await page.evaluate(() => document.querySelectorAll('.paire').length);
verifier(paires >= 10, `l'appariement bilingue tient malgré les images (${paires} paires)`);
await choisir('fr');

/* ------------------------------------------- 5. le glossaire illustré */

await page.goto(`${BASE}#/histoire/glossaire`);
await page.waitForTimeout(500);
await page.fill('.search__field', 'aqueduc');
await page.waitForTimeout(350);
await page.locator('.glossrow summary').first().click();
await page.waitForTimeout(350);
verifier((await page.locator('.glossrow[open] .fig').count()) === 1,
  'un mot du glossaire qui a une image la montre');
verifier((await page.locator('.glossrow[open] .fig--sm').count()) === 1,
  'en version réduite, pas en pleine largeur');

// Et dans la feuille ouverte depuis le texte.
await page.goto(`${BASE}#/histoire/c/ch18`);
await page.waitForTimeout(600);
const motIllustre = page.locator('.gloss[data-terme="isoloir"], .gloss[data-terme="urne"]').first();
if (await motIllustre.count()) {
  await motIllustre.click();
  await page.waitForTimeout(350);
  verifier((await page.locator('.modal__panel .fig').count()) === 1,
    'appuyer sur un mot illustré ouvre sa définition avec l’image');
  await page.click('.modal__panel .btn');
} else {
  ko('aucun mot illustré trouvé dans le chapitre 18');
}

/* ------------------------------- 6. pas de débordement à cause des images */

const debordements = [];
for (const [w, hh] of [[320, 568], [390, 844], [430, 932]]) {
  await page.setViewportSize({ width: w, height: hh });
  for (const ch of ['ch01', 'ch05', 'ch17', 'ch22']) {
    await page.goto(`${BASE}#/histoire/c/${ch}`);
    await page.waitForTimeout(400);
    const d = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    if (d > 1) debordements.push(`${w}px ${ch} : ${d}px`);
  }
}
verifier(debordements.length === 0,
  `aucun défilement horizontal causé par les images${debordements.length ? ` — ${debordements.slice(0, 3).join(' ; ')}` : ''}`);

/* ---------------------------------------- 7. le poids reste raisonnable */

const poids = await page.evaluate(async () => {
  const m = await fetch('./assets/photos/manifeste.json').then((r) => r.json());
  let total = 0;
  for (const img of m.images) {
    const r = await fetch(`./assets/photos/${img.cle}.jpg`, { method: 'HEAD' });
    total += Number(r.headers.get('content-length') || 0);
  }
  return total;
});
verifier(poids > 0 && poids < 4 * 1024 * 1024,
  `l'ensemble des images pèse ${Math.round(poids / 1024)} Ko (limite : 4 Mo pour du hors ligne)`);

await browser.close();
console.log(erreurs.length ? `\n${erreurs.length} erreur(s).` : '\nAucune erreur.');
process.exit(erreurs.length ? 1 : 0);
