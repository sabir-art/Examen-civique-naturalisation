/**
 * « Est-ce que j'ai la dernière version ? »
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *  Le problème, propre aux applications installées
 * ─────────────────────────────────────────────────────────────────────────────
 *  Une fois ajoutée à l'écran d'accueil, l'application est servie depuis le
 *  cache du téléphone. Elle se met à jour toute seule, mais en silence et pas
 *  forcément tout de suite : on peut lire pendant des jours une version d'il y
 *  a trois semaines sans le savoir. Pour un contenu qui suit un programme
 *  officiel, ce n'est pas un détail.
 *
 *  D'où ce module : il compare la version EMBARQUÉE (js/data/build.js, figée
 *  au moment de la publication) à celle du SERVEUR (version.json, relu à
 *  chaque appel, sans cache). Si elles diffèrent, une version plus récente
 *  existe et on propose de l'installer.
 *
 *  version.json est volontairement tenu hors du cache hors ligne — voir la
 *  règle correspondante dans sw.js. Un fichier censé dire ce qu'il y a sur le
 *  serveur ne peut pas être servi depuis le cache : il répondrait toujours ce
 *  qu'on sait déjà.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { PUBLICATION } from '../data/build.js';

/**
 * Interroge le serveur.
 * Rend { etat: 'a-jour' | 'nouvelle' | 'hors-ligne', publiee, commit }.
 */
export async function chercherUneMiseAJour() {
  try {
    const r = await fetch(`./version.json?t=${Date.now()}`, { cache: 'no-store' });
    if (!r.ok) throw new Error(String(r.status));
    const en_ligne = await r.json();
    // On rafraîchit aussi le service worker : sans cela, la page continuerait
    // d'être servie depuis l'ancien cache même après avoir vu la nouveauté.
    if (navigator.serviceWorker) {
      const reg = await navigator.serviceWorker.getRegistration();
      await reg?.update().catch(() => {});
    }
    return {
      etat: en_ligne.commit === PUBLICATION.commit ? 'a-jour' : 'nouvelle',
      publiee: en_ligne.jour || null,
      commit: en_ligne.commit || null,
    };
  } catch {
    // Hors ligne, ou fichier absent : on ne sait pas, et on le dit. Annoncer
    // « à jour » faute de réponse serait un mensonge commode.
    return { etat: 'hors-ligne', publiee: null, commit: null };
  }
}

/**
 * Recharge l'application en écartant le cache hors ligne.
 *
 * Vider le cache AVANT de recharger est ce qui distingue une vraie mise à jour
 * d'un simple rafraîchissement : sinon le service worker resservirait, hors
 * ligne, exactement les fichiers qu'on veut remplacer.
 */
export async function installerLaMiseAJour() {
  try {
    if ('caches' in window) {
      const noms = await caches.keys();
      await Promise.all(noms.map((n) => caches.delete(n)));
    }
    // Le service worker reste installé : il se réapprovisionnera au premier
    // chargement. Le désinscrire priverait l'application du hors ligne si le
    // réseau venait à manquer dans la seconde qui suit.
  } catch { /* le rechargement reste la bonne action, cache vidé ou non */ }
  window.location.reload();
}
