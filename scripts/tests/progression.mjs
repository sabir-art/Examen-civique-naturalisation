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
await page.waitForSelector('.accueil__hero');

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
  await page.waitForSelector('.ds-qcard__q');
}

async function jouer(chapitre, { juste }) {
  await ouvrirQuiz(chapitre);
  const bonnes = [];

  for (let garde = 0; garde < 12; garde += 1) {
    if (!(await page.locator('.ds-qcard__q').count())) break;

    if (juste) {
      // On coche, on valide, et si c'est faux on note la bonne pour plus tard.
      const textes = await page.$$eval('.ds-answer__text', (e) => e.map((x) => x.textContent));
      const attendu = bonnes.shift();
      const i = attendu ? Math.max(0, textes.indexOf(attendu)) : 0;
      await page.locator('.ds-answer').nth(i).click();
    } else {
      await page.locator('.ds-answer').first().click();
    }

    await page.click('button:has-text("Valider")');
    await page.waitForTimeout(200);
    const bonne = await page.$eval('.ds-answer--correct .ds-answer__text', (e) => e.textContent).catch(() => null);
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
  if (!(await page.locator('.ds-qcard__q').count())) break;
  const textes = await page.$$eval('.ds-answer__text', (x) => x.map((y) => y.textContent));
  const i = textes.findIndex((t) => restantes.includes(t));
  await page.locator('.ds-answer').nth(i >= 0 ? i : 0).click();
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

/* ------------------- 5. l'acte suit ses chapitres, pas la mémorisation */

/**
 * Le même défaut existait un niveau plus haut : l'acte affichait la maîtrise
 * moyenne de ses questions. Un acte entièrement terminé se serait retrouvé
 * avec une barre au quart pleine.
 *
 * On termine ici les six chapitres de l'acte I directement dans le stockage —
 * jouer six quiz à la main n'apprendrait rien de plus que le premier, déjà
 * joué pour de vrai plus haut.
 */
const pose = await page.evaluate(async () => {
  // `questionsOf` et non `chapitre.questions` : les identifiants sont attribués
  // à la construction de la banque, pas portés par les questions brutes.
  const { ACTES, questionsOf } = await import('./js/data/roman.js');
  const brut = JSON.parse(localStorage.getItem('examen-civique.v1'));
  let n = 0;
  for (const prof of Object.values(brut.profiles)) {
    for (const c of ACTES[0].chapitres) {
      prof.read[c.key] = Date.now();
      for (const q of questionsOf(c.key)) {
        prof.progress[q.id] = { box: 2, seen: 1, ok: 1, ko: 0, lastOk: true, last: Date.now(), due: Date.now() + 86400000 };
        n += 1;
      }
    }
  }
  localStorage.setItem('examen-civique.v1', JSON.stringify(brut));
  return n;
});
verifier(pose >= 20, `l'acte I a été rempli dans le stockage (${pose} questions)`);
await page.reload({ waitUntil: 'networkidle' });
await page.waitForTimeout(600);

await page.goto(`${BASE}#/histoire`);
await page.waitForTimeout(700);
const acte = await page.evaluate(() => {
  const it = document.querySelectorAll('.item')[0];
  const fill = it.querySelector('.bar__fill');
  return {
    sub: [...it.querySelectorAll('.item__sub')].map((e) => e.textContent).join(' | '),
    badge: it.querySelector('.badge')?.textContent || null,
    largeur: fill ? parseInt(fill.style.width, 10) : 0,
    vert: !!it.querySelector('.bar__fill--ok'),
  };
});
verifier(acte.largeur === 100, `un acte dont tous les chapitres sont terminés est plein (${acte.largeur} %)`);
verifier(acte.vert, 'et vert');
verifier(acte.badge === 'Terminé', `avec le badge « Terminé » (${acte.badge})`);
verifier(/chapitres terminés/.test(acte.sub), `et le compte écrit en clair (${acte.sub})`);

/* ------------------------- 6. le livret suit la même règle */

// Un chapitre du livret entièrement juste doit être « Terminé ».
const chapLivret = await page.evaluate(async () => {
  const { CHAPITRES } = await import('./js/data/livret.js');
  const { questionsOf } = await import('./js/data/q-livret.js');
  const c = CHAPITRES.find((x) => questionsOf(x.key).length > 0);
  const brut = JSON.parse(localStorage.getItem('examen-civique.v1'));
  for (const prof of Object.values(brut.profiles)) {
    for (const q of questionsOf(c.key)) {
      prof.progress[q.id] = { box: 2, seen: 1, ok: 1, ko: 0, lastOk: true, last: Date.now(), due: Date.now() + 86400000 };
    }
  }
  localStorage.setItem('examen-civique.v1', JSON.stringify(brut));
  return { cle: c.key, partie: c.partieKey };
});
await page.reload({ waitUntil: 'networkidle' });
await page.waitForTimeout(600);

await page.goto(`${BASE}#/livret/p/${chapLivret.partie}`);
await page.waitForTimeout(700);
const lv = await page.evaluate(() => {
  const it = [...document.querySelectorAll('.item')].find((x) => x.querySelector('.bar__fill--ok'));
  if (!it) return null;
  const fill = it.querySelector('.bar__fill');
  return {
    sub: [...it.querySelectorAll('.item__sub')].map((e) => e.textContent).join(' | '),
    badge: it.querySelector('.badge')?.textContent || null,
    largeur: parseInt(fill.style.width, 10),
  };
});
verifier(lv !== null, 'un chapitre du livret entièrement juste est marqué comme terminé');
verifier(lv && lv.largeur === 100, `sa barre est pleine (${lv?.largeur} %)`);
verifier(lv && lv.badge === 'Terminé', `avec le badge « Terminé » (${lv?.badge})`);
verifier(lv && /Chapitre terminé/.test(lv.sub), `et l'état écrit en clair (${lv?.sub})`);

/* --------------------------- 7. le sommaire ne mélange plus les deux */

await page.goto(`${BASE}#/histoire`);
await page.waitForTimeout(600);
const som = await page.evaluate(() => ({
  labels: [...document.querySelectorAll('.kpi__lab')].map((e) => e.textContent),
  valeurs: [...document.querySelectorAll('.kpi__val')].map((e) => e.textContent),
  explique: [...document.querySelectorAll('.hint')].some((e) => /mémorisation/i.test(e.textContent)),
}));
verifier(som.labels.includes('chapitres terminés'),
  `le sommaire compte les chapitres terminés (${som.labels.join(', ')})`);
verifier(/^6\//.test(som.valeurs[0]), `et il compte les six de l'acte I (${som.valeurs[0]})`);
verifier(som.explique, 'et il explique la différence entre les deux chiffres');


/* ------------------- 8. le nombre annoncé est celui de la séance */

/**
 * Signalement d'usage : « le bouton dit 10, et je dois répondre à 20 ».
 *
 * Le bouton affichait les questions DUES, la séance en fait toujours 20 :
 * les dues, puis des questions jamais vues pour compléter. Deux chiffres
 * justes, mais l'un promettait ce que l'autre ne tenait pas.
 *
 * Règle demandée : une révision ne contient que ce qui reste à revoir. Dix
 * dues font une séance de dix, trois en font trois, et rien n'est ajouté
 * par-dessus.
 */

/**
 * Installe `n` questions d'examen arrivées à échéance, et rien d'autre.
 * Les identifiants viennent de la banque elle-même : en les fabriquant à la
 * main on en invente qui n'existent pas, et le compte annoncé devient faux
 * pour une raison qui n'a rien à voir avec ce qu'on mesure.
 */
async function poserDues(n) {
  const poses = await page.evaluate(async (combien) => {
    const { QUESTIONS } = await import('./js/data/questions.js');
    const brut = JSON.parse(localStorage.getItem('examen-civique.v1'));
    const hier = Date.now() - 86400000;
    const ids = QUESTIONS.slice(0, combien).map((q) => q.id);
    for (const prof of Object.values(brut.profiles)) {
      prof.progress = {};
      for (const id of ids) {
        prof.progress[id] = { box: 2, seen: 1, ok: 1, ko: 0, lastOk: true, last: hier, due: hier };
      }
    }
    localStorage.setItem('examen-civique.v1', JSON.stringify(brut));
    return ids.length;
  }, n);
  if (poses !== n) ko(`le montage n'a posé que ${poses} questions dues sur ${n}`);
  await page.goto(`${BASE}#/`);
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForSelector('.accueil__hero');
  await page.waitForTimeout(400);
}

/**
 * Ce qu'annonce l'accueil : l'intitulé de la carte de séance et les lignes
 * qui l'accompagnent. Depuis le passage aux composants du système, la séance
 * du jour est la carte encre imbriquée dans le bandeau — c'est elle qui porte
 * le nombre, et c'est sur elle qu'on appuie.
 */
async function annonceAccueil() {
  return page.evaluate(() => {
    const carte = document.querySelector('.accueil__seance');
    const lignes = [
      carte?.querySelector('.accueil__seancemeta')?.textContent,
      document.querySelector('.accueil__reste')?.textContent,
    ].filter(Boolean);
    return { bouton: carte?.querySelector('.accueil__seancetitre')?.textContent.trim() || null, lignes };
  });
}

/** Nombre de questions réellement posées par la séance en cours. */
async function tailleSeance(route) {
  await page.goto(`${BASE}#/reviser`);
  await page.waitForTimeout(400);
  await page.goto(`${BASE}${route}`);
  await page.waitForSelector('.ds-qcard__q, .empty', { timeout: 5000 });
  return page.evaluate(() => {
    const m = document.querySelector('.quizbar__count')?.textContent.match(/sur (\d+)/);
    return m ? Number(m[1]) : 0;
  });
}

await poserDues(10);
let annonce = await annonceAccueil();
let annonces = Number((annonce.bouton || '').match(/\d+/)?.[0] || 0);
verifier(annonces === 10, `dix questions dues font une séance de dix (${annonce.bouton})`);
verifier(annonce.lignes.some((l) => /10 questions? à revoir/.test(l)),
  `et l'accueil le dit sans rien ajouter (${annonce.lignes.join(' | ')})`);
verifier(!annonce.lignes.some((l) => /nouvelle/.test(l)),
  'aucune question neuve n’est glissée dans une révision');

await page.goto(`${BASE}#/reviser`);
await page.waitForTimeout(600);
let hub = await page.evaluate(() => {
  const it = [...document.querySelectorAll('.item')].find((x) => /Révision du jour/.test(x.textContent));
  return {
    badge: it?.querySelector('.badge')?.textContent || null,
    sous: [...(it?.querySelectorAll('.item__sub') || [])].map((e) => e.textContent),
  };
});
verifier(Number(hub.badge) === annonces,
  `Réviser annonce le même nombre que l'accueil (${hub.badge} contre ${annonces})`);

verifier((await tailleSeance('#/reviser/revision')) === annonces,
  `on répond exactement au nombre annoncé (« ${annonce.bouton} »)`);

/* ------------------- 8 bis. trois dues font trois, pas vingt */

await poserDues(3);
annonce = await annonceAccueil();
annonces = Number((annonce.bouton || '').match(/\d+/)?.[0] || 0);
verifier(annonces === 3, `trois dues font une séance de trois (${annonce.bouton})`);
verifier((await tailleSeance('#/reviser/revision')) === 3,
  'et la séance en pose bien trois');

/* --------- 8 ter. au-delà d'une séance, le reste est annoncé à part */

await poserDues(50);
annonce = await annonceAccueil();
annonces = Number((annonce.bouton || '').match(/\d+/)?.[0] || 0);
verifier(annonces === 20, `cinquante dues donnent vingt maintenant (${annonce.bouton})`);
verifier(annonce.lignes.some((l) => /30 autres à revoir après/.test(l)),
  `et les trente autres sont annoncées pour après (${annonce.lignes.join(' | ')})`);
verifier((await tailleSeance('#/reviser/revision')) === 20,
  'la séance en pose vingt, pas cinquante');

/* ----------- 9. « Mes erreurs » annonce ce qu'elle contient vraiment */

/**
 * Signalement d'usage : le badge affiche 1, on entre, et l'écran répond
 * « aucune erreur en attente ».
 *
 * La progression est enregistrée pareil pour les trois banques — examen,
 * livret, récit — mais la séance ne cherchait les identifiants que dans la
 * banque d'examen. Rater une question du livret comptait dans le badge et
 * ne pouvait jamais être rejouée.
 */
const ratee = await page.evaluate(async () => {
  const { questionsOf } = await import('./js/data/q-livret.js');
  const { CHAPITRES } = await import('./js/data/livret.js');
  const c = CHAPITRES.find((x) => questionsOf(x.key).length > 0);
  const q = questionsOf(c.key)[0];
  const brut = JSON.parse(localStorage.getItem('examen-civique.v1'));
  for (const prof of Object.values(brut.profiles)) {
    prof.progress = {
      [q.id]: { box: 1, seen: 1, ok: 0, ko: 1, lastOk: false, last: Date.now(), due: Date.now() },
    };
  }
  localStorage.setItem('examen-civique.v1', JSON.stringify(brut));
  return q.id;
});
verifier(/^lv/.test(ratee), `une question du livret a été ratée (${ratee})`);
await page.reload({ waitUntil: 'networkidle' });
await page.waitForTimeout(500);

await page.goto(`${BASE}#/reviser`);
await page.waitForTimeout(600);
const badgeErr = await page.evaluate(() => {
  const it = [...document.querySelectorAll('.item')].find((x) => /Mes erreurs/.test(x.textContent));
  return it ? Number(it.querySelector('.badge')?.textContent) : 0;
});
verifier(badgeErr === 1, `le badge « Mes erreurs » compte l'erreur (${badgeErr})`);

await page.goto(`${BASE}#/reviser/erreurs`);
await page.waitForSelector('.ds-qcard__q, .empty');
const contenu = await page.evaluate(() => ({
  vide: !!document.querySelector('.empty'),
  posees: Number(document.querySelector('.quizbar__count')?.textContent.match(/sur (\d+)/)?.[1] || 0),
}));
verifier(!contenu.vide, "l'écran ne dit plus « aucune erreur en attente » alors qu'il en annonce une");
verifier(contenu.posees === badgeErr,
  `il repose exactement les erreurs annoncées (${contenu.posees} pour un badge de ${badgeErr})`);

/* -------- 10. une erreur rattrapée sort de la liste, les autres restent */

await page.evaluate(async () => {
  const { questionsOf } = await import('./js/data/q-livret.js');
  const { CHAPITRES } = await import('./js/data/livret.js');
  const c = CHAPITRES.find((x) => questionsOf(x.key).length >= 3);
  const [a, b, d] = questionsOf(c.key);
  const brut = JSON.parse(localStorage.getItem('examen-civique.v1'));
  const now = Date.now();
  for (const prof of Object.values(brut.profiles)) {
    prof.progress = {
      // Rattrapée : dernière réponse juste.
      [a.id]: { box: 2, seen: 2, ok: 1, ko: 1, lastOk: true, last: now, due: now + 86400000 },
      // Encore ratée, et ratée plusieurs fois.
      [b.id]: { box: 1, seen: 3, ok: 0, ko: 3, lastOk: false, last: now, due: now },
      // Ratée une fois.
      [d.id]: { box: 1, seen: 1, ok: 0, ko: 1, lastOk: false, last: now, due: now },
    };
  }
  localStorage.setItem('examen-civique.v1', JSON.stringify(brut));
});
await page.reload({ waitUntil: 'networkidle' });
await page.waitForTimeout(500);

await page.goto(`${BASE}#/reviser/erreurs`);
await page.waitForSelector('.ds-qcard__q, .empty');
const encoreFausses = await page.evaluate(() => Number(
  document.querySelector('.quizbar__count')?.textContent.match(/sur (\d+)/)?.[1] || 0));
verifier(encoreFausses === 2,
  `une question rattrapée quitte la liste, celles encore fausses restent (${encoreFausses} sur 3)`);

await browser.close();
console.log(erreurs.length ? `\n${erreurs.length} erreur(s).` : '\nAucune erreur.');
process.exit(erreurs.length ? 1 : 0);
