/**
 * Palette de couleurs du thème sombre
 */

const darkPalette = {
  // Couleurs primaires
  primary: {
    main: '#9E01FF', // Version plus claire pour contraste sur fond sombre
    light: '#B54AFF',
    dark: '#7000C2',
  },
  
  // Couleurs secondaires
  secondary: {
    main: '#4FC3F7',
    light: '#81D4FA',
    dark: '#29B6F6',
  },
  
  // Gris
  grey: {
    50: '#292929',
    100: '#333333',
    200: '#404040',
    300: '#4D4D4D',
    400: '#666666',
    500: '#808080',
    600: '#9E9E9E',
    700: '#BDBDBD',
    800: '#E0E0E0',
    900: '#F5F5F5',
  },
  
  // Couleurs de texte
  text: {
    primary: '#FFFFFF',
    secondary: '#BDBDBD',
    disabled: '#757575',
    hint: '#9E9E9E',
  },
  
  // Couleurs de fond
  background: {
    default: '#121212',
    paper: '#1E1E1E',
    input: '#292929',
  },
  
  // Couleurs d'état
  status: {
    error: '#FF5252',
    warning: '#FFB74D',
    info: '#4FC3F7',
    success: '#69F0AE',
  },
  
  // Autres couleurs
  common: {
    white: '#FFF',
    black: '#000',
    transparent: 'transparent',
  },

  // Couleurs de bordure
  border: {
    light: 'rgba(255, 255, 255, 0.12)',
    medium: 'rgba(255, 255, 255, 0.24)',
    dark: 'rgba(255, 255, 255, 0.38)',
  },
};

export default darkPalette; 