# Script pour corriger les imports d'icônes et rebuilder l'APK
Write-Host "=== Correction des imports d'icônes ===" -ForegroundColor Cyan

Write-Host "Correction des imports FontAwesome..." -ForegroundColor Yellow
# Remplacer tous les imports react-native-vector-icons par @expo/vector-icons
$files = Get-ChildItem -Recurse -Path "app\src" -Filter "*.tsx" -Include "*.ts", "*.tsx", "*.js", "*.jsx"

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $originalContent = $content
    
    # Remplacer les imports FontAwesome
    $content = $content -replace 'import FontAwesome from "react-native-vector-icons/FontAwesome"', 'import { FontAwesome } from "@expo/vector-icons"'
    $content = $content -replace 'import FontAwesome5 from "react-native-vector-icons/FontAwesome5"', 'import { FontAwesome5 } from "@expo/vector-icons"'
    $content = $content -replace 'import MaterialIcons from "react-native-vector-icons/MaterialIcons"', 'import { MaterialIcons } from "@expo/vector-icons"'
    $content = $content -replace 'import Ionicons from "react-native-vector-icons/Ionicons"', 'import { Ionicons } from "@expo/vector-icons"'
    
    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content
        Write-Host "  ✅ Corrigé: $($file.Name)" -ForegroundColor Green
    }
}

Write-Host "Suppression de la dépendance react-native-vector-icons..." -ForegroundColor Yellow
npm uninstall react-native-vector-icons

Write-Host "Rebuild de l'APK avec les icônes corrigées..." -ForegroundColor Yellow
.\build-apk-complete.ps1

Write-Host "=== Correction terminée ===" -ForegroundColor Green
Write-Host "L'APK avec les icônes corrigées est prêt !" -ForegroundColor Cyan 