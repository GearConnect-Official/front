import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Alert,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useAuth } from "../context/AuthContext";
import authStyles from "../styles/authStyles";

interface FormErrors {
  email?: string;
  password?: string;
}

const AuthScreen: React.FC = () => {
  const router = useRouter();
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [hasError, setHasError] = useState(false);

  const validateForm = (): boolean => {
    let isValid = true;

    if (!email) {
      setErrorMessage("L'email est requis");
      setHasError(true);
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setErrorMessage("Format d'email invalide");
      setHasError(true);
      isValid = false;
    } else if (!password) {
      setErrorMessage("Le mot de passe est requis");
      setHasError(true);
      isValid = false;
    }

    return isValid;
  };

  const handleLogin = async () => {
    setErrorMessage("");
    setHasError(false);
    if (!validateForm()) {
      return;
    }

    const result = await login(email, password);
    if (!result.success) {
      setHasError(true);
      // Si le compte a été supprimé ou désactivé
      if (result.error === "Votre compte a été supprimé ou désactivé") {
        setErrorMessage(result.error);
      }
      // Si l'erreur indique que le compte n'existe pas
      else if (result.error === "Compte non trouvé") {
        setErrorMessage("Compte non trouvé");
      } else if (result.error === "Impossible de se connecter au serveur") {
        setErrorMessage("Impossible de se connecter au serveur");
      } else {
        setErrorMessage(result.error || "Une erreur est survenue");
      }
    }
  };

  const clearError = () => {
    setErrorMessage("");
    setHasError(false);
  };

  return (
    <SafeAreaView style={authStyles.container}>
      <StatusBar barStyle="dark-content" />

      <TouchableOpacity
        style={authStyles.backButton}
        onPress={() => router.push("/(auth)/welcome")}
        activeOpacity={0.7}
      >
        <FontAwesome name="arrow-left" size={24} color="#1E232C" />
      </TouchableOpacity>

      <KeyboardAvoidingView
        style={authStyles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={authStyles.container}
          contentContainerStyle={authStyles.scrollViewContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={authStyles.contentContainer}>
            <Image
              source={require("../../assets/images/logo-rounded.png")}
              style={authStyles.logo}
            />

            <Text style={authStyles.title}>
              Welcome back! Glad to see you again!
            </Text>

            <View style={authStyles.inputContainer}>
              <TextInput
                style={[authStyles.input, hasError && authStyles.inputError]}
                placeholder="Enter your email"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  clearError();
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor={authStyles.placeholderColor.color}
              />
            </View>

            <View style={authStyles.inputContainer}>
              <View
                style={[
                  authStyles.passwordContainer,
                  hasError && authStyles.inputError,
                ]}
              >
                <TextInput
                  style={authStyles.passwordInput}
                  placeholder="Enter your password"
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    clearError();
                  }}
                  secureTextEntry={!showPassword}
                  placeholderTextColor={authStyles.placeholderColor.color}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={authStyles.eyeIcon}
                >
                  <FontAwesome
                    name={showPassword ? "eye" : "eye-slash"}
                    size={22}
                    color="#6A707C"
                  />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={authStyles.forgotPassword}
              onPress={() => router.push("/(auth)/forgotPassword")}
            >
              <Text style={authStyles.forgotPasswordText}>
                Forgot Password?
              </Text>
            </TouchableOpacity>

            {errorMessage ? (
              <Text style={authStyles.errorMessage}>{errorMessage}</Text>
            ) : null}

            <TouchableOpacity
              style={authStyles.loginButton}
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={authStyles.loginButtonText}>Login</Text>
              )}
            </TouchableOpacity>

            <View style={authStyles.dividerContainer}>
              <View style={authStyles.dividerLine} />
              <Text style={authStyles.dividerText}>Or Login with</Text>
              <View style={authStyles.dividerLine} />
            </View>

            <View style={authStyles.socialButtonsContainer}>
              <TouchableOpacity style={authStyles.socialButton}>
                <FontAwesome name="facebook" size={24} color="#3b5998" />
              </TouchableOpacity>
              <TouchableOpacity style={authStyles.socialButton}>
                <FontAwesome name="google" size={24} color="#db4437" />
              </TouchableOpacity>
              <TouchableOpacity style={authStyles.socialButton}>
                <FontAwesome name="apple" size={24} color="#000000" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={authStyles.registerContainer}
              onPress={() => router.push("/(auth)/register")}
            >
              <Text style={authStyles.registerText}>
                Don't have an account?{" "}
                <Text style={authStyles.registerLink}>Register Now</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AuthScreen;
