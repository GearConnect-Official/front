import axios from 'axios';
import { API_URL_POSTS } from '../config';

// Utility function to display request details
const logRequestDetails = (endpoint: string, method: string, data?: any) => {
  console.log(`\n====== API REQUEST DETAILS ======`);
  console.log(`URL: ${endpoint}`);
  console.log(`Method: ${method}`);
  if (data) {
    console.log(`Data sent:`);
    console.log(JSON.stringify(data, null, 2));
  }
  console.log(`======================================\n`);
};

export interface PostTag {
  id?: string;
  name: string;
}

export interface Interaction {
  id?: string;
  type: 'like' | 'comment' | 'share';
  userId: number;
  postId: number;
  content?: string;
  createdAt: Date;
}

export interface Post {
  id?: number;
  title: string;
  body: string;
  userId: number;
  imageId?: number;
  image?: string;
  tags?: PostTag[];
  interactions?: Interaction[];
  createdAt?: Date;
}

const postService = {
  // Get all posts
  getAllPosts: async () => {
    const endpoint = `${API_URL_POSTS}`;
    logRequestDetails(endpoint, 'GET');
    try {
      const response = await axios.get(endpoint);
      return response.data;
    } catch (error) {
      console.error('Error fetching posts:', error);
      console.log('⚠️ To implement this route on the backend: GET /api/posts');
      throw error;
    }
  },

  // Get a post by ID
  getPostById: async (id: number) => {
    const endpoint = `${API_URL_POSTS}/${id}`;
    logRequestDetails(endpoint, 'GET');
    try {
      const response = await axios.get(endpoint);
      return response.data;
    } catch (error) {
      console.error('Error fetching post:', error);
      console.log(`⚠️ To implement this route on the backend: GET /api/posts/${id}`);
      throw error;
    }
  },

  // Create a new post
  createPost: async (postData: Post) => {
    const endpoint = `${API_URL_POSTS}`;
    logRequestDetails(endpoint, 'POST', postData);
    try {
      const response = await axios.post(endpoint, postData);
      return response.data;
    } catch (error) {
      console.error('Error creating post:', error);
      console.log('⚠️ To implement this route on the backend: POST /api/posts');
      console.log('Expected structure in the body:', {
        title: 'string (required)',
        body: 'string (required)',
        userId: 'number (required)',
        imageId: 'number (optional)',
        image: 'string base64 (optional)',
        tags: 'array of PostTag (optional)'
      });
      throw error;
    }
  },

  // Update a post
  updatePost: async (id: number, postData: Partial<Post>) => {
    const endpoint = `${API_URL_POSTS}/${id}`;
    logRequestDetails(endpoint, 'PATCH', postData);
    try {
      const response = await axios.patch(endpoint, postData);
      return response.data;
    } catch (error) {
      console.error('Error updating post:', error);
      console.log(`⚠️ To implement this route on the backend: PATCH /api/posts/${id}`);
      console.log('Expected structure in the body (all fields are optional):', {
        title: 'string',
        body: 'string',
        imageId: 'number',
        image: 'string base64'
      });
      throw error;
    }
  },

  // Delete a post
  deletePost: async (id: number) => {
    const endpoint = `${API_URL_POSTS}/${id}`;
    logRequestDetails(endpoint, 'DELETE');
    try {
      const response = await axios.delete(endpoint);
      return response.data;
    } catch (error) {
      console.error('Error deleting post:', error);
      console.log(`⚠️ To implement this route on the backend: DELETE /api/posts/${id}`);
      throw error;
    }
  },

  // Add an interaction to a post (like, comment, share)
  addInteraction: async (postId: number, interaction: Omit<Interaction, 'id' | 'postId' | 'createdAt'>) => {
    const endpoint = `${API_URL_POSTS}/${postId}/interactions`;
    const interactionData = {
      ...interaction,
      postId,
      createdAt: new Date()
    };
    logRequestDetails(endpoint, 'POST', interactionData);
    try {
      const response = await axios.post(endpoint, interactionData);
      return response.data;
    } catch (error) {
      console.error('Error adding interaction:', error);
      console.log(`⚠️ To implement this route on the backend: POST /api/posts/${postId}/interactions`);
      console.log('Expected structure in the body:', {
        type: 'string (like, comment, share)',
        userId: 'number',
        content: 'string (optional, required for comments)',
        createdAt: 'Date'
      });
      throw error;
    }
  },

  // Get all interactions for a post
  getPostInteractions: async (postId: number) => {
    const endpoint = `${API_URL_POSTS}/${postId}/interactions`;
    logRequestDetails(endpoint, 'GET');
    try {
      const response = await axios.get(endpoint);
      return response.data;
    } catch (error) {
      console.error('Error fetching post interactions:', error);
      console.log(`⚠️ To implement this route on the backend: GET /api/posts/${postId}/interactions`);
      throw error;
    }
  },

  // Add a tag to a post
  addTagToPost: async (postId: number, tag: Omit<PostTag, 'id'>) => {
    const endpoint = `${API_URL_POSTS}/${postId}/tags`;
    logRequestDetails(endpoint, 'POST', tag);
    try {
      const response = await axios.post(endpoint, tag);
      return response.data;
    } catch (error) {
      console.error('Error adding tag to post:', error);
      console.log(`⚠️ To implement this route on the backend: POST /api/posts/${postId}/tags`);
      console.log('Expected structure in the body:', {
        name: 'string'
      });
      throw error;
    }
  },

  // Remove a tag from a post
  removeTagFromPost: async (postId: number, tagId: string) => {
    const endpoint = `${API_URL_POSTS}/${postId}/tags/${tagId}`;
    logRequestDetails(endpoint, 'DELETE');
    try {
      const response = await axios.delete(endpoint);
      return response.data;
    } catch (error) {
      console.error('Error removing tag from post:', error);
      console.log(`⚠️ To implement this route on the backend: DELETE /api/posts/${postId}/tags/${tagId}`);
      throw error;
    }
  },

  // Get posts from a specific user
  getUserPosts: async (userId: number) => {
    const endpoint = `${API_URL_POSTS}/users/${userId}`;
    logRequestDetails(endpoint, 'GET');
    try {
      const response = await axios.get(endpoint);
      return response.data;
    } catch (error) {
      console.error('Error fetching user posts:', error);
      console.log(`⚠️ To implement this route on the backend: GET /api/posts/users/${userId}`);
      throw error;
    }
  },

  // Search posts by keywords in title or body
  searchPosts: async (query: string) => {
    const endpoint = `${API_URL_POSTS}/search?q=${encodeURIComponent(query)}`;
    logRequestDetails(endpoint, 'GET');
    try {
      const response = await axios.get(endpoint);
      return response.data;
    } catch (error) {
      console.error('Error searching posts:', error);
      console.log(`⚠️ To implement this route on the backend: GET /api/posts/search?q=${query}`);
      throw error;
    }
  },

  // Get posts by tag
  getPostsByTag: async (tagName: string) => {
    const endpoint = `${API_URL_POSTS}/tags/${encodeURIComponent(tagName)}`;
    logRequestDetails(endpoint, 'GET');
    try {
      const response = await axios.get(endpoint);
      return response.data;
    } catch (error) {
      console.error('Error fetching posts by tag:', error);
      console.log(`⚠️ To implement this route on the backend: GET /api/posts/tags/${tagName}`);
      throw error;
    }
  }
};

export default postService; 