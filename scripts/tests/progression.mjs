/**
 * Avancement d'un chapitre du récit.
 *
 * Le défaut corrigé ici est de ceux qui ne plantent jamais : la barre sous un
 * chapitre affichait la MÉMORISATION, qui ne peut pas dépasser 20 % en une
 * séance — chaque palier impose d'attendre un jour, puis trois, puis sept.
 * On lisait le chapitre, on répondait juste à tout, et la barre restait rouge
 * et presque vide. Rien ne signalait que les deux chiffres ne mesuraient pas
 * la même chose.
 *
 * Ce contrôle joue donc un chapitre pour de vrai, jusqu'à ce que toutes les
 * réponses soient justes, et exige que la barre soit pleine à la fin.
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
await page.waitForSelector('.greet__hello');

/** État affiché d'un chapitre dans la liste de son acte. */
async function etatDansActe(acte, rang) {
  await page.goto(`${BASE}#/histoire/a/${acte}`);
  await page.waitForTimeout(600);
  return page.evaluate((i) => {
    const it = document.querySelectorAll('.item')[i];
    if (!it) return null;
    const fill = it.querySelector('.bar__fill');
    return {
      lignes: [...it.querySelectorAll('.item__sub')].map((e) => e.textContent),
      badge: it.querySelector('.badge')?.textContent || null,
      largeur: fill ? parseInt(fill.style.width, 10) : 0,
      vert: !!it.querySelector('.bar__fill--ok'),
    };
  }, rang);
}

/**
 * Joue le quiz d'un chapitre. Au premier passage on relève la bonne réponse
 * de chaque question ; au second on la choisit. C'est le seul moyen fiable :
 * les propositions sont mélangées à chaque tirage.
 */
/**
 * Ouvre le quiz d'un chapitre.
 * On passe TOUJOURS par le chapitre d'abord : aller deux fois de suite à la
 * même adresse ne déclenche aucun changement de fragment, donc aucun rendu —
 * l'écran de résultats resterait affiché.
 */
async function ouvrirQuiz(chapitre) {
  await page.goto(`${BASE}#/histoire/c/${chapitre}`);
  await page.waitForTimeout(350);
  await page.goto(`${BASE}#/histoire/q/${chapitre}`);
  await page.waitForSelector('.qtext');
}

async function jouer(chapitre, { juste }) {
  await ouvrirQuiz(chapitre);
  const bonnes = [];

  for (let garde = 0; garde < 12; garde += 1) {
    if (!(await page.locator('.qtext').count())) break;

    if (juste) {
      // On coche, on valide, et si c'est faux on note la bonne pour plus tard.
      const textes = await page.$$eval('.choice__text', (e) => e.map((x) => x.textContent));
      const attendu = bonnes.shift();
      const i = attendu ? Math.max(0, textes.indexOf(attendu)) : 0;
      await page.locator('.choice').nth(i).click();
    } else {
      await page.locator('.choice').first().click();
    }

    await page.click('button:has-text("Valider")');
    await page.waitForTimeout(200);
    const bonne = await page.$eval('.choice.is-correct .choice__text', (e) => e.textContent).catch(() => null);
    if (bonne) bonnes.push(bonne);

    const suite = page.locator('button:has-text("Question suivante"), button:has-text("Terminer")');
    if (!(await suite.count())) break;
    await suite.first().click();
    await page.waitForTimeout(300);
  }
  return bonnes;
}

/* ------------------------------------------------ 1. chapitre pas commencé */

let e = await etatDansActe('acte-1', 0);
verifier(e && e.largeur === 0, `un chapitre jamais ouvert n'affiche aucune barre (${e?.largeur} %)`);
verifier(e && e.badge === null, 'ni badge');

/* ------------------------------------------------------- 2. après lecture */

await page.goto(`${BASE}#/histoire/c/ch01`);
await page.waitForTimeout(700);
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await page.waitForTimeout(600);

e = await etatDansActe('acte-1', 0);
verifier(e.badge === 'Lu', `après lecture, le chapitre est marqué « Lu » (${e.badge})`);
verifier(e.largeur === 40, `la barre montre la part faite : la lecture (${e.largeur} %)`);
verifier(!e.vert, 'mais elle n’est pas encore verte');

