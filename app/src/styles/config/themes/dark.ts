/**
 * Configuration du thème sombre de l'application
 */

import { deepMerge } from '../utils';
import defaultTheme from '../theme';
import palette from './darkPalette';

// Surcharge du thème par défaut avec les couleurs du thème sombre
const darkTheme = deepMerge(defaultTheme, {
  colors: palette,
});

export default darkTheme; 