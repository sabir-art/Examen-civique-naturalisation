/**
 * Livret du citoyen — édition mai 2026 (ministère de l'Intérieur),
 * approuvé par arrêté et remis aux candidats à la naturalisation.
 *
 * Cette partie de l'application reprend le contenu du document officiel,
 * séparément des fiches de révision rédigées pour l'entraînement.
 */

import p1 from './livret/partie-1.js';
import p2 from './livret/partie-2.js';
import p3 from './livret/partie-3.js';
import p4 from './livret/partie-4.js';
import p5 from './livret/partie-5.js';
import annexes from './livret/annexes.js';

export const LIVRET = {
  titre: 'Livret du citoyen',
  edition: 'Édition mai 2026',
  editeur: "Ministère de l'Intérieur",
  parties: [p1, p2, p3, p4, p5, annexes],
};

export const PARTIES = LIVRET.parties;

/** Tous les chapitres, à plat, avec un renvoi vers leur partie. */
export const CHAPITRES = PARTIES.flatMap((partie) =>
  partie.chapters.map((ch) => ({ ...ch, partieKey: partie.key, partieTitle: partie.title, icon: partie.icon })),
);

export const CHAPITRE_BY_KEY = new Map(CHAPITRES.map((c) => [c.key, c]));
export const PARTIE_BY_KEY = new Map(PARTIES.map((p) => [p.key, p]));

/** Nombre de sections d'un chapitre (unité de lecture suivie). */
export function sectionCount(chapterKey) {
  return CHAPITRE_BY_KEY.get(chapterKey)?.sections.length || 0;
}

export const TOTAL_SECTIONS = CHAPITRES.reduce((n, c) => n + c.sections.length, 0);
