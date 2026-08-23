/**
 * On choisit sa banque, et la séance ne sort pas de ce choix.
 *
 * « Je veux juste les questions de l'examen » n'avait aucun moyen de
 * s'exprimer : une séance de vingt questions tirait dans les trois banques.
 * Quelqu'un qui a fini « La France racontée » et qui n'a pas ouvert le livret
 * y retombait sans arrêt, sans comprendre pourquoi ni comment l'éviter.
 *
 * Ce contrôle joue le geste complet — ouvrir un thème, appuyer sur une banque,
 * lancer la séance — et vérifie que TOUTES les questions tirées viennent bien
 * de la banque demandée. Il vérifie aussi les deux pièges qui vont avec : que
 * le sous-thème disparaisse quand il n'a plus de sens, et qu'un thème pauvre
 * en questions garde un sélecteur de nombre utilisable.
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

/** L'identité de chaque banque, telle que la page la connaît. */
const banques = await page.evaluate(async () => {
  const { poolTheme, SOURCES } = await import('./js/data/banques.js');
  const out = {};
  for (const s of SOURCES) out[s] = poolTheme('histoire-geo-culture', s).map((q) => q.id);
  return out;
});
verifier(
  banques.examen.length === 76 && banques.livret.length === 85 && banques.recit.length === 48,
  `Histoire & géo se répartit en 76 / 85 / 48 (${banques.examen.length} / ${banques.livret.length} / ${banques.recit.length})`,
);

const appartient = (id, banque) => banques[banque].includes(id);

/** Ouvre un thème et rend la liste des puces de banque affichées. */
async function ouvrir(theme) {
  // Le rechargement n'est pas un ornement : viser deux fois la même URL à
  // fragment ne relance pas le routeur, et l'écran garderait le filtre choisi
  // par le contrôle précédent. Un test qui se croit à l'état neuf sans y être
  // mesure autre chose que ce qu'il annonce — on s'est déjà fait prendre.
  await page.goto(`${BASE}#/reviser/t/${theme}`);
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForSelector('.ds-chip');
  return page.$$eval('.ds-chip', (n) => n.map((x) => x.textContent.trim()));
}

/* ----------------------------------------------------- les puces existent */

const puces = await ouvrir('histoire-geo-culture');
for (const attendu of ['Tout (209)', 'Examen (76)', 'Livret (85)', 'Récit (48)']) {
  verifier(puces.includes(attendu), `la puce « ${attendu} » est proposée`);
}

/* ------------------------------------ une banque choisie borne la séance */

/**
 * Appuie sur une banque, lance la séance, et rend les identifiants tirés.
 * On lit les identifiants dans le moteur plutôt qu'à l'écran : une séance de
 * vingt questions ne montre que la première, et c'est le tirage entier qu'il
 * faut juger.
 */
async function tirer(theme, banque, nb) {
  return page.evaluate(async ({ theme, banque, nb }) => {
    const { buildTraining } = await import('./js/engine.js');
    return buildTraining({ mode: 'theme', theme, source: banque, count: nb }).map((c) => c.id);
  }, { theme, banque, nb });
}

for (const banque of ['examen', 'livret', 'recit']) {
  const ids = await tirer('histoire-geo-culture', banque, 40);
  const intrus = ids.filter((id) => !appartient(id, banque));
  verifier(ids.length === 40, `${banque} : la séance rend bien 40 questions (${ids.length})`);
  verifier(intrus.length === 0, `${banque} : aucune question d'une autre banque${intrus.length ? ` — ${intrus.slice(0, 3).join(', ')}` : ''}`);
}

// Sans choix, les trois banques se mélangent : c'est le comportement d'avant,
// et il doit rester le défaut.
const melange = await tirer('histoire-geo-culture', null, 209);
const familles = new Set(melange.map((id) => ['examen', 'livret', 'recit'].find((b) => appartient(id, b))));
verifier(familles.size === 3, `sans choix, les trois banques sont tirées (${[...familles].join(', ')})`);

/* ----------------------------------- le sous-thème suit, ou se retire */

