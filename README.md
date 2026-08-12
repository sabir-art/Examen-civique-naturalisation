# Examen civique — entraînement à la naturalisation

Application web gratuite pour s'entraîner au **QCM de l'examen civique** exigé
pour les demandes de naturalisation déposées depuis le 1er janvier 2026.

L'application est organisée en **trois parties bien séparées**, qui se complètent :

| | Banque d'examen | Livret du citoyen | La France racontée |
|---|---|---|---|
| Contenu | 363 questions rédigées à partir du référentiel de l'arrêté du 10 octobre 2025 | Le texte officiel du ministère de l'Intérieur (édition mai 2026), repris intégralement, + 284 questions dédiées | Le programme raconté comme un roman : 22 chapitres en 3 actes, + 88 questions |
| Usage | examens blancs, entraînement par thème, révision espacée | lecture chapitre par chapitre et quiz de vérification | lecture suivie, puis 4 questions par chapitre |
| Où | onglets **Examen** et **Réviser** | onglet **Cours → Livret du citoyen** | onglet **Histoire** |

Les trois progressions sont suivies séparément : ni les questions du livret ni
celles du récit n'entrent dans la composition d'un examen blanc, et elles ne
modifient pas l'indicateur de préparation à l'épreuve.

### La France racontée

Pour qui retient mieux par les histoires que par les listes. Le même programme,
d'Alésia à l'Union européenne, sous forme de scènes : la reddition de
Vercingétorix, le 14 juillet, Simone Veil à la tribune. Chaque chapitre se
termine par un encadré **ce qu'il faut retenir** puis quatre questions, et le
chapitre est marqué comme lu dès qu'on en atteint la fin.

| Acte | Époque | Chapitres |
|---|---|---|
| I — Le temps des rois | 52 av. J.-C. → 1789 | 6 |
| II — Le temps du peuple | 1789 → 1958 | 10 |
| III — La France d'aujourd'hui | aujourd'hui | 6 |

### Lire en arabe, ou dans les deux langues

Le récit — et lui seul — est **traduit en arabe** (22 chapitres). Trois modes
de lecture, choisis une fois pour toutes depuis l'onglet Histoire :

| Mode | Ce qu'on voit |
|---|---|
| **Français** | le texte original |
| **العربية** | le chapitre entier en arabe, en sens droite-à-gauche |
| **FR + ع** | chaque paragraphe français suivi de sa traduction, appariés |

Le mode bilingue est celui qui sert vraiment : on comprend la scène en arabe,
puis on relit la même phrase en français. Les noms propres et les termes de
l'examen gardent leur forme française entre parenthèses, pour faire le pont
avec ce qu'on lira le jour de l'épreuve.

**Les questions restent en français**, volontairement. L'examen se passe en
français ; s'entraîner sur des questions traduites donnerait une réussite
trompeuse. `scripts/check-traduction.mjs` garantit que les deux versions ont
le même nombre de blocs, dans le même ordre — sans quoi le mode bilingue
décalerait les paragraphes en silence.

### Deux chiffres qui ne mesurent pas la même chose

Sous chaque chapitre, la barre montre l'**avancement** : lire le chapitre
(40 %) puis répondre juste à ses questions (60 %). Elle se remplit dans la
séance, et le chapitre passe à « Terminé ».

La **mémorisation**, elle, est affichée à part, sur la page du chapitre. C'est
de la répétition espacée : elle monte d'un cran par bonne réponse, mais chaque
palier impose d'attendre — 1 jour, puis 3, puis 7, puis 16. Il faut donc
plusieurs semaines pour atteindre 100 %, et c'est exactement ce qui fait tenir
la mémoire jusqu'à l'examen.

La même règle vaut partout : sous un chapitre, sous un acte, sous une partie du
livret, la barre est un **avancement** — elle se remplit dans la séance et
passe au vert. La **maîtrise** est toujours un nombre nommé, jamais une barre
nue.

