/**
 * Retours sensoriels : son et vibration.
 *
 * Les sons sont SYNTHÉTISÉS par l'API Web Audio, pas téléchargés. Trois
 * raisons : aucun fichier à mettre en cache, donc rien à charger hors ligne ;
 * une latence nulle, alors qu'un fichier audio met parfois 200 ms à démarrer ;
 * et la possibilité de moduler la hauteur selon le contexte.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *  À SAVOIR SUR LA VIBRATION
 * ─────────────────────────────────────────────────────────────────────────────
 *  `navigator.vibrate` fonctionne sur Android. Safari sur iOS ne l'expose PAS,
 *  et aucune API web ne permet aujourd'hui de déclencher le moteur haptique
 *  d'un iPhone depuis une page ou une application installée sur l'écran
 *  d'accueil. Le code ci-dessous appelle l'API quand elle existe et ne fait
 *  rien sinon — sur iPhone, seul le son est perceptible.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import * as store from '../store.js';

let ctx = null;

/** Le contexte audio ne peut naître que d'un geste de l'utilisateur. */
function audio() {
  if (ctx) return ctx;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  try { ctx = new AC(); } catch { return null; }
  return ctx;
}

function soundOn() {
  return store.current()?.settings?.sound !== false;
}

function hapticsOn() {
  return store.current()?.settings?.haptics !== false;
}

/**
 * Une note. `type` donne le timbre, l'enveloppe évite le clic de coupure.
 * @param {object} n {freq, start, dur, type, gain}
 */
function note(ac, { freq, start = 0, dur = 0.12, type = 'sine', gain = 0.14 }) {
  const t0 = ac.currentTime + start;
  const osc = ac.createOscillator();
  const env = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  // Attaque courte, extinction douce : sans cela on entend un claquement.
  env.gain.setValueAtTime(0.0001, t0);
  env.gain.exponentialRampToValueAtTime(gain, t0 + 0.012);
  env.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(env).connect(ac.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.02);
}

/** Suite de notes, décrite en demi-tons au-dessus de la fondamentale. */
function melodie(notes, { type = 'sine', gain = 0.14, base = 440 } = {}) {
  const ac = audio();
  if (!ac || !soundOn()) return;
  if (ac.state === 'suspended') ac.resume().catch(() => {});
  notes.forEach(([demiTons, start, dur]) => {
    note(ac, { freq: base * 2 ** (demiTons / 12), start, dur, type, gain });
  });
}

function vibrer(motif) {
  if (!hapticsOn()) return;
  try { navigator.vibrate?.(motif); } catch { /* non pris en charge : sans gravité */ }
}

/* ---------------------------------------------------------------- palette */

/** Bonne réponse : deux notes qui montent. */
export function bonneReponse() {
  melodie([[4, 0, 0.11], [11, 0.09, 0.2]], { type: 'triangle', gain: 0.11 });
  vibrer(18);
}

/** Mauvaise réponse : deux notes qui descendent, sans agressivité. */
export function mauvaiseReponse() {
  melodie([[-1, 0, 0.13], [-6, 0.1, 0.22]], { type: 'sine', gain: 0.1 });
  vibrer([28, 60, 28]);
}

/** Série ou examen réussi : petit arpège. */
export function reussite() {
  melodie([[0, 0, 0.13], [4, 0.1, 0.13], [7, 0.2, 0.13], [12, 0.3, 0.34]], { type: 'triangle', gain: 0.12 });
  vibrer([22, 70, 22, 70, 60]);
}

/** Série ratée : accord bas, bref. */
export function echec() {
  melodie([[0, 0, 0.2], [-4, 0, 0.24]], { type: 'sine', gain: 0.09, base: 330 });
  vibrer([40, 80, 40]);
}

/** Chapitre lu, palier franchi. */
export function jalon() {
  melodie([[7, 0, 0.1], [12, 0.08, 0.18]], { type: 'triangle', gain: 0.1 });
  vibrer(14);
}

/** Simple appui : très court, presque subliminal. */
export function tap() {
  melodie([[12, 0, 0.045]], { type: 'sine', gain: 0.05 });
  vibrer(8);
}

/**
 * Prépare le contexte audio au premier geste. Safari refuse de le créer
 * ailleurs, et un contexte créé trop tard rate le premier son.
 */
export function amorcer() {
  const go = () => {
    const ac = audio();
    if (ac?.state === 'suspended') ac.resume().catch(() => {});
    document.removeEventListener('pointerdown', go);
    document.removeEventListener('keydown', go);
  };
  document.addEventListener('pointerdown', go, { once: true });
  document.addEventListener('keydown', go, { once: true });
}

/** La vibration est-elle disponible sur cet appareil ? */
export function vibrationDisponible() {
  return typeof navigator.vibrate === 'function';
}
