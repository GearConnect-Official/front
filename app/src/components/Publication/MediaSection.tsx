import React from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import styles from '../../styles/publicationStyles';

// Palette de couleurs du racing
const THEME_COLORS = {
  primary: '#E10600', // Rouge Racing
  secondary: '#1E1E1E', // Noir Racing
  background: '#FFFFFF',
  textSecondary: '#6E6E6E',
  border: '#E0E0E0',
  cardLight: '#F8F8F8',
};

interface MediaSectionProps {
  onImageSelected: (uri: string) => void;
}

const MediaSection: React.FC<MediaSectionProps> = ({ onImageSelected }) => {
  const requestGalleryPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Requise',
        'Nous avons besoin d\'accéder à votre photothèque pour cette fonctionnalité.',
        [{ text: 'OK' }]
      );
      return false;
    }
    return true;
  };
  
  const requestCameraPermissions = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Requise',
        'Nous avons besoin d\'accéder à votre appareil photo pour cette fonctionnalité.',
        [{ text: 'OK' }]
      );
      return false;
    }
    return true;
  };

  const handleSelectFromGallery = async () => {
    const hasPermission = await requestGalleryPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
        aspect: [4, 3],
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        onImageSelected(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de sélectionner l\'image');
      console.error(error);
    }
  };
  
  const handleTakePhoto = async () => {
    const hasPermission = await requestCameraPermissions();
    if (!hasPermission) return;
    
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
        aspect: [4, 3],
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        onImageSelected(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de prendre une photo');
      console.error(error);
    }
  };

  return (
    <View style={styles.mediaSectionContainer}>
      <Text style={localStyles.title}>Créer une publication</Text>
      
      <Text style={localStyles.subtitle}>
        Partagez vos meilleures photos de course, voitures, événements et plus encore.
      </Text>
      
      <View style={localStyles.buttonContainer}>
        <TouchableOpacity 
          style={localStyles.mediaOptionButton}
          onPress={handleSelectFromGallery}
        >
          <View style={localStyles.iconContainer}>
            <FontAwesome name="image" size={30} color={THEME_COLORS.background} />
          </View>
          <Text style={localStyles.buttonLabel}>Galerie</Text>
          <Text style={localStyles.buttonDescription}>Choisir depuis la galerie</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={localStyles.mediaOptionButton}
          onPress={handleTakePhoto}
        >
          <View style={localStyles.iconContainer}>
            <FontAwesome name="camera" size={30} color={THEME_COLORS.background} />
          </View>
          <Text style={localStyles.buttonLabel}>Appareil photo</Text>
          <Text style={localStyles.buttonDescription}>Prendre une nouvelle photo</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const localStyles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: THEME_COLORS.secondary,
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    color: THEME_COLORS.textSecondary,
    marginBottom: 30,
    textAlign: 'center',
    paddingHorizontal: 20,
    fontSize: 16,
    lineHeight: 22,
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
  },
  mediaOptionButton: {
    alignItems: 'center',
    width: '45%',
    padding: 16,
    backgroundColor: THEME_COLORS.cardLight,
    borderRadius: 12,
    shadowColor: THEME_COLORS.secondary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: THEME_COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonLabel: {
    color: THEME_COLORS.secondary,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  buttonDescription: {
    color: THEME_COLORS.textSecondary,
    fontSize: 12,
    textAlign: 'center',
  },
});

export default MediaSection;