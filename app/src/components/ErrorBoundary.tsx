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
 * Component that intercepts uncaught JavaScript errors
 * and displays a fallback interface.
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
    // Update state to display fallback UI
    return {
      hasError: true,
      error,
      showFeedback: true
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error for debugging
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

    // If an error was caught and a fallback is provided, display the fallback
    if (hasError && fallback) {
      return fallback;
    }

    // If an error was caught but no fallback is provided, display a default UI
    if (hasError) {
      return (
        <View style={styles.container}>
          <Image
            source={require('../../assets/images/icon.png')}
            style={styles.errorImage}
            resizeMode="contain"
          />
          <Text style={styles.title}>Oops! An error occurred</Text>
          <Text style={styles.message}>{error?.message || 'An unexpected error occurred'}</Text>
          <TouchableOpacity 
            style={styles.button}
            onPress={this.resetError}
          >
            <Text style={styles.buttonText}>Try Again</Text>
          </TouchableOpacity>

          <FeedbackMessage
            visible={showFeedback}
            message="An unhandled error occurred."
            type={FeedbackType.ERROR}
            onDismiss={() => this.setState({ showFeedback: false })}
          />
        </View>
      );
    }

    // Otherwise, display children normally
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