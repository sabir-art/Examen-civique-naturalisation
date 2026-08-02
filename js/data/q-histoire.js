/**
 * Thème 4 — Histoire, géographie et culture (8 questions à l'examen).
 */

const T = 'histoire-geo-culture';
const K = 'connaissance';

const histoire = [
  {
    q: "Quel chef gaulois s'est opposé à Jules César à Alésia en 52 av. J.-C. ?",
    c: ["Vercingétorix", "Clovis", "Charlemagne", "Astérix"],
    a: 0,
    why: "La défaite d'Alésia marque le début de la Gaule romaine, dont la France a hérité une grande partie de sa langue et de son droit.",
  },
  {
    q: "Quel roi franc s'est converti au christianisme vers 496 à Reims ?",
    c: ["Clovis", "Charlemagne", "Hugues Capet", "Saint Louis"],
    a: 0,
    why: "Clovis unifie une grande partie de la Gaule et fonde la dynastie mérovingienne. Reims deviendra la ville du sacre des rois de France.",
  },
  {
    q: "Qui a été couronné empereur d'Occident en l'an 800 ?",
    c: ["Charlemagne", "Clovis", "Napoléon Ier", "Louis XIV"],
    a: 0,
    why: "Charlemagne développe l'écriture, les écoles et l'administration. Il est resté dans la mémoire collective comme un unificateur de l'Europe.",
  },
  {
    q: "Quelle jeune femme a délivré Orléans en 1429 pendant la guerre de Cent Ans ?",
    c: ["Jeanne d'Arc", "Marianne", "Aliénor d'Aquitaine", "Olympe de Gouges"],
    a: 0,
    why: "Capturée puis brûlée à Rouen en 1431, elle est devenue une figure nationale et a été canonisée en 1920.",
  },
  {
    q: "Quelle ordonnance de 1539 impose le français dans les actes administratifs ?",
    c: [
      "L'ordonnance de Villers-Cotterêts",
      "L'édit de Nantes",
      "Le Code civil",
      "La Pragmatique Sanction",
    ],
    a: 0,
    why: "Signée par François Ier, elle remplace le latin par le français dans les actes de justice et d'administration.",
  },
  {
    q: "Quel roi a signé l'édit de Nantes en 1598, accordant la liberté de culte aux protestants ?",
    c: ["Henri IV", "Louis XIV", "François Ier", "Louis XVI"],
    a: 0,
    why: "L'édit met fin aux guerres de Religion. Il sera révoqué par Louis XIV en 1685, provoquant l'exil de nombreux protestants.",
  },
  {
    q: "Quel roi, surnommé le « Roi-Soleil », a fait construire le château de Versailles ?",
    c: ["Louis XIV", "Louis XVI", "Henri IV", "François Ier"],
    a: 0,
    why: "Louis XIV règne de 1643 à 1715 : c'est l'apogée de la monarchie absolue.",
  },
  {
    q: "Que s'est-il passé le 14 juillet 1789 ?",
    c: [
      "La prise de la Bastille",
      "La proclamation de la République",
      "L'exécution de Louis XVI",
      "Le sacre de Napoléon",
    ],
    a: 0,
    why: "La prise de cette prison royale, symbole de l'arbitraire, marque le début de la Révolution française.",
  },
  {
    q: "Quand la Déclaration des droits de l'homme et du citoyen a-t-elle été adoptée ?",
    c: ["Le 26 août 1789", "Le 14 juillet 1789", "Le 21 septembre 1792", "Le 4 octobre 1958"],
    a: 0,
    why: "Elle proclame l'égalité des droits, la souveraineté de la Nation et la séparation des pouvoirs.",
  },
  {
    q: "En quelle année la République a-t-elle été proclamée pour la première fois en France ?",
    c: ["1792", "1789", "1848", "1870"],
    a: 0,
    why: "La Ire République est proclamée le 21 septembre 1792, après la chute de la monarchie.",
  },
  {
    q: "Quel code, promulgué en 1804, régit encore aujourd'hui le droit des personnes et des contrats ?",
    c: ["Le Code civil", "Le Code pénal", "Le Code du travail", "Le Code de la route"],
    a: 0,
    why: "Le Code civil, dit « Code Napoléon », a inspiré les législations de nombreux pays.",
  },
  {
    q: "Qui s'est proclamé empereur des Français en 1804 ?",
    c: ["Napoléon Bonaparte", "Louis XVIII", "Charles X", "Louis-Philippe"],
    a: 0,
    why: "Napoléon Ier crée aussi le franc germinal, les lycées, la Légion d'honneur et les préfets.",
  },
  {
    q: "Que s'est-il passé en 1848 en France ?",
    c: [
      "La proclamation de la IIe République, le suffrage universel masculin et l'abolition de l'esclavage",
      "La Révolution française",
      "La fin de la Première Guerre mondiale",
      "L'instauration de la Ve République",
    ],
    a: 0,
    why: "1848 est une année charnière : le décret du 27 avril 1848 abolit définitivement l'esclavage dans les colonies françaises.",
  },
  {
    q: "Quel homme politique est associé à l'abolition définitive de l'esclavage en 1848 ?",
    c: ["Victor Schœlcher", "Victor Hugo", "Jules Ferry", "Léon Blum"],
    a: 0,
    why: "Le 10 mai est la journée nationale des mémoires de la traite, de l'esclavage et de leurs abolitions ; la loi Taubira de 2001 les reconnaît comme crime contre l'humanité.",
  },
  {
    q: "Quelles lois des années 1881-1882 ont rendu l'école primaire gratuite, laïque et obligatoire ?",
    c: ["Les lois Jules Ferry", "Les lois Waldeck-Rousseau", "Les lois Gambetta", "Les lois Combes"],
    a: 0,
    why: "Elles fondent l'école républicaine, instrument d'égalité et d'unité nationale.",
  },
  {
    q: "En quelle année a été votée la loi de séparation des Églises et de l'État ?",
    c: ["1905", "1881", "1901", "1946"],
    a: 0,
    why: "La loi du 9 décembre 1905 est le socle juridique de la laïcité française.",
  },
  {
    q: "Quelles sont les dates de la Première Guerre mondiale ?",
    c: ["1914-1918", "1939-1945", "1870-1871", "1914-1919"],
    a: 0,
    why: "L'armistice est signé le 11 novembre 1918. Ce jour est férié et commémore la fin des combats.",
  },
  {
    q: "Que commémore le 11 novembre ?",
    c: [
      "L'armistice de la Première Guerre mondiale",
      "La victoire de la Seconde Guerre mondiale",
      "La Libération de Paris",
      "La fin de la guerre d'Algérie",
    ],
    a: 0,
    why: "Une cérémonie a lieu chaque année devant la tombe du Soldat inconnu, sous l'Arc de triomphe.",
  },
  {
    q: "Quelle avancée sociale majeure est associée au Front populaire de 1936 ?",
    c: [
      "Les congés payés et la semaine de 40 heures",
      "La sécurité sociale",
      "Le droit de vote des femmes",
      "La retraite à 60 ans",
    ],
    a: 0,
    why: "Les accords de Matignon de 1936 instaurent deux semaines de congés payés, devenues cinq semaines en 1982.",
  },
  {
    q: "Qui a lancé l'appel du 18 juin 1940 depuis Londres ?",
    c: ["Le général de Gaulle", "Jean Moulin", "Philippe Pétain", "Georges Clemenceau"],
    a: 0,
    why: "Cet appel à poursuivre le combat est considéré comme l'acte fondateur de la France libre et de la Résistance.",
  },
  {
    q: "Qui a unifié les mouvements de la Résistance intérieure française ?",
    c: ["Jean Moulin", "Charles de Gaulle", "Pierre Laval", "Léon Blum"],
    a: 0,
    why: "Jean Moulin préside le Conseil national de la Résistance en 1943. Il est mort sous la torture ; ses cendres reposent au Panthéon.",
  },
  {
    q: "Que commémore le 8 mai ?",
    c: [
      "La victoire des Alliés et la fin de la Seconde Guerre mondiale en Europe",
      "La Libération de Paris",
      "L'armistice de 1918",
      "Le débarquement de Normandie",
    ],
    a: 0,
    why: "Le 8 mai 1945 marque la capitulation de l'Allemagne nazie. Le débarquement de Normandie avait eu lieu le 6 juin 1944.",
  },
  {
    q: "Quel régime a collaboré avec l'Allemagne nazie entre 1940 et 1944 ?",
    c: ["Le régime de Vichy", "La IIIe République", "La IVe République", "La Commune de Paris"],
    a: 0,
    why: "Dirigé par Philippe Pétain, il a participé à la persécution et à la déportation des Juifs de France. La République a reconnu cette responsabilité en 1995.",
  },
  {
    q: "En quelle année la Sécurité sociale a-t-elle été créée en France ?",
    c: ["1945", "1936", "1958", "1981"],
    a: 0,
    why: "Issue du programme du Conseil national de la Résistance, elle repose sur la solidarité nationale : chacun cotise selon ses moyens et reçoit selon ses besoins.",
  },
  {
    q: "En quelle année la Ve République a-t-elle été instaurée ?",
    c: ["1958", "1946", "1962", "1969"],
    a: 0,
    why: "La crise algérienne conduit au retour de Charles de Gaulle et à l'adoption de la Constitution du 4 octobre 1958.",
  },
  {
    q: "Quand l'Algérie a-t-elle accédé à l'indépendance ?",
    c: ["En 1962", "En 1954", "En 1958", "En 1968"],
    a: 0,
    why: "Les accords d'Évian du 18 mars 1962 mettent fin à huit ans de guerre.",
  },
  {
    q: "Que s'est-il passé en mai 1968 en France ?",
    c: [
      "Un vaste mouvement étudiant et social",
      "La proclamation de la Ve République",
      "L'entrée dans l'Union européenne",
      "L'abolition de la peine de mort",
    ],
    a: 0,
    why: "Ce mouvement a profondément transformé la société française : rapports d'autorité, droits des femmes, éducation.",
  },
  {
    q: "En quelle année François Mitterrand a-t-il été élu président de la République pour la première fois ?",
    c: ["1981", "1974", "1988", "1969"],
    a: 0,
    why: "Première alternance de la Ve République. Son septennat commence par l'abolition de la peine de mort, la même année.",
  },
  {
    q: "Quel traité européen les Français ont-ils approuvé par référendum en 1992 ?",
    c: ["Le traité de Maastricht", "Le traité de Rome", "Le traité de Lisbonne", "Le traité de Nice"],
    a: 0,
    why: "Il crée l'Union européenne, la citoyenneté européenne et prépare la monnaie unique.",
  },
  {
    q: "Qui était Olympe de Gouges ?",
    c: [
      "L'autrice de la Déclaration des droits de la femme et de la citoyenne (1791)",
      "La première femme députée",
      "Une résistante de 1940",
      "La première femme médecin en France",
    ],
    a: 0,
    why: "Elle réclamait l'égalité des droits entre les femmes et les hommes. Guillotinée en 1793, elle est devenue une figure du féminisme.",
  },
  {
    q: "Qui fut la première femme à présider le Parlement européen, en 1979 ?",
    c: ["Simone Veil", "Marie Curie", "Simone de Beauvoir", "Louise Michel"],
    a: 0,
    why: "Rescapée d'Auschwitz, ministre de la Santé et autrice de la loi de 1975 sur l'IVG, elle est entrée au Panthéon en 2018.",
  },
  {
    q: "Qui était Joséphine Baker, entrée au Panthéon en 2021 ?",
    c: [
      "Une artiste franco-américaine, résistante et militante antiraciste",
      "Une physicienne prix Nobel",
      "Une femme politique de la IIIe République",
      "Une aviatrice des années 1930",
    ],
    a: 0,
    why: "Elle est la première femme noire à entrer au Panthéon.",
  },
  {
    q: "Quel événement les Français commémorent-ils le 27 mai ?",
    c: [
      "La journée nationale de la Résistance",
      "La fête de la Victoire",
      "L'abolition de l'esclavage",
      "La fête nationale",
    ],
    a: 0,
    why: "Elle rappelle la première réunion du Conseil national de la Résistance, le 27 mai 1943 à Paris, sous la présidence de Jean Moulin.",
  },
  {
    q: "Quel est le nom du régime politique de la France entre 1870 et 1940 ?",
    c: ["La IIIe République", "La IIe République", "Le Second Empire", "La IVe République"],
    a: 0,
    why: "Proclamée le 4 septembre 1870, c'est le régime le plus long de l'histoire républicaine française ; il a instauré l'école laïque et la laïcité.",
  },
  {
    q: "Quelle affaire, à la fin du XIXe siècle, a divisé la France autour d'une erreur judiciaire et de l'antisémitisme ?",
    c: ["L'affaire Dreyfus", "L'affaire Calas", "L'affaire du collier", "L'affaire Stavisky"],
    a: 0,
    why: "Émile Zola publie « J'accuse… ! » en 1898 pour défendre le capitaine Dreyfus, finalement réhabilité en 1906.",
  },
  {
    q: "En quelle année les Jeux olympiques et paralympiques d'été se sont-ils tenus à Paris pour la troisième fois ?",
    c: ["2024", "2020", "2016", "2012"],
    a: 0,
    why: "Paris avait déjà accueilli les Jeux en 1900 et en 1924.",
  },
];

