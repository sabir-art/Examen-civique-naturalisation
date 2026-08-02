/**
 * Livret du citoyen — édition mai 2026.
 * Partie 5 : Vivre dans la société française (pages 61 à 76).
 */

export default {
  key: 'p5',
  num: '5',
  title: 'Vivre dans la société française',
  icon: 'home',
  pages: '61 à 76',
  chapters: [
    {
      key: 'p5-i',
      num: 'I',
      title: 'La vie quotidienne',
      pages: '62 à 69',
      sections: [
        {
          h: 'A. Se loger',
          html: `
<h4>1. Devenir propriétaire</h4>
<p>Toute personne peut devenir propriétaire d'un bien immobilier ancien (déjà construit) ou neuf (projet de construction). L'achat d'un bien immobilier doit obligatoirement faire l'objet d'un <strong>acte signé chez le notaire</strong>.</p>
<p>Pour construire une maison sur un terrain, les propriétaires doivent déposer en mairie une demande de <strong>permis de construire</strong>. Les modifications extérieures ou extensions d'un logement sont généralement soumises à déclaration préalable ou à autorisation.</p>
<p>L'<strong>accession sociale à la propriété</strong> permet aux foyers à revenus modestes de devenir propriétaires de leur résidence principale.</p>
<h4>2. Être locataire</h4>
<p>En France, <strong>40 % de la population est locataire</strong> de son logement. Un peu moins de la moitié de ces logements loués sont des logements publics (sociaux).</p>
<p>Le locataire a notamment les droits et obligations suivants :</p>
<ul>
  <li>Il peut faire des <strong>travaux décoratifs</strong> (peindre des murs) ; pour d'autres travaux, il doit demander la permission au propriétaire (article 7 de la loi n° 89-462 du 6 juillet 1989) ;</li>
  <li>Il peut quitter le logement en respectant une <strong>période de préavis</strong>, comme indiqué dans le contrat de bail ;</li>
  <li>Il doit payer le <strong>loyer et les charges</strong> (eau, électricité, chauffage…) ;</li>
  <li>S'il ne paie pas le loyer, le propriétaire peut engager une procédure pour obtenir l'<strong>expulsion</strong> du locataire.</li>
</ul>
<p>Le propriétaire a des responsabilités telles qu'offrir un <strong>logement décent</strong>, c'est-à-dire sûr, bien entretenu, avec une bonne isolation, et accessible aux personnes handicapées.</p>
<h4>3. Le logement social</h4>
<p>Le logement social est un dispositif public permettant d'aider les personnes disposant de ressources modestes à trouver un logement. Ces logements sont appelés aussi <strong>HLM</strong> (habitations à loyer modéré).</p>
<p>Construits avec l'aide financière de l'État, ils doivent respecter certaines règles de construction et de gestion ; les revenus des locataires ne doivent pas dépasser certains <strong>plafonds de ressources</strong>. Les loyers sont aussi encadrés par l'État.</p>
<p>Pour obtenir un logement social, il faut déposer un dossier en ligne sur : <strong>https://www.demande-logement-social.gouv.fr</strong>.</p>`,
        },
        {
          h: 'B. Se déplacer',
          html: `
<h4>1. Le code de la route</h4>
<p>Pour conduire un véhicule motorisé sur la voie publique, il faut un <strong>permis de conduire valide</strong> et une <strong>carte grise</strong> (document qui prouve que le véhicule appartient à son propriétaire). Le véhicule doit être <strong>assuré</strong> et avoir fait l'objet d'un <strong>contrôle technique</strong> à jour.</p>
<p>Exemples de sanctions :</p>
<ul>
  <li>Un dépassement de la vitesse-limite de <strong>moins de 20 km/h</strong> : amende de <strong>68 euros</strong> et retrait d'un point du permis ;</li>
  <li>Un dépassement de <strong>plus de 50 km/h</strong> : délit sanctionné par 3 mois de prison maximum et une amende pouvant aller jusqu'à <strong>3 750 euros</strong>, avec un retrait de 6 points, voire la suspension du permis ;</li>
  <li>Conduire avec un taux d'alcool supérieur à <strong>0,8 g/l de sang</strong> : jusqu'à 3 ans de prison, une amende de <strong>9 000 euros</strong>, la saisie du véhicule et l'annulation du permis pendant 5 ans ;</li>
  <li>Conduire sans permis : jusqu'à 1 an de prison et <strong>15 000 euros</strong> d'amende.</li>
</ul>
<blockquote><strong>Je n'ai pas de handicap, puis-je me garer sur une place réservée aux personnes handicapées ?</strong><br>Non, ces places sont réservées aux personnes en situation de handicap, titulaires d'une carte « mobilité inclusion ».</blockquote>
<h4>2. Les transports collectifs</h4>
<p>Les transports collectifs (bus, autocars, métros, trains, tramways) facilitent la mobilité. Leur utilisation permet de réduire le nombre de voitures en circulation, la consommation d'énergie et les émissions de gaz polluants.</p>
<p>Leur usage est conditionné au <strong>paiement d'un titre de transport</strong>. En cas de non-paiement, la personne peut être sanctionnée par une amende. Cependant, dans certaines villes, les transports sont gratuits.</p>`,
        },
        {
          h: "C. S'assurer : la responsabilité civile",
          html: `
<p>La responsabilité civile est l'obligation de chacun de <strong>réparer les dommages matériels, corporels ou moraux</strong> que l'on peut causer sans le vouloir à d'autres personnes.</p>
<p>Si un enfant mineur, un animal domestique ou un objet sous votre responsabilité cause un dommage, vous pouvez être tenu responsable et votre responsabilité civile est engagée.</p>
<p>Il existe différents types d'assurances :</p>
<ul>
  <li><strong>Assurance habitation</strong> : protège contre les risques liés à son logement (incendie, dégât des eaux…) ;</li>
  <li><strong>Assurance véhicule</strong> : couvre les accidents pour les véhicules motorisés ;</li>
  <li><strong>Assurance scolaire et extra-scolaire</strong> : protège les enfants pendant leurs activités à l'école ou à l'extérieur.</li>
</ul>`,
        },
        {
          h: "D. Vivre ensemble dans l'espace public",
          html: `
<h4>1. La consommation de tabac</h4>
<p>Il est <strong>interdit de fumer dans les lieux publics fermés ou couverts</strong>, ainsi que dans les espaces intérieurs accueillant du public : gares, restaurants, bars, terrasses couvertes… Fumer dans les locaux de son lieu de travail est également interdit.</p>
<p>Depuis le <span class="key">1er juillet 2025</span>, il est également interdit de fumer, pendant les heures ou périodes d'ouverture, dans :</p>
<ul>
  <li>les parcs et jardins publics ;</li>
  <li>les plages bordant des eaux de baignade ;</li>
  <li>les abribus ou zones couvertes d'attente des voyageurs ;</li>
  <li>les abords des écoles, collèges, lycées et autres lieux destinés à l'accueil, à la formation ou à l'hébergement de mineurs ;</li>
  <li>les espaces ouverts et abords des bibliothèques, piscines, stades et installations sportives.</li>
</ul>
<p>Ces mesures proviennent de la <strong>loi Évin, votée le 10 janvier 1991</strong>. Le non-respect de cette loi est une infraction punie d'une amende de <strong>135 euros</strong>.</p>
<blockquote>Un mégot de cigarette est un déchet qui doit être jeté dans une poubelle, sous peine d'avoir une amende.</blockquote>
<h4>2. La consommation d'alcool</h4>
<p>En fonction des circonstances locales, la consommation d'alcool peut être <strong>interdite par arrêté municipal</strong> dans les rues, les transports en commun, certains parcs… La vente d'alcool peut aussi faire l'objet de restrictions.</p>
<p>Il est <strong>interdit de vendre de l'alcool aux mineurs de moins de 18 ans</strong>.</p>
<p>En cas d'<strong>ivresse publique</strong>, la personne peut être sanctionnée d'une amende pouvant aller jusqu'à <strong>150 euros</strong>.</p>
<h4>3. Autres règles de civisme dans l'espace public</h4>
<ul>
  <li>Il est interdit de <strong>jeter ses déchets en dehors des poubelles</strong> ; ce geste peut être puni d'une amende.</li>
  <li>Les <strong>excréments des animaux de compagnie</strong> dans les espaces publics doivent obligatoirement être ramassés.</li>
  <li>Les <strong>graffitis et dégradations</strong> de biens publics ou privés sont interdits et considérés comme des actes de vandalisme punis par la loi.</li>
  <li>Des sanctions sont prévues en cas de <strong>nuisances sonores</strong> (musiques fortes, klaxons inutiles, fêtes, rassemblements…).</li>
</ul>`,
        },
        {
          h: "E. Préserver l'environnement",
          html: `
<h4>1. Réduire ses déchets</h4>
<p>Chaque année, un Français produit environ <span class="key">500 kg de déchets</span>.</p>
<p>La collecte des déchets est organisée par les collectivités locales avec des mesures de tri qui s'imposent à tous. <strong>Depuis 2024, le tri des déchets verts et alimentaires (destinés au compostage) est obligatoire</strong> pour les particuliers et les professionnels.</p>
<p>Des <strong>déchèteries</strong> sont présentes dans chaque territoire. Les <strong>dépôts sauvages</strong> de déchets sont interdits par la loi et punis d'une amende.</p>
<blockquote>Les sacs plastiques à usage unique et non recyclables sont <strong>interdits en France depuis janvier 2017</strong>.</blockquote>
<h4>2. Limiter sa consommation d'énergie</h4>
<ul>
  <li>régler son chauffage à <strong>19 °C maximum</strong>,</li>
  <li>régler son chauffe-eau à <strong>55 °C</strong> et rester moins longtemps sous la douche,</li>
  <li>éteindre tous ses appareils en marche ou en veille quand ils ne sont pas utilisés,</li>
  <li>utiliser les appareils électriques en dehors des heures de pointe,</li>
  <li>installer un thermostat programmable.</li>
</ul>
<h4>3. Se déplacer de manière écologique</h4>
<p>Le secteur des transports représente <strong>34 % des émissions de dioxyde de carbone (CO₂)</strong> en France, dont près de la moitié provient des véhicules des particuliers.</p>
<p>Les transports en commun sont de bonnes alternatives à la voiture individuelle. La marche ou le vélo sont à privilégier pour les trajets courts. En voiture : conduite souple, covoiturage, entretien régulier.</p>`,
        },
        {
          h: 'F. La santé',
          html: `
<p>En <span class="key">1945</span>, à la Libération, la volonté de solidarité nationale a conduit à la <strong>création de la Sécurité sociale</strong>.</p>
<p>Pour financer ce système, les employeurs, les salariés et les travailleurs indépendants paient des <strong>cotisations</strong>. Ces cotisations, combinées à des impôts, permettent de financer la sécurité sociale. Ce système représente le principe de solidarité et donc de <strong>fraternité</strong>.</p>
<p>Toute personne vivant en France peut consulter un médecin, aller à l'hôpital ou se rendre en pharmacie.</p>
<p><strong>Tous les résidents en France ont l'obligation d'être inscrits à l'Assurance Maladie</strong> (branche de la Sécurité sociale) selon leur situation et dans les conditions fixées par la loi.</p>
<p>Chaque personne assurée reçoit une <strong>carte « Vitale »</strong>. Le remboursement des frais de santé est effectué par la <strong>Caisse primaire d'assurance maladie (CPAM)</strong>.</p>
<p>Dans certains cas, les professionnels de santé pratiquent le <strong>tiers payant</strong>, ce qui permet aux patients de ne pas avancer la part remboursée.</p>
<p>Parfois, les soins ne sont pas entièrement pris en charge. Toute personne peut donc souscrire à une <strong>mutuelle complémentaire de santé</strong>. Les employeurs ont l'obligation de proposer une couverture complémentaire santé collective à l'ensemble de leurs salariés (sauf exceptions).</p>
<p>Enfin, les personnels de santé ont obligation de garder secrètes les informations médicales d'un patient : c'est le principe de <strong>confidentialité</strong> dans le domaine de la santé.</p>`,
        },
        {
          h: "G. Les numéros d'urgence",
          html: `
<p>En cas d'urgence, les services d'urgence peuvent être contactés <strong>24h/24 et 7j/7</strong> par téléphone. Ces appels sont <strong>gratuits</strong>.</p>
<ul>
  <li><strong>15</strong> — SAMU</li>
  <li><strong>17</strong> — Police secours</li>
  <li><strong>18</strong> — Sapeurs-pompiers</li>
  <li><strong>112</strong> — Appels d'urgence européen</li>
  <li><strong>115</strong> — Hébergement d'urgence</li>
  <li><strong>119</strong> — Enfance maltraitée</li>
  <li><strong>196</strong> — Secours en mer</li>
  <li><strong>3919</strong> — Violences conjugales</li>
  <li><strong>3018</strong> — Harcèlement scolaire</li>
  <li><strong>114</strong> — par SMS pour les personnes malentendantes</li>
</ul>
<h4>D'autres services d'urgences existent</h4>
<ul>
  <li>Alerte attentat : <strong>197</strong></li>
  <li>Enfants disparus : <strong>116 000</strong></li>
  <li>Risque pour la sécurité dans les transports en commun : <strong>3117</strong> ou par SMS au <strong>31 177</strong></li>
  <li>Prévention du suicide : <strong>3114</strong></li>
  <li>Secours aéronautiques : <strong>191</strong></li>
</ul>
<blockquote>Les victimes de violence peuvent porter plainte auprès des services de sécurité intérieure (police nationale et gendarmerie nationale) et demander de l'aide auprès d'associations.</blockquote>`,
        },
      ],
    },

    {
      key: 'p5-ii',
      num: 'II',
      title: 'Travailler en France',
      pages: '70 à 72',
      sections: [
        {
          h: 'A. La réglementation liée au travail',
          html: `
<p>Le droit du travail est l'ensemble des règles juridiques qui concernent les relations professionnelles entre les salariés et les employeurs. <strong>Trois types de documents</strong> définissent ces règles :</p>
<ul>
  <li>Le <strong>code du travail</strong> fixe les droits et les obligations pour tous : contrat de travail, conditions de travail, salaire, durée légale du temps de travail par semaine (<span class="key">35 heures</span>), etc.</li>
  <li>Les <strong>conventions collectives</strong>, accords négociés entre les organisations représentant les employeurs et les salariés. Elles concernent une activité donnée (exemple : transport routier) et adaptent les règles du code du travail sur des points précis.</li>
  <li>Le <strong>règlement intérieur</strong>, rédigé par un employeur dont l'entreprise compte <strong>au moins 50 salariés</strong>. Il présente les règles internes et détaille les droits et devoirs des salariés en matière de santé, de sécurité et de comportement au travail.</li>
</ul>
<p>Les salariés du secteur privé, âgés d'au moins <strong>18 ans</strong> (16 ans sur autorisation parentale ou mineur émancipé), doivent percevoir un salaire au moins égal au <strong>SMIC</strong> (salaire minimum de croissance), qui est le salaire horaire minimum garanti en France.</p>
<p>Dans le cadre professionnel, <strong>aucune discrimination ne peut avoir lieu</strong> envers le genre, la religion ou le physique. Toutefois, si un emploi exige un niveau de qualification, l'employeur peut exiger la présentation de diplômes.</p>
<p>En cas de litige entre un employeur et son salarié, le <strong>conseil de prud'hommes</strong> est compétent.</p>
<blockquote>Chaque travailleur, sans condition, a le droit de <strong>rejoindre une organisation syndicale</strong> afin de le représenter au travail.</blockquote>`,
        },
        {
          h: 'B. Le contrat de travail',
          html: `
<p>Lorsqu'une personne est embauchée après un entretien, un <strong>contrat de travail doit être signé</strong> entre le salarié et l'employeur. Ce document est obligatoire et indique notamment :</p>
<ul>
  <li>le salaire,</li>
  <li>les compétences nécessaires,</li>
  <li>la date de début du contrat,</li>
  <li>la durée du travail,</li>
  <li>le type de contrat.</li>
</ul>
<p>Les plus courants sont le <strong>contrat à durée déterminée (CDD)</strong> pour un travail temporaire, le <strong>contrat à durée indéterminée (CDI)</strong> pour un emploi permanent, ou encore le <strong>contrat d'intérim</strong>.</p>`,
        },
        {
          h: "C. L'insertion professionnelle",
          html: `
<p>Pour être accompagné dans la recherche d'emploi et être indemnisé en cas de perte d'emploi, il faut s'inscrire à <strong>France Travail</strong>.</p>
<p>Il s'agit d'un organisme public qui aide les personnes à trouver un emploi. Il peut proposer des formations. Cet accompagnement est réalisé par les <strong>Missions Locales</strong> pour les jeunes de moins de 25 ans.</p>
<p>Si les conditions sont remplies (avoir travaillé suffisamment longtemps, ne pas avoir quitté son travail de manière volontaire…), France Travail peut verser chaque mois l'<strong>Allocation d'aide au retour à l'emploi (ARE)</strong>.</p>`,
        },
        {
          h: "D. La création d'entreprise",
          html: `
<p>Chacun est libre de créer son entreprise en France. <strong>Il n'est pas nécessaire d'être français.</strong></p>
<p>Les démarches administratives sont notamment : enregistrer les statuts de la société, immatriculer l'entreprise, publier son activité dans un journal d'annonces légales, déclarer le siège social.</p>
<p><strong>Quatre grands secteurs d'activités</strong> sont distingués :</p>
<ul>
  <li><strong>L'artisanat</strong> : activité indépendante de production, de transformation ou de prestations de services ;</li>
  <li><strong>Le commerce</strong> : opérations commerciales (achats pour revente, intermédiaire, transport de marchandises…) ;</li>
  <li><strong>Les professions libérales</strong> : offre de services non commerciaux (médecins, avocats…) ;</li>
  <li><strong>L'activité agricole</strong>.</li>
</ul>
<p>Des structures aident les créateurs : chambre des métiers et de l'artisanat (CMA), chambre de commerce et d'industrie (CCI)…</p>`,
        },
        {
          h: "E. L'accès à l'emploi public",
          html: `
<p>L'accès aux emplois dans la fonction publique est <strong>ouvert à tous sans discrimination</strong>. La sélection se fait uniquement en fonction des compétences et des qualités.</p>
<p>Pour se porter candidat à un <strong>concours</strong> de la fonction publique, il faut remplir des conditions d'âge, de diplôme, avoir la <strong>nationalité française</strong> (ou celle d'un pays de l'Union européenne ou de l'Espace économique européen), jouir de ses droits civiques et n'avoir fait l'objet d'aucune condamnation inscrite au bulletin n° 2 du casier judiciaire.</p>
<p>Les candidats européens n'ont pas accès aux emplois dits de « <strong>souveraineté</strong> » (défense, affaires étrangères par exemple).</p>
<p>Dans la fonction publique territoriale, l'admission au concours ne signifie pas l'affectation immédiate à un poste : les candidats admis sont inscrits sur une liste et doivent postuler eux-mêmes.</p>
<blockquote><strong>Qu'est-ce qu'un fonctionnaire ?</strong> C'est un agent public titulaire qui travaille dans l'une des <strong>trois fonctions publiques</strong> : fonction publique d'État, fonction publique territoriale, fonction publique hospitalière. Il est recruté par concours (sauf exceptions), puis titularisé dans un grade (A, B ou C) après une période de stage. Son statut est régi par le code général de la fonction publique.</blockquote>`,
        },
      ],
    },

    {
      key: 'p5-iii',
      num: 'III',
      title: 'La vie familiale',
      pages: '73 à 76',
      sections: [
        {
          h: 'A. Le mariage',
          html: `
<p>En France, <strong>seul le mariage civil célébré en mairie est reconnu par la loi</strong>. Le mariage est célébré par le maire ou un adjoint au maire à la mairie de la commune où vit au moins l'un des deux futurs mariés ou l'un de leurs parents. Le jour de la cérémonie, les mariés reçoivent leur <strong>acte de mariage</strong> et un <strong>livret de famille</strong>.</p>
<p>Le mariage est possible à partir de <span class="key">18 ans</span>. Il est aussi possible à partir de 16 ans, mais seulement si le <strong>procureur de la République</strong> accorde une autorisation spéciale et si les parents du mineur acceptent l'union (art. 145 et 148 du code civil).</p>
<p>La <strong>polygamie</strong> (être marié à plusieurs personnes à la fois) est <strong>interdite par la loi et constitue une infraction pénale</strong>.</p>
<p>Depuis le <strong>17 mai 2013</strong>, la loi ouvrant le mariage aux couples de personnes de même sexe a été promulguée. La France est devenue le <strong>14<sup>e</sup> pays du monde</strong> à autoriser le mariage homosexuel.</p>
<p>En cas de séparation, les époux peuvent divorcer soit devant un juge, soit par consentement mutuel devant un notaire. L'autorité parentale sur leurs enfants continue d'être exercée par les deux parents, sauf décision de justice contraire.</p>
<blockquote>L'<strong>état civil</strong> permet de mettre à jour les informations officielles sur la vie d'une personne. La <strong>déclaration de la naissance des enfants (dans les 5 jours qui suivent la naissance)</strong>, des mariages et des décès est obligatoire.</blockquote>`,
        },
        {
          h: 'B. Les droits des parents',
          html: `
<p>Pendant la période de grossesse et de congé maternité, la loi garantit à la femme de <strong>conserver son emploi</strong> : l'employeur ne peut pas licencier la salariée pour ce motif.</p>
<p>Depuis le <strong>1er juillet 2021, le congé paternité dure 28 jours</strong>.</p>
<p>Après la naissance ou l'adoption d'un enfant de moins de 16 ans, tout(e) salarié(e) peut bénéficier d'un <strong>congé parental d'éducation</strong>.</p>
<p>De plus, les parents d'un enfant né ou adopté à compter du <strong>1er janvier 2026</strong> bénéficient d'un « <strong>congé supplémentaire de naissance</strong> », d'un ou de deux mois, selon le choix du parent. Ce congé peut être pris à compter du mois de <strong>juillet 2026</strong>.</p>`,
        },
        {
          h: 'C. Les droits des enfants',
          html: `
<p>En <strong>1989</strong>, <strong>196 États</strong> ont signé un document sur les droits de l'enfant dans le cadre de l'Organisation des Nations Unies : la <strong>Convention Internationale des Droits de l'Enfant</strong>. C'est le fondement de toute l'action de l'<strong>UNICEF</strong>.</p>
<p>Quelques droits de l'enfant :</p>
<ul>
  <li>L'égalité (être traité de la même façon que les autres enfants) ;</li>
  <li>Avoir un nom, une identité ;</li>
  <li>Être soigné, protégé des maladies, avoir une alimentation suffisante et équilibrée ;</li>
  <li>Aller à l'école ;</li>
  <li>Protection de la vie privée ;</li>
  <li>Être protégé contre la violence ;</li>
  <li>Être protégé contre l'exploitation ;</li>
  <li>Pouvoir s'informer et s'exprimer, être entendu sur les questions qui le concernent ;</li>
  <li>Les enfants en situation de handicap ont droit à la même vie que les autres et peuvent bénéficier d'un emploi du temps aménagé.</li>
</ul>`,
        },
        {
          h: 'D. Les obligations parentales',
          html: `
<p>L'<strong>article 371-1 du code civil</strong> définit l'<strong>autorité parentale</strong> : un ensemble de droits et de devoirs dont l'objectif est de protéger l'intérêt de l'enfant et de favoriser son bien-être.</p>
<p>L'autorité parentale appartient aux parents jusqu'à ce que l'enfant devienne adulte (majorité ou émancipation).</p>
<p>Les parents doivent veiller à la sécurité de l'enfant, surveiller ses relations, ses déplacements, ses communications, son utilisation des réseaux sociaux. Ils ont l'obligation de protéger l'enfant contre le racket, le viol, la prostitution, les addictions, le harcèlement, la violence…</p>
<p>L'autorité parentale <strong>s'exerce sans violences physiques ou psychologiques</strong>. Toutes maltraitances physiques, comme <strong>l'excision et les châtiments corporels</strong>, sont interdites par la loi.</p>
<blockquote>Il n'est <strong>pas possible de déshériter en totalité</strong> son/ses enfants et le partage doit être équitable entre tous les membres constituant la fratrie.</blockquote>`,
        },
        {
          h: "E. L'éducation",
          html: `
<p>L'école (l'instruction) est obligatoire pour les enfants de <span class="key">3 à 16 ans</span>. Les parents qui ne respectent pas cette obligation peuvent être sanctionnés par une amende, ainsi qu'une peine de prison.</p>
<p>Seules les absences pour raisons de santé ou familiales (mariage, enterrement…) sont acceptées par les établissements scolaires.</p>
<p>Les <strong>enfants allophones</strong> (dont la langue maternelle n'est pas le français) sont accueillis à l'école comme les autres enfants. Les enfants en situation de handicap peuvent bénéficier d'un emploi du temps aménagé.</p>
<p>Les parents peuvent participer activement en se portant candidat aux <strong>élections de représentants de parents d'élèves</strong>, ou en rejoignant une association de parents.</p>
<h4>Les établissements scolaires en France</h4>
<ul>
  <li><strong>École maternelle</strong> — accueille les enfants au début de l'instruction obligatoire, qui débute à 3 ans.</li>
  <li><strong>École élémentaire</strong> — accueille les enfants scolarisés de 6 à 11 ans.</li>
  <li><strong>Collège</strong> — établissement de niveau secondaire qui accueille tous les enfants à l'issue de l'école élémentaire ; quatre années de scolarité.</li>
  <li><strong>Lycée</strong> — lycée d'enseignement général, technologique ou professionnel ; trois ans : la seconde, la première et la terminale.</li>
</ul>
<blockquote>L'<strong>école primaire</strong> regroupe l'école maternelle et l'école élémentaire (du CP au CM2). Les <strong>mairies</strong> sont compétentes pour gérer les inscriptions des enfants à l'école publique.</blockquote>`,
        },
        {
          h: 'F. Le numérique et les enfants',
          html: `
<p>Les écrans (téléphone, ordinateur, télévision…) sont très présents dans la vie des familles. Trop les regarder peut avoir des conséquences sur la santé physique et mentale des enfants, ainsi que sur leur vie sociale. Les parents doivent s'assurer du bon usage des écrans fait par leur enfant.</p>
<p>Afin de lutter contre les délits en ligne tels que le cyber-harcèlement, la <strong>loi du 7 juillet 2023 a instauré la majorité numérique à 15 ans</strong>. Avant cet âge, s'inscrire seul sur les réseaux sociaux n'est plus possible.</p>
<p>La <strong>citoyenneté numérique</strong>, notamment enseignée à l'école, permet d'apprendre à faire un usage efficace des technologies numériques de manière responsable, éthique et sûre.</p>`,
        },
      ],
    },
  ],
};
