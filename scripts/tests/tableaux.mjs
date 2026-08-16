/**
 * Les tableaux d'enquête.
 *
 * Ce qu'on vérifie tient en une phrase : un mur qui relie des faits doit les
 * relier JUSTE. Une ficelle lue depuis l'autre bout doit changer de
 * formulation — sans quoi le tableau enseigne que la monarchie a fait tomber
 * la Bastille — et toute fiche qui renvoie à un chapitre doit renvoyer à un
 * chapitre qui existe.
 *
 * Le reste porte sur le geste : appuyer sur une fiche éteint le mur autour
 * d'elle, et arriver depuis un chapitre allume la bonne fiche.
 */
import pw from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pw;
const BASE = 'http://127.0.0.1:8099/';
const SHOT = './scripts/tests/captures';
const errors = [];
const step = async (n, f) => { try { await f(); console.log(`  ok  ${n}`); } catch (e) { console.log(`  FAIL ${n}: ${e.message}`); errors.push(`${n}: ${e.message}`); } };

/* ------------------------------------------------ 1. la matière elle-même */

const { TABLEAUX, liensDe } = await import('../../js/data/tableaux.js');
const { CHAPITRE_BY_KEY } = await import('../../js/data/roman.js');
const { THEMES } = await import('../../js/data/programme.js');

await step('chaque tableau a des fiches, des ficelles et un thème connu', async () => {
  for (const t of TABLEAUX) {
    if (!t.noeuds.length) throw new Error(`${t.key} n'a aucune fiche`);
    if (!t.liens.length) throw new Error(`${t.key} n'a aucune ficelle`);
    if (!THEMES[t.theme]) throw new Error(`${t.key} renvoie au thème inconnu « ${t.theme} »`);
  }
});

await step('aucune ficelle ne pend dans le vide', async () => {
  for (const t of TABLEAUX) {
    const ids = new Set(t.noeuds.map((n) => n.id));
    for (const l of t.liens) {
      if (!ids.has(l.de)) throw new Error(`${t.key} : ficelle partant de « ${l.de} », fiche inexistante`);
      if (!ids.has(l.vers)) throw new Error(`${t.key} : ficelle arrivant à « ${l.vers} », fiche inexistante`);
      if (l.de === l.vers) throw new Error(`${t.key} : ficelle de « ${l.de} » vers elle-même`);
    }
  }
});

await step('aucun identifiant de fiche en double', async () => {
  for (const t of TABLEAUX) {
    const vus = new Set();
    for (const n of t.noeuds) {
      if (vus.has(n.id)) throw new Error(`${t.key} : deux fiches portent l'identifiant « ${n.id} »`);
      vus.add(n.id);
    }
  }
});

/* C'est le contrôle qui compte : une relation lue à l'envers ment. */
await step('une ficelle lue depuis l’autre bout change de formulation', async () => {
  for (const t of TABLEAUX) {
    for (const l of t.liens) {
      if (!l.inverse) throw new Error(`${t.key} : « ${l.relation} » n'a pas de formulation inverse`);
      if (l.inverse === l.relation) {
        throw new Error(`${t.key} : « ${l.relation} » se lit pareil dans les deux sens — depuis l'autre fiche, la phrase dit le contraire de la vérité`);
      }
      const depuisDepart = liensDe(t, l.de).find((x) => x.autre === l.vers);
      const depuisArrivee = liensDe(t, l.vers).find((x) => x.autre === l.de);
      if (depuisDepart.relation !== l.relation) throw new Error(`${t.key} : mauvaise formulation au départ`);
      if (depuisArrivee.relation !== l.inverse) throw new Error(`${t.key} : mauvaise formulation à l'arrivée`);
    }
  }
});

