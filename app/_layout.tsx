import React from 'react';
import { Stack } from 'expo-router';
import { ClerkProvider } from '@clerk/clerk-expo';
import { ThemeProvider } from './src/context/ThemeContext';
import AxiosConfigProvider from './src/services/axiosConfig';
import { AuthProvider } from './src/context/AuthContext';
import ErrorBoundary from './src/components/ui/ErrorBoundary';

// NOUVEAU: Système de messages centralisé
import { MessageProvider } from './src/context/MessageContext';
import MessageDisplay from './src/components/ui/MessageProvider';

// Mixpanel
import { MixpanelProvider } from './src/context/MixpanelContext';

import useNetworkStatus from './src/hooks/useNetworkStatus';
import LoadingScreen from './src/screens/LoadingScreen';
import Constants from 'expo-constants';
import { SafeAreaProvider } from 'react-native-safe-area-context';

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
      <SafeAreaProvider>
        <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
          <ThemeProvider>
            <AxiosConfigProvider>
              <AuthProvider>
                <MixpanelProvider>
                  {/* NOUVEAU: MessageProvider remplace FeedbackManager */}
                  <MessageProvider>
                    <MessageDisplay>
                      <ConnectivityManager>
                        <Stack screenOptions={{ headerShown: false }}>
                          <Stack.Screen name="index" />
                          <Stack.Screen name="(auth)" />
                          <Stack.Screen name="(app)" />
                        </Stack>
                      </ConnectivityManager>
                    </MessageDisplay>
                  </MessageProvider>
                </MixpanelProvider>
              </AuthProvider>
            </AxiosConfigProvider>
          </ThemeProvider>
        </ClerkProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}