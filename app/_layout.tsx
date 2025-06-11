import React from 'react';
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

export default function RootLayout() {
  return (
    <ErrorBoundary>
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
    </ErrorBoundary>
  );
} 