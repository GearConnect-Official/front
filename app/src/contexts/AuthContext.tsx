import React, { createContext, useContext, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "@clerk/clerk-expo";
import { sendVerificationCode, verifyCode } from "../services/auth";

interface AuthContextType {
  isLoading: boolean;
  error: string | null;
  sendVerificationCode: (email: string) => Promise<void>;
  verifyCode: (email: string, code: string) => Promise<void>;
  resendCode: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation();
  const { signIn } = useAuth();

  const handleSendVerificationCode = async (email: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await sendVerificationCode(email);
      navigation.navigate("Verification" as never, { email } as never);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (email: string, code: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await verifyCode(email, code);
      navigation.navigate("Login" as never);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async (email: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await sendVerificationCode(email);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        error,
        sendVerificationCode: handleSendVerificationCode,
        verifyCode: handleVerifyCode,
        resendCode: handleResendCode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};
