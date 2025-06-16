import axios from "axios";
import { API_URL_USERS } from "../config";
import {
  FollowersResponse,
  FollowingResponse,
  FollowActionResponse,
  SuggestionsResponse,
  FollowStats,
} from "../types/follow.types";

const followService = {
  /**
   * Récupère la liste des followers d'un utilisateur
   */
  getFollowers: async (userId: number): Promise<FollowersResponse> => {
    try {
      const response = await axios.get(`${API_URL_USERS}/${userId}/followers`);
      return {
        success: true,
        data: {
          followers: response.data.followers || [],
          totalCount: response.data.totalCount || 0,
        },
      };
    } catch (error: any) {
      console.error("Error fetching followers:", error);
      if (error.response) {
        console.error("Status:", error.response.status);
        console.error("Data:", JSON.stringify(error.response.data, null, 2));
      }
      return {
        success: false,
        error: error.response?.data?.error || "Failed to fetch followers",
      };
    }
  },

  /**
   * Récupère la liste des utilisateurs suivis
   */
  getFollowing: async (userId: number): Promise<FollowingResponse> => {
    try {
      const response = await axios.get(`${API_URL_USERS}/${userId}/follows`);
      return {
        success: true,
        data: {
          following: response.data.following || [],
          totalCount: response.data.totalCount || 0,
        },
      };
    } catch (error: any) {
      console.error("Error fetching following:", error);
      if (error.response) {
        console.error("Status:", error.response.status);
        console.error("Data:", JSON.stringify(error.response.data, null, 2));
      }
      return {
        success: false,
        error: error.response?.data?.error || "Failed to fetch following",
      };
    }
  },

  /**
   * Suivre un utilisateur
   */
  followUser: async (targetUserId: number): Promise<FollowActionResponse> => {
    try {
      const response = await axios.post(`${API_URL_USERS}/follow`, {
        targetUserId,
      });
      return {
        success: true,
        data: {
          isFollowing: true,
          followersCount: response.data.followersCount || 0,
          followingCount: response.data.followingCount || 0,
        },
        message: "User followed successfully",
      };
    } catch (error: any) {
      console.error("Error following user:", error);
      if (error.response) {
        console.error("Status:", error.response.status);
        console.error("Data:", JSON.stringify(error.response.data, null, 2));
      }
      return {
        success: false,
        error: error.response?.data?.error || "Failed to follow user",
      };
    }
  },

  /**
   * Ne plus suivre un utilisateur
   */
  unfollowUser: async (targetUserId: number): Promise<FollowActionResponse> => {
    try {
      const response = await axios.post(`${API_URL_USERS}/unfollow`, {
        targetUserId,
      });
      return {
        success: true,
        data: {
          isFollowing: false,
          followersCount: response.data.followersCount || 0,
          followingCount: response.data.followingCount || 0,
        },
        message: "User unfollowed successfully",
      };
    } catch (error: any) {
      console.error("Error unfollowing user:", error);
      if (error.response) {
        console.error("Status:", error.response.status);
        console.error("Data:", JSON.stringify(error.response.data, null, 2));
      }
      return {
        success: false,
        error: error.response?.data?.error || "Failed to unfollow user",
      };
    }
  },

  /**
   * Récupère les statistiques de follow d'un utilisateur en combinant les appels followers et following
   */
  getFollowStats: async (userId: number, currentUserId?: number): Promise<{ success: boolean; data?: FollowStats; error?: string }> => {
    try {
      const [followersResponse, followingResponse] = await Promise.all([
        axios.get(`${API_URL_USERS}/${userId}/followers`),
        axios.get(`${API_URL_USERS}/${userId}/follows`),
      ]);

      let isFollowing = false;
      let isFollowedBy = false;

      // Si on a un currentUserId, on vérifie les relations
      if (currentUserId && currentUserId !== userId) {
        // Vérifier si currentUserId suit userId (donc userId est dans la liste following de currentUserId)
        try {
          const currentUserFollowingResponse = await axios.get(`${API_URL_USERS}/${currentUserId}/follows`);
          isFollowing = currentUserFollowingResponse.data.following?.some((user: any) => user.id === userId) || false;
        } catch (error) {
          console.warn("Could not check following status:", error);
        }

        // Vérifier si userId suit currentUserId (donc currentUserId est dans la liste following de userId)  
        isFollowedBy = followingResponse.data.following?.some((user: any) => user.id === currentUserId) || false;
      }

      return {
        success: true,
        data: {
          followersCount: followersResponse.data.totalCount || 0,
          followingCount: followingResponse.data.totalCount || 0,
          isFollowing,
          isFollowedBy,
        },
      };
    } catch (error: any) {
      console.error("Error fetching follow stats:", error);
      if (error.response) {
        console.error("Status:", error.response.status);
        console.error("Data:", JSON.stringify(error.response.data, null, 2));
      }
      return {
        success: false,
        error: error.response?.data?.error || "Failed to fetch follow stats",
      };
    }
  },

  /**
   * Vérifie si un utilisateur suit un autre utilisateur en récupérant sa liste de following
   */
  checkIfFollowing: async (targetUserId: number): Promise<{ success: boolean; data?: { isFollowing: boolean }; error?: string }> => {
    try {
      // Note: Cette méthode nécessiterait l'ID de l'utilisateur connecté
      // Pour l'instant, on retourne false par défaut
      // TODO: Passer l'ID de l'utilisateur connecté et faire l'appel approprié
      return {
        success: true,
        data: {
          isFollowing: false,
        },
      };
    } catch (error: any) {
      console.error("Error checking follow status:", error);
      return {
        success: false,
        error: "Failed to check follow status - method needs current user ID",
      };
    }
  },

  /**
   * Recherche d'utilisateurs par nom ou username
   */
  searchUsers: async (query: string, limit: number = 10, page: number = 1): Promise<{
    success: boolean;
    data?: {
      users: Array<{
        id: number;
        username: string;
        name?: string;
        profilePicture?: string;
        profilePicturePublicId?: string;
        isVerify: boolean;
      }>;
      pagination: {
        totalCount: number;
        currentPage: number;
        totalPages: number;
        hasMore: boolean;
      };
    };
    error?: string;
  }> => {
    try {
      const response = await axios.get(`${API_URL_USERS}/search`, {
        params: { query, limit, page },
      });
      
      if (response.data.success) {
        return {
          success: true,
          data: {
            users: response.data.users || [],
            pagination: response.data.pagination || {
              totalCount: 0,
              currentPage: 1,
              totalPages: 0,
              hasMore: false,
            },
          },
        };
      } else {
        return {
          success: false,
          error: response.data.error || "Failed to search users",
        };
      }
    } catch (error: any) {
      console.error("Error searching users:", error);
      if (error.response) {
        console.error("Status:", error.response.status);
        console.error("Data:", JSON.stringify(error.response.data, null, 2));
      }
      return {
        success: false,
        error: error.response?.data?.error || "Failed to search users",
      };
    }
  },
};

export default followService; 