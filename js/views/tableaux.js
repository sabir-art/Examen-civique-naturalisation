/**
 * Les tableaux d'enquête : des fiches épinglées, des ficelles entre elles.
 *
 * Le mur se lit de haut en bas — c'est l'ordre réel — et les ficelles qui
 * s'écartent du fil relient ce qui ne se suit pas : un régime et celui qu'il
 * renverse, un droit et le siècle qu'il a fallu attendre.
 *
 * Appuyer sur une fiche tire sa ficelle : elle et ce qu'elle touche restent
 * allumées, le reste s'efface. C'est le geste central, et c'est la raison
 * d'être de l'écran — voir d'un coup ce qui tient à quoi.
 *
 * ACCESSIBILITÉ — le dessin ne porte jamais une information à lui seul. Chaque
 * ficelle est aussi écrite en toutes lettres sous la fiche (« fait tomber : la
 * monarchie absolue »), et l'on peut parcourir le mur à la voix ou au clavier
 * sans rien perdre. Le tracé est décoratif, et déclaré comme tel.
 */

import { h, icon } from '../lib/dom.js';
import { Card, Button, Badge, Icon, IconTile, SectionHeader, Chip } from '../ds/index.js';
import { TABLEAUX, TABLEAU_BY_KEY, TOTAL_FICHES, liensDe } from '../data/tableaux.js';
import { CHAPITRE_BY_KEY } from '../data/roman.js';
import { THEMES } from '../data/programme.js';
import { navigate } from '../app.js';

/** Le glyphe et le mot qui désignent chaque nature de fiche. */
const NATURE = {
  regime: { icone: 'shield', mot: 'Régime' },
  evenement: { icone: 'flag', mot: 'Événement' },
  texte: { icone: 'book', mot: 'Texte' },
  personne: { icone: 'users', mot: 'Les gens' },
  institution: { icone: 'bank', mot: 'Institution' },
  droit: { icone: 'scale', mot: 'Droit conquis' },
};

export default function renderTableaux({ params }) {
  const cible = params[0];
  if (!cible) return sommaire();
  const [key, noeud] = cible.split('/');
  const t = TABLEAU_BY_KEY.get(key);
  if (!t) return sommaire();
  return tableau(t, noeud || null);
}

/* ------------------------------------------------------------- sommaire */

function sommaire() {
  return {
    node: h('div', { class: 'stack' }, [
      h('div', { class: 'hero hero--blanc' }, [
        h('p', { class: 'hero__eyebrow', text: 'Pour s’y retrouver' }),
        h('h1', { class: 'hero__title', text: 'Les tableaux d’enquête' }),
        h('p', { class: 'hero__sub', text: `Trois murs de fiches reliées par des ficelles : ${TOTAL_FICHES} fiches en tout. Quand les dates et les noms se mélangent, on ne relit pas une liste — on suit un fil.` }),
      ]),

      SectionHeader({ title: 'Les trois murs' }),
      h('div', { class: 'list' }, TABLEAUX.map((t) => h('a', {
        class: `ds-lesson ds-lesson--tap ligne--haute ds-lesson--teinte ds-lesson--${t.teinte}`,
        href: `#/tableaux/${t.key}`,
      }, [
        IconTile({ icon: 'pin', tone: 'white', size: 44 }),
        h('div', { class: 'ds-lesson__body' }, [
          h('div', { class: 'ds-lesson__title ds-lesson__titre--long', text: t.titre }),
          h('div', { class: 'ds-lesson__meta', text: t.sousTitre }),
          h('div', { class: 'ligne__etat' }, [
            Badge({ tone: 'neutral', label: `${t.noeuds.length} fiches` }),
            h('span', { class: 'ds-lesson__meta', text: `${t.liens.length} ficelles` }),
          ]),
        ]),
        Icon({ name: 'chevron-right', size: 18, className: 'ds-lesson__chev' }),
      ]))),

      h('p', { class: 'hint center', text: 'Chaque fiche renvoie au chapitre du récit qui la raconte. Le tableau donne la carte, le récit donne le chemin.' }),
    ]),
    title: 'Tableaux d’enquête',
    back: '#/histoire',
  };
}

