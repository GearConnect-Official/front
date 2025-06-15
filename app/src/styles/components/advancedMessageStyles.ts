import { StyleSheet, Dimensions } from 'react-native';
import theme from '../config/theme';

const { width } = Dimensions.get('window');

/**
 * Styles avancés pour les messages avec effets visuels modernes
 */
export const advancedMessageStyles = StyleSheet.create({
  // === GRADIENTS SIMULÉS AVEC BORDURES ===
  successGradient: {
    backgroundColor: '#4CAF50',
    borderLeftWidth: 4,
    borderLeftColor: '#2E7D32',
    borderRightWidth: 1,
    borderRightColor: '#66BB6A',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.3)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },

  errorGradient: {
    backgroundColor: '#F44336',
    borderLeftWidth: 4,
    borderLeftColor: '#C62828',
    borderRightWidth: 1,
    borderRightColor: '#E57373',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.3)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },

  warningGradient: {
    backgroundColor: '#FF9800',
    borderLeftWidth: 4,
    borderLeftColor: '#E65100',
    borderRightWidth: 1,
    borderRightColor: '#FFB74D',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.3)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },

  infoGradient: {
    backgroundColor: '#2196F3',
    borderLeftWidth: 4,
    borderLeftColor: '#0D47A1',
    borderRightWidth: 1,
    borderRightColor: '#64B5F6',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.3)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },

  // === EFFECTS DE GLASSMORPHISME ===
  glassContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(20px)', // Note: Non supporté sur RN, mais peut être simulé
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 20,
  },

  // === CONTENEURS SPÉCIALISÉS ===
  floatingContainer: {
    position: 'absolute',
    top: 60,
    left: theme.spacing.md,
    right: theme.spacing.md,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 25,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },

  pulsingContainer: {
    shadowColor: 'rgba(255, 255, 255, 0.8)',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 15,
  },

  // === ICÔNES AMÉLIORÉES ===
  iconContainerWithRing: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },

  iconContainerSuccess: {
    borderColor: 'rgba(76, 175, 80, 0.6)',
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    shadowColor: '#4CAF50',
  },

  iconContainerError: {
    borderColor: 'rgba(244, 67, 54, 0.6)',
    backgroundColor: 'rgba(244, 67, 54, 0.2)',
    shadowColor: '#F44336',
  },

  iconContainerWarning: {
    borderColor: 'rgba(255, 152, 0, 0.6)',
    backgroundColor: 'rgba(255, 152, 0, 0.2)',
    shadowColor: '#FF9800',
  },

  iconContainerInfo: {
    borderColor: 'rgba(33, 150, 243, 0.6)',
    backgroundColor: 'rgba(33, 150, 243, 0.2)',
    shadowColor: '#2196F3',
  },

  // === TEXTE AVEC EFFETS ===
  textWithGlow: {
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },

  titleWithShadow: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    letterSpacing: 0.5,
  },

  // === BOUTONS AVANCÉS ===
  closeButtonAdvanced: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },

  // === EFFETS DE OVERLAY ===
  overlayPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.1,
    // Pattern simulé avec des bordures
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderStyle: 'solid',
  },

  // === STYLES POUR MODAL AVANCÉE ===
  modalBackdropBlur: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    backdropFilter: 'blur(5px)', // Note: Non supporté sur RN
  },

  modalContainerGlass: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 25,
    },
    shadowOpacity: 0.5,
    shadowRadius: 30,
    elevation: 30,
  },

  modalHeaderGradient: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xl,
    // Simulation d'un gradient avec des bordures
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.8)',
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(255, 255, 255, 0.2)',
    borderRightWidth: 1,
    borderRightColor: 'rgba(255, 255, 255, 0.2)',
  },

  // === ANIMATIONS DE PARTICULES SIMULÉES ===
  particleEffect: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },

  // === RESPONSIVE DESIGN ===
  responsiveContainer: {
    marginHorizontal: width > 768 ? theme.spacing.xl : theme.spacing.md,
    maxWidth: width > 768 ? 500 : undefined,
    alignSelf: width > 768 ? 'center' : 'stretch',
  },

  // === ACCESSIBILITY ===
  accessibleFocus: {
    borderWidth: 2,
    borderColor: theme.colors.primary.main,
    borderStyle: 'solid',
  },

  highContrast: {
    borderWidth: 2,
    borderColor: '#000000',
    backgroundColor: '#FFFFFF',
  },

  // === DARK MODE SUPPORT ===
  darkModeContainer: {
    backgroundColor: 'rgba(18, 18, 18, 0.95)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },

  darkModeText: {
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
  },
});

/**
 * Configurations d'animations avancées
 */
export const AdvancedAnimationConfigs = {
  SPRING_DRAMATIC: {
    tension: 60,
    friction: 4,
  },
  SPRING_GENTLE: {
    tension: 100,
    friction: 8,
  },
  TIMING_SMOOTH: {
    duration: 400,
    useNativeDriver: true,
  },
  TIMING_QUICK: {
    duration: 200,
    useNativeDriver: true,
  },
};

export default advancedMessageStyles; 