import axios from "axios";
import { API_URL_USERS } from "../config";
import {
  FollowersResponse,
  FollowingResponse,
  FollowActionResponse,
  FollowStats,
} from "../types/follow.types";

// 🧪 CONFIGURATION TEMPORAIRE POUR TEST
// Token mock pour les routes de test backend
const TEST_TOKEN = 'test_mock_token_follow_2024';

// Ajouter automatiquement le token de test aux requêtes follow/unfollow
const getTestAuthHeaders = () => ({
  'Authorization': `Bearer ${TEST_TOKEN}`,
  'Content-Type': 'application/json'
});

const followService = {
  /**
   * Récupère la liste des followers d'un utilisateur
   */
  getFollowers: async (userId: number): Promise<FollowersResponse> => {
    try {
      // 1. Récupérer les IDs des followers
      const followersIdsResponse = await axios.get(`${API_URL_USERS}/${userId}/followers`);
      const followerIds = followersIdsResponse.data || [];
      
      if (followerIds.length === 0) {
        return {
          success: true,
          data: {
            followers: [],
            totalCount: 0,
          },
        };
      }

      // 2. Récupérer les détails de chaque follower
      const followersDetails = await Promise.all(
        followerIds.map(async (followerId: number) => {
          try {
            const userResponse = await axios.get(`${API_URL_USERS}/${followerId}`);
            const user = userResponse.data;
            
            return {
              id: user.id,
              username: user.username,
              name: user.name,
              profilePicture: user.profilePicture,
              profilePicturePublicId: user.profilePicturePublicId,
              isFollowing: false, // TODO: Déterminer si l'utilisateur connecté suit ce follower
            };
          } catch (error) {
            console.warn(`Could not fetch details for user ${followerId}:`, error);
            return null;
          }
        })
      );

      // 3. Filtrer les résultats nulls
      const validFollowers = followersDetails.filter(user => user !== null);

      return {
        success: true,
        data: {
          followers: validFollowers,
          totalCount: validFollowers.length,
        },
      };
    } catch (error: any) {
      console.error("❌ followService: Error fetching followers:", error);
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
      // 1. Récupérer les IDs des utilisateurs suivis
      const followingIdsResponse = await axios.get(`${API_URL_USERS}/${userId}/follows`);
      const followingIds = followingIdsResponse.data || [];
      
      if (followingIds.length === 0) {
        return {
          success: true,
          data: {
            following: [],
            totalCount: 0,
          },
        };
      }

      // 2. Récupérer les détails de chaque utilisateur suivi
      const followingDetails = await Promise.all(
        followingIds.map(async (followingId: number) => {
          try {
            const userResponse = await axios.get(`${API_URL_USERS}/${followingId}`);
            const user = userResponse.data;
            
            return {
              id: user.id,
              username: user.username,
              name: user.name,
              profilePicture: user.profilePicture,
              profilePicturePublicId: user.profilePicturePublicId,
              isFollowing: true, // Cet utilisateur est suivi par définition
            };
          } catch (error) {
            console.warn(`Could not fetch details for user ${followingId}:`, error);
            return null;
          }
        })
      );

      // 3. Filtrer les résultats nulls
      const validFollowing = followingDetails.filter(user => user !== null);

      return {
        success: true,
        data: {
          following: validFollowing,
          totalCount: validFollowing.length,
        },
      };
    } catch (error: any) {
      console.error("❌ followService: Error fetching following:", error);
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
   * Suivre un utilisateur - Version test temporaire
   */
  followUser: async (targetUserId: number, currentUserId: number): Promise<FollowActionResponse> => {
    try {
      if (!currentUserId) {
        return {
          success: false,
          error: "User not authenticated",
        };
      }

      console.log('🧪 Using test follow route with mock token');
      const response = await axios.post(`${API_URL_USERS}/test/follow`, {
        followerId: currentUserId,
        followingId: targetUserId,
      }, {
        headers: getTestAuthHeaders()
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
   * Ne plus suivre un utilisateur - Version test temporaire
   */
  unfollowUser: async (targetUserId: number, currentUserId: number): Promise<FollowActionResponse> => {
    try {
      if (!currentUserId) {
        return {
          success: false,
          error: "User not authenticated",
        };
      }

      console.log('🧪 Using test unfollow route with mock token');
      const response = await axios.post(`${API_URL_USERS}/test/unfollow`, {
        followerId: currentUserId,
        followingId: targetUserId,
      }, {
        headers: getTestAuthHeaders()
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
          
          // L'API retourne un tableau d'IDs directement
          const followingIds = currentUserFollowingResponse.data || [];
          isFollowing = followingIds.includes(userId);
        } catch (error) {
          console.warn("Could not check following status:", error);
        }

        // Vérifier si userId suit currentUserId (donc currentUserId est dans la liste following de userId)
        const userFollowingIds = followingResponse.data || [];
        isFollowedBy = userFollowingIds.includes(currentUserId);
      }

      return {
        success: true,
        data: {
          followersCount: followersResponse.data?.length || 0,
          followingCount: followingResponse.data?.length || 0,
          isFollowing,
          isFollowedBy,
        },
      };
    } catch (error: any) {
      console.error("❌ followService: Error fetching follow stats:", error);
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

  /**
   * Vérifie quels utilisateurs sont suivis parmi une liste d'IDs
   */
  checkFollowingStatus: async (userIds: number[], currentUserId: number): Promise<{ success: boolean; data?: number[]; error?: string }> => {
    try {
      if (!currentUserId || userIds.length === 0) {
        return {
          success: true,
          data: [],
        };
      }

      // Récupérer la liste des utilisateurs suivis par l'utilisateur connecté
      const followingResponse = await axios.get(`${API_URL_USERS}/${currentUserId}/follows`);
      
      // Extraire les IDs des utilisateurs suivis
      const followingIds = followingResponse.data || [];
      
      // Filtrer les IDs qui sont dans la liste des résultats de recherche
      const followedUsers = userIds.filter(userId => followingIds.includes(userId));
      
      return {
        success: true,
        data: followedUsers,
      };
    } catch (error: any) {
      console.error("Error checking following status:", error);
      if (error.response) {
        console.error("Status:", error.response.status);
        console.error("Data:", JSON.stringify(error.response.data, null, 2));
      }
      return {
        success: false,
        error: error.response?.data?.error || "Failed to check following status",
      };
    }
  },
};

export default followService; 