/**
 * Thème 1 — Principes et valeurs de la République (questions de connaissances).
 * Sous-thèmes officiels tirés à l'examen : « Devise et symboles » (3 questions)
 * et « Laïcité » (2 questions).
 */

const T = 'principes-valeurs';
const K = 'connaissance';

const symboles = [
  {
    q: "Quelle est la devise de la République française ?",
    c: ["Liberté, Égalité, Fraternité", "Unité, Travail, Justice", "Liberté, Sécurité, Prospérité", "Honneur et Patrie"],
    a: 0,
    why: "« Liberté, Égalité, Fraternité » est inscrite à l'article 2 de la Constitution du 4 octobre 1958. On la retrouve au fronton des mairies, des écoles et des bâtiments publics.",
  },
  {
    q: "Dans quel texte la devise de la République est-elle inscrite ?",
    c: ["Dans l'article 2 de la Constitution", "Dans le Code civil", "Dans le préambule du Code pénal", "Dans aucun texte : c'est une simple tradition"],
    a: 0,
    why: "L'article 2 de la Constitution énonce la langue, l'emblème, l'hymne, la devise et le principe de la République.",
  },
  {
    q: "Quelles sont les couleurs du drapeau français, dans l'ordre à partir de la hampe (le mât) ?",
    c: ["Bleu, blanc, rouge", "Rouge, blanc, bleu", "Blanc, bleu, rouge", "Bleu, rouge, blanc"],
    a: 0,
    why: "Le drapeau tricolore se lit bleu, blanc, rouge à partir de la hampe. Le bleu et le rouge sont les couleurs de Paris, le blanc celle de la monarchie : le drapeau symbolise leur réunion.",
  },
  {
    q: "Comment s'appelle l'hymne national français ?",
    c: ["La Marseillaise", "Le Chant du départ", "L'Internationale", "Le Chant des partisans"],
    a: 0,
    why: "La Marseillaise est l'hymne national, inscrit à l'article 2 de la Constitution.",
  },
  {
    q: "Qui a composé La Marseillaise ?",
    c: ["Rouget de Lisle", "Hector Berlioz", "Victor Hugo", "Claude Debussy"],
    a: 0,
    why: "Claude Joseph Rouget de Lisle l'écrit à Strasbourg en 1792. Elle s'appelait alors « Chant de guerre pour l'armée du Rhin ».",
  },
  {
    q: "En quelle année La Marseillaise a-t-elle été composée ?",
    c: ["1792", "1789", "1848", "1870"],
    a: 0,
    why: "Elle est composée en avril 1792, pendant la Révolution. Elle devient hymne national en 1795, puis définitivement en 1879.",
  },
  {
    q: "Pourquoi ce chant a-t-il pris le nom de « La Marseillaise » ?",
    c: ["Parce que des volontaires venus de Marseille l'ont chanté en arrivant à Paris", "Parce que son auteur, Rouget de Lisle, était originaire de Marseille", "Parce qu'il a été composé sur le port de Marseille pour la flotte royale", "Parce que Marseille fut la première ville à proclamer la République"],
    a: 0,
    why: "Des fédérés marseillais l'entonnèrent en marchant sur Paris en 1792 ; le chant prit alors leur nom.",
  },
  {
    q: "Quelle est la date de la fête nationale française ?",
    c: ["Le 14 juillet", "Le 8 mai", "Le 11 novembre", "Le 1er mai"],
    a: 0,
    why: "Le 14 juillet est la fête nationale depuis la loi du 6 juillet 1880.",
  },
  {
    q: "Que commémore le 14 juillet ?",
    c: ["La prise de la Bastille en 1789 et la fête de la Fédération de 1790", "La victoire des Alliés et la fin de la Seconde Guerre mondiale en 1945", "La proclamation de la Ve République et la Constitution de 1958", "L'armistice de 1918 et la fin de la Première Guerre mondiale"],
    a: 0,
    why: "La loi de 1880 vise à la fois la prise de la Bastille du 14 juillet 1789 et la fête de la Fédération du 14 juillet 1790, symbole de l'unité de la Nation.",
  },
  {
    q: "Comment appelle-t-on la figure féminine qui représente la République française ?",
    c: ["Marianne", "Jeanne", "Liberté", "Française"],
    a: 0,
    why: "Marianne est l'allégorie de la République. Son buste est présent dans les mairies et son effigie figure sur les timbres et les pièces.",
  },
  {
    q: "Quel couvre-chef Marianne porte-t-elle traditionnellement ?",
    c: ["Le bonnet phrygien", "Une couronne", "Un casque militaire", "Un chapeau de paille"],
    a: 0,
    why: "Le bonnet phrygien était porté dans l'Antiquité par les esclaves affranchis : il est devenu le symbole de la liberté.",
  },
  {
    q: "Quel animal est un emblème traditionnel — mais non officiel — de la France ?",
    c: ["Le coq", "L'aigle", "Le lion", "Le taureau"],
    a: 0,
    why: "Le coq gaulois est un emblème populaire, notamment sportif. Il n'est pas mentionné par la Constitution.",
  },
  {
    q: "Quelle est la langue de la République selon la Constitution ?",
    c: ["Le français", "Le français et l'anglais", "Aucune langue n'est mentionnée", "Le français et les langues régionales"],
    a: 0,
    why: "L'article 2 de la Constitution dispose : « La langue de la République est le français ». Les langues régionales sont reconnues comme appartenant au patrimoine (article 75-1).",
  },
  {
    q: "Quel est le principe de la République inscrit à l'article 2 de la Constitution ?",
    c: ["Gouvernement du peuple, par le peuple et pour le peuple", "Le pouvoir appartient à la majorité, qui décide pour tout le pays", "Le gouvernement des meilleurs, désignés par le peuple souverain", "Un peuple, une nation, un chef à la tête de l'État"],
    a: 0,
    why: "Cette formule, reprise d'Abraham Lincoln, définit la démocratie française à l'article 2 de la Constitution.",
  },
  {
    q: "Selon l'article 1er de la Constitution, la France est une République :",
    c: ["indivisible, laïque, démocratique et sociale", "libre, souveraine, prospère et respectueuse des cultes", "fédérale, laïque, démocratique et décentralisée", "parlementaire, chrétienne, sociale et décentralisée"],
    a: 0,
    why: "L'article 1er ajoute qu'elle « assure l'égalité devant la loi de tous les citoyens sans distinction d'origine, de race ou de religion » et « respecte toutes les croyances ».",
  },
  {
    q: "Que signifie le principe de « liberté » dans la devise républicaine ?",
    c: ["Chacun peut agir comme il l'entend dans le respect de la loi et de la liberté d'autrui", "Chacun peut faire ce qu'il veut, sans aucune limite ni contrôle d'aucune autorité", "La liberté est réservée aux citoyens français et aux étrangers naturalisés", "Chacun est libre dans la limite de ce que le maire de sa commune autorise"],
    a: 0,
    why: "L'article 4 de la Déclaration de 1789 précise que « la liberté consiste à pouvoir faire tout ce qui ne nuit pas à autrui ».",
  },
  {
    q: "Que signifie le principe d'« égalité » ?",
    c: ["Tous les citoyens ont les mêmes droits et les mêmes devoirs devant la loi", "Tous les citoyens perçoivent le même revenu, quel que soit leur travail", "Tous les citoyens ont droit au même métier et au même logement", "Tous les citoyens paient exactement le même montant d'impôt, sans exception"],
    a: 0,
    why: "L'égalité est juridique : la loi est la même pour tous. Elle n'impose pas l'uniformité des situations, mais interdit les discriminations.",
  },
  {
    q: "Que signifie le principe de « fraternité » ?",
    c: ["La solidarité et l'entraide entre les membres de la société", "La préférence donnée à sa famille et à ses proches dans la vie publique", "L'obligation d'appartenir à une association ou à un syndicat", "L'appartenance de tous les citoyens à une même religion"],
    a: 0,
    why: "La fraternité se traduit concrètement par la solidarité nationale : sécurité sociale, aide sociale, impôt redistributif, bénévolat.",
  },
  {
    q: "L'égalité entre les femmes et les hommes en France est :",
    c: ["un principe constitutionnel que la loi doit favoriser", "une simple recommandation dépourvue de valeur juridique", "un objectif réservé aux emplois du secteur public", "une règle qui ne s'applique qu'en matière de droit de vote"],
    a: 0,
    why: "L'article 1er de la Constitution prévoit que « la loi favorise l'égal accès des femmes et des hommes aux mandats électoraux et fonctions électives ». De nombreuses lois imposent la parité.",
  },
  {
    q: "Où trouve-t-on le plus souvent inscrite la devise « Liberté, Égalité, Fraternité » ?",
    c: ["Au fronton des mairies, des écoles et des bâtiments publics", "Uniquement sur les pièces de monnaie et les billets de banque", "Seulement dans les tribunaux et les commissariats de police", "Uniquement au palais de l'Élysée et à l'Assemblée nationale"],
    a: 0,
    why: "Elle figure sur les édifices publics, les documents officiels, les pièces de monnaie et les timbres.",
  },
  {
    q: "Quel drapeau est habituellement placé à côté du drapeau français sur les bâtiments publics ?",
    c: ["Le drapeau européen", "Le drapeau de l'ONU", "Le drapeau de la région", "Aucun autre drapeau n'est autorisé"],
    a: 0,
    why: "Le drapeau bleu à douze étoiles d'or de l'Union européenne accompagne le drapeau tricolore sur les bâtiments publics.",
  },
  {
    q: "Que représente le sceau de la République française ?",
    c: ["La Liberté assise, tenant un faisceau de licteur", "Le portrait du président de la République en exercice", "Une carte de la France et de ses territoires d'outre-mer", "Le coq gaulois entouré d'une couronne de lauriers"],
    a: 0,
    why: "Le sceau, utilisé notamment pour les révisions constitutionnelles, figure la Liberté sous les traits de Junon, avec un faisceau de licteur.",
  },
  {
    q: "Le faisceau de licteur est un emblème qui symbolise :",
    c: ["l'union des citoyens et l'autorité de la justice", "la puissance militaire de la Nation en armes", "la richesse et la prospérité du commerce français", "l'autorité du roi sur les provinces du royaume"],
    a: 0,
    why: "Hérité de la Rome antique, il symbolise l'idée que l'union fait la force et que la loi s'applique à tous.",
  },
  {
    q: "Quelle phrase figure au fronton du Panthéon, à Paris ?",
    c: ["« Aux grands hommes, la patrie reconnaissante »", "« Liberté, Égalité, Fraternité, République »", "« Ici repose la Nation reconnaissante »", "« À la République une et indivisible »"],
    a: 0,
    why: "Le Panthéon accueille les personnalités qui ont marqué l'histoire de la Nation, femmes et hommes.",
  },
  {
    q: "Le mot « République » vient du latin res publica, qui signifie :",
    c: ["la chose publique", "le pouvoir du roi", "la cité fortifiée", "l'assemblée des soldats"],
    a: 0,
    why: "La République est le régime dans lequel le pouvoir est une affaire commune, exercée dans l'intérêt général et non au profit d'une personne.",
  },
  {
    q: "Dans une République, le chef de l'État est :",
    c: ["élu", "désigné par l'armée", "héréditaire", "tiré au sort"],
    a: 0,
    why: "C'est la différence essentielle avec la monarchie, où le pouvoir se transmet par la naissance.",
  },
  {
    q: "Sous quelle République vit la France aujourd'hui ?",
    c: ["La Ve République", "La IIIe République", "La IVe République", "La VIe République"],
    a: 0,
    why: "La Ve République a été instaurée par la Constitution du 4 octobre 1958.",
  },
  {
    q: "Que signifie le fait que la République soit « indivisible » ?",
    c: ["Le territoire et le peuple français forment un ensemble unique, sans partage de souveraineté", "Le territoire ne peut être divisé ni en régions, ni en départements, ni en communes", "La France ne peut signer aucun traité qui partage une part de sa souveraineté", "Les régions n'ont aucune compétence propre : tout se décide depuis Paris"],
    a: 0,
    why: "L'indivisibilité signifie qu'il n'existe qu'un seul peuple français et une seule souveraineté, même si l'organisation est décentralisée.",
  },
  {
    q: "Que signifie le fait que la République soit « sociale » ?",
    c: ["Elle garantit la solidarité et cherche à réduire les inégalités", "Elle rend obligatoire l'adhésion à une association ou à un syndicat", "Elle interdit la propriété privée des moyens de production", "Elle impose une seule classe sociale et supprime les héritages"],
    a: 0,
    why: "Le caractère social se traduit par la sécurité sociale, les services publics, l'école gratuite ou encore les aides au logement.",
  },
  {
    q: "Quelle affirmation sur les symboles de la République est FAUSSE ?",
    c: ["Le coq est inscrit dans la Constitution comme emblème officiel", "Le drapeau tricolore est l'emblème national inscrit dans la Constitution", "La Marseillaise est l'hymne national depuis la Troisième République", "Marianne représente la République dans les mairies de France"],
    a: 0,
    why: "Le coq est un emblème traditionnel et populaire, mais il n'a aucune valeur officielle : la Constitution ne cite que le drapeau, l'hymne, la devise et la langue.",
  },
  {
    q: "Le 21 juin, la France célèbre :",
    c: ["la Fête de la musique", "la fête nationale", "la journée de la laïcité", "la fête du travail"],
    a: 0,
    why: "Créée en 1982, la Fête de la musique est devenue un rendez-vous populaire repris dans de nombreux pays.",
  },
  {
    q: "Le 1er mai est en France :",
    c: ["la fête du Travail, jour férié et chômé", "la fête nationale de la République française", "un jour ouvré comme un autre dans les entreprises", "la journée de l'Europe et de ses institutions"],
    a: 0,
    why: "C'est le seul jour de l'année qui soit obligatoirement férié et chômé pour l'ensemble des salariés, sauf nécessités de service.",
  },
];

