/**
 * « La France racontée » — le programme raconté comme un roman.
 *
 * On lit un chapitre, on garde l'encadré « à retenir » en tête, puis on répond
 * à quelques questions. Progression suivie à part des deux autres sections.
 *
 * Deux aides à la lecture :
 *  — la LANGUE : français, arabe, ou les deux paragraphe par paragraphe, pour
 *    comprendre d'abord et revenir au français ensuite ;
 *  — le GLOSSAIRE : les mots difficiles sont soulignés dans le texte et
 *    s'expliquent en une phrase, en français et en arabe.
 */

import { h, icon, modal } from '../lib/dom.js';
import { daysBetween } from '../lib/util.js';
import { ROMAN, ACTES, ACTE_BY_KEY, CHAPITRE_BY_KEY, CHAPITRES, TOTAL_MINUTES, nextChapitre, prevChapitre, questionsOf } from '../data/roman.js';
import { AR_BY_KEY, ACTE_AR_BY_KEY, blocs, TOTAL_TRADUITS } from '../data/roman-ar.js';
import { GLOSSAIRE, TOTAL_TERMES } from '../data/glossaire.js';
import { marquer, motsDuChapitre } from '../lib/gloss.js';
import * as images from '../data/images.js';
import {
  buildRomanSet, romanMastery, romanActeMastery, romanOverview, nextUnread,
  romanChapitreProgres, romanProchaineRevue,
} from '../engine.js';
import { runQuiz } from './reviser.js';
import { navigate, refresh } from '../app.js';
import * as store from '../store.js';
import * as fx from '../lib/feedback.js';

// Le manifeste des illustrations est demandé dès le chargement du module :
// quand on arrive sur un chapitre, il est presque toujours déjà là. Les vues
// qui en dépendent se redessinent une fois s'il arrive en retard.
images.charger();

export default function renderRoman({ params }) {
  const target = params[0];
  if (!target) return sommaire();
  if (target === 'glossaire') return glossaire();
  if (target.startsWith('a/')) return acte(target.slice(2));
  if (target.startsWith('c/')) return chapitre(target.slice(2));
  if (target.startsWith('q/')) return quiz({ chapitre: target.slice(2) });
  if (target.startsWith('qa/')) return quiz({ acte: target.slice(3) });
  if (target === 'quiz') return quiz({});
  return sommaire();
}

const tone = (m) => (m >= 70 ? 'ok' : m >= 35 ? 'warn' : 'bad');

/** Nombre de mots de vocabulaire qu'un chapitre introduit pour la première fois. */
function motsNouveaux(c) {
  return motsDuChapitre(CHAPITRES, c.key).nouveaux.size;
}

/* --------------------------------------------------------------- langue */

/** 'fr' (défaut), 'ar' (arabe seul) ou 'bi' (les deux). */
function langue() {
  const v = store.current()?.settings?.langueRecit;
  return v === 'ar' || v === 'bi' ? v : 'fr';
}

function setLangue(v) {
  store.setSetting('langueRecit', v);
}

/**
 * Sélecteur de langue.
 * `onChange` permet de redessiner sur place plutôt que de recharger l'écran :
 * on ne veut pas perdre sa position dans un chapitre en changeant de langue.
 */
function choixLangue(onChange) {
  const actuelle = langue();
  const CHOIX = [
    { v: 'fr', court: 'Français' },
    { v: 'ar', court: 'العربية' },
    { v: 'bi', court: 'FR + ع' },
  ];
  return h('div', { class: 'seg seg--langue' }, CHOIX.map((c) => h('button', {
    class: 'seg__btn', type: 'button',
    'aria-pressed': actuelle === c.v ? 'true' : 'false',
    lang: c.v === 'ar' ? 'ar' : 'fr',
    text: c.court,
    onclick: () => { if (langue() !== c.v) { setLangue(c.v); onChange(); } },
  })));
}

/* ------------------------------------------------------------- glossaire */

