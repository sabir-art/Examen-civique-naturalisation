/**
 * Quand il ne reste presque plus rien de neuf, on demande.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *  Le défaut
 * ─────────────────────────────────────────────────────────────────────────────
 *  Une séance sert d'abord ce qui n'a jamais été vu, puis complète avec des
 *  révisions. C'est le bon comportement, mais il était appliqué sans le dire :
 *  vous demandiez vingt questions, il n'en restait qu'une de neuve, vous en
 *  receviez vingt dont dix-neuf déjà connues — et aucun écran ne l'annonçait.
 *
 *  Rien de faux dans les chiffres. Simplement une séance qui n'était pas celle
 *  qu'on croyait demander, et un choix qu'on ne vous laissait pas faire.
 *
 *  Ce contrôle vérifie les trois cas : la question se pose quand elle a lieu
 *  d'être, elle ne se pose pas quand elle n'en a pas, et chacune des réponses
 *  compose la séance annoncée.
 */
import pw from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pw;

const BASE = 'http://127.0.0.1:8099/';
const THEME = 'principes-valeurs';
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

/** Marque comme vues toutes les questions d'examen du thème sauf `laisser`. */
async function laisserNeuves(laisser) {
  return page.evaluate(async ({ theme, laisser }) => {
    const { poolTheme } = await import('./js/data/banques.js');
    const store = await import('./js/store.js');
    const p = store.current();
    p.progress = {};
    const examen = poolTheme(theme, 'examen');
    for (const q of examen.slice(0, examen.length - laisser)) store.recordAnswer(q.id, true);
    return examen.slice(examen.length - laisser).map((q) => q.id);
  }, { theme: THEME, laisser });
}

/** Ouvre le thème, choisit la banque d'examen et un nombre. */
async function preparer(nombre) {
  await page.goto(`${BASE}#/reviser/t/${THEME}`);
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForSelector('.ds-filtre__piste');
  await page.click('.ds-chip:has-text("Examen")');
  await page.waitForTimeout(150);
  await page.click(`.ds-seg__btn:has-text("${nombre}")`);
  await page.waitForTimeout(150);
}

/* ------------------------------------ une seule question neuve, on en veut 20 */

const restantes = await laisserNeuves(1);
await preparer(20);
await page.click('.ds-btn--primary:has-text("Commencer")');
await page.waitForSelector('.modal__panel', { timeout: 4000 }).catch(() => {});

const dialogue = await page.$('.modal__panel');
verifier(Boolean(dialogue), 'la question est posée quand il ne reste qu’une nouveauté');

const titre = await page.textContent('.modal__title').catch(() => '');
verifier(/qu’une question nouvelle/.test(titre), `le titre dit ce qu'il en est — « ${titre} »`);

const boutons = await page.$$eval('.modal__panel button', (n) => n.map((x) => x.textContent.trim()));
verifier(boutons.some((b) => /^Les 20 \(1 nouvelle, 19 à revoir\)$/.test(b)), `l'option complète est chiffrée — ${boutons[0]}`);
verifier(boutons.some((b) => b === 'Seulement la nouvelle'), `l'option courte est proposée — ${boutons[1]}`);
verifier(boutons.some((b) => b === 'Annuler'), 'on peut renoncer');

/* ------------------------------------------------- « Seulement la nouvelle » */

await page.click('.modal__panel button:has-text("Seulement la nouvelle")');
await page.waitForSelector('.quiz', { timeout: 4000 });
const compteur = await page.textContent('.quizbar__count').catch(() => '');
verifier(/1\s*$|sur 1/.test(compteur.replace(/\s+/g, ' ')), `la séance ne contient qu'une question — « ${compteur.trim()} »`);

const posee = await page.evaluate(() => document.querySelector('.quizbody')?.textContent || '');
const bonne = await page.evaluate(async (id) => {
  const { trouverQuestion } = await import('./js/data/banques.js');
  return trouverQuestion(id)?.q || '';
}, restantes[0]);
verifier(posee.includes(bonne.slice(0, 30)), 'et c\'est bien la question jamais vue qui est posée');

/* ------------------------------------------------------- « Les 20 » complet */

await laisserNeuves(1);
await preparer(20);
await page.click('.ds-btn--primary:has-text("Commencer")');
await page.waitForSelector('.modal__panel');
await page.click('.modal__panel button:has-text("Les 20")');
await page.waitForSelector('.quiz');
const compteur20 = await page.textContent('.quizbar__count').catch(() => '');
verifier(/sur 20/.test(compteur20.replace(/\s+/g, ' ')), `l'autre réponse donne bien 20 questions — « ${compteur20.trim()} »`);

/* --------------------------------------------------------------- renoncer */

await laisserNeuves(1);
await preparer(20);
await page.click('.ds-btn--primary:has-text("Commencer")');
await page.waitForSelector('.modal__panel');
await page.click('.modal__panel button:has-text("Annuler")');
await page.waitForTimeout(300);
verifier(!(await page.$('.quiz')), 'renoncer ne lance aucune séance');
verifier(Boolean(await page.$('.ds-filtre__piste')), 'et laisse l\'écran de réglages en place');

/* ------------------------ la question ne se pose pas quand elle n'a pas lieu */

await laisserNeuves(40);
await preparer(20);
await page.click('.ds-btn--primary:has-text("Commencer")');
await page.waitForTimeout(500);
verifier(!(await page.$('.modal__panel')), '40 nouveautés pour 20 demandées : aucune question posée');
verifier(Boolean(await page.$('.quiz')), 'la séance part directement');

