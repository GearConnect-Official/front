/**
 * Palette de couleurs de l'application
 */

const palette = {
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
    default: 'rgba(251, 248, 249, 1)',
    paper: '#FFF',
    input: 'rgba(247, 248, 249, 1)',
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
    light: 'rgba(218, 218, 218, 1)',
    medium: 'rgba(0, 0, 0, 0.1)',
    dark: 'rgba(0, 0, 0, 0.3)',
  },
};

export default palette; 