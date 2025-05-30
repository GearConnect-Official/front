import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useCloudinary } from '../../hooks/useCloudinary';
import { CloudinaryUploadResponse } from '../../services/cloudinary.service';
import styles from '../../styles/publicationStyles';
import * as ImagePicker from 'expo-image-picker';

// Racing color palette
const THEME_COLORS = {
  primary: '#E10600', // Racing Red
  secondary: '#1E1E1E', // Racing Black
  background: '#FFFFFF',
  textSecondary: '#6E6E6E',
  border: '#E0E0E0',
  cardLight: '#F8F8F8',
};

interface MediaSectionProps {
  onImageSelected: (cloudinaryResponse: CloudinaryUploadResponse) => void;
}

const MediaSection: React.FC<MediaSectionProps> = ({ onImageSelected }) => {
  const { uploadFromCamera, clearError } = useCloudinary();
  const [uploadProgress, setUploadProgress] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearLocalError = () => {
    setError(null);
  };

  const handleSelectFromGallery = async () => {
    try {
      setUploading(true);
      setError(null);
      setUploadProgress('Sélection du média...');
      
      // Utiliser directement expo-image-picker avec support images et vidéos
      await ImagePicker.requestMediaLibraryPermissionsAsync();

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All, // Support images ET vidéos
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (result.canceled || !result.assets[0]) {
        setUploadProgress('');
        return;
      }

      const asset = result.assets[0];
      const resourceType = asset.type === 'video' ? 'video' : 'image';
      
      setUploadProgress(`Upload ${resourceType}...`);
      
      // Import du service Cloudinary ici pour upload direct
      const { cloudinaryService } = await import('../../services/cloudinary.service');
      
      const uploadResult = await cloudinaryService.uploadMedia(
        asset.uri,
        {
          folder: 'posts',
          tags: ['post', 'gallery', resourceType],
          resource_type: resourceType,
        }
      );
      
      if (uploadResult) {
        setUploadProgress('Upload terminé !');
        onImageSelected(uploadResult);
        setTimeout(() => setUploadProgress(''), 2000);
      } else {
        setUploadProgress('');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de l\'upload';
      setError(errorMessage);
      Alert.alert('Erreur', errorMessage);
      setUploadProgress('');
    } finally {
      setUploading(false);
    }
  };

  const handleTakePhoto = async () => {
    try {
      clearError();
      setUploadProgress('Prise de photo/vidéo...');
      
      const result = await uploadFromCamera({
        folder: 'posts',
        tags: ['post', 'camera'],
      });
      
      if (result) {
        setUploadProgress('Upload terminé !');
        onImageSelected(result);
        setTimeout(() => setUploadProgress(''), 2000);
      } else {
        setUploadProgress('');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de l\'upload';
      Alert.alert('Erreur', errorMessage);
      setUploadProgress('');
    }
  };

  return (
    <View style={styles.mediaSectionContainer}>
      <Text style={localStyles.title}>Create a Post</Text>
      
      <Text style={localStyles.subtitle}>
        Share your best racing photos, videos, cars, events and more.
      </Text>
      
      {uploadProgress && (
        <View style={localStyles.progressContainer}>
          <Text style={localStyles.progressText}>{uploadProgress}</Text>
        </View>
      )}
      
      {error && (
        <View style={localStyles.errorContainer}>
          <Text style={localStyles.errorText}>{error}</Text>
          <TouchableOpacity onPress={clearLocalError}>
            <FontAwesome name="times" size={16} color="#FF3B30" />
          </TouchableOpacity>
        </View>
      )}
      
      <View style={localStyles.buttonContainer}>
        <TouchableOpacity 
          style={[localStyles.mediaOptionButton, uploading && localStyles.disabledButton]}
          onPress={handleSelectFromGallery}
          disabled={uploading}
        >
          <View style={localStyles.iconContainer}>
            <FontAwesome name="image" size={30} color={THEME_COLORS.background} />
          </View>
          <Text style={localStyles.buttonLabel}>Gallery</Text>
          <Text style={localStyles.buttonDescription}>
            {uploading ? 'Uploading...' : 'Photos & Videos'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[localStyles.mediaOptionButton, uploading && localStyles.disabledButton]}
          onPress={handleTakePhoto}
          disabled={uploading}
        >
          <View style={localStyles.iconContainer}>
            <FontAwesome name="camera" size={30} color={THEME_COLORS.background} />
          </View>
          <Text style={localStyles.buttonLabel}>Camera</Text>
          <Text style={localStyles.buttonDescription}>
            {uploading ? 'Uploading...' : 'Photo/Video'}
          </Text>
        </TouchableOpacity>
      </View>
      
      <View style={localStyles.infoContainer}>
        <Text style={localStyles.infoText}>
          📷 Images & videos are automatically optimized and stored securely
        </Text>
        <Text style={localStyles.infoText}>
          ⚡ Fast loading with automatic format conversion
        </Text>
        <Text style={localStyles.infoText}>
          🎬 Support for photos and videos up to 100MB
        </Text>
      </View>
    </View>
  );
};

const localStyles = StyleSheet.create({
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: THEME_COLORS.primary,
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: THEME_COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  progressContainer: {
    backgroundColor: THEME_COLORS.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginBottom: 20,
  },
  progressText: {
    color: THEME_COLORS.background,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFEBEE',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  errorText: {
    flex: 1,
    color: '#FF3B30',
    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  mediaOptionButton: {
    flex: 1,
    alignItems: 'center',
    padding: 24,
    marginHorizontal: 8,
    borderRadius: 16,
    backgroundColor: THEME_COLORS.primary,
    shadowColor: THEME_COLORS.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  disabledButton: {
    opacity: 0.6,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonLabel: {
    color: THEME_COLORS.background,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  buttonDescription: {
    color: THEME_COLORS.background,
    fontSize: 12,
    opacity: 0.9,
    textAlign: 'center',
    lineHeight: 16,
  },
  infoContainer: {
    paddingHorizontal: 20,
  },
  infoText: {
    fontSize: 14,
    color: THEME_COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 20,
  },
});

export default MediaSection;