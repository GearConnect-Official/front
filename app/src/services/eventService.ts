import axios from 'axios';
import { API_URL_EVENTS } from '../config';
import { API_URL_EVENTTAGS, API_URL_EVENTREVIEWS, API_URL_RELATEDPRODUCTS } from '../config';

export interface Event {
  id?: string;
  name: string;
  creatorId: number;
  creators: string;
  location: string;
  date: Date;
  sponsors: string;
  website: string;
  rankings: string;
  logo?: string;
  images?: string[];
  description?: string;
  // Additional fields for image metadata
  logoPublicId?: string;
  imagePublicIds?: string[];
}

const eventService = {
  // Get all events
  getAllEvents: async () => {
    try {
      const response = await axios.get(API_URL_EVENTS);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get event by ID
  getEventById: async (id: string) => {
    try {
      const response = await axios.get(`${API_URL_EVENTS}/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create a new event
  createEvent: async (eventData: Event) => {
    console.log('Données envoyées au backend:', eventData);
    
    try {
      // Extraire le nom du fichier d'une URL d'image locale
      const extractFilename = (uri: string): string => {
        if (!uri) return '';
        // Extraire le nom du fichier après le dernier /
        const parts = uri.split('/');
        return parts[parts.length - 1];
      };

      // Formater les données avant envoi
      const processedData = {
        ...eventData,
        // Renommer creators en creatorId pour le backend
        creatorId: eventData.creators
          ? parseInt(eventData.creators)
          : undefined,
        // Ne pas envoyer le champ creators au backend
        creators: undefined,
        date: eventData.date
          ? new Date(eventData.date).toISOString()
          : new Date().toISOString(),
        // Extraire seulement les noms de fichiers des URLs d'images
        logo: eventData.logo ? extractFilename(eventData.logo) : '',
        images:
          eventData.images && Array.isArray(eventData.images)
            ? eventData.images.map((img) => extractFilename(img))
            : [],      };      
      try {
        const response = await axios.post(API_URL_EVENTS, processedData);
        return response.data;
      } catch (axiosError: any) {
        console.error('Erreur axios détaillée:', axiosError.message);
        throw axiosError;
      }
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  },
  // Update an event
  updateEvent: async (id: string, eventData: Partial<Event>) => {
    try {
      // Format event data for the API
      const formattedEvent = {
        ...eventData,
        date: eventData.date
          ? new Date(eventData.date).toISOString()
          : undefined,
        // Add any other necessary transformations
      };      try {
        const response = await axios.patch(
          `${API_URL_EVENTS}/${id}`,
          formattedEvent
        );
        return response.data;      } catch (axiosError: any) {
        console.error('Update request failed:', axiosError.message);
        throw axiosError;
      }
    } catch (error) {
      // console.error('Error updating event:', error);
      throw error;
    }
  },
  // Delete an event
  deleteEvent: async (id: string) => {
    try {
      try {
        const response = await axios.delete(`${API_URL_EVENTS}/${id}`);
        return response.data;      } catch (axiosError: any) {
        console.error('Delete request failed:', axiosError.message);
        throw axiosError;
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
  },

  getEventTagsByEventId: async (eventId: string) => {
    try {
      const response = await axios.get(`${API_URL_EVENTTAGS}/event/${eventId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching event tags:', error);
      throw error;
    }
  },
  createEventReview: async (reviewData: any) => {
    try {
      const response = await axios.post(`${API_URL_EVENTREVIEWS}`, reviewData);
      return response.data;
    } catch (error) {
      console.error('Error submitting review:', error);
      throw error;
    }
  },
  getEventReviews: async (eventId: number) => {
    try {
      const response = await axios.get(`${API_URL_EVENTREVIEWS}/event/${eventId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching event reviews:', error);
      throw error;
    }
  },
  getEventReviewById: async (eventId: number, userId: number) => {
    try {
      const response = await axios.get(`${API_URL_EVENTREVIEWS}/${eventId}/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching event review:', error);
      throw error;
    }
  },
  updateEventReview: async (eventId: number, userId: number, reviewData: any) => {
    try {
      const response = await axios.put(`${API_URL_EVENTREVIEWS}/${eventId}/${userId}`, reviewData);
      return response.data;
    } catch (error) {
      console.error('Error updating event review:', error);
      throw error;
    }
  },
  deleteEventReview: async (eventId: number, userId: number) => {
    try {
      const response = await axios.delete(`${API_URL_EVENTREVIEWS}/${eventId}/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting event review:', error);
      throw error;
    }
  },
  getRelatedProductsByEventId: async (eventId: string) => {
    try {
      const response = await axios.get(`${API_URL_RELATEDPRODUCTS}/event/${eventId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching related products:', error);
      throw error;
    }
  },
};

export default eventService;
