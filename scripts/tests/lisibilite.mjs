/**
 * Ce qui est à l'écran doit être atteignable sans deviner.
 *
 * Trois règles, nées de défauts réels signalés sur iPhone :
 *
 *   1. Aucune réponse ne doit se cacher derrière la barre d'action. La barre
 *      est collée en bas ; ce qui la précède défile DERRIÈRE elle. Une
 *      quatrième réponse ainsi masquée passe pour absente.
 *   2. Un contrôle segmenté doit se distinguer de la carte qui le porte, sinon
 *      on ne voit que le segment retenu et l'on ignore qu'il y a un choix.
 *   3. Ouvrir puis fermer une fiche de glossaire doit rendre le chapitre là où
 *      on l'avait laissé. Perdre sa ligne au milieu d'une lecture longue coûte
 *      plus cher que le mot qu'on était allé chercher.
 */
import pw from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pw;
const BASE = 'http://127.0.0.1:8099/';
const SHOT = './scripts/tests/captures';
const errors = [];
const step = async (n, f) => { try { await f(); console.log(`  ok  ${n}`); } catch (e) { console.log(`  FAIL ${n}: ${e.message}`); errors.push(`${n}: ${e.message}`); } };

const b = await chromium.launch();

/* Le petit et le grand des téléphones encore courants. Le défaut se voyait sur
   le grand : ce n'est donc pas une affaire de très petit écran. */
const ECRANS = [
  { nom: 'iPhone SE', w: 375, h: 667 },
  { nom: 'iPhone 15', w: 390, h: 844 },
  /* Les hauteurs ci-dessus sont celles de l'écran ; dans Safari, la barre
     d'adresse en mange une bonne part. Ce sont ces hauteurs-là que voit
     vraiment la page, et c'est sur elles que le défaut a été signalé. */
  { nom: 'iPhone 15 dans Safari', w: 393, h: 734 },
  { nom: 'iPhone 15 Pro Max dans Safari', w: 430, h: 814 },
];

/**
 * Position de chaque réponse et de la barre d'action, telles qu'elles sont
 * peintes — c'est le recouvrement qu'on mesure, pas la structure du document.
 */
const mesurer = (page) => page.evaluate(() => {
  const r = (el) => el.getBoundingClientRect();
  const barre = document.querySelector('.quizfoot');
  const rb = barre ? r(barre) : null;
  return {
    ecran: window.innerHeight,
    barre: rb ? { haut: Math.round(rb.top), bas: Math.round(rb.bottom) } : null,
    collee: barre ? getComputedStyle(barre).position === 'sticky' : false,
    reponses: [...document.querySelectorAll('.ds-answer')].map((el, i) => {
      const x = r(el);
      return { i, texte: el.textContent.trim().slice(0, 28), haut: Math.round(x.top), bas: Math.round(x.bottom) };
    }),
  };
});

