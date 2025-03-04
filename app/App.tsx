import React from "react";
import { ClerkProvider } from "@clerk/clerk-expo";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Platform } from "react-native";
import AuthScreen from "./src/screens/AuthScreen";
import WelcomeScreen from "./src/screens/WelcomeScreen";
import JobsScreen from "./src/screens/JobsScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import ForgotPasswordScreen from "./src/screens/ForgotPasswordScreen";
import FriendRequestScreen from "./src/screens/FriendRequestScreen";
import HomeScreen from "./src/screens/HomeScreen";
import EventsScreen from "./src/screens/EventsScreen";
import BottomNav from "./src/components/BottomNav";
import { NavigationContainer } from "@react-navigation/native";
import CreateJobOfferScreen from "./src/screens/CreateJobOfferScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import CreateEventScreen from "./src/screens/CreateEventScreen";
import PublicationScreen from "./src/screens/PublicationScreen";

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
  FriendRequest: undefined;
  CreateJobOffer: undefined;
  Profile: undefined;
  PublicationScreen: undefined;
};

// Bottom tab navigation (with `BottomNav` as `tabBar`)
const BottomTabNavigator = () => (
  <Tab.Navigator
    screenOptions={{ headerShown: false }}
    tabBar={(props) => <BottomNav {...props} />} // Add BottomNav here
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Network" component={FriendRequestScreen} />
    <Tab.Screen name="Publication" component={PublicationScreen} />
    <Tab.Screen name="Events" component={EventsScreen} />
    <Tab.Screen name="Jobs" component={JobsScreen} />
  </Tab.Navigator>
);

// Main navigation (Stack)
const MainNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="BottomTabs" component={BottomTabNavigator} />
    <Stack.Screen name="Welcome" component={WelcomeScreen} />
    <Stack.Screen name="Auth" component={AuthScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
    <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    <Stack.Screen name="FriendRequest" component={FriendRequestScreen} />
    <Stack.Screen name="CreateJobOffer" component={CreateJobOfferScreen} />
    <Stack.Screen name="Profile" component={ProfileScreen} />
    <Stack.Screen name="CreateEvent" component={CreateEventScreen} />
    <Stack.Screen name="PublicationScreen" component={PublicationScreen} />
  </Stack.Navigator>
);

const CLERK_PUBLISHABLE_KEY =
  "pk_test_b2JsaWdpbmctcHl0aG9uLTgzLmNsZXJrLmFjY291bnRzLmRldiQ";

// NavigationContainer only on Web
const App: React.FC = () => {
  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      {Platform.OS === "web" ? (
        <NavigationContainer>
          <MainNavigator />
        </NavigationContainer>
      ) : (
        <MainNavigator />
      )}
    </ClerkProvider>
  );
};

export default App;