/* -------------------------- 3. une séance complète doit remplir la barre */

// Premier passage : on relève les bonnes réponses.
const bonnes = await jouer('ch01', { juste: false });
verifier(bonnes.length >= 4, `les bonnes réponses ont été relevées (${bonnes.length})`);

// Second passage : on répond juste à tout.
await ouvrirQuiz('ch01');
let restantes = [...bonnes];
for (let garde = 0; garde < 12; garde += 1) {
  if (!(await page.locator('.qtext').count())) break;
  const textes = await page.$$eval('.choice__text', (x) => x.map((y) => y.textContent));
  const i = textes.findIndex((t) => restantes.includes(t));
  await page.locator('.choice').nth(i >= 0 ? i : 0).click();
  if (i >= 0) restantes = restantes.filter((t) => t !== textes[i]);
  await page.click('button:has-text("Valider")');
  await page.waitForTimeout(180);
  const suite = page.locator('button:has-text("Question suivante"), button:has-text("Terminer")');
  if (!(await suite.count())) break;
  await suite.first().click();
  await page.waitForTimeout(280);
}

e = await etatDansActe('acte-1', 0);
verifier(e.largeur === 100,
  `après avoir lu ET répondu juste à tout, la barre est pleine (${e.largeur} %)`);
verifier(e.vert, 'et elle est verte');
verifier(e.badge === 'Terminé', `le badge dit « Terminé » (${e.badge})`);
verifier(e.lignes.some((l) => /Chapitre terminé/.test(l)),
  `l'état est écrit en toutes lettres (${e.lignes.slice(-1)[0]})`);

/* ------------------------ 4. la mémorisation est expliquée, pas subie */

await page.goto(`${BASE}#/histoire/c/ch01`);
await page.waitForTimeout(700);
const mem = await page.evaluate(() => {
  const c = [...document.querySelectorAll('.card--info')].find((x) => /Mémorisation/.test(x.textContent));
  if (!c) return null;
  return {
    pct: parseInt(c.querySelector('.badge').textContent, 10),
    texte: c.querySelector('.hint').textContent,
    rouge: !!c.querySelector('.badge--bad, .bar__fill--bad'),
  };
});
verifier(mem !== null, 'le chapitre explique séparément la mémorisation');
// L'invariant qui compte : le chapitre est à 100 %, la mémorisation non. Les
// paliers sont espacés de jours ; aucune quantité de révision dans la même
// journée ne peut la remplir. C'est précisément ce que l'affichage doit dire
// au lieu de laisser croire à un compteur bloqué.
verifier(mem && mem.pct > 0 && mem.pct < 100,
  `le chapitre est terminé mais la mémorisation reste en cours (${mem?.pct} %) — c'est sa nature, pas un bug`);
verifier(mem && /n'est pas l'avancement/.test(mem.texte), 'et le dit explicitement');
verifier(mem && /1 jour, puis 3, puis 7/.test(mem.texte), 'en donnant les délais réels');
verifier(mem && /revoir/.test(mem.texte), 'et la date de la prochaine revue');
verifier(mem && !mem.rouge, 'elle n’est pas peinte en rouge : on n’a rien fait de mal');

/* --------------------------- 5. le sommaire ne mélange plus les deux */

await page.goto(`${BASE}#/histoire`);
await page.waitForTimeout(600);
const som = await page.evaluate(() => ({
  labels: [...document.querySelectorAll('.kpi__lab')].map((e) => e.textContent),
  valeurs: [...document.querySelectorAll('.kpi__val')].map((e) => e.textContent),
  explique: [...document.querySelectorAll('.hint')].some((e) => /mémorisation/i.test(e.textContent)),
}));
verifier(som.labels.includes('chapitres terminés'),
  `le sommaire compte les chapitres terminés (${som.labels.join(', ')})`);
verifier(som.valeurs[0].startsWith('1/'), `et il en compte bien un (${som.valeurs[0]})`);
verifier(som.explique, 'et il explique la différence entre les deux chiffres');

await browser.close();
console.log(erreurs.length ? `\n${erreurs.length} erreur(s).` : '\nAucune erreur.');
process.exit(erreurs.length ? 1 : 0);
