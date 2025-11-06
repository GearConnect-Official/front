import React, { useEffect, useMemo } from 'react';
import { View, ViewStyle } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import { cloudinaryService } from '../../services/cloudinary.service';

interface CloudinaryVideoProps {
  publicId: string;
  width?: number;
  height?: number;
  quality?: 'auto' | number;
  format?: 'auto' | 'mp4' | 'webm' | 'mov';
  crop?: 'fill' | 'fit' | 'limit' | 'scale' | 'crop';
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
  // Fonction pour obtenir l'URL de la vidéo
  const getVideoUrl = (): string | null => {
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
          quality: quality as 'auto' | number,
          format: (format || 'mp4') as 'auto' | 'webp' | 'jpg' | 'png' | 'mp4' | 'webm',
          crop: crop as 'fill' | 'fit' | 'limit' | 'scale' | 'crop',
          resource_type: 'video'
        });
        console.log('📹 Generated optimized URL:', optimizedUrl);
        return optimizedUrl;
      } catch (error) {
        console.error('📹 Error generating optimized URL:', error);
        // Ne pas retourner null tout de suite, essayer le fallback
      }
    }
    
    // Si on a une URL de fallback, l'utiliser directement d'abord
    if (fallbackUrl) {
      console.log('📹 Using fallback URL directly:', fallbackUrl);
      
      // Pour Cloudinary, assurer que l'URL est correcte pour les vidéos
      if (fallbackUrl.includes('cloudinary.com')) {
        // Si l'URL contient 'image/upload', la corriger pour 'video/upload'
        if (fallbackUrl.includes('/image/upload/')) {
          const correctedUrl = fallbackUrl.replace('/image/upload/', '/video/upload/');
          console.log('📹 Corrected URL from image to video:', correctedUrl);
          return correctedUrl;
        }
        
        // Assurer que l'URL a le bon format vidéo
        if (!fallbackUrl.includes('f_mp4') && !fallbackUrl.includes('.mp4')) {
          // Ajouter le format mp4 si absent
          const urlWithFormat = fallbackUrl.includes('?') 
            ? `${fallbackUrl}&f_mp4`
            : `${fallbackUrl}/f_mp4`;
          console.log('📹 Added MP4 format to URL:', urlWithFormat);
          return urlWithFormat;
        }
      }
      
      // Utiliser l'URL de fallback directement
      return fallbackUrl;
    }
    
    console.warn('📹 No valid URL source available');
    return null;
  };

  const videoUrl = useMemo(() => getVideoUrl(), [publicId, fallbackUrl, width, height, quality, format, crop]);
  
  const player = useVideoPlayer(videoUrl || '', (player) => {
    player.loop = isLooping;
    player.muted = isMuted;
    if (shouldPlay) {
      player.play();
    } else {
      player.pause();
    }
  });

  // Force video to play when shouldPlay changes
  useEffect(() => {
    if (shouldPlay) {
      player.play();
    } else {
      player.pause();
    }
  }, [shouldPlay, player]);

  // Mettre à jour les propriétés du player quand elles changent
  useEffect(() => {
    player.loop = isLooping;
  }, [isLooping, player]);

  useEffect(() => {
    player.muted = isMuted;
  }, [isMuted, player]);

  if (!videoUrl) {
    console.warn('📹 No video URL available, not rendering video');
    return null;
  }

  console.log('📹 Rendering video with URL:', videoUrl);

  return (
    <VideoView
      player={player}
      style={[{ width, height }, style]}
      contentFit="cover"
      nativeControls={useNativeControls}
      allowsFullscreen={false}
      allowsPictureInPicture={false}
    />
  );
};

export default CloudinaryVideo;
