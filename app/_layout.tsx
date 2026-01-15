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

// Keep Awake Service (prevents expo-av keep-awake errors)
import { keepAwakeService } from './src/services/keepAwakeService';

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

// Initialize keep-awake immediately (before component mount) to prevent expo-av errors
// This must happen synchronously before any Video components are rendered
keepAwakeService.initialize().catch((error) => {
  // Non-critical error, just log it
  console.warn('⚠️ [RootLayout] KeepAwake initialization failed (non-critical):', error);
});

// Set up global error handlers immediately (before component mount)
const ErrorUtils = (global as any).ErrorUtils;

if (ErrorUtils) {
  const originalHandler = ErrorUtils.getGlobalHandler();
  
  ErrorUtils.setGlobalHandler((error: Error, isFatal?: boolean) => {
    const errorMessage = error?.message || error?.toString() || '';

    // Silently handle "Unable to activate keep awake" errors from expo-av
    if (errorMessage.includes('Unable to activate keep awake') || 
        errorMessage.includes('keep awake')) {
      // This is a non-critical error from expo-av, we can safely ignore it
      return;
    }

    // For other errors, use the original handler
    if (originalHandler) {
      originalHandler(error, isFatal);
    } else {
      console.error('Unhandled error:', error);
    }
  });
}

// Handle unhandled promise rejections (this is where the error actually comes from)
// React Native uses promise/setimmediate/rejection-tracking for unhandled promise rejections
try {
  const rejectionTracking = require('promise/setimmediate/rejection-tracking');
  if (rejectionTracking && rejectionTracking.enable) {
    rejectionTracking.enable({
      allRejections: true,
      onUnhandled: (id: number, error: Error) => {
        const errorMessage = error?.message || error?.toString() || '';

        // Silently handle "Unable to activate keep awake" errors from expo-av
        if (errorMessage.includes('Unable to activate keep awake') || 
            errorMessage.includes('keep awake')) {
          // This is a non-critical error from expo-av, we can safely ignore it
          return;
        }

        // For other errors, log them normally
        console.warn('Unhandled promise rejection:', id, error);
      },
      onHandled: (id: number) => {
        // Promise rejection was handled after being unhandled
        // We can ignore this
      },
    });
  }
} catch (error) {
  // rejection-tracking might not be available in all environments
  console.warn('Could not enable promise rejection tracking:', error);
}

export default function RootLayout() {
  // No need for useEffect - handlers are set up at module level

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