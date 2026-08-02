/**
 * Thème 5 — Vivre dans la société française (4 questions à l'examen).
 * Santé, école, travail, logement, services publics et vie quotidienne.
 */

const T = 'vivre-societe';
const K = 'connaissance';

const sante = [
  {
    q: "Qu'est-ce que la Sécurité sociale ?",
    c: [
      "Un système de protection collective qui rembourse les soins et verse des prestations",
      "Une assurance privée facultative",
      "Un service de police municipale",
      "Un dispositif réservé aux retraités",
    ],
    a: 0,
    why: "Créée en 1945, elle repose sur la solidarité : elle couvre la maladie, la famille, la retraite, les accidents du travail et l'autonomie.",
  },
  {
    q: "Quel document permet d'être remboursé de ses frais de santé ?",
    c: ["La carte Vitale", "La carte d'identité", "Le livret de famille", "La carte d'électeur"],
    a: 0,
    why: "Elle contient les informations administratives nécessaires au remboursement par l'Assurance maladie. Elle n'est pas une pièce d'identité.",
  },
  {
    q: "Qu'est-ce que le médecin traitant ?",
    c: [
      "Le médecin que l'on déclare pour coordonner ses soins et être mieux remboursé",
      "Un médecin de garde imposé par la mairie",
      "Un médecin réservé aux urgences",
      "Un médecin obligatoire pour les enfants uniquement",
    ],
    a: 0,
    why: "Consulter hors du parcours de soins coordonnés réduit le niveau de remboursement.",
  },
  {
    q: "Quel organisme verse les allocations familiales et les aides au logement ?",
    c: ["La CAF (Caisse d'allocations familiales)", "La CPAM", "France Travail", "L'URSSAF"],
    a: 0,
    why: "La CPAM gère l'assurance maladie, l'URSSAF les cotisations sociales, France Travail l'emploi.",
  },
  {
    q: "Que permet la Complémentaire santé solidaire ?",
    c: [
      "Bénéficier d'une complémentaire santé gratuite ou à faible coût selon ses ressources",
      "Obtenir un logement social",
      "Être exonéré d'impôts",
      "Bénéficier d'une retraite anticipée",
    ],
    a: 0,
    why: "Elle a remplacé la CMU-C et l'ACS. La demande se fait auprès de la caisse d'assurance maladie.",
  },
  {
    q: "Combien de vaccins sont obligatoires pour les enfants nés depuis 2018 ?",
    c: ["11", "3", "5", "Aucun"],
    a: 0,
    why: "Ces vaccinations conditionnent l'admission en collectivité (crèche, école). Elles protègent l'enfant et la collectivité.",
  },
  {
    q: "Que faut-il faire en cas d'urgence médicale grave ?",
    c: ["Appeler le 15 ou le 112", "Se rendre en mairie", "Appeler son employeur", "Attendre l'ouverture du cabinet médical"],
    a: 0,
    why: "Le 15 (SAMU) et le 112 (numéro européen) sont gratuits et joignables 24h/24.",
  },
  {
    q: "L'accès aux soins d'urgence à l'hôpital public :",
    c: [
      "est garanti à toute personne, quelle que soit sa situation",
      "est réservé aux assurés sociaux",
      "nécessite une autorisation préalable",
      "est payant d'avance dans tous les cas",
    ],
    a: 0,
    why: "L'égalité d'accès au service public de la santé s'applique à tous. Des dispositifs comme l'aide médicale de l'État existent pour les personnes sans couverture.",
  },
  {
    q: "Qu'est-ce que le RSA ?",
    c: [
      "Un revenu minimum versé sous conditions aux personnes sans ressources suffisantes",
      "Une allocation chômage",
      "Une pension de retraite",
      "Une aide au permis de conduire",
    ],
    a: 0,
    why: "Le revenu de solidarité active est versé par la CAF ou la MSA, avec un accompagnement vers l'emploi.",
  },
  {
    q: "À quel âge peut-on partir à la retraite à taux plein sans condition de durée de cotisation ?",
    c: [
      "À 67 ans",
      "À 60 ans",
      "À 55 ans",
      "Il n'existe aucun âge de ce type",
    ],
    a: 0,
    why: "L'âge légal minimum de départ augmente progressivement vers 64 ans, mais le taux plein automatique reste fixé à 67 ans.",
  },
];

