/** Première ouverture : création du compte local. */

import { h, icon, toast } from '../lib/dom.js';
import { Card, Button, StatTile } from '../ds/index.js';
import * as store from '../store.js';
import { EXAM } from '../data/programme.js';
import { TOUTES_LES_QUESTIONS } from '../data/banques.js';

export default function renderOnboarding({ onDone }) {
  const nameInput = h('input', {
    class: 'input', type: 'text', id: 'ob-name', placeholder: 'Votre prénom',
    autocomplete: 'given-name', maxlength: '40',
  });
  const dateInput = h('input', { class: 'input', type: 'date', id: 'ob-date' });

  function submit(e) {
    e.preventDefault();
    const name = nameInput.value.trim();
    if (!name) { nameInput.focus(); toast('Indiquez un prénom pour votre compte.'); return; }
    store.createProfile(name, dateInput.value || null);
    toast(`Bienvenue ${name} !`);
    onDone();
  }

  // Le nombre d'un côté, son unité de l'autre : « 40 questions » écrit d'un
  // bloc à la taille d'un titre ne tient pas dans un tiers d'écran.
  // Le nombre seul reste grand ; l'unité passe dans l'intitulé plutôt que de
  // disputer la place au chiffre. « 40 questions » écrit d'un bloc à la
  // taille d'un titre ne tenait pas dans un tiers de la largeur d'un écran.
  const facts = [
    [EXAM.questions, null, 'questions à choix multiples'],
    [EXAM.minutes, null, 'minutes au maximum'],
    [EXAM.passing, `/${EXAM.questions}`, `pour réussir, soit ${EXAM.passingPct}\u00A0%`],
  ];

  return h('div', { class: 'stack', style: 'padding:22px 16px 40px;max-width:560px;margin:0 auto' }, [
    h('div', { class: 'hero' }, [
      h('p', { class: 'hero__eyebrow', text: 'Naturalisation française' }),
      h('h1', { class: 'hero__title', text: "Préparez l'examen civique" }),
      h('p', { class: 'hero__sub', // Le total des trois banques : annoncer les seules 363 questions d'examen
      // sous-estimait de moitié ce que l'application contient réellement.
      text: `${TOUTES_LES_QUESTIONS.length} questions d'entraînement, des examens blancs en conditions réelles et un suivi de votre progression. Gratuit, sans publicité, hors ligne.` }),
    ]),

    h('div', { class: 'tiles-3' },
      facts.map(([v, u, l]) => StatTile({ value: v, unit: u, label: l, surface: 'white', align: 'center' }))),

    h('form', { class: 'card stack', onsubmit: submit }, [
      h('div', {}, [
        h('h2', { class: 'card__title', text: 'Créer votre compte' }),
        h('p', { class: 'card__sub', text: 'Votre compte et votre progression restent sur cet appareil. Rien n\'est envoyé sur internet.' }),
      ]),
      h('div', { class: 'field' }, [
        h('label', { class: 'label', for: 'ob-name', text: 'Prénom' }),
        nameInput,
      ]),
      h('div', { class: 'field' }, [
        h('label', { class: 'label', for: 'ob-date', text: "Date de l'examen (facultatif)" }),
        dateInput,
        h('p', { class: 'hint', text: "Sert à calculer le nombre de jours qu'il vous reste." }),
      ]),
      h('button', { class: 'btn', type: 'submit' }, [icon('play'), h('span', { text: 'Commencer' })]),
    ]),

    h('p', { class: 'hint center', text: "Application indépendante d'entraînement. Elle ne remplace ni le livret du citoyen ni les informations officielles de service-public.fr." }),
  ]);
}
