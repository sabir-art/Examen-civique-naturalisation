/**
 * « La France racontée » — Acte III : La France d'aujourd'hui.
 *
 * L'histoire rejoint le présent. Chaque chapitre se passe dans un lieu ordinaire
 * — une mairie, un bureau de vote, une salle de classe, un tribunal — et montre
 * comment ce qui a été raconté dans les deux premiers actes s'y applique.
 */

export default {
  key: 'acte-3',
  num: 'III',
  titre: "La France d'aujourd'hui",
  sous_titre: 'Ce que tout cela veut dire, concrètement, pour vous',
  epoque: "Aujourd'hui",
  icon: 'star',
  chapitres: [
    {
      key: 'ch17',
      num: 17,
      titre: 'Trois mots au-dessus de la porte',
      lieu: 'La mairie de votre commune',
      date: "Aujourd'hui",
      minutes: 5,
      html: `
<p>Vous montez quelques marches. Au-dessus de la porte, il y a un drapeau bleu blanc rouge, et gravés dans la pierre, trois mots : <strong>Liberté, Égalité, Fraternité</strong>.</p>

<p>Vous les avez vus mille fois. Maintenant vous savez d'où ils viennent — de 1789, de Rousseau, de deux siècles de disputes. Mais que veulent-ils dire quand on pousse la porte ?</p>

<h4>Liberté</h4>

<p>Vous pouvez penser ce que vous voulez, croire ou ne pas croire, dire, écrire, publier, vous réunir, créer une association, adhérer à un syndicat, manifester, aller et venir. La limite est simple et vient de la Déclaration de 1789 : votre liberté s'arrête là où elle nuit à autrui. Injurier, diffamer, appeler à la haine ou à la violence ne sont pas des opinions : ce sont des délits.</p>

<h4>Égalité</h4>

<p>Devant la loi, tout le monde est égal, sans distinction d'origine, de sexe, de religion, de handicap, d'orientation sexuelle. Une femme et un homme ont les mêmes droits, y compris le même salaire pour le même travail. La <strong>discrimination</strong> est punie par la loi.</p>

<h4>Fraternité</h4>

<p>C'est le mot le plus discret et le plus concret. Il veut dire que la République protège ceux qui en ont besoin : l'assurance maladie, les retraites, les allocations familiales, le RSA, l'école gratuite, l'aide au logement. Chacun contribue selon ses moyens, chacun reçoit selon ses besoins. La <strong>solidarité</strong> n'est pas de la charité : c'est un droit organisé.</p>

<h4>Les autres symboles</h4>

<ul>
  <li>Le <strong>drapeau tricolore</strong> : bleu et rouge, les couleurs de Paris ; blanc, la couleur du roi. Né en 1789 comme un signe de réconciliation.</li>
  <li><strong>« La Marseillaise »</strong>, hymne national. Écrit en 1792 par Rouget de Lisle à Strasbourg comme chant de guerre pour l'armée du Rhin ; adopté par des volontaires marseillais montés à Paris, d'où son nom.</li>
  <li><strong>Marianne</strong>, figure de la République, coiffée du bonnet phrygien — le bonnet des esclaves affranchis à Rome. Son buste est dans toutes les mairies.</li>
  <li>Le <strong>14 juillet</strong>, fête nationale.</li>
  <li>Le <strong>coq gaulois</strong>, emblème sportif et populaire.</li>
</ul>

<h4>Ce que fait la mairie</h4>

<p>La <strong>commune</strong> est la plus petite et la plus proche des collectivités. Le <strong>maire</strong> est élu par le conseil municipal, lui-même élu par les habitants pour <strong>six ans</strong>. Il est à la fois élu de la commune et représentant de l'État.</p>

<p>À la mairie, vous déclarez une naissance, vous vous mariez, vous reconnaissez un enfant, vous demandez un acte d'état civil, vous inscrivez votre enfant à l'école, vous vous inscrivez sur les listes électorales. C'est aussi là que se tient, le plus souvent, la <strong>cérémonie d'accueil dans la citoyenneté française</strong>, où l'on remet aux nouveaux citoyens leur décret de naturalisation, la Déclaration des droits de l'homme et la Marseillaise.</p>

<blockquote>La France compte environ <strong>35 000 communes</strong>, <strong>101 départements</strong> (dont 5 d'outre-mer) et <strong>18 régions</strong>. Trois échelons, trois assemblées élues : conseil municipal, conseil départemental, conseil régional.</blockquote>`,
      retenir: [
        "Devise : <strong>Liberté, Égalité, Fraternité</strong> (article 2 de la Constitution).",
        "Symboles : <strong>drapeau tricolore</strong>, <strong>« La Marseillaise »</strong> (Rouget de Lisle, 1792), <strong>Marianne</strong> au bonnet phrygien, le <strong>14 juillet</strong>, le coq.",
        "La <strong>commune</strong> est dirigée par le <strong>maire</strong>, élu pour <strong>6 ans</strong> par le conseil municipal ; il gère l'état civil, les écoles primaires, les listes électorales.",
        "Environ <strong>35 000 communes</strong>, <strong>101 départements</strong>, <strong>18 régions</strong>.",
      ],
      questions: [
        { q: 'Quelle est la devise de la République française ?', c: ['Liberté, Égalité, Fraternité', 'Un peuple, un État, une nation', 'Honneur et Patrie', 'Travail, Famille, Patrie'], a: 0, why: "Elle figure à l'article 2 de la Constitution et sur le fronton des bâtiments publics." },
        { q: "Qui a composé « La Marseillaise » ?", c: ["Rouget de Lisle", "Victor Hugo", "Hector Berlioz", "Jean-Jacques Rousseau"], a: 0, why: "Écrit à Strasbourg en 1792, ce chant fut repris par des volontaires marseillais, d'où son nom." },
        { q: 'Que représente Marianne ?', c: ['La République française', 'La première reine de France', 'La ville de Paris', "La déesse de la justice"], a: 0, why: "Coiffée du bonnet phrygien, son buste est présent dans toutes les mairies." },
        { q: 'Pour combien de temps le conseil municipal est-il élu ?', c: ['6 ans', '5 ans', '4 ans', '7 ans'], a: 0, why: "Les conseillers municipaux élisent ensuite le maire parmi eux." },
      ],
    },

    {
      key: 'ch18',
      num: 18,
      titre: 'Le rideau de la cabine',
      lieu: "Un bureau de vote, un dimanche matin",
      date: "Aujourd'hui",
      minutes: 6,
      html: `
<p>Une salle des fêtes ou une école. Des tables, une urne transparente, des piles d'enveloppes et de bulletins. Des gens en pantoufles qui font la queue en silence.</p>

<p>Vous prenez au moins deux bulletins — c'est la règle, pour que personne ne devine votre choix — et une enveloppe. Vous entrez dans l'isoloir. Vous tirez le rideau.</p>

<p>Là, derrière ce rideau, il se passe quelque chose que trois mille ans d'histoire ont rendu possible : pendant quelques secondes, vous ne devez de comptes à personne. Ni à votre patron, ni à votre famille, ni à votre voisin, ni à l'État. C'est le <strong>secret du vote</strong>, et c'est ce qui le rend libre.</p>

<p>Vous sortez, vous présentez votre pièce d'identité et votre carte d'électeur, l'assesseur dit « a voté », vous signez.</p>

<h4>Les règles du vote</h4>

<p>Le vote est un <strong>droit</strong>, et en France un <strong>devoir civique</strong> — mais il n'est pas obligatoire, sauf pour les sénateurs qui doivent voter aux élections sénatoriales. Il est <strong>universel</strong> (tous les citoyens majeurs), <strong>égal</strong> (une personne, une voix), <strong>secret</strong> et <strong>libre</strong>.</p>

<p>Pour voter, il faut : être <strong>français</strong>, avoir <strong>18 ans</strong> révolus, jouir de ses droits civils et politiques, et être <strong>inscrit sur les listes électorales</strong>.</p>

<p>Une exception importante : les citoyens de l'Union européenne résidant en France peuvent voter aux élections <strong>municipales</strong> et <strong>européennes</strong>, mais pas aux présidentielles ni aux législatives.</p>

<h4>Qui élit-on, et pour combien de temps</h4>

<ul>
  <li><strong>Présidentielle</strong> : le Président de la République, pour <strong>5 ans</strong>, au suffrage universel <strong>direct</strong>, scrutin à deux tours.</li>
  <li><strong>Législatives</strong> : les <strong>577 députés</strong> de l'Assemblée nationale, pour 5 ans, au suffrage direct.</li>
  <li><strong>Sénatoriales</strong> : les <strong>348 sénateurs</strong>, pour 6 ans, au suffrage <strong>indirect</strong> (par de grands électeurs).</li>
  <li><strong>Municipales</strong> : les conseillers municipaux, pour 6 ans.</li>
  <li><strong>Départementales</strong> et <strong>régionales</strong> : pour 6 ans.</li>
  <li><strong>Européennes</strong> : les députés français au Parlement européen, pour 5 ans.</li>
</ul>

<p>Il existe aussi le <strong>référendum</strong> : on ne choisit pas une personne, on répond oui ou non à une question. C'est ainsi qu'a été adoptée la Constitution de 1958.</p>

<blockquote>Le jour où vous serez naturalisé, vous pourrez vous inscrire sur les listes électorales de votre commune. C'est la fin du chemin qui a commencé à Alésia et le début du vôtre : ce bulletin plié en quatre, c'est la part de souveraineté qui vous revient. « La souveraineté nationale appartient au peuple, qui l'exerce par ses représentants et par la voie du référendum » — article 3 de la Constitution.</blockquote>`,
      retenir: [
        "Le vote est <strong>universel, égal, secret et libre</strong>. C'est un droit et un <strong>devoir civique</strong>, mais il n'est pas obligatoire.",
        "Conditions : être <strong>français</strong>, avoir <strong>18 ans</strong>, jouir de ses droits civiques, être <strong>inscrit sur les listes électorales</strong>.",
        "Les citoyens de l'<strong>Union européenne</strong> résidant en France votent aux élections <strong>municipales et européennes</strong> seulement.",
        "Président : 5 ans, suffrage <strong>direct</strong>. Députés : 5 ans, direct. Sénateurs : 6 ans, suffrage <strong>indirect</strong>. Municipales, départementales, régionales : 6 ans.",
      ],
      questions: [
        { q: 'Quelles sont les conditions pour voter en France ?', c: ["Être français, majeur, jouir de ses droits civiques et être inscrit sur les listes", "Avoir seize ans révolus et résider en France depuis plus d'une année complète", "Payer des impôts en France sur ses revenus du travail", "Être né sur le territoire de la République"], a: 0, why: "L'inscription sur les listes électorales de sa commune est indispensable." },
        { q: 'À quelles élections un citoyen européen résidant en France peut-il voter ?', c: ['Aux élections municipales et européennes', 'À toutes les élections', "À l'élection présidentielle uniquement", 'À aucune élection'], a: 0, why: "Les élections présidentielle et législatives sont réservées aux citoyens français." },
        { q: 'Comment les sénateurs sont-ils élus ?', c: ["Au suffrage universel indirect, par de grands électeurs", "Au suffrage universel direct, par tous les électeurs", "Ils sont nommés par le Président", "Ils sont tirés au sort"], a: 0, why: "Les sénateurs sont élus pour six ans par un collège de grands électeurs, majoritairement des élus locaux." },
        { q: 'Quelles sont les caractéristiques du vote en France ?', c: ['Universel, égal, secret et libre', 'Obligatoire, public et payant', 'Réservé aux contribuables', 'Indirect et nominatif'], a: 0, why: "Le secret du vote, garanti par l'isoloir et l'enveloppe, en assure la liberté." },
      ],
    },

    {
      key: 'ch19',
      num: 19,
      titre: 'Une salle de classe, un lundi matin',
      lieu: 'Une école publique',
      date: "Aujourd'hui",
      minutes: 5,
      html: `
<p>Trente enfants dans une salle. Leurs parents sont catholiques, musulmans, juifs, bouddhistes, athées, indifférents. Certains sont nés ici, d'autres à des milliers de kilomètres. Dans une heure, ils feront tous le même exercice de mathématiques.</p>

<p>C'est cela, la laïcité vécue. Pas une théorie : une salle de classe.</p>

<h4>Ce que la laïcité demande à qui</h4>

<p>Il faut distinguer trois situations, et c'est là que beaucoup se trompent.</p>

<p><strong>L'enseignant</strong> est un agent public. Il doit être <strong>strictement neutre</strong> : aucun signe religieux, aucune expression de ses convictions religieuses ou politiques devant les élèves. Cette contrainte n'est pas dirigée contre lui : elle garantit que chaque enfant est traité pareil.</p>

<p><strong>L'élève</strong> d'une école, d'un collège ou d'un lycée public ne peut pas porter de <strong>signes religieux ostensibles</strong> (loi du 15 mars 2004). Il garde en revanche sa liberté de conscience : on ne lui demande pas ce qu'il croit.</p>

<p><strong>Le parent</strong>, dans la rue ou chez lui, est entièrement libre. La laïcité s'impose à l'État, pas aux citoyens dans leur vie privée.</p>

<h4>Ce qu'on ne peut pas invoquer</h4>

<p>Aucune conviction religieuse ne permet de refuser un enseignement, de contester un professeur à cause de son sexe, de s'exempter de sport, de piscine ou de sorties scolaires, ni de refuser un soin à l'hôpital public au motif que le soignant est un homme ou une femme.</p>

<p>La règle est constante depuis 1905 : la <strong>loi de la République prime sur toute règle religieuse</strong>.</p>

<h4>Ce que l'école apprend d'autre</h4>

<p>Il y a l'<strong>enseignement moral et civique</strong>, où l'on apprend les institutions, les droits, les devoirs. Il y a l'égalité filles-garçons. Il y a la <strong>Charte de la laïcité</strong>, affichée à l'entrée de chaque établissement.</p>

<blockquote>L'école est le seul lieu du pays où tous les enfants se croisent obligatoirement. C'est pour cela que la République y tient tellement, et pour cela qu'elle y est si exigeante. Jules Ferry en 1882, la loi de 1905, la loi de 2004 : trois textes, une seule idée — dans cette salle, ce qui vous sépare reste à la porte, ce que vous apprenez est commun.</blockquote>`,
      retenir: [
        "La <strong>laïcité à l'école</strong> : les enseignants (agents publics) sont tenus à la <strong>neutralité</strong> ; les élèves ne peuvent porter de <strong>signes religieux ostensibles</strong> (loi du 15 mars 2004).",
        "Aucune conviction religieuse ne permet de refuser un enseignement, un examen, un cours de sport, ni de récuser un professeur ou un soignant à raison de son sexe.",
        "La <strong>loi de la République prime</strong> sur toute règle religieuse.",
        "Une <strong>Charte de la laïcité</strong> est affichée dans chaque établissement scolaire public.",
      ],
      questions: [
        { q: "Un élève d'un lycée public peut-il porter un signe religieux ostensible ?", c: ['Non, la loi du 15 mars 2004 l\'interdit', 'Oui, sans condition', "Oui, avec l'accord de ses parents", 'Uniquement pendant les fêtes religieuses'], a: 0, why: "Les élèves gardent leur liberté de conscience, mais les signes religieux ostensibles sont interdits dans les écoles, collèges et lycées publics." },
        { q: 'Un parent peut-il refuser que son enfant suive un cours au nom de sa religion ?', c: ["Non, aucune conviction ne dispense d'un enseignement obligatoire", "Oui, sur simple demande écrite adressée au directeur de l'école", "Oui, pour le sport uniquement", "Oui, si le directeur l'accepte"], a: 0, why: "La loi de la République prime sur les règles religieuses ; l'instruction est obligatoire." },
        { q: 'À qui la neutralité religieuse s\'impose-t-elle en France ?', c: ["Aux agents publics dans l'exercice de leurs fonctions", "À tous les citoyens, en permanence et en tous lieux", "Aux seuls élus", "Aux commerçants"], a: 0, why: "Les usagers du service public, eux, restent libres de leurs convictions." },
        { q: "Peut-on refuser d'être soigné par un professionnel de santé en raison de son sexe à l'hôpital public ?", c: ['Non', 'Oui, sur demande', 'Oui, pour motif religieux', 'Uniquement en maternité'], a: 0, why: "Le principe d'égalité et la neutralité du service public l'interdisent." },
      ],
    },

    {
      key: 'ch20',
      num: 20,
      titre: 'La salle où la balance est en équilibre',
      lieu: 'Un tribunal judiciaire',
      date: "Aujourd'hui",
      minutes: 6,
      html: `
<p>Une salle boisée. Au fond, une estrade. Sur le mur, souvent, une balance : les deux plateaux à l'équilibre, parce que tant que rien n'est jugé, rien n'est décidé.</p>

<p>La personne assise là, au banc des prévenus, est <strong>présumée innocente</strong>. Ce n'est pas une politesse, c'est l'article 9 de la Déclaration de 1789, et cela veut dire une chose précise : ce n'est pas à elle de prouver son innocence, c'est à l'accusation de prouver sa culpabilité.</p>

<h4>Vos garanties</h4>

<ul>
  <li>Être <strong>jugé par un juge indépendant</strong> : le pouvoir judiciaire ne reçoit pas d'ordre du gouvernement.</li>
  <li>Être <strong>défendu par un avocat</strong>. Si vous n'en avez pas les moyens, l'<strong>aide juridictionnelle</strong> le paie.</li>
  <li>Un <strong>procès public et contradictoire</strong> : chacun entend les arguments de l'autre et peut y répondre.</li>
  <li>Le droit de <strong>faire appel</strong> : une affaire peut être rejugée entièrement par une autre juridiction.</li>
  <li>La <strong>gratuité de la justice</strong> : on ne paie pas pour être jugé.</li>
  <li>Nul ne peut être puni pour un acte qui n'était pas interdit au moment où il l'a commis.</li>
</ul>

<h4>Deux justices</h4>

<p>La <strong>justice judiciaire</strong> tranche les litiges entre personnes (civil) et juge les infractions (pénal). Au sommet : la <strong>Cour de cassation</strong>.</p>

<p>La <strong>justice administrative</strong> juge les litiges entre les citoyens et l'administration — vous pouvez attaquer une décision de préfecture ou de mairie. Au sommet : le <strong>Conseil d'État</strong>.</p>

<p>Trois niveaux d'infractions : les <strong>contraventions</strong> (les moins graves), les <strong>délits</strong> (vol, escroquerie, violences), les <strong>crimes</strong> (meurtre, viol), jugés par une cour d'assises avec des jurés tirés au sort parmi les citoyens.</p>

<h4>Devoirs, aussi</h4>

<p>Une citoyenneté, ce n'est pas seulement des droits. C'est aussi : <strong>respecter la loi</strong>, <strong>payer ses impôts</strong>, <strong>respecter les symboles et les valeurs de la République</strong>, se faire <strong>recenser à 16 ans</strong> et participer à la <strong>Journée défense et citoyenneté</strong>, être <strong>juré d'assises</strong> si l'on est tiré au sort, porter <strong>assistance à une personne en danger</strong>, respecter l'égalité femmes-hommes et la laïcité.</p>

<h4>Ce qui est interdit et pourquoi</h4>

<p>Le <strong>racisme</strong>, l'<strong>antisémitisme</strong>, l'<strong>injure et la diffamation</strong>, l'<strong>apologie du terrorisme</strong>, l'<strong>appel à la haine</strong> ne sont pas des opinions protégées : ce sont des <strong>délits</strong>. De même la <strong>polygamie</strong>, les <strong>mariages forcés</strong>, l'<strong>excision</strong>, les <strong>violences conjugales</strong> — interdits et sévèrement punis, quelles que soient les traditions invoquées.</p>

<blockquote>Un numéro à connaître : le <strong>3919</strong>, écoute pour les femmes victimes de violences, anonyme et gratuit. Et le <strong>17</strong> pour la police, le <strong>15</strong> pour le SAMU, le <strong>18</strong> pour les pompiers, le <strong>112</strong> partout en Europe, le <strong>114</strong> par SMS pour les personnes sourdes ou malentendantes.</blockquote>`,
      retenir: [
        "<strong>Présomption d'innocence</strong>, <strong>droit à un avocat</strong> (aide juridictionnelle si besoin), <strong>procès équitable et public</strong>, <strong>droit d'appel</strong>, <strong>gratuité de la justice</strong>, <strong>indépendance des juges</strong>.",
        "<strong>Justice judiciaire</strong> (Cour de cassation) pour les litiges privés et les infractions ; <strong>justice administrative</strong> (Conseil d'État) contre l'administration.",
        "Infractions : <strong>contraventions</strong>, <strong>délits</strong>, <strong>crimes</strong> (cour d'assises, jurés tirés au sort).",
        "Devoirs : respecter la loi, payer ses impôts, recensement à 16 ans et JDC, être juré si tiré au sort, porter assistance à personne en danger.",
        "Sont des <strong>délits</strong> : racisme, antisémitisme, injure, diffamation, apologie du terrorisme. Sont interdits : <strong>polygamie</strong>, <strong>mariage forcé</strong>, <strong>excision</strong>, <strong>violences conjugales</strong>.",
        "Urgences : <strong>15</strong> SAMU, <strong>17</strong> police, <strong>18</strong> pompiers, <strong>112</strong> Europe, <strong>114</strong> par SMS, <strong>3919</strong> violences faites aux femmes.",
      ],
      questions: [
        { q: 'Quel numéro appeler pour joindre la police ou la gendarmerie ?', c: ['Le 17', 'Le 15', 'Le 18', 'Le 119'], a: 0, why: "Le 15 est le SAMU, le 18 les pompiers, le 112 le numéro d'urgence européen." },
        { q: 'Quel numéro est dédié aux femmes victimes de violences ?', c: ['Le 3919', 'Le 115', 'Le 119', 'Le 3977'], a: 0, why: "Anonyme et gratuit, il oriente vers les associations et les services compétents." },
        { q: "Que garantit l'aide juridictionnelle ?", c: ["La prise en charge des frais d'avocat pour les revenus modestes", "L'annulation des dettes contractées auprès des banques", "La gratuité des amendes pour les personnes sans emploi", "Une aide au paiement du loyer et des charges"], a: 0, why: "Elle rend effectif le droit à la défense, quels que soient les moyens de la personne." },
        { q: "La polygamie est-elle autorisée en France ?", c: ['Non, elle est interdite et punie par la loi', 'Oui, si le mariage a été célébré à l\'étranger', 'Oui, avec l\'accord des épouses', 'Uniquement pour les résidents étrangers'], a: 0, why: "Le droit français ne reconnaît qu'un seul mariage à la fois ; aucune tradition ne prime sur la loi." },
      ],
    },

    {
      key: 'ch21',
      num: 21,
      titre: 'Une vie ordinaire',
      lieu: 'Partout en France',
      date: "Aujourd'hui",
      minutes: 6,
      html: `
<p>Ce chapitre n'a pas de héros. Il raconte une journée quelconque, et tout ce que la République y a déjà déposé sans qu'on le remarque.</p>

<p>Vous êtes malade. Vous allez chez le médecin, vous présentez votre <strong>carte Vitale</strong>. Une grande partie du coût est remboursée par l'<strong>Assurance maladie</strong> — celle créée en 1945 par les résistants qui sortaient de la guerre. Si vous n'avez presque rien, la <strong>Complémentaire santé solidaire</strong> prend le relais. Si vous êtes étranger en situation irrégulière, l'<strong>aide médicale de l'État</strong> existe aussi : on ne laisse personne sans soins.</p>

<p>Vous travaillez. Votre bulletin de paie porte des lignes de <strong>cotisations</strong> : c'est ce qui finance la maladie, la retraite, le chômage, les allocations familiales. Vous avez droit au <strong>SMIC</strong>, à <strong>35 heures</strong> hebdomadaires de référence, à <strong>5 semaines</strong> de congés payés, à un contrat écrit, à la sécurité sur votre poste. Vous pouvez adhérer à un <strong>syndicat</strong> et faire <strong>grève</strong> : ce sont des droits constitutionnels.</p>

<p>À travail égal, salaire égal entre les femmes et les hommes. Un employeur ne peut pas vous refuser un poste à cause de votre origine, de votre nom, de votre âge, de votre religion, de votre handicap ou de votre grossesse : c'est une <strong>discrimination</strong>, et c'est un délit. Le <strong>Défenseur des droits</strong> peut être saisi gratuitement.</p>

<p>Vous cherchez un logement. Un propriétaire ne peut pas refuser un locataire pour une raison discriminatoire. La <strong>CAF</strong> verse des aides au logement. En cas de rupture, le <strong>115</strong> est le numéro de l'hébergement d'urgence.</p>

<p>Vous avez des enfants. L'école est gratuite, laïque, obligatoire de 3 à 16 ans. Les allocations familiales existent. La <strong>protection de l'enfance</strong> veille : le <strong>119</strong> est le numéro national de l'enfance en danger. Les châtiments corporels sont interdits.</p>

<p>Vous vieillissez. La <strong>retraite</strong> est financée par les cotisations de ceux qui travaillent aujourd'hui : c'est la solidarité entre les générations.</p>

<h4>Ce qu'on attend de vous en retour</h4>

<p>De <strong>payer vos impôts</strong> — impôt sur le revenu, TVA, taxes locales. Ce n'est pas une punition : c'est ce qui paie l'école de vos enfants, l'hôpital, les routes, les pompiers.</p>

<p>De respecter les <strong>règles communes</strong> : le code de la route, le tri, le calme la nuit, le respect des agents publics.</p>

<blockquote>Regardez une journée entière sous cet angle et vous verrez la République partout : dans la carte Vitale, dans le bulletin de paie, dans le cartable de l'enfant, dans le feu rouge. C'est ce que veut dire l'adjectif « <strong>sociale</strong> » de l'article premier. Pas un slogan : un filet, tissé pendant deux siècles, sous chaque personne qui vit ici.</blockquote>`,
      retenir: [
        "<strong>Sécurité sociale</strong> (1945) : maladie, retraite, famille, accidents du travail. La <strong>carte Vitale</strong> ouvre le remboursement des soins.",
        "Travail : <strong>SMIC</strong>, <strong>35 heures</strong>, <strong>5 semaines</strong> de congés payés, droit syndical et <strong>droit de grève</strong>, égalité salariale femmes-hommes.",
        "La <strong>discrimination</strong> à l'embauche, au logement ou dans les services est un <strong>délit</strong> ; le <strong>Défenseur des droits</strong> peut être saisi gratuitement.",
        "Numéros utiles : <strong>115</strong> hébergement d'urgence, <strong>119</strong> enfance en danger, <strong>3919</strong> violences faites aux femmes.",
        "Les <strong>impôts</strong> financent les services publics : école, santé, sécurité, transports.",
      ],
      questions: [
        { q: 'À quoi sert la carte Vitale ?', c: ["Elle permet le remboursement des soins par l'Assurance maladie", "C'est une pièce d'identité valable dans toute l'Europe", "Elle sert à voter", "C'est un titre de transport"], a: 0, why: "La Sécurité sociale, créée en 1945, prend en charge une grande partie des dépenses de santé." },
        { q: 'Quelle est la durée légale du travail hebdomadaire en France ?', c: ['35 heures', '39 heures', '40 heures', '37 heures'], a: 0, why: "C'est la durée de référence ; les heures au-delà sont des heures supplémentaires." },
        { q: 'Combien de semaines de congés payés un salarié a-t-il au minimum ?', c: ['5 semaines', '4 semaines', '3 semaines', '6 semaines'], a: 0, why: "Soit cinq semaines par an, acquises à raison de 2,5 jours ouvrables par mois travaillé." },
        { q: 'Quelle autorité peut être saisie gratuitement en cas de discrimination ?', c: ['Le Défenseur des droits', 'Le Conseil constitutionnel', 'Le préfet', 'La Cour des comptes'], a: 0, why: "Autorité indépendante, il protège les droits et lutte contre les discriminations." },
      ],
    },

    {
      key: 'ch22',
      num: 22,
      titre: 'Douze étoiles en cercle',
      lieu: 'Strasbourg et Bruxelles',
      date: '1950 — aujourd\'hui',
      minutes: 5,
      html: `
<p>1950. La guerre est finie depuis cinq ans. En trente ans, la France et l'Allemagne se sont fait deux guerres qui ont tué des dizaines de millions de personnes. Tout le monde suppose qu'il y en aura une troisième.</p>

<p>Le 9 mai 1950, <strong>Robert Schuman</strong>, ministre français des Affaires étrangères, propose quelque chose d'inattendu. Pas un traité de paix de plus. Une idée simple et rusée : mettre en commun le charbon et l'acier — c'est-à-dire tout ce avec quoi on fabrique des canons. Si les deux pays gèrent ensemble ces matières, aucun des deux ne peut réarmer en secret contre l'autre.</p>

<p>La guerre devient, selon ses mots, « non seulement impensable, mais matériellement impossible ».</p>

<p>Six pays signent : France, Allemagne, Italie, Belgique, Pays-Bas, Luxembourg. Puis vient le <strong>traité de Rome</strong> en 1957, le marché commun, et en <strong>1992</strong> le <strong>traité de Maastricht</strong> qui crée l'<strong>Union européenne</strong> et la <strong>citoyenneté européenne</strong>.</p>

<h4>Ce que cela vous donne</h4>

<p>Quand vous serez français, vous serez aussi <strong>citoyen de l'Union européenne</strong>. Cela veut dire :</p>

<ul>
  <li><strong>circuler et vous installer</strong> librement dans les 27 États membres, y travailler, y étudier ;</li>
  <li><strong>voter et être candidat</strong> aux élections <strong>municipales</strong> et <strong>européennes</strong> dans le pays de l'Union où vous résidez ;</li>
  <li>être <strong>protégé par l'ambassade</strong> de n'importe quel État membre si le vôtre n'est pas représenté ;</li>
  <li>payer en <strong>euro</strong>, la monnaie commune depuis 2002 ;</li>
  <li>saisir le <strong>Médiateur européen</strong> et pétitionner devant le Parlement européen.</li>
</ul>

<p>Le <strong>Parlement européen</strong> siège à <strong>Strasbourg</strong> ; ses députés sont élus au suffrage universel direct pour cinq ans. La Commission et le Conseil siègent à Bruxelles.</p>

<p>Le drapeau : <strong>douze étoiles dorées en cercle sur fond bleu</strong>. Douze ne correspond à aucun nombre de pays : c'est un symbole de perfection et d'unité. L'hymne est l'<em>Ode à la joie</em> de Beethoven. La journée de l'Europe est le <strong>9 mai</strong>.</p>

<blockquote>Nous avons commencé à Alésia, avec des peuples qui n'arrivaient pas à s'entendre et qui ont fini écrasés parce qu'ils étaient divisés. Nous finissons à Strasbourg, avec vingt-sept pays qui se sont fait la guerre pendant mille ans et qui votent maintenant dans la même salle. C'est la même leçon, deux mille ans plus tard, et c'est là que votre histoire commence.</blockquote>`,
      retenir: [
        "<strong>9 mai 1950</strong> — déclaration de <strong>Robert Schuman</strong>, acte de naissance de la construction européenne. Le 9 mai est la <strong>journée de l'Europe</strong>.",
        "<strong>1992</strong> — le <strong>traité de Maastricht</strong> crée l'<strong>Union européenne</strong> et la <strong>citoyenneté européenne</strong>.",
        "L'UE compte <strong>27 États membres</strong> ; la monnaie commune est l'<strong>euro</strong> (en circulation depuis 2002).",
        "Le <strong>Parlement européen</strong> siège à <strong>Strasbourg</strong> ; ses députés sont élus au suffrage universel direct.",
        "Drapeau : <strong>12 étoiles dorées en cercle sur fond bleu</strong>. Hymne : l'<em>Ode à la joie</em>.",
      ],
      questions: [
        { q: 'Combien de pays comptent aujourd\'hui l\'Union européenne ?', c: ['27', '25', '28', '15'], a: 0, why: "Ils étaient six à l'origine ; le Royaume-Uni a quitté l'Union en 2020." },
        { q: 'Que représente le drapeau européen ?', c: ["Douze étoiles dorées en cercle sur fond bleu", "Une étoile dorée par pays membre de l'Union", "Vingt-sept étoiles blanches", "Trois bandes bleu, blanc, rouge"], a: 0, why: "Le nombre douze est un symbole d'unité et de perfection, indépendant du nombre d'États membres." },
        { q: 'Quel traité a créé l\'Union européenne et la citoyenneté européenne ?', c: ['Le traité de Maastricht (1992)', 'Le traité de Rome (1957)', 'Le traité de Lisbonne (2007)', 'Le traité de Versailles (1919)'], a: 0, why: "Le traité de Rome avait créé le marché commun ; Maastricht fonde l'Union et la citoyenneté européenne." },
        { q: 'Dans quelle ville siège le Parlement européen ?', c: ['Strasbourg', 'Bruxelles', 'Paris', 'Luxembourg'], a: 0, why: "La Commission européenne, elle, siège à Bruxelles." },
      ],
    },
  ],
};
