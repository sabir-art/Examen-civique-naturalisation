import pw from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pw;
const BASE = 'http://127.0.0.1:8099/';
const SHOT = './scripts/tests/captures';
const errors = [];
const browser = await chromium.launch();
// Le cas exact du signalement : téléphone en sombre, application forcée en clair.
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, locale: 'fr-FR', colorScheme: 'dark' });
const p = await ctx.newPage();
p.on('pageerror', (e) => errors.push(e.message));
await p.goto(BASE, { waitUntil: 'networkidle' });
await p.fill('#ob-name', 'Abdellah'); await p.click('button[type=submit]');
await p.waitForSelector('.greet__hello');
await p.evaluate(() => {
  const raw = JSON.parse(localStorage.getItem('examen-civique.v1'));
  for (const pr of Object.values(raw.profiles)) { pr.settings.theme = 'light'; pr.goalDate = '2026-08-28'; }
  localStorage.setItem('examen-civique.v1', JSON.stringify(raw));
});
await p.reload({ waitUntil: 'networkidle' });
await p.waitForSelector('.greet__hello');

const step = async (n, f) => { try { await f(); console.log(`  ok  ${n}`); } catch (e) { console.log(`  FAIL ${n}: ${e.message}`); errors.push(`${n}: ${e.message}`); } };

await step('boutons secondaires lisibles en clair forcé', async () => {
  await p.goto(`${BASE}#/compte`);
  await p.waitForSelector('.btn--ghost');
  const bad = await p.evaluate(() => [...document.querySelectorAll('.btn--ghost, .btn--danger, .btn--quiet')]
    .filter((b) => getComputedStyle(b).color === 'rgb(255, 255, 255)')
    .map((b) => b.textContent.trim() || '(vide)'));
  if (bad.length) throw new Error(`texte blanc sur : ${bad.join(', ')}`);
});
await p.screenshot({ path: `${SHOT}/F1-compte-clair.png`, fullPage: true });

await step('le champ date ne déborde pas de sa carte', async () => {
  const r = await p.evaluate(() => {
    const i = document.querySelector('input[type="date"]');
    const carte = i.closest('.card');
    return { input: i.getBoundingClientRect().right, carte: carte.getBoundingClientRect().right };
  });
  if (r.input > r.carte - 8) throw new Error(`le champ finit à ${Math.round(r.input)} pour une carte à ${Math.round(r.carte)}`);
});

await step('« Question suivante » ne recouvre pas le panneau Approfondir', async () => {
  await p.evaluate(() => localStorage.setItem('examen-civique.assistant',
    JSON.stringify({ provider: 'anthropic', keys: { anthropic: 'sk-ant-api03-FAUX-0000000000000000000000' } })));
  await p.goto(`${BASE}#/reviser/t/institutions`);
  await p.reload({ waitUntil: 'networkidle' });
  await p.click('button:has-text("Commencer")');
  await p.waitForSelector('.qtext');
  // Avant validation : la barre est collée en bas et opaque, pour que
  // « Valider » reste sous le pouce sans laisser filer le texte derrière.
  const avant = await p.evaluate(() => {
    const f = document.querySelector('.quizfoot');
    const cs = getComputedStyle(f);
    return { position: cs.position, fond: cs.backgroundColor };
  });
  if (avant.position !== 'sticky') throw new Error(`barre non collée pendant le choix (${avant.position})`);
  if (/rgba\(0, 0, 0, 0\)/.test(avant.fond)) throw new Error('barre collée transparente pendant le choix');
  await p.click('.choice >> nth=0');
  await p.click('button:has-text("Valider")');
  await p.waitForSelector('.feedback');
  // Après validation : elle redescend, donc elle ne peut plus rien recouvrir.
  const r0 = await p.evaluate(() => {
    const f = document.querySelector('.quizfoot').getBoundingClientRect();
    const fb = document.querySelector('.feedback').getBoundingClientRect();
    return { position: getComputedStyle(document.querySelector('.quizfoot')).position, chevauche: f.top < fb.bottom && f.bottom > fb.top };
  });
  if (r0.position === 'sticky') throw new Error('la barre reste collée après la correction');
  if (r0.chevauche) throw new Error('la barre recouvre le bloc de correction');
  await p.waitForSelector('.deepen summary');
  await p.click('.deepen summary');
  await p.waitForTimeout(700);
  const r = await p.evaluate(() => {
    const chips = [...document.querySelectorAll('.deepen .chip')];
    const foot = document.querySelector('.quizfoot').getBoundingClientRect();
    const caches = chips.filter((c) => {
      const b = c.getBoundingClientRect();
      return b.bottom > foot.top && b.top < foot.bottom;   // recouvrement vertical
    }).map((c) => c.textContent.trim());
    return { caches, colle: getComputedStyle(document.querySelector('.quizfoot')).position };
  });
  if (r.caches.length) throw new Error(`recouvert : ${r.caches.join(' / ')}`);
  // Panneau ouvert : la barre doit avoir quitté le mode collé pour redescendre.
  if (r.colle === 'sticky') throw new Error('la barre reste collée par-dessus le panneau');
});
await p.screenshot({ path: `${SHOT}/F2-approfondir.png`, fullPage: true });

