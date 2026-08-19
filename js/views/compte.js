/** Mon compte : profil, sauvegarde, synchronisation, réglages. */

import { h, icon, toast, modal, confirmDialog } from '../lib/dom.js';
import { Card, Button, Badge, Icon, IconTile, SegmentedControl } from '../ds/index.js';
import { formatDate, formatDateShort } from '../lib/util.js';
import * as store from '../store.js';
import * as sync from '../sync.js';
import * as ai from '../ai.js';
import * as fx from '../lib/feedback.js';
import * as rappel from '../lib/rappel.js';
import { overview } from '../engine.js';
import { QUESTIONS } from '../data/questions.js';
import { LIVRET_QUESTIONS } from '../data/q-livret.js';
import { ROMAN_QUESTIONS } from '../data/roman.js';
import { PRATIQUE } from '../data/programme.js';
import { PUBLICATION, CONTENUS } from '../data/build.js';
import { NOUVEAUTES } from '../data/nouveautes.js';
import { chercherUneMiseAJour, installerLaMiseAJour } from '../lib/maj.js';
import { nomPlateforme } from '../lib/plateforme.js';
import { applyTheme, refresh, navigate, canInstall, promptInstall, ecranPrecedent } from '../app.js';
import renderReglagesIA from './reglages-ia.js';

function rappelEtat() {
  const r = rappel.reglage();
  if (!rappel.supporte()) return "Journal des évènements — notifications indisponibles ici";
  if (r.actif && rappel.permission() === 'granted') return `Rappel actif vers ${r.heure}`;
  return 'Journal des évènements, rappel désactivé';
}

export default function renderCompte({ params }) {
  if (params[0] === 'ia') return renderReglagesIA();
  if (params[0] === 'synchronisation') return cloudView();
  if (params[0] === 'a-propos') return aboutView();
  if (params[0] === 'nouveautes') return versionView();
  return mainView();
}

/* ------------------------------------------------------------- principal */

