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
 * 2. crop - Recadrage de l'image (skip pour vidéos)
 * 3. title - Saisie du titre (obligatoire)
 * 4. description - Saisie de la description (obligatoire)
 * 5. tags - Ajout de tags (optionnel mais encouragé)
 * 6. review - Révision finale et publication
 */

interface FormErrors {
  title?: string;
  description?: string;
  image?: string;
  general?: string;
}

type PublicationStep = 'select' | 'crop' | 'title' | 'description' | 'tags' | 'review';

const PublicationScreen: React.FC = () => {
  const router = useRouter();
  const authContext = useAuth();
  const user = authContext?.user;
  const [step, setStep] = useState<PublicationStep>('select');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImagePublicId, setSelectedImagePublicId] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
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
      case 'select':
        if (!selectedImage) {
          newErrors.image = "Please select an image or video";
        }
        break;
      
      case 'crop':
        const imageToCheck = croppedImage || selectedImage;
        if (!imageToCheck) {
          newErrors.image = "Please crop your image or go back to select another one";
        }
        break;
      
      case 'title':
        if (!title.trim()) {
          newErrors.title = "Title is required to continue";
        } else if (title.trim().length < 3) {
          newErrors.title = "Title must be at least 3 characters long";
        } else if (title.trim().length > 100) {
          newErrors.title = "Title cannot exceed 100 characters";
        }
        break;
      
      case 'description':
        if (!description.trim()) {
          newErrors.description = "Description is required to continue";
        } else if (description.trim().length < 10) {
          newErrors.description = "Description must be at least 10 characters long";
        } else if (description.trim().length > 2200) {
          newErrors.description = "Description cannot exceed 2200 characters";
        }
        break;
      
      case 'tags':
        // Tags are optional, always valid
        break;
      
      case 'review':
        // Final validation before submission
        if (!user) {
          newErrors.general = "You must be logged in to create a post";
        }
        if (!title.trim()) {
          newErrors.title = "Title is required";
        }
        if (!description.trim()) {
          newErrors.description = "Description is required";
        }
        if (!selectedImage && !croppedImage) {
          newErrors.image = "Media is required";
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
              setCroppedImage(null);
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
      case 'crop': return 'Crop Image';
      case 'title': return 'Add Title';
      case 'description': return 'Add Description';
      case 'tags': return 'Add Tags';
      case 'review': return 'Review & Publish';
      default: return 'Create Post';
    }
  };

  const getStepNumber = (): { current: number; total: number } => {
    const stepOrder: PublicationStep[] = ['select', 'crop', 'title', 'description', 'tags', 'review'];
    let currentIndex = stepOrder.indexOf(step);
    let totalSteps = stepOrder.length;
    
    // Si c'est une vidéo, on skip l'étape crop
    if (resourceType === 'video') {
      totalSteps = stepOrder.length - 1;
      if (currentIndex > 1) { // Si on est après crop
        currentIndex = currentIndex - 1;
      }
    }
    
    return { current: currentIndex + 1, total: totalSteps };
  };
  
  const handlePublish = async () => {
    if (!validateCurrentStep()) {
      return;
    }

    const imageToShare = croppedImage || selectedImage;

    try {
      setIsLoading(true);
      setErrors({});
      
      // Objet post avec informations Cloudinary
      const newPost = {
        title: title.trim(),
        body: description.trim(),
        userId: parseInt(user!.id.toString()),
        // Inclure les informations Cloudinary directement
        cloudinaryUrl: imageToShare || undefined,
        cloudinaryPublicId: selectedImagePublicId || undefined,
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
      
      // Appeler l'API pour créer le post avec les tags
      await postService.createPostWithTags(newPost, tags);
      
      // Réinitialiser le formulaire
      setSelectedImage(null);
      setSelectedImagePublicId(null);
      setCroppedImage(null);
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
    setCroppedImage(cloudinaryResponse.secure_url);
    setSelectedImagePublicId(cloudinaryResponse.public_id);
    
    // Clear image error when image is selected
    clearError('image');
    
    // Stocker le type de ressource pour les métadonnées
    const resourceType = cloudinaryResponse.resource_type || 'image';
    setResourceType(resourceType);
    
    // Les vidéos sautent directement au formulaire, pas de crop
    if (resourceType === 'video') {
      setStep('title');
    } else {
      setStep('crop');
    }
  };

  const handleImageChange = (newUri: string) => {
    setCroppedImage(newUri);
  };

  const handleNext = () => {
    if (!validateCurrentStep()) {
      return;
    }

    clearError('general');

    switch (step) {
      case 'crop':
        setStep('title');
        break;
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

  const handleBack = () => {
    setErrors({});
    
    switch (step) {
      case 'review':
        setStep('tags');
        break;
      case 'tags':
        setStep('description');
        break;
      case 'description':
        setStep('title');
        break;
      case 'title':
        if (resourceType === 'video') {
          setStep('select');
        } else {
          setStep('crop');
        }
        break;
      case 'crop':
        setStep('select');
        break;
      default:
        handleGoBack();
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
        const imageToShow = croppedImage || selectedImage;
        return imageToShow ? (
          <ReviewStep
            imageUri={imageToShow}
            title={title}
            description={description}
            tags={tags}
            username={username}
            userAvatar={userAvatar}
            mediaType={resourceType as 'image' | 'video'}
            publicId={selectedImagePublicId || undefined}
            error={errors.general}
            isLoading={isLoading}
          />
        ) : null;
      
      default:
        return null;
    }
  };

  const stepInfo = getStepNumber();
  const isLastStep = step === 'review';
  const canGoNext = step !== 'select' && step !== 'crop' && step !== 'review';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Header 
        title={getStepTitle()}
        stepInfo={stepInfo}
        isCropping={step === 'crop'}
        isLastStep={isLastStep}
        canGoNext={canGoNext}
        onBack={handleBack}
        onConfirm={handleNext}
        onNext={handleNext}
        onGoBack={handleGoBack}
        isLoading={isLoading}
      />
      <View style={step === 'select' ? styles.selectStepContainer : styles.contentContainer}>
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