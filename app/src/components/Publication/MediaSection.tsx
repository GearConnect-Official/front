import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import styles from '../../styles/publicationStyles';

interface MediaSectionProps {
  onImageSelected: (uri: string) => void;
}

const MediaSection: React.FC<MediaSectionProps> = ({ onImageSelected }) => {
  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Sorry, we need camera roll permissions to make this work!',
        [{ text: 'OK' }]
      );
      return false;
    }
    return true;
  };

  const handleSelectImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: false,
        quality: 1,
        aspect: [4, 3],
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        onImageSelected(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to select image');
      console.error(error);
    }
  };

  return (
    <View style={styles.mediaSectionContainer}>
      <TouchableOpacity 
        style={styles.mediaButton}
        onPress={handleSelectImage}
      >
        <FontAwesome name="camera" size={30} color="#fff" />
        <Text style={styles.mediaButtonText}>Add Photo</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MediaSection;