/**
 * Interface pour un utilisateur suiveur/suivi
 */
export interface FollowUser {
  id: number;
  username: string;
  name?: string;
  profilePicture?: string;
  profilePicturePublicId?: string;
  isFollowing?: boolean;
  followedAt?: string;
}

/**
 * Interface pour la réponse de la liste des followers
 */
export interface FollowersResponse {
  success: boolean;
  message?: string;
  error?: string;
  data?: {
    followers: FollowUser[];
    totalCount: number;
  };
}

/**
 * Interface pour la réponse de la liste des following
 */
export interface FollowingResponse {
  success: boolean;
  message?: string;
  error?: string;
  data?: {
    following: FollowUser[];
    totalCount: number;
  };
}

/**
 * Interface pour la réponse d'action follow/unfollow
 */
export interface FollowActionResponse {
  success: boolean;
  message?: string;
  error?: string;
  data?: {
    isFollowing: boolean;
    followersCount: number;
    followingCount: number;
  };
}

/**
 * Interface pour les suggestions d'utilisateurs
 */
export interface SuggestedUser extends FollowUser {
  mutualFollowersCount?: number;
  reason?: 'mutual_friends' | 'interests' | 'location' | 'new_user';
}

/**
 * Interface pour la réponse des suggestions
 */
export interface SuggestionsResponse {
  success: boolean;
  message?: string;
  error?: string;
  data?: {
    suggestions: SuggestedUser[];
    totalCount: number;
  };
}

/**
 * Interface pour les statistiques de follow
 */
export interface FollowStats {
  followersCount: number;
  followingCount: number;
  isFollowing?: boolean;
  isFollowedBy?: boolean;
} 