for (const e of ECRANS) {
  const ctx = await b.newContext({ viewport: { width: e.w, height: e.h }, deviceScaleFactor: 2, locale: 'fr-FR' });
  const p = await ctx.newPage();
  p.on('pageerror', (err) => errors.push(err.message));
  await p.goto(BASE, { waitUntil: 'networkidle' });
  await p.fill('#ob-name', 'Abdellah'); await p.click('button[type=submit]');
  await p.waitForSelector('.accueil__hero');

  /* Trois modes de questionnaire, car la barre ne porte pas les mêmes boutons :
     « Valider » seul en entraînement, « Question suivante » plus « Passer »
     en conditions d'examen. Une réserve écrite en dur se tromperait sur l'un
     des deux. */
  const PARCOURS = [
    // Le récit tire dans un jeu fixe de quatre questions : on peut donc y
    // exiger, question par question, que tout tienne sans défiler. Les deux
    // autres puisent dans des centaines d'énoncés de longueurs très inégales ;
    // leur imposer la même règle rendrait le contrôle capricieux, alors on s'y
    // en tient à la règle absolue — rien de caché sous la barre.
    { nom: 'récit', url: '#/histoire/q/ch07', toutTient: true },
    { nom: 'thème', url: '#/reviser/t/institutions', lancer: true },
    { nom: 'examen blanc', url: '#/examen/run/officiel' },
  ];

  for (const parcours of PARCOURS) {
    await step(`${e.nom} · ${parcours.nom} : aucune réponse ne se cache derrière la barre`, async () => {
      // Rechargement franc : un questionnaire en cours pose un garde-fou qui
      // ouvrirait sa fenêtre de confirmation au changement d'adresse.
      await p.goto(BASE + parcours.url);
      await p.reload({ waitUntil: 'networkidle' });
      if (parcours.lancer) {
        await p.waitForSelector('button:has-text("Commencer")');
        await p.click('button:has-text("Commencer")');
      }
      await p.waitForSelector('.ds-answer');
      await p.waitForTimeout(400);

      /* On regarde chaque question du questionnaire, pas seulement la première :
         c'est un énoncé long qui pousse la dernière réponse sous la barre. */
      for (let n = 0; n < 6; n++) {
        const m = await mesurer(p);
        if (!m.reponses.length) break;

        /* On mesure à l'arrivée sur la question, sans avoir rien fait défiler :
           c'est cet instant-là que décrivait le défaut. Faire défiler d'abord
           dissoudrait le recouvrement — la barre rejoint alors sa place dans le
           flux — et le contrôle passerait sur une application fautive. */
        if (m.collee && m.barre) {
          for (const rep of m.reponses) {
            // Recouvrement : la réponse mord sur la bande occupée par la barre.
            const chevauche = rep.bas > m.barre.haut && rep.haut < m.barre.bas;
            if (chevauche) {
              throw new Error(`réponse ${rep.i + 1} « ${rep.texte} » sous la barre `
                + `(${rep.haut}→${rep.bas} contre barre ${m.barre.haut}→${m.barre.bas})`);
            }
          }
        }

        /* La demande d'origine : on ne doit pas avoir à défiler pour découvrir
           la dernière réponse. */
        if (parcours.toutTient) {
          const derniere = m.reponses[m.reponses.length - 1];
          if (m.reponses.length < 4) throw new Error(`${m.reponses.length} réponses seulement`);
          if (derniere.bas > m.ecran) {
            throw new Error(`la dernière réponse finit à ${derniere.bas} pour un écran de ${m.ecran}`);
          }
        }

        // Question suivante, pour éprouver d'autres longueurs d'énoncé.
        const suite = p.locator('.ds-answer').first();
        if (!(await suite.count())) break;
        await suite.click();
        await p.waitForTimeout(250);
        const bouton = p.locator('.quizfoot button').first();
        if (!(await bouton.count()) || await bouton.isDisabled()) break;
        await bouton.click();
        await p.waitForTimeout(250);
        // En entraînement, la correction s'intercale : un second appui passe.
        const encore = p.locator('.quizfoot button').first();
        if ((await encore.count()) && !(await encore.isDisabled())
            && (await encore.textContent() || '').match(/suivante|Terminer/)) {
          await encore.click();
          await p.waitForTimeout(250);
        }
      }
    });
  }

  /* Un questionnaire prend tout l'écran, d'où qu'il soit lancé. La barre
     d'onglets ne mène nulle part pendant qu'on répond — partir demande une
     confirmation — et les quatre-vingt-seize pixels qu'elle réserve manquent
     en bas. Le questionnaire d'un thème était le seul à la garder. */
  await step(`${e.nom} · la barre d'onglets ne prend pas de place pendant un questionnaire`, async () => {
    await p.goto(BASE + '#/reviser/t/institutions');
    await p.reload({ waitUntil: 'networkidle' });
    await p.waitForSelector('button:has-text("Commencer")');
    await p.click('button:has-text("Commencer")');
    await p.waitForSelector('.ds-answer');
    await p.waitForTimeout(300);
    const etat = await p.evaluate(() => ({
      onglets: !!document.querySelector('.ds-bottomnav'),
      reserve: getComputedStyle(document.body).getPropertyValue('--tabbar-h').trim(),
    }));
    if (etat.onglets) throw new Error("la barre d'onglets est encore dessinée");
    if (parseFloat(etat.reserve) !== 0) throw new Error(`elle réserve encore ${etat.reserve}`);
  });

  await p.screenshot({ path: `${SHOT}/L-quiz-${e.w}.png` });
  await ctx.close();
}

