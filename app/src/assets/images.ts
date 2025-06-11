import { Platform } from 'react-native';

// Centralized image assets for better bundling and management
// Uses Android drawable resources for better compatibility

const getImageSource = (androidResource: string, fallbackRequire: any) => {
  if (Platform.OS === 'android') {
    return { uri: androidResource };
  }
  return fallbackRequire;
};

export const AppImages = {
  // Main logo - use Android drawable resources
  logoRounded: getImageSource('logo_rounded', require('../../assets/images/logo-rounded.png')),
  icon: getImageSource('icon', require('../../assets/images/icon.png')),
  splashIcon: getImageSource('splashscreen_logo', require('../../assets/images/splash-icon.png')),
  adaptiveIcon: require('../../assets/images/adaptive-icon.png'),
  
  // Social logos
  googleLogo: getImageSource('google_logo', require('../../assets/images/Google-logo.png')),
  appleLogo: getImageSource('apple_logo', require('../../assets/images/Apple-logo.png')),
  facebook: require('../../assets/images/facebook.png'),
  
  // Other assets
  formula1: getImageSource('formula1', require('../../assets/images/Formula1.png')),
  error: require('../../assets/images/error.png'),
  favicon: require('../../assets/images/favicon.png'),
  
  // Motorsport images
  motorsportHighlights: require('../../assets/images/motorsport-images-highlights.png'),
  superbike: require('../../assets/images/superbike-930715_640.png'),
  thierryNeuville: require('../../assets/images/thierry-neuville-2024-wrc-world-champion.png'),
  
  // React logos (dev)
  reactLogo: require('../../assets/images/react-logo.png'),
  partialReactLogo: require('../../assets/images/partial-react-logo.png'),
};

// Type safety for image keys
export type ImageKey = keyof typeof AppImages; 