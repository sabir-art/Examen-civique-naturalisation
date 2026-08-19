#!/usr/bin/env node
/**
 * Rassemble ce qui part dans la coque native.
 *   node scripts/make-dist.mjs
 *
 * Capacitor recopie le dossier `webDir` dans l'application. Lui donner la
 * racine du dépôt embarquerait le `.git`, les scripts de contrôle, les
 * captures de test et, un jour, un `node_modules` de plusieurs centaines de
 * mégaoctets — dans un fichier que l'App Store fait télécharger sur le
 * téléphone de quelqu'un.
 *
 * On copie donc ce qui sert à l'application, et rien d'autre. La liste est
 * courte et explicite : ce qui n'y figure pas ne part pas, et un oubli se voit
 * tout de suite (l'application ne démarre pas) plutôt que six mois plus tard.
 */
import { cp, rm, mkdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';

const CIBLE = 'dist';

/** Ce qui compose l'application, dans l'ordre où on y pense. */
const CONTENU = [
  'index.html',
  'manifest.webmanifest',
  'version.json',
  'js',
  'assets',
];

/* Le service worker n'a rien à faire dans la coque : les fichiers y sont déjà
   sur l'appareil, et un cache qui survivrait à une mise à jour de l'App Store
   servirait l'ancienne version par-dessus la nouvelle. */
const ECARTES = ['sw.js'];

await rm(CIBLE, { recursive: true, force: true });
await mkdir(CIBLE, { recursive: true });

let octets = 0;
for (const entree of CONTENU) {
  if (!existsSync(entree)) {
    console.error(`  ✗ absent : ${entree}`);
    process.exit(1);
  }
  await cp(entree, `${CIBLE}/${entree}`, { recursive: true });
  octets += await poids(entree);
}

async function poids(chemin) {
  const info = await stat(chemin);
  if (!info.isDirectory()) return info.size;
  const { readdir } = await import('node:fs/promises');
  const noms = await readdir(chemin);
  let total = 0;
  for (const nom of noms) total += await poids(`${chemin}/${nom}`);
  return total;
}

console.log(`${CIBLE}/ prêt — ${Math.round(octets / 1024)} Ko`);
console.log(`écartés : ${ECARTES.join(', ')}`);
