/**
 * L'assistant : joignable partout, et il se souvient.
 *
 * Aucun appel n'est fait à une API : ces contrôles portent sur ce que
 * l'application promet autour de la conversation — un point d'entrée sur chaque
 * écran, le contexte de ce qu'on lisait, la mémoire qui survit à la fermeture,
 * et la place gardée dans le chapitre quand on va poser sa question.
 *
 * La clé posée ici est une chaîne de test qui ne vaut rien et n'appelle rien :
 * elle sert uniquement à faire apparaître l'assistant, qui reste caché tant
 * qu'aucun fournisseur n'est réglé.
 */
import pw from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pw;
const BASE = 'http://127.0.0.1:8099/';
const SHOT = './scripts/tests/captures';
const errors = [];
const step = async (n, f) => { try { await f(); console.log(`  ok  ${n}`); } catch (e) { console.log(`  FAIL ${n}: ${e.message}`); errors.push(`${n}: ${e.message}`); } };

const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 393, height: 734 }, deviceScaleFactor: 2, locale: 'fr-FR' });
const p = await ctx.newPage();
p.on('pageerror', (e) => errors.push(e.message));

await p.goto(BASE, { waitUntil: 'networkidle' });
await p.fill('#ob-name', 'Abdellah'); await p.click('button[type=submit]');
await p.waitForSelector('.accueil__hero');

/* ------------------------------------------------ sans fournisseur réglé */

await step("sans clé, l'assistant renvoie aux réglages sans rien casser", async () => {
  await p.goto(BASE + '#/assistant');
  await p.waitForTimeout(400);
  if (!(await p.locator('a[href="#/compte/ia"]').count())) throw new Error('pas de renvoi vers les réglages');
  if (await p.locator('.compose').count()) throw new Error('un champ de discussion sans fournisseur');
});

await step("sans clé, le chapitre ne propose pas de poser une question", async () => {
  await p.goto(BASE + '#/histoire/c/ch09');
  await p.waitForTimeout(500);
  if (await p.locator('.compose').count()) {
    throw new Error('champ de discussion proposé alors qu’aucune IA n’est branchée');
  }
});

/* ------------------------------------------------- avec un fournisseur réglé */

/* La chaîne posée ici n'a délibérément PAS la forme d'une clé : le garde-fou
   anti-secrets refuse tout ce qui y ressemble dans un fichier suivi par Git, et
   il a raison — il ne peut pas distinguer une fausse clé d'une vraie. Le
   fournisseur est nommé explicitement dans les réglages, il n'est pas deviné
   d'après la forme de la chaîne : l'assistant s'active donc quand même. */
await p.evaluate(() => {
  localStorage.setItem('examen-civique.assistant', JSON.stringify({
    provider: 'anthropic',
    keys: { anthropic: 'chaine-de-test-qui-ne-vaut-rien' },
    models: { anthropic: 'modele-de-test' },
  }));
});
await p.reload({ waitUntil: 'networkidle' });
await p.waitForTimeout(400);

/* Le bouton doit exister sur un onglet racine ET sur un écran de détail : c'est
   la demande — pouvoir poser une question d'où que l'on soit. */
const ECRANS = [
  { nom: 'accueil', url: '#/' },
  { nom: 'récit', url: '#/histoire' },
  { nom: 'un chapitre', url: '#/histoire/c/ch09' },
  { nom: 'le livret', url: '#/livret' },
  { nom: 'les progrès', url: '#/progres' },
];
for (const e of ECRANS) {
  await step(`${e.nom} : l'assistant est joignable depuis la barre du haut`, async () => {
    await p.goto(BASE + e.url);
    await p.waitForTimeout(450);
    const bouton = p.locator('.ds-topbar [aria-label="Demander à l’assistant"]');
    if (!(await bouton.count())) throw new Error('bouton absent de la barre');
    if (!(await bouton.first().isVisible())) throw new Error('bouton présent mais invisible');
  });
}

