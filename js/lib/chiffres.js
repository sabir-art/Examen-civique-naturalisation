/**
 * Les chiffres romains, doublés de leur valeur en chiffres arabes.
 *
 * « Louis XVI » devient « Louis XVI (16) », « Ve République » devient
 * « Ve République (5) ». Le romain reste — c'est ainsi qu'il est écrit partout,
 * et c'est ainsi qu'il tombera le jour de l'examen — mais le chiffre familier
 * l'accompagne, pour qui ne déchiffre pas encore XVIII d'un coup d'œil.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *  Pourquoi une reconnaissance par CONTEXTE et non par simple forme
 * ─────────────────────────────────────────────────────────────────────────────
 *  Les lettres romaines sont des lettres françaises. Chercher « une suite de
 *  I V X L C D M » dans ce corpus rapporte MIC, CDI, CDD, CM, IL — et « CDI »
 *  est un chiffre romain parfaitement valide (401) autant qu'un contrat de
 *  travail au programme de l'examen. Pire : « Le siècle » se lit L (50) suivi
 *  du suffixe « e », et « Ce », « De », « Me » de même.
 *
 *  On n'annote donc que dans les deux tournures où un romain est certain :
 *    — précédé d'un nom de souverain ou du mot « acte » : Louis XIV, Acte II ;
 *    — suivi de République, siècle, Empire, arrondissement : Ve République.
 *  Et la valeur doit rester plausible : au-delà de vingt-quatre, ce n'est ni un
 *  siècle, ni une république, ni un roi — c'est un mot français.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Ce qui peut précéder un numéro d'ordre. */
const AVANT = 'Louis|Napoléon|Henri|Charles|François|Philippe|Pie|Clément|Acte|acte';

/** Ce qui peut le suivre. */
const APRES = 'Républiques?|siècles?|Empire|arrondissement';

/** Terminaisons ordinales françaises : Ier, Ire, IIe, XIXe… */
const SUFFIXE = '(?:ers?|res?|ères?|es?|èmes?)?';

const ROMAIN = '[IVXLCDM]{1,7}';
/** Ni lettre ni chiffre juste après : « XIVe » oui, « XIVeme chose » non. */
const FIN = '(?![A-Za-zÀ-ÖØ-öø-ÿ0-9])';

const REGLE_NOM = new RegExp(`\\b(${AVANT})(\\s+)(${ROMAIN})(${SUFFIXE})${FIN}`, 'g');
const REGLE_SUITE = new RegExp(`\\b(${ROMAIN})(${SUFFIXE})(\\s+(?:${APRES}))${FIN}`, 'g');

/**
 * La première borne d'une fourchette : « du Ve au XVe siècle ».
 *
 * Elle n'a pas de nom derrière elle — il est au bout de la fourchette — et
 * échapperait donc aux deux règles précédentes. On exige que l'autre borne en
 * soit un aussi : « V au XV » est une fourchette, « V au bord » n'en est pas
 * une.
 */
const LIEN = '(?:au|à|et|–|—|-)';
const REGLE_BORNE = new RegExp(
  `\\b(${ROMAIN})(${SUFFIXE})(?=\\s+${LIEN}\\s+(${ROMAIN})(${SUFFIXE})${FIN})`, 'g',
);

const VALEURS = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };

/**
 * Valeur d'un chiffre romain, ou null s'il n'en est pas un.
 *
 * La conversion inverse sert de contrôle : « IL » ou « CDD » se convertissent en
 * un nombre qui, réécrit, ne redonne pas la même chaîne. C'est plus sûr qu'une
 * expression rationnelle de validation, et plus court.
 */
export function valeurRomaine(s) {
  if (!s || !/^[IVXLCDM]+$/.test(s)) return null;
  let total = 0;
  for (let i = 0; i < s.length; i++) {
    const v = VALEURS[s[i]];
    const suivant = VALEURS[s[i + 1]] || 0;
    total += v < suivant ? -v : v;
  }
  return enRomain(total) === s ? total : null;
}

