import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from '../styles/publicationStyles';
import postService from '../services/postService';

import Header from '../components/Publication/Header';
import MediaSection from '../components/Publication/MediaSection';
import ImageViewer from '../components/Publication/ImageViewer';
import PublicationForm from '../components/Publication/PublicationForm';

const PublicationScreen: React.FC = () => {
  const navigation = useNavigation();
  const [step, setStep] = useState<'select' | 'crop' | 'form'>('select');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleGoBack = () => {
    if (step !== 'select') {
      Alert.alert(
        'Discard Post?',
        'If you go back now, you will lose your post.',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Discard', 
            style: 'destructive',
            onPress: () => {
              setSelectedImage(null);
              setCroppedImage(null);
              setTitle('');
              setDescription('');
              setTags([]);
              setStep('select');
              navigation.goBack();
            }
          },
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  const handleShare = async () => {
    const imageToShare = croppedImage || selectedImage;
    
    if (!imageToShare || !title.trim()) {
      Alert.alert('Error', 'Please add an image and title');
      return;
    }

    try {
      setIsLoading(true);
      
      // Préparation du modèle de données selon le schéma Prisma
      // Correspondant au modèle Post { id, title, body, user, userId, image, imageId, tags, interactions, createdAt }
      const post = {
        title: title,
        body: description,
        userId: 1, // Remplacer par l'ID de l'utilisateur connecté
        image: imageToShare,
        tags: tags.length > 0 ? tags.map(tag => ({ name: tag })) : undefined,
      };
      
      console.log("\n\n=========== DONNÉES À ENVOYER VERS LE BACKEND ===========");
      console.log("Format attendu par le modèle Prisma:");
      console.log(`
model Post {
  id            Int           @id @default(autoincrement())
  title         String
  body          String
  user          User          @relation(fields: [userId], references: [id])
  userId        Int
  image         Photo?        @relation(fields: [imageId], references: [id])
  imageId       Int?
  tags          PostTag[]
  interactions  Interaction[]
  createdAt     DateTime      @default(now())
}
      `);
      
      // Appel de l'API pour créer le post
      const response = await postService.createPost(post);
      console.log('Post created:', response);
      
      // Si le post a des tags, les ajouter
      if (tags.length > 0 && response.id) {
        console.log('\nAjout des tags au post:');
        await Promise.all(
          tags.map(tag => {
            console.log(`- Tag: ${tag}`);
            return postService.addTagToPost(response.id, { name: tag });
          })
        );
      }
      
      setSelectedImage(null);
      setCroppedImage(null);
      setTitle('');
      setDescription('');
      setTags([]);
      setStep('select');
      
      Alert.alert('Success', 'Your post has been shared successfully!');
      navigation.goBack();
    } catch (error) {
      console.error('\n❌ ERREUR LORS DE LA CRÉATION DU POST:');
      console.error(error);
      console.log('\n📋 INSTRUCTIONS POUR LE BACKEND:');
      console.log(`
Pour que cette fonctionnalité fonctionne, vous devez implémenter les routes suivantes:

1. POST /api/posts
   - Crée un nouveau post
   - Corps de la requête: { title, body, userId, image, tags? }
   - Retourne: Le post créé avec son ID

2. POST /api/posts/:postId/tags 
   - Ajoute un tag à un post existant
   - Corps de la requête: { name }
   - Retourne: Le tag créé

3. GET /api/posts
   - Récupère tous les posts
   - Retourne: Liste de posts

4. POST /api/posts/:postId/interactions
   - Ajoute une interaction (like, comment, share) à un post
   - Corps de la requête: { type, userId, content?, createdAt }
   - Retourne: L'interaction créée
`);
      Alert.alert('Error', 'Failed to share post');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageSelected = (uri: string) => {
    setSelectedImage(uri);
    setCroppedImage(uri);
    setStep('crop');
  };

  const handleImageChange = (newUri: string) => {
    setCroppedImage(newUri);
  };

  const handleNext = () => {
    if (step === 'crop') {
      if (!croppedImage && !selectedImage) {
        Alert.alert('Error', 'Please select an image first');
        return;
      }
      setStep('form');
    }
  };

  const handleBack = () => {
    switch (step) {
      case 'form':
        setStep('crop');
        break;
      case 'crop':
        setStep('select');
        break;
      default:
        handleGoBack();
    }
  };

  const handleTagsChange = (newTags: string[]) => {
    setTags(newTags);
  };

  const renderContent = () => {
    switch (step) {
      case 'select':
        return <MediaSection onImageSelected={handleImageSelected} />;
      
      case 'crop':
        return selectedImage ? (
          <ImageViewer
            imageUri={selectedImage}
            onImageChange={handleImageChange}
            onNext={handleNext}
            onGoBack={handleBack}
            isLastStep={false}
          />
        ) : null;
      
      case 'form':
        const imageToShow = croppedImage || selectedImage;
        return imageToShow ? (
          <PublicationForm
            imageUri={imageToShow}
            title={title}
            description={description}
            tags={tags}
            setTitle={setTitle}
            setDescription={setDescription}
            setTags={handleTagsChange}
            username="Username" // À remplacer par le vrai username
            userAvatar="https://via.placeholder.com/32" // À remplacer par le vrai avatar
            isLoading={isLoading}
          />
        ) : null;
      
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <Header 
        isCropping={step === 'crop'}
        isLastStep={step === 'form'}
        onBack={handleBack}
        onConfirm={handleNext}
        onNext={step === 'form' ? handleShare : handleNext}
        onGoBack={handleGoBack}
        isLoading={isLoading}
      />
      {renderContent()}
    </View>
  );
};

export default PublicationScreen;