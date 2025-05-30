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

const AuthScreen: React.FC = () => {
  const router = useRouter();
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});
  const [isDeletedAccount, setIsDeletedAccount] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};
    setIsDeletedAccount(false);

    if (!email) {
      newErrors.email = "L'email est requis";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Format d'email invalide";
    }

    if (!password) {
      newErrors.password = "Le mot de passe est requis";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    setErrors({});
    setIsDeletedAccount(false);

    if (!validateForm()) {
      return;
    }

    const result = await login(email, password);
    if (!result.success) {
      if (result.error === "Votre compte a été supprimé ou désactivé") {
        setIsDeletedAccount(true);
        setErrors({ general: result.error });
      } else if (result.error === "Compte non trouvé") {
        setErrors({ email: "Compte non trouvé" });
      } else if (result.error === "Mot de passe incorrect") {
        setErrors({ password: "Mot de passe incorrect" });
      } else if (result.error === "Impossible de se connecter au serveur") {
        setErrors({ general: "Impossible de se connecter au serveur" });
      } else {
        setErrors({ general: result.error || "Une erreur est survenue" });
      }
    }
  };

  const clearErrors = () => {
    setErrors({});
    setIsDeletedAccount(false);
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
                style={[
                  authStyles.input,
                  (errors.email || isDeletedAccount) && authStyles.inputError,
                ]}
                placeholder="Enter your email"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (errors.email) clearErrors();
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor={authStyles.placeholderColor.color}
              />
              {errors.email && (
                <Text style={authStyles.fieldError}>{errors.email}</Text>
              )}
            </View>

            <View style={authStyles.inputContainer}>
              <View
                style={[
                  authStyles.passwordContainer,
                  (errors.password || isDeletedAccount) &&
                    authStyles.inputError,
                ]}
              >
                <TextInput
                  style={authStyles.passwordInput}
                  placeholder="Enter your password"
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (errors.password) clearErrors();
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
              {errors.password && (
                <Text style={authStyles.fieldError}>{errors.password}</Text>
              )}
            </View>

            <TouchableOpacity
              style={authStyles.forgotPassword}
              onPress={() => router.push("/(auth)/forgotPassword")}
            >
              <Text style={authStyles.forgotPasswordText}>
                Forgot Password?
              </Text>
            </TouchableOpacity>

            {isDeletedAccount && errors.general ? (
              <Text style={authStyles.deletedAccountError}>
                {errors.general}
              </Text>
            ) : null}

            {!isDeletedAccount && errors.general ? (
              <Text style={authStyles.fieldError}>{errors.general}</Text>
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
