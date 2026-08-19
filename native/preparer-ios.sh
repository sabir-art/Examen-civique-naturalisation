#!/usr/bin/env bash
#
# Prépare la coque iOS, en s'arrêtant à la première chose qui manque.
#   bash native/preparer-ios.sh
#
# Ce script existe parce que la moitié des échecs d'une première coque ne sont
# pas des erreurs de code : c'est un outil absent, ou un terminal ouvert dans
# le mauvais dossier. Les messages de npm, dans ces cas-là, parlent d'autre
# chose — « could not determine executable to run », « Could not read
# package.json » — et laissent chercher longtemps.
#
set -u

rouge() { printf '\033[31m✗ %s\033[0m\n' "$1"; }
vert()  { printf '\033[32m✓ %s\033[0m\n' "$1"; }
info()  { printf '  %s\n' "$1"; }

echec() { rouge "$1"; shift; for l in "$@"; do info "$l"; done; exit 1; }

# ── 1. le bon dossier ────────────────────────────────────────────────────────
if [ ! -f capacitor.config.json ] || [ ! -f package.json ]; then
  echec "Ce script doit être lancé depuis le dossier du projet." \
        "" \
        "Vous êtes ici : $(pwd)" \
        "" \
        "Si le projet n'est pas encore sur ce Mac :" \
        "    git clone https://github.com/sabir-art/Examen-civique-naturalisation.git" \
        "    cd Examen-civique-naturalisation" \
        "    git checkout claude/civic-exam-training-platform-794c2u" \
        "" \
        "S'il y est déjà, allez dans son dossier avec « cd », puis relancez."
fi
vert "dossier du projet reconnu"

# ── 2. les outils ────────────────────────────────────────────────────────────
command -v node >/dev/null 2>&1 || echec "Node.js n'est pas installé." \
  "    brew install node        (ou https://nodejs.org)"
vert "Node.js $(node --version)"

xcode-select -p >/dev/null 2>&1 || echec "Les outils Xcode ne sont pas installés." \
  "    xcode-select --install" \
  "Puis ouvrez Xcode une fois, pour qu'il accepte sa licence."
vert "outils Xcode en place"

if ! command -v pod >/dev/null 2>&1; then
  echec "CocoaPods manque : Capacitor s'en sert pour assembler le projet iOS." \
    "    brew install cocoapods" \
    "  (ou : sudo gem install cocoapods)"
fi
vert "CocoaPods $(pod --version 2>/dev/null)"

# ── 3. les dépendances, puis le projet iOS ───────────────────────────────────
info "Installation des dépendances…"
npm install || echec "npm install a échoué. Le message ci-dessus dit pourquoi."
vert "dépendances installées"

if [ ! -d ios ]; then
  info "Création du projet iOS…"
  npx cap add ios || echec "« npx cap add ios » a échoué. Le message ci-dessus dit pourquoi."
  vert "projet iOS créé"
else
  vert "projet iOS déjà présent"
fi

# ── 4. le greffon, puis l'assemblage ─────────────────────────────────────────
cible="ios/App/App"
[ -d "$cible" ] || echec "Le dossier $cible n'existe pas." \
  "Le projet iOS n'a pas été créé complètement. Supprimez le dossier « ios »" \
  "et relancez ce script."
cp native/ios/BarreSystemePlugin.swift "$cible/"
vert "greffon copié dans $cible"

npm run natif:sync || echec "La synchronisation a échoué. Le message ci-dessus dit pourquoi."
vert "application assemblée et recopiée dans le projet iOS"

# ── 5. ce qui reste à faire à la main ────────────────────────────────────────
cat <<'FIN'

Il reste quatre gestes, dans Xcode — ils ne peuvent pas être faits d'ici.

  1. Ouvrir Xcode :            npm run natif:ios
  2. Glisser BarreSystemePlugin.swift depuis le Finder (ios/App/App/) dans le
     navigateur de projet d'Xcode, en cochant la cible « App ».
     Sans ce geste, le fichier est sur le disque mais ne fait pas partie de
     l'application : elle démarrera, avec la barre de la page au lieu de celle
     du système. C'est le piège le plus courant.
  3. Onglet « Signing & Capabilities » : choisir votre équipe. Un compte Apple
     gratuit suffit pour installer sur votre propre iPhone.
  4. Choisir l'iPhone branché en haut de la fenêtre, puis Cmd + R.

FIN
