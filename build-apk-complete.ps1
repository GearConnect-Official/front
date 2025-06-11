# Script de build APK complet pour GearConnect
# Inclut la generation du bundle JavaScript
# Utilisation: .\build-apk-complete.ps1

Write-Host "=== Build APK GearConnect Complet ===" -ForegroundColor Cyan

# Verifier que nous sommes dans le bon repertoire
if (!(Test-Path "package.json")) {
    Write-Host "Erreur: Ce script doit etre execute depuis la racine du projet GearConnect" -ForegroundColor Red
    exit 1
}

Write-Host "Verification des variables d'environnement..." -ForegroundColor Yellow
if (Test-Path ".env") {
    Write-Host "Fichier .env trouve" -ForegroundColor Green
    Get-Content .env | ForEach-Object { 
        if ($_ -match "^(API_HOST|API_PORT|API_PROTOCOL|CLERK_PUBLISHABLE_KEY)=(.+)$") {
            Write-Host "   $($matches[1]) = $($matches[2])" -ForegroundColor Blue
        }
    }
} else {
    Write-Host "Fichier .env non trouve" -ForegroundColor Red
    exit 1
}

Write-Host "Generation du bundle JavaScript..." -ForegroundColor Yellow
npx expo export --platform android
if ($LASTEXITCODE -ne 0) {
    Write-Host "Erreur lors de la generation du bundle" -ForegroundColor Red
    exit 1
}

Write-Host "Preparation du projet Android..." -ForegroundColor Yellow
if (!(Test-Path "android")) {
    Write-Host "Generation du projet Android natif..." -ForegroundColor Yellow
    npx expo prebuild --platform android
}

Write-Host "Copie du bundle JavaScript vers Android..." -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path "android\app\src\main\assets" | Out-Null

# Trouver le fichier bundle genere
$bundleFile = Get-ChildItem "dist\_expo\static\js\android\*.hbc" | Select-Object -First 1
if ($bundleFile) {
    Copy-Item $bundleFile.FullName "android\app\src\main\assets\index.android.bundle" -Force
    Write-Host "Bundle copie: $($bundleFile.Name)" -ForegroundColor Green
} else {
    Write-Host "Erreur: Bundle JavaScript non trouve" -ForegroundColor Red
    exit 1
}

Write-Host "Copie des assets vers Android..." -ForegroundColor Yellow
if (Test-Path "dist\assets") {
    Copy-Item "dist\assets\*" "android\app\src\main\assets\" -Recurse -Force
}
Write-Host "Copie des images d'assets locales..." -ForegroundColor Yellow
Copy-Item -Recurse -Force "app\assets\images" "android\app\src\main\assets\"
Write-Host "Assets copies avec succes" -ForegroundColor Green

Write-Host "Build de l'APK en cours..." -ForegroundColor Yellow
Set-Location android
& .\gradlew assembleDebug

if ($LASTEXITCODE -eq 0) {
    Write-Host "Build reussi !" -ForegroundColor Green
    
    # Copier l'APK vers la racine
    $apkSource = "app\build\outputs\apk\debug\app-debug.apk"
    $apkDest = "..\GearConnect-COMPLETE.apk"
    
    if (Test-Path $apkSource) {
        Copy-Item $apkSource $apkDest -Force
        Write-Host "APK copie vers: GearConnect-COMPLETE.apk" -ForegroundColor Green
        
        $apkInfo = Get-Item $apkDest
        Write-Host "Taille: $([math]::Round($apkInfo.Length / 1MB, 1)) MB" -ForegroundColor Blue
        Write-Host "Date: $($apkInfo.LastWriteTime)" -ForegroundColor Blue
        
        Write-Host "" -ForegroundColor White
        Write-Host "APK COMPLET genere avec succes !" -ForegroundColor Green
        Write-Host "- Bundle JavaScript: Inclus" -ForegroundColor Green
        Write-Host "- Assets: Inclus" -ForegroundColor Green  
        Write-Host "- Configuration: API_HOST=$env:API_HOST" -ForegroundColor Green
        Write-Host "- Clerk: Configure" -ForegroundColor Green
    }
} else {
    Write-Host "Erreur lors du build" -ForegroundColor Red
    exit 1
}

Set-Location ..
Write-Host "Votre APK est pret a etre installe: GearConnect-COMPLETE.apk" -ForegroundColor Cyan 