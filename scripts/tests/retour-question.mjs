/**
 * On peut revenir sur une question et changer sa réponse.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *  Ce qui manquait
 * ─────────────────────────────────────────────────────────────────────────────
 *  Une série n'allait que vers l'avant. Une faute de doigt, une question mal
 *  lue, une réponse qu'on regrette deux écrans plus loin : rien à faire, elle
 *  était partie. En entraînement, où l'on apprend, c'est une rigidité sans
 *  contrepartie.
 *
 *  Le piège n'est pas la navigation, il est dans le carnet de progression.
 *  Chaque réponse fait avancer une boîte de révision espacée. Si revenir en
 *  arrière enregistrait une deuxième fois la même question, la boîte avancerait
 *  deux fois pour un seul apprentissage, et la maîtrise afficherait un savoir
 *  qui n'existe pas. C'est ce que ce contrôle surveille de plus près.
 * ─────────────────────────────────────────────────────────────────────────────
 */
import pw from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pw;

const BASE = 'http://127.0.0.1:8099/';
const erreurs = [];
const ok = (m) => console.log(`  ok  ${m}`);
const ko = (m) => { erreurs.push(m); console.log(`  KO  ${m}`); };
const verifier = (cond, m) => (cond ? ok(m) : ko(m));

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 393, height: 852 }, locale: 'fr-FR' });
const page = await ctx.newPage();
page.on('pageerror', (e) => ko(`erreur JS : ${e.message}`));

await page.goto(BASE, { waitUntil: 'networkidle' });
await page.waitForSelector('#boot', { state: 'hidden' });
await page.fill('#ob-name', 'Abdellah');
await page.click('button[type=submit]');
await page.waitForSelector('.accueil__hero');

const enonce = () => page.textContent('.ds-qcard__q, .ds-qcard h2, .ds-qcard').then((t) => t.replace(/\s+/g, ' ').trim().slice(0, 60));
const compteur = () => page.textContent('.quizbar__count').then((t) => t.replace(/\s+/g, ' ').trim());
const carnet = (qid) => page.evaluate(async (id) => {
  const store = await import('./js/store.js');
  return store.progressOf(id);
}, qid);

/* ───────────────────────────── entraînement : correction immédiate ───────── */

await page.goto(`${BASE}#/reviser/t/institutions`);
await page.reload({ waitUntil: 'networkidle' });
await page.waitForSelector('.ds-seg__btn');
await page.click('.ds-seg__btn:has-text("10")');
await page.waitForTimeout(150);
await page.click('.ds-btn--primary:has-text("Commencer")');
await page.waitForSelector('.quiz');

verifier(!(await page.$('.ds-btn:has-text("Précédent")')), "sur la première question, aucun « Précédent » : il n'y a rien derrière");

// Question 1 : on répond, on valide, on avance.
const q1 = await enonce();
const idQ1 = await page.evaluate(() => window.__carte1 ?? null);
await page.click('.ds-answer >> nth=0');
await page.click('.quiz .ds-btn--full:has-text("Valider")');
await page.waitForTimeout(200);
await page.click('.quiz .ds-btn--full:has-text("Question suivante")');
await page.waitForTimeout(250);

verifier((await compteur()).includes('2 sur 10'), `on est bien sur la deuxième question (${await compteur()})`);
verifier(Boolean(await page.$('.ds-btn:has-text("Précédent")')), '« Précédent » apparaît dès la deuxième question');

/* ───────────────────────────── revenir, et retrouver son état ───────────── */

await page.click('.ds-btn:has-text("Précédent")');
await page.waitForTimeout(250);
verifier((await compteur()).includes('1 sur 10'), `« Précédent » ramène à la question 1 (${await compteur()})`);
verifier((await enonce()) === q1, 'et c’est bien la même question qu’avant');
verifier(Boolean(await page.$('.ds-answer--correct')), 'elle est retrouvée CORRIGÉE, et non remise à zéro');
const verdict = await page.$('.ds-verdict');
verifier(Boolean(verdict), 'son verdict et son explication sont de nouveau lisibles');

/* ───────────────────────────── changer sa réponse ───────────────────────── */

const avant = await page.evaluate(() => {
  const el = document.querySelector('.ds-answer--wrong, .ds-answer--correct[aria-pressed], .ds-answer');
  return document.querySelectorAll('.ds-answer').length;
});
verifier(avant >= 3, `les propositions sont toujours là (${avant})`);