function mainView() {
  const p = store.current();
  const o = overview();

  const nameInput = h('input', { class: 'input', type: 'text', value: p.name, maxlength: '40' });
  const dateInput = h('input', { class: 'input', type: 'date', value: p.goalDate || '' });

  const identity = Card({ surface: 'white', elevation: 'xs', className: 'stack', children: [
    h('h2', { class: 'card__title', text: 'Mon profil' }),
    h('div', { class: 'field' }, [
      h('label', { class: 'label', text: 'Prénom' }),
      nameInput,
    ]),
    h('div', { class: 'field' }, [
      h('label', { class: 'label', text: "Date de l'examen" }),
      dateInput,
    ]),
    h('button', {
      class: 'btn btn--ghost', type: 'button', text: 'Enregistrer',
      onclick: () => {
        store.updateProfile({ name: nameInput.value.trim() || p.name, goalDate: dateInput.value || null });
        toast('Profil mis à jour.');
        refresh();
      },
    }),
  ] });

  const themePref = p.settings.theme || 'auto';
  const appearance = Card({ surface: 'white', elevation: 'xs', className: 'stack stack--tight', children: [
    h('h2', { class: 'card__title', text: 'Apparence' }),
    // `SegmentedControl` du système. « Auto » et non « Automatique » : à 320px
    // de large, le mot long ne tient pas dans un tiers de la carte.
    SegmentedControl({
      options: [
        { value: 'auto', label: 'Auto' },
        { value: 'light', label: 'Clair' },
        { value: 'dark', label: 'Sombre' },
      ],
      value: themePref,
      onChange: (v) => { store.setSetting('theme', v); applyTheme(); refresh(); },
    }),
  ] });

  const s = p.settings || {};
  const bascule = (cle, titre, sous, defaut = true) => {
    const actif = s[cle] !== false && (s[cle] !== undefined || defaut);
    return h('button', {
      class: 'switch switchrow', type: 'button', role: 'switch',
      'aria-checked': actif ? 'true' : 'false',
      onclick: () => { store.setSetting(cle, !actif); if (!actif) fx.tap(); refresh(); },
    }, [
      h('span', { class: 'grow', style: 'text-align:left' }, [
        h('div', { class: 'ds-lesson__title ds-lesson__titre--long', text: titre }),
        h('div', { class: 'ds-lesson__meta', text: sous }),
      ]),
      h('span', { class: 'toggle' }, h('span', { class: 'toggle__dot' })),
    ]);
  };

  const sensations = Card({ surface: 'white', elevation: 'xs', className: 'stack stack--tight', children: [
    h('h2', { class: 'card__title', text: 'Sons et vibrations' }),
    bascule('sound', 'Sons', 'Un petit signal à chaque réponse et à la fin d\'une série'),
    bascule('haptics', 'Vibration', fx.vibrationDisponible()
      ? 'Une brève vibration en même temps que le son'
      : "Non proposé par ce navigateur — sur iPhone, aucune application web n'a accès au moteur haptique"),
  ] });

  const backup = Card({ surface: 'white', elevation: 'xs', className: 'stack stack--tight', children: [
    h('h2', { class: 'card__title', text: 'Sauvegarde' }),
    h('p', { class: 'card__sub', text: `${o.seen} question${o.seen > 1 ? 's' : ''} suivie${o.seen > 1 ? 's' : ''}, ${o.exams} examen${o.exams > 1 ? 's' : ''} blanc${o.exams > 1 ? 's' : ''}. Exportez un fichier de secours de temps en temps : il se réimporte sur n'importe quel appareil.` }),
    h('div', { class: 'btn-row mt' }, [
      h('button', { class: 'btn btn--ghost', type: 'button', onclick: doExport }, [icon('download'), h('span', { text: 'Exporter' })]),
      h('button', { class: 'btn btn--ghost', type: 'button', onclick: doImport }, [icon('upload'), h('span', { text: 'Importer' })]),
    ]),
  ] });

  const cloudState = sync.isSignedIn()
    ? `Connecté — ${sync.accountEmail()}`
    : sync.isConfigured() ? 'Configurée, non connectée' : 'Non configurée';

  const links = h('div', { class: 'list' }, [
    h('a', { class: 'ds-lesson ds-lesson--tap item--ai', href: '#/compte/ia' }, [
      IconTile({ icon: 'star', tone: 'lavender', size: 38 }),
      h('div', { class: 'ds-lesson__body' }, [
        h('div', { class: 'ds-lesson__title ds-lesson__titre--long', text: 'Assistant et voix' }),
        h('span', {
          class: 'ds-lesson__meta',
          text: ai.isConfigured()
            ? `${ai.PROVIDERS[ai.provider()].label} · ${ai.model()}${ai.hasVoiceKey() ? ' · voix ElevenLabs' : ''}`
            : 'Brancher une IA et une voix (facultatif)',
        }),
      ]),
      Icon({ name: 'chevron-right', size: 18, className: 'ds-lesson__chev' }),
    ]),
    h('a', { class: 'ds-lesson ds-lesson--tap', href: '#/activite' }, [
      IconTile({ icon: 'bell', tone: 'sunken', size: 38 }),
      h('div', { class: 'ds-lesson__body' }, [
        h('div', { class: 'ds-lesson__title ds-lesson__titre--long', text: 'Activité et rappel quotidien' }),
        h('div', { class: 'ds-lesson__meta', text: rappelEtat() }),
      ]),
      Icon({ name: 'chevron-right', size: 18, className: 'ds-lesson__chev' }),
    ]),
    h('a', { class: 'ds-lesson ds-lesson--tap', href: '#/compte/synchronisation' }, [
      IconTile({ icon: 'cloud', tone: 'sunken', size: 38 }),
      h('div', { class: 'ds-lesson__body' }, [
        h('div', { class: 'ds-lesson__title ds-lesson__titre--long', text: 'Synchronisation entre appareils' }),
        h('div', { class: 'ds-lesson__meta', text: cloudState }),
      ]),
      Icon({ name: 'chevron-right', size: 18, className: 'ds-lesson__chev' }),
    ]),
    canInstall() ? h('button', {
      class: 'ds-lesson ds-lesson--tap', type: 'button',
      onclick: async () => { const ok = await promptInstall(); if (ok) toast("L'application est installée."); refresh(); },
    }, [
      IconTile({ icon: 'download', tone: 'sunken', size: 38 }),
      h('div', { class: 'ds-lesson__body' }, [
        h('div', { class: 'ds-lesson__title ds-lesson__titre--long', text: "Installer l'application" }),
        h('div', { class: 'ds-lesson__meta', text: "Pour l'ouvrir depuis l'écran d'accueil, même hors ligne" }),
      ]),
      Icon({ name: 'chevron-right', size: 18, className: 'ds-lesson__chev' }),
    ]) : null,
    h('a', { class: 'ds-lesson ds-lesson--tap', href: '#/compte/nouveautes' }, [
      IconTile({ icon: 'refresh', tone: 'sunken', size: 38 }),
      h('div', { class: 'ds-lesson__body' }, [
        h('div', { class: 'ds-lesson__title ds-lesson__titre--long', text: 'Version et nouveautés' }),
        h('div', { class: 'ds-lesson__meta', text: `Mise à jour du ${formatDate(PUBLICATION.date)}` }),
      ]),
      Icon({ name: 'chevron-right', size: 18, className: 'ds-lesson__chev' }),
    ]),
    h('a', { class: 'ds-lesson ds-lesson--tap', href: '#/compte/a-propos' }, [
      IconTile({ icon: 'info', tone: 'sunken', size: 38 }),
      h('div', { class: 'ds-lesson__body' }, [
        h('div', { class: 'ds-lesson__title ds-lesson__titre--long', text: "À propos et infos pratiques" }),
        h('div', { class: 'ds-lesson__meta', text: `${QUESTIONS.length} questions · sources officielles` }),
      ]),
      Icon({ name: 'chevron-right', size: 18, className: 'ds-lesson__chev' }),
    ]),
  ].filter(Boolean));

  const others = store.profiles();
  const profilesCard = Card({ surface: 'white', elevation: 'xs', className: 'stack stack--tight', children: [
    h('h2', { class: 'card__title', text: 'Comptes sur cet appareil' }),
    h('div', { class: 'stack stack--tight' }, others.map((o2) => h('div', { class: 'row row--between' }, [
      h('span', { class: 'grow small' }, [
        h('strong', { text: o2.name }),
        h('span', { class: 'muted', text: ` · créé le ${formatDateShort(o2.createdAt)}` }),
      ]),
      o2.id === p.id
        ? Badge({ tone: 'info', label: 'Actif' })
        : h('button', {
          class: 'btn btn--sm btn--ghost', type: 'button', text: 'Utiliser',
          onclick: () => { store.switchProfile(o2.id); applyTheme(); navigate('#/'); },
        }),
    ]))),
    h('button', {
      class: 'btn btn--ghost mt', type: 'button',
      onclick: addProfile,
    }, [icon('plus'), h('span', { text: 'Ajouter un compte' })]),
  ] });

  const danger = Card({ surface: 'white', elevation: 'xs', className: 'stack stack--tight', children: [
    h('h2', { class: 'card__title', text: 'Zone sensible' }),
    h('p', { class: 'card__sub', text: 'Ces actions sont définitives. Exportez une sauvegarde avant.' }),
    h('button', {
      class: 'btn btn--danger mt', type: 'button', text: 'Réinitialiser ma progression',
      onclick: async () => {
        const ok = await confirmDialog({
          title: 'Tout remettre à zéro ?',
          text: 'Vos réponses, vos examens blancs et votre historique seront effacés. Le compte est conservé.',
          confirmLabel: 'Réinitialiser', danger: true,
        });
        if (ok) { store.resetProgress(); toast('Progression réinitialisée.'); refresh(); }
      },
    }),
    others.length > 1 ? h('button', {
      class: 'btn btn--danger', type: 'button', text: 'Supprimer ce compte',
      onclick: async () => {
        const ok = await confirmDialog({
          title: `Supprimer « ${p.name} » ?`,
          text: 'Le compte et toute sa progression seront effacés de cet appareil.',
          confirmLabel: 'Supprimer', danger: true,
        });
        if (ok) { store.deleteProfile(p.id); toast('Compte supprimé.'); navigate('#/'); refresh(); }
      },
    }) : null,
  ].filter(Boolean) });

  return {
    node: h('div', { class: 'stack' }, [identity, appearance, sensations, backup, links, profilesCard, danger]),
    title: 'Mon compte',
    back: '#/',
  };
}

