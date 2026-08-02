# Contrôles automatiques de l'interface

Trois scripts Playwright, à lancer avec l'application servie sur le port 8099 :

```bash
npx http-server -p 8099 -c-1 &
node scripts/tests/sweep.mjs   # débordements, textes tronqués, boutons vides, erreurs console
node scripts/tests/a11y.mjs    # contrastes et cibles tactiles, 6 combinaisons de thème
node scripts/tests/bugs.mjs    # non-régression des bugs déjà signalés
```

Chacun a été vérifié en plantant volontairement le défaut qu'il traque :

- `sweep.mjs` — 135 signalements sur une feuille de style rendue défaillante
- `a11y.mjs` — contraste de 1,00 quand on réintroduit la règle qui rendait les
  boutons secondaires blancs sur blanc en thème clair forcé
- `bugs.mjs` — chevauchement détecté quand la barre d'action reste collée

Un contrôle qui ne signale rien parce qu'il ne regarde pas au bon endroit est
pire qu'aucun contrôle : c'est pour cela que la vérification par plantage fait
partie de la méthode.
