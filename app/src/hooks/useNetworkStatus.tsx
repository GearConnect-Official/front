import { useState, useEffect, useCallback } from 'react';
import { AppState, AppStateStatus, Platform } from 'react-native';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import axios from 'axios';
import { API_URL_AUTH } from '../config';

interface NetworkStatus {
  isConnected: boolean | null;
  isInternetReachable: boolean | null;
  isServerReachable: boolean | null;
  isInitializing: boolean;
  lastChecked: Date | null;
}

/**
 * Hook personnalisé pour surveiller la connexion réseau et
 * la disponibilité du backend.
 */
const useNetworkStatus = () => {
  const [status, setStatus] = useState<NetworkStatus>({
    isConnected: null,
    isInternetReachable: null,
    isServerReachable: null,
    isInitializing: true,
    lastChecked: null,
  });

  // Fonction pour vérifier si le serveur est accessible
  const checkServerReachability = useCallback(async (): Promise<boolean> => {
    try {
      // Ping simple au serveur avec un timeout court
      await axios.get(`${API_URL_AUTH}/health`, { 
        timeout: 5000,
        // Ne pas rediriger automatiquement pour ne pas attendre trop longtemps
        maxRedirects: 0,
        // Ne pas envoyer de credentials pour optimiser
        withCredentials: false
      });
      return true;
    } catch (error) {
      // Vérifier si l'erreur est liée à un problème réseau
      // ou si c'est une autre erreur serveur (dans ce cas, le serveur est accessible)
      if (axios.isAxiosError(error) && error.response) {
        // Si nous avons une réponse du serveur (même si c'est une erreur),
        // cela signifie que le serveur est accessible
        return true;
      }
      
      return false;
    }
  }, []);

  // Fonction pour mettre à jour l'état complet de la connexion
  const updateConnectionStatus = useCallback(async (netInfoState: NetInfoState) => {
    const { isConnected, isInternetReachable } = netInfoState;
    
    // Vérifier la disponibilité du serveur uniquement si nous avons une connexion internet
    const serverReachable = (isConnected && isInternetReachable) 
      ? await checkServerReachability() 
      : false;
    
    setStatus(prev => ({
      ...prev,
      isConnected,
      isInternetReachable,
      isServerReachable: serverReachable,
      isInitializing: false,
      lastChecked: new Date(),
    }));
  }, [checkServerReachability]);

  // Vérifier manuellement la connexion (peut être utilisé après une action utilisateur)
  const checkConnection = useCallback(async () => {
    try {
      const netInfo = await NetInfo.fetch();
      await updateConnectionStatus(netInfo);
      return status.isServerReachable;
    } catch (error) {
      console.error('Error checking connection:', error);
      return false;
    }
  }, [updateConnectionStatus, status.isServerReachable]);

  // Écouter les changements d'état de l'application
  useEffect(() => {
    const handleAppStateChange = async (nextAppState: AppStateStatus) => {
      // Vérifier la connexion lorsque l'application revient au premier plan
      if (nextAppState === 'active') {
        await checkConnection();
      }
    };
    
    // S'abonner aux changements d'état de l'application
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    
    return () => {
      // Nettoyage: désabonnement
      if (Platform.OS === 'ios' || parseInt(Platform.Version as string, 10) >= 29) {
        // Pour iOS et Android 29+
        subscription.remove();
      }
    };
  }, [checkConnection]);

  // Écouter les changements de l'état de la connexion
  useEffect(() => {
    setStatus(prev => ({ ...prev, isInitializing: true }));

    // Vérification initiale
    const initialCheck = async () => {
      await checkConnection();
    };
    initialCheck();
    
    // S'abonner aux changements d'état de la connexion
    const unsubscribe = NetInfo.addEventListener(updateConnectionStatus);
    
    return () => {
      // Nettoyage: désabonnement
      unsubscribe();
    };
  }, [checkConnection, updateConnectionStatus]);

  return {
    ...status,
    checkConnection,
    // Méthode abrégée pour vérifier si nous sommes complètement connectés
    isOnline: status.isServerReachable === true,
    // Méthode abrégée pour vérifier si nous pouvons effectuer des requêtes réseau
    canMakeRequests: status.isConnected === true && status.isInternetReachable === true
  };
};

export default useNetworkStatus; 