/* ------------------------------------------------- contrôle segmenté */

const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, locale: 'fr-FR' });
const p = await ctx.newPage();
p.on('pageerror', (err) => errors.push(err.message));
await p.goto(BASE, { waitUntil: 'networkidle' });
await p.fill('#ob-name', 'Abdellah'); await p.click('button[type=submit]');
await p.waitForSelector('.accueil__hero');

/** Couleur peinte derrière un élément, en remontant tant qu'elle est transparente. */
const fondDe = (page, sel) => page.evaluate((s) => {
  let el = document.querySelector(s);
  while (el) {
    const c = getComputedStyle(el).backgroundColor;
    if (c && c !== 'rgba(0, 0, 0, 0)' && c !== 'transparent') return c;
    el = el.parentElement;
  }
  return null;
}, sel);

const lire = (c) => (c.match(/[\d.]+/g) || []).slice(0, 3).map(Number);

await step('le rail du contrôle segmenté se détache de la carte qui le porte', async () => {
  await p.goto(BASE + '#/compte');
  await p.waitForSelector('.ds-seg');
  const rail = await fondDe(p, '.ds-seg');
  const carte = await p.evaluate(() => {
    let el = document.querySelector('.ds-seg').parentElement;
    while (el) {
      const c = getComputedStyle(el).backgroundColor;
      if (c && c !== 'rgba(0, 0, 0, 0)' && c !== 'transparent') return c;
      el = el.parentElement;
    }
    return null;
  });
  if (!rail || !carte) throw new Error('fond introuvable');
  const [r1, g1, b1] = lire(rail);
  const [r2, g2, b2] = lire(carte);
  const ecart = Math.abs(r1 - r2) + Math.abs(g1 - g2) + Math.abs(b1 - b2);
  if (ecart < 12) throw new Error(`rail ${rail} contre carte ${carte} : écart de ${ecart}, on ne le voit pas`);
});

await step('les segments non retenus restent lisibles sur ce rail', async () => {
  const ok = await p.evaluate(() => {
    const lum = (c) => {
      const [r, g, b] = (c.match(/[\d.]+/g) || []).slice(0, 3).map(Number).map((v) => {
        const s = v / 255;
        return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
      });
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };
    const rail = getComputedStyle(document.querySelector('.ds-seg')).backgroundColor;
    const btn = [...document.querySelectorAll('.ds-seg__btn')].find((x) => x.getAttribute('aria-selected') !== 'true');
    if (!btn) return { ratio: 0 };
    const a = lum(getComputedStyle(btn).color); const c = lum(rail);
    const ratio = (Math.max(a, c) + 0.05) / (Math.min(a, c) + 0.05);
    return { ratio: Math.round(ratio * 100) / 100, texte: btn.textContent.trim() };
  });
  if (ok.ratio < 4.5) throw new Error(`« ${ok.texte} » : contraste de ${ok.ratio} sur le rail (4,5 exigé)`);
});

await p.screenshot({ path: `${SHOT}/L-segmente.png` });

/* ------------------------------------------- fiche de glossaire */