const desactivees = await page.$$eval('.ds-answer', (n) => n.filter((x) => x.disabled).length);
verifier(desactivees === 0, `et elles restent appuyables : on peut changer d'avis (${desactivees} désactivée(s))`);

/* ─────────── le carnet ne compte pas deux fois — le vrai enjeu ──────────── */

const trace = await page.evaluate(async () => {
  const store = await import('./js/store.js');
  const p = store.current();
  // La question affichée est la première de la série : on la retrouve par la
  // seule fiche du carnet qui a été touchée à l'instant.
  const fiches = Object.entries(p.progress).sort((a, b) => b[1].last - a[1].last);
  return fiches[0] ? { id: fiches[0][0], ...fiches[0][1] } : null;
});
verifier(trace && trace.seen === 1, `une réponse validée = une seule fiche au carnet (seen = ${trace?.seen})`);

// On rappuie DEUX FOIS sur la même proposition : rien ne doit bouger.
const memeChoix = await page.$$eval('.ds-answer', (n) => n.findIndex((x) => /ds-answer--(correct|wrong)/.test(x.className) && x.getAttribute('aria-pressed') !== null));
await page.click('.ds-answer >> nth=0');
await page.waitForTimeout(150);
await page.click('.ds-answer >> nth=0');
await page.waitForTimeout(150);
const apresMeme = await page.evaluate(async (id) => {
  const store = await import('./js/store.js');
  return store.progressOf(id);
}, trace.id);
verifier(apresMeme.seen === 1, `rappuyer sur la même proposition ne recompte pas (seen = ${apresMeme.seen})`);

// On choisit une AUTRE proposition : le carnet doit suivre, une fois.
await page.click('.ds-answer >> nth=1');
await page.waitForTimeout(200);
const apresChange = await page.evaluate(async (id) => {
  const store = await import('./js/store.js');
  return store.progressOf(id);
}, trace.id);
verifier(apresChange.seen === 2, `changer de réponse est noté, une fois (seen = ${apresChange.seen})`);
verifier(apresChange.lastOk !== undefined, 'et la dernière réponse est celle qui vaut');

/* ───────────────────────────── examen blanc : liberté totale ────────────── */

/**
 * En conditions d'examen, rien n'est dévoilé avant la fin. Revenir en arrière
 * n'y est donc pas une facilité mais la règle même d'une épreuve sur papier :
 * on répond, on avance, on revient si l'on doute.
 *
 * Le carnet de progression, lui, ne doit rien enregistrer avant que l'épreuve
 * soit terminée — sinon changer une réponse en laisserait deux au carnet, et
 * la première, celle qu'on a corrigée, compterait quand même.
 *
 * Page neuve : la série d'entraînement laissée en plan ouvre son garde-fou
 * « quitter la séance ? », qui recouvre l'écran et intercepte les appuis.
 */
const page2 = await ctx.newPage();
page2.on('pageerror', (e) => ko(`erreur JS (examen) : ${e.message}`));
await page2.goto(`${BASE}#/examen/run/officiel`, { waitUntil: 'networkidle' });
await page2.waitForSelector('.quiz', { timeout: 8000 });

const fichesAvant = await page2.evaluate(async () => {
  const store = await import('./js/store.js');
  return Object.keys(store.current().progress).length;
});

await page2.click('.ds-answer >> nth=0');
await page2.click('.quiz .ds-btn--full:has-text("Question suivante")');
await page2.waitForTimeout(250);

verifier(Boolean(await page2.$('.ds-btn:has-text("Précédent")')), "l'examen blanc propose aussi « Précédent »");
verifier(!(await page2.$('.ds-answer--correct')), 'et il ne dévoile toujours rien : la correction reste pour la fin');

await page2.click('.ds-btn:has-text("Précédent")');
await page2.waitForTimeout(250);
const desact = await page2.$$eval('.ds-answer', (n) => n.filter((x) => x.disabled).length);
verifier(desact === 0, `on peut revenir changer sa réponse avant de terminer (${desact} désactivée(s))`);

await page2.click('.ds-answer >> nth=2');
await page2.waitForTimeout(200);
const fichesApres = await page2.evaluate(async () => {
  const store = await import('./js/store.js');
  return Object.keys(store.current().progress).length;
});
verifier(
  fichesApres === fichesAvant,
  `rien n'est porté au carnet tant que l'épreuve n'est pas terminée (${fichesAvant} → ${fichesApres} fiches)`,
);

await browser.close();
console.log(erreurs.length ? `\n${erreurs.length} problème(s).` : '\nAucun problème détecté.');
process.exit(erreurs.length ? 1 : 0);