await step("la barre du haut ne déborde pas une fois ce bouton ajouté", async () => {
  // Même page, écran rétréci : un nouvel onglet repartirait sans profil et
  // s'arrêterait sur l'accueil de bienvenue, qui n'a pas de barre du tout.
  await p.setViewportSize({ width: 320, height: 700 });
  await p.goto(BASE + '#/');
  await p.waitForTimeout(500);
  const mesure = await p.evaluate(() => ({
    page: document.documentElement.scrollWidth,
    ecran: window.innerWidth,
    boutons: document.querySelectorAll('.ds-topbar__actions .ds-iconbtn').length,
  }));
  await p.setViewportSize({ width: 393, height: 734 });
  if (mesure.boutons < 3) throw new Error(`${mesure.boutons} boutons dans la barre, trois attendus`);
  if (mesure.page > mesure.ecran + 1) throw new Error(`la page déborde : ${mesure.page} pour ${mesure.ecran}`);
});

await step("le bouton de l'assistant se distingue de ses voisins", async () => {
  await p.goto(BASE + '#/');
  await p.waitForTimeout(500);
  const fonds = await p.evaluate(() => {
    const boutons = [...document.querySelectorAll('.ds-topbar__actions .ds-iconbtn')];
    return boutons.map((b) => ({
      quoi: b.getAttribute('aria-label'),
      fond: getComputedStyle(b).backgroundColor,
    }));
  });
  const assistant = fonds.find((f) => /assistant/i.test(f.quoi || ''));
  if (!assistant) throw new Error('bouton introuvable');
  const voisins = fonds.filter((f) => f !== assistant);
  if (!voisins.length) throw new Error('aucun voisin : le contrôle ne prouverait rien');
  const lire = (c) => (c.match(/[\d.]+/g) || []).slice(0, 3).map(Number);
  const [r1, g1, b1] = lire(assistant.fond);
  for (const v of voisins) {
    const [r2, g2, b2] = lire(v.fond);
    const ecart = Math.abs(r1 - r2) + Math.abs(g1 - g2) + Math.abs(b1 - b2);
    if (ecart < 20) {
      throw new Error(`même aplat que « ${v.quoi} » (${assistant.fond} contre ${v.fond}) : les ronds se confondent`);
    }
  }
});

await step("les suggestions ne passent pas sous la barre de saisie", async () => {
  await p.evaluate(async () => (await import('./js/ai-thread.js')).effacer());
  await p.goto(BASE + '#/assistant');
  await p.waitForSelector('.chip');
  await p.waitForTimeout(500);

  // Question longue : la barre grandit, et c'est là que la réserve écrite en
  // dur ne suffisait plus.
  await p.fill('.compose__field', 'Une question assez longue pour que le champ de saisie occupe plusieurs lignes et pousse la barre vers le haut, comme lorsqu’on colle un passage entier du récit avant de demander une explication.');
  await p.waitForTimeout(400);

  const chevauche = await p.evaluate(() => {
    const barre = document.querySelector('.compose').getBoundingClientRect();
    const perdues = [];
    for (const c of document.querySelectorAll('.chip')) {
      const r = c.getBoundingClientRect();
      if (r.bottom > barre.top && r.top < barre.bottom) perdues.push(c.textContent.trim().slice(0, 34));
    }
    return { perdues, hauteurBarre: Math.round(barre.height) };
  });
  if (chevauche.perdues.length) {
    throw new Error(`${chevauche.perdues.length} suggestion(s) sous la barre (haute de ${chevauche.hauteurBarre}px) : « ${chevauche.perdues[0]} »`);
  }
});

/* ------------------------------------------------------------- le contexte */

/* La demande d'origine : depuis un mot du glossaire, on parle à l'IA SUR PLACE.
   Partir vers l'écran Assistant faisait perdre le mot, la page et la ligne. */
await step("un mot du glossaire se discute dans sa feuille, sans la quitter", async () => {
  await p.evaluate(async () => (await import('./js/ai-thread.js')).effacer());
  await p.goto(BASE + '#/histoire/c/ch09');
  await p.waitForSelector('.gloss');
  const avant = await p.evaluate(() => location.hash);
  await p.locator('.gloss').first().click();
  await p.waitForSelector('.modal__panel');
  if (!(await p.locator('.modal__panel .compose__field').count())) {
    throw new Error('aucun champ de saisie dans la feuille du mot');
  }
  const apres = await p.evaluate(() => location.hash);
  if (apres !== avant) throw new Error(`l'écran a changé (${avant} → ${apres})`);
});

