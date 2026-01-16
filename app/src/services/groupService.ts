import axios from 'axios';
import { API_BASE_URL } from '../config';

// Types for groups
export interface GroupUser {
  id: number;
  name: string;
  username: string;
  profilePicture?: string;
  profilePicturePublicId?: string;
  isVerify: boolean;
}

export interface GroupMember {
  id: number;
  user: GroupUser;
  nickname?: string;
  joinedAt: string;
  lastActiveAt?: string;
  roles: {
    role: {
      id: number;
      name: string;
      color?: string;
      position: number;
    };
  }[];
}

export interface GroupChannel {
  id: number;
  name: string;
  description?: string;
  type: 'TEXT' | 'VOICE' | 'ANNOUNCEMENT';
  position: number;
  isPrivate: boolean;
  _count: {
    messages: number;
  };
}

export interface GroupCategory {
  id: number;
  name: string;
  position: number;
  channels: GroupChannel[];
}

export interface Group {
  id: number;
  name: string;
  description?: string;
  icon?: string;
  iconPublicId?: string;
  isPublic: boolean;
  owner: GroupUser;
  members: GroupMember[];
  channels: GroupChannel[];
  categories?: GroupCategory[];
  _count: {
    members: number;
  };
  createdAt: string;
}

export interface GroupDetails extends Group {
  roles: {
    id: number;
    name: string;
    color?: string;
    position: number;
  }[];
}

export interface ChannelMessage {
  id: number;
  content: string;
  sender: GroupUser;
  messageType: 'TEXT' | 'IMAGE' | 'FILE' | 'SYSTEM';
  isEdited: boolean;
  isPinned: boolean;
  replyTo?: {
    id: number;
    content: string;
    sender: {
      name: string;
      username: string;
    };
  };
  reactions: {
    emoji: string;
    count: number;
    users: { id: number; name: string }[];
  }[];
  createdAt: string;
  updatedAt: string;
}

const groupService = {
  /**
   * Get all groups for the current user
   */
  getGroups: async (userId?: number): Promise<Group[]> => {
    const endpoint = `${API_BASE_URL}/groups`;
    const params = userId ? { userId } : {};
    try {
      const response = await axios.get(endpoint, { params });
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Error fetching groups:', error);
      throw error;
    }
  },

  /**
   * Get group details
   */
  getGroupDetails: async (groupId: number, userId?: number): Promise<GroupDetails> => {
    const endpoint = `${API_BASE_URL}/groups/${groupId}`;
    const params = userId ? { userId } : {};
    try {
      const response = await axios.get(endpoint, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching group details:', error);
      throw error;
    }
  },

  /**
   * Create a new group
   */
  createGroup: async (
    name: string,
    description?: string,
    isPublic: boolean = false,
    userId?: number
  ): Promise<Group> => {
    const endpoint = `${API_BASE_URL}/groups`;
    try {
      const response = await axios.post(endpoint, {
        name,
        description,
        isPublic,
        userId,
      });
      return response.data;
    } catch (error) {
      console.error('Error creating group:', error);
      throw error;
    }
  },

  /**
   * Join a group via invite code
   */
  joinGroup: async (inviteCode: string, userId?: number): Promise<{ group: Group; member: GroupMember }> => {
    const endpoint = `${API_BASE_URL}/groups/join/${inviteCode}`;
    try {
      const response = await axios.post(endpoint, { userId });
      return response.data;
    } catch (error) {
      console.error('Error joining group:', error);
      throw error;
    }
  },

  /**
   * Create a channel in a group
   */
  createChannel: async (
    groupId: number,
    name: string,
    description?: string,
    type: 'TEXT' | 'VOICE' | 'ANNOUNCEMENT' = 'TEXT',
    userId?: number
  ): Promise<GroupChannel> => {
    const endpoint = `${API_BASE_URL}/groups/${groupId}/channels`;
    try {
      const response = await axios.post(endpoint, {
        name,
        description,
        type,
        userId,
      });
      return response.data;
    } catch (error) {
      console.error('Error creating channel:', error);
      throw error;
    }
  },

  /**
   * Get messages for a channel
   */
  getChannelMessages: async (
    groupId: number,
    channelId: number,
    userId?: number,
    page: number = 1,
    limit: number = 50
  ): Promise<ChannelMessage[]> => {
    const endpoint = `${API_BASE_URL}/groups/${groupId}/channels/${channelId}/messages`;
    const params: any = { page, limit };
    if (userId) {
      params.userId = userId;
    }
    try {
      const response = await axios.get(endpoint, { params });
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Error fetching channel messages:', error);
      throw error;
    }
  },

  /**
   * Send a message in a channel
   */
  sendChannelMessage: async (
    groupId: number,
    channelId: number,
    content: string,
    userId?: number,
    replyToId?: number
  ): Promise<ChannelMessage> => {
    const endpoint = `${API_BASE_URL}/groups/${groupId}/channels/${channelId}/messages`;
    try {
      const response = await axios.post(endpoint, {
        content,
        userId,
        replyToId,
      });
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  /**
   * Create an invite for a group
   */
  createInvite: async (
    groupId: number,
    userId?: number,
    maxUses?: number,
    expiresInHours?: number
  ): Promise<{ code: string; expiresAt?: string }> => {
    const endpoint = `${API_BASE_URL}/groups/${groupId}/invite`;
    try {
      const response = await axios.post(endpoint, {
        userId,
        maxUses,
        expiresInHours,
      });
      return response.data;
    } catch (error) {
      console.error('Error creating invite:', error);
      throw error;
    }
  },
};

export default groupService;
