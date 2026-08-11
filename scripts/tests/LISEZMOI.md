# Contrôles automatiques de l'interface

Neuf scripts Playwright, à lancer avec l'application servie sur le port 8099 :

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

Le contrôle du texte dans les SVG mérite une note : `scrollWidth` ne veut rien
dire dans un `<svg>`, où c'est le cadre de vue qui découpe et non `overflow`.
Le balayage compare donc `getBBox()` au `viewBox` — sans quoi il aurait signalé
tous les libellés d'anneau, ou aucun.

Trois contrôles de données complètent l'ensemble, sans navigateur :

```bash
node scripts/check-bank.mjs        # intégrité des trois banques de questions
node scripts/check-traduction.mjs  # la traduction arabe suit la structure du français
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