await step("la question posée depuis la feuille part avec le mot et sa définition", async () => {
  let corps = null;
  await p.route('**://api.anthropic.com/**', async (route) => {
    try { corps = JSON.parse(route.request().postData() || '{}'); } catch { corps = {}; }
    await route.fulfill({ status: 503, contentType: 'application/json', body: '{"error":"interrompu"}' });
  });
  const terme = (await p.locator('.modal__title').textContent()).trim();
  await p.fill('.modal__panel .compose__field', 'Et concrètement ?');
  await p.click('.modal__panel .compose__send');
  await p.waitForTimeout(1200);
  await p.unroute('**://api.anthropic.com/**');

  if (!corps) throw new Error("aucun appel n'a été tenté");
  const premier = (corps.messages || [])[0]?.content || '';
  if (!premier.includes(terme)) throw new Error(`« ${terme} » absent de la demande : « ${premier.slice(0, 90)} »`);
  if (!premier.includes('Et concrètement')) throw new Error('la question tapée ne part pas');
});

await step("la feuille reste ouverte, et l'écran derrière n'a pas bougé", async () => {
  const etat = await p.evaluate(() => ({
    feuille: Boolean(document.querySelector('.modal__panel')),
    ou: location.hash,
  }));
  if (!etat.feuille) throw new Error('la feuille s’est fermée');
  if (!etat.ou.startsWith('#/histoire/c/')) throw new Error(`on a quitté le chapitre (${etat.ou})`);
});

await step("changer d'écran referme la feuille et rend le défilement", async () => {
  // La feuille est encore ouverte, héritée du contrôle précédent. Elle
  // intercepte les appuis, donc on ne peut pas la contourner par un bouton :
  // c'est le geste de retour du téléphone qui change d'écran par-dessous.
  if (!(await p.locator('.modal__panel').count())) throw new Error('rien à fermer : le contrôle ne prouverait rien');
  await p.goBack();
  await p.waitForTimeout(800);
  const etat = await p.evaluate(() => ({
    feuille: Boolean(document.querySelector('.modal__panel')),
    fige: document.body.classList.contains('is-locked'),
    position: getComputedStyle(document.body).position,
  }));
  if (etat.feuille) throw new Error('la feuille est restée posée sur le nouvel écran');
  if (etat.fige || etat.position === 'fixed') throw new Error('la page est restée figée');
});

await step("ce qui est demandé dans la feuille, l'écran Assistant s'en souvient", async () => {
  const dansLeFil = await p.evaluate(async () => {
    const f = await import('./js/ai-thread.js');
    return f.messages().some((m) => m.content.includes('Et concrètement'));
  });
  if (!dansLeFil) throw new Error('la question posée depuis la feuille est absente de la mémoire commune');
});

await step("un chapitre se discute au bas de sa page, sans la quitter", async () => {
  await p.evaluate(async () => (await import('./js/ai-thread.js')).effacer());
  await p.goto(BASE + '#/histoire/c/ch09');
  await p.waitForSelector('.compose__field');
  let corps = null;
  await p.route('**://api.anthropic.com/**', async (route) => {
    try { corps = JSON.parse(route.request().postData() || '{}'); } catch { corps = {}; }
    await route.fulfill({ status: 503, contentType: 'application/json', body: '{"error":"interrompu"}' });
  });
  await p.locator('.compose__field').scrollIntoViewIfNeeded();
  await p.fill('.compose__field', 'Pourquoi ce chapitre compte ?');
  await p.click('.compose__send');
  await p.waitForTimeout(1200);
  await p.unroute('**://api.anthropic.com/**');

  if (!corps) throw new Error("aucun appel n'a été tenté");
  const premier = (corps.messages || [])[0]?.content || '';
  if (!/chapitre/i.test(premier)) throw new Error(`le chapitre n'est pas nommé : « ${premier.slice(0, 90)} »`);
  const ou = await p.evaluate(() => location.hash);
  if (!ou.startsWith('#/histoire/c/')) throw new Error(`on a quitté le chapitre (${ou})`);
});

/* --------------------------------------------------------------- la mémoire */

await step('la conversation survit à la fermeture de l’application', async () => {
  await p.evaluate(async () => {
    const fil = await import('./js/ai-thread.js');
    fil.effacer();
    fil.ajouter('user', 'Qui était Napoléon ?');
    fil.ajouter('assistant', 'Un général devenu empereur en 1804.');
  });
  // Rechargement franc : c'est l'équivalent d'avoir fermé puis rouvert.
  await p.goto(BASE + '#/assistant');
  await p.reload({ waitUntil: 'networkidle' });
  await p.waitForTimeout(600);
  const bulles = await p.locator('.msg .msg__body').allTextContents();
  if (bulles.length < 2) throw new Error(`${bulles.length} message(s) retrouvé(s) au lieu de deux`);
  if (!bulles.join(' ').includes('Napoléon')) throw new Error('la question posée a été oubliée');
  if (!bulles.join(' ').includes('1804')) throw new Error('la réponse reçue a été oubliée');
});

