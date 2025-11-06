import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import { Ionicons } from '@expo/vector-icons';
import { useCloudinary } from '../../hooks/useCloudinary';
import { CloudinaryUploadResponse } from '../../services/cloudinary.service';
import { cloudinaryVideoUploadStyles } from '../../styles/components/cloudinaryStyles';

// Composant pour la prévisualisation vidéo
interface VideoPreviewItemProps {
  video: CloudinaryUploadResponse;
  onRemove: () => void;
  formatDuration: (duration?: number) => string;
  formatFileSize: (bytes: number) => string;
}

const VideoPreviewItem: React.FC<VideoPreviewItemProps> = ({
  video,
  onRemove,
  formatDuration,
  formatFileSize,
}) => {
  const player = useVideoPlayer(video.secure_url, (player) => {
    player.loop = false;
    player.pause();
  });

  return (
    <View style={cloudinaryVideoUploadStyles.videoPreview}>
      <VideoView
        player={player}
        style={cloudinaryVideoUploadStyles.previewVideo}
        contentFit="cover"
        nativeControls
        allowsFullscreen={false}
        allowsPictureInPicture={false}
      />
      
      {/* Informations sur la vidéo */}
      <View style={cloudinaryVideoUploadStyles.videoInfo}>
        <Text style={cloudinaryVideoUploadStyles.videoDuration}>
          {formatDuration(video.duration)}
        </Text>
        <Text style={cloudinaryVideoUploadStyles.videoSize}>
          {formatFileSize(video.bytes)}
        </Text>
      </View>
      
      <TouchableOpacity
        style={cloudinaryVideoUploadStyles.removeButton}
        onPress={onRemove}
      >
        <Ionicons name="close" size={16} color="white" />
      </TouchableOpacity>
    </View>
  );
};

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
    <View style={[cloudinaryVideoUploadStyles.container, style]}>
      {/* Bouton d'upload */}
      {canAddMore && (
        <TouchableOpacity
          style={[cloudinaryVideoUploadStyles.uploadButton, uploading && cloudinaryVideoUploadStyles.uploadButtonDisabled]}
          onPress={handleUploadOption}
          disabled={uploading}
        >
          {uploading ? (
            <ActivityIndicator color="#007AFF" size="small" />
          ) : (
            <Ionicons name="videocam" size={24} color="#007AFF" />
          )}
          <Text style={cloudinaryVideoUploadStyles.uploadButtonText}>
            {uploading ? 'Upload en cours...' : buttonText}
          </Text>
        </TouchableOpacity>
      )}

      {/* Affichage des erreurs */}
      {error && (
        <View style={cloudinaryVideoUploadStyles.errorContainer}>
          <Text style={cloudinaryVideoUploadStyles.errorText}>{error}</Text>
          <TouchableOpacity onPress={clearError}>
            <Ionicons name="close" size={20} color="#FF3B30" />
          </TouchableOpacity>
        </View>
      )}

      {/* Prévisualisation des vidéos */}
      {showPreview && uploadedVideos.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={cloudinaryVideoUploadStyles.previewContainer}>
          {uploadedVideos.map((video, index) => (
            <VideoPreviewItem
              key={video.public_id}
              video={video}
              onRemove={() => removeVideo(index)}
              formatDuration={formatDuration}
              formatFileSize={formatFileSize}
            />
          ))}
        </ScrollView>
      )}

      {/* Informations sur les limites */}
      {allowMultiple && (
        <Text style={cloudinaryVideoUploadStyles.limitText}>
          {uploadedVideos.length} / {maxVideos} vidéos
        </Text>
      )}
    </View>
  );
}; 