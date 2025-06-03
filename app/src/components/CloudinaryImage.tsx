import React from 'react';
import { Image, ImageProps, StyleSheet } from 'react-native';
import { cloudinaryService } from '../services/cloudinary.service';
import { cloudinaryConfig } from '../config';

export interface CloudinaryImageProps extends Omit<ImageProps, 'source'> {
  publicId: string;
  width?: number;
  height?: number;
  crop?: 'fill' | 'fit' | 'limit' | 'scale' | 'crop';
  quality?: 'auto' | number;
  format?: 'auto' | 'webp' | 'jpg' | 'png';
  fallbackUrl?: string;
  transformation?: string;
}

export const CloudinaryImage: React.FC<CloudinaryImageProps> = ({
  publicId,
  width,
  height,
  crop = 'fill',
  quality = 'auto',
  format = 'auto',
  fallbackUrl,
  transformation,
  style,
  ...imageProps
}) => {
  // Générer l'URL optimisée
  const getOptimizedUrl = () => {
    if (!publicId) {
      return fallbackUrl || null;
    }

    if (transformation) {
      // Utiliser une transformation personnalisée
      return `https://res.cloudinary.com/${cloudinaryConfig.cloudName}/image/upload/${transformation}/${publicId}`;
    }

    // Utiliser la méthode de génération d'URL optimisée
    return cloudinaryService.generateOptimizedUrl(publicId, {
      width,
      height,
      crop,
      quality,
      format,
      resource_type: 'image',
    });
  };

  const optimizedUrl = getOptimizedUrl();

  if (!optimizedUrl) {
    return null;
  }

  return (
    <Image
      {...imageProps}
      source={{ uri: optimizedUrl }}
      style={[
        style,
        width && height ? { width, height } : undefined,
      ]}
    />
  );
};

// Composants pré-configurés pour des cas d'usage courants
export const CloudinaryAvatar: React.FC<Omit<CloudinaryImageProps, 'width' | 'height' | 'crop'> & { size?: number }> = ({
  size = 50,
  ...props
}) => (
  <CloudinaryImage
    {...props}
    width={size}
    height={size}
    crop="fill"
    style={[styles.avatar, props.style]}
  />
);

export const CloudinaryThumbnail: React.FC<Omit<CloudinaryImageProps, 'width' | 'height'> & { size?: number }> = ({
  size = 100,
  ...props
}) => (
  <CloudinaryImage
    {...props}
    width={size}
    height={size}
    style={[styles.thumbnail, props.style]}
  />
);

export const CloudinaryHeroImage: React.FC<Omit<CloudinaryImageProps, 'width' | 'height'> & { aspectRatio?: number }> = ({
  aspectRatio = 16/9,
  ...props
}) => (
  <CloudinaryImage
    {...props}
    crop="fill"
    style={[
      styles.heroImage,
      { aspectRatio },
      props.style
    ]}
  />
);

const styles = StyleSheet.create({
  avatar: {
    borderRadius: 25,
  },
  thumbnail: {
    borderRadius: 8,
  },
  heroImage: {
    width: '100%',
    borderRadius: 12,
  },
}); 