/** Feuille explicative d'un terme, en français puis en arabe. */
function ouvrirTerme(entree) {
  modal((close) => [
    h('p', { class: 'card__eyebrow', text: 'Glossaire' }),
    h('h2', { class: 'modal__title', style: 'margin-top:4px', text: entree.terme }),
    figure(images.imageDuTerme(entree.terme), 'fr', { compacte: true }),
    h('p', { class: 'glossdef', text: entree.def }),
    h('div', { class: 'glossar', dir: 'rtl', lang: 'ar' }, h('p', { text: entree.ar })),
    h('button', { class: 'btn btn--ghost mt', type: 'button', text: 'Fermer', onclick: () => close() }),
  ].filter(Boolean));
}

/**
 * Une illustration, avec sa légende et sa provenance.
 *
 * La provenance est écrite sous chaque image, jamais masquée : ces images
 * sont générées, et le lecteur a le droit de le savoir avant de les prendre
 * pour des photographies d'archives.
 */
function figure(img, lng = 'fr', { compacte = false } = {}) {
  if (!img) return null;
  const legende = lng === 'ar' ? img.legende_ar : img.legende;
  return h('figure', { class: `fig${compacte ? ' fig--sm' : ''}` }, [
    h('img', {
      class: 'fig__img', src: images.chemin(img), alt: img.alt || '',
      loading: 'lazy', decoding: 'async', width: '900', height: '506',
    }),
    h('figcaption', { class: 'fig__cap' }, [
      lng === 'bi'
        ? h('span', {}, [
          h('span', { class: 'fig__txt', text: img.legende }),
          h('span', { class: 'fig__txt arline', dir: 'rtl', lang: 'ar', text: img.legende_ar }),
        ])
        : h('span', {
          class: `fig__txt${lng === 'ar' ? ' arline' : ''}`,
          dir: lng === 'ar' ? 'rtl' : null, lang: lng === 'ar' ? 'ar' : null,
          text: legende,
        }),
      h('span', { class: 'fig__src', text: images.SOURCES[img.source] || '' }),
    ]),
  ]);
}

/** Bloc dépliant d'un terme : le mot, son image s'il en a une, les définitions. */
function ligneTerme(entree, { nouveau = false, arDabord = false } = {}) {
  const fr = h('p', { class: 'glossdef', text: entree.def });
  const ar = h('div', { class: 'glossar', dir: 'rtl', lang: 'ar' }, h('p', { text: entree.ar }));
  const vue = figure(images.imageDuTerme(entree.terme), arDabord ? 'ar' : 'fr', { compacte: true });
  return h('details', { class: 'card card--pad-sm glossrow' }, [
    h('summary', { class: 'summary', style: 'padding:0' }, [
      icon('bulb'),
      h('span', { class: 'grow', text: entree.terme }),
      vue ? h('span', { class: 'glossrow__vue', title: 'avec une image' }, icon('star')) : null,
      nouveau ? h('span', { class: 'badge badge--brand', text: 'nouveau' }) : null,
    ].filter(Boolean)),
    h('div', { class: 'mt' }, [vue, ...(arDabord ? [ar, fr] : [fr, ar])].filter(Boolean)),
  ]);
}

/**
 * Glossaire du chapitre en cours.
 *
 * Ce sont EXACTEMENT les mots soulignés dans le texte, dans le même ordre :
 * la liste et le marquage viennent du même parcours (js/lib/gloss.js). On
 * peut donc lire le chapitre, buter sur un mot, et le retrouver ici sans
 * remonter le texte.
 */
function carteMotsDuChapitre(c, lng) {
  const { termes, nouveaux } = motsDuChapitre(CHAPITRES, c.key);
  if (!termes.length) return null;

  const nbNouveaux = termes.filter((t) => nouveaux.has(t.terme)).length;
  const arDabord = lng === 'ar';

  const detail = h('div', { class: 'stack stack--tight mt' },
    termes.map((t) => ligneTerme(t, { nouveau: nouveaux.has(t.terme), arDabord })));

  return h('div', { class: 'stack stack--tight' }, [
    h('div', { class: 'row row--between' }, [
      h('p', { class: 'section-title', style: 'margin:0', text: 'Les mots de ce chapitre' }),
      h('span', { class: 'badge', text: `${termes.length}` }),
    ]),
    h('div', { class: 'card card--info' }, [
      h('p', {
        class: 'small',
        text: nbNouveaux === termes.length
          ? `${termes.length} mot${termes.length > 1 ? 's' : ''} à connaître, ${nbNouveaux > 1 ? 'tous nouveaux' : 'nouveau'} dans le récit.`
          : nbNouveaux === 0
            ? `${termes.length} mot${termes.length > 1 ? 's' : ''}, tous déjà rencontrés dans les chapitres précédents.`
            : `${termes.length} mots, dont ${nbNouveaux} ${nbNouveaux > 1 ? 'nouveaux' : 'nouveau'} par rapport aux chapitres précédents.`,
      }),
    ]),
    detail,
    h('a', { class: 'btn btn--quiet', href: '#/histoire/glossaire', text: `Voir les ${TOTAL_TERMES} mots du glossaire` }),
  ]);
}

