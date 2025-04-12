import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import styles from "../styles/forgotPasswordStyles";

const ForgotPasswordScreen: React.FC = () => {
  const router = useRouter();
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
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <StatusBar barStyle="dark-content" />
      
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.push("/(auth)/login")}
        activeOpacity={0.7}
      >
        <FontAwesome name="arrow-left" size={24} color="#1E232C" />
      </TouchableOpacity>
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1 }}
          style={styles.container}
        >
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
            placeholderTextColor="#8391A1"
          />

          <TouchableOpacity style={styles.sendCodeButton} onPress={handleSendCode}>
            <Text style={styles.sendCodeText}>Send Code</Text>
          </TouchableOpacity>

          <View style={styles.rememberPasswordContainer}>
            <Text style={styles.rememberPasswordText}>Remember Password? </Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
              <Text style={styles.loginText}>Login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ForgotPasswordScreen;
