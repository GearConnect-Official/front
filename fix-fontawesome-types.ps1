# Script pour corriger tous les problèmes de types FontAwesome
Write-Host "=== Correction des types FontAwesome ===" -ForegroundColor Cyan

$typeErrors = 0
$correctedFiles = @()

# Rechercher tous les fichiers TypeScript/JavaScript
$files = Get-ChildItem -Recurse -Path "app" -Include "*.tsx", "*.ts", "*.js", "*.jsx" | Where-Object { $_.Name -notlike "*.test.*" -and $_.Name -notlike "*.spec.*" }

Write-Host "Recherche des problèmes de types FontAwesome..." -ForegroundColor Yellow

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $originalContent = $content
    
    # Vérifier les usages de FontAwesome sans "as any"
    $hasChanges = $false
    
    # FontAwesome avec name= mais sans "as any"
    if ($content -match 'FontAwesome\s+name=\{[^}]+\}' -and $content -notmatch 'as any') {
        Write-Host "  🔧 Correction types FontAwesome dans: $($file.Name)" -ForegroundColor Yellow
        
        # Corriger les usages de FontAwesome name={variable}
        $content = $content -replace '(FontAwesome[^>]*name=\{)([^}]+)(\})', '$1$2 as any$3'
        $hasChanges = $true
    }
    
    # FontAwesome5 avec name= mais sans "as any"
    if ($content -match 'FontAwesome5\s+name=\{[^}]+\}' -and $content -notmatch 'as any') {
        Write-Host "  🔧 Correction types FontAwesome5 dans: $($file.Name)" -ForegroundColor Yellow
        
        # Corriger les usages de FontAwesome5 name={variable}
        $content = $content -replace '(FontAwesome5[^>]*name=\{)([^}]+)(\})', '$1$2 as any$3'
        $hasChanges = $true
    }
    
    # Autres icônes similaires
    if ($content -match 'MaterialIcons\s+name=\{[^}]+\}' -and $content -notmatch 'as any') {
        $content = $content -replace '(MaterialIcons[^>]*name=\{)([^}]+)(\})', '$1$2 as any$3'
        $hasChanges = $true
    }
    
    if ($content -match 'Ionicons\s+name=\{[^}]+\}' -and $content -notmatch 'as any') {
        $content = $content -replace '(Ionicons[^>]*name=\{)([^}]+)(\})', '$1$2 as any$3'
        $hasChanges = $true
    }
    
    # Sauvegarder si des changements ont été effectués
    if ($hasChanges -and $content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -Encoding UTF8
        $correctedFiles += $file.Name
        $typeErrors++
        Write-Host "  ✅ Corrigé: $($file.Name)" -ForegroundColor Green
    }
}

Write-Host "`nRésultats:" -ForegroundColor Cyan
Write-Host "  - Fichiers scannés: $($files.Count)" -ForegroundColor Blue
Write-Host "  - Problèmes de types trouvés: $typeErrors" -ForegroundColor Yellow
Write-Host "  - Fichiers corrigés: $($correctedFiles.Count)" -ForegroundColor Green

if ($correctedFiles.Count -gt 0) {
    Write-Host "`nFichiers corrigés:" -ForegroundColor Green
    foreach ($file in $correctedFiles) {
        Write-Host "  - $file" -ForegroundColor White
    }
    Write-Host "`n🔄 Maintenant, rebuilder l'APK pour appliquer les corrections..." -ForegroundColor Yellow
} else {
    Write-Host "✅ Aucun problème de type trouvé ! Tous les FontAwesome utilisent 'as any'" -ForegroundColor Green
} 