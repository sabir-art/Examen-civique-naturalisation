/**
 * Contrôle d'intégrité de la traduction arabe du récit.
 *
 * Le mode bilingue pose chaque paragraphe arabe sous son paragraphe français.
 * Cela n'a de sens que si les deux versions ont le MÊME nombre de blocs, dans
 * le même ordre. Une traduction qui fusionne deux paragraphes en un décale
 * tout le reste du chapitre, en silence : rien ne plante, mais les textes ne
 * se correspondent plus. D'où ce contrôle.
 *
 * Il vérifie aussi qu'aucun chapitre ne manque, qu'aucun texte français n'a
 * été laissé tel quel dans la version arabe, et que chaque encadré « à
 * retenir » a le même nombre de points.
 */

const { CHAPITRES } = await import('../js/data/roman.js');
const { AR_BY_KEY } = await import('../js/data/roman-ar.js');

const problemes = [];
const ko = (m) => problemes.push(m);

/** Balises de premier niveau, dans l'ordre. Sans DOM : on lit la chaîne. */
function blocsDe(html) {
  return [...String(html).matchAll(/<(p|h4|ul|ol|blockquote)[\s>]/g)].map((m) => m[1]);
}

/** Proportion de caractères arabes dans un texte, hors balises et parenthèses. */
function partArabe(html) {
  const texte = String(html)
    .replace(/<span class="lat">[^<]*<\/span>/g, ' ')  // formes françaises assumées
    .replace(/<[^>]+>/g, ' ')
    .replace(/[^\p{L}]/gu, '');
  if (!texte) return 0;
  const arabes = (texte.match(/[؀-ۿ]/g) || []).length;
  return arabes / texte.length;
}

console.log('Contrôle de la traduction arabe du récit\n');

for (const c of CHAPITRES) {
  const ar = AR_BY_KEY.get(c.key);
  if (!ar) { ko(`${c.key} — chapitre non traduit`); continue; }

  const fr = blocsDe(c.html);
  const tr = blocsDe(ar.html);

  if (fr.length !== tr.length) {
    ko(`${c.key} — ${fr.length} blocs en français, ${tr.length} en arabe (le mode bilingue se décalerait)`);
  } else {
    const divergent = fr.map((b, i) => (b === tr[i] ? null : `${i + 1}: <${b}> ≠ <${tr[i]}>`)).filter(Boolean);
    if (divergent.length) ko(`${c.key} — blocs de nature différente — ${divergent.join(', ')}`);
  }

  if ((c.retenir?.length || 0) !== (ar.retenir?.length || 0)) {
    ko(`${c.key} — « à retenir » : ${c.retenir?.length} points en français, ${ar.retenir?.length} en arabe`);
  }

  for (const [nom, valeur] of [['titre', ar.titre], ['lieu', ar.lieu], ['date', ar.date]]) {
    if (!valeur) ko(`${c.key} — ${nom} manquant en arabe`);
  }

  const part = partArabe(ar.html);
  if (part < 0.8) ko(`${c.key} — seulement ${Math.round(part * 100)} % de caractères arabes : du texte français est resté`);

  const partRetenir = partArabe((ar.retenir || []).join(' '));
  if (partRetenir < 0.8) ko(`${c.key} — « à retenir » : seulement ${Math.round(partRetenir * 100)} % de caractères arabes`);

  if (!problemes.some((p) => p.startsWith(c.key))) {
    console.log(`  ✓ ${c.key.padEnd(6)} ${String(fr.length).padStart(2)} blocs · ${c.retenir.length} points · ${Math.round(part * 100)} % arabe`);
  }
}

console.log(`\n${AR_BY_KEY.size}/${CHAPITRES.length} chapitres traduits`);

if (problemes.length) {
  console.log(`\n✗ ${problemes.length} problème(s) :\n- ${problemes.join('\n- ')}`);
  process.exit(1);
}
console.log('\n✓ Traduction cohérente avec la version française');
