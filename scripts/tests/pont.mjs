/**
 * L'abstraction de plateforme : une interface, trois matériaux.
 *
 * Dans une coque native, la barre d'onglets n'est pas dessinée par la page —
 * c'est le système qui la rend, avec son propre matériau. La page ne doit donc
 * plus dessiner la sienne, mais elle doit continuer de router : le greffon
 * signale un appui, il ne navigue pas.
 *
 * Le code Swift et Kotlin ne peut pas être compilé ici. Ce qui peut l'être, et
 * qui est éprouvé, c'est TOUT LE CÔTÉ PAGE : la reconnaissance de l'hôte, la
 * disparition de la barre en CSS, la navigation déclenchée par le système, la
 * hauteur réservée — et surtout l'inverse, qu'un navigateur ordinaire ne voie
 * jamais rien de tout cela.
 */
import pw from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pw;

const BASE = 'http://127.0.0.1:8099/';
const erreurs = [];
const ok = (m) => console.log(`  ok  ${m}`);
const ko = (m) => { erreurs.push(m); console.log(`  KO  ${m}`); };
const verifier = (cond, m) => (cond ? ok(m) : ko(m));

/* ------------------------------------------- 1. la reconnaissance de l'hôte */

const { hoteNatif, barreDeleguee } = await import('../../js/lib/pont-natif.js');

const faux = (plateforme, avecGreffon = true) => ({
  Capacitor: {
    isNativePlatform: () => true,
    getPlatform: () => plateforme,
    Plugins: avecGreffon ? { BarreSysteme: {} } : {},
  },
});

verifier(hoteNatif({}) === null, 'un navigateur ordinaire : aucun hôte natif');
verifier(hoteNatif(faux('ios')) === 'ios', 'coque iOS reconnue');
verifier(hoteNatif(faux('android')) === 'android', 'coque Android reconnue');
verifier(barreDeleguee(faux('ios')) === true, 'la barre est confiée au système quand le greffon est là');
verifier(barreDeleguee(faux('ios', false)) === false,
  'mais pas si la coque est plus ancienne que le greffon : mieux vaut la barre de la page qu’aucune barre');

/* ------------------------------------------------- 2. la page dans la coque */

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, locale: 'fr-FR' });
const page = await ctx.newPage();
page.on('pageerror', (e) => ko(`erreur JS : ${e.message}`));

/* Un faux hôte natif, installé AVANT le premier script de la page : c'est
   ainsi que Capacitor s'annonce, et l'application le lit au démarrage. */
await page.addInitScript(() => {
  const ecoutes = {};
  window.__natif = { affichages: [], selections: [] };
  window.Capacitor = {
    isNativePlatform: () => true,
    getPlatform: () => 'ios',
    Plugins: {
      BarreSysteme: {
        addListener: async (nom, fn) => { ecoutes[nom] = fn; },
        afficher: async (o) => { window.__natif.affichages.push(o); },
        selectionner: async (o) => { window.__natif.selections.push(o.actif); },
        hauteur: async () => ({ hauteur: 83 }),
        masquer: async () => {},
      },
    },
  };
  // Ce que fait le système quand le doigt touche un onglet.
  window.__appuyerSurOnglet = (valeur) => ecoutes.ongletChoisi?.({ value: valeur });
});

await page.goto(BASE, { waitUntil: 'networkidle' });
await page.waitForSelector('#boot', { state: 'hidden' });
await page.fill('#ob-name', 'Abdellah');
await page.click('button[type=submit]');
await page.waitForSelector('.accueil__hero');
await page.waitForTimeout(600);

const etat = await page.evaluate(() => ({
  marque: document.documentElement.dataset.barre || null,
  barreCss: document.querySelectorAll('.ds-bottomnav__bar').length,
  hauteur: getComputedStyle(document.documentElement).getPropertyValue('--tabbar-h').trim(),
  affichages: window.__natif.affichages,
}));

verifier(etat.marque === 'systeme', `la page note que la barre est au système (${etat.marque})`);
verifier(etat.barreCss === 0, `et ne dessine plus la sienne (${etat.barreCss} barre en CSS)`);
verifier(etat.hauteur === '83px', `elle réserve la hauteur annoncée par le système (${etat.hauteur})`);
verifier(etat.affichages.length === 1, 'la barre du système a été demandée une fois');
const demande = etat.affichages[0];
verifier(demande?.onglets?.length === 5, `avec les cinq onglets (${demande?.onglets?.length})`);
verifier(demande?.onglets?.every((o) => o.label && o.value),
  'chacun avec son intitulé et sa destination');
verifier(demande?.onglets?.[0]?.sfSymbol === 'house',
  `et son glyphe du système, pas celui de la page (${demande?.onglets?.[0]?.sfSymbol})`);

/* ------------------- 2 bis. et le cache hors ligne s'efface devant l'App Store */

const worker = await page.evaluate(async () => {
  const regs = await navigator.serviceWorker.getRegistrations();
  return regs.length;
});
verifier(worker === 0,
  `dans la coque, aucun service worker : c'est l'App Store qui met à jour (${worker})`);

/* -------------------------------- 3. le système signale, la page navigue */

await page.evaluate(() => window.__appuyerSurOnglet('/reviser'));
await page.waitForTimeout(500);
verifier((await page.evaluate(() => location.hash)) === '#/reviser',
  'un appui sur la barre du système fait naviguer l’application');

await page.evaluate(() => window.__appuyerSurOnglet('/progres'));
await page.waitForTimeout(500);
verifier((await page.evaluate(() => location.hash)) === '#/progres', 'et de nouveau, sur un autre onglet');

// Quand la page navigue seule, elle doit dire au système quel onglet éclairer.
await page.goto(`${BASE}#/histoire`);
await page.waitForTimeout(500);
const dernier = await page.evaluate(() => window.__natif.selections.at(-1));
verifier(dernier === '/histoire', `la page tient le système au courant de l'onglet courant (${dernier})`);

/* --------------------------- 4. et rien de tout cela dans un navigateur */

const ctx2 = await browser.newContext({ viewport: { width: 390, height: 844 }, locale: 'fr-FR' });
const page2 = await ctx2.newPage();
page2.on('pageerror', (e) => ko(`erreur JS (navigateur) : ${e.message}`));
await page2.goto(BASE, { waitUntil: 'networkidle' });
await page2.waitForSelector('#boot', { state: 'hidden' });
await page2.fill('#ob-name', 'Abdellah');
await page2.click('button[type=submit]');
await page2.waitForSelector('.accueil__hero');
await page2.waitForTimeout(400);

const sansCoque = await page2.evaluate(() => ({
  marque: document.documentElement.dataset.barre || null,
  barreCss: document.querySelectorAll('.ds-bottomnav__bar').length,
}));
verifier(sansCoque.marque === null, 'sans coque, aucune marque sur la page');
verifier(sansCoque.barreCss === 1, `et la barre de la page est bien là (${sansCoque.barreCss})`);
await page2.click('.ds-bottomnav__tab >> nth=2');
await page2.waitForTimeout(400);
verifier((await page2.evaluate(() => location.hash)) === '#/reviser',
  'elle navigue toujours, exactement comme avant');

await browser.close();
console.log(erreurs.length ? `\n${erreurs.length} erreur(s) :\n- ${erreurs.join('\n- ')}` : '\nAucune erreur.');
process.exit(erreurs.length ? 1 : 0);
