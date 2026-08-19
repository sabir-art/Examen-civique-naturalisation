/**
 * « La France racontée » — le programme de l'examen sous forme de récit.
 *
 * Troisième banque de l'application, indépendante des deux autres : on lit une
 * histoire, puis on répond à quelques questions sur ce qu'on vient de lire.
 * Les identifiants (`rm001`…) ne croisent ni ceux de la banque d'examen ni
 * ceux du livret : la lecture est suivie à part, mais chaque question compte
 * dans le thème du programme dont elle traite (voir THEME_DE_CHAPITRE).
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

/**
 * À quel thème du programme chaque chapitre du récit se rattache.
 *
 * Contrairement au livret — dont les parties portent les titres exacts des
 * thèmes officiels —, le récit suit la chronologie, pas le référentiel : c'est
 * donc un CHOIX ÉDITORIAL, chapitre par chapitre, et il est écrit ici en toutes
 * lettres pour qu'on puisse le discuter.
 *
 * La règle suivie : le thème est celui sous lequel la banque d'examen classe
 * elle-même le sujet du chapitre. « Quel philosophe a théorisé la séparation
 * des pouvoirs » y est rangé en histoire et culture, les numéros d'urgence en
 * droits et devoirs, la laïcité à l'école en principes et valeurs — le récit
 * les suit plutôt que de les reclasser.
 *
 * Un chapitre effleure parfois un second thème (ch. 2 finit sur la
 * souveraineté, ch. 16 s'ouvre sur le droit de vote des femmes). On ne le
 * partage pas : quatre questions ne se coupent pas en deux sans rendre le
 * tableau illisible, et le thème dominant est celui qu'on retient du chapitre.
 */
export const THEME_DE_CHAPITRE = {
  ch01: 'histoire-geo-culture', // Alésia, l'héritage romain
  ch02: 'histoire-geo-culture', // Clovis, le baptême de Reims
  ch03: 'histoire-geo-culture', // Jeanne d'Arc, la guerre de Cent Ans
  ch04: 'histoire-geo-culture', // l'édit de Nantes
  ch05: 'histoire-geo-culture', // Louis XIV, la monarchie absolue
  ch06: 'histoire-geo-culture', // les Lumières
  ch07: 'histoire-geo-culture', // 1789, la Révolution
  ch08: 'droits-devoirs', //       la Déclaration de 1789, ses dix-sept articles
  ch09: 'histoire-geo-culture', // Napoléon, le Code civil
  ch10: 'histoire-geo-culture', // 1848 : suffrage universel et abolition
  ch11: 'histoire-geo-culture', // l'école de Jules Ferry
  ch12: 'principes-valeurs', //    la loi de 1905, la laïcité
  ch13: 'histoire-geo-culture', // les deux guerres, le 11 novembre, le 8 mai
  ch14: 'histoire-geo-culture', // l'Appel du 18 juin, la Résistance
  ch15: 'institutions', //         la Constitution de 1958
  ch16: 'droits-devoirs', //       les conquêtes : IVG, peine de mort, mariage
  ch17: 'principes-valeurs', //    la devise, La Marseillaise, Marianne
  ch18: 'institutions', //         le vote et les élections
  ch19: 'principes-valeurs', //    la laïcité à l'école, la neutralité
  ch20: 'droits-devoirs', //       la justice, les numéros d'urgence
  ch21: 'vivre-societe', //        santé, travail, vie quotidienne
  ch22: 'institutions', //         l'Union européenne
};

let n = 0;
const pad = (i) => `rm${String(i).padStart(3, '0')}`;

export const ROMAN_QUESTIONS = CHAPITRES.flatMap((ch) =>
  (ch.questions || []).map((item) => ({
    ...item,
    id: pad(++n),
    chapitre: ch.key,
    acte: ch.acteKey,
    theme: THEME_DE_CHAPITRE[ch.key] || null,
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
