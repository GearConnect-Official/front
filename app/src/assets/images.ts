// Centralized image assets for better bundling and management
// All images are imported here to ensure they're included in the bundle

export const AppImages = {
  // Main logo
  logoRounded: require('../../assets/images/logo-rounded.png'),
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