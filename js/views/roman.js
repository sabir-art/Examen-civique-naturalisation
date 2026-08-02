/**
 * « La France racontée » — le programme raconté comme un roman.
 *
 * On lit un chapitre, on garde l'encadré « à retenir » en tête, puis on répond
 * à quelques questions. Progression suivie à part des deux autres sections.
 */

import { h, icon } from '../lib/dom.js';
import { ROMAN, ACTES, ACTE_BY_KEY, CHAPITRE_BY_KEY, CHAPITRES, TOTAL_MINUTES, nextChapitre, prevChapitre, questionsOf } from '../data/roman.js';
import { buildRomanSet, romanMastery, romanActeMastery, romanOverview, nextUnread } from '../engine.js';
import { runQuiz } from './reviser.js';
import { navigate } from '../app.js';
import * as store from '../store.js';
import * as fx from '../lib/feedback.js';

export default function renderRoman({ params }) {
  const target = params[0];
  if (!target) return sommaire();
  if (target.startsWith('a/')) return acte(target.slice(2));
  if (target.startsWith('c/')) return chapitre(target.slice(2));
  if (target.startsWith('q/')) return quiz({ chapitre: target.slice(2) });
  if (target.startsWith('qa/')) return quiz({ acte: target.slice(3) });
  if (target === 'quiz') return quiz({});
  return sommaire();
}

const tone = (m) => (m >= 70 ? 'ok' : m >= 35 ? 'warn' : 'bad');

/* ------------------------------------------------------------- sommaire */

function sommaire() {
  const o = romanOverview();
  const suite = nextUnread();
  const reprise = suite || CHAPITRES[CHAPITRES.length - 1];

  const head = h('div', { class: 'hero hero--story' }, [
    h('p', { class: 'hero__eyebrow', text: ROMAN.sous_titre }),
    h('h1', { class: 'hero__title', text: ROMAN.titre }),
    h('p', {
      class: 'hero__sub',
      text: `${o.chapitres} chapitres, environ ${TOTAL_MINUTES} minutes de lecture. Tout le programme de l'examen, sous forme d'histoires — et ${o.total} questions pour vérifier que ça reste.`,
    }),
  ]);

  const lecture = Math.round((o.lus / o.chapitres) * 100);
  const kpis = h('div', { class: 'kpis' }, [
    ['chapitres lus', `${o.lus}/${o.chapitres}`],
    ['mémorisation', `${o.mastery} %`],
    ['bonnes réponses', o.accuracy === null ? '—' : `${o.accuracy} %`],
  ].map(([lab, val]) => h('div', { class: 'kpi' }, [
    h('div', { class: 'kpi__val', text: val }),
    h('div', { class: 'kpi__lab', text: lab }),
  ])));

  const actions = h('div', { class: 'stack stack--tight' }, [
    h('div', { class: 'bar' }, h('div', { class: 'bar__fill', style: `width:${lecture}%` })),
    h('a', { class: 'btn', href: `#/histoire/c/${reprise.key}` }, [
      icon('play'),
      h('span', { text: o.lus === 0 ? 'Commencer par le début' : suite ? `Reprendre : ${reprise.titre}` : 'Relire le dernier chapitre' }),
    ]),
    o.lus > 0 ? h('a', { class: 'btn btn--ghost', href: '#/histoire/quiz', text: `Quiz sur toute l'histoire (${o.total} questions)` }) : null,
    o.due > 0 ? h('p', { class: 'hint center', text: `${o.due} question${o.due > 1 ? 's' : ''} du récit à revoir aujourd'hui.` }) : null,
  ].filter(Boolean));

  const list = h('div', { class: 'list' }, ACTES.map((a) => {
    const m = Math.round(romanActeMastery(a.key) * 100);
    const lus = store.readCount(a.chapitres.map((c) => c.key));
    return h('a', { class: 'item item--story', href: `#/histoire/a/${a.key}`, style: 'align-items:flex-start' }, [
      h('span', { class: 'item__icon' }, icon(a.icon)),
      h('span', { class: 'item__body' }, [
        h('span', { class: 'item__title', text: `Acte ${a.num} — ${a.titre}` }),
        h('span', { class: 'item__sub', text: `${a.epoque} · ${a.chapitres.length} chapitres · ${lus} lu${lus > 1 ? 's' : ''}` }),
        h('div', { class: 'bar', style: 'margin-top:8px' }, h('div', { class: `bar__fill bar__fill--${tone(m)}`, style: `width:${m}%` })),
      ]),
      h('span', { class: 'item__chev', style: 'margin-top:10px' }, icon('chevron')),
    ]);
  }));

  return {
    node: h('div', { class: 'stack' }, [
      head,
      kpis,
      actions,
      h('p', { class: 'section-title', text: 'Les trois actes' }),
      list,
      h('p', { class: 'hint center mt', text: "Les faits sont ceux du programme officiel et du livret du citoyen ; c'est la façon de les raconter qui change. Les scènes sont écrites pour rendre les dates et les noms plus faciles à retenir." }),
    ]),
    title: 'La France racontée',
  };
}

