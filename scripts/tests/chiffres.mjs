/**
 * Les chiffres romains doublés de leur valeur.
 *
 * Deux exigences opposées, et c'est la seconde qui est difficile :
 *   1. « Louis XVI » doit devenir « Louis XVI (16) », partout où on lit.
 *   2. « CDI », « CDD », « Le siècle », « Ce mot » ne doivent JAMAIS être pris
 *      pour des chiffres — or « CDI » est un chiffre romain valide (401) et
 *      « Le » se lit L (50) suivi d'un suffixe ordinal. Un contrat de travail
 *      annoté « (401) » au milieu du programme serait pire que rien.
 */
import pw from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pw;
const BASE = 'http://127.0.0.1:8099/';
const errors = [];
const step = async (n, f) => { try { await f(); console.log(`  ok  ${n}`); } catch (e) { console.log(`  FAIL ${n}: ${e.message}`); errors.push(`${n}: ${e.message}`); } };

/* ------------------------------------------------- 1. la conversion seule */

const { valeurRomaine } = await import('../../js/lib/chiffres.js');

await step('la lecture d’un chiffre romain est juste', async () => {
  const attendus = [['I', 1], ['IV', 4], ['V', 5], ['IX', 9], ['XIV', 14], ['XVI', 16],
    ['XVIII', 18], ['XIX', 19], ['XX', 20], ['L', 50], ['C', 100], ['CDI', 401], ['MCMXCIV', 1994]];
  for (const [s, n] of attendus) {
    const v = valeurRomaine(s);
    if (v !== n) throw new Error(`« ${s} » lu ${v} au lieu de ${n}`);
  }
});

await step('ce qui n’est pas un chiffre romain est refusé', async () => {
  for (const s of ['IL', 'CDD', 'MIC', 'VV', 'IIII', 'XM', 'ABC', '', 'Le', 've']) {
    const v = valeurRomaine(s);
    if (v !== null) throw new Error(`« ${s} » accepté et lu ${v}`);
  }
});

/* ------------------------------------------------- 2. l'annotation en page */

const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 393, height: 734 }, locale: 'fr-FR' });
const p = await ctx.newPage();
p.on('pageerror', (e) => errors.push(e.message));
await p.goto(BASE, { waitUntil: 'networkidle' });
await p.fill('#ob-name', 'Abdellah'); await p.click('button[type=submit]');
await p.waitForSelector('.accueil__hero');

/** Le texte d'un écran, une fois annoté. */
const texteDe = async (url, attendre = 'body') => {
  await p.goto(BASE + '#/');
  await p.goto(BASE + url);
  await p.waitForSelector(attendre);
  await p.waitForTimeout(700);
  return p.evaluate(() => document.getElementById('app').textContent.replace(/\s+/g, ' '));
};

