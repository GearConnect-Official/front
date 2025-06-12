# Script pour corriger TOUS les imports FontAwesome incorrects
Write-Host "=== Correction complète des imports FontAwesome ===" -ForegroundColor Cyan

$incorrectImports = 0
$correctedFiles = @()

# Rechercher tous les fichiers TypeScript/JavaScript
$files = Get-ChildItem -Recurse -Path "app" -Include "*.tsx", "*.ts", "*.js", "*.jsx" | Where-Object { $_.Name -notlike "*.test.*" -and $_.Name -notlike "*.spec.*" }

Write-Host "Recherche des imports incorrects..." -ForegroundColor Yellow

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $originalContent = $content
    
    # Vérifier les imports incorrects
    if ($content -match "import.*FontAwesome.*from.*['""]react-native-vector-icons") {
        $incorrectImports++
        Write-Host "  ❌ Import incorrect trouvé dans: $($file.Name)" -ForegroundColor Red
        
        # Remplacer les imports incorrects
        $content = $content -replace "import FontAwesome from ['""]react-native-vector-icons/FontAwesome['""];", "import { FontAwesome } from '@expo/vector-icons';"
        $content = $content -replace "import FontAwesome5 from ['""]react-native-vector-icons/FontAwesome5['""];", "import { FontAwesome5 } from '@expo/vector-icons';"
        $content = $content -replace "import MaterialIcons from ['""]react-native-vector-icons/MaterialIcons['""];", "import { MaterialIcons } from '@expo/vector-icons';"
        $content = $content -replace "import Ionicons from ['""]react-native-vector-icons/Ionicons['""];", "import { Ionicons } from '@expo/vector-icons';"
        
        # Sauvegarder si des changements ont été effectués
        if ($content -ne $originalContent) {
            Set-Content -Path $file.FullName -Value $content -Encoding UTF8
            $correctedFiles += $file.Name
            Write-Host "  ✅ Corrigé: $($file.Name)" -ForegroundColor Green
        }
    }
}

Write-Host "`nRésultats:" -ForegroundColor Cyan
Write-Host "  - Fichiers scannés: $($files.Count)" -ForegroundColor Blue
Write-Host "  - Imports incorrects trouvés: $incorrectImports" -ForegroundColor Yellow
Write-Host "  - Fichiers corrigés: $($correctedFiles.Count)" -ForegroundColor Green

if ($correctedFiles.Count -gt 0) {
    Write-Host "`nFichiers corrigés:" -ForegroundColor Green
    foreach ($file in $correctedFiles) {
        Write-Host "  - $file" -ForegroundColor White
    }
}

if ($incorrectImports -eq 0) {
    Write-Host "✅ Aucun import incorrect trouvé ! Tous les imports FontAwesome utilisent @expo/vector-icons" -ForegroundColor Green
} else {
    Write-Host "`n🔄 Maintenant, rebuilder l'APK pour appliquer les corrections..." -ForegroundColor Yellow
} 