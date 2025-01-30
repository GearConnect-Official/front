import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native"; // ✅ Import pour gérer le back
import FontAwesome from "react-native-vector-icons/FontAwesome";
import styles from "../styles/registerStyles";

const RegisterScreen = () => {
  const navigation = useNavigation(); // ✅ Initialisation de la navigation

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <View style={styles.container}>
      {/* Header avec bouton de retour */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <FontAwesome name="arrow-left" size={24} color="#1E232C" />
      </TouchableOpacity>

      {/* Titre */}
      <Text style={styles.title}>Welcome back! Glad to see you, Again!</Text>

      {/* Champs d'entrée */}
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      {/* Bouton d'inscription */}
      <TouchableOpacity style={styles.registerButton}>
        <Text style={styles.registerButtonText}>Agree and Register</Text>
      </TouchableOpacity>

      {/* Connexion avec des réseaux sociaux */}
      <Text style={styles.orText}>Or Register with</Text>
      <View style={styles.socialButtonsContainer}>
        <TouchableOpacity style={styles.socialButton}>
          <Image source={require("../../../assets/images/facebook.png")} style={styles.socialIcon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton}>
          <Image source={require("../../../assets/images/Apple-logo.png")} style={styles.socialIcon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton}>
          <Image source={require("../../../assets/images/Google-logo.png")} style={styles.socialIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RegisterScreen;
