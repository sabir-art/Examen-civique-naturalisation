/**
 * Un thème compte TOUTES ses questions, d'où qu'elles viennent.
 *
 * Le défaut corrigé ici ne plantait pas, ne s'affichait pas en rouge, et
 * donnait un chiffre parfaitement présentable : « Principes et valeurs — 24 % ».
 * Simplement, ce pourcentage ne portait que sur la banque d'examen. Quarante
 * questions travaillées dans le livret ou dans le récit ne le déplaçaient pas
 * d'un point, et rien à l'écran ne disait pourquoi.
 *
 * Ce contrôle joue donc les trois chemins et exige qu'ils aboutissent au même
 * compteur — tout en vérifiant que l'examen blanc officiel, lui, continue de
 * ne tirer que dans la banque d'examen : sa composition est celle de l'épreuve
 * réelle, elle ne se négocie pas.
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

/** Les tailles des deux ensembles, vues depuis la page. */
const tailles = await page.evaluate(async () => {
  const { poolTheme } = await import('./js/data/banques.js');
  const { pool } = await import('./js/data/questions.js');
  const out = {};
  for (const k of ['principes-valeurs', 'institutions', 'droits-devoirs', 'histoire-geo-culture', 'vivre-societe']) {
    out[k] = { unifie: poolTheme(k).length, examen: pool({ theme: k }).length };
  }
  return out;
});

/* ------------------------------------- 1. ce que la carte du thème annonce */

/**
 * Le nombre affiché sur la carte doit être celui de l'ensemble mesuré. C'est
 * la première chose qu'on lit, et c'est elle qui rend le pourcentage
 * interprétable : « 24 % de quoi ? ».
 */
await page.goto(`${BASE}#/reviser`);
await page.waitForSelector('.ds-theme');
const cartes = await page.$$eval('.ds-theme', (els) => els.map((e) => ({
  titre: e.querySelector('.ds-theme__title')?.textContent?.trim() || '',
  meta: e.querySelector('.ds-theme__meta')?.textContent?.trim() || '',
})));

const carteHisto = cartes.find((c) => /Histoire/.test(c.titre));
verifier(!!carteHisto, `la carte « Histoire & géo » est là (${cartes.length} cartes)`);
// « 0/209 questions vues · 8 tirées à l'examen » : c'est le total qu'on lit ici.
const annonce = parseInt((carteHisto?.meta || '').split('/')[1], 10);
verifier(annonce === tailles['histoire-geo-culture'].unifie,
  `elle annonce les questions des trois banques : ${annonce} (attendu ${tailles['histoire-geo-culture'].unifie}, banque d'examen seule ${tailles['histoire-geo-culture'].examen})`);
verifier(tailles['histoire-geo-culture'].unifie > tailles['histoire-geo-culture'].examen,
  'et cet ensemble est bien plus large que la seule banque d’examen');

/* ------------------------ 2. répondre dans le récit compte dans le thème */

/** « 24 % · 12/209 vues » sur l'écran Progrès. */
async function vues(nom) {
  await page.goto(`${BASE}#/`);
  await page.waitForTimeout(200);
  await page.goto(`${BASE}#/progres`);
  await page.waitForSelector('.themestat__row');
  return page.evaluate((n) => {
    const ligne = [...document.querySelectorAll('.themestat__row')]
      .find((r) => r.querySelector('.themestat__name')?.textContent.includes(n));
    const t = ligne?.querySelector('.themestat__val')?.textContent || '';
    const m = t.match(/(\d+)\s*%.*?(\d+)\s*\/\s*(\d+)/);
    return m ? { pct: +m[1], vues: +m[2], total: +m[3] } : null;
  }, nom);
}

const avant = await vues('Histoire');
verifier(avant && avant.total === tailles['histoire-geo-culture'].unifie,
  `l'écran Progrès compte le même ensemble (${avant?.total})`);
verifier(avant && avant.vues === 0, `rien de vu pour l'instant (${avant?.vues})`);

// Le chapitre 1 du récit — Alésia — traite d'histoire ; ses quatre questions
// doivent donc apparaître dans le compteur du thème « Histoire et géographie ».
await page.goto(`${BASE}#/histoire/c/ch01`);
await page.waitForTimeout(300);
await page.goto(`${BASE}#/histoire/q/ch01`);
await page.waitForSelector('.ds-qcard__q');
let jouees = 0;
for (let garde = 0; garde < 10; garde += 1) {
  if (!(await page.locator('.ds-qcard__q').count())) break;
  await page.locator('.ds-answer').first().click();
  await page.click('button:has-text("Valider")');
  jouees += 1;
  await page.waitForTimeout(180);
  const suite = page.locator('button:has-text("Question suivante"), button:has-text("Terminer")');
  if (!(await suite.count())) break;
  await suite.first().click();
  await page.waitForTimeout(280);
}

const apres = await vues('Histoire');
verifier(jouees >= 4, `le chapitre a bien été joué (${jouees} questions)`);
verifier(apres && apres.vues === jouees,
  `les questions du récit comptent dans le thème : ${apres?.vues} vues après en avoir répondu ${jouees}`);

/* -------------- 2 bis. et l'écran du thème le montre, section par section */

/**
 * « Je ne sais pas combien de questions j'ai déjà répondu dans chaque thème. »
 * Le pourcentage de maîtrise ne le dit pas — il monte par paliers de plusieurs
 * jours —, et le total du thème non plus. Ce décompte-là doit être écrit.
 */
