/** Première ouverture : création du compte local. */

import { h, icon, toast } from '../lib/dom.js';
import * as store from '../store.js';
import { EXAM } from '../data/programme.js';
import { QUESTIONS } from '../data/questions.js';

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

  const facts = [
    [`${EXAM.questions} questions`, 'à choix multiples'],
    [`${EXAM.minutes} minutes`, 'de temps maximum'],
    [`${EXAM.passing}/${EXAM.questions}`, `soit ${EXAM.passingPct} % pour réussir`],
  ];

  return h('div', { class: 'stack', style: 'padding:22px 16px 40px;max-width:560px;margin:0 auto' }, [
    h('div', { class: 'hero' }, [
      h('p', { class: 'hero__eyebrow', text: 'Naturalisation française' }),
      h('h1', { class: 'hero__title', text: "Préparez l'examen civique" }),
      h('p', { class: 'hero__sub', text: `${QUESTIONS.length} questions d'entraînement, des examens blancs en conditions réelles et un suivi de votre progression. Gratuit, sans publicité, hors ligne.` }),
    ]),

    h('div', { class: 'kpis' }, facts.map(([v, l]) => h('div', { class: 'kpi' }, [
      h('div', { class: 'kpi__val', text: v }),
      h('div', { class: 'kpi__lab', text: l }),
    ]))),

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
