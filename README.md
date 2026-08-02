# Examen civique — entraînement à la naturalisation

Application web gratuite pour s'entraîner au **QCM de l'examen civique** exigé
pour les demandes de naturalisation déposées depuis le 1er janvier 2026.

L'application est organisée en **deux parties bien séparées**, qui se complètent :

| | Banque d'examen | Livret du citoyen |
|---|---|---|
| Contenu | 363 questions rédigées à partir du référentiel de l'arrêté du 10 octobre 2025 | Le texte officiel du ministère de l'Intérieur (édition mai 2026), repris intégralement, + 284 questions dédiées |
| Usage | examens blancs, entraînement par thème, révision espacée | lecture chapitre par chapitre et quiz de vérification |
| Où | onglets **Examen** et **Réviser** | onglet **Cours → Livret du citoyen** |

Les deux progressions sont suivies séparément : les questions du livret n'entrent
jamais dans la composition d'un examen blanc et ne modifient pas l'indicateur de
préparation à l'épreuve.

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

- **647 questions** au total, avec une explication pour chacune
- **Révision espacée** : les questions ratées reviennent, celles qui sont acquises s'espacent
- **Livret du citoyen intégral** : 6 parties, 16 chapitres, 97 sections, annexes comprises
- **Fiches de révision** synthétiques, distinctes du livret
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

Le workflow lance d'abord `scripts/check-bank.mjs` : un déploiement échoue si la
banque de questions est incohérente ou si le plan de tirage ne fait plus 40 questions.

## Développement local

Aucune dépendance, aucune étape de compilation. Il faut simplement servir les
fichiers en HTTP (les modules ES ne se chargent pas depuis `file://`) :

```bash
npx http-server -p 8099 -c-1
# puis ouvrir http://localhost:8099
```

Scripts utiles :

```bash
node scripts/check-bank.mjs   # intégrité de la banque + couverture du plan de tirage
node scripts/make-icons.mjs   # régénère les icônes PNG de l'application
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
js/components/          composant de quiz et écran de résultats
js/views/               une vue par écran
js/data/programme.js    référentiel officiel et plan de tirage des 40 questions
js/data/questions.js    agrégation de la banque d'examen + contrôle d'intégrité
js/data/q-*.js          les questions d'examen, par thème
js/data/cours.js        fiches de révision
js/data/livret.js       assemblage du livret du citoyen
js/data/livret/*.js     le texte officiel, une partie par fichier
js/data/q-livret.js     les 284 questions du livret, par chapitre
js/views/livret.js      lecture du livret et quiz par chapitre
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
