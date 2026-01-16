import axios from 'axios';
import { API_URL_MESSAGING } from '../config';

// Types pour la messagerie
export interface MessageUser {
  id: number;
  name: string;
  username: string;
  profilePicture?: string;
  profilePicturePublicId?: string;
  isVerify: boolean;
}

export interface Message {
  id: number;
  content: string;
  sender: MessageUser;
  createdAt: string;
  updatedAt?: string;
  messageType?: 'TEXT' | 'IMAGE' | 'FILE';
  isEdited?: boolean;
}

export interface ConversationParticipant {
  user: MessageUser;
  joinedAt: string;
  lastReadAt?: string;
  isAdmin?: boolean;
}

export interface Conversation {
  id: number;
  name?: string;
  isGroup: boolean;
  isCommercial?: boolean; // Pour les conversations avec comptes certifiés
  participants: ConversationParticipant[];
  messages: Message[];
  updatedAt: string;
  createdAt: string;
  // Pour les demandes de discussion
  isRequest?: boolean;
  requestStatus?: 'pending' | 'accepted' | 'rejected';
  requesterId?: number;
}

export interface MessageRequest {
  id: number;
  from: MessageUser;
  to: MessageUser;
  message?: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export interface ConversationsResponse {
  conversations: Conversation[];
  requests: MessageRequest[];
  commercial: Conversation[];
}

const chatService = {
  /**
   * Get all conversations (normal, requests, commercial)
   */
  getConversations: async (userId?: number) => {
    const endpoint = `${API_URL_MESSAGING}/conversations`;
    const params = userId ? { userId } : {};
    try {
      const response = await axios.get(endpoint, { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching conversations:", error);
      throw error;
    }
  },

  /**
   * Get messages for a conversation
   */
  getMessages: async (
    conversationId: number,
    userId?: number,
    page: number = 1,
    limit: number = 20
  ) => {
    const endpoint = `${API_URL_MESSAGING}/conversations/${conversationId}/messages`;
    const params: any = { page, limit };
    if (userId) {
      params.userId = userId;
    }
    try {
      const response = await axios.get(endpoint, { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching messages:", error);
      throw error;
    }
  },

  /**
   * Send a message in a conversation
   */
  sendMessage: async (
    conversationId: number,
    content: string,
    userId?: number,
    messageType: 'TEXT' | 'IMAGE' | 'FILE' = 'TEXT'
  ) => {
    const endpoint = `${API_URL_MESSAGING}/conversations/${conversationId}/messages`;
    try {
      const response = await axios.post(endpoint, {
        content,
        messageType,
        userId,
      });
      return response.data;
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  },

  /**
   * Create a new conversation or send a message request
   * Automatically checks mutual follow
   */
  createConversation: async (
    participantIds: number[],
    userId?: number
  ) => {
    const endpoint = `${API_URL_MESSAGING}/conversations`;
    try {
      const response = await axios.post(endpoint, {
        participantIds,
        isGroup: participantIds.length > 1,
        userId,
      });
      return response.data;
    } catch (error) {
      console.error("Error creating conversation:", error);
      throw error;
    }
  },

  /**
   * Send a message request to a user who doesn't follow us back
   */
  sendMessageRequest: async (
    recipientId: number,
    userId?: number,
    message?: string
  ) => {
    const endpoint = `${API_URL_MESSAGING}/requests`;
    try {
      const response = await axios.post(endpoint, {
        recipientId,
        message,
        userId,
      });
      return response.data;
    } catch (error) {
      console.error("Error sending message request:", error);
      throw error;
    }
  },

  /**
   * Accept a message request
   */
  acceptRequest: async (
    requestId: number,
    userId?: number
  ) => {
    const endpoint = `${API_URL_MESSAGING}/requests/${requestId}/accept`;
    try {
      const response = await axios.post(endpoint, { userId });
      return response.data;
    } catch (error) {
      console.error("Error accepting request:", error);
      throw error;
    }
  },

  /**
   * Reject a message request
   */
  rejectRequest: async (
    requestId: number,
    userId?: number
  ) => {
    const endpoint = `${API_URL_MESSAGING}/requests/${requestId}/reject`;
    try {
      await axios.post(endpoint, { userId });
    } catch (error) {
      console.error("Error rejecting request:", error);
      throw error;
    }
  },

  /**
   * Search users for messaging
   */
  searchUsers: async (
    query: string,
    userId?: number
  ) => {
    const endpoint = `${API_URL_MESSAGING}/users/search`;
    const params: any = { q: query };
    if (userId) {
      params.userId = userId;
    }
    try {
      const response = await axios.get(endpoint, { params });
      return response.data;
    } catch (error) {
      console.error("Error searching users:", error);
      throw error;
    }
  },

  /**
   * Get all users with mutual follow (friends)
   */
  getFriends: async (userId?: number) => {
    const endpoint = `${API_URL_MESSAGING}/friends`;
    const params = userId ? { userId } : {};
    try {
      const response = await axios.get(endpoint, { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching friends:", error);
      throw error;
    }
  },

  /**
   * Check if two users follow each other
   */
  checkMutualFollow: async (
    userId: number,
    targetUserId: number
  ) => {
    const endpoint = `${API_URL_MESSAGING}/check-follow/${targetUserId}`;
    const params = { userId };
    try {
      const response = await axios.get(endpoint, { params });
      return response.data;
    } catch (error) {
      console.error("Error checking follow status:", error);
      throw error;
    }
  },
};

export default chatService;
