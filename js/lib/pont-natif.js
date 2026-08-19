/**
 * Le pont vers l'hôte natif — et l'abstraction qui permet de s'en passer.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *  Trois hôtes, un seul code d'application
 * ─────────────────────────────────────────────────────────────────────────────
 *  L'application est écrite une fois. Ce qui change d'une plateforme à l'autre,
 *  ce n'est pas l'interface, c'est LE MATÉRIAU de quelques éléments — la barre
 *  d'onglets d'abord, puisque c'est elle que le système habille.
 *
 *      Interface commune (les écrans, la navigation, les données)
 *          ↓
 *      Abstraction de plateforme (ce fichier)
 *          ├── coque iOS      → UITabBar + UIGlassEffect, rendu par le système
 *          ├── coque Android  → BottomNavigationView, matériau Material 3
 *          └── navigateur     → la barre du système de design, en CSS
 *
 *  Dans une coque native, la barre du bas n'est PAS dessinée par la page : elle
 *  est demandée à l'hôte, qui la rend avec le matériau du système. La page se
 *  contente de dire quels onglets existent, lequel est actif, et d'écouter les
 *  appuis. C'est la seule partie de l'application qui connaisse la plateforme.
 *
 *  Hors coque — c'est-à-dire pour tous ceux qui ouvrent simplement le lien —,
 *  rien de tout cela n'existe et la barre de la page reste la seule. Le module
 *  est alors entièrement inerte.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** L'hôte natif, s'il y en a un : 'ios', 'android', ou null dans un navigateur. */
export function hoteNatif(fenetre = typeof window !== 'undefined' ? window : null) {
  const cap = fenetre?.Capacitor;
  if (!cap?.isNativePlatform?.()) return null;
  const nom = cap.getPlatform?.();
  return nom === 'ios' || nom === 'android' ? nom : null;
}

/** Le greffon qui rend la barre du système, s'il est présent. */
function greffon(fenetre = typeof window !== 'undefined' ? window : null) {
  return fenetre?.Capacitor?.Plugins?.BarreSysteme || null;
}

/**
 * Vrai si l'hôte prend la barre du bas à sa charge.
 *
 * On interroge le greffon plutôt que la plateforme : une coque peut exister
 * sans lui (première version, greffon désactivé), et il vaut mieux une barre en
 * CSS qu'aucune barre du tout.
 */
export function barreDeleguee(fenetre = typeof window !== 'undefined' ? window : null) {
  return Boolean(hoteNatif(fenetre) && greffon(fenetre));
}

let installee = false;

/**
 * Demande à l'hôte d'afficher sa barre d'onglets et d'annoncer les appuis.
 *
 * `onglets` est la liste commune — même intitulés, mêmes symboles que dans le
 * navigateur —, et `onChoix` reçoit la valeur de l'onglet appuyé. La page garde
 * donc son routeur : l'hôte ne navigue pas, il signale.
 */
export async function installerBarreNative({ onglets, actif, onChoix }) {
  const plugin = greffon();
  if (!plugin || installee) return false;
  installee = true;
  try {
    await plugin.addListener('ongletChoisi', (e) => onChoix?.(e?.value));
    await plugin.afficher({
      onglets: onglets.map((o) => ({ value: o.value, label: o.label, sfSymbol: o.sfSymbol || null })),
      actif,
    });
    return true;
  } catch {
    // Une coque plus ancienne que ce code : on retombe sur la barre de la page.
    installee = false;
    return false;
  }
}

/** Signale à l'hôte quel onglet est courant, quand la page navigue seule. */
export function majOngletActif(valeur) {
  if (!installee) return;
  greffon()?.selectionner?.({ actif: valeur }).catch(() => {});
}

/**
 * Hauteur occupée par la barre native, marge de sécurité comprise.
 * La page s'en sert pour ne pas glisser son contenu dessous.
 */
export async function hauteurBarreNative() {
  const plugin = greffon();
  if (!plugin?.hauteur) return 0;
  try {
    const { hauteur } = await plugin.hauteur();
    return Number(hauteur) || 0;
  } catch {
    return 0;
  }
}