function glossaire() {
  const champ = h('input', {
    class: 'input search__field', type: 'search', placeholder: 'Chercher un mot…',
    autocomplete: 'off', 'aria-label': 'Chercher dans le glossaire',
  });
  const liste = h('div', { class: 'stack stack--tight' });

  const plie = (s) => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

  function draw() {
    const q = plie(champ.value.trim());
    const vus = GLOSSAIRE
      .filter((e) => !q || plie(e.terme).includes(q) || plie(e.def).includes(q) || e.ar.includes(champ.value.trim()))
      .sort((a, b) => a.terme.localeCompare(b.terme, 'fr'));

    liste.replaceChildren(...(vus.length ? vus.map((e) => ligneTerme(e)) : [h('div', { class: 'empty' }, [
      h('div', { class: 'empty__icon' }, icon('search')),
      h('p', { text: 'Aucun mot ne correspond.' }),
    ])]));
  }

  champ.addEventListener('input', draw);
  draw();
  images.charger().then(() => { if (liste.isConnected) draw(); });

  return {
    node: h('div', { class: 'stack' }, [
      h('div', { class: 'card card--info' }, [
        h('h1', { class: 'card__title', text: 'Les mots difficiles' }),
        h('p', { class: 'card__sub', text: `${TOTAL_TERMES} mots de l'examen civique, expliqués en une phrase simple, en français et en arabe. Dans les chapitres, ils sont soulignés : il suffit d'appuyer dessus.` }),
      ]),
      h('div', { class: 'search' }, [h('span', { class: 'search__icon' }, icon('search')), champ]),
      liste,
    ]),
    title: 'Glossaire',
    back: '#/histoire',
  };
}

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
  const termines = CHAPITRES.filter((c) => romanChapitreProgres(c.key).termine).length;
  const kpis = h('div', { class: 'kpis' }, [
    ['chapitres terminés', `${termines}/${o.chapitres}`],
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
    // Deux chiffres voisins qui ne mesurent pas la même chose : mieux vaut le
    // dire que laisser croire à un compteur bloqué.
    o.lus > 0 ? h('p', {
      class: 'hint center',
      text: "« Chapitres terminés » se remplit dans la séance : lire, puis répondre juste. La « mémorisation » monte plus lentement, à quelques jours d'intervalle — c'est elle qui fait tenir jusqu'à l'examen.",
    }) : null,
  ].filter(Boolean));

  // Langue de lecture, choisie une fois pour tous les chapitres.
  const carteLangue = h('div', { class: 'card' }, [
    h('div', { class: 'row', style: 'gap:12px' }, [
      h('span', { class: 'item__icon item__icon--story' }, icon('chat')),
      h('div', { class: 'grow' }, [
        h('h2', { class: 'card__title', text: 'Langue de lecture' }),
        h('p', { class: 'card__sub', text: `Le récit est traduit en arabe (${TOTAL_TRADUITS} chapitres). Choisissez « FR + ع » pour lire les deux, paragraphe par paragraphe.` }),
      ]),
    ]),
    h('div', { class: 'mt' }, choixLangue(() => refresh())),
    h('p', { class: 'hint mt', text: "Les questions restent en français : l'examen se passe en français, et s'entraîner dans une autre langue donnerait une réussite trompeuse." }),
  ]);

  const list = h('div', { class: 'list' }, ACTES.map((a) => {
    const m = Math.round(romanActeMastery(a.key) * 100);
    const lus = store.readCount(a.chapitres.map((c) => c.key));
    const ar = ACTE_AR_BY_KEY.get(a.key);
    const lng = langue();
    return h('a', { class: 'item item--story', href: `#/histoire/a/${a.key}`, style: 'align-items:flex-start' }, [
      h('span', { class: 'item__icon' }, icon(a.icon)),
      h('span', { class: 'item__body' }, [
        h('span', { class: 'item__title', text: `Acte ${a.num} — ${a.titre}` }),
        lng !== 'fr' && ar ? h('span', { class: 'item__title arline', dir: 'rtl', lang: 'ar', text: ar.titre }) : null,
        h('span', { class: 'item__sub', text: `${a.epoque} · ${a.chapitres.length} chapitres · ${lus} lu${lus > 1 ? 's' : ''}` }),
        h('div', { class: 'bar', style: 'margin-top:8px' }, h('div', { class: `bar__fill bar__fill--${tone(m)}`, style: `width:${m}%` })),
      ].filter(Boolean)),
      h('span', { class: 'item__chev', style: 'margin-top:10px' }, icon('chevron')),
    ]);
  }));

  return {
    node: h('div', { class: 'stack' }, [
      head,
      kpis,
      actions,
      carteLangue,
      h('p', { class: 'section-title', text: 'Les trois actes' }),
      list,
      h('a', { class: 'item', href: '#/histoire/glossaire' }, [
        h('span', { class: 'item__icon item__icon--brand' }, icon('bulb')),
        h('span', { class: 'item__body' }, [
          h('span', { class: 'item__title', text: 'Glossaire des mots difficiles' }),
          h('span', { class: 'item__sub', text: `${TOTAL_TERMES} mots expliqués simplement, en français et en arabe` }),
        ]),
        h('span', { class: 'item__chev' }, icon('chevron')),
      ]),
      h('p', { class: 'hint center mt', text: "Les faits sont ceux du programme officiel et du livret du citoyen ; c'est la façon de les raconter qui change. Les scènes sont écrites pour rendre les dates et les noms plus faciles à retenir." }),
    ]),
    title: 'La France racontée',
  };
}

