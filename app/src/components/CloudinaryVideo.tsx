import React from 'react';
import { ViewStyle } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { cloudinaryService } from '../services/cloudinary.service';

interface CloudinaryVideoProps {
  publicId: string;
  width?: number;
  height?: number;
  quality?: string;
  format?: string;
  crop?: string;
  style?: ViewStyle;
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
  const getVideoUrl = () => {
    if (!publicId && fallbackUrl) {
      return fallbackUrl;
    }
    
    if (!publicId) {
      return null;
    }

    try {
      return cloudinaryService.generateOptimizedUrl(publicId, {
        width,
        height,
        quality,
        format,
        crop,
        resource_type: 'video'
      });
    } catch (error) {
      console.error('Error generating Cloudinary video URL:', error);
      return fallbackUrl || null;
    }
  };

  const videoUrl = getVideoUrl();

  if (!videoUrl) {
    return null;
  }

  return (
    <Video
      source={{ uri: videoUrl }}
      style={[{ width, height }, style]}
      resizeMode={ResizeMode.COVER}
      shouldPlay={shouldPlay}
      isLooping={isLooping}
      isMuted={isMuted}
      useNativeControls={useNativeControls}
    />
  );
};

export default CloudinaryVideo; 