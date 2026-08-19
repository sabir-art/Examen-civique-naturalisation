/**
 * Thème 3 — Droits et devoirs (questions de connaissances).
 * 5 des 40 questions de l'examen sont des questions de connaissances sur ce
 * thème ; 6 autres sont des mises en situation (fichier q-droits-situations.js).
 */

const T = 'droits-devoirs';
const K = 'connaissance';

const droits = [
  {
    q: "Quel texte de 1789 énonce les droits fondamentaux des citoyens français ?",
    c: ["La Déclaration des droits de l'homme et du citoyen", "Le Code civil", "La Charte de l'environnement", "Le préambule de la Constitution du 27 octobre 1946"],
    a: 0,
    why: "Adoptée le 26 août 1789, elle fait partie du « bloc de constitutionnalité » : elle a aujourd'hui valeur constitutionnelle.",
  },
  {
    q: "Que proclame l'article 1er de la Déclaration des droits de l'homme et du citoyen de 1789 ?",
    c: ["« Les hommes naissent et demeurent libres et égaux en droits »", "« La propriété est un droit inviolable et sacré de la Nation »", "« Nul n'est censé ignorer la loi »", "« La France est une République indivisible »"],
    a: 0,
    why: "Il ajoute que « les distinctions sociales ne peuvent être fondées que sur l'utilité commune ».",
  },
  {
    q: "Quels textes composent le « bloc de constitutionnalité » ?",
    c: ["La Constitution de 1958, la Déclaration de 1789, le préambule de 1946 et la Charte de 2004", "La Constitution de 1958 seule, à l'exclusion de tout autre texte plus ancien", "Le Code civil et le Code pénal, qui rassemblent l'ensemble des règles", "Les traités européens signés et ratifiés par la France"],
    a: 0,
    why: "Ces textes ont tous valeur constitutionnelle et s'imposent au législateur.",
  },
  {
    q: "En quelle année la peine de mort a-t-elle été abolie en France ?",
    c: ["1981", "1974", "1945", "2007"],
    a: 0,
    why: "La loi du 9 octobre 1981 est portée par Robert Badinter, garde des Sceaux. L'abolition est inscrite dans la Constitution en 2007.",
  },
  {
    q: "Qui a porté la loi abolissant la peine de mort en France ?",
    c: ["Robert Badinter", "Simone Veil", "Jules Ferry", "Victor Schœlcher"],
    a: 0,
    why: "Robert Badinter, ministre de la Justice de François Mitterrand, est entré au Panthéon en octobre 2025.",
  },
  {
    q: "Quelle loi de 1975 a autorisé l'interruption volontaire de grossesse ?",
    c: ["La loi Veil", "La loi Neuwirth", "La loi Badinter", "La loi Ferry"],
    a: 0,
    why: "Portée par Simone Veil, ministre de la Santé. En mars 2024, la liberté de recourir à l'IVG a été inscrite dans la Constitution.",
  },
  {
    q: "Depuis quand le mariage entre personnes de même sexe est-il autorisé en France ?",
    c: ["2013", "1999", "2005", "2021"],
    a: 0,
    why: "La loi du 17 mai 2013 ouvre le mariage et l'adoption aux couples de même sexe. Le PACS, lui, existe depuis 1999.",
  },
  {
    q: "Qu'est-ce que le PACS ?",
    c: ["Un contrat d'union civile entre deux personnes majeures", "Un contrat de travail particulier réservé aux couples", "Une aide au logement", "Un régime de retraite"],
    a: 0,
    why: "Le pacte civil de solidarité, créé en 1999, organise la vie commune. Il est ouvert aux couples de même sexe comme de sexe différent.",
  },
  {
    q: "Quelle liberté est garantie par l'article 11 de la Déclaration de 1789 ?",
    c: ["La libre communication des pensées et des opinions", "Le droit de grève dans les services publics", "Le droit à la santé", "Le droit au logement"],
    a: 0,
    why: "C'est le fondement de la liberté d'expression et de la liberté de la presse, précisée par la loi du 29 juillet 1881.",
  },
  {
    q: "La liberté d'expression permet-elle de tout dire ?",
    c: ["Non : injure, diffamation, incitation à la haine et apologie du terrorisme sont punies", "Non, il faut une autorisation préfectorale pour s'exprimer publiquement en France", "Oui, sans aucune limite : c'est une liberté fondamentale", "Oui, sauf à la télévision et à la radio publiques"],
    a: 0,
    why: "La liberté s'exerce sous réserve d'en répondre en cas d'abus. Les limites sont fixées par la loi, notamment celle de 1881 sur la presse.",
  },
  {
    q: "Quelle loi de 1901 garantit la liberté d'association ?",
    c: [
      "La loi du 1er juillet 1901",
      "La loi du 9 décembre 1905",
      "La loi du 29 juillet 1881",
      "La loi du 11 février 2005",
    ],
    a: 0,
    why: "Créer une association est libre : il suffit d'une déclaration en préfecture pour obtenir la personnalité juridique.",
  },
  {
    q: "Le droit de grève en France est :",
    c: ["un droit reconnu par le préambule de la Constitution de 1946", "interdit dans le secteur privé", "réservé aux syndicats", "soumis à l'autorisation préalable de l'employeur concerné"],
    a: 0,
    why: "Il s'exerce « dans le cadre des lois qui le réglementent » : préavis dans le service public, service minimum dans certains secteurs.",
  },
  {
    q: "Qu'est-ce que la présomption d'innocence ?",
    c: ["Toute personne est innocente tant qu'un tribunal n'a pas établi sa culpabilité", "Un accusé ne peut jamais être placé en détention avant son procès", "Le juge doit croire l'accusé sur parole jusqu'au jugement", "L'accusé doit apporter lui-même la preuve de son innocence"],
    a: 0,
    why: "C'est l'article 9 de la Déclaration de 1789. La charge de la preuve pèse sur l'accusation.",
  },
  {
    q: "Toute personne mise en cause a le droit :",
    c: ["d'être assistée par un avocat et d'être jugée équitablement", "de refuser de comparaître devant un tribunal", "de choisir elle-même le juge qui examinera son affaire", "de connaître à l'avance la décision du tribunal"],
    a: 0,
    why: "Si la personne n'a pas les moyens de payer un avocat, elle peut bénéficier de l'aide juridictionnelle.",
  },
  {
    q: "Quelle est la durée initiale d'une garde à vue de droit commun ?",
    c: ["24 heures, renouvelable une fois", "48 heures, sans renouvellement", "12 heures", "72 heures"],
    a: 0,
    why: "La personne gardée à vue est informée de ses droits : connaître les faits reprochés, se taire, être assistée d'un avocat, faire prévenir un proche et voir un médecin.",
  },
  {
    q: "Combien de critères de discrimination le Code pénal reconnaît-il ?",
    c: ["Plus de vingt critères, dont l'origine, le sexe, la religion, le handicap et l'âge", "Trois critères seulement", "Aucun : la discrimination n'est pas définie précisément par la loi française", "Uniquement l'origine et la religion de la personne concernée"],
    a: 0,
    why: "La discrimination est punie de 3 ans d'emprisonnement et 45 000 € d'amende lorsqu'elle porte sur l'emploi, le logement ou l'accès à un bien ou un service.",
  },
  {
    q: "Quel est le principal devoir financier du citoyen envers la collectivité ?",
    c: [
      "Payer ses impôts et contributions",
      "Verser une cotisation à une association",
      "Financer directement son école de quartier",
      "Acheter des produits français",
    ],
    a: 0,
    why: "L'article 13 de la Déclaration de 1789 prévoit une contribution commune « également répartie entre tous les citoyens, à raison de leurs facultés ».",
  },
  {
    q: "L'instruction est obligatoire en France :",
    c: ["de 3 à 16 ans", "de 6 à 16 ans", "de 3 à 18 ans", "de 6 à 18 ans"],
    a: 0,
    why: "Depuis la rentrée 2019, l'instruction est obligatoire dès 3 ans. Une obligation de formation s'y ajoute jusqu'à 18 ans.",
  },
  {
    q: "À quel âge doit-on se faire recenser à la mairie ?",
    c: ["À 16 ans", "À 18 ans", "À 15 ans", "À 20 ans"],
    a: 0,
    why: "Le recensement citoyen à 16 ans permet d'être convoqué à la Journée défense et citoyenneté et d'être inscrit d'office sur les listes électorales à 18 ans.",
  },
  {
    q: "Qu'est-ce que la Journée défense et citoyenneté (JDC) ?",
    c: ["Une journée d'information obligatoire sur la défense, de 16 à 25 ans", "Un service militaire de dix mois, obligatoire pour tous les jeunes", "Une journée de vote obligatoire pour les nouveaux inscrits", "Un stage en entreprise organisé par l'Éducation nationale"],
    a: 0,
    why: "Le certificat de participation est exigé pour s'inscrire aux examens et concours de l'État, comme le baccalauréat ou le permis de conduire.",
  },
  {
    q: "Le service militaire obligatoire en France :",
    c: [
      "a été suspendu en 1997",
      "existe toujours pour les hommes",
      "dure douze mois",
      "concerne tous les jeunes de 18 ans",
    ],
    a: 0,
    why: "La conscription a été suspendue par la loi du 28 octobre 1997 ; l'armée est devenue professionnelle. La JDC l'a remplacée comme obligation citoyenne.",
  },
  {
    q: "Qui peut être juré d'assises ?",
    c: ["Tout citoyen de plus de 23 ans tiré au sort sur les listes électorales", "Les personnes qui se portent volontaires auprès du tribunal", "Uniquement les juristes et les anciens magistrats", "Les élus locaux désignés par le maire"],
    a: 0,
    why: "Être juré est une obligation civique : refuser sans motif légitime expose à une amende.",
  },
  {
    q: "Que signifie « nul n'est censé ignorer la loi » ?",
    c: ["On ne peut pas invoquer son ignorance de la loi pour y échapper", "Tout le monde doit apprendre le Code civil et le Code pénal par cœur", "Les étrangers ne sont pas soumis à la loi française sur le territoire", "La loi ne s'applique qu'à ceux qui en ont pris connaissance"],
    a: 0,
    why: "Les lois sont publiées au Journal officiel, ce qui les rend opposables à tous.",
  },
  {
    q: "Le droit d'asile en France :",
    c: ["protège les personnes persécutées dans leur pays pour leurs opinions ou leur appartenance", "est accordé à toute personne qui en fait la demande à la frontière française", "est réservé aux ressortissants des États membres de l'Union européenne", "a été supprimé en 2018 par une réforme du droit des étrangers"],
    a: 0,
    why: "Le préambule de 1946 énonce que « tout homme persécuté en raison de son action en faveur de la liberté a droit d'asile ». L'OFPRA instruit les demandes.",
  },
  {
    q: "Quel document est remis lors de la cérémonie d'accueil dans la citoyenneté française ?",
    c: ["La charte des droits et devoirs du citoyen français", "Un passeport diplomatique", "Une carte d'électeur européenne délivrée par la préfecture", "Un livret militaire"],
    a: 0,
    why: "La cérémonie, organisée en préfecture ou en mairie, marque l'entrée dans la citoyenneté française : on y reçoit le décret de naturalisation et la charte.",
  },
  {
    q: "En France, la nationalité peut s'acquérir :",
    c: ["par filiation, par naissance et résidence en France, par mariage ou par naturalisation", "uniquement par la naissance sur le territoire de la République française", "uniquement par décret du président", "uniquement par le mariage"],
    a: 0,
    why: "Le droit français combine le droit du sang (filiation) et le droit du sol (naissance et résidence en France).",
  },
  {
    q: "La liberté de circulation en France signifie que :",
    c: ["chacun peut se déplacer et choisir son lieu de résidence sur le territoire", "il faut une autorisation pour changer de département", "les déplacements sont libres uniquement le week-end", "seuls les citoyens français peuvent se déplacer librement dans le pays"],
    a: 0,
    why: "Cette liberté fondamentale ne peut être restreinte que par la loi, pour des motifs d'ordre public ou de santé publique.",
  },
  {
    q: "Le droit de propriété est :",
    c: ["protégé par la Déclaration de 1789, sauf expropriation indemnisée pour utilité publique", "absolu et sans aucune limite, même en cas de projet reconnu d'intérêt général", "interdit pour les terrains agricoles depuis une loi récente", "réservé aux citoyens français et aux sociétés françaises"],
    a: 0,
    why: "L'article 17 de la Déclaration de 1789 protège la propriété tout en admettant l'expropriation « sous la condition d'une juste et préalable indemnité ».",
  },
  {
    q: "Qu'est-ce que le droit au respect de la vie privée ?",
    c: ["Le droit de protéger son intimité, son image et ses données personnelles", "Le droit de ne pas payer d'impôts", "Le droit de refuser un contrôle d'identité dans la rue", "Le droit de ne pas déclarer son domicile à aucune administration"],
    a: 0,
    why: "L'article 9 du Code civil le consacre. La CNIL veille à la protection des données personnelles.",
  },
  {
    q: "Que doit faire un citoyen témoin d'une personne en danger ?",
    c: ["Lui porter secours ou alerter les services d'urgence", "Attendre l'arrivée spontanée des secours sur place", "Filmer la scène pour témoigner", "S'éloigner pour ne pas gêner"],
    a: 0,
    why: "La non-assistance à personne en danger est un délit puni de 5 ans d'emprisonnement et 75 000 € d'amende.",
  },
  {
    q: "Quel numéro faut-il composer pour joindre le SAMU ?",
    c: ["Le 15", "Le 17", "Le 18", "Le 119"],
    a: 0,
    why: "17 : police-secours ; 18 : pompiers ; 112 : numéro d'urgence européen ; 114 : urgences par SMS pour les personnes sourdes ou malentendantes.",
  },
  {
    q: "Quel est le numéro d'urgence européen, valable dans toute l'Union ?",
    c: ["Le 112", "Le 15", "Le 18", "Le 911"],
    a: 0,
    why: "Le 112 est gratuit et accessible depuis n'importe quel téléphone, même sans crédit ni carte SIM.",
  },
  {
    q: "Quel numéro permet de signaler une situation d'enfance en danger ?",
    c: ["Le 119", "Le 115", "Le 3919", "Le 17"],
    a: 0,
    why: "115 : hébergement d'urgence (Samu social) ; 3919 : violences faites aux femmes ; 119 : enfance en danger.",
  },
  {
    q: "Quel numéro appeler en cas de violences conjugales ?",
    c: ["Le 3919", "Le 119", "Le 115", "Le 116"],
    a: 0,
    why: "Le 3919 est un numéro d'écoute national, anonyme et gratuit. En cas de danger immédiat, il faut composer le 17 ou le 112.",
  },
  {
    q: "Les violences au sein du couple sont :",
    c: [
      "un délit puni par la loi, y compris entre époux",
      "une affaire privée réglée par la famille",
      "punies uniquement en cas de blessures graves",
      "punies seulement si les époux sont divorcés",
    ],
    a: 0,
    why: "Le lien conjugal est une circonstance aggravante. Le viol entre époux est reconnu et puni.",
  },
  {
    q: "L'excision et le mariage forcé sont :",
    c: ["des infractions pénales graves, punies même si elles sont commises à l'étranger", "tolérés s'ils relèvent d'une tradition familiale", "des pratiques autorisées lorsque les deux parents ont donné leur accord", "des affaires relevant du droit du pays d'origine"],
    a: 0,
    why: "Aucune tradition ni religion ne peut justifier une atteinte à l'intégrité de la personne. La loi française s'applique aux victimes résidant en France, même pour des faits commis hors de France.",
  },
  {
    q: "L'autorité parentale est exercée :",
    c: ["en commun par les deux parents, dans l'intérêt de l'enfant", "par le père seul", "par la mère seule jusqu'à la majorité de l'enfant", "par le grand-parent le plus âgé"],
    a: 0,
    why: "En cas de désaccord, le juge aux affaires familiales tranche. Les châtiments corporels sont interdits depuis la loi du 10 juillet 2019.",
  },
  {
    q: "Quelle est la valeur de la Charte de l'environnement de 2004 ?",
    c: ["Elle a valeur constitutionnelle : chacun a droit à un environnement équilibré", "C'est une simple déclaration d'intention, sans portée juridique réelle", "C'est un règlement européen transposé en droit français en 2004", "C'est une loi ordinaire, abrogée depuis par le Parlement"],
    a: 0,
    why: "Adossée à la Constitution en 2005, elle consacre notamment le principe de précaution.",
  },
  {
    q: "Le respect des lois de la République :",
    c: ["s'impose à toute personne vivant sur le territoire, française ou étrangère", "ne concerne que les citoyens français majeurs et résidents", "peut être écarté au nom d'une conviction religieuse profonde et sincère", "ne s'applique pas aux touristes"],
    a: 0,
    why: "Aucune règle religieuse, coutumière ou familiale ne prévaut sur la loi française.",
  },
  {
    q: "Quel est le rôle de la CNIL ?",
    c: ["Protéger les données personnelles et la vie privée dans le numérique", "Contrôler les comptes de l'État et des collectivités locales", "Juger les litiges du travail", "Attribuer les logements sociaux"],
    a: 0,
    why: "Toute personne peut demander l'accès, la rectification ou l'effacement de ses données et saisir la CNIL en cas de refus.",
  },
  {
    q: "Que garantit le principe d'égalité devant le service public ?",
    c: ["Tous les usagers sont traités de la même manière, sans privilège ni discrimination", "Les services publics sont gratuits pour tous les usagers, sans condition", "Chacun peut choisir l'agent qui le reçoit", "Les usagers prioritaires sont désignés chaque année par le maire"],
    a: 0,
    why: "Les grands principes du service public sont l'égalité, la continuité, la neutralité et l'adaptabilité (ou mutabilité).",
  },
  {
    q: "Un employeur peut-il licencier une salariée parce qu'elle est enceinte ?",
    c: ["Non, la salariée enceinte bénéficie d'une protection particulière", "Oui, s'il la remplace immédiatement", "Oui, pendant la période d'essai uniquement", "Oui, dans les entreprises de moins de vingt salariés seulement"],
    a: 0,
    why: "Le licenciement est nul, sauf faute grave sans lien avec la grossesse ou impossibilité de maintenir le contrat pour un motif étranger à celle-ci.",
  },
];

export default droits.map((o, i) => ({
  ...o,
  id: `dro${String(i + 1).padStart(2, '0')}`,
  theme: T,
  type: K,
  sub: i < 30 ? 'droits' : 'devoirs',
}));
