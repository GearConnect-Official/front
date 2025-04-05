import { ApiConfig, ApiRoutes, ApiEndpoints } from './types/api.types';
import Constants from 'expo-constants';

if (!Constants.expoConfig?.extra?.apiHost) {
  throw new Error('API_HOST is not defined in .env file');
}

/**
 * Configuration de l'API
 */
const apiConfig: ApiConfig = {
  protocol: Constants.expoConfig?.extra?.apiProtocol || 'http',
  host: Constants.expoConfig?.extra?.apiHost,
  port: Constants.expoConfig?.extra?.apiPort,
  get baseUrl() {
    return `${this.protocol}://${this.host}:${this.port}/api`;
  }
};

/**
 * Génère les URLs pour tous les endpoints de l'API
 */
const generateApiEndpoints = (): ApiEndpoints => {
  return Object.values(ApiRoutes).reduce((endpoints, route) => ({
    ...endpoints,
    [route]: `${apiConfig.baseUrl}/${route}`
  }), {} as ApiEndpoints);
};

/**
 * URLs des endpoints de l'API
 */
export const API_ENDPOINTS = generateApiEndpoints();

/**
 * URLs spécifiques pour chaque service
 */
export const {
  [ApiRoutes.AUTH]: API_URL_AUTH,
  [ApiRoutes.EVENTS]: API_URL_EVENTS,
  [ApiRoutes.POSTS]: API_URL_POSTS,
  [ApiRoutes.INTERACTIONS]: API_URL_INTERACTIONS,
  [ApiRoutes.TAGS]: API_URL_TAGS,
} = API_ENDPOINTS;

export default apiConfig;