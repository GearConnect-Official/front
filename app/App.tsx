import React from "react";
import { ClerkProvider } from "@clerk/clerk-expo";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AuthScreen from "./src/screens/AuthScreen";
import WelcomeScreen from "./src/screens/WelcomeScreen";
import RegisterScreen from "./src/screens/RegisterScreen";

const Stack = createStackNavigator();

// ✅ Définition des types pour la navigation
export type RootStackParamList = {
  Welcome: undefined;
  Auth: undefined;
  Register: undefined;
};

const CLERK_PUBLISHABLE_KEY =
  "pk_test_b2JsaWdpbmctcHl0aG9uLTgzLmNsZXJrLmFjY291bnRzLmRldiQ";

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Auth" component={AuthScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Navigator>
      </ClerkProvider>
    </NavigationContainer>

  );
};

export default App;
