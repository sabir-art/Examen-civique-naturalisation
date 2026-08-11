/**
 * Repérage des mots du glossaire dans un texte.
 *
 * Le marquage se fait sur le DOM, jamais par remplacement dans la chaîne HTML :
 * une expression régulière lâchée sur du HTML finit toujours par couper une
 * balise ou par marquer un mot à l'intérieur d'un attribut. Ici, on ne
 * parcourt que des nœuds de texte — le balisage d'origine est intouchable.
 *
 * Seule la PREMIÈRE occurrence de chaque terme est marquée dans un chapitre.
 * Un texte où le même mot est souligné huit fois devient illisible, et le
 * soulignement cesse d'attirer l'œil là où il sert.
 *
 * `marquer()` et `termesDe()` passent par la MÊME fonction de parcours. C'est
 * délibéré : le glossaire affiché en bas d'un chapitre doit lister exactement
 * les mots soulignés dans le texte, ni un de plus ni un de moins. Deux
 * implémentations parallèles auraient fini par diverger sans que rien ne le
 * signale.
 */

import { FORMES, PAR_TERME } from '../data/glossaire.js';

/** Les mots à l'intérieur de ces éléments ne sont pas marqués. */
const IGNORER = new Set(['A', 'BUTTON', 'CODE', 'SCRIPT', 'STYLE', 'MARK', 'H1', 'H2', 'H3', 'H4']);

/**
 * Frontière de mot tolérante aux accents.
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
 * Parcourt les nœuds de texte de `racine` et repère les termes du glossaire.
 * Si `onOuvrir` est fourni, chaque première occurrence est remplacée par un
 * bouton ; sinon on se contente de relever les termes.
 * Renvoie les entrées rencontrées, dans l'ordre du texte.
 */
function parcourir(racine, onOuvrir) {
  const dejaVus = new Set();
  const rencontres = [];

  /** Le terme le plus à gauche encore jamais vu, dans une chaîne. */
  function premier(texte) {
    let meilleur = null;
    for (const { forme, terme } of FORMES) {
      if (dejaVus.has(terme)) continue;
      const i = texte.indexOf(forme);
      if (i === -1) continue;
      if (!estIsole(texte, i, i + forme.length)) continue;
      if (!meilleur || i < meilleur.i) meilleur = { i, forme, terme };
    }
    return meilleur;
  }

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

  // Un nœud peut contenir plusieurs termes : on épuise sa fin AVANT de passer
  // au nœud suivant. Remettre le reste en fin de file donnerait un ordre de
  // traitement différent de l'ordre de lecture — la liste des mots d'un
  // chapitre ne suivrait plus le texte, alors que c'est tout son intérêt.
  for (const depart of noeuds) {
    let noeud = depart;
    let reste = noeud.nodeValue;

    for (;;) {
      const trouve = premier(reste);
      if (!trouve) break;

      const entree = PAR_TERME.get(trouve.terme);
      dejaVus.add(trouve.terme);
      rencontres.push(entree);

      const fin = trouve.i + trouve.forme.length;

      if (onOuvrir) {
        const bouton = document.createElement('button');
        bouton.type = 'button';
        bouton.className = 'gloss';
        bouton.textContent = trouve.forme;
        // Le mot souligné est la FORME rencontrée (« l'État », « républicains ») ;
        // l'entrée du glossaire porte le TERME (« État », « République »). On
        // garde le lien entre les deux, sans quoi il est impossible de
        // rapprocher le soulignement de la liste affichée en fin de chapitre.
        bouton.dataset.terme = trouve.terme;
        bouton.setAttribute('aria-label', `${trouve.forme} — voir la définition`);
        bouton.addEventListener('click', (ev) => { ev.preventDefault(); onOuvrir(entree); });

        const suite = document.createTextNode(reste.slice(fin));
        noeud.nodeValue = reste.slice(0, trouve.i);
        noeud.after(bouton, suite);
        noeud = suite;
      }

      reste = reste.slice(fin);
    }
  }

  return rencontres;
}

/** Marque les termes dans un texte déjà rendu. `onOuvrir(entree)` au clic. */
export function marquer(racine, onOuvrir) {
  return parcourir(racine, onOuvrir);
}

/** Termes présents dans un fragment HTML, sans le modifier. */
export function termesDe(html) {
  const bac = document.createElement('div');
  bac.innerHTML = html;
  return parcourir(bac, null);
}

/* ------------------------------------------------- index par chapitre */

const CACHE = new Map();

/**
 * Pour chaque chapitre : les mots qu'il contient, et ceux qu'il introduit.
 *
 * Le récit se lit dans l'ordre. Distinguer le mot rencontré pour la première
 * fois de celui qui revient change la façon de lire le glossaire d'un
 * chapitre : on sait quoi apprendre et quoi simplement réviser.
 *
 * Calculé une seule fois, à la première demande — parcourir vingt-deux
 * chapitres à chaque affichage serait du gaspillage.
 */
export function indexChapitres(chapitres) {
  if (CACHE.size) return CACHE;
  const vus = new Set();
  for (const c of chapitres) {
    const termes = termesDe(c.html);
    const nouveaux = termes.filter((t) => !vus.has(t.terme));
    nouveaux.forEach((t) => vus.add(t.terme));
    CACHE.set(c.key, { termes, nouveaux: new Set(nouveaux.map((t) => t.terme)) });
  }
  return CACHE;
}

export function motsDuChapitre(chapitres, key) {
  return indexChapitres(chapitres).get(key) || { termes: [], nouveaux: new Set() };
}
