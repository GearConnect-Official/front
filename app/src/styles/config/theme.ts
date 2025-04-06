/**
 * Configuration du thème principal de l'application
 * Ce fichier centralise toutes les configurations de style
 */

import colors from './colors';
import typography from './typography';
import spacing from './spacing';
import shadows from './shadows';
import borders from './borders';
import { StyleSheet } from 'react-native';

// Interfaces pour les styles communs réutilisables
export interface CommonStyles {
  container: object;
  centerContent: object;
  row: object;
  spaceBetween: object;
  card: object;
  input: object;
  button: object;
}

// Styles communs réutilisables dans toute l'application
const common = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  spaceBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  
  card: {
    ...borders.apply({}, { preset: 'card' }),
    ...shadows.apply({}, 'sm'),
    backgroundColor: colors.background.paper,
    padding: spacing.md,
  },
  
  input: {
    height: spacing.height.input,
    backgroundColor: colors.background.input,
    ...borders.apply({}, { preset: 'input' }),
    paddingHorizontal: spacing.padding.input,
  },
  
  button: {
    height: spacing.height.button,
    backgroundColor: colors.primary.main,
    ...borders.apply({}, { preset: 'button' }),
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.padding.button,
  },
});

// Export du thème complet
const theme = {
  colors,
  typography,
  spacing,
  shadows,
  borders,
  common,
  // Utilitaires pour les ombres communes
  getShadow: (level: 'sm' | 'md' | 'lg') => {
    return shadows[level];
  }
};

export default theme; 