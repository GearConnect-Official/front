/**
 * Configuration des ombres de l'application
 */

import { Platform, ViewStyle } from 'react-native';

interface Shadow {
  shadowColor: string;
  shadowOffset: {
    width: number;
    height: number;
  };
  shadowOpacity: number;
  shadowRadius: number;
  elevation?: number;
}

interface ShadowsType {
  none: Shadow;
  xs: Shadow;
  sm: Shadow;
  md: Shadow;
  lg: Shadow;
  xl: Shadow;
  card: Shadow;
  modal: Shadow;
  topBar: Shadow;
  bottomBar: Shadow;
  apply: (style: ViewStyle, shadowLevel: keyof Omit<ShadowsType, 'apply'>) => ViewStyle;
}

const createShadow = (
  offsetHeight: number,
  shadowRadius: number,
  shadowOpacity: number,
  elevation: number
): Shadow => ({
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: offsetHeight,
  },
  shadowOpacity,
  shadowRadius,
  ...(Platform.OS === 'android' ? { elevation } : {}),
});

const shadows: ShadowsType = {
  none: {} as Shadow,
  
  // Niveaux d'élévation
  xs: createShadow(1, 2, 0.05, 1),
  sm: createShadow(2, 3, 0.1, 2),
  md: createShadow(2, 4, 0.12, 4),
  lg: createShadow(4, 6, 0.15, 8),
  xl: createShadow(6, 8, 0.2, 12),
  
  // Ombres spécifiques pour les composants
  card: createShadow(2, 4, 0.12, 4),
  modal: createShadow(8, 10, 0.25, 16),
  topBar: createShadow(2, 3, 0.12, 4),
  bottomBar: createShadow(-2, 3, 0.12, 4),
  
  // Applique une ombre à un style
  apply: (style: ViewStyle, shadowLevel: keyof Omit<ShadowsType, 'apply'>): ViewStyle => {
    if (shadowLevel === 'none') return style;
    
    const shadow = shadows[shadowLevel];
    return {
      ...style,
      ...shadow,
    };
  },
};

export default shadows; 