Les deux ont longtemps été confondus : on avait tout lu, tout répondu juste, et
la barre restait rouge à 20 %.

### Le glossaire

108 mots difficiles, expliqués **en une phrase simple** — sans autre mot
difficile dedans — en français puis en arabe. Deux familles :

- le **vocabulaire de l'examen** : laïcité, suffrage, juridiction, présomption
  d'innocence, ostensible, promulguer ;
- les **mots qui bloquent la lecture** : aqueduc, hérésie, tiers état, rafle,
  hémicycle, assesseur. Ils ne tombent pas à l'examen, mais un mot inconnu au
  milieu d'une phrase fait perdre le fil du paragraphe entier — et les premiers
  chapitres, très narratifs, en sont pleins.

Dans le texte ils sont soulignés en pointillé : il suffit d'appuyer dessus.
Seule la première occurrence de chaque mot est marquée, sinon le soulignement
noie la page.

**Chaque chapitre a son propre glossaire**, sous l'encadré « à retenir » : la
liste des mots de ce chapitre-là, avec un repère « nouveau » sur ceux qu'il
introduit pour la première fois. La liste et le soulignement viennent du même
parcours de texte, ils ne peuvent donc pas diverger. Le glossaire complet reste
consultable et cherchable depuis Histoire et depuis Réviser.

### Les illustrations

Chaque chapitre porte une à trois images posées **dans le fil du texte**, juste
après le paragraphe qu'elles illustrent : l'aqueduc après « le pont du Gard »,
le double anneau d'Alésia après « Personne ne sort », la balance en équilibre
après « rien n'est jugé ». Les mots du glossaire qui se voient — isoloir, urne,
tranchée, bonnet phrygien — montrent la leur en s'ouvrant.

Ce sont des **images générées**, et chacune le dit sous elle. On ne fait pas
passer une image générée pour une photographie d'archives.

Elles sont ancrées par un **fragment de texte**, pas par un numéro de
paragraphe : le texte arabe et le texte français doivent garder exactement le
même nombre de blocs, ce dont dépend le mode bilingue. En échange, retoucher
une phrase suffit à faire disparaître une image sans le moindre signe — d'où
`scripts/check-images.mjs`, qui exige que chaque ancre tombe sur un et un seul
paragraphe.

Elles vivent dans le dépôt (`assets/photos/`, environ 2 Mo au total), jamais
sur un serveur tiers : l'application doit fonctionner hors ligne. Le
rapatriement est fait par `.github/workflows/images.yml`, un runner GitHub
ayant l'accès réseau que le poste de développement n'a pas.

Chaque chapitre a aussi son illustration d'en-tête. Elles sont **dessinées en SVG** par
`scripts/make-illustrations.mjs` — environ 4 Ko pièce, nettes sur tous les
écrans, disponibles hors ligne, et sans aucune image reprise d'ailleurs.

### Trois formats d'examen blanc

Tous en 40 questions, 45 minutes, seuil 32/40 :

| Format | Tirage |
|---|---|
| **Officiel** | Banque d'examen, répartition exacte de l'arrêté du 10 octobre 2025 (11/6/11/8/4, 28 connaissances + 12 mises en situation) |
| **Livret du citoyen** | Uniquement des questions du livret, avec la même pondération par thème (partie 1 : 11, partie 2 : 6, partie 3 + annexes : 11, partie 4 : 8, partie 5 : 4) |
| **Aléatoire** | 40 questions au hasard parmi les 647, sans répartition imposée |

Seuls les résultats du format **officiel** entrent dans l'estimation de préparation,
car lui seul respecte la composition de l'épreuve réelle. L'historique conserve le
format de chaque tentative.

