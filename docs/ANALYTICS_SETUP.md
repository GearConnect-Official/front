# Microsoft Clarity - Guide de Configuration

## 🚨 Important : Expo Go vs EAS Build

Microsoft Clarity nécessite du **code natif** et ne fonctionne **PAS** avec Expo Go. Voici vos options :

## 🛠️ Options de Développement

### 1. **Expo Go (Développement Rapide)** ✅ Recommandé pour le développement
- ✅ **Avantage** : Démarrage rapide, hot reload
- ❌ **Limitation** : Clarity désactivé (mode fallback)
- 📊 **Analytics** : Logs dans la console uniquement

```bash
npm start
# ou
expo start
```

### 2. **Development Build (Test Complet)** ✅ Recommandé pour tester Clarity
- ✅ **Avantage** : Clarity fonctionne complètement
- ⏱️ **Inconvénient** : Build plus long
- 📊 **Analytics** : Données réelles envoyées à Microsoft

```bash
# 1. Installer EAS CLI
npm install -g @expo/eas-cli

# 2. Créer un build de développement
eas build --profile development --platform android
# ou pour iOS
eas build --profile development --platform ios

# 3. Installer le build sur votre appareil et tester
```

## 🔧 Configuration Actuelle

Le service analytics est configuré pour **fonctionner dans les deux modes** :

### Mode Expo Go (Fallback)
```typescript
// Logs dans la console :
🔍 [Analytics] Running in Expo Go - Analytics disabled
🔍 [Analytics] Event logged (fallback): profile_view { ... }
```

### Mode Production/Development Build
```typescript
// Clarity fonctionnel :
✅ [Analytics] Clarity initialized successfully
🔍 [Analytics] Profile view tracked: { ... }
```

## 📋 Variables d'Environnement

Ajoutez dans votre fichier `.env` :

```env
# Microsoft Clarity Project ID
CLARITY_PROJECT_ID=rwv1aa0ok8

# Autres variables existantes...
API_HOST=your_api_host
API_PORT=3000
# etc...
```

## 🧪 Comment Tester

### En Développement (Expo Go)
1. **Lancez l'app** : `npm start`
2. **Vérifiez les logs** : Recherchez `🔍 [Analytics]`
3. **Mode fallback actif** : Les événements sont loggés dans la console

```typescript
// Vérifier le statut
import analyticsService from './src/services/AnalyticsService';

const status = analyticsService.getAnalyticsStatus();
console.log('Analytics Status:', status);
// Output: { isAvailable: false, environment: 'expo-go', ... }
```

### En Production (Development Build)
1. **Créez un build** : `eas build --profile development`
2. **Installez sur appareil** : Téléchargez et installez l'APK/IPA
3. **Analytics réels** : Les données sont envoyées à Microsoft Clarity

```typescript
// Status en production
// Output: { isAvailable: true, environment: 'development', ... }
```

## 📊 Vérification des Données

### Logs Console (Expo Go)
Tous les événements analytics apparaissent dans la console :
```
🔍 [Analytics] Profile view tracked: { profileId: "123", profileType: "own" }
🔍 [Analytics] Post engagement tracked: { postId: "456", action: "like" }
```

### Dashboard Microsoft Clarity (Production)
1. Accédez à [clarity.microsoft.com](https://clarity.microsoft.com)
2. Sélectionnez votre projet (ID: rwv1aa0ok8)
3. Vérifiez les événements dans **Insights > Custom Events**

## 🚀 Déploiement Production

### 1. Configuration EAS Build

Dans `eas.json` :
```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {
      "autoIncrement": true
    }
  }
}
```

### 2. Build de Production
```bash
# Android
eas build --profile production --platform android

# iOS  
eas build --profile production --platform ios

# Les deux
eas build --profile production --platform all
```

### 3. Variables d'Environnement Production
```env
# Production .env
CLARITY_PROJECT_ID=your_production_project_id
API_HOST=your_production_api
NODE_ENV=production
```

## 🔍 Debugging

### Vérifier l'État d'Analytics
```typescript
import analyticsService from './src/services/AnalyticsService';

// Dans n'importe quel composant
useEffect(() => {
  const status = analyticsService.getAnalyticsStatus();
  console.log('📊 Analytics Status:', {
    isAvailable: status.isAvailable,
    environment: status.environment,
    isInitialized: status.isInitialized
  });
}, []);
```

### Messages de Debug Courants

| Message | Signification | Action |
|---------|---------------|--------|
| `Running in Expo Go - Analytics disabled` | Mode fallback actif | Normal en développement |
| `Clarity initialized successfully` | Analytics fonctionnel | Parfait ! |
| `Clarity not available - skipping` | Module manquant | Créer un development build |
| `Event logged (fallback)` | Mode console | Normal en Expo Go |

## 📱 Workflow Recommandé

### Développement Quotidien
```bash
# Développement rapide avec Expo Go
npm start
# Analytics = logs console uniquement
```

### Test d'Analytics Complet
```bash
# Une fois par semaine ou avant release
eas build --profile development --platform android
# Installer et tester avec Clarity réel
```

### Release Production
```bash
# Build final
eas build --profile production --platform all
# Analytics pleinement fonctionnel
```

## 🎯 Événements Trackés

Même en mode fallback (Expo Go), tous les événements sont enregistrés :

- ✅ **Vues de profil** : `profile_view`
- ✅ **Engagement posts** : `post_engagement` 
- ✅ **Création événements** : `event_created`
- ✅ **Interactions événements** : `event_interaction`
- ✅ **Usage app** : `app_usage`
- ✅ **Performances** : `performance_metric`
- ✅ **Erreurs** : `app_error`

## 💡 Conseil Pro

**Pour le développement quotidien** : Utilisez Expo Go et surveillez les logs console. Cela vous permet de valider que tous les événements sont bien déclenchés au bon moment.

**Pour les tests finaux** : Créez un development build une fois par semaine pour vérifier que Clarity fonctionne correctement avec de vraies données.

---

**Status du Ticket** : ✅ **COMPLÉTÉ** - Analytics fonctionnel en mode fallback ET production 