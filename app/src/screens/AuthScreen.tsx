import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { signUp, signIn } from "../services/AuthService";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../../App";


const AuthScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const [username, setUsername] = useState<string>(""); // ⚡ Ajout du nom d'utilisateur
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isSignUp, setIsSignUp] = useState<boolean>(true); // ⚡ Basculer entre Signup et Login
  const [message, setMessage] = useState<string>("");

  const handleAuth = async () => {
    setMessage(""); // Reset message d'erreur/succès

    // Vérification nom d'utilisateur
    if (isSignUp && !username) {
      setMessage("❌ Veuillez saisir un nom d'utilisateur.");
      return;
    }

    // Vérification email
    if (!email.includes("@") || !email.includes(".")) {
      setMessage("❌ L'email n'est pas valide.");
      return;
    }

    // Vérification mot de passe (8 caractères minimum)
    if (password.length < 8) {
      setMessage("❌ Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }

    if (isSignUp) {
      const result = await signUp(username, email, password);
      if (result) {
        setMessage("✅ Compte créé avec succès !");
      } else {
        setMessage("❌ Erreur lors de l'inscription.");
      }
    } else {
      const token = await signIn(email, password);
      if (token) {
        setMessage("✅ Connexion réussie !");
      } else {
        setMessage("❌ Échec de connexion.");
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {isSignUp ? "Créer un compte" : "Se connecter"}
      </Text>

      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Mot de passe"
        secureTextEntry
        style={styles.input}
      />

      <Button
        title={isSignUp ? "S'inscrire" : "Se connecter"}
        onPress={handleAuth}
      />

      {message ? <Text style={styles.message}>{message}</Text> : null}

      <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
        <Text style={styles.switchText}>
          {isSignUp
            ? "Déjà un compte ? Se connecter"
            : "Pas encore de compte ? S'inscrire"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
        <Text style={[styles.switchText, { marginTop: 10 }]}>
          Mot de passe oublié ?
        </Text>
      </TouchableOpacity>
    </View>
  );
};

// Styles React Native
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  input: {
    width: "100%",
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  message: { marginTop: 10, fontSize: 16 },
  switchText: { marginTop: 15, color: "blue", textDecorationLine: "underline" },
});

export default AuthScreen;