/* ----------------------------------------------------------------- acte */

function acte(key) {
  const a = ACTE_BY_KEY.get(key);
  if (!a) return sommaire();

  const list = h('div', { class: 'list' }, a.chapitres.map((c) => {
    const m = Math.round(romanMastery(c.key) * 100);
    const lu = store.isRead(c.key);
    return h('a', { class: `item ${lu ? 'item--story' : ''}`, href: `#/histoire/c/${c.key}`, style: 'align-items:flex-start' }, [
      h('span', { class: 'vignette' }, [
        h('img', { src: `./assets/story/${c.key}.svg`, alt: '', loading: 'lazy', width: '800', height: '420' }),
        h('span', { class: 'vignette__num', text: String(c.num) }),
      ]),
      h('span', { class: 'item__body' }, [
        h('span', { class: 'item__title', text: c.titre }),
        h('span', { class: 'item__sub', text: `${c.lieu} · ${stripTags(c.date)} · ${c.minutes} min` }),
        lu ? h('div', { class: 'bar', style: 'margin-top:8px' }, h('div', { class: `bar__fill bar__fill--${tone(m)}`, style: `width:${m}%` })) : null,
      ].filter(Boolean)),
      lu ? h('span', { class: 'badge badge--ok', text: 'Lu', style: 'margin-top:6px' }) : null,
      h('span', { class: 'item__chev', style: 'margin-top:10px' }, icon('chevron')),
    ].filter(Boolean));
  }));

  return {
    node: h('div', { class: 'stack' }, [
      h('div', { class: 'card' }, [
        h('p', { class: 'card__sub', text: `Acte ${a.num} · ${a.epoque}` }),
        h('h1', { class: 'card__title', style: 'font-size:20px;margin-top:4px', text: a.titre }),
        h('p', { class: 'card__sub', style: 'margin-top:6px', text: a.sous_titre }),
      ]),
      list,
      h('a', { class: 'btn btn--ghost', href: `#/histoire/qa/${a.key}`, text: `Quiz sur tout l'acte ${a.num}` }),
    ]),
    title: `Acte ${a.num}`,
    back: '#/histoire',
  };
}

/* ------------------------------------------------------------- chapitre */