/* ----------------------------------------------------------------- acte */

function acte(key) {
  const a = ACTE_BY_KEY.get(key);
  if (!a) return sommaire();
  const lng = langue();
  const aAr = ACTE_AR_BY_KEY.get(key);

  const list = h('div', { class: 'list' }, a.chapitres.map((c) => {
    const p = romanChapitreProgres(c.key);
    const ar = AR_BY_KEY.get(c.key);

    // Ce qui reste à faire, en toutes lettres. Une barre nue sous un chapitre
    // se lit comme un avancement : autant qu'elle en soit vraiment un, et
    // qu'elle dise de quoi il s'agit.
    const etat = p.termine ? 'Chapitre terminé'
      : !p.lu && !p.vues ? null
        : !p.lu ? `${p.justes}/${p.total} questions justes · à lire`
          : p.total === 0 ? 'Lu'
            : `Lu · ${p.justes}/${p.total} questions justes`;

    return h('a', { class: `item ${p.termine ? 'item--story' : ''}`, href: `#/histoire/c/${c.key}`, style: 'align-items:flex-start' }, [
      h('span', { class: 'vignette' }, [
        h('img', { src: `./assets/story/${c.key}.svg`, alt: '', loading: 'lazy', width: '800', height: '420' }),
        h('span', { class: 'vignette__num', text: String(c.num) }),
      ]),
      h('span', { class: 'item__body' }, [
        lng === 'ar' && ar
          ? h('span', { class: 'item__title', dir: 'rtl', lang: 'ar', text: ar.titre })
          : h('span', { class: 'item__title', text: c.titre }),
        lng === 'bi' && ar ? h('span', { class: 'item__title arline', dir: 'rtl', lang: 'ar', text: ar.titre }) : null,
        h('span', { class: 'item__sub', text: `${c.lieu} · ${stripTags(c.date)} · ${c.minutes} min` }),
        motsNouveaux(c) ? h('span', { class: 'item__sub', text: `${motsNouveaux(c)} nouveau${motsNouveaux(c) > 1 ? 'x' : ''} mot${motsNouveaux(c) > 1 ? 's' : ''} de vocabulaire` }) : null,
        etat ? h('span', { class: 'item__sub', text: etat }) : null,
        p.pct > 0 ? h('div', { class: 'bar bar--thin', style: 'margin-top:8px' },
          h('div', { class: `bar__fill${p.termine ? ' bar__fill--ok' : ''}`, style: `width:${p.pct}%` })) : null,
      ].filter(Boolean)),
      p.termine
        ? h('span', { class: 'badge badge--ok', text: 'Terminé', style: 'margin-top:6px' })
        : p.lu ? h('span', { class: 'badge', text: 'Lu', style: 'margin-top:6px' }) : null,
      h('span', { class: 'item__chev', style: 'margin-top:10px' }, icon('chevron')),
    ].filter(Boolean));
  }));

  return {
    node: h('div', { class: 'stack' }, [
      h('div', { class: 'card card--info' }, [
        h('p', { class: 'card__sub', text: `Acte ${a.num} · ${a.epoque}` }),
        h('h1', { class: 'card__title', style: 'font-size:20px;margin-top:4px', text: a.titre }),
        lng !== 'fr' && aAr ? h('h2', { class: 'card__title arline', style: 'font-size:19px;margin-top:4px', dir: 'rtl', lang: 'ar', text: aAr.titre }) : null,
        h('p', { class: 'card__sub', style: 'margin-top:6px', text: a.sous_titre }),
      ].filter(Boolean)),
      choixLangue(() => refresh()),
      list,
      h('a', { class: 'btn btn--ghost', href: `#/histoire/qa/${a.key}`, text: `Quiz sur tout l'acte ${a.num}` }),
    ]),
    title: `Acte ${a.num}`,
    back: '#/histoire',
  };
}

