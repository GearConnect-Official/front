import axios from "axios";
import { API_URL_POSTS, API_URL_TAGS, API_URL_INTERACTIONS } from "../config";

// Types for better type safety
interface Post {
  id?: number;
  title: string;
  body: string;
  userId: number;
  imageId?: number;
  cloudinaryUrl?: string;
  cloudinaryPublicId?: string;
  imageMetadata?: string;
}

interface ApiError {
  response?: {
    data?: {
      error?: string;
    };
    status?: number;
  };
  message?: string;
}

// Helper function to handle tag GET requests without logging 404 errors
const getTagSilently = async (endpoint: string) => {
  try {
    const response = await axios.get(endpoint, {
      // Configuration to prevent axios from logging 404 errors
      validateStatus: function (status) {
        return status < 500; // Accept any status code less than 500
      },
    });
    
    if (response.status === 404) {
      throw { response: { status: 404 } };
    }
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

const postService = {
  // Get all posts
  getAllPosts: async (userId?: number) => {
    const endpoint = `${API_URL_POSTS}`;
    const params = userId ? { userId } : {};
    try {
      const response = await axios.get(endpoint, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get posts with pagination
  getPosts: async (page?: number, limit?: number, userId?: number) => {
    const endpoint = `${API_URL_POSTS}`;
    const params: any = {};
    if (page !== undefined) params.page = page;
    if (limit !== undefined) params.limit = limit;
    if (userId !== undefined) params.userId = userId;

    try {
      const response = await axios.get(endpoint, { params });
      return response.data;
    } catch (error: any) {
      const apiError = error as ApiError;
      throw new Error(apiError.response?.data?.error || "Failed to fetch posts");
    }
  },

  // Get followed posts
  getFollowedPosts: async (userId: number, page?: number, limit?: number) => {
    const endpoint = `${API_URL_POSTS}/followed/${userId}`;
    const params: any = {};
    if (page !== undefined) params.page = page;
    if (limit !== undefined) params.limit = limit;

    try {
      const response = await axios.get(endpoint, { params });
      return response.data;
    } catch (error: any) {
      const apiError = error as ApiError;
      throw new Error(apiError.response?.data?.error || "Failed to fetch followed posts");
    }
  },

  // Get a post by ID
  getPostById: async (id: number, userId?: number) => {
    const endpoint = `${API_URL_POSTS}/${id}`;
    const params = userId ? { userId } : {};
    
    try {
      const response = await axios.get(endpoint, { params });
      return response.data;
    } catch (error: any) {
      const apiError = error as ApiError;
      throw new Error(apiError.response?.data?.error || "Failed to fetch post");
    }
  },

  // Create a new post
  createPost: async (postData: Post) => {
    const endpoint = `${API_URL_POSTS}`;
    
    try {
      // Validate required fields
      if (!postData.title?.trim()) {
        throw new Error("Title is required");
      }
      if (!postData.userId) {
        throw new Error("User ID is required");
      }

      // Format the data to match backend expectations
      const formattedPostData = {
        title: postData.title.trim(),
        body: postData.body?.trim() || "",
        userId: postData.userId,
        ...(postData.imageId ? { imageId: postData.imageId } : {}),
        ...(postData.cloudinaryUrl
          ? {
              cloudinaryUrl: postData.cloudinaryUrl,
              cloudinaryPublicId: postData.cloudinaryPublicId,
              imageMetadata: postData.imageMetadata,
            }
          : {}),
      };

      const response = await axios.post(endpoint, formattedPostData);
      return response.data;
    } catch (error: any) {
      const apiError = error as ApiError;
      
      // Handle specific validation errors
      if (apiError.response?.status === 400) {
        throw new Error(apiError.response?.data?.error || "Invalid post data");
      }
      
      throw new Error(apiError.response?.data?.error || "Failed to create post");
    }
  },

  // Update a post
  updatePost: async (id: number, postData: Partial<Post>) => {
    const endpoint = `${API_URL_POSTS}/${id}`;
    
    try {
      const response = await axios.patch(endpoint, postData);
      return response.data;
    } catch (error: any) {
      const apiError = error as ApiError;
      throw new Error(apiError.response?.data?.error || "Failed to update post");
    }
  },

  // Delete a post
  deletePost: async (id: number) => {
    const endpoint = `${API_URL_POSTS}/${id}`;
    
    try {
      const response = await axios.delete(endpoint);
      return response.data;
    } catch (error: any) {
      const apiError = error as ApiError;
      throw new Error(apiError.response?.data?.error || "Failed to delete post");
    }
  },

  // Get user posts
  getUserPosts: async (userId: number, currentUserId?: number) => {
    const endpoint = `${API_URL_POSTS}/user/${userId}`;
    const params = currentUserId ? { currentUserId } : {};
    
    try {
      const response = await axios.get(endpoint, { params });
      return response.data;
    } catch (error: any) {
      const apiError = error as ApiError;
      throw new Error(apiError.response?.data?.error || "Failed to fetch user posts");
    }
  },

  // Search posts by keywords in title or body
  searchPosts: async (query: string) => {
    const endpoint = `${API_URL_POSTS}/search?q=${encodeURIComponent(query)}`;
    try {
      const response = await axios.get(endpoint);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get posts by tag
  getPostsByTag: async (tagName: string) => {
    const endpoint = `${API_URL_POSTS}/tags/${encodeURIComponent(tagName)}`;
    try {
      const response = await axios.get(endpoint);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get liked posts
  getLikedPosts: async (userId: number) => {
    const endpoint = `${API_URL_POSTS}/liked/${userId}`;
    
    try {
      const response = await axios.get(endpoint);
      return response.data;
    } catch (error: any) {
      const apiError = error as ApiError;
      throw new Error(apiError.response?.data?.error || "Failed to fetch liked posts");
    }
  },

  // Get favorite posts
  getFavorites: async (userId: number) => {
    const endpoint = `${API_URL_POSTS}/favorites/${userId}`;
    try {
      const response = await axios.get(endpoint);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Tag management
  getTags: async () => {
    const endpoint = `${API_URL_TAGS}`;
    
    try {
      const response = await axios.get(endpoint);
      return response.data;
    } catch (error: any) {
      const apiError = error as ApiError;
      throw new Error(apiError.response?.data?.error || "Failed to fetch tags");
    }
  },

  createTag: async (tagName: string) => {
    const endpoint = `${API_URL_TAGS}`;
    
    try {
      const response = await axios.post(endpoint, { name: tagName });
      return response.data;
    } catch (error: any) {
      const apiError = error as ApiError;
      throw new Error(apiError.response?.data?.error || "Failed to create tag");
    }
  },

  findTagByName: async (tagName: string) => {
    try {
      // Get all tags and find by name on client side
      const tags = await postService.getTags();
      return tags.find((tag: any) => tag.name.toLowerCase() === tagName.toLowerCase());
    } catch (error) {
      return null;
    }
  },

  getOrCreateTag: async (tagName: string) => {
    try {
      // First try to find existing tag
      const existingTag = await postService.findTagByName(tagName);
      
      if (existingTag) {
        return existingTag;
      }
      
      // If not found, create new tag
      const newTag = await postService.createTag(tagName);
      return newTag;
    } catch (error: any) {
      throw new Error("Failed to get or create tag");
    }
  },

  addTagToPost: async (postId: number, tagId: number) => {
    const endpoint = `${API_URL_POSTS}/${postId}/tags/${tagId}`;
    
    try {
      const response = await axios.post(endpoint);
      return response.data;
    } catch (error: any) {
      const apiError = error as ApiError;
      throw new Error(apiError.response?.data?.error || "Failed to add tag to post");
    }
  },

  // Interactions
  likePost: async (postId: number, userId: number) => {
    const endpoint = `${API_URL_INTERACTIONS}`;
    
    try {
      const response = await axios.post(endpoint, {
        postId,
        userId,
        like: true,
      });
      return response.data;
    } catch (error: any) {
      const apiError = error as ApiError;
      throw new Error(apiError.response?.data?.error || "Failed to like post");
    }
  },

  dislikePost: async (postId: number, userId: number) => {
    const endpoint = `${API_URL_INTERACTIONS}`;
    
    try {
      const response = await axios.post(endpoint, {
        postId,
        userId,
        like: false,
      });
      return response.data;
    } catch (error: any) {
      const apiError = error as ApiError;
      throw new Error(apiError.response?.data?.error || "Failed to dislike post");
    }
  },

  // Toggle like on a post (optimized for UI updates)
  toggleLike: async (postId: number, userId: number) => {
    const endpoint = `${API_URL_INTERACTIONS}/toggle-like`;
    
    try {
      const response = await axios.post(endpoint, {
        postId,
        userId,
      });
      return response.data;
    } catch (error: any) {
      const apiError = error as ApiError;
      throw new Error(apiError.response?.data?.error || "Failed to toggle like");
    }
  },

  // Create post with tags (compound operation)
  createPostWithTags: async (postData: Post, tagNames: string[]) => {
    try {
      // Validate post data
      if (!postData.title?.trim()) {
        throw new Error("Title is required");
      }
      if (!postData.userId) {
        throw new Error("User authentication required");
      }

      // 1. Create the post first
      const post = await postService.createPost(postData);

      if (!post || !post.id) {
        throw new Error("Failed to create post");
      }

      // 2. Process each tag - get or create, then associate with the post
      if (tagNames && tagNames.length > 0) {
        // Process tags sequentially to avoid race conditions
        for (const tagName of tagNames) {
          try {
            if (!tagName.trim()) continue;

            // Get or create the tag (404 errors are handled silently)
            const tag = await postService.getOrCreateTag(tagName.trim());

            // Skip if tag creation failed
            if (!tag || !tag.id) {
              continue;
            }

            // Associate the tag with the post using the dedicated API endpoint
            await postService.addTagToPost(post.id, tag.id);
          } catch (error) {
            // Continue with other tags even if one fails
            // This prevents the entire post creation from failing due to tag issues
            continue;
          }
        }
      }

      return post;
    } catch (error: any) {
      throw error;
    }
  },

  // Remove a tag from a post
  removeTagFromPost: async (postId: number, tagId: string) => {
    const endpoint = `${API_URL_POSTS}/${postId}/tags/${tagId}`;
    try {
      const response = await axios.delete(endpoint);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default postService;
