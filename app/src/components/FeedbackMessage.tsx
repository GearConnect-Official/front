import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ErrorType } from '../services/axiosConfig';

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
  }, [visible]);

  const handleDismiss = () => {
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
  };

  // Définir l'icône et les couleurs en fonction du type
  let iconName: string;
  let containerStyle;

  switch (type) {
    case FeedbackType.ERROR:
      iconName = 'alert-circle';
      containerStyle = styles.errorContainer;
      break;
    case FeedbackType.WARNING:
      iconName = 'warning';
      containerStyle = styles.warningContainer;
      break;
    case FeedbackType.SUCCESS:
      iconName = 'checkmark-circle';
      containerStyle = styles.successContainer;
      break;
    case FeedbackType.INFO:
    default:
      iconName = 'information-circle';
      containerStyle = styles.infoContainer;
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
        styles.container,
        containerStyle,
        { opacity, transform: [{ translateY: opacity.interpolate({
          inputRange: [0, 1],
          outputRange: [-20, 0]
        })}] }
      ]}
      testID={testID || 'feedback-container'}
    >
      <View style={styles.content}>
        <Ionicons name={iconName as any} size={24} color="white" style={styles.icon} />
        <Text style={styles.message}>{displayMessage}</Text>
      </View>
      <TouchableOpacity 
        onPress={handleDismiss} 
        style={styles.closeButton}
        testID="feedback-close-button"
      >
        <Ionicons name="close" size={20} color="white" />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 40,
    left: 20,
    right: 20,
    padding: 10,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1000,
  },
  errorContainer: {
    backgroundColor: '#FF3B30',
  },
  warningContainer: {
    backgroundColor: '#FF9500',
  },
  successContainer: {
    backgroundColor: '#34C759',
  },
  infoContainer: {
    backgroundColor: '#007AFF',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 10,
  },
  message: {
    color: 'white',
    flex: 1,
    fontSize: 14,
  },
  closeButton: {
    padding: 5,
  },
});

export default FeedbackMessage; 