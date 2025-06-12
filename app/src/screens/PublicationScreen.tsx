import React, { useState, useEffect } from 'react';
import { View, Alert, SafeAreaView, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import styles from '../styles/screens/publicationStyles';
import postService from '../services/postService';
import FeedbackMessage, { FeedbackType } from '../components/ui/FeedbackMessage';
import { useAuth } from '../context/AuthContext';
import { CloudinaryUploadResponse } from '../services/cloudinary.service';

import Header from '../components/Publication/Header';
import MediaSection from '../components/Publication/MediaSection';
import ImageViewer from '../components/Publication/ImageViewer';
import TitleStep from '../components/Publication/TitleStep';
import DescriptionStep from '../components/Publication/DescriptionStep';
import TagsStep from '../components/Publication/TagsStep';
import ReviewStep from '../components/Publication/ReviewStep';

/**
 * Écran de publication de post avec processus étape par étape
 * 
 * Étapes:
 * 1. select - Sélection du média
 * 2. title - Saisie du titre (obligatoire)
 * 3. description - Saisie de la description (obligatoire)
 * 4. tags - Ajout de tags (optionnel mais encouragé)
 * 5. review - Révision finale et publication
 */

interface FormErrors {
  title?: string;
  description?: string;
  image?: string;
  general?: string;
}

type PublicationStep = 'select' | 'title' | 'description' | 'tags' | 'review';

const PublicationScreen: React.FC = () => {
  const router = useRouter();
  const authContext = useAuth();
  const user = authContext?.user;
  const [step, setStep] = useState<PublicationStep>('select');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImagePublicId, setSelectedImagePublicId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [resourceType, setResourceType] = useState<string>('image');
  const [errors, setErrors] = useState<FormErrors>({});
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
      setUsername(user.username || 'User');
      if (user.photoURL) {
        setUserAvatar(user.photoURL);
      }
    }
  }, [user]);

  const validateCurrentStep = (): boolean => {
    const newErrors: FormErrors = {};

    switch (step) {
      case 'title':
        if (!title.trim()) {
          newErrors.title = "Title is required";
        } else if (title.trim().length < 3) {
          newErrors.title = "Title must be at least 3 characters";
        } else if (title.trim().length > 100) {
          newErrors.title = "Title must be less than 100 characters";
        }
        break;

      case 'description':
        if (!description.trim()) {
          newErrors.description = "Description is required";
        } else if (description.trim().length < 10) {
          newErrors.description = "Description must be at least 10 characters";
        } else if (description.trim().length > 500) {
          newErrors.description = "Description must be less than 500 characters";
        }
        break;

      case 'review':
        // Validation finale
        if (!title.trim()) {
          newErrors.title = "Title is required";
        }
        if (!description.trim()) {
          newErrors.description = "Description is required";
        }
        if (!selectedImage) {
          newErrors.image = "An image is required";
        }
        break;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return false;
    }

    return true;
  };

  const clearError = (field: keyof FormErrors) => {
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

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
              setTitle('');
              setDescription('');
              setTags([]);
              setErrors({});
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

  const getStepTitle = (): string => {
    switch (step) {
      case 'select': return 'Select Media';
      case 'title': return 'Add Title';
      case 'description': return 'Add Description';
      case 'tags': return 'Add Tags';
      case 'review': return 'Review & Publish';
      default: return 'Create Post';
    }
  };

  const getStepNumber = (): { current: number; total: number } => {
    const stepOrder: PublicationStep[] = ['select', 'title', 'description', 'tags', 'review'];
    let currentIndex = stepOrder.indexOf(step);
    let totalSteps = stepOrder.length;
    
    return { current: currentIndex + 1, total: totalSteps };
  };
  
  const handlePublish = async () => {
    if (!validateCurrentStep()) {
      return;
    }

    try {
      setIsLoading(true);
      setErrors({});
      
      // Objet post avec informations Cloudinary
      const newPost = {
        title: title.trim(),
        body: description.trim(),
        userId: parseInt(user!.id.toString()),
        // Inclure les informations Cloudinary directement
        cloudinaryUrl: selectedImage || undefined,
        cloudinaryPublicId: selectedImagePublicId || undefined,
        // Métadonnées pour l'optimisation (en JSON string)
        imageMetadata: JSON.stringify({
          originalUrl: selectedImage,
          optimizedUrl: selectedImage,
          publicId: selectedImagePublicId,
          uploadedAt: new Date().toISOString(),
          resource_type: resourceType,
          format: resourceType === 'video' ? 'mp4' : 'auto',
          mediaType: resourceType,
        })
      };
      
      // Appeler l'API pour créer le post avec les tags
      await postService.createPostWithTags(newPost, tags);
      
      // Réinitialiser le formulaire
      setSelectedImage(null);
      setSelectedImagePublicId(null);
      setTitle('');
      setDescription('');
      setTags([]);
      setErrors({});
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
      
    } catch (error: any) {
      let errorMessage = 'Failed to create post. Please try again.';
      
      // Gestion spécifique des erreurs
      if (error?.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      setErrors({ general: errorMessage });
      
      setFeedback({
        visible: true,
        message: errorMessage,
        type: FeedbackType.ERROR
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageSelected = (cloudinaryResponse: CloudinaryUploadResponse) => {
    setSelectedImage(cloudinaryResponse.secure_url);
    setSelectedImagePublicId(cloudinaryResponse.public_id);
    
    // Clear image error when image is selected
    clearError('image');
    
    // Stocker le type de ressource pour les métadonnées
    const resourceType = cloudinaryResponse.resource_type || 'image';
    setResourceType(resourceType);
    
    // Passer directement au titre après la sélection
    setStep('title');
  };

  const handleImageChange = (newUri: string) => {
    setSelectedImage(newUri);
  };

  const handleNext = () => {
    if (!validateCurrentStep()) {
      return;
    }

    clearError('general');

    switch (step) {
      case 'title':
        setStep('description');
        break;
      case 'description':
        setStep('tags');
        break;
      case 'tags':
        setStep('review');
        break;
      case 'review':
        handlePublish();
        break;
      default:
        break;
    }
  };

  const handlePrev = () => {
    clearError('general');

    switch (step) {
      case 'title':
        setStep('select');
        break;
      case 'description':
        setStep('title');
        break;
      case 'tags':
        setStep('description');
        break;
      case 'review':
        setStep('tags');
        break;
      default:
        break;
    }
  };

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    clearError('title');
  };

  const handleDescriptionChange = (newDescription: string) => {
    setDescription(newDescription);
    clearError('description');
  };

  const handleTagsChange = (newTags: string[]) => {
    setTags(newTags);
  };

  const renderCurrentStep = () => {
    switch (step) {
      case 'select':
        return (
          <MediaSection 
            onImageSelected={handleImageSelected}
          />
        );

      case 'title':
        return (
          <TitleStep
            title={title}
            onTitleChange={handleTitleChange}
            error={errors.title}
            isLoading={isLoading}
          />
        );

      case 'description':
        return (
          <DescriptionStep
            description={description}
            onDescriptionChange={handleDescriptionChange}
            error={errors.description}
            isLoading={isLoading}
          />
        );

      case 'tags':
        return (
          <TagsStep
            tags={tags}
            onTagsChange={handleTagsChange}
            isLoading={isLoading}
          />
        );

      case 'review':
        return (
          <ReviewStep
            title={title}
            description={description}
            tags={tags}
            imageUri={selectedImage || ''}
            username={username}
            userAvatar={userAvatar}
            mediaType={resourceType as 'image' | 'video'}
            isLoading={isLoading}
            error={errors.general}
          />
        );

      default:
        return null;
    }
  };

  // Calculer si on peut aller au suivant
  const canGoNext = step !== 'select' && step !== 'review';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      <Header
        title={getStepTitle()}
        stepInfo={getStepNumber()}
        isCropping={false}
        isLastStep={step === 'review'}
        canGoNext={canGoNext}
        onBack={handlePrev}
        onConfirm={handleNext}
        onNext={handleNext}
        onGoBack={handleGoBack}
        isLoading={isLoading}
      />

      {renderCurrentStep()}

      <FeedbackMessage
        visible={feedback.visible}
        message={feedback.message}
        type={feedback.type}
        onDismiss={hideFeedback}
      />
    </SafeAreaView>
  );
};

export default PublicationScreen;