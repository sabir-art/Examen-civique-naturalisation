/**
 * Journal d'activité et rappel quotidien.
 *
 * Rien n'est stocké en plus pour construire ce journal : les examens, les
 * chapitres lus, les journées de révision et les dates de badges sont déjà
 * enregistrés. On les remet simplement dans l'ordre du temps.
 */

import { h, icon, toast } from '../lib/dom.js';
import { formatDate, formatTime, plural, DAY, startOfDay } from '../lib/util.js';
import { EXAM } from '../data/programme.js';
import { EXAM_MODES, modeOf } from '../engine.js';
import { CHAPITRE_BY_KEY as ROMAN_BY_KEY } from '../data/roman.js';
import { CHAPITRE_BY_KEY as LIVRET_BY_KEY } from '../data/livret.js';
import { badges } from '../lib/xp.js';
import * as rappel from '../lib/rappel.js';
import * as store from '../store.js';

/** Horodatage de midi pour une clé de jour « AAAA-MM-JJ ». */
function midiDe(cle) {
  const [a, m, j] = cle.split('-').map(Number);
  return new Date(a, m - 1, j, 12, 0, 0).getTime();
}

/**
 * Tous les évènements, du plus récent au plus ancien.
 * `notifiable` distingue ce qui mérite une pastille de ce qui n'est qu'un
 * résumé de journée — sinon la pastille ne s'éteindrait jamais.
 */
export function evenements() {
  const p = store.current();
  if (!p) return [];
  const out = [];

  for (const e of p.exams || []) {
    const recu = e.score >= EXAM.passing;
    out.push({
      ts: e.date,
      notifiable: true,
      icone: recu ? 'trophy' : 'clock',
      tone: recu ? 'ok' : 'warn',
      titre: `${EXAM_MODES[modeOf(e)].short} — ${e.score}/${e.total}`,
      sous: recu ? 'Reçu' : `Sous le seuil de ${EXAM.passing}`,
      href: '#/progres',
    });
  }

  for (const [cle, ts] of Object.entries(p.read || {})) {
    const roman = ROMAN_BY_KEY.get(cle);
    const livret = LIVRET_BY_KEY.get(cle);
    if (roman) {
      out.push({
        ts, notifiable: true, icone: 'book', tone: 'story',
        titre: `Chapitre ${roman.num} lu`, sous: roman.titre, href: `#/histoire/c/${cle}`,
      });
    } else if (livret) {
      out.push({
        ts, notifiable: true, icone: 'bank', tone: 'livret',
        titre: 'Chapitre du livret lu', sous: livret.title, href: `#/livret/c/${cle}`,
      });
    }
  }

  const dates = store.badgeDates();
  const parId = new Map(badges().map((b) => [b.id, b]));
  for (const [id, ts] of Object.entries(dates)) {
    const b = parId.get(id);
    // Les badges rattrapés au premier démarrage n'ont pas de vraie date : les
    // faire figurer au journal reviendrait à dater faussement des évènements.
    if (!b || store.badgeDateInconnue(id)) continue;
    out.push({
      ts, notifiable: true, icone: b.icone, tone: 'brand',
      titre: `Badge : ${b.nom}`, sous: b.desc, href: '#/parcours',
    });
  }

  for (const [cle, n] of Object.entries(p.days || {})) {
    if (!n) continue;
    out.push({
      ts: midiDe(cle), notifiable: false, icone: 'check', tone: '',
      titre: `${n} ${plural(n, 'question')} ${plural(n, 'traitée')}`,
      sous: 'Journée de révision', href: '#/progres',
    });
  }

  return out.sort((a, b) => b.ts - a.ts);
}

/** Nombre d'évènements survenus depuis la dernière visite du journal. */
export function nonLus() {
  const depuis = store.activitySeenAt();
  if (!depuis) return 0;
  return evenements().filter((e) => e.notifiable && e.ts > depuis).length;
}

/* ---------------------------------------------------------------- groupes */

function groupe(ts) {
  const jour = startOfDay(ts);
  const today = startOfDay();
  if (jour === today) return "Aujourd'hui";
  if (jour === today - DAY) return 'Hier';
  if (jour > today - 7 * DAY) return 'Cette semaine';
  if (jour > today - 30 * DAY) return 'Ce mois-ci';
  return new Date(ts).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
}

/* ---------------------------------------------------------------- rappel */

