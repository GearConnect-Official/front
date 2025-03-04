import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../../App";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import styles from "../styles/forgotPasswordStyles";

const ForgotPasswordScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [email, setEmail] = useState("");

  const handleSendCode = () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email address");
      return;
    }
    // TODO: Implement send code functionality
    Alert.alert("Success", "Reset code has been sent to your email");
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <FontAwesome name="arrow-left" size={24} color="#1E232C" />
      </TouchableOpacity>

      {/* <View style={styles.logoContainer}>
        <Image
          source={require("../../../assets/images/forgot-password-icon.png")}
          style={styles.logo}
        />
      </View> */}

      <Text style={styles.title}>Forgot Password?</Text>

      <Text style={styles.subtitle}>
        Don't worry! It happens. Please enter the email address associated with your account.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TouchableOpacity style={styles.sendCodeButton} onPress={handleSendCode}>
        <Text style={styles.sendCodeText}>Send Code</Text>
      </TouchableOpacity>

      <View style={styles.rememberPasswordContainer}>
        <Text style={styles.rememberPasswordText}>Remember Password? </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Auth")}>
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ForgotPasswordScreen;
