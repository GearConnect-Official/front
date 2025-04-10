/**
 * Palette de couleurs du thème clair (par défaut)
 */

const lightPalette = {
  // Couleurs primaires
  primary: {
    main: '#E53935', // Rouge principal
    light: '#FF5252', // Rouge plus clair
    dark: '#C62828', // Rouge plus foncé
  },
  
  // Couleurs secondaires
  secondary: {
    main: '#B71C1C', // Rouge foncé
    light: '#D32F2F', // Rouge secondaire
    dark: '#7F0000', // Rouge très foncé
  },
  
  // Gris
  grey: {
    50: '#F7F8F9',
    100: '#E8ECF4',
    200: '#DAE0E6',
    300: '#C7CDD6',
    400: '#B4BAC4',
    500: '#8391A1',
    600: '#6A707C',
    700: '#474C54',
    800: '#2B303A',
    900: '#1E232C',
  },
  
  // Couleurs de texte
  text: {
    primary: '#1E232C',
    secondary: '#6A707C',
    disabled: '#8391A1',
    hint: '#8391A1',
  },
  
  // Couleurs de fond
  background: {
    default: 'rgba(255, 245, 245, 1)', // Fond légèrement rouge
    paper: '#FFF',
    input: 'rgba(253, 242, 242, 1)', // Entrées légèrement rouges
  },
  
  // Couleurs d'état
  status: {
    error: '#FF3B30',
    warning: '#FF9500',
    info: '#E57373', // Rouge clair pour l'info
    success: '#34C759',
  },
  
  // Autres couleurs
  common: {
    white: '#FFF',
    black: '#000',
    transparent: 'transparent',
  },

  // Couleurs de bordure
  border: {
    light: 'rgba(229, 57, 53, 0.1)', // Bordure légèrement rouge
    medium: 'rgba(229, 57, 53, 0.2)',
    dark: 'rgba(229, 57, 53, 0.3)',
  },
};

export default lightPalette; 