import axios from 'axios';
import { API_URL_POSTS, API_URL_TAGS } from '../config';

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
      // Format the data to match backend expectations
      const formattedPostData = {
        title: postData.title,
        body: postData.body,
        userId: postData.userId,
        ...(postData.imageId ? { imageId: postData.imageId } : {})
      };
      
      const response = await axios.post(endpoint, formattedPostData);
      return response.data;
    } catch (error) {
      console.error('Error creating post:', error);
      console.log('⚠️ To implement this route on the backend: POST /api/posts');
      console.log('Expected structure in the body:', {
        title: 'string (required)',
        body: 'string (required)',
        userId: 'number (required)',
        imageId: 'number (optional)'
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

  // Obtenir ou créer un tag par son nom
  getOrCreateTagByName: async (tagName: string) => {
    try {
      console.log(`Recherche du tag "${tagName}"...`);
      
      // 1. D'abord, récupérer tous les tags
      const tagsEndpoint = `${API_URL_TAGS}`;
      logRequestDetails(tagsEndpoint, 'GET');
      
      let existingTag = null;
      
      try {
        const tagsResponse = await axios.get(tagsEndpoint);
        // Recherche insensible à la casse
        existingTag = tagsResponse.data.find(tag => 
          tag.name.toLowerCase() === tagName.toLowerCase()
        );
        
        if (existingTag) {
          console.log(`Tag existant trouvé: "${existingTag.name}" (ID: ${existingTag.id})`);
          return existingTag;
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des tags:", error);
      }
      
      // 2. Si le tag n'existe pas, on le crée
      if (!existingTag) {
        console.log(`Aucun tag existant trouvé pour "${tagName}", création d'un nouveau tag...`);
        
        const createEndpoint = `${API_URL_TAGS}`;
        logRequestDetails(createEndpoint, 'POST', { name: tagName });
        
        const createResponse = await axios.post(createEndpoint, { name: tagName });
        console.log(`Nouveau tag créé: "${tagName}" (ID: ${createResponse.data.id})`);
        return createResponse.data;
      }
    } catch (error) {
      console.error(`Erreur dans getOrCreateTagByName pour "${tagName}":`, error);
      throw error;
    }
  },
  
  // Ajouter un tag à un post (en utilisant l'API existante)
  addTagToPost: async (postId: number, tagId: number) => {
    const endpoint = `${API_URL_POSTS}/${postId}/tags/${tagId}`;
    logRequestDetails(endpoint, 'POST');
    try {
      const response = await axios.post(endpoint);
      console.log(`Tag (ID: ${tagId}) associé avec succès au post (ID: ${postId})`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de l'association du tag (ID: ${tagId}) au post (ID: ${postId}):`, error);
      throw error;
    }
  },

  // Create a post with tags in one operation
  createPostWithTags: async (postData: Post, tagNames: string[]) => {
    try {
      console.log('Creating post with data:', postData);
      console.log('With tags:', tagNames);
      
      // 1. Create the post first
      const post = await postService.createPost(postData);
      
      if (!post || !post.id) {
        throw new Error('Failed to create post or post ID is missing');
      }
      
      // 2. Process each tag - get or create, then associate with the post
      if (tagNames && tagNames.length > 0) {
        console.log('Post created successfully, now adding tags');
        // Process tags sequentially to avoid race conditions
        for (const tagName of tagNames) {
          try {
            // Get or create the tag
            const tag = await postService.getOrCreateTagByName(tagName);
            
            // Skip if tag creation failed
            if (!tag || !tag.id) {
              console.warn(`Impossible de créer/trouver le tag "${tagName}", ignorer`);
              continue;
            }
            
            // Associate the tag with the post using the dedicated API endpoint
            await postService.addTagToPost(post.id, tag.id);
            console.log(`Added tag "${tagName}" to post ${post.id}`);
          } catch (error) {
            console.error(`Failed to process tag "${tagName}":`, error);
            // Continue with other tags even if one fails
          }
        }
      }
      
      return post;
    } catch (error) {
      console.error('Error in createPostWithTags:', error);
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