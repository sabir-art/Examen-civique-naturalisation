/**
 * Thème 2 — Système institutionnel et politique.
 * Répartition officielle à l'examen : démocratie et droit de vote (3),
 * organisation de la République française (2), institutions européennes (1).
 */

const T = 'institutions';
const K = 'connaissance';

const vote = [
  {
    q: "À partir de quel âge peut-on voter en France ?",
    c: ["18 ans", "16 ans", "21 ans", "25 ans"],
    a: 0,
    why: "La majorité électorale est fixée à 18 ans depuis 1974. Il faut aussi être de nationalité française, jouir de ses droits civils et politiques et être inscrit sur les listes électorales.",
  },
  {
    q: "Le vote en France est :",
    c: [
      "un droit et un devoir civique, mais il n'est pas obligatoire",
      "obligatoire sous peine d'amende",
      "réservé aux contribuables",
      "obligatoire uniquement pour les élections présidentielles",
    ],
    a: 0,
    why: "Contrairement à la Belgique par exemple, la France ne sanctionne pas l'abstention. Le vote reste présenté comme un devoir civique.",
  },
  {
    q: "Quelles sont les caractéristiques du vote en France ?",
    c: [
      "Universel, égal et secret",
      "Public, censitaire et facultatif",
      "Réservé aux hommes de plus de 21 ans",
      "Proportionnel au montant des impôts payés",
    ],
    a: 0,
    why: "L'article 3 de la Constitution énonce que le suffrage est « toujours universel, égal et secret ». Le passage par l'isoloir garantit le secret du vote.",
  },
  {
    q: "Que faut-il faire pour pouvoir voter ?",
    c: ["Être inscrit sur les listes électorales de sa commune", "Payer une taxe électorale", "Demander l'autorisation du maire", "Avoir effectué son service militaire ou une journée de défense"],
    a: 0,
    why: "L'inscription se fait en mairie ou sur service-public.fr. Les jeunes recensés à 16 ans sont inscrits automatiquement à 18 ans.",
  },
  {
    q: "Depuis quand les femmes ont-elles le droit de vote en France ?",
    c: ["1944", "1789", "1848", "1968"],
    a: 0,
    why: "L'ordonnance du 21 avril 1944 accorde le droit de vote aux femmes. Elles votent pour la première fois aux élections municipales du 29 avril 1945.",
  },
  {
    q: "En quelle année le suffrage universel masculin a-t-il été instauré en France ?",
    c: ["1848", "1789", "1815", "1870"],
    a: 0,
    why: "La IIe République instaure le suffrage universel masculin en 1848, la même année que l'abolition définitive de l'esclavage.",
  },
  {
    q: "Le président de la République est élu :",
    c: [
      "au suffrage universel direct",
      "par le Parlement réuni en Congrès",
      "par les maires de France",
      "au suffrage universel indirect",
    ],
    a: 0,
    why: "C'est le référendum de 1962 qui a instauré l'élection au suffrage universel direct, appliquée pour la première fois en 1965.",
  },
  {
    q: "Pour combien d'années le président de la République est-il élu ?",
    c: ["5 ans", "7 ans", "4 ans", "6 ans"],
    a: 0,
    why: "Le quinquennat a été adopté par référendum en 2000 et appliqué à partir de 2002. Nul ne peut exercer plus de deux mandats consécutifs.",
  },
  {
    q: "Comment se déroule l'élection présidentielle ?",
    c: [
      "Au scrutin majoritaire à deux tours",
      "À la proportionnelle intégrale",
      "En un seul tour",
      "Par tirage au sort parmi les candidats",
    ],
    a: 0,
    why: "Si aucun candidat n'obtient la majorité absolue au premier tour, les deux candidats arrivés en tête s'affrontent au second tour.",
  },
  {
    q: "Qui peut voter aux élections municipales en France ?",
    c: ["Les citoyens français et les citoyens de l'Union européenne résidant dans la commune", "Uniquement les citoyens français inscrits sur les listes de la commune", "Tous les résidents étrangers", "Uniquement les propriétaires d'un logement situé dans la commune"],
    a: 0,
    why: "Le traité de Maastricht (1992) a ouvert le droit de vote aux élections municipales et européennes aux ressortissants de l'Union européenne résidant en France.",
  },
  {
    q: "Un ressortissant de l'Union européenne installé en France peut-il être élu maire ?",
    c: ["Non, il peut être conseiller municipal mais pas maire ni adjoint", "Oui, sans condition", "Oui, après cinq ans de résidence", "Non, il ne peut être ni conseiller municipal, ni maire, ni adjoint"],
    a: 0,
    why: "Le maire et ses adjoints participent à la désignation des sénateurs, ce qui réserve ces fonctions aux citoyens français.",
  },
  {
    q: "Qu'est-ce qu'une procuration électorale ?",
    c: ["La possibilité de faire voter une autre personne à sa place en cas d'absence", "Un bulletin de vote envoyé par courrier à la mairie de sa commune de résidence", "Une autorisation exceptionnelle de voter deux fois le même jour", "Un vote effectué par internet depuis un site officiel"],
    a: 0,
    why: "La procuration s'établit en ligne, en commissariat, en gendarmerie ou au tribunal. Le vote par correspondance n'existe plus pour les élections politiques en France.",
  },
  {
    q: "Que se passe-t-il si l'on vote à la place de quelqu'un sans procuration ?",
    c: [
      "C'est une fraude électorale, punie par la loi",
      "C'est autorisé entre membres d'une même famille",
      "C'est toléré si la personne est malade",
      "C'est autorisé avec sa carte d'électeur",
    ],
    a: 0,
    why: "La fraude électorale est punie d'emprisonnement, d'amende et de la privation des droits civiques.",
  },
  {
    q: "Qu'est-ce qu'un référendum ?",
    c: ["Une consultation où les citoyens répondent par oui ou par non à une question", "Une élection au cours de laquelle les citoyens désignent leurs députés et sénateurs", "Un sondage d'opinion officiel commandé par le Gouvernement", "Un vote réservé aux membres du Parlement réunis"],
    a: 0,
    why: "L'article 11 de la Constitution permet au président de la République de soumettre certains projets de loi au référendum.",
  },
  {
    q: "Qu'est-ce que l'abstention ?",
    c: [
      "Le fait de ne pas aller voter",
      "Le fait de voter blanc",
      "Le fait de voter nul",
      "Le fait de voter pour plusieurs candidats",
    ],
    a: 0,
    why: "Le vote blanc (enveloppe vide ou bulletin sans nom) est décompté séparément depuis 2014, mais n'entre pas dans les suffrages exprimés.",
  },
  {
    q: "Que signifie « démocratie » ?",
    c: ["Le pouvoir appartient au peuple, qui l'exerce par ses représentants ou par référendum", "Le pouvoir appartient à un seul homme, qui l'exerce au nom de la Nation", "Le pouvoir appartient aux plus riches", "Le pouvoir appartient à l'armée"],
    a: 0,
    why: "L'article 3 de la Constitution précise que « la souveraineté nationale appartient au peuple qui l'exerce par ses représentants et par la voie du référendum ».",
  },
  {
    q: "Le pluralisme politique signifie que :",
    c: [
      "plusieurs partis peuvent exister et s'exprimer librement",
      "un seul parti est autorisé",
      "les partis sont interdits",
      "seuls les partis représentés au Parlement peuvent exister",
    ],
    a: 0,
    why: "L'article 4 de la Constitution garantit la libre formation et la libre activité des partis politiques, qui doivent respecter les principes de la souveraineté nationale et de la démocratie.",
  },
  {
    q: "Tous les combien de temps ont lieu les élections municipales ?",
    c: ["Tous les 6 ans", "Tous les 5 ans", "Tous les 4 ans", "Tous les 7 ans"],
    a: 0,
    why: "Le conseil municipal est élu pour six ans, comme les conseils départementaux et régionaux.",
  },
  {
    q: "Pour combien d'années les députés sont-ils élus ?",
    c: ["5 ans", "6 ans", "4 ans", "7 ans"],
    a: 0,
    why: "Les députés sont élus pour cinq ans, sauf dissolution de l'Assemblée nationale par le président de la République.",
  },
  {
    q: "Que se passe-t-il lors d'une dissolution de l'Assemblée nationale ?",
    c: [
      "De nouvelles élections législatives sont organisées",
      "Le président démissionne",
      "Le Sénat prend les décisions à sa place",
      "Le gouvernement est automatiquement renversé",
    ],
    a: 0,
    why: "La dissolution est un pouvoir propre du président de la République (article 12). Les élections ont lieu entre vingt et quarante jours après.",
  },
  {
    q: "Qu'est-ce que la carte d'électeur ?",
    c: [
      "Un document qui atteste de l'inscription sur les listes électorales",
      "Une pièce d'identité officielle",
      "Un titre de séjour",
      "Un document obligatoire pour voter, sans lequel le vote est impossible",
    ],
    a: 0,
    why: "En pratique, c'est la pièce d'identité qui est exigée dans les communes de 1 000 habitants et plus ; la carte d'électeur facilite le repérage du bureau de vote.",
  },
  {
    q: "Le vote a lieu :",
    c: ["dans un bureau de vote, après passage par l'isoloir", "au domicile de l'électeur, devant un agent de la mairie", "par téléphone", "à la préfecture uniquement"],
    a: 0,
    why: "Le passage par l'isoloir est obligatoire : il garantit le secret du vote. L'électeur signe ensuite la liste d'émargement.",
  },
  {
    q: "Qui organise et contrôle le bon déroulement de l'élection présidentielle ?",
    c: ["Le Conseil constitutionnel, qui veille au scrutin et proclame les résultats", "Le Sénat, qui vérifie les procès-verbaux transmis par toutes les préfectures", "Le Conseil d'État, qui tranche les recours déposés par les candidats", "Le ministère de la Justice, qui centralise les résultats"],
    a: 0,
    why: "Le Conseil constitutionnel est aussi le juge des élections législatives et sénatoriales.",
  },
  {
    q: "En France, les élections européennes se déroulent :",
    c: [
      "à la proportionnelle, tous les cinq ans",
      "au scrutin majoritaire à deux tours",
      "tous les sept ans",
      "par désignation des députés nationaux",
    ],
    a: 0,
    why: "Les représentants français au Parlement européen sont élus pour cinq ans au scrutin de liste à la représentation proportionnelle.",
  },
];

