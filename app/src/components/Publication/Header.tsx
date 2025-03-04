import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import styles from '../../styles/publicationStyles';

interface HeaderProps {
  isCropping: boolean;
  isLastStep?: boolean;
  onBack: () => void;
  onConfirm: () => void;
  onNext: () => void;
  onGoBack: () => void;
}

const Header: React.FC<HeaderProps> = ({
  isCropping,
  isLastStep = false,
  onBack,
  onConfirm,
  onNext,
  onGoBack
}) => {
  const handleNext = () => {
    if (onNext) {
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
          >
            <FontAwesome name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={onConfirm}
            style={styles.headerButton}
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
            >
              <FontAwesome name="arrow-left" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>New Post</Text>
          </View>
          <TouchableOpacity 
            style={[
              isLastStep ? styles.nextButtonShare : styles.nextButton
            ]}
            onPress={handleNext}
          >
            <Text style={isLastStep ? styles.nextButtonShareText : styles.nextButtonText}>
              {isLastStep ? "Share" : "Next"}
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default Header; 