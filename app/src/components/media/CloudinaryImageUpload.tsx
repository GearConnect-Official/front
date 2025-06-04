import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome } from '@expo/vector-icons';
import { useCloudinary } from '../../hooks/useCloudinary';
import { CloudinaryUploadResponse, CloudinaryUploadOptions } from '../../services/cloudinary.service';
import { cloudinaryImageUploadStyles } from '../../styles/components/cloudinaryStyles';

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
    <View style={[cloudinaryImageUploadStyles.container, style]}>
      {/* Bouton d'upload */}
      {canAddMore && (
        <TouchableOpacity
          style={[cloudinaryImageUploadStyles.uploadButton, uploading && cloudinaryImageUploadStyles.uploadButtonDisabled]}
          onPress={handleUploadOption}
          disabled={uploading}
        >
          {uploading ? (
            <ActivityIndicator color="#007AFF" size="small" />
          ) : (
            <Ionicons name="camera" size={24} color="#007AFF" />
          )}
          <Text style={cloudinaryImageUploadStyles.uploadButtonText}>
            {uploading ? 'Upload en cours...' : buttonText}
          </Text>
        </TouchableOpacity>
      )}

      {/* Affichage des erreurs */}
      {error && (
        <View style={cloudinaryImageUploadStyles.errorContainer}>
          <Text style={cloudinaryImageUploadStyles.errorText}>{error}</Text>
          <TouchableOpacity onPress={clearError}>
            <Ionicons name="close" size={20} color="#FF3B30" />
          </TouchableOpacity>
        </View>
      )}

      {/* Prévisualisation des images */}
      {showPreview && uploadedImages.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={cloudinaryImageUploadStyles.previewContainer}>
          {uploadedImages.map((image, index) => (
            <View key={image.public_id} style={cloudinaryImageUploadStyles.imagePreview}>
              <Image
                source={{ uri: image.secure_url }}
                style={cloudinaryImageUploadStyles.previewImage}
                resizeMode="cover"
              />
              <TouchableOpacity
                style={cloudinaryImageUploadStyles.removeButton}
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
        <Text style={cloudinaryImageUploadStyles.limitText}>
          {uploadedImages.length} / {maxImages} images
        </Text>
      )}
    </View>
  );
}; 