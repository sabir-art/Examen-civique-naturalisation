/**
 * Recherche dans toute l'application.
 *
 * Trois banques de questions, les chapitres du livret, ceux du récit et les
 * fiches de révision. L'index est construit une seule fois, au premier usage :
 * il tient en mémoire (quelques milliers de lignes) et évite de reparcourir
 * tout le contenu à chaque frappe.
 */

import { h, icon } from '../lib/dom.js';
import { QUESTIONS } from '../data/questions.js';
import { LIVRET_QUESTIONS } from '../data/q-livret.js';
import { ROMAN_QUESTIONS, CHAPITRES as ROMAN_CHAPITRES, CHAPITRE_BY_KEY as ROMAN_BY_KEY } from '../data/roman.js';
import { CHAPITRES as LIVRET_CHAPITRES, CHAPITRE_BY_KEY as LIVRET_BY_KEY } from '../data/livret.js';
import { COURS } from '../data/cours.js';
import { THEMES } from '../data/programme.js';

/** Minuscules, sans accents ni ponctuation : « État » trouve « etat ». */
function pliage(s) {
  return String(s)
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[’']/g, ' ')
    .replace(/[^a-z0-9 ]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Retire les balises d'un fragment HTML pour le rendre cherchable. */
function texteBrut(html) {
  return String(html).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

let INDEX = null;

function construireIndex() {
  if (INDEX) return INDEX;
  const entrees = [];

  const question = (q, famille, sousTitre, href) => ({
    famille,
    titre: q.q,
    sousTitre,
    href,
    reponse: q.c[q.a],
    pourquoi: q.why || null,
    cherchable: pliage([q.q, q.scenario || '', q.c.join(' '), q.why || ''].join(' ')),
  });

  for (const q of QUESTIONS) {
    entrees.push(question(q, 'examen', THEMES[q.theme]?.short || 'Programme', `#/reviser/t/${q.theme}`));
  }
  for (const q of LIVRET_QUESTIONS) {
    const ch = LIVRET_BY_KEY.get(q.chapter);
    entrees.push(question(q, 'livret', ch ? ch.title : 'Livret du citoyen', `#/livret/c/${q.chapter}`));
  }
  for (const q of ROMAN_QUESTIONS) {
    const ch = ROMAN_BY_KEY.get(q.chapitre);
    entrees.push(question(q, 'recit', ch ? `Chapitre ${ch.num} — ${ch.titre}` : 'La France racontée', `#/histoire/c/${q.chapitre}`));
  }

  for (const c of LIVRET_CHAPITRES) {
    entrees.push({
      famille: 'chapitre-livret',
      titre: `${c.num}. ${c.title}`,
      sousTitre: c.partieTitle,
      href: `#/livret/c/${c.key}`,
      cherchable: pliage([c.title, c.partieTitle, c.sections.map((s) => `${s.h} ${texteBrut(s.html)}`).join(' ')].join(' ')),
    });
  }

  for (const c of ROMAN_CHAPITRES) {
    entrees.push({
      famille: 'chapitre-recit',
      titre: `Chapitre ${c.num} — ${c.titre}`,
      sousTitre: `${c.lieu}, ${c.date}`,
      href: `#/histoire/c/${c.key}`,
      cherchable: pliage([c.titre, c.lieu, c.date, (c.retenir || []).join(' '), texteBrut(c.html)].join(' ')),
    });
  }

  for (const f of COURS) {
    entrees.push({
      famille: 'fiche',
      titre: f.title,
      sousTitre: f.subtitle,
      href: `#/cours/${f.key}`,
      cherchable: pliage([f.title, f.subtitle, f.sections.map((s) => `${s.h} ${texteBrut(s.html)}`).join(' ')].join(' ')),
    });
  }

  INDEX = entrees;
  return INDEX;
}

const FAMILLES = {
  examen: { label: "Questions d'examen", icone: 'target', tone: '' },
  livret: { label: 'Questions du livret', icone: 'bank', tone: 'livret' },
  recit: { label: 'Questions du récit', icone: 'star', tone: 'story' },
  'chapitre-livret': { label: 'Chapitres du livret', icone: 'book', tone: 'livret' },
  'chapitre-recit': { label: 'Chapitres du récit', icone: 'book', tone: 'story' },
  fiche: { label: 'Fiches de révision', icone: 'flag', tone: 'revise' },
};
const ORDRE = ['examen', 'livret', 'recit', 'chapitre-livret', 'chapitre-recit', 'fiche'];

/** Découpe un texte pour surligner les mots trouvés. */
function surligne(texte, mots) {
  if (!mots.length) return document.createTextNode(texte);
  // Le repérage se fait mot à mot : on plie chaque mot du texte d'origine et on
  // regarde s'il commence par l'un des mots cherchés. Comparer les positions
  // caractère par caractère serait faux, le pliage changeant la longueur.
  const frag = document.createDocumentFragment();
  for (const part of texte.split(/(\s+)/)) {
    const p = pliage(part);
    const touche = p && mots.some((m) => p.startsWith(m));
    frag.append(touche ? h('mark', { text: part }) : document.createTextNode(part));
  }
  return frag;
}

const MAX_PAR_FAMILLE = 12;

export default function renderRecherche() {
  const champ = h('input', {
    class: 'input search__field',
    type: 'search',
    placeholder: 'Marianne, laïcité, 1789, préfet…',
    autocomplete: 'off',
    'aria-label': 'Rechercher dans toute l’application',
    enterkeyhint: 'search',
  });

  const resultats = h('div', { class: 'stack' });
  const compteur = h('p', { class: 'hint', style: 'margin:2px' });

  const SUGGESTIONS = ['Laïcité', 'Marianne', '14 juillet', 'Sénat', 'Marseillaise', '1789', 'Préfet', 'Naturalisation'];

  const suggestions = h('div', { class: 'stack' }, [
    h('p', { class: 'section-title', text: 'Idées de recherche' }),
    h('div', { class: 'chips' }, SUGGESTIONS.map((s) => h('button', {
      class: 'chip', type: 'button', text: s,
      onclick: () => { champ.value = s; chercher(); champ.focus(); },
    }))),
    h('div', { class: 'card card--info' }, [
      h('p', { class: 'small', text: "La recherche couvre les 735 questions des trois banques, les 22 chapitres du récit, les chapitres du livret officiel et les fiches de révision." }),
    ]),
  ]);

  function ligneQuestion(e, mots) {
    const det = h('details', { class: 'sres' }, [
      h('summary', { class: 'sres__head' }, [
        h('span', { class: 'sres__title' }, surligne(e.titre, mots)),
        h('span', { class: 'sres__sub', text: e.sousTitre }),
      ]),
      h('div', { class: 'sres__body' }, [
        h('div', { class: 'answerbox answerbox--ok' }, [icon('check'), h('span', {}, surligne(e.reponse, mots))]),
        e.pourquoi ? h('p', { class: 'small muted', style: 'margin-top:8px' }, surligne(e.pourquoi, mots)) : null,
        h('a', { class: 'linkbtn', style: 'margin-top:10px;display:inline-block', href: e.href, text: 'Réviser ce thème →' }),
      ].filter(Boolean)),
    ]);
    return det;
  }

  function lignePage(e, mots) {
    return h('a', { class: 'item', href: e.href }, [
      h('span', { class: 'item__icon' }, icon(FAMILLES[e.famille].icone)),
      h('span', { class: 'item__body' }, [
        h('span', { class: 'item__title' }, surligne(e.titre, mots)),
        h('span', { class: 'item__sub', text: e.sousTitre }),
      ]),
      h('span', { class: 'item__chev' }, icon('chevron')),
    ]);
  }

  function chercher() {
    const brut = champ.value.trim();
    if (brut.length < 2) {
      compteur.textContent = '';
      resultats.replaceChildren(suggestions);
      return;
    }

    const mots = pliage(brut).split(' ').filter(Boolean);
    const index = construireIndex();
    const trouves = index.filter((e) => mots.every((m) => e.cherchable.includes(m)));

    if (!trouves.length) {
      compteur.textContent = '';
      resultats.replaceChildren(h('div', { class: 'empty' }, [
        h('div', { class: 'empty__icon' }, icon('search')),
        h('p', { text: `Rien pour « ${brut} ».` }),
        h('p', { class: 'hint mt', text: 'Essayez un seul mot, ou une orthographe plus simple.' }),
      ]));
      return;
    }

    compteur.textContent = `${trouves.length} résultat${trouves.length > 1 ? 's' : ''} pour « ${brut} »`;

    const blocs = [];
    for (const famille of ORDRE) {
      const groupe = trouves.filter((e) => e.famille === famille);
      if (!groupe.length) continue;
      const meta = FAMILLES[famille];
      const visibles = groupe.slice(0, MAX_PAR_FAMILLE);
      const estQuestion = famille === 'examen' || famille === 'livret' || famille === 'recit';

      blocs.push(h('div', { class: 'stack stack--tight' }, [
        h('div', { class: 'row row--between' }, [
          h('p', { class: 'section-title', style: 'margin:0', text: meta.label }),
          h('span', { class: 'badge', text: String(groupe.length) }),
        ]),
        estQuestion
          ? h('div', { class: 'card card--pad-sm sreslist' }, visibles.map((e) => ligneQuestion(e, mots)))
          : h('div', { class: 'list' }, visibles.map((e) => lignePage(e, mots))),
        groupe.length > visibles.length
          ? h('p', { class: 'hint center', text: `et ${groupe.length - visibles.length} de plus — précisez votre recherche` })
          : null,
      ].filter(Boolean)));
    }

    resultats.replaceChildren(...blocs);
  }

  // Une frappe rapide ne doit pas relancer six filtres par seconde.
  let minuteur;
  champ.addEventListener('input', () => {
    clearTimeout(minuteur);
    minuteur = setTimeout(chercher, 130);
  });
  champ.addEventListener('search', chercher);

  chercher();
  setTimeout(() => champ.focus(), 80);

  return {
    node: h('div', { class: 'stack' }, [
      h('div', { class: 'search' }, [
        h('span', { class: 'search__icon' }, icon('search')),
        champ,
      ]),
      compteur,
      resultats,
    ]),
    title: 'Rechercher',
    back: '#/',
  };
}
