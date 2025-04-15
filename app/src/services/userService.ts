import axios from "axios";
import { API_URL_USERS } from "../config";

export interface User {  
  id?: number,
  externalId: string,
  name: string,
  username: string,
  email: string,
  birthday: Date,
  additionnalData: {
    avatar: string,
  },
  isVerify: boolean,
  createdAt: string
}

const userService = {
  // Get users by id
  getUserById: async (id: string) => {
    try {
      const response = await axios.get(`${API_URL_USERS}/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error;
    }
  },

}

export default userService;