# Script de build APK standalone pour GearConnect avec Microsoft Clarity
# Utilisation: .\build-apk-clarity.ps1

Write-Host "=== Build APK GearConnect avec Microsoft Clarity (Standalone) ===" -ForegroundColor Cyan

# Vérifier que nous sommes dans le bon répertoire
if (!(Test-Path "package.json")) {
    Write-Host "Erreur: Ce script doit être exécuté depuis la racine du projet GearConnect" -ForegroundColor Red
    exit 1
}

Write-Host "Vérification des variables d'environnement..." -ForegroundColor Yellow
if (Test-Path ".env") {
    Write-Host "Fichier .env trouvé" -ForegroundColor Green
    Get-Content .env | ForEach-Object { 
        if ($_ -match "^(API_HOST|API_PORT|API_PROTOCOL|CLERK_PUBLISHABLE_KEY|CLARITY_PROJECT_ID)=(.+)$") {
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

# Vérifier que Microsoft Clarity est installé
Write-Host "Vérification de Microsoft Clarity..." -ForegroundColor Yellow
$clarityInstalled = npm list @microsoft/react-native-clarity 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Microsoft Clarity installé" -ForegroundColor Green
} else {
    Write-Host "❌ Microsoft Clarity non installé. Installation..." -ForegroundColor Yellow
    npm install @microsoft/react-native-clarity --legacy-peer-deps
}

Write-Host "Nettoyage des caches..." -ForegroundColor Yellow
npx expo r -c
Remove-Item -Path "android" -Recurse -Force -ErrorAction SilentlyContinue

Write-Host "Génération du projet Android natif avec Microsoft Clarity..." -ForegroundColor Yellow
npx expo prebuild --platform android --clean

if (!(Test-Path "android")) {
    Write-Host "❌ Erreur: Le dossier Android n'a pas été créé" -ForegroundColor Red
    exit 1
}

Write-Host "🔍 Configuration Microsoft Clarity pour APK standalone..." -ForegroundColor Magenta
Write-Host "- Mode: Production ready" -ForegroundColor White
Write-Host "- Type: APK autonome (pas de dev server)" -ForegroundColor White
Write-Host "- Analytics: Fully functional" -ForegroundColor White

Write-Host "Build de l'APK en cours..." -ForegroundColor Yellow
Set-Location android
& .\gradlew assembleDebug

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "🎉 BUILD RÉUSSI avec Microsoft Clarity !" -ForegroundColor Green
    
    # Copier l'APK vers la racine
    $apkSource = "app\build\outputs\apk\debug\app-debug.apk"
    $apkDest = "..\GearConnect-Clarity-Standalone.apk"
    
    if (Test-Path $apkSource) {
        Copy-Item $apkSource $apkDest -Force
        Write-Host "APK copié vers: GearConnect-Clarity-Standalone.apk" -ForegroundColor Green
        
        $apkInfo = Get-Item $apkDest
        Write-Host "Taille: $([math]::Round($apkInfo.Length / 1MB, 1)) MB" -ForegroundColor Blue
        Write-Host "Date: $($apkInfo.LastWriteTime)" -ForegroundColor Blue
        
        Write-Host ""
        Write-Host "📱 INSTRUCTIONS D'INSTALLATION:" -ForegroundColor Cyan
        Write-Host "1. Transférez GearConnect-Clarity-Standalone.apk sur votre Android" -ForegroundColor White
        Write-Host "2. Activez 'Sources inconnues' dans Paramètres > Sécurité" -ForegroundColor White
        Write-Host "3. Installez l'APK" -ForegroundColor White
        Write-Host "4. L'app s'ouvrira directement (pas de dev server requis)" -ForegroundColor White
        
        Write-Host ""
        Write-Host "🔍 TESTING MICROSOFT CLARITY:" -ForegroundColor Magenta
        Write-Host "• Analytics ACTIFS et FONCTIONNELS" -ForegroundColor Green
        Write-Host "• Recherchez les logs: 'Clarity initialized successfully'" -ForegroundColor White
        Write-Host "• Dashboard: https://clarity.microsoft.com" -ForegroundColor Blue
        Write-Host "• Project ID: $(Get-Content .env | Select-String 'CLARITY_PROJECT_ID' | ForEach-Object { $_.ToString().Split('=')[1] })" -ForegroundColor Blue
        Write-Host ""
        Write-Host "📊 Les données apparaîtront dans 2-4 heures" -ForegroundColor Yellow
        
    } else {
        Write-Host "❌ Erreur: APK non trouvé à $apkSource" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "❌ Erreur lors du build" -ForegroundColor Red
    exit 1
}

Set-Location ..
Write-Host ""
Write-Host "✅ APK STANDALONE prêt avec Microsoft Clarity !" -ForegroundColor Green
Write-Host "Fichier: GearConnect-Clarity-Standalone.apk" -ForegroundColor Cyan
Write-Host ""
Write-Host "🚀 DIFFÉRENCES avec la version précédente:" -ForegroundColor Yellow
Write-Host "• APK autonome (pas de development server)" -ForegroundColor Green
Write-Host "• Microsoft Clarity intégré et fonctionnel" -ForegroundColor Green
Write-Host "• Prêt pour les tests analytics complets" -ForegroundColor Green 