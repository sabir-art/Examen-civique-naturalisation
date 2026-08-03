# Contrôles automatiques de l'interface

Huit scripts Playwright, à lancer avec l'application servie sur le port 8099 :

```bash
npx http-server -p 8099 -c-1 &

node scripts/tests/sweep.mjs      # 26 écrans × 3 largeurs : débordements, textes coupés, boutons vides, erreurs console
node scripts/tests/a11y.mjs       # contrastes et cibles tactiles, 12 écrans × 6 combinaisons de thème
node scripts/tests/bugs.mjs       # non-régression des bugs signalés sur iPhone
node scripts/tests/erreurs.mjs    # « Mes erreurs » se vide quand on répond juste
node scripts/tests/cartes.mjs     # cartes mémoire et graphique de la semaine
node scripts/tests/parcours.mjs   # niveau, points d'expérience, badges
node scripts/tests/recherche.mjs  # recherche : six familles, accents, surlignage
node scripts/tests/activite.mjs   # journal, pastille, rappel quotidien, écran d'ouverture
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

Le contrôle du texte dans les SVG mérite une note : `scrollWidth` ne veut rien
dire dans un `<svg>`, où c'est le cadre de vue qui découpe et non `overflow`.
Le balayage compare donc `getBBox()` au `viewBox` — sans quoi il aurait signalé
tous les libellés d'anneau, ou aucun.
