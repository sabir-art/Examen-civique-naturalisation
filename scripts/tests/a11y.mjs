import pw from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pw;
const BASE = 'http://127.0.0.1:8099/';
const errors = [];
const browser = await chromium.launch();

const lum = (hex) => {
  const [r, g, b] = hex.match(/\d+(\.\d+)?/g).slice(0, 3).map(Number).map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => {
  const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
};

const CAS = [
  ['light', 'auto'], ['dark', 'auto'],
  ['light', 'light'], ['dark', 'light'],
  ['light', 'dark'], ['dark', 'dark'],
];
for (const [scheme, choix] of CAS) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, colorScheme: scheme, locale: 'fr-FR' });
  const p = await ctx.newPage();
  await p.goto(BASE, { waitUntil: 'networkidle' });
  await p.fill('#ob-name', 'Sabir'); await p.click('button[type=submit]');
  await p.waitForSelector('.greet__hello');
  // Réglage explicite du thème, comme depuis Mon compte → Apparence.
  await p.evaluate((c) => {
    const raw = JSON.parse(localStorage.getItem('examen-civique.v1'));
    for (const pr of Object.values(raw.profiles)) pr.settings.theme = c;
    localStorage.setItem('examen-civique.v1', JSON.stringify(raw));
  }, choix);
  await p.reload({ waitUntil: 'networkidle' });
  await p.waitForSelector('.greet__hello');

  // Toutes les familles de boutons doivent être couvertes : les écrans de
  // réglages et la boîte de confirmation sont les seuls à porter les variantes
  // « ghost », « quiet » et « danger ».
  for (const route of ['#/', '#/reviser', '#/examen', '#/progres', '#/parcours', '#/histoire',
                       '#/compte', '#/compte/ia', '#/livret', '#/cours',
                       '#/recherche', '#/activite', '#/histoire/glossaire']) {
    await p.goto(BASE + route);
    await p.waitForTimeout(350);

    // contraste du texte
    const bad = await p.evaluate(() => {
      const out = [];
      // Renvoie null si un ancêtre porte un dégradé : la couleur derrière le
      // texte n'est alors pas mesurable de façon fiable, on ne juge pas.
      const bgOf = (el) => {
        let n = el;
        while (n && n !== document.documentElement) {
          const cs = getComputedStyle(n);
          if (cs.backgroundImage && cs.backgroundImage !== 'none') return null;
          const c = cs.backgroundColor;
          if (c && !/rgba\(0, 0, 0, 0\)|transparent/.test(c)) return c;
          n = n.parentElement;
        }
        return getComputedStyle(document.body).backgroundColor;
      };
      for (const el of document.querySelectorAll('.app *')) {
        if (!el.childNodes.length) continue;
        const txt = [...el.childNodes].filter((n) => n.nodeType === 3 && n.textContent.trim()).map((n) => n.textContent.trim()).join('');
        if (!txt) continue;
        const cs = getComputedStyle(el);
        if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity === 0) continue;
        const bg = bgOf(el);
        if (!bg) continue;
        out.push({ txt: txt.slice(0, 34), fg: cs.color, bg, size: parseFloat(cs.fontSize), weight: +cs.fontWeight || 400 });
      }
      return out;
    });
    for (const t of bad) {
      const r = ratio(t.fg, t.bg);
      const gros = t.size >= 24 || (t.size >= 18.66 && t.weight >= 700);
      const seuil = gros ? 3 : 4.5;
      if (r < seuil) errors.push(`${scheme}/${choix} ${route} — contraste ${r.toFixed(2)} (< ${seuil}) sur « ${t.txt} » ${t.fg} sur ${t.bg}`);
    }

    // cibles tactiles
    const petits = await p.evaluate(() => {
      const out = [];
      for (const el of document.querySelectorAll('.app a, .app button, .tabbar a')) {
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) continue;
        // Un lien au fil du texte n'est pas une cible autonome : la règle de
        // taille minimale ne s'y applique pas (exception « inline » du WCAG).
        const inline = el.tagName === 'A' && /^(P|SPAN|LI|DIV)$/.test(el.parentElement?.tagName || '')
          && el.parentElement.textContent.trim() !== el.textContent.trim();
        if (r.height < 40 && !inline && !el.classList.contains('linkbtn')) out.push(`${el.className || el.tagName} ${Math.round(r.width)}×${Math.round(r.height)} « ${el.textContent.trim().slice(0, 24)} »`);
      }
      return out;
    });
    for (const s of petits) errors.push(`${scheme}/${choix} ${route} — cible tactile ${s}`);
  }
  // La boîte de confirmation : on la fait apparaître pour de vrai.
  await p.goto(`${BASE}#/reviser/t/institutions`);
  await p.waitForSelector('button:has-text("Commencer")');
  await p.click('button:has-text("Commencer")');
  await p.waitForSelector('.qtext');
  await p.click('.choice >> nth=0');
  await p.click('button:has-text("Valider")');
  await p.waitForSelector('.feedback');
  await p.click('.tab[data-tab="/"]');
  await p.waitForSelector('.modal__panel');
  const boutons = await p.evaluate(() => {
    const out = [];
    for (const b of document.querySelectorAll('.modal__panel .btn, .app .btn')) {
      const span = b.querySelector('span') || b;
      const cs = getComputedStyle(span);
      const bs = getComputedStyle(b);
      out.push({ txt: b.textContent.trim().slice(0, 24), fg: cs.color, bg: bs.backgroundColor, vide: !b.textContent.trim() });
    }
    return out;
  });
  for (const b of boutons) {
    if (b.vide) { errors.push(`${scheme}/${choix} — bouton sans libellé visible`); continue; }
    if (/rgba\(0, 0, 0, 0\)/.test(b.bg)) continue;      // bouton transparent
    const r = ratio(b.fg, b.bg);
    if (r < 4.5) errors.push(`${scheme}/${choix} — bouton « ${b.txt} » contraste ${r.toFixed(2)} (${b.fg} sur ${b.bg})`);
  }
  await ctx.close();
}
await browser.close();
const uniq = [...new Set(errors)];
console.log(uniq.length ? uniq.slice(0, 25).join('\n') + (uniq.length > 25 ? `\n… et ${uniq.length - 25} autres` : '') : 'Aucun problème de contraste ni de cible tactile.');
process.exit(uniq.length ? 1 : 0);
