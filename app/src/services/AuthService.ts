import axios from "axios";
import { API_URL_AUTH } from "../config";

// Types
export interface AuthResponse {
  token?: string;
  userId?: string;
  message?: string;
  success?: boolean;
  error?: string;
  user?: {
    id: string | number;
    username?: string;
    name?: string;
    email: string;
    photoURL?: string;
    description?: string;
  };
}

// Configuration d'Axios
const api = axios.create({
  baseURL: API_URL_AUTH,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 10000, // 10 secondes de timeout
});

/**
 * This service is a wrapper around the API calls to the authentication endpoints.
 * The actual session management is handled by the AuthContext.
 */

/**
 * Make a direct API call to the backend auth signup endpoint
 */
export const signUp = async (
  username: string,
  email: string,
  password: string,
  name: string
): Promise<AuthResponse> => {
  try {
    console.log("Tentative d'inscription avec:", {
      username,
      email,
      name,
      password: "***",
    });

    const response = await api.post<AuthResponse>("/signup", {
      username,
      email,
      password,
      name,
    });

    console.log("Réponse d'inscription:", response.data);
    return {
      ...response.data,
      success: true,
    };
  } catch (error: any) {
    console.error("Signup Error:", error);

    // Gestion détaillée des erreurs
    if (error.response) {
      // Le serveur a répondu avec un code d'erreur
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
      return {
        success: false,
        error: error.response.data.error || "Erreur lors de l'inscription",
      };
    } else if (error.request) {
      // La requête a été faite mais pas de réponse
      console.error("Request error:", error.request);
      return {
        success: false,
        error: "Impossible de contacter le serveur. Vérifiez votre connexion.",
      };
    } else {
      // Erreur lors de la configuration de la requête
      console.error("Error setting up request:", error.message);
      return {
        success: false,
        error: "Erreur lors de la configuration de la requête",
      };
    }
  }
};

/**
 * Make a direct API call to the backend auth login endpoint
 */
export const signIn = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  try {
    console.log("Tentative de connexion avec:", { email, password: "***" });

    const response = await api.post<AuthResponse>("/login", {
      email,
      password,
    });

    console.log("Réponse de connexion:", response.data);
    return {
      ...response.data,
      success: true,
    };
  } catch (error: any) {
    if (error.response) {
      console.log("Login error response:", error.response.data);

      // Si l'utilisateur n'existe pas dans Clerk
      if (
        error.response.data &&
        error.response.data.error === "User not found in Clerk"
      ) {
        return {
          success: false,
          error: "Your account has been deleted or deactivated",
        };
      }

      // Vérifier le message d'erreur spécifique du backend
      if (error.response.data && error.response.data.error) {
        return {
          success: false,
          error: error.response.data.error,
        };
      }

      // Si pas de message spécifique, utiliser le code de statut
      if (error.response.status === 401) {
        return {
          success: false,
          error: "Incorrect password",
        };
      }

      if (error.response.status === 404) {
        return {
          success: false,
          error: "Account not found",
        };
      }

      return {
        success: false,
        error: "An error occurred during login",
      };
    } else if (error.request) {
      return {
        success: false,
        error: "Unable to connect to server",
      };
    } else {
      console.error("Error setting up request:", error.message);
      return {
        success: false,
        error: "Error configuring the request",
      };
    }
  }
};

/**
 * Get current user info from the backend
 */
export const getUserInfo = async (token: string): Promise<any> => {
  try {
    const response = await api.get("/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Get User Info Error:", error);

    // Traitement structuré de l'erreur
    if (error.response) {
      // Le serveur a répondu avec un code d'erreur
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);

      // Si l'erreur est 404 (utilisateur non trouvé dans Clerk)
      if (error.response.status === 404) {
        return {
          success: false,
          error: "Utilisateur non trouvé",
          details:
            error.response.data.details ||
            "L'utilisateur n'existe pas dans Clerk",
        };
      }

      // Pour les autres erreurs, on renvoie les informations du serveur
      return {
        success: false,
        error:
          error.response.data.error ||
          "Erreur lors de la récupération de l'utilisateur",
        details: error.response.data.details,
      };
    } else if (error.request) {
      // La requête a été faite mais pas de réponse
      return {
        success: false,
        error: "Impossible de contacter le serveur. Vérifiez votre connexion.",
      };
    } else {
      // Erreur lors de la configuration de la requête
      return {
        success: false,
        error: "Erreur lors de la configuration de la requête",
      };
    }
  }
};

// Empty default export to prevent Metro from treating this as a screen
export default {};