- **735 questions** au total, avec une explication pour chacune
- **Révision espacée** : les questions ratées reviennent, celles qui sont acquises s'espacent
- **Recherche** dans tout le contenu — les trois banques, les chapitres, les fiches
- **Récit traduit en arabe**, avec un mode bilingue paragraphe par paragraphe
- **Glossaire** de 108 mots difficiles, en français et en arabe, avec un glossaire par chapitre
- **31 illustrations** posées dans le fil du récit, avec leur légende dans les deux langues
- **Niveaux, points et 20 badges**, calculés à partir de la progression (rien de plus n'est stocké)
- **Journal d'activité** et rappel quotidien facultatif
- **Livret du citoyen intégral** : 6 parties, 16 chapitres, 97 sections, annexes comprises
- **Fiches de révision** synthétiques, distinctes du livret
- **Assistant IA facultatif** (voir plus bas) pour faire réexpliquer une réponse
- **Compte et progression** conservés sur l'appareil, avec sauvegarde exportable et synchronisation optionnelle
- **Fonctionne hors ligne**, installable sur l'écran d'accueil du téléphone
- Aucune publicité, aucun traçage, aucun compte obligatoire

## Utilisation sur téléphone

Une fois le site publié (voir *Mise en ligne*), ouvrez-le dans le navigateur de
votre téléphone puis ajoutez-le à l'écran d'accueil :

- **iPhone (Safari)** : bouton Partager → « Sur l'écran d'accueil »
- **Android (Chrome)** : menu ⋮ → « Installer l'application » ou « Ajouter à l'écran d'accueil »

Installée, l'application s'ouvre en plein écran, fonctionne sans connexion et
conserve la progression de façon plus durable que dans un simple onglet.

## Mise en ligne (GitHub Pages)

Le dépôt contient un workflow qui publie le site à chaque `push`.

1. Sur GitHub : **Settings → Pages**
2. Dans **Build and deployment → Source**, choisir **GitHub Actions**
3. Pousser sur `main` ou sur la branche de développement ; l'onglet **Actions**
   affiche le déploiement et l'URL publique, de la forme
   `https://<utilisateur>.github.io/Examen-civique-naturalisation/`

Le workflow lance d'abord deux contrôles ; un déploiement échoue si l'un des
deux tombe :

- `scripts/check-secrets.mjs` — recherche de clés d'API dans les fichiers suivis ;
- `scripts/check-bank.mjs` — cohérence des trois banques et faisabilité du tirage.

## Contrôles automatiques

Onze suites Playwright couvrent les 27 écrans à trois largeurs, les contrastes
dans les six combinaisons de thème, la lecture dans les trois langues, et les
bugs déjà signalés. Chacune a été vérifiée en cassant volontairement ce qu'elle
surveille — voir `scripts/tests/LISEZMOI.md`.

```bash
npx http-server -p 8099 -c-1 &
for t in sweep a11y bugs erreurs cartes parcours recherche activite langue images progression; do
  node scripts/tests/$t.mjs || echo "échec : $t"
done
```

## Développement local

Aucune dépendance, aucune étape de compilation. Il faut simplement servir les
fichiers en HTTP (les modules ES ne se chargent pas depuis `file://`) :

```bash
npx http-server -p 8099 -c-1
# puis ouvrir http://localhost:8099
```

Scripts utiles :

```bash
node scripts/check-secrets.mjs      # aucune clé d'API dans les fichiers suivis par Git
node scripts/check-bank.mjs         # intégrité des banques + couverture du plan de tirage
node scripts/make-icons.mjs         # régénère les icônes PNG de l'application
node scripts/make-illustrations.mjs # régénère les 22 illustrations du récit
npm run check                       # les deux contrôles à la suite
```

Pour que le contrôle anti-secrets tourne aussi avant chaque commit local :

```bash
git config core.hooksPath .githooks
```

## Organisation du code

```
index.html              coquille de l'application
sw.js                   service worker (mode hors ligne)
assets/css/app.css      feuille de style unique, thème clair et sombre
js/app.js               routeur et chargement des vues
js/store.js             comptes locaux, progression, révision espacée (Leitner)
js/engine.js            tirage des examens, calcul de la maîtrise et de la préparation
js/sync.js              synchronisation cloud optionnelle
js/ai.js                appels aux API d'IA et de voix (clés saisies par l'utilisateur)
js/ai-context.js        consigne système et contexte d'une question
js/components/          composant de quiz et écran de résultats
js/views/               une vue par écran
js/views/parcours.js    niveau, points d'expérience, badges
js/views/recherche.js   recherche dans tout le contenu
js/views/activite.js    journal des évènements et rappel quotidien
js/lib/xp.js            barème des points, paliers de niveau, définition des badges
js/lib/rappel.js        rappel quotidien local (limites documentées dans le fichier)
js/data/programme.js    référentiel officiel et plan de tirage des 40 questions
js/data/questions.js    agrégation de la banque d'examen + contrôle d'intégrité
js/data/q-*.js          les questions d'examen, par thème
js/data/cours.js        fiches de révision
js/data/livret.js       assemblage du livret du citoyen
js/data/livret/*.js     le texte officiel, une partie par fichier
js/data/q-livret.js     les 284 questions du livret, par chapitre
js/views/livret.js      lecture du livret et quiz par chapitre
js/data/roman.js        assemblage du récit + ses 88 questions
js/data/roman/*.js      les trois actes, un fichier par acte
js/data/roman-ar.js     traduction arabe du récit
js/data/roman-ar/*.js   les trois actes traduits
js/data/glossaire.js    les mots difficiles, définis en français et en arabe
js/lib/gloss.js         repérage des mots du glossaire dans un texte rendu
js/data/images.js       index des illustrations, chargé depuis le manifeste
assets/photos/          les illustrations + manifeste.json (source unique)
js/views/roman.js       lecture d'un chapitre et quiz
js/views/assistant.js   configuration de la clé et conversation
```

### Ajouter des questions

Chaque fichier `js/data/q-*.js` exporte un tableau d'objets :

```js
{
  q: "Quelle est la devise de la République française ?",
  c: ["Liberté, Égalité, Fraternité", "…", "…", "…"],
  a: 0,                       // index de la bonne réponse
  why: "Article 2 de la Constitution…",
  scenario: "…",              // uniquement pour les mises en situation
}
```

Les propositions sont **mélangées à l'affichage** : la bonne réponse peut rester
en première position dans les données. Après modification, relancer
`node scripts/check-bank.mjs`.

## Assistant IA (facultatif)

L'application peut être reliée à **votre propre compte d'IA** — Claude, ChatGPT,
Gemini ou Mistral — pour faire réexpliquer une réponse, demander un exemple ou
un moyen mnémotechnique. Réglages : **Mon compte → Assistant et voix**.

Vous collez votre clé, le fournisseur est reconnu à sa forme, puis l'application
demande à son API la **liste des modèles auxquels cette clé donne droit** : le
choix proposé n'est donc jamais un devinage. Plusieurs clés peuvent cohabiter.

Sous chaque explication de quiz — que la réponse ait été juste ou fausse — un
panneau **Approfondir avec l'IA** propose des demandes toutes prêtes, une
question libre, et la lecture à voix haute de la réponse.

Tout le reste fonctionne à l'identique sans assistant.

### Pourquoi la clé n'est pas dans le code

Ce dépôt publie un **site statique**. Tout ce qu'il contient est téléchargé par
le navigateur de chaque visiteur : le HTML, le CSS, le JavaScript. Une clé
d'API placée dans un fichier du dépôt — ou injectée à la construction depuis un
secret GitHub Actions — serait donc lisible par n'importe qui, et facturée à son
propriétaire. **Un secret publié dans une page web n'est plus un secret.**

L'application applique donc le seul modèle qui tienne sans serveur :

| | |
|---|---|
| Qui fournit la clé | l'utilisateur, dans l'application (**Mon compte → Assistant et voix**) |
| Où elle est stockée | le `localStorage` de son navigateur, sous `examen-civique.assistant` |
| Où elle est envoyée | à `api.anthropic.com` uniquement, en direct |
| Exportée avec le profil | non |
| Synchronisée entre appareils | non |
| Présente dans le dépôt | jamais — le déploiement échoue si elle y apparaît |

Où créer une clé, selon le fournisseur choisi :
[Anthropic](https://console.anthropic.com) ·
[OpenAI](https://platform.openai.com/api-keys) ·
[Google](https://aistudio.google.com/apikey) ·
[Mistral](https://console.mistral.ai/api-keys) ·
[ElevenLabs](https://elevenlabs.io/app/settings/api-keys).

Pensez à **fixer une limite de dépense** : les échanges sont facturés à l'usage.
Une clé qui a pu être vue par quelqu'un d'autre doit être **supprimée depuis la
console du fournisseur** — c'est la seule action qui la rende inutilisable.

### Voix

Facultative elle aussi. Sans clé, la lecture à voix haute utilise la synthèse
vocale intégrée au téléphone : gratuite, hors ligne, mais mécanique. Avec une
clé [ElevenLabs](https://elevenlabs.io), on choisit une voix parmi celles du
compte et le rendu est nettement meilleur (modèle `eleven_multilingual_v2`,
indispensable pour une prononciation française correcte).

### Le garde-fou

`scripts/check-secrets.mjs` parcourt tous les fichiers suivis par Git et cherche
les formats de clés connus (Anthropic, OpenAI, GitHub, AWS, Google, Slack, clés
privées, JWT, ainsi que les affectations `password = "..."`). Il tourne dans le
workflow **avant** la publication : si une clé est trouvée, rien n'est mis en
ligne. Il peut aussi être branché en `pre-commit` (voir *Développement local*).

Si une clé a malgré tout été poussée : **révoquez-la d'abord**. La supprimer du
fichier ne suffit pas, elle reste dans l'historique Git.

## Synchronisation entre appareils (facultatif)

L'application fonctionne parfaitement sans. Elle sert seulement à retrouver sa
progression sur un autre téléphone. Aucune clé n'est incluse dans le code : c'est
vous qui reliez l'application à votre propre espace [Supabase](https://supabase.com)
(offre gratuite).

1. Créer un projet Supabase.
2. Dans **SQL Editor**, exécuter :

```sql
create table if not exists progression (
  user_id    uuid primary key references auth.users on delete cascade,
  data       jsonb not null,
  updated_at timestamptz not null default now()
);

alter table progression enable row level security;

create policy "lecture de sa propre progression"
  on progression for select using (auth.uid() = user_id);

create policy "écriture de sa propre progression"
  on progression for insert with check (auth.uid() = user_id);

create policy "mise à jour de sa propre progression"
  on progression for update using (auth.uid() = user_id);
```

3. Dans **Project Settings → API**, relever l'**URL du projet** et la clé
   **anon public**.
4. Dans l'application : **Mon compte → Synchronisation entre appareils**, coller
   les deux valeurs, puis créer un compte avec une adresse e-mail et un mot de passe.

Les boutons **Envoyer** et **Récupérer** transfèrent la progression. Les règles de
sécurité ci-dessus font que chaque utilisateur ne peut lire et écrire que ses
propres données.

## Sources

- Décret n° 2025-648 du 15 juillet 2025 instituant l'examen civique
- Arrêté du 10 octobre 2025 relatif au programme, aux épreuves et aux modalités
  d'organisation de l'examen civique (annexe I : référentiel de connaissances)
- **Livret du citoyen, ministère de l'Intérieur, édition mai 2026** — transcrit
  intégralement dans `js/data/livret/`
- [service-public.fr](https://www.service-public.fr) et [legifrance.gouv.fr](https://www.legifrance.gouv.fr)

## Avertissement

Projet indépendant, sans lien avec l'administration française. Les questions sont
des questions d'entraînement rédigées à partir du programme officiel : ce ne sont
pas les questions de l'examen, que le ministère ne publie pas intégralement.
Les informations pratiques (tarifs, centres, modalités) peuvent évoluer :
vérifiez auprès de votre préfecture, sur service-public.fr et auprès du centre
d'examen.
