import React, { createContext, useState, useContext, useEffect } from "react";
import { useSignIn, useSignUp, useUser, useClerk } from "@clerk/clerk-expo";
import {
  signUp as authSignUp,
  signIn as authSignIn,
  getUserInfo,
} from "../services/AuthService";
import { API_URL_AUTH } from "../config";
import { useRouter } from "expo-router";
import { Platform } from "react-native";
import { useAuth as useClerkAuth } from "@clerk/clerk-expo";
import type { UserResource } from "@clerk/types";
import axios from "axios";

// Define types for our context
interface User {
  id: string | number;
  username: string | null;
  email?: string;
  photoURL?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  getCurrentUser: () => Promise<User | null>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

// Create the context
const AuthContext = createContext<AuthContextType | null>(null);

// Export the hook for using the context
export const useAuth = () => useContext(AuthContext);

// The provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const { signIn } = useSignIn();
  const { signUp: clerkSignUp } = useSignUp();
  const { signOut } = useClerk();
  const clerk = useClerk();
  const { user: clerkUser, isLoaded: clerkIsLoaded } = useUser();
  const router = useRouter();

  // Check user session on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (clerkIsLoaded) {
          if (clerkUser) {
            // If Clerk has a user, try to get user details from our backend
            try {
              const userDetails = await getCurrentUser();
              if (userDetails) {
                setUser(userDetails);
                setIsAuthenticated(true);
              } else {
                // Si l'utilisateur n'est pas trouvé dans notre système mais existe dans Clerk
                console.warn(
                  "L'utilisateur existe dans Clerk mais pas dans notre système"
                );

                // On peut décider de garder l'authentification avec les données Clerk
                // ou de déconnecter l'utilisateur

                // Option 1: Garder l'authentification avec les données minimales de Clerk
                setUser({
                  id: clerkUser.id,
                  username: clerkUser.username || "",
                  email: clerkUser.primaryEmailAddress?.emailAddress || "",
                  photoURL: clerkUser.imageUrl || "",
                });
                setIsAuthenticated(true);

                // Option 2: Déconnecter l'utilisateur si le backend ne le reconnaît pas
                // Cette option est commentée par défaut
                // setIsAuthenticated(false);
                // await logout();
              }
            } catch (error: any) {
              console.error("Error getting user on initialization:", error);
              // Si l'erreur est liée à un utilisateur non trouvé dans Clerk, déconnecter
              if (error.message?.includes("user not found in Clerk")) {
                console.warn("User no longer exists in Clerk, logging out...");
                await logout();
                return;
              }

              // Other errors, we can choose to keep Clerk authentication
              console.warn(
                "Error syncing with backend but user exists in Clerk:",
                error
              );
              setIsAuthenticated(true);
              setUser(clerkUser);
            }
          } else {
            // No Clerk user, ensure authenticated is false
            setIsAuthenticated(false);
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [clerkUser, clerkIsLoaded]);

