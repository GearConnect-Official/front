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
  // Fonction pour extraire le publicId d'une URL Cloudinary complète
  const extractPublicIdFromUrl = (url: string): string | null => {
    try {
      // Pattern pour URLs Cloudinary: https://res.cloudinary.com/cloud_name/video/upload/...../public_id.ext
      const cloudinaryPattern = /https:\/\/res\.cloudinary\.com\/[^\/]+\/video\/upload\/(?:[^\/]+\/)*([^\/\.]+)/;
      const match = url.match(cloudinaryPattern);
      
      if (match && match[1]) {
        console.log('📹 Extracted publicId from URL:', match[1]);
        return match[1];
      }
      
      // Pattern alternatif pour URLs avec transformations
      const transformPattern = /\/([^\/\.]+)\.[^\/]+$/;
      const transformMatch = url.match(transformPattern);
      
      if (transformMatch && transformMatch[1]) {
        console.log('📹 Extracted publicId (alternative):', transformMatch[1]);
        return transformMatch[1];
      }
      
      return null;
    } catch (error) {
      console.warn('Error extracting publicId from URL:', error);
      return null;
    }
  };

  const getVideoUrl = () => {
    console.log('📹 CloudinaryVideo - Getting video URL...', {
      publicId,
      fallbackUrl,
      hasPublicId: !!publicId,
      hasFallback: !!fallbackUrl
    });

    // Si on a un publicId, utiliser le service Cloudinary
    if (publicId && publicId.trim() !== '') {
      try {
        const optimizedUrl = cloudinaryService.generateOptimizedUrl(publicId, {
          width,
          height,
          quality,
          format,
          crop,
          resource_type: 'video'
        });
        console.log('📹 Generated optimized URL:', optimizedUrl);
        return optimizedUrl;
      } catch (error) {
        console.error('📹 Error generating optimized URL:', error);
        return fallbackUrl || null;
      }
    }
    
    // Si on a une URL de fallback, essayer d'extraire le publicId
    if (fallbackUrl) {
      console.log('📹 Using fallback URL:', fallbackUrl);
      
      // Vérifier si c'est une URL Cloudinary
      if (fallbackUrl.includes('cloudinary.com')) {
        const extractedPublicId = extractPublicIdFromUrl(fallbackUrl);
        
        if (extractedPublicId) {
          try {
            const optimizedUrl = cloudinaryService.generateOptimizedUrl(extractedPublicId, {
              width,
              height,
              quality,
              format,
              crop,
              resource_type: 'video'
            });
            console.log('📹 Generated URL from extracted publicId:', optimizedUrl);
            return optimizedUrl;
          } catch (error) {
            console.warn('📹 Failed to generate URL from extracted publicId, using original:', error);
          }
        }
      }
      
      // Utiliser l'URL de fallback directement
      return fallbackUrl;
    }
    
    console.warn('📹 No valid URL source available');
    return null;
  };

  const videoUrl = getVideoUrl();

  if (!videoUrl) {
    console.warn('📹 No video URL available, not rendering video');
    return null;
  }

  console.log('📹 Rendering video with URL:', videoUrl);

  return (
    <Video
      source={{ uri: videoUrl }}
      style={[{ width, height }, style]}
      resizeMode={ResizeMode.COVER}
      shouldPlay={shouldPlay}
      isLooping={isLooping}
      isMuted={isMuted}
      useNativeControls={useNativeControls}
      onError={(error) => {
        console.error('📹 Video playback error:', error);
      }}
      onLoad={() => {
        console.log('📹 Video loaded successfully');
      }}
    />
  );
};

export default CloudinaryVideo; 