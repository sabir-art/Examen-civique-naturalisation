/**
 * « Ces informations datent de quand ? »
 *
 * Une application installée sur un téléphone est servie depuis son cache :
 * elle peut afficher pendant des semaines une version d'il y a un mois sans
 * rien laisser paraître. Sur un contenu qui suit un programme officiel, ce
 * silence est le défaut lui-même.
 *
 * Ce contrôle vérifie donc les trois choses qui rendraient l'écran menteur :
 * une date qui ne serait pas celle de la publication, une vérification qui
 * répondrait « à jour » sans avoir joint le serveur, et un version.json servi
 * depuis le cache — auquel cas l'application se croirait éternellement à jour.
 */
import pw from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pw;

const BASE = 'http://127.0.0.1:8099/';
const erreurs = [];
const ok = (m) => console.log(`  ok  ${m}`);
const ko = (m) => { erreurs.push(m); console.log(`  KO  ${m}`); };
const verifier = (cond, m) => (cond ? ok(m) : ko(m));

const { PUBLICATION, CONTENUS } = await import('../../js/data/build.js');
const { NOUVEAUTES } = await import('../../js/data/nouveautes.js');

const browser = await chromium.launch();
/* Sans service worker : on veut intercepter les appels à version.json depuis
   la page. La règle de cache, elle, se vérifie plus bas, avec un worker. */
const ctx = await browser.newContext({
  viewport: { width: 390, height: 900 }, locale: 'fr-FR', serviceWorkers: 'block',
});
const page = await ctx.newPage();
page.on('pageerror', (e) => ko(`erreur JS : ${e.message}`));

await page.goto(BASE, { waitUntil: 'networkidle' });
await page.waitForSelector('#boot', { state: 'hidden' });
await page.fill('#ob-name', 'Abdellah');
await page.click('button[type=submit]');
await page.waitForSelector('.accueil__hero');

const enFrancais = (jour) => new Date(jour).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

/* ------------------------------------------- 1. la date se voit sans chercher */

await page.waitForTimeout(400);
const pied = await page.locator('.pied').textContent();
verifier(pied.includes(enFrancais(PUBLICATION.jour)),
  `l'accueil porte la date de mise à jour (« ${pied.trim()} »)`);

await page.locator('.pied').click();
await page.waitForTimeout(600);
verifier((await page.evaluate(() => location.hash)) === '#/compte/nouveautes',
  'et mène à l’écran des nouveautés');

/* ---------------------------------------------- 2. ce que l'écran annonce */

const texte = await page.evaluate(() => document.getElementById('app').innerText);
verifier(texte.includes(enFrancais(PUBLICATION.jour)),
  `l'écran annonce la date de publication (${enFrancais(PUBLICATION.jour)})`);
verifier(texte.includes(PUBLICATION.commit), `et le repère de version (${PUBLICATION.commit})`);

for (const c of CONTENUS) {
  verifier(texte.includes(c.libelle) && texte.includes(enFrancais(c.date)),
    `« ${c.libelle} » est daté du ${enFrancais(c.date)}`);
}
verifier(NOUVEAUTES.every((n) => texte.includes(n.titre)),
  `les ${NOUVEAUTES.length} entrées du journal sont là`);

/* ------------------------- 3. la vérification dit la vérité, dans les trois cas */

const cliquerVerifier = async () => {
  await page.locator('button:has-text("Rechercher une mise à jour")').click();
  await page.waitForTimeout(900);
  return page.evaluate(() => document.getElementById('app').innerText);
};

// a) le serveur a la même version que nous
let apres = await cliquerVerifier();
verifier(/dernière version/i.test(apres), 'même version des deux côtés : « vous avez la dernière version »');
verifier(!/Installer et recharger/.test(apres), 'et aucune invitation à mettre à jour');

// b) le serveur en a une plus récente
await page.route('**/version.json*', (r) => r.fulfill({
  status: 200,
  contentType: 'application/json',
  body: JSON.stringify({ commit: '0000000', date: '2027-01-15T10:00:00+00:00', jour: '2027-01-15' }),
}));
apres = await cliquerVerifier();
verifier(/version plus récente existe/.test(apres), 'version plus récente sur le serveur : elle est annoncée');
verifier(/15 janvier 2027/.test(apres), 'avec sa date de publication');
verifier(/Installer et recharger/.test(apres), 'et le bouton pour l’installer apparaît');

// c) le serveur est injoignable — le cas qui compte le plus : ne pas mentir
await page.unroute('**/version.json*');
await page.route('**/version.json*', (r) => r.abort());
apres = await cliquerVerifier();
verifier(/injoignable/.test(apres), 'serveur injoignable : l’écran le dit');
verifier(!/dernière version/i.test(apres),
  'et ne prétend surtout pas que tout est à jour');
await page.unroute('**/version.json*');

/* ---------------- 4. version.json n'est jamais servi depuis le cache */

/**
 * Le fichier dit ce qu'il y A SUR LE SERVEUR. S'il tombait dans le cache hors
 * ligne, il répondrait éternellement la version qu'on a déjà, et la
 * vérification ne pourrait plus rien détecter — en donnant l'air de marcher.
 */
const ctx2 = await browser.newContext({ viewport: { width: 390, height: 900 }, locale: 'fr-FR' });
const page2 = await ctx2.newPage();
await page2.goto(BASE, { waitUntil: 'networkidle' });
await page2.waitForSelector('#boot', { state: 'hidden' });
await page2.fill('#ob-name', 'Abdellah');
await page2.click('button[type=submit]');
await page2.waitForSelector('.accueil__hero');
// On laisse le service worker s'installer et remplir son cache.
await page2.waitForTimeout(2500);
await page2.goto(`${BASE}#/compte/nouveautes`);
await page2.waitForSelector('button:has-text("Rechercher une mise à jour")');
await page2.locator('button:has-text("Rechercher une mise à jour")').click();
await page2.waitForTimeout(1200);

const cache = await page2.evaluate(async () => {
  if (!('caches' in window)) return { actif: false, entrees: [] };
  const noms = await caches.keys();
  const entrees = [];
  for (const n of noms) {
    const c = await caches.open(n);
    for (const r of await c.keys()) entrees.push(new URL(r.url).pathname);
  }
  return { actif: noms.length > 0, entrees };
});
verifier(cache.actif, `le cache hors ligne est bien en place (${cache.entrees.length} entrées)`);
verifier(!cache.entrees.some((u) => u.endsWith('/version.json')),
  'et version.json n’y figure pas : il est toujours demandé au serveur');
verifier(cache.entrees.some((u) => u.endsWith('/js/data/build.js')),
  'alors que le reste de l’application, lui, est bien mis en cache');

await browser.close();
console.log(erreurs.length ? `\n${erreurs.length} erreur(s) :\n- ${erreurs.join('\n- ')}` : '\nAucune erreur.');
process.exit(erreurs.length ? 1 : 0);
