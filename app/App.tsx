import React from "react";
import { ClerkProvider } from "@clerk/clerk-expo";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AuthScreen from "./src/screens/AuthScreen";

const Stack = createStackNavigator();

const CLERK_PUBLISHABLE_KEY = "pk_test_b2JsaWdpbmctcHl0aG9uLTgzLmNsZXJrLmFjY291bnRzLmRldiQ"; 

const App: React.FC = () => {
    return (
        <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen name="Auth" component={AuthScreen} />
                </Stack.Navigator>
            </NavigationContainer>
        </ClerkProvider>
    );
};

export default App;
