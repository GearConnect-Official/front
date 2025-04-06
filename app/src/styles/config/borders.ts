/**
 * Configuration des bordures de l'application
 */

import palette from './colors';
import { ViewStyle } from 'react-native';

interface Border {
  borderWidth: number;
  borderColor: string;
  borderRadius: number;
}

type BorderRadius = {
  none: number;
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  round: number;
};

// Définir le type avant la création de l'objet
type BordersType = {
  none: Border;
  thin: Border;
  medium: Border;
  thick: Border;
  radius: BorderRadius;
  input: Border;
  button: Border;
  card: Border;
  modal: Border;
  apply: (
    style: ViewStyle,
    options: {
      preset?: keyof Omit<BordersType, 'apply' | 'radius'>;
      width?: number;
      color?: string;
      radius?: number | keyof BorderRadius;
    }
  ) => ViewStyle;
};

const createBorder = (
  width: number = 1,
  color: string = palette.border.light,
  radius: number = 0
): Border => ({
  borderWidth: width,
  borderColor: color,
  borderRadius: radius,
});

// Utiliser le type explicite
const borders: BordersType = {
  none: {} as Border,
  
  // Bordures de base
  thin: createBorder(1, palette.border.light),
  medium: createBorder(2, palette.border.medium),
  thick: createBorder(3, palette.border.dark),
  
  // Rayons de bordure
  radius: {
    none: 0,
    xs: 4,
    sm: 6,
    md: 8,
    lg: 12,
    xl: 16,
    round: 1000, // Valeur élevée pour des coins complètement ronds
  },
  
  // Styles prédéfinis
  input: createBorder(1, palette.border.light, 8),
  button: createBorder(0, 'transparent', 8),
  card: createBorder(1, palette.border.light, 8),
  modal: createBorder(1, palette.border.light, 12),
  
  // Applique une bordure à un style
  apply: (
    style: ViewStyle,
    options: {
      preset?: keyof Omit<BordersType, 'apply' | 'radius'>;
      width?: number;
      color?: string;
      radius?: number | keyof BorderRadius;
    }
  ): ViewStyle => {
    const { preset, width, color, radius } = options;
    
    // Style de base
    let result = { ...style };
    
    // Appliquer un preset si spécifié
    if (preset && preset !== 'none') {
      const presetStyle = borders[preset];
      result = { ...result, ...presetStyle };
    }
    
    // Remplacer les propriétés individuelles si spécifiées
    if (width !== undefined) {
      result.borderWidth = width;
    }
    
    if (color !== undefined) {
      result.borderColor = color;
    }
    
    if (radius !== undefined) {
      if (typeof radius === 'number') {
        result.borderRadius = radius;
      } else if (typeof radius === 'string' && radius in borders.radius) {
        result.borderRadius = borders.radius[radius];
      }
    }
    
    return result;
  },
};

export default borders; 