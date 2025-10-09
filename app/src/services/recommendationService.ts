import axios from "axios";
import { API_URL_RECOMMENDATIONS } from "../config";
import { Post, User } from "./postService";

/**
 * Service de recommandations
 * Gère les recommandations de posts, utilisateurs et événements
 */

// Types pour les recommandations
export interface RecommendedUser {
  id: number;
  externalId: string;
  name: string;
  username: string;
  email: string;
  description?: string;
  profilePicture?: string;
  isVerify: boolean;
  followersCount: number;
  postsCount: number;
  imageUrl?: string;
  firstName?: string;
  lastName?: string;
}

export interface RecommendedEvent {
  id: number;
  name: string;
  date: Date;
  location: string;
  urlTicket: string;
  finished: boolean;
  creator: User;
  tags: any[];
  photos: any[];
  _count: {
    sponsors: number;
    reviews: number;
  };
}

export interface AllRecommendations {
  userId: number;
  posts: {
    recommendations: Post[];
    count: number;
  };
  users: {
    recommendations: RecommendedUser[];
    count: number;
  };
  events: {
    recommendations: RecommendedEvent[];
    count: number;
  };
}

const logRequestDetails = (endpoint: string, method: string, data?: any) => {
  console.log(`\n====== RECOMMENDATION API REQUEST ======`);
  console.log(`URL: ${endpoint}`);
  console.log(`Method: ${method}`);
  if (data) {
    console.log(`Params:`, data);
  }
  console.log(`========================================\n`);
};

const recommendationService = {
  /**
   * Récupère toutes les recommandations pour un utilisateur
   */
  getAllRecommendations: async (
    userId: number,
    options?: {
      postsLimit?: number;
      usersLimit?: number;
      eventsLimit?: number;
    }
  ): Promise<AllRecommendations> => {
    const endpoint = `${API_URL_RECOMMENDATIONS}/${userId}`;
    const params = {
      postsLimit: options?.postsLimit || 10,
      usersLimit: options?.usersLimit || 5,
      eventsLimit: options?.eventsLimit || 5,
    };
    logRequestDetails(endpoint, "GET", params);
    
    try {
      const response = await axios.get(endpoint, { params });
      console.log(`✅ Recommandations récupérées: ${response.data.posts.count} posts, ${response.data.users.count} users, ${response.data.events.count} events`);
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching all recommendations:", error);
      throw error;
    }
  },

  /**
   * Récupère les posts recommandés pour un utilisateur
   */
  getRecommendedPosts: async (
    userId: number,
    limit: number = 10
  ): Promise<{ userId: number; recommendations: Post[]; count: number }> => {
    const endpoint = `${API_URL_RECOMMENDATIONS}/posts/${userId}`;
    const params = { limit };
    logRequestDetails(endpoint, "GET", params);
    
    try {
      const response = await axios.get(endpoint, { params });
      console.log(`✅ ${response.data.count} posts recommandés récupérés`);
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching recommended posts:", error);
      throw error;
    }
  },

  /**
   * Récupère les utilisateurs recommandés à suivre
   */
  getRecommendedUsers: async (
    userId: number,
    limit: number = 10
  ): Promise<{ userId: number; recommendations: RecommendedUser[]; count: number }> => {
    const endpoint = `${API_URL_RECOMMENDATIONS}/users/${userId}`;
    const params = { limit };
    logRequestDetails(endpoint, "GET", params);
    
    try {
      const response = await axios.get(endpoint, { params });
      console.log(`✅ ${response.data.count} utilisateurs recommandés récupérés`);
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching recommended users:", error);
      throw error;
    }
  },

  /**
   * Récupère les événements recommandés
   */
  getRecommendedEvents: async (
    userId: number,
    limit: number = 10
  ): Promise<{ userId: number; recommendations: RecommendedEvent[]; count: number }> => {
    const endpoint = `${API_URL_RECOMMENDATIONS}/events/${userId}`;
    const params = { limit };
    logRequestDetails(endpoint, "GET", params);
    
    try {
      const response = await axios.get(endpoint, { params });
      console.log(`✅ ${response.data.count} événements recommandés récupérés`);
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching recommended events:", error);
      throw error;
    }
  },
};

export default recommendationService;

