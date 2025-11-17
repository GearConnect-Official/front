import axios, { AxiosError, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect } from 'react';
// Import officiel Clerk pour accéder au token hors composants
import { useAuth, getClerkInstance } from '@clerk/clerk-expo';

// Types d'erreurs identifiables
export enum ErrorType {
  NETWORK = 'NETWORK',
  SERVER = 'SERVER',
  TIMEOUT = 'TIMEOUT',
  UNAUTHORIZED = 'UNAUTHORIZED',
  NOT_FOUND = 'NOT_FOUND',
  VALIDATION = 'VALIDATION',
  UNKNOWN = 'UNKNOWN'
}

// Interface pour les erreurs d'API normalisées
export interface ApiError {
  type: ErrorType;
  status?: number;
  message: string;
  originalError?: any;
  data?: any;
}

// Interface pour les réponses d'erreur API
interface ApiErrorResponse {
  message?: string;
  error?: string;
  [key: string]: any;
}

// 🔥 Configuration professionnelle des interceptors Axios avec Clerk
let interceptorsConfigured = false;

export const configureAxios = async () => {
  // Éviter la double configuration
  if (interceptorsConfigured) {
    console.log('✅ Axios interceptors already configured');
    return;
  }

  console.log('🚀 Configuring Axios interceptors with Clerk...');

  // 🔐 REQUEST INTERCEPTOR - Ajouter automatiquement le Bearer token
  axios.interceptors.request.use(
    async (config) => {
      try {
        console.log(`📤 [${config.method?.toUpperCase()}] ${config.url}`);

        // 1. Récupérer le token Clerk (approche officielle)
        try {
          const clerkInstance = getClerkInstance();
          const token = await clerkInstance.session?.getToken();
          
          if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
            console.log('🔑 Bearer token added to request');
          } else {
            console.log('⚠️ No Clerk token available');
          }
        } catch (clerkError) {
          console.warn('⚠️ Could not get Clerk token:', clerkError);
        }

        // 2. Ajouter l'ID utilisateur depuis AsyncStorage (si nécessaire pour votre API)
        try {
          const userString = await AsyncStorage.getItem('user');
          if (userString) {
            const user = JSON.parse(userString);
            if (user && user.id) {
              config.headers['user-id'] = user.id;
              console.log('👤 User ID added to headers');
            }
          }
        } catch (storageError) {
          console.warn('⚠️ Could not get user from storage:', storageError);
        }

        // 3. Ajouter headers par défaut
        config.headers['Content-Type'] = config.headers['Content-Type'] || 'application/json';
        config.headers['Accept'] = 'application/json';

        return config;
      } catch (error) {
        console.error('❌ Error in request interceptor:', error);
        return config;
      }
    },
    (error) => {
      console.error('❌ Request interceptor error:', error);
      return Promise.reject(error);
    }
  );

  // 📥 RESPONSE INTERCEPTOR - Gestion des erreurs et logs
  axios.interceptors.response.use(
    (response: AxiosResponse) => {
      console.log(`✅ [${response.config.method?.toUpperCase()}] ${response.config.url} - ${response.status}`);
      return response;
    },
    (error: AxiosError) => {
      const url = error.config?.url || 'unknown';
      const method = error.config?.method?.toUpperCase() || 'UNKNOWN';
      
      let apiError: ApiError = {
        type: ErrorType.UNKNOWN,
        message: 'Une erreur inattendue s\'est produite',
        originalError: error
      };

      // Vérifier si c'est une requête de health check pour éviter les logs de spam
      const isHealthCheck = url.includes('/api/health');

      // Gestion des erreurs réseau
      if (error.code === 'ECONNABORTED') {
        apiError = {
          type: ErrorType.TIMEOUT,
          message: 'La requête a expiré. Veuillez réessayer.',
          originalError: error
        };
      } else if (error.code === 'ERR_NETWORK') {
        apiError = {
          type: ErrorType.NETWORK,
          message: 'Impossible de se connecter au serveur. Vérifiez votre connexion internet.',
          originalError: error
        };
      } else if (error.response) {
        // Réponse d'erreur du serveur
        const { status, data } = error.response;
        const errorData = data as ApiErrorResponse;
        
        apiError.status = status;
        apiError.data = errorData;

        // Classification basée sur le code HTTP
        switch (status) {
          case 401:
            apiError.type = ErrorType.UNAUTHORIZED;
            apiError.message = 'Authentication requise. Token invalide ou expiré.';
            console.log('🔒 401 Unauthorized - Token problem detected');
            break;
          case 403:
            apiError.type = ErrorType.UNAUTHORIZED;
            apiError.message = 'Accès refusé. Permissions insuffisantes.';
            break;
          case 404:
            apiError.type = ErrorType.NOT_FOUND;
            apiError.message = 'Ressource non trouvée.';
            break;
          case 422:
            apiError.type = ErrorType.VALIDATION;
            apiError.message = 'Données invalides.';
            break;
          case 500:
          case 502:
          case 503:
          case 504:
            apiError.type = ErrorType.SERVER;
            apiError.message = 'Erreur serveur. Veuillez réessayer plus tard.';
            break;
          default:
            apiError.type = ErrorType.UNKNOWN;
            apiError.message = errorData?.message || errorData?.error || 'Erreur inconnue.';
        }
      }

      // Logs conditionnels
      if (!isHealthCheck && apiError.type !== ErrorType.NETWORK) {
        console.error(`❌ [${method}] ${url} - ${apiError.status || 'Network'}: ${apiError.message}`);
      }

      return Promise.reject(apiError);
    }
  );

  interceptorsConfigured = true;
  console.log('✅ Axios interceptors configured successfully!');
};

// Handler d'erreur global pour les composants
export const handleApiError = (error: any): ApiError => {
  // Si c'est déjà une ApiError normalisée, on la retourne directement
  if (error && error.type && Object.values(ErrorType).includes(error.type)) {
    return error as ApiError;
  }

  // Par défaut, on retourne une erreur inconnue
  return {
    type: ErrorType.UNKNOWN,
    message: 'Une erreur inattendue s\'est produite',
    originalError: error
  };
};

// 🚀 Provider moderne pour Expo Router avec configuration automatique
const AxiosConfigProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { isLoaded } = useAuth();

  useEffect(() => {
    // Attendre que Clerk soit chargé avant de configurer axios
    if (isLoaded) {
      console.log('🎯 Clerk loaded, configuring axios...');
      configureAxios();
    }
  }, [isLoaded]);

  return children as React.ReactElement || null;
};

export default AxiosConfigProvider; 