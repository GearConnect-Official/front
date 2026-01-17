import axios from 'axios';
import { API_URL_USERS } from '../config';

export interface VerificationRequest {
  id: number;
  userId: number;
  user: {
    id: number;
    username: string;
    name: string;
    profilePicture?: string;
    profilePicturePublicId?: string;
  };
  message?: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
  updatedAt?: string;
}

export interface CreateVerificationRequestData {
  message?: string;
  userId: number;
}

const verificationService = {
  /**
   * Create a verification request
   */
  createRequest: async (data: CreateVerificationRequestData): Promise<VerificationRequest> => {
    const endpoint = `${API_URL_USERS}/verification/request`;
    try {
      const response = await axios.post(endpoint, data);
      return response.data;
    } catch (error: any) {
      // If 404, the route doesn't exist yet (backend not implemented)
      // Don't log it as an error
      const is404 = error.response?.status === 404 || 
                    error.status === 404 || 
                    error.type === 'NOT_FOUND' ||
                    (error.originalError && error.originalError.response?.status === 404);
      
      if (is404) {
        const notImplementedError: any = new Error('Verification request feature is not yet available. Please try again later.');
        notImplementedError.status = 404;
        notImplementedError.isNotImplemented = true;
        notImplementedError.type = 'NOT_FOUND';
        // Preserve originalError for debugging if needed
        notImplementedError.originalError = error.originalError || error;
        throw notImplementedError;
      }
      // Only log other errors (network errors, 500, etc.)
      console.error('Error creating verification request:', error);
      throw error;
    }
  },

  /**
   * Get all verification requests (for admin dashboard)
   */
  getAllRequests: async (userId?: number): Promise<VerificationRequest[]> => {
    const endpoint = `${API_URL_USERS}/verification/requests`;
    const params = userId ? { userId } : {};
    try {
      const response = await axios.get(endpoint, { params });
      return response.data;
    } catch (error: any) {
      console.error('Error fetching verification requests:', error);
      throw error;
    }
  },

  /**
   * Get pending verification requests (for admin dashboard)
   */
  getPendingRequests: async (userId?: number): Promise<VerificationRequest[]> => {
    const endpoint = `${API_URL_USERS}/verification/requests/pending`;
    const params = userId ? { userId } : {};
    try {
      const response = await axios.get(endpoint, { params });
      return response.data;
    } catch (error: any) {
      console.error('Error fetching pending verification requests:', error);
      throw error;
    }
  },

  /**
   * Accept a verification request
   */
  acceptRequest: async (requestId: number, userId?: number): Promise<void> => {
    const endpoint = `${API_URL_USERS}/verification/requests/${requestId}/accept`;
    try {
      await axios.post(endpoint, { userId });
    } catch (error: any) {
      console.error('Error accepting verification request:', error);
      throw error;
    }
  },

  /**
   * Reject a verification request
   */
  rejectRequest: async (requestId: number, userId?: number): Promise<void> => {
    const endpoint = `${API_URL_USERS}/verification/requests/${requestId}/reject`;
    try {
      await axios.post(endpoint, { userId });
    } catch (error: any) {
      console.error('Error rejecting verification request:', error);
      throw error;
    }
  },

  /**
   * Check if user has a pending verification request
   */
  checkUserRequest: async (userId: number): Promise<VerificationRequest | null> => {
    const endpoint = `${API_URL_USERS}/verification/request/check`;
    try {
      const response = await axios.get(endpoint, { params: { userId } });
      return response.data || null;
    } catch (error: any) {
      // 404 is expected if the route doesn't exist yet (backend not implemented)
      // Don't log it as an error - silently return null
      if (error.response?.status === 404 || error.status === 404 || error.type === 'NOT_FOUND') {
        return null;
      }
      // Only log other errors (network errors, 500, etc.)
      console.error('Error checking user verification request:', error);
      return null;
    }
  },
};

export default verificationService;