function chapitre(key) {
  const c = CHAPITRE_BY_KEY.get(key);
  if (!c) return sommaire();

  const nq = questionsOf(key).length;
  const m = Math.round(romanMastery(key) * 100);
  const prev = prevChapitre(key);
  const next = nextChapitre(key);
  const dejaLu = store.isRead(key);

  // Le chapitre est marqué comme lu dès que la fin du texte apparaît à l'écran.
  const sentinel = h('div', { style: 'height:1px' });
  if (!dejaLu && 'IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        store.markRead(key);
        fx.jalon();
        obs.disconnect();
      }
    }, { rootMargin: '0px 0px -10% 0px' });
    requestAnimationFrame(() => obs.observe(sentinel));
  }

  const node = h('div', { class: 'stack' }, [
    h('div', { class: 'card card--illus' }, [
      h('img', {
        class: 'illus', src: `./assets/story/${c.key}.svg`, alt: '', loading: 'eager',
        width: '800', height: '420',
      }),
      h('div', { class: 'card__inner' }, [
        h('p', { class: 'card__sub', text: `Acte ${c.acteNum} — ${c.acteTitre} · chapitre ${c.num}` }),
        h('h1', { class: 'card__title', style: 'font-size:21px;margin-top:5px', text: c.titre }),
        h('p', { class: 'card__sub', style: 'margin-top:7px', html: `${c.lieu} — ${c.date} · ${c.minutes} min de lecture` }),
        dejaLu && nq ? h('div', { class: 'row', style: 'margin-top:10px;gap:8px' }, [
          h('span', { class: `badge badge--${tone(m)}`, text: `Mémorisé à ${m} %` }),
          h('span', { class: 'badge', text: `${nq} questions` }),
        ]) : null,
      ].filter(Boolean)),
    ]),

    h('div', { class: 'card' }, h('div', { class: 'prose prose--story', html: c.html })),

    c.retenir?.length ? h('div', { class: 'card card--retenir' }, [
      h('h2', { class: 'card__title', style: 'font-size:16px', text: 'Ce qu\'il faut retenir' }),
      h('ul', { class: 'retenir' }, c.retenir.map((r) => h('li', { html: r }))),
    ]) : null,

    sentinel,

    nq ? h('a', { class: 'btn', href: `#/histoire/q/${key}`, onclick: () => store.markRead(key) }, [
      icon('play'), h('span', { text: `Vérifier (${nq} questions)` }),
    ]) : null,

    h('div', { class: 'btn-row' }, [
      prev ? h('a', { class: 'btn btn--ghost', href: `#/histoire/c/${prev.key}`, text: '← Précédent' }) : null,
      next ? h('a', { class: 'btn btn--ghost', href: `#/histoire/c/${next.key}`, text: 'Suivant →' }) : null,
    ].filter(Boolean)),

    h('a', { class: 'btn btn--quiet', href: `#/histoire/a/${c.acteKey}`, text: `Retour à l'acte ${c.acteNum}` }),
  ].filter(Boolean));

  return { node, title: `Chapitre ${c.num}`, back: `#/histoire/a/${c.acteKey}` };
}

/* ----------------------------------------------------------------- quiz */

function quiz({ chapitre: chapKey = null, acte: acteKey = null }) {
  const c = chapKey ? CHAPITRE_BY_KEY.get(chapKey) : null;
  const a = acteKey ? ACTE_BY_KEY.get(acteKey) : null;
  const container = h('div', { class: 'stack' });
  const label = c ? `Chapitre ${c.num}` : a ? `Acte ${a.num}` : 'La France racontée';
  const backTo = c ? `#/histoire/c/${chapKey}` : a ? `#/histoire/a/${acteKey}` : '#/histoire';

  function start() {
    const cards = buildRomanSet({
      chapitre: chapKey,
      acte: acteKey,
      count: chapKey ? questionsOf(chapKey).length : 20,
    });
    if (!cards.length) {
      container.replaceChildren(h('div', { class: 'empty' }, [
        h('div', { class: 'empty__icon' }, icon('book')),
        h('p', { text: 'Aucune question disponible ici.' }),
        h('a', { class: 'btn mt', href: backTo, text: 'Retour' }),
      ]));
      return;
    }

    const suivant = c ? nextChapitre(chapKey) : null;
    runQuiz({
      container,
      cards,
      immediate: true,
      label: 'Récit',
      backTo,
      onRestart: () => start(),
      extraActions: suivant
        ? [h('button', {
          class: 'btn btn--accent', type: 'button',
          onclick: () => navigate(`#/histoire/c/${suivant.key}`),
        }, [h('span', { text: `Chapitre suivant : ${suivant.titre}` })])]
        : [],
    });
  }

  start();
  return { node: container, title: label, back: backTo, hideTabs: true };
}

/** Les dates peuvent contenir un exposant (XVIII<sup>e</sup>) ; on l'ôte pour le texte brut. */
function stripTags(s) {
  return String(s).replace(/<[^>]+>/g, '');
}