const PALIERS = [
  [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'],
  [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I'],
];

function enRomain(n) {
  let reste = n;
  let out = '';
  for (const [valeur, signe] of PALIERS) {
    while (reste >= valeur) { out += signe; reste -= valeur; }
  }
  return out;
}

/** Au-delà, ce n'est plus un roi, un siècle ni une république. */
const PLAFOND = 24;

function plausible(n) {
  return n !== null && n >= 1 && n <= PLAFOND;
}

/* --------------------------------------------------------------- rendu */

/** L'expression annotée : « Louis XVI » suivi de « (16) ». */
function annoter(texte, valeur) {
  const bloc = document.createElement('span');
  bloc.className = 'chiffre';
  bloc.append(texte);
  const arabe = document.createElement('span');
  arabe.className = 'chiffre__arabe';
  // L'espace insécable évite que « (16) » se retrouve seul en début de ligne.
  arabe.textContent = ` (${valeur})`;
  bloc.append(arabe);
  return bloc;
}

const IGNORER = new Set(['SCRIPT', 'STYLE', 'CODE', 'TEXTAREA', 'INPUT', 'SELECT', 'SUP']);

function aIgnorer(noeud, racine) {
  for (let p = noeud.parentElement; p && p !== racine.parentElement; p = p.parentElement) {
    if (IGNORER.has(p.tagName)) return true;
    // Déjà annoté : on ne repasse pas dessus, sinon « (16) (16) ».
    if (p.classList?.contains('chiffre')) return true;
    // L'arabe s'écrit de droite à gauche et ne porte pas ces tournures.
    if (p.getAttribute?.('dir') === 'rtl' || p.getAttribute?.('lang') === 'ar') return true;
  }
  return false;
}

/**
 * Double les chiffres romains d'un sous-arbre déjà affiché.
 *
 * Travaille sur le rendu et non sur les données : les banques de questions, le
 * livret et le récit gardent leur texte d'origine. Rien de ce qui part vers
 * l'IA ou vers un export n'est modifié.
 */
export function annoterRomains(racine) {
  if (!racine || racine.nodeType !== 1) return;

  const promeneur = document.createTreeWalker(racine, NodeFilter.SHOW_TEXT, {
    acceptNode: (n) => (n.nodeValue.trim() && !aIgnorer(n, racine)
      ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT),
  });

  // On collecte avant de modifier : remanier l'arbre pendant le parcours ferait
  // sauter des nœuds au promeneur.
  const noeuds = [];
  let n;
  while ((n = promeneur.nextNode())) noeuds.push(n);

  for (const noeud of noeuds) traiterTexte(noeud);
  for (const sup of [...racine.querySelectorAll('sup')]) traiterExposant(sup, racine);
}

/** Les deux tournures, à l'intérieur d'un même bout de texte. */
function traiterTexte(noeud) {
  const texte = noeud.nodeValue;
  const trouves = [];

  for (const m of texte.matchAll(REGLE_NOM)) {
    const valeur = valeurRomaine(m[3]);
    if (plausible(valeur)) trouves.push({ debut: m.index, fin: m.index + m[0].length, valeur });
  }
  for (const m of texte.matchAll(REGLE_SUITE)) {
    const valeur = valeurRomaine(m[1]);
    if (plausible(valeur)) trouves.push({ debut: m.index, fin: m.index + m[0].length, valeur });
  }
  for (const m of texte.matchAll(REGLE_BORNE)) {
    const valeur = valeurRomaine(m[1]);
    // L'autre borne doit être un chiffre elle aussi, sans quoi ce n'est pas
    // une fourchette mais une coïncidence.
    if (plausible(valeur) && plausible(valeurRomaine(m[3]))) {
      trouves.push({ debut: m.index, fin: m.index + m[0].length, valeur });
    }
  }
  if (!trouves.length) return;

  /* De droite à gauche. Après chaque découpe, `noeud` ne contient plus que le
     texte situé À GAUCHE de l'occurrence traitée : les positions des
     occurrences restantes, toutes plus à gauche, demeurent donc exactes. Dans
     l'autre sens, chaque découpe les décalerait. */
  trouves.sort((a, b) => b.debut - a.debut);

  let borne = Infinity;
  for (const t of trouves) {
    // Les deux règles peuvent tomber sur la même expression ; on ne pose
    // qu'une annotation, sinon « Louis XIV (14) (14) ».
    if (t.fin > borne) continue;
    borne = t.debut;
    noeud.splitText(t.fin);
    const milieu = noeud.splitText(t.debut);
    milieu.replaceWith(annoter(milieu.nodeValue, t.valeur));
  }
}

/**
 * Le cas où le suffixe est en exposant : « V<sup>e</sup> République ».
 *
 * Le texte est alors coupé en trois nœuds, et aucune expression rationnelle ne
 * peut le voir d'un bloc. On reconstitue la tournure à partir de l'exposant.
 */
function traiterExposant(sup, racine) {
  const avant = sup.previousSibling;
  const apres = sup.nextSibling;
  if (!avant || avant.nodeType !== 3 || !apres || apres.nodeType !== 3) return;
  if (aIgnorer(sup, racine)) return;

  const chiffre = avant.nodeValue.match(new RegExp(`(${ROMAIN})$`));
  if (!chiffre) return;
  const valeur = valeurRomaine(chiffre[1]);
  if (!plausible(valeur)) return;

  // Soit le nom suit — « V^e République » —, et l'annotation se pose après lui ;
  // soit c'est la première borne d'une fourchette — « V^e au XV^e siècle » —, et
  // elle se pose juste après l'exposant, le nom étant à l'autre bout.
  const suite = apres.nodeValue.match(new RegExp(`^(\\s+(?:${APRES}))${FIN}`));
  const borne = suite ? null : apres.nodeValue.match(new RegExp(`^\\s+${LIEN}\\s+(${ROMAIN})`));
  if (!suite && !(borne && plausible(valeurRomaine(borne[1])))) return;

  const arabe = document.createElement('span');
  arabe.className = 'chiffre__arabe';
  arabe.textContent = ` (${valeur})`;
  if (suite) apres.splitText(suite[1].length).before(arabe);
  else apres.before(arabe);
}
