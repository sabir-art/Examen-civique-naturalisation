/**
 * Journal d'activité, pastille du carillon, rappel quotidien
 * et écran d'ouverture.
 *
 * L'écran d'ouverture est la partie la plus facile à casser sans s'en rendre
 * compte : s'il ne se retire pas, l'application reste bloquée sur son logo.
 * Deux contrôles opposés le tiennent donc en tenaille — il doit apparaître,
 * et il doit disparaître.
 */
import pw from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pw;

const BASE = 'http://127.0.0.1:8099/';
const erreurs = [];
const ok = (m) => console.log(`  ok  ${m}`);
const ko = (m) => { erreurs.push(m); console.log(`  KO  ${m}`); };
const verifier = (cond, m) => (cond ? ok(m) : ko(m));

const browser = await chromium.launch();

/* ------------------------------------------------- 1. l'écran d'ouverture */

{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, locale: 'fr-FR' });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => ko(`erreur JS : ${e.message}`));

  await page.goto(BASE);
  // Visible immédiatement, avant même que les modules soient exécutés.
  verifier(await page.locator('#boot').isVisible(), 'l’écran d’ouverture s’affiche dès le premier rendu');
  verifier((await page.locator('.boot__mark').count()) === 1, 'la cocarde est là');
  verifier(/Examen civique/.test(await page.textContent('.boot__name')), 'le nom de l’application est écrit');

  // Il doit tenir un moment — sinon on ne le voit pas passer.
  await page.waitForTimeout(600);
  verifier(await page.locator('#boot').isVisible(), 'il tient plus d’une demi-seconde');

  // …puis se retirer sans intervention.
  await page.waitForSelector('#boot', { state: 'hidden', timeout: 5000 })
    .then(() => ok('il se retire tout seul'))
    .catch(() => ko('il se retire tout seul'));

  verifier(await page.locator('#app').isVisible(), 'l’application est visible derrière');

  // Le nom saisi doit apparaître dans l'écran d'ouverture au rechargement.
  await page.fill('#ob-name', 'Abdellah');
  await page.click('button[type=submit]');
  await page.waitForSelector('.accueil__hero');
  await page.goto(BASE);
  const accueil = await page.textContent('#boot-text');
  verifier(/Abdellah/.test(accueil), `l’écran d’ouverture salue par le prénom (« ${accueil} »)`);
  await ctx.close();
}

/* ----------------------------- 2. mouvement réduit : l'attente est raccourcie */

{
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 }, locale: 'fr-FR', reducedMotion: 'reduce',
  });
  const page = await ctx.newPage();
  const depart = Date.now();
  await page.goto(BASE);
  await page.waitForSelector('#boot', { state: 'hidden', timeout: 5000 });
  const duree = Date.now() - depart;
  verifier(duree < 1500, `en mouvement réduit l’ouverture est écourtée (${duree} ms)`);
  await ctx.close();
}

/* ------------------------------------------------------- 3. le journal */

const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, locale: 'fr-FR' });
const page = await ctx.newPage();
page.on('pageerror', (e) => ko(`erreur JS : ${e.message}`));

await page.goto(BASE, { waitUntil: 'networkidle' });
await page.fill('#ob-name', 'Abdellah');
await page.click('button[type=submit]');
await page.waitForSelector('.accueil__hero');

await page.goto(BASE + '#/activite');
await page.waitForTimeout(400);
verifier(/Rien à signaler/.test(await page.textContent('.app')), 'un profil neuf a un journal vide');

// On installe une histoire : un examen, deux chapitres, une journée.
await page.evaluate(() => {
  const raw = JSON.parse(localStorage.getItem('examen-civique.v1'));
  const jour = 86400000;
  for (const p of Object.values(raw.profiles)) {
    p.exams = [{ id: 'a', mode: 'officiel', date: Date.now() - 3600e3, score: 34, total: 40, durationSec: 1400, byTheme: {} }];
    p.read = { ch01: Date.now() - 2 * 3600e3, 'p1-i': Date.now() - jour };
    p.days = { [new Date().toISOString().slice(0, 10)]: 18 };
    p.progress = {};
    for (let i = 0; i < 12; i++) p.progress[`sym${String(i + 1).padStart(2, '0')}`] = { box: 3, seen: 1, ok: 1, ko: 0, lastOk: true, last: Date.now(), due: 0 };
    p.badgeAt = {};
    p.seenAt = Date.now() - 3 * jour;
  }
  localStorage.setItem('examen-civique.v1', JSON.stringify(raw));
});
await page.reload({ waitUntil: 'networkidle' });
await page.goto(BASE + '#/activite');
await page.waitForTimeout(500);

