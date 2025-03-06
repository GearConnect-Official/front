import axios from 'axios';

const API_URL = 'http://10.57.33.246:3001/api';

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
}

const eventService = {
  // Récupérer tous les événements
  getAllEvents: async () => {
    try {
      const response = await axios.get(`${API_URL}/events`);
      return response.data;
    } catch (error) {
      console.error('Error fetching events:', error);
      throw error;
    }
  },

  // Récupérer un événement par ID
  getEventById: async (id: string) => {
    try {
      const response = await axios.get(`${API_URL}/events/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching event:', error);
      throw error;
    }
  },

  // Créer un nouvel événement
  createEvent: async (eventData: Event) => {
    try {
      const response = await axios.post(`${API_URL}/events`, eventData);
      return response.data;
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  },

  // Mettre à jour un événement
  updateEvent: async (id: string, eventData: Partial<Event>) => {
    try {
      const formattedEvent = {
        ...eventData,
        date: eventData.date ? new Date(eventData.date).toISOString() : undefined,
      };
      const response = await axios.patch(`${API_URL}/events/${id}`, formattedEvent);
      return response.data;
    } catch (error) {
      console.error('Error updating event:', error);
      throw error;
    }
  }
};

export default eventService; 