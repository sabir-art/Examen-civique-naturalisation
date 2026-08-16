/**
 * Les tableaux d'enquête.
 *
 * Le programme donne des centaines de faits ; ce qui manque, c'est le fil qui
 * les relie. On sait que Napoléon existe, que 1848 est une date, que le préfet
 * est nommé — mais dans quel ordre, par qui, et à la place de quoi ?
 *
 * Un tableau est un mur d'enquête : des fiches épinglées, et des ficelles entre
 * elles. On y suit une ficelle plutôt que d'apprendre une liste. Trois
 * tableaux, pas trente : ce sont exactement les trois choses que l'on confond.
 *
 *   1. QUI A GOUVERNÉ — l'ordre des régimes, de la monarchie à aujourd'hui.
 *      La confusion des dates et des ruptures.
 *   2. QUI FAIT QUOI — l'agencement des pouvoirs sous la Ve République.
 *      La confusion des rôles : qui nomme, qui élit, qui peut renverser.
 *   3. LES VERROUS QUI ONT SAUTÉ — les droits, un par un, avec le nom de celle
 *      ou celui qui les a portés. La confusion des noms propres.
 *
 * Chaque fiche renvoie au chapitre du récit qui la raconte : le tableau donne
 * la carte, le récit donne le chemin.
 *
 * TYPES DE FICHE — ils décident du glyphe et de la couleur de l'épingle :
 *   regime · evenement · texte · personne · institution · droit
 *
 * LIENS — au-delà de la ficelle chronologique qui coud les fiches dans l'ordre,
 * ce sont les rapprochements qui ne sautent pas aux yeux : ce que tel régime a
 * renversé, ce que tel droit a mis un siècle à obtenir. Peu nombreux, sans quoi
 * le mur devient illisible et ne relie plus rien.
 */

