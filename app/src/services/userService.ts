import axios from "axios";
import { API_URL_USERS, API_URL } from "../config";

// Types
export interface UserProfile {
  id: number;
  username?: string;
  name?: string;
  description?: string;
  profilePicture?: string;
}

export interface UpdateUserProfileData {
  username?: string;
  name?: string;
  description?: string;
  profilePicture?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  error?: string;
  data?: T;
}

const userService = {
  /**
   * Récupère le profil de l'utilisateur
   */
  getProfile: async (userId: number): Promise<ApiResponse<UserProfile>> => {
    try {
      const response = await axios.get(`${API_URL_USERS}/${userId}`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      console.error("Error fetching user profile:", error);
      if (error.response) {
        console.error("Status:", error.response.status);
        console.error("Data:", JSON.stringify(error.response.data, null, 2));
      }
      return {
        success: false,
        error: error.response?.data?.error || "Failed to fetch profile",
      };
    }
  },

  /**
   * Met à jour le profil de l'utilisateur
   */
  updateProfile: async (
    userId: number,
    userData: UpdateUserProfileData
  ): Promise<ApiResponse<UserProfile>> => {
    try {
      console.log(
        "Updating profile with data:",
        JSON.stringify(userData, null, 2)
      );

      const response = await axios.put(`${API_URL_USERS}/${userId}`, userData);
      console.log("Update response:", response.status);

      return {
        success: true,
        data: response.data,
        message: "Profile updated successfully",
      };
    } catch (error: any) {
      console.error("Error updating user profile:", error);
      if (error.response) {
        console.error("Status:", error.response.status);
        console.error("Data:", JSON.stringify(error.response.data, null, 2));
      }
      return {
        success: false,
        error: error.response?.data?.error || "Failed to update profile",
      };
    }
  },

  /**
   * Upload de la photo de profil
   */
  uploadProfilePicture: async (
    userId: number,
    imageUri: string
  ): Promise<ApiResponse<{ profilePicture: string }>> => {
    try {
      // Extraire le nom du fichier de l'URI
      const extractFilename = (uri: string): string => {
        if (!uri) return "";
        const parts = uri.split("/");
        return parts[parts.length - 1];
      };

      const formData = new FormData();
      formData.append("profilePicture", {
        uri: imageUri,
        type: "image/jpeg",
        name: extractFilename(imageUri) || "profile-picture.jpg",
      } as any);

      console.log("Uploading profile picture...");

      const response = await axios.post(
        `${API_URL}/users/${userId}/profile-picture`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Upload response:", response.status);

      return {
        success: true,
        data: response.data,
        message: "Profile picture uploaded successfully",
      };
    } catch (error: any) {
      console.error("Error uploading profile picture:", error);
      if (error.response) {
        console.error("Status:", error.response.status);
        console.error("Data:", JSON.stringify(error.response.data, null, 2));
      }
      return {
        success: false,
        error:
          error.response?.data?.error || "Failed to upload profile picture",
      };
    }
  },
};

export default userService;
