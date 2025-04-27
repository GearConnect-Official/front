import React, { useState, useEffect } from "react";
import { ClerkProvider } from "@clerk/clerk-expo";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Platform, View } from "react-native";
import AuthScreen from "./src/screens/AuthScreen";
import WelcomeScreen from "./src/screens/WelcomeScreen";
import JobsScreen from "./src/screens/JobsScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import ForgotPasswordScreen from "./src/screens/ForgotPasswordScreen";
import FriendRequestScreen from "./src/screens/FriendRequestScreen";
import HomeScreen from "./src/screens/HomeScreen";
import EventsScreen from "./src/screens/EventsScreen";
import EventDetailScreen from "./src/screens/EventDetailScreen";
import BottomNav from "./src/components/BottomNav";
import { NavigationContainer } from "@react-navigation/native";
import CreateJobOfferScreen from "./src/screens/CreateJobOfferScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import CreateEventScreen from "./src/screens/CreateEventScreen";
import PublicationScreen from "./src/screens/PublicationScreen";
import { AuthProvider, useAuth } from "./src/context/AuthContext";
import LoadingScreen from "./src/screens/LoadingScreen";
import VerifyScreen from "./src/screens/VerifyScreen";
import ThemeProvider from "./src/styles/ThemeProvider";
import ProfileUserScreen from "./src/screens/ProfileUserScreen";
import AxiosConfigProvider from "./src/services/axiosConfig";
import ErrorBoundary from "./src/components/ErrorBoundary";
import FeedbackMessage from "./src/components/FeedbackMessage";
import useFeedback from "./src/hooks/useFeedback";
import useNetworkStatus from "./src/hooks/useNetworkStatus";
import OfflineScreen from "./src/screens/OfflineScreen";
import CreateRelatedProductScreen from "./src/screens/CreateRelatedProductScreen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export type RootStackParamList = {
  Welcome: undefined;
  Auth: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  Home: undefined;
  Events: undefined;
  Network: undefined;
  Publication: undefined;
  Jobs: undefined;
  EventDetail: { eventId: number };
  RelatedProduct: { eventId: number };
  FriendRequest: undefined;
  CreateJobOffer: undefined;
  Profile: undefined;
  PublicationScreen: undefined;
  BottomTabs: undefined;
  Verify: undefined;
};

// Bottom tab navigation (with `BottomNav` as `tabBar`)
const BottomTabNavigator = () => (
  <Tab.Navigator
    screenOptions={{ headerShown: false }}
    tabBar={(props: any) => <BottomNav {...props} />} // Add BottomNav here
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Network" component={FriendRequestScreen} />
    <Tab.Screen name="Publication" component={PublicationScreen} />
    <Tab.Screen name="Events" component={EventsScreen} />
    <Tab.Screen name="Jobs" component={JobsScreen} />
  </Tab.Navigator>
);

// Auth Stack for unauthenticated users
const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Welcome" component={WelcomeScreen} />
    <Stack.Screen name="Auth" component={AuthScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
    <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
  </Stack.Navigator>
);

// App Stack for authenticated users
const AppStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="BottomTabs" component={BottomTabNavigator} />
    <Stack.Screen name="Verify" component={VerifyScreen} />
    <Stack.Screen name="FriendRequest" component={FriendRequestScreen} />
    <Stack.Screen name="EventDetail" component={EventDetailScreen} />
    <Stack.Screen name="RelatedProduct" component={CreateRelatedProductScreen} />
    <Stack.Screen name="CreateJobOffer" component={CreateJobOfferScreen} />
    <Stack.Screen name="Profile" component={ProfileScreen} />
    <Stack.Screen name="CreateEvent" component={CreateEventScreen} />
    <Stack.Screen name="PublicationScreen" component={PublicationScreen} />
    <Stack.Screen name="UserProfile" component={ProfileUserScreen} />
  </Stack.Navigator>
);

/**
 * Composant de gestion du feedback dans l'application
 */
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

/**
 * Connectivity management component in the application
 */
const ConnectivityManager: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isOnline, isInitializing, checkConnection } = useNetworkStatus();
  const [hasShownOfflineScreen, setHasShownOfflineScreen] = useState(false);
  
  // Only display the offline screen if we have finished initialization
  // and we cannot access the server
  const showOfflineScreen = !isInitializing && !isOnline;
  
  // Track if we have already displayed the offline screen
  useEffect(() => {
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

// Main navigation handler that conditionally renders Auth or App stack
const MainNavigator = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return isAuthenticated ? <AppStack /> : <AuthStack />;
};

const CLERK_PUBLISHABLE_KEY =
  "pk_test_b2JsaWdpbmctcHl0aG9uLTgzLmNsZXJrLmFjY291bnRzLmRldiQ";

// NavigationContainer only on Web
const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
        <ThemeProvider>
          <AxiosConfigProvider>
            <AuthProvider>
              <FeedbackManager>
                <ConnectivityManager>
                  {Platform.OS === "web" ? (
                    <NavigationContainer>
                      <MainNavigator />
                    </NavigationContainer>
                  ) : (
                    <MainNavigator />
                  )}
                </ConnectivityManager>
              </FeedbackManager>
            </AuthProvider>
          </AxiosConfigProvider>
        </ThemeProvider>
      </ClerkProvider>
    </ErrorBoundary>
  );
};

export default App;