await step('chaque renvoi vers un chapitre pointe sur un chapitre qui existe', async () => {
  for (const t of TABLEAUX) {
    for (const n of t.noeuds) {
      if (n.chapitre && !CHAPITRE_BY_KEY.get(n.chapitre)) {
        throw new Error(`${t.key}/${n.id} renvoie au chapitre inconnu « ${n.chapitre} »`);
      }
    }
  }
});

await step('chaque fiche est datée et résumée', async () => {
  for (const t of TABLEAUX) {
    for (const n of t.noeuds) {
      if (!n.quand || !n.quand.trim()) throw new Error(`${t.key}/${n.id} n'est pas datée`);
      if (!n.resume || n.resume.length < 40) throw new Error(`${t.key}/${n.id} n'a pas de résumé digne de ce nom`);
      if (!n.titre) throw new Error(`${t.key}/${n.id} n'a pas de titre`);
    }
  }
});

/* ------------------------------------------------------ 2. le mur à l'écran */

const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 393, height: 734 }, deviceScaleFactor: 2, locale: 'fr-FR' });
const p = await ctx.newPage();
p.on('pageerror', (e) => errors.push(e.message));
await p.goto(BASE, { waitUntil: 'networkidle' });
await p.fill('#ob-name', 'Abdellah'); await p.click('button[type=submit]');
await p.waitForSelector('.accueil__hero');

await step('les trois murs sont accessibles depuis le récit', async () => {
  await p.goto(BASE + '#/histoire');
  await p.waitForTimeout(500);
  if (!(await p.locator('a[href="#/tableaux"]').count())) throw new Error('pas de lien depuis le sommaire du récit');
  await p.goto(BASE + '#/tableaux');
  await p.waitForTimeout(500);
  const liens = await p.locator('a[href^="#/tableaux/"]').count();
  if (liens !== TABLEAUX.length) throw new Error(`${liens} murs proposés au lieu de ${TABLEAUX.length}`);
});

for (const t of TABLEAUX) {
  await step(`« ${t.titre} » : toutes les fiches et toutes les ficelles sont dessinées`, async () => {
    await p.goto(BASE + `#/tableaux/${t.key}`);
    await p.waitForSelector('.fiche');
    await p.waitForTimeout(700);
    const vu = await p.evaluate(() => ({
      fiches: document.querySelectorAll('.fiche').length,
      fils: document.querySelectorAll('.mur__fils .fil').length,
      arcs: document.querySelectorAll('.mur__fils .arc').length,
      ficelles: document.querySelectorAll('.ficelle').length,
    }));
    if (vu.fiches !== t.noeuds.length) throw new Error(`${vu.fiches} fiches au lieu de ${t.noeuds.length}`);
    if (vu.fils !== t.noeuds.length - 1) throw new Error(`${vu.fils} segments de fil au lieu de ${t.noeuds.length - 1}`);
    if (vu.arcs !== t.liens.length) throw new Error(`${vu.arcs} arcs tracés au lieu de ${t.liens.length}`);
    // Chaque ficelle est écrite aux deux bouts : le dessin ne porte rien seul.
    if (vu.ficelles !== t.liens.length * 2) {
      throw new Error(`${vu.ficelles} ficelles écrites au lieu de ${t.liens.length * 2} — le tracé serait la seule source`);
    }
  });

  await step(`« ${t.titre} » : le mur ne déborde pas de l’écran`, async () => {
    const large = await p.evaluate(() => ({
      page: document.documentElement.scrollWidth,
      ecran: window.innerWidth,
    }));
    if (large.page > large.ecran + 1) throw new Error(`la page déborde : ${large.page} pour ${large.ecran}`);
  });

  await step(`« ${t.titre} » : les ficelles restent dans la gouttière, jamais sur le texte`, async () => {
    const debords = await p.evaluate(() => {
      const mur = document.querySelector('.mur');
      const boite = mur.getBoundingClientRect();
      const gouttiere = parseFloat(getComputedStyle(mur).paddingLeft);
      const out = [];
      for (const chemin of document.querySelectorAll('.mur__fils path')) {
        const b = chemin.getBBox();
        if (b.x < -2) out.push(`un fil sort du mur à gauche (${Math.round(b.x)})`);
        if (b.x + b.width > gouttiere + 2) out.push(`un fil passe sous le texte (${Math.round(b.x + b.width)} > ${Math.round(gouttiere)})`);
      }
      return { out: out.slice(0, 3), gouttiere, largeur: boite.width };
    });
    if (debords.out.length) throw new Error(debords.out.join(' ; '));
  });
}

