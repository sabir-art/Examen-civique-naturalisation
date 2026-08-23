/**
 * Les questions officielles de l'examen civique.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *  Ce que cette banque est, et ce qu'elle n'est pas
 * ─────────────────────────────────────────────────────────────────────────────
 *  Les INTITULÉS sont ceux publiés par le ministère de l'Intérieur le
 *  12 décembre 2025 (« Liste officielle des questions de connaissance »), repris
 *  mot pour mot, ponctuation comprise. Ils sont figés dans
 *  docs/questions-officielles-20251212.json, avec l'empreinte du PDF d'origine,
 *  et scripts/check-officiel.mjs vérifie qu'ils n'ont pas dérivé.
 *
 *  Les PROPOSITIONS DE RÉPONSE, elles, ne sont pas officielles : le ministère
 *  ne les publie pas. Elles sont rédigées ici, et chaque bonne réponse est
 *  justifiée dans son explication par le livret du citoyen ou par le texte de
 *  loi qui la fonde. C'est la seule garantie qu'on puisse honnêtement donner,
 *  et elle doit être dite : réviser sur une mauvaise « bonne réponse » est pire
 *  que ne pas réviser du tout.
 *
 *  L'autre banque — les 363 questions rédigées à partir du référentiel de
 *  l'arrêté du 10 octobre 2025 — reste à côté, pour l'entraînement. Elle couvre
 *  le même programme avec d'autres formulations.
 * ─────────────────────────────────────────────────────────────────────────────
 */

