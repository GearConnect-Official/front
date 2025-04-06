/**
 * Configuration des espacements de l'application
 */

const spacing = {
  // Espacements de base
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 48,
  
  // Espacements spécifiques
  padding: {
    input: 20,
    button: 16,
    card: 16,
    screen: 16,
    modal: 24,
  },
  
  // Hauteurs standards
  height: {
    input: 56,
    button: 56,
    smallButton: 40,
    toolbar: 60,
    tabBar: 64,
  },
  
  // Fonction utilitaire pour calculer des espacements
  multiply: (factor: number): number => {
    return 8 * factor; // Base de 8px pour le design system
  },
};

export default spacing; 