const ecole = [
  {
    q: "L'école publique en France est :",
    c: ["gratuite, laïque et obligatoire", "payante à partir du collège", "réservée aux enfants français", "facultative"],
    a: 0,
    why: "L'instruction est obligatoire de 3 à 16 ans pour tous les enfants résidant en France, quelle que soit leur nationalité.",
  },
  {
    q: "Quel est l'ordre des établissements scolaires en France ?",
    c: [
      "École maternelle, école élémentaire, collège, lycée",
      "Collège, école élémentaire, lycée, université",
      "École élémentaire, lycée, collège, université",
      "Maternelle, collège, école élémentaire, lycée",
    ],
    a: 0,
    why: "Le collège comprend les classes de la 6e à la 3e, le lycée de la seconde à la terminale.",
  },
  {
    q: "Quel diplôme est délivré à la fin du collège ?",
    c: ["Le diplôme national du brevet", "Le baccalauréat", "Le CAP", "La licence"],
    a: 0,
    why: "Le baccalauréat clôt le lycée et ouvre l'accès à l'enseignement supérieur.",
  },
  {
    q: "Qui finance et entretient les écoles primaires publiques ?",
    c: ["La commune", "La région", "L'État seul", "Les parents d'élèves"],
    a: 0,
    why: "Les communes gèrent les écoles, les départements les collèges, les régions les lycées ; l'État rémunère les enseignants et fixe les programmes.",
  },
  {
    q: "Les parents d'élèves peuvent-ils participer à la vie de l'école ?",
    c: [
      "Oui, notamment en élisant des représentants au conseil d'école ou d'administration",
      "Non, l'école est réservée aux enseignants",
      "Oui, uniquement s'ils sont français",
      "Oui, uniquement s'ils paient une cotisation",
    ],
    a: 0,
    why: "Des élections de représentants de parents ont lieu chaque année dans tous les établissements.",
  },
  {
    q: "Un enfant handicapé a-t-il le droit d'être scolarisé en milieu ordinaire ?",
    c: [
      "Oui, la loi du 11 février 2005 garantit son inscription et un accompagnement adapté",
      "Non, il doit aller dans un établissement spécialisé",
      "Oui, mais uniquement à l'école maternelle",
      "Cela dépend de la décision du directeur",
    ],
    a: 0,
    why: "La MDPH (maison départementale des personnes handicapées) évalue les besoins et peut attribuer un accompagnant d'élève en situation de handicap.",
  },
  {
    q: "Existe-t-il des aides financières pour la scolarité des enfants ?",
    c: [
      "Oui, notamment l'allocation de rentrée scolaire et les bourses",
      "Non, aucune aide n'existe",
      "Oui, mais réservées aux familles nombreuses",
      "Oui, versées uniquement par les communes",
    ],
    a: 0,
    why: "L'allocation de rentrée scolaire est versée par la CAF sous conditions de ressources ; des bourses existent au collège et au lycée.",
  },
  {
    q: "L'apprentissage de la langue française pour les adultes étrangers :",
    c: [
      "est proposé notamment dans le cadre du contrat d'intégration républicaine (CIR) signé avec l'OFII",
      "n'existe pas en France",
      "est réservé aux étudiants",
      "est uniquement payant",
    ],
    a: 0,
    why: "Le CIR prévoit une formation civique et, si besoin, une formation linguistique, gratuites.",
  },
];

