/**
 * Une série sert d'abord ce qu'on n'a jamais vu, et le compteur compte des
 * QUESTIONS, pas des réponses.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *  La crainte, qui est légitime
 * ─────────────────────────────────────────────────────────────────────────────
 *  « 71 sur 92 en banque d'examen, il me reste 21 questions. Je demande une
 *  série de 20 : est-ce qu'il me les tire au hasard dans les 92 ? Si cinq des
 *  vingt sont des questions déjà faites, et qu'il les recompte comme vues, la
 *  barre finira par afficher 92/92 alors que je n'aurai jamais vu plusieurs
 *  questions. »
 *
 *  Ce serait un compteur qui ment sans jamais se tromper d'arithmétique : il
 *  additionnerait des réponses en prétendant compter des questions. C'est la
 *  panne la plus difficile à repérer, parce que rien ne cloche à l'écran.
 *
 *  Ce contrôle rejoue la situation exacte, chiffre pour chiffre.
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

/* --------------------------------------- on se met dans la situation décrite */

const depart = await page.evaluate(async (theme) => {
  const { poolTheme } = await import('./js/data/banques.js');
  const store = await import('./js/store.js');
  const examen = poolTheme(theme, 'examen');
  // 71 vues sur 92, comme à l'écran.
  for (const q of examen.slice(0, 71)) store.recordAnswer(q.id, true);
  return { total: examen.length, vues: examen.slice(0, 71).map((q) => q.id), restantes: examen.slice(71).map((q) => q.id) };
}, THEME);

verifier(depart.total === 92, `la banque d'examen de ce thème fait bien 92 questions (${depart.total})`);
verifier(depart.restantes.length === 21, `21 questions restent à découvrir (${depart.restantes.length})`);

const avancement = () => page.evaluate(async (theme) => {
  const { avancementTheme } = await import('./js/engine.js');
  const a = avancementTheme(theme);
  return Object.fromEntries(a.par.map(([cle, b]) => [cle, { vus: b.vus, total: b.total }]));
}, THEME);

const av0 = await avancement();
verifier(av0.examen.vus === 71, `le relevé annonce 71/92 (${av0.examen.vus}/${av0.examen.total})`);

/* ------------------- une série de 20 ne pioche que dans ce qui reste à voir */

const tirage = await page.evaluate(async (theme) => {
  const { buildTraining } = await import('./js/engine.js');
  return buildTraining({ mode: 'theme', theme, source: 'examen', count: 20 }).map((c) => c.id);
}, THEME);

const dejaVues = tirage.filter((id) => depart.vues.includes(id));
verifier(tirage.length === 20, `la série contient 20 questions (${tirage.length})`);
verifier(
  dejaVues.length === 0,
  `aucune question déjà répondue dans la série${dejaVues.length ? ` — ${dejaVues.slice(0, 5).join(', ')}` : ''}`,
);
verifier(new Set(tirage).size === 20, 'aucune question tirée deux fois dans la même série');

/* --------------------- répondre à ces 20 fait bien monter le relevé de 20 */

await page.evaluate(async (ids) => {
  const store = await import('./js/store.js');
  for (const id of ids) store.recordAnswer(id, true);
}, tirage);

const av1 = await avancement();
verifier(av1.examen.vus === 91, `après ces 20 réponses, le relevé passe à 91/92 (${av1.examen.vus}/${av1.examen.total})`);

/* --------- répondre DEUX FOIS à la même question ne la compte pas deux fois */

await page.evaluate(async (ids) => {
  const store = await import('./js/store.js');
  // Dix questions déjà faites, refaites une deuxième fois.
  for (const id of ids.slice(0, 10)) store.recordAnswer(id, true);
}, depart.vues);

const av2 = await avancement();
verifier(
  av2.examen.vus === 91,
  `dix réponses de plus sur des questions déjà faites ne bougent pas le relevé (${av2.examen.vus}/92)`,
);

/* ------------- la toute dernière question inconnue est bien servie en premier */

const derniere = await page.evaluate(async (theme) => {
  const { buildTraining } = await import('./js/engine.js');
  const { poolTheme } = await import('./js/data/banques.js');
  const store = await import('./js/store.js');
  const jamais = poolTheme(theme, 'examen').filter((q) => !store.progressOf(q.id)).map((q) => q.id);
  const serie = buildTraining({ mode: 'theme', theme, source: 'examen', count: 20 }).map((c) => c.id);
  return { jamais, serie, rang: serie.indexOf(jamais[0]) };
}, THEME);

verifier(derniere.jamais.length === 1, `il ne reste qu'une seule question inconnue (${derniere.jamais.length})`);
verifier(
  derniere.rang === 0,
  `elle est servie en tout premier, avant les révisions (rang ${derniere.rang})`,
);
verifier(
  derniere.serie.length === 20,
  `et la série fait quand même 20 questions : une découverte, puis 19 révisions (${derniere.serie.length})`,
);

await browser.close();
console.log(erreurs.length ? `\n${erreurs.length} problème(s).` : '\nAucun problème détecté.');
process.exit(erreurs.length ? 1 : 0);
