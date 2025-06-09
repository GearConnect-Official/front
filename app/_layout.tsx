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
import OfflineScreen from './src/screens/OfflineScreen';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

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

// Connectivity Manager Component
const ConnectivityManager: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isOnline, isInitializing, checkConnection } = useNetworkStatus();
  const [hasShownOfflineScreen, setHasShownOfflineScreen] = React.useState(false);
  
  // Only display the offline screen if we have finished initialization
  // and we cannot access the server
  const showOfflineScreen = !isInitializing && !isOnline;
  
  // Track if we have already displayed the offline screen
  React.useEffect(() => {
    if (showOfflineScreen) {
      setHasShownOfflineScreen(true);
    }
  }, [showOfflineScreen]);
  
  // Retry connection
  const handleRetry = async () => {
    const isNowOnline = await checkConnection();
    
    // If we are now online after retrying, reset the state
    if (isNowOnline) {
      setHasShownOfflineScreen(false);
    }
  };
  
  if (isInitializing) {
    return <LoadingScreen />;
  }
  
  // Only display the offline screen if we have already tried to connect
  // and we are still offline
  if (hasShownOfflineScreen && showOfflineScreen) {
    return <OfflineScreen retry={handleRetry} />;
  }
  
  return <>{children}</>;
};

const CLERK_PUBLISHABLE_KEY =
  "pk_test_b2JsaWdpbmctcHl0aG9uLTgzLmNsZXJrLmFjY291bnRzLmRldiQ";

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <SafeAreaProvider>
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
                </ConnectivityManager>              </FeedbackManager>
            </AuthProvider>
          </AxiosConfigProvider>
        </ThemeProvider>
      </ClerkProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}