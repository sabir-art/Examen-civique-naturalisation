/**
 * Rappel quotidien de révision.
 *
 * CE QUE C'EST, HONNÊTEMENT : un rappel local. L'application est un site
 * statique, sans serveur d'envoi ; elle ne peut donc pas faire sonner le
 * téléphone d'elle-même à 19 h. Ce que l'on sait faire, c'est afficher une
 * notification au moment où l'application est ouverte ou revient au premier
 * plan, si l'heure choisie est passée et que rien n'a été révisé ce jour-là.
 *
 * C'est modeste, mais ce n'est pas rien : sur un téléphone, l'application est
 * ouverte plusieurs fois par jour, et la notification rappelle la série en
 * cours au bon moment. Le texte affiché à l'écran le dit clairement, pour ne
 * promettre que ce que l'on tient.
 */

import * as store from '../store.js';

const DEFAUT = { actif: false, heure: '19:00' };

export function supporte() {
  return typeof Notification !== 'undefined';
}

export function permission() {
  return supporte() ? Notification.permission : 'unsupported';
}

export function reglage() {
  return { ...DEFAUT, ...(store.current()?.settings?.rappel || {}) };
}

function ecrire(patch) {
  store.setSetting('rappel', { ...reglage(), ...patch });
}

export function definirHeure(heure) {
  ecrire({ heure });
}

/**
 * Active le rappel. La demande de permission doit partir d'un geste de
 * l'utilisateur : c'est une exigence des navigateurs, iOS compris.
 */
export async function activer() {
  if (!supporte()) throw new Error("Ce navigateur ne gère pas les notifications.");
  let etat = Notification.permission;
  if (etat === 'default') etat = await Notification.requestPermission();
  if (etat !== 'granted') {
    ecrire({ actif: false });
    throw new Error(etat === 'denied'
      ? "Les notifications ont été refusées. Elles se réactivent dans les réglages du téléphone, à la ligne de cette application."
      : "Autorisation non accordée.");
  }
  ecrire({ actif: true });
  return true;
}

export function desactiver() {
  ecrire({ actif: false });
}

async function afficher(titre, corps) {
  const options = {
    body: corps,
    icon: './assets/icons/icon-192.png',
    badge: './assets/icons/icon-192.png',
    tag: 'rappel-quotidien',
    lang: 'fr',
  };
  // Un service worker sait afficher une notification même quand l'onglet perd
  // le focus ; `new Notification()` sert de repli sur les navigateurs anciens.
  try {
    const reg = await navigator.serviceWorker?.ready;
    if (reg) { await reg.showNotification(titre, options); return true; }
  } catch { /* on tente le repli */ }
  try { new Notification(titre, options); return true; } catch { return false; }
}

/**
 * À appeler à l'ouverture et au retour au premier plan.
 * Ne fait rien si le rappel est éteint, si l'heure n'est pas venue, si la
 * journée a déjà servi, ou si un rappel a déjà été montré aujourd'hui.
 */
export async function verifier() {
  const r = reglage();
  if (!r.actif || permission() !== 'granted') return false;

  const aujourdhui = store.dayKey();
  if (r.dernier === aujourdhui) return false;
  if (store.answeredToday() > 0) return false;

  const [hh, mm] = String(r.heure).split(':').map(Number);
  const maintenant = new Date();
  if (maintenant.getHours() < hh || (maintenant.getHours() === hh && maintenant.getMinutes() < mm)) return false;

  const serie = store.streak();
  const ok = await afficher(
    serie > 0 ? `Votre série de ${serie} jour${serie > 1 ? 's' : ''} tient encore` : 'Petite révision du soir ?',
    serie > 0
      ? 'Quelques questions suffisent à la garder.'
      : 'Dix questions, et la journée compte.',
  );
  if (ok) ecrire({ dernier: aujourdhui });
  return ok;
}
