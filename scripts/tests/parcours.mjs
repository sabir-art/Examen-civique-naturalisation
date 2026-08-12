/**
 * Niveau, points d'expérience et badges.
 *
 * Le point délicat est que tout est CALCULÉ : rien n'est stocké. Ces contrôles
 * vérifient donc surtout la cohérence — les mêmes données doivent toujours
 * donner le même niveau, et une progression qui augmente ne doit jamais faire
 * baisser les points.
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
await page.waitForSelector('.accueil__hero');

/** Installe une progression donnée et recharge. */
async function poser(patch) {
  await page.evaluate((p) => {
    const raw = JSON.parse(localStorage.getItem('examen-civique.v1'));
    for (const prof of Object.values(raw.profiles)) Object.assign(prof, p);
    localStorage.setItem('examen-civique.v1', JSON.stringify(raw));
  }, patch);
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(400);
}

const reponses = (n, justes) => {
  const out = {};
  for (let i = 0; i < n; i++) {
    out[`sym${String(i + 1).padStart(2, '0')}`] = {
      box: 4, seen: 1, ok: i < justes ? 1 : 0, ko: i < justes ? 0 : 1,
      lastOk: i < justes, last: Date.now(), due: 0,
    };
  }
  return out;
};

/* ------------------------------------------- 1. profil neuf : niveau 1, 0 badge */

await poser({ progress: {}, exams: [], days: {}, read: {}, badgeAt: {} });
await page.goto(BASE + '#/parcours');
await page.waitForTimeout(400);

let texte = await page.textContent('.app');
verifier(/Premiers pas/.test(texte), 'un profil neuf est au premier niveau');
verifier(/Aucun badge/.test(texte), 'un profil neuf n’affiche aucun badge obtenu');
verifier((await page.locator('.bdg--off').count()) > 0, 'les badges à venir sont montrés éteints');

/* ---------------------------------------- 2. les points suivent la progression */

async function pointsAffiches() {
  return page.evaluate(() => {
    // `toLocaleString('fr-FR')` sépare les milliers par une espace fine
    // insécable (U+202F) : on retire tout ce qui n'est pas un chiffre plutôt
    // que de deviner quel caractère d'espacement a été employé.
    const m = document.querySelector('.card__eyebrow')?.textContent.match(/^(.+?)\s*points$/);
    return m ? Number(m[1].replace(/\D/g, '')) : null;
  });
}

await poser({ progress: reponses(20, 20), exams: [], days: {}, read: {}, badgeAt: {} });
await page.goto(BASE + '#/parcours');
await page.waitForTimeout(400);
const p20 = await pointsAffiches();

await poser({ progress: reponses(40, 40), exams: [], days: {}, read: {}, badgeAt: {} });
await page.goto(BASE + '#/parcours');
await page.waitForTimeout(400);
const p40 = await pointsAffiches();

verifier(p20 === 200, `vingt bonnes réponses valent 200 points (lu : ${p20})`);
verifier(p40 === 400, `quarante bonnes réponses valent 400 points (lu : ${p40})`);
verifier(p40 > p20, 'plus de bonnes réponses, plus de points');

/* --------------------------------------------- 3. le niveau monte aux paliers */

await poser({ progress: reponses(40, 40), exams: [], days: {}, read: {}, badgeAt: {} });
await page.goto(BASE + '#/parcours');
await page.waitForTimeout(400);
verifier(/Débutant/.test(await page.textContent('.app')), 'à 400 points on est « Débutant » (palier 300)');

await poser({
  progress: reponses(120, 120),
  exams: [{ id: 'a', mode: 'officiel', date: Date.now(), score: 36, total: 40, durationSec: 900, byTheme: {} }],
  days: { '2026-08-01': 10, '2026-08-02': 12 }, read: { ch01: Date.now() }, badgeAt: {},
});
await page.goto(BASE + '#/parcours');
await page.waitForTimeout(400);
const attendu = 120 * 10 + 40 + 60 + 150 + 2 * 15;
verifier(await pointsAffiches() === attendu, `le barème complet est appliqué (attendu ${attendu})`);

/* ------------------------------------------------------ 4. badges cohérents */

texte = await page.textContent('.app');
verifier(/Centurion/.test(texte), 'cent questions vues débloquent « Centurion »');
verifier(/Reçu/.test(texte), 'un examen réussi débloque « Reçu »');
verifier(/Lecteur/.test(texte), 'un chapitre lu débloque « Lecteur »');

const compteur = await page.textContent('.row--between .badge');
verifier(/\d+\/\d+/.test(compteur), `le compteur de badges est affiché (${compteur})`);

/* -------------------------------- 5. une remise à zéro remet les badges à zéro */

await page.goto(BASE + '#/compte');
await page.waitForTimeout(300);
await poser({ progress: {}, exams: [], days: {}, read: {}, badgeAt: {} });
await page.goto(BASE + '#/parcours');
await page.waitForTimeout(400);
verifier(/Premiers pas/.test(await page.textContent('.app')), 'après effacement, on repart du premier niveau');

/* ------------------------------------------- 6. l'échelle des niveaux est là */

const niveaux = await page.locator('.lvl').count();
verifier(niveaux === 8, `les huit paliers sont listés (${niveaux})`);
verifier((await page.locator('.lvl--courant').count()) === 1, 'un seul palier est marqué comme courant');

/* ------------------------------ 7. le raccourci depuis Progrès et l'accueil */

await page.goto(BASE + '#/progres');
await page.waitForTimeout(400);
verifier((await page.locator('a[href="#/parcours"]').count()) > 0, 'Progrès mène au parcours');
await page.goto(BASE + '#/');
await page.waitForTimeout(400);
verifier((await page.locator('a[href="#/parcours"]').count()) > 0, 'l’accueil mène au parcours');

await browser.close();
console.log(erreurs.length ? `\n${erreurs.length} erreur(s).` : '\nAucune erreur.');
process.exit(erreurs.length ? 1 : 0);
