#!/usr/bin/env node
/**
 * Rapatrie les illustrations du récit dans le dépôt.
 *
 *   node scripts/fetch-images.mjs          # ne prend que ce qui manque
 *   REFAIRE=true node scripts/fetch-images.mjs
 *
 * Lit assets/photos/manifeste.json, télécharge chaque `url`, réduit l'image à
 * une largeur raisonnable pour un téléphone et l'écrit dans
 * assets/photos/<cle>.jpg.
 *
 * POURQUOI CE DÉTOUR : les images sont générées chez un prestataire qui ne les
 * sert que sur une adresse temporaire. Une application censée fonctionner hors
 * ligne ne peut pas pointer vers une adresse qui expire — les fichiers doivent
 * être dans le dépôt. Ce script tourne donc sur un runner GitHub, qui a un
 * accès réseau ouvert, et non sur le poste de développement.
 *
 * Il est volontairement tolérant : une adresse expirée n'interrompt pas le
 * reste, elle est signalée et l'image concernée reste à refaire.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync, statSync, unlinkSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DOSSIER = resolve(ROOT, 'assets/photos');
const MANIFESTE = resolve(DOSSIER, 'manifeste.json');

/** Largeur cible. Au-delà, on paie des octets que l'écran n'affiche pas. */
const LARGEUR = 900;
const QUALITE = 72;

const refaire = /^(1|true|oui)$/i.test(process.env.REFAIRE || '');

mkdirSync(DOSSIER, { recursive: true });
const manifeste = JSON.parse(readFileSync(MANIFESTE, 'utf8'));
const images = manifeste.images || [];

const ok = [];
const sautes = [];
const echecs = [];

for (const img of images) {
  const cible = resolve(DOSSIER, `${img.cle}.jpg`);

  if (!refaire && existsSync(cible)) {
    sautes.push(img.cle);
    continue;
  }
  if (!img.url) {
    echecs.push(`${img.cle} — aucune adresse dans le manifeste`);
    continue;
  }

  const brut = resolve(DOSSIER, `.${img.cle}.brut`);
  try {
    const reponse = await fetch(img.url, { redirect: 'follow' });
    if (!reponse.ok) throw new Error(`HTTP ${reponse.status}`);
    const octets = Buffer.from(await reponse.arrayBuffer());
    if (octets.length < 1024) throw new Error(`réponse trop courte (${octets.length} octets)`);
    writeFileSync(brut, octets);

    // Redimensionnement + recompression. `-strip` retire les métadonnées :
    // elles ne servent à rien ici et pèsent.
    execFileSync('convert', [
      brut,
      '-resize', `${LARGEUR}>`,
      '-strip',
      '-interlace', 'Plane',
      '-quality', String(QUALITE),
      cible,
    ], { stdio: 'pipe' });

    const taille = statSync(cible).size;
    if (taille < 2048) throw new Error(`fichier converti suspect (${taille} octets)`);
    ok.push(`${img.cle} — ${(taille / 1024).toFixed(0)} Ko`);
  } catch (err) {
    echecs.push(`${img.cle} — ${err.message}`);
    if (existsSync(cible)) unlinkSync(cible);
  } finally {
    if (existsSync(brut)) unlinkSync(brut);
  }
}

const lignes = [
  `## Illustrations`,
  '',
  `- récupérées : **${ok.length}**`,
  `- déjà présentes : **${sautes.length}**`,
  `- en échec : **${echecs.length}**`,
  '',
  ok.length ? `### Récupérées\n${ok.map((l) => `- ${l}`).join('\n')}` : '',
  echecs.length ? `### En échec\n${echecs.map((l) => `- ${l}`).join('\n')}\n\nUne adresse de livraison expire : il faut régénérer l'image et remettre son adresse dans le manifeste.` : '',
].filter(Boolean).join('\n');

console.log(lignes.replace(/\*\*/g, ''));
if (process.env.GITHUB_STEP_SUMMARY) {
  writeFileSync(process.env.GITHUB_STEP_SUMMARY, `${lignes}\n`, { flag: 'a' });
}

// Un échec ne doit pas faire tomber le workflow : les images déjà récupérées
// méritent d'être publiées. Le récapitulatif dit ce qu'il reste à refaire.
process.exit(0);
