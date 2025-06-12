import React from 'react';
import { View, Image, TouchableOpacity, Text, SafeAreaView, StatusBar } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import styles from '../../styles/screens/publicationStyles';

// Racing color palette
const THEME_COLORS = {
  primary: '#E10600', // Racing Red
  secondary: '#1E1E1E', // Racing Black
  background: '#FFFFFF',
  textPrimary: '#1E1E1E',
  cardLight: '#F8F9FA',
  border: '#E5E5E5',
};

interface ImageViewerProps {
  imageUri: string;
  onImageChange: (newUri: string) => void;
  onNext: () => void;
  onGoBack: () => void;
  isLastStep?: boolean;
}

const ImageViewer: React.FC<ImageViewerProps> = ({
  imageUri,
  onNext,
  isLastStep = false
}) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={THEME_COLORS.background} />
      
      <View style={styles.viewerContainer}>
        <View style={styles.imageViewerContainer}>
          <Image
            source={{ uri: imageUri }}
            style={styles.previewImage}
            resizeMode="cover"
          />
        </View>
        
        <View style={styles.imageViewerControls}>
          <TouchableOpacity 
            style={[styles.nextButton, isLastStep && styles.continueButton]} 
            onPress={onNext}
          >
            <Text style={[styles.nextButtonText, isLastStep && styles.continueButtonText]}>
              {isLastStep ? "Finish" : "Continue"}
            </Text>
            <FontAwesome 
              name="arrow-right" 
              size={16} 
              color={isLastStep ? THEME_COLORS.background : THEME_COLORS.primary} 
              style={{ marginLeft: 5 }}
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ImageViewer;