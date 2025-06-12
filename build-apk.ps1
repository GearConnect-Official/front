#!/usr/bin/env powershell

# Script de build APK pour GearConnect
# Utilisation: .\build-apk.ps1

Write-Host "=== Build APK GearConnect ===" -ForegroundColor Cyan

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

Write-Host "Preparation du projet Android..." -ForegroundColor Yellow
if (!(Test-Path "android")) {
    Write-Host "Generation du projet Android natif..." -ForegroundColor Yellow
    npx expo prebuild --platform android
}

Write-Host "Build de l'APK en cours..." -ForegroundColor Yellow
Set-Location android
& .\gradlew assembleDebug

if ($LASTEXITCODE -eq 0) {
    Write-Host "Build reussi !" -ForegroundColor Green
    
    # Copier l'APK vers la racine
    $apkSource = "app\build\outputs\apk\debug\app-debug.apk"
    $apkDest = "..\GearConnect-debug-fixed.apk"
    
    if (Test-Path $apkSource) {
        Copy-Item $apkSource $apkDest -Force
        Write-Host "APK copie vers: GearConnect-debug-fixed.apk" -ForegroundColor Green
        
        $apkInfo = Get-Item $apkDest
        Write-Host "Taille: $([math]::Round($apkInfo.Length / 1MB, 1)) MB" -ForegroundColor Blue
        Write-Host "Date: $($apkInfo.LastWriteTime)" -ForegroundColor Blue
    }
} else {
    Write-Host "Erreur lors du build" -ForegroundColor Red
    exit 1
}

Set-Location ..
Write-Host "Build termine avec succes !" -ForegroundColor Green
Write-Host "Votre APK est pret a etre installe: GearConnect-debug-fixed.apk" -ForegroundColor Cyan 