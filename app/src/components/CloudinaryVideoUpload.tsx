import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { useCloudinary } from '../hooks/useCloudinary';
import { CloudinaryUploadResponse } from '../services/cloudinary.service';

export interface CloudinaryVideoUploadProps {
  onUploadComplete?: (response: CloudinaryUploadResponse) => void;
  onUploadError?: (error: string) => void;
  folder?: string;
  tags?: string[];
  allowMultiple?: boolean;
  maxVideos?: number;
  style?: any;
  buttonText?: string;
  showPreview?: boolean;
}

export const CloudinaryVideoUpload: React.FC<CloudinaryVideoUploadProps> = ({
  onUploadComplete,
  onUploadError,
  folder,
  tags = [],
  allowMultiple = false,
  maxVideos = 3,
  style,
  buttonText = 'Ajouter une vidéo',
  showPreview = true,
}) => {
  const { uploading, error, uploadVideo, uploadFromCamera, clearError } = useCloudinary();
  const [uploadedVideos, setUploadedVideos] = useState<CloudinaryUploadResponse[]>([]);

  const handleUploadOption = () => {
    Alert.alert(
      'Sélectionner une source',
      'D\'où voulez-vous importer votre vidéo ?',
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
      
      const result = await uploadVideo({
        folder,
        tags,
      });
      
      if (result) {
        setUploadedVideos(prev => [...prev, result]);
        onUploadComplete?.(result);
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
        resource_type: 'video',
      });
      
      if (result && result.resource_type === 'video') {
        setUploadedVideos(prev => [...prev, result]);
        onUploadComplete?.(result);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de l\'upload';
      onUploadError?.(errorMessage);
    }
  };

  const removeVideo = (index: number) => {
    setUploadedVideos(prev => prev.filter((_, i) => i !== index));
  };

  const formatDuration = (duration?: number) => {
    if (!duration) return '';
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  const canAddMore = !allowMultiple ? uploadedVideos.length === 0 : uploadedVideos.length < maxVideos;

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
            <Ionicons name="videocam" size={24} color="#007AFF" />
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

      {/* Prévisualisation des vidéos */}
      {showPreview && uploadedVideos.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.previewContainer}>
          {uploadedVideos.map((video, index) => (
            <View key={video.public_id} style={styles.videoPreview}>
              <Video
                source={{ uri: video.secure_url }}
                style={styles.previewVideo}
                useNativeControls
                resizeMode={ResizeMode.COVER}
                shouldPlay={false}
              />
              
              {/* Informations sur la vidéo */}
              <View style={styles.videoInfo}>
                <Text style={styles.videoDuration}>
                  {formatDuration(video.duration)}
                </Text>
                <Text style={styles.videoSize}>
                  {formatFileSize(video.bytes)}
                </Text>
              </View>
              
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeVideo(index)}
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
          {uploadedVideos.length} / {maxVideos} vidéos
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
  videoPreview: {
    position: 'relative',
    marginRight: 12,
    borderRadius: 8,
    overflow: 'hidden',
  },
  previewVideo: {
    width: 120,
    height: 120,
    borderRadius: 8,
  },
  videoInfo: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    right: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 4,
    padding: 4,
  },
  videoDuration: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  videoSize: {
    color: 'white',
    fontSize: 10,
    opacity: 0.8,
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