await step('dans un chapitre, les rois portent leur chiffre', async () => {
  const t = await texteDe('#/histoire/c/ch05', '.card');
  if (!/Louis XIV\s*\(14\)/.test(t)) throw new Error('« Louis XIV (14) » introuvable');
  if (/Louis XIV(?!\s*\()/.test(t.replace(/Louis XIV\s*\(14\)/g, ''))) {
    throw new Error('un « Louis XIV » est resté sans chiffre');
  }
});

await step('dans un tableau d’enquête, les républiques portent le leur', async () => {
  const t = await texteDe('#/tableaux/regimes', '.fiche');
  for (const [ordre, n] of [['Ire', 1], ['IIe', 2], ['Ve', 5]]) {
    if (!new RegExp(`${ordre} République\\s*\\(${n}\\)`).test(t)) {
      throw new Error(`« ${ordre} République (${n}) » introuvable`);
    }
  }
  if (!/Napoléon III\s*\(3\)/.test(t)) throw new Error('« Napoléon III (3) » introuvable');
});

await step('le suffixe en exposant n’empêche pas l’annotation', async () => {
  const t = await texteDe('#/livret/c/p4-i', '.card');
  /* On regarde ce qui suit IMMÉDIATEMENT l'exposant, et non le paragraphe
     entier : une parenthèse chiffrée trente mots plus loin ne prouverait rien,
     et un « (dramaturge) » sans chiffre ferait échouer un contrôle pourtant
     satisfait. */
  const exposants = await p.evaluate(() => {
    const out = [];
    for (const sup of document.querySelectorAll('#app sup')) {
      const avant = (sup.previousSibling?.nodeValue || '').trimEnd();
      if (!/[IVXLCDM]$/.test(avant)) continue;
      let suite = '';
      for (let n = sup.nextSibling; n && suite.length < 44; n = n.nextSibling) suite += n.textContent;
      out.push({ chiffre: avant.match(/[IVXLCDM]+$/)[0], suite: suite.slice(0, 44) });
    }
    return out;
  });
  if (!exposants.length) throw new Error('aucun chiffre en exposant sur cette page : le contrôle ne prouverait rien');
  for (const e of exposants) {
    if (!/\(\d+\)/.test(e.suite)) {
      throw new Error(`« ${e.chiffre}^e » non annoté, suivi de « ${e.suite.trim()} »`);
    }
  }
  if (!/\(\d+\)/.test(t)) throw new Error('aucune annotation sur cette page');
});

/* C'est ici que tout se joue : le corpus est plein de mots qui RESSEMBLENT à
   des chiffres romains. */
await step('aucun mot français n’est pris pour un chiffre', async () => {
  const ECRANS = ['#/histoire/c/ch09', '#/livret/partie-3', '#/cours/droits-devoirs', '#/tableaux/pouvoirs', '#/'];
  const pieges = [];
  for (const url of ECRANS) {
    const t = await texteDe(url, 'body');
    // Un mot courant suivi d'une parenthèse chiffrée : c'est un faux positif.
    for (const m of t.matchAll(/(\S+)\s*\((\d+)\)/g)) {
      const avant = m[1];
      const bon = /^(?:[IVXLCDM]+(?:ers?|res?|ères?|es?|èmes?)?|République|Républiques|siècle|siècles|Empire|arrondissement)$/.test(avant);
      if (!bon) pieges.push(`${url} : « ${avant} (${m[2]}) »`);
    }
  }
  if (pieges.length) throw new Error(pieges.slice(0, 3).join(' ; '));
});

await step('« CDI » et « CDD » restent des contrats, pas des nombres', async () => {
  const trouve = await p.evaluate(async () => {
    const { annoterRomains } = await import('./js/lib/chiffres.js');
    const d = document.createElement('div');
    d.innerHTML = '<p>Un CDI, un CDD, le CM2, un MIC. Le siècle dernier. Ce texte. De même. '
      + 'Louis XVI régna. La Ve République. Le XIXe siècle. Acte II.</p>';
    document.body.append(d);
    annoterRomains(d);
    const t = d.textContent;
    d.remove();
    return t;
  });
  for (const mot of ['CDI', 'CDD', 'CM2', 'MIC', 'Le siècle', 'Ce texte', 'De même']) {
    const i = trouve.indexOf(mot);
    if (i === -1) throw new Error(`« ${mot} » a disparu du texte`);
    if (/^\s*\(\d+\)/.test(trouve.slice(i + mot.length))) {
      throw new Error(`« ${mot} » a été annoté comme un chiffre`);
    }
  }
  for (const [expr, n] of [['Louis XVI', 16], ['Ve République', 5], ['XIXe siècle', 19], ['Acte II', 2]]) {
    if (!trouve.includes(`${expr} (${n})`)) throw new Error(`« ${expr} (${n}) » attendu, absent`);
  }
});

await step('repasser deux fois n’ajoute pas deux fois le chiffre', async () => {
  const t = await p.evaluate(async () => {
    const { annoterRomains } = await import('./js/lib/chiffres.js');
    const d = document.createElement('div');
    d.innerHTML = '<p>Louis XVI et la Ve République.</p>';
    document.body.append(d);
    annoterRomains(d);
    annoterRomains(d);
    annoterRomains(d);
    const out = d.textContent;
    d.remove();
    return out;
  });
  if (/\(\d+\)\s*\(\d+\)/.test(t)) throw new Error(`chiffre doublé : « ${t} »`);
  if (!/Louis XVI \(16\)/.test(t)) throw new Error(`annotation perdue : « ${t} »`);
});

await step('le texte arabe n’est pas touché', async () => {
  const t = await p.evaluate(async () => {
    const { annoterRomains } = await import('./js/lib/chiffres.js');
    const d = document.createElement('div');
    d.innerHTML = '<div dir="rtl" lang="ar"><p>Louis XVI et la Ve République</p></div>';
    document.body.append(d);
    annoterRomains(d);
    const out = d.textContent;
    d.remove();
    return out;
  });
  if (/\(\d+\)/.test(t)) throw new Error(`l'arabe a été annoté : « ${t} »`);
});

await step('les données ne sont pas modifiées : seul l’affichage l’est', async () => {
  const brut = await p.evaluate(async () => {
    const { CHAPITRE_BY_KEY } = await import('./js/data/roman.js');
    const { TABLEAU_BY_KEY } = await import('./js/data/tableaux.js');
    return {
      chapitre: CHAPITRE_BY_KEY.get('ch05').html,
      fiche: JSON.stringify(TABLEAU_BY_KEY.get('regimes').noeuds),
    };
  });
  if (/\(\d+\)/.test(brut.chapitre.replace(/\(\d+\s*(?:av|ap)/g, ''))) {
    // Une date entre parenthèses est légitime ; c'est l'annotation qu'on traque.
    if (/(?:XIV|XVI|Ve|IIe)\s*\(\d+\)/.test(brut.chapitre)) throw new Error('le chapitre a été modifié dans les données');
  }
  if (/(?:XIV|XVI|III)\s*\(\d+\)/.test(brut.fiche)) throw new Error('les fiches ont été modifiées dans les données');
});

await b.close();
console.log(errors.length ? `\n${errors.length} erreur(s) :\n- ${errors.join('\n- ')}` : '\nAucune erreur.');
process.exit(errors.length ? 1 : 0);
