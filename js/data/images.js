/**
 * Illustrations du récit : index chargé depuis le manifeste.
 *
 * Le manifeste (assets/photos/manifeste.json) est la source unique : il sert
 * au workflow qui télécharge les fichiers, au contrôle de cohérence, et à
 * l'application. Un seul endroit à tenir à jour.
 *
 * Il est chargé à la demande, au premier chapitre ouvert. Le récit n'est pas
 * la première chose qu'on regarde en ouvrant l'application, et une vingtaine
 * de kilo-octets de métadonnées n'ont pas à peser sur le démarrage.
 */

let promesse = null;
let INDEX = { parChapitre: new Map(), parTerme: new Map(), toutes: [] };

/** Charge le manifeste une fois. Ne rejette jamais : sans images, on lit. */
export async function charger() {
  if (promesse) return promesse;
  promesse = fetch('./assets/photos/manifeste.json')
    .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
    .then((data) => {
      const parChapitre = new Map();
      const parTerme = new Map();
      const toutes = data.images || [];
      for (const img of toutes) {
        if (img.chapitre) {
          if (!parChapitre.has(img.chapitre)) parChapitre.set(img.chapitre, []);
          parChapitre.get(img.chapitre).push(img);
        }
        // Le premier venu gagne : une image illustre un terme, pas l'inverse.
        for (const t of img.glossaire || []) if (!parTerme.has(t)) parTerme.set(t, img);
      }
      INDEX = { parChapitre, parTerme, toutes };
      return INDEX;
    })
    .catch(() => INDEX);
  return promesse;
}

export function imagesDuChapitre(key) {
  return INDEX.parChapitre.get(key) || [];
}

export function imageDuTerme(terme) {
  return INDEX.parTerme.get(terme) || null;
}

export function chemin(img) {
  return `./assets/photos/${img.cle}.jpg`;
}

/** Mention de provenance, affichée sous chaque image. */
export const SOURCES = {
  ia: 'Image générée',
  libre: 'Image libre de droits',
};
