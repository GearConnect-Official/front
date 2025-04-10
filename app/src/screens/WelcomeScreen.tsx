import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../../App";
import styles from "../styles/welcomeStyles";

const WelcomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>(); // Use correct type

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image source={require("../../assets/images/logo-rounded.png")} style={styles.logo} />

      {/* Authentication buttons */}
      <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate("Auth")}>
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.registerButton} onPress={() => navigation.navigate("Register")}>
        <Text style={styles.registerText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
};

export default WelcomeScreen;
