import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCloudinary } from '../hooks/useCloudinary';
import { CloudinaryUploadResponse } from '../services/cloudinary.service';

export interface CloudinaryImageUploadProps {
  onUploadComplete?: (response: CloudinaryUploadResponse) => void;
  onUploadError?: (error: string) => void;
  folder?: string;
  tags?: string[];
  allowMultiple?: boolean;
  maxImages?: number;
  style?: any;
  buttonText?: string;
  showPreview?: boolean;
}

export const CloudinaryImageUpload: React.FC<CloudinaryImageUploadProps> = ({
  onUploadComplete,
  onUploadError,
  folder,
  tags = [],
  allowMultiple = false,
  maxImages = 5,
  style,
  buttonText = 'Ajouter une image',
  showPreview = true,
}) => {
  const { uploading, error, uploadImage, uploadFromCamera, uploadMultiple, clearError } = useCloudinary();
  const [uploadedImages, setUploadedImages] = useState<CloudinaryUploadResponse[]>([]);

  const handleUploadOption = () => {
    Alert.alert(
      'Sélectionner une source',
      'D\'où voulez-vous importer votre image ?',
      [
        {
          text: 'Galerie',
          onPress: handleGalleryUpload,
        },
        {
          text: 'Caméra',
          onPress: handleCameraUpload,
        },
        {
          text: 'Annuler',
          style: 'cancel',
        },
      ]
    );
  };

  const handleGalleryUpload = async () => {
    try {
      clearError();
      
      if (allowMultiple) {
        const results = await uploadMultiple({
          folder,
          tags,
        });
        
        if (results) {
          const limitedResults = results.slice(0, maxImages - uploadedImages.length);
          setUploadedImages(prev => [...prev, ...limitedResults]);
          limitedResults.forEach(result => onUploadComplete?.(result));
        }
      } else {
        const result = await uploadImage({
          folder,
          tags,
        });
        
        if (result) {
          setUploadedImages(prev => [...prev, result]);
          onUploadComplete?.(result);
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de l\'upload';
      onUploadError?.(errorMessage);
    }
  };

  const handleCameraUpload = async () => {
    try {
      clearError();
      
      const result = await uploadFromCamera({
        folder,
        tags,
      });
      
      if (result) {
        setUploadedImages(prev => [...prev, result]);
        onUploadComplete?.(result);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de l\'upload';
      onUploadError?.(errorMessage);
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const canAddMore = !allowMultiple ? uploadedImages.length === 0 : uploadedImages.length < maxImages;

  return (
    <View style={[styles.container, style]}>
      {/* Bouton d'upload */}
      {canAddMore && (
        <TouchableOpacity
          style={[styles.uploadButton, uploading && styles.uploadButtonDisabled]}
          onPress={handleUploadOption}
          disabled={uploading}
        >
          {uploading ? (
            <ActivityIndicator color="#007AFF" size="small" />
          ) : (
            <Ionicons name="camera" size={24} color="#007AFF" />
          )}
          <Text style={styles.uploadButtonText}>
            {uploading ? 'Upload en cours...' : buttonText}
          </Text>
        </TouchableOpacity>
      )}

      {/* Affichage des erreurs */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={clearError}>
            <Ionicons name="close" size={20} color="#FF3B30" />
          </TouchableOpacity>
        </View>
      )}

      {/* Prévisualisation des images */}
      {showPreview && uploadedImages.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.previewContainer}>
          {uploadedImages.map((image, index) => (
            <View key={image.public_id} style={styles.imagePreview}>
              <Image
                source={{ uri: image.secure_url }}
                style={styles.previewImage}
                resizeMode="cover"
              />
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeImage(index)}
              >
                <Ionicons name="close" size={16} color="white" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}

      {/* Informations sur les limites */}
      {allowMultiple && (
        <Text style={styles.limitText}>
          {uploadedImages.length} / {maxImages} images
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#007AFF',
    borderStyle: 'dashed',
  },
  uploadButtonDisabled: {
    opacity: 0.6,
  },
  uploadButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFEBEE',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  errorText: {
    flex: 1,
    color: '#FF3B30',
    fontSize: 14,
  },
  previewContainer: {
    marginTop: 16,
  },
  imagePreview: {
    position: 'relative',
    marginRight: 12,
  },
  previewImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  removeButton: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#FF3B30',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  limitText: {
    marginTop: 8,
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'center',
  },
}); 