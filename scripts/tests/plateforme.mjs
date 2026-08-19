/**
 * Le verre d'iOS, et seulement sur les appareils qui l'ont.
 *
 * Depuis iOS 26, les barres d'onglets natives sont en « Liquid Glass ». Une
 * page web n'a pas accès à ce matériau du système, mais `backdrop-filter` en
 * produit l'optique : sur un iPhone, la barre appartient alors à la même
 * famille que celles du système ; sur Android, elle reste pleine, comme les
 * barres de ce système-là.
 *
 * Le risque de cette adaptation est connu et il est unique : un matériau
 * translucide prend la couleur de ce qui passe dessous. Une barre trop
 * transparente devient illisible au-dessus d'une photo claire — et ce n'est
 * visible qu'à cet endroit-là, sur cette photo-là. Le contrôle ne se contente
 * donc pas de regarder l'écran : il calcule le contraste dans les DEUX pires
 * cas, verre posé sur du noir et verre posé sur du blanc.
 */
import pw from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pw;

const BASE = 'http://127.0.0.1:8099/';
const erreurs = [];
const ok = (m) => console.log(`  ok  ${m}`);
const ko = (m) => { erreurs.push(m); console.log(`  KO  ${m}`); };
const verifier = (cond, m) => (cond ? ok(m) : ko(m));

/* ------------------------------------------------- 1. la reconnaissance */

const { estApple } = await import('../../js/lib/plateforme.js');

await (async () => {
  const cas = [
    [{ vendor: 'Apple Computer, Inc.' }, true, 'Safari, Chrome ou Firefox sur iPhone (tous WebKit)'],
    [{ vendor: 'Google Inc.' }, false, 'Chrome sur Android'],
    [{ vendor: '' }, false, 'Firefox de bureau'],
    [null, false, 'aucun navigateur (rendu hors ligne, tests)'],
  ];
  for (const [nav, attendu, quoi] of cas) {
    verifier(estApple(nav) === attendu, `${quoi} → ${attendu ? 'verre' : 'barre pleine'}`);
  }
})();

/* --------------------------------------------- 2. ce que donne la page */

const browser = await chromium.launch();

/** Lit la barre du bas telle que le navigateur la calcule. */
async function barre(page, plateforme, theme) {
  await page.evaluate(([p, t]) => {
    document.documentElement.dataset.plateforme = p;
    if (t) document.documentElement.dataset.theme = t;
  }, [plateforme, theme]);
  await page.waitForTimeout(120);
  return page.evaluate(() => {
    const bar = document.querySelector('.ds-bottomnav__bar');
    const onglet = document.querySelector('.ds-bottomnav__tab:not([aria-current])');
    const actif = document.querySelector('.ds-bottomnav__tab[aria-current="page"]');
    const cs = getComputedStyle(bar);
    return {
      fond: cs.backgroundColor,
      flou: cs.backdropFilter || cs.webkitBackdropFilter || 'none',
      ombre: cs.boxShadow,
      texte: getComputedStyle(onglet).color,
      texteActif: getComputedStyle(actif).color,
    };
  });
}

const lire = (c) => (c.match(/[\d.]+/g) || []).map(Number);
const lum = (rgb) => {
  const [r, g, b] = rgb.slice(0, 3).map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contraste = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
};
/** Le verre posé sur un fond donné : c'est ce que l'œil voit vraiment. */
const sur = (verre, fond) => {
  const [r, g, b, a = 1] = lire(verre);
  return [0, 1, 2].map((i) => a * [r, g, b][i] + (1 - a) * fond[i]);
};

const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, locale: 'fr-FR' });
const page = await ctx.newPage();
page.on('pageerror', (e) => ko(`erreur JS : ${e.message}`));
await page.goto(BASE, { waitUntil: 'networkidle' });
await page.waitForSelector('#boot', { state: 'hidden' });
await page.fill('#ob-name', 'Abdellah');
await page.click('button[type=submit]');
await page.waitForSelector('.accueil__hero');

const pose = await page.evaluate(() => document.documentElement.dataset.plateforme);
verifier(pose === 'apple' || pose === 'autre', `la plateforme est inscrite sur la page (« ${pose} »)`);

const autre = await barre(page, 'autre', 'light');
verifier(autre.flou === 'none', `hors Apple, aucun flou : la barre reste pleine (${autre.flou})`);
verifier(lire(autre.fond).length === 3 || lire(autre.fond)[3] === 1,
  `et son fond est opaque (${autre.fond})`);

for (const theme of ['light', 'dark']) {
  const v = await barre(page, 'apple', theme);
  const alpha = lire(v.fond)[3];
  verifier(/blur/.test(v.flou), `thème ${theme} : le verre floute ce qui passe dessous (${v.flou})`);
  verifier(alpha !== undefined && alpha < 0.95, `thème ${theme} : et il est translucide (${alpha})`);
  verifier(/inset/.test(v.ombre), `thème ${theme} : le liseré de lumière est là`);

  // Les deux extrêmes : la barre au-dessus d'une photo noire, puis d'une page
  // blanche. Si le texte tient dans ces deux cas, il tient partout entre.
  for (const [nom, fond] of [['une photo noire', [0, 0, 0]], ['une page blanche', [255, 255, 255]]]) {
    const derriere = sur(v.fond, fond);
    for (const [quoi, couleur] of [['libellé', v.texte], ['onglet courant', v.texteActif]]) {
      // L'onglet courant a sa propre pastille, elle-même translucide : on la
      // compose sur le verre, qui est lui-même composé sur le fond.
      const r = contraste(lire(couleur), derriere);
      verifier(r >= 4.5, `thème ${theme}, sur ${nom} : ${quoi} lisible (${r.toFixed(2)}:1)`);
    }
  }
}

await browser.close();
console.log(erreurs.length ? `\n${erreurs.length} erreur(s) :\n- ${erreurs.join('\n- ')}` : '\nAucune erreur.');
process.exit(erreurs.length ? 1 : 0);
