#!/bin/bash

# Script EAS Build pour tester Microsoft Clarity
# Usage: ./build-eas-clarity.sh

echo "🔥 === EAS Build GearConnect avec Microsoft Clarity ==="

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
        if [[ $key =~ ^(API_HOST|API_PORT|CLARITY_PROJECT_ID|CLERK_PUBLISHABLE_KEY)$ ]]; then
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

# Vérifier que EAS CLI est installé
echo "🔍 Vérification d'EAS CLI..."
if command -v eas &> /dev/null; then
    echo "✅ EAS CLI installé: $(eas --version)"
else
    echo "📦 EAS CLI non installé. Installation..."
    npm install -g @expo/eas-cli
fi

# Se connecter à EAS si nécessaire
echo "🔍 Vérification de la connexion EAS..."
if ! eas whoami &> /dev/null; then
    echo "🔐 Connexion à EAS requise..."
    eas login
fi

echo "👤 Utilisateur EAS: $(eas whoami)"

# Choix du type de build
echo ""
echo "📱 Choisissez le type de build:"
echo "1. Development build (Android APK) - Recommandé pour tester Clarity"
echo "2. Preview build (Android APK) - Version proche de la production"
echo "3. Development Simulator (iOS Simulator)"
read -p "Votre choix (1-3): " choice

case $choice in
    1)
        echo "🚀 Build de développement Android en cours..."
        echo "🔍 Cette version inclura Microsoft Clarity FONCTIONNEL !"
        eas build --profile development --platform android --local
        ;;
    2)
        echo "🚀 Build de preview Android en cours..."
        eas build --profile preview --platform android --local
        ;;
    3)
        echo "🚀 Build de développement iOS Simulator en cours..."
        eas build --profile development-simulator --platform ios --local
        ;;
    *)
        echo "⚠️  Choix invalide. Build de développement Android par défaut..."
        eas build --profile development --platform android --local
        ;;
esac

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 BUILD RÉUSSI avec Microsoft Clarity !"
    echo ""
    echo "📱 INSTRUCTIONS D'INSTALLATION:"
    echo "1. Trouvez le fichier .apk généré dans le dossier actuel"
    echo "2. Transférez-le sur votre appareil Android"
    echo "3. Activez 'Sources inconnues' dans les paramètres Android"
    echo "4. Installez l'APK"
    echo ""
    echo "🔍 TESTING MICROSOFT CLARITY:"
    echo "• Les analytics sont maintenant ACTIFS"
    echo "• Utilisez l'app normalement"
    echo "• Vérifiez les logs : 'Clarity initialized successfully'"
    echo "• Dashboard Clarity: https://clarity.microsoft.com"
    echo "• Projet ID: $(grep CLARITY_PROJECT_ID .env | cut -d'=' -f2)"
    echo ""
    echo "📊 Les données apparaîtront dans 2-4 heures sur le dashboard"
else
    echo "❌ Erreur lors du build"
    echo "Vérifiez les logs ci-dessus pour plus de détails"
fi

echo ""
echo "🔧 Pour plus d'informations, consultez:"
echo "- Documentation EAS: https://docs.expo.dev/build/introduction/"
echo "- Microsoft Clarity: https://clarity.microsoft.com" 