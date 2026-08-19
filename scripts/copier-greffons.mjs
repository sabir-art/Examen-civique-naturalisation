// Recopie les greffons natifs dans les projets iOS et Android, s'ils existent.
//
// Les projets natifs (ios/, android/) ne sont pas suivis par Git : chacun les
// engendre chez lui avec « npx cap add ». Les greffons, eux, sont dans le
// dépôt, sous native/. Sans cette étape, corriger un greffon ici ne changeait
// rien dans Xcode — le fichier ouvert là-bas était une copie figée, faite une
// fois au moment de la préparation. On a perdu du temps à ça.

import { existsSync, copyFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

const GREFFONS = [
  { source: 'native/ios/BarreSystemePlugin.swift', cible: 'ios/App/App/BarreSystemePlugin.swift' },
  {
    source: 'native/android/BarreSystemePlugin.kt',
    cible: 'android/app/src/main/java/fr/examencivique/app/BarreSystemePlugin.kt',
  },
];

let recopies = 0;
for (const { source, cible } of GREFFONS) {
  // Le dossier du projet natif absent veut dire « cette plateforme n'est pas
  // installée sur cette machine ». Ce n'est pas une erreur.
  const racine = cible.split('/')[0];
  if (!existsSync(racine)) continue;
  if (!existsSync(source)) {
    console.error(`Greffon introuvable : ${source}`);
    process.exit(1);
  }
  mkdirSync(dirname(cible), { recursive: true });
  copyFileSync(source, cible);
  console.log(`greffon recopié → ${cible}`);
  recopies += 1;
}

if (recopies === 0) console.log('aucun projet natif ici, rien à recopier');
