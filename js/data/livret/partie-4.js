/**
 * Livret du citoyen — édition mai 2026.
 * Partie 4 : Histoire, géographie et culture (pages 37 à 60).
 */

export default {
  key: 'p4',
  num: '4',
  title: 'Histoire, géographie et culture',
  icon: 'book',
  pages: '37 à 60',
  chapters: [
    {
      key: 'p4-i',
      num: 'I',
      title: 'Principales périodes et personnages',
      pages: '38 à 48',
      sections: [
        {
          h: 'A. Les principales périodes',
          html: `
<p>Le fonctionnement et les valeurs de la société française trouvent leurs origines dans son histoire. Les éléments qui suivent ne visent pas à résumer toute l'histoire de France, mais à présenter quelques étapes majeures de sa construction.</p>
<h4>Frise des périodes</h4>
<ul>
  <li><strong>476 – 1492</strong> : le Moyen-Âge</li>
  <li><strong>1492 – 1789</strong> : l'Ancien Régime</li>
  <li><strong>1789 – 1792</strong> : Révolution française et période révolutionnaire (DDHC, monarchie constitutionnelle)</li>
  <li><strong>1792 – 1804</strong> : Première République</li>
  <li><strong>1804 – 1814</strong> : Premier Empire (Code civil)</li>
  <li><strong>1814 – 1830</strong> : Restauration</li>
  <li><strong>1830 – 1848</strong> : Monarchie de Juillet</li>
  <li><strong>1848 – 1852</strong> : Deuxième République</li>
  <li><strong>1852 – 1870</strong> : Second Empire</li>
  <li><strong>1870 – 1940</strong> : Troisième République</li>
  <li><strong>1940 – 1944</strong> : régime de Vichy</li>
  <li><strong>1944 – 1946</strong> : GPRF (Gouvernement provisoire de la République française) — Sécurité sociale</li>
  <li><strong>1946 – 1958</strong> : Quatrième République</li>
  <li><strong>1958 – …</strong> : Cinquième République (Constitution)</li>
</ul>`,
        },
        {
          h: 'Le Moyen-Âge (V<sup>e</sup> au XV<sup>e</sup> siècle)',
          html: `
<p><strong>Clovis (466-511)</strong> unifie plusieurs royaumes habités par des peuples francs. C'est une étape importante dans la construction de l'unité du territoire français. Il adopte la religion chrétienne.</p>
<p><strong>Jeanne d'Arc (1412-1431)</strong> est une jeune paysanne qui a joué un rôle important pendant la <strong>guerre de Cent Ans</strong>, un conflit entre la France et l'Angleterre. Elle conduit les troupes françaises à la libération d'une partie du territoire. Elle est devenue une héroïne nationale, symbole du patriotisme et du courage.</p>`,
        },
        {
          h: "L'Ancien Régime (1492-1789)",
          html: `
<p>L'Ancien Régime est marqué par la <strong>monarchie absolue</strong> : le roi concentre tous les pouvoirs. Les rois sont couronnés à la <strong>cathédrale de Reims</strong>. À cette époque, un État puissant et centralisé se met en place.</p>
<p><strong>Henri IV (1553-1610)</strong>, roi de France, promulgue en <span class="key">1598</span> un décret appelé l'<strong>édit de Nantes</strong>. Ce décret met fin aux guerres de religion entre catholiques et protestants.</p>
<p><strong>Molière</strong> est un auteur de pièces de théâtre (dramaturge) et un comédien français. Il a vécu au XVII<sup>e</sup> siècle, pendant le règne de Louis XIV. Il est très connu pour ses comédies, comme « L'Avare » et « Le Bourgeois gentilhomme ».</p>
<p><strong>Louis XIV</strong>, appelé le « <strong>Roi-Soleil</strong> », est un roi emblématique de France. Il règne <span class="key">de 1643 à 1715</span>. Pendant son règne, il a notamment fait construire le <strong>château de Versailles</strong>, joyau de l'architecture classique, situé près de Paris.</p>
<p><strong>Les philosophes des Lumières</strong> — Rousseau, Voltaire, Diderot, Montesquieu, Condorcet, d'Alembert… — combattent, à travers leurs œuvres, pour la tolérance, la liberté de pensée et le refus de l'arbitraire. Leur pensée a influencé les idéaux de la Révolution française de liberté, d'égalité et de fraternité. En particulier, <strong>Montesquieu dénonce l'esclavage</strong>.</p>`,
        },
        {
          h: 'La Révolution française (1789-1792)',
          html: `
<p>Le <span class="key">14 juillet 1789</span>, les Parisiens s'emparent de la <strong>Bastille</strong>. Cette prison royale est le symbole du pouvoir monarchique arbitraire. Cet événement marque le début de la Révolution française et conduit à la fin de la monarchie absolue.</p>
<p>La Révolution française est à l'origine de nos valeurs républicaines, avec l'adoption de la <strong>Déclaration des droits de l'homme et du citoyen de 1789</strong>. Le <strong>marquis de La Fayette</strong> a notamment contribué à son écriture.</p>
<p>En <strong>1791</strong>, une <strong>monarchie constitutionnelle</strong> est mise en place. Les pouvoirs du roi <strong>Louis XVI</strong> sont limités. Sa tentative de fuite vers l'étranger et les tensions sociales dressent le peuple contre lui. Le <strong>10 août 1792</strong>, il est renversé puis jugé. Il est guillotiné sur la place de la Concorde en <strong>1793</strong>.</p>`,
        },
        {
          h: 'La Première République (1792-1804)',
          html: `
<p>La Première République débute en <span class="key">1792</span> à la fin de la monarchie constitutionnelle et est l'héritière de la Révolution française.</p>
<p>À cette époque, la France fait face à de nombreuses menaces : des révoltes à l'intérieur du pays ainsi que des guerres avec d'autres pays. Dans ces circonstances, le gouvernement met en place <strong>le régime de la Terreur</strong>. Les autorités surveillent strictement les ennemis de la Révolution. Les personnes soupçonnées d'être des traîtres à la Révolution sont guillotinées.</p>
<p><strong>Maximilien Robespierre</strong> est un homme important de la Révolution française. Il défend l'égalité et la République, mais il dirige aussi la Terreur.</p>
<p>En <strong>1799</strong>, <strong>Napoléon Bonaparte</strong> prend le pouvoir, il met fin à la I<sup>re</sup> République en 1804 et proclame le Premier Empire.</p>`,
        },
        {
          h: 'Le Premier Empire (1804-1815)',
          html: `
<p>Napoléon Bonaparte devient empereur en <span class="key">1804</span>. Il gouverne la France pendant environ 15 ans. Pendant cette période, il conduit des réformes importantes qui structurent l'État français tel qu'on le connaît aujourd'hui. Il est notamment à l'origine du <strong>Code civil</strong>, de la <strong>Banque de France</strong> et de la <strong>création des préfets</strong>.</p>
<p>Il mène de nombreuses guerres en Europe pour étendre son empire et centralise le pouvoir en contrôlant la presse et les opposants.</p>
<p><strong>Napoléon rétablit l'esclavage en 1802</strong> puis abolit la traite des Noirs en 1815.</p>
<p>Affaibli par ses défaites militaires, Napoléon abdique définitivement en <strong>1815</strong> après la <strong>bataille de Waterloo</strong>. Le Premier Empire prend fin et la monarchie est restaurée.</p>`,
        },
        {
          h: 'La Restauration et la Monarchie de Juillet (1815-1848)',
          html: `
<p>La <strong>Restauration de la Monarchie</strong> commence en 1815 avec le retour de <strong>Louis XVIII</strong>. Il rétablit la monarchie tout en conservant la <strong>Charte constitutionnelle</strong> qui protège des libertés, comme la presse ou l'élection du Parlement. Toutefois, il adopte des mesures conservatrices, en renforçant le rôle de l'Église et en surveillant les opposants.</p>
<p>En <strong>1824</strong>, <strong>Charles X</strong> succède à Louis XVIII.</p>
<p>En <strong>1830</strong>, la population se révolte à Paris, en raison des limitations trop importantes des libertés. La Restauration prend fin et une monarchie plus libérale, appelée <strong>Monarchie de Juillet</strong>, commence avec l'arrivée au pouvoir du roi <strong>Louis-Philippe</strong>.</p>
<p>Il renforce le rôle du Parlement et garantit davantage de libertés, comme celle de la presse. Le pouvoir s'appuie surtout sur la bourgeoisie, et le droit de vote reste limité aux plus riches.</p>
<p>Peu à peu, les inégalités sociales augmentent et le refus d'élargir le droit de vote provoque des tensions. En <strong>1848</strong>, une autre révolution éclate et met fin à ce régime.</p>`,
        },
        {
          h: 'La Deuxième République (1848-1852)',
          html: `
<p>La Deuxième République débute après deux périodes de monarchie : la Restauration (1815-1830) et la Monarchie de Juillet (1830-1848).</p>
<p>Cette époque est particulièrement marquée par <strong>l'abolition de l'esclavage, en 1848</strong>. <strong>Victor Schoelcher</strong>, sous-secrétaire d'État chargé des colonies, rédige le décret qui met fin à l'esclavage.</p>
<h4>L'esclavage</h4>
<p>À partir du XVII<sup>e</sup> siècle, l'esclavage s'est développé autour de la <strong>traite transatlantique</strong> et de l'esclavage colonial dans les territoires d'outre-mer. Cette traite a impliqué la déportation forcée d'<strong>1,2 million d'Africains</strong> vers les colonies des Antilles (Saint-Domingue, Martinique, Guadeloupe), de la Réunion et de la Guyane. L'esclavage y était pratiqué jusqu'en 1848. Ces personnes travaillaient principalement dans les plantations (canne à sucre, café…), dans des conditions extrêmement difficiles. <strong>Nantes</strong> était le principal port français impliqué dans la traite transatlantique en France.</p>
<p>La France reconnaît désormais la traite et l'esclavage comme un <strong>crime contre l'humanité (loi Taubira de 2001)</strong>. Chaque année, le <span class="key">10 mai</span>, est commémorée la journée nationale des mémoires de la traite, de l'esclavage et de leurs abolitions.</p>
<p><strong>Victor Hugo (1802-1885)</strong> est l'un des plus grands écrivains français. Il s'est engagé contre les inégalités sociales et la peine de mort. Il a notamment écrit « Les Misérables » et « Notre-Dame de Paris ».</p>`,
        },
        {
          h: 'Le Second Empire (1852-1870)',
          html: `
<p><strong>Louis-Napoléon Bonaparte</strong>, neveu de Napoléon I<sup>er</sup>, élu président de la République, organise un <strong>coup d'État en décembre 1851</strong> et devient empereur sous le nom de <strong>Napoléon III</strong> en 1852.</p>
<p>Le Second Empire débute par un régime autoritaire, avant d'évoluer dans les années 1860 : la population obtient alors plus de libertés et le Parlement davantage de pouvoirs. Pendant cette période, l'économie se modernise et la France s'ouvre à l'Europe.</p>
<p>Le Second Empire prend fin en <strong>1870</strong>, après la défaite de l'armée française lors de la guerre contre la <strong>Prusse</strong>.</p>`,
        },
        {
          h: 'La Troisième République (1870-1940)',
          html: `
<p>La III<sup>e</sup> République installe dans la durée le régime républicain en France. Cette période est marquée notamment par la généralisation de <strong>l'école publique gratuite en 1881</strong> et de <strong>l'école laïque et obligatoire en 1882</strong>, grâce aux lois de <strong>Jules Ferry</strong> alors ministre de l'Instruction publique.</p>
<p>C'est également sous ce régime que les grandes lois garantissant les libertés sont adoptées :</p>
<ul>
  <li>la <strong>loi du 29 juillet 1881</strong> sur la liberté de la presse,</li>
  <li>la <strong>loi du 21 mars 1884</strong> autorisant la création des syndicats,</li>
  <li>la <strong>loi du 1er juillet 1901</strong> sur la liberté d'association,</li>
  <li>la <strong>loi du 9 décembre 1905</strong> sur la séparation des Églises et de l'État (loi sur la laïcité).</li>
</ul>
<h4>La Première Guerre mondiale (1914-1918)</h4>
<p>Aussi appelée « la grande guerre », c'est un conflit militaire impliquant dans un premier temps les puissances européennes, dont la France, et s'étendant ensuite à plusieurs continents.</p>
<p>Elle débute en juillet 1914 et s'achève avec l'<strong>armistice du 11 novembre 1918</strong> par la victoire de la France, dirigée par le Président du Conseil <strong>Georges Clémenceau</strong>, et de ses alliés (Grande-Bretagne, Italie et États-Unis) sur l'empire allemand et ses alliés (empire austro-hongrois et empire ottoman).</p>
<p>Chaque année, le <strong>11 novembre</strong> est un jour férié afin de commémorer l'Armistice, la victoire, la paix et rendre hommage à tous les morts pour la France.</p>
<p>Cette guerre a causé la mort de <strong>10 millions de personnes dont 1,45 million pour la France</strong>. Elle a profondément bouleversé l'Europe : modification de nombreuses frontières, création de nouveaux pays issus de la disparition des anciens empires, révolution bolchévique en Russie (qui devient l'URSS) et montée en puissance des États-Unis d'Amérique.</p>
<p>Le <strong>traité de Versailles du 28 juin 1919</strong> met fin à la guerre et prévoit la création de la <strong>Société des Nations</strong> qui a inspiré plus tard l'Organisation des Nations Unies.</p>
<h4>La Seconde Guerre mondiale (1939-1945)</h4>
<p>Elle est déclenchée par <strong>Adolf Hitler</strong>, dictateur nazi au pouvoir en Allemagne. Il envahit notamment la France en 1940, qui sera occupée d'abord partiellement, puis totalement à partir de 1942. Dans les territoires qu'ils contrôlent, les nazis persécutent les opposants politiques et exterminent des millions de Juifs (<strong>la Shoah</strong>) ainsi que des milliers de Tsiganes, d'homosexuels et d'handicapés. Les historiens estiment que la guerre a fait <strong>plus de 50 millions de morts</strong>, dont une majorité de civils.</p>`,
        },
        {
          h: 'Le régime de Vichy et la Libération (1940-1946)',
          html: `
<h4>Le régime de Vichy (1940-1944)</h4>
<p>Après la défaite de la France face à l'Allemagne, le <strong>maréchal Pétain</strong> met en place un régime autoritaire non démocratique dont la capitale est <strong>Vichy</strong>. Le régime <strong>collabore avec l'Allemagne nazie</strong> et porte une part de responsabilité dans la déportation des Juifs.</p>
<h4>La Résistance</h4>
<p>La collaboration du régime de Vichy avec l'occupant allemand n'est pas acceptée par une partie de la population qui résiste à l'occupation. Cette résistance s'unifie sous la direction de <strong>Jean Moulin</strong> (qui sera arrêté et torturé à mort par les nazis) missionné en ce sens par le Général de Gaulle, chef de la France libre.</p>
<h4>La fin de la Seconde Guerre mondiale</h4>
<p>La libération de la France débute par le <strong>débarquement des Alliés</strong> (États-Unis, URSS, Grande-Bretagne et France) en <strong>Normandie le 6 juin 1944</strong>, appuyés par les forces de la Résistance française. Le <strong>25 août 1944</strong>, la ville de Paris est libérée.</p>
<p>L'Allemagne capitule le <span class="key">8 mai 1945</span> face aux Alliés. Le 8 mai est un jour férié destiné à commémorer la fin de la Seconde Guerre mondiale.</p>
<h4>Charles de Gaulle (1890-1970)</h4>
<p>Chef de la résistance française contre les armées allemandes qui occupent la France, il est l'artisan, avec les Alliés, de la libération de la France. Son appel via la radio britannique (BBC), le <span class="key">18 juin 1940</span>, marque le début de la Résistance.</p>
<p>Il dirige la France à la Libération : il prend la tête du gouvernement de la République française jusqu'au 20 janvier 1946.</p>
<p>Bien après la guerre, en <strong>1958</strong>, il revient au pouvoir et est à l'origine de nos institutions actuelles (la V<sup>e</sup> République, dont il devient le premier Président).</p>`,
        },
        {
          h: 'La Quatrième République (1946-1958)',
          html: `
<p>La Quatrième République débute en 1946. Elle repose sur une Constitution marquée par l'importance du <strong>pouvoir législatif</strong> (détenu par le Parlement) par rapport au pouvoir exécutif (incarné par le président du Conseil). Ce déséquilibre entre les pouvoirs et l'absence de majorité au Parlement entraîne une instabilité du gouvernement et affaiblit le régime qui s'effondre en <strong>1958</strong>.</p>`,
        },
        {
          h: 'La Cinquième République (1958 à aujourd\'hui)',
          html: `
<h4>L'instauration de la V<sup>e</sup> République</h4>
<p>Face à la crise politique majeure liée à la <strong>guerre d'Algérie</strong> et à l'instabilité gouvernementale de la IV<sup>e</sup> République, le Général de Gaulle est appelé au pouvoir à l'été 1958 en tant que président du Conseil avec pour mission de rédiger une nouvelle constitution.</p>
<p>Adoptée par référendum du <strong>28 septembre 1958</strong>, la Constitution de la V<sup>e</sup> République est promulguée le <span class="key">4 octobre 1958</span>. Elle installe un pouvoir exécutif fort, avec un président doté de pouvoirs importants. Afin de préserver la continuité et la stabilité du Gouvernement, la V<sup>e</sup> République limite les conditions dans lesquelles le Gouvernement peut être renversé par l'Assemblée nationale.</p>
<h4>La décolonisation française</h4>
<p>Entre le XVII<sup>e</sup> et le XIX<sup>e</sup> siècle, la France conquiert un vaste empire colonial, notamment en Afrique (Afrique de l'Ouest, Afrique équatoriale, Algérie, Madagascar, Maroc, Tunisie…) et en Asie (Indochine…).</p>
<p>Après la Seconde Guerre mondiale, des mouvements nationalistes émergent dans les colonies et réclament leur indépendance. La plupart d'entre elles l'obtiennent dans les années 1950 et 1960, dans le cadre de processus négociés. Toutefois, <strong>deux conflits meurtriers</strong> éclatent concernant la décolonisation de l'<strong>Indochine (1946-1954)</strong> et de l'<strong>Algérie (1954-1962)</strong>.</p>
<h4>Mai 1968</h4>
<p>Un mouvement social est initié par des étudiants qui réclament une amélioration de leurs conditions d'études et davantage de libertés. Ce mouvement est amplifié par une contestation sociale plus large, portée par les salariés et les syndicats d'ouvriers. Les grèves et les manifestations qui ont alors lieu sont parmi les plus importantes du XX<sup>e</sup> siècle. Ce mouvement se conclut avec des avancées sociales importantes, comme l'augmentation du salaire minimum.</p>
<h4>L'abaissement de la majorité à 18 ans en 1974</h4>
<p>Il s'agit d'une des premières décisions du président <strong>Valéry Giscard d'Estaing</strong> après son élection en 1974. Toutes les lois qui imposent un âge minimum de 21 ans pour exercer les droits civiques comme le vote sont modifiées pour abaisser l'âge minimum à 18 ans.</p>
<h4>La dépénalisation de l'avortement en 1975</h4>
<p>Depuis la <strong>loi « Veil » du 17 janvier 1975</strong>, l'avortement est « dépénalisé ». Cette loi a été présentée et soutenue par <strong>Simone Veil</strong>, ministre de la Santé. Elle s'inscrit dans la continuité de la <strong>loi Neuwirth de 1967</strong> autorisant la contraception orale (la pilule). Elle permet aux femmes de maîtriser leur fécondité et d'avorter dans des conditions encadrées par la loi et sécurisées médicalement.</p>
<h4>L'abolition de la peine de mort en 1981</h4>
<p>Depuis 1981, la peine de mort est interdite par la loi. C'est <strong>Robert Badinter</strong>, ministre de la Justice de François Mitterrand, qui a soutenu cette abolition totale.</p>
<h4>Le mariage pour tous en 2013</h4>
<p>Le <strong>17 mai 2013</strong>, une loi permettant aux couples homosexuels de se marier et d'adopter des enfants a été votée. Cette loi a été soutenue par <strong>Christiane Taubira</strong>, ministre de la Justice sous la présidence de François Hollande. Le premier mariage homosexuel en France est célébré à la mairie de <strong>Montpellier le 29 mai 2013</strong>.</p>`,
        },
        {
          h: 'B. Les présidents de la V<sup>e</sup> République',
          html: `
<ul>
  <li><strong>1959</strong> — Charles de Gaulle</li>
  <li><strong>1969</strong> — Georges Pompidou <em>(seul président de la V<sup>e</sup> République décédé au cours de son mandat)</em></li>
  <li><strong>1974</strong> — Valéry Giscard d'Estaing</li>
  <li><strong>1981</strong> — François Mitterrand <em>(réélection en 1988)</em></li>
  <li><strong>1995</strong> — Jacques Chirac <em>(réélection en 2002)</em></li>
  <li><strong>2007</strong> — Nicolas Sarkozy</li>
  <li><strong>2012</strong> — François Hollande</li>
  <li><strong>2017</strong> — Emmanuel Macron <em>(réélection en 2022)</em></li>
</ul>
<blockquote>En cas de décès du président en cours de mandat, <strong>le président du Sénat</strong> remplace le Président de la République jusqu'à la fin de l'élection présidentielle organisée en urgence.</blockquote>`,
        },
        {
          h: 'Des personnalités naturalisées qui ont contribué au rayonnement de la France',
          html: `
<p>Au fil de son histoire, de nombreuses personnes sont venues vivre en France. Beaucoup ont choisi de devenir françaises. Nombre de grands noms ont ainsi contribué, par leur talent, au rayonnement de la France dans les domaines culturel, économique, scientifique, politique ou sportif.</p>
<ul>
  <li><strong>Léon Gambetta (1838-1882)</strong> — petit-fils d'un commerçant italien, fervent républicain, il aide la France à se relever après la défaite de 1870. Il est un des pères de la III<sup>e</sup> République.</li>
  <li><strong>Vassily Kandinsky (1866-1944)</strong> — peintre d'origine russe, l'un des fondateurs de l'art abstrait.</li>
  <li><strong>Marie Curie (1867-1934)</strong> — physicienne née en Pologne. On lui doit la découverte de la radioactivité, prix Nobel de physique en 1903 (partagé avec Pierre Curie et Henri Becquerel), puis prix Nobel de chimie en 1911 pour l'isolement du radium. Elle est inhumée au Panthéon.</li>
  <li><strong>Maurice-François Garin (1871-1957)</strong> — cycliste professionnel né en Italie, remporte en 1903 le premier Tour de France de l'Histoire.</li>
  <li><strong>Guillaume Apollinaire (1880-1918)</strong> — né d'une mère russe et d'un père suisse, poète, auteur de « Calligramme » et « Alcools ».</li>
  <li><strong>Marc Chagall (1887-1985)</strong> — peintre d'origine russe, décoration du plafond de l'Opéra Garnier de Paris.</li>
  <li><strong>Marguerite Yourcenar (1903-1987)</strong> — née à Bruxelles, écrivaine française d'origine belge, célèbre pour « Mémoires d'Hadrien » et première femme élue à l'Académie française.</li>
  <li><strong>Joséphine Baker (1906-1975)</strong> — d'origine américaine, première chanteuse, danseuse et meneuse de revue noire reconnue. Elle s'illustra dans la Résistance.</li>
  <li><strong>Haroun Tazieff (1914-1998)</strong> — né à Varsovie, père de la volcanologie contemporaine.</li>
  <li><strong>Romain Gary (1914-1980)</strong> — d'origine russe, seul écrivain à recevoir le prix Goncourt à deux reprises (1956 puis 1975 sous le pseudonyme d'Émile Ajar).</li>
  <li><strong>Françoise Giroud (1916-2003)</strong> — d'origine suisse, co-fondatrice de « l'Express », deux fois Secrétaire d'État.</li>
  <li><strong>Andrée Chedid (1920-2011)</strong> — née en Égypte, femme de lettres et poétesse française.</li>
  <li><strong>Maria Casarès (1922-1996)</strong> — née en Espagne, actrice majeure de théâtre et de cinéma français.</li>
  <li><strong>Georges Charpak (1924-2010)</strong> — physicien d'origine polonaise, prix Nobel de physique en 1992.</li>
  <li><strong>Miriam Makeba (1932-2008)</strong> — engagée dans la lutte contre l'apartheid, première chanteuse sud-africaine à obtenir un Grammy Award.</li>
  <li><strong>Dalida (1933-1987)</strong> — chanteuse d'origine égyptienne (« Bambino », « Il venait d'avoir 18 ans », « Laisse-moi danser »).</li>
  <li><strong>Georges Moustaki (1934-2013)</strong> — chanteur d'origine italo-grecque, l'un des grands noms de la chanson française.</li>
</ul>
<blockquote>Seules sont mentionnées ici des personnes naturalisées. Beaucoup d'autres auraient pu être citées.</blockquote>`,
        },
      ],
    },

    {
      key: 'p4-ii',
      num: 'II',
      title: 'Territoire et géographie',
      pages: '49 à 52',
      sections: [
        {
          h: 'La France en chiffres',
          html: `
<p>En <strong>2025</strong>, la France compte <span class="key">68,6 millions d'habitants</span> et son territoire s'étend sur <span class="key">675 000 km²</span>, en métropole et outre-mer.</p>
<p>La France métropolitaine est située à l'ouest de l'Europe et partage ses frontières terrestres avec <span class="key">8 pays</span> : <strong>Allemagne, Andorre, Belgique, Espagne, Italie, Luxembourg, Monaco et Suisse</strong>.</p>
<p>La France métropolitaine dispose de <strong>5 500 km de côtes</strong>, ouvertes sur la <strong>Manche</strong> (entre la France et l'Angleterre), la <strong>mer du Nord</strong>, l'<strong>océan Atlantique</strong> et la <strong>mer Méditerranée</strong>.</p>
<p>Au 1er janvier 2025, les plus grandes villes en France sont : <strong>Paris, Lyon, Lille, Marseille, Toulouse, Bordeaux, Nantes, Nice et Strasbourg</strong>. Ces villes ont une dimension internationale.</p>`,
        },
        {
          h: 'A. La France dans le monde',
          html: `
<p>La France est l'une des <strong>dix plus grandes puissances mondiales</strong>. Elle joue un rôle important dans les relations internationales grâce à son histoire, son réseau et sa capacité à défendre ses positions.</p>
<p>Elle est <strong>membre permanent du Conseil de sécurité de l'Organisation des Nations Unies (ONU)</strong>. Ce statut lui donne un <strong>droit de veto</strong> (possibilité de bloquer l'adoption d'une décision en votant contre), renforçant son influence internationale.</p>
<p>La France a des ambassades et des consulats dans <strong>plus de 150 pays</strong>. C'est l'un des plus grands réseaux au monde.</p>
<p>Elle est aussi un membre actif de nombreuses organisations ou instances internationales : l'Union européenne, l'ONU, mais aussi l'<strong>Organisation du Traité de l'Atlantique Nord (OTAN)</strong>, le <strong>G7</strong>, le <strong>G20</strong>, l'<strong>Organisation internationale de la Francophonie</strong>…</p>
<blockquote>L'ONU a été créée en <strong>1945</strong>, après la Seconde Guerre mondiale pour, notamment, maintenir la paix et la sécurité internationale.</blockquote>`,
        },
        {
          h: "B. L'économie de la France",
          html: `
<p>En <strong>2024</strong>, la France est la <span class="key">7<sup>e</sup> puissance économique mondiale</span> avec un produit intérieur brut (PIB) de <strong>2 830 milliards de dollars</strong>.</p>
<p>La France compte une <strong>centaine de grands groupes économiques</strong> de plus de 10 000 salariés. Ces entreprises multinationales françaises sont présentes dans de nombreux pays.</p>
<h4>Les secteurs d'excellence</h4>
<ul>
  <li>L'aéronautique et le spatial,</li>
  <li>Le luxe et la mode,</li>
  <li>L'agroalimentaire,</li>
  <li>L'énergie,</li>
  <li>La pharmacie et les biotechnologies,</li>
  <li>Le numérique,</li>
  <li>L'automobile.</li>
</ul>
<blockquote>La France joue un rôle central dans l'accès européen à l'espace : par son implication au sein de l'Agence spatiale européenne et de la société Arianegroupe, et par l'utilisation du <strong>pas de tir de Kourou, en Guyane</strong>, d'où décollent les fusées Ariane.</blockquote>
<h4>Les ports et la puissance maritime</h4>
<p>Plus de <strong>90 % du commerce international de marchandises s'effectue par bateau</strong>. Les plus grands ports maritimes commerciaux français sont : <strong>Le Havre, Marseille-Fos, Dunkerque, Nantes-Saint-Nazaire</strong>.</p>
<p>Grâce à ses territoires en outre-mer et une présence sur tous les océans, la France est la <strong>deuxième puissance maritime au monde derrière les États-Unis</strong>.</p>
<h4>L'agriculture</h4>
<p>La France est la <strong>première puissance agricole de l'Union européenne</strong>, avec la production de <strong>24 % des céréales européennes</strong> et le <strong>premier cheptel bovin d'Europe</strong>. Elle exporte du blé, du vin, des produits laitiers et de la viande, mais importe des fruits, des légumes et des produits transformés.</p>
<p>Environ <strong>la moitié du territoire français</strong> est utilisée par l'agriculture :</p>
<ul>
  <li>Le <strong>bassin parisien</strong> : blé et betterave ;</li>
  <li>La <strong>Bretagne et l'Ouest</strong> : vaches laitières et porcs ;</li>
  <li>Le <strong>Sud-Ouest</strong> : élevage et maïs ;</li>
  <li>Le <strong>Sud-Est</strong> : fruits, légumes et vin ;</li>
  <li>La <strong>Bourgogne, la Champagne, le Languedoc</strong> et le terroir de <strong>Bordeaux</strong> : vignobles.</li>
</ul>`,
        },
        {
          h: 'C. Quelques éléments remarquables du territoire',
          html: `
<h4>1. Les chaînes de montagnes</h4>
<p>Les <strong>Alpes</strong> s'étendent en Europe et séparent notamment la France de l'Italie. Le sommet du <strong>Mont-Blanc</strong> est la plus haute montagne de France et d'Europe (<span class="key">4 810 m</span>). Les Alpes sont particulièrement réputées pour leurs stations de ski en hiver.</p>
<p>Les <strong>Pyrénées</strong> se situent entre la France et l'Espagne.</p>
<p>Le <strong>Massif central</strong>, le <strong>Jura</strong> et les <strong>Vosges</strong> sont aussi des massifs montagneux situés en France.</p>
<h4>2. Les fleuves</h4>
<ul>
  <li>La <strong>Loire</strong>, <strong>plus long fleuve français</strong>, connue pour ses paysages naturels et ses châteaux ;</li>
  <li>La <strong>Seine</strong>, qui traverse Paris (capitale de la France) ;</li>
  <li>La <strong>Garonne</strong>, qui traverse Toulouse (chef-lieu de l'Occitanie) et Bordeaux (chef-lieu de la Nouvelle-Aquitaine) ;</li>
  <li>Le <strong>Rhône</strong>, qui traverse Lyon (chef-lieu de la région Auvergne-Rhône-Alpes) ;</li>
  <li>Le <strong>Rhin</strong>, qui délimite partiellement la frontière entre la France et l'Allemagne.</li>
</ul>
<h4>3. Les volcans</h4>
<p>En France, les principaux volcans en activité sont situés dans les îles des <strong>Antilles</strong>, de <strong>La Réunion</strong> et de <strong>Mayotte</strong>.</p>
<p>Le <strong>Piton de la Fournaise</strong>, situé sur l'île de La Réunion et atteignant <strong>2 600 mètres</strong> d'altitude, est l'un des volcans les plus actifs au monde. Il s'agit d'un site protégé, inscrit au patrimoine mondial de l'UNESCO.</p>
<h4>4. Les forêts</h4>
<p>La France est un grand pays forestier avec <strong>17,5 millions d'hectares en métropole, soit 32 % du territoire métropolitain</strong>.</p>
<p>La plus grande forêt en France est cependant la <strong>forêt amazonienne</strong> qui couvre <strong>8 millions d'hectares en Guyane</strong>. Cette forêt, qui s'étend sur 9 pays, abrite la plus grande variété d'animaux et de plantes de la planète et joue un rôle dans la régulation du climat.</p>
<h4>5. Les grottes préhistoriques</h4>
<p>Parmi les nombreuses grottes occupées pendant la préhistoire, la <strong>grotte de Lascaux</strong> est la plus célèbre. Située dans le département de la <strong>Dordogne</strong>, en région Nouvelle-Aquitaine, on y trouve des peintures rupestres datant <strong>entre 18 000 et 15 000 ans avant Jésus-Christ</strong>.</p>`,
        },
      ],
    },

    {
      key: 'p4-iii',
      num: 'III',
      title: 'La culture et le patrimoine',
      pages: '53 à 60',
      sections: [
        {
          h: 'La culture française',
          html: `
<p>La culture française s'est construite à travers des siècles d'histoire et d'influences extérieures. Elle est au cœur de l'identité du pays et constitue un repère commun qui unit les Français. Elle se manifeste notamment à travers le patrimoine architectural, la littérature, la musique, les arts visuels (peinture, sculpture, cinéma…), les festivals et les traditions locales.</p>
<p>Cette culture et ce patrimoine français sont également connus dans le monde entier et contribuent au rayonnement de la France, qui est la <strong>première destination touristique au monde</strong>.</p>
<h4>L'accès à la culture pour tous</h4>
<ul>
  <li><strong>Les musées publics</strong> : ils organisent des journées gratuites ou proposent des tarifs réduits afin de rendre les œuvres accessibles à tous.</li>
  <li><strong>Les bibliothèques et médiathèques</strong> : implantées dans la plupart des communes, elles donnent accès à des millions d'ouvrages.</li>
  <li><strong>Des événements culturels</strong> : les Journées du patrimoine, le festival de théâtre d'Avignon, le festival de jazz de Marciac ou celui du cinéma à Cannes.</li>
</ul>
<p>Le numérique joue par ailleurs un rôle important dans l'accès pour tous à la culture avec des plateformes en ligne comme « <strong>culture.gouv.fr</strong> ».</p>
<blockquote>Chaque année au mois de <strong>septembre</strong>, les <strong>Journées du patrimoine</strong> permettent aux visiteurs de découvrir et visiter de nombreux lieux, monuments et édifices habituellement fermés au public. Cet événement, <strong>créé en France en 1984</strong>, a désormais lieu dans 48 pays.</blockquote>
<p>On distingue le <strong>patrimoine matériel</strong> (biens et monuments qui retracent l'histoire de la culture française) et le <strong>patrimoine immatériel</strong> (traditions, art du spectacle, pratiques sociales et savoir-faire, comme la gastronomie).</p>`,
        },
        {
          h: 'A. Le patrimoine à travers les musées',
          html: `
<p>La France compte <strong>plus de 1 200 musées</strong>, dont une centaine de musées nationaux.</p>
<h4>1. Le musée du Louvre</h4>
<p>Le Louvre est l'un des plus célèbres musées parisiens et l'un des plus grands musées d'art du monde. Situé dans un ancien palais royal, il a été pensé dès sa création en <strong>1793</strong> comme un musée universel. Le tableau de « <strong>La Joconde</strong> », peint par <strong>Léonard de Vinci</strong>, y est exposé.</p>
<h4>2. Le musée d'Orsay</h4>
<p>Aussi situé à Paris, au bord de la Seine, face au jardin des Tuileries. Le bâtiment a été construit pour l'<strong>exposition universelle de 1900</strong>. Après avoir été une gare ferroviaire, il a été transformé en musée.</p>
<p>Il contient la <strong>plus grande collection de peintures impressionnistes et postimpressionnistes au monde</strong> : Claude Monet, Auguste Renoir, Paul Cézanne, Vincent Van Gogh.</p>`,
        },
        {
          h: 'B. Quelques artistes français célèbres',
          html: `
<ul>
  <li><strong>Claude Joseph Rouget de Lisle (1760-1836)</strong> — officier du génie et écrivain, célèbre pour avoir composé La Marseillaise.</li>
  <li><strong>George Sand (1804-1876)</strong> — romancière du XIX<sup>e</sup> siècle connue pour ses engagements féministes (« Indiana », « Lélia »). De son vrai nom Aurore Dupin, elle a utilisé un pseudonyme masculin.</li>
  <li><strong>Charles Baudelaire (1821-1867)</strong> — poète majeur du XIX<sup>e</sup> siècle, « Les Fleurs du Mal ».</li>
  <li><strong>Paul Cézanne (1839-1906)</strong> — peintre considéré comme le père de la peinture moderne et précurseur du cubisme.</li>
  <li><strong>Auguste Rodin (1840-1917)</strong> — sculpteur, un des pères de la sculpture moderne (« L'Âge d'airain », « Le penseur »).</li>
  <li><strong>Claude Monet (1840-1926)</strong> — peintre (« Les Nymphéas », « Impression, soleil levant »), un des fondateurs de l'impressionnisme.</li>
  <li><strong>Auguste Renoir (1841-1919)</strong> — peintre impressionniste, connu pour ses représentations de figures humaines.</li>
  <li><strong>Claude Debussy (1862-1918)</strong> — compositeur, l'un des plus grands musiciens français.</li>
  <li><strong>Suzanne Valadon (1865-1938)</strong> — peintre, l'une des premières femmes admises à la Société Nationale des Beaux-Arts.</li>
  <li><strong>Simone de Beauvoir (1908-1986)</strong> — écrivaine, considérée comme le précurseur du mouvement féministe français.</li>
  <li><strong>Albert Camus (1913-1960)</strong> — écrivain et philosophe né en Algérie, engagé dans la Résistance via le journal clandestin « Combat ».</li>
  <li><strong>Marguerite Duras (1914-1996)</strong> — écrivaine née près de Saïgon, « L'Amant ».</li>
  <li><strong>Édith Piaf (1915-1963)</strong> — figure emblématique de la chanson française (« Hymne à l'Amour », « La Vie en rose »). De son vrai nom Édith Gassion.</li>
</ul>`,
        },
        {
          h: 'C. Le patrimoine architectural',
          html: `
<h4>1. La tour Eiffel</h4>
<p>Conçue par l'ingénieur <strong>Gustave Eiffel</strong> pour l'<strong>Exposition universelle de 1889</strong>. Elle est devenue un symbole de Paris et attire <strong>plus de 7 millions de visiteurs</strong> chaque année.</p>
<h4>2. L'abbaye du Mont-Saint-Michel</h4>
<p>Îlot rocheux situé au milieu d'une baie en <strong>Normandie</strong>, au sommet duquel une abbaye a été construite. Important lieu de pèlerinage pendant des siècles, c'est aujourd'hui l'un des sites touristiques les plus visités de France, <strong>inscrit au patrimoine mondial culturel par l'UNESCO</strong>.</p>
<h4>3. Le Palais des Papes à Avignon</h4>
<p>Exemple exceptionnel d'architecture médiévale, situé dans le centre historique d'Avignon, en région Provence-Alpes-Côte-d'Azur, sur les rives du Rhône. L'un des plus magnifiques édifices de l'<strong>architecture gothique du XIV<sup>e</sup> siècle</strong>, inscrit au patrimoine mondial culturel par l'UNESCO.</p>`,
        },
        {
          h: 'D. La langue française',
          html: `
<p>Selon l'<strong>Organisation Internationale de la Francophonie (OIF)</strong>, le français est la <span class="key">4<sup>e</sup> langue la plus parlée au monde</span>, avec <strong>plus de 300 millions de personnes</strong> réparties dans les 5 continents. Le français est la langue officielle dans <strong>plus de 30 pays</strong>, notamment en Europe, en Afrique, dans les Caraïbes et au Canada.</p>
<p>La francophonie, ou communauté des peuples francophones, regroupe tous ceux qui parlent cette langue. L'OIF coordonne les <strong>93 États et gouvernements membres</strong> avec pour objectif de promouvoir le français et sa culture.</p>`,
        },
        {
          h: 'E. Les festivités nationales',
          html: `
<p>Ces évènements sont souvent associés à des jours fériés : la fête du 14 juillet, les fêtes de fin d'année, la fête du travail, le 8 mai (fin de la 2<sup>nde</sup> guerre mondiale)…</p>
<h4>1. La fête nationale du 14 juillet</h4>
<p>La fête nationale a lieu chaque 14 juillet <strong>depuis 1880</strong>. Ce jour férié commémore <strong>deux évènements</strong> :</p>
<ul>
  <li>La <strong>prise de la Bastille (14 juillet 1789)</strong> qui marque le début de la Révolution française, c'est-à-dire la révolte du peuple contre l'Ancien Régime. Elle symbolise la lutte pour la liberté ;</li>
  <li>La <strong>fête de la Fédération (14 juillet 1790)</strong>, affirmant l'attachement de la France à la Constitution.</li>
</ul>
<p>La fête du 14 juillet est à la fois un évènement institutionnel, avec un <strong>défilé militaire organisé à Paris sur les Champs-Élysées</strong> en présence du président de la République, et une fête populaire célébrant l'identité nationale dans tout le pays.</p>
<h4>2. La fête du Travail</h4>
<p>Le <strong>1er mai</strong> est la « fête du Travail » ou la « fête des Travailleurs ». Ce jour est <strong>férié depuis 1947</strong>. Il trouve ses racines dans la journée du 1er mai 1886, pendant laquelle les syndicats des États-Unis ont mené des actions pour avoir droit à la « journée de huit heures ».</p>
<p>À cette occasion, des manifestations sur la voie publique sont traditionnellement organisées chaque année par les organisations syndicales et des brins de <strong>muguet</strong> sont proposés comme porte-bonheur.</p>
<h4>3. La fête de la musique</h4>
<p>Cette fête populaire a été <strong>lancée en 1982</strong> afin de célébrer la musique. Elle a lieu le <span class="key">21 juin</span> de chaque année.</p>`,
        },
        {
          h: 'F. Les grands événements sportifs',
          html: `
<h4>1. Le Tour de France</h4>
<p>Plus grande course cycliste du monde, elle a lieu chaque année en <strong>juillet</strong>. C'est le <strong>troisième événement sportif mondial</strong> derrière les Jeux Olympiques et la Coupe du monde de football.</p>
<p>La première édition a eu lieu en <strong>1903</strong> et a vu 60 coureurs s'affronter au cours de six étapes représentant 2 300 kilomètres. Dans sa version moderne, le Tour réunit chaque année plus de <strong>170 coureurs</strong> qui parcourent plus de <strong>3 000 km</strong> pour arriver sur les Champs-Élysées, à Paris. Les <strong>20 étapes</strong> traversent plus d'un tiers des départements français.</p>
<h4>2. La Coupe du monde de football</h4>
<p>Le <strong>12 juillet 1998</strong>, la France gagne la finale face au <strong>Brésil</strong> et inscrit la première étoile sur le maillot des « Bleus ». Vingt ans après, <strong>en 2018</strong>, les Bleus remportent la coupe du monde contre la <strong>Croatie</strong>, ajoutant une deuxième étoile.</p>
<h4>3. Les Jeux Olympiques et Paralympiques de Paris 2024</h4>
<p>Cent ans après la dernière édition parisienne de <strong>1924</strong>, les Jeux Olympiques et Paralympiques ont à nouveau eu lieu dans la capitale en <strong>2024</strong>. La France remporte <strong>64 médailles olympiques et 74 médailles paralympiques</strong>.</p>`,
        },
        {
          h: 'G. La gastronomie française',
          html: `
<p>Le <strong>repas gastronomique français</strong> permettant de célébrer les moments importants de la vie est une tradition culinaire <strong>inscrite par l'UNESCO sur la liste représentative du patrimoine culturel immatériel de l'humanité</strong>.</p>
<h4>1. Le vin</h4>
<p>L'histoire du vin en France remonte à <strong>l'époque romaine</strong>. À partir du XVII<sup>e</sup> siècle, en <strong>Champagne</strong>, les producteurs ont mis au point une méthode de fermentation en bouteille, donnant naissance au vin effervescent mondialement connu. Le vin et le champagne sont protégés par les <strong>appellations d'origine contrôlée (AOC)</strong>.</p>
<h4>2. Des plats traditionnels</h4>
<p>Le <strong>pot-au-feu</strong>, la <strong>blanquette de veau</strong> ou le <strong>bœuf bourguignon</strong>.</p>
<h4>3. Les fromages</h4>
<p>Des fromages sont produits sur l'ensemble du territoire, certains avec une appellation protégée : le <strong>Brocciu</strong> en Corse, le <strong>Camembert</strong> en Normandie, ou le <strong>Maroilles</strong> dans le Nord de la France.</p>`,
        },
      ],
    },
  ],
};
