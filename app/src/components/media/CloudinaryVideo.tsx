import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video';
import { cloudinaryService } from '../../services/cloudinary.service';

interface CloudinaryVideoProps {
  publicId: string;
  width?: number;
  height?: number;
  quality?: 'auto' | number;
  format?: 'auto' | 'mp4' | 'webm' | 'mov';
  crop?: 'fill' | 'fit' | 'limit' | 'scale' | 'crop';
  style?: any;
  fallbackUrl?: string;
  shouldPlay?: boolean;
  isLooping?: boolean;
  isMuted?: boolean;
  useNativeControls?: boolean;
}

const CloudinaryVideo: React.FC<CloudinaryVideoProps> = ({
  publicId,
  width = 300,
  height = 300,
  quality = 'auto',
  format = 'mp4',
  crop = 'fill',
  style,
  fallbackUrl,
  shouldPlay = false,
  isLooping = true,
  isMuted = true,
  useNativeControls = true,
}) => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger l'URL de la vidéo
  useEffect(() => {
    const loadVideoUrl = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const url = cloudinaryService.getVideoUrl(publicId, {
          width,
          height,
          quality,
          format,
          crop,
        });
        
        setVideoUrl(url);
      } catch (err) {
        console.error('📹 Error loading video URL:', err);
        setError('Failed to load video');
      } finally {
        setIsLoading(false);
      }
    };

    if (publicId) {
      loadVideoUrl();
    }
  }, [publicId, width, height, quality, format, crop]);

  // Créer le player vidéo avec expo-video
  const player = useVideoPlayer(videoUrl || '', (player) => {
    player.loop = isLooping;
    player.muted = isMuted;
    player.play();
  });

  // Contrôler la lecture
  useEffect(() => {
    if (player) {
      if (shouldPlay) {
        player.play();
      } else {
        player.pause();
      }
    }
  }, [shouldPlay, player]);

  if (isLoading) {
    return (
      <View style={[styles.container, { width, height }, style]}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading video...</Text>
      </View>
    );
  }

  if (error || !videoUrl) {
    return (
      <View style={[styles.container, { width, height }, style]}>
        <Text style={styles.errorText}>Failed to load video</Text>
        {fallbackUrl && (
          <Text style={styles.fallbackText}>Fallback: {fallbackUrl}</Text>
        )}
      </View>
    );
  }

  return (
    <View style={[styles.container, { width, height }, style]}>
      <VideoView
        style={styles.video}
        player={player}
        allowsFullscreen
        allowsPictureInPicture
        showsTimecodes
        requiresLinearPlayback={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    overflow: 'hidden',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  loadingText: {
    color: '#fff',
    marginTop: 8,
    fontSize: 14,
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 14,
    textAlign: 'center',
  },
  fallbackText: {
    color: '#666',
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
});

export default CloudinaryVideo;