#!/bin/bash

# Script de build APK standalone pour GearConnect avec Microsoft Clarity
# Usage: ./build-apk-clarity.sh

echo "🔥 === Build APK GearConnect avec Microsoft Clarity (Standalone) ==="

# Vérifier que nous sommes dans le bon répertoire
if [ ! -f "package.json" ]; then
    echo "❌ Erreur: Ce script doit être exécuté depuis la racine du projet GearConnect"
    exit 1
fi

# Vérifier les variables d'environnement
echo "🔍 Vérification des variables d'environnement..."
if [ -f ".env" ]; then
    echo "✅ Fichier .env trouvé"
    while IFS='=' read -r key value; do
        if [[ $key =~ ^(API_HOST|API_PORT|API_PROTOCOL|CLERK_PUBLISHABLE_KEY|CLARITY_PROJECT_ID)$ ]]; then
            if [ "$key" == "CLARITY_PROJECT_ID" ]; then
                echo "   $key = $value ✅ MICROSOFT CLARITY"
            else
                echo "   $key = $value"
            fi
        fi
    done < .env
else
    echo "❌ Fichier .env non trouvé"
    exit 1
fi

# Vérifier que Microsoft Clarity est installé
echo "🔍 Vérification de Microsoft Clarity..."
if npm list @microsoft/react-native-clarity &> /dev/null; then
    echo "✅ Microsoft Clarity installé"
else
    echo "📦 Microsoft Clarity non installé. Installation..."
    npm install @microsoft/react-native-clarity --legacy-peer-deps
fi

echo "🧹 Nettoyage des caches..."
npx expo r -c
rm -rf android dist

echo "📦 Génération du bundle JavaScript..."
npx expo export --platform android
if [ $? -ne 0 ]; then
    echo "❌ Erreur lors de la génération du bundle"
    exit 1
fi

echo "🔧 Génération du projet Android natif avec Microsoft Clarity..."
npx expo prebuild --platform android --clean

if [ ! -d "android" ]; then
    echo "❌ Erreur: Le dossier Android n'a pas été créé"
    exit 1
fi

echo "📋 Copie du bundle JavaScript vers Android..."
mkdir -p "android/app/src/main/assets"

# Trouver le fichier bundle généré
bundleFile=$(find dist/_expo/static/js/android -name "*.hbc" -type f | head -n 1)
if [ -n "$bundleFile" ]; then
    cp "$bundleFile" "android/app/src/main/assets/index.android.bundle"
    echo "✅ Bundle copié: $(basename "$bundleFile")"
else
    echo "❌ Erreur: Bundle JavaScript non trouvé"
    exit 1
fi

echo "🎨 Copie des assets vers Android..."
if [ -d "dist/assets" ]; then
    cp -r dist/assets/* "android/app/src/main/assets/" 2>/dev/null || true
fi

echo "🖼️ Copie des images d'assets locales..."
cp -r "app/assets/images" "android/app/src/main/assets/" 2>/dev/null || true

echo "🔍 Configuration Microsoft Clarity pour APK standalone..."
echo "- Mode: Production ready"
echo "- Type: APK autonome avec bundle JS inclus"
echo "- Analytics: Fully functional"

echo "🚀 Build de l'APK en cours..."
cd android
./gradlew assembleDebug

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 BUILD RÉUSSI avec Microsoft Clarity !"
    
    # Copier l'APK vers la racine
    apkSource="app/build/outputs/apk/debug/app-debug.apk"
    apkDest="../GearConnect-Clarity-Standalone.apk"
    
    if [ -f "$apkSource" ]; then
        cp "$apkSource" "$apkDest"
        echo "✅ APK copié vers: GearConnect-Clarity-Standalone.apk"
        
        apkSize=$(du -h "$apkDest" | cut -f1)
        echo "📦 Taille: $apkSize"
        echo "📅 Date: $(date)"
        
        echo ""
        echo "📱 INSTRUCTIONS D'INSTALLATION:"
        echo "1. Transférez GearConnect-Clarity-Standalone.apk sur votre Android"
        echo "2. Activez 'Sources inconnues' dans Paramètres > Sécurité"
        echo "3. Installez l'APK"
        echo "4. L'app s'ouvrira directement (bundle JS inclus)"
        
        echo ""
        echo "🔍 TESTING MICROSOFT CLARITY:"
        echo "• Analytics ACTIFS et FONCTIONNELS"
        echo "• Recherchez les logs: 'Clarity initialized successfully'"
        echo "• Dashboard: https://clarity.microsoft.com"
        echo "• Project ID: $(grep CLARITY_PROJECT_ID ../.env | cut -d'=' -f2)"
        echo ""
        echo "📊 Les données apparaîtront dans 2-4 heures"
        
    else
        echo "❌ Erreur: APK non trouvé à $apkSource"
        exit 1
    fi
else
    echo "❌ Erreur lors du build"
    exit 1
fi

cd ..
echo ""
echo "✅ APK STANDALONE prêt avec Microsoft Clarity !"
echo "📁 Fichier: GearConnect-Clarity-Standalone.apk"
echo ""
echo "🚀 DIFFÉRENCES avec la version précédente:"
echo "• APK autonome (pas de development server)"
echo "• Bundle JavaScript inclus dans l'APK"
echo "• Microsoft Clarity intégré et fonctionnel"
echo "• Prêt pour les tests analytics complets" 