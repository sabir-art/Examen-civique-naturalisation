/**
 * « La France racontée » — Acte I : Le temps des rois.
 *
 * Le programme de l'examen civique raconté comme une histoire. Chaque chapitre
 * est une scène : on la lit, on la voit, et les faits restent parce qu'ils sont
 * accrochés à quelque chose. L'encadré « ce qu'il faut retenir » et les
 * questions viennent ensuite, une fois l'image en tête.
 */

export default {
  key: 'acte-1',
  num: 'I',
  titre: 'Le temps des rois',
  sous_titre: "Avant la République : d'Alésia aux Lumières",
  epoque: '52 av. J.-C. — 1789',
  icon: 'book',
  chapitres: [
    {
      key: 'ch01',
      num: 1,
      titre: "L'homme qui jeta ses armes",
      lieu: 'Alésia',
      date: '52 avant Jésus-Christ',
      minutes: 4,
      html: `
<p>La colline est cernée depuis des semaines. En bas, les Romains ont creusé des fossés, planté des pieux, monté des tours de bois. Ils ont enfermé la colline dans un anneau, puis ils ont construit un second anneau autour du premier, tourné vers l'extérieur, pour empêcher les secours d'arriver. Personne n'entre. Personne ne sort.</p>

<p>En haut, dans la ville d'Alésia, il n'y a plus de grain. Les chevaux ont été mangés. Les enfants ne pleurent même plus.</p>

<p>L'homme qui commande là-haut s'appelle <strong>Vercingétorix</strong>. Il a fait quelque chose que personne n'avait réussi avant lui : il a convaincu des dizaines de peuples gaulois, qui passaient leur temps à se faire la guerre entre eux, de se battre ensemble contre le même ennemi. Des Arvernes, des Éduens, des Bituriges. Des gens qui ne s'aimaient pas, réunis parce qu'un homme leur a dit : <em>séparés, nous perdons ; ensemble, nous avons une chance.</em></p>

<p>Cette chance n'a pas suffi. En face, il y a <strong>Jules César</strong> et ses légions.</p>

<p>Un matin, les portes de la ville s'ouvrent. Vercingétorix descend seul, à cheval, dans son armure. Il traverse le camp romain sous les regards. Il arrive devant César, met pied à terre, retire son casque, son bouclier, son épée, et pose tout cela au sol.</p>

<p>Puis il s'assied et il attend.</p>

<p>Nous sommes en <span class="key">52 avant Jésus-Christ</span>. Ce jour-là, la Gaule devient romaine, et pour cinq siècles.</p>

<h4>Et ensuite ?</h4>

<p>Ce n'est pas une fin, c'est un mélange. Les Romains apportent leurs routes, leurs villes, leurs aqueducs — on en voit encore, comme le pont du Gard. Ils apportent surtout deux choses qui ne partiront jamais : <strong>leur langue</strong>, le latin, dont naîtra le français, et <strong>leur droit</strong>, cette idée neuve qu'il existe des règles écrites, les mêmes pour tous, plus fortes que la parole d'un chef.</p>

<p>Retenez ce mot, il vous suivra jusqu'à la fin de cette histoire : les Romains appelaient l'affaire publique <em>res publica</em>. La chose publique. Ce qui appartient à tous.</p>

<blockquote>Deux mille ans plus tard, le mot est toujours là. Il est écrit sur votre carte d'identité : <strong>République française</strong>.</blockquote>`,
      retenir: [
        '<strong>52 av. J.-C.</strong> — bataille d\'Alésia : <strong>Vercingétorix</strong>, chef gaulois, est vaincu par <strong>Jules César</strong>.',
        "La Gaule devient romaine. La France hérite des Romains sa langue (le latin, ancêtre du français) et son droit.",
        "<strong>République</strong> vient du latin <em>res publica</em> : « la chose publique ».",
      ],
      questions: [
        { q: "Quel chef gaulois s'est opposé à Jules César à Alésia ?", c: ['Vercingétorix', 'Clovis', 'Charlemagne', 'Hugues Capet'], a: 0, why: "En 52 av. J.-C., Vercingétorix avait réuni plusieurs peuples gaulois contre les légions romaines." },
        { q: 'En quelle année a eu lieu la bataille d\'Alésia ?', c: ['52 avant Jésus-Christ', '496 après Jésus-Christ', '800 après Jésus-Christ', '52 après Jésus-Christ'], a: 0, why: "Cette défaite marque le début de cinq siècles de Gaule romaine." },
        { q: 'Que signifie le mot « République », venu du latin res publica ?', c: ['La chose publique', 'Le pouvoir du roi', "L'armée du peuple", 'La cité fortifiée'], a: 0, why: "La République est le régime où le pouvoir est une affaire commune, exercée dans l'intérêt général." },
        { q: 'Quel héritage majeur les Romains ont-ils laissé à la France ?', c: ["Leur langue (le latin, ancêtre du français) et leur droit écrit", "L'écriture arabe et les chiffres", "La monarchie héréditaire", "Le christianisme, devenu religion officielle de l'Empire"], a: 0, why: "Le français descend du latin, et l'idée de règles écrites identiques pour tous vient du droit romain." },
      ],
    },

    {
      key: 'ch02',
      num: 2,
      titre: 'Le roi qui changea de dieu',
      lieu: 'Reims',
      date: 'vers 496',
      minutes: 4,
      html: `
<p>Cinq siècles ont passé. L'Empire romain s'est effondré comme une maison dont on aurait retiré les poutres une par une. Des peuples venus de l'est se sont installés partout dans l'ancienne Gaule. Parmi eux, les <strong>Francs</strong>.</p>

<p>Leur roi s'appelle <strong>Clovis</strong>. Il a une vingtaine d'années quand il prend le pouvoir, et une idée fixe : rassembler sous sa main tous ces petits royaumes éparpillés. Il y arrive, par la guerre, par les alliances, par la ruse. Peu à peu, un territoire prend forme. Ce territoire, plus tard, s'appellera la France — le pays des Francs.</p>

<p>Mais l'histoire qu'on raconte encore aujourd'hui, c'est celle du baptême.</p>

<p>La femme de Clovis, Clotilde, est chrétienne. Lui ne l'est pas. Elle insiste, il résiste. Puis vient une bataille qui tourne mal, et la légende dit qu'il promet : <em>si je gagne, je me convertis.</em> Il gagne.</p>

<p>Alors, à <strong>Reims</strong>, vers l'an <span class="key">496</span>, l'évêque Remi le baptise. On raconte qu'il lui dit : « Courbe la tête, fier Sicambre. »</p>

<p>Ce n'est pas seulement une affaire de croyance. C'est un calcul politique brillant. En devenant chrétien, Clovis se rallie d'un coup tous les évêques de Gaule, qui sont alors les seuls hommes instruits, ceux qui savent écrire, compter, administrer. Il gagne une administration toute faite.</p>

<h4>La ville du sacre</h4>

<p>De ce jour naît une tradition qui durera treize siècles : les rois de France seront <strong>sacrés à Reims</strong>. Une cérémonie religieuse pour dire que leur pouvoir vient de Dieu et non des hommes.</p>

<p>Gardez cette idée en mémoire, parce que toute la suite de notre histoire consistera à la démonter pièce par pièce. Un jour viendra où l'on dira, au contraire, que le pouvoir vient du peuple — et de personne d'autre.</p>

<blockquote>C'est exactement ce que dit aujourd'hui l'article 3 de la Constitution : « <em>La souveraineté nationale appartient au peuple.</em> » Mille cinq cents ans pour passer de Reims à cette phrase.</blockquote>`,
      retenir: [
        '<strong>Vers 496</strong> — <strong>Clovis</strong>, roi des Francs, est baptisé à <strong>Reims</strong> et se convertit au christianisme.',
        "Il unifie une grande partie de la Gaule : c'est une étape clé de la construction du territoire français.",
        '<strong>Reims</strong> devient la ville où les rois de France sont sacrés.',
      ],
      questions: [
        { q: 'Quel roi franc a été baptisé à Reims vers 496 ?', c: ['Clovis', 'Charlemagne', 'Hugues Capet', 'Saint Louis'], a: 0, why: "Clovis unifie une grande partie de la Gaule et adopte la religion chrétienne." },
        { q: 'Dans quelle ville les rois de France étaient-ils sacrés ?', c: ['Reims', 'Paris', 'Versailles', 'Orléans'], a: 0, why: "La tradition remonte au baptême de Clovis dans cette ville." },
        { q: "Quel était l'apport politique de Clovis à la construction de la France ?", c: ["Il a unifié plusieurs royaumes francs, formant l'unité du territoire", "Il a écrit la première constitution du royaume des Francs", "Il a fondé la République", "Il a chassé les Romains de Gaule"], a: 0, why: "Le pays des Francs deviendra plus tard la France." },
        { q: "Selon la Constitution actuelle, à qui appartient la souveraineté nationale ?", c: ["Au peuple, qui l'exerce par ses représentants et par référendum", "Au président de la République, élu au suffrage universel", "Au Parlement", "Aux collectivités territoriales"], a: 0, why: "C'est l'article 3 de la Constitution de 1958 — l'exact contraire d'un pouvoir venu de Dieu." },
      ],
    },

    {
      key: 'ch03',
      num: 3,
      titre: 'La fille qui entendait des voix',
      lieu: "Orléans, puis Rouen",
      date: '1429 — 1431',
      minutes: 5,
      html: `
<p>Il faut imaginer un pays coupé en deux. Depuis presque cent ans, les rois de France et les rois d'Angleterre se disputent la couronne. On appellera cela la <strong>guerre de Cent Ans</strong>. Les Anglais tiennent le nord, Paris, la Normandie. Le roi de France, Charles, n'a même pas été sacré : on le surnomme le « petit roi de Bourges ».</p>

<p>En 1429, la ville d'<strong>Orléans</strong> est assiégée. Si elle tombe, la route du sud s'ouvre et c'est fini.</p>

<p>C'est là qu'arrive une paysanne de dix-sept ans, venue d'un village de Lorraine. Elle s'appelle <strong>Jeanne</strong>. Elle dit entendre des voix qui lui ordonnent de délivrer le royaume. Elle a traversé la France à cheval, en habits d'homme, pour aller trouver le roi.</p>

<p>Tout, dans cette histoire, devrait être impossible. Une fille, pauvre, illettrée, sans titre, à une époque où les femmes ne commandent rien. Et pourtant on l'écoute. On lui donne une armure et des hommes.</p>

<p>En quelques jours, le siège d'Orléans est levé. Quelques mois plus tard, elle conduit Charles jusqu'à <strong>Reims</strong> — la ville du sacre, souvenez-vous — et le fait couronner. Il devient Charles VII.</p>

<h4>La fin</h4>

<p>Elle est capturée l'année suivante, vendue aux Anglais, jugée par un tribunal d'Église à <strong>Rouen</strong>. Le procès est truqué d'avance. On la condamne pour hérésie et elle est brûlée vive sur la place du Vieux-Marché, en <span class="key">1431</span>. Elle a dix-neuf ans.</p>

<p>Vingt-cinq ans plus tard, un second procès annule le premier. Cinq siècles plus tard, elle est déclarée sainte. Aujourd'hui elle est surtout ceci : une héroïne nationale, le symbole du courage et de l'attachement au pays.</p>

<blockquote>Souvenez-vous de cette image — une jeune fille de rien du tout qui change le cours d'un royaume. La France y reviendra souvent : l'idée qu'une personne ordinaire peut compter autant qu'un puissant. C'est déjà, sans le mot, un pas vers l'égalité.</blockquote>`,
      retenir: [
        '<strong>1429</strong> — <strong>Jeanne d\'Arc</strong> délivre <strong>Orléans</strong> pendant la <strong>guerre de Cent Ans</strong> (France contre Angleterre).',
        'Elle fait sacrer le roi Charles VII à Reims.',
        "<strong>1431</strong> — capturée, jugée, elle est brûlée à <strong>Rouen</strong>. Héroïne nationale, symbole du courage et du patriotisme.",
      ],
      questions: [
        { q: 'Quelle jeune femme a délivré Orléans en 1429 ?', c: ["Jeanne d'Arc", 'Marianne', 'Olympe de Gouges', 'Aliénor d\'Aquitaine'], a: 0, why: "Elle a conduit les troupes françaises pendant la guerre de Cent Ans." },
        { q: 'Contre quel pays la France menait-elle la guerre de Cent Ans ?', c: ["L'Angleterre", "L'Espagne", "L'Allemagne", "L'Italie"], a: 0, why: "Le conflit opposait les rois de France et d'Angleterre pour la couronne." },
        { q: "Dans quelle ville Jeanne d'Arc a-t-elle été brûlée en 1431 ?", c: ['Rouen', 'Orléans', 'Reims', 'Paris'], a: 0, why: "Elle y fut jugée par un tribunal d'Église, à dix-neuf ans." },
        { q: "Que symbolise aujourd'hui Jeanne d'Arc en France ?", c: ['Le courage et le patriotisme', 'La liberté de la presse', 'La laïcité', "L'abolition de l'esclavage"], a: 0, why: "Elle est devenue une héroïne nationale, canonisée en 1920." },
      ],
    },

    {
      key: 'ch04',
      num: 4,
      titre: 'Le roi qui voulut la paix',
      lieu: 'Nantes',
      date: '1598',
      minutes: 5,
      html: `
<p>Le XVI<sup>e</sup> siècle a été atroce. Pendant plus de trente ans, catholiques et protestants se sont entretués dans le royaume. Des villages entiers massacrés. Une nuit d'août 1572, à Paris, des milliers de protestants ont été égorgés dans leur sommeil — on appelle cela la Saint-Barthélemy. On ne se battait pas pour des terres : on se battait pour savoir comment prier.</p>

<p>Puis un homme arrive au pouvoir dans une situation impossible. Il s'appelle <strong>Henri IV</strong>. Il est protestant et il devient roi d'un pays majoritairement catholique, qui refuse de le reconnaître. Paris lui ferme ses portes.</p>

<p>Alors il fait deux choses.</p>

<p>D'abord, il se convertit au catholicisme. On lui prête cette phrase : « Paris vaut bien une messe. » Vraie ou pas, elle dit l'essentiel : il choisit la paix du royaume avant sa propre conviction.</p>

<p>Ensuite — et c'est là que ça devient extraordinaire pour l'époque — il signe en <span class="key">1598</span> l'<strong>édit de Nantes</strong>. Un texte qui dit, en substance : les protestants ont le droit d'exister, de pratiquer leur religion, d'occuper des fonctions publiques, d'avoir des places de sûreté.</p>

<p>Ce n'est pas de la tolérance au sens où nous l'entendons. C'est mieux que rien, et c'est immense pour 1598 : pour la première fois, un royaume d'Europe accepte que deux religions cohabitent sous la même loi.</p>

<h4>Ce qui casse</h4>

<p>L'édit tient quatre-vingt-sept ans. En <strong>1685</strong>, Louis XIV le révoque. Les temples sont détruits, le culte protestant interdit. Deux cent mille protestants quittent la France — des artisans, des marchands, des savants. Le pays s'appauvrit de tout ce qu'il chasse.</p>

<blockquote>Gardez les deux dates ensemble, elles se répondent. <strong>1598</strong> : on essaie de faire tenir ensemble des gens qui ne croient pas la même chose. <strong>1685</strong> : on renonce. Il faudra attendre <strong>1905</strong> pour trouver la solution — celle qui ne demande à personne de renoncer à sa foi, mais qui sépare l'État des religions. Ce sera la laïcité.</blockquote>`,
      retenir: [
        '<strong>1598</strong> — <strong>Henri IV</strong> signe l\'<strong>édit de Nantes</strong>, qui met fin aux guerres de religion entre catholiques et protestants.',
        "<strong>1685</strong> — Louis XIV révoque l'édit : le culte protestant est interdit et des milliers de protestants s'exilent.",
        "La question « comment vivre ensemble avec des croyances différentes ? » trouvera sa réponse en 1905 avec la laïcité.",
      ],
      questions: [
        { q: "Quel roi a signé l'édit de Nantes en 1598 ?", c: ['Henri IV', 'Louis XIV', 'François Ier', 'Louis XVI'], a: 0, why: "Ce décret met fin aux guerres de religion entre catholiques et protestants." },
        { q: "Que garantissait l'édit de Nantes ?", c: ["Le droit pour les protestants de pratiquer leur religion", "L'interdiction de toutes les religions dans le royaume", "La séparation de l'Église et de l'État", "La liberté de la presse"], a: 0, why: "Pour la première fois, deux religions coexistaient sous la même loi dans le royaume." },
        { q: "Quel roi a révoqué l'édit de Nantes en 1685 ?", c: ['Louis XIV', 'Henri IV', 'Louis XVI', 'Napoléon'], a: 0, why: "La révocation provoqua l'exil de nombreux protestants." },
        { q: "Quelle loi apportera bien plus tard une réponse durable à la question religieuse ?", c: ["La loi de 1905 sur la séparation des Églises et de l'État", "La loi de 1901 sur les associations", "La loi de 1881 sur la presse", "La loi de 2004 sur les signes religieux à l'école"], a: 0, why: "La laïcité ne demande à personne de renoncer à sa foi : elle sépare l'État des cultes." },
      ],
    },

    {
      key: 'ch05',
      num: 5,
      titre: 'Le roi qui se prenait pour le soleil',
      lieu: 'Versailles',
      date: '1643 — 1715',
      minutes: 5,
      html: `
<p>Imaginez un marécage à vingt kilomètres de Paris. Un endroit sans intérêt, humide, où le père du roi venait chasser. C'est là qu'un homme décide de bâtir le plus grand palais d'Europe.</p>

<p>Il s'appelle <strong>Louis XIV</strong>. Il règne de <span class="key">1643 à 1715</span> — soixante-douze ans, le règne le plus long de l'histoire de France. On l'appelle le <strong>Roi-Soleil</strong>, parce qu'il a choisi le soleil comme emblème : tout tourne autour de lui, comme les planètes.</p>

<p>Le château de <strong>Versailles</strong> n'est pas seulement beau. C'est une machine politique. Louis XIV y installe toute la noblesse du royaume. Des ducs, des comtes, des marquis, des gens qui, deux générations plus tôt, levaient des armées contre le roi. Maintenant ils sont là, à Versailles, occupés à se disputer l'honneur de lui tendre sa chemise le matin.</p>

<p>Un noble occupé à des questions d'étiquette n'est pas un noble occupé à faire la guerre au roi.</p>

<h4>La monarchie absolue</h4>

<p>Sous Louis XIV, la France invente l'État moderne et centralisé : une administration, des impôts organisés, des intendants dans les provinces, une armée permanente, une marine, des routes. Beaucoup de ce qui structure encore le pays date de là.</p>

<p>Mais tout ce pouvoir se concentre dans une seule main. C'est ce qu'on appelle la <strong>monarchie absolue</strong> : le roi fait la loi, le roi rend la justice, le roi lève l'impôt, et il n'a de comptes à rendre à personne. On lui prête la formule « L'État, c'est moi ».</p>

<p>Dans le même temps, la France est divisée en trois <strong>ordres</strong>. Le clergé. La noblesse. Et tous les autres — 98 % de la population — qu'on appelle le tiers état. Les deux premiers ordres ne paient presque pas d'impôts. Le troisième paie tout.</p>

<blockquote>Retenez cette image : un palais éblouissant, et derrière, un pays où presque tout le monde travaille pour financer le palais sans avoir un mot à dire. Une machine comme celle-là fonctionne longtemps. Puis un jour elle casse. Ce jour arrivera soixante-quatorze ans après la mort de Louis XIV, et il portera une date : le 14 juillet 1789.</blockquote>`,
      retenir: [
        "<strong>Louis XIV</strong>, le « <strong>Roi-Soleil</strong> », règne de <strong>1643 à 1715</strong> et fait construire le <strong>château de Versailles</strong>.",
        "C'est l'apogée de la <strong>monarchie absolue</strong> : le roi concentre tous les pouvoirs.",
        "La société est divisée en trois ordres : clergé, noblesse, et tiers état (la quasi-totalité de la population, qui supporte l'impôt).",
      ],
      questions: [
        { q: 'Quel roi est surnommé le « Roi-Soleil » ?', c: ['Louis XIV', 'Louis XVI', 'Henri IV', 'François Ier'], a: 0, why: "Il règne de 1643 à 1715 et fait construire le château de Versailles." },
        { q: 'Quelles sont les dates du règne de Louis XIV ?', c: ['De 1643 à 1715', 'De 1589 à 1610', 'De 1715 à 1774', 'De 1774 à 1792'], a: 0, why: "C'est le règne le plus long de l'histoire de France." },
        { q: 'Quel château Louis XIV a-t-il fait construire ?', c: ['Le château de Versailles', 'Le château de Chambord', 'Le Louvre', 'Le palais des Papes'], a: 0, why: "Joyau de l'architecture classique, il servait aussi à tenir la noblesse sous contrôle." },
        { q: "Qu'appelle-t-on la monarchie absolue ?", c: ["Un régime où le roi concentre tous les pouvoirs sans rendre de comptes", "Un régime où le roi partage le pouvoir avec un parlement élu", "Un régime où le roi est élu", "Un régime sans roi"], a: 0, why: "L'Ancien Régime est marqué par cette concentration des pouvoirs dans une seule main." },
      ],
    },

    {
      key: 'ch06',
      num: 6,
      titre: 'Les hommes qui allumèrent les lumières',
      lieu: 'Les salons de Paris',
      date: 'XVIII<sup>e</sup> siècle',
      minutes: 5,
      html: `
<p>Il ne se passe rien de spectaculaire dans ce chapitre. Pas de bataille, pas de bûcher. Juste des gens qui écrivent, dans des salons, des cafés, des chambres mal chauffées. Et pourtant, c'est peut-être le chapitre le plus important de tous, parce que c'est là que naissent les idées qui feront tout basculer.</p>

<p>On appelle ce moment les <strong>Lumières</strong>. L'image est belle : jusque-là, disent ces auteurs, on vivait dans le noir — le noir de la superstition, de l'obéissance aveugle, du « c'est comme ça parce que c'est comme ça ». Ils veulent allumer la lampe de la raison.</p>

<h4>Quatre noms à ne pas oublier</h4>

<p><strong>Montesquieu</strong> se pose une question toute simple : comment empêcher un pouvoir de devenir tyrannique ? Sa réponse, écrite en 1748, est d'une élégance mécanique : il faut le découper. Celui qui fait les lois ne doit pas être celui qui les applique, ni celui qui juge. Trois pouvoirs séparés qui se surveillent. C'est la <strong>séparation des pouvoirs</strong>. Il dénonce aussi l'esclavage.</p>

<p><strong>Voltaire</strong>, lui, se bat toute sa vie contre l'intolérance et les erreurs judiciaires. Il défend des innocents condamnés pour leur religion. Il est ironique, mordant, insupportable aux puissants — et il fait de la liberté de penser et de dire une cause.</p>

<p><strong>Rousseau</strong> écrit que les hommes naissent libres, que la société les enchaîne, et que la seule autorité légitime est celle que le peuple se donne à lui-même.</p>

<p><strong>Diderot</strong>, avec d'Alembert, se lance dans un projet fou : rassembler dans une seule œuvre tout le savoir humain — l'<em>Encyclopédie</em>. Vingt-huit volumes. L'idée que le savoir ne doit pas rester enfermé, mais circuler.</p>

<blockquote>Ces gens n'ont pas pris le pouvoir. Ils ont fait quelque chose de plus durable : ils ont changé ce que les gens trouvaient normal. Une fois qu'on a lu que le pouvoir devrait être découpé, que la tolérance vaut mieux que le bûcher, que l'autorité vient du peuple — on ne peut plus regarder Versailles de la même façon.</blockquote>

<p>Trente ans après l'<em>Encyclopédie</em>, la Bastille tombera. Et le texte que la Révolution écrira aussitôt après reprendra, presque mot pour mot, ce que ces quatre-là avaient écrit dans leurs chambres.</p>`,
      retenir: [
        "Les <strong>philosophes des Lumières</strong> (XVIII<sup>e</sup> siècle) combattent pour la tolérance, la liberté de pensée et le refus de l'arbitraire.",
        '<strong>Montesquieu</strong> théorise la <strong>séparation des pouvoirs</strong> (exécutif, législatif, judiciaire) et dénonce l\'esclavage.',
        '<strong>Voltaire</strong> défend la tolérance ; <strong>Rousseau</strong>, la souveraineté du peuple ; <strong>Diderot</strong> et d\'Alembert publient l\'<em>Encyclopédie</em>.',
        "Leurs idées inspirent directement la Révolution française et la Déclaration des droits de l'homme et du citoyen.",
      ],
      questions: [
        { q: 'Quel philosophe des Lumières a théorisé la séparation des pouvoirs ?', c: ["Montesquieu", "Jean-Jacques Rousseau", "Voltaire", "Diderot"], a: 0, why: "Dans « De l'esprit des lois » (1748), il distingue les pouvoirs exécutif, législatif et judiciaire." },
        { q: 'Quels sont les trois pouvoirs séparés dans une démocratie ?', c: ['Exécutif, législatif et judiciaire', 'Militaire, religieux et civil', 'National, régional et local', 'Économique, social et culturel'], a: 0, why: "Cette séparation évite la concentration du pouvoir entre les mêmes mains." },
        { q: 'Pour quoi les philosophes des Lumières se sont-ils battus ?', c: ["La tolérance, la liberté de pensée et le refus de l'arbitraire", "Le renforcement de la monarchie absolue et du pouvoir royal", "Le retour de la religion d'État", "L'expansion coloniale"], a: 0, why: "Leur pensée a directement inspiré les idéaux de liberté, d'égalité et de fraternité." },
        { q: 'Quel philosophe des Lumières a explicitement dénoncé l\'esclavage ?', c: ["Montesquieu", "Colbert, ministre de Louis XIV", "Bossuet, évêque et précepteur royal", "Vauban, ingénieur du roi"], a: 0, why: "Le livret du citoyen le mentionne parmi les apports majeurs de Montesquieu." },
      ],
    },
  ],
};