const travail = [
  {
    q: "Qu'est-ce que le SMIC ?",
    c: [
      "Le salaire minimum légal en dessous duquel un employeur ne peut pas rémunérer un salarié",
      "Une prime de fin d'année",
      "Un impôt sur les salaires",
      "Le salaire moyen des Français",
    ],
    a: 0,
    why: "Le salaire minimum interprofessionnel de croissance est revalorisé au moins une fois par an.",
  },
  {
    q: "Quelle est la durée légale du travail à temps plein en France ?",
    c: ["35 heures par semaine", "39 heures par semaine", "40 heures par semaine", "30 heures par semaine"],
    a: 0,
    why: "Au-delà, les heures supplémentaires sont majorées. Des accords collectifs peuvent aménager cette durée.",
  },
  {
    q: "Combien de semaines de congés payés un salarié à temps plein acquiert-il par an ?",
    c: ["5 semaines", "4 semaines", "3 semaines", "6 semaines"],
    a: 0,
    why: "Soit 2,5 jours ouvrables par mois de travail effectif. Les congés payés datent de 1936 et sont passés à cinq semaines en 1982.",
  },
  {
    q: "Quelle est la différence principale entre un CDI et un CDD ?",
    c: [
      "Le CDI est à durée indéterminée, le CDD a une date de fin",
      "Le CDI est réservé aux cadres",
      "Le CDD ne donne droit à aucun salaire minimum",
      "Le CDI ne peut jamais être rompu",
    ],
    a: 0,
    why: "Le CDD ne peut être conclu que dans les cas prévus par la loi (remplacement, accroissement temporaire d'activité, emploi saisonnier).",
  },
  {
    q: "Quelle juridiction règle les litiges entre un salarié et son employeur ?",
    c: ["Le conseil de prud'hommes", "Le tribunal administratif", "La cour d'assises", "Le tribunal de commerce"],
    a: 0,
    why: "Composé de représentants des salariés et des employeurs, il tente d'abord une conciliation.",
  },
  {
    q: "Quel organisme accompagne les demandeurs d'emploi ?",
    c: ["France Travail", "La CAF", "L'URSSAF", "La CPAM"],
    a: 0,
    why: "France Travail a remplacé Pôle emploi le 1er janvier 2024. Il accompagne, forme et verse l'allocation chômage.",
  },
  {
    q: "Les cotisations sociales prélevées sur le salaire servent à financer :",
    c: [
      "la protection sociale : santé, retraite, famille, chômage",
      "les dépenses militaires",
      "l'entretien des routes",
      "le budget des communes",
    ],
    a: 0,
    why: "C'est le mécanisme concret de la solidarité nationale : chacun cotise selon ses moyens et bénéficie selon ses besoins.",
  },
  {
    q: "Un salarié peut-il adhérer au syndicat de son choix ?",
    c: [
      "Oui, la liberté syndicale est garantie et l'employeur ne peut pas le sanctionner pour cela",
      "Non, l'adhésion est décidée par l'employeur",
      "Oui, mais uniquement dans les grandes entreprises",
      "Non, les syndicats sont interdits dans le privé",
    ],
    a: 0,
    why: "Toute discrimination syndicale est interdite et sanctionnée.",
  },
  {
    q: "Qui contrôle l'application du droit du travail dans les entreprises ?",
    c: ["L'inspection du travail", "La police municipale", "La préfecture", "Le maire"],
    a: 0,
    why: "L'inspection du travail peut être saisie gratuitement par un salarié, y compris de manière confidentielle.",
  },
  {
    q: "Pour exercer une activité professionnelle en France, un étranger non européen doit :",
    c: [
      "disposer d'un titre de séjour l'autorisant à travailler",
      "seulement avoir un contrat signé",
      "obtenir l'accord de son maire",
      "être inscrit à l'université",
    ],
    a: 0,
    why: "L'autorisation de travail est liée au titre de séjour. Employer une personne sans autorisation expose l'employeur à de lourdes sanctions.",
  },
];

