/**
 * Recherche dans toute l'application.
 *
 * Ce que l'on vérifie en priorité : qu'elle cherche VRAIMENT partout — les
 * trois banques de questions, les chapitres du livret, ceux du récit et les
 * fiches — et qu'elle trouve un mot écrit avec ses accents comme sans.
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

await page.goto(BASE, { waitUntil: 'networkidle' });
await page.fill('#ob-name', 'Abdellah');
await page.click('button[type=submit]');
await page.waitForSelector('.greet__hello');

async function chercher(mot) {
  await page.goto(BASE + '#/recherche');
  await page.waitForTimeout(350);
  await page.fill('.search__field', mot);
  await page.waitForTimeout(400);
  return {
    compteur: (await page.textContent('.hint')) || '',
    familles: await page.$$eval('.section-title', (els) => els.map((e) => e.textContent.trim())),
    total: await page.evaluate(() => {
      const m = document.querySelector('.hint')?.textContent.match(/^(\d+) résultat/);
      return m ? Number(m[1]) : 0;
    }),
  };
}

/* --------------------------------------------- 1. accès depuis la barre haute */

await page.goto(BASE + '#/');
await page.waitForTimeout(300);
verifier(await page.locator('#appbar-search').isVisible(), 'le bouton Rechercher est dans la barre haute');
await page.click('#appbar-search');
await page.waitForTimeout(400);
verifier((await page.locator('.search__field').count()) === 1, 'il ouvre bien l’écran de recherche');

/* ----------------------------------------------------- 2. avant de taper */

let t = await page.textContent('.app');
verifier(/Idées de recherche/.test(t), 'des suggestions sont proposées tant qu’on n’a rien tapé');
await page.click('.chips .chip >> nth=0');
await page.waitForTimeout(400);
verifier(/résultat/.test(await page.textContent('.hint')), 'une suggestion lance la recherche');

/* ------------------------------------------- 3. couverture des six familles */

const marianne = await chercher('Marianne');
verifier(marianne.total > 0, `« Marianne » donne des résultats (${marianne.total})`);

const attendues = ["Questions d'examen", 'Questions du livret', 'Questions du récit',
  'Chapitres du livret', 'Chapitres du récit', 'Fiches de révision'];
const vues = new Set();
for (const mot of ['Marianne', 'République', 'roi', 'laïcité', 'Sénat', 'drapeau']) {
  const r = await chercher(mot);
  r.familles.forEach((f) => vues.add(f));
}
for (const f of attendues) {
  verifier(vues.has(f), `la famille « ${f} » est atteignable`);
}

/* ------------------------------------------------------ 4. accents ignorés */

const avec = await chercher('laïcité');
const sans = await chercher('laicite');
verifier(sans.total > 0 && sans.total === avec.total,
  `« laicite » trouve autant que « laïcité » (${sans.total} contre ${avec.total})`);

const majuscules = await chercher('MARIANNE');
verifier(majuscules.total === marianne.total, 'la casse est ignorée');

/* -------------------------------------------------- 5. plusieurs mots = ET */

const un = await chercher('drapeau');
const deux = await chercher('drapeau tricolore');
verifier(deux.total > 0 && deux.total <= un.total,
  `deux mots restreignent le résultat (${deux.total} ≤ ${un.total})`);

/* ------------------------------------------------------- 6. rien trouvé */

const rien = await chercher('zzzzqqqq');
verifier(/Rien pour/.test(await page.textContent('.app')), 'une recherche sans résultat le dit clairement');
verifier(rien.total === 0, 'et n’annonce aucun compte');

/* ---------------------------------- 7. la réponse est lisible sans quitter */

await chercher('Marseillaise');
const premier = page.locator('.sres').first();
verifier((await premier.count()) === 1, 'les questions trouvées sont dépliables');
await premier.locator('summary').click();
await page.waitForTimeout(250);
verifier((await premier.locator('.answerbox--ok').count()) === 1, 'déplier montre la bonne réponse');
verifier((await premier.locator('a').count()) === 1, 'et un lien pour aller réviser');

/* ------------------------------------------------- 8. les mots sont surlignés */

const surlignes = await page.locator('mark').count();
verifier(surlignes > 0, `les mots cherchés sont surlignés (${surlignes})`);
const texteMarque = await page.locator('mark').first().textContent();
verifier(/marseillaise/i.test(texteMarque), `le surlignage tombe sur le bon mot (« ${texteMarque} »)`);

await browser.close();
console.log(erreurs.length ? `\n${erreurs.length} erreur(s).` : '\nAucune erreur.');
process.exit(erreurs.length ? 1 : 0);
