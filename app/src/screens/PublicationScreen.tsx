import React, { useState, useEffect } from 'react';
import { View, Alert, SafeAreaView, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import * as FileSystem from 'expo-file-system';
import styles from '../styles/publicationStyles';
import postService from '../services/postService';
import FeedbackMessage, { FeedbackType } from '../components/FeedbackMessage';
import { useAuth } from '../context/AuthContext';

import Header from '../components/Publication/Header';
import MediaSection from '../components/Publication/MediaSection';
import ImageViewer from '../components/Publication/ImageViewer';
import PublicationForm from '../components/Publication/PublicationForm';

/**
 * Écran de publication de post
 * 
 * TODO: Fonctionnalités à implémenter dans les prochaines itérations:
 * 1. Gestion des images: ajout d'une solution robuste pour la compression et l'upload d'images
 * 
 * Implémentation actuelle:
 * - Création de posts avec titre et description
 * - Gestion des tags: implémentation côté client qui crée les tags et tente de les associer aux posts
 * - Nous avons créé une méthode côté client qui suggère également l'implémentation côté serveur
 * - Même si l'API d'association tag-post n'est pas disponible, le code est prêt à l'utiliser dès qu'elle sera implémentée
 */

const PublicationScreen: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [step, setStep] = useState<'select' | 'crop' | 'form'>('select');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
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
      
      // TODO: Implémenter la gestion des images côté front une fois qu'une solution de stockage
      // appropriée sera mise en place côté back. Pour l'instant, nous ne gérons pas les images
      // pour éviter les problèmes de performance et de stockage.
      
      // Objet post selon la structure dans PostController
      const newPost = {
        title: title,
        body: description,
        userId: parseInt(user.id)
        // Ne pas envoyer imageId pour le moment
      };
      
      console.log('Sending post data:', newPost);
      console.log('With tags:', tags);
      
      // Appeler l'API pour créer le post avec les tags
      const createdPost = await postService.createPostWithTags(newPost, tags);
      
      // Réinitialiser le formulaire
      setSelectedImage(null);
      setCroppedImage(null);
      setTitle('');
      setDescription('');
      setTags([]);
      setStep('select');
      
      // Afficher un message de succès
      setFeedback({
        visible: true,
        message: 'Post created successfully!',
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
            username={username}
            userAvatar={userAvatar}
            isLoading={isLoading}
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