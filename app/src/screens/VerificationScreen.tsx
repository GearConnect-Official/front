import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { useSignIn, useAuth } from "@clerk/clerk-expo";
import styles from "../styles/auth/verificationStyles";
import { useMessage } from "../context/MessageContext";
import MessageService from "../services/messageService";
import { QuickMessages } from "../utils/messageUtils";

const VerificationScreen: React.FC = () => {
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const { signIn, setActive, isLoaded } = useSignIn();
  const { showMessage, showError, showInfo } = useMessage();

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [successfulCreation, setSuccessfulCreation] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Redirect if user is already signed in
  useEffect(() => {
    if (isSignedIn) {
      router.push("/(app)/(tabs)/home");
    }
  }, [isSignedIn, router]);

  // Countdown timer for resend button
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  if (!isLoaded) {
    return null;
  }

  // Send verification code to user's email
  const handleSendCode = async (e?: any) => {
    if (e?.preventDefault) e.preventDefault();

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    // Basic email validation
    if (!email.includes("@") || !email.includes(".")) {
      setError("Please enter a valid email address");
      return;
    }

    if (!signIn) {
      setError("Sign in service is not available");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Send verification code using Clerk
      await signIn.create({
        strategy: "email_code",
        identifier: email,
      });

      setSuccessfulCreation(true);
      setError("");
      showMessage(
        QuickMessages.success("Verification code has been sent to your email")
      );
    } catch (err: any) {
      console.error("Error sending verification code:", err);
      const errorMessage =
        err.errors?.[0]?.longMessage ||
        err.message ||
        "Failed to send verification code";
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Verify the code and complete registration
  const handleVerifyCode = async (e?: any) => {
    if (e?.preventDefault) e.preventDefault();

    if (!code) {
      setError("Please enter the verification code");
      return;
    }

    if (!signIn) {
      setError("Sign in service is not available");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Verify the code with Clerk
      const result = await signIn.attemptFirstFactor({
        strategy: "email_code",
        code,
      });

      if (result.status === "complete") {
        // Set the active session
        await setActive({ session: result.createdSessionId });
        setError("");
        showMessage(QuickMessages.success("Email verified successfully!"));
        router.push("/(app)/(tabs)/home");
      } else {
        console.log("Unexpected result status:", result);
        setError("Verification failed. Please try again.");
      }
    } catch (err: any) {
      console.error("Error verifying code:", err);
      const errorMessage =
        err.errors?.[0]?.longMessage || err.message || "Failed to verify code";
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!canResend) return;

    setCanResend(false);
    setCountdown(60);
    await handleSendCode();
  };

  const handleBackToRegister = () => {
    router.push("/(auth)/register");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <StatusBar barStyle="dark-content" />

      <TouchableOpacity
        style={styles.backButton}
        onPress={handleBackToRegister}
        activeOpacity={0.7}
      >
        <FontAwesome name="arrow-left" size={24} color="#1E232C" />
      </TouchableOpacity>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          style={styles.container}
        >
          {!successfulCreation ? (
            // Step 1: Enter email to receive verification code
            <>
              <Text style={styles.title}>Verify Your Email</Text>
              <Text style={styles.subtitle}>
                Please enter your email address to receive a verification code.
              </Text>

              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#8391A1"
                editable={!isLoading}
              />

              {error ? <Text style={styles.errorText}>{error}</Text> : null}

              <TouchableOpacity
                style={[
                  styles.sendCodeButton,
                  isLoading && styles.disabledButton,
                ]}
                onPress={handleSendCode}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.sendCodeText}>Send Code</Text>
                )}
              </TouchableOpacity>
            </>
          ) : (
            // Step 2: Enter verification code
            <>
              <Text style={styles.title}>Enter Verification Code</Text>
              <Text style={styles.subtitle}>
                Enter the verification code sent to {email}
              </Text>

              <TextInput
                style={styles.input}
                placeholder="Enter verification code"
                value={code}
                onChangeText={setCode}
                keyboardType="number-pad"
                placeholderTextColor="#8391A1"
                editable={!isLoading}
              />

              {error ? <Text style={styles.errorText}>{error}</Text> : null}

              <TouchableOpacity
                style={[
                  styles.sendCodeButton,
                  isLoading && styles.disabledButton,
                ]}
                onPress={handleVerifyCode}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.sendCodeText}>Verify Code</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.resendButton,
                  !canResend && styles.disabledButton,
                ]}
                onPress={handleResendCode}
                disabled={!canResend || isLoading}
              >
                <Text style={styles.resendText}>
                  {canResend ? "Resend Code" : `Resend Code in ${countdown}s`}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default VerificationScreen;
