/**
 * Garde-fou du système de design.
 *
 * Une apparence se défait par petites touches : une couleur écrite en dur
 * « juste pour ce bouton », un rayon de 12px au milieu de rayons de 24, une
 * police système oubliée dans un coin. Aucun de ces écarts ne casse quoi que
 * ce soit, donc rien ne les signale, et six mois plus tard il ne reste du
 * système qu'un souvenir.
 *
 * Ce contrôle lit la feuille de style et refuse :
 *   — toute couleur littérale hors des deux fichiers qui ont le droit d'en
 *     porter (la couche de jetons vendorisée et le bloc de déclinaison nuit) ;
 *   — les capitales forcées, que le système réserve à une micro-étiquette ;
 *   — les dégradés, qu'il interdit partout sauf pour les deux voiles ;
 *   — la disparition d'un jeton dont dépend la couche de correspondance.
 *
 * Il vérifie aussi que le fichier vendorisé n'a pas été retouché : c'est une
 * copie du système fourni, pas un endroit où bricoler.
 */

import { readFileSync, readdirSync } from 'node:fs';

const CIVICA = 'assets/css/civica.css';
const APP = 'assets/css/app.css';

const erreurs = [];
const ok = (m) => console.log(`  ok  ${m}`);
const ko = (m) => { erreurs.push(m); console.log(`  KO  ${m}`); };

const civica = readFileSync(CIVICA, 'utf8');
const app = readFileSync(APP, 'utf8');

/* ------------------------------------------------ 1. les jetons attendus */

/**
 * Les jetons du système dont la feuille de l'application se sert. Si l'un
 * disparaît de la couche vendorisée, toutes les règles qui l'utilisent
 * retombent silencieusement sur « pas de couleur » — le pire des échecs,
 * parce qu'il ne se voit que sur l'écran concerné.
 */
const REQUIS = [
  '--ink-900', '--ink-500', '--ink-200', '--white',
  '--surface-card', '--surface-sunken', '--surface-ink', '--surface-overlay',
  '--bg-app', '--bg-app-tinted',
  '--text-primary', '--text-secondary', '--text-inverse', '--text-inverse-muted', '--text-link',
  '--border-subtle', '--border-default', '--border-focus',
  '--action-primary-bg', '--action-disabled-bg', '--action-disabled-fg', '--action-ghost-bg-hover',
  '--state-correct-fg', '--state-correct-bg', '--state-correct-solid', '--state-correct-border',
  '--state-wrong-fg', '--state-wrong-bg', '--state-wrong-solid', '--state-wrong-border',
  '--state-warning-fg', '--state-warning-bg', '--state-warning-solid',
  '--state-neutral-bg', '--state-neutral-fg',
  '--progress-track', '--progress-track-on-tint',
  '--topic-histoire', '--topic-institutions', '--topic-valeurs', '--topic-symboles', '--topic-societe',
  '--radius-card', '--radius-card-inner', '--radius-hero', '--radius-pill', '--radius-tile',
  '--radius-input', '--radius-sheet', '--radius-circle',
  '--type-h1', '--type-h2', '--type-h3', '--type-body', '--type-body-sm', '--type-label', '--type-caption',
  '--gutter-screen', '--gutter-card', '--stack-card', '--stack-inline', '--stack-section',
  '--bottomnav-height', '--bottomnav-inset', '--topbar-height',
  '--press-scale', '--ease-out', '--ease-spring', '--dur-fast', '--dur-base',
  '--transition-control', '--shadow-xs', '--shadow-nav', '--shadow-sheet',
  '--font-sans', '--font-mono',
];

const manquants = REQUIS.filter((t) => !civica.includes(`${t}:`));
if (manquants.length) ko(`jetons absents de la couche vendorisée : ${manquants.join(', ')}`);
else ok(`les ${REQUIS.length} jetons utilisés par l'application sont bien définis`);

/* --------------------------------- 2. aucune couleur écrite en dur ailleurs */

/**
 * Deux endroits ont le droit de porter des valeurs littérales :
 *   — `civica.css`, qui EST la table des valeurs ;
 *   — le bloc `--nuit-*` de `app.css`, qui écrit la déclinaison sombre que le
 *     système fourni ne contient pas.
 * Partout ailleurs, une couleur doit venir d'un jeton.
 */
