/**
 * Reconnaître la plateforme, pour que l'application ait l'air d'y appartenir.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *  Ce qui est possible, et ce qui ne l'est pas
 * ─────────────────────────────────────────────────────────────────────────────
 *  Depuis iOS 26, les barres d'onglets des applications natives sont en
 *  « Liquid Glass » : un matériau qui floute ce qui passe dessous, en reprend
 *  les couleurs et réagit au doigt. C'est une API du système (SwiftUI, UIKit),
 *  et une page web n'y a PAS accès — ni ici, ni ailleurs. WhatsApp l'obtient
 *  parce que c'est une application native.
 *
 *  Ce qu'une page web peut faire, en revanche, c'est le matériau lui-même :
 *  `backdrop-filter` floute et sature ce qui se trouve derrière un élément, et
 *  c'est de cela qu'est faite l'impression de verre. À l'œil, sur un iPhone, la
 *  barre appartient à la même famille que celles du système. Ce n'est pas le
 *  Liquid Glass d'Apple ; c'en est une imitation honnête, et elle tient.
 *
 *  Sur Android, la barre reste pleine et franche : c'est ce qu'y font les
 *  applications, et copier le verre d'Apple ailleurs qu'aux endroits où il
 *  existe, c'est faire une application qui n'a l'air d'être de nulle part.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/**
 * Vrai sur un appareil Apple.
 *
 * `vendor` plutôt que la chaîne d'agent : sur iPhone, TOUS les navigateurs —
 * Safari, Chrome, Firefox — sont WebKit et annoncent le même fournisseur,
 * tandis que la chaîne d'agent, elle, se déguise. On lit donc le moteur, qui
 * est ce qui détermine réellement ce que la page peut faire.
 *
 * Prend l'objet en paramètre pour être vérifiable sans navigateur.
 */
export function estApple(nav = typeof navigator !== 'undefined' ? navigator : null) {
  if (!nav) return false;
  // Le moteur : sur iPhone, Safari, Chrome et Firefox sont tous WebKit.
  if (nav.vendor === 'Apple Computer, Inc.') return true;
  const socle = String(nav.platform || '');
  if (/^(iPhone|iPad|iPod)/.test(socle)) return true;
  // Depuis iPadOS 13, un iPad se présente comme un Mac ; seul le tactile le
  // trahit. Un vrai Mac annonce zéro point de contact.
  if (socle === 'MacIntel' && (nav.maxTouchPoints || 0) > 1) return true;
  return false;
}

/** Le nom de la plateforme, tel qu'il est écrit sur la page. */
export function nomPlateforme(nav = typeof navigator !== 'undefined' ? navigator : null) {
  return estApple(nav) ? 'apple' : 'autre';
}

/**
 * Inscrit la plateforme sur la racine du document. La feuille de style s'en
 * sert ; aucun écran n'a besoin de la connaître.
 */
export function appliquerPlateforme(
  doc = typeof document !== 'undefined' ? document : null,
  nav = typeof navigator !== 'undefined' ? navigator : null,
) {
  if (!doc?.documentElement) return null;
  const nom = nomPlateforme(nav);
  doc.documentElement.dataset.plateforme = nom;
  return nom;
}
