/**
 * Livret du citoyen — édition mai 2026 (ministère de l'Intérieur).
 * Partie 1 : Principes et valeurs de la République (pages 5 à 14).
 * Transcription fidèle du document officiel.
 */

export default {
  key: 'p1',
  num: '1',
  title: 'Principes et valeurs de la République',
  icon: 'flag',
  pages: '5 à 14',
  chapters: [
    {
      key: 'p1-i',
      num: 'I',
      title: 'La devise et les symboles de la République',
      pages: '6 à 9',
      sections: [
        {
          h: 'La devise',
          html: `
<p>La devise de la France « liberté, égalité, fraternité » consacre les valeurs fondatrices de la République française, repères communs pour le vivre ensemble.</p>
<p>Elle est inscrite sur le fronton des bâtiments publics (préfectures, mairies…).</p>`,
        },
        {
          h: 'A. Liberté',
          html: `
<p>Les femmes et les hommes sont libres dans leurs choix, leurs opinions et leur manière de penser, de s'exprimer et de vivre.</p>
<p>La liberté est une valeur fondamentale inscrite dans la Déclaration des droits de l'homme et du citoyen (DDHC) de 1789, qui proclame à son <span class="key">article 4</span> que « <em>la liberté consiste à pouvoir faire tout ce qui ne nuit pas à autrui</em> ». C'est-à-dire que l'on peut faire tout ce qui ne gêne pas les autres (et qui est défini par la loi).</p>
<p>Les libertés sont les mêmes pour l'ensemble des citoyens, dans le respect des lois. Elles sont présentées dans la thématique des « droits et devoirs des citoyens ».</p>`,
        },
        {
          h: 'B. Égalité',
          html: `
<p>L'égalité est un principe fondamental de la République française (<span class="key">article 1er de la Constitution de 1958</span>).</p>
<p>Tous les citoyens ont les mêmes droits quel que soit leur sexe, leur origine, leur religion, leurs opinions ou leur orientation sexuelle (article 1er de la DDHC).</p>
<p>L'égalité entre les femmes et les hommes est inscrite dans le préambule de la Constitution depuis <span class="key">1946</span> et elle s'applique dans tous les domaines : travail, santé, éducation…</p>
<h4>La France condamne les discriminations</h4>
<p>Une discrimination est le fait de traiter différemment une personne par rapport à une autre, dans une situation comparable (logement, travail, loisirs…), en raison de son origine, de son sexe, de son orientation sexuelle, de son opinion politique, de son âge, de ses convictions religieuses, de son apparence physique…</p>
<p><strong>Les discriminations sont punies par la loi.</strong></p>
<h4>À ce titre, l'État lutte activement contre :</h4>
<ul>
  <li><strong>Le sexisme</strong> : traitement dénigrant envers une autre personne en raison de son sexe ;</li>
  <li><strong>Le racisme</strong> : discrimination fondée sur l'origine ou l'appartenance ethnique ou raciale d'une personne ;</li>
  <li><strong>L'antisémitisme</strong> : forme spécifique de racisme et de haine dirigée contre les Juifs, fondée sur des préjugés, des stéréotypes et des discriminations ;</li>
  <li><strong>La discrimination sur critère religieux</strong> : discrimination fondée sur la religion supposée de la personne ;</li>
  <li><strong>La haine et la discrimination anti-LGBT+</strong> : attitudes hostiles à l'égard des personnes en raison de leur orientation sexuelle.</li>
</ul>
<blockquote>Toute décision d'un employeur (embauche, promotion…) doit être fondée sur des raisons professionnelles et non personnelles.</blockquote>`,
        },
        {
          h: 'C. Fraternité',
          html: `
<p>La France est fondée sur la volonté des citoyens de vivre ensemble. Cette volonté se traduit par la fraternité entre tous.</p>
<p>Cette fraternité repose sur la capacité à voir en l'autre un semblable malgré les différences. <strong>La fraternité républicaine est donc civique et non basée sur l'origine ou la religion.</strong></p>
<p>La fraternité implique une solidarité entre les individus qui se décline sous différentes formes :</p>
<h4>Collective</h4>
<p>Le principe de solidarité signifie que la Nation assure aux individus une protection, par exemple, la Sécurité sociale.</p>
<p>Remplir ses obligations fiscales est un acte solidaire qui permet de financer les services publics au bénéfice de tous. Le principe de solidarité exige aussi que chaque citoyen français doive participer à la défense de la Nation en cas de nécessité.</p>
<h4>Intergénérationnelle</h4>
<p>Le principe de solidarité se traduit par le soutien entre différentes générations. Par exemple, en cotisant, chaque salarié contribue aux versements des retraites.</p>
<p>La fraternité contribue donc à la réduction des inégalités, notamment sociales.</p>
<blockquote>L'organisation de collectes au profit d'associations humanitaires ou l'engagement dans une association de quartier constituent d'autres exemples de participation citoyenne mettant en œuvre le principe républicain de solidarité et de fraternité.</blockquote>`,
        },
        {
          h: 'D. Les symboles de la France',
          html: `
<h4>La fête nationale</h4>
<p>Le <span class="key">14 juillet 1789</span>, le peuple de Paris a pris la Bastille (une prison royale), ce qui marque le début de la Révolution française. Un an plus tard, le 14 juillet 1790, est célébrée la Fête de la Fédération.</p>
<p>Depuis <span class="key">1880</span>, le 14 juillet est consacré comme jour de fête nationale pour commémorer ces deux événements.</p>
<h4>L'hymne national</h4>
<p>En <span class="key">1792</span>, l'hymne national français, <strong>La Marseillaise</strong>, a été écrit par <strong>Rouget de Lisle</strong>. Elle est étudiée par les enfants à l'école primaire.</p>
<h4>La langue officielle</h4>
<p>La langue officielle de la République est le <strong>français</strong>.</p>
<h4>Marianne</h4>
<p>Marianne, une femme portant un <strong>bonnet phrygien</strong> (symbole de la liberté), est devenue le symbole de la République. Elle apparaît sur les documents de l'administration française. Sa statue, placée dans toutes les mairies, rappelle la Révolution française.</p>
<h4>Le drapeau tricolore</h4>
<p>Le drapeau tricolore (bleu, blanc, rouge) a aussi été créé pendant la Révolution. Il est devenu le drapeau officiel de la France en <span class="key">1794</span>, sauf lors de la période de la Restauration (1814-1830).</p>
<h4>Le coq</h4>
<p>Le coq représente la fierté, le courage et la vigilance. <strong>Bien qu'il n'ait pas de statut officiel selon la Constitution</strong>, il est utilisé depuis l'antiquité et est largement reconnu comme un symbole national.</p>
<blockquote>On retrouve les symboles sur l'ensemble des sites internet et documents de l'administration.</blockquote>`,
        },
        {
          h: 'La Marseillaise — paroles',
          html: `
<p class="muted small">Hymne national, composé par Rouget de Lisle en 1792.</p>
<h4>Couplet 1</h4>
<p>Allons enfants de la Patrie,<br>Le jour de gloire est arrivé !<br>Contre nous de la tyrannie,<br>L'étendard sanglant est levé, (bis)<br>Entendez-vous dans les campagnes<br>Mugir ces féroces soldats ?<br>Ils viennent jusque dans vos bras<br>Égorger vos fils, vos compagnes !</p>
<h4>Refrain</h4>
<p><em>Aux armes, citoyens,<br>Formez vos bataillons,<br>Marchons, marchons !<br>Qu'un sang impur<br>Abreuve nos sillons !</em></p>
<h4>Couplet 2</h4>
<p>Que veut cette horde d'esclaves,<br>De traîtres, de rois conjurés ?<br>Pour qui ces ignobles entraves,<br>Ces fers dès longtemps préparés ? (bis)<br>Français, pour nous, ah ! quel outrage<br>Quels transports il doit exciter !<br>C'est nous qu'on ose méditer<br>De rendre à l'antique esclavage !</p>
<h4>Couplet 3</h4>
<p>Quoi ! des cohortes étrangères<br>Feraient la loi dans nos foyers !<br>Quoi ! ces phalanges mercenaires<br>Terrasseraient nos fiers guerriers ! (bis)<br>Grand Dieu ! par des mains enchaînées<br>Nos fronts sous le joug se ploieraient<br>De vils despotes deviendraient<br>Les maîtres de nos destinées !</p>
<h4>Couplet 4</h4>
<p>Tremblez, tyrans et vous perfides<br>L'opprobre de tous les partis,<br>Tremblez ! vos projets parricides<br>Vont enfin recevoir leurs prix ! (bis)<br>Tout est soldat pour vous combattre,<br>S'ils tombent, nos jeunes héros,<br>La terre en produit de nouveaux,<br>Contre vous tout prêts à se battre !</p>
<h4>Couplet 5</h4>
<p>Français, en guerriers magnanimes,<br>Portez ou retenez vos coups !<br>Épargnez ces tristes victimes,<br>À regret s'armant contre nous. (bis)<br>Mais ces despotes sanguinaires,<br>Mais ces complices de Bouillé,<br>Tous ces tigres qui, sans pitié,<br>Déchirent le sein de leur mère !</p>
<h4>Couplet 6</h4>
<p>Amour sacré de la Patrie,<br>Conduis, soutiens nos bras vengeurs<br>Liberté, Liberté chérie,<br>Combats avec tes défenseurs ! (bis)<br>Sous nos drapeaux que la victoire<br>Accoure à tes mâles accents,<br>Que tes ennemis expirants<br>Voient ton triomphe et notre gloire !</p>
<h4>Couplet 7</h4>
<p>Nous entrerons dans la carrière<br>Quand nos aînés n'y seront plus,<br>Nous y trouverons leur poussière,<br>Et la trace de leurs vertus, (bis)<br>Bien moins jaloux de leur survivre,<br>Que de partager leur cercueil,<br>Nous aurons le sublime orgueil,<br>De les venger ou de les suivre.</p>`,
        },
      ],
    },

    {
      key: 'p1-ii',
      num: 'II',
      title: 'Les principes de la République',
      pages: '10 à 14',
      sections: [
        {
          h: 'La Constitution',
          html: `
<p>Les principes de la République sont définis à l'<span class="key">article 1er de la Constitution du 4 octobre 1958</span> qui précise que « <em>La France est une République indivisible, laïque, démocratique et sociale</em> ».</p>
<p>La Constitution est un acte fondateur d'un État. C'est un ensemble de règles fondamentales qui définissent comment le pays est organisé et dirigé.</p>
<p>Dans un État de droit, la Constitution se situe tout en haut de la <strong>hiérarchie des normes</strong>, c'est-à-dire qu'elle est au-dessus de toutes les lois.</p>
<p>En France, elle fixe les droits et libertés des citoyens, explique comment les pouvoirs (le gouvernement, le Parlement et les tribunaux) sont partagés et encadre leur fonctionnement.</p>`,
        },
        {
          h: 'A. Une République indivisible',
          html: `
<p>Aucun individu ou groupe ne peut décider à la place de l'ensemble des Français. Les décisions sont prises par les représentants élus par le peuple ou par le peuple lui-même lors de référendums.</p>
<p>Cela signifie que tous les Français, partout dans le pays, métropole et outre-mer, sont soumis aux mêmes lois et ont les mêmes droits et devoirs. C'est ce qu'on appelle <strong>l'unité de la République</strong>.</p>
<p>De plus, la France a une seule langue officielle qui est le français.</p>`,
        },
        {
          h: 'B. Une République laïque',
          html: `
<p>La laïcité est un principe essentiel de la République, de valeur constitutionnelle et est officiellement célébrée en France le <span class="key">9 décembre</span>.</p>
<p>La laïcité garantit la <strong>liberté de conscience</strong> pour tous, c'est-à-dire que chaque personne est libre d'avoir ou de ne pas avoir de religion, d'en changer (droit de se convertir) ou de ne plus en avoir.</p>
<p>Elle garantit la liberté de manifester ses croyances ou convictions et de pratiquer sa religion dans les limites du respect de l'ordre public comme cela est mentionné dans l'article 10 de la Déclaration des droits de l'homme et du citoyen de 1789.</p>
<p>La laïcité garantit le libre exercice des cultes et le respect de toutes les croyances. <strong>Elle impose la neutralité de l'État.</strong></p>
<blockquote>Une personne est dite « athée » lorsqu'elle ne croit en aucune religion et « agnostique » lorsqu'elle est sceptique vis-à-vis de la religion.</blockquote>`,
        },
        {
          h: '1. La neutralité de l\'État',
          html: `
<p>Le principe de laïcité implique que l'État et les organisations religieuses sont séparés (<span class="key">loi de 1905</span> sur la séparation des Églises et de l'État). Il impose également que la loi est la même pour tout le monde, quelles que soient sa religion ou ses convictions.</p>
<p>Par conséquent, l'État ne soutient aucune organisation religieuse, les considère toutes de la même manière et n'est pas impliqué dans leur fonctionnement interne. L'État n'a, par exemple, pas le droit de financer la construction d'un édifice religieux, ni de payer un personnel religieux. Cependant, il y a quelques exceptions, comme en <strong>Alsace et en Moselle</strong>, où l'État, en raison de l'Histoire, a des accords spéciaux avec certaines religions.</p>
<p>L'État, les collectivités territoriales et les services publics sont neutres vis-à-vis des religions.</p>
<p>La République française garantit à tous les citoyens d'être traités de la même manière par l'administration et les services publics, quelles que soient leur religion ou leurs convictions. C'est ce que l'on appelle <strong>la neutralité de l'État</strong>.</p>
<blockquote>L'État a la possibilité de financer la restauration d'un monument religieux classé au patrimoine.</blockquote>`,
        },
        {
          h: '2. Le prosélytisme',
          html: `
<p>Le prosélytisme religieux est le fait de vouloir convaincre quelqu'un d'adopter sa religion ou ses idées religieuses.</p>
<p>En France, cela est <strong>autorisé</strong>, à condition de ne pas forcer quelqu'un à croire en une religion contre son gré, en utilisant la violence, la menace ou la pression.</p>
<p>Il est par ailleurs <strong>interdit de faire du prosélytisme dans les services publics</strong>, en application du principe de neutralité de l'État.</p>
<blockquote>Il est possible de distribuer des tracts sur une religion dans la rue, tant que cela ne trouble pas l'ordre public.</blockquote>`,
        },
        {
          h: '3. Le blasphème',
          html: `
<p>Le blasphème est une parole ou un discours qui insulte la divinité, la religion ou ce qui est considéré comme respectable ou sacré.</p>
<p><strong>En France, ce n'est pas un délit.</strong> Chacun a le droit de critiquer ou de se moquer d'une religion, et de s'exprimer librement, y compris à travers la caricature.</p>
<p>Personne ne peut être puni pour avoir critiqué une religion ou insulté une divinité et chacun peut donc exprimer son avis. C'est la liberté d'expression.</p>
<p>La liberté d'expression connaît des limites, mais celles-ci ne concernent pas le blasphème. Ces limites concernent :</p>
<ul>
  <li>La diffamation (dire des choses fausses sur quelqu'un pour lui nuire) et les injures publiques,</li>
  <li>L'encouragement à commettre certains crimes ou délits contre une religion,</li>
  <li>L'incitation à la haine raciale, ethnique ou religieuse,</li>
  <li>L'utilisation de la religion pour justifier des crimes de guerre ou du terrorisme,</li>
  <li>L'incitation à discriminer,</li>
  <li>La remise en cause de crimes contre l'humanité, dont le négationnisme (nier l'existence de la Shoah).</li>
</ul>`,
        },
        {
          h: '4. La mise en œuvre de la laïcité dans différents espaces',
          html: `
<p>Selon les lieux, différentes règles s'appliquent afin de respecter et faire vivre la laïcité.</p>
<h4>a) La laïcité dans l'espace public</h4>
<p>En France, toute personne a le droit de montrer sa religion dans l'espace public : rues, parcs et jardins publics, marchés, transports…</p>
<p>Cela signifie qu'une personne peut porter des signes religieux (voile, kippa, croix, turban…), participer à des célébrations ou rassemblements religieux ou encore exprimer ses convictions religieuses.</p>
<p>Cependant, le respect de l'ordre public est indispensable. Une manifestation religieuse peut être soumise à autorisation, encadrée ou interdite pour éviter des troubles à l'ordre public (exemple : prières de rue).</p>
<blockquote>La <span class="key">loi du 11 octobre 2010</span> interdit la dissimulation du visage dans l'espace public (cagoule, masque, voile intégral…). Cette loi vise à protéger l'ordre public.</blockquote>
<h4>b) La laïcité dans les services publics</h4>
<p>Les personnes qui travaillent dans les services publics, comme les hôpitaux, les écoles ou les mairies, doivent <strong>rester neutres</strong> et ne pas montrer leurs opinions ou croyances personnelles pendant leur travail.</p>
<p>C'est l'une des conditions pour un traitement équitable des usagers.</p>
<p>Cette neutralité se traduit aussi dans les bâtiments des services publics. Aucun signe ou emblème religieux, politique ou philosophique ne doit être exposé dans les bureaux, aux guichets ou encore dans les espaces communs.</p>
<p>La neutralité <strong>ne s'impose pas aux usagers</strong>. Ils peuvent donc porter un signe d'appartenance religieuse au sein d'un service public, à condition de respecter les règles de fonctionnement du service.</p>
<p>Il n'est pas possible en revanche d'exiger une adaptation du service public au nom d'une religion.</p>
<h4>c) La laïcité sur le lieu de travail</h4>
<p>La laïcité ne s'applique pas de la même manière aux personnes qui travaillent dans les services publics (les fonctionnaires et agents publics) et à celles qui travaillent dans les entreprises privées (les salariés).</p>
<p>Pour garantir la neutralité de l'État, <strong>les agents publics ne peuvent pas montrer leur religion ou leurs opinions au travail</strong>. Ils ne peuvent pas porter de signes religieux ou pratiquer leur religion au travail.</p>
<p>Les salariés des entreprises privées ont le droit d'exprimer leurs opinions religieuses, y compris en portant des tenues ou des signes religieux, sauf si cela perturbe le bon fonctionnement de l'entreprise ou pour des raisons de sécurité. L'employeur peut ainsi imposer, dans le cadre du règlement intérieur, des limites à la liberté de manifester son appartenance religieuse si celles-ci sont justifiées par la nature des tâches confiées au salarié.</p>
<blockquote>Un salarié ou un agent public peut solliciter une autorisation d'absence de son employeur pour une fête religieuse. L'employeur peut refuser l'autorisation à condition que cela ne soit pas discriminatoire. La décision pourra notamment être motivée par le règlement intérieur ou des nécessités de service.</blockquote>
<h4>d) La laïcité au sein des établissements scolaires publics</h4>
<p>Les établissements scolaires publics et les personnels de l'Éducation nationale sont neutres vis-à-vis des religions. L'application du principe de laïcité à l'école vise à garantir la liberté de conscience des élèves, en leur permettant de penser librement, de se construire eux-mêmes leurs opinions, à l'abri des pressions et des influences.</p>
<p>L'ensemble des règles permettant de garantir l'application de la laïcité dans les écoles est listé dans la <strong>Charte de la laïcité à l'École</strong>. Elle s'adresse à l'ensemble des personnels de l'établissement (professeurs, animateurs périscolaires…), aux élèves ainsi qu'aux parents d'élèves.</p>
<p>Parmi ces règles, comme le prévoit la <span class="key">loi du 15 mars 2004</span>, il est interdit de porter un signe ou un vêtement qui montre sa religion de manière <strong>ostensible</strong>, c'est-à-dire que l'on peut voir immédiatement. Les signes discrets sont autorisés.</p>
<p>Il n'est également pas possible de refuser, en raison de sa religion, une règle de fonctionnement ou un enseignement du programme scolaire.</p>`,
        },
        {
          h: 'C. Une République démocratique',
          html: `
<p><strong>La France est une démocratie</strong>, c'est-à-dire que la souveraineté nationale (le pouvoir) appartient au peuple français :</p>
<blockquote>Article 3 de la Constitution de la V<sup>e</sup> République de 1958 : « <em>La souveraineté nationale appartient au peuple qui l'exerce par ses représentants et par la voie du référendum.</em> »</blockquote>
<p>La République est un régime politique dans lequel les dirigeants sont élus et gouvernent au nom du peuple.</p>
<p>Ainsi, le Président de la République, les parlementaires, les maires, les représentants des régions, des départements et des communes, sont élus au suffrage universel direct ou indirect. Cela signifie que tous les citoyens, hommes et femmes, ayant au moins <span class="key">18 ans</span> (majorité civile) et disposant de leurs droits civils et politiques, ont le droit de voter et de se présenter aux élections dans les conditions fixées par la loi.</p>
<blockquote>Le <strong>suffrage universel direct</strong> permet aux citoyens de voter directement pour élire leurs représentants, tandis que dans le cadre du <strong>suffrage universel indirect</strong>, des personnes élues par les citoyens, élisent à leur tour les représentants.</blockquote>`,
        },
        {
          h: 'D. Une République sociale',
          html: `
<p>Le caractère social de la République est une conséquence du principe d'égalité :</p>
<blockquote>« <em>Les hommes naissent et demeurent libres et égaux en droits</em> » affirme la Déclaration des droits de l'homme et du citoyen de 1789 (article 1er).</blockquote>
<p>Pour que cette égalité de droits soit réelle, l'État favorise l'égalité des chances et contribue à l'amélioration de la condition des plus démunis ou fragiles, en intervenant notamment dans les domaines suivants :</p>
<ul>
  <li>l'éducation (école gratuite),</li>
  <li>le logement (politique de logement social),</li>
  <li>l'emploi (revenu de solidarité active et aide au retour à l'emploi),</li>
  <li>la santé (Sécurité sociale).</li>
</ul>`,
        },
      ],
    },
  ],
};
