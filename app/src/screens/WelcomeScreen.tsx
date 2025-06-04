import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import styles from "../styles/screens/welcomeStyles";

const WelcomeScreen: React.FC = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image source={require("../../assets/images/logo-rounded.png")} style={styles.logo} />

      {/* Authentication buttons */}
      <TouchableOpacity 
        style={styles.loginButton} 
        onPress={() => router.push("/(auth)/login")}
      >
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.registerButton} 
        onPress={() => router.push("/(auth)/register")}
      >
        <Text style={styles.registerText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
};

export default WelcomeScreen;