  // Register a new user
  const register = async (
    username: string,
    email: string,
    password: string
  ) => {
    try {
      setIsLoading(true);

      // Front-end validation
      if (!username || username.length < 3) {
        return {
          success: false,
          error: "Username must be at least 3 characters long",
        };
      }

      if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
        return {
          success: false,
          error: "Please provide a valid email address",
        };
      }

      if (!password || password.length < 8) {
        return {
          success: false,
          error: "Password must be at least 8 characters long",
        };
      }

      // Check for strong password (at least one uppercase, one lowercase, one number)
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
      if (!passwordRegex.test(password)) {
        return {
          success: false,
          error:
            "Password must contain at least one uppercase letter, one lowercase letter, and one number",
        };
      }

      // Register with backend only
      const backendResponse = await authSignUp(username, email, password);

      if (!backendResponse.success) {
        return {
          success: false,
          error: backendResponse.error || "Error during registration",
        };
      }

      // Définir l'utilisateur et isAuthenticated
      if (backendResponse.user) {
        const userObj = {
          id: String(backendResponse.user.id),
          username: backendResponse.user.username || "",
          email: backendResponse.user.email,
          photoURL: backendResponse.user.photoURL || "",
        };
        setUser(userObj);
        setIsAuthenticated(true);
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: "Network error or server unavailable",
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Login a user
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);

      console.log(
        `Tentative de connexion avec: {"email": "${email}", "password": "***"}`
      );

      // Login with backend
      const backendResponse = await authSignIn(email, password);
      console.log("Réponse de connexion:", backendResponse);

      if (!backendResponse.success) {
        // Si l'erreur indique que l'utilisateur n'existe pas dans Clerk,
        // inutile de continuer avec l'authentification Clerk
        return {
          success: false,
          error: backendResponse.error || "Erreur lors de la connexion",
        };
      }

      // On définit l'utilisateur avec les données de la réponse s'il y en a
      if (backendResponse.user) {
        const userObj = {
          id: String(backendResponse.user.id),
          username: backendResponse.user.username || "",
          email: backendResponse.user.email,
          photoURL: backendResponse.user.photoURL || "",
        };
        setUser(userObj);
        setIsAuthenticated(true);
        console.log("Utilisateur défini après connexion:", userObj);
      }

      // Login with Clerk - uniquement si la réponse backend est un succès
      if (!signIn) {
        throw new Error("Clerk signIn is undefined");
      }

      try {
        await signIn.create({
          identifier: email,
          password,
        });

        return {
          success: true,
          user: backendResponse.user,
        };
      } catch (clerkError: any) {
        // If the error indicates that the user doesn't exist in Clerk,
        // but backend validated them, we can still return success
        console.warn("Clerk error but user authenticated on backend side");
        return {
          success: true,
          user: backendResponse.user,
        };
      }
    } catch (error: any) {
      console.error("Login Error:", error);
      return {
        success: false,
        error: error.message || "Erreur de connexion",
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Logout the user
  const logout = async () => {
    console.log("Starting logout process");
    try {
      // Try to sign out from Clerk first
      try {
        await signOut();
        console.log("Clerk sign out successful");
      } catch (clerkError) {
        console.error("Error during Clerk sign out:", clerkError);

        // On web, we can try to force logout using the clerk object
        if (Platform.OS === "web") {
          try {
            console.log("Attempting alternative logout");
            // @ts-ignore - clerk is available on web
            await window.Clerk?.client?.signOut();
          } catch (manualError) {
            console.error(
              "Unable to complete manual session termination:",
              manualError
            );
          }
        }
      }

      // Reset local state to ensure logout
      setUser(null);
      setIsAuthenticated(false);

      // Redirect to welcome page
      router.replace("/");
    } catch (error) {
      console.error("Error during logout:", error);
      // Force reset state and redirect anyway
      setUser(null);
      setIsAuthenticated(false);
      router.replace("/");
    }
    console.log("Logout process completed");
  };

  // Get current user details from backend
  const getCurrentUser = async (): Promise<User | null> => {
    try {
      if (!clerkUser) return null;

      // Get the user's token from the active session
      let token;
      try {
        token = await clerk.session?.getToken();
      } catch (tokenError) {
        console.error("Error getting token:", tokenError);
        return null;
      }

      if (!token) {
        console.warn("No token available");
        return null;
      }

      try {
        // Get user details from backend
        const response = await getUserInfo(token);

        // Vérifier si la réponse indique un succès
        if (response.success === false) {
          console.warn("Erreur récupération utilisateur:", response.error);

          // Afficher notification ou message à l'utilisateur si nécessaire
          // Cette partie peut être personnalisée selon les besoins de l'application

          // Utiliser les données Clerk comme fallback
          if (clerkUser) {
            return {
              id: clerkUser.id,
              username: clerkUser.username || "",
              email: clerkUser.primaryEmailAddress?.emailAddress || "",
              photoURL: clerkUser.imageUrl || "",
            };
          }
          return null;
        }

        // Si c'est un succès ou si response.user existe
        if (response.user || response) {
          const userData = response.user || response;
          return {
            id: userData.id || clerkUser.id,
            username: userData.username || clerkUser.username || "",
            email:
              userData.email ||
              clerkUser.primaryEmailAddress?.emailAddress ||
              "",
            photoURL:
              userData.imageUrl ||
              userData.photoURL ||
              clerkUser.imageUrl ||
              "",
          };
        }
      } catch (apiError) {
        console.error("API Error getting user:", apiError);
        // Fall back to Clerk user data
        if (clerkUser) {
          return {
            id: clerkUser.id,
            username: clerkUser.username || "",
            email: clerkUser.primaryEmailAddress?.emailAddress || "",
            photoURL: clerkUser.imageUrl || "",
          };
        }
      }

      return null;
    } catch (error) {
      console.error("Get Current User Error:", error);
      return null;
    }
  };

  const handleClerkUser = async (clerkUser: UserResource | null) => {
    try {
      if (!clerkUser) {
        setIsAuthenticated(false);
        setUser(null);
        return;
      }

      const userData: User = {
        id: clerkUser.id,
        username: clerkUser.username,
        email: clerkUser.primaryEmailAddress?.emailAddress || undefined,
        photoURL: clerkUser.imageUrl || undefined,
      };

      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Error handling clerk user:", error);
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        login,
        register,
        logout,
        getCurrentUser,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
