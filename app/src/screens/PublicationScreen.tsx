import React, { useState, useEffect } from 'react';
import { View, Alert, SafeAreaView, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import * as FileSystem from 'expo-file-system';
import styles from '../styles/screens/publicationStyles';
import postService from '../services/postService';
import FeedbackMessage, { FeedbackType } from '../components/FeedbackMessage';
import { useAuth } from '../context/AuthContext';
import { CloudinaryUploadResponse } from '../services/cloudinary.service';

import Header from '../components/Publication/Header';
import MediaSection from '../components/Publication/MediaSection';
import ImageViewer from '../components/Publication/ImageViewer';
import PublicationForm from '../components/Publication/PublicationForm';

/**
 * Écran de publication de post
 * 
 * TODO: Fonctionnalités à implémenter dans les prochaines itérations:
 * 1. Gestion des images: intégration complète avec Cloudinary pour le stockage et l'optimisation
 * 
 * Implémentation actuelle:
 * - Création de posts avec titre et description
 * - Upload automatique vers Cloudinary avec optimisation
 * - Gestion des tags: implémentation côté client qui crée les tags et tente de les associer aux posts
 * - URLs optimisées pour les images avec transformations automatiques
 */

const PublicationScreen: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [step, setStep] = useState<'select' | 'crop' | 'form'>('select');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImagePublicId, setSelectedImagePublicId] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [resourceType, setResourceType] = useState<string>('image');
  const [feedback, setFeedback] = useState({
    visible: false,
    message: '',
    type: FeedbackType.SUCCESS
  });
  
  const [username, setUsername] = useState('Username');
  const [userAvatar, setUserAvatar] = useState('https://via.placeholder.com/32');
  
  // Mettre à jour les informations utilisateur lorsqu'ils sont disponibles
  useEffect(() => {
    if (user) {
      setUsername(user.username);
      if (user.photoURL) {
        setUserAvatar(user.photoURL);
      }
    }
  }, [user]);

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
              router.back();
            }
          },
        ]
      );
    } else {
      router.back();
    }
  };

  const hideFeedback = () => {
    setFeedback(prev => ({ ...prev, visible: false }));
  };
  
  const handleShare = async () => {
    const imageToShare = croppedImage || selectedImage;
    
    if (!imageToShare || !title.trim()) {
      Alert.alert('Error', 'Please add an image and title');
      return;
    }
    
    if (!user) {
      setFeedback({
        visible: true,
        message: 'You must be logged in to create a post',
        type: FeedbackType.ERROR
      });
      return;
    }

    try {
      setIsLoading(true);
      
      // Objet post avec informations Cloudinary
      const newPost = {
        title: title,
        body: description,
        userId: parseInt(user.id),
        // Inclure les informations Cloudinary directement
        cloudinaryUrl: imageToShare,
        cloudinaryPublicId: selectedImagePublicId,
        // Métadonnées pour l'optimisation (en JSON string)
        imageMetadata: JSON.stringify({
          originalUrl: selectedImage,
          optimizedUrl: imageToShare,
          publicId: selectedImagePublicId,
          uploadedAt: new Date().toISOString(),
          resource_type: resourceType,
          format: resourceType === 'video' ? 'mp4' : 'auto',
          mediaType: resourceType,
        })
      };
      
      console.log('Sending post data with Cloudinary info:', newPost);
      console.log('With tags:', tags);
      
      // Appeler l'API pour créer le post avec les tags
      const createdPost = await postService.createPostWithTags(newPost, tags);
      
      // Réinitialiser le formulaire
      setSelectedImage(null);
      setSelectedImagePublicId(null);
      setCroppedImage(null);
      setTitle('');
      setDescription('');
      setTags([]);
      setStep('select');
      
      // Afficher un message de succès
      setFeedback({
        visible: true,
        message: 'Post created successfully with optimized images!',
        type: FeedbackType.SUCCESS
      });
      
      // Rediriger vers la page d'accueil après un court délai
      setTimeout(() => {
        router.replace('/(app)/(tabs)');
      }, 1500);
      
    } catch (error) {
      console.error('Error creating post:', error);
      setFeedback({
        visible: true,
        message: 'Failed to create post. Please try again.',
        type: FeedbackType.ERROR
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageSelected = (cloudinaryResponse: CloudinaryUploadResponse) => {
    console.log('📸 Media selected from Cloudinary:', {
      resource_type: cloudinaryResponse.resource_type,
      format: cloudinaryResponse.format,
      secure_url: cloudinaryResponse.secure_url,
      public_id: cloudinaryResponse.public_id
    });
    
    setSelectedImage(cloudinaryResponse.secure_url);
    setCroppedImage(cloudinaryResponse.secure_url);
    setSelectedImagePublicId(cloudinaryResponse.public_id);
    
    // Stocker le type de ressource pour les métadonnées
    const resourceType = cloudinaryResponse.resource_type || 'image';
    setResourceType(resourceType);
    console.log('📸 Resource type set to:', resourceType);
    
    // Les vidéos sautent directement au formulaire, pas de crop
    if (resourceType === 'video') {
      console.log('📹 Video detected, skipping crop step');
      setStep('form');
    } else {
      setStep('crop');
    }
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
    console.log('handleTagsChange called with:', newTags);
    console.log('Current tags before update:', tags);
    setTags(newTags);
    console.log('Tags updated in PublicationScreen');
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
            username={username}
            userAvatar={userAvatar}
            isLoading={isLoading}
            mediaType={resourceType as 'image' | 'video'}
            publicId={selectedImagePublicId || undefined}
          />
        ) : null;
      
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Header 
        isCropping={step === 'crop'}
        isLastStep={step === 'form'}
        onBack={handleBack}
        onConfirm={handleNext}
        onNext={step === 'form' ? handleShare : handleNext}
        onGoBack={handleGoBack}
        isLoading={isLoading}
      />
      <View style={styles.contentContainer}>
        {renderContent()}
      </View>
      <FeedbackMessage
        visible={feedback.visible}
        message={feedback.message}
        type={feedback.type}
        duration={3000}
        onDismiss={hideFeedback}
      />
    </SafeAreaView>
  );
};

export default PublicationScreen;