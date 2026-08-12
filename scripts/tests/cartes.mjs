import pw from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pw;
const BASE = 'http://127.0.0.1:8099/';
const SHOT = './scripts/tests/captures';
const errors = [];
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, locale: 'fr-FR' });
const p = await ctx.newPage();
p.on('pageerror', (e) => errors.push(e.message));
const step = async (n, f) => { try { await f(); console.log(`  ok  ${n}`); } catch (e) { console.log(`  FAIL ${n}: ${e.message}`); errors.push(`${n}: ${e.message}`); } };

await p.goto(BASE, { waitUntil: 'networkidle' });
await p.fill('#ob-name', 'Abdellah'); await p.click('button[type=submit]');
await p.waitForSelector('.accueil__hero');

await step('les cartes mémoire sont accessibles depuis Réviser', async () => {
  await p.goto(`${BASE}#/reviser`);
  await p.waitForSelector('a[href="#/cartes"]');
  await p.click('a[href="#/cartes"]');
  await p.waitForSelector('.flash');
  if (!(await p.locator('.flash__q').count())) throw new Error('pas de question sur la carte');
  if (await p.locator('.flash__a').isVisible().catch(() => false)) throw new Error('la réponse est visible avant de retourner');
});
await p.screenshot({ path: `${SHOT}/C1-carte.png`, fullPage: true });

await step('retourner la carte montre la réponse et les deux jugements', async () => {
  await p.click('.flash');
  await p.waitForTimeout(350);
  if (!(await p.locator('.flash__a').isVisible())) throw new Error('la réponse ne s\'affiche pas');
  if (!(await p.locator('button:has-text("Difficile")').count())) throw new Error('bouton Difficile absent');
  if (!(await p.locator('button:has-text("Facile")').count())) throw new Error('bouton Facile absent');
});
await p.screenshot({ path: `${SHOT}/C2-carte-verso.png`, fullPage: true });

await step('« Facile » enregistre et passe à la suivante', async () => {
  const avant = await p.textContent('.ds-badge--info');
  await p.click('button:has-text("Facile")');
  await p.waitForTimeout(350);
  const apres = await p.textContent('.ds-badge--info');
  if (avant === apres) throw new Error(`compteur inchangé (${avant})`);
  if (await p.locator('.flash__a').isVisible().catch(() => false)) throw new Error('la nouvelle carte est déjà retournée');
});

await step('« Difficile » remet la question à revoir aujourd\'hui', async () => {
  const r = await p.evaluate(async () => {
    const store = await import('./js/store.js');
    const avant = store.dueIds().length;
    document.querySelector('.flash').click();
    return avant;
  });
  await p.waitForTimeout(300);
  await p.click('button:has-text("Difficile")');
  await p.waitForTimeout(300);
  const apres = await p.evaluate(async () => {
    const store = await import('./js/store.js');
    return { dues: store.dueIds().length, erreurs: store.weakIds().length };
  });
  if (apres.erreurs === 0) throw new Error('une carte jugée difficile ne rejoint pas les erreurs');
});

await step('le paquet se termine par un bilan', async () => {
  for (let i = 0; i < 30; i++) {
    if (await p.locator('.score').count()) break;
    if (await p.locator('button:has-text("Facile")').count()) await p.click('button:has-text("Facile")');
    else await p.click('.flash');
    await p.waitForTimeout(120);
  }
  if (!(await p.locator('.score').count())) throw new Error('bilan non atteint');
});
await p.screenshot({ path: `${SHOT}/C3-bilan.png`, fullPage: true });

await step('le graphique de la semaine s\'affiche dans Progrès', async () => {
  await p.goto(`${BASE}#/progres`);
  await p.waitForSelector('.week');
  const n = await p.locator('.week__day').count();
  if (n !== 7) throw new Error(`${n} jours au lieu de 7`);
  if (!(await p.locator('.week__bar--today').count())) throw new Error('le jour courant n\'est pas repéré');
});
await p.screenshot({ path: `${SHOT}/C4-semaine.png`, fullPage: true });

await b.close();
console.log('\n' + (errors.length ? `${errors.length} problème(s):\n- ${errors.join('\n- ')}` : 'Aucune erreur.'));
process.exit(errors.length ? 1 : 0);
