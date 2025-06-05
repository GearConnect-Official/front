/**
 * Enumération des routes de l'API
 */
export enum ApiRoutes {
  AUTH = 'auth',
  EVENTS = 'events',
  POSTS = 'posts',
  EVENTTAGS = 'event-tags',
  EVENTREVIEWS = 'reviews',
  RELATEDPRODUCTS = 'related-products',
  INTERACTIONS = 'interactions',
  COMMENTS = 'comments',
  SPONSOR = 'sponsor',
  TAGS = 'tags',
  USERS = 'users',
  HEALTH = 'health',
}

/**
 * Interface pour la configuration de l'API
 */
export interface ApiConfig {
  protocol: string;
  host: string;
  port: number;
  baseUrl: string;
}

/**
 * Type pour les endpoints de l'API
 */
export type ApiEndpoints = {
  [key in ApiRoutes]: string;
};

// Default export to avoid Expo Router warnings
const apiTypes = {
  ApiRoutes
};

export default apiTypes; 