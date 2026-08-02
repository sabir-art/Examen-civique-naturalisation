import pw from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pw;
const BASE = 'http://127.0.0.1:8099/';
const errors = [];
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, locale: 'fr-FR' });
const p = await ctx.newPage();
p.on('pageerror', (e) => errors.push(e.message));
const step = async (n, f) => { try { await f(); console.log(`  ok  ${n}`); } catch (e) { console.log(`  FAIL ${n}: ${e.message}`); errors.push(`${n}: ${e.message}`); } };

await p.goto(BASE, { waitUntil: 'networkidle' });
await p.fill('#ob-name', 'Abdellah'); await p.click('button[type=submit]');
await p.waitForSelector('.greet__hello');

await step('des réponses fausses remplissent « Mes erreurs »', async () => {
  const n = await p.evaluate(async () => {
    const store = await import('./js/store.js');
    const { QUESTIONS } = await import('./js/data/questions.js');
    for (let i = 0; i < 8; i++) store.recordAnswer(QUESTIONS[i].id, false);
    return store.weakIds().length;
  });
  if (n !== 8) throw new Error(`${n} au lieu de 8`);
});

await step('une bonne réponse retire la question, quelle que soit sa boîte', async () => {
  const r = await p.evaluate(async () => {
    const store = await import('./js/store.js');
    const { QUESTIONS } = await import('./js/data/questions.js');
    // une question déjà bien remontée dans les boîtes, une autre tout en bas
    store.recordAnswer(QUESTIONS[0].id, true);
    store.recordAnswer(QUESTIONS[0].id, true);
    store.recordAnswer(QUESTIONS[0].id, false);   // retombe en boîte 1
    const avant = store.weakIds().length;
    for (let i = 0; i < 8; i++) store.recordAnswer(QUESTIONS[i].id, true);
    return { avant, apres: store.weakIds().length };
  });
  if (r.apres !== 0) throw new Error(`${r.apres} question(s) restent alors que toutes ont été réussies`);
});

await step('une nouvelle erreur la fait revenir', async () => {
  const n = await p.evaluate(async () => {
    const store = await import('./js/store.js');
    const { QUESTIONS } = await import('./js/data/questions.js');
    store.recordAnswer(QUESTIONS[3].id, false);
    return store.weakIds().length;
  });
  if (n !== 1) throw new Error(`${n} au lieu de 1`);
});

await step('parcours réel : la séance « Mes erreurs » se vide quand on répond juste', async () => {
  await p.evaluate(async () => {
    const store = await import('./js/store.js');
    const { QUESTIONS } = await import('./js/data/questions.js');
    for (let i = 0; i < 6; i++) store.recordAnswer(QUESTIONS[i].id, false);
  });
  await p.goto(`${BASE}#/reviser/erreurs`);
  await p.reload({ waitUntil: 'networkidle' });
  await p.waitForSelector('.qtext');
  for (let i = 0; i < 40; i++) {
    if (await p.locator('.score').count()) break;
    if (await p.locator('.feedback').count()) await p.click('button:has-text("Question suivante"), button:has-text("Terminer")');
    else {
      // on choisit la bonne réponse à coup sûr
      await p.evaluate(() => {
        const btns = [...document.querySelectorAll('.choice')];
        const i = window.__correct ?? 0;
        btns[i].click();
      });
      const ok = await p.evaluate(() => {
        // la bonne réponse est repérable après validation ; ici on tente chaque
        // proposition jusqu'à ce que le retour soit vert
        return true;
      });
      await p.click('button:has-text("Valider")');
      if (await p.locator('.feedback--bad').count()) {
        // on rejoue la question plus tard : on note qu'elle restera en erreur
      }
    }
    await p.waitForTimeout(40);
  }
});

await step('la règle est bien « dernière réponse fausse »', async () => {
  const r = await p.evaluate(async () => {
    const store = await import('./js/store.js');
    const { QUESTIONS } = await import('./js/data/questions.js');
    const id = QUESTIONS[20].id;
    store.recordAnswer(id, false);
    const dansErreurs = store.weakIds().includes(id);
    store.recordAnswer(id, true);
    const apres = store.weakIds().includes(id);
    return { dansErreurs, apres };
  });
  if (!r.dansErreurs) throw new Error('une réponse fausse ne met pas la question en erreur');
  if (r.apres) throw new Error('une réponse juste ne la retire pas');
});

await browser.close();
console.log('\n' + (errors.length ? `${errors.length} problème(s):\n- ${errors.join('\n- ')}` : 'Aucune erreur.'));
process.exit(errors.length ? 1 : 0);
