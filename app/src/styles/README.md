# Styles Organization

Les styles sont désormais organisés en sous-dossiers logiques pour une meilleure maintenabilité :

## Structure

```
styles/
├── components/           # Styles des composants réutilisables
│   ├── cloudinaryStyles.ts    # Styles pour Cloudinary (images, vidéos, upload)
│   ├── postStyles.ts          # Styles pour les composants de post
│   ├── bottomNavStyles.ts     # Styles pour la navigation du bas
│   ├── captionInputStyles.ts  # Styles pour les inputs de caption
│   ├── cardComponentStyles.ts # Styles pour les composants de carte
│   └── index.ts              # Exports centralisés
│
├── auth/                # Styles d'authentification
│   ├── authStyles.ts           # Styles d'auth généraux
│   ├── registerStyles.ts      # Styles d'inscription
│   ├── registerComponentStyles.ts
│   ├── verifyStyles.ts        # Styles de vérification
│   ├── forgotPasswordStyles.ts # Styles mot de passe oublié
│   └── index.ts              # Exports centralisés
│
├── screens/             # Styles des écrans
│   ├── homeStyles.ts          # Styles de l'écran d'accueil
│   ├── favoritesStyles.ts     # Styles des favoris
│   ├── eventsStyles.ts        # Styles des événements
│   ├── jobsStyles.ts          # Styles des emplois
│   ├── publicationStyles.ts   # Styles de publication
│   ├── createEventStyles.ts   # Styles de création d'événement
│   ├── createJobOfferStyles.ts # Styles de création d'offre d'emploi
│   ├── friendRequestStyles.ts # Styles des demandes d'amis
│   ├── postDetailStyles.ts    # Styles de détail de post
│   ├── eventDetailStyles.ts   # Styles de détail d'événement
│   ├── welcomeStyles.ts       # Styles d'accueil
│   ├── loadingStyles.ts       # Styles de chargement
│   └── index.ts              # Exports centralisés
│
├── modals/              # Styles des modales
│   ├── commentsModalStyles.ts      # Styles modal de commentaires
│   ├── hierarchicalCommentsStyles.ts # Styles commentaires hiérarchiques
│   ├── addFriendModalStyles.ts     # Styles modal d'ajout d'ami
│   └── index.ts                   # Exports centralisés
│
├── media/               # Styles des médias
│   ├── mediaStyles.ts         # Styles pour la section média
│   ├── imageViewerStyles.ts   # Styles pour le visualiseur d'images
│   └── index.ts              # Exports centralisés
│
├── Feed/                # Styles du feed (existant)
├── Profile/             # Styles du profil (existant)
├── config/              # Configuration des styles (existant)
├── ThemeProvider.tsx    # Fournisseur de thème
└── index.ts             # Export principal de tous les styles
```

## Utilisation

### Import direct depuis un sous-dossier
```typescript
import { cloudinaryImageStyles } from '../styles/components/cloudinaryStyles';
import { commentsModalStyles } from '../styles/modals/commentsModalStyles';
```

### Import depuis les index
```typescript
// Import depuis l'index de catégorie
import { cloudinaryImageStyles, postStyles } from '../styles/components';

// Import depuis l'index principal
import { cloudinaryImageStyles, commentsModalStyles, homeStyles } from '../styles';
```

## Avantages de cette organisation

1. **Clarté** : Plus facile de trouver les styles liés à un composant spécifique
2. **Maintenabilité** : Évite d'avoir trop de fichiers à la racine
3. **Scalabilité** : Facilite l'ajout de nouveaux styles dans les bonnes catégories
4. **Imports centralisés** : Les fichiers index permettent des imports propres
5. **Consistance** : Organisation logique par type de composant/écran

## Migration

Tous les anciens imports ont été mis à jour automatiquement. Si vous ajoutez de nouveaux styles :

1. Placez-les dans le bon sous-dossier selon leur usage
2. Ajoutez l'export dans le fichier `index.ts` du sous-dossier correspondant
3. L'export sera automatiquement disponible via l'index principal 