await step('appuyer sur une fiche éteint le mur autour d’elle', async () => {
  await p.goto(BASE + '#/tableaux/regimes');
  await p.waitForSelector('.fiche');
  await p.waitForTimeout(600);
  await p.locator('#fiche-bastille').click();
  await p.waitForTimeout(300);
  const etat = await p.evaluate(() => ({
    tire: document.querySelector('.mur').classList.contains('mur--tire'),
    tenue: document.querySelectorAll('.fiche--tenue').length,
    liees: document.querySelectorAll('.fiche--liee').length,
    eteinte: getComputedStyle(document.querySelector('#fiche-republique-4')).opacity,
    allumee: getComputedStyle(document.querySelector('#fiche-bastille')).opacity,
  }));
  if (!etat.tire) throw new Error('le mur ne réagit pas');
  if (etat.tenue !== 1) throw new Error(`${etat.tenue} fiche(s) tenue(s)`);
  if (etat.liees < 1) throw new Error('aucune fiche reliée mise en avant');
  if (parseFloat(etat.eteinte) >= parseFloat(etat.allumee)) {
    throw new Error(`les fiches sans rapport ne s'effacent pas (${etat.eteinte} contre ${etat.allumee})`);
  }
});

await step('appuyer de nouveau rend tout le mur', async () => {
  await p.locator('#fiche-bastille').click();
  await p.waitForTimeout(300);
  const tire = await p.evaluate(() => document.querySelector('.mur').classList.contains('mur--tire'));
  if (tire) throw new Error('le mur reste éteint');
});

await step('la ficelle écrite mène bien à l’autre bout du fil', async () => {
  await p.goto(BASE + '#/tableaux/regimes');
  await p.waitForSelector('.fiche');
  await p.waitForTimeout(600);
  await p.locator('#fiche-bastille .ficelle').first().click();
  await p.waitForTimeout(600);
  const tenue = await p.evaluate(() => document.querySelector('.fiche--tenue')?.id);
  if (tenue !== 'fiche-monarchie') throw new Error(`la ficelle mène à « ${tenue} » au lieu de la monarchie`);
});

await step('un chapitre renvoie au mur, sur sa propre fiche', async () => {
  await p.goto(BASE + '#/histoire/c/ch07');
  await p.waitForTimeout(600);
  const lien = p.locator('a[href^="#/tableaux/"]').first();
  if (!(await lien.count())) throw new Error('le chapitre ne renvoie à aucun tableau');
  const href = await lien.getAttribute('href');
  await lien.click();
  await p.waitForSelector('.fiche');
  await p.waitForTimeout(800);
  const tenue = await p.evaluate(() => document.querySelector('.fiche--tenue')?.id);
  if (!tenue) throw new Error(`aucune fiche allumée à l'arrivée sur ${href}`);
  if (!href.endsWith(tenue.replace('fiche-', ''))) {
    throw new Error(`la fiche allumée (${tenue}) n'est pas celle demandée (${href})`);
  }
});

await p.goto(BASE + '#/tableaux/pouvoirs');
await p.waitForTimeout(700);
await p.screenshot({ path: `${SHOT}/T-mur.png` });
await b.close();

console.log(errors.length ? `\n${errors.length} erreur(s) :\n- ${errors.join('\n- ')}` : '\nAucune erreur.');
process.exit(errors.length ? 1 : 0);
