/** Mon compte : profil, sauvegarde, synchronisation, réglages. */

import { h, icon, toast, modal, confirmDialog } from '../lib/dom.js';
import { formatDate, formatDateShort } from '../lib/util.js';
import * as store from '../store.js';
import * as sync from '../sync.js';
import * as ai from '../ai.js';
import { overview } from '../engine.js';
import { QUESTIONS } from '../data/questions.js';
import { LIVRET_QUESTIONS } from '../data/q-livret.js';
import { ROMAN_QUESTIONS } from '../data/roman.js';
import { PRATIQUE } from '../data/programme.js';
import { applyTheme, refresh, navigate, canInstall, promptInstall } from '../app.js';
import renderReglagesIA from './reglages-ia.js';

export default function renderCompte({ params }) {
  if (params[0] === 'ia') return renderReglagesIA();
  if (params[0] === 'synchronisation') return cloudView();
  if (params[0] === 'a-propos') return aboutView();
  return mainView();
}

/* ------------------------------------------------------------- principal */

function mainView() {
  const p = store.current();
  const o = overview();

  const nameInput = h('input', { class: 'input', type: 'text', value: p.name, maxlength: '40' });
  const dateInput = h('input', { class: 'input', type: 'date', value: p.goalDate || '' });

  const identity = h('div', { class: 'card stack' }, [
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
  ]);

  const themePref = p.settings.theme || 'auto';
  const appearance = h('div', { class: 'card stack stack--tight' }, [
    h('h2', { class: 'card__title', text: 'Apparence' }),
    h('div', { class: 'seg' }, [
      ['auto', 'Automatique'], ['light', 'Clair'], ['dark', 'Sombre'],
    ].map(([v, label]) => h('button', {
      class: 'seg__btn', type: 'button', 'aria-pressed': themePref === v ? 'true' : 'false',
      text: label,
      onclick: () => { store.setSetting('theme', v); applyTheme(); refresh(); },
    }))),
  ]);

  const backup = h('div', { class: 'card stack stack--tight' }, [
    h('h2', { class: 'card__title', text: 'Sauvegarde' }),
    h('p', { class: 'card__sub', text: `${o.seen} question${o.seen > 1 ? 's' : ''} suivie${o.seen > 1 ? 's' : ''}, ${o.exams} examen${o.exams > 1 ? 's' : ''} blanc${o.exams > 1 ? 's' : ''}. Exportez un fichier de secours de temps en temps : il se réimporte sur n'importe quel appareil.` }),
    h('div', { class: 'btn-row mt' }, [
      h('button', { class: 'btn btn--ghost', type: 'button', onclick: doExport }, [icon('download'), h('span', { text: 'Exporter' })]),
      h('button', { class: 'btn btn--ghost', type: 'button', onclick: doImport }, [icon('upload'), h('span', { text: 'Importer' })]),
    ]),
  ]);

  const cloudState = sync.isSignedIn()
    ? `Connecté — ${sync.accountEmail()}`
    : sync.isConfigured() ? 'Configurée, non connectée' : 'Non configurée';

  const links = h('div', { class: 'list' }, [
    h('a', { class: 'item item--ai', href: '#/compte/ia' }, [
      h('span', { class: 'item__icon' }, icon('star')),
      h('span', { class: 'item__body' }, [
        h('span', { class: 'item__title', text: 'Assistant et voix' }),
        h('span', {
          class: 'item__sub',
          text: ai.isConfigured()
            ? `${ai.PROVIDERS[ai.provider()].label} · ${ai.model()}${ai.hasVoiceKey() ? ' · voix ElevenLabs' : ''}`
            : 'Brancher une IA et une voix (facultatif)',
        }),
      ]),
      h('span', { class: 'item__chev' }, icon('chevron')),
    ]),
    h('a', { class: 'item', href: '#/compte/synchronisation' }, [
      h('span', { class: 'item__icon' }, icon('cloud')),
      h('span', { class: 'item__body' }, [
        h('span', { class: 'item__title', text: 'Synchronisation entre appareils' }),
        h('span', { class: 'item__sub', text: cloudState }),
      ]),
      h('span', { class: 'item__chev' }, icon('chevron')),
    ]),
    canInstall() ? h('button', {
      class: 'item', type: 'button',
      onclick: async () => { const ok = await promptInstall(); if (ok) toast("L'application est installée."); refresh(); },
    }, [
      h('span', { class: 'item__icon' }, icon('download')),
      h('span', { class: 'item__body' }, [
        h('span', { class: 'item__title', text: "Installer l'application" }),
        h('span', { class: 'item__sub', text: "Pour l'ouvrir depuis l'écran d'accueil, même hors ligne" }),
      ]),
      h('span', { class: 'item__chev' }, icon('chevron')),
    ]) : null,
    h('a', { class: 'item', href: '#/compte/a-propos' }, [
      h('span', { class: 'item__icon' }, icon('info')),
      h('span', { class: 'item__body' }, [
        h('span', { class: 'item__title', text: "À propos et infos pratiques" }),
        h('span', { class: 'item__sub', text: `${QUESTIONS.length} questions · sources officielles` }),
      ]),
      h('span', { class: 'item__chev' }, icon('chevron')),
    ]),
  ].filter(Boolean));

  const others = store.profiles();
  const profilesCard = h('div', { class: 'card stack stack--tight' }, [
    h('h2', { class: 'card__title', text: 'Comptes sur cet appareil' }),
    h('div', { class: 'stack stack--tight' }, others.map((o2) => h('div', { class: 'row row--between' }, [
      h('span', { class: 'grow small' }, [
        h('strong', { text: o2.name }),
        h('span', { class: 'muted', text: ` · créé le ${formatDateShort(o2.createdAt)}` }),
      ]),
      o2.id === p.id
        ? h('span', { class: 'badge badge--brand', text: 'Actif' })
        : h('button', {
          class: 'btn btn--sm btn--ghost', type: 'button', text: 'Utiliser',
          onclick: () => { store.switchProfile(o2.id); applyTheme(); navigate('#/'); },
        }),
    ]))),
    h('button', {
      class: 'btn btn--ghost mt', type: 'button',
      onclick: addProfile,
    }, [icon('plus'), h('span', { text: 'Ajouter un compte' })]),
  ]);

  const danger = h('div', { class: 'card stack stack--tight' }, [
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
  ].filter(Boolean));

  return {
    node: h('div', { class: 'stack' }, [identity, appearance, backup, links, profilesCard, danger]),
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
      parts.push(h('div', { class: 'card stack stack--tight' }, [
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
      ]));
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
      parts.push(h('div', { class: 'card stack stack--tight' }, [
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
      ]));
    } else {
      parts.push(h('div', { class: 'card stack stack--tight' }, [
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
      ].filter(Boolean)));
    }

    parts.push(h('p', { class: 'hint center', text: "Sans synchronisation, pensez simplement à exporter une sauvegarde de temps en temps depuis l'écran précédent." }));
    container.replaceChildren(...parts);
  }

  draw();
  return { node: container, title: 'Synchronisation', back: '#/compte' };
}

/* ---------------------------------------------------------------- about */

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
      h('div', { class: 'card' }, [
        h('h2', { class: 'card__title', text: 'À propos' }),
        h('p', { class: 'card__sub', text: `Application libre et gratuite d'entraînement : ${QUESTIONS.length} questions d'examen, ${LIVRET_QUESTIONS.length} sur le livret du citoyen et ${ROMAN_QUESTIONS.length} sur le récit « La France racontée ». Elle fonctionne hors ligne et ne collecte aucune donnée : votre progression reste sur votre appareil.` }),
        h('p', { class: 'card__sub', style: 'margin-top:8px', text: "Elle ne remplace ni le livret du citoyen, ni les informations officielles, ni l'examen lui-même." }),
        h('p', { class: 'card__sub', style: 'margin-top:8px', text: "L'assistant IA est facultatif. Aucune clé n'est incluse dans l'application : vous fournissez la vôtre, elle reste sur cet appareil et n'est jamais transmise ailleurs qu'à l'API d'Anthropic." }),
      ]),
    ]),
    title: 'À propos',
    back: '#/compte',
  };
}