const Q = {
  /* ═══════════════════════════════ Principes et valeurs de la République ═══ */
  'principes-valeurs': [
    {
      q: 'Complétez les paroles de la Marseillaise "Allons enfants de la patrie..."',
      c: ['Le jour de gloire est arrivé', 'La liberté nous a guidés', 'Le drapeau tricolore est levé', "L'heure de la victoire a sonné"],
      a: 0,
      why: "Premier couplet de La Marseillaise, écrite par Rouget de Lisle en 1792 (livret du citoyen, partie 1, chapitre I — « L'hymne national »).",
    },
    {
      q: "Dans le cadre d'un entretien d'embauche, que peut-on demander au candidat ?",
      c: ['Son expérience et ses compétences professionnelles', 'Sa religion et ses pratiques religieuses', "Son intention d'avoir des enfants", 'Son origine et celle de ses parents'],
      a: 0,
      why: "Livret du citoyen, partie 1, chapitre I — « Toute décision d'un employeur (embauche, promotion…) doit être fondée sur des raisons professionnelles et non personnelles. » Les autres questions relèvent de la discrimination, punie par la loi.",
    },
    {
      q: 'Déclarer ses revenus aux services fiscaux est :',
      c: ['Une obligation pour toute personne majeure résidant en France', 'Une démarche volontaire, laissée à chacun', 'Une formalité réservée aux personnes de nationalité française', 'Une obligation qui ne concerne que les salariés'],
      a: 0,
      why: "Livret du citoyen, partie 2, chapitre II — « Contribuer aux charges publiques » : toute personne majeure résidant en France et détachée du foyer fiscal de ses parents doit déclarer l'intégralité de ses revenus. Une fausse déclaration est sanctionnée.",
    },
    {
      q: 'En France, les impôts permettent de financer les dépenses publiques. Quelle proposition est correcte ?',
      c: ['Ils financent les services publics au bénéfice de tous', 'Ils sont reversés aux entreprises privées du pays', 'Ils servent uniquement à rembourser la dette de la France', 'Ils ne concernent pas les personnes étrangères résidant en France'],
      a: 0,
      why: "Livret du citoyen, partie 1, chapitre I — « Remplir ses obligations fiscales est un acte solidaire qui permet de financer les services publics au bénéfice de tous. »",
    },
    {
      q: "La liberté d'association est :",
      c: ['Reconnue par la loi du 1er juillet 1901', "Interdite depuis la loi de séparation de 1905", 'Réservée aux personnes de nationalité française', "Soumise à l'autorisation préalable du préfet"],
      a: 0,
      why: "Livret du citoyen, partie 2, chapitre I — « La loi du 1er juillet 1901 reconnaît le droit de créer ou de rejoindre une association. » Les associations doivent respecter les lois.",
    },
    {
      q: "La liberté d'expression sur les réseaux sociaux en France est :",
      c: ['Garantie, mais encadrée par la loi', 'Totale, sans aucune limite légale', 'Interdite sans autorisation préalable', 'Réservée aux journalistes professionnels'],
      a: 0,
      why: "Livret du citoyen, partie 1, chapitre II — les limites sont la diffamation, les injures publiques, l'incitation à la haine raciale, ethnique ou religieuse, l'incitation à discriminer et le négationnisme. Le blasphème, lui, n'est pas un délit.",
    },
    {
      q: 'Lequel de ces prénoms évoque un symbole de la République ?',
      c: ['Marianne', 'Jeanne', 'Camille', 'Sophie'],
      a: 0,
      why: "Livret du citoyen, partie 1, chapitre I — Marianne, coiffée du bonnet phrygien, est devenue le symbole de la République. Sa statue est placée dans toutes les mairies.",
    },
    {
      q: 'Lequel de ces symboles représente la République française ?',
      c: ['Le drapeau bleu, blanc, rouge', "L'aigle impérial", 'La fleur de lys', 'Le lion couronné'],
      a: 0,
      why: "Livret du citoyen, partie 1, chapitre I — le drapeau tricolore, créé pendant la Révolution, est le drapeau officiel de la France depuis 1794. La fleur de lys était l'emblème de la royauté, l'aigle celui de l'Empire.",
    },
    {
      q: 'Où peut-on voir la devise de la République ?',
      c: ['Sur le fronton des bâtiments publics', 'Uniquement dans les manuels scolaires', 'Sur les plaques des véhicules', 'Sur les cartes bancaires françaises'],
      a: 0,
      why: "Livret du citoyen, partie 1, chapitre I — « Elle est inscrite sur le fronton des bâtiments publics (préfectures, mairies…). »",
    },
    {
      q: 'Lesquels sont des symboles officiels de la République française ?',
      c: ['Le drapeau tricolore, La Marseillaise et la devise', 'Le coq gaulois et la fleur de lys', 'La tour Eiffel et le drapeau tricolore', "L'aigle impérial et la couronne"],
      a: 0,
      why: "Livret du citoyen, partie 1, chapitre I. Le coq, lui, « n'a pas de statut officiel selon la Constitution » même s'il est largement reconnu comme symbole national.",
    },
    {
      q: 'Peut-on brûler publiquement un drapeau français ?',
      c: ['Non, la loi punit cet outrage', 'Oui, au titre de la liberté d’expression', 'Oui, à condition d’être seul', 'Oui, sauf le jour de la fête nationale'],
      a: 0,
      why: "L'article 433-5-1 du code pénal punit de 7 500 € d'amende l'outrage public au drapeau tricolore ou à l'hymne national commis lors d'une manifestation organisée ou réglementée par les autorités publiques. Le décret du 21 juillet 2010 réprime en outre sa destruction publique dans des conditions de nature à troubler l'ordre public.",
    },
    {
      q: 'Quand la sécurité sociale a-t-elle été établie en France ?',
      c: ['En 1945', 'En 1905', 'En 1958', 'En 1981'],
      a: 0,
      why: "Livret du citoyen, partie 4, chapitre I — la Sécurité sociale est créée sous le Gouvernement provisoire de la République française (1944-1946), par les ordonnances des 4 et 19 octobre 1945.",
    },
    {
      q: 'Que commémore la fête nationale ?',
      c: ['La prise de la Bastille et la fête de la Fédération', 'La proclamation de la République en 1792', "La fin de la Seconde Guerre mondiale", "L'adoption de la Constitution de 1958"],
      a: 0,
      why: "Livret du citoyen, partie 1, chapitre I — le 14 juillet 1789 (prise de la Bastille) et le 14 juillet 1790 (fête de la Fédération). C'est depuis 1880 que le 14 juillet est jour de fête nationale.",
    },
    {
      q: 'Que porte Marianne sur la tête ?',
      c: ['Un bonnet phrygien', 'Une couronne de lauriers', 'Un casque de soldat', 'Un voile de dentelle'],
      a: 0,
      why: "Livret du citoyen, partie 1, chapitre I — le bonnet phrygien est le symbole de la liberté.",
    },
    {
      q: "Quel symbole de la République peut-on voir sur les maillots de l'équipe de France de football ?",
      c: ['Le coq', 'Marianne', 'La fleur de lys', "L'aigle"],
      a: 0,
      why: "Livret du citoyen, partie 1, chapitre I — le coq représente la fierté, le courage et la vigilance. Il n'a pas de statut constitutionnel, mais il est largement reconnu comme symbole national.",
    },
    {
      q: 'Quelle est la devise de la République française ?',
      c: ['Liberté, Égalité, Fraternité', 'Unité, Travail, Justice', 'Liberté, Sécurité, Prospérité', 'Honneur et Patrie'],
      a: 0,
      why: "Livret du citoyen, partie 1, chapitre I — la devise « consacre les valeurs fondatrices de la République française ». Elle figure à l'article 2 de la Constitution du 4 octobre 1958.",
    },
    {
      q: "Qu'est-ce que la liberté d'association ?",
      c: ['Le droit de créer une association ou de la rejoindre', 'Le droit de manifester dans la rue', 'Le droit de fonder un parti politique', "Le droit d'adhérer à un syndicat"],
      a: 0,
      why: "Livret du citoyen, partie 2, chapitre I — reconnue par la loi du 1er juillet 1901. Le droit de manifester et le droit syndical sont des libertés distinctes.",
    },
    {
      q: "Qu'est-ce qu'une liberté ?",
      c: ['Le droit de faire ce qui ne nuit pas à autrui', 'Le droit de faire ce que l’on veut, sans limite', "Une autorisation accordée par l'État", 'Un privilège réservé aux citoyens français'],
      a: 0,
      why: "Article 4 de la Déclaration des droits de l'homme et du citoyen de 1789, cité par le livret : « la liberté consiste à pouvoir faire tout ce qui ne nuit pas à autrui ».",
    },
    {
      q: 'Sur quel document peut-on voir Marianne ?',
      c: ["Les documents de l'administration française", 'Les contrats de travail privés', "Les factures d'électricité", 'Les journaux quotidiens'],
      a: 0,
      why: "Livret du citoyen, partie 1, chapitre I — « Elle apparaît sur les documents de l'administration française. »",
    },
    {
      q: "Une des valeurs de la devise républicaine est l'Égalité. Qu'est-ce que cela signifie ?",
      c: ['Les mêmes droits pour tous les citoyens', 'Le même revenu pour tous les citoyens', 'Le même métier accessible à chacun', "Le même montant d'impôt pour chacun"],
      a: 0,
      why: "Livret du citoyen, partie 1, chapitre I — « Tous les citoyens ont les mêmes droits quel que soit leur sexe, leur origine, leur religion, leurs opinions ou leur orientation sexuelle » (article 1er de la DDHC).",
    },
    {
      q: 'Une personne peut-elle changer librement de religion en France ?',
      c: ['Oui, la liberté de conscience le garantit', 'Non, la loi de 1905 l’interdit', "Oui, avec l'accord de sa commune", 'Non, sauf pour les personnes nées à l’étranger'],
      a: 0,
      why: "Livret du citoyen, partie 1, chapitre II — la laïcité garantit « la liberté de conscience pour tous », c'est-à-dire la liberté d'avoir ou de ne pas avoir de religion, d'en changer (droit de se convertir) ou de ne plus en avoir.",
    },
    {
      q: 'Que peut faire un usager du service public dans une mairie ?',
      c: ['Porter un signe religieux visible', 'Exiger que le service s’adapte à sa religion', 'Demander un agent de sa propre religion', 'Refuser de présenter une pièce d’identité'],
      a: 0,
      why: "Livret du citoyen, partie 1, chapitre II — « La neutralité ne s'impose pas aux usagers. » Ils peuvent porter un signe religieux dans un service public, à condition de respecter les règles de fonctionnement du service — mais ne peuvent pas en exiger l'adaptation au nom d'une religion.",
    },
    {
      q: "En France, il est possible pour l'État de financer :",
      c: ['La restauration d’un monument religieux classé', 'La construction d’un nouvel édifice religieux', 'Le salaire des ministres du culte', "Le fonctionnement d'une organisation religieuse"],
      a: 0,
      why: "Livret du citoyen, partie 1, chapitre II — « L'État a la possibilité de financer la restauration d'un monument religieux classé au patrimoine », mais il n'a pas le droit de financer la construction d'un édifice religieux ni de payer un personnel religieux.",
    },
    {
      q: "En quelle année la loi de séparation des Églises et de l'État a-t-elle été votée ?",
      c: ['1905', '1901', '1789', '1958'],
      a: 0,
      why: "Livret du citoyen, partie 4, chapitre I — la loi du 9 décembre 1905, votée sous la Troisième République. La loi de 1901 porte sur les associations.",
    },
    {
      q: 'Que dit la loi de 1905 ?',
      c: ['Elle sépare les Églises et l’État', 'Elle interdit toute religion en France', 'Elle rend l’école gratuite et obligatoire', 'Elle reconnaît quatre cultes officiels'],
      a: 0,
      why: "Livret du citoyen, partie 1, chapitre II — l'État ne soutient aucune organisation religieuse, les considère toutes de la même manière et n'est pas impliqué dans leur fonctionnement interne.",
    },
    {
      q: 'Que garantit le principe de laïcité ?',
      c: ['La liberté de conscience et la neutralité de l’État', 'La disparition progressive des religions', 'L’obligation d’être athée en public', 'Le financement égal de toutes les religions'],
      a: 0,
      why: "Livret du citoyen, partie 1, chapitre II — la laïcité garantit la liberté de conscience, le libre exercice des cultes et le respect de toutes les croyances ; elle impose la neutralité de l'État.",
    },
    {
      q: 'Quel jour célèbre-t-on officiellement la laïcité en France ?',
      c: ['Le 9 décembre', 'Le 15 mars', 'Le 1er mai', 'Le 14 juillet'],
      a: 0,
      why: "Livret du citoyen, partie 1, chapitre II — « La laïcité […] est officiellement célébrée en France le 9 décembre », date anniversaire de la loi de 1905.",
    },
    {
      q: 'Quel symbole religieux peut être porté dans une école publique dans le respect de la laïcité ?',
      c: ['Un signe discret', 'Un voile intégral', 'Une grande croix apparente', 'Aucun signe, même discret'],
      a: 0,
      why: "Livret du citoyen, partie 1, chapitre II — la loi du 15 mars 2004 interdit les signes ou tenues manifestant ostensiblement une appartenance religieuse. « Les signes discrets sont autorisés. »",
    },
    {
      q: 'Quel terme désigne précisément la haine ou les préjugés contre les Juifs ?',
      c: ["L'antisémitisme", 'Le racisme', 'Le sexisme', 'Le communautarisme'],
      a: 0,
      why: "Livret du citoyen, partie 1, chapitre I — « forme spécifique de racisme et de haine dirigée contre les Juifs, fondée sur des préjugés, des stéréotypes et des discriminations ».",
    },
    {
      q: 'Quel texte est considéré comme le texte fondateur de la laïcité ?',
      c: ['La loi du 9 décembre 1905', 'La Déclaration de 1789', 'La Constitution de 1958', 'La loi du 15 mars 2004'],
      a: 0,
      why: "Livret du citoyen, partie 1, chapitre II — la loi de 1905 sur la séparation des Églises et de l'État. La journée de la laïcité, le 9 décembre, en est l'anniversaire.",
    },
    {
      q: 'Quelle institution française doit rester neutre en matière de religion ?',
      c: ['L’État et les services publics', 'Les entreprises privées', 'Les associations culturelles', 'Les partis politiques'],
      a: 0,
      why: "Livret du citoyen, partie 1, chapitre II — « L'État, les collectivités territoriales et les services publics sont neutres vis-à-vis des religions. » Les salariés du privé, eux, peuvent exprimer leurs convictions dans les limites fixées par le règlement intérieur.",
    },
    {
      q: "Qu'est-ce que la laïcité ?",
      c: ['La séparation de l’État et des religions', 'Le refus de toute croyance religieuse', 'Une religion officielle de la République', 'Une interdiction de croire en public'],
      a: 0,
      why: "Livret du citoyen, partie 1, chapitre II — principe de valeur constitutionnelle, la laïcité garantit la liberté de conscience et impose la neutralité de l'État. Elle ne combat aucune religion.",
    },
    {
      q: "À l'école, la charte de la laïcité permet de :",
      c: ['Rappeler les règles à tous ceux qui font l’école', 'Choisir un enseignement religieux facultatif', 'Dispenser certains élèves de cours', 'Autoriser les signes religieux ostensibles'],
      a: 0,
      why: "Livret du citoyen, partie 1, chapitre II — « Elle s'adresse à l'ensemble des personnels de l'établissement (professeurs, animateurs périscolaires…), aux élèves ainsi qu'aux parents d'élèves. »",
    },
    {
      q: 'Qui doit respecter et veiller à la neutralité religieuse dans les services publics ?',
      c: ['Les agents publics', 'Les usagers du service', 'Les visiteurs de passage', 'Les élus locaux uniquement'],
      a: 0,
      why: "Livret du citoyen, partie 1, chapitre II — « Pour garantir la neutralité de l'État, les agents publics ne peuvent pas montrer leur religion ou leurs opinions au travail. » La neutralité ne s'impose pas aux usagers.",
    },
    {
      q: 'Une personne déclare ne croire en aucun dieu. On peut dire :',
      c: ['Qu’elle est athée', 'Qu’elle est agnostique', 'Qu’elle est laïque', 'Qu’elle est croyante'],
      a: 0,
      why: "Livret du citoyen, partie 1, chapitre II — « Une personne est dite “athée” lorsqu'elle ne croit en aucune religion et “agnostique” lorsqu'elle est sceptique vis-à-vis de la religion. »",
    },
  ],
};

/* Les identifiants sont stables et lisibles : « of » pour officiel, puis le
   rang dans le thème. La progression y est attachée — les renuméroter
   effacerait ce que les gens ont déjà fait. */
const PREFIXE = {
  'principes-valeurs': 'ofpv',
  institutions: 'ofin',
  'droits-devoirs': 'ofdd',
  'histoire-geo-culture': 'ofhg',
  'vivre-societe': 'ofvs',
};

export const OFFICIEL_QUESTIONS = Object.entries(Q).flatMap(([theme, liste]) =>
  liste.map((q, i) => ({
    ...q,
    theme,
    type: 'connaissance',
    source: 'officiel',
    id: `${PREFIXE[theme]}${String(i + 1).padStart(3, '0')}`,
  })));

export const OFFICIEL_BY_ID = new Map(OFFICIEL_QUESTIONS.map((q) => [q.id, q]));

/** Les questions officielles d'un thème. */
export function officielQuestionsOf(theme) {
  return OFFICIEL_QUESTIONS.filter((q) => q.theme === theme);
}