/* ------------------------------------------------------------- chapitre */

/**
 * Corps du chapitre dans la langue demandée.
 *
 * En mode bilingue, chaque bloc français est suivi de son équivalent arabe :
 * l'appariement repose sur le fait que les deux versions ont exactement le
 * même nombre de blocs, dans le même ordre (vérifié par
 * scripts/check-traduction.mjs). Si jamais l'appariement échouait, on retombe
 * sur les deux textes l'un après l'autre plutôt que d'afficher n'importe quoi.
 */
/**
 * Glisse les illustrations du chapitre après le bloc qu'elles illustrent.
 *
 * L'ancre est un fragment du texte FRANÇAIS. En mode arabe on ne peut donc pas
 * la chercher dans le texte affiché : on repère l'indice du bloc dans la
 * version française et on l'applique à la même position côté arabe, ce qui est
 * exact puisque les deux versions ont le même nombre de blocs dans le même
 * ordre (garanti par scripts/check-traduction.mjs).
 */
function poserImages(prose, c, lng) {
  const liste = images.imagesDuChapitre(c.key);
  if (!liste.length) return;

  const blocsFr = [...new DOMParser().parseFromString(`<div>${c.html}</div>`, 'text/html')
    .body.firstChild.children];
  const cibles = [...prose.children];

  // On insère de la fin vers le début : sinon chaque insertion décale les
  // indices de toutes les images suivantes.
  const places = liste
    .map((img) => ({ img, i: blocsFr.findIndex((b) => b.outerHTML.includes(img.apres)) }))
    .filter((x) => x.i >= 0)
    .sort((a, b) => b.i - a.i);

  for (const { img, i } of places) {
    const cible = cibles[i];
    if (cible && cible.parentNode) cible.after(figure(img, lng));
  }
}

function corps(c, ar, lng, surTerme) {
  const prose = h('div', { class: 'prose prose--story' });

  if (lng === 'ar' && ar) {
    prose.dir = 'rtl';
    prose.lang = 'ar';
    prose.classList.add('prose--ar');
    prose.innerHTML = ar.html;
    poserImages(prose, c, 'ar');
    return prose;
  }

  if (lng === 'bi' && ar) {
    const fr = blocs(c.html);
    const tr = blocs(ar.html);
    if (fr.length === tr.length) {
      prose.classList.add('prose--bi');
      fr.forEach((bloc, i) => {
        const arBloc = tr[i];
        arBloc.setAttribute('dir', 'rtl');
        arBloc.setAttribute('lang', 'ar');
        arBloc.classList.add('arline');
        prose.append(h('div', { class: 'paire' }, [bloc, arBloc]));
      });
      // Le glossaire ne travaille que sur le français : marquer aussi l'arabe
      // dédoublerait chaque définition sans rien apporter.
      marquer(prose, surTerme);
      poserImages(prose, c, 'bi');
      return prose;
    }
    // Repli : les deux versions à la suite, sans appariement.
    prose.innerHTML = c.html;
    marquer(prose, surTerme);
    poserImages(prose, c, 'fr');
    const bloc = h('div', { class: 'prose prose--story prose--ar', dir: 'rtl', lang: 'ar', html: ar.html });
    return h('div', {}, [prose, h('div', { class: 'divider' }), bloc]);
  }

  prose.innerHTML = c.html;
  marquer(prose, surTerme);
  poserImages(prose, c, lng);
  return prose;
}

