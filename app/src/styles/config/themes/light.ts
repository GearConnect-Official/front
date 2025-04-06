/**
 * Configuration du thème clair de l'application (par défaut)
 */

import defaultTheme from '../theme';
import palette from './lightPalette';

// Utilisation des couleurs du thème clair
const lightTheme = {
  ...defaultTheme,
  colors: palette,
};

export default lightTheme; 