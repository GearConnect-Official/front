# 📱 Screen Styles Organization

Cette documentation explique la nouvelle structure organisée des styles d'écrans dans GearConnect.

## 🗂️ Structure par Dossiers

Les styles sont maintenant organisés par fonctionnalités dans des dossiers thématiques :

### 📁 **common/**
Styles communs utilisés dans plusieurs écrans
- `loadingStyles.ts` - États de chargement

### 👤 **user/**
Styles liés au profil et aux préférences utilisateur
- `homeStyles.ts` - Écran d'accueil
- `settingsStyles.ts` - Paramètres
- `welcomeStyles.ts` - Écran de bienvenue
- `performanceStyles.ts` - Performances utilisateur

### 🤝 **social/**
Styles pour les fonctionnalités sociales
- `publicationStyles.ts` - Publications et posts
- `postDetailStyles.ts` - Détail d'un post
- `friendRequestStyles.ts` - Demandes d'amis
- `friendRequestItemStyles.ts` - Item de demande d'ami
- `favoritesStyles.ts` - Favoris

### 👥 **groups/**
Styles pour le système de groupes Discord-like
- `groupsScreenStyles.ts` - Liste des groupes
- `groupDetailScreenStyles.ts` - Détails d'un groupe
- `groupChannelScreenStyles.ts` - Chat des channels

### 💬 **messages/**
Styles pour le système de messagerie
- `messagesScreenStyles.ts` - Liste des conversations
- `conversationScreenStyles.ts` - Vue d'une conversation
- `newConversationScreenStyles.ts` - Nouvelle conversation

### 🎪 **events/**
Styles pour les événements automobiles
- `eventsStyles.ts` - Liste des événements
- `createEventStyles.ts` - Création d'événement
- `editEventStyles.ts` - Édition d'événement
- `eventDetailStyles.ts` - Détail d'un événement

### 💼 **jobs/**
Styles pour les offres d'emploi
- `jobsStyles.ts` - Liste des emplois
- `jobsScreenStyles.ts` - Écran des emplois
- `createJobOfferStyles.ts` - Création d'offre

### 🛍️ **products/**
Styles pour les produits et boutique
- `productListScreenStyles.ts` - Liste des produits

## 📦 Imports

### Nouvelle méthode (recommandée)
```typescript
// Import par catégorie
import { groupsScreenStyles } from '../src/styles/screens/groups';
import { messagesScreenStyles } from '../src/styles/screens/messages';
import { homeStyles } from '../src/styles/screens/user';
```

### Ancienne méthode (compatible)
```typescript
// Import global (toujours supporté)
import { groupsScreenStyles } from '../src/styles/screens';
```

### Import spécifique
```typescript
// Import direct depuis le dossier
import { groupsScreenStyles } from '../src/styles/screens/groups/groupsScreenStyles';
```

## 🔄 Migration

Les anciens imports continuent de fonctionner grâce aux exports de compatibilité dans `index.ts`.

Pour migrer vers la nouvelle structure :
1. Remplacez les imports depuis `'../src/styles/screens'` 
2. Utilisez les imports par catégorie pour une meilleure organisation
3. Profitez de l'autocomplétion améliorée

## 📝 Conventions

- Chaque dossier contient un fichier `index.ts` pour les exports
- Les noms de fichiers suivent le pattern `*Styles.ts`
- Les styles sont organisés par fonctionnalité métier
- Compatibilité maintenue avec les anciens imports

## 🎯 Avantages

✅ **Organisation claire** par fonctionnalité  
✅ **Meilleure navigabilité** dans l'IDE  
✅ **Imports optimisés** par catégorie  
✅ **Compatibilité** avec l'ancien système  
✅ **Évolutivité** pour de nouvelles fonctionnalités 