# Intégration Cloudinary - GearConnect

## Vue d'ensemble

L'application GearConnect utilise maintenant Cloudinary pour la gestion complète des images et vidéos. Cette intégration offre :

- 📸 **Upload automatique** vers Cloudinary lors de la sélection d'images
- 🚀 **Optimisation automatique** avec compression et conversion de format
- 🎨 **Transformations en temps réel** pour différentes tailles d'écran
- 🔒 **Stockage sécurisé** dans le cloud
- ⚡ **CDN global** pour un chargement rapide

## Configuration

### Variables d'environnement

Créez un fichier `.env` à la racine du projet avec :

```env
# API Configuration
API_PROTOCOL=http
API_HOST=localhost
API_PORT=3000

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

### Configuration Cloudinary Dashboard

1. **Upload Preset** : Créez un upload preset dans votre dashboard Cloudinary
   - Mode : `Unsigned` pour les uploads côté client
   - Dossier : configurez automatiquement selon le type de contenu
   - Transformations : activez l'auto-optimisation

## Composants disponibles

### 1. CloudinaryImageUpload

Composant principal pour l'upload d'images.

```tsx
import { CloudinaryImageUpload } from '../components';

<CloudinaryImageUpload
  onUploadComplete={(response) => {
    console.log('Image uploadée:', response.secure_url);
    console.log('Public ID:', response.public_id);
  }}
  onUploadError={(error) => {
    console.error('Erreur:', error);
  }}
  folder="posts"
  tags={['post', 'gallery']}
  allowMultiple={false}
  buttonText="Ajouter une image"
  showPreview={true}
/>
```

### 2. CloudinaryVideoUpload

Composant pour l'upload de vidéos.

```tsx
import { CloudinaryVideoUpload } from '../components';

<CloudinaryVideoUpload
  onUploadComplete={(response) => {
    console.log('Vidéo uploadée:', response.secure_url);
    console.log('Durée:', response.duration);
  }}
  folder="posts/videos"
  tags={['video', 'content']}
  maxVideos={1}
/>
```

### 3. CloudinaryImage

Composant d'affichage optimisé pour les images.

```tsx
import { CloudinaryImage, CloudinaryAvatar, CloudinaryThumbnail } from '../components';

// Image standard avec optimisation
<CloudinaryImage
  publicId="posts/my-image-id"
  width={300}
  height={200}
  crop="fill"
  quality="auto"
  format="auto"
/>

// Avatar optimisé
<CloudinaryAvatar
  publicId="users/avatar-id"
  size={50}
/>

// Miniature
<CloudinaryThumbnail
  publicId="posts/thumb-id"
  size={100}
/>
```

### 4. Hook useCloudinary

Hook personnalisé pour une utilisation avancée.

```tsx
import { useCloudinary } from '../hooks/useCloudinary';

const MyComponent = () => {
  const { uploading, error, uploadImage, uploadVideo, clearError } = useCloudinary();

  const handleUpload = async () => {
    const result = await uploadImage({
      folder: 'custom-folder',
      tags: ['custom', 'tag'],
    });
    
    if (result) {
      console.log('Upload réussi:', result);
    }
  };

  return (
    <div>
      {uploading && <p>Upload en cours...</p>}
      {error && <p>Erreur: {error}</p>}
      <button onClick={handleUpload}>Upload Image</button>
    </div>
  );
};
```

## Utilisation dans l'application

### Publications (Posts)

Les publications utilisent Cloudinary pour :
- Upload automatique lors de la sélection d'image
- Stockage organisé dans le dossier `posts/`
- URLs optimisées pour différents contextes (feed, détail, etc.)

```tsx
// Dans PublicationScreen.tsx
const handleImageSelected = (cloudinaryResponse: CloudinaryUploadResponse) => {
  setSelectedImage(cloudinaryResponse.secure_url);
  setSelectedImagePublicId(cloudinaryResponse.public_id);
  // L'image est déjà uploadée et optimisée !
};
```

### Événements

Les événements utilisent Cloudinary pour :
- Logos d'événements dans `events/logos/`
- Galeries d'images dans `events/gallery/`
- Optimisation automatique selon le contexte d'affichage

```tsx
// Dans CreateEvent
<ImageUpload
  title="Event Logo"
  buttonText="Upload"
  onImageSelected={(url, publicId) => {
    // URL optimisée et public ID pour référence
    setEventLogo(url);
    setEventLogoPublicId(publicId);
  }}
  folder="events/logos"
  tags={['event', 'logo']}
/>
```

### Feed et affichage

Les images du feed utilisent `CloudinaryImage` pour :
- Chargement optimisé selon la taille d'écran
- Conversion automatique au format WebP sur les navigateurs compatibles
- Compression intelligente selon la qualité de connexion

```tsx
// Dans PostItem.tsx
<CloudinaryImage
  publicId={post.imagePublicIds[0]}
  width={SCREEN_WIDTH}
  height={SCREEN_WIDTH}
  crop="fill"
  quality="auto"
  format="auto"
  fallbackUrl={post.images[0]} // Fallback pour les anciennes images
/>
```

## Optimisations automatiques

### Images

- **Format** : Conversion automatique WebP/AVIF selon le support
- **Qualité** : Compression intelligente selon le contenu
- **Taille** : Redimensionnement selon le contexte d'affichage
- **Crop** : Recadrage intelligent pour conserver les éléments importants

### Vidéos

- **Qualité adaptative** : Plusieurs qualités générées automatiquement
- **Formats multiples** : MP4, WebM selon le support du navigateur
- **Compression** : Optimisation du poids sans perte de qualité visuelle

## Structure des dossiers Cloudinary

```
gearconnect/
├── events/
│   ├── logos/          # Logos d'événements
│   └── gallery/        # Photos d'événements
├── posts/              # Images de publications
├── users/
│   └── avatars/        # Photos de profil
└── videos/             # Contenus vidéo
```

## Gestion des erreurs

L'intégration inclut une gestion complète des erreurs :

```tsx
const { error, clearError } = useCloudinary();

// Affichage d'erreur
{error && (
  <View style={styles.errorContainer}>
    <Text>{error}</Text>
    <TouchableOpacity onPress={clearError}>
      <Text>Fermer</Text>
    </TouchableOpacity>
  </View>
)}
```

## Bonnes pratiques

### 1. Organisation des dossiers
- Utilisez des dossiers logiques (`posts/`, `events/`, etc.)
- Ajoutez des tags pour faciliter la recherche
- Utilisez des public_ids explicites quand c'est pertinent

### 2. Optimisation des performances
- Spécifiez toujours width/height pour éviter les reflows
- Utilisez `quality="auto"` et `format="auto"` pour l'optimisation automatique
- Implémentez des fallbacks pour les anciennes images

### 3. Gestion des états
- Affichez des indicateurs de chargement pendant l'upload
- Gérez les erreurs de manière user-friendly
- Stockez les public_ids pour référencer les images optimisées

## Migration

Pour migrer des images existantes vers Cloudinary :

1. **Identification** : Listez les images actuellement stockées localement
2. **Upload** : Utilisez l'API Cloudinary pour upload en batch
3. **Mise à jour** : Remplacez les URLs locales par les URLs Cloudinary
4. **Nettoyage** : Supprimez les anciennes images après vérification

## Surveillance et analytics

Cloudinary fournit des analytics détaillés :
- Bande passante utilisée
- Nombre de transformations
- Performance de chargement
- Formats les plus demandés

Accédez à ces données via le dashboard Cloudinary pour optimiser davantage votre application. 