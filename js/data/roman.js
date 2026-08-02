/**
 * « La France racontée » — le programme de l'examen sous forme de récit.
 *
 * Troisième banque de l'application, indépendante des deux autres : on lit une
 * histoire, puis on répond à quelques questions sur ce qu'on vient de lire.
 * Les identifiants (`rm001`…) ne croisent ni ceux de la banque d'examen ni
 * ceux du livret, et cette progression est suivie à part.
 */

import acte1 from './roman/acte-1.js';
import acte2 from './roman/acte-2.js';
import acte3 from './roman/acte-3.js';

export const ROMAN = {
  titre: 'La France racontée',
  sous_titre: "L'histoire du pays, d'Alésia à aujourd'hui",
  actes: [acte1, acte2, acte3],
};

export const ACTES = ROMAN.actes;

/** Tous les chapitres, à plat et dans l'ordre de lecture. */
export const CHAPITRES = ACTES.flatMap((acte) =>
  acte.chapitres.map((ch) => ({
    ...ch,
    acteKey: acte.key,
    acteNum: acte.num,
    acteTitre: acte.titre,
    icon: acte.icon,
  })),
);

export const CHAPITRE_BY_KEY = new Map(CHAPITRES.map((c) => [c.key, c]));
export const ACTE_BY_KEY = new Map(ACTES.map((a) => [a.key, a]));

export const TOTAL_CHAPITRES = CHAPITRES.length;
export const TOTAL_MINUTES = CHAPITRES.reduce((n, c) => n + (c.minutes || 0), 0);

/** Chapitre suivant dans l'ordre de lecture, ou null si c'est le dernier. */
export function nextChapitre(key) {
  const i = CHAPITRES.findIndex((c) => c.key === key);
  return i >= 0 && i < CHAPITRES.length - 1 ? CHAPITRES[i + 1] : null;
}

export function prevChapitre(key) {
  const i = CHAPITRES.findIndex((c) => c.key === key);
  return i > 0 ? CHAPITRES[i - 1] : null;
}

/* ------------------------------------------------------------------ questions */

let n = 0;
const pad = (i) => `rm${String(i).padStart(3, '0')}`;

export const ROMAN_QUESTIONS = CHAPITRES.flatMap((ch) =>
  (ch.questions || []).map((item) => ({
    ...item,
    id: pad(++n),
    chapitre: ch.key,
    acte: ch.acteKey,
    source: 'roman',
    type: 'connaissance',
  })),
);

export const ROMAN_BY_ID = new Map(ROMAN_QUESTIONS.map((q) => [q.id, q]));

/** Questions d'un chapitre. */
export function questionsOf(chapitreKey) {
  return ROMAN_QUESTIONS.filter((q) => q.chapitre === chapitreKey);
}

/** Questions d'un acte entier. */
export function questionsOfActe(acteKey) {
  return ROMAN_QUESTIONS.filter((q) => q.acte === acteKey);
}