function chapitre(key) {
  const c = CHAPITRE_BY_KEY.get(key);
  if (!c) return sommaire();

  const nq = questionsOf(key).length;
  const m = Math.round(romanMastery(key) * 100);
  const prev = prevChapitre(key);
  const next = nextChapitre(key);
  const dejaLu = store.isRead(key);
  const ar = AR_BY_KEY.get(key);

  const container = h('div', { class: 'stack' });

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

  function draw() {
    const lng = langue();
    const texte = corps(c, ar, lng, ouvrirTerme);
    const mots = motsDuChapitre(CHAPITRES, c.key).termes;
    const progres = romanChapitreProgres(key);

    container.replaceChildren(...[
      h('div', { class: 'card card--illus' }, [
        h('img', {
          class: 'illus', src: `./assets/story/${c.key}.svg`, alt: '', loading: 'eager',
          width: '800', height: '420',
        }),
        h('div', { class: 'card__inner' }, [
          h('p', { class: 'card__sub', text: `Acte ${c.acteNum} — ${c.acteTitre} · chapitre ${c.num}` }),
          lng === 'ar' && ar
            ? h('h1', { class: 'card__title', style: 'font-size:21px;margin-top:5px', dir: 'rtl', lang: 'ar', text: ar.titre })
            : h('h1', { class: 'card__title', style: 'font-size:21px;margin-top:5px', text: c.titre }),
          lng === 'bi' && ar ? h('h2', { class: 'card__title arline', style: 'font-size:19px;margin-top:4px', dir: 'rtl', lang: 'ar', text: ar.titre }) : null,
          lng === 'ar' && ar
            ? h('p', { class: 'card__sub', style: 'margin-top:7px', dir: 'rtl', lang: 'ar', text: `${ar.lieu} — ${ar.date}` })
            : h('p', { class: 'card__sub', style: 'margin-top:7px', html: `${c.lieu} — ${c.date} · ${c.minutes} min de lecture` }),
          nq ? h('div', { class: 'row', style: 'margin-top:10px;gap:8px;flex-wrap:wrap' }, [
            progres.termine
              ? h('span', { class: 'badge badge--ok', text: 'Chapitre terminé' })
              : h('span', { class: 'badge', text: `${progres.justes}/${nq} questions justes` }),
            h('span', { class: 'badge', text: `${nq} questions` }),
          ]) : null,
        ].filter(Boolean)),
      ]),

      ar ? choixLangue(draw) : null,

      h('div', { class: 'card' }, texte),

      lng !== 'ar' && mots.length ? h('p', {
        class: 'hint center',
        text: `${mots.length} mot${mots.length > 1 ? 's' : ''} souligné${mots.length > 1 ? 's' : ''} dans le texte : appuyez dessus, ou retrouvez-les tous plus bas.`,
      }) : null,

      retenirCarte(c, ar, lng),

      // La sentinelle est AVANT le glossaire : le chapitre est lu quand on a
      // fini le récit et l'encadré, pas quand on a déroulé la liste de mots.
      sentinel,

      carteMotsDuChapitre(c, lng),

      nq ? h('a', { class: 'btn', href: `#/histoire/q/${key}`, onclick: () => store.markRead(key) }, [
        icon('play'), h('span', { text: progres.justes ? `Refaire les ${nq} questions` : `Vérifier (${nq} questions)` }),
      ]) : null,

      lng !== 'fr' ? h('p', { class: 'hint center', text: 'Les questions sont en français, comme le jour de l’examen.' }) : null,

      carteMemorisation(key, nq, progres),

      h('div', { class: 'btn-row' }, [
        prev ? h('a', { class: 'btn btn--ghost', href: `#/histoire/c/${prev.key}`, text: '← Précédent' }) : null,
        next ? h('a', { class: 'btn btn--ghost', href: `#/histoire/c/${next.key}`, text: 'Suivant →' }) : null,
      ].filter(Boolean)),

      h('a', { class: 'btn btn--quiet', href: `#/histoire/a/${c.acteKey}`, text: `Retour à l'acte ${c.acteNum}` }),
    ].filter(Boolean));
  }

  draw();
  // Si le manifeste des illustrations arrive après le premier rendu, on
  // redessine une fois. `container.isConnected` évite de travailler pour un
  // écran que l'on a déjà quitté.
  images.charger().then(() => { if (container.isConnected) draw(); });

  return { node: container, title: `Chapitre ${c.num}`, back: `#/histoire/a/${c.acteKey}` };
}

