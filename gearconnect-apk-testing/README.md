# 🚀 GearConnect APK Testing Kit

Ce dossier contient tout le nécessaire pour installer et tester l'application GearConnect sur votre appareil Android dans un environnement de test dédié.

## 📁 Structure du dossier

```
gearconnect-apk-testing/
├── apks/           # Fichiers APK de l'application à tester
├── tools/          # Outils nécessaires (bundletool, keystores)
├── logs/           # Logs de l'application (générés automatiquement)
├── scripts/        # Scripts d'installation et de gestion
└── README.md       # Ce fichier
```

## 🌿 Usage avec Git/Branches

Ce dossier est conçu pour être utilisé sur différentes branches de test :

```bash
# Créer une branche de test
git checkout -b test/apk-debugging

# Committer le dossier de test
git add gearconnect-apk-testing/
git commit -m "Add APK testing environment"

# Utiliser sur différentes branches
git checkout feature/new-feature
git merge test/apk-debugging
```

## 🔧 Prérequis

### 1. Android Debug Bridge (ADB)
- **Avec Android Studio** : ADB est inclus automatiquement
- **Sans Android Studio** : Téléchargez [Platform Tools](https://developer.android.com/studio/releases/platform-tools)
- **Test** : Ouvrez un terminal et tapez `adb version`

### 2. Appareil Android préparé
1. **Activez le mode développeur** :
   - Allez dans `Paramètres > À propos du téléphone`
   - Tapez 7 fois sur `Numéro de build`
   
2. **Activez le débogage USB** :
   - Allez dans `Paramètres > Options de développement`
   - Activez `Débogage USB`
   
3. **Connectez votre appareil** en USB à votre Mac

## 🚀 Installation et lancement automatique

### Méthode simple (Recommandée)

```bash
# Se placer dans le dossier de test
cd gearconnect-apk-testing

# Rendre le script exécutable
chmod +x scripts/install_and_run.sh

# Lancer l'installation automatique
./scripts/install_and_run.sh
```

### Options du script

```bash
# Afficher l'aide
./scripts/install_and_run.sh --help

# Lister les APKs disponibles
./scripts/install_and_run.sh --list

# Voir les derniers logs
./scripts/install_and_run.sh --logs
```

## 📱 Que fait le script automatique ?

1. ✅ **Vérifie** que ADB est installé
2. ✅ **Détecte** votre appareil Android connecté
3. ✅ **Liste** les APKs disponibles et vous laisse choisir
4. ✅ **Désinstalle** l'ancienne version (si présente)
5. ✅ **Installe** la nouvelle version
6. ✅ **Démarre la capture de logs** en arrière-plan
7. ✅ **Lance l'application** automatiquement
8. ✅ **Affiche les logs en temps réel** pour débugger
9. ✅ **Sauvegarde tous les logs** dans `logs/`

## 🔍 Débogage des crashs

### Si l'app crash au démarrage :

1. **Les logs sont automatiquement capturés** dans `logs/gearconnect_YYYYMMDD_HHMMSS.log`
2. **Regardez les erreurs** avec : `./scripts/install_and_run.sh --logs`
3. **Recherchez les mots-clés** : `FATAL`, `ERROR`, `Exception`

### Logs spécifiques :

```bash
# Logs en temps réel pendant que l'app tourne
tail -f logs/gearconnect_*.log

# Rechercher les erreurs
grep -i "error\|fatal\|exception" logs/gearconnect_*.log

# Logs complets (attention, très verbeux)
adb logcat
```

## 🛠️ Installation manuelle (si le script ne fonctionne pas)

```bash
# 1. Vérifier que l'appareil est connecté
adb devices

# 2. Désinstaller l'ancienne version
adb uninstall com.gearconnect.app

# 3. Installer l'APK (remplacez par le nom de votre APK)
adb install apks/GearConnect_Debug.apk

# 4. Lancer l'app
adb shell monkey -p com.gearconnect.app -c android.intent.category.LAUNCHER 1

# 5. Capturer les logs
adb logcat | grep -i "gearconnect"
```

## 📊 APKs à tester

Placez vos APKs dans le dossier `apks/` :
- **GearConnect.apk** : Version de production
- **GearConnect_Debug.apk** : Version avec signature de debug (recommandée pour les tests)
- **GearConnect_S24.apk** : Version optimisée pour Samsung S24

## 🔧 Outils inclus

- **bundletool-all-1.18.1.jar** : Pour convertir AAB en APK
- **debug.keystore** : Keystore de debug pour signer les APKs

## 🧪 Workflow de test recommandé

```bash
# 1. Générer un nouvel APK
eas build --platform android --profile preview

# 2. Télécharger et placer l'APK
cp ~/Downloads/build-xxx.apk gearconnect-apk-testing/apks/GearConnect_Test.apk

# 3. Tester l'installation
cd gearconnect-apk-testing
./scripts/install_and_run.sh

# 4. Analyser les logs si crash
./scripts/install_and_run.sh --logs

# 5. Committer les logs pour la branche
git add logs/
git commit -m "Add test logs for build xxx"
```

## ❓ Résolution des problèmes

### "ADB not found"
```bash
# Sur Mac avec Homebrew
brew install android-platform-tools

# Ou ajoutez au PATH
export PATH=$PATH:$HOME/Library/Android/sdk/platform-tools
```

### "No devices found"
1. Vérifiez que le câble USB fonctionne
2. Autorisez le débogage USB sur votre téléphone
3. Essayez un autre port USB

### "Installation failed"
1. Activez "Sources inconnues" dans les paramètres Android
2. Libérez de l'espace de stockage
3. Essayez l'APK debug : `GearConnect_Debug.apk`

### L'app crash immédiatement
1. Regardez les logs : `./scripts/install_and_run.sh --logs`
2. Vérifiez que votre appareil supporte l'architecture ARM64
3. Essayez l'APK optimisé pour votre modèle

## 📞 Support

Si vous rencontrez des problèmes :
1. Exécutez : `./scripts/install_and_run.sh --logs`
2. Copiez les logs d'erreur
3. Partagez-les pour obtenir de l'aide

---

**🎯 TL;DR : Connectez votre Android en USB, puis exécutez `./scripts/install_and_run.sh`** 