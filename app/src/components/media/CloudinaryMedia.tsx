import React from 'react';
import { ViewStyle } from 'react-native';
import { CloudinaryImage } from './CloudinaryImage';
import CloudinaryVideo from './CloudinaryVideo';

interface CloudinaryMediaProps {
  publicId: string;
  mediaType?: 'image' | 'video' | 'auto';
  width?: number;
  height?: number;
  quality?: string;
  format?: string;
  crop?: string;
  style?: ViewStyle;
  fallbackUrl?: string;
  // Props spécifiques aux vidéos
  shouldPlay?: boolean;
  isLooping?: boolean;
  isMuted?: boolean;
  useNativeControls?: boolean;
}

const CloudinaryMedia: React.FC<CloudinaryMediaProps> = ({
  publicId,
  mediaType = 'auto',
  width = 300,
  height = 300,
  quality = 'auto',
  format,
  crop = 'fill',
  style,
  fallbackUrl,
  shouldPlay = false,
  isLooping = true,
  isMuted = true,
  useNativeControls = true,
}) => {
  const detectMediaType = (): 'image' | 'video' => {
    console.log('🎯 CloudinaryMedia - Detecting media type:', {
      mediaType,
      publicId,
      fallbackUrl,
      format
    });

    if (mediaType !== 'auto') {
      console.log('🎯 Using explicit media type:', mediaType);
      return mediaType;
    }

    // Détecter le type basé sur l'URL de fallback
    if (fallbackUrl) {
      console.log('🎯 Checking fallback URL for video patterns:', fallbackUrl);
      
      const videoExtensions = ['.mp4', '.mov', '.avi', '.mkv', '.webm', '.m4v'];
      const lowercaseUrl = fallbackUrl.toLowerCase();
      
      if (videoExtensions.some(ext => lowercaseUrl.includes(ext))) {
        console.log('🎯 Detected video from file extension in URL');
        return 'video';
      }

      // Vérifier les patterns Cloudinary spécifiques aux vidéos
      if (lowercaseUrl.includes('/video/upload') || 
          lowercaseUrl.includes('video/upload') ||
          lowercaseUrl.includes('resource_type=video') ||
          lowercaseUrl.includes('.cloudinary.com') && lowercaseUrl.includes('f_mp4')) {
        console.log('🎯 Detected video from Cloudinary URL patterns');
        return 'video';
      }
      
      // Nouveau : vérifier si l'URL contient des paramètres de format vidéo
      if (lowercaseUrl.includes('f_mp4') || lowercaseUrl.includes('f_webm') || lowercaseUrl.includes('f_mov')) {
        console.log('🎯 Detected video from format parameters in URL');
        return 'video';
      }
    }

    // Détecter le type basé sur le publicId
    if (publicId && publicId.trim() !== '') {
      console.log('🎯 Checking publicId for video patterns:', publicId);
      const lowercaseId = publicId.toLowerCase();
      if (lowercaseId.includes('video') || lowercaseId.startsWith('videos/') || lowercaseId.includes('/video/')) {
        console.log('🎯 Detected video from publicId containing video patterns');
        return 'video';
      }
    }

    // Si on a un format spécifié pour vidéo
    if (format && ['mp4', 'webm', 'mov', 'avi', 'mkv'].includes(format.toLowerCase())) {
      console.log('🎯 Detected video from format:', format);
      return 'video';
    }

    console.log('🎯 Defaulting to image (no video patterns found)');
    return 'image';
  };

  const detectedType = detectMediaType();

  console.log('🎯 CloudinaryMedia - Final decision:', {
    detectedType,
    willRenderVideo: detectedType === 'video'
  });

  if (detectedType === 'video') {
    console.log('🎯 Rendering CloudinaryVideo with props:', {
      publicId,
      fallbackUrl,
      shouldPlay,
      width,
      height
    });
    
    return (
      <CloudinaryVideo
        publicId={publicId}
        width={width}
        height={height}
        quality={quality}
        format={format || 'mp4'}
        crop={crop}
        style={style}
        fallbackUrl={fallbackUrl}
        shouldPlay={shouldPlay}
        isLooping={isLooping}
        isMuted={isMuted}
        useNativeControls={useNativeControls}
      />
    );
  }

  console.log('🎯 Rendering CloudinaryImage with props:', {
    publicId,
    fallbackUrl,
    width,
    height
  });

  return (
    <CloudinaryImage
      publicId={publicId}
      width={width}
      height={height}
      quality={quality}
      format={format || 'auto'}
      crop={crop}
      style={style}
      fallbackUrl={fallbackUrl}
    />
  );
};

export default CloudinaryMedia; 