import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ErrorType } from '../../services/axiosConfig';
import { feedbackMessageStyles } from '../../styles/components/feedbackMessageStyles';

// Types de feedback
export enum FeedbackType {
  ERROR = 'error',
  WARNING = 'warning',
  SUCCESS = 'success',
  INFO = 'info'
}

// Interfaces
interface FeedbackMessageProps {
  message: string;
  type?: FeedbackType;
  duration?: number; // en millisecondes
  onDismiss?: () => void;
  errorType?: ErrorType; // pour les erreurs API
  visible: boolean;
  testID?: string;
}

/**
 * Composant pour afficher des messages de feedback à l'utilisateur
 * (erreurs, avertissements, succès, etc.)
 */
const FeedbackMessage: React.FC<FeedbackMessageProps> = ({
  message,
  type = FeedbackType.INFO,
  duration = 5000, // 5 seconds by default
  onDismiss,
  errorType,
  visible,
  testID
}) => {
  const [opacity] = useState(new Animated.Value(0));

  const handleDismiss = useCallback(() => {
    // Animation de disparition
    Animated.timing(opacity, {
      toValue: 0,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start(() => {
      if (onDismiss) {
        onDismiss();
      }
    });
  }, [opacity, onDismiss]);

  useEffect(() => {
    if (visible) {
      // Animation d'apparition
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start();

      // Si duration > 0, configurer la disparition automatique
      if (duration > 0) {
        const timer = setTimeout(() => {
          handleDismiss();
        }, duration);

        return () => clearTimeout(timer);
      }
    } else {
      // Réinitialiser l'opacité si le composant devient invisible
      opacity.setValue(0);
    }
  }, [visible, duration, handleDismiss, opacity]);

  // Définir l'icône et les couleurs en fonction du type
  let iconName: string;
  let containerStyle;

  switch (type) {
    case FeedbackType.ERROR:
      iconName = 'alert-circle';
      containerStyle = feedbackMessageStyles.errorContainer;
      break;
    case FeedbackType.WARNING:
      iconName = 'warning';
      containerStyle = feedbackMessageStyles.warningContainer;
      break;
    case FeedbackType.SUCCESS:
      iconName = 'checkmark-circle';
      containerStyle = feedbackMessageStyles.successContainer;
      break;
    case FeedbackType.INFO:
    default:
      iconName = 'information-circle';
      containerStyle = feedbackMessageStyles.infoContainer;
      break;
  }

  // Adapter le message en fonction du type d'erreur API
  let displayMessage = message;

  if (type === FeedbackType.ERROR && errorType) {
    switch (errorType) {
      case ErrorType.NETWORK:
        displayMessage = "Connection problem. Please check your internet connection.";
        break;
      case ErrorType.SERVER:
        displayMessage = "The server is experiencing an issue. Please try again later.";
        break;
      case ErrorType.TIMEOUT:
        displayMessage = "The request took too long. Please try again.";
        break;
    }
  }

  if (!visible) {
    return null;
  }

  return (
    <Animated.View 
      style={[
        feedbackMessageStyles.container,
        containerStyle,
        { opacity, transform: [{ translateY: opacity.interpolate({
          inputRange: [0, 1],
          outputRange: [-20, 0]
        })}] }
      ]}
      testID={testID || 'feedback-container'}
    >
      <View style={feedbackMessageStyles.content}>
        <Ionicons name={iconName as any} size={24} color="white" style={feedbackMessageStyles.icon} />
        <Text style={feedbackMessageStyles.message}>{displayMessage}</Text>
      </View>
      <TouchableOpacity 
        onPress={handleDismiss} 
        style={feedbackMessageStyles.closeButton}
        testID="feedback-close-button"
      >
        <Ionicons name="close" size={20} color="white" />
      </TouchableOpacity>
    </Animated.View>
  );
};

export default FeedbackMessage; 