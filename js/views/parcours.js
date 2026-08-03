/** Mon parcours : niveau, points d'expérience et badges. */

import { h, icon } from '../lib/dom.js';
import { formatDateShort, plural } from '../lib/util.js';
import { NIVEAUX, niveau, badges, POINTS_AIDE } from '../lib/xp.js';
import * as store from '../store.js';

/** Anneau du niveau. Même tracé que l'accueil, en plus petit. */
function ring(pct, texte, sous) {
  const r = 54;
  const c = 2 * Math.PI * r;
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 128 128');
  svg.setAttribute('class', 'ring');
  svg.style.width = '108px';
  svg.style.height = '108px';
  svg.innerHTML = `
    <circle class="ring__track" cx="64" cy="64" r="${r}" fill="none" stroke-width="10"/>
    <circle class="ring__value" cx="64" cy="64" r="${r}" fill="none" stroke-width="10" stroke-linecap="round"
            transform="rotate(-90 64 64)" stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - pct / 100)}"/>
    <text class="ring__label" x="64" y="58" text-anchor="middle" dominant-baseline="middle">${texte}</text>
    <text class="ring__sub" x="64" y="90" text-anchor="middle">${sous}</text>`;
  return svg;
}

export default function renderParcours() {
  const n = niveau();
  const liste = badges();
  const obtenus = liste.filter((b) => b.obtenu);
  const restants = liste.filter((b) => !b.obtenu).sort((a, b) => b.pct - a.pct);
  const dates = store.badgeDates();

  // Horodate les badges déjà obtenus pour qu'ils apparaissent dans le journal.
  store.stampBadges(obtenus.map((b) => b.id));

  /* --------------------------------------------------------------- niveau */

  const carteNiveau = h('div', { class: 'card' }, [
    h('div', { class: 'progrow' }, [
      ring(n.pct, String(n.rang), `NIVEAU ${n.rang}/${n.total}`),
      h('div', { class: 'grow' }, [
        h('p', { class: 'card__eyebrow', text: `${n.xp.toLocaleString('fr-FR')} points` }),
        h('h2', { style: 'font-size:20px;margin-top:3px', text: n.nom }),
        h('p', {
          class: 'card__sub',
          text: n.suivant
            ? `Encore ${n.versLeSuivant.toLocaleString('fr-FR')} ${plural(n.versLeSuivant, 'point')} pour atteindre « ${n.suivant} ».`
            : 'Dernier niveau atteint. Il ne reste plus qu’à passer l’épreuve.',
        }),
        h('div', { class: 'bar', style: 'margin-top:11px' },
          h('div', { class: 'bar__fill', style: `width:${n.pct}%` })),
        n.suivant ? h('p', { class: 'hint', style: 'margin-top:5px', text: `${n.depuis} / ${n.requis} sur ce palier` }) : null,
      ].filter(Boolean)),
    ]),
  ]);

  /* ------------------------------------------------------------- l'échelle */

  const echelle = h('div', { class: 'card card--pad-sm' }, h('div', { class: 'trows' },
    NIVEAUX.map((niv, i) => {
      const rang = i + 1;
      const etat = rang < n.rang ? 'passe' : rang === n.rang ? 'courant' : 'venir';
      return h('div', { class: `lvl lvl--${etat}` }, [
        h('span', { class: 'lvl__num', text: String(rang) }),
        h('span', { class: 'lvl__body' }, [
          h('span', { class: 'lvl__name', text: niv.nom }),
          h('span', { class: 'lvl__seuil', text: niv.seuil === 0 ? 'dès la première question' : `à partir de ${niv.seuil.toLocaleString('fr-FR')} points` }),
        ]),
        etat === 'passe' ? h('span', { class: 'lvl__mark' }, icon('check'))
          : etat === 'courant' ? h('span', { class: 'badge badge--brand', text: 'ici' })
            : h('span', { class: 'lvl__mark lvl__mark--off' }, icon('lock')),
      ]);
    })));

  /* --------------------------------------------------------------- badges */

  function grille(items, verrouilles) {
    return h('div', { class: 'badges' }, items.map((b) => h('div', {
      class: `bdg${verrouilles ? ' bdg--off' : ''}`,
    }, [
      h('span', { class: 'bdg__icon' }, icon(b.icone)),
      h('span', { class: 'bdg__name', text: b.nom }),
      h('span', { class: 'bdg__desc', text: b.desc }),
      verrouilles
        ? h('span', { class: 'bdg__prog' }, [
          h('span', { class: 'bar bar--thin' }, h('span', { class: 'bar__fill', style: `width:${b.pct}%` })),
          h('span', { class: 'bdg__val', text: `${Math.min(b.valeur, b.cible)} / ${b.cible}` }),
        ])
        : h('span', {
          class: 'bdg__date',
          text: dates[b.id] && !store.badgeDateInconnue(b.id) ? formatDateShort(dates[b.id]) : 'obtenu',
        }),
    ])));
  }

  /* ------------------------------------------------------------- barème */

  const bareme = h('div', { class: 'card card--info' }, [
    h('h2', { class: 'card__title', text: 'Comment se gagnent les points' }),
    h('div', { class: 'stack stack--tight mt' }, POINTS_AIDE.map(([quoi, combien]) => h('div', { class: 'row row--between' }, [
      h('span', { class: 'small', text: quoi }),
      h('span', { class: 'badge badge--brand nowrap', text: combien }),
    ]))),
    h('p', { class: 'hint mt', text: "Les points sont recalculés à partir de votre progression : ils suivent une sauvegarde importée et repartent de zéro si vous effacez tout." }),
  ]);

  return {
    node: h('div', { class: 'stack' }, [
      carteNiveau,

      h('div', { class: 'row row--between' }, [
        h('p', { class: 'section-title', style: 'margin:0', text: 'Badges obtenus' }),
        h('span', { class: 'badge', text: `${obtenus.length}/${liste.length}` }),
      ]),
      obtenus.length
        ? grille(obtenus, false)
        : h('div', { class: 'card card--info' }, [
          h('p', { class: 'small', text: "Aucun badge pour l'instant. Le premier arrive dès la première question répondue." }),
          h('a', { class: 'btn mt', href: '#/reviser/revision', text: 'Commencer une révision' }),
        ]),

      restants.length ? h('p', { class: 'section-title', text: 'À portée' }) : null,
      restants.length ? grille(restants.slice(0, 6), true) : null,

      restants.length > 6 ? h('details', { class: 'card card--pad-sm' }, [
        h('summary', { class: 'summary' }, [icon('list'), h('span', { text: `Les ${restants.length - 6} autres badges` })]),
        h('div', { class: 'mt' }, grille(restants.slice(6), true)),
      ]) : null,

      h('p', { class: 'section-title', text: 'Les niveaux' }),
      echelle,
      bareme,
    ].filter(Boolean)),
    title: 'Mon parcours',
    back: '#/progres',
  };
}
