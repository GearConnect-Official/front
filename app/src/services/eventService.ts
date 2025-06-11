import axios from 'axios';
import { API_URL_EVENTS } from '../config';

export interface Event {
  id?: string;
  name: string;
  creators: string;
  location: string;
  date: Date;
  sponsors: string;
  website: string;
  rankings: string;
  logo?: string;
  images?: string[];
  description?: string;
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
        creatorId: eventData.creators ? parseInt(eventData.creators) : undefined,
        // Ne pas envoyer le champ creators au backend
        creators: undefined,
        date: eventData.date ? new Date(eventData.date).toISOString() : new Date().toISOString(),
        // Extraire seulement les noms de fichiers des URLs d'images
        logo: eventData.logo ? extractFilename(eventData.logo) : '',
        images: eventData.images && Array.isArray(eventData.images) 
          ? eventData.images.map(img => extractFilename(img))
          : []
      };
      
      console.log('Processed data avant envoi:', JSON.stringify(processedData, null, 2));
      
      const response = await axios.post(API_URL_EVENTS, processedData);
      console.log('Réponse succès:', response.status);
      return response.data;
    } catch (error: any) {
      // console.error('Error creating event:', error);
      throw error;
    }
  },

  // Update an event
  updateEvent: async (id: string, eventData: Partial<Event>) => {
    try {
      const formattedEvent = {
        ...eventData,
        date: eventData.date ? new Date(eventData.date).toISOString() : undefined,
      };
      const response = await axios.patch(`${API_URL_EVENTS}/${id}`, formattedEvent);
      return response.data;
    } catch (error) {
      // console.error('Error updating event:', error);
      throw error;
    }
  }
};

export default eventService; 