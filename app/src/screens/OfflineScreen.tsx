import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Linking } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface OfflineScreenProps {
  retry: () => void;
}

/**
 * Écran affiché lorsque l'application est hors ligne ou ne peut pas
 * se connecter au backend.
 */
const OfflineScreen: React.FC<OfflineScreenProps> = ({ retry }) => {
  return (
    <View style={styles.container}>
      <MaterialIcons name="wifi-off" size={80} color="#8E8E93" style={styles.icon} />
      
      <Text style={styles.title}>No Connection</Text>
      
      <Text style={styles.message}>
        Unable to connect to server. Check your internet connection and try again.
      </Text>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={retry}
        >
          <Text style={styles.primaryButtonText}>Try Again</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.secondaryButton}
          onPress={() => Linking.openSettings()}
        >
          <Text style={styles.secondaryButtonText}>Network Settings</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.helpContainer}>
        <Text style={styles.helpText}>Need help?</Text>
        <TouchableOpacity>
          <Text style={styles.helpLink}>Contact Support</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F7F9FC',
  },
  icon: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#33384E',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
    color: '#666',
    maxWidth: '80%',
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
    marginBottom: 40,
  },
  primaryButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  secondaryButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  helpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  helpText: {
    color: '#666',
    marginRight: 5,
  },
  helpLink: {
    color: '#007AFF',
    fontWeight: '500',
  },
});

export default OfflineScreen; 