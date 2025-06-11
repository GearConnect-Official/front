import * as React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import styles from '../../styles/screens/createEventStyles';

interface NavigationButtonsProps {
  currentStep: number;
  isLastStep: boolean;
  loading: boolean;
  onPrev: () => void;
  onNext: () => void;
  onSubmit: () => void;
  isEditing?: boolean; // Optional flag to indicate we're editing an existing event
}

const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  currentStep,
  isLastStep,
  loading,
  onPrev,
  onNext,
  onSubmit,
  isEditing = false,
}) => {
  return (
    <View style={styles.buttonsContainer}>
      {currentStep > 1 && (
        <TouchableOpacity style={styles.backButton} onPress={onPrev}>
          <FontAwesome name="arrow-left" size={16} color="#666" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      )}

      {isLastStep ? (
        <TouchableOpacity
          style={[styles.nextButton, { backgroundColor: '#28a745' }]}
          onPress={onSubmit}
          disabled={loading}
        >
          {loading ? (
            <Text style={styles.nextButtonText}>
              {isEditing ? 'Saving...' : 'Publishing...'}
            </Text>
          ) : (
            <>
              <Text style={styles.nextButtonText}>
                {isEditing ? "Save Changes" : "Publish Event"}
              </Text>
              <FontAwesome name="check" size={16} color="#fff" />
            </>
          )}
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.nextButton} onPress={onNext}>
          <Text style={styles.nextButtonText}>Continue</Text>
          <FontAwesome name="arrow-right" size={16} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default NavigationButtons;
