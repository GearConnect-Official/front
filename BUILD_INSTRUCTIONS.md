# Instructions de Build APK - GearConnect

## 📱 APK Généré

✅ **APK Debug disponible :** `GearConnect-debug.apk` (183 MB)

## 🔧 Configuration

L'APK a été buildé avec les variables d'environnement suivantes :

```env
API_PROTOCOL=http
API_HOST=23.88.62.46
API_PORT=9000
CLOUDINARY_CLOUD_NAME=dckomwc3v
CLOUDINARY_API_KEY=682785821394439
CLOUDINARY_API_SECRET=ceeraQVb80Q049oh-XNbk9_lva4
CLOUDINARY_UPLOAD_PRESET=gearconnect_uploads
YOUR_PUBLIC_BUILDER_KEY=243e0ea030374c78ac66c86b0a53d562
```

## 🚀 Installation

1. **Transférer l'APK** sur votre appareil Android
2. **Activer les sources inconnues** dans les paramètres Android
3. **Installer l'APK** en l'ouvrant depuis l'explorateur de fichiers

## 🔄 Rebuild Futur

Pour rebuilder l'APK après modifications :

### Option 1 : Script automatique
```powershell
.\build-apk.ps1
```

### Option 2 : Manuel
```powershell
# 1. Mettre à jour le .env si nécessaire
# 2. Naviguer vers android/
cd android
# 3. Builder l'APK
.\gradlew assembleDebug
# 4. Copier l'APK
Copy-Item "app\build\outputs\apk\debug\app-debug.apk" "..\GearConnect-debug.apk"
```

## 📝 Notes

- **Mode Debug** : Cet APK est en mode debug, optimisé pour le développement
- **Mode Release** : Pour la production, utiliser `.\gradlew assembleRelease` (nécessite signature)
- **Taille** : L'APK debug est plus volumineux que la version release
- **Variables d'environnement** : Automatiquement injectées via `app.config.js`

## ⚠️ Problèmes connus

- **Chemins longs Windows** : Le build release peut échouer à cause des limitations de longueur de chemin sur Windows
- **React Native Reanimated** : Peut causer des problèmes sur certaines configurations Windows

## 🔍 Vérification

L'APK contient les bonnes configurations API :
- Serveur: `http://23.88.62.46:9000`
- Toutes les clés Cloudinary configurées
- Variables d'environnement injectées au build time 