/* --------------------------------------------------------------- un mur */

function tableau(t, cible) {
  const container = h('div', { class: 'stack' });

  // Le mur : les fiches dans l'ordre, la gouttière à gauche pour les ficelles.
  const mur = h('div', { class: `mur mur--${t.teinte}` });
  const fils = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  fils.setAttribute('class', 'mur__fils');
  fils.setAttribute('aria-hidden', 'true');
  fils.setAttribute('preserveAspectRatio', 'none');

  /** Les fiches par identifiant, pour retrouver l'élément d'un lien. */
  const cartes = new Map();
  /** La fiche allumée, ou null quand tout le mur est visible. */
  let allumee = null;

  const titreDe = (id) => t.noeuds.find((n) => n.id === id)?.titre || id;

  function allumer(id) {
    allumee = allumee === id ? null : id;
    const voisins = new Set(allumee ? liensDe(t, allumee).map((l) => l.autre) : []);
    mur.classList.toggle('mur--tire', Boolean(allumee));
    for (const [k, el] of cartes) {
      el.classList.toggle('fiche--tenue', k === allumee);
      el.classList.toggle('fiche--liee', voisins.has(k));
      el.setAttribute('aria-pressed', String(k === allumee));
    }
    tracer();
  }

  function versLaFiche(id) {
    const el = cartes.get(id);
    if (!el) return;
    if (allumee !== id) allumer(id);
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  for (const n of t.noeuds) {
    const nature = NATURE[n.type] || NATURE.evenement;
    const liens = liensDe(t, n.id);
    const chap = n.chapitre ? CHAPITRE_BY_KEY.get(n.chapitre) : null;

    const carte = h('article', {
      class: 'fiche',
      id: `fiche-${n.id}`,
      role: 'button',
      tabindex: '0',
      'aria-pressed': 'false',
      'aria-label': `${n.titre}, ${n.quand}. Appuyer pour suivre ses ficelles.`,
      onclick: (e) => {
        // Un lien ou un bouton à l'intérieur garde son propre geste.
        if (e.target.closest('a, button')) return;
        allumer(n.id);
      },
      onkeydown: (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); allumer(n.id); }
      },
    }, [
      h('span', { class: `fiche__pin fiche__pin--${n.type}`, 'aria-hidden': 'true' }, icon(nature.icone)),
      h('div', { class: 'fiche__corps' }, [
        h('div', { class: 'fiche__haut' }, [
          h('span', { class: 'fiche__quand', text: n.quand }),
          h('span', { class: 'fiche__nature', text: nature.mot }),
        ]),
        h('h2', { class: 'fiche__titre', text: n.titre }),
        h('p', { class: 'fiche__resume', text: n.resume }),

        n.epingles?.length ? h('div', { class: 'fiche__epingles' },
          n.epingles.map((e) => h('span', { class: 'epingle', text: e }))) : null,

        // Les ficelles, écrites. C'est ce qui reste quand on n'a pas le dessin
        // sous les yeux — au clavier, à la voix, ou simplement de mémoire.
        liens.length ? h('div', { class: 'fiche__liens' }, liens.map((l) => h('button', {
          class: 'ficelle', type: 'button',
          onclick: () => versLaFiche(l.autre),
        }, [
          icon('pin'),
          h('span', {}, [
            h('span', { class: 'ficelle__quoi', text: `${l.relation} ` }),
            h('span', { class: 'ficelle__qui', text: titreDe(l.autre) }),
          ]),
        ]))) : null,

        chap ? h('a', {
          class: 'fiche__lire', href: `#/histoire/c/${n.chapitre}`,
        }, [icon('book'), h('span', { text: `Chapitre ${chap.num} — ${chap.titre}` })]) : null,
      ].filter(Boolean)),
    ]);

    cartes.set(n.id, carte);
    mur.append(carte);
  }

  mur.prepend(fils);

  /**
   * Trace les ficelles.
   *
   * Deux familles : le fil qui coud les fiches dans l'ordre, et les arcs qui
   * s'en écartent pour relier ce qui ne se suit pas. Les positions sont
   * mesurées après coup — une fiche fait deux ou six lignes selon le texte et
   * la largeur de l'écran, on ne peut pas les deviner.
   */
  function tracer() {
    const boite = mur.getBoundingClientRect();
    if (!boite.height) return;
    fils.setAttribute('viewBox', `0 0 ${Math.round(boite.width)} ${Math.round(boite.height)}`);
    fils.setAttribute('width', String(Math.round(boite.width)));
    fils.setAttribute('height', String(Math.round(boite.height)));

    const point = new Map();
    for (const [id, el] of cartes) {
      const p = el.querySelector('.fiche__pin').getBoundingClientRect();
      point.set(id, {
        x: p.left - boite.left + p.width / 2,
        y: p.top - boite.top + p.height / 2,
      });
    }

    const traits = [];
    const ordre = t.noeuds.map((n) => n.id);

    // Le fil chronologique : d'une épingle à la suivante.
    for (let i = 0; i < ordre.length - 1; i++) {
      const a = point.get(ordre[i]);
      const z = point.get(ordre[i + 1]);
      if (!a || !z) continue;
      const vif = allumee === ordre[i] || allumee === ordre[i + 1];
      traits.push(`<path class="fil${vif ? ' fil--vif' : ''}" d="M ${a.x} ${a.y} L ${z.x} ${z.y}"/>`);
    }

    // Les arcs, gonflés vers la marge. Trois profondeurs qui alternent, pour
    // que deux arcs voisins ne se confondent pas.
    t.liens.forEach((l, i) => {
      const a = point.get(l.de);
      const z = point.get(l.vers);
      if (!a || !z) return;
      const creux = 9 + (i % 3) * 6;
      const vif = allumee === l.de || allumee === l.vers;
      traits.push(`<path class="arc${vif ? ' arc--vif' : ''}" d="M ${a.x} ${a.y} C ${a.x - creux} ${a.y + 30}, ${z.x - creux} ${z.y - 30}, ${z.x} ${z.y}"/>`);
    });

    fils.innerHTML = traits.join('');
  }

  // Le tracé attend la mise en page, puis suit ses changements : une rotation
  // d'écran ou une police qui arrive en retard déplacent toutes les épingles.
  requestAnimationFrame(() => requestAnimationFrame(tracer));
  if (typeof ResizeObserver === 'function') new ResizeObserver(tracer).observe(mur);
  window.addEventListener('load', tracer);

  const theme = THEMES[t.theme];

  container.append(
    h('div', { class: `hero hero--${t.teinte}` }, [
      h('p', { class: 'hero__eyebrow', text: 'Tableau d’enquête' }),
      h('h1', { class: 'hero__title', text: t.titre }),
      h('p', { class: 'hero__sub', text: t.pourquoi }),
    ]),

    h('div', { class: 'card card--info card--pad-sm' }, [
      h('p', { class: 'small', text: 'Appuyez sur une fiche : elle et tout ce qu’elle touche restent allumés, le reste s’efface. Appuyez encore pour tout revoir.' }),
    ]),

    mur,

    h('div', { class: 'stack stack--tight' }, [
      theme ? h('a', { class: 'btn', href: `#/reviser/t/${t.theme}` }, [
        icon('play'), h('span', { text: `Se tester sur ${theme.short.toLowerCase()}` }),
      ]) : null,
      Button({ variant: 'ghost', size: 'md', fullWidth: true, href: '#/tableaux', label: 'Les autres tableaux' }),
    ].filter(Boolean)),
  );

  // Arrivée depuis un chapitre : la fiche demandée est allumée et amenée sous
  // les yeux, au milieu de ce qui l'entoure.
  if (cible && cartes.has(cible)) {
    requestAnimationFrame(() => requestAnimationFrame(() => {
      allumer(cible);
      cartes.get(cible).scrollIntoView({ block: 'center' });
    }));
  }

  // `ancre` prévient le routeur : cet écran vise lui-même un endroit précis,
  // il ne faut pas lui rendre par-dessus l'ancienne position de lecture.
  return { node: container, title: t.titre, back: '#/tableaux', ancre: Boolean(cible && cartes.has(cible)) };
}
