import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StatusBar } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import styles from '../../styles/screens/publicationStyles';

// Racing color palette
const THEME_COLORS = {
  primary: '#E10600', // Racing Red
  secondary: '#1E1E1E', // Racing Black
  background: '#FFFFFF',
};

interface HeaderProps {
  title?: string;
  stepInfo?: { current: number; total: number };
  isCropping: boolean;
  isLastStep?: boolean;
  canGoNext?: boolean;
  onBack: () => void;
  onConfirm: () => void;
  onNext: () => void;
  onGoBack: () => void;
  isLoading?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  title = 'New Post',
  stepInfo,
  isCropping,
  isLastStep = false,
  canGoNext = false,
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

  const getNextButtonText = () => {
    if (isLastStep) return 'Publish';
    return 'Next';
  };

  return (
    <View style={styles.header}>
      <StatusBar barStyle="dark-content" backgroundColor={THEME_COLORS.background} />
      {isCropping ? (
        <>
          <TouchableOpacity 
            onPress={onBack}
            style={styles.backButton}
            disabled={isLoading}
          >
            <FontAwesome name="arrow-left" size={20} color={THEME_COLORS.secondary} />
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
          <TouchableOpacity 
            onPress={onGoBack} 
            style={styles.backButton}
            disabled={isLoading}
          >
            <FontAwesome name="arrow-left" size={20} color={THEME_COLORS.secondary} />
          </TouchableOpacity>
          
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>{title}</Text>
            {stepInfo && (
              <Text style={styles.stepIndicator}>
                Step {stepInfo.current} of {stepInfo.total}
              </Text>
            )}
          </View>
          
          {(isLastStep || canGoNext) ? (
            <TouchableOpacity 
              style={[
                isLastStep ? styles.nextButtonShare : styles.nextButton,
                isLoading && styles.buttonDisabled
              ]}
              onPress={handleNext}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color={THEME_COLORS.background} style={styles.buttonLoader} />
              ) : (
                <Text style={isLastStep ? styles.nextButtonShareText : styles.nextButtonText}>
                  {getNextButtonText()}
                </Text>
              )}
            </TouchableOpacity>
          ) : (
            <View style={styles.placeholderRight} />
          )}
        </>
      )}
    </View>
  );
};

export default Header; 