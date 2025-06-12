# Microsoft Clarity Analytics - Implémentation GearConnect

## 📋 Ticket KAN-199 : Ajouter analytics et métriques

Cette documentation décrit l'implémentation complète de Microsoft Clarity dans l'application GearConnect selon les spécifications du ticket Jira.

## 🎯 Fonctionnalités Implémentées

### ✅ 1. Tracking des vues de profil
- **Fichier**: `ProfileScreen.tsx`
- **Fonctionnalité**: Track automatique des vues de profil (propre profil vs profil d'autres utilisateurs)
- **Données collectées**:
  - ID du profil visualisé
  - Type de profil (own/other)
  - Type de visiteur (authenticated/guest)
  - Temps passé sur le profil

### ✅ 2. Métriques d'engagement sur les posts
- **Fichier**: `HomeScreen.tsx`
- **Fonctionnalités**:
  - Tracking des likes
  - Tracking des commentaires
  - Tracking des partages
  - Tracking des sauvegardes
  - Tracking du temps passé sur chaque post
- **Données collectées**:
  - ID du post
  - Action effectuée (like, comment, share, save)
  - Type de post (image/video)
  - ID de l'auteur du post
  - Temps passé à visualiser le post

### ✅ 3. Analytics des événements créés
- **Fichiers**: `CreateEventForm.tsx`, `CreateEventScreen.tsx`
- **Fonctionnalités**:
  - Tracking de la création d'événements
  - Tracking des interactions avec les événements (vue, participation, partage)
- **Données collectées**:
  - ID de l'événement créé
  - Type d'événement
  - ID du créateur
  - Présence de localisation
  - Présence d'images
  - Tags/catégories
  - Nombre de participants attendus

### ✅ 4. Statistiques d'utilisation de l'app
- **Fichiers**: Tous les écrans principaux
- **Fonctionnalités**:
  - Tracking automatique des vues d'écran
  - Tracking des features utilisées
  - Tracking des sessions
  - Tracking des performances

## 🏗️ Architecture

### Services
- **`AnalyticsService.ts`**: Service principal pour toutes les interactions avec Microsoft Clarity
- **Fonctions principales**:
  - `initializeAnalytics()`: Initialisation de Clarity
  - `trackProfileView()`: Tracking des vues de profil
  - `trackPostEngagement()`: Tracking des interactions avec les posts
  - `trackEventCreation()`: Tracking de la création d'événements
  - `trackEventInteraction()`: Tracking des interactions avec les événements
  - `trackAppUsage()`: Tracking de l'utilisation générale
  - `trackPerformance()`: Tracking des performances
  - `trackError()`: Tracking des erreurs

### Hooks
- **`useAnalytics.ts`**: Hook principal pour accéder aux fonctions de tracking
- **`useScreenTracking()`**: Hook pour le tracking automatique des vues d'écran
- **`usePostTracking()`**: Hook spécialisé pour le tracking des interactions avec les posts

## 🔧 Configuration

### Variables d'environnement
Ajoutez dans votre fichier `.env` :
```env
CLARITY_PROJECT_ID=your_project_id_here
```

### Configuration Expo
Le projet ID Clarity est configuré dans `app.config.js` :
```javascript
clarityProjectId: process.env.CLARITY_PROJECT_ID,
```

## 📊 Événements Trackés

### Événements Principaux
1. **`profile_view`** - Vue de profil
2. **`post_engagement`** - Engagement avec les posts
3. **`event_created`** - Création d'événement
4. **`event_interaction`** - Interaction avec les événements
5. **`app_usage`** - Utilisation générale de l'app
6. **`performance_metric`** - Métriques de performance
7. **`app_error`** - Erreurs de l'application

### Métriques Personnalisées
- **`performance_load_time`** - Temps de chargement
- **`performance_api_response_time`** - Temps de réponse API
- **`performance_image_load_time`** - Temps de chargement des images

## 🚀 Utilisation

### Dans un composant React
```typescript
import { useAnalytics, useScreenTracking } from '../hooks/useAnalytics';

const MyScreen = () => {
  const { trackPostEngagement } = useAnalytics();
  
  // Tracking automatique de la vue d'écran
  useScreenTracking('MyScreen', { feature: 'example' });
  
  // Tracking manuel d'une action
  const handleLike = (postId: string) => {
    trackPostEngagement({
      postId,
      action: 'like',
      postType: 'image',
      authorId: 'user123',
    });
  };
  
  return (
    // Votre composant
  );
};
```

### Tracking des performances
```typescript
const { trackPerformance } = useAnalytics();

// Mesurer le temps de chargement
const startTime = Date.now();
await loadData();
const loadTime = Date.now() - startTime;

trackPerformance({
  metric: 'load_time',
  value: loadTime,
  context: 'user_data',
});
```

## 📈 Données Collectées

### Profils
- Nombre de vues de profil
- Type de profils visités (propre/autres)
- Temps passé sur les profils
- Utilisateurs les plus consultés

### Posts
- Actions d'engagement (likes, comments, shares, saves)
- Types de contenu les plus engageants
- Temps passé sur chaque type de post
- Patterns d'interaction

### Événements
- Taux de création d'événements
- Types d'événements créés
- Interactions avec les événements
- Géolocalisation des événements

### Utilisation App
- Écrans les plus visités
- Temps passé par écran
- Parcours utilisateur
- Taux de rétention

## 🔍 Dashboard Microsoft Clarity

Pour visualiser les données :
1. Accédez à [Microsoft Clarity](https://clarity.microsoft.com)
2. Sélectionnez votre projet (ID: rwv1aa0ok8)
3. Explorez les différents rapports :
   - **Heatmaps** : Zones d'interaction
   - **Session recordings** : Enregistrements de sessions
   - **Insights** : Analyses automatiques
   - **Custom events** : Événements personnalisés

## 🎮 Tests

### En développement
```bash
# Lancer l'app avec logging verbose
expo start

# Vérifier les logs pour les événements analytics
# Rechercher les messages : "🔍 [Analytics]"
```

### Production
- Les événements sont automatiquement envoyés à Microsoft Clarity
- Vérifiez le dashboard pour confirmer la réception des données
- Délai de traitement : 2-4 heures pour les nouvelles données

## 🐛 Debugging

### Vérifier l'initialisation
```typescript
import analyticsService from './services/AnalyticsService';

// Vérifier le statut
const status = analyticsService.getAnalyticsStatus();
console.log('Analytics Status:', status);
```

### Messages de debug courants
- `🔍 [Analytics] Clarity initialized successfully` - Initialisation réussie
- `🔍 [Analytics] Profile view tracked` - Vue de profil trackée
- `🔍 [Analytics] Post engagement tracked` - Engagement post tracké
- `❌ [Analytics] Failed to track...` - Erreur de tracking

## 📝 Notes de Développement

### Bonnes Pratiques
1. **Ne pas tracker d'informations sensibles** (mots de passe, tokens, etc.)
2. **Utiliser des IDs anonymisés** quand possible
3. **Tracker les erreurs** pour améliorer l'expérience utilisateur
4. **Optimiser les performances** en évitant trop d'événements simultanés

### Prochaines Étapes
1. Ajout de dashboards personnalisés
2. Intégration avec d'autres outils d'analytics
3. A/B testing basé sur les données collectées
4. Recommandations personnalisées basées sur le comportement

## 📞 Support

Pour toute question sur l'implémentation :
- Vérifiez d'abord les logs console
- Consultez la documentation Microsoft Clarity
- Contactez l'équipe de développement

---

**Ticket KAN-199 Status**: ✅ **COMPLETED**
**Date d'implémentation**: $(date)
**Version**: 1.0.0 