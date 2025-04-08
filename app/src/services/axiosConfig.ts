import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect } from 'react';

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

// Configure axios interceptors
export const configureAxios = async () => {
  // Request interceptor to add user ID from storage to all requests
  axios.interceptors.request.use(
    async (config) => {
      try {
        // Get user from AsyncStorage
        const userString = await AsyncStorage.getItem('user');
        if (userString) {
          const user = JSON.parse(userString);
          
          // Add user ID to headers if available
          if (user && user.id) {
            config.headers['user-id'] = user.id;
          }
        }
        return config;
      } catch (error) {
        console.error('Error in axios interceptor:', error);
        return config;
      }
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Réponse interceptor pour normaliser la gestion des erreurs
  axios.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    (error: AxiosError) => {
      let apiError: ApiError = {
        type: ErrorType.UNKNOWN,
        message: 'Une erreur inattendue s\'est produite',
        originalError: error
      };

      // Pas de réponse du serveur (problème réseau)
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
        // Récupérer le status HTTP et les données de l'erreur
        const { status, data } = error.response;
        const errorData = data as ApiErrorResponse;
        
        apiError.status = status;
        apiError.data = errorData;

        // Classification basée sur le code HTTP
        switch (status) {
          case 401:
            apiError.type = ErrorType.UNAUTHORIZED;
            apiError.message = 'Votre session a expiré. Veuillez vous reconnecter.';
            break;
          case 403:
            apiError.type = ErrorType.UNAUTHORIZED;
            apiError.message = 'Vous n\'avez pas les droits nécessaires pour effectuer cette action.';
            break;
          case 404:
            apiError.type = ErrorType.NOT_FOUND;
            apiError.message = 'La ressource demandée n\'existe pas.';
            break;
          case 422:
            apiError.type = ErrorType.VALIDATION;
            apiError.message = 'Les données fournies sont invalides.';
            break;
          case 500:
          case 502:
          case 503:
          case 504:
            apiError.type = ErrorType.SERVER;
            apiError.message = 'Le serveur a rencontré une erreur. Veuillez réessayer plus tard.';
            break;
          default:
            apiError.type = ErrorType.UNKNOWN;
            apiError.message = errorData?.message || errorData?.error || 'Une erreur est survenue.';
        }
      }

      // Log l'erreur pour le débogage
      console.error('API Error:', {
        type: apiError.type,
        status: apiError.status,
        message: apiError.message,
        url: error.config?.url
      });

      // Rejeter avec l'erreur formatée
      return Promise.reject(apiError);
    }
  );
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

// Create a component wrapper to satisfy Expo Router's requirement for default exports
const AxiosConfigProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    configureAxios();
  }, []);

  // Just return children directly without JSX fragment syntax to avoid TypeScript error
  return children as React.ReactElement || null;
};

export default AxiosConfigProvider; 