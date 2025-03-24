import axios from 'axios';
import { API_URL_POSTS } from '../config';

// Fonction utilitaire pour afficher les données de requête en détail
const logRequestDetails = (endpoint: string, method: string, data?: any) => {
  console.log(`\n====== DÉTAILS DE LA REQUÊTE API ======`);
  console.log(`URL: ${endpoint}`);
  console.log(`Méthode: ${method}`);
  if (data) {
    console.log(`Données envoyées:`);
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
  // Récupérer tous les posts
  getAllPosts: async () => {
    const endpoint = `${API_URL_POSTS}`;
    logRequestDetails(endpoint, 'GET');
    try {
      const response = await axios.get(endpoint);
      return response.data;
    } catch (error) {
      console.error('Error fetching posts:', error);
      console.log('⚠️ Pour implémenter cette route côté backend: GET /api/posts');
      throw error;
    }
  },

  // Récupérer un post par ID
  getPostById: async (id: number) => {
    const endpoint = `${API_URL_POSTS}/${id}`;
    logRequestDetails(endpoint, 'GET');
    try {
      const response = await axios.get(endpoint);
      return response.data;
    } catch (error) {
      console.error('Error fetching post:', error);
      console.log(`⚠️ Pour implémenter cette route côté backend: GET /api/posts/${id}`);
      throw error;
    }
  },

  // Créer un nouveau post
  createPost: async (postData: Post) => {
    const endpoint = `${API_URL_POSTS}`;
    logRequestDetails(endpoint, 'POST', postData);
    try {
      const response = await axios.post(endpoint, postData);
      return response.data;
    } catch (error) {
      console.error('Error creating post:', error);
      console.log('⚠️ Pour implémenter cette route côté backend: POST /api/posts');
      console.log('Structure attendue dans le body:', {
        title: 'string (obligatoire)',
        body: 'string (obligatoire)',
        userId: 'number (obligatoire)',
        imageId: 'number (optionnel)',
        image: 'string base64 (optionnel)',
        tags: 'array de PostTag (optionnel)'
      });
      throw error;
    }
  },

  // Mettre à jour un post
  updatePost: async (id: number, postData: Partial<Post>) => {
    const endpoint = `${API_URL_POSTS}/${id}`;
    logRequestDetails(endpoint, 'PATCH', postData);
    try {
      const response = await axios.patch(endpoint, postData);
      return response.data;
    } catch (error) {
      console.error('Error updating post:', error);
      console.log(`⚠️ Pour implémenter cette route côté backend: PATCH /api/posts/${id}`);
      console.log('Structure attendue dans le body (tous les champs sont optionnels):', {
        title: 'string',
        body: 'string',
        imageId: 'number',
        image: 'string base64'
      });
      throw error;
    }
  },

  // Supprimer un post
  deletePost: async (id: number) => {
    const endpoint = `${API_URL_POSTS}/${id}`;
    logRequestDetails(endpoint, 'DELETE');
    try {
      const response = await axios.delete(endpoint);
      return response.data;
    } catch (error) {
      console.error('Error deleting post:', error);
      console.log(`⚠️ Pour implémenter cette route côté backend: DELETE /api/posts/${id}`);
      throw error;
    }
  },

  // Ajouter une interaction à un post (like, comment, share)
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
      console.log(`⚠️ Pour implémenter cette route côté backend: POST /api/posts/${postId}/interactions`);
      console.log('Structure attendue dans le body:', {
        type: 'string (like, comment, share)',
        userId: 'number',
        content: 'string (optionnel, obligatoire pour les commentaires)',
        createdAt: 'Date'
      });
      throw error;
    }
  },

  // Récupérer toutes les interactions d'un post
  getPostInteractions: async (postId: number) => {
    const endpoint = `${API_URL_POSTS}/${postId}/interactions`;
    logRequestDetails(endpoint, 'GET');
    try {
      const response = await axios.get(endpoint);
      return response.data;
    } catch (error) {
      console.error('Error fetching post interactions:', error);
      console.log(`⚠️ Pour implémenter cette route côté backend: GET /api/posts/${postId}/interactions`);
      throw error;
    }
  },

  // Ajouter un tag à un post
  addTagToPost: async (postId: number, tag: Omit<PostTag, 'id'>) => {
    const endpoint = `${API_URL_POSTS}/${postId}/tags`;
    logRequestDetails(endpoint, 'POST', tag);
    try {
      const response = await axios.post(endpoint, tag);
      return response.data;
    } catch (error) {
      console.error('Error adding tag to post:', error);
      console.log(`⚠️ Pour implémenter cette route côté backend: POST /api/posts/${postId}/tags`);
      console.log('Structure attendue dans le body:', {
        name: 'string'
      });
      throw error;
    }
  },

  // Supprimer un tag d'un post
  removeTagFromPost: async (postId: number, tagId: string) => {
    const endpoint = `${API_URL_POSTS}/${postId}/tags/${tagId}`;
    logRequestDetails(endpoint, 'DELETE');
    try {
      const response = await axios.delete(endpoint);
      return response.data;
    } catch (error) {
      console.error('Error removing tag from post:', error);
      console.log(`⚠️ Pour implémenter cette route côté backend: DELETE /api/posts/${postId}/tags/${tagId}`);
      throw error;
    }
  },

  // Récupérer les posts d'un utilisateur spécifique
  getUserPosts: async (userId: number) => {
    const endpoint = `${API_URL_POSTS}/users/${userId}`;
    logRequestDetails(endpoint, 'GET');
    try {
      const response = await axios.get(endpoint);
      return response.data;
    } catch (error) {
      console.error('Error fetching user posts:', error);
      console.log(`⚠️ Pour implémenter cette route côté backend: GET /api/posts/users/${userId}`);
      throw error;
    }
  },

  // Rechercher des posts par mots-clés dans le titre ou le corps
  searchPosts: async (query: string) => {
    const endpoint = `${API_URL_POSTS}/search?q=${encodeURIComponent(query)}`;
    logRequestDetails(endpoint, 'GET');
    try {
      const response = await axios.get(endpoint);
      return response.data;
    } catch (error) {
      console.error('Error searching posts:', error);
      console.log(`⚠️ Pour implémenter cette route côté backend: GET /api/posts/search?q=${query}`);
      throw error;
    }
  },

  // Récupérer les posts par tag
  getPostsByTag: async (tagName: string) => {
    const endpoint = `${API_URL_POSTS}/tags/${encodeURIComponent(tagName)}`;
    logRequestDetails(endpoint, 'GET');
    try {
      const response = await axios.get(endpoint);
      return response.data;
    } catch (error) {
      console.error('Error fetching posts by tag:', error);
      console.log(`⚠️ Pour implémenter cette route côté backend: GET /api/posts/tags/${tagName}`);
      throw error;
    }
  }
};

export default postService; 