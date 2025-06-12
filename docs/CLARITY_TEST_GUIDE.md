# 🔍 Guide de Test Microsoft Clarity - GearConnect

## 📱 Installation de l'APK

1. **Récupération du fichier :**
   - Trouvez le fichier `.apk` généré (ex: `build-xxxxx.apk`)
   - Transférez-le sur votre appareil Android

2. **Installation :**
   - Activez "Sources inconnues" dans Paramètres > Sécurité
   - Installez l'APK
   - Acceptez les permissions

## 🔍 Tests Microsoft Clarity

### ✅ 1. Vérification du Tracking de Base
- **Objectif :** S'assurer que Clarity fonctionne
- **Actions :**
  - Ouvrez l'app
  - Vérifiez les logs : `"✅ [Analytics] Clarity initialized successfully"`
  - Naviguez entre 2-3 écrans

### ✅ 2. Profile View Tracking
- **Objectif :** Tester `trackProfileView()`
- **Actions :**
  - Allez sur votre profil (profil personnel)
  - Visitez le profil d'un autre utilisateur
  - Vérifiez les logs : `"🔍 [Analytics] Profile view tracked"`

### ✅ 3. Post Engagement Tracking
- **Objectif :** Tester `trackPostEngagement()`
- **Actions :**
  - Likez un post
  - Commentez un post
  - Partagez un post
  - Vérifiez les logs : `"🔍 [Analytics] Post engagement tracked"`

### ✅ 4. Event Creation Tracking
- **Objectif :** Tester `trackEventCreation()`
- **Actions :**
  - Créez un nouvel événement
  - Ajoutez une image/localisation si possible
  - Vérifiez les logs : `"🔍 [Analytics] Event creation tracked"`

### ✅ 5. Event Interaction Tracking
- **Objectif :** Tester `trackEventInteraction()`
- **Actions :**
  - Consultez la liste des événements
  - Rejoignez/quittez un événement
  - Partagez un événement
  - Vérifiez les logs : `"🔍 [Analytics] Event interaction tracked"`

### ✅ 6. App Usage Tracking
- **Objectif :** Tester `trackAppUsage()` et navigation
- **Actions :**
  - Naviguez entre tous les onglets
  - Utilisez différentes fonctionnalités
  - Vérifiez les logs : `"🔍 [Analytics] App usage tracked"`

## 📊 Vérification Dashboard Clarity

### **Accès au Dashboard :**
- **URL :** https://clarity.microsoft.com
- **Projet ID :** `rwv1aa0ok8`
- **Délai d'apparition :** 2-4 heures après utilisation

### **Données à vérifier :**
- **Sessions utilisateur** nouvelles
- **Événements personnalisés :**
  - `profile_view`
  - `post_engagement`
  - `event_created`
  - `event_interaction`
  - `app_usage`

## 🐛 Dépannage

### **Logs à surveiller :**
```
✅ Clarity initialized successfully  ← Bon signe
🔍 Event logged: profile_view       ← Analytics fonctionnent
❌ Failed to initialize Clarity     ← Problème
```

### **Problèmes courants :**
- **Pas de logs Clarity :** Vérifiez la connexion internet
- **Analytics en mode fallback :** Vous êtes encore sur Expo Go
- **Pas de données dashboard :** Attendez 2-4h ou vérifiez le projet ID

## 📈 Métriques Importantes

### **KPIs Ticket KAN-199 :**
- [x] Profile view tracking
- [x] Post engagement metrics  
- [x] Event creation analytics
- [x] App usage statistics

### **Événements trackés :**
- `profile_view` (type: own/other, viewer: authenticated/guest)
- `post_engagement` (action: like/comment/share, type: text/image/video)
- `event_created` (type, location, images, participants)
- `event_interaction` (action: view/join/leave/share)
- `app_usage` (type: screen_view/feature_use, session data)

## ✅ Checklist Final

- [ ] APK installé et app lancée
- [ ] Logs Clarity visibles
- [ ] Tests de navigation effectués
- [ ] Interactions diverses testées
- [ ] Dashboard vérifié (après 2-4h)
- [ ] Données correspondent aux actions

## 🚀 Next Steps

Une fois les tests validés :
1. **Production :** Utiliser le profil `preview` ou `production`
2. **Monitoring :** Surveiller le dashboard régulièrement
3. **Optimisation :** Analyser les parcours utilisateur
4. **Alertes :** Configurer des alertes pour les erreurs critiques

---
*Build généré avec : `./build-eas-clarity.sh`*
*Environment : Development Build EAS* 