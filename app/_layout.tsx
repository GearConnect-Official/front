import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { ClerkProvider } from '@clerk/clerk-expo';
import { ThemeProvider } from './src/context/ThemeContext';
import AxiosConfigProvider from './src/services/axiosConfig';
import { AuthProvider } from './src/context/AuthContext';
import ErrorBoundary from './src/components/ui/ErrorBoundary';
import FeedbackMessage from './src/components/ui/FeedbackMessage';
import useFeedback from './src/hooks/useFeedback';
import useNetworkStatus from './src/hooks/useNetworkStatus';
import LoadingScreen from './src/screens/LoadingScreen';
import { View } from 'react-native';
import Constants from 'expo-constants';
import * as Sentry from '@sentry/react-native';
import { healthService } from './src/services/healthService';
import { sentryStatusService } from './src/services/sentryStatusService';

Sentry.init({
  dsn: 'https://8d1df89964312395a76fc36c4cff9ddc@o4509488456990720.ingest.de.sentry.io/4509488458498128',

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Configure Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [Sentry.mobileReplayIntegration(), Sentry.feedbackIntegration()],

  // Performance monitoring for status page
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

// Status Monitoring Component - Démarre le monitoring automatique
const StatusMonitoringProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    // Démarrer le monitoring pour le site de statut
    console.log('🔍 Starting status monitoring for status page...');
    
    // Initialiser les services
    sentryStatusService.startStatusMonitoring();
    
    // Reporter le démarrage de l'application
    sentryStatusService.reportDeployment('1.0.0', __DEV__ ? 'development' : 'production');
    
    // Cleanup au démontage
    return () => {
      healthService.stopHealthMonitoring();
    };
  }, []);

  return <>{children}</>;
};

// Feedback Manager Component
const FeedbackManager: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { feedbackState, hideFeedback } = useFeedback();
  
  return (
    <View style={{ flex: 1 }}>
      {children}
      <FeedbackMessage
        message={feedbackState.message}
        type={feedbackState.type}
        duration={feedbackState.duration}
        onDismiss={hideFeedback}
        errorType={feedbackState.errorType}
        visible={feedbackState.visible}
      />
    </View>
  );
};

// Connectivity Manager Component - Now only handles initialization, individual screens handle their own network errors
const ConnectivityManager: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isInitializing } = useNetworkStatus();
  
  if (isInitializing) {
    return <LoadingScreen />;
  }
  
  return <>{children}</>;
};

const CLERK_PUBLISHABLE_KEY = Constants.expoConfig?.extra?.clerkPublishableKey;

console.log('🔑 [RootLayout] Clerk Key:', CLERK_PUBLISHABLE_KEY ? 'Found' : 'Missing');

if (!CLERK_PUBLISHABLE_KEY) {
  console.error('❌ [RootLayout] Missing Clerk publishable key!');
  throw new Error('Missing Clerk publishable key. Please check your environment configuration.');
}

export default Sentry.wrap(function RootLayout() {
  return (
    <ErrorBoundary>
      <StatusMonitoringProvider>
      <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
        <ThemeProvider>
          <AxiosConfigProvider>
            <AuthProvider>
              <FeedbackManager>
                <ConnectivityManager>
                  <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="index" />
                    <Stack.Screen name="(auth)" />
                    <Stack.Screen name="(app)" />
                  </Stack>
                </ConnectivityManager>
              </FeedbackManager>
            </AuthProvider>
          </AxiosConfigProvider>
        </ThemeProvider>
      </ClerkProvider>
      </StatusMonitoringProvider>
    </ErrorBoundary>
  );
});