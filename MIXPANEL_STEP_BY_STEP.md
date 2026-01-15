# 🎯 Guide étape par étape : Ajouter des rapports dans Mixpanel

Guide pratique pour ajouter des rapports et KPIs à votre dashboard Mixpanel.

## 📊 Étape 1 : Ajouter des KPIs via le pop-up "Add Report"

### Dans le pop-up "Add Report" que vous voyez :

1. **Active Users - Today** (déjà suggéré)
   - Cliquez sur le bouton **"Add"** à côté
   - Ce rapport sera ajouté à votre dashboard

2. **Ajouter d'autres KPIs suggérés** :
   - Cliquez sur **"Q Search"** dans le pop-up
   - Tapez le nom d'un événement (ex: "Post Liked", "Event Joined")
   - Sélectionnez les rapports suggérés

3. **Fermer le pop-up** : Cliquez en dehors ou sur "X"

## 📈 Étape 2 : Créer un Insight personnalisé

### Exemple : Créer "Posts Liked - Daily"

1. Cliquez sur **"+ Create New"** (en haut à gauche)
2. Sélectionnez **"Insight"**
3. Dans le formulaire :
   - **Événement** : Sélectionnez `Post Liked`
   - **Métrique** : Choisissez `Total Events`
   - **Période** : Sélectionnez `Last 30 days`
   - **Groupement** : Choisissez `By Day`
4. Cliquez sur **"Save"** en haut à droite
5. Nommez-le : `Posts Liked - Daily`
6. Cliquez sur **"Add to Board"** → Sélectionnez votre board

## 🎯 Étape 3 : Créer un Funnel (Conversion)

### Exemple : "Event View to Join Conversion"

1. **"+ Create New"** → **"Funnel"**
2. **Étape 1** :
   - Événement : `Event Viewed`
   - Nom : "Viewed Event"
3. **Étape 2** :
   - Événement : `Event Joined`
   - Nom : "Joined Event"
4. Cliquez sur **"Run"** pour voir le taux de conversion
5. **"Save"** → Nommez : `Event View to Join Conversion`
6. **"Add to Board"**

## 📊 Étape 4 : Créer un rapport "Top Posts"

1. **"+ Create New"** → **"Insight"**
2. **Événement** : `Post Liked`
3. **Grouper par** : `post_id` (propriété de l'événement)
4. **Trier par** : `Total Events` (descendant)
5. **Limiter** : Top 10
6. **"Save"** → Nom : `Top Posts by Likes`
7. **"Add to Board"**

## 🔍 Étape 5 : Utiliser les filtres avancés

### Exemple : "Posts with Images"

1. **"+ Create New"** → **"Insight"**
2. **Événement** : `Post Created`
3. Cliquez sur **"+ Add filter"**
4. Sélectionnez la propriété : `has_image`
5. Opérateur : `equals`
6. Valeur : `true`
7. **"Save"** → Nom : `Posts Created with Images`

## 📱 Étape 6 : Créer un Board personnalisé

1. **"+ Create New"** → **"Board"**
2. Nommez : `GearConnect - Engagement Dashboard`
3. **Ajoutez des rapports** :
   - Cliquez sur **"Add report"** dans chaque section
   - Sélectionnez les insights que vous avez créés
   - Organisez-les par glisser-déposer

## 🎨 Étape 7 : Organiser votre Dashboard

### Sections recommandées :

1. **"User Metrics"** (en haut)
   - Active Users - Today
   - Active Users - This Week
   - New Signups - Daily

2. **"Content Engagement"** (milieu gauche)
   - Posts Created - Daily
   - Posts Liked - Daily
   - Posts Commented - Daily

3. **"Events"** (milieu droit)
   - Events Joined - Daily
   - Most Popular Events
   - Event View to Join Conversion

4. **"Social"** (bas)
   - New Follows - Daily
   - Profile Views - Daily

## 🚀 Rapports rapides à créer maintenant

### 1. Daily Active Users
- Événement : `App Launched`
- Métrique : `Unique Users`
- Période : `Today`

### 2. Posts Created Today
- Événement : `Post Created`
- Métrique : `Total Events`
- Période : `Today`

### 3. Events Joined Today
- Événement : `Event Joined`
- Métrique : `Total Events`
- Période : `Today`

### 4. User Engagement Rate
- Formule personnalisée : `(Post Liked + Post Commented) / Active Users`

## 💡 Astuces

- **Épinglez les rapports** : Cliquez sur l'icône 📌 pour les garder visibles
- **Partagez les rapports** : Cliquez sur "Share" pour envoyer à votre équipe
- **Exportez en PDF** : Pour les présentations
- **Configurez des alertes** : Pour être notifié quand une métrique change

## 📚 Ressources

- **Guide complet** : Voir `MIXPANEL_ADD_REPORTS.md`
- **Liste des événements** : Voir `MIXPANEL_EVENTS_QUICK_REFERENCE.md`

---

**Commencez par ajouter les KPIs suggérés dans le pop-up, puis créez des insights personnalisés !** 🎉
