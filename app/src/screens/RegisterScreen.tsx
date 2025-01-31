import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../../App"; // ✅ Import des types de navigation
import FontAwesome from "react-native-vector-icons/FontAwesome";
import styles from "../styles/registerStyles";
import { signUp } from "../services/AuthService"; // ✅ Import de la fonction signUp

const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>(); // ✅ Typage de la navigation

  // États pour les inputs
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // ✅ Fonction de gestion de l'inscription
  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Erreur", "Les mots de passe ne correspondent pas.");
      return;
    }

    const response = await signUp(email, password); // ✅ Appel à AuthService

    if (response && response.token) {
      Alert.alert("Succès", "Inscription réussie !");
      navigation.navigate("Auth"); // ✅ Redirection vers AuthScreen après inscription
    } else {
      Alert.alert("Erreur", "Inscription échouée. Veuillez réessayer.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Header avec bouton de retour */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <FontAwesome name="arrow-left" size={24} color="#1E232C" />
      </TouchableOpacity>

      {/* Titre */}
      <Text style={styles.title}>Welcome! Glad to see you!</Text>

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
      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.registerButtonText}>Agree and Register</Text>
      </TouchableOpacity>

      {/* Connexion avec des réseaux sociaux */}
      <Text style={styles.orText}>Or Register with</Text>
      <View style={styles.socialButtonsContainer}>
        <TouchableOpacity style={styles.socialButton}>
          <FontAwesome name="facebook" size={26} color="#3b5998" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton}>
          <FontAwesome name="apple" size={26} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton}>
          <FontAwesome name="google" size={26} color="#db4437" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RegisterScreen;
