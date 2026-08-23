/**
 * On peut toujours ressortir d'un écran de résultats.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *  Le défaut
 * ─────────────────────────────────────────────────────────────────────────────
 *  Une série lancée depuis un thème remplace le contenu de l'écran SANS changer
 *  l'adresse : le questionnaire, puis les résultats, s'affichent toujours sous
 *  « #/reviser/t/histoire-geo-culture ». Le bouton « Retour » de la page de
 *  résultats visait donc l'adresse courante. Le navigateur, voyant le fragment
 *  inchangé, n'émettait aucun « hashchange » ; le routeur ne rejouait pas ; le
 *  bouton ne faisait rien.
 *
 *  On restait coincé sur son score, les onglets masqués, sans autre issue que
 *  la flèche de la barre du haut. Rien ne plantait, rien ne s'affichait en
 *  rouge : le bouton était là, il répondait au doigt, et il n'allait nulle part.
 *
 *  Ce contrôle joue la série entière — répondre à chaque question, atteindre
 *  les résultats, appuyer sur « Retour » — et exige d'être revenu sur l'écran
 *  du thème, onglets rétablis.
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

/** Répond à tout, sans se soucier de la justesse, jusqu'aux résultats. */
async function jouerJusquAuBout(limite = 60) {
  for (let i = 0; i < limite; i += 1) {
    if (await page.$('.score')) return true;
    // L'ordre compte : le bouton d'action est désactivé tant que rien n'est
    // choisi. On l'essaie d'abord — « Valider », puis « Suivant » —, et on ne
    // touche aux réponses que lorsqu'il ne mène nulle part. L'inverse
    // rechoisissait une réponse à chaque tour sans jamais valider.
    // « Valider » et « Question suivante » sont des boutons primaires, mais
    // « Terminer », sur la dernière question, est tonal. On vise donc le
    // bouton d'action pleine largeur, quelle que soit sa teinte.
    const action = await page.$('.quiz .ds-btn--full:not([disabled])');
    if (action) { await action.click(); await page.waitForTimeout(170); continue; }
    const choix = await page.$('.ds-answer:not([disabled])');
    if (choix) { await choix.click(); await page.waitForTimeout(140); continue; }
    await page.waitForTimeout(140);
  }
  return Boolean(await page.$('.score'));
}

/* ---------------------------------- une série de thème : l'adresse ne bouge pas */

await page.goto(`${BASE}#/reviser/t/histoire-geo-culture`);
await page.reload({ waitUntil: 'networkidle' });
await page.waitForSelector('.ds-chip');
// Dix questions : la série la plus courte, pour ne pas y passer la journée.
await page.click('.ds-seg__btn:has-text("10")');
await page.waitForTimeout(150);
const avant = page.url();
await page.click('.ds-btn--primary');
await page.waitForSelector('.quiz');

verifier(page.url() === avant, "le questionnaire s'ouvre sans changer l'adresse — c'est ce qui rendait le lien inerte");

verifier(await jouerJusquAuBout(), 'la série se joue jusqu\'à l\'écran de résultats');

const onglets = await page.$$eval('#chrome-bottom *', (n) => n.length);
verifier(onglets === 0, `les onglets sont bien masqués pendant les résultats (${onglets} élément(s))`);

/* ----------------------------------------------- et « Retour » ramène vraiment */

await page.click('a.ds-btn:has-text("Retour")');
await page.waitForTimeout(400);

verifier(Boolean(await page.$('.ds-filtre__piste')), 'après « Retour », l\'écran de réglages du thème est de nouveau là');
verifier(!(await page.$('.score')), 'l\'écran de résultats a bien été quitté');

const ongletsApres = await page.$$eval('#chrome-bottom .tab, #chrome-bottom a, #chrome-bottom button', (n) => n.length);
verifier(ongletsApres >= 5, `les cinq onglets sont rétablis (${ongletsApres} trouvé(s))`);

/* --------------------- le cas où l'adresse CHANGE doit continuer de marcher */

await page.goto(`${BASE}#/reviser/erreurs`);
await page.reload({ waitUntil: 'networkidle' });
await page.waitForTimeout(400);
const vide = await page.$('.empty');
if (vide) {
  ok('« Mes erreurs » est vide — rien à jouer, le cas est sans objet ici');
} else {
  await jouerJusquAuBout();
  await page.click('a.ds-btn:has-text("Retour")');
  await page.waitForTimeout(400);
  verifier(page.url().endsWith('#/reviser'), `« Retour » depuis une séance à adresse propre mène bien à #/reviser (${page.url().split('#')[1]})`);
}

await browser.close();
console.log(erreurs.length ? `\n${erreurs.length} problème(s).` : '\nAucun problème détecté.');
process.exit(erreurs.length ? 1 : 0);
