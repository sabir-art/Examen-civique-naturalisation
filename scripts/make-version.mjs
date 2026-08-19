#!/usr/bin/env node
/**
 * Écrit la date de publication de l'application, d'après l'historique Git.
 *   node scripts/make-version.mjs
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *  Pourquoi une date CALCULÉE et non écrite à la main
 * ─────────────────────────────────────────────────────────────────────────────
 *  Une date de mise à jour saisie à la main est fausse le lendemain, et
 *  personne ne s'en aperçoit : elle reste affichée, plausible, et ment. Or
 *  c'est précisément ce qu'on demande à cet écran — « ces informations datent
 *  de quand ? ». Une réponse inexacte y est pire que pas de réponse.
 *
 *  Chaque date vient donc du dernier commit qui a touché les fichiers
 *  concernés. Elle ne peut pas se désynchroniser de ce qu'elle décrit : si la
 *  banque de questions change, sa date change ; si elle ne change pas, sa date
 *  ne bouge pas non plus, ce qui est l'exacte vérité.
 *
 *  Le script tourne à la publication (voir .github/workflows/deploy.yml), pour
 *  que le site en ligne porte toujours la date du commit d'où il est issu. Le
 *  fichier produit est aussi versionné, afin qu'une copie locale du dépôt
 *  affiche quelque chose de sensé.
 * ─────────────────────────────────────────────────────────────────────────────
 */
import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';

const git = (...args) => execFileSync('git', args, { encoding: 'utf8' }).trim();

/** Les blocs de contenu dont on affiche l'ancienneté, et ce qui les compose. */
const CONTENUS = [
  { cle: 'programme', libelle: 'Référentiel officiel', chemins: ['js/data/programme.js'] },
  {
    cle: 'examen',
    libelle: "Questions d'entraînement à l'examen",
    chemins: [
      'js/data/questions.js', 'js/data/q-principes.js', 'js/data/q-principes-situations.js',
      'js/data/q-institutions.js', 'js/data/q-droits.js', 'js/data/q-droits-situations.js',
      'js/data/q-histoire.js', 'js/data/q-societe.js',
    ],
  },
  { cle: 'livret', libelle: 'Livret du citoyen et ses questions', chemins: ['js/data/livret.js', 'js/data/livret', 'js/data/q-livret.js'] },
  { cle: 'recit', libelle: '« La France racontée »', chemins: ['js/data/roman.js', 'js/data/roman', 'js/data/roman-ar.js', 'js/data/roman-ar'] },
  { cle: 'tableaux', libelle: 'Tableaux d’enquête', chemins: ['js/data/tableaux.js'] },
  { cle: 'glossaire', libelle: 'Mots difficiles', chemins: ['js/data/glossaire.js'] },
];

/** Date du dernier commit ayant touché l'un de ces chemins (AAAA-MM-JJ). */
function dernierChangement(chemins) {
  const sortie = git('log', '-1', '--format=%cs', '--', ...chemins);
  return sortie || null;
}

const commit = git('rev-parse', '--short', 'HEAD');
const date = git('log', '-1', '--format=%cI');
const jour = git('log', '-1', '--format=%cs');

const contenus = CONTENUS.map((c) => ({
  cle: c.cle,
  libelle: c.libelle,
  date: dernierChangement(c.chemins),
}));

const fichier = `/**
 * Date de publication de l'application.
 *
 * FICHIER GÉNÉRÉ — ne pas modifier à la main.
 * Il est réécrit par scripts/make-version.mjs, à partir de l'historique Git,
 * à chaque publication. Voir ce script pour le pourquoi.
 */

export const PUBLICATION = {
  /** Le commit d'où sort cette copie de l'application. */
  commit: '${commit}',
  /** Sa date, à la seconde — c'est la « dernière mise à jour ». */
  date: '${date}',
  /** La même, en jour seul : ce qui s'affiche. */
  jour: '${jour}',
};

/** Ancienneté de chaque bloc de contenu, calculée de la même façon. */
export const CONTENUS = ${JSON.stringify(contenus, null, 2)};
`;

writeFileSync('js/data/build.js', fichier);

/* Le même renseignement, en JSON, pour que l'application installée puisse
   demander au serveur s'il existe plus récent qu'elle. Un module JavaScript ne
   se relit pas à chaud ; un petit fichier, si. */
writeFileSync('version.json', `${JSON.stringify({ commit, date, jour }, null, 2)}\n`);

console.log(`Version ${commit} du ${jour}`);
for (const c of contenus) console.log(`  ${c.date || '—'}  ${c.libelle}`);
