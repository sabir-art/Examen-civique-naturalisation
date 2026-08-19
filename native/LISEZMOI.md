# La coque native

L'application est d'abord un site : on ouvre un lien, et tout fonctionne, hors
ligne compris. C'est ainsi que la plupart des gens l'utiliseront, et rien de ce
qui suit ne leur est nécessaire.

Ce dossier sert à autre chose : **obtenir les matériaux du système** — le verre
d'iOS, le Material d'Android — au lieu de les imiter. Un navigateur n'a aucun
moyen d'appeler `UIGlassEffect` : il faut une coque native pour cela.

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
    ├── coque iOS      → UITabBar + UIGlassEffect      (iOS 26+)
    │                    UITabBar + systemChromeMaterial (iOS 13 → 18)
    ├── coque Android  → BottomNavigationView, Material 3
    └── navigateur     → la barre du système de design, en CSS
```

La page ne sait jamais laquelle des trois s'applique : elle demande une barre,
et se contente de la sienne si personne ne répond.

## Ce qu'il faut pour construire

Ce dépôt ne contient PAS les dossiers `ios/` et `android/` : ils sont engendrés
par Capacitor et n'ont pas à être versionnés. Il faut, une fois :

- un Mac avec Xcode (obligatoire pour iOS — Apple ne permet pas de compiler
  ailleurs), et un compte développeur Apple pour publier ;
- Android Studio pour la version Android.

```bash
npm install                       # Capacitor et son outillage
npx cap add ios
npx cap add android

# Le greffon, à copier dans les projets engendrés :
cp native/ios/BarreSystemePlugin.swift ios/App/App/
cp native/android/BarreSystemePlugin.kt android/app/src/main/java/fr/examencivique/app/

npx cap sync
npx cap open ios                  # puis compiler dans Xcode
npx cap open android
```

Sur Android, ajouter les cinq icônes vectorielles attendues par le greffon dans
`android/app/src/main/res/drawable/` : `ic_accueil`, `ic_histoire`,
`ic_reviser`, `ic_examen`, `ic_progres`. Sur iOS, rien à fournir : les glyphes
viennent de SF Symbols, donc du système, et suivent la taille de texte choisie
par l'utilisateur.

## Ce qui n'a pas pu être vérifié ici

Le code Swift et Kotlin de ce dossier n'a **pas été compilé** : il a été écrit
sur une machine Linux, sans Xcode ni Android Studio. Il suit les API publiques
de Capacitor 7, d'UIKit et de Material 3, mais la première compilation
demandera probablement quelques ajustements — un chemin de fichier, une
signature, un nom de ressource. C'est du travail d'une heure sur une machine
équipée, pas une réécriture.

Ce qui, en revanche, est vérifié : le côté page. `scripts/tests/pont.mjs`
éprouve l'abstraction avec un faux hôte natif — la barre de la page disparaît,
les appuis de la barre du système font naviguer l'application, et l'absence
d'hôte ne change rien à ce que voit un navigateur.
