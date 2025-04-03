import React, { createContext, useState, useContext, useEffect } from 'react';
import { useSignIn, useSignUp, useUser, useClerk } from '@clerk/clerk-expo';
import { signUp as authSignUp, signIn as authSignIn, getUserInfo } from '../services/AuthService';
import { API_URL_AUTH} from '../config';

// Define types for our context
interface User {
  id: string;
  username: string;
  email: string;
  photoURL: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (username: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  getCurrentUser: () => Promise<User | null>;
}

// Create the context
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  login: async () => ({ success: false }),
  register: async () => ({ success: false }),
  logout: async () => {},
  getCurrentUser: async () => null,
});

// Export the hook for using the context
export const useAuth = () => useContext(AuthContext);

// The provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const { signIn } = useSignIn();
  const { signUp: clerkSignUp } = useSignUp();
  const { signOut } = useClerk();
  const clerk = useClerk();
  const { user: clerkUser, isLoaded: clerkIsLoaded } = useUser();

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
                console.log("Utilisateur restauré au démarrage:", userDetails);
              } else {
                // Si l'utilisateur n'est pas trouvé dans notre système mais existe dans Clerk
                console.warn("L'utilisateur existe dans Clerk mais pas dans notre système");
                
                // On peut décider de garder l'authentification avec les données Clerk
                // ou de déconnecter l'utilisateur
                
                // Option 1: Garder l'authentification avec les données minimales de Clerk
                setUser({
                  id: clerkUser.id,
                  username: clerkUser.username || '',
                  email: clerkUser.primaryEmailAddress?.emailAddress || '',
                  photoURL: clerkUser.imageUrl || '',
                });
                setIsAuthenticated(true);
                
                // Option 2: Déconnecter l'utilisateur si le backend ne le reconnaît pas
                // Cette option est commentée par défaut
                // setIsAuthenticated(false);
                // await logout();
              }
            } catch (error: any) {
              console.error('Error getting user on initialization:', error);
              // Si l'erreur est liée à un utilisateur non trouvé dans Clerk, déconnecter
              if (error.response && error.response.data && 
                  error.response.data.error === "Utilisateur non trouvé dans Clerk") {
                console.warn("L'utilisateur n'existe plus dans Clerk, déconnexion...");
                await logout();
              } else {
                // Autres erreurs, on peut choisir de garder l'authentification avec Clerk 
                // comme fallback ou de déconnecter selon la politique de sécurité
                setIsAuthenticated(false);
              }
            }
          } else {
            // No Clerk user, ensure authenticated is false
            setIsAuthenticated(false);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [clerkUser, clerkIsLoaded]);

  // Register a new user
  const register = async (username: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Front-end validation
      if (!username || username.length < 3) {
        return {
          success: false,
          error: "Le nom d'utilisateur doit contenir au moins 3 caractères"
        };
      }
      
      if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
        return {
          success: false,
          error: "Veuillez fournir une adresse email valide"
        };
      }
      
      if (!password || password.length < 8) {
        return {
          success: false,
          error: "Le mot de passe doit contenir au moins 8 caractères"
        };
      }
      
      // Check for strong password (at least one uppercase, one lowercase, one number)
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
      if (!passwordRegex.test(password)) {
        return {
          success: false,
          error: "Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre"
        };
      }
      
      console.log(`Tentative d'inscription avec: {"email": "${email}", "password": "***", "username": "${username}"}`);
      
      // Register with backend only
      // Notre backend crée déjà l'utilisateur dans Clerk et dans notre base de données
      const backendResponse = await authSignUp(username, email, password);
      console.log("Réponse d'inscription:", backendResponse);
      
      if (!backendResponse.success) {
        return {
          success: false,
          error: backendResponse.error || "Erreur lors de l'inscription"
        };
      }
      
      // Définir l'utilisateur et isAuthenticated
      if (backendResponse.user) {
        const userObj = {
          id: String(backendResponse.user.id),
          username: backendResponse.user.username || '',
          email: backendResponse.user.email,
          photoURL: backendResponse.user.photoURL || ''
        };
        setUser(userObj);
        setIsAuthenticated(true);
        console.log("Utilisateur défini après inscription:", userObj);
      }
      
      // L'utilisateur est déjà créé par le backend, on peut directement retourner un succès
      return { success: true };
      
    } catch (error: any) {
      console.error('Registration Error:', error);
      return { 
        success: false, 
        error: error.message || 'Registration failed' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Login a user
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      console.log(`Tentative de connexion avec: {"email": "${email}", "password": "***"}`);
      
      // Login with backend
      const backendResponse = await authSignIn(email, password);
      console.log("Réponse de connexion:", backendResponse);
      
      if (!backendResponse.success) {
        // Si l'erreur indique que l'utilisateur n'existe pas dans Clerk,
        // inutile de continuer avec l'authentification Clerk
        return {
          success: false,
          error: backendResponse.error || "Erreur lors de la connexion"
        };
      }
      
      // On définit l'utilisateur avec les données de la réponse s'il y en a
      if (backendResponse.user) {
        const userObj = {
          id: String(backendResponse.user.id),
          username: backendResponse.user.username || '',
          email: backendResponse.user.email,
          photoURL: backendResponse.user.photoURL || ''
        };
        setUser(userObj);
        setIsAuthenticated(true);
        console.log("Utilisateur défini après connexion:", userObj);
      }
      
      // Login with Clerk - uniquement si la réponse backend est un succès
      if (!signIn) {
        throw new Error('Clerk signIn is undefined');
      }
      
      let clerkSignIn;
      try {
        clerkSignIn = await signIn.create({
          identifier: email,
          password,
        });
      } catch (clerkError: any) {
        console.error('Clerk Login Error:', clerkError);
        
        // Si l'erreur vient de Clerk mais que le backend a validé l'utilisateur,
        // on peut retourner un succès quand même car l'utilisateur est authentifié côté backend
        if (backendResponse.success && backendResponse.user) {
          console.warn("Erreur Clerk mais utilisateur authentifié côté backend");
          return { success: true };
        }
        
        return { 
          success: false, 
          error: clerkError.message || 'Erreur de connexion avec Clerk' 
        };
      }
      
      if (clerkSignIn.status === 'complete') {
        try {
          // Get user details if we don't already have them from the backend
          if (!user) {
            const userDetails = await getCurrentUser();
            if (userDetails) {
              setUser(userDetails);
            } else {
              // Si l'utilisateur est connecté dans Clerk mais pas récupérable dans notre système
              console.warn("Utilisateur connecté dans Clerk mais non récupérable dans notre système");
              // Utiliser les données Clerk comme fallback
              if (clerkUser) {
                const clerkUserData = {
                  id: clerkUser.id,
                  username: clerkUser.username || '',
                  email: clerkUser.primaryEmailAddress?.emailAddress || '',
                  photoURL: clerkUser.imageUrl || '',
                };
                setUser(clerkUserData);
              }
            }
          }
          return { success: true };
        } catch (getUserError) {
          console.error('Error getting user after login:', getUserError);
          // Continue with success even if getting user details fails
          // The user is authenticated at this point
          return { success: true };
        }
      } else {
        throw new Error('Login with Clerk failed');
      }
    } catch (error: any) {
      console.error('Login Error:', error);
      return {
        success: false,
        error: error.message || 'Erreur de connexion'
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Logout the user
  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      console.log("Début du processus de déconnexion");

      // D'abord réinitialiser l'état local de l'application
      // pour éviter tout problème si Clerk échoue
      setUser(null);
      setIsAuthenticated(false);
      console.log("État utilisateur réinitialisé localement");

      // Sign out from Clerk
      if (signOut) {
        try {
          await signOut();
          console.log("Déconnexion de Clerk réussie");
        } catch (clerkError) {
          // Même si Clerk échoue, nous avons déjà réinitialisé l'état local
          console.error("Erreur lors de la déconnexion de Clerk:", clerkError);
          console.log("La session locale a été détruite de toute façon");
        }
      } else {
        console.warn("La fonction signOut de Clerk n'est pas disponible");
        
        // Sur le web, on peut essayer de forcer la déconnexion en utilisant l'objet clerk
        try {
          if (clerk && clerk.session) {
            // Pour la version web de Clerk, utiliser une autre méthode 
            // car la méthode destroy n'existe pas directement sur la session
            if (typeof window !== 'undefined') {
              // Dans les versions plus récentes, signOut est la méthode recommandée
              // Cette approche alternative n'est utilisée que si signOut n'est pas disponible
              console.log("Tentative alternative de déconnexion");
              await clerk.signOut();
            }
            console.log("Session Clerk terminée manuellement");
          }
        } catch (sessionError) {
          console.error("Impossible de terminer la session manuellement:", sessionError);
        }
      }
      
      // Forcer l'actualisation du context Clerk
      if (typeof window !== 'undefined') {
        // Ce code ne s'exécutera que dans un environnement navigateur
        console.log("Tentative de rafraîchissement du contexte Clerk");
        try {
          // @ts-ignore - cette propriété existe mais peut ne pas être typée
          if (clerk && clerk.__unstable_update) {
            // @ts-ignore
            await clerk.__unstable_update();
            console.log("Contexte Clerk rafraîchi");
          }
        } catch (updateError) {
          console.error("Erreur lors du rafraîchissement du contexte Clerk:", updateError);
        }
      }
      
      console.log("Processus de déconnexion terminé");
      
      // En environnement web, on peut éventuellement rediriger vers la page de connexion
      // si on détecte que nous sommes dans un environnement web
      if (typeof window !== 'undefined' && typeof window.location !== 'undefined') {
        // Ce code ne s'exécutera que dans un environnement navigateur
        // Vous pouvez décommenter la ligne suivante si vous voulez une redirection automatique
        // window.location.href = '/login';
      }
      
    } catch (error) {
      console.error('Logout error:', error);
      // Même en cas d'erreur, on réinitialise l'état local pour assurer la déconnexion
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
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
        console.error('Error getting token:', tokenError);
        return null;
      }
      
      if (!token) {
        console.warn('No token available');
        return null;
      }
      
      try {
        // Get user details from backend
        const response = await getUserInfo(token);
        
        // Vérifier si la réponse indique un succès
        if (response.success === false) {
          console.warn('Erreur récupération utilisateur:', response.error);
          
          // Afficher notification ou message à l'utilisateur si nécessaire
          // Cette partie peut être personnalisée selon les besoins de l'application
          
          // Utiliser les données Clerk comme fallback
          if (clerkUser) {
            return {
              id: clerkUser.id,
              username: clerkUser.username || '',
              email: clerkUser.primaryEmailAddress?.emailAddress || '',
              photoURL: clerkUser.imageUrl || '',
            };
          }
          return null;
        }
        
        // Si c'est un succès ou si response.user existe
        if (response.user || response) {
          const userData = response.user || response;
          return {
            id: userData.id || clerkUser.id,
            username: userData.username || clerkUser.username || '',
            email: userData.email || clerkUser.primaryEmailAddress?.emailAddress || '',
            photoURL: userData.imageUrl || userData.photoURL || clerkUser.imageUrl || '',
          };
        }
      } catch (apiError) {
        console.error('API Error getting user:', apiError);
        // Fall back to Clerk user data
        if (clerkUser) {
          return {
            id: clerkUser.id,
            username: clerkUser.username || '',
            email: clerkUser.primaryEmailAddress?.emailAddress || '',
            photoURL: clerkUser.imageUrl || '',
          };
        }
      }
      
      return null;
    } catch (error) {
      console.error('Get Current User Error:', error);
      return null;
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 