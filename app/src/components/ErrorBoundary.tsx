import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import FeedbackMessage, { FeedbackType } from './FeedbackMessage';
import { ErrorType } from '../services/axiosConfig';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  showFeedback: boolean;
}

/**
 * Composant qui intercepte les erreurs JavaScript non capturées
 * et affiche une interface de secours.
 */
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      showFeedback: false
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Mettre à jour l'état pour afficher l'UI de secours
    return {
      hasError: true,
      error,
      showFeedback: true
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log de l'erreur pour le débogage
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      showFeedback: false
    });
  };

  render() {
    const { hasError, error, showFeedback } = this.state;
    const { children, fallback } = this.props;

    // Si une erreur a été interceptée et qu'un fallback est fourni, afficher le fallback
    if (hasError && fallback) {
      return fallback;
    }

    // Si une erreur a été interceptée mais pas de fallback, afficher une UI par défaut
    if (hasError) {
      return (
        <View style={styles.container}>
          <Image
            source={require('../../assets/images/icon.png')}
            style={styles.errorImage}
            resizeMode="contain"
          />
          <Text style={styles.title}>Oups! Une erreur est survenue</Text>
          <Text style={styles.message}>{error?.message || 'Une erreur inattendue s\'est produite'}</Text>
          <TouchableOpacity 
            style={styles.button}
            onPress={this.resetError}
          >
            <Text style={styles.buttonText}>Réessayer</Text>
          </TouchableOpacity>

          <FeedbackMessage
            visible={showFeedback}
            message="Une erreur non gérée s'est produite."
            type={FeedbackType.ERROR}
            onDismiss={() => this.setState({ showFeedback: false })}
          />
        </View>
      );
    }

    // Sinon, afficher les enfants normalement
    return children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F7F9FC',
  },
  errorImage: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#33384E',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ErrorBoundary; 