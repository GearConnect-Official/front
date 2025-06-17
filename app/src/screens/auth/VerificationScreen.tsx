import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import styles from "../../styles/auth/verificationStyles";
import { useAuthContext } from "../../contexts/AuthContext";

const VerificationScreen = () => {
  const [code, setCode] = useState("");
  const [isResending, setIsResending] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();
  const { email } = route.params as { email: string };
  const { isLoading, error, verifyCode, resendCode } = useAuthContext();

  const handleVerify = async () => {
    if (code.length !== 6) {
      return;
    }
    await verifyCode(email, code);
  };

  const handleResend = async () => {
    setIsResending(true);
    await resendCode(email);
    setIsResending(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="#1E232C" />
      </TouchableOpacity>

      <Text style={styles.title}>Vérification</Text>
      <Text style={styles.subtitle}>
        Entrez le code de vérification envoyé à {email}
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Code de vérification"
        value={code}
        onChangeText={setCode}
        keyboardType="number-pad"
        maxLength={6}
      />

      {error && <Text style={styles.errorText}>{error}</Text>}

      <TouchableOpacity
        style={[styles.sendCodeButton, isLoading && styles.disabledButton]}
        onPress={handleVerify}
        disabled={isLoading || code.length !== 6}
      >
        {isLoading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.sendCodeText}>Vérifier</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.resendButton, isResending && styles.disabledButton]}
        onPress={handleResend}
        disabled={isResending}
      >
        <Text style={styles.resendText}>
          {isResending ? "Envoi en cours..." : "Renvoyer le code"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default VerificationScreen;
