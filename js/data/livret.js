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

/**
 * À quel thème du programme chaque partie du livret se rattache.
 *
 * Ce n'est pas une interprétation : les cinq parties du livret portent les
 * titres EXACTS des cinq thèmes de l'arrêté, dans le même ordre. Les annexes
 * — Déclaration de 1789, Charte des droits et devoirs — relèvent des droits et
 * devoirs, et l'examen blanc « livret » les compte déjà ainsi (voir
 * LIVRET_BLUEPRINT dans engine.js, où p3 et les annexes alimentent la même
 * ligne de onze questions).
 *
 * De ce rattachement dépend le fait qu'une question travaillée dans le livret
 * compte dans le thème correspondant, et pas seulement dans le livret.
 */
export const THEME_DE_PARTIE = {
  p1: 'principes-valeurs',
  p2: 'institutions',
  p3: 'droits-devoirs',
  p4: 'histoire-geo-culture',
  p5: 'vivre-societe',
  annexes: 'droits-devoirs',
};

/** Tous les chapitres, à plat, avec un renvoi vers leur partie. */
export const CHAPITRES = PARTIES.flatMap((partie) =>
  partie.chapters.map((ch) => ({
    ...ch,
    partieKey: partie.key,
    partieTitle: partie.title,
    icon: partie.icon,
    theme: THEME_DE_PARTIE[partie.key] || null,
  })),
);

export const CHAPITRE_BY_KEY = new Map(CHAPITRES.map((c) => [c.key, c]));
export const PARTIE_BY_KEY = new Map(PARTIES.map((p) => [p.key, p]));

/** Nombre de sections d'un chapitre (unité de lecture suivie). */
export function sectionCount(chapterKey) {
  return CHAPITRE_BY_KEY.get(chapterKey)?.sections.length || 0;
}

export const TOTAL_SECTIONS = CHAPITRES.reduce((n, c) => n + c.sections.length, 0);