await page.click('.ds-chip:has-text("Livret")');
await page.waitForTimeout(120);
const marquee = await page.$$eval('.ds-chip[aria-pressed="true"]', (n) => n.map((x) => x.textContent.trim()));
verifier(
  marquee.some((x) => x.startsWith('Livret')),
  `la banque choisie se voit à l'écran (marquées : ${marquee.join(' / ') || 'aucune'})`,
);
const apresLivret = await page.$$eval('.ds-chip', (n) => n.map((x) => x.textContent.trim()));
verifier(
  !apresLivret.some((x) => x.startsWith('Repères historiques')),
  'le livret choisi, les sous-thèmes disparaissent — ils ne découpent que l\'examen',
);

await page.click('.ds-chip:has-text("Examen")');
await page.waitForTimeout(120);
const apresExamen = await page.$$eval('.ds-chip', (n) => n.map((x) => x.textContent.trim()));
verifier(
  apresExamen.some((x) => x.startsWith('Repères historiques')),
  'la banque d\'examen choisie, les sous-thèmes reviennent',
);

/* --------------------------- un thème pauvre garde un sélecteur utilisable */

// « Vivre en société » n'a que quatre questions dans le récit : moins que le
// plus petit palier proposé. Le sélecteur doit tout de même offrir un nombre.
await ouvrir('vivre-societe');
await page.click('.ds-chip:has-text("Récit")');
await page.waitForTimeout(120);
const paliers = await page.$$eval('.ds-seg__btn', (n) => n.map((x) => x.textContent.trim()));
verifier(paliers.length > 0, `quatre questions au récit : le sélecteur propose quand même un nombre (${paliers.join(', ') || 'aucun'})`);

const bouton = await page.textContent('.ds-btn--primary');
verifier(/\(4 questions\)/.test(bouton || ''), `le bouton annonce le nombre réel — « ${(bouton || '').trim()} »`);

/* ------------------------------------------- la phrase se lit en français */

/**
 * Les noms de banque s'insèrent dans une phrase, et une mise en minuscules
 * automatique donnait « dans la france racontée » : le titre d'un livre ne se
 * décapitalise pas, et « dans banque d'examen » n'a pas d'article.
 */
await ouvrir('histoire-geo-culture');
for (const [puce, attendu] of [
  ['Examen', "la banque d'examen"],
  ['Livret', 'le livret du citoyen'],
  ['Récit', '« La France racontée »'],
]) {
  await page.click(`.ds-chip:has-text("${puce}")`);
  await page.waitForTimeout(120);
  const phrases = await page.$$eval('.ds-filtres__bilan', (n) => n.map((x) => x.textContent.trim()));
  const dite = phrases.find((x) => x.includes('dans '));
  verifier(
    Boolean(dite && dite.includes(`dans ${attendu}`)),
    `« ${puce} » se dit correctement — « ${(dite || 'aucune phrase').slice(0, 80)} »`,
  );
}

/* --------------------------------------------------- le bloc est rangé */

/**
 * Une piste de filtre tient sur UNE ligne.
 *
 * La première version laissait les puces passer à la ligne : sur « Vivre en
 * société », deux rangées de banques et deux rangées de sous-thèmes, plus deux
 * paragraphes d'explication, occupaient plus de place que tout le reste de
 * l'écran. Material 3 est explicite — deux rangées ou plus rendent chaque puce
 * plus difficile à parcourir —, et recommande une ligne unique qui défile.
 *
 * On mesure donc la position verticale de chaque puce dans sa piste : toutes
 * doivent partager la même. Une seule qui descend d'un cran, et le retour à la
 * ligne est revenu.
 */
for (const theme of ['histoire-geo-culture', 'vivre-societe']) {
  await ouvrir(theme);
  const pistes = await page.$$eval('.ds-filtre__piste', (n) => n.map((piste) => {
    const lignes = new Set([...piste.children].map((c) => Math.round(c.getBoundingClientRect().top)));
    return { nom: piste.previousElementSibling?.textContent?.trim() || '?', lignes: lignes.size, puces: piste.children.length };
  }));
  verifier(pistes.length > 0, `${theme} : les pistes de filtre existent (${pistes.length})`);
  for (const piste of pistes) {
    verifier(piste.lignes === 1, `${theme} — « ${piste.nom} » : ${piste.puces} puces sur une seule ligne (${piste.lignes} ligne(s))`);
  }
}

/**
 * Chaque piste commence sous son étiquette, pas seize pixels à sa gauche.
 *
 * La piste déborde volontairement jusqu'aux bords de la carte, pour qu'une
 * puce coupée annonce la suite. Mais `scroll-snap-align: start` cale l'enfant
 * sur le bord du scrollport, qui ignore le rembourrage : la première puce
 * venait se coller au bord de la carte, décalée de son propre titre. Le défaut
 * était de seize pixels — assez pour salir la colonne, trop peu pour sauter
 * aux yeux sur une capture.
 */
