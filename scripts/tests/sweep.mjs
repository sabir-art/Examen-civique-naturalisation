/**
 * Balayage complet : chaque écran, dans plusieurs états, à plusieurs largeurs.
 * Cherche les débordements horizontaux, les éléments recouverts, les textes
 * tronqués, les erreurs console et les ressources manquantes.
 */
import pw from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pw;

const BASE = 'http://127.0.0.1:8099/';
const SHOT = './scripts/tests/captures';
const problemes = [];
const vu = new Set();
const note = (m) => { if (!vu.has(m)) { vu.add(m); problemes.push(m); } };

const ROUTES = [
  '#/', '#/histoire', '#/histoire/a/acte-1', '#/histoire/c/ch01', '#/histoire/c/ch22', '#/histoire/glossaire',
  '#/reviser', '#/reviser/t/institutions', '#/reviser/t/principes-valeurs',
  '#/examen', '#/examen/officiel', '#/examen/livret', '#/examen/mixte',
  '#/cours', '#/cours/principes-valeurs',
  '#/livret', '#/livret/p/p1', '#/livret/c/p1-i',
  '#/progres', '#/parcours', '#/compte', '#/compte/ia', '#/compte/synchronisation', '#/compte/a-propos',
  '#/assistant', '#/cartes', '#/recherche', '#/activite',
];

const browser = await chromium.launch();

for (const [largeur, hauteur] of [[320, 568], [390, 844], [430, 932]]) {
  const ctx = await browser.newContext({ viewport: { width: largeur, height: hauteur }, locale: 'fr-FR' });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => note(`${largeur}px — erreur JS : ${e.message}`));
  page.on('console', (m) => {
    if (m.type() === 'error' && !/40[0-9] \(/.test(m.text())) note(`${largeur}px — console : ${m.text().slice(0, 120)}`);
  });
  page.on('requestfailed', (r) => {
    const u = r.url();
    if (u.startsWith(BASE)) note(`${largeur}px — ressource introuvable : ${u.replace(BASE, '')}`);
  });

  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.fill('#ob-name', 'Abdellah');
  await page.click('button[type=submit]');
  await page.waitForSelector('.greet__hello');

  // Un peu de progression pour que les écrans ne soient pas tous vides.
  await page.evaluate(() => {
    const raw = JSON.parse(localStorage.getItem('examen-civique.v1'));
    for (const p of Object.values(raw.profiles)) {
      p.goalDate = '2026-08-28';
      p.read = { ch01: Date.now(), ch02: Date.now() };
      p.exams = [{ id: 'x', mode: 'officiel', date: Date.now(), score: 34, total: 40, durationSec: 1500, byTheme: {} }];
      for (let i = 0; i < 30; i++) p.progress[`sym${String(i + 1).padStart(2, '0')}`] = { box: 3, seen: 2, ok: 1, ko: 1, last: Date.now(), due: 0 };
    }
    localStorage.setItem('examen-civique.v1', JSON.stringify(raw));
  });

  for (const route of ROUTES) {
    await page.goto(BASE + route);
    await page.waitForTimeout(320);

    const r = await page.evaluate(() => {
      const out = { debordement: null, tronques: [], recouverts: [], vides: [] };
      const doc = document.documentElement;
      if (doc.scrollWidth > doc.clientWidth + 1) out.debordement = `${doc.scrollWidth} > ${doc.clientWidth}`;

      const SVG_NS = 'http://www.w3.org/2000/svg';
      const nom = (el) => (typeof el.className === 'string' && el.className) || el.getAttribute?.('class') || el.tagName;

      for (const el of document.querySelectorAll('.app *')) {
        const cs = getComputedStyle(el);
        if (cs.display === 'none' || cs.visibility === 'hidden') continue;
        const b = el.getBoundingClientRect();
        if (b.width === 0 || b.height === 0) continue;

        if (el.namespaceURI === SVG_NS) {
          // Dans un SVG, ce qui coupe le texte n'est pas `overflow` mais le
          // cadre de vue : `scrollWidth` n'y veut rien dire. On compare donc
          // l'encombrement réel du tracé à la largeur du viewBox.
          if (el.tagName === 'text') {
            const racine = el.ownerSVGElement;
            const vb = racine?.viewBox?.baseVal;
            if (vb && vb.width) {
              const boite = el.getBBox();
              if (boite.x < vb.x - 0.5 || boite.x + boite.width > vb.x + vb.width + 0.5) {
                out.tronques.push(`${nom(el)} « ${el.textContent.trim().slice(0, 30)} » sort du cadre (${Math.round(boite.x)}…${Math.round(boite.x + boite.width)} pour 0…${vb.width})`);
              }
            }
          }
          continue;
        }

        // texte coupé horizontalement
        if (el.children.length === 0 && el.scrollWidth > el.clientWidth + 2 && cs.overflowX !== 'auto' && cs.overflowX !== 'scroll') {
          out.tronques.push(`${nom(el)} « ${el.textContent.trim().slice(0, 30)} »`);
        }
        // débordement à droite du cadre de l'application
        if (b.right > doc.clientWidth + 2) {
          out.recouverts.push(`${nom(el)} déborde jusqu'à ${Math.round(b.right)}`);
        }
        // bouton sans libellé ni icône
        if ((el.tagName === 'BUTTON' || (el.tagName === 'A' && el.className.includes('btn')))
            && !el.textContent.trim() && !el.querySelector('svg, img')) {
          out.vides.push(nom(el));
        }
      }
      return out;
    });

    if (r.debordement) note(`${largeur}px ${route} — la page défile horizontalement (${r.debordement})`);
    for (const t of r.tronques.slice(0, 3)) note(`${largeur}px ${route} — texte tronqué : ${t}`);
    for (const t of r.recouverts.slice(0, 3)) note(`${largeur}px ${route} — ${t}`);
    for (const t of r.vides.slice(0, 3)) note(`${largeur}px ${route} — bouton vide : ${t}`);

    // la barre d'onglets ne doit jamais recouvrir le dernier élément utile
    const cache = await page.evaluate(() => {
      const tb = document.querySelector('.tabbar');
      if (!tb || tb.hidden) return null;
      const t = tb.getBoundingClientRect();
      window.scrollTo(0, document.body.scrollHeight);
      const derniers = [...document.querySelectorAll('.app a, .app button')].slice(-3);
      const noyes = derniers.filter((el) => {
        const b = el.getBoundingClientRect();
        return b.height > 0 && b.top < t.bottom && b.bottom > t.top;
      }).map((el) => el.textContent.trim().slice(0, 26) || el.className);
      window.scrollTo(0, 0);
      return noyes;
    });
    if (cache?.length) note(`${largeur}px ${route} — recouvert par la barre d'onglets en bas de page : ${cache.join(' / ')}`);
  }
  await ctx.close();
}

await browser.close();
console.log(problemes.length ? `${problemes.length} problème(s) :\n- ${problemes.join('\n- ')}` : 'Aucun problème détecté.');
process.exit(problemes.length ? 1 : 0);
