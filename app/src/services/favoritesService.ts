import axios from 'axios';
import apiConfig from '../config';

const API_URL_FAVORITES = `${apiConfig.baseUrl}/favorites`;

interface FavoriteToggleResponse {
  saved: boolean;
  message: string;
}

interface FavoriteStatusResponse {
  isFavorited: boolean;
}

interface FavoritesCountResponse {
  count: number;
}

interface FavoritesListResponse {
  favorites: any[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const logRequestDetails = (endpoint: string, method: string, data?: any) => {
  console.log(`🔗 ${method} ${endpoint}`);
  if (data) {
    console.log('📤 Request data:', data);
  }
};

const favoritesService = {
  /**
   * Toggle favorite status for a post
   */
  toggleFavorite: async (postId: number, userId: number): Promise<FavoriteToggleResponse> => {
    const endpoint = `${API_URL_FAVORITES}/toggle`;
    const data = { postId, userId };
    logRequestDetails(endpoint, 'POST', data);
    
    try {
      const response = await axios.post(endpoint, data);
      console.log('✅ Toggle favorite success:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error toggling favorite:', error);
      throw error;
    }
  },

  /**
   * Get user's favorite posts
   */
  getUserFavorites: async (userId: number, page: number = 1, limit: number = 10): Promise<FavoritesListResponse> => {
    const endpoint = `${API_URL_FAVORITES}/user/${userId}`;
    const params = { page, limit };
    logRequestDetails(endpoint, 'GET', params);
    
    try {
      const response = await axios.get(endpoint, { params });
      console.log('✅ Get user favorites success:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error getting user favorites:', error);
      throw error;
    }
  },

  /**
   * Check if a post is favorited by a user
   */
  isFavorited: async (postId: number, userId: number): Promise<FavoriteStatusResponse> => {
    const endpoint = `${API_URL_FAVORITES}/check/${postId}/${userId}`;
    logRequestDetails(endpoint, 'GET');
    
    try {
      const response = await axios.get(endpoint);
      console.log('✅ Check favorite status success:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error checking favorite status:', error);
      throw error;
    }
  },

  /**
   * Get favorites count for a post
   */
  getFavoritesCount: async (postId: number): Promise<FavoritesCountResponse> => {
    const endpoint = `${API_URL_FAVORITES}/count/${postId}`;
    logRequestDetails(endpoint, 'GET');
    
    try {
      const response = await axios.get(endpoint);
      console.log('✅ Get favorites count success:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error getting favorites count:', error);
      throw error;
    }
  }
};

export default favoritesService; 