const organisation = [
  {
    q: "Quelle est la date de la Constitution de la Ve République ?",
    c: ["Le 4 octobre 1958", "Le 14 juillet 1958", "Le 27 octobre 1946", "Le 26 août 1789"],
    a: 0,
    why: "Adoptée par référendum le 28 septembre 1958, elle est promulguée le 4 octobre 1958.",
  },
  {
    q: "Quels sont les trois pouvoirs séparés dans une démocratie ?",
    c: [
      "Exécutif, législatif et judiciaire",
      "Militaire, religieux et civil",
      "National, régional et local",
      "Économique, social et culturel",
    ],
    a: 0,
    why: "La séparation des pouvoirs, théorisée par Montesquieu, évite la concentration du pouvoir entre les mêmes mains.",
  },
  {
    q: "Qui détient le pouvoir exécutif en France ?",
    c: ["Le président de la République et le Gouvernement", "Le Parlement, c'est-à-dire les députés et les sénateurs", "Les tribunaux", "Le Conseil constitutionnel"],
    a: 0,
    why: "Le président nomme le Premier ministre, qui dirige l'action du Gouvernement ; celui-ci détermine et conduit la politique de la Nation.",
  },
  {
    q: "Qui vote la loi ?",
    c: ["Le Parlement", "Le président de la République", "Le Conseil constitutionnel", "Le Conseil d'État"],
    a: 0,
    why: "Le Parlement est composé de l'Assemblée nationale et du Sénat. Il vote la loi, contrôle le Gouvernement et évalue les politiques publiques.",
  },
  {
    q: "De quelles assemblées le Parlement français est-il composé ?",
    c: [
      "L'Assemblée nationale et le Sénat",
      "L'Assemblée nationale et le Conseil constitutionnel",
      "Le Sénat et le Conseil d'État",
      "L'Assemblée nationale seule",
    ],
    a: 0,
    why: "On parle de bicamérisme. En cas de désaccord persistant, l'Assemblée nationale a le dernier mot.",
  },
  {
    q: "Combien y a-t-il de députés à l'Assemblée nationale ?",
    c: ["577", "348", "500", "925"],
    a: 0,
    why: "Les 577 députés sont élus au scrutin uninominal majoritaire à deux tours, dans autant de circonscriptions.",
  },
  {
    q: "Combien y a-t-il de sénateurs ?",
    c: ["348", "577", "300", "450"],
    a: 0,
    why: "Les sénateurs sont élus pour six ans au suffrage universel indirect par de grands électeurs (élus locaux). Le Sénat est renouvelé par moitié tous les trois ans.",
  },
  {
    q: "Où siège l'Assemblée nationale ?",
    c: ["Au Palais Bourbon", "Au Palais du Luxembourg", "À l'Élysée", "À Matignon"],
    a: 0,
    why: "Le Sénat siège au Palais du Luxembourg, le président de la République à l'Élysée et le Premier ministre à Matignon.",
  },
  {
    q: "Où siège le Sénat ?",
    c: ["Au Palais du Luxembourg", "Au Palais Bourbon, à Paris", "Au Palais-Royal", "À l'Hôtel de Ville"],
    a: 0,
    why: "Le Palais du Luxembourg, à Paris, accueille le Sénat depuis 1799.",
  },
  {
    q: "Quelle est la résidence officielle du président de la République ?",
    c: ["Le palais de l'Élysée", "L'hôtel de Matignon", "Le château de Versailles", "Le Palais Bourbon"],
    a: 0,
    why: "L'hôtel de Matignon est la résidence du Premier ministre.",
  },
  {
    q: "Qui nomme le Premier ministre ?",
    c: [
      "Le président de la République",
      "L'Assemblée nationale par un vote",
      "Le Sénat",
      "Le Conseil constitutionnel",
    ],
    a: 0,
    why: "Le président nomme le Premier ministre, mais celui-ci doit disposer de la confiance de l'Assemblée nationale, qui peut le renverser par une motion de censure.",
  },
  {
    q: "Qui est le chef des armées ?",
    c: ["Le président de la République", "Le Premier ministre", "Le ministre de la Défense", "Le chef d'état-major"],
    a: 0,
    why: "L'article 15 de la Constitution fait du président de la République le chef des armées ; il préside les conseils et comités supérieurs de la défense nationale.",
  },
  {
    q: "Qui préside le Conseil des ministres ?",
    c: ["Le président de la République", "Le Premier ministre", "Le président du Sénat", "Le ministre de l'Intérieur"],
    a: 0,
    why: "Le Conseil des ministres se réunit en principe chaque mercredi à l'Élysée.",
  },
  {
    q: "Qui est le président de la République française depuis 2017 ?",
    c: ["Emmanuel Macron", "François Hollande", "Nicolas Sarkozy", "Jacques Chirac"],
    a: 0,
    why: "Élu en mai 2017 puis réélu en avril 2022, son mandat s'achève en 2027. (Information à jour en 2026 : vérifiez l'actualité avant l'examen.)",
  },
  {
    q: "Qui a été le premier président de la Ve République ?",
    c: ["Charles de Gaulle", "Georges Pompidou", "Vincent Auriol", "René Coty"],
    a: 0,
    why: "Charles de Gaulle est président de 1959 à 1969. René Coty était le dernier président de la IVe République.",
  },
  {
    q: "Que peut faire le président de la République en cas de désaccord avec l'Assemblée nationale ?",
    c: ["La dissoudre et provoquer de nouvelles élections", "La supprimer définitivement jusqu'aux élections suivantes", "Nommer lui-même les députés", "Suspendre la Constitution"],
    a: 0,
    why: "La dissolution est prévue à l'article 12. Une nouvelle dissolution est impossible dans l'année qui suit les élections qui en résultent.",
  },
  {
    q: "Qu'est-ce qu'une motion de censure ?",
    c: ["Un vote de l'Assemblée nationale qui peut renverser le Gouvernement", "Une sanction contre un député", "Une décision du Conseil constitutionnel censurant une loi votée", "Un veto du président de la République"],
    a: 0,
    why: "Si elle est adoptée à la majorité absolue des députés, le Premier ministre doit remettre la démission du Gouvernement.",
  },
  {
    q: "Quel est le rôle du Conseil constitutionnel ?",
    c: ["Vérifier que les lois sont conformes à la Constitution", "Juger les crimes les plus graves commis dans le pays", "Rédiger les lois", "Nommer les ministres"],
    a: 0,
    why: "Il comprend neuf membres nommés pour neuf ans non renouvelables, plus les anciens présidents de la République. Depuis 2010, tout justiciable peut le saisir par une question prioritaire de constitutionnalité (QPC).",
  },
  {
    q: "Quelle est la juridiction la plus élevée de l'ordre judiciaire ?",
    c: ["La Cour de cassation", "Le Conseil d'État", "Le Conseil constitutionnel", "La Cour des comptes"],
    a: 0,
    why: "La Cour de cassation ne rejuge pas les faits : elle vérifie que le droit a été correctement appliqué. Le Conseil d'État est le sommet de l'ordre administratif.",
  },
  {
    q: "Qui juge les litiges entre un citoyen et l'administration ?",
    c: [
      "Le tribunal administratif",
      "Le tribunal judiciaire",
      "Le conseil de prud'hommes",
      "La cour d'assises",
    ],
    a: 0,
    why: "L'ordre administratif comprend les tribunaux administratifs, les cours administratives d'appel et le Conseil d'État.",
  },
  {
    q: "Combien y a-t-il de départements en France ?",
    c: ["101", "96", "83", "110"],
    a: 0,
    why: "96 départements en métropole et 5 départements et régions d'outre-mer : Guadeloupe, Martinique, Guyane, La Réunion et Mayotte.",
  },
  {
    q: "Combien y a-t-il de régions en France ?",
    c: ["18, dont 13 en métropole", "22, dont 17 en métropole", "13, toutes en métropole", "27"],
    a: 0,
    why: "La réforme de 2016 a réduit le nombre de régions métropolitaines de 22 à 13, auxquelles s'ajoutent les 5 régions d'outre-mer.",
  },
  {
    q: "Comment le maire est-il désigné ?",
    c: ["Il est élu par le conseil municipal, lui-même élu par les habitants", "Il est nommé par le préfet", "Il est élu directement par les habitants", "Il est désigné par le président de la République sur avis du préfet"],
    a: 0,
    why: "Les électeurs élisent les conseillers municipaux pour six ans ; ceux-ci élisent ensuite le maire lors de la première réunion du conseil.",
  },
  {
    q: "Quel est le rôle du maire en tant qu'officier d'état civil ?",
    c: ["Célébrer les mariages et enregistrer les naissances et les décès", "Juger les petits délits", "Délivrer les titres de séjour", "Fixer le montant des impôts nationaux payés par les habitants"],
    a: 0,
    why: "Le maire est à la fois élu de la commune et agent de l'État : à ce titre, il tient l'état civil et exerce des pouvoirs de police municipale.",
  },
  {
    q: "Qui représente l'État dans le département ?",
    c: ["Le préfet", "Le maire", "Le président du conseil départemental", "Le député"],
    a: 0,
    why: "Le préfet est nommé par décret du président de la République en Conseil des ministres. Il dirige les services de l'État dans le département.",
  },
  {
    q: "Quelle collectivité gère principalement les collèges ?",
    c: ["Le département", "La région", "La commune", "L'État seul, sans les collectivités"],
    a: 0,
    why: "Les communes gèrent les écoles primaires, les départements les collèges, les régions les lycées. Les enseignants restent des agents de l'État.",
  },
  {
    q: "Quelle collectivité gère les lycées ?",
    c: ["La région", "Le département", "La commune", "L'intercommunalité"],
    a: 0,
    why: "La région intervient aussi sur les transports régionaux, la formation professionnelle et le développement économique.",
  },
  {
    q: "Combien y a-t-il environ de communes en France ?",
    c: ["Environ 35 000", "Environ 5 000", "Environ 100 000", "Environ 500"],
    a: 0,
    why: "La France compte près de 35 000 communes, de loin le nombre le plus élevé de l'Union européenne.",
  },
  {
    q: "Comment s'appelle la réunion du Parlement pour réviser la Constitution ?",
    c: ["Le Congrès, réuni à Versailles", "La Convention", "Le Sénat élargi", "L'Assemblée constituante, réunie à Paris"],
    a: 0,
    why: "La révision doit être approuvée par référendum ou, pour un projet, par le Congrès à la majorité des trois cinquièmes.",
  },
  {
    q: "Quel est le rôle du Défenseur des droits ?",
    c: ["Défendre les personnes dont les droits ne sont pas respectés par une administration", "Juger les affaires pénales dans lesquelles l'État lui-même est mis en cause", "Contrôler les dépenses de l'État et des collectivités territoriales", "Rédiger la loi et la proposer au vote du Parlement"],
    a: 0,
    why: "C'est une autorité indépendante que l'on peut saisir gratuitement, notamment en cas de discrimination ou de difficulté avec un service public.",
  },
];