await laisserNeuves(0);
await preparer(20);
await page.click('.ds-btn--primary:has-text("Commencer")');
await page.waitForTimeout(500);
verifier(!(await page.$('.modal__panel')), 'plus rien de neuf : aucune question posée non plus, il n\'y a rien à choisir');
verifier(Boolean(await page.$('.quiz')), 'et la séance de révision part directement');

/* ------------------------------ l'option « inédites » porte bien sa promesse */

/**
 * Sans elle, demander vingt questions alors qu'une seule est neuve en rend
 * vingt : les dix-neuf autres sont des révisions, servies sans être annoncées.
 * Avec elle, la séance s'arrête à ce qui est neuf, quel que soit le nombre
 * demandé. C'est le contrat, et il ne doit pas dépendre de l'ordre de service :
 * si un jour le classement change, cette garantie doit tenir quand même.
 */
await laisserNeuves(3);
const contrat = await page.evaluate(async (theme) => {
  const { buildTraining, compterInedites } = await import('./js/engine.js');
  const { poolTheme } = await import('./js/data/banques.js');
  const store = await import('./js/store.js');
  const examen = poolTheme(theme, 'examen');
  return {
    neuves: compterInedites(examen),
    avec: buildTraining({ mode: 'theme', theme, source: 'examen', count: 20, inedites: true })
      .map((c) => c.id)
      .map((id) => Boolean(store.progressOf(id))),
    sans: buildTraining({ mode: 'theme', theme, source: 'examen', count: 20 }).length,
  };
}, THEME);

verifier(contrat.neuves === 3, `trois questions neuves préparées (${contrat.neuves})`);
verifier(
  contrat.avec.length === 3,
  `« inédites » borne la séance à ce qui est neuf, même si l'on demande 20 (${contrat.avec.length})`,
);
verifier(
  contrat.avec.every((dejaVue) => dejaVue === false),
  'et pas une seule question déjà vue ne s\'y glisse',
);
verifier(contrat.sans === 20, `sans elle, la même demande rend bien 20 questions (${contrat.sans})`);

/* --------------------------- le livret et le récit suivent la même règle */

/**
 * La règle vaut partout où une séance se compose, pas seulement sur l'écran
 * des thèmes. Ces deux-là entrent DIRECTEMENT dans le questionnaire, sans
 * écran de réglages : renoncer doit donc ramener quelque part, et non laisser
 * une page vide.
 */
async function derniereNeuve(section) {
  return page.evaluate(async (section) => {
    const store = await import('./js/store.js');
    store.current().progress = {};
    if (section === 'livret') {
      const { CHAPITRES } = await import('./js/data/livret.js');
      const { questionsOf } = await import('./js/data/q-livret.js');
      const ch = CHAPITRES.find((c) => questionsOf(c.key).length >= 4);
      const qs = questionsOf(ch.key);
      for (const q of qs.slice(0, qs.length - 1)) store.recordAnswer(q.id, true);
      return { cle: ch.key, total: qs.length };
    }
    const { CHAPITRES, questionsOf } = await import('./js/data/roman.js');
    const ch = CHAPITRES.find((c) => questionsOf(c.key).length >= 4);
    const qs = questionsOf(ch.key);
    for (const q of qs.slice(0, qs.length - 1)) store.recordAnswer(q.id, true);
    return { cle: ch.key, total: qs.length };
  }, section);
}

for (const [section, base, retour] of [['livret', '#/livret/q/', '/livret'], ['récit', '#/histoire/q/', '/histoire']]) {
  const ch = await derniereNeuve(section === 'livret' ? 'livret' : 'roman');
  await page.goto(`${BASE}${base}${ch.cle}`);
  await page.waitForTimeout(700);

  const pose = Boolean(await page.$('.modal__panel'));
  verifier(pose, `le ${section} pose la même question (chapitre de ${ch.total} questions, une seule neuve)`);
  if (!pose) continue;

  const titre2 = await page.textContent('.modal__title');
  verifier(/qu’une question nouvelle/.test(titre2), `${section} : le titre est juste — « ${titre2} »`);

  await page.click('.modal__panel button:has-text("Annuler")');
  await page.waitForTimeout(500);
  verifier(!(await page.$('.quiz')), `${section} : renoncer ne lance aucune séance`);
  verifier(
    (page.url().split('#')[1] || '').startsWith(retour),
    `${section} : renoncer ramène à l'écran précédent au lieu d'une page vide (${page.url().split('#')[1]})`,
  );

  // Et l'option courte doit vraiment donner UNE question.
  await derniereNeuve(section === 'livret' ? 'livret' : 'roman');
  await page.goto(`${BASE}${base}${ch.cle}`);
  await page.waitForSelector('.modal__panel');
  await page.click('.modal__panel button:has-text("Seulement la nouvelle")');
  await page.waitForSelector('.quiz');
  const c1 = (await page.textContent('.quizbar__count')).replace(/\s+/g, ' ');
  verifier(/sur 1$/.test(c1.trim()), `${section} : « seulement la nouvelle » donne une seule question — « ${c1.trim()} »`);
}

await browser.close();
console.log(erreurs.length ? `\n${erreurs.length} problème(s).` : '\nAucun problème détecté.');
process.exit(erreurs.length ? 1 : 0);