export const TABLEAUX = [
  /* ═══════════════════════════════════════════ 1. qui a gouverné la France */
  {
    key: 'regimes',
    titre: 'Qui a gouverné la France',
    sousTitre: 'De la monarchie absolue à la Ve République',
    teinte: 'lavender',
    theme: 'histoire-geo-culture',
    pourquoi: "Cinq républiques, deux empires, des rois qui reviennent : l'ordre se brouille vite. Suivez la ficelle du haut vers le bas, c'est l'ordre réel.",
    forme: 'chronologie',
    noeuds: [
      {
        id: 'monarchie',
        type: 'regime',
        titre: 'La monarchie absolue',
        quand: "jusqu'en 1789",
        resume: "Le roi tient son pouvoir de Dieu et ne le partage pas. Louis XIV l'incarne : cour à Versailles, aucune assemblée pour le contredire.",
        epingles: ['Louis XIV : 1643 → 1715', 'Versailles'],
        chapitre: 'ch05',
      },
      {
        id: 'bastille',
        type: 'evenement',
        titre: 'La prise de la Bastille',
        quand: '14 juillet 1789',
        resume: "Une prison presque vide — sept prisonniers — mais le symbole de l'arbitraire royal. Le peuple de Paris s'en empare : le roi n'est plus intouchable.",
        epingles: ['14 juillet 1789', 'fête nationale depuis 1880'],
        chapitre: 'ch07',
      },
      {
        id: 'ddhc',
        type: 'texte',
        titre: "Déclaration des droits de l'homme et du citoyen",
        quand: '26 août 1789',
        resume: "Dix-sept articles votés six semaines après la Bastille. Ils ne créent pas un régime : ils fixent ce qu'aucun régime n'aura le droit de retirer.",
        epingles: ['17 articles', '« Les hommes naissent et demeurent libres et égaux en droits »'],
        chapitre: 'ch08',
      },
      {
        id: 'republique-1',
        type: 'regime',
        titre: 'La Ire République',
        quand: '22 septembre 1792',
        resume: "La royauté est abolie. La République est proclamée, puis vient la Terreur : la liberté est déclarée avant d'être garantie.",
        epingles: ['1792', 'la royauté abolie'],
      },
      {
        id: 'empire-1',
        type: 'regime',
        titre: 'Le Premier Empire',
        quand: '1804 → 1815',
        resume: "Napoléon Bonaparte, général puis empereur. Il ferme la Révolution mais garde ses acquis dans un livre : le Code civil, qui organise encore la vie de tous les jours.",
        epingles: ['Napoléon Bonaparte', 'Code civil, 1804', 'préfets, lycées, Banque de France'],
        chapitre: 'ch09',
      },
      {
        id: 'restauration',
        type: 'regime',
        titre: 'Le retour des rois',
        quand: '1815 → 1848',
        resume: "Les frères de Louis XVI reviennent, puis Louis-Philippe en 1830. Cette fois le roi doit compter avec une Charte : la monarchie n'est plus absolue.",
        epingles: ['Restauration, 1815', 'monarchie de Juillet, 1830'],
      },
      {
        id: 'republique-2',
        type: 'regime',
        titre: 'La IIe République',
        quand: '1848 → 1852',
        resume: "Quatre ans à peine, mais deux décisions qui tiennent encore : le suffrage universel masculin, et l'abolition de l'esclavage.",
        epingles: ['suffrage universel masculin', "abolition de l'esclavage"],
        chapitre: 'ch10',
      },
      {
        id: 'empire-2',
        type: 'regime',
        titre: 'Le Second Empire',
        quand: '1852 → 1870',
        resume: "Élu président de la IIe République, Louis-Napoléon Bonaparte s'en empare et se fait empereur sous le nom de Napoléon III. Le neveu refait le coup de l'oncle.",
        epingles: ['Napoléon III', 'le neveu de Napoléon Ier'],
      },
      {
        id: 'republique-3',
        type: 'regime',
        titre: 'La IIIe République',
        quand: '1870 → 1940',
        resume: "La plus longue de toutes : soixante-dix ans. C'est elle qui installe l'école gratuite et laïque, la liberté d'association, et la séparation des Églises et de l'État.",
        epingles: ['70 ans', "l'école de Jules Ferry", 'la laïcité de 1905'],
        chapitre: 'ch11',
      },
      {
        id: 'vichy',
        type: 'regime',
        titre: "L'État français",
        quand: '1940 → 1944',
        resume: "Après la défaite, le maréchal Pétain s'installe à Vichy et remplace la devise républicaine. La République n'est pas réformée : elle est suspendue.",
        epingles: ['Pétain', 'la République suspendue'],
        chapitre: 'ch14',
      },
      {
        id: 'appel',
        type: 'evenement',
        titre: "L'appel du 18 juin",
        quand: '18 juin 1940',
        resume: "Depuis Londres, un général presque inconnu refuse la défaite à la radio. Peu de gens l'entendent ce soir-là ; la Résistance s'y rattachera.",
        epingles: ['18 juin 1940', 'Charles de Gaulle', 'depuis Londres'],
        chapitre: 'ch14',
      },
      {
        id: 'republique-4',
        type: 'regime',
        titre: 'La IVe République',
        quand: '1946 → 1958',
        resume: "La République revient, mais les gouvernements tombent les uns après les autres. Douze ans, une vingtaine de gouvernements : c'est cette instabilité que la suivante voudra corriger.",
        epingles: ['1946', 'des gouvernements qui tombent'],
      },
      {
        id: 'republique-5',
        type: 'regime',
        titre: 'La Ve République',
        quand: 'depuis le 4 octobre 1958',
        resume: "Une Constitution qui donne au président un vrai pouvoir. C'est le régime sous lequel vous vivez, et celui sur lequel porte l'examen.",
        epingles: ['Constitution du 4 octobre 1958', 'de Gaulle, premier président'],
        chapitre: 'ch15',
      },
    ],
    liens: [
      { de: 'bastille', vers: 'monarchie', relation: 'fait tomber', inverse: 'renversée par' },
      { de: 'ddhc', vers: 'republique-5', relation: 'inscrite au socle de', inverse: 'garde dans son socle' },
      { de: 'empire-2', vers: 'empire-1', relation: "refait le coup de", inverse: 'imité par' },
      { de: 'appel', vers: 'vichy', relation: 'refuse', inverse: 'refusé par' },
      { de: 'appel', vers: 'republique-5', relation: 'le même homme fondera', inverse: "fondée par l'homme de" },
      { de: 'republique-2', vers: 'empire-2', relation: 'emportée par', inverse: "né du coup d'État contre" },
    ],
  },

  /* ═══════════════════════════════════════════ 2. qui fait quoi aujourd'hui */
  {
    key: 'pouvoirs',
    titre: "Qui fait quoi aujourd'hui",
    sousTitre: 'Les pouvoirs de la Ve République, et qui tient qui',
    teinte: 'mint',
    theme: 'institutions',
    pourquoi: "Président, Premier ministre, députés, sénateurs, maire, préfet : chacun est élu ou nommé par quelqu'un. Suivez les ficelles, elles disent qui dépend de qui.",
    forme: 'pouvoirs',
    noeuds: [
      {
        id: 'electeurs',
        type: 'personne',
        titre: 'Les électeurs',
        quand: 'vous, à partir de 18 ans',
        resume: "Tout part d'ici. Le suffrage est universel, égal et secret : une personne, une voix, et personne ne sait pour qui vous avez voté.",
        epingles: ['universel, égal et secret', 'article 3 de la Constitution'],
        chapitre: 'ch18',
      },
      {
        id: 'president',
        type: 'institution',
        titre: 'Le président de la République',
        quand: '5 ans',
        resume: "Élu directement par les électeurs depuis le référendum de 1962. Il nomme le Premier ministre, préside le Conseil des ministres, dirige les armées et peut dissoudre l'Assemblée.",
        epingles: ['suffrage universel direct', '2 mandats consécutifs au plus', 'Élysée'],
        chapitre: 'ch15',
      },
      {
        id: 'gouvernement',
        type: 'institution',
        titre: 'Le Premier ministre et le Gouvernement',
        quand: 'tant que l’Assemblée le laisse',
        resume: "Nommé par le président, il conduit la politique de la nation. Mais il répond de son action devant l'Assemblée, qui peut le renvoyer.",
        epingles: ['nommé, pas élu', 'Matignon'],
      },
      {
        id: 'assemblee',
        type: 'institution',
        titre: "L'Assemblée nationale",
        quand: '5 ans',
        resume: "577 députés élus directement. Elle vote la loi, contrôle le Gouvernement, et peut le renverser par une motion de censure. En cas de désaccord avec le Sénat, c'est elle qui a le dernier mot.",
        epingles: ['577 députés', 'Palais Bourbon', 'le dernier mot'],
        chapitre: 'ch17',
      },
      {
        id: 'senat',
        type: 'institution',
        titre: 'Le Sénat',
        quand: '6 ans',
        resume: "348 sénateurs élus au suffrage indirect par des grands électeurs — surtout des élus locaux. Renouvelé par moitié tous les trois ans, il ne peut pas être dissous.",
        epingles: ['348 sénateurs', 'suffrage indirect', 'Palais du Luxembourg'],
      },
      {
        id: 'conseil-constitutionnel',
        type: 'institution',
        titre: 'Le Conseil constitutionnel',
        quand: '9 ans, non renouvelables',
        resume: "Neuf membres qui vérifient qu'une loi respecte la Constitution. Depuis 2010, n'importe quel justiciable peut le saisir au cours d'un procès.",
        epingles: ['9 membres', 'question prioritaire de constitutionnalité, 2010'],
        chapitre: 'ch20',
      },
      {
        id: 'cassation',
        type: 'institution',
        titre: 'La Cour de cassation',
        quand: "sommet de l'ordre judiciaire",
        resume: "Elle ne rejuge pas les faits : elle vérifie que la loi a été correctement appliquée. C'est le dernier recours des procès entre personnes.",
        epingles: ['ne rejuge pas les faits'],
        chapitre: 'ch20',
      },
      {
        id: 'conseil-etat',
        type: 'institution',
        titre: "Le Conseil d'État",
        quand: "sommet de l'ordre administratif",
        resume: "Pour les litiges avec l'administration — une mairie, une préfecture, un ministère. On commence devant le tribunal administratif, on finit ici.",
        epingles: ['créé en 1799 par Napoléon', "litiges avec l'administration"],
        chapitre: 'ch09',
      },
      {
        id: 'maire',
        type: 'institution',
        titre: 'Le maire',
        quand: '6 ans',
        resume: "Élu par le conseil municipal, lui-même élu par les habitants. Il est officier d'état civil : c'est lui qui célèbre les mariages et signe les actes de naissance.",
        epingles: ['élu par le conseil municipal', "officier d'état civil"],
        chapitre: 'ch21',
      },
      {
        id: 'prefet',
        type: 'institution',
        titre: 'Le préfet',
        quand: 'tant que le président le garde',
        resume: "Il n'est pas élu du tout : il est nommé et représente l'État dans le département. C'est la préfecture qui traite votre dossier de naturalisation.",
        epingles: ['nommé, jamais élu', "représente l'État dans le département"],
        chapitre: 'ch09',
      },
    ],
    liens: [
      { de: 'electeurs', vers: 'president', relation: 'élisent directement', inverse: 'élu directement par' },
      { de: 'electeurs', vers: 'assemblee', relation: 'élisent les 577 députés de', inverse: 'élue directement par' },
      { de: 'electeurs', vers: 'maire', relation: 'élisent le conseil qui désigne', inverse: 'désigné par le conseil élu par' },
      { de: 'president', vers: 'gouvernement', relation: 'nomme', inverse: 'nommé par' },
      { de: 'president', vers: 'assemblee', relation: 'peut dissoudre', inverse: 'peut être dissoute par' },
      { de: 'president', vers: 'prefet', relation: 'nomme', inverse: 'nommé par' },
      { de: 'assemblee', vers: 'gouvernement', relation: 'peut renverser', inverse: 'peut être renversé par' },
      { de: 'maire', vers: 'senat', relation: 'grand électeur du', inverse: 'élu par des grands électeurs, dont' },
      { de: 'conseil-constitutionnel', vers: 'assemblee', relation: 'contrôle les lois de', inverse: 'ses lois sont contrôlées par' },
    ],
  },

  /* ═════════════════════════════════════════ 3. les verrous qui ont sauté */
  {
    key: 'droits',
    titre: 'Les verrous qui ont sauté',
    sousTitre: 'Chaque droit, sa date, et le nom de qui l’a porté',
    teinte: 'butter',
    theme: 'droits-devoirs',
    pourquoi: "Aucun de ces droits n'est tombé du ciel : chacun a une date, un débat, et souvent quelqu'un qui est monté à la tribune. Retenez le visage, la date suivra.",
    forme: 'chronologie',
    noeuds: [
      {
        id: 'ddhc-1789',
        type: 'texte',
        titre: 'La promesse est écrite',
        quand: '26 août 1789',
        resume: "La Déclaration proclame les hommes libres et égaux en droits. Tout ce qui suit sur ce tableau consiste à tenir cette phrase, morceau par morceau.",
        epingles: ['26 août 1789', '17 articles'],
        chapitre: 'ch08',
      },
      {
        id: 'suffrage-1848',
        type: 'droit',
        titre: 'Le suffrage universel… masculin',
        quand: 'mars 1848',
        resume: "Tous les hommes votent, sans condition de fortune. On l'appelle « universel » — la moitié du pays en est pourtant exclue.",
        epingles: ['1848', 'les hommes seulement'],
        chapitre: 'ch10',
      },
      {
        id: 'esclavage-1848',
        type: 'droit',
        titre: "L'abolition de l'esclavage",
        quand: '27 avril 1848',
        resume: "Une première abolition de 1794 avait été annulée par Napoléon en 1802. Celle-ci est définitive : Victor Schœlcher la fait signer deux mois après la révolution de février.",
        epingles: ['Victor Schœlcher', 'définitive cette fois'],
        chapitre: 'ch10',
      },
      {
        id: 'ecole-1882',
        type: 'droit',
        titre: "L'école gratuite, laïque et obligatoire",
        quand: '1881 — 1882',
        resume: "Deux lois portées par Jules Ferry. Gratuite en 1881, obligatoire et laïque en 1882 : l'école devient le lieu où tous les enfants du pays se retrouvent.",
        epingles: ['Jules Ferry', 'gratuite 1881, obligatoire 1882'],
        chapitre: 'ch11',
      },
      {
        id: 'associations-1901',
        type: 'droit',
        titre: "La liberté d'association",
        quand: '1er juillet 1901',
        resume: "Se réunir à plusieurs autour d'un but commun, sans autorisation. C'est la loi qui rend possible les clubs, les syndicats de fait, les associations de quartier.",
        epingles: ['loi 1901'],
      },
      {
        id: 'laicite-1905',
        type: 'droit',
        titre: 'La séparation des Églises et de l’État',
        quand: '9 décembre 1905',
        resume: "L'État ne reconnaît ni ne salarie aucun culte, et garantit à chacun la liberté de croire ou de ne pas croire. La laïcité n'interdit pas la religion : elle la met hors de l'État.",
        epingles: ['9 décembre 1905', 'croire ou ne pas croire'],
        chapitre: 'ch12',
      },
      {
        id: 'femmes-1944',
        type: 'droit',
        titre: 'Les femmes votent',
        quand: 'avril 1944',
        resume: "Une ordonnance leur accorde le droit de vote et d'éligibilité ; elles votent pour la première fois en avril 1945. Quatre-vingt-seize ans après le « suffrage universel » de 1848.",
        epingles: ['ordonnance d’avril 1944', 'premier vote en 1945'],
        chapitre: 'ch16',
      },
      {
        id: 'secu-1945',
        type: 'droit',
        titre: 'La Sécurité sociale',
        quand: '1945',
        resume: "Chacun cotise selon ses moyens et reçoit selon ses besoins. Le préambule de 1946 y ajoute le droit de grève, le droit au travail et à la santé.",
        epingles: ['1945', 'préambule de 1946'],
        chapitre: 'ch21',
      },
      {
        id: 'ivg-1975',
        type: 'droit',
        titre: "L'interruption volontaire de grossesse",
        quand: 'janvier 1975',
        resume: "Simone Veil, ministre de la Santé et rescapée d'Auschwitz, défend la loi devant un hémicycle presque entièrement masculin. Vingt-cinq heures de débats, et des insultes.",
        epingles: ['Simone Veil', 'inscrite dans la Constitution en 2024'],
        chapitre: 'ch16',
      },
      {
        id: 'peine-1981',
        type: 'droit',
        titre: "L'abolition de la peine de mort",
        quand: '9 octobre 1981',
        resume: "Robert Badinter, garde des Sceaux, obtient l'abolition alors que l'opinion y est majoritairement opposée. Depuis 2007, l'interdiction est dans la Constitution.",
        epingles: ['Robert Badinter', 'dans la Constitution depuis 2007'],
        chapitre: 'ch16',
      },
      {
        id: 'mariage-2013',
        type: 'droit',
        titre: 'Le mariage pour tous',
        quand: '17 mai 2013',
        resume: "Le mariage est ouvert aux couples de même sexe. La loi est portée par Christiane Taubira, garde des Sceaux ; le PACS l'avait précédée en 1999.",
        epingles: ['Christiane Taubira', 'PACS en 1999'],
        chapitre: 'ch16',
      },
    ],
    liens: [
      { de: 'ddhc-1789', vers: 'suffrage-1848', relation: 'promesse tenue 59 ans plus tard par', inverse: 'applique enfin' },
      { de: 'suffrage-1848', vers: 'femmes-1944', relation: 'il faudra 96 ans de plus jusqu’à', inverse: '96 ans après' },
      { de: 'esclavage-1848', vers: 'ddhc-1789', relation: 'applique enfin', inverse: 'promesse tenue par' },
      { de: 'ecole-1882', vers: 'laicite-1905', relation: 'la laïcité commence ici, avant', inverse: 'préparée par' },
      { de: 'ivg-1975', vers: 'peine-1981', relation: 'même tribune, six ans avant', inverse: 'même tribune, six ans après' },
    ],
  },
];

