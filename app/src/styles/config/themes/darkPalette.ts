/**
 * Palette de couleurs du thème sombre
 */

const darkPalette = {
  // Couleurs primaires
  primary: {
    main: '#F44336', // Rouge vif pour contraste sur fond sombre
    light: '#FF7961', // Rouge clair
    dark: '#BA000D', // Rouge foncé
  },
  
  // Couleurs secondaires
  secondary: {
    main: '#EF5350', // Rouge secondaire
    light: '#FF867C', // Rouge clair secondaire
    dark: '#B61827', // Rouge foncé secondaire
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
    secondary: '#FFCDD2', // Légèrement rouge
    disabled: '#757575',
    hint: '#9E9E9E',
  },
  
  // Couleurs de fond
  background: {
    default: '#1F1212', // Fond sombre avec teinte rouge
    paper: '#2C1A1A', // Papier sombre avec teinte rouge
    input: '#2C1A1A', // Entrées sombres avec teinte rouge
  },
  
  // Couleurs d'état
  status: {
    error: '#FF5252',
    warning: '#FFB74D',
    info: '#FF8A80', // Rouge clair pour l'info
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
    light: 'rgba(244, 67, 54, 0.2)', // Bordure rouge transparente
    medium: 'rgba(244, 67, 54, 0.35)',
    dark: 'rgba(244, 67, 54, 0.5)',
  },
};

export default darkPalette; 