import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import styles from '../../styles/publicationStyles';

interface HeaderProps {
  isCropping: boolean;
  isLastStep?: boolean;
  onBack: () => void;
  onConfirm: () => void;
  onNext: () => void;
  onGoBack: () => void;
  isLoading?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  isCropping,
  isLastStep = false,
  onBack,
  onConfirm,
  onNext,
  onGoBack,
  isLoading = false
}) => {
  const handleNext = () => {
    if (onNext && !isLoading) {
      onNext();
    }
  };

  return (
    <View style={styles.header}>
      {isCropping ? (
        <>
          <TouchableOpacity 
            onPress={onBack}
            style={styles.backButton}
            disabled={isLoading}
          >
            <FontAwesome name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={onConfirm}
            style={styles.headerButton}
            disabled={isLoading}
          >
            <Text style={styles.cropConfirmText}>Done</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <View style={styles.headerLeft}>
            <TouchableOpacity 
              onPress={onGoBack} 
              style={styles.backButton}
              disabled={isLoading}
            >
              <FontAwesome name="arrow-left" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>New Post</Text>
          </View>
          <TouchableOpacity 
            style={[
              isLastStep ? styles.nextButtonShare : styles.nextButton,
              isLoading && styles.buttonDisabled
            ]}
            onPress={handleNext}
            disabled={isLoading}
          >
            {isLoading && isLastStep ? (
              <ActivityIndicator size="small" color="#fff" style={styles.buttonLoader} />
            ) : (
              <Text style={isLastStep ? styles.nextButtonShareText : styles.nextButtonText}>
                {isLastStep ? "Share" : "Next"}
              </Text>
            )}
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default Header; 