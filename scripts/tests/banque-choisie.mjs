/**
 * On choisit sa banque, et la séance ne sort pas de ce choix.
 *
 * « Je veux juste les questions de l'examen » n'avait aucun moyen de
 * s'exprimer : une séance de vingt questions tirait dans les trois banques.
 * Quelqu'un qui a fini « La France racontée » et qui n'a pas ouvert le livret
 * y retombait sans arrêt, sans comprendre pourquoi ni comment l'éviter.
 *
 * Ce contrôle joue le geste complet — ouvrir un thème, appuyer sur une banque,
 * lancer la séance — et vérifie que TOUTES les questions tirées viennent bien
 * de la banque demandée. Il vérifie aussi les deux pièges qui vont avec : que
 * le sous-thème disparaisse quand il n'a plus de sens, et qu'un thème pauvre
 * en questions garde un sélecteur de nombre utilisable.
 */
import pw from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pw;

const BASE = 'http://127.0.0.1:8099/';
const erreurs = [];
const ok = (m) => console.log(`  ok  ${m}`);
const ko = (m) => { erreurs.push(m); console.log(`  KO  ${m}`); };
const verifier = (cond, m) => (cond ? ok(m) : ko(m));

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 390, height: 900 }, locale: 'fr-FR' });
const page = await ctx.newPage();
page.on('pageerror', (e) => ko(`erreur JS : ${e.message}`));

await page.goto(BASE, { waitUntil: 'networkidle' });
await page.waitForSelector('#boot', { state: 'hidden' });
await page.fill('#ob-name', 'Abdellah');
await page.click('button[type=submit]');
await page.waitForSelector('.accueil__hero');

/** L'identité de chaque banque, telle que la page la connaît. */
const banques = await page.evaluate(async () => {
  const { poolTheme, SOURCES } = await import('./js/data/banques.js');
  const out = {};
  for (const s of SOURCES) out[s] = poolTheme('histoire-geo-culture', s).map((q) => q.id);
  return out;
});
verifier(
  banques.examen.length === 76 && banques.livret.length === 85 && banques.recit.length === 48,
  `Histoire & géo se répartit en 76 / 85 / 48 (${banques.examen.length} / ${banques.livret.length} / ${banques.recit.length})`,
);

const appartient = (id, banque) => banques[banque].includes(id);

/** Ouvre un thème et rend la liste des puces de banque affichées. */
async function ouvrir(theme) {
  await page.goto(`${BASE}#/reviser/t/${theme}`);
  await page.waitForSelector('.ds-chip');
  return page.$$eval('.ds-chip', (n) => n.map((x) => x.textContent.trim()));
}

/* ----------------------------------------------------- les puces existent */

const puces = await ouvrir('histoire-geo-culture');
for (const attendu of ['Les trois (209)', "Banque d'examen (76)", 'Livret du citoyen (85)', 'La France racontée (48)']) {
  verifier(puces.includes(attendu), `la puce « ${attendu} » est proposée`);
}

/* ------------------------------------ une banque choisie borne la séance */

/**
 * Appuie sur une banque, lance la séance, et rend les identifiants tirés.
 * On lit les identifiants dans le moteur plutôt qu'à l'écran : une séance de
 * vingt questions ne montre que la première, et c'est le tirage entier qu'il
 * faut juger.
 */
async function tirer(theme, banque, nb) {
  return page.evaluate(async ({ theme, banque, nb }) => {
    const { buildTraining } = await import('./js/engine.js');
    return buildTraining({ mode: 'theme', theme, source: banque, count: nb }).map((c) => c.id);
  }, { theme, banque, nb });
}

for (const banque of ['examen', 'livret', 'recit']) {
  const ids = await tirer('histoire-geo-culture', banque, 40);
  const intrus = ids.filter((id) => !appartient(id, banque));
  verifier(ids.length === 40, `${banque} : la séance rend bien 40 questions (${ids.length})`);
  verifier(intrus.length === 0, `${banque} : aucune question d'une autre banque${intrus.length ? ` — ${intrus.slice(0, 3).join(', ')}` : ''}`);
}

