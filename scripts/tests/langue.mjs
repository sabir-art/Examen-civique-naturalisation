/**
 * Lecture en arabe, mode bilingue et glossaire.
 *
 * Le point le plus fragile est l'APPARIEMENT bilingue : si un chapitre arabe
 * n'a pas le même nombre de blocs que le français, les paragraphes se
 * décalent en silence — rien ne plante, mais on lit la traduction du
 * paragraphe d'à côté. Le contrôle scripts/check-traduction.mjs garde les
 * données ; celui-ci garde l'affichage.
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
page.on('console', (m) => { if (m.type() === 'error') ko(`console : ${m.text().slice(0, 140)}`); });

await page.goto(BASE, { waitUntil: 'networkidle' });
await page.waitForSelector('#boot', { state: 'hidden' });
await page.fill('#ob-name', 'Abdellah');
await page.click('button[type=submit]');
await page.waitForSelector('.greet__hello');

const LANGUES = { fr: 0, ar: 1, bi: 2 };
async function choisir(lng) {
  await page.locator('.seg--langue .seg__btn').nth(LANGUES[lng]).click();
  await page.waitForTimeout(450);
}

/* ------------------------------------------------- 1. le français par défaut */

await page.goto(BASE + '#/histoire/c/ch12');
await page.waitForTimeout(600);
verifier((await page.locator('.seg--langue').count()) > 0, 'le sélecteur de langue est présent sur un chapitre');
verifier(await page.locator('.seg--langue .seg__btn').first().getAttribute('aria-pressed') === 'true',
  'le français est sélectionné par défaut');
verifier((await page.locator('.prose--ar').count()) === 0, 'aucun texte arabe en mode français');

/* ------------------------------------------------------- 2. mode arabe */

await choisir('ar');
verifier(await page.getAttribute('.prose--ar', 'dir') === 'rtl', 'le texte arabe est en sens droite-à-gauche');
verifier(await page.getAttribute('.prose--ar', 'lang') === 'ar', 'la langue est déclarée pour les lecteurs d’écran');

const texteAr = await page.textContent('.prose--ar');
const partArabe = (texteAr.match(/[؀-ۿ]/g) || []).length / texteAr.replace(/\s/g, '').length;
verifier(partArabe > 0.7, `le chapitre est bien en arabe (${Math.round(partArabe * 100)} %)`);

const aligne = await page.evaluate(() => getComputedStyle(document.querySelector('.prose--ar')).textAlign);
verifier(aligne === 'right' || aligne === 'start', `le texte arabe est aligné à droite (${aligne})`);

// L'encadré « à retenir » suit la langue.
verifier(await page.getAttribute('.card--retenir', 'dir') === 'rtl', '« à retenir » passe aussi en arabe');

// La lettrine décorative ne doit pas s'appliquer à l'arabe.
const lettrine = await page.evaluate(() => {
  const p = document.querySelector('.prose--ar > p');
  return getComputedStyle(p, '::first-letter').float;
});
verifier(lettrine === 'none', 'pas de lettrine sur le texte arabe (elle couperait la liaison des lettres)');

/* ---------------------------------------------------- 3. mode bilingue */

await choisir('bi');
const paires = await page.locator('.paire').count();
verifier(paires > 0, `les paragraphes sont appariés (${paires} paires)`);

const appariement = await page.evaluate(() => {
  const out = { total: 0, mauvaises: [] };
  for (const paire of document.querySelectorAll('.paire')) {
    out.total += 1;
    const [a, b] = paire.children;
    if (!a || !b) { out.mauvaises.push('paire incomplète'); continue; }
    // Le second élément doit être l'arabe, le premier le français.
    const arabe = (b.textContent.match(/[؀-ۿ]/g) || []).length;
    const latin = (a.textContent.match(/[A-Za-zÀ-ÿ]/g) || []).length;
    if (arabe < 3) out.mauvaises.push(`bloc arabe vide : « ${b.textContent.slice(0, 30)} »`);
    if (latin < 3) out.mauvaises.push(`bloc français vide : « ${a.textContent.slice(0, 30)} »`);
    if (a.tagName !== b.tagName) out.mauvaises.push(`natures différentes : ${a.tagName} / ${b.tagName}`);
  }
  return out;
});
verifier(appariement.mauvaises.length === 0,
  `chaque paire tient un bloc français et son équivalent arabe${appariement.mauvaises.length ? ` — ${appariement.mauvaises.slice(0, 3).join(' ; ')}` : ''}`);

/* -------------------------------------- 4. l'appariement tient sur les 22 */

