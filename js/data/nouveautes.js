/**
 * Journal des versions — ce qui a changé, écrit pour qui utilise l'application.
 *
 * Écrit à la main, et c'est voulu : une liste de messages de commit ne
 * renseigne personne. Chaque entrée dit ce qui change POUR LE LECTEUR, dans
 * ses mots à lui.
 *
 * Une règle, vérifiée par scripts/check-version.mjs : dès qu'un contenu bouge
 * — questions, livret, récit, glossaire —, la date la plus récente de ce
 * journal doit au moins atteindre celle du contenu. Autrement l'application
 * afficherait « mise à jour le 3 » avec un journal qui s'arrête au 1er, et le
 * lecteur ne saurait pas ce qui a changé entre les deux.
 */

export const NOUVEAUTES = [
  {
    date: '2026-08-19',
    titre: 'Chaque question compte dans son thème',
    lignes: [
      "Les questions du livret du citoyen et du récit font maintenant monter les barres des cinq thèmes, au même titre que celles de la banque d'examen : peu importe par où vous passez.",
      "Les totaux changent donc — 735 questions en tout —, et chaque écran de thème dit désormais d'où viennent les siennes.",
      "L'examen blanc officiel, lui, continue de ne tirer que dans la banque d'examen : c'est la composition de l'épreuve réelle.",
    ],
  },
  {
    date: '2026-08-16',
    titre: 'Les chiffres romains, doublés de leur valeur',
    lignes: [
      // Sans parenthèses : l'application les ajoute elle-même à l'affichage,
      // et cette ligne montre donc la nouveauté au lieu de la décrire.
      "Louis XVI, Ve République, XIXe siècle : le chiffre romain reste — c'est ainsi qu'il tombera le jour de l'examen — mais sa valeur l'accompagne maintenant partout.",
    ],
  },
  {
    date: '2026-08-16',
    titre: "L'assistant, partout où vous êtes",
    lignes: [
      "On peut lui poser une question depuis un chapitre ou depuis un mot du glossaire, sans quitter la page qu'on était en train de lire.",
      'Nouvelle barre de saisie, et la dictée à la voix là où le téléphone la gère correctement.',
    ],
  },
  {
    date: '2026-08-16',
    titre: 'Les tableaux d’enquête',
    lignes: [
      'Trois murs de fiches reliées entre elles — les dates, les noms, qui a fait quoi —, à ouvrir depuis un chapitre du récit quand on s’y perd.',
    ],
  },
  {
    date: '2026-08-14',
    titre: 'Affichage : les quatre réponses d’un coup d’œil',
    lignes: [
      'Plus besoin de faire défiler pour voir la dernière réponse, sur les écrans les plus courts comme sur les autres.',
      'Une série de corrections signalées depuis un iPhone, et les trois formats d’examen blanc reconnaissables à leur couleur.',
    ],
  },
  {
    date: '2026-08-12',
    titre: 'Nouvelle apparence, et une révision qui ne triche plus',
    lignes: [
      'Toute l’application repose désormais sur le même système de design : mêmes formes, mêmes couleurs, mêmes espacements d’un écran à l’autre.',
      'La révision du jour ne propose plus que ce qui reste réellement à revoir, et annonce sa taille avant de commencer.',
    ],
  },
];