export const TABLEAU_BY_KEY = new Map(TABLEAUX.map((t) => [t.key, t]));

/** Combien de fiches, tous tableaux confondus. */
export const TOTAL_FICHES = TABLEAUX.reduce((n, t) => n + t.noeuds.length, 0);

/**
 * Les fiches qui parlent d'un chapitre donné.
 *
 * Sert au chapitre lui-même : on y lit une histoire, et l'on peut sauter à
 * l'endroit du mur où elle est épinglée, au milieu de ce qui l'entoure.
 */
export function fichesDuChapitre(chapitreKey) {
  const out = [];
  for (const t of TABLEAUX) {
    for (const n of t.noeuds) {
      if (n.chapitre === chapitreKey) out.push({ tableau: t, noeud: n });
    }
  }
  return out;
}

/**
 * Les liens qui touchent une fiche, dans un sens ou dans l'autre.
 *
 * La formulation change avec le sens, et ce n'est pas un détail de style : lue
 * depuis l'autre bout, « fait tomber » devient « renversée par ». Employer la
 * même phrase des deux côtés ferait dire au tableau l'inverse de la vérité —
 * que la monarchie a fait tomber la Bastille.
 */
export function liensDe(tableau, id) {
  return tableau.liens
    .filter((l) => l.de === id || l.vers === id)
    .map((l) => (l.de === id
      ? { autre: l.vers, relation: l.relation, sens: 'sortant' }
      : { autre: l.de, relation: l.inverse || l.relation, sens: 'entrant' }));
}
