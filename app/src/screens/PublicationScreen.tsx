import React, { useState } from 'react';
import { View, Alert, SafeAreaView, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import styles from '../styles/publicationStyles';
import postService from '../services/postService';

import Header from '../components/Publication/Header';
import MediaSection from '../components/Publication/MediaSection';
import ImageViewer from '../components/Publication/ImageViewer';
import PublicationForm from '../components/Publication/PublicationForm';

const PublicationScreen: React.FC = () => {
  const router = useRouter();
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
              router.back();
            }
          },
        ]
      );
    } else {
      router.back();
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
      
      // Simulate loading time
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Reset form values
      setSelectedImage(null);
      setCroppedImage(null);
      setTitle('');
      setDescription('');
      setTags([]);
      setStep('select');
      
      // Display error alert
      Alert.alert('Error', 'Failed to share post', [
        { text: 'OK', onPress: () => {
          // Redirect to home page after user clicks OK
          router.replace('/(app)/(tabs)');
        }}
      ]);
      
    } catch (error) {
      console.error('Error during navigation:', error);
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
            username="Username" // Replace with the real username
            userAvatar="https://via.placeholder.com/32" // Replace with the real avatar
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
    </SafeAreaView>
  );
};

export default PublicationScreen;