await step('ouvrir un mot du glossaire ne fait pas remonter le chapitre', async () => {
  await p.goto(BASE + '#/histoire/c/ch09');
  await p.waitForSelector('.gloss');
  // On descend dans le chapitre, comme on le ferait en lisant.
  await p.evaluate(() => window.scrollTo(0, Math.round(document.documentElement.scrollHeight * 0.45)));
  await p.waitForTimeout(300);
  const avant = await p.evaluate(() => window.scrollY);
  if (avant < 200) throw new Error(`chapitre trop court pour l'épreuve (${avant})`);

  // Le mot souligné le plus proche du milieu de l'écran : celui qu'on lirait.
  const ouvert = await p.evaluate(() => {
    const milieu = window.innerHeight / 2;
    const mots = [...document.querySelectorAll('.gloss')]
      .map((el) => ({ el, r: el.getBoundingClientRect() }))
      .filter((x) => x.r.top > 0 && x.r.bottom < window.innerHeight)
      .sort((a, b) => Math.abs(a.r.top - milieu) - Math.abs(b.r.top - milieu));
    if (!mots.length) return null;
    mots[0].el.click();
    return mots[0].el.textContent.trim();
  });
  if (!ouvert) throw new Error('aucun mot de glossaire visible à cette hauteur');
  await p.waitForSelector('.modal__panel');
  await p.waitForTimeout(350);

  /* Fiche ouverte : la page doit être immobile ET rendue telle quelle. Le
     corps passe en `position: fixed`, ce qui remet le défilement à zéro ; s'il
     n'est pas compensé, le chapitre est déjà remonté en haut derrière la
     fiche, et l'on ne s'en aperçoit qu'en refermant. */
  const pendant = await p.evaluate(() => ({
    y: window.scrollY,
    haut: parseFloat(getComputedStyle(document.body).top) || 0,
  }));

  await p.click('.modal__panel button:has-text("Fermer")');
  await p.waitForTimeout(400);
  const apres = await p.evaluate(() => window.scrollY);

  const decalage = Math.abs(apres - avant);
  if (decalage > 4) {
    throw new Error(`« ${ouvert} » : lecture reprise à ${apres} au lieu de ${avant}`
      + ` (écart de ${decalage} ; pendant l'ouverture : défilement ${pendant.y}, corps à ${pendant.haut})`);
  }
});

/* ------------------------------------------------------ bouton d'action */

await step("le bouton du chapitre suivant tient sur une ligne", async () => {
  await p.goto(BASE + '#/histoire/q/ch07');
  await p.waitForSelector('.ds-answer');
  // On répond à tout pour atteindre l'écran de résultat.
  for (let n = 0; n < 12; n++) {
    if (!(await p.locator('.ds-answer').count())) break;
    await p.locator('.ds-answer').first().click();
    await p.waitForTimeout(200);
    /* L'action principale, et non « le premier bouton du pied » : depuis que la
       série se parcourt dans les deux sens, « Précédent » vient avant elle dans
       l'ordre du document. Un test qui vise une position plutôt qu'un rôle
       cliquait alors sur le retour et tournait en rond sans jamais avancer. */
    const btn = p.locator('.quizfoot .ds-btn--full').first();
    if (!(await btn.count())) break;
    await btn.click();
    await p.waitForTimeout(200);
    const suite = p.locator('.quizfoot .ds-btn--full').first();
    if ((await suite.count()) && (await suite.textContent() || '').match(/suivante|Terminer/)) {
      await suite.click();
      await p.waitForTimeout(200);
    }
  }
  const bouton = p.locator('.btn--accent').first();
  if (!(await bouton.count())) throw new Error('bouton du chapitre suivant introuvable');
  /* On compte les lignes réellement peintes. La hauteur du bouton ne dit rien :
     elle est fixée par `min-height`, assez haute pour loger deux lignes sans
     grandir d'un pixel — un test fondé sur elle resterait muet sur le défaut. */
  const lignes = await bouton.evaluate((el) => {
    const cible = el.querySelector('span') || el;
    const r = document.createRange();
    r.selectNodeContents(cible);
    return { n: r.getClientRects().length, texte: cible.textContent.trim() };
  });
  if (lignes.n > 1) throw new Error(`« ${lignes.texte} » occupe ${lignes.n} lignes`);
});

await p.screenshot({ path: `${SHOT}/L-resultat.png` });
await b.close();

console.log(errors.length ? `\n${errors.length} erreur(s) :\n- ${errors.join('\n- ')}` : '\nAucune erreur.');
process.exit(errors.length ? 1 : 0);