// Sans choix, les trois banques se mélangent : c'est le comportement d'avant,
// et il doit rester le défaut.
const melange = await tirer('histoire-geo-culture', null, 209);
const familles = new Set(melange.map((id) => ['examen', 'livret', 'recit'].find((b) => appartient(id, b))));
verifier(familles.size === 3, `sans choix, les trois banques sont tirées (${[...familles].join(', ')})`);

/* ----------------------------------- le sous-thème suit, ou se retire */

await page.click('.ds-chip:has-text("Livret du citoyen")');
await page.waitForTimeout(120);
const marquee = await page.$$eval('.ds-chip[aria-pressed="true"]', (n) => n.map((x) => x.textContent.trim()));
verifier(
  marquee.some((x) => x.startsWith('Livret du citoyen')),
  `la banque choisie se voit à l'écran (marquées : ${marquee.join(' / ') || 'aucune'})`,
);
const apresLivret = await page.$$eval('.ds-chip', (n) => n.map((x) => x.textContent.trim()));
verifier(
  !apresLivret.some((x) => x.startsWith('Repères historiques')),
  'le livret choisi, les sous-thèmes disparaissent — ils ne découpent que l\'examen',
);

await page.click('.ds-chip:has-text("Banque d\'examen")');
await page.waitForTimeout(120);
const apresExamen = await page.$$eval('.ds-chip', (n) => n.map((x) => x.textContent.trim()));
verifier(
  apresExamen.some((x) => x.startsWith('Repères historiques')),
  'la banque d\'examen choisie, les sous-thèmes reviennent',
);

/* --------------------------- un thème pauvre garde un sélecteur utilisable */

// « Vivre en société » n'a que quatre questions dans le récit : moins que le
// plus petit palier proposé. Le sélecteur doit tout de même offrir un nombre.
await ouvrir('vivre-societe');
await page.click('.ds-chip:has-text("La France racontée")');
await page.waitForTimeout(120);
const paliers = await page.$$eval('.ds-seg__btn', (n) => n.map((x) => x.textContent.trim()));
verifier(paliers.length > 0, `quatre questions au récit : le sélecteur propose quand même un nombre (${paliers.join(', ') || 'aucun'})`);

const bouton = await page.textContent('.ds-btn--primary');
verifier(/\(4 questions\)/.test(bouton || ''), `le bouton annonce le nombre réel — « ${(bouton || '').trim()} »`);

/* ------------------------------------------- la phrase se lit en français */

/**
 * Les noms de banque s'insèrent dans une phrase, et une mise en minuscules
 * automatique donnait « dans la france racontée » : le titre d'un livre ne se
 * décapitalise pas, et « dans banque d'examen » n'a pas d'article.
 */
await ouvrir('histoire-geo-culture');
for (const [puce, attendu] of [
  ["Banque d'examen", "la banque d'examen"],
  ['Livret du citoyen', 'le livret du citoyen'],
  ['La France racontée', '« La France racontée »'],
]) {
  await page.click(`.ds-chip:has-text("${puce}")`);
  await page.waitForTimeout(120);
  const phrases = await page.$$eval('.hint', (n) => n.map((x) => x.textContent.trim()));
  const dite = phrases.find((x) => x.includes('dans '));
  verifier(
    Boolean(dite && dite.includes(`dans ${attendu}`)),
    `« ${puce} » se dit correctement — « ${(dite || 'aucune phrase').slice(0, 80)} »`,
  );
}

/* ------------------------------------------- la séance part vraiment */

await ouvrir('histoire-geo-culture');
await page.click('.ds-chip:has-text("La France racontée")');
await page.waitForTimeout(120);
await page.click('.ds-btn--primary');
await page.waitForSelector('.quiz', { timeout: 5000 });
const enJeu = await page.evaluate(() => document.querySelector('.quiz')?.textContent || '');
verifier(enJeu.length > 0, 'la séance démarre sur la banque choisie');

await browser.close();
console.log(erreurs.length ? `\n${erreurs.length} problème(s).` : '\nAucun problème détecté.');
process.exit(erreurs.length ? 1 : 0);