/**
 * Ce qui part réellement sur le réseau.
 *
 * On intercepte l'appel plutôt que d'interroger le module : c'est le chemin
 * emprunté par le bouton « Envoyer » qu'il faut éprouver, pas une fonction
 * prise à part. La requête est arrêtée net — rien ne sort de la machine —, et
 * l'on inspecte le corps qu'elle transportait.
 */
await step('la question part avec les échanges précédents, et sans tour vide', async () => {
  let corps = null;
  await p.route('**://api.anthropic.com/**', async (route) => {
    try { corps = JSON.parse(route.request().postData() || '{}'); } catch { corps = {}; }
    await route.fulfill({ status: 503, contentType: 'application/json', body: '{"error":"interrompu par le contrôle"}' });
  });

  await p.goto(BASE + '#/assistant');
  await p.waitForSelector('.compose__field');
  await p.fill('.compose__field', 'Et après, que s’est-il passé ?');
  await p.click('.compose__send');
  await p.waitForTimeout(1200);
  await p.unroute('**://api.anthropic.com/**');

  if (!corps) throw new Error("aucun appel n'a été tenté");
  const msgs = corps.messages || [];
  if (msgs.length < 3) throw new Error(`${msgs.length} message(s) envoyé(s) : la mémoire n'accompagne pas la question`);
  const vides = msgs.filter((m) => !m.content || !String(m.content).trim());
  if (vides.length) throw new Error(`${vides.length} message(s) vide(s) dans l'envoi — l'API refuse un tour sans contenu`);
  if (msgs.at(-1).role !== 'user') throw new Error(`le dernier message envoyé est un tour « ${msgs.at(-1).role} »`);
  if (!JSON.stringify(msgs).includes('Napoléon')) throw new Error('les échanges précédents ne sont pas transmis');
});

await step('« Nouvelle conversation » fait vraiment oublier', async () => {
  await p.goto(BASE + '#/assistant');
  await p.waitForTimeout(500);
  await p.click('button:has-text("Nouvelle conversation")');
  await p.waitForSelector('.modal__panel');
  await p.click('.modal__panel button:has-text("Nouvelle conversation")');
  await p.waitForTimeout(400);
  const reste = await p.evaluate(async () => (await import('./js/ai-thread.js')).nombre());
  if (reste !== 0) throw new Error(`${reste} message(s) subsistent`);
});

await step('la conversation ne part ni dans l’export de profil ni ailleurs', async () => {
  await p.evaluate(async () => {
    const fil = await import('./js/ai-thread.js');
    fil.ajouter('user', 'MARQUEUR-CONFIDENTIEL-1234');
  });
  const fuite = await p.evaluate(async () => {
    const store = await import('./js/store.js');
    // `exportPayload` est exactement ce qui part dans le fichier d'export et
    // dans la synchronisation : si le marqueur n'y est pas, il ne sort pas.
    const exporte = JSON.stringify(store.exportPayload());
    const autresCles = Object.keys(localStorage)
      .filter((c) => c !== 'examen-civique.assistant.conversation')
      .map((c) => localStorage.getItem(c) || '')
      .join('|');
    return {
      dansExport: exporte.includes('MARQUEUR-CONFIDENTIEL-1234'),
      ailleurs: autresCles.includes('MARQUEUR-CONFIDENTIEL-1234'),
      exportNonVide: exporte.length > 40,
    };
  });
  if (!fuite.exportNonVide) throw new Error("l'export est vide : le contrôle ne prouverait rien");
  if (fuite.dansExport) throw new Error('la conversation se retrouve dans l’export de profil');
  if (fuite.ailleurs) throw new Error('la conversation est recopiée dans un autre espace de stockage');
});

/* ------------------------------------------ garder sa place en allant demander */

