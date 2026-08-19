# Contrôles automatiques de l'interface

Dix-sept scripts Playwright, à lancer avec l'application servie sur le port 8099 :

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
node scripts/tests/lisibilite.mjs # rien de caché derrière une barre, aucun bouton sur deux lignes
node scripts/tests/assistant.mjs  # l'assistant : retour au bon écran, saisie qui ne recouvre rien
node scripts/tests/tableaux.mjs   # les tableaux d'enquête : liens, sens de lecture, renvois
node scripts/tests/chiffres.mjs   # les chiffres romains doublés de leur valeur
node scripts/tests/themes.mjs     # un thème compte ses questions dans les trois banques
node scripts/tests/version.mjs    # date de mise à jour, recherche d'une version plus récente
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
| `themes.mjs` | thèmes recalculés sur la seule banque d'examen | 4 questions du récit et 18 du livret répondues, compteur du thème à 0 |
| `themes.mjs` | un chapitre du récit retiré de la table de rattachement | `check-bank` : « 4 questions sans thème » |
| `themes.mjs` | avancement du thème recompté sur la seule banque d'examen | carte à « 0/209 vues » après quatre réponses, récit à 0/48 |
| `check-bank.mjs` | deux fichiers de questions remis dans leur état d'avant | « 54/363 questions où la bonne réponse se voit à sa longueur » |
| `version.mjs` | `version.json` remis dans le cache hors ligne | il apparaît dans le cache : la recherche de mise à jour ne détecterait plus rien |
| `version.mjs` | serveur injoignable rapporté comme « à jour » | 2 signalements sur le cas hors ligne |
| `version.mjs` | `version.json` et l'application mis en désaccord | `check-version` : « version.json annonce deadbee, l'application 2d230a6 » |
| `version.mjs` | dernière entrée du journal supprimée | « un contenu a changé le 19, le journal s'arrête au 16 » |
| `a11y.mjs` | badge sombre sur fond translucide clair | contraste 1,01 (le compositeur des couches voit ce qu'un fond `rgba` cache) |

Le contrôle du texte dans les SVG mérite une note : `scrollWidth` ne veut rien
dire dans un `<svg>`, où c'est le cadre de vue qui découpe et non `overflow`.
Le balayage compare donc `getBBox()` au `viewBox` — sans quoi il aurait signalé
tous les libellés d'anneau, ou aucun.

Cinq contrôles de données complètent l'ensemble, sans navigateur :

```bash
node scripts/check-bank.mjs        # intégrité des trois banques et rattachement aux thèmes
node scripts/check-traduction.mjs  # la traduction arabe suit la structure du français
node scripts/check-images.mjs      # chaque ancre d'image tombe sur un seul paragraphe
node scripts/check-workflows.mjs   # les workflows GitHub se parsent vraiment
node scripts/check-secrets.mjs     # aucune clé dans les fichiers suivis par Git
node scripts/check-version.mjs     # date de publication, dates des contenus, journal des versions
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

`themes.mjs` vient d'une question d'usage qui n'appelait aucun message d'erreur :
« je viens de faire quarante questions sur principes et valeurs et ça ne bouge
pas, sur quoi c'est calculé ? ». Le pourcentage ne portait que sur la banque
d'examen ; le livret et le récit posent pourtant les mêmes questions, sur le
même programme, et n'y comptaient pour rien. Le contrôle joue donc les trois
chemins — un chapitre du récit, un chapitre du livret, puis un thème entier
posé comme acquis — et exige que le même compteur bouge à chaque fois. Il
vérifie aussi l'inverse : l'examen blanc officiel doit continuer de ne tirer
que dans la banque d'examen, sa composition étant celle de l'épreuve réelle.

`version.mjs` traite d'un défaut qu'on ne voit jamais depuis un poste de
développement : une application ajoutée à l'écran d'accueil est servie depuis
son cache, et peut afficher pendant des semaines une version d'il y a un mois
sans rien en dire. Pour un contenu qui suit un programme officiel, c'est le
défaut lui-même. Trois cas sont donc joués : le serveur a la même version, il
en a une plus récente, il est injoignable. Le dernier est le plus important —
répondre « vous êtes à jour » faute de réponse serait commode et faux.

Deux règles s'ajoutent, hors navigateur. Aucune date n'est saisie à la main :
elles viennent toutes de l'historique Git (`scripts/make-version.mjs`), et ne
peuvent donc pas se désynchroniser de ce qu'elles décrivent. Et
`check-version.mjs` refuse qu'un contenu change sans que le journal des
versions en dise un mot : l'application afficherait sinon une date de mise à
jour toute fraîche à côté d'un journal muet.

Un dernier contrôle n'a rien d'une vérification d'interface et vaut pourtant
tous les autres : **la longueur des propositions**. Un QCM peut échouer d'une
façon qui ne se voit pas en le lisant — si la bonne réponse est nettement plus
fournie que les autres, on la désigne sans rien savoir. C'était le cas de cette
banque : bonne réponse la plus longue dans 75 % des questions, et un candidat
ignorant tout obtenait 27 sur 40 à l'examen blanc en cochant toujours la plus
bavarde, pour une barre de réussite à 32. Il aurait vu son niveau grimper et
découvert le jour de l'épreuve que le réflexe ne servait à rien.

`check-bank.mjs` mesure donc cet indice, en ne comptant que ce qu'un œil peut
réellement voir : au moins un cinquième d'écart, et pas en deçà de vingt-cinq
caractères — trois lettres entre « Vichy » et « Londres » ne renseignent
personne.
