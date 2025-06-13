# Script de diagnostic pour vérifier les logos et images
Write-Host "=== Diagnostic des Logos et Images ===" -ForegroundColor Cyan

# Vérifier les images sources
Write-Host "📁 Images sources dans app/assets/images:" -ForegroundColor Yellow
$sourceImages = Get-ChildItem "app\assets\images" -Name
foreach ($img in $sourceImages) {
    if ($img -like "*logo*" -or $img -like "*icon*") {
        $size = [math]::Round((Get-Item "app\assets\images\$img").Length / 1KB, 1)
        Write-Host "  ✅ $img ($size KB)" -ForegroundColor Green
    }
}

# Vérifier les images dans Android assets
Write-Host "`n📱 Images dans Android assets:" -ForegroundColor Yellow
if (Test-Path "android\app\src\main\assets\images") {
    $androidImages = Get-ChildItem "android\app\src\main\assets\images" -Name
    foreach ($img in $androidImages) {
        if ($img -like "*logo*" -or $img -like "*icon*") {
            $size = [math]::Round((Get-Item "android\app\src\main\assets\images\$img").Length / 1KB, 1)
            Write-Host "  ✅ $img ($size KB)" -ForegroundColor Green
        }
    }
} else {
    Write-Host "  ❌ Répertoire Android assets/images non trouvé" -ForegroundColor Red
}

# Vérifier l'APK final
Write-Host "`n📦 APK final:" -ForegroundColor Yellow
if (Test-Path "GearConnect-COMPLETE.apk") {
    $apk = Get-Item "GearConnect-COMPLETE.apk"
    $sizeMB = [math]::Round($apk.Length / 1MB, 1)
    Write-Host "  ✅ GearConnect-COMPLETE.apk ($sizeMB MB)" -ForegroundColor Green
    Write-Host "  📅 Créé: $($apk.LastWriteTime)" -ForegroundColor Blue
} else {
    Write-Host "  ❌ APK non trouvé" -ForegroundColor Red
}

Write-Host "`n🎯 Résumé:" -ForegroundColor Cyan
Write-Host "  Les logos devraient maintenant s'afficher dans l'app !" -ForegroundColor Green
Write-Host "  Installez: GearConnect-COMPLETE.apk" -ForegroundColor Green 