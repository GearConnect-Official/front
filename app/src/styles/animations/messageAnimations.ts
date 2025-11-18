import { Animated, Easing } from 'react-native';

/**
 * Système d'animations centralisé pour les messages et popups
 */
export class MessageAnimations {
  
  /**
   * Animation d'entrée fluide pour les messages de feedback
   */
  static createFeedbackEntryAnimation(
    opacityValue: Animated.Value,
    translateYValue: Animated.Value,
    scaleValue: Animated.Value
  ) {
    return Animated.parallel([
      // Fade in avec courbe ease-out
      Animated.timing(opacityValue, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      // Slide down avec bounce
      Animated.spring(translateYValue, {
        toValue: 0,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
      // Scale avec effet de rebond subtil
      Animated.spring(scaleValue, {
        toValue: 1,
        tension: 120,
        friction: 7,
        useNativeDriver: true,
      }),
    ]);
  }

  /**
   * Animation de sortie fluide pour les messages de feedback
   */
  static createFeedbackExitAnimation(
    opacityValue: Animated.Value,
    translateYValue: Animated.Value,
    scaleValue: Animated.Value
  ) {
    return Animated.parallel([
      // Fade out rapide
      Animated.timing(opacityValue, {
        toValue: 0,
        duration: 300,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      // Slide up
      Animated.timing(translateYValue, {
        toValue: -30,
        duration: 300,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      // Scale down
      Animated.timing(scaleValue, {
        toValue: 0.9,
        duration: 300,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
    ]);
  }

  /**
   * Animation d'entrée dramatique pour les modals de confirmation
   */
  static createModalEntryAnimation(
    opacityValue: Animated.Value,
    scaleValue: Animated.Value,
    backdropOpacity: Animated.Value
  ) {
    return Animated.parallel([
      // Backdrop fade in
      Animated.timing(backdropOpacity, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      // Modal fade in
      Animated.timing(opacityValue, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      // Modal scale avec bounce élégant
      Animated.spring(scaleValue, {
        toValue: 1,
        tension: 80,
        friction: 6,
        useNativeDriver: true,
      }),
    ]);
  }

  /**
   * Animation de sortie pour les modals de confirmation
   */
  static createModalExitAnimation(
    opacityValue: Animated.Value,
    scaleValue: Animated.Value,
    backdropOpacity: Animated.Value
  ) {
    return Animated.parallel([
      // Backdrop fade out
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 250,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
      // Modal fade out
      Animated.timing(opacityValue, {
        toValue: 0,
        duration: 250,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      // Modal scale down
      Animated.timing(scaleValue, {
        toValue: 0.85,
        duration: 250,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
    ]);
  }

  /**
   * Animation de pulsation pour attirer l'attention
   */
  static createPulseAnimation(scaleValue: Animated.Value) {
    return Animated.loop(
      Animated.sequence([
        Animated.timing(scaleValue, {
          toValue: 1.05,
          duration: 1000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(scaleValue, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
  }

  /**
   * Animation de shake pour les erreurs
   */
  static createShakeAnimation(translateXValue: Animated.Value) {
    return Animated.sequence([
      Animated.timing(translateXValue, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(translateXValue, {
        toValue: -10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(translateXValue, {
        toValue: 8,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(translateXValue, {
        toValue: -8,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(translateXValue, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]);
  }

  /**
   * Animation de rebond pour les boutons
   */
  static createButtonPressAnimation(scaleValue: Animated.Value) {
    return Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 0.95,
        duration: 100,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.spring(scaleValue, {
        toValue: 1,
        tension: 300,
        friction: 10,
        useNativeDriver: true,
      }),
    ]);
  }

  /**
   * Animation d'icône avec rotation
   */
  static createIconRotationAnimation(rotateValue: Animated.Value) {
    return Animated.timing(rotateValue, {
      toValue: 1,
      duration: 500,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    });
  }

  /**
   * Valeurs d'interpolation communes
   */
  static interpolateRotation(animatedValue: Animated.Value) {
    return animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });
  }

  static interpolateScale(animatedValue: Animated.Value, from = 0, to = 1) {
    return animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [from, to],
    });
  }

  static interpolateTranslateY(animatedValue: Animated.Value, from = -50, to = 0) {
    return animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [from, to],
    });
  }
}

/**
 * Constantes d'animation
 */
export const AnimationConstants = {
  DURATIONS: {
    FAST: 200,
    NORMAL: 300,
    SLOW: 500,
    FEEDBACK_ENTRY: 400,
    FEEDBACK_EXIT: 300,
    MODAL_ENTRY: 400,
    MODAL_EXIT: 250,
  },
  SPRING_CONFIGS: {
    GENTLE: { tension: 80, friction: 6 },
    BOUNCY: { tension: 120, friction: 7 },
    SNAPPY: { tension: 300, friction: 10 },
  },
  EASING: {
    EASE_OUT: Easing.out(Easing.cubic),
    EASE_IN: Easing.in(Easing.cubic),
    EASE_IN_OUT: Easing.inOut(Easing.cubic),
    BOUNCE: Easing.bounce,
  },
};

export default MessageAnimations; 