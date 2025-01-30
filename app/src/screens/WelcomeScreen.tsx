import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import styles from "../styles/welcomeStyles"; // Import du fichier de styles

const WelcomeScreen : React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image source={require("../../../assets/images/logo-rounded.png")} style={styles.logo} />

      {/* Boutons d'authentification */}
      <TouchableOpacity style={styles.loginButton}>
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.registerButton}>
        <Text style={styles.registerText}>Register</Text>
      </TouchableOpacity>

      {/* Lien "Continuer en tant qu'invité" */}
      <Text style={styles.guestText}>Continue as a guest</Text>
    </View>
  );
};

export default WelcomeScreen;