let totalPaires = 0;
const decales = [];
for (const n of Array.from({ length: 22 }, (_, i) => `ch${String(i + 1).padStart(2, '0')}`)) {
  await page.goto(`${BASE}#/histoire/c/${n}`);
  await page.waitForTimeout(220);
  const r = await page.evaluate(() => {
    const paires = [...document.querySelectorAll('.paire')];
    if (!paires.length) return { n: 0, faux: 1 };
    const faux = paires.filter((p) => {
      const [a, b] = p.children;
      return !a || !b || a.tagName !== b.tagName
        || (b.textContent.match(/[؀-ۿ]/g) || []).length < 3;
    }).length;
    return { n: paires.length, faux };
  });
  totalPaires += r.n;
  if (r.faux) decales.push(n);
}
verifier(decales.length === 0,
  `les 22 chapitres s'apparient (${totalPaires} paires)${decales.length ? ` — décalés : ${decales.join(', ')}` : ''}`);

/* ------------------------------------------ 5. la langue est mémorisée */

await page.reload({ waitUntil: 'networkidle' });
await page.waitForTimeout(600);
verifier((await page.locator('.paire').count()) > 0, 'la langue choisie survit à un rechargement');

await choisir('fr');
await page.goto(BASE + '#/histoire/c/ch05');
await page.waitForTimeout(500);
verifier((await page.locator('.paire').count()) === 0 && (await page.locator('.prose--ar').count()) === 0,
  'revenir au français rétablit le texte français seul');

/* -------------------------------------------------------- 6. glossaire */

await page.goto(BASE + '#/histoire/c/ch12');
await page.waitForTimeout(600);
const marques = await page.locator('.gloss').count();
verifier(marques > 3, `les mots difficiles sont soulignés dans le texte (${marques})`);

// Chaque terme n'est marqué qu'une fois : sinon le soulignement noie le texte.
const doublons = await page.evaluate(() => {
  const vus = new Map();
  for (const b of document.querySelectorAll('.gloss')) {
    vus.set(b.textContent, (vus.get(b.textContent) || 0) + 1);
  }
  return [...vus.entries()].filter(([, n]) => n > 1).map(([t]) => t);
});
verifier(doublons.length === 0, `aucun mot n'est souligné deux fois${doublons.length ? ` — ${doublons.join(', ')}` : ''}`);

// Le marquage ne doit pas avoir cassé le balisage d'origine.
verifier((await page.locator('.prose strong').count()) > 0, 'le gras du texte survit au marquage');
verifier((await page.locator('.gloss a, a .gloss').count()) === 0, 'aucun mot marqué à l’intérieur d’un lien');

await page.locator('.gloss').first().click();
await page.waitForTimeout(350);
verifier((await page.locator('.modal__panel').count()) === 1, 'appuyer sur un mot ouvre sa définition');
verifier((await page.locator('.glossdef').count()) === 1, 'la définition française est là');
const arDef = await page.textContent('.glossar');
verifier((arDef.match(/[؀-ۿ]/g) || []).length > 10, 'la définition arabe est là');
await page.click('.modal__panel .btn');
await page.waitForTimeout(250);
verifier((await page.locator('.modal__panel').count()) === 0, 'la feuille se referme');

/* ------------------------------------------------ 7. l'écran du glossaire */

await page.goto(BASE + '#/histoire/glossaire');
await page.waitForTimeout(500);
const entrees = await page.locator('.glossrow').count();
verifier(entrees > 50, `le glossaire liste tous les termes (${entrees})`);

await page.fill('.search__field', 'suffrage');
await page.waitForTimeout(350);
const filtre = await page.locator('.glossrow').count();
verifier(filtre > 0 && filtre < entrees, `la recherche filtre (${filtre} sur ${entrees})`);

await page.fill('.search__field', 'laicite');
await page.waitForTimeout(350);
verifier((await page.locator('.glossrow').count()) > 0, 'la recherche ignore les accents');

/* ------------------------------- 8. pas de débordement, quelle que soit la langue */

const debordements = [];
for (const [w, hh] of [[320, 568], [390, 844], [430, 932]]) {
  await page.setViewportSize({ width: w, height: hh });
  for (const lng of ['fr', 'ar', 'bi']) {
    await page.goto(BASE + '#/histoire/c/ch15');
    await page.waitForTimeout(350);
    await choisir(lng);
    for (const route of ['#/histoire', '#/histoire/a/acte-2', '#/histoire/c/ch20', '#/histoire/glossaire']) {
      await page.goto(BASE + route);
      await page.waitForTimeout(300);
      const d = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      if (d > 1) debordements.push(`${w}px ${lng} ${route} : ${d}px`);
    }
  }
}
verifier(debordements.length === 0,
  `aucun défilement horizontal en 3 largeurs × 3 langues${debordements.length ? ` — ${debordements.slice(0, 3).join(' ; ')}` : ''}`);

await browser.close();
console.log(erreurs.length ? `\n${erreurs.length} erreur(s).` : '\nAucune erreur.');
process.exit(erreurs.length ? 1 : 0);