const geographie = [
  {
    q: "Quelle est la capitale de la France ?",
    c: ["Paris", "Lyon", "Marseille", "Bordeaux"],
    a: 0,
    why: "Paris est le siège des institutions : Élysée, Matignon, Assemblée nationale, Sénat.",
  },
  {
    q: "Quel est le fleuve le plus long de France ?",
    c: ["La Loire", "La Seine", "Le Rhône", "La Garonne"],
    a: 0,
    why: "La Loire mesure environ 1 000 km. Ses châteaux sont inscrits au patrimoine mondial de l'UNESCO.",
  },
  {
    q: "Quel fleuve traverse Paris ?",
    c: ["La Seine", "La Loire", "Le Rhône", "La Marne"],
    a: 0,
    why: "Les rives de la Seine à Paris sont classées au patrimoine mondial de l'UNESCO.",
  },
  {
    q: "Quel est le point culminant de la France ?",
    c: ["Le mont Blanc", "Le pic du Midi", "Le puy de Dôme", "Le mont Ventoux"],
    a: 0,
    why: "Culminant à plus de 4 800 mètres dans les Alpes, c'est le plus haut sommet d'Europe occidentale.",
  },
  {
    q: "Quelle chaîne de montagnes sépare la France de l'Espagne ?",
    c: ["Les Pyrénées", "Les Alpes", "Le Jura", "Les Vosges"],
    a: 0,
    why: "Les Alpes bordent l'Italie et la Suisse, le Jura la Suisse, les Vosges l'Allemagne.",
  },
  {
    q: "Combien la France métropolitaine compte-t-elle de pays frontaliers ?",
    c: ["8", "5", "6", "10"],
    a: 0,
    why: "Belgique, Luxembourg, Allemagne, Suisse, Italie, Monaco, Espagne et Andorre.",
  },
  {
    q: "Quelle mer borde le sud de la France métropolitaine ?",
    c: ["La mer Méditerranée", "La mer du Nord", "La mer Baltique", "La mer Noire"],
    a: 0,
    why: "Au nord et à l'ouest, la France est bordée par la Manche, la mer du Nord et l'océan Atlantique.",
  },
  {
    q: "Combien d'habitants compte environ la France ?",
    c: ["Environ 68 millions", "Environ 45 millions", "Environ 90 millions", "Environ 110 millions"],
    a: 0,
    why: "La France est le deuxième pays le plus peuplé de l'Union européenne, après l'Allemagne.",
  },
  {
    q: "Quelle est la deuxième ville de France par sa population ?",
    c: ["Marseille", "Lyon", "Toulouse", "Nice"],
    a: 0,
    why: "Marseille, sur la Méditerranée, est le premier port français. Lyon vient ensuite, puis Toulouse.",
  },
  {
    q: "Quels sont les cinq départements et régions d'outre-mer ?",
    c: [
      "La Guadeloupe, la Martinique, la Guyane, La Réunion et Mayotte",
      "La Guadeloupe, la Martinique, la Corse, La Réunion et Mayotte",
      "La Polynésie française, la Nouvelle-Calédonie, la Guyane, Mayotte et Wallis-et-Futuna",
      "La Corse, la Guyane, la Martinique, Saint-Martin et La Réunion",
    ],
    a: 0,
    why: "Mayotte est devenue le 101e département français en 2011. La Corse est une collectivité de métropole.",
  },
  {
    q: "Dans quel océan se trouve La Réunion ?",
    c: ["L'océan Indien", "L'océan Atlantique", "L'océan Pacifique", "La mer des Caraïbes"],
    a: 0,
    why: "La Guadeloupe et la Martinique sont dans les Caraïbes, la Polynésie et la Nouvelle-Calédonie dans le Pacifique, la Guyane en Amérique du Sud.",
  },
  {
    q: "Sur quel continent se situe la Guyane française ?",
    c: ["L'Amérique du Sud", "L'Afrique", "L'Asie", "L'Océanie"],
    a: 0,
    why: "La Guyane, couverte de forêt amazonienne, accueille le centre spatial de Kourou.",
  },
  {
    q: "Quelle est la plus grande île de la Méditerranée appartenant à la France ?",
    c: ["La Corse", "La Sardaigne", "La Sicile", "Les Baléares"],
    a: 0,
    why: "La Corse est une collectivité à statut particulier. Napoléon Bonaparte y est né, à Ajaccio.",
  },
  {
    q: "Quelle est la superficie approximative de la France métropolitaine ?",
    c: ["Environ 550 000 km²", "Environ 300 000 km²", "Environ 800 000 km²", "Environ 1 million de km²"],
    a: 0,
    why: "Avec l'outre-mer, la France couvre plus de 640 000 km² et possède le deuxième domaine maritime du monde.",
  },
  {
    q: "Quel climat domine sur la façade ouest de la France métropolitaine ?",
    c: ["Le climat océanique", "Le climat méditerranéen", "Le climat continental", "Le climat polaire"],
    a: 0,
    why: "Le climat méditerranéen concerne le Sud-Est, le climat continental l'Est et le climat montagnard les massifs.",
  },
  {
    q: "Quel tunnel relie la France au Royaume-Uni ?",
    c: ["Le tunnel sous la Manche", "Le tunnel du Mont-Blanc", "Le tunnel du Fréjus", "Le tunnel de Saint-Gothard"],
    a: 0,
    why: "Ouvert en 1994, il relie Calais à Folkestone.",
  },
  {
    q: "Quelle ville française accueille le Parlement européen ?",
    c: ["Strasbourg", "Lille", "Lyon", "Nantes"],
    a: 0,
    why: "Strasbourg, en Alsace, accueille aussi le Conseil de l'Europe et la Cour européenne des droits de l'homme.",
  },
  {
    q: "Quelle est la principale activité du port de Marseille ?",
    c: [
      "Le commerce maritime et le transport de passagers",
      "La pêche à la baleine",
      "L'extraction pétrolière en mer",
      "La construction de sous-marins",
    ],
    a: 0,
    why: "Premier port de France et l'un des plus grands de Méditerranée, il est un carrefour entre l'Europe, l'Afrique et le Moyen-Orient.",
  },
  {
    q: "Comment appelle-t-on l'ensemble des territoires français situés hors d'Europe ?",
    c: ["L'outre-mer", "Les protectorats", "Les colonies", "Les provinces"],
    a: 0,
    why: "Ils comprennent des départements, des collectivités et des territoires répartis sur trois océans, soit environ 2,8 millions d'habitants.",
  },
  {
    q: "Quelle région française est réputée pour ses châteaux de la Renaissance ?",
    c: [
      "Le Val de Loire (Centre-Val de Loire)",
      "La Bretagne",
      "Les Hauts-de-France",
      "La Corse",
    ],
    a: 0,
    why: "Chambord, Chenonceau ou Amboise témoignent de la Renaissance française. La vallée est classée au patrimoine mondial.",
  },
];