/**
 * Encadré de mémorisation.
 *
 * Il existe pour répondre à une question légitime : « cette barre est basée
 * sur quelle métrique ? » La mémorisation ne PEUT PAS atteindre 100 % en une
 * séance — chaque palier impose d'attendre un jour, puis trois, puis sept,
 * puis seize. Afficher ce chiffre sans le dire donnait l'impression d'un
 * compteur cassé : on avait tout lu, tout répondu juste, et il restait à 20 %.
 *
 * Il est donc affiché à part de l'avancement du chapitre, nommé, expliqué, et
 * accompagné de la date de la prochaine revue — la seule chose qui le fera
 * monter.
 */
function carteMemorisation(key, nq, progres) {
  if (!nq || !progres.vues) return null;

  const m = Math.round(romanMastery(key) * 100);
  const revue = romanProchaineRevue(key);
  const jours = revue === null ? null : daysBetween(Date.now(), revue);

  const quand = jours === null ? null
    : jours <= 0 ? 'à revoir dès maintenant'
      : jours === 1 ? 'à revoir demain'
        : `à revoir dans ${jours} jours`;

  return h('div', { class: 'card card--info' }, [
    h('div', { class: 'row row--between' }, [
      h('p', { class: 'card__title', style: 'font-size:15px', text: 'Mémorisation' }),
      h('span', { class: 'badge badge--brand', text: `${m} %` }),
    ]),
    h('div', { class: 'bar bar--thin mt' }, h('div', { class: 'bar__fill', style: `width:${m}%` })),
    h('p', {
      class: 'hint mt',
      text: `Ce chiffre n'est pas l'avancement du chapitre : c'est ce qui reste en mémoire dans la durée. Il monte d'un cran à chaque fois que vous répondez juste, mais seulement après un délai qui s'allonge — 1 jour, puis 3, puis 7, puis 16. Il faut donc plusieurs semaines pour atteindre 100 %, et c'est justement ce qui fait tenir la mémoire jusqu'à l'examen.${quand ? ` Ces questions sont ${quand}.` : ''}`,
    }),
  ]);
}

/** Encadré « ce qu'il faut retenir », dans la langue choisie. */
function retenirCarte(c, ar, lng) {
  if (!c.retenir?.length) return null;

  const titreFr = "Ce qu'il faut retenir";
  const titreAr = 'ما ينبغي تذكّره';

  if (lng === 'ar' && ar) {
    return h('div', { class: 'card card--retenir', dir: 'rtl', lang: 'ar' }, [
      h('h2', { class: 'card__title', style: 'font-size:16px', text: titreAr }),
      h('ul', { class: 'retenir' }, ar.retenir.map((r) => h('li', { html: r }))),
    ]);
  }

  if (lng === 'bi' && ar && ar.retenir.length === c.retenir.length) {
    return h('div', { class: 'card card--retenir' }, [
      h('h2', { class: 'card__title', style: 'font-size:16px', text: `${titreFr} · ${titreAr}` }),
      h('ul', { class: 'retenir' }, c.retenir.map((r, i) => h('li', {}, [
        h('span', { html: r }),
        h('span', { class: 'arline', dir: 'rtl', lang: 'ar', style: 'display:block;margin-top:5px', html: ar.retenir[i] }),
      ]))),
    ]);
  }

  return h('div', { class: 'card card--retenir' }, [
    h('h2', { class: 'card__title', style: 'font-size:16px', text: titreFr }),
    h('ul', { class: 'retenir' }, c.retenir.map((r) => h('li', { html: r }))),
  ]);
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
