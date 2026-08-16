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
  if (await p.locator('.chatbar').count()) throw new Error('un champ de discussion sans fournisseur');
});

await step("sans clé, le chapitre ne propose pas de poser une question", async () => {
  await p.goto(BASE + '#/histoire/c/ch09');
  await p.waitForTimeout(500);
  if (await p.locator('button:has-text("Une question sur ce chapitre")').count()) {
    throw new Error('bouton proposé alors qu’aucune IA n’est branchée');
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

/* ------------------------------------------------------------- le contexte */

await step("depuis une fiche de glossaire, la question part avec le mot", async () => {
  await p.goto(BASE + '#/histoire/c/ch09');
  await p.waitForSelector('.gloss');
  await p.locator('.gloss').first().click();
  await p.waitForSelector('.modal__panel');
  const terme = (await p.locator('.modal__title').textContent()).trim();
  await p.click('.modal__panel button:has-text("Demander à l’assistant")');
  await p.waitForSelector('.chat__field');
  const ecrit = await p.inputValue('.chat__field');
  if (!ecrit.includes(terme)) throw new Error(`« ${terme} » absent de la demande préparée : « ${ecrit.slice(0, 80)} »`);
});

await step("depuis un chapitre, la question part avec le titre du chapitre", async () => {
  await p.goto(BASE + '#/histoire/c/ch09');
  await p.waitForTimeout(500);
  const titre = (await p.locator('.chapitre__titre, .card__title, h1').first().textContent()).trim();
  await p.click('button:has-text("Une question sur ce chapitre")');
  await p.waitForSelector('.chat__field');
  const ecrit = await p.inputValue('.chat__field');
  if (!ecrit.toLowerCase().includes(titre.toLowerCase().slice(0, 12))) {
    throw new Error(`le chapitre n'est pas nommé : « ${ecrit.slice(0, 90)} »`);
  }
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
  await p.waitForSelector('.chat__field');
  await p.fill('.chat__field', 'Et après, que s’est-il passé ?');
  await p.click('.chat__send');
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
  await p.waitForSelector('.chat__field');
  await p.waitForTimeout(300);

  await p.evaluate(() => { window.location.hash = '#/histoire/c/ch09'; });
  await p.waitForSelector('.gloss');
  await p.waitForTimeout(600);
  const apres = await p.evaluate(() => window.scrollY);
  if (Math.abs(apres - avant) > 40) {
    throw new Error(`lecture reprise à ${apres} au lieu de ${avant}`);
  }
});

await p.goto(BASE + '#/assistant');
await p.waitForTimeout(400);
await p.screenshot({ path: `${SHOT}/A-assistant.png` });
await b.close();

console.log(errors.length ? `\n${errors.length} erreur(s) :\n- ${errors.join('\n- ')}` : '\nAucune erreur.');
process.exit(errors.length ? 1 : 0);