const quotidien = [
  {
    q: "Où déclare-t-on une naissance ?",
    c: ["À la mairie du lieu de naissance", "À la préfecture", "Au tribunal", "Au commissariat"],
    a: 0,
    why: "La déclaration doit être faite dans les cinq jours ouvrables suivant l'accouchement.",
  },
  {
    q: "Quel site officiel regroupe les démarches administratives en ligne ?",
    c: ["service-public.fr", "impots.com", "administration.org", "demarches.net"],
    a: 0,
    why: "Attention aux sites payants qui imitent les sites officiels : les démarches administratives sont gratuites sur les sites en .gouv.fr.",
  },
  {
    q: "Qu'est-ce qu'une maison France Services ?",
    c: [
      "Un lieu d'accueil de proximité qui aide à réaliser ses démarches administratives",
      "Un service de police",
      "Une agence immobilière publique",
      "Une école de langue",
    ],
    a: 0,
    why: "On y trouve un accompagnement pour la CAF, l'Assurance maladie, France Travail, les impôts ou les titres d'identité.",
  },
  {
    q: "Comment les impôts sur le revenu sont-ils prélevés depuis 2019 ?",
    c: [
      "Par prélèvement à la source, directement sur le salaire ou la pension",
      "Uniquement par chèque en fin d'année",
      "Par prélèvement trimestriel obligatoire en mairie",
      "Ils ne sont plus prélevés",
    ],
    a: 0,
    why: "La déclaration annuelle reste obligatoire : elle permet d'ajuster le montant et d'ouvrir droit à certaines aides.",
  },
  {
    q: "À quoi sert principalement l'impôt ?",
    c: [
      "À financer les services publics : école, santé, sécurité, justice, transports",
      "À rémunérer les élus uniquement",
      "À rembourser les dettes des particuliers",
      "À financer les partis politiques",
    ],
    a: 0,
    why: "L'impôt est le fondement matériel de la solidarité nationale et de l'égalité d'accès aux services publics.",
  },
  {
    q: "Que doit faire un locataire avant de quitter son logement ?",
    c: [
      "Respecter le délai de préavis et prévenir le propriétaire par écrit",
      "Partir sans prévenir",
      "Demander l'autorisation de la mairie",
      "Trouver lui-même un nouveau locataire",
    ],
    a: 0,
    why: "Le préavis est en général de trois mois pour un logement vide, réduit à un mois en zone tendue ou dans certains cas (mutation, perte d'emploi, RSA).",
  },
  {
    q: "Comment demander un logement social ?",
    c: [
      "En déposant une demande de logement social qui donne un numéro unique d'enregistrement",
      "En s'adressant directement au voisin",
      "En payant une caution à la mairie",
      "Ce n'est pas possible pour les étrangers en situation régulière",
    ],
    a: 0,
    why: "La demande se dépose en ligne ou auprès d'un guichet enregistreur ; elle doit être renouvelée chaque année.",
  },
  {
    q: "Que faut-il pour conduire une voiture en France ?",
    c: [
      "Un permis de conduire valide, une assurance et un contrôle technique à jour",
      "Seulement une assurance",
      "Seulement le permis de conduire",
      "Aucun document si le trajet est court",
    ],
    a: 0,
    why: "Conduire sans assurance est un délit. Un permis étranger peut, selon le pays, être échangé contre un permis français dans un délai limité.",
  },
  {
    q: "Le tri des déchets en France :",
    c: [
      "est organisé par les communes et fait partie des gestes civiques attendus",
      "est interdit dans les immeubles",
      "n'existe que dans les grandes villes",
      "est facultatif et sans intérêt écologique",
    ],
    a: 0,
    why: "Les dépôts sauvages sont sanctionnés par des amendes. La Charte de l'environnement de 2004 a valeur constitutionnelle.",
  },
  {
    q: "Que risque-t-on en cas de tapage nocturne ?",
    c: [
      "Une amende, après intervention de la police ou de la gendarmerie",
      "Rien, le bruit n'est pas réglementé",
      "Une expulsion immédiate du logement",
      "Une peine de prison ferme systématique",
    ],
    a: 0,
    why: "Le respect du voisinage fait partie des règles de la vie collective. Le dialogue reste la première solution.",
  },
  {
    q: "Comment obtenir une carte nationale d'identité ?",
    c: [
      "En déposant une demande en mairie équipée, après pré-demande en ligne",
      "En s'adressant au commissariat uniquement",
      "En écrivant au président de la République",
      "Auprès de son employeur",
    ],
    a: 0,
    why: "La carte d'identité est gratuite (sauf en cas de perte). Le passeport, lui, est soumis à un timbre fiscal.",
  },
  {
    q: "Quelle est la première démarche pour scolariser son enfant dans une école publique ?",
    c: [
      "S'inscrire à la mairie de sa commune de résidence",
      "Contacter directement le rectorat",
      "S'adresser à la préfecture",
      "Attendre une convocation de l'école",
    ],
    a: 0,
    why: "La mairie délivre un certificat d'inscription, puis le directeur procède à l'admission de l'élève.",
  },
  {
    q: "Le bénévolat associatif en France :",
    c: [
      "est libre et non rémunéré, et constitue une forme d'engagement citoyen",
      "est obligatoire pour les nouveaux citoyens",
      "est réservé aux retraités",
      "donne droit à un salaire minimum",
    ],
    a: 0,
    why: "Plus d'un Français sur cinq est bénévole dans une association : c'est une expression concrète de la fraternité.",
  },
  {
    q: "Que signifie le principe de continuité du service public ?",
    c: [
      "Les services publics doivent fonctionner de façon régulière et sans interruption injustifiée",
      "Les services publics sont ouverts jour et nuit",
      "Les agents ne peuvent jamais faire grève",
      "Les services publics sont gratuits",
    ],
    a: 0,
    why: "C'est ce principe qui justifie le service minimum dans certains secteurs, comme les transports ou les hôpitaux.",
  },
  {
    q: "Un usager mécontent d'un service public peut :",
    c: [
      "déposer une réclamation, saisir un médiateur ou le Défenseur des droits",
      "refuser de payer ses impôts",
      "porter plainte au tribunal de commerce",
      "exiger le licenciement de l'agent",
    ],
    a: 0,
    why: "Le Défenseur des droits est gratuit, indépendant et accessible en ligne ou via des délégués présents dans chaque département.",
  },
  {
    q: "L'ouverture d'un compte bancaire en France :",
    c: [
      "est un droit garanti par la procédure de droit au compte auprès de la Banque de France",
      "est réservée aux citoyens français",
      "nécessite un revenu minimum",
      "se fait obligatoirement en préfecture",
    ],
    a: 0,
    why: "En cas de refus, la banque doit remettre une attestation permettant de saisir la Banque de France.",
  },
  {
    q: "Quel organisme accompagne les étrangers primo-arrivants dans leur parcours d'intégration ?",
    c: ["L'OFII", "L'OFPRA", "La CAF", "L'URSSAF"],
    a: 0,
    why: "L'Office français de l'immigration et de l'intégration organise le contrat d'intégration républicaine. L'OFPRA, lui, instruit les demandes d'asile.",
  },
];

const mk = (arr, sub, prefix) =>
  arr.map((o, i) => ({ ...o, id: `${prefix}${String(i + 1).padStart(2, '0')}`, theme: T, type: K, sub }));

export default [
  ...mk(sante, 'sante-social', 'san'),
  ...mk(ecole, 'ecole', 'eco'),
  ...mk(travail, 'travail', 'tra'),
  ...mk(quotidien, 'quotidien', 'quo'),
];