await ouvrir('vivre-societe');
const colonnes = await page.$$eval('.ds-filtre', (n) => n.map((f) => {
  const nom = f.querySelector('.ds-filtre__nom');
  const premier = f.querySelector('.ds-filtre__piste > *') || f.querySelector('.ds-seg');
  return {
    nom: nom?.textContent.trim() || '?',
    etiquette: nom ? Math.round(nom.getBoundingClientRect().left) : null,
    contenu: premier ? Math.round(premier.getBoundingClientRect().left) : null,
  };
}));
for (const c of colonnes) {
  verifier(c.etiquette === c.contenu, `« ${c.nom} » : titre et contenu sur la même colonne (${c.etiquette} / ${c.contenu})`);
}

/**
 * Une piste déborde de la carte pour que la puce coupée annonce la suite —
 * mais la carte recoupe, et la PAGE ne doit jamais défiler de côté.
 */
const debordement = await page.evaluate(() => ({
  page: document.documentElement.scrollWidth - document.documentElement.clientWidth,
  defilable: [...document.querySelectorAll('.ds-filtre__piste')].some((p) => p.scrollWidth > p.clientWidth + 1),
}));
verifier(debordement.page <= 0, `la page ne défile pas de côté (${debordement.page}px de trop)`);
verifier(debordement.defilable, 'au moins une piste défile bien à l\'intérieur de sa carte');

/**
 * Et le bloc entier reste court. Ce plafond n'est pas une élégance : c'est le
 * chiffre qui a motivé la refonte, et sans lui rien n'empêche un futur réglage
 * de rendre l'écran aussi long qu'avant.
 */
await ouvrir('vivre-societe');
const hauteur = await page.evaluate(() => {
  // La carte est le parent direct de la grille de réglages : pas besoin
  // d'une classe posée là uniquement pour que ce contrôle sache la trouver.
  const carte = document.querySelector('.ds-filtres')?.parentElement;
  return carte ? Math.round(carte.getBoundingClientRect().height) : -1;
});
verifier(hauteur > 0 && hauteur <= 300, `le bloc de réglages tient en 300px (${hauteur}px)`);

/**
 * La puce choisie reste visible.
 *
 * « Récit » est la dernière puce de la piste, et chaque redessin remet la
 * piste au début : l'écran affichait un filtre actif coupé par le bord droit,
 * donc un réglage qu'on ne pouvait pas relire. On vérifie la dernière puce de
 * chaque piste, celle qui court le plus de risques.
 */
for (const puce of ['Récit', 'Culture et patrimoine']) {
  // Écran neuf à chaque tour : choisir « Récit » retire la piste des
  // sous-thèmes, et « Culture et patrimoine » n'existerait plus au tour suivant.
  await ouvrir('histoire-geo-culture');
  await page.click(`.ds-chip:has-text("${puce}")`);
  await page.waitForTimeout(200);
  const vue = await page.evaluate(() => {
    const choisis = [...document.querySelectorAll('.ds-filtre__piste [aria-pressed="true"]')];
    return choisis.map((c) => {
      const cadre = c.closest('.ds-filtre__piste').getBoundingClientRect();
      const b = c.getBoundingClientRect();
      return { texte: c.textContent.trim(), entier: b.left >= cadre.left - 1 && b.right <= cadre.right + 1 };
    });
  });
  for (const v of vue) verifier(v.entier, `« ${puce} » choisi : « ${v.texte} » tient entièrement dans sa piste`);
}

/* ------------------------------------------- la séance part vraiment */

await ouvrir('histoire-geo-culture');
await page.click('.ds-chip:has-text("Récit")');
await page.waitForTimeout(120);
await page.click('.ds-btn--primary');
await page.waitForSelector('.quiz', { timeout: 5000 });
const enJeu = await page.evaluate(() => document.querySelector('.quiz')?.textContent || '');
verifier(enJeu.length > 0, 'la séance démarre sur la banque choisie');

await browser.close();
console.log(erreurs.length ? `\n${erreurs.length} problème(s).` : '\nAucun problème détecté.');
process.exit(erreurs.length ? 1 : 0);
