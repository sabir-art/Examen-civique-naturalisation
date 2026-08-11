/**
 * Traduction arabe de « La France racontée ».
 *
 * POURQUOI SEUL LE RÉCIT EST TRADUIT, et pas les questions : l'examen se passe
 * en français. S'entraîner sur des questions traduites donnerait une réussite
 * trompeuse — on répondrait juste en arabe et l'on resterait bloqué le jour de
 * l'épreuve. Le récit, lui, sert à COMPRENDRE : une fois l'histoire claire,
 * on la relit en français, et les questions s'y attaquent en français.
 *
 * C'est aussi pour cela que le mode bilingue existe : chaque paragraphe arabe
 * est posé sous son paragraphe français, pour faire le pont mot à mot.
 */

import a1 from './roman-ar/acte-1.js';
import a2 from './roman-ar/acte-2.js';
import a3 from './roman-ar/acte-3.js';

export const ACTES_AR = { 'acte-1': a1, 'acte-2': a2, 'acte-3': a3 };

/** Chapitre traduit, ou null si la traduction manque. */
export const AR_BY_KEY = new Map();
for (const [acteKey, acte] of Object.entries(ACTES_AR)) {
  for (const [chapKey, chap] of Object.entries(acte.chapitres)) {
    AR_BY_KEY.set(chapKey, { ...chap, acteKey, acteTitre: acte.titre });
  }
}

export const ACTE_AR_BY_KEY = new Map(Object.entries(ACTES_AR));

export const TOTAL_TRADUITS = AR_BY_KEY.size;

/** Les langues proposées pour la lecture du récit. */
export const LANGUES = {
  fr: { code: 'fr', nom: 'Français', natif: 'Français', dir: 'ltr' },
  ar: { code: 'ar', nom: 'Arabe', natif: 'العربية', dir: 'rtl' },
  bi: { code: 'bi', nom: 'Les deux', natif: 'Les deux', dir: 'ltr' },
};

/**
 * Découpe un fragment HTML en blocs de premier niveau.
 *
 * Le mode bilingue en a besoin pour apparier les paragraphes : le français et
 * l'arabe sont écrits avec le même nombre de blocs, dans le même ordre.
 */
export function blocs(html) {
  const bac = document.createElement('div');
  bac.innerHTML = html;
  return [...bac.children];
}