function carteRappel() {
  const r = rappel.reglage();
  const carte = h('div', { class: 'card' });

  function draw() {
    const etat = rappel.reglage();
    const perm = rappel.permission();

    const bascule = h('button', {
      class: 'switchrow', type: 'button', role: 'switch',
      'aria-checked': etat.actif ? 'true' : 'false',
      onclick: async () => {
        if (etat.actif) { rappel.desactiver(); draw(); return; }
        try { await rappel.activer(); draw(); toast('Rappel activé.'); }
        catch (err) { toast(err.message); draw(); }
      },
    }, [
      h('span', { class: 'grow' }, [
        h('span', { class: 'item__title', text: 'Rappel quotidien' }),
        h('span', { class: 'item__sub', text: etat.actif ? `Prévu vers ${etat.heure}` : 'Désactivé' }),
      ]),
      h('span', { class: 'toggle' }, h('span', { class: 'toggle__dot' })),
    ]);

    const heure = h('div', { class: 'field mt' }, [
      h('label', { class: 'label', for: 'rappel-heure', text: 'Heure du rappel' }),
      h('input', {
        class: 'input', type: 'time', id: 'rappel-heure', value: etat.heure,
        onchange: (ev) => { rappel.definirHeure(ev.target.value || '19:00'); draw(); },
      }),
    ]);

    carte.replaceChildren(...[
      h('div', { class: 'row', style: 'gap:12px' }, [
        h('span', { class: 'item__icon' }, icon('bell')),
        h('div', { class: 'grow' }, [
          h('h2', { class: 'card__title', text: 'Me rappeler de réviser' }),
          h('p', { class: 'card__sub', text: 'Une notification si la journée passe sans révision.' }),
        ]),
      ]),
      h('div', { class: 'divider', style: 'margin:12px 0' }),
      bascule,
      etat.actif ? heure : null,
      perm === 'denied' ? h('p', { class: 'hint hint--bad mt', text: "Les notifications sont refusées pour cette application. Réglages du téléphone → Notifications → Examen civique." }) : null,
      !rappel.supporte() ? h('p', { class: 'hint mt', text: "Ce navigateur ne gère pas les notifications. Sur iPhone, il faut d'abord ajouter l'application à l'écran d'accueil." }) : null,
      h('p', {
        class: 'hint mt',
        text: "Le rappel s'affiche à l'ouverture de l'application, une fois l'heure passée. Une notification à la seconde près demanderait un serveur d'envoi, que cette application n'a pas — et c'est aussi ce qui lui permet de ne rien savoir de vous.",
      }),
    ].filter(Boolean));
  }

  draw();
  return carte;
}

/* ----------------------------------------------------------------- écran */

export default function renderActivite() {
  const liste = evenements();
  const neufs = nonLus();
  const depuis = store.activitySeenAt();

  // La visite éteint la pastille. On la lit AVANT de la remettre à jour.
  store.markActivitySeen();

  const blocs = [];
  let courant = null;
  let contenu = null;

  for (const e of liste.slice(0, 120)) {
    const g = groupe(e.ts);
    if (g !== courant) {
      courant = g;
      contenu = h('div', { class: 'list' });
      blocs.push(h('div', { class: 'stack stack--tight' }, [
        h('p', { class: 'section-title', style: 'margin:0', text: g }),
        contenu,
      ]));
    }
    const nouveau = e.notifiable && depuis && e.ts > depuis;
    contenu.append(h('a', { class: `item${nouveau ? ' item--neuf' : ''}`, href: e.href }, [
      h('span', { class: `item__icon${e.tone ? ` item__icon--${e.tone}` : ''}` }, icon(e.icone)),
      h('span', { class: 'item__body' }, [
        h('span', { class: 'item__title', text: e.titre }),
        h('span', { class: 'item__sub', text: `${e.sous} · ${formatTime(e.ts)}` }),
      ]),
      nouveau ? h('span', { class: 'badge badge--brand', text: 'nouveau' }) : null,
      h('span', { class: 'item__chev' }, icon('chevron')),
    ].filter(Boolean)));
  }

  const vide = h('div', { class: 'empty' }, [
    h('div', { class: 'empty__icon' }, icon('bell')),
    h('p', { text: "Rien à signaler pour l'instant." }),
    h('p', { class: 'hint mt', text: 'Examens passés, chapitres lus et badges obtenus apparaîtront ici.' }),
    h('a', { class: 'btn mt', href: '#/reviser/revision', text: 'Commencer une révision' }),
  ]);

  return {
    node: h('div', { class: 'stack' }, [
      neufs > 0 ? h('div', { class: 'card card--info' }, [
        h('p', { class: 'small', text: `${neufs} ${plural(neufs, 'nouveauté')} depuis votre dernière visite${depuis ? `, le ${formatDate(depuis)}` : ''}.` }),
      ]) : null,
      carteRappel(),
      ...(blocs.length ? blocs : [vide]),
      liste.length > 120 ? h('p', { class: 'hint center', text: 'Seuls les 120 derniers évènements sont affichés.' }) : null,
    ].filter(Boolean)),
    title: 'Activité',
    back: '#/',
  };
}
