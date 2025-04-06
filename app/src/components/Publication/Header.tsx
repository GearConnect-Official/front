import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import styles from '../../styles/publicationStyles';

// Palette de couleurs du racing
const THEME_COLORS = {
  primary: '#E10600', // Rouge Racing
  secondary: '#1E1E1E', // Noir Racing
  background: '#FFFFFF',
};

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
            <FontAwesome name="arrow-left" size={24} color={THEME_COLORS.secondary} />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={onConfirm}
            style={styles.headerButton}
            disabled={isLoading}
          >
            <Text style={styles.cropConfirmText}>Terminé</Text>
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
              <FontAwesome name="arrow-left" size={24} color={THEME_COLORS.secondary} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Nouvelle Publication</Text>
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
              <ActivityIndicator size="small" color={THEME_COLORS.background} style={styles.buttonLoader} />
            ) : (
              <Text style={isLastStep ? styles.nextButtonShareText : styles.nextButtonText}>
                {isLastStep ? "Partager" : "Suivant"}
              </Text>
            )}
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default Header; 