import axios from 'axios';
import { API_URL_COMMENTS } from '../config';

// Utility function to display request details
const logRequestDetails = (endpoint: string, method: string, data?: any) => {
  console.log(`\n====== COMMENT API REQUEST DETAILS ======`);
  console.log(`URL: ${endpoint}`);
  console.log(`Method: ${method}`);
  if (data) {
    console.log(`Data sent:`);
    console.log(JSON.stringify(data, null, 2));
  }
  console.log(`=======================================\n`);
};

export interface User {
  id: number;
  name: string;
  username: string;
}

export interface CommentLike {
  commentId: number;
  userId: number;
  createdAt: Date;
}

export interface HierarchicalComment {
  id: number;
  content: string;
  postId: number;
  userId: number;
  parentId?: number | null;
  user: User;
  likes: CommentLike[];
  replies?: HierarchicalComment[];
  createdAt: Date;
  updatedAt: Date;
  _count: {
    replies: number;
    likes: number;
  };
}

export interface CommentInput {
  postId: number;
  userId: number;
  content: string;
  parentId?: number;
}

export interface CommentsResponse {
  comments: HierarchicalComment[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export interface RepliesResponse {
  replies: HierarchicalComment[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

const commentService = {
  // Créer un nouveau commentaire ou répondre à un commentaire existant
  createComment: async (commentData: CommentInput): Promise<HierarchicalComment> => {
    const endpoint = `${API_URL_COMMENTS}`;
    logRequestDetails(endpoint, 'POST', commentData);
    try {
      const response = await axios.post(endpoint, commentData);
      return response.data;
    } catch (error) {
      console.error('Error creating comment:', error);
      throw error;
    }
  },

  // Récupérer tous les commentaires d'un post avec leur hiérarchie
  getCommentsByPost: async (postId: number, page: number = 1, limit: number = 10): Promise<CommentsResponse> => {
    const endpoint = `${API_URL_COMMENTS}/post/${postId}?page=${page}&limit=${limit}`;
    logRequestDetails(endpoint, 'GET');
    try {
      const response = await axios.get(endpoint);
      return response.data;
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }
  },

  // Récupérer les réponses d'un commentaire spécifique
  getCommentReplies: async (commentId: number, page: number = 1, limit: number = 5): Promise<RepliesResponse> => {
    const endpoint = `${API_URL_COMMENTS}/${commentId}/replies?page=${page}&limit=${limit}`;
    logRequestDetails(endpoint, 'GET');
    try {
      const response = await axios.get(endpoint);
      return response.data;
    } catch (error) {
      console.error('Error fetching comment replies:', error);
      throw error;
    }
  },

  // Mettre à jour un commentaire
  updateComment: async (commentId: number, content: string, userId: number): Promise<HierarchicalComment> => {
    const endpoint = `${API_URL_COMMENTS}/${commentId}`;
    const data = { content, userId };
    logRequestDetails(endpoint, 'PATCH', data);
    try {
      const response = await axios.patch(endpoint, data);
      return response.data;
    } catch (error) {
      console.error('Error updating comment:', error);
      throw error;
    }
  },

  // Supprimer un commentaire
  deleteComment: async (commentId: number, userId: number): Promise<{ message: string }> => {
    const endpoint = `${API_URL_COMMENTS}/${commentId}`;
    const data = { userId };
    logRequestDetails(endpoint, 'DELETE', data);
    try {
      const response = await axios.delete(endpoint, { data });
      return response.data;
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  },

  // Liker ou unliker un commentaire
  toggleCommentLike: async (commentId: number, userId: number): Promise<{ liked: boolean; message: string }> => {
    const endpoint = `${API_URL_COMMENTS}/${commentId}/like`;
    const data = { userId };
    logRequestDetails(endpoint, 'POST', data);
    try {
      const response = await axios.post(endpoint, data);
      return response.data;
    } catch (error) {
      console.error('Error toggling comment like:', error);
      throw error;
    }
  }
};

export default commentService; 