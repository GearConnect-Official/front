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
    if (mediaType !== 'auto') {
      return mediaType;
    }

    // Détecter le type basé sur l'URL de fallback
    if (fallbackUrl) {
      const videoExtensions = ['.mp4', '.mov', '.avi', '.mkv', '.webm', '.m4v'];
      const lowercaseUrl = fallbackUrl.toLowerCase();
      
      if (videoExtensions.some(ext => lowercaseUrl.includes(ext))) {
        return 'video';
      }
    }

    // Détecter le type basé sur le publicId (si le dossier contient 'video')
    if (publicId && publicId.toLowerCase().includes('video')) {
      return 'video';
    }

    // Si on a un format spécifié pour vidéo
    if (format && ['mp4', 'webm', 'mov'].includes(format.toLowerCase())) {
      return 'video';
    }

    // Par défaut, on assume que c'est une image
    return 'image';
  };

  const detectedType = detectMediaType();

  if (detectedType === 'video') {
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