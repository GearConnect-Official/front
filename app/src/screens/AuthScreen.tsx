import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../../App";
import { signIn } from "../services/AuthService";
import FontAwesome from "react-native-vector-icons/FontAwesome";

const AuthScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    const result = await signIn(email, password);
    if (result.success) {
      navigation.navigate("Home");
    } else {
      Alert.alert("Error", result.error || "Login failed");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <FontAwesome name="arrow-left" size={24} color="#1E232C" />
        </TouchableOpacity>

        <Image
          source={require("../../../assets/images/logo-rounded.png")}
          style={styles.logo}
        />

        <Text style={styles.title}>Welcome back! Glad to see you again!</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="rgba(131, 145, 161, 1)"
        />

        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            placeholderTextColor="rgba(131, 145, 161, 1)"
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeIcon}
          >
            <FontAwesome
              name={showPassword ? "eye" : "eye-slash"}
              size={22}
              color="#6A707C"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.forgotPassword}
          onPress={() => navigation.navigate("ForgotPassword")}
        >
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>Or Login with</Text>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.socialButtonsContainer}>
          <TouchableOpacity style={styles.socialButton}>
            <FontAwesome name="facebook" size={24} color="#3b5998" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <FontAwesome name="google" size={24} color="#db4437" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <FontAwesome name="apple" size={24} color="#000000" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.registerContainer}
          onPress={() => navigation.navigate("Register")}
        >
          <Text style={styles.registerText}>
            Don't have an account?{" "}
            <Text style={styles.registerLink}>Register Now</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 1)",
    width: "100%",
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 30,
    alignItems: "center",
  },
  backButton: {
    alignSelf: "flex-start",
    width: 54,
    height: 54,
    borderRadius: 32,
    justifyContent: "center",
    paddingLeft: 10,
  },
  logo: {
    width: 72,
    height: 72,
    marginTop: 22,
  },
  title: {
    color: "#1E232C",
    fontSize: 30,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 18,
    marginBottom: 57,
  },
  input: {
    width: "100%",
    height: 56,
    backgroundColor: "rgba(247, 248, 249, 1)",
    borderWidth: 1,
    borderColor: "rgba(218, 218, 218, 1)",
    borderRadius: 8,
    paddingHorizontal: 20,
    marginBottom: 15,
    fontSize: 15,
    color: "rgba(131, 145, 161, 1)",
  },
  passwordContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(247, 248, 249, 1)",
    borderWidth: 1,
    borderColor: "rgba(218, 218, 218, 1)",
    borderRadius: 8,
    marginBottom: 5,
  },
  passwordInput: {
    flex: 1,
    height: 56,
    paddingHorizontal: 20,
    fontSize: 15,
    color: "rgba(131, 145, 161, 1)",
  },
  eyeIcon: {
    padding: 10,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 68,
  },
  forgotPasswordText: {
    color: "#6A707C",
    fontSize: 14,
    fontWeight: "600",
  },
  loginButton: {
    width: "100%",
    height: 56,
    backgroundColor: "#1E232C",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  loginButtonText: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "600",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 22,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E8ECF4",
  },
  dividerText: {
    color: "#6A707C",
    fontSize: 14,
    fontWeight: "600",
    marginHorizontal: 12,
  },
  socialButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 20,
  },
  socialButton: {
    width: 105,
    height: 56,
    borderWidth: 1,
    borderColor: "#E8ECF4",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  registerContainer: {
    marginTop: 83,
  },
  registerText: {
    fontSize: 15,
    fontWeight: "500",
    textAlign: "center",
  },
  registerLink: {
    color: "#8B01F4",
    fontWeight: "700",
  },
});

export default AuthScreen;
