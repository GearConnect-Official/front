import React from 'react';
import { View, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { CloudinaryAvatar } from './CloudinaryImage';
import { Image, ImageProps } from 'react-native';
import theme from '../../styles/config/theme';

export interface VerifiedAvatarProps {
  publicId?: string;
  fallbackUrl?: string | number; // string for URI, number for require()
  size?: number;
  isVerify?: boolean;
  style?: any;
  quality?: 'auto' | 'auto:best' | 'auto:good' | 'auto:eco' | 'auto:low' | number;
  format?: 'auto' | 'webp' | 'jpg' | 'png';
}

/**
 * Avatar component with verification badge (like Twitter)
 * Shows a checkmark badge in the bottom right corner if user is verified
 */
export const VerifiedAvatar: React.FC<VerifiedAvatarProps> = ({
  publicId,
  fallbackUrl,
  size = 50,
  isVerify = false,
  style,
  quality = 'auto',
  format = 'auto',
}) => {
  const badgeSize = Math.max(14, size * 0.28); // Badge size proportional to avatar
  const badgePosition = size * 0.15; // Position from bottom right

  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      {publicId ? (
        <CloudinaryAvatar
          publicId={publicId}
          size={size}
          quality={quality}
          format={format}
          style={styles.avatar}
          fallbackUrl={fallbackUrl}
        />
      ) : fallbackUrl ? (
        typeof fallbackUrl === 'string' ? (
          <Image
            source={{ uri: fallbackUrl }}
            style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]}
          />
        ) : (
          <Image
            source={fallbackUrl}
            style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]}
          />
        )
      ) : (
        <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2, backgroundColor: '#E0E0E0' }]} />
      )}
      
      {isVerify && (
        <View
          style={[
            styles.verifiedBadge,
            {
              width: badgeSize,
              height: badgeSize,
              borderRadius: badgeSize / 2,
              bottom: -badgePosition,
              right: -badgePosition,
            },
          ]}
        >
          <FontAwesome name="check" size={badgeSize * 0.6} color="white" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  avatar: {
    borderRadius: 9999,
  },
  verifiedBadge: {
    position: 'absolute',
    backgroundColor: '#1DA1F2', // Twitter blue - standard verification color
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
});

export default VerifiedAvatar;
