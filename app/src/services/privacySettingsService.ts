import axios from 'axios';
import { API_URL_PRIVACYSETTINGS } from '../config';

// Create a separate axios instance without Clerk interceptors
const api = axios.create({
  baseURL: API_URL_PRIVACYSETTINGS,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 30000,
});

export interface PrivacySettings {
  profileVisibility: boolean;
  showEmail: boolean;
  allowMessages: boolean;
  showActivity: boolean;
  updatedAt: string;
}

export interface PrivacySettingsResponse {
  success: boolean;
  data?: PrivacySettings;
  error?: string;
}

export interface UpdatePrivacySettingsDto {
  profileVisibility?: boolean;
  showEmail?: boolean;
  allowMessages?: boolean;
  showActivity?: boolean;
}

class PrivacySettingsService {
  /**
   * Get user privacy settings
   */
  async getPrivacySettings(userId: number): Promise<PrivacySettingsResponse> {
    try {
      console.log('📡 Fetching privacy settings for user:', userId);
      
      const response = await api.get<PrivacySettingsResponse>(`/${userId}`);

      console.log('✅ Privacy settings fetched successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error fetching privacy settings:', error);
      
      if (error.response) {
        console.error('Status:', error.response.status);
        console.error('Data:', error.response.data);
        return {
          success: false,
          error: error.response.data?.error || 'Failed to fetch privacy settings',
        };
      }
      
      return {
        success: false,
        error: error.message || 'Network error',
      };
    }
  }

  /**
   * Update user privacy settings
   */
  async updatePrivacySettings(
    userId: number,
    settings: UpdatePrivacySettingsDto
  ): Promise<PrivacySettingsResponse> {
    try {
      console.log('📡 Updating privacy settings for user:', userId, settings);
      
      const response = await api.put<PrivacySettingsResponse>(`/${userId}`, settings);

      console.log('✅ Privacy settings updated successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error updating privacy settings:', error);
      
      if (error.response) {
        console.error('Status:', error.response.status);
        console.error('Data:', error.response.data);
        return {
          success: false,
          error: error.response.data?.error || 'Failed to update privacy settings',
        };
      }
      
      return {
        success: false,
        error: error.message || 'Network error',
      };
    }
  }

  /**
   * Update a single privacy setting
   */
  async updateSingleSetting(
    userId: number,
    setting: keyof UpdatePrivacySettingsDto,
    value: boolean
  ): Promise<PrivacySettingsResponse> {
    return this.updatePrivacySettings(userId, { [setting]: value });
  }

  /**
   * Reset privacy settings to defaults
   */
  async resetPrivacySettings(userId: number): Promise<PrivacySettingsResponse> {
    try {
      console.log('📡 Resetting privacy settings for user:', userId);
      
      const response = await api.post<PrivacySettingsResponse>(`/${userId}/reset`);

      console.log('✅ Privacy settings reset successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error resetting privacy settings:', error);
      
      if (error.response) {
        console.error('Status:', error.response.status);
        console.error('Data:', error.response.data);
        return {
          success: false,
          error: error.response.data?.error || 'Failed to reset privacy settings',
        };
      }
      
      return {
        success: false,
        error: error.message || 'Network error',
      };
    }
  }
}

export const privacySettingsService = new PrivacySettingsService();
export default privacySettingsService;