const journal = await page.textContent('.app');
verifier(/34\/40/.test(journal), 'l’examen passé figure au journal');
verifier(/Chapitre 1 lu|Chapitre du livret lu/.test(journal), 'les chapitres lus figurent au journal');
verifier(/Aujourd'hui|Aujourd’hui/.test(journal), 'les évènements sont groupés par période');
verifier(/Badge/.test(journal), 'les badges obtenus figurent au journal');

/* ----------------------------------------------------- 4. la pastille */

await page.goto(BASE + '#/');
await page.waitForTimeout(400);
// La visite du journal vient d'éteindre la pastille.
verifier(await page.locator('[aria-label^="Activité"] .ds-iconbtn__dot').isHidden(), 'après lecture, la pastille s’éteint');

// Un nouvel évènement la rallume.
await page.evaluate(() => {
  const raw = JSON.parse(localStorage.getItem('examen-civique.v1'));
  for (const p of Object.values(raw.profiles)) {
    p.seenAt = Date.now() - 86400000;
    p.exams.unshift({ id: 'b', mode: 'livret', date: Date.now(), score: 38, total: 40, durationSec: 1200, byTheme: {} });
  }
  localStorage.setItem('examen-civique.v1', JSON.stringify(raw));
});
await page.reload({ waitUntil: 'networkidle' });
await page.goto(BASE + '#/');
await page.waitForTimeout(500);
verifier(await page.locator('[aria-label^="Activité"] .ds-iconbtn__dot').isVisible(), 'un évènement récent rallume la pastille');

const etiquette = await page.getAttribute('[aria-label^="Activité"]', 'aria-label');
verifier(/nouveaut/.test(etiquette || ''), `le nombre est annoncé aux lecteurs d’écran (« ${etiquette} »)`);

await page.click('[aria-label^="Activité"]');
await page.waitForTimeout(500);
verifier(/Activité/.test(await page.title()), 'le carillon mène au journal');

await page.goto(BASE + '#/');
await page.waitForTimeout(400);
verifier(await page.locator('[aria-label^="Activité"] .ds-iconbtn__dot').isHidden(), 'la visite éteint de nouveau la pastille');

/* ------------------------------------------------ 5. le rappel quotidien */

await page.goto(BASE + '#/activite');
await page.waitForTimeout(400);
const texte = await page.textContent('.app');
verifier(/Rappel quotidien/.test(texte), 'le réglage du rappel est sur cet écran');
verifier(/ouverture de l'application|ouverture de l’application/.test(texte),
  'la limite du rappel est écrite noir sur blanc, sans promesse en trop');

const bascule = page.locator('.switchrow');
verifier((await bascule.count()) === 1, 'la bascule du rappel est présente');
verifier(await bascule.getAttribute('aria-checked') === 'false', 'le rappel est éteint par défaut');

/* ------------------------------- 6. les journées ne font pas sonner la pastille */

await page.evaluate(() => {
  const raw = JSON.parse(localStorage.getItem('examen-civique.v1'));
  for (const p of Object.values(raw.profiles)) {
    p.exams = []; p.read = {}; p.badgeAt = {};
    p.seenAt = Date.now() - 86400000;
    p.days = { [new Date().toISOString().slice(0, 10)]: 30 };
  }
  localStorage.setItem('examen-civique.v1', JSON.stringify(raw));
});
await page.reload({ waitUntil: 'networkidle' });
await page.goto(BASE + '#/');
await page.waitForTimeout(500);
verifier(await page.locator('[aria-label^="Activité"] .ds-iconbtn__dot').isHidden(),
  'une journée de révision n’allume pas la pastille (sinon elle ne s’éteindrait jamais)');

await browser.close();
console.log(erreurs.length ? `\n${erreurs.length} erreur(s).` : '\nAucune erreur.');
process.exit(erreurs.length ? 1 : 0);
