/**
 * Point d'entrée pour le design system
 * Permet d'importer facilement tous les éléments du design system
 */

import defaultTheme from './theme';
import colors from './colors';
import typography from './typography';
import spacing from './spacing';
import shadows from './shadows';
import borders from './borders';
import { lightTheme, darkTheme } from './themes';
import { createTheme } from './utils';

// Export individuel pour plus de flexibilité
export { 
  colors,
  typography,
  spacing,
  shadows,
  borders,
  lightTheme,
  darkTheme,
  createTheme
};

// Export par défaut du thème complet (thème clair par défaut)
export default defaultTheme; 