await page.goto(`${BASE}#/`);
await page.goto(`${BASE}#/reviser`);
await page.waitForSelector('.ds-theme__meta');
const metas = await page.$$eval('.ds-theme', (els) => els.map((e) => ({
  titre: e.querySelector('.ds-theme__title')?.textContent?.trim() || '',
  meta: e.querySelector('.ds-theme__meta')?.textContent?.trim() || '',
})));
const metaHisto = metas.find((m) => /Histoire/.test(m.titre))?.meta || '';
verifier(metaHisto.startsWith(`${jouees}/${tailles['histoire-geo-culture'].unifie} questions vues`),
  `la carte du thème dit ce qui est fait, pas seulement sa taille (« ${metaHisto} »)`);

await page.goto(`${BASE}#/reviser/t/histoire-geo-culture`);
await page.waitForSelector('.card__title');
const detail = await page.evaluate(() => document.getElementById('app').innerText);
verifier(/Où vous en êtes/.test(detail), 'l’écran du thème ouvre sur « où vous en êtes »');
verifier(new RegExp(`La France racontée\\s*${jouees}/48`).test(detail),
  `il attribue les réponses à la bonne section (récit : ${jouees}/48)`);
verifier(/Banque d'examen\s*0\/76/.test(detail),
  "et laisse la banque d'examen à zéro : on n'y a pas répondu");

/* ---------------------- 3. et répondre dans le livret aussi */

const avantP = await vues('Principes');
await page.goto(`${BASE}#/livret/c/p1-i`);
await page.waitForTimeout(300);
await page.goto(`${BASE}#/livret/q/p1-i`);
await page.waitForSelector('.ds-qcard__q');
/* Jusqu'au bout : une séance abandonnée en chemin garde la main sur la
   navigation, et l'écran Progrès resterait hors d'atteinte. */
let jouees2 = 0;
for (let garde = 0; garde < 30; garde += 1) {
  if (!(await page.locator('.ds-qcard__q').count())) break;
  await page.locator('.ds-answer').first().click();
  await page.click('button:has-text("Valider")');
  jouees2 += 1;
  await page.waitForTimeout(180);
  const suite = page.locator('button:has-text("Question suivante"), button:has-text("Terminer")');
  if (!(await suite.count())) break;
  await suite.first().click();
  await page.waitForTimeout(280);
}
const apresP = await vues('Principes');
verifier(jouees2 >= 3, `un chapitre du livret a été joué (${jouees2} questions)`);
verifier(apresP && apresP.vues - (avantP?.vues || 0) === jouees2,
  `les questions du livret comptent dans leur thème : +${apresP && apresP.vues - (avantP?.vues || 0)} pour ${jouees2} répondues`);

/* ------------------- 4. la barre de maîtrise monte, pas seulement le vu */

/**
 * « Vues » et « maîtrise » sont deux compteurs différents, et c'est le second
 * que l'utilisateur regarde. On répond juste à toutes les questions du récit
 * et du livret d'un thème — directement dans le stockage, jouer soixante-six
 * quiz à la main n'apprendrait rien de plus — et la barre doit bouger.
 */
const pose = await page.evaluate(async () => {
  const { poolTheme } = await import('./js/data/banques.js');
  const cibles = poolTheme('vivre-societe').filter((q) => q.source);
  const brut = JSON.parse(localStorage.getItem('examen-civique.v1'));
  for (const prof of Object.values(brut.profiles)) {
    for (const q of cibles) {
      prof.progress[q.id] = {
        box: 6, seen: 3, ok: 3, ko: 0, lastOk: true, last: Date.now(), due: Date.now() + 86400000,
      };
    }
  }
  localStorage.setItem('examen-civique.v1', JSON.stringify(brut));
  return cibles.length;
});
await page.reload({ waitUntil: 'networkidle' });

const vs = await vues('Vie en société');
const attendu = Math.round((pose / tailles['vivre-societe'].unifie) * 100);
verifier(pose > 0, `${pose} questions du livret et du récit posées comme acquises`);
verifier(vs && vs.pct === attendu,
  `la maîtrise du thème en tient compte : ${vs?.pct} % (attendu ${attendu} %)`);
verifier(vs && vs.pct > 0, 'elle a quitté zéro sans qu’une seule question d’examen soit touchée');

/* ------------- 5. la séance du thème travaille le même ensemble */

const seance = await page.evaluate(async () => {
  const { buildTraining } = await import('./js/engine.js');
  const cartes = buildTraining({ mode: 'theme', theme: 'histoire-geo-culture', count: 40 });
  return {
    n: cartes.length,
    sources: [...new Set(cartes.map((c) => c.q.source || 'examen'))].sort(),
  };
});
verifier(seance.n === 40, `la séance du thème tire ses questions (${seance.n})`);
verifier(seance.sources.length > 1,
  `elle puise dans les trois banques, comme la barre qu'elle fait monter (${seance.sources.join(', ')})`);

/* ------------- 6. mais l'examen blanc officiel ne change pas d'un iota */

const examen = await page.evaluate(async () => {
  const { buildExam } = await import('./js/engine.js');
  const cartes = buildExam();
  return {
    n: cartes.length,
    intrus: cartes.filter((c) => c.q.source).map((c) => c.q.id),
  };
});
verifier(examen.n === 40, `l'examen blanc officiel fait toujours 40 questions (${examen.n})`);
verifier(examen.intrus.length === 0,
  `et il ne tire que dans la banque d'examen (${examen.intrus.length} intrus : ${examen.intrus.slice(0, 3).join(', ')})`);

await browser.close();
console.log(erreurs.length ? `\n${erreurs.length} erreur(s) :\n- ${erreurs.join('\n- ')}` : '\nAucune erreur.');
process.exit(erreurs.length ? 1 : 0);