const laicite = [
  {
    q: "Quelle loi organise la séparation des Églises et de l'État en France ?",
    c: ["La loi du 9 décembre 1905", "La loi du 15 mars 2004", "La loi du 29 juillet 1881", "La loi du 1er juillet 1901"],
    a: 0,
    why: "La loi du 9 décembre 1905 est le texte fondateur de la laïcité française.",
  },
  {
    q: "Que garantit l'article 1er de la loi de 1905 ?",
    c: ["La liberté de conscience et le libre exercice des cultes", "L'obligation de pratiquer l'une des religions reconnues par l'État", "L'interdiction de toute croyance religieuse dans l'espace public", "La reconnaissance officielle de quatre cultes par l'État"],
    a: 0,
    why: "La République assure la liberté de conscience et garantit le libre exercice des cultes, dans les limites de l'ordre public.",
  },
  {
    q: "Selon la loi de 1905, la République :",
    c: [
      "ne reconnaît, ne salarie ni ne subventionne aucun culte",
      "salarie les ministres des cultes reconnus",
      "subventionne les lieux de culte les plus fréquentés",
      "désigne les responsables religieux",
    ],
    a: 0,
    why: "C'est l'article 2 de la loi de 1905. L'État est neutre : il ne finance ni n'organise les religions.",
  },
  {
    q: "La laïcité signifie que :",
    c: ["chacun est libre de croire, de ne pas croire ou de changer de religion", "les religions sont interdites dans l'ensemble de l'espace public", "il faut être athée, ou le devenir, pour être pleinement français", "seule la religion majoritaire du pays est reconnue et autorisée"],
    a: 0,
    why: "La laïcité n'est pas l'athéisme : c'est un cadre commun qui protège la liberté de conscience de tous, croyants comme non-croyants.",
  },
  {
    q: "La laïcité impose une obligation stricte de neutralité :",
    c: ["aux agents du service public dans l'exercice de leurs fonctions", "à tous les habitants, dans la rue comme dans leur vie privée", "aux usagers des services publics, mais non aux agents", "aux seuls élus locaux et aux membres du gouvernement"],
    a: 0,
    why: "Un agent public ne doit manifester ni ses convictions religieuses, ni ses opinions politiques ou philosophiques pendant son service. Les usagers, eux, restent libres, sauf exceptions prévues par la loi.",
  },
  {
    q: "Que prévoit la loi du 15 mars 2004 ?",
    c: ["L'interdiction des signes religieux ostensibles dans les écoles, collèges et lycées publics", "L'obligation pour les élèves des écoles publiques de suivre un enseignement religieux", "L'interdiction d'enseigner l'histoire des religions dans les écoles publiques françaises", "L'interdiction des signes religieux ostensibles dans la rue et les transports publics"],
    a: 0,
    why: "Cette loi ne concerne que les élèves des établissements publics du premier et du second degré. Elle ne s'applique pas à l'université.",
  },
  {
    q: "Que prévoit la loi du 11 octobre 2010 ?",
    c: ["L'interdiction de dissimuler son visage dans l'espace public", "L'interdiction des processions religieuses sur la voie publique", "L'interdiction du port de la croix dans les administrations", "L'obligation de retirer tout couvre-chef dans les mairies"],
    a: 0,
    why: "Cette loi interdit la dissimulation du visage dans l'espace public, pour des motifs d'ordre public et de vie en société. Elle vise toute tenue destinée à dissimuler le visage.",
  },
  {
    q: "Un élève d'une école publique peut-il porter un signe religieux ostensible ?",
    c: ["Non, la loi l'interdit dans les écoles, collèges et lycées publics", "Oui, sans aucune restriction, au nom de la liberté de conscience", "Oui, mais uniquement pendant les récréations et hors des cours", "Oui, avec l'accord du professeur principal et des parents"],
    a: 0,
    why: "Les signes discrets restent admis ; les signes par lesquels on manifeste ostensiblement une appartenance religieuse sont interdits (loi du 15 mars 2004).",
  },
  {
    q: "Un usager qui se rend dans une mairie ou un hôpital public :",
    c: ["peut porter un signe religieux, mais doit respecter les règles de fonctionnement du service", "doit obligatoirement retirer tout signe religieux avant d'entrer dans le bâtiment", "ne peut pas être reçu par le service s'il porte un signe religieux visible", "doit déclarer sa religion à l'accueil avant d'être reçu par un agent"],
    a: 0,
    why: "La neutralité s'impose aux agents, pas aux usagers. Ceux-ci doivent en revanche respecter le bon fonctionnement du service (identification, sécurité, soins).",
  },
  {
    q: "L'enseignement dans les écoles publiques est :",
    c: ["laïque et gratuit", "confessionnel", "payant à partir du collège", "réservé aux enfants français"],
    a: 0,
    why: "L'école publique est gratuite, laïque et obligatoire ; l'instruction est obligatoire de 3 à 16 ans pour tous les enfants présents sur le territoire.",
  },
  {
    q: "Quelle est la date de la journée nationale de la laïcité ?",
    c: ["Le 9 décembre", "Le 15 mars", "Le 1er septembre", "Le 21 avril"],
    a: 0,
    why: "Le 9 décembre est l'anniversaire de la loi de 1905 sur la séparation des Églises et de l'État.",
  },
  {
    q: "Quel document est affiché dans les établissements scolaires publics depuis 2013 ?",
    c: ["La Charte de la laïcité à l'école", "Le Code de l'éducation", "La Déclaration universelle des droits de l'homme", "Le règlement du baccalauréat"],
    a: 0,
    why: "La Charte de la laïcité à l'école, en 15 articles, rappelle ce que la laïcité implique pour les élèves, les familles et les personnels.",
  },
  {
    q: "La laïcité concerne-t-elle les écoles privées sous contrat ?",
    c: ["Elles ont un caractère propre, mais doivent respecter la liberté de conscience des élèves", "Elles sont soumises exactement aux mêmes règles de neutralité que les écoles publiques", "Elles n'ont aucune obligation envers l'État, même lorsqu'il finance leurs enseignants", "Le financement public leur est interdit depuis la loi de séparation de 1905"],
    a: 0,
    why: "Les établissements privés sous contrat suivent les programmes nationaux et doivent accueillir tous les élèves sans distinction, tout en conservant leur caractère propre.",
  },
  {
    q: "Un employeur d'une entreprise privée peut-il restreindre le port de signes religieux ?",
    c: ["Oui, si le règlement intérieur le prévoit de façon générale et justifiée par la nature des tâches", "Uniquement si l'entreprise exerce une mission de service public pour le compte de l'État", "Oui, librement, sans avoir à justifier sa décision d'aucune manière que ce soit", "Non, jamais : la liberté religieuse prime toujours sur le règlement intérieur"],
    a: 0,
    why: "Une clause de neutralité doit être générale, indifférenciée et proportionnée. Elle ne peut pas viser une religion en particulier ni être décidée au cas par cas.",
  },
  {
    q: "Trois départements appliquent encore un régime particulier en matière de cultes. Lesquels ?",
    c: [
      "Le Bas-Rhin, le Haut-Rhin et la Moselle",
      "La Corse-du-Sud, la Haute-Corse et le Var",
      "Le Nord, le Pas-de-Calais et la Somme",
      "La Guadeloupe, la Martinique et la Guyane",
    ],
    a: 0,
    why: "L'Alsace-Moselle, allemande en 1905, conserve le régime concordataire hérité de 1801.",
  },
  {
    q: "La laïcité protège :",
    c: [
      "aussi bien les croyants que les non-croyants",
      "uniquement les non-croyants",
      "uniquement les religions les plus anciennes",
      "uniquement les fonctionnaires",
    ],
    a: 0,
    why: "Elle garantit à chacun la liberté de croire ou de ne pas croire, et l'égalité de tous devant la loi quelles que soient ses convictions.",
  },
  {
    q: "Peut-on critiquer une religion en France ?",
    c: ["Oui : critiquer les idées et les religions est permis, injurier les personnes est puni", "Oui, sans aucune limite : la liberté d'expression ne souffre aucune exception en France", "Uniquement dans le cadre universitaire, scientifique ou dans un débat public encadré", "Non, toute critique d'une religion constitue un délit puni par la loi française"],
    a: 0,
    why: "La liberté d'expression permet de critiquer les croyances et les dogmes. Elle s'arrête là où commencent l'injure, la diffamation et la provocation à la haine visant des personnes.",
  },
  {
    q: "Le blasphème est-il un délit en France ?",
    c: ["Non, il n'existe pas de délit de blasphème", "Oui, il est puni d'une amende par le code pénal", "Oui, mais seulement dans les écoles publiques", "Oui, depuis la loi de 1905 sur la laïcité"],
    a: 0,
    why: "Le délit de blasphème n'existe pas en droit français. En revanche, provoquer à la haine ou à la violence contre un groupe de personnes en raison de sa religion est puni.",
  },
  {
    q: "Le maire peut-il refuser de célébrer un mariage pour un motif religieux ?",
    c: [
      "Non, il est soumis à la neutralité et doit appliquer la loi",
      "Oui, s'il invoque sa conscience",
      "Oui, avec l'accord du conseil municipal",
      "Oui, si le mariage est célébré un jour de fête religieuse",
    ],
    a: 0,
    why: "Officier d'état civil, le maire agit au nom de l'État et ne peut opposer ses convictions personnelles à l'application de la loi.",
  },
  {
    q: "En France, le mariage civil :",
    c: [
      "doit précéder toute cérémonie religieuse",
      "peut être célébré après la cérémonie religieuse",
      "est facultatif si un mariage religieux a eu lieu",
      "est célébré par un ministre du culte",
    ],
    a: 0,
    why: "Seul le mariage civil, célébré à la mairie, produit des effets juridiques. La cérémonie religieuse, facultative, ne peut avoir lieu qu'après.",
  },
  {
    q: "Que prévoit la loi du 24 août 2021 confortant le respect des principes de la République ?",
    c: ["Elle renforce la neutralité du service public et la lutte contre le séparatisme", "Elle interdit les associations cultuelles et les lieux de culte privés", "Elle rend l'instruction religieuse obligatoire à l'école publique", "Elle abroge la loi de 1905 et la remplace par un nouveau régime"],
    a: 0,
    why: "Elle étend notamment l'obligation de neutralité aux salariés des organismes chargés d'une mission de service public et encadre l'instruction en famille.",
  },
  {
    q: "Les jours fériés en France ont-ils tous une origine religieuse ?",
    c: ["Non, certains sont civils : le 14 juillet, le 1er mai, le 8 mai, le 11 novembre", "Oui, tous les jours fériés français ont une origine chrétienne ancienne", "Non, aucun jour férié français n'a conservé d'origine religieuse", "Oui, à l'exception du 25 décembre, devenu une simple fête civile"],
    a: 0,
    why: "Le calendrier des jours fériés mêle des dates civiles et des fêtes chrétiennes héritées de l'histoire, sans que cela remette en cause la laïcité.",
  },
  {
    q: "Un agent public peut-il afficher un symbole religieux sur son bureau ouvert au public ?",
    c: ["Non, la neutralité du service public l'interdit", "Oui, à condition qu'il reste discret et de petite taille", "Oui, avec l'accord écrit de son supérieur hiérarchique", "Oui, en dehors des heures d'ouverture au public"],
    a: 0,
    why: "La neutralité vaut pour la tenue, les propos et l'environnement de travail : le service public ne doit marquer aucune préférence.",
  },
  {
    q: "La liberté de conscience comprend :",
    c: ["le droit de croire, de ne pas croire et de changer de religion", "le droit d'imposer sa religion aux membres de sa famille", "le droit d'exiger un service public adapté à sa religion", "le droit de ne pas respecter la loi au nom de sa foi"],
    a: 0,
    why: "Aucune conviction, religieuse ou non, ne permet de se soustraire aux lois de la République.",
  },
];

const mk = (arr, sub, prefix) =>
  arr.map((o, i) => ({ ...o, id: `${prefix}${String(i + 1).padStart(2, '0')}`, theme: T, type: K, sub }));

export default [
  ...mk(symboles, 'devise-symboles', 'sym'),
  ...mk(laicite, 'laicite', 'lai'),
];
