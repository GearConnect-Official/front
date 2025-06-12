# Script EAS Build pour tester Microsoft Clarity
# Usage: .\build-eas-clarity.ps1

Write-Host "=== EAS Build GearConnect avec Microsoft Clarity ===" -ForegroundColor Cyan

# Vérifier que nous sommes dans le bon répertoire
if (!(Test-Path "package.json")) {
    Write-Host "Erreur: Ce script doit être exécuté depuis la racine du projet GearConnect" -ForegroundColor Red
    exit 1
}

# Vérifier les variables d'environnement
Write-Host "Vérification des variables d'environnement..." -ForegroundColor Yellow
if (Test-Path ".env") {
    Write-Host "Fichier .env trouvé" -ForegroundColor Green
    Get-Content .env | ForEach-Object { 
        if ($_ -match "^(API_HOST|API_PORT|CLARITY_PROJECT_ID|CLERK_PUBLISHABLE_KEY)=(.+)$") {
            if ($matches[1] -eq "CLARITY_PROJECT_ID") {
                Write-Host "   $($matches[1]) = $($matches[2]) ✅ MICROSOFT CLARITY" -ForegroundColor Magenta
            } else {
                Write-Host "   $($matches[1]) = $($matches[2])" -ForegroundColor Blue
            }
        }
    }
} else {
    Write-Host "Fichier .env non trouvé" -ForegroundColor Red
    exit 1
}

# Vérifier que EAS CLI est installé
Write-Host "Vérification d'EAS CLI..." -ForegroundColor Yellow
$easVersion = eas --version 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "EAS CLI installé: $easVersion" -ForegroundColor Green
} else {
    Write-Host "EAS CLI non installé. Installation..." -ForegroundColor Yellow
    npm install -g @expo/eas-cli
}

# Se connecter à EAS si nécessaire
Write-Host "Vérification de la connexion EAS..." -ForegroundColor Yellow
$easWhoami = eas whoami 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Connexion à EAS requise..." -ForegroundColor Yellow
    eas login
}

Write-Host "Utilisateur EAS: $easWhoami" -ForegroundColor Green

# Choix du type de build
Write-Host ""
Write-Host "Choisissez le type de build:" -ForegroundColor Cyan
Write-Host "1. Development build (Android APK) - Recommandé pour tester Clarity" -ForegroundColor Yellow
Write-Host "2. Preview build (Android APK) - Version proche de la production" -ForegroundColor Yellow
Write-Host "3. Development Simulator (iOS Simulator)" -ForegroundColor Yellow
$choice = Read-Host "Votre choix (1-3)"

switch ($choice) {
    "1" {
        Write-Host "Build de développement Android en cours..." -ForegroundColor Green
        Write-Host "🔍 Cette version inclura Microsoft Clarity FONCTIONNEL !" -ForegroundColor Magenta
        eas build --profile development --platform android --local
    }
    "2" {
        Write-Host "Build de preview Android en cours..." -ForegroundColor Green
        eas build --profile preview --platform android --local
    }
    "3" {
        Write-Host "Build de développement iOS Simulator en cours..." -ForegroundColor Green
        eas build --profile development-simulator --platform ios --local
    }
    default {
        Write-Host "Choix invalide. Build de développement Android par défaut..." -ForegroundColor Yellow
        eas build --profile development --platform android --local
    }
}

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "🎉 BUILD RÉUSSI avec Microsoft Clarity !" -ForegroundColor Green
    Write-Host ""
    Write-Host "📱 INSTRUCTIONS D'INSTALLATION:" -ForegroundColor Cyan
    Write-Host "1. Trouvez le fichier .apk généré dans le dossier actuel" -ForegroundColor White
    Write-Host "2. Transférez-le sur votre appareil Android" -ForegroundColor White
    Write-Host "3. Activez 'Sources inconnues' dans les paramètres Android" -ForegroundColor White
    Write-Host "4. Installez l'APK" -ForegroundColor White
    Write-Host ""
    Write-Host "🔍 TESTING MICROSOFT CLARITY:" -ForegroundColor Magenta
    Write-Host "• Les analytics sont maintenant ACTIFS" -ForegroundColor Green
    Write-Host "• Utilisez l'app normalement" -ForegroundColor White
    Write-Host "• Vérifiez les logs : 'Clarity initialized successfully'" -ForegroundColor White
    Write-Host "• Dashboard Clarity: https://clarity.microsoft.com" -ForegroundColor Blue
    Write-Host "• Projet ID: $(Get-Content .env | Select-String 'CLARITY_PROJECT_ID' | ForEach-Object { $_.ToString().Split('=')[1] })" -ForegroundColor Blue
    Write-Host ""
    Write-Host "📊 Les données apparaîtront dans 2-4 heures sur le dashboard" -ForegroundColor Yellow
} else {
    Write-Host "❌ Erreur lors du build" -ForegroundColor Red
    Write-Host "Vérifiez les logs ci-dessus pour plus de détails" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🔧 Pour plus d'informations, consultez:" -ForegroundColor Cyan
Write-Host "- ANALYTICS_IMPLEMENTATION.md" -ForegroundColor Blue
Write-Host "- https://docs.expo.dev/build/introduction/" -ForegroundColor Blue 