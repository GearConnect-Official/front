# Components Organization

Cette organisation suit la même logique que celle des styles, en regroupant les composants par responsabilité et fonctionnalité.

## Structure organisée

### 📱 `/ui` - Composants d'interface utilisateur communs
Composants d'interface réutilisables dans toute l'application :
- `BottomNav.tsx` - Navigation du bas
- `FeedbackMessage.tsx` - Messages de feedback/notifications
- `ErrorBoundary.tsx` - Gestion des erreurs React

### 🖼️ `/modals` - Composants modaux
Tous les composants qui s'affichent en modal/overlay :
- `HierarchicalCommentsModal.tsx` - Modal de commentaires hiérarchiques
- `CommentsModal.tsx` - Modal de commentaires simple
- `AddFriendModal.tsx` - Modal d'ajout d'ami
- `StoryModal.tsx` - Modal de visualisation des stories

### 🎬 `/media` - Composants multimédia
Composants liés à la gestion des médias (Cloudinary, vidéos, images) :
- `CloudinaryImage.tsx` - Composant d'image Cloudinary
- `CloudinaryVideo.tsx` - Composant vidéo Cloudinary
- `CloudinaryMedia.tsx` - Composant média générique
- `CloudinaryImageUpload.tsx` - Upload d'images
- `CloudinaryVideoUpload.tsx` - Upload de vidéos

### 📋 `/items` - Composants d'éléments de liste
Composants représentant des éléments individuels dans des listes :
- `FriendRequestItem.tsx` - Élément de demande d'ami
- `JobItem.tsx` - Élément d'offre d'emploi
- `EventItem.tsx` - Élément d'événement

### 📝 `/forms` - Composants de formulaires
Composants de formulaires et de saisie :
- `UserProfile.tsx` - Formulaire de profil utilisateur

## Dossiers fonctionnels (déjà organisés)

### 📸 `/Publication` - Composants de publication
Ensemble complet des composants pour la création de publications :
- `PublicationForm.tsx` - Formulaire principal
- `ImageCropper.tsx` - Recadrage d'images
- `ImageViewer.tsx` - Visualisation d'images
- `MediaSection.tsx` - Section média
- `CaptionInput.tsx` - Saisie de légende
- `Header.tsx` - En-tête

### 👤 `/Profile` - Composants de profil
- `ProfileMenu.tsx` - Menu du profil

### 📰 `/Feed` - Composants du fil d'actualité
Composants pour l'affichage et l'interaction avec les posts :
- `PostItem.tsx` - Élément de post complet
- `PostHeader.tsx` - En-tête de post
- `PostFooter.tsx` - Pied de post
- `PostActions.tsx` - Actions sur les posts
- `PostOptionsButton.tsx` - Bouton d'options
- `PostOptionsMenu.tsx` - Menu d'options
- `ShareModal.tsx` - Modal de partage
- `HierarchicalComment.tsx` - Commentaire hiérarchique
- `ProfilePost.tsx` - Post pour le profil

### 🎉 `/CreateEvent` - Composants de création d'événement
Interface multi-étapes pour créer un événement :
- `StepIndicator.tsx` - Indicateur d'étapes
- `TopBar.tsx` - Barre du haut
- `BasicInfo.tsx` - Informations de base
- `AdditionalInfo.tsx` - Informations supplémentaires
- `MediaInfo.tsx` - Informations média
- `ImageUpload.tsx` - Upload d'image
- `InputField.tsx` - Champ de saisie
- `NavigationButtons.tsx` - Boutons de navigation
- `ActionButtons.tsx` - Boutons d'action

## 🗂️ Composants legacy (à réorganiser)
Composants à refactoriser ou à déplacer :
- `Post.tsx` - Ancien composant de post
- `CreateEvent.tsx` - Ancien composant de création d'événement

## 📋 Fichiers d'index
Chaque dossier contient un fichier `index.ts` qui exporte tous ses composants pour faciliter les imports :

```typescript
// Au lieu de :
import BottomNav from '../ui/BottomNav';
import FeedbackMessage from '../ui/FeedbackMessage';

// Vous pouvez faire :
import { BottomNav, FeedbackMessage } from '../ui';
```

## 🔄 Import/Export
Le fichier `index.ts` principal réorganise tous les exports :

```typescript
// Imports par catégorie
export * from './ui';           // Composants UI
export * from './modals';       // Modals
export * from './media';        // Composants média
export * from './items';        // Éléments de liste
export * from './forms';        // Formulaires

// Imports par fonctionnalité
export * from './Publication';
export * from './Profile';
export * from './Feed';
export * from './CreateEvent';
```

Cette organisation améliore :
- ✅ **Lisibilité** : Structure claire et logique
- ✅ **Maintenabilité** : Facilite les modifications
- ✅ **Réutilisabilité** : Composants bien organisés
- ✅ **Developer Experience** : Auto-complétion améliorée
- ✅ **Cohérence** : Alignée avec l'organisation des styles 