const europe = [
  {
    q: "Combien d'États membres compte l'Union européenne ?",
    c: ["27", "28", "25", "30"],
    a: 0,
    why: "L'Union est passée de 28 à 27 membres après le retrait du Royaume-Uni, effectif le 31 janvier 2020 (Brexit).",
  },
  {
    q: "La France est-elle un membre fondateur de la construction européenne ?",
    c: ["Oui, dès la CECA en 1951 et le traité de Rome en 1957", "Non, la France a adhéré en 1973, avec le Royaume-Uni", "Non, elle a adhéré en 1986", "Oui, mais seulement depuis 1992"],
    a: 0,
    why: "Les six pays fondateurs sont la France, l'Allemagne, l'Italie, la Belgique, les Pays-Bas et le Luxembourg.",
  },
  {
    q: "Quelle est la monnaie de la France ?",
    c: ["L'euro", "Le franc", "Le nouveau franc", "L'écu"],
    a: 0,
    why: "L'euro est introduit en 1999 comme monnaie de compte ; les pièces et billets circulent depuis le 1er janvier 2002.",
  },
  {
    q: "Depuis quand les pièces et billets en euros circulent-ils en France ?",
    c: ["Depuis le 1er janvier 2002", "Depuis le 1er janvier 1999", "Depuis 1995", "Depuis 2010"],
    a: 0,
    why: "L'euro a remplacé le franc, dont le taux de conversion était fixé à 6,55957 francs pour un euro.",
  },
  {
    q: "Tous les pays de l'Union européenne utilisent-ils l'euro ?",
    c: ["Non, seuls les États de la zone euro l'utilisent", "Oui, son usage est obligatoire pour tous les États membres", "Non, aucun pays de l'Est ne l'utilise", "Oui, depuis 2002"],
    a: 0,
    why: "La zone euro compte 21 États depuis l'entrée de la Bulgarie le 1er janvier 2026. Des pays comme la Pologne, la Suède, la Tchéquie, la Hongrie ou le Danemark conservent leur monnaie.",
  },
  {
    q: "Que représente le drapeau européen ?",
    c: ["Douze étoiles d'or en cercle sur fond bleu, symbole d'unité et de perfection", "Une étoile d'or par État membre, disposées en cercle sur fond bleu", "Vingt-sept étoiles sur fond bleu", "Trois bandes bleu, blanc, jaune"],
    a: 0,
    why: "Le nombre douze est invariable : il symbolise la perfection et l'unité, et non le nombre d'États membres.",
  },
  {
    q: "Quel est l'hymne européen ?",
    c: ["L'Ode à la joie, extraite de la 9e symphonie de Beethoven", "La Marseillaise, jouée dans une version sans paroles", "L'Hymne à l'amour", "Le Boléro de Ravel"],
    a: 0,
    why: "Adopté en 1985, il est joué sans paroles pour ne privilégier aucune langue.",
  },
  {
    q: "Quelle est la devise de l'Union européenne ?",
    c: ["« Unie dans la diversité »", "« Liberté, Égalité, Fraternité »", "« Paix et prospérité »", "« Un pour tous, tous pour un »"],
    a: 0,
    why: "Cette devise, adoptée en 2000, signifie que les Européens s'unissent pour la paix et la prospérité tout en gardant leurs cultures et leurs langues.",
  },
  {
    q: "Quelle est la date de la journée de l'Europe ?",
    c: ["Le 9 mai", "Le 1er mai", "Le 8 mai", "Le 14 juillet"],
    a: 0,
    why: "Elle commémore la déclaration de Robert Schuman du 9 mai 1950, considérée comme l'acte de naissance de la construction européenne.",
  },
  {
    q: "Où siège le Parlement européen ?",
    c: ["À Strasbourg pour les sessions plénières", "À Paris", "À Bruxelles uniquement, avec la Commission", "À Luxembourg uniquement"],
    a: 0,
    why: "Le Parlement européen tient ses sessions plénières à Strasbourg ; il travaille aussi à Bruxelles et son secrétariat est à Luxembourg.",
  },
  {
    q: "Depuis quand les députés européens sont-ils élus au suffrage universel direct ?",
    c: ["Depuis 1979", "Depuis 1957", "Depuis 1992", "Depuis 2004"],
    a: 0,
    why: "Simone Veil a été la première présidente du Parlement européen élu au suffrage universel direct, en 1979.",
  },
  {
    q: "Combien de députés la France envoie-t-elle au Parlement européen ?",
    c: ["81", "74", "96", "50"],
    a: 0,
    why: "Le Parlement européen compte 720 députés depuis les élections de juin 2024 ; la France en élit 81.",
  },
  {
    q: "Où siège la Commission européenne ?",
    c: ["À Bruxelles", "À Strasbourg", "À Francfort", "À La Haye"],
    a: 0,
    why: "La Commission propose les textes et veille à leur application ; la Banque centrale européenne, elle, siège à Francfort.",
  },
  {
    q: "Qu'est-ce que l'espace Schengen ?",
    c: ["Un espace de libre circulation sans contrôle aux frontières intérieures", "La zone d'utilisation de l'euro", "L'ensemble des pays membres de l'Union européenne, sans exception", "Une union militaire"],
    a: 0,
    why: "L'espace Schengen ne se confond ni avec l'Union européenne ni avec la zone euro : certains pays non membres de l'UE en font partie.",
  },
  {
    q: "Que permet la citoyenneté européenne ?",
    c: ["Circuler, résider et travailler dans un autre État membre, et y voter aux municipales", "Obtenir automatiquement la nationalité de tout autre État membre de l'Union", "Être dispensé de titre de séjour dans le monde entier, hors de l'Union", "Payer ses impôts dans le pays de son choix parmi les États membres"],
    a: 0,
    why: "Instituée par le traité de Maastricht en 1992, elle s'ajoute à la nationalité d'un État membre sans la remplacer.",
  },
  {
    q: "Quel traité a créé l'Union européenne et la citoyenneté européenne ?",
    c: ["Le traité de Maastricht (1992)", "Le traité de Rome (1957)", "Le traité de Lisbonne (2007)", "Le traité de Paris (1951)"],
    a: 0,
    why: "Les Français l'ont approuvé par référendum le 20 septembre 1992.",
  },
  {
    q: "Le Conseil de l'Europe est-il une institution de l'Union européenne ?",
    c: ["Non, c'est une organisation distincte, à Strasbourg, qui protège les droits de l'homme", "Oui, c'est son organe exécutif, chargé de proposer les textes européens aux États", "Oui, c'est son assemblée parlementaire, élue par les citoyens européens", "Non, il siège à Bruxelles et gère la monnaie unique européenne"],
    a: 0,
    why: "Créé en 1949, il réunit une quarantaine d'États et a adopté la Convention européenne des droits de l'homme, appliquée par la Cour européenne des droits de l'homme.",
  },
  {
    q: "Quelle place la France occupe-t-elle à l'Organisation des Nations unies ?",
    c: ["Elle est membre permanent du Conseil de sécurité avec droit de veto", "Elle est simple membre de l'Assemblée générale, sans droit de veto", "Elle en est le siège principal", "Elle n'en fait pas partie"],
    a: 0,
    why: "Les cinq membres permanents sont la France, les États-Unis, le Royaume-Uni, la Russie et la Chine.",
  },
];

const mk = (arr, sub, prefix) =>
  arr.map((o, i) => ({ ...o, id: `${prefix}${String(i + 1).padStart(2, '0')}`, theme: T, type: K, sub }));

export default [
  ...mk(vote, 'democratie-vote', 'vot'),
  ...mk(organisation, 'organisation-republique', 'org'),
  ...mk(europe, 'institutions-europeennes', 'eur'),
];
