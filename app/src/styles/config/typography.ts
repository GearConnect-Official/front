/**
 * Configuration de la typographie de l'application
 */

import { TextStyle } from 'react-native';
import palette from './colors';

type FontWeight = '300' | '400' | '500' | '600' | '700' | '800' | '900';

interface TypographyStyles {
  fontFamily: string;
  fontWeight: FontWeight;
  fontSize: number;
  lineHeight?: number;
  letterSpacing?: number;
  color?: string;
}

const defaultFontFamily = undefined; // Utilisera la police par défaut du système

const createTextStyle = (options: Partial<TypographyStyles>): TextStyle => ({
  fontFamily: options.fontFamily || defaultFontFamily,
  fontWeight: options.fontWeight || '400',
  fontSize: options.fontSize || 14,
  lineHeight: options.lineHeight,
  letterSpacing: options.letterSpacing,
  color: options.color || palette.text.primary,
});

const typography = {
  // Titres
  h1: createTextStyle({
    fontSize: 30,
    fontWeight: '700',
    lineHeight: 38,
  }),
  
  h2: createTextStyle({
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 32,
  }),
  
  h3: createTextStyle({
    fontSize: 22,
    fontWeight: '500',
    lineHeight: 30,
  }),
  
  h4: createTextStyle({
    fontSize: 20,
    fontWeight: '500',
    lineHeight: 28,
  }),
  
  h5: createTextStyle({
    fontSize: 18,
    fontWeight: '500',
    lineHeight: 26,
  }),
  
  h6: createTextStyle({
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
  }),
  
  // Corps de texte
  body1: createTextStyle({
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  }),
  
  body2: createTextStyle({
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 22,
  }),
  
  // Éléments particuliers
  subtitle1: createTextStyle({
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
  }),
  
  subtitle2: createTextStyle({
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 22,
  }),
  
  caption: createTextStyle({
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 18,
    color: palette.text.secondary,
  }),
  
  button: createTextStyle({
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 22,
    letterSpacing: 0.5,
  }),
  
  // Variantes fonctionnelles
  label: createTextStyle({
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  }),
  
  error: createTextStyle({
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 18,
    color: palette.status.error,
  }),
};

export default typography; 