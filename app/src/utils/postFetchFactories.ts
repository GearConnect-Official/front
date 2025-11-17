import * as postService from '../services/postService';
import { Post as APIPost } from '../services/postService';

/**
 * Factory pour créer une fonction de fetch pour tous les posts
 */
export const createAllPostsFetcher = () => {
  return async (page: number, limit: number, userId?: number): Promise<APIPost[]> => {
    if (userId) {
      return await postService.default.getPosts(page, limit, userId);
    } else {
      return await postService.default.getAllPosts();
    }
  };
};

/**
 * Factory pour créer une fonction de fetch pour les posts suivis
 */
export const createFollowedPostsFetcher = () => {
  return async (page: number, limit: number, userId?: number): Promise<APIPost[]> => {
    if (!userId) {
      throw new Error('User ID is required for followed posts');
    }
    return await postService.default.getFollowedPosts(userId, page, limit);
  };
};

/**
 * Factory pour créer une fonction de fetch pour les posts d'un utilisateur
 */
export const createUserPostsFetcher = (targetUserId: number) => {
  return async (page: number, limit: number, currentUserId?: number): Promise<APIPost[]> => {
    const response = await postService.default.getUserPosts(targetUserId);
    
    // La réponse peut être un objet avec posts ou directement un tableau
    if (Array.isArray(response)) {
      return response;
    } else if (response.posts && Array.isArray(response.posts)) {
      return response.posts;
    }
    
    throw new Error('Invalid response format for user posts');
  };
};

/**
 * Factory pour créer une fonction de fetch pour les posts likés
 */
export const createLikedPostsFetcher = (targetUserId: number) => {
  return async (page: number, limit: number, currentUserId?: number): Promise<APIPost[]> => {
    const response = await postService.default.getLikedPosts(targetUserId);
    
    // La réponse peut être un objet avec posts ou directement un tableau
    if (Array.isArray(response)) {
      return response;
    } else if (response.posts && Array.isArray(response.posts)) {
      return response.posts;
    }
    
    throw new Error('Invalid response format for liked posts');
  };
};

/**
 * Factory pour créer une fonction de fetch pour les favoris
 */
export const createFavoritePostsFetcher = (targetUserId: number) => {
  return async (page: number, limit: number, currentUserId?: number): Promise<APIPost[]> => {
    const response = await postService.default.getFavorites(targetUserId);
    
    // La réponse peut être un objet avec posts ou directement un tableau
    if (Array.isArray(response)) {
      return response;
    } else if (response.posts && Array.isArray(response.posts)) {
      return response.posts;
    }
    
    throw new Error('Invalid response format for favorite posts');
  };
};

/**
 * Factory pour créer une fonction de fetch avec recherche
 */
export const createSearchPostsFetcher = (query: string) => {
  return async (page: number, limit: number, userId?: number): Promise<APIPost[]> => {
    const response = await postService.default.searchPosts(query);
    
    if (Array.isArray(response)) {
      return response;
    }
    
    throw new Error('Invalid response format for search posts');
  };
};

/**
 * Factory pour créer une fonction de fetch par tag
 */
export const createTagPostsFetcher = (tagName: string) => {
  return async (page: number, limit: number, userId?: number): Promise<APIPost[]> => {
    const response = await postService.default.getPostsByTag(tagName);
    
    if (Array.isArray(response)) {
      return response;
    }
    
    throw new Error('Invalid response format for tag posts');
  };
};

/**
 * Configuration de cache par type de posts
 */
export const CACHE_CONFIGS = {
  home: {
    ttl: 5 * 60 * 1000, // 5 minutes
    pageSize: 10
  },
  followed: {
    ttl: 3 * 60 * 1000, // 3 minutes (plus volatil)
    pageSize: 10
  },
  user: {
    ttl: 10 * 60 * 1000, // 10 minutes (moins volatil)
    pageSize: 12
  },
  liked: {
    ttl: 15 * 60 * 1000, // 15 minutes (très stable)
    pageSize: 12
  },
  favorites: {
    ttl: 15 * 60 * 1000, // 15 minutes (très stable)
    pageSize: 12
  },
  search: {
    ttl: 2 * 60 * 1000, // 2 minutes (volatil)
    pageSize: 15
  },
  tag: {
    ttl: 5 * 60 * 1000, // 5 minutes
    pageSize: 15
  }
} as const;

/**
 * Helper pour créer une clé de cache unique
 */
export const createCacheKey = (
  type: keyof typeof CACHE_CONFIGS,
  userId?: number,
  additionalParams?: string
): string => {
  const baseKey = `${type}-posts`;
  const userPart = userId ? `-user-${userId}` : '';
  const paramsPart = additionalParams ? `-${additionalParams}` : '';
  
  return `${baseKey}${userPart}${paramsPart}`;
};

/**
 * Helper pour obtenir la configuration de cache pour un type
 */
export const getCacheConfig = (type: keyof typeof CACHE_CONFIGS) => {
  return CACHE_CONFIGS[type];
}; 