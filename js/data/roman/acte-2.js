/**
 * « La France racontée » — Acte II : Le temps du peuple.
 *
 * De la prise de la Bastille à la Constitution de 1958 : le moment où le pouvoir
 * change de mains, et les deux siècles qu'il a fallu pour que « le peuple »
 * finisse par désigner tout le monde.
 */

export default {
  key: 'acte-2',
  num: 'II',
  titre: 'Le temps du peuple',
  sous_titre: 'La République se construit, se perd et se retrouve',
  epoque: '1789 — 1958',
  icon: 'flag',
  chapitres: [
    {
      key: 'ch07',
      num: 7,
      titre: 'Le jour où une prison presque vide changea le monde',
      lieu: 'Paris, faubourg Saint-Antoine',
      date: '14 juillet 1789',
      minutes: 5,
      html: `
<p>Le pain coûte trop cher. C'est par là que tout commence, pas par les grandes idées : par le pain. L'hiver a été terrible, les récoltes mauvaises, et un ouvrier parisien dépense désormais l'essentiel de son salaire pour manger.</p>

<p>Le roi <strong>Louis XVI</strong> a besoin d'argent. Le royaume est ruiné. Alors il convoque les <strong>États généraux</strong> — une assemblée des trois ordres qu'on n'avait plus réunie depuis cent soixante-quinze ans. Clergé, noblesse, tiers état.</p>

<p>Et là, quelque chose casse. Les représentants du tiers état, qui parlent au nom de 98 % du pays, refusent de rester à leur place. Ils se déclarent <strong>Assemblée nationale</strong> et jurent, dans une salle de jeu de paume, de ne pas se séparer avant d'avoir donné une constitution à la France.</p>

<p>Le roi masse des troupes autour de Paris. La ville prend peur.</p>

<h4>Le matin du 14</h4>

<p>Le <span class="key">14 juillet 1789</span>, la foule cherche des armes. Elle en trouve aux Invalides — des fusils, mais pas de poudre. La poudre est stockée à la <strong>Bastille</strong>, une vieille forteresse-prison à l'est de la ville.</p>

<p>Il n'y a que sept prisonniers à l'intérieur. Sept. Ce n'est pas une opération de libération, c'est une course à la poudre. Mais la Bastille, avec ses huit tours et ses murs de trente mètres, c'est le symbole de l'arbitraire : on y enfermait des gens sur une simple lettre du roi, sans procès, sans durée.</p>

<p>L'assaut dure une après-midi. Le gouverneur capitule. La foule entre. Et le soir, dans son journal, Louis XVI écrit un seul mot : « Rien. » Il parlait de sa chasse.</p>

<p>À Versailles, on le réveille pour lui annoncer la nouvelle. Il demande : « C'est une révolte ? » Un duc lui répond : « Non, Sire. C'est une révolution. »</p>

<h4>Ce qui suit, très vite</h4>

<p>Dans la nuit du 4 août, l'Assemblée abolit les privilèges — d'un seul coup, en quelques heures. Le 26 août, elle vote la <strong>Déclaration des droits de l'homme et du citoyen</strong> (c'est le chapitre suivant). En 1792, la royauté est abolie et la <strong>Première République</strong> proclamée. En 1793, Louis XVI est guillotiné.</p>

<blockquote>Le <strong>14 juillet</strong> est aujourd'hui la <strong>fête nationale</strong> française. Elle commémore la prise de la Bastille de 1789 <em>et</em> la fête de la Fédération du 14 juillet 1790, où l'on a célébré l'unité de la nation. Défilé, feux d'artifice, bals de pompiers : chaque année, le pays refait la fête de ce jour-là.</blockquote>`,
      retenir: [
        "<strong>14 juillet 1789</strong> — prise de la <strong>Bastille</strong>, symbole de l'arbitraire royal. C'est le début de la Révolution française.",
        "Le <strong>14 juillet</strong> est la <strong>fête nationale</strong> de la France (défilé militaire, feux d'artifice).",
        "La nuit du <strong>4 août 1789</strong> abolit les privilèges ; la <strong>Première République</strong> est proclamée en <strong>1792</strong>.",
        "<strong>Louis XVI</strong> est le roi renversé par la Révolution.",
      ],
      questions: [
        { q: 'Que commémore la fête nationale du 14 juillet ?', c: ['La prise de la Bastille en 1789 et la fête de la Fédération de 1790', "L'armistice de 1918", 'La proclamation de la République en 1958', "L'abolition de l'esclavage"], a: 0, why: "Le 14 juillet 1789 marque le début de la Révolution française ; la fête de la Fédération, un an plus tard, célébrait l'unité de la nation." },
        { q: 'Quelle est la date de la fête nationale française ?', c: ['Le 14 juillet', 'Le 11 novembre', 'Le 8 mai', 'Le 1er mai'], a: 0, why: "Le 11 novembre et le 8 mai sont des commémorations, le 1er mai la fête du travail : la fête nationale, elle, est le 14 juillet." },
        { q: 'Quel roi régnait en France au début de la Révolution française ?', c: ['Louis XVI', 'Louis XIV', 'Henri IV', 'Charles X'], a: 0, why: "Louis XVI a convoqué les États généraux en 1789 ; il sera guillotiné en 1793." },
        { q: 'En quelle année la Première République a-t-elle été proclamée ?', c: ['1792', '1789', '1804', '1848'], a: 0, why: "La royauté est abolie en septembre 1792, trois ans après la prise de la Bastille." },
      ],
    },

    {
      key: 'ch08',
      num: 8,
      titre: 'Dix-sept articles qui tiennent encore',
      lieu: "Paris, salle de l'Assemblée",
      date: '26 août 1789',
      minutes: 5,
      html: `
<p>Six semaines après la Bastille, les députés font quelque chose d'étrange. Le pays est en crise, il n'y a plus de blé, les campagnes s'agitent — et eux passent des jours à discuter de <em>phrases</em>.</p>

<p>Ils ont compris une chose : avant de refaire les lois, il faut écrire ce sur quoi elles reposeront. Poser les fondations avant les murs.</p>

<p>Le <span class="key">26 août 1789</span>, ils adoptent la <strong>Déclaration des droits de l'homme et du citoyen</strong>. Dix-sept articles. Deux pages.</p>

<h4>La première phrase</h4>

<p>« Les hommes naissent et demeurent libres et égaux en droits. »</p>

<p>Relisez-la lentement. Dans un pays où, six semaines plus tôt, on naissait noble ou roturier, imposable ou exempté, et où cela décidait de toute une vie — cette phrase est une bombe. Elle ne dit pas que les hommes <em>sont</em> égaux : elle dit qu'ils naissent égaux <strong>en droits</strong>. C'est-à-dire que la loi ne peut plus les traiter différemment selon leur naissance.</p>

<p>Les autres articles suivent, et vous les reconnaîtrez tous :</p>

<ul>
  <li>la <strong>liberté</strong> consiste à pouvoir faire tout ce qui ne nuit pas à autrui ;</li>
  <li>la loi est l'<strong>expression de la volonté générale</strong> ; elle doit être la même pour tous ;</li>
  <li>nul ne peut être arrêté ni détenu arbitrairement ;</li>
  <li>tout accusé est <strong>présumé innocent</strong> jusqu'à ce qu'il ait été déclaré coupable ;</li>
  <li>nul ne doit être inquiété pour ses opinions, même religieuses ;</li>
  <li>la <strong>libre communication des pensées et des opinions</strong> est un des droits les plus précieux de l'homme.</li>
</ul>

<h4>Ce qui manque</h4>

<p>Il faut le dire, parce que l'histoire ne s'arrête pas en 1789 : cette déclaration parle des « hommes », et à l'époque, cela ne veut pas dire tout le monde. Les femmes n'auront pas le droit de vote avant <strong>1944</strong>. L'esclavage, aboli une première fois en 1794, sera rétabli par Napoléon avant d'être définitivement aboli en <strong>1848</strong>.</p>

<p>Olympe de Gouges l'avait vu tout de suite. Elle écrit en 1791 une <em>Déclaration des droits de la femme et de la citoyenne</em>. Elle sera guillotinée deux ans plus tard.</p>

<blockquote>Ce texte de 1789 n'est pas un souvenir de musée. Il fait <strong>toujours partie du droit français en vigueur</strong> : il est intégré au préambule de la Constitution de 1958, et le Conseil constitutionnel peut annuler une loi qui le violerait. Deux cent trente-sept ans plus tard, ces dix-sept articles peuvent encore faire tomber une loi votée hier.</blockquote>`,
      retenir: [
        "<strong>26 août 1789</strong> — la <strong>Déclaration des droits de l'homme et du citoyen</strong> : « Les hommes naissent et demeurent libres et égaux en droits. »",
        "Elle pose la liberté, l'égalité devant la loi, la <strong>présomption d'innocence</strong>, la liberté d'opinion et d'expression, la sûreté.",
        "Elle a <strong>valeur constitutionnelle aujourd'hui</strong> : elle fait partie du préambule de la Constitution de 1958.",
        "Ses promesses ne seront tenues que progressivement : abolition définitive de l'esclavage en 1848, droit de vote des femmes en 1944.",
      ],
      questions: [
        { q: "En quelle année la Déclaration des droits de l'homme et du citoyen a-t-elle été adoptée ?", c: ['1789', '1792', '1848', '1958'], a: 0, why: "Elle est adoptée le 26 août 1789, six semaines après la prise de la Bastille." },
        { q: "Par quelle phrase commence l'article premier de la Déclaration de 1789 ?", c: ['« Les hommes naissent et demeurent libres et égaux en droits »', '« La France est une République indivisible »', '« Liberté, Égalité, Fraternité »', '« La souveraineté appartient au peuple »'], a: 0, why: "C'est la rupture avec une société d'ordres où la naissance déterminait les droits." },
        { q: "La Déclaration de 1789 a-t-elle encore une valeur juridique aujourd'hui ?", c: ['Oui, elle a valeur constitutionnelle via le préambule de la Constitution de 1958', 'Non, c\'est un texte purement historique', 'Uniquement pour les lois pénales', 'Uniquement en cas de guerre'], a: 0, why: "Le Conseil constitutionnel peut censurer une loi contraire à la Déclaration de 1789." },
        { q: 'Que signifie la présomption d\'innocence ?', c: ['Toute personne est considérée innocente tant que sa culpabilité n\'a pas été établie par un tribunal', "L'accusé doit prouver son innocence", 'Un innocent ne peut jamais être arrêté', "La police ne peut pas enquêter sans preuve"], a: 0, why: "C'est un principe issu de la Déclaration de 1789, toujours au cœur de la justice française." },
      ],
    },

    {
      key: 'ch09',
      num: 9,
      titre: "L'homme qui rangea la France dans un livre",
      lieu: 'Paris',
      date: '1804',
      minutes: 5,
      html: `
<p>Après la Révolution vient le désordre. Dix ans de coups d'État, de guerres, de gouvernements qui s'écroulent. Le pays est épuisé et cherche quelqu'un qui tienne debout.</p>

<p>Cet homme s'appelle <strong>Napoléon Bonaparte</strong>. Général à vingt-six ans, il prend le pouvoir par un coup d'État en 1799 et se fait sacrer <strong>empereur</strong> en <span class="key">1804</span>. Pendant la cérémonie, il prend la couronne des mains du pape et la pose lui-même sur sa tête. Le geste dit tout : il ne tient son pouvoir de personne.</p>

<p>On retient souvent ses batailles — Austerlitz, puis la retraite de Russie, puis Waterloo en 1815. Mais pour l'examen civique, et franchement pour votre vie quotidienne, ce n'est pas le plus important.</p>

<h4>Le Code civil</h4>

<p>Avant 1804, la France n'a pas <em>un</em> droit : elle en a des centaines. Coutumes du Nord, droit romain du Sud, ordonnances royales, règlements locaux. Un mariage, un héritage, une vente ne se règlent pas de la même façon à Lille et à Toulouse.</p>

<p>Napoléon réunit des juristes et leur demande de tout réécrire dans un seul livre, clair, ordonné, valable partout et pour tout le monde. C'est le <strong>Code civil</strong>, promulgué en <strong>1804</strong>.</p>

<p>Il fixe des principes qui sont encore les vôtres : l'égalité devant la loi, la propriété, le mariage civil (célébré en mairie, pas à l'église), le divorce, les règles de succession, la responsabilité — si vous causez un dommage à autrui, vous devez le réparer.</p>

<p>Napoléon crée aussi ce qui fait encore l'ossature de l'État : les <strong>préfets</strong> dans chaque département, le <strong>Conseil d'État</strong>, la <strong>Cour de cassation</strong>, les <strong>lycées</strong>, le baccalauréat, la <strong>Banque de France</strong>, la <strong>Légion d'honneur</strong>.</p>

<h4>L'ombre au tableau</h4>

<p>Le même homme rétablit l'<strong>esclavage</strong> en 1802, dix ans après son abolition par la Convention. Et le Code civil place la femme mariée sous l'autorité de son mari. Il faudra des décennies pour défaire cela.</p>

<blockquote>Le Code civil est toujours en vigueur. Modifié des milliers de fois, mais jamais remplacé. Quand vous signez un bail, quand vous vous mariez à la mairie, quand vous recevez un héritage : vous appliquez, sans y penser, un texte de 1804.</blockquote>`,
      retenir: [
        "<strong>Napoléon Bonaparte</strong> prend le pouvoir en 1799 et devient <strong>empereur en 1804</strong>.",
        "<strong>1804</strong> — le <strong>Code civil</strong> unifie le droit français : égalité devant la loi, propriété, mariage civil, successions. Il est toujours en vigueur.",
        "Il crée les <strong>préfets</strong>, le <strong>Conseil d'État</strong>, la <strong>Cour de cassation</strong>, les <strong>lycées</strong>, la <strong>Banque de France</strong> et la <strong>Légion d'honneur</strong>.",
        "Il rétablit cependant l'<strong>esclavage en 1802</strong> ; il ne sera définitivement aboli qu'en 1848.",
      ],
      questions: [
        { q: 'Quel texte de 1804 unifie le droit civil français et reste en vigueur aujourd\'hui ?', c: ['Le Code civil', 'La Constitution', 'La Déclaration des droits de l\'homme', 'Le Code du travail'], a: 0, why: "Voulu par Napoléon, il fixe les règles du mariage, de la propriété, des successions et de la responsabilité." },
        { q: 'En quelle année Napoléon Bonaparte est-il devenu empereur ?', c: ['1804', '1789', '1799', '1815'], a: 0, why: "Il prend le pouvoir en 1799 et se fait sacrer empereur en 1804, l'année du Code civil." },
        { q: 'Quelle institution Napoléon a-t-il créée pour représenter l\'État dans chaque département ?', c: ['Le préfet', 'Le maire', 'Le député', 'Le sénateur'], a: 0, why: "Le préfet est nommé par le Président de la République et représente l'État dans le département." },
        { q: 'Quelle décision de Napoléon marque un recul des droits ?', c: ["Le rétablissement de l'esclavage en 1802", "L'abolition des privilèges", 'La création du baccalauréat', "L'unification du droit"], a: 0, why: "L'esclavage, aboli en 1794, est rétabli en 1802 ; son abolition définitive datera de 1848." },
      ],
    },

    {
      key: 'ch10',
      num: 10,
      titre: 'Le printemps où deux libertés arrivèrent ensemble',
      lieu: 'Paris et les colonies',
      date: '1848',
      minutes: 5,
      html: `
<p>Février 1848. Encore une révolution à Paris — la troisième en soixante ans. Le roi Louis-Philippe s'enfuit, et la <strong>Deuxième République</strong> est proclamée.</p>

<p>Ce qui rend cette année-là extraordinaire, c'est ce que le nouveau gouvernement fait en quelques semaines.</p>

<h4>Deux décrets, deux mondes</h4>

<p>Le premier instaure le <strong>suffrage universel masculin</strong>. Jusque-là, on votait selon sa fortune : il fallait payer un certain montant d'impôt pour avoir le droit de voter. Deux cent mille électeurs dans tout le pays. D'un coup, ils sont neuf millions. Un ouvrier vaut désormais autant qu'un banquier dans l'isoloir.</p>

<p>Le second est porté par un homme dont vous devez retenir le nom : <strong>Victor Schœlcher</strong>. Il a passé sa vie à documenter l'esclavage dans les colonies, à écrire, à harceler les gouvernements. En avril 1848, il obtient le décret d'<strong>abolition de l'esclavage</strong>.</p>

<p>Le texte contient une phrase magnifique : « L'esclavage est un attentat contre la dignité humaine. » Et une autre, décisive : nul ne pourra plus posséder d'esclave sur le sol français, ni dans aucune colonie.</p>

<p>Dans les Antilles, à La Réunion, la nouvelle met des semaines à arriver par bateau. Quand elle arrive, on danse dans les rues. Le 27 avril est aujourd'hui la journée nationale des mémoires de la traite, de l'esclavage et de leurs abolitions ; le 10 mai commémore l'abolition en métropole.</p>

<h4>Le mot « universel »</h4>

<p>Il faut être honnête sur ce mot. « Suffrage universel » en 1848, cela veut dire tous les hommes. Les femmes devront attendre <strong>1944</strong> — près d'un siècle de plus. Ce sont deux marches d'un même escalier, montées à un siècle d'écart.</p>

<blockquote>Retenez <strong>1848</strong> comme l'année double : le <strong>suffrage universel masculin</strong> et l'<strong>abolition définitive de l'esclavage</strong>, obtenue grâce à <strong>Victor Schœlcher</strong>. Et retenez que le mot « universel » a mis cent ans à devenir vrai. C'est souvent comme ça que les droits avancent : on écrit le principe d'abord, on l'étend ensuite.</blockquote>`,
      retenir: [
        "<strong>1848</strong> — proclamation de la <strong>Deuxième République</strong>, instauration du <strong>suffrage universel masculin</strong>.",
        "<strong>1848</strong> — <strong>abolition définitive de l'esclavage</strong>, à l'initiative de <strong>Victor Schœlcher</strong>.",
        "Le droit de vote des femmes ne viendra qu'en <strong>1944</strong>.",
      ],
      questions: [
        { q: "Qui est à l'origine du décret d'abolition de l'esclavage de 1848 ?", c: ['Victor Schœlcher', 'Victor Hugo', 'Jules Ferry', 'Léon Gambetta'], a: 0, why: "Son combat aboutit au décret d'avril 1848 : « L'esclavage est un attentat contre la dignité humaine. »" },
        { q: "En quelle année l'esclavage a-t-il été définitivement aboli en France ?", c: ['1848', '1794', '1802', '1889'], a: 0, why: "Aboli une première fois en 1794, il fut rétabli par Napoléon en 1802 avant l'abolition définitive de 1848." },
        { q: 'Quelle avancée démocratique majeure date également de 1848 ?', c: ['Le suffrage universel masculin', 'Le droit de vote des femmes', "L'école gratuite et obligatoire", 'La séparation des Églises et de l\'État'], a: 0, why: "Le vote censitaire, réservé aux plus imposés, disparaît : le nombre d'électeurs passe de 200 000 à 9 millions." },
        { q: 'Quelle République est proclamée en 1848 ?', c: ['La Deuxième République', 'La Première République', 'La Troisième République', 'La Cinquième République'], a: 0, why: "La Première date de 1792, la Deuxième de 1848, la Troisième de 1870, la Quatrième de 1946 et la Cinquième de 1958." },
      ],
    },

    {
      key: 'ch11',
      num: 11,
      titre: "L'école où tout le monde entre",
      lieu: 'Un village de France',
      date: '1881 — 1882',
      minutes: 5,
      html: `
<p>Imaginez un village en 1880. Un enfant de huit ans. Selon qu'il est né dans une famille aisée ou pauvre, en ville ou à la campagne, garçon ou fille, il ira à l'école ou il gardera les vaches. Beaucoup d'adultes, en France, ne savent ni lire ni écrire.</p>

<p>La <strong>Troisième République</strong> vient de naître (1870) et elle a une conviction : une république ne tient que si ses citoyens savent lire, comprendre, juger par eux-mêmes. Un peuple qu'on peut tromper n'est pas un peuple libre.</p>

<p>Le ministre <strong>Jules Ferry</strong> fait voter deux lois.</p>

<p>En <span class="key">1881</span> : l'école primaire publique devient <strong>gratuite</strong>. En <span class="key">1882</span> : elle devient <strong>obligatoire</strong> pour les garçons <em>et</em> les filles, et <strong>laïque</strong>.</p>

<h4>Trois mots, trois décisions</h4>

<p><strong>Gratuite</strong>, parce qu'un droit qui se paie n'est pas un droit pour tous.</p>

<p><strong>Obligatoire</strong>, parce que sinon les enfants pauvres travailleraient. L'obligation protège l'enfant contre sa propre famille et contre l'usine.</p>

<p><strong>Laïque</strong>, parce que l'école publique doit accueillir tous les enfants, quelle que soit la religion de leurs parents. On y enseigne le savoir commun, pas une croyance. C'est la première grande application du principe qui deviendra loi en 1905.</p>

<p>On envoie dans chaque village un instituteur. On les appellera les « hussards noirs de la République », à cause de leur blouse. Ils apprennent à lire, à écrire, à compter — et le français, qui devient la langue de tous alors que beaucoup parlaient encore breton, occitan, alsacien.</p>

<blockquote>L'école obligatoire va aujourd'hui de <strong>3 à 16 ans</strong>, et une formation est obligatoire jusqu'à 18 ans. Elle est toujours gratuite dans le public, toujours laïque. Quand on dit que l'école est « le creuset de la République », c'est de cela qu'on parle : le seul endroit où tous les enfants du pays, quelle que soit leur origine, se retrouvent dans la même salle.</blockquote>`,
      retenir: [
        "<strong>Jules Ferry</strong>, ministre de la Troisième République, rend l'école primaire <strong>gratuite (1881)</strong> puis <strong>obligatoire et laïque (1882)</strong>.",
        "L'école est obligatoire pour les filles comme pour les garçons.",
        "Aujourd'hui, l'instruction est obligatoire de <strong>3 à 16 ans</strong> ; l'école publique est gratuite et laïque.",
      ],
      questions: [
        { q: "Qui a rendu l'école primaire gratuite, obligatoire et laïque ?", c: ['Jules Ferry', 'Victor Schœlcher', 'Jules Grévy', 'Léon Blum'], a: 0, why: "Les lois de 1881 (gratuité) et 1882 (obligation et laïcité) portent son nom." },
        { q: "Quels sont les trois caractères de l'école publique instaurés au début des années 1880 ?", c: ['Gratuite, obligatoire et laïque', 'Payante, facultative et religieuse', 'Gratuite, facultative et religieuse', 'Obligatoire, mixte et professionnelle'], a: 0, why: "Ces trois principes fondent l'école républicaine, encore aujourd'hui." },
        { q: "Entre quels âges l'instruction est-elle obligatoire en France aujourd'hui ?", c: ['De 3 à 16 ans', 'De 6 à 16 ans', 'De 3 à 18 ans', 'De 6 à 14 ans'], a: 0, why: "L'instruction est obligatoire dès 3 ans, et une obligation de formation court jusqu'à 18 ans." },
        { q: "Pourquoi la Troisième République a-t-elle fait de l'école une priorité ?", c: ["Parce qu'une république a besoin de citoyens instruits, capables de juger par eux-mêmes", "Pour former des soldats", 'Pour remplacer les Églises', "Pour supprimer les langues régionales"], a: 0, why: "L'école devait donner à chacun les moyens d'exercer sa citoyenneté." },
      ],
    },

    {
      key: 'ch12',
      num: 12,
      titre: 'La loi qui mit chacun à sa place',
      lieu: 'Paris, Assemblée nationale',
      date: '9 décembre 1905',
      minutes: 6,
      html: `
<p>Il faut revenir en arrière un instant. Depuis Clovis, l'Église catholique et l'État français vivent ensemble. Le roi est sacré à Reims. Sous Napoléon, un accord — le Concordat — fait de l'État le payeur des prêtres et des évêques. L'état civil, les écoles, les hôpitaux : partout l'Église est présente.</p>

<p>À la fin du XIX<sup>e</sup> siècle, cette cohabitation devient une guerre. Les républicains reprochent à l'Église son influence ; les catholiques accusent la République de persécution. Le pays se déchire, village par village, famille par famille.</p>

<p>Le <span class="key">9 décembre 1905</span>, une loi tranche. Elle est courte et elle est célèbre.</p>

<h4>Les deux premiers articles</h4>

<p><strong>Article 1</strong> : « La République assure la <strong>liberté de conscience</strong>. Elle garantit le <strong>libre exercice des cultes</strong>. »</p>

<p><strong>Article 2</strong> : « La République ne reconnaît, ne salarie ni ne subventionne aucun culte. »</p>

<p>Lisez-les dans l'ordre, c'est important. La loi commence par <em>garantir</em>, pas par interdire. Elle dit d'abord : croyez ce que vous voulez, pratiquez, changez de religion, n'en ayez aucune — l'État vous protège. Puis elle ajoute : et l'État, lui, n'en prend aucune. Il ne finance aucun culte, n'en privilégie aucun, n'en combat aucun.</p>

<p>C'est cela, la <strong>laïcité</strong>. Ce n'est pas l'absence de religion : c'est la <strong>neutralité de l'État</strong> et la <strong>liberté des personnes</strong>.</p>

<h4>Ce que cela veut dire pour vous, concrètement</h4>

<ul>
  <li>Vous pouvez croire ou ne pas croire, pratiquer ou non, changer de religion. Personne ne peut vous y contraindre ni vous en empêcher.</li>
  <li>Les <strong>agents publics</strong> — enseignants, employés de mairie, policiers, agents hospitaliers — doivent être <strong>neutres</strong> pendant leur service : pas de signe religieux, pas de prosélytisme. Cette neutralité protège les usagers.</li>
  <li>Dans les <strong>écoles, collèges et lycées publics</strong>, les élèves ne peuvent pas porter de signes religieux ostensibles (loi de 2004).</li>
  <li>Dans la rue, vous êtes libre. La laïcité ne s'impose pas aux personnes privées dans l'espace public — sauf la dissimulation du visage, interdite depuis 2010.</li>
  <li>Aucune règle religieuse ne peut primer sur la loi de la République.</li>
</ul>

<blockquote>Souvenez-vous du fil : <strong>1598</strong>, Henri IV essaie de faire cohabiter deux religions. <strong>1685</strong>, Louis XIV renonce. <strong>1882</strong>, l'école devient laïque. <strong>1905</strong>, l'État se sépare des Églises. Trois siècles pour trouver une réponse. La laïcité est inscrite dès l'<strong>article 1<sup>er</sup> de la Constitution</strong> : « La France est une République indivisible, <strong>laïque</strong>, démocratique et sociale. »</blockquote>`,
      retenir: [
        "<strong>9 décembre 1905</strong> — loi de <strong>séparation des Églises et de l'État</strong>.",
        "Elle garantit la <strong>liberté de conscience</strong> et le <strong>libre exercice des cultes</strong> ; l'État ne reconnaît, ne salarie ni ne subventionne aucun culte.",
        "La <strong>laïcité</strong> n'est pas l'absence de religion : c'est la neutralité de l'État et la liberté de croire ou de ne pas croire.",
        "Les <strong>agents publics</strong> sont tenus à la neutralité ; les signes religieux ostensibles sont interdits aux élèves des écoles publiques (loi de 2004).",
        "La laïcité figure à l'<strong>article 1<sup>er</sup> de la Constitution</strong>.",
      ],
      questions: [
        { q: 'De quand date la loi de séparation des Églises et de l\'État ?', c: ['1905', '1882', '1789', '1958'], a: 0, why: "La loi du 9 décembre 1905 fonde la laïcité française." },
        { q: 'Que signifie la laïcité en France ?', c: ["La neutralité de l'État et la liberté de croire ou de ne pas croire", "L'interdiction de toute religion", "L'obligation d'être athée", "La reconnaissance d'une religion officielle"], a: 0, why: "La loi de 1905 garantit d'abord la liberté de conscience, puis pose la neutralité de l'État." },
        { q: "Un agent public (enseignant, agent de mairie) peut-il porter un signe religieux pendant son service ?", c: ['Non, il est tenu à la neutralité', 'Oui, sans restriction', 'Oui, s\'il est discret', 'Cela dépend de la commune'], a: 0, why: "L'obligation de neutralité des agents publics protège l'égalité de traitement des usagers." },
        { q: "Dans quel article de la Constitution la laïcité est-elle inscrite ?", c: ["L'article 1er", "L'article 2", "L'article 5", "Le préambule uniquement"], a: 0, why: "« La France est une République indivisible, laïque, démocratique et sociale. »" },
      ],
    },

    {
      key: 'ch13',
      num: 13,
      titre: 'Onze heures, le onzième jour',
      lieu: 'Un wagon dans la forêt de Compiègne',
      date: '11 novembre 1918',
      minutes: 5,
      html: `
<p>Août 1914. Les hommes partent la fleur au fusil, on leur dit qu'ils rentreront pour Noël. Ils rentreront quatre ans et demi plus tard, ou pas du tout.</p>

<p>La <strong>Première Guerre mondiale</strong> invente une horreur que personne n'avait imaginée : la guerre de tranchées. Des hommes qui vivent des mois dans la boue, sous les obus, à quelques dizaines de mètres de l'ennemi. À Verdun, en 1916, la bataille dure trois cents jours.</p>

<p>On les appellera les <strong>Poilus</strong>. Ils viennent de toute la France, et aussi des colonies : tirailleurs sénégalais, soldats algériens, marocains, indochinois. Beaucoup ne parlent pas la même langue et se battent côte à côte.</p>

<p>Le <span class="key">11 novembre 1918</span>, à cinq heures du matin, dans un wagon de chemin de fer garé dans la forêt de Compiègne, on signe l'<strong>armistice</strong>. Il prend effet à onze heures.</p>

<p>À onze heures précises, sur des centaines de kilomètres de front, le bruit s'arrête. Des soldats racontent que ce silence était plus terrifiant que le canon.</p>

<p>La France compte près d'<strong>1,4 million de morts</strong>. Il n'y a pas un village en France sans monument aux morts. Regardez-en un, la prochaine fois : la liste des noms est souvent plus longue que le nombre d'habitants actuels.</p>

<h4>Et vingt et un ans plus tard</h4>

<p>La paix ne tient pas. En 1939, la <strong>Seconde Guerre mondiale</strong> commence. En mai-juin 1940, l'armée française s'effondre en six semaines. C'est le sujet du chapitre suivant.</p>

<blockquote>Deux dates de commémoration nationale, à ne pas confondre : le <strong>11 novembre</strong>, armistice de 1918, hommage à tous les morts pour la France ; le <strong>8 mai</strong>, victoire de 1945 et fin de la Seconde Guerre mondiale en Europe. Ce sont des jours fériés, et dans chaque commune le maire dépose une gerbe devant le monument aux morts.</blockquote>`,
      retenir: [
        "<strong>1914-1918</strong> — Première Guerre mondiale. L'<strong>armistice</strong> est signé le <strong>11 novembre 1918</strong>.",
        "Près de <strong>1,4 million de Français</strong> sont morts ; les soldats sont surnommés les <strong>Poilus</strong>.",
        "Le <strong>11 novembre</strong> est un jour férié qui rend hommage aux morts pour la France ; le <strong>8 mai</strong> commémore la victoire de 1945.",
      ],
      questions: [
        { q: 'Que commémore le 11 novembre ?', c: ["L'armistice de 1918, fin de la Première Guerre mondiale", 'La victoire de 1945', 'La prise de la Bastille', "L'appel du général de Gaulle"], a: 0, why: "L'armistice a été signé le 11 novembre 1918 dans la forêt de Compiègne." },
        { q: 'Que commémore le 8 mai ?', c: ['La victoire de 1945 et la fin de la Seconde Guerre mondiale en Europe', "L'armistice de 1918", 'La fête du travail', 'La fête nationale'], a: 0, why: "Le 8 mai 1945 marque la capitulation de l'Allemagne nazie." },
        { q: 'Quelles sont les dates de la Première Guerre mondiale ?', c: ['1914-1918', '1939-1945', '1870-1871', '1905-1914'], a: 0, why: "La Seconde Guerre mondiale, elle, se déroule de 1939 à 1945." },
        { q: 'Comment surnommait-on les soldats français de la Première Guerre mondiale ?', c: ['Les Poilus', 'Les Sans-culottes', 'Les Hussards noirs', 'Les Communards'], a: 0, why: "Ils vécurent des années dans les tranchées, dans des conditions extrêmes." },
      ],
    },

    {
      key: 'ch14',
      num: 14,
      titre: 'La voix dans le poste',
      lieu: 'Londres, studio de la BBC',
      date: '18 juin 1940',
      minutes: 6,
      html: `
<p>Juin 1940. En six semaines, l'armée allemande a traversé la France. Des millions de civils fuient sur les routes. Le 17 juin, le maréchal Pétain annonce à la radio qu'il faut cesser le combat.</p>

<p>Le lendemain, à Londres, un général presque inconnu s'assied devant un micro de la BBC. Il s'appelle <strong>Charles de Gaulle</strong>. Il a quitté la France la veille dans un petit avion. Il n'a aucune troupe, aucun mandat, aucune légitimité officielle.</p>

<p>Le <span class="key">18 juin 1940</span>, il dit à peu près ceci : la France a perdu une bataille, elle n'a pas perdu la guerre. Cette guerre est mondiale. Rien n'est joué. Et il appelle les Français qui le peuvent à le rejoindre pour continuer le combat.</p>

<p>Très peu de gens l'ont entendu ce soir-là. C'est un appel presque sans public. Mais le texte est reproduit, affiché, recopié — et il devient le point de départ de la <strong>France libre</strong> et de la <strong>Résistance</strong>.</p>

<h4>Ceux qui sont restés</h4>

<p>En France, le régime de Vichy collabore avec l'occupant. Il promulgue ses propres lois antisémites, organise des rafles. En juillet 1942, la rafle du Vél' d'Hiv envoie plus de treize mille juifs, dont plus de quatre mille enfants, vers les camps d'extermination. Environ <strong>76 000 juifs</strong> ont été déportés de France ; très peu sont revenus.</p>

<p>Face à cela, des femmes et des hommes ordinaires désobéissent. Ils cachent des enfants, transportent des messages, font sauter des voies ferrées, impriment des journaux clandestins. Beaucoup sont arrêtés, torturés, fusillés.</p>

<p><strong>Jean Moulin</strong> est celui qui parvient à unifier les mouvements de résistance, dispersés et rivaux, en un seul Conseil national de la Résistance. Arrêté en 1943, torturé, il meurt sans avoir parlé. Il repose au Panthéon.</p>

<p>La France est libérée en 1944, après le débarquement de Normandie du 6 juin. La guerre se termine en Europe le <strong>8 mai 1945</strong>.</p>

<blockquote>Cette période explique beaucoup de choses de la France d'aujourd'hui. Elle explique pourquoi le <strong>racisme, l'antisémitisme et la négation des crimes contre l'humanité</strong> ne sont pas des opinions mais des délits punis par la loi. Elle explique la Sécurité sociale, créée en 1945 par le programme de la Résistance. Et elle explique la construction européenne : après deux guerres en trente ans, la France et l'Allemagne ont décidé de lier leurs économies pour rendre la guerre impossible.</blockquote>`,
      retenir: [
        "<strong>18 juin 1940</strong> — le général <strong>Charles de Gaulle</strong> lance depuis Londres l'<strong>Appel</strong> à poursuivre le combat : c'est l'acte fondateur de la France libre et de la Résistance.",
        "<strong>Jean Moulin</strong> unifie les mouvements de résistance ; arrêté et torturé, il meurt en 1943.",
        "Le régime de Vichy collabore ; environ <strong>76 000 juifs</strong> sont déportés de France.",
        "<strong>6 juin 1944</strong> : débarquement de Normandie. <strong>8 mai 1945</strong> : victoire et fin de la guerre en Europe.",
        "La <strong>Sécurité sociale</strong> est créée en 1945, issue du programme du Conseil national de la Résistance.",
      ],
      questions: [
        { q: "Qui a lancé l'Appel du 18 juin 1940 ?", c: ['Le général Charles de Gaulle', 'Le maréchal Pétain', 'Jean Moulin', 'Georges Clemenceau'], a: 0, why: "Depuis Londres, il appelle les Français à refuser la défaite et à poursuivre le combat." },
        { q: "Depuis quelle ville l'Appel du 18 juin a-t-il été lancé ?", c: ['Londres', 'Paris', 'Alger', 'Vichy'], a: 0, why: "De Gaulle avait rejoint Londres la veille et parla au micro de la BBC." },
        { q: 'Quel résistant a unifié les mouvements de la Résistance française ?', c: ['Jean Moulin', 'Victor Schœlcher', 'Léon Blum', 'Jules Ferry'], a: 0, why: "Il crée le Conseil national de la Résistance en 1943 ; arrêté et torturé, il meurt la même année." },
        { q: 'Quelle institution majeure est créée en 1945 à la sortie de la guerre ?', c: ['La Sécurité sociale', 'La Banque de France', 'Le Conseil constitutionnel', 'Les préfets'], a: 0, why: "Issue du programme du Conseil national de la Résistance, elle protège contre la maladie, la vieillesse et les accidents du travail." },
      ],
    },

    {
      key: 'ch15',
      num: 15,
      titre: 'La Constitution qui tient depuis',
      lieu: 'Paris',
      date: '4 octobre 1958',
      minutes: 6,
      html: `
<p>1958. La Quatrième République est à bout de souffle. En douze ans, elle a usé vingt-quatre gouvernements — un tous les six mois. La guerre d'Algérie déchire le pays. En mai, l'armée se soulève à Alger. On craint un coup d'État militaire sur Paris.</p>

<p>On rappelle <strong>Charles de Gaulle</strong>, retiré de la vie politique depuis douze ans. Il pose ses conditions : les pleins pouvoirs pour six mois, et le droit d'écrire une nouvelle constitution.</p>

<p>Le texte est soumis au peuple par <strong>référendum</strong> et approuvé à près de 80 %. La <strong>Constitution du <span class="key">4 octobre 1958</span></strong> fonde la <strong>Cinquième République</strong> — celle dans laquelle vous vivez aujourd'hui.</p>

<h4>L'idée centrale : un exécutif fort</h4>

<p>De Gaulle veut l'inverse de ce qui vient d'échouer. Le <strong>Président de la République</strong> devient la clé de voûte des institutions. Depuis 1962, il est élu <strong>au suffrage universel direct</strong> par tous les citoyens, pour <strong>cinq ans</strong> (le quinquennat, depuis 2000), renouvelable une seule fois consécutivement.</p>

<h4>Qui fait quoi</h4>

<ul>
  <li>Le <strong>Président de la République</strong> : chef de l'État, chef des armées, nomme le Premier ministre, peut dissoudre l'Assemblée nationale, promulgue les lois. Il siège à l'<strong>Élysée</strong>.</li>
  <li>Le <strong>Gouvernement</strong>, dirigé par le <strong>Premier ministre</strong> (à <strong>Matignon</strong>), détermine et conduit la politique de la nation. C'est le <strong>pouvoir exécutif</strong>.</li>
  <li>Le <strong>Parlement</strong> vote la loi et contrôle le gouvernement. C'est le <strong>pouvoir législatif</strong>. Il a deux chambres :
    <ul>
      <li>l'<strong>Assemblée nationale</strong> (Palais Bourbon) : <strong>577 députés</strong> élus au suffrage universel direct pour 5 ans ;</li>
      <li>le <strong>Sénat</strong> (Palais du Luxembourg) : <strong>348 sénateurs</strong> élus au suffrage indirect pour 6 ans par de grands électeurs.</li>
    </ul>
  </li>
  <li>Le <strong>pouvoir judiciaire</strong> est indépendant : les juges appliquent la loi sans recevoir d'ordre du gouvernement.</li>
  <li>Le <strong>Conseil constitutionnel</strong> vérifie que les lois respectent la Constitution. Il peut les annuler.</li>
</ul>

<p>Vous reconnaissez la mécanique ? C'est Montesquieu, deux cent dix ans plus tard : trois pouvoirs séparés qui se surveillent.</p>

<h4>L'article premier</h4>

<p>« La France est une République <strong>indivisible, laïque, démocratique et sociale</strong>. Elle assure l'égalité devant la loi de tous les citoyens sans distinction d'origine, de race ou de religion. Elle respecte toutes les croyances. »</p>

<blockquote>Quatre mots à retenir par cœur : <strong>indivisible</strong> (une seule République, un seul peuple, un seul droit sur tout le territoire), <strong>laïque</strong> (l'État est neutre, chacun est libre de croire), <strong>démocratique</strong> (le pouvoir vient du peuple), <strong>sociale</strong> (la République protège : santé, retraite, éducation, solidarité). Et la devise, à l'article 2 : <strong>Liberté, Égalité, Fraternité</strong>.</blockquote>`,
      retenir: [
        "<strong>4 octobre 1958</strong> — la <strong>Constitution</strong> fonde la <strong>Cinquième République</strong>, à l'initiative de <strong>Charles de Gaulle</strong>.",
        "<strong>Article 1<sup>er</sup></strong> : « La France est une République <strong>indivisible, laïque, démocratique et sociale</strong>. »",
        "Le <strong>Président</strong> est élu au suffrage universel direct pour <strong>5 ans</strong> depuis 2000 (élection directe depuis 1962).",
        "<strong>Assemblée nationale</strong> : 577 députés élus pour 5 ans. <strong>Sénat</strong> : 348 sénateurs élus pour 6 ans au suffrage indirect.",
        "Le <strong>Conseil constitutionnel</strong> contrôle la conformité des lois à la Constitution.",
      ],
      questions: [
        { q: 'De quand date la Constitution de la Cinquième République ?', c: ['Du 4 octobre 1958', 'Du 14 juillet 1789', 'Du 27 octobre 1946', 'Du 9 décembre 1905'], a: 0, why: "Adoptée par référendum, elle fonde la Cinquième République, toujours en vigueur." },
        { q: "Comment l'article 1er de la Constitution qualifie-t-il la République française ?", c: ['Indivisible, laïque, démocratique et sociale', 'Libre, égale, fraternelle et solidaire', 'Souveraine, laïque, européenne et sociale', 'Une, indivisible et catholique'], a: 0, why: "Ces quatre adjectifs résument les principes fondamentaux de la République." },
        { q: 'Quelle est la durée du mandat du Président de la République ?', c: ['5 ans', '7 ans', '4 ans', '6 ans'], a: 0, why: "Le quinquennat a remplacé le septennat à la suite du référendum de 2000." },
        { q: 'Combien de députés siègent à l\'Assemblée nationale ?', c: ['577', '348', '500', '925'], a: 0, why: "Les 577 députés sont élus au suffrage universel direct pour cinq ans ; le Sénat compte 348 sénateurs." },
      ],
    },

    {
      key: 'ch16',
      num: 16,
      titre: 'Quatre lois, quatre verrous qui sautent',
      lieu: 'Paris, Assemblée nationale',
      date: '1944 — 2013',
      minutes: 6,
      html: `
<p>La Cinquième République est en place. On pourrait croire l'histoire finie. Elle ne l'est pas : le plus intéressant commence. Parce que « liberté, égalité, fraternité » est une promesse, et qu'une promesse, il faut la tenir morceau par morceau.</p>

<p>Voici quatre moments où un verrou a sauté. À chaque fois, la même mécanique : une injustice que tout le monde trouvait normale, une personne qui refuse, un débat violent, une loi.</p>

<h4>1944 — les femmes votent</h4>

<p>Cent ans après le « suffrage universel » de 1848, une ordonnance d'avril <span class="key">1944</span> accorde enfin aux femmes le <strong>droit de vote et d'éligibilité</strong>. Elles votent pour la première fois en avril 1945, aux municipales. La France est en retard : la Nouvelle-Zélande l'avait fait en 1893.</p>

<h4>1975 — le corps des femmes</h4>

<p>Novembre 1974. Une femme monte à la tribune de l'Assemblée, face à un hémicycle presque entièrement masculin. Elle s'appelle <strong>Simone Veil</strong>, elle est ministre de la Santé, elle est rescapée d'Auschwitz. Elle défend une loi autorisant l'interruption volontaire de grossesse.</p>

<p>Les débats durent vingt-cinq heures. Elle est insultée. La loi passe, promulguée en janvier <strong>1975</strong>. En <strong>2024</strong>, la liberté de recourir à l'IVG est inscrite dans la <strong>Constitution</strong> — la France est le premier pays au monde à le faire. Simone Veil repose au Panthéon.</p>

<h4>1981 — la peine de mort</h4>

<p>Un autre ministre, <strong>Robert Badinter</strong>, garde des Sceaux, monte à la même tribune. Il a vu deux de ses clients guillotinés. Il dit : « J'ai l'honneur, au nom du gouvernement de la République, de demander à l'Assemblée nationale l'<strong>abolition de la peine de mort</strong> en France. »</p>

<p>Une large majorité des Français y est alors opposée. La loi est votée quand même, en <strong>1981</strong>. Depuis 2007, l'abolition est inscrite dans la Constitution.</p>

<h4>2013 — le mariage</h4>

<p>La loi du 17 mai <strong>2013</strong> ouvre le <strong>mariage aux couples de personnes de même sexe</strong>. La France devient le quatorzième pays au monde à le faire.</p>

<blockquote>Regardez ce que ces quatre lois ont en commun. Aucune n'était consensuelle. Toutes ont été portées par quelqu'un qui a accepté d'être détesté. Et toutes paraissent aujourd'hui évidentes. C'est exactement ce que veut dire « la loi est l'expression de la volonté générale » : ce n'est pas un sondage figé, c'est une conversation qui continue — et à laquelle, une fois naturalisé, vous participerez avec votre bulletin de vote.</blockquote>`,
      retenir: [
        "<strong>1944</strong> — les <strong>femmes</strong> obtiennent le droit de vote et d'éligibilité ; premier vote en 1945.",
        "<strong>1975</strong> — loi <strong>Simone Veil</strong> autorisant l'IVG ; cette liberté est inscrite dans la <strong>Constitution en 2024</strong>.",
        "<strong>1981</strong> — <strong>abolition de la peine de mort</strong>, portée par <strong>Robert Badinter</strong> ; constitutionnalisée en 2007.",
        "<strong>2013</strong> — ouverture du <strong>mariage aux couples de même sexe</strong>.",
      ],
      questions: [
        { q: 'En quelle année les femmes ont-elles obtenu le droit de vote en France ?', c: ['1944', '1848', '1918', '1975'], a: 0, why: "L'ordonnance d'avril 1944 leur accorde le droit de vote et d'éligibilité ; elles votent pour la première fois en 1945." },
        { q: 'Qui a porté la loi de 1975 autorisant l\'interruption volontaire de grossesse ?', c: ['Simone Veil', 'Robert Badinter', 'Marie Curie', 'Olympe de Gouges'], a: 0, why: "Ministre de la Santé et rescapée d'Auschwitz, elle défendit la loi devant une assemblée hostile." },
        { q: 'Qui a porté l\'abolition de la peine de mort en 1981 ?', c: ['Robert Badinter', 'Simone Veil', 'Jules Ferry', 'Victor Schœlcher'], a: 0, why: "Garde des Sceaux, il obtint le vote de l'abolition malgré une opinion majoritairement hostile." },
        { q: 'En quelle année le mariage a-t-il été ouvert aux couples de même sexe ?', c: ['2013', '1999', '2005', '2024'], a: 0, why: "La loi du 17 mai 2013 ; le PACS, lui, datait de 1999." },
      ],
    },
  ],
};
