import { Platform } from 'react-native';

// Centralized image assets for better bundling and management
// Using require() for all platforms for consistent behavior

const getImageSource = (androidResource: string, fallbackRequire: any) => {
  // Use require() for all platforms to avoid URI casting issues
  return fallbackRequire;
};

export const AppImages = {
  // Main logo - use require() for consistent behavior
  logoRounded: require('../../assets/images/logoGearConnect.png'),
  icon: require('../../assets/images/icon.png'),
  splashIcon: require('../../assets/images/splash-icon.png'),
  adaptiveIcon: require('../../assets/images/adaptive-icon.png'),
  
  // Social logos
  googleLogo: require('../../assets/images/Google-logo.png'),
  appleLogo: require('../../assets/images/Apple-logo.png'),
  facebook: require('../../assets/images/facebook.png'),
  
  // Other assets
  formula1: require('../../assets/images/Formula1.png'),
  error: require('../../assets/images/error.png'),
  favicon: require('../../assets/images/favicon.png'),
  
  // React logos (dev)
  reactLogo: require('../../assets/images/react-logo.png'),
  partialReactLogo: require('../../assets/images/partial-react-logo.png'),
};

// Type safety for image keys
export type ImageKey = keyof typeof AppImages; 