const bloc = app.match(/:root \{\n {2}--nuit-bg[\s\S]*?\n\}/);
if (!bloc) {
  ko('bloc de la palette de nuit introuvable : le contrôle ne peut pas distinguer les valeurs légitimes');
} else {
  // Les commentaires sont retirés d'abord, et sur la hauteur qu'ils occupent :
  // la moitié des valeurs citées dans ce fichier le sont pour EXPLIQUER un
  // écart, et un contrôle qui se fait piéger par sa propre documentation ne
  // sert à rien. On remplace chaque bloc par autant de retours à la ligne pour
  // que les numéros restent justes.
  const blanchir = (t) => t.replace(/[^\n]/g, ' ');
  const sansCommentaires = app.replace(/\/\*[\s\S]*?\*\//g, blanchir);
  // On BLANCHIT la palette de nuit au lieu de la retirer : la supprimer
  // décalait toutes les lignes suivantes, et les deux contrôles de ce fichier
  // désignaient alors la même faute à deux endroits différents.
  const reste = sansCommentaires.replace(sansCommentaires.slice(
    sansCommentaires.indexOf(':root {\n  --nuit-bg'),
    sansCommentaires.indexOf('\n}', sansCommentaires.indexOf(':root {\n  --nuit-bg')) + 2,
  ), blanchir);
  const fautives = [];
  reste.split('\n').forEach((ligne, i) => {
    const m = ligne.match(/#[0-9a-fA-F]{3,8}\b/g);
    if (m) fautives.push(`${APP}:${i + 1} ${m.join(' ')} — ${ligne.trim().slice(0, 70)}`);
  });
  // Deux exceptions, nommées pour qu'on les voie. La cocarde d'ouverture est
  // la marque du produit : le bleu-blanc-rouge y est le sujet, pas une
  // décoration. `--gris-lisible` est le gris tertiaire foncé qui remplace
  // celui du système, trop clair pour le seuil AA.
  const admises = fautives.filter((f) => !/boot__ring|--gris-lisible/.test(f));
  if (admises.length) {
    admises.forEach((f) => ko(`couleur écrite en dur : ${f}`));
  } else {
    ok('aucune couleur écrite en dur hors de la couche de jetons et de la cocarde');
  }
}

/* --------------------------------------- 3. les règles de forme du système */

const capitales = app.split('\n')
  .map((l, i) => [l, i + 1])
  // L'exception se déclare dans la feuille, par un commentaire en fin de
  // ligne : elle est ainsi visible à l'endroit où elle est prise.
  .filter(([l]) => /text-transform:\s*uppercase/.test(l) && !/\/\* initiale \*\//.test(l));
if (capitales.length) {
  capitales.forEach(([l, n]) => ko(`capitales forcées en ${APP}:${n} — ${l.trim().slice(0, 60)}`));
} else {
  ok('aucune capitale forcée : la casse de phrase est respectée');
}

const degrades = app.split('\n')
  .map((l, i) => [l, i + 1])
  .filter(([l]) => /linear-gradient|radial-gradient/.test(l) && !/scrim|masque|fondu|mask/.test(l));
if (degrades.length) {
  degrades.forEach(([l, n]) => ko(`dégradé en ${APP}:${n} — ${l.trim().slice(0, 60)}`));
} else {
  ok('aucun dégradé : le système ne veut que des aplats');
}

/* ---------------------------------------- 4. la couche vendorisée est intacte */

/**
 * Empreinte des valeurs qui font l'identité du système. Elles sont recopiées
 * ici à la main : si quelqu'un modifie la couche vendorisée, il faut que le
 * contrôle le dise, et qu'on décide alors si c'est voulu.
 */
const EMPREINTE = {
  '--ink-900': '#141414',
  '--bg-app-tinted': '#E9F1EF',
  '--surface-lavender': '#DEC9F9',
  '--surface-mint': '#C9E7DF',
  '--surface-butter': '#FAE79A',
  '--surface-blush': '#F8D7DC',
  '--radius-card': '24px',
  '--radius-hero': '28px',
  '--bottomnav-height': '64px',
};
const derives = Object.entries(EMPREINTE)
  .filter(([jeton, valeur]) => !civica.includes(`${jeton}:${valeur}`));
if (derives.length) {
  derives.forEach(([j, v]) => ko(`la couche vendorisée a dérivé : ${j} ne vaut plus ${v}`));
} else {
  ok('la couche vendorisée est conforme au système fourni');
}

/* ------------------------- 5. toute classe employée a bien une règle */

/**
 * Le défaut que ce contrôle traque est réel et vécu : en réécrivant un bloc de
 * la feuille de style, des règles encore utilisées ont été emportées. Rien n'a
 * planté, aucun test ne s'en est plaint — mais l'écran d'histoire affichait
 * ses chiffres en texte brut, sans mise en forme. C'est invisible depuis le
 * code : il faut confronter les deux côtés.
 *
 * On relève donc les noms de classe écrits en dur dans le JavaScript et on
 * vérifie que chacun existe dans l'une des deux feuilles. Les noms construits
 * dynamiquement (`class: `x--${clef}``) sont ignorés : impossible de les
 * résoudre sans exécuter le code.
 */
const feuilles = readFileSync(APP, 'utf8')
  + readFileSync('assets/css/civica-components.css', 'utf8')
  + civica;

const sources = [];
const parcourir = (dossier) => {
  for (const e of readdirSync(dossier, { withFileTypes: true })) {
    const chemin = `${dossier}/${e.name}`;
    if (e.isDirectory()) parcourir(chemin);
    else if (e.name.endsWith('.js')) sources.push(chemin);
  }
};
parcourir('js');

const utilisees = new Map();
for (const f of sources) {
  const texte = readFileSync(f, 'utf8');
  for (const m of texte.matchAll(/class: '([^'${}]+)'/g)) {
    for (const nom of m[1].trim().split(/\s+/)) {
      if (nom && !utilisees.has(nom)) utilisees.set(nom, f);
    }
  }
}

// Quelques classes n'ont volontairement pas de règle : elles servent de prise
// au JavaScript ou aux contrôles, jamais à la mise en forme.
const SANS_REGLE = new Set(['grow', 'mt', 'center', 'small', 'muted']);
/**
 * La classe doit apparaître comme sélecteur ENTIER, pas comme début d'un
 * autre. Une simple recherche de sous-chaîne trouvait `.prose` dans
 * `.prose--story` et déclarait la règle présente alors qu'elle avait été
 * supprimée — le contrôle se serait tu sur le défaut même qu'il traque.
 */
const aUneRegle = (nom) => new RegExp(`\\.${nom.replace(/[-]/g, '\\-')}(?![\\w-])`).test(feuilles);
const orphelines = [...utilisees].filter(([nom]) => !SANS_REGLE.has(nom) && !aUneRegle(nom));
if (orphelines.length) {
  orphelines.forEach(([nom, f]) => ko(`classe sans règle : .${nom} (employée dans ${f})`));
} else {
  ok(`les ${utilisees.size} classes écrites dans le JavaScript ont toutes une règle`);
}

/* -------------------------------------------- 6. les polices sont servies */

const POLICES = [
  'assets/fonts/plus-jakarta-sans-latin.woff2',
  'assets/fonts/plus-jakarta-sans-latin-ext.woff2',
  'assets/fonts/plus-jakarta-sans-italic-latin.woff2',
  'assets/fonts/plus-jakarta-sans-italic-latin-ext.woff2',
  'assets/fonts/jetbrains-mono-latin.woff2',
];
const sw = readFileSync('sw.js', 'utf8');
const absentes = POLICES.filter((f) => !civica.includes(f.replace('assets/', '../')));
const noncachees = POLICES.filter((f) => !sw.includes(`./${f}`));
if (absentes.length) ko(`polices non déclarées dans civica.css : ${absentes.join(', ')}`);
else if (noncachees.length) ko(`polices absentes du cache hors ligne : ${noncachees.join(', ')}`);
else ok('les cinq fichiers de police sont déclarés et mis en cache hors ligne');

if (civica.includes('fonts.googleapis.com') || civica.includes('fonts.gstatic.com')) {
  ko('la feuille appelle encore Google Fonts : l\'application ne fonctionnerait plus hors ligne');
} else {
  ok('aucun appel au CDN de polices');
}

console.log(erreurs.length ? `\n${erreurs.length} écart(s) au système.` : '\nLe système de design est respecté.');
process.exit(erreurs.length ? 1 : 0);
