# Contrôles automatiques de l'interface

Onze scripts Playwright, à lancer avec l'application servie sur le port 8099 :

```bash
npx http-server -p 8099 -c-1 &

node scripts/tests/sweep.mjs      # 27 écrans × 3 largeurs : débordements, textes coupés, boutons vides, erreurs console
node scripts/tests/a11y.mjs       # contrastes et cibles tactiles, 13 écrans × 6 combinaisons de thème
node scripts/tests/bugs.mjs       # non-régression des bugs signalés sur iPhone
node scripts/tests/erreurs.mjs    # « Mes erreurs » se vide quand on répond juste
node scripts/tests/cartes.mjs     # cartes mémoire et graphique de la semaine
node scripts/tests/parcours.mjs   # niveau, points d'expérience, badges
node scripts/tests/recherche.mjs  # recherche : six familles, accents, surlignage
node scripts/tests/activite.mjs   # journal, pastille, rappel quotidien, écran d'ouverture
node scripts/tests/langue.mjs     # lecture en arabe, mode bilingue, glossaire par chapitre
node scripts/tests/images.mjs     # illustrations : ancrage, légendes, provenance, poids
node scripts/tests/progression.mjs # chapitre, acte, livret, et le nombre annoncé avant une séance
```

## La méthode : vérifier chaque contrôle en cassant ce qu'il surveille

Un contrôle qui ne signale rien parce qu'il ne regarde pas au bon endroit est
pire qu'aucun contrôle — il donne la tranquillité sans la mériter. C'est arrivé
une fois : le contrôle de contraste ne visitait ni `#/compte` ni les boîtes de
dialogue, et il a laissé passer des boutons blancs sur blanc que l'écran d'un
téléphone montrait du premier coup d'œil.

Chaque script a donc été soumis au défaut qu'il traque :

| Script | Sabotage | Ce qui a été signalé |
| --- | --- | --- |
| `sweep.mjs` | feuille de style rendue défaillante | 135 signalements |
| `sweep.mjs` | libellé du cadran allongé au-delà du cadre SVG | « sort du cadre (-114…242 pour 0…128) » |
| `a11y.mjs` | règle rendant les boutons secondaires blancs sur blanc | contraste de 1,00 |
| `bugs.mjs` | barre d'action laissée collée en bas | chevauchement détecté |
| `erreurs.mjs` | retour à l'ancienne règle des boîtes | questions restées dans la liste |
| `parcours.mjs` | bonne réponse portée de 10 à 11 points | 3 signalements |
| `recherche.mjs` | pliage des accents désactivé | « laicite » ne trouve plus rien |
| `activite.mjs` | écran d'ouverture qui ne se retire jamais | l'application reste bloquée |
| `activite.mjs` | journées comptées comme notifications | pastille qui ne s'éteint plus |
| `langue.mjs` | un paragraphe arabe fusionné avec le suivant | ch07 décalé, appariement rompu |
| `langue.mjs` | glossaire marquant chaque occurrence | six mots soulignés deux fois |
| `langue.mjs` | lettrine réactivée sur le texte arabe | signalée (elle coupe la liaison des lettres) |
| `langue.mjs` | reste du nœud remis en fin de file de traitement | ch05 et ch12 : liste dans un ordre différent du texte |
| `langue.mjs` | liste du chapitre tirée du glossaire entier | les 22 chapitres signalés |
| `images.mjs` | une phrase retouchée périme l'ancre d'une image | ch01/aqueduc absente |
| `images.mjs` | fichier image supprimé du dépôt | 2 images cassées au ch01 |
| `images.mjs` | mention de provenance masquée | 0/3 images disant d'où elles viennent |
| `progression.mjs` | barre du chapitre remise sur la mémorisation | 25 % après une séance complète, jamais verte |
| `progression.mjs` | barre de l'acte remise sur la maîtrise moyenne | 5 % avec les six chapitres terminés |
| `progression.mjs` | barre du livret remise sur la maîtrise | chapitre jamais marqué terminé |
| `progression.mjs` | bouton d'accueil réaffichant les questions dues | annonce 10, séance de 20 |

Le contrôle du texte dans les SVG mérite une note : `scrollWidth` ne veut rien
dire dans un `<svg>`, où c'est le cadre de vue qui découpe et non `overflow`.
Le balayage compare donc `getBBox()` au `viewBox` — sans quoi il aurait signalé
tous les libellés d'anneau, ou aucun.

Cinq contrôles de données complètent l'ensemble, sans navigateur :

```bash
node scripts/check-bank.mjs        # intégrité des trois banques de questions
node scripts/check-traduction.mjs  # la traduction arabe suit la structure du français
node scripts/check-images.mjs      # chaque ancre d'image tombe sur un seul paragraphe
node scripts/check-workflows.mjs   # les workflows GitHub se parsent vraiment
node scripts/check-secrets.mjs     # aucune clé dans les fichiers suivis par Git
```

`check-traduction.mjs` mérite un mot : le mode bilingue pose chaque paragraphe
arabe sous son paragraphe français, en se fiant à l'ordre. Une traduction qui
fusionnerait deux paragraphes décalerait tout le reste du chapitre **sans rien
casser** — on lirait la traduction du paragraphe d'à côté. C'est le genre de
défaut qu'aucun test d'interface ne voit et qu'un lecteur arabophone
remarquerait immédiatement.

Un mot sur le glossaire par chapitre. La liste affichée en fin de chapitre et
les mots soulignés dans le texte viennent du **même parcours** (`js/lib/gloss.js`)
— deux implémentations parallèles auraient fini par diverger sans que rien ne
le signale. C'est d'ailleurs ce contrôle qui a révélé un défaut réel : en
remettant la fin d'un nœud de texte en queue de file, l'ordre de traitement
cessait de suivre l'ordre de lecture, et la liste d'un chapitre ne sortait plus
dans l'ordre où l'on rencontre les mots.

`check-workflows.mjs` est né d'un échec : un workflow au YAML cassé ne
« plante » pas visiblement — GitHub crée une exécution qui échoue en zéro
seconde, avec zéro job, sans log et sans message. Sa première version se
contentait de règles d'indentation écrites à la main et **a laissé passer le
défaut même pour lequel elle avait été écrite**. Elle délègue désormais
l'analyse à un vrai parseur.

`check-images.mjs` garde l'autre défaut silencieux : les illustrations sont
ancrées à un fragment de texte, et retoucher une phrase suffit à faire
disparaître une image sans le moindre signe.

`progression.mjs` vient d'un signalement d'usage, et c'est le genre le plus
utile : « je finis le chapitre, je réponds correctement, la barre n'est jamais
complète ». Elle affichait la mémorisation à long terme, qui ne PEUT PAS
dépasser 20 % en une séance — chaque palier impose d'attendre un jour, puis
trois, puis sept. Aucun test ne pouvait le voir : le calcul était juste, c'est
le sens affiché qui était faux. Le contrôle joue donc un chapitre pour de vrai,
jusqu'à ce que toutes les réponses soient justes, et exige que la barre soit
pleine à la fin — au niveau du chapitre, de l'acte et du livret, car la même
confusion existait aux trois.
