import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from '../styles/publicationStyles';

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
      // TODO: Implement your API call here
      console.log('Sharing post:', {
        image: imageToShare,
        title,
        description,
      });
      
      setSelectedImage(null);
      setCroppedImage(null);
      setTitle('');
      setDescription('');
      setStep('select');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to share post');
      console.error(error);
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
            setTitle={setTitle}
            setDescription={setDescription}
            username="Username" // À remplacer par le vrai username
            userAvatar="https://via.placeholder.com/32" // À remplacer par le vrai avatar
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
      />
      {renderContent()}
    </View>
  );
};

export default PublicationScreen;