await step('aller poser une question puis revenir rend le chapitre où on l’avait laissé', async () => {
  await p.goto(BASE + '#/histoire/c/ch09');
  await p.waitForSelector('.gloss');
  await p.evaluate(() => window.scrollTo(0, Math.round(document.documentElement.scrollHeight * 0.45)));
  await p.waitForTimeout(350);
  const avant = await p.evaluate(() => window.scrollY);
  if (avant < 200) throw new Error(`chapitre trop court pour l'épreuve (${avant})`);

  await p.evaluate(() => { window.location.hash = '#/assistant'; });
  await p.waitForSelector('.compose__field');
  await p.waitForTimeout(300);

  await p.evaluate(() => { window.location.hash = '#/histoire/c/ch09'; });
  await p.waitForSelector('.gloss');
  await p.waitForTimeout(600);
  const apres = await p.evaluate(() => window.scrollY);
  if (Math.abs(apres - avant) > 40) {
    throw new Error(`lecture reprise à ${apres} au lieu de ${avant}`);
  }
});

/* --------------------------------- la flèche de retour ramène d'où l'on vient */

const DEPARTS = [
  { nom: 'un chapitre', url: '#/histoire/c/ch09' },
  { nom: 'le livret', url: '#/livret' },
  { nom: 'un tableau d’enquête', url: '#/tableaux/regimes' },
  { nom: 'les progrès', url: '#/progres' },
];
for (const d of DEPARTS) {
  await step(`depuis ${d.nom}, la flèche de retour y ramène`, async () => {
    await p.goto(BASE + d.url);
    await p.waitForTimeout(500);
    await p.click('.ds-topbar [aria-label="Demander à l’assistant"]');
    await p.waitForSelector('.compose__field');
    await p.waitForTimeout(400);
    await p.click('.ds-topbar [aria-label="Retour"]');
    await p.waitForTimeout(600);
    const ou = await p.evaluate(() => location.hash);
    if (ou !== d.url) throw new Error(`retour sur « ${ou} » au lieu de « ${d.url} »`);
  });
}

/* La zone de saisie doit SE VOIR : un champ gris pâle sur fond presque blanc,
   c'est un champ qu'on ne trouve pas. */
await step("la zone de saisie se détache du fond", async () => {
  await p.goto(BASE + '#/assistant');
  await p.waitForSelector('.compose');
  await p.waitForTimeout(400);
  const vu = await p.evaluate(() => {
    const c = document.querySelector('.compose');
    const s = getComputedStyle(c);
    const fond = getComputedStyle(document.body).backgroundColor;
    const r = c.getBoundingClientRect();
    const envoi = document.querySelector('.compose__send').getBoundingClientRect();
    return {
      bordure: s.borderTopWidth, couleurBordure: s.borderTopColor,
      remplissage: s.backgroundColor, fond,
      envoiDedans: envoi.left >= r.left && envoi.right <= r.right + 1,
    };
  });
  const lire = (c) => (c.match(/[\d.]+/g) || []).slice(0, 3).map(Number);
  const [r1, g1, b1] = lire(vu.remplissage);
  const [r2, g2, b2] = lire(vu.fond);
  const contraste = Math.abs(r1 - r2) + Math.abs(g1 - g2) + Math.abs(b1 - b2);
  const bordure = parseFloat(vu.bordure) || 0;
  if (contraste < 12 && bordure < 1) {
    throw new Error(`ni contraste (${contraste}) ni bordure (${bordure}px) : le champ est invisible`);
  }
  if (!vu.envoiDedans) throw new Error("le bouton d'envoi est posé à côté du champ, pas dedans");
});

await step("arrivé directement sur l'assistant, le retour mène à l'accueil", async () => {
  await p.goto(BASE + '#/assistant');
  await p.reload({ waitUntil: 'networkidle' });
  await p.waitForSelector('.compose__field');
  await p.waitForTimeout(400);
  await p.click('.ds-topbar [aria-label="Retour"]');
  await p.waitForTimeout(500);
  const ou = await p.evaluate(() => location.hash);
  if (ou !== '#/' && ou !== '') throw new Error(`retour sur « ${ou} »`);
});

await p.goto(BASE + '#/assistant');
await p.waitForTimeout(400);
await p.screenshot({ path: `${SHOT}/A-assistant.png` });
await b.close();

console.log(errors.length ? `\n${errors.length} erreur(s) :\n- ${errors.join('\n- ')}` : '\nAucune erreur.');
process.exit(errors.length ? 1 : 0);
