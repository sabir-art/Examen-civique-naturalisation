/**
 * Référentiel officiel de l'examen civique.
 *
 * Sources : décret n° 2025-648 du 15 juillet 2025 (institution de l'examen
 * civique), arrêté du 10 octobre 2025 (programme, épreuves et modalités
 * d'organisation), livret du citoyen approuvé par l'arrêté du 3 juillet 2026.
 *
 * L'épreuve : QCM de 40 questions, 45 minutes, réussite à 32/40 (80 %),
 * dont 28 questions de connaissances et 12 mises en situation.
 */

export const EXAM = {
  questions: 40,
  minutes: 45,
  passing: 32,
  passingPct: 80,
};

export const THEMES = {
  'principes-valeurs': {
    label: 'Principes et valeurs de la République',
    short: 'Principes et valeurs',
    count: 11,
    icon: 'flag',
    blurb: 'Devise, symboles, laïcité, égalité, fraternité — et la bonne attitude à adopter.',
  },
  'institutions': {
    label: 'Système institutionnel et politique',
    short: 'Institutions',
    count: 6,
    icon: 'bank',
    blurb: 'Démocratie et droit de vote, organisation de la République, Union européenne.',
  },
  'droits-devoirs': {
    label: 'Droits et devoirs',
    short: 'Droits et devoirs',
    count: 11,
    icon: 'scale',
    blurb: 'Libertés fondamentales, obligations du citoyen, charte des droits et devoirs.',
  },
  'histoire-geo-culture': {
    label: 'Histoire, géographie et culture',
    short: 'Histoire & géo',
    count: 8,
    icon: 'book',
    blurb: 'Grandes dates, personnages, territoires, patrimoine et repères culturels.',
  },
  'vivre-societe': {
    label: 'Vivre dans la société française',
    short: 'Vie en société',
    count: 4,
    icon: 'home',
    blurb: 'Santé, école, travail, logement, services publics et vie quotidienne.',
  },
};

export const SUBS = {
  'devise-symboles': 'Devise et symboles de la République',
  'laicite': 'Laïcité',
  'principes': 'Principes républicains',
  'democratie-vote': 'Démocratie et droit de vote',
  'organisation-republique': 'Organisation de la République française',
  'institutions-europeennes': 'Institutions européennes',
  'droits': 'Droits fondamentaux',
  'devoirs': 'Devoirs du citoyen',
  'histoire': 'Repères historiques',
  'geographie': 'Géographie',
  'culture': 'Culture et patrimoine',
  'sante-social': 'Santé et protection sociale',
  'ecole': 'École et éducation',
  'travail': 'Travail et emploi',
  'quotidien': 'Vie quotidienne et services publics',
};

/**
 * Composition d'un examen blanc, calquée sur la répartition officielle.
 * Total : 3+2+6 + 3+2+1 + 5+6 + 8 + 4 = 40 questions.
 */
export const BLUEPRINT = [
  { theme: 'principes-valeurs', subs: ['devise-symboles'], type: 'connaissance', n: 3 },
  { theme: 'principes-valeurs', subs: ['laicite'], type: 'connaissance', n: 2 },
  { theme: 'principes-valeurs', type: 'situation', n: 6 },

  { theme: 'institutions', subs: ['democratie-vote'], type: 'connaissance', n: 3 },
  { theme: 'institutions', subs: ['organisation-republique'], type: 'connaissance', n: 2 },
  { theme: 'institutions', subs: ['institutions-europeennes'], type: 'connaissance', n: 1 },

  { theme: 'droits-devoirs', type: 'connaissance', n: 5 },
  { theme: 'droits-devoirs', type: 'situation', n: 6 },

  { theme: 'histoire-geo-culture', type: 'connaissance', n: 8 },

  { theme: 'vivre-societe', type: 'connaissance', n: 4 },
];

export const THEME_ORDER = Object.keys(THEMES);

/** Nombre de questions de l'examen blanc issues d'un thème donné. */
export function blueprintCount(theme) {
  return BLUEPRINT.filter((b) => b.theme === theme).reduce((s, b) => s + b.n, 0);
}

/** Informations pratiques affichées dans l'application. */
export const PRATIQUE = {
  qui: "Toute personne qui dépose une demande de naturalisation ou de réintégration par décret à compter du 1er janvier 2026, ainsi que, selon les cas, certaines demandes de carte de séjour pluriannuelle ou de carte de résident.",
  format: "QCM de 40 questions en français, 45 minutes maximum, sur ordinateur ou tablette, dans un centre agréé.",
  reussite: "32 bonnes réponses sur 40, soit 80 %.",
  organismes: "Les centres agréés par le ministère de l'Intérieur (notamment France Éducation international et le réseau des chambres de commerce et d'industrie).",
  prix: "Payant, autour de 70 à 100 € selon le centre. L'inscription se fait en ligne auprès du centre choisi.",
  validite: "L'attestation de réussite n'a pas de durée de validité.",
  support: "Le livret du citoyen, édité par le ministère de l'Intérieur, est le document de référence du programme. Il est téléchargeable gratuitement sur les sites en .gouv.fr.",
  note: "Ces informations sont données à titre indicatif et peuvent évoluer : vérifiez toujours auprès de votre préfecture, de service-public.fr et du centre d'examen.",
};
