import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect } from 'react';

// Configure axios interceptors
export const configureAxios = async () => {
  // Request interceptor to add user ID from storage to all requests
  axios.interceptors.request.use(
    async (config) => {
      try {
        // Get user from AsyncStorage
        const userString = await AsyncStorage.getItem('user');
        if (userString) {
          const user = JSON.parse(userString);
          
          // Add user ID to headers if available
          if (user && user.id) {
            config.headers['user-id'] = user.id;
          }
        }
        return config;
      } catch (error) {
        console.error('Error in axios interceptor:', error);
        return config;
      }
    },
    (error) => {
      return Promise.reject(error);
    }
  );
};

// Create a component wrapper to satisfy Expo Router's requirement for default exports
const AxiosConfigProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    configureAxios();
  }, []);

  // Just return children directly without JSX fragment syntax to avoid TypeScript error
  return children as React.ReactElement || null;
};

export default AxiosConfigProvider; 