await step('la pastille de réponse montre une coche', async () => {
  const ok = await p.evaluate(() => {
    const c = document.querySelector('.choice.is-correct .choice__mark');
    return c && getComputedStyle(c).opacity === '1';
  });
  if (!ok) throw new Error('pas de coche sur la bonne réponse');
});

await step('les animations existent et se coupent si demandé', async () => {
  const anim = await p.evaluate(() => getComputedStyle(document.querySelector('.feedback')).animationName);
  if (anim === 'none') throw new Error('aucune animation sur le bloc de correction');
  await p.emulateMedia?.({ reducedMotion: 'reduce' });
});
await p.emulateMedia({ reducedMotion: 'reduce' });
await p.reload({ waitUntil: 'networkidle' });
await step('mouvement réduit : les durées tombent à zéro', async () => {
  await p.waitForSelector('.app > *');
  const d = await p.evaluate(() => getComputedStyle(document.querySelector('.app > *')).animationDuration);
  if (parseFloat(d) > 0.005) throw new Error(`durée ${d}`);
});
await p.emulateMedia({ reducedMotion: 'no-preference' });

await step('écran de résultat : coches, blocs de correction, animation du verdict', async () => {
  await p.goto(`${BASE}#/reviser/t/institutions`);
  await p.reload({ waitUntil: 'networkidle' });
  await p.click('button:has-text("Commencer")');
  await p.waitForSelector('.qtext');
  for (let i = 0; i < 60; i++) {
    if (await p.locator('.score').count()) break;
    if (await p.locator('.feedback').count()) await p.click('button:has-text("Question suivante"), button:has-text("Terminer")');
    else { await p.click('.choice >> nth=3'); await p.click('button:has-text("Valider")'); }
    await p.waitForTimeout(30);
  }
  await p.waitForSelector('.correc');
  await p.click('.correc__q >> nth=0');
  await p.waitForTimeout(300);
  if (!(await p.locator('.answerbox--ok').first().isVisible())) throw new Error('bloc « bonne réponse » absent');
  if (!(await p.locator('.answerbox--bad').first().isVisible())) throw new Error('bloc « votre réponse » absent');
  const a = await p.evaluate(() => getComputedStyle(document.querySelector('.score__verdict')).animationName);
  if (a === 'none') throw new Error('le verdict n\'est pas animé');
});
await p.screenshot({ path: `${SHOT}/F3-corrections.png`, fullPage: true });

await browser.close();
console.log('\n' + (errors.length ? `${errors.length} problème(s):\n- ${errors.join('\n- ')}` : 'Aucune erreur.'));
process.exit(errors.length ? 1 : 0);
