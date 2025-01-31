import React from "react";
import { ClerkProvider } from "@clerk/clerk-expo";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Platform } from "react-native";
import AuthScreen from "./src/screens/AuthScreen";
import WelcomeScreen from "./src/screens/WelcomeScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import ForgotPasswordScreen from "./src/screens/ForgotPasswordScreen";

const Stack = createStackNavigator();

export type RootStackParamList = {
  Welcome: undefined;
  Auth: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

const CLERK_PUBLISHABLE_KEY =
  "pk_test_b2JsaWdpbmctcHl0aG9uLTgzLmNsZXJrLmFjY291bnRzLmRldiQ";

// Définition de la navigation pour mobile (React Native)
const MobileNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Auth" component={AuthScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);

// Définition de la navigation pour le web (React Router)
const router = createBrowserRouter([
  { path: "/", element: <WelcomeScreen /> },
  { path: "/auth", element: <AuthScreen /> },
  { path: "/register", element: <RegisterScreen /> },
  { path: "/forgot-password", element: <ForgotPasswordScreen /> },
]);

const App: React.FC = () => {
  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      {Platform.OS === "web" ? (
        <RouterProvider router={router} />
      ) : (
        <MobileNavigator />
      )}
    </ClerkProvider>
  );
};

export default App;
