/**
 * Repérage des mots du glossaire dans un texte déjà rendu.
 *
 * Le marquage se fait sur le DOM, jamais par remplacement dans la chaîne HTML :
 * une expression régulière lâchée sur du HTML finit toujours par couper une
 * balise ou par marquer un mot à l'intérieur d'un attribut. Ici, on ne
 * parcourt que des nœuds de texte — le balisage d'origine est intouchable.
 *
 * Seule la PREMIÈRE occurrence de chaque terme est marquée dans un chapitre.
 * Un texte où le même mot est souligné huit fois devient illisible, et le
 * soulignement cesse d'attirer l'œil là où il sert.
 */

import { FORMES, PAR_TERME } from '../data/glossaire.js';

/** Les mots à l'intérieur de ces éléments ne sont pas marqués. */
const IGNORER = new Set(['A', 'BUTTON', 'CODE', 'SCRIPT', 'STYLE', 'MARK', 'H1', 'H2', 'H3', 'H4']);

/** Échappe une chaîne pour l'insérer dans une expression régulière. */
function echapper(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Frontière de mot tolérante aux accents et à l'apostrophe.
 *
 * `\b` de JavaScript considère « é » comme une frontière : « présumé » se
 * ferait couper en plein milieu. On vérifie donc soi-même ce qui entoure.
 */
const LETTRE = /[0-9A-Za-zÀ-ÖØ-öø-ÿ]/;

function estIsole(texte, debut, fin) {
  const avant = texte[debut - 1];
  const apres = texte[fin];
  if (avant && LETTRE.test(avant)) return false;
  if (apres && LETTRE.test(apres)) return false;
  return true;
}

/**
 * Marque les termes du glossaire dans `racine`.
 * `onOuvrir(entree)` est appelé au clic sur un mot marqué.
 * Renvoie la liste des termes effectivement rencontrés, dans l'ordre du texte.
 */
export function marquer(racine, onOuvrir) {
  const dejaVus = new Set();
  const rencontres = [];

  const promeneur = document.createTreeWalker(racine, NodeFilter.SHOW_TEXT, {
    acceptNode(n) {
      if (!n.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
      for (let p = n.parentElement; p && p !== racine; p = p.parentElement) {
        if (IGNORER.has(p.tagName) || p.classList.contains('gloss')) return NodeFilter.FILTER_REJECT;
      }
      return NodeFilter.FILTER_ACCEPT;
    },
  });

  // On collecte d'abord, on remplace ensuite : modifier l'arbre pendant qu'on
  // le parcourt ferait sauter des nœuds au promeneur.
  const noeuds = [];
  let n;
  while ((n = promeneur.nextNode())) noeuds.push(n);

  for (const noeud of noeuds) {
    const texte = noeud.nodeValue;
    let trouve = null;

    for (const { forme, terme } of FORMES) {
      if (dejaVus.has(terme)) continue;
      const i = texte.indexOf(forme);
      if (i === -1) continue;
      if (!estIsole(texte, i, i + forme.length)) continue;
      // On garde la correspondance la plus à gauche ; les suivantes seront
      // traitées au tour d'après, sur le reste du nœud.
      if (!trouve || i < trouve.i) trouve = { i, forme, terme };
    }

    if (!trouve) continue;

    const entree = PAR_TERME.get(trouve.terme);
    dejaVus.add(trouve.terme);
    rencontres.push(entree);

    const avant = texte.slice(0, trouve.i);
    const apres = texte.slice(trouve.i + trouve.forme.length);

    const bouton = document.createElement('button');
    bouton.type = 'button';
    bouton.className = 'gloss';
    bouton.textContent = trouve.forme;
    bouton.setAttribute('aria-label', `${trouve.forme} — voir la définition`);
    bouton.addEventListener('click', (ev) => { ev.preventDefault(); onOuvrir(entree); });

    const suite = document.createTextNode(apres);
    noeud.nodeValue = avant;
    noeud.after(bouton, suite);

    // Le reste du nœud peut contenir d'autres termes : on le repasse.
    noeuds.push(suite);
  }

  return rencontres;
}

/** Termes du glossaire présents dans un fragment HTML, sans le modifier. */
export function termesDe(html) {
  const bac = document.createElement('div');
  bac.innerHTML = html;
  const texte = bac.textContent;
  const vus = new Set();
  const out = [];
  for (const { forme, terme } of FORMES) {
    if (vus.has(terme)) continue;
    const i = texte.indexOf(forme);
    if (i === -1 || !estIsole(texte, i, i + forme.length)) continue;
    vus.add(terme);
    out.push(PAR_TERME.get(terme));
  }
  return out;
}