const culture = [
  {
    q: "Qui a écrit « Les Misérables » et « Notre-Dame de Paris » ?",
    c: ["Victor Hugo", "Émile Zola", "Molière", "Albert Camus"],
    a: 0,
    why: "Victor Hugo est aussi une figure politique, défenseur de la République et opposant à Napoléon III. Il repose au Panthéon.",
  },
  {
    q: "Quel auteur du XVIIe siècle est le plus célèbre dramaturge comique français ?",
    c: ["Molière", "Racine", "Corneille", "La Fontaine"],
    a: 0,
    why: "On appelle souvent le français « la langue de Molière ». Il a écrit Le Malade imaginaire, L'Avare et Tartuffe.",
  },
  {
    q: "Quel scientifique français a mis au point le vaccin contre la rage ?",
    c: ["Louis Pasteur", "Marie Curie", "Antoine Lavoisier", "Ambroise Paré"],
    a: 0,
    why: "Louis Pasteur a également découvert la pasteurisation. L'Institut Pasteur porte son nom.",
  },
  {
    q: "Quelle scientifique, deux fois prix Nobel, repose au Panthéon ?",
    c: ["Marie Curie", "Simone Veil", "Rosalind Franklin", "Ada Lovelace"],
    a: 0,
    why: "Prix Nobel de physique (1903) et de chimie (1911), elle est la première femme entrée au Panthéon pour ses propres mérites, en 1995.",
  },
  {
    q: "Qui a écrit « J'accuse… ! » lors de l'affaire Dreyfus ?",
    c: ["Émile Zola", "Victor Hugo", "Jean-Paul Sartre", "Voltaire"],
    a: 0,
    why: "Cette lettre ouverte publiée en 1898 dans le journal L'Aurore a relancé la défense du capitaine Dreyfus.",
  },
  {
    q: "Quel monument parisien a été construit pour l'Exposition universelle de 1889 ?",
    c: ["La tour Eiffel", "L'Arc de triomphe", "Le Sacré-Cœur", "L'Opéra Garnier"],
    a: 0,
    why: "Conçue par Gustave Eiffel, elle est devenue le symbole de Paris et le monument payant le plus visité au monde.",
  },
  {
    q: "Dans quel musée parisien peut-on voir « La Joconde » ?",
    c: ["Le Louvre", "Le musée d'Orsay", "Le Centre Pompidou", "Le musée Rodin"],
    a: 0,
    why: "Peinte par Léonard de Vinci, elle appartient aux collections nationales depuis François Ier.",
  },
  {
    q: "Quel monument abrite la tombe du Soldat inconnu et sa flamme ravivée chaque soir ?",
    c: ["L'Arc de triomphe", "Le Panthéon", "Les Invalides", "La Sorbonne"],
    a: 0,
    why: "La flamme du souvenir est ravivée tous les jours à 18 h 30 depuis 1923.",
  },
  {
    q: "Quel site normand, abbaye construite sur un îlot rocheux, est classé au patrimoine mondial ?",
    c: ["Le Mont-Saint-Michel", "Le château de Chambord", "Le Pont du Gard", "La cité de Carcassonne"],
    a: 0,
    why: "La France compte une cinquantaine de biens inscrits au patrimoine mondial de l'UNESCO.",
  },
  {
    q: "Quels frères français ont réalisé la première projection publique de cinéma en 1895 ?",
    c: ["Les frères Lumière", "Les frères Montgolfier", "Les frères Goncourt", "Les frères Renault"],
    a: 0,
    why: "Le cinéma est né à Lyon et à Paris. La France reste le pays du Festival de Cannes.",
  },
  {
    q: "Que célèbre la Fête de la musique ?",
    c: [
      "La musique sous toutes ses formes, chaque 21 juin, avec des concerts gratuits",
      "La musique classique uniquement",
      "L'anniversaire de la Marseillaise",
      "La fin de l'année scolaire",
    ],
    a: 0,
    why: "Créée en 1982 par le ministère de la Culture, elle est aujourd'hui reprise dans plus de cent pays.",
  },
  {
    q: "Quel élément de la culture française est inscrit au patrimoine culturel immatériel de l'UNESCO depuis 2010 ?",
    c: [
      "Le repas gastronomique des Français",
      "Le Tour de France",
      "La langue française",
      "Le Festival de Cannes",
    ],
    a: 0,
    why: "La baguette de pain a également été inscrite en 2022.",
  },
  {
    q: "Quelle institution, créée en 1635, veille sur la langue française ?",
    c: ["L'Académie française", "La Sorbonne", "Le Collège de France", "La Bibliothèque nationale"],
    a: 0,
    why: "Fondée par Richelieu, elle compte quarante membres appelés « les Immortels » et publie le Dictionnaire de la langue française.",
  },
  {
    q: "Quelle est la plus grande course cycliste française, créée en 1903 ?",
    c: ["Le Tour de France", "Paris-Roubaix", "Le Critérium du Dauphiné", "La Vuelta"],
    a: 0,
    why: "Le maillot jaune distingue le leader du classement général.",
  },
  {
    q: "En quelle année l'équipe de France a-t-elle remporté la Coupe du monde de football pour la première fois ?",
    c: ["1998", "1984", "2006", "2018"],
    a: 0,
    why: "La France a remporté un second titre en 2018, en Russie.",
  },
  {
    q: "Quelle distinction honorifique, créée par Napoléon en 1802, récompense les mérites éminents ?",
    c: ["La Légion d'honneur", "L'ordre du Mérite agricole", "Les Palmes académiques", "La médaille militaire"],
    a: 0,
    why: "Elle est remise au nom du président de la République, grand maître de l'ordre.",
  },
  {
    q: "Qui était Voltaire ?",
    c: [
      "Un philosophe des Lumières, défenseur de la tolérance et de la liberté d'expression",
      "Un général de Napoléon",
      "Un peintre impressionniste",
      "Un roi de France",
    ],
    a: 0,
    why: "Avec Rousseau, Montesquieu et Diderot, les philosophes des Lumières ont inspiré la Révolution française et la Déclaration de 1789.",
  },
  {
    q: "Quel philosophe des Lumières a théorisé la séparation des pouvoirs ?",
    c: ["Montesquieu", "Voltaire", "Rousseau", "Diderot"],
    a: 0,
    why: "Dans « De l'esprit des lois » (1748), il distingue les pouvoirs exécutif, législatif et judiciaire.",
  },
  {
    q: "Quel mouvement artistique né en France à la fin du XIXe siècle est représenté par Monet et Renoir ?",
    c: ["L'impressionnisme", "Le cubisme", "Le surréalisme", "Le romantisme"],
    a: 0,
    why: "Le nom vient du tableau de Claude Monet « Impression, soleil levant ». Le musée d'Orsay en conserve une grande collection.",
  },
  {
    q: "Quelle autrice a écrit « Le Deuxième Sexe », ouvrage majeur du féminisme ?",
    c: ["Simone de Beauvoir", "Marguerite Duras", "George Sand", "Colette"],
    a: 0,
    why: "Publié en 1949, il a marqué la réflexion sur la condition des femmes : « On ne naît pas femme, on le devient. »",
  },
];

const mk = (arr, sub, prefix) =>
  arr.map((o, i) => ({ ...o, id: `${prefix}${String(i + 1).padStart(2, '0')}`, theme: T, type: K, sub }));

export default [
  ...mk(histoire, 'histoire', 'his'),
  ...mk(geographie, 'geographie', 'geo'),
  ...mk(culture, 'culture', 'cul'),
];
