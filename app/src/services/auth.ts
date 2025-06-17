import { API_URL } from "../config/constants";

export const sendVerificationCode = async (email: string): Promise<void> => {
  const response = await fetch(`${API_URL}/auth/send-verification`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      error.message || "Erreur lors de l'envoi du code de vérification"
    );
  }
};

export const verifyCode = async (
  email: string,
  code: string
): Promise<void> => {
  const response = await fetch(`${API_URL}/auth/verify-code`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, code }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Code de vérification invalide");
  }
};
