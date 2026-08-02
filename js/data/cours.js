/**
 * Fiches de révision, organisées comme le livret du citoyen et le programme
 * de l'examen civique. Contenu rédigé pour l'entraînement ; le livret officiel
 * du ministère de l'Intérieur reste le document de référence.
 */

export const COURS = [
  /* ------------------------------------------------------------------ 1 */
  {
    key: 'principes-valeurs',
    theme: 'principes-valeurs',
    icon: 'flag',
    title: 'Principes et valeurs de la République',
    subtitle: 'Devise, symboles, laïcité, égalité',
    sections: [
      {
        h: 'La devise et ce qu\'elle engage',
        html: `
<p>La devise <span class="key">Liberté, Égalité, Fraternité</span> figure à l'article 2 de la Constitution. On la lit au fronton des mairies, des écoles et des tribunaux.</p>
<ul>
  <li><strong>Liberté</strong> — « faire tout ce qui ne nuit pas à autrui » (article 4 de la Déclaration de 1789). Liberté de conscience, d'expression, de circulation, d'association, de culte.</li>
  <li><strong>Égalité</strong> — la même loi pour tous, sans distinction d'origine, de sexe, de religion ou de fortune. Elle n'impose pas l'uniformité des situations, elle interdit les discriminations.</li>
  <li><strong>Fraternité</strong> — la solidarité : sécurité sociale, école gratuite, impôt redistributif, bénévolat, aide aux plus fragiles.</li>
</ul>`,
      },
      {
        h: 'Les symboles',
        html: `
<ul>
  <li><strong>Le drapeau tricolore</strong> — bleu, blanc, rouge à partir de la hampe. Le bleu et le rouge sont les couleurs de Paris, le blanc celle de la monarchie.</li>
  <li><strong>La Marseillaise</strong> — écrite par <span class="key">Rouget de Lisle</span> à Strasbourg en <span class="key">1792</span>, sous le titre « Chant de guerre pour l'armée du Rhin ». Elle doit son nom aux volontaires marseillais montés sur Paris. Hymne national en 1795, puis définitivement en 1879.</li>
  <li><strong>Marianne</strong> — l'allégorie de la République, coiffée du bonnet phrygien, symbole de liberté. Son buste est présent dans les mairies.</li>
  <li><strong>Le 14 juillet</strong> — fête nationale depuis la loi de 1880. Elle commémore la prise de la Bastille (1789) <em>et</em> la fête de la Fédération (1790).</li>
  <li><strong>Le coq gaulois</strong> — emblème traditionnel et sportif, mais <em>non officiel</em> : il n'est pas dans la Constitution.</li>
  <li><strong>Le sceau de la République</strong> — la Liberté assise, tenant un faisceau de licteur, emblème de l'union et de la loi.</li>
</ul>
<blockquote>L'article 2 de la Constitution cite quatre éléments : la langue (le français), l'emblème (le drapeau), l'hymne (La Marseillaise), la devise. Il ajoute le principe : « gouvernement du peuple, par le peuple et pour le peuple ».</blockquote>`,
      },
      {
        h: 'La laïcité',
        html: `
<p>La laïcité repose sur la <span class="key">loi du 9 décembre 1905</span> de séparation des Églises et de l'État.</p>
<ul>
  <li><strong>Article 1er</strong> — la République assure la liberté de conscience et garantit le libre exercice des cultes.</li>
  <li><strong>Article 2</strong> — la République ne reconnaît, ne salarie ni ne subventionne aucun culte.</li>
</ul>
<h4>Ce que la laïcité n'est pas</h4>
<p>Ce n'est <strong>pas</strong> l'athéisme, ni l'interdiction des religions. C'est un cadre commun qui garantit à chacun la liberté de croire, de ne pas croire ou de changer de religion.</p>
<h4>Qui est tenu à la neutralité ?</h4>
<ul>
  <li><strong>Les agents publics</strong>, pendant leur service : aucune manifestation de convictions religieuses, politiques ou philosophiques. Cela vaut pour la tenue, les propos et le bureau.</li>
  <li><strong>Les usagers</strong> restent libres de leurs convictions, mais doivent respecter les règles du service (identification, sécurité, soins).</li>
  <li><strong>Les élèves</strong> des écoles, collèges et lycées publics : les signes religieux ostensibles sont interdits (<span class="key">loi du 15 mars 2004</span>).</li>
</ul>
<h4>Textes à retenir</h4>
<ul>
  <li><strong>15 mars 2004</strong> — signes religieux ostensibles interdits aux élèves des établissements publics.</li>
  <li><strong>11 octobre 2010</strong> — interdiction de dissimuler son visage dans l'espace public.</li>
  <li><strong>24 août 2021</strong> — loi confortant le respect des principes de la République.</li>
  <li><strong>9 décembre</strong> — journée nationale de la laïcité.</li>
  <li><strong>Alsace-Moselle</strong> — Bas-Rhin, Haut-Rhin et Moselle conservent le régime concordataire hérité de 1801.</li>
</ul>`,
      },
      {
        h: 'Égalité et non-discrimination',
        html: `
<p>L'article 1er de la Constitution : la France « assure l'égalité devant la loi de tous les citoyens sans distinction d'origine, de race ou de religion » et « respecte toutes les croyances ».</p>
<ul>
  <li><strong>Égalité femmes-hommes</strong> — la loi favorise l'égal accès aux mandats et fonctions. « À travail égal, salaire égal ». La notion de « chef de famille » a disparu en 1970 ; l'autorité parentale est exercée en commun.</li>
  <li><strong>Discrimination</strong> — plus de vingt critères interdits (origine, sexe, âge, handicap, religion, orientation sexuelle, état de santé, grossesse, apparence, situation de famille…). Peine encourue : jusqu'à 3 ans de prison et 45 000 € d'amende.</li>
  <li><strong>Recours</strong> — le <span class="key">Défenseur des droits</span>, gratuit et indépendant, peut être saisi en ligne.</li>
</ul>`,
      },
      {
        h: 'Réussir les mises en situation',
        html: `
<p>12 des 40 questions sont des mises en situation. Quelques réflexes qui font gagner des points :</p>
<ul>
  <li>Choisissez la réponse qui <strong>respecte la loi</strong>, même si une autre semble plus arrangeante.</li>
  <li>Privilégiez le <strong>dialogue</strong> puis la <strong>voie légale</strong> (signalement, autorité compétente, recours) plutôt que l'affrontement, la fuite ou la justice privée.</li>
  <li>Refusez toute réponse qui accepte une <strong>discrimination</strong>, un <strong>passe-droit</strong> ou une <strong>tradition contraire à la loi</strong>.</li>
  <li>Distinguez toujours <strong>agent public</strong> (neutralité stricte) et <strong>usager</strong> (liberté encadrée).</li>
  <li>Méfiez-vous des réponses extrêmes : « toujours », « jamais », « sans aucune limite » sont rarement justes.</li>
</ul>`,
      },
    ],
  },

  /* ------------------------------------------------------------------ 2 */
  {
    key: 'institutions',
    theme: 'institutions',
    icon: 'bank',
    title: 'Système institutionnel et politique',
    subtitle: 'Démocratie, vote, institutions, Europe',
    sections: [
      {
        h: 'La Ve République',
        html: `
<p>La Constitution du <span class="key">4 octobre 1958</span> fonde la Ve République. La France est une République « indivisible, laïque, démocratique et sociale ».</p>
<p>Les <strong>trois pouvoirs</strong> sont séparés : exécutif, législatif, judiciaire.</p>`,
      },
      {
        h: 'Le pouvoir exécutif',
        html: `
<ul>
  <li><strong>Le président de la République</strong> — élu au <span class="key">suffrage universel direct</span> (depuis le référendum de 1962) pour <span class="key">5 ans</span> (quinquennat depuis 2000), au scrutin majoritaire à deux tours. Deux mandats consécutifs au maximum. Il réside à l'<strong>Élysée</strong>.<br>Il nomme le Premier ministre, préside le Conseil des ministres, est <strong>chef des armées</strong>, peut dissoudre l'Assemblée nationale et soumettre un texte au référendum. Il dispose du droit de grâce.</li>
  <li><strong>Le Premier ministre</strong> — nommé par le président, il dirige l'action du Gouvernement et réside à <strong>Matignon</strong>. Le Gouvernement est responsable devant l'Assemblée nationale, qui peut le renverser par une <strong>motion de censure</strong>.</li>
</ul>`,
      },
      {
        h: 'Le pouvoir législatif',
        html: `
<p>Le <strong>Parlement</strong> vote la loi, contrôle le Gouvernement et évalue les politiques publiques. Il comprend deux chambres :</p>
<ul>
  <li><strong>L'Assemblée nationale</strong> — <span class="key">577 députés</span> élus pour 5 ans au suffrage universel direct, scrutin uninominal majoritaire à deux tours. Siège : <strong>Palais Bourbon</strong>. En cas de désaccord persistant, elle a le dernier mot.</li>
  <li><strong>Le Sénat</strong> — <span class="key">348 sénateurs</span> élus pour 6 ans au suffrage universel <em>indirect</em> par des grands électeurs, renouvelés par moitié tous les 3 ans. Siège : <strong>Palais du Luxembourg</strong>.</li>
</ul>
<p>Réunis à Versailles pour réviser la Constitution, les deux chambres forment le <strong>Congrès</strong>.</p>`,
      },
      {
        h: 'La justice et les contrôles',
        html: `
<ul>
  <li><strong>Conseil constitutionnel</strong> — 9 membres nommés pour 9 ans non renouvelables, plus les anciens présidents. Il vérifie la conformité des lois à la Constitution et veille à la régularité des élections nationales. Depuis 2010, tout justiciable peut le saisir par une <strong>question prioritaire de constitutionnalité</strong>.</li>
  <li><strong>Cour de cassation</strong> — sommet de l'ordre judiciaire ; elle contrôle l'application du droit, sans rejuger les faits.</li>
  <li><strong>Conseil d'État</strong> — sommet de l'ordre administratif ; les litiges avec l'administration commencent devant le <strong>tribunal administratif</strong>.</li>
  <li><strong>Défenseur des droits</strong> — autorité indépendante, saisine gratuite.</li>
</ul>`,
      },
      {
        h: 'Voter en France',
        html: `
<p>Le suffrage est <span class="key">universel, égal et secret</span> (article 3 de la Constitution). Le vote est un <strong>droit et un devoir civique</strong>, mais il n'est pas obligatoire.</p>
<ul>
  <li>Conditions : avoir <strong>18 ans</strong>, être de nationalité française, jouir de ses droits civils et politiques, être <strong>inscrit sur les listes électorales</strong>.</li>
  <li>Les citoyens de l'Union européenne résidant en France votent aux élections <strong>municipales et européennes</strong>, mais ne peuvent être ni maire ni adjoint.</li>
  <li>Absent le jour du scrutin ? Une <strong>procuration</strong> est le seul moyen légal. Voter à la place d'autrui sans procuration est une fraude.</li>
  <li>Le passage par l'<strong>isoloir</strong> est obligatoire : il garantit le secret du vote.</li>
</ul>
<h4>Durée des mandats</h4>
<ul>
  <li>Président de la République : 5 ans — Députés : 5 ans — Députés européens : 5 ans</li>
  <li>Sénateurs : 6 ans — Conseillers municipaux, départementaux et régionaux : 6 ans</li>
</ul>
<h4>Dates clés du droit de vote</h4>
<ul>
  <li><strong>1848</strong> — suffrage universel masculin.</li>
  <li><strong>1944</strong> — droit de vote des femmes (ordonnance du 21 avril) ; premier vote en 1945.</li>
  <li><strong>1974</strong> — majorité électorale abaissée à 18 ans.</li>
</ul>`,
      },
      {
        h: 'Les collectivités territoriales',
        html: `
<ul>
  <li><strong>La commune</strong> — environ 35 000 en France. Le conseil municipal, élu pour 6 ans, élit le <strong>maire</strong> en son sein. Le maire est à la fois élu local et <strong>agent de l'État</strong> : officier d'état civil (mariages, naissances, décès) et autorité de police municipale. Compétences : écoles primaires, urbanisme, voirie communale, état civil.</li>
  <li><strong>Le département</strong> — <span class="key">101</span> au total (96 en métropole, 5 outre-mer). Compétences : collèges, action sociale, routes départementales.</li>
  <li><strong>La région</strong> — <span class="key">18</span> régions dont 13 en métropole. Compétences : lycées, transports régionaux, formation professionnelle, développement économique.</li>
  <li><strong>Le préfet</strong> — représentant de l'État dans le département, nommé par décret du président de la République en Conseil des ministres.</li>
</ul>`,
      },
      {
        h: 'La France en Europe et dans le monde',
        html: `
<ul>
  <li><strong>Union européenne</strong> — <span class="key">27 États membres</span> depuis le Brexit (31 janvier 2020). La France est membre fondateur (CECA 1951, traité de Rome 1957).</li>
  <li><strong>Traité de Maastricht (1992)</strong> — crée l'Union européenne et la <strong>citoyenneté européenne</strong>, approuvé par référendum en France.</li>
  <li><strong>L'euro</strong> — monnaie de la France ; pièces et billets depuis le <span class="key">1er janvier 2002</span>. La zone euro compte 21 États (la Bulgarie l'a rejointe le 1er janvier 2026). Tous les pays de l'UE n'ont pas l'euro.</li>
  <li><strong>Drapeau européen</strong> — 12 étoiles d'or sur fond bleu ; le nombre 12 symbolise la perfection, pas le nombre d'États.</li>
  <li><strong>Hymne européen</strong> — l'Ode à la joie de Beethoven. <strong>Devise</strong> : « Unie dans la diversité ». <strong>Journée de l'Europe</strong> : 9 mai (déclaration Schuman, 1950).</li>
  <li><strong>Parlement européen</strong> — 720 députés élus au suffrage universel direct depuis 1979 ; la France en élit 81. Sessions plénières à <strong>Strasbourg</strong>. La <strong>Commission européenne</strong> siège à Bruxelles.</li>
  <li><strong>Espace Schengen</strong> — libre circulation sans contrôle aux frontières intérieures. À ne pas confondre avec l'UE ni la zone euro.</li>
  <li><strong>Conseil de l'Europe</strong> — distinct de l'UE, siège à Strasbourg, à l'origine de la Convention européenne des droits de l'homme.</li>
  <li><strong>ONU</strong> — la France est membre permanent du Conseil de sécurité, avec droit de veto.</li>
</ul>`,
      },
    ],
  },

  /* ------------------------------------------------------------------ 3 */
  {
    key: 'droits-devoirs',
    theme: 'droits-devoirs',
    icon: 'scale',
    title: 'Droits et devoirs',
    subtitle: 'Libertés, protections, obligations du citoyen',
    sections: [
      {
        h: 'Les textes fondateurs',
        html: `
<p>Le <strong>bloc de constitutionnalité</strong> réunit quatre textes de même valeur :</p>
<ul>
  <li>La <span class="key">Déclaration des droits de l'homme et du citoyen du 26 août 1789</span> ;</li>
  <li>Le <strong>préambule de la Constitution de 1946</strong> (droits sociaux : grève, syndicats, santé, éducation, asile) ;</li>
  <li>La <strong>Constitution du 4 octobre 1958</strong> ;</li>
  <li>La <strong>Charte de l'environnement de 2004</strong>.</li>
</ul>
<blockquote>Article 1er de la Déclaration de 1789 : « Les hommes naissent et demeurent libres et égaux en droits. »</blockquote>`,
      },
      {
        h: 'Les libertés fondamentales',
        html: `
<ul>
  <li><strong>Liberté d'expression</strong> (article 11 de 1789) — limites : injure, diffamation, incitation à la haine ou à la violence, apologie du terrorisme, négationnisme (loi Gayssot de 1990). Il n'existe <strong>pas</strong> de délit de blasphème : on peut critiquer une religion, pas s'en prendre aux personnes.</li>
  <li><strong>Liberté de conscience et de religion</strong> — croire, ne pas croire, changer de religion.</li>
  <li><strong>Liberté d'association</strong> — loi du 1er juillet 1901 : simple déclaration en préfecture.</li>
  <li><strong>Liberté de la presse</strong> — loi du 29 juillet 1881.</li>
  <li><strong>Droit de grève et liberté syndicale</strong> — préambule de 1946.</li>
  <li><strong>Droit de propriété</strong> — protégé, sauf expropriation pour utilité publique avec juste et préalable indemnité.</li>
  <li><strong>Vie privée et données personnelles</strong> — article 9 du Code civil, RGPD, contrôle de la <strong>CNIL</strong>.</li>
  <li><strong>Droit d'asile</strong> — instruit par l'OFPRA.</li>
</ul>`,
      },
      {
        h: 'Justice et garanties',
        html: `
<ul>
  <li><strong>Présomption d'innocence</strong> — chacun est innocent tant que sa culpabilité n'a pas été établie par un tribunal.</li>
  <li><strong>Procès équitable</strong> — droit à un avocat, à un interprète, à un recours. L'<strong>aide juridictionnelle</strong> prend en charge les frais selon les ressources.</li>
  <li><strong>Garde à vue</strong> — 24 heures, renouvelable une fois. Droits notifiés dès le début : connaître les faits, se taire, être assisté d'un avocat, faire prévenir un proche, voir un médecin.</li>
  <li><strong>Peine de mort</strong> — abolie par la <span class="key">loi du 9 octobre 1981</span> portée par <strong>Robert Badinter</strong> ; inscrite dans la Constitution en 2007.</li>
</ul>`,
      },
      {
        h: 'Conquêtes sociales et sociétales',
        html: `
<ul>
  <li><strong>1944-1945</strong> — droit de vote et d'éligibilité des femmes.</li>
  <li><strong>1965</strong> — les femmes mariées peuvent travailler et ouvrir un compte bancaire sans l'accord de leur mari.</li>
  <li><strong>1967</strong> — loi Neuwirth sur la contraception.</li>
  <li><strong>1975</strong> — <strong>loi Veil</strong> sur l'interruption volontaire de grossesse ; liberté inscrite dans la Constitution en <strong>mars 2024</strong>.</li>
  <li><strong>1999</strong> — création du <strong>PACS</strong>.</li>
  <li><strong>2013</strong> — <strong>mariage pour tous</strong> (loi du 17 mai).</li>
  <li><strong>2019</strong> — interdiction des châtiments corporels sur les enfants.</li>
</ul>`,
      },
      {
        h: 'Les devoirs du citoyen',
        html: `
<ul>
  <li><strong>Respecter les lois</strong> — « nul n'est censé ignorer la loi ». Aucune règle religieuse, coutumière ou familiale ne prévaut sur elle.</li>
  <li><strong>Payer ses impôts</strong> — article 13 de la Déclaration de 1789 : contribution répartie « à raison des facultés » de chacun. La déclaration de revenus est obligatoire, même sans impôt à payer.</li>
  <li><strong>Scolariser ses enfants</strong> — instruction obligatoire de <span class="key">3 à 16 ans</span>, formation obligatoire jusqu'à 18 ans.</li>
  <li><strong>Se faire recenser à 16 ans</strong> puis participer à la <strong>Journée défense et citoyenneté</strong> (16-25 ans). Le certificat est exigé pour le baccalauréat, les concours publics et le permis de conduire. Le service militaire est suspendu depuis 1997.</li>
  <li><strong>Être juré d'assises</strong> si l'on est tiré au sort (citoyen de plus de 23 ans).</li>
  <li><strong>Porter secours</strong> — la non-assistance à personne en danger est un délit.</li>
  <li><strong>Respecter la liberté et la dignité d'autrui</strong>, la laïcité et les biens publics.</li>
</ul>`,
      },
      {
        h: 'Numéros et recours utiles',
        html: `
<ul>
  <li><strong>15</strong> SAMU · <strong>17</strong> police-secours · <strong>18</strong> pompiers · <strong>112</strong> urgence européenne · <strong>114</strong> urgences par SMS (sourds et malentendants)</li>
  <li><strong>119</strong> enfance en danger · <strong>115</strong> hébergement d'urgence · <strong>3919</strong> violences faites aux femmes</li>
  <li><strong>Défenseur des droits</strong> — discriminations, litiges avec un service public</li>
  <li><strong>Inspection du travail</strong> et <strong>conseil de prud'hommes</strong> — litiges avec un employeur</li>
  <li><strong>CNIL</strong> — données personnelles · <strong>PHAROS</strong> — signalement de contenus illicites en ligne</li>
</ul>`,
      },
    ],
  },

  /* ------------------------------------------------------------------ 4 */
  {
    key: 'histoire-geo-culture',
    theme: 'histoire-geo-culture',
    icon: 'book',
    title: 'Histoire, géographie et culture',
    subtitle: 'Grandes dates, territoires, patrimoine',
    sections: [
      {
        h: 'Repères avant la Révolution',
        html: `
<ul>
  <li><strong>52 av. J.-C.</strong> — Alésia : Vercingétorix vaincu par Jules César.</li>
  <li><strong>vers 496</strong> — baptême de Clovis à Reims.</li>
  <li><strong>800</strong> — Charlemagne couronné empereur.</li>
  <li><strong>987</strong> — Hugues Capet, début de la dynastie capétienne.</li>
  <li><strong>1429</strong> — Jeanne d'Arc délivre Orléans ; brûlée à Rouen en 1431.</li>
  <li><strong>1539</strong> — ordonnance de Villers-Cotterêts : le français remplace le latin dans l'administration.</li>
  <li><strong>1598</strong> — édit de Nantes (Henri IV), liberté de culte aux protestants ; révoqué en 1685 par Louis XIV.</li>
  <li><strong>1643-1715</strong> — règne de Louis XIV, le « Roi-Soleil », et Versailles.</li>
  <li><strong>XVIIIe siècle</strong> — les Lumières : Voltaire, Rousseau, <strong>Montesquieu</strong> (séparation des pouvoirs), Diderot.</li>
</ul>`,
      },
      {
        h: 'De la Révolution à la République',
        html: `
<ul>
  <li><strong>14 juillet 1789</strong> — prise de la Bastille.</li>
  <li><strong>26 août 1789</strong> — Déclaration des droits de l'homme et du citoyen.</li>
  <li><strong>21 septembre 1792</strong> — proclamation de la Ire République.</li>
  <li><strong>1804</strong> — Napoléon empereur ; <strong>Code civil</strong>.</li>
  <li><strong>1848</strong> — IIe République, <strong>suffrage universel masculin</strong> et <strong>abolition définitive de l'esclavage</strong> (Victor Schœlcher, décret du 27 avril).</li>
  <li><strong>1870</strong> — proclamation de la IIIe République (jusqu'en 1940).</li>
  <li><strong>1881-1882</strong> — lois <strong>Jules Ferry</strong> : école primaire gratuite, laïque et obligatoire.</li>
  <li><strong>1898</strong> — « J'accuse… ! » d'Émile Zola, affaire Dreyfus.</li>
  <li><strong>1905</strong> — séparation des Églises et de l'État.</li>
</ul>`,
      },
      {
        h: 'Le XXe siècle',
        html: `
<ul>
  <li><strong>1914-1918</strong> — Première Guerre mondiale ; armistice le <strong>11 novembre 1918</strong>.</li>
  <li><strong>1936</strong> — Front populaire : congés payés, semaine de 40 heures.</li>
  <li><strong>18 juin 1940</strong> — appel du général <strong>de Gaulle</strong> depuis Londres.</li>
  <li><strong>1940-1944</strong> — régime de Vichy et collaboration ; <strong>Jean Moulin</strong> unifie la Résistance (Conseil national de la Résistance, 27 mai 1943).</li>
  <li><strong>6 juin 1944</strong> — débarquement de Normandie. <strong>8 mai 1945</strong> — victoire en Europe.</li>
  <li><strong>1944-1945</strong> — droit de vote des femmes. <strong>1945</strong> — création de la Sécurité sociale.</li>
  <li><strong>4 octobre 1958</strong> — Constitution de la Ve République.</li>
  <li><strong>1962</strong> — indépendance de l'Algérie (accords d'Évian) ; élection du président au suffrage universel direct.</li>
  <li><strong>Mai 1968</strong> — mouvement étudiant et social.</li>
  <li><strong>1981</strong> — élection de François Mitterrand ; abolition de la peine de mort.</li>
  <li><strong>1992</strong> — traité de Maastricht. <strong>2002</strong> — passage à l'euro.</li>
</ul>`,
      },
      {
        h: 'Géographie',
        html: `
<ul>
  <li><strong>Superficie</strong> — environ 551 000 km² en métropole, plus de 640 000 km² avec l'outre-mer. <strong>Population</strong> : environ 68 millions d'habitants.</li>
  <li><strong>Capitale</strong> — Paris. Grandes villes : Marseille, Lyon, Toulouse, Nice, Nantes, Montpellier, Strasbourg, Bordeaux, Lille.</li>
  <li><strong>Fleuves</strong> — la <strong>Loire</strong> (le plus long, ~1 000 km), la Seine (Paris), le Rhône, la Garonne, le Rhin (frontière).</li>
  <li><strong>Montagnes</strong> — Alpes (<strong>mont Blanc</strong>, plus haut sommet, plus de 4 800 m), Pyrénées, Massif central, Jura, Vosges.</li>
  <li><strong>Mers</strong> — Manche, mer du Nord, océan Atlantique, mer Méditerranée.</li>
  <li><strong>8 pays frontaliers</strong> — Belgique, Luxembourg, Allemagne, Suisse, Italie, Monaco, Espagne, Andorre.</li>
  <li><strong>Outre-mer</strong> — 5 départements et régions : <strong>Guadeloupe, Martinique, Guyane, La Réunion, Mayotte</strong> (101e département, 2011). Plus des collectivités : Saint-Pierre-et-Miquelon, Saint-Barthélemy, Saint-Martin, Wallis-et-Futuna, Polynésie française, Nouvelle-Calédonie, TAAF.</li>
  <li><strong>Climats</strong> — océanique à l'ouest, méditerranéen au sud-est, continental à l'est, montagnard dans les massifs.</li>
</ul>`,
      },
      {
        h: 'Culture et patrimoine',
        html: `
<ul>
  <li><strong>Littérature</strong> — Molière (« la langue de Molière »), Voltaire, Victor Hugo (<em>Les Misérables</em>), Émile Zola, Simone de Beauvoir (<em>Le Deuxième Sexe</em>), Albert Camus.</li>
  <li><strong>Sciences</strong> — Louis Pasteur (vaccin contre la rage), <strong>Marie Curie</strong> (deux prix Nobel, au Panthéon depuis 1995).</li>
  <li><strong>Monuments</strong> — tour Eiffel (1889, Gustave Eiffel), Louvre (<em>La Joconde</em> de Léonard de Vinci), Notre-Dame de Paris, Versailles, Mont-Saint-Michel, Arc de triomphe (tombe du Soldat inconnu).</li>
  <li><strong>Le Panthéon</strong> — « Aux grands hommes, la patrie reconnaissante ». Y reposent notamment Voltaire, Rousseau, Hugo, Marie Curie, Jean Moulin, Simone Veil (2018), Joséphine Baker (2021), Robert Badinter (2025).</li>
  <li><strong>Cinéma</strong> — les frères Lumière (1895), Festival de Cannes.</li>
  <li><strong>UNESCO</strong> — le <em>repas gastronomique des Français</em> (2010) et la <em>baguette</em> (2022) au patrimoine immatériel.</li>
  <li><strong>Institutions culturelles</strong> — Académie française (1635), Légion d'honneur (1802), Fête de la musique (21 juin, depuis 1982).</li>
  <li><strong>Sport</strong> — Tour de France (1903), Coupe du monde de football 1998 et 2018, Jeux olympiques et paralympiques de Paris 2024.</li>
</ul>`,
      },
      {
        h: 'Commémorations',
        html: `
<ul>
  <li><strong>14 juillet</strong> — fête nationale · <strong>1er mai</strong> — fête du Travail (seul jour obligatoirement chômé)</li>
  <li><strong>8 mai</strong> — victoire de 1945 · <strong>11 novembre</strong> — armistice de 1918</li>
  <li><strong>27 mai</strong> — journée nationale de la Résistance · <strong>10 mai</strong> — mémoires de l'esclavage et de son abolition</li>
  <li><strong>9 décembre</strong> — journée de la laïcité · <strong>9 mai</strong> — journée de l'Europe</li>
</ul>`,
      },
    ],
  },

  /* ------------------------------------------------------------------ 5 */
  {
    key: 'vivre-societe',
    theme: 'vivre-societe',
    icon: 'home',
    title: 'Vivre dans la société française',
    subtitle: 'Santé, école, travail, logement, démarches',
    sections: [
      {
        h: 'Santé et protection sociale',
        html: `
<ul>
  <li><strong>Sécurité sociale (1945)</strong> — santé, famille, retraite, accidents du travail, autonomie. Financée par les cotisations : chacun contribue selon ses moyens et reçoit selon ses besoins.</li>
  <li><strong>Carte Vitale</strong> — permet le remboursement des soins (ce n'est pas une pièce d'identité).</li>
  <li><strong>Médecin traitant</strong> — à déclarer pour être mieux remboursé (parcours de soins coordonnés).</li>
  <li><strong>Complémentaire santé solidaire</strong> — mutuelle gratuite ou à faible coût selon les ressources.</li>
  <li><strong>CAF</strong> — allocations familiales, aides au logement, RSA. <strong>CPAM</strong> — assurance maladie.</li>
  <li><strong>11 vaccins obligatoires</strong> pour les enfants nés depuis 2018.</li>
  <li>L'<strong>accès aux soins d'urgence</strong> est garanti à toute personne, quelle que soit sa situation.</li>
</ul>`,
      },
      {
        h: 'École et éducation',
        html: `
<ul>
  <li>Parcours : <strong>maternelle → élémentaire → collège (6e à 3e, brevet) → lycée (baccalauréat)</strong>.</li>
  <li>L'école publique est <strong>gratuite, laïque et obligatoire</strong> ; l'instruction est obligatoire de 3 à 16 ans pour tous les enfants présents sur le territoire, <strong>quelle que soit leur nationalité</strong> ou la situation de leurs parents.</li>
  <li>Financement : <strong>commune</strong> pour les écoles, <strong>département</strong> pour les collèges, <strong>région</strong> pour les lycées ; l'État rémunère les enseignants et fixe les programmes.</li>
  <li>Les parents élisent des <strong>représentants</strong> au conseil d'école ou d'administration.</li>
  <li>Aides : allocation de rentrée scolaire, bourses de collège et de lycée.</li>
  <li>Handicap : inscription de droit en milieu ordinaire (loi du 11 février 2005), accompagnement via la <strong>MDPH</strong>.</li>
</ul>`,
      },
      {
        h: 'Travail et emploi',
        html: `
<ul>
  <li><strong>SMIC</strong> — salaire minimum légal, revalorisé au moins une fois par an.</li>
  <li><strong>35 heures</strong> — durée légale hebdomadaire ; au-delà, heures supplémentaires majorées.</li>
  <li><strong>5 semaines</strong> de congés payés par an (2,5 jours ouvrables par mois travaillé).</li>
  <li><strong>CDI</strong> (sans date de fin) et <strong>CDD</strong> (uniquement dans les cas prévus par la loi : remplacement, surcroît d'activité, emploi saisonnier).</li>
  <li><strong>France Travail</strong> (ex-Pôle emploi depuis 2024) — accompagnement et allocation chômage.</li>
  <li><strong>Prud'hommes</strong> — litiges salarié/employeur. <strong>Inspection du travail</strong> — contrôle du droit du travail.</li>
  <li><strong>Droit de grève</strong> et <strong>liberté syndicale</strong> garantis ; le salarié gréviste n'est pas rémunéré pendant l'arrêt.</li>
  <li><strong>Droit de retrait</strong> en cas de danger grave et imminent.</li>
  <li>Le <strong>travail dissimulé</strong> est un délit : il prive de retraite, de chômage et de couverture accident.</li>
</ul>`,
      },
      {
        h: 'Logement et vie quotidienne',
        html: `
<ul>
  <li><strong>Bail</strong> — le dépôt de garantie est limité à 1 mois de loyer hors charges (2 mois en meublé). Le propriétaire ne peut pas entrer sans l'accord du locataire.</li>
  <li><strong>Préavis</strong> — 3 mois en principe, 1 mois en zone tendue ou dans certains cas (mutation, perte d'emploi, RSA).</li>
  <li><strong>Logement social</strong> — demande en ligne, numéro unique, à renouveler chaque année. <strong>DALO</strong> en cas de situation prioritaire.</li>
  <li><strong>115</strong> — hébergement d'urgence.</li>
  <li><strong>Banque</strong> — le <strong>droit au compte</strong> permet à toute personne résidant en France d'obtenir un compte, via la Banque de France en cas de refus.</li>
  <li><strong>Consommation</strong> — garantie légale de conformité de 2 ans ; droit de rétractation de 14 jours pour un achat à distance ou un démarchage à domicile ; médiateur de la consommation gratuit.</li>
  <li><strong>Voisinage</strong> — le tapage nocturne est sanctionné ; le tri des déchets est organisé par la commune.</li>
  <li><strong>Conduire</strong> — permis valide, assurance obligatoire, contrôle technique.</li>
</ul>`,
      },
      {
        h: 'Démarches et services publics',
        html: `
<ul>
  <li><strong>service-public.fr</strong> — portail officiel des démarches. Méfiez-vous des sites payants qui imitent l'administration : les démarches sont gratuites sur les sites en <strong>.gouv.fr</strong>.</li>
  <li><strong>France Services</strong> — guichets de proximité pour être accompagné (CAF, impôts, retraite, France Travail, titres d'identité).</li>
  <li><strong>Mairie</strong> — état civil (naissance dans les 5 jours, mariage, décès), inscription scolaire, listes électorales, carte d'identité.</li>
  <li><strong>Impôts</strong> — prélèvement à la source depuis 2019, déclaration annuelle obligatoire.</li>
  <li><strong>OFII</strong> — contrat d'intégration républicaine (formation civique et linguistique). <strong>OFPRA</strong> — demandes d'asile.</li>
  <li><strong>Principes du service public</strong> — égalité, continuité, neutralité, adaptabilité.</li>
  <li><strong>Engagement citoyen</strong> — associations loi 1901, bénévolat, participation à la vie locale.</li>
</ul>`,
      },
    ],
  },

  /* ------------------------------------------------------------------ 6 */
  {
    key: 'examen-pratique',
    theme: null,
    icon: 'info',
    title: "L'examen civique en pratique",
    subtitle: 'Format, inscription, ce qui est attendu',
    sections: [
      {
        h: 'Le cadre',
        html: `
<p>L'examen civique est institué par le <strong>décret n° 2025-648 du 15 juillet 2025</strong>. Son programme, ses épreuves et ses modalités sont fixés par l'<strong>arrêté du 10 octobre 2025</strong>. Il s'applique aux demandes déposées à compter du <span class="key">1er janvier 2026</span>.</p>
<p>Le document de référence est le <strong>livret du citoyen</strong> édité par le ministère de l'Intérieur (version approuvée par l'arrêté du 3 juillet 2026), téléchargeable gratuitement sur les sites en .gouv.fr.</p>`,
      },
      {
        h: "Le format de l'épreuve",
        html: `
<ul>
  <li><strong>40 questions</strong> à choix multiples, en français, sur ordinateur ou tablette.</li>
  <li><strong>45 minutes</strong> maximum.</li>
  <li><strong>32 bonnes réponses sur 40</strong> (80 %) pour être reçu.</li>
  <li><strong>28 questions de connaissances</strong> et <strong>12 mises en situation</strong>.</li>
</ul>
<h4>Répartition officielle des 40 questions</h4>
<ul>
  <li>Principes et valeurs de la République : <strong>11</strong> (dont 3 devise et symboles, 2 laïcité, 6 mises en situation)</li>
  <li>Droits et devoirs : <strong>11</strong> (dont 6 mises en situation)</li>
  <li>Histoire, géographie et culture : <strong>8</strong></li>
  <li>Système institutionnel et politique : <strong>6</strong> (dont 3 démocratie et droit de vote, 2 organisation de la République, 1 institutions européennes)</li>
  <li>Vivre dans la société française : <strong>4</strong></li>
</ul>
<p>C'est exactement cette répartition qui est utilisée pour composer les examens blancs de cette application.</p>`,
      },
      {
        h: 'Inscription et déroulement',
        html: `
<ul>
  <li>L'examen se passe dans un <strong>centre agréé</strong> par le ministère de l'Intérieur (notamment France Éducation international et le réseau des chambres de commerce et d'industrie).</li>
  <li>L'inscription se fait <strong>en ligne auprès du centre choisi</strong>, avec paiement des droits d'inscription (ordre de grandeur : 70 à 100 €).</li>
  <li>L'<strong>attestation de réussite</strong> n'a pas de durée de validité.</li>
  <li>L'examen civique <strong>s'ajoute</strong> aux autres conditions : niveau de langue exigé et entretien d'assimilation.</li>
</ul>
<blockquote>Ces informations sont données à titre indicatif et peuvent évoluer. Vérifiez toujours auprès de votre préfecture, sur service-public.fr et auprès du centre d'examen.</blockquote>`,
      },
      {
        h: 'Méthode de préparation',
        html: `
<ul>
  <li><strong>Semaines 1 à 2</strong> — parcourez les fiches et faites de l'entraînement thème par thème, sans chronomètre. L'objectif est de voir toutes les questions au moins une fois.</li>
  <li><strong>Ensuite</strong> — ouvrez chaque jour la <strong>révision du jour</strong> : elle vous représente les questions au bon moment, juste avant que vous ne les oubliiez.</li>
  <li><strong>Chaque semaine</strong> — passez un <strong>examen blanc complet</strong> de 45 minutes, sans interruption, pour travailler l'endurance et la gestion du temps.</li>
  <li><strong>Ciblez</strong> les thèmes dont la barre de maîtrise est la plus courte dans l'onglet Progrès.</li>
  <li><strong>Objectif</strong> — viser 36/40 en examen blanc plutôt que 32 : cela laisse une marge le jour J.</li>
</ul>`,
      },
    ],
  },
];

export const COURS_BY_KEY = new Map(COURS.map((c) => [c.key, c]));
