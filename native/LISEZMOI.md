# La coque native

L'application est d'abord un site : on ouvre un lien, et tout fonctionne, hors
ligne compris. C'est ainsi que la plupart des gens l'utiliseront, et rien de ce
qui suit ne leur est nécessaire.

Ce dossier sert à autre chose : **obtenir les matériaux du système** — le verre
d'iOS, le Material d'Android — au lieu de les imiter. Un navigateur n'a aucun
moyen d'appeler `UIGlassEffect` ; il faut une coque native pour cela.

## Ce que la coque change, et ce qu'elle ne change pas

Ne change pas : les écrans, la navigation, les questions, la progression, les
données. Une seule interface, écrite une fois.

Change : **la barre d'onglets**. Dans la coque, elle n'est plus dessinée par la
page mais par le système, qui gère alors lui-même le flou, la transparence, la
profondeur, le contraste, le passage clair/sombre, la réaction au contenu qui
défile derrière — et les réglages d'accessibilité « réduire la transparence »
et « augmenter le contraste », qu'aucune imitation ne respecte.

```
Interface commune (js/, assets/)
    ↓
Abstraction de plateforme (js/lib/pont-natif.js)
    ├── coque iOS      → UITabBar, fond par défaut      (iOS 26 : Liquid Glass)
    │                    UITabBar + systemChromeMaterial (iOS 13 → 18)
    ├── coque Android  → BottomNavigationView, Material 3
    └── navigateur     → la barre du système de design, en CSS
```

La page ne sait jamais laquelle des trois s'applique : elle demande une barre,
et se contente de la sienne si personne ne répond.

Sur iOS 26, on ne demande pas Liquid Glass : on demande le **fond par défaut**
d'une `UITabBar`, et c'est le système qui le rend en Liquid Glass. C'est plus
robuste que d'instancier le matériau soi-même — le jour où Apple le fait
évoluer, l'application suit sans qu'on y touche.

## Construire, dans l'ordre

**D'abord, mettre le projet sur le Mac et entrer dans son dossier.** La moitié
des échecs d'une première coque viennent de là : les commandes sont lancées
depuis le dossier personnel, npm ne trouve pas de `package.json` et se plaint
d'autre chose (« could not determine executable to run »), ce qui envoie
chercher très loin d'un problème très simple.

```bash
git clone https://github.com/sabir-art/Examen-civique-naturalisation.git
cd Examen-civique-naturalisation
git checkout claude/civic-exam-training-platform-794c2u
```

Ensuite, une seule commande fait le reste et s'arrête à la première chose qui
manque, en disant laquelle :

```bash
bash native/preparer-ios.sh
```

Elle vérifie Node, les outils Xcode et CocoaPods, installe les dépendances,
crée le projet iOS, y copie le greffon et assemble l'application.

Ce qu'elle ne peut pas faire, et qu'elle rappelle à la fin : dans Xcode,
**glisser `BarreSystemePlugin.swift` dans le navigateur de projet en cochant la
cible « App »**. Un fichier posé dans le dossier n'appartient pas encore à
l'application. Sans ce geste tout démarre quand même — avec la barre de la page
au lieu de celle du système —, et c'est le piège le plus courant.

Une fois le fichier dans la cible, Capacitor découvre le greffon tout seul : il
se déclare par sa conformité à `CAPBridgedPlugin`, sans ligne d'enregistrement
à écrire.

Pour Android, plus tard :

```bash
npx cap add android
mkdir -p android/app/src/main/java/fr/examencivique/app
cp native/android/BarreSystemePlugin.kt android/app/src/main/java/fr/examencivique/app/
```

À chaque fois qu'on a modifié l'application, ensuite :

```bash
npm run natif:sync         # assemble dist/ puis le recopie dans les projets
npm run natif:ios          # ouvre Xcode
```

Dans Xcode : sélectionner l'iPhone connecté, choisir son équipe de
développement dans **Signing & Capabilities**, changer l'identifiant
`fr.examencivique.app` s'il est déjà pris, puis **Cmd + R**.

## Le détail qui compte : ce qui part dans l'application

`npm run dist` assemble un dossier `dist/` avec l'application et rien d'autre.
Sans ce tri, Capacitor embarquerait le dépôt entier — `.git`, scripts de
contrôle, captures de test — dans un fichier que l'App Store fait télécharger
sur le téléphone de quelqu'un.

Le service worker en est écarté volontairement : dans la coque, les fichiers
sont déjà sur l'appareil, et un cache qui survivrait à une mise à jour de l'App
Store servirait l'ancienne version par-dessus la nouvelle. Là-bas, c'est le
système qui met à jour l'application.

## Sur Android

Le greffon attend cinq icônes vectorielles dans
`android/app/src/main/res/drawable/` : `ic_accueil`, `ic_histoire`,
`ic_reviser`, `ic_examen`, `ic_progres`. Tant qu'elles manquent, la
compilation échoue — c'est voulu : une barre sans icônes n'est pas une barre.

Sur iOS, rien à fournir : les glyphes viennent de SF Symbols, donc du système,
et suivent la taille de texte choisie par l'utilisateur.

## Ce qui n'a pas pu être vérifié ici

Le code Swift et Kotlin de ce dossier n'a **pas été compilé** : il a été écrit
sur une machine Linux, sans Xcode ni Android Studio. Il suit les API publiques
de Capacitor 7, d'UIKit et de Material 3, mais la première compilation
demandera probablement quelques ajustements — un chemin, une signature, un nom
de ressource. C'est du travail d'une heure sur une machine équipée, pas une
réécriture. Les messages d'erreur d'Xcode sont explicites ; en cas de doute,
les copier tels quels vaut mieux que de les résumer.

Ce qui, en revanche, est vérifié : tout le côté page. `scripts/tests/pont.mjs`
éprouve l'abstraction avec un faux hôte natif installé avant le premier script,
exactement comme Capacitor s'annonce — la barre de la page disparaît, la
hauteur annoncée par le système est réservée, les appuis de la barre du système
font naviguer l'application, aucun service worker ne s'installe, et l'absence
d'hôte ne change rien à ce que voit un navigateur.