/* -------------------------------------------------------- export/import */

function doExport() {
  const payload = store.exportPayload();
  if (!payload) return;
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `examen-civique-${payload.profile.name.replace(/\W+/g, '-').toLowerCase()}-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
  toast('Sauvegarde téléchargée.');
}

function doImport() {
  const input = h('input', { type: 'file', accept: 'application/json,.json', style: 'display:none' });
  input.addEventListener('change', async () => {
    const file = input.files?.[0];
    if (!file) return;
    try {
      const payload = JSON.parse(await file.text());
      const mode = await modal((close) => [
        h('h2', { class: 'modal__title', text: 'Importer la sauvegarde' }),
        h('p', { class: 'modal__text', text: `Sauvegarde de « ${payload?.profile?.name || 'compte inconnu'} ». Que faire ?` }),
        h('div', { class: 'stack stack--tight' }, [
          h('button', { class: 'btn', type: 'button', text: 'Créer un nouveau compte', onclick: () => close('nouveau') }),
          h('button', { class: 'btn btn--ghost', type: 'button', text: 'Remplacer le compte actuel', onclick: () => close('remplacer') }),
          h('button', { class: 'btn btn--quiet', type: 'button', text: 'Annuler', onclick: () => close(null) }),
        ]),
      ]);
      if (!mode) return;
      store.importPayload(payload, mode);
      toast('Sauvegarde importée.');
      applyTheme();
      navigate('#/');
      refresh();
    } catch (err) {
      toast(err.message || 'Fichier illisible.');
    }
  });
  document.body.append(input);
  input.click();
  setTimeout(() => input.remove(), 60000);
}

function addProfile() {
  return modal((close) => {
    const nameInput = h('input', { class: 'input', type: 'text', placeholder: 'Prénom', maxlength: '40' });
    return [
      h('h2', { class: 'modal__title', text: 'Nouveau compte' }),
      h('p', { class: 'modal__text', text: 'Utile pour préparer l\'examen à plusieurs sur le même téléphone. Chaque compte a sa propre progression.' }),
      h('div', { class: 'stack stack--tight' }, [
        nameInput,
        h('button', {
          class: 'btn', type: 'button', text: 'Créer',
          onclick: () => {
            const name = nameInput.value.trim();
            if (!name) { nameInput.focus(); return; }
            store.createProfile(name);
            close(true);
            applyTheme();
            navigate('#/');
            refresh();
          },
        }),
        h('button', { class: 'btn btn--quiet', type: 'button', text: 'Annuler', onclick: () => close(false) }),
      ]),
    ];
  });
}

/* ------------------------------------------------------ synchronisation */

function cloudView() {
  const container = h('div', { class: 'stack' });

  function draw() {
    const cfg = sync.config();
    const parts = [];

    parts.push(h('div', { class: 'card' }, [
      h('h2', { class: 'card__title', text: 'Retrouver sa progression partout' }),
      h('p', { class: 'card__sub', text: "Par défaut, tout reste sur cet appareil. En reliant l'application à votre propre espace Supabase (offre gratuite), vous pouvez sauvegarder votre progression en ligne et la récupérer sur un autre téléphone." }),
      h('p', { class: 'card__sub', style: 'margin-top:8px', text: "La marche à suivre détaillée figure dans le fichier README du projet. Vous n'avez besoin que de deux informations : l'adresse du projet et la clé publique (anon)." }),
    ]));

    if (!sync.isConfigured()) {
      const urlInput = h('input', { class: 'input', type: 'url', placeholder: 'https://xxxx.supabase.co', autocapitalize: 'off', autocorrect: 'off' });
      const keyInput = h('input', { class: 'input', type: 'text', placeholder: 'Clé publique (anon)', autocapitalize: 'off', autocorrect: 'off' });
      parts.push(Card({ surface: 'white', elevation: 'xs', className: 'stack stack--tight', children: [
        h('h2', { class: 'card__title', text: 'Configurer' }),
        h('div', { class: 'field' }, [h('label', { class: 'label', text: 'Adresse du projet' }), urlInput]),
        h('div', { class: 'field' }, [h('label', { class: 'label', text: 'Clé publique' }), keyInput]),
        h('button', {
          class: 'btn mt', type: 'button', text: 'Enregistrer la configuration',
          onclick: () => {
            try { sync.configure({ url: urlInput.value, anonKey: keyInput.value }); toast('Configuration enregistrée.'); draw(); }
            catch (err) { toast(err.message); }
          },
        }),
      ] }));
    } else if (!sync.isSignedIn()) {
      const email = h('input', { class: 'input', type: 'email', placeholder: 'Adresse e-mail', autocapitalize: 'off' });
      const pass = h('input', { class: 'input', type: 'password', placeholder: 'Mot de passe (8 caractères minimum)' });
      const run = async (fn, okMsg) => {
        try {
          const out = await fn(email.value.trim(), pass.value);
          if (out?.needsConfirmation) { toast('Confirmez votre adresse par courriel, puis connectez-vous.'); return; }
          toast(okMsg);
          draw();
        } catch (err) { toast(err.message || 'Échec.'); }
      };
      parts.push(Card({ surface: 'white', elevation: 'xs', className: 'stack stack--tight', children: [
        h('h2', { class: 'card__title', text: 'Votre compte en ligne' }),
        email, pass,
        h('div', { class: 'btn-row mt' }, [
          h('button', { class: 'btn', type: 'button', text: 'Se connecter', onclick: () => run(sync.signIn, 'Connecté.') }),
          h('button', { class: 'btn btn--ghost', type: 'button', text: 'Créer', onclick: () => run(sync.signUp, 'Compte créé.') }),
        ]),
        h('button', {
          class: 'btn btn--quiet', type: 'button', text: 'Changer de projet',
          onclick: () => { sync.forget(); toast('Configuration effacée.'); draw(); },
        }),
      ] }));
    } else {
      parts.push(Card({ surface: 'white', elevation: 'xs', className: 'stack stack--tight', children: [
        h('h2', { class: 'card__title', text: 'Connecté' }),
        h('p', { class: 'card__sub', text: sync.accountEmail() }),
        cfg?.lastSync ? h('p', { class: 'card__sub', text: `Dernière synchronisation : ${formatDate(cfg.lastSync)}` }) : null,
        h('div', { class: 'btn-row mt' }, [
          h('button', {
            class: 'btn', type: 'button',
            onclick: async (e) => {
              e.currentTarget.disabled = true;
              try { await sync.push(); toast('Progression envoyée.'); } catch (err) { toast(err.message); }
              draw();
            },
          }, [icon('upload'), h('span', { text: 'Envoyer' })]),
          h('button', {
            class: 'btn btn--ghost', type: 'button',
            onclick: async () => {
              const ok = await confirmDialog({
                title: 'Récupérer la sauvegarde en ligne ?',
                text: 'Votre progression sur cet appareil sera remplacée par celle enregistrée en ligne.',
                confirmLabel: 'Récupérer', danger: true,
              });
              if (!ok) return;
              try {
                const at = await sync.pull();
                toast(at ? 'Progression récupérée.' : 'Aucune sauvegarde en ligne pour l\'instant.');
              } catch (err) { toast(err.message); }
              draw();
            },
          }, [icon('download'), h('span', { text: 'Récupérer' })]),
        ]),
        h('button', {
          class: 'btn btn--quiet', type: 'button', text: 'Se déconnecter',
          onclick: () => { sync.signOut(); toast('Déconnecté.'); draw(); },
        }),
      ].filter(Boolean) }));
    }

    parts.push(h('p', { class: 'hint center', text: "Sans synchronisation, pensez simplement à exporter une sauvegarde de temps en temps depuis l'écran précédent." }));
    container.replaceChildren(...parts);
  }

  draw();
  return { node: container, title: 'Synchronisation', back: '#/compte' };
}

/* ---------------------------------------------------------------- about */

/* ------------------------------------------------- version et nouveautés */

/** Combien de questions dans chaque bloc de contenu — pour ceux qui en ont. */
const VOLUME = {
  examen: () => `${QUESTIONS.length} questions`,
  livret: () => `${LIVRET_QUESTIONS.length} questions · 16 chapitres`,
  recit: () => `${ROMAN_QUESTIONS.length} questions · 22 chapitres`,
};

/**
 * « Ces informations datent de quand ? »
 *
 * La question est légitime pour un contenu qui suit un programme officiel, et
 * elle a deux moitiés : la date de l'application qu'on a EN MAIN — celle-ci
 * peut dormir dans le cache d'un téléphone pendant des semaines —, et la date
 * de chaque contenu. Les deux sont ici, et aucune n'est saisie à la main :
 * elles viennent de l'historique du dépôt (voir scripts/make-version.mjs).
 */
function versionView() {
  const resultat = h('p', { class: 'hint', style: 'margin-top:10px' });
  const actions = h('div', { class: 'stack stack--tight', style: 'margin-top:10px' });

  const bouton = Button({
    variant: 'secondary', size: 'lg', fullWidth: true, iconLeft: 'refresh',
    label: 'Rechercher une mise à jour',
    onClick: async () => {
      bouton.disabled = true;
      resultat.textContent = 'Vérification en cours…';
      actions.replaceChildren();
      const r = await chercherUneMiseAJour();
      bouton.disabled = false;
      if (r.etat === 'a-jour') {
        resultat.className = 'hint hint--ok';
        resultat.textContent = `Vous avez la dernière version, publiée le ${formatDate(PUBLICATION.date)}.`;
      } else if (r.etat === 'nouvelle') {
        resultat.className = 'hint';
        resultat.textContent = r.publiee
          ? `Une version plus récente existe, publiée le ${formatDate(r.publiee)}.`
          : 'Une version plus récente existe.';
        actions.replaceChildren(Button({
          variant: 'primary', size: 'lg', fullWidth: true, iconLeft: 'download',
          label: 'Installer et recharger',
          // Vider le cache puis recharger : sans cela l'application resservirait
          // les fichiers qu'on veut justement remplacer.
          onClick: () => installerLaMiseAJour(),
        }));
      } else {
        resultat.className = 'hint';
        resultat.textContent = "Serveur injoignable. Vous êtes peut-être hors ligne : l'application continue de fonctionner, réessayez une fois connecté.";
      }
    },
  });

  const version = Card({ surface: 'white', elevation: 'xs', children: [
    h('h2', { class: 'card__title', text: "Version de l'application" }),
    h('p', { class: 'card__sub', text: `Dernière mise à jour le ${formatDate(PUBLICATION.date)}.` }),
    h('p', { class: 'hint', style: 'margin-top:4px', text: `Repère de version : ${PUBLICATION.commit}` }),
    /* Ce que l'application reconnaît de l'appareil. Écrit noir sur blanc parce
       que c'est invérifiable autrement : quand la barre du bas n'a pas
       l'apparence attendue, c'est ici qu'on voit si le téléphone a été reconnu
       ou si c'est le matériau qui manque. */
    h('p', {
      class: 'hint',
      text: nomPlateforme() === 'apple'
        ? 'Appareil Apple reconnu : barres en verre, comme celles du système.'
        : 'Appareil non Apple : barres pleines, comme celles du système.',
    }),
    h('div', { style: 'margin-top:12px' }, bouton),
    resultat,
    actions,
  ] });

  const contenus = Card({ surface: 'white', elevation: 'xs', children: [
    h('h2', { class: 'card__title', text: 'De quand datent les contenus' }),
    h('p', { class: 'card__sub', text: "Chaque bloc porte la date de sa dernière modification réelle. Une date qui ne bouge pas veut dire que rien n'a changé — pas que personne ne regarde." }),
    h('div', { class: 'stack stack--tight mt' }, CONTENUS.map((c) => h('div', { class: 'row row--between' }, [
      h('span', { class: 'grow small' }, [
        h('strong', { text: c.libelle }),
        VOLUME[c.cle] ? h('span', { class: 'muted', text: ` · ${VOLUME[c.cle]()}` }) : null,
      ].filter(Boolean)),
      h('span', { class: 'hint', text: c.date ? formatDate(c.date) : '—' }),
    ]))),
    h('p', { class: 'hint mt', text: "Les sources officielles — décret, arrêté, livret du citoyen — sont listées dans « À propos »." }),
    h('div', { style: 'margin-top:10px' }, Button({
      variant: 'ghost', size: 'md', fullWidth: true, href: '#/compte/a-propos',
      label: 'Voir les sources',
    })),
  ] });

  const journal = h('div', { class: 'stack stack--tight' }, NOUVEAUTES.map((n) => Card({
    surface: 'white', elevation: 'xs', children: [
      h('p', { class: 'label', text: formatDate(n.date) }),
      h('h3', { class: 'card__title', style: 'font-size:16px;margin-top:2px', text: n.titre }),
      h('ul', { class: 'prose small', style: 'margin-top:6px' }, n.lignes.map((l) => h('li', { text: l }))),
    ],
  })));

  return {
    node: h('div', { class: 'stack' }, [
      version,
      contenus,
      h('p', { class: 'section-title', text: 'Nouveautés' }),
      journal,
    ]),
    title: 'Version et nouveautés',
    // Deux portes mènent ici : la liste « Mon compte » et le pied de l'accueil.
    // Le retour ramène d'où l'on vient, sinon on se retrouve dans un écran
    // qu'on n'a jamais ouvert.
    back: ecranPrecedent('#/compte'),
  };
}

function aboutView() {
  const rows = [
    ['Qui est concerné', PRATIQUE.qui],
    ["Format de l'épreuve", PRATIQUE.format],
    ['Seuil de réussite', PRATIQUE.reussite],
    ['Où le passer', PRATIQUE.organismes],
    ['Inscription et coût', PRATIQUE.prix],
    ['Validité', PRATIQUE.validite],
    ['Document de référence', PRATIQUE.support],
  ];

  return {
    node: h('div', { class: 'stack' }, [
      h('div', { class: 'card' }, [
        h('h2', { class: 'card__title', text: "L'examen civique en bref" }),
        h('div', { class: 'stack stack--tight mt' }, rows.map(([k, v]) => h('div', {}, [
          h('p', { class: 'label', text: k }),
          h('p', { class: 'small', text: v }),
        ]))),
      ]),
      h('div', { class: 'card' }, [
        h('h2', { class: 'card__title', text: 'Sources' }),
        h('ul', { class: 'prose small', style: 'margin-top:8px' }, [
          h('li', { html: 'Décret n° 2025-648 du 15 juillet 2025 instituant l\'examen civique' }),
          h('li', { html: 'Arrêté du 10 octobre 2025 relatif au programme, aux épreuves et aux modalités d\'organisation de l\'examen civique' }),
          h('li', { html: "Livret du citoyen, ministère de l'Intérieur — édition mai 2026, transcrit intégralement dans l'application" }),
          h('li', {}, [
            'Téléchargement officiel : ',
            h('a', {
              href: 'https://www.immigration.interieur.gouv.fr/documentation/guides-textes-et-brochures/livret-du-citoyen.html',
              target: '_blank', rel: 'noopener',
              text: 'immigration.interieur.gouv.fr',
            }),
          ]),
          h('li', { html: 'service-public.fr et legifrance.gouv.fr' }),
        ]),
        h('p', { class: 'hint mt', text: PRATIQUE.note }),
      ]),
      /* Vie privée. L'application va être partagée : ceux qui la reçoivent ont
         le droit de savoir ce qu'elle fait de ce qu'ils y mettent, sans avoir
         à lire le code. Tout est vérifiable dans le dépôt. */
      h('div', { class: 'card' }, [
        h('h2', { class: 'card__title', text: 'Vos données' }),
        h('ul', { class: 'prose small', style: 'margin-top:8px' }, [
          h('li', { html: '<strong>Tout reste sur votre appareil.</strong> Prénom, progression, examens passés, réglages : enregistrés dans le navigateur, sur ce téléphone ou cet ordinateur. Rien n\'est envoyé nulle part.' }),
          h('li', { html: 'Aucun compte, aucune inscription, aucune adresse e-mail demandée.' }),
          h('li', { html: 'Aucune publicité, aucun traceur, aucun cookie de mesure d\'audience.' }),
          h('li', { html: '<strong>Synchronisation</strong> (facultative) : elle envoie votre progression vers <em>votre</em> propre espace, dont vous fournissez l\'adresse. Ni l\'auteur de l\'application ni personne d\'autre n\'y a accès.' }),
          h('li', { html: '<strong>Assistant IA</strong> (facultatif) : votre clé reste sur cet appareil et n\'est jamais transmise ailleurs qu\'au fournisseur que vous avez choisi. Sans clé, l\'assistant est simplement absent — le reste fonctionne.' }),
          h('li', { html: 'Effacer vos données : « Réinitialiser » plus haut dans Mon compte, ou vider les données du site dans les réglages du navigateur. Il n\'y a rien à effacer ailleurs.' }),
        ]),
        h('p', { class: 'hint mt', text: "Application gratuite, sans but lucratif, publiée en logiciel libre (licence MIT). Le code est public : tout ce qui est écrit ici s'y vérifie." }),
      ]),
      h('div', { class: 'card' }, [
        h('h2', { class: 'card__title', text: 'À propos' }),
        h('p', { class: 'card__sub', text: `Application libre et gratuite d'entraînement : ${QUESTIONS.length} questions d'examen, ${LIVRET_QUESTIONS.length} sur le livret du citoyen et ${ROMAN_QUESTIONS.length} sur le récit « La France racontée ». Elle fonctionne hors ligne et ne collecte aucune donnée : votre progression reste sur votre appareil.` }),
        h('p', { class: 'card__sub', style: 'margin-top:8px', text: "Elle n'est ni éditée, ni approuvée, ni contrôlée par le ministère de l'Intérieur, et ne remplace ni le livret du citoyen, ni les informations officielles, ni l'examen lui-même. En cas de doute, le document officiel fait foi." }),
        h('p', { class: 'card__sub', style: 'margin-top:8px', text: "L'assistant IA est facultatif. Aucune clé n'est incluse dans l'application : vous fournissez la vôtre, elle reste sur cet appareil et n'est jamais transmise ailleurs qu'à l'API d'Anthropic." }),
      ]),
    ]),
    title: 'À propos',
    back: '#/compte',
  };
}
