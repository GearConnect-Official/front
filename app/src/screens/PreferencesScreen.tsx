import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  StatusBar,
  Modal,
  Animated,
  Easing,
  Dimensions,
  PanResponder,
  Vibration,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import styles, { colors } from '../styles/screens/preferencesStyles';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Mock data for preferences - Memoized to prevent re-creation
const LANGUAGE_OPTIONS = [
  { id: 'en', label: 'English', flag: '🇺🇸' },
  { id: 'fr', label: 'Français', flag: '🇫🇷' },
  { id: 'es', label: 'Español', flag: '🇪🇸' },
  { id: 'de', label: 'Deutsch', flag: '🇩🇪' },
] as const;

const THEME_OPTIONS = [
  { id: 'light', label: 'Light Mode', icon: 'sun-o' },
  { id: 'dark', label: 'Dark Mode', icon: 'moon-o' },
  { id: 'auto', label: 'Auto', icon: 'adjust' },
] as const;

const UNIT_OPTIONS = [
  { id: 'metric', label: 'Metric (km/h, kg, °C)', icon: 'globe' },
  { id: 'imperial', label: 'Imperial (mph, lbs, °F)', icon: 'flag-o' },
] as const;

interface PreferenceSectionProps {
  title: string;
  icon: string;
  children: React.ReactNode;
  badge?: string;
}

interface PreferenceItemProps {
  icon: string;
  iconColor?: string;
  title: string;
  subtitle?: string;
  rightElement?: React.ReactNode;
  onPress?: () => void;
  animated?: boolean;
  isLast?: boolean;
}

const PreferenceSection: React.FC<PreferenceSectionProps> = React.memo(({ 
  title, 
  icon, 
  children, 
  badge 
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const isMountedRef = useRef(true);

  useEffect(() => {
    const animation = Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]);

    animation.start((finished) => {
      if (!finished && isMountedRef.current) {
        // Animation was interrupted, reset values
        fadeAnim.setValue(1);
        scaleAnim.setValue(1);
      }
    });

    return () => {
      isMountedRef.current = false;
      animation.stop();
      fadeAnim.stopAnimation();
      scaleAnim.stopAnimation();
    };
  }, []);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return (
    <Animated.View 
      style={[
        styles.sectionContainer,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        }
      ]}
    >
      <View style={styles.sectionHeader}>
        <View style={styles.sectionIcon}>
          <FontAwesome name={icon} size={16} color={colors.background} />
        </View>
        <Text style={styles.sectionTitle}>{title}</Text>
        {badge && (
          <View style={styles.sectionBadge}>
            <Text style={styles.sectionBadgeText}>{badge}</Text>
          </View>
        )}
      </View>
      {children}
    </Animated.View>
  );
});

const PreferenceItem: React.FC<PreferenceItemProps> = React.memo(({
  icon,
  iconColor = colors.primary,
  title,
  subtitle,
  rightElement,
  onPress,
  animated = false,
  isLast = false,
}) => {
  const pressAnim = useRef(new Animated.Value(1)).current;
  const rippleAnim = useRef(new Animated.Value(0)).current;
  const [ripplePosition, setRipplePosition] = useState({ x: 0, y: 0 });
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      pressAnim.stopAnimation();
      rippleAnim.stopAnimation();
    };
  }, []);

  const handlePressIn = useCallback((event: any) => {
    if (!isMountedRef.current) return;
    
    const { locationX, locationY } = event.nativeEvent;
    setRipplePosition({ x: locationX, y: locationY });
    
    const animation = Animated.parallel([
      Animated.timing(pressAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(rippleAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]);

    animation.start();

    if (animated) {
      Vibration.vibrate(10);
    }
  }, [animated, pressAnim, rippleAnim]);

  const handlePressOut = useCallback(() => {
    if (!isMountedRef.current) return;

    const animation = Animated.parallel([
      Animated.timing(pressAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(rippleAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]);

    animation.start();
  }, [pressAnim, rippleAnim]);

  const memoizedRightElement = useMemo(() => rightElement, [rightElement]);

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
    >
      <Animated.View
        style={[
          styles.preferenceItem,
          isLast && styles.preferenceItemLast,
          {
            transform: [{ scale: pressAnim }],
          }
        ]}
      >
        {/* Ripple Effect */}
        <Animated.View
          style={[
            styles.rippleEffect,
            {
              left: ripplePosition.x - 25,
              top: ripplePosition.y - 25,
              width: 50,
              height: 50,
              opacity: rippleAnim,
              transform: [
                {
                  scale: rippleAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 3],
                  }),
                },
              ],
            }
          ]}
        />

        <View style={[styles.preferenceIcon, { backgroundColor: `${iconColor}15` }]}>
          <FontAwesome name={icon} size={20} color={iconColor} />
        </View>

        <View style={styles.preferenceContent}>
          <Text style={styles.preferenceTitle}>{title}</Text>
          {subtitle && (
            <Text style={styles.preferenceSubtitle}>{subtitle}</Text>
          )}
        </View>

        <View style={styles.preferenceRight}>
          {memoizedRightElement}
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
});

const PreferencesScreen: React.FC = () => {
  const router = useRouter();
  
  // Animation refs with proper cleanup
  const headerAnim = useRef(new Animated.Value(-100)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scrollY = useRef(new Animated.Value(0)).current;
  const notificationAnim = useRef(new Animated.Value(-100)).current;
  const isMountedRef = useRef(true);
  
  // ISOLATED: Separate timeout refs for each switch to prevent conflicts
  const notificationsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoSyncTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const offlineModeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hapticFeedbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const generalTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const modalTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const comingSoonTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const notificationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // State for preferences
  const [notifications, setNotifications] = useState(true);
  const [autoSync, setAutoSync] = useState(true);
  const [offlineMode, setOfflineMode] = useState(false);
  const [hapticFeedback, setHapticFeedback] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [selectedTheme, setSelectedTheme] = useState('light');
  const [selectedUnits, setSelectedUnits] = useState('metric');
  const [fontSize, setFontSize] = useState(16);
  
  // Modal states
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [themeModalVisible, setThemeModalVisible] = useState(false);
  const [unitsModalVisible, setUnitsModalVisible] = useState(false);
  
  // Notification state
  const [showNotification, setShowNotification] = useState(false);

  // Cleanup function
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      // Clean up ALL timeout refs
      if (notificationsTimeoutRef.current) {
        clearTimeout(notificationsTimeoutRef.current);
      }
      if (autoSyncTimeoutRef.current) {
        clearTimeout(autoSyncTimeoutRef.current);
      }
      if (offlineModeTimeoutRef.current) {
        clearTimeout(offlineModeTimeoutRef.current);
      }
      if (hapticFeedbackTimeoutRef.current) {
        clearTimeout(hapticFeedbackTimeoutRef.current);
      }
      if (generalTimeoutRef.current) {
        clearTimeout(generalTimeoutRef.current);
      }
      if (modalTimeoutRef.current) {
        clearTimeout(modalTimeoutRef.current);
      }
      if (comingSoonTimeoutRef.current) {
        clearTimeout(comingSoonTimeoutRef.current);
      }
      if (notificationTimeoutRef.current) {
        clearTimeout(notificationTimeoutRef.current);
      }
      // Stop all animations
      headerAnim.stopAnimation();
      fadeAnim.stopAnimation();
      scrollY.stopAnimation();
      notificationAnim.stopAnimation();
    };
  }, []);

  // Initial animations with proper cleanup
  useEffect(() => {
    const animation = Animated.parallel([
      Animated.timing(headerAnim, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.back(1.1)),
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]);

    animation.start((finished) => {
      if (!finished && isMountedRef.current) {
        // Animation was interrupted, set final values
        headerAnim.setValue(0);
        fadeAnim.setValue(1);
      }
    });

    return () => {
      animation.stop();
    };
  }, []);

  // FIXED: Simplified notification system without nested callbacks
  const showSuccessNotification = useCallback((message: string) => {
    if (!isMountedRef.current) return;

    // Clear any existing notification timeout
    if (notificationTimeoutRef.current) {
      clearTimeout(notificationTimeoutRef.current);
    }

    setShowNotification(true);
    
    // Show animation
    Animated.timing(notificationAnim, {
      toValue: 0,
      duration: 300,
      easing: Easing.out(Easing.back(1.1)),
      useNativeDriver: true,
    }).start();

    // Auto-hide after delay
    notificationTimeoutRef.current = setTimeout(() => {
      if (isMountedRef.current) {
        Animated.timing(notificationAnim, {
          toValue: -100,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          if (isMountedRef.current) {
            setShowNotification(false);
          }
        });
      }
    }, 2000);
  }, [notificationAnim]);

  // ISOLATED: Completely separate toggle handlers for each switch
  const handleNotificationsToggle = useCallback((value: boolean) => {
    if (!isMountedRef.current) return;
    
    // Clear only this switch's timeout
    if (notificationsTimeoutRef.current) {
      clearTimeout(notificationsTimeoutRef.current);
    }
    
    setNotifications(value);
    Vibration.vibrate(50);
    
    notificationsTimeoutRef.current = setTimeout(() => {
      if (isMountedRef.current) {
        showSuccessNotification(`Notifications ${value ? 'enabled' : 'disabled'}!`);
      }
    }, 100);
  }, [showSuccessNotification]);

  const handleAutoSyncToggle = useCallback((value: boolean) => {
    if (!isMountedRef.current) return;
    
    // Clear only this switch's timeout
    if (autoSyncTimeoutRef.current) {
      clearTimeout(autoSyncTimeoutRef.current);
    }
    
    setAutoSync(value);
    Vibration.vibrate(50);
    
    autoSyncTimeoutRef.current = setTimeout(() => {
      if (isMountedRef.current) {
        showSuccessNotification(`Auto sync ${value ? 'enabled' : 'disabled'}!`);
      }
    }, 100);
  }, [showSuccessNotification]);

  const handleOfflineModeToggle = useCallback((value: boolean) => {
    if (!isMountedRef.current) return;
    
    // Clear only this switch's timeout
    if (offlineModeTimeoutRef.current) {
      clearTimeout(offlineModeTimeoutRef.current);
    }
    
    setOfflineMode(value);
    Vibration.vibrate(50);
    
    offlineModeTimeoutRef.current = setTimeout(() => {
      if (isMountedRef.current) {
        showSuccessNotification(`Offline mode ${value ? 'enabled' : 'disabled'}!`);
      }
    }, 100);
  }, [showSuccessNotification]);

  const handleHapticFeedbackToggle = useCallback((value: boolean) => {
    if (!isMountedRef.current) return;
    
    // Clear only this switch's timeout
    if (hapticFeedbackTimeoutRef.current) {
      clearTimeout(hapticFeedbackTimeoutRef.current);
    }
    
    setHapticFeedback(value);
    Vibration.vibrate(50);
    
    hapticFeedbackTimeoutRef.current = setTimeout(() => {
      if (isMountedRef.current) {
        showSuccessNotification(`Haptic feedback ${value ? 'enabled' : 'disabled'}!`);
      }
    }, 100);
  }, [showSuccessNotification]);

  const handleSavePress = useCallback(() => {
    if (generalTimeoutRef.current) {
      clearTimeout(generalTimeoutRef.current);
    }
    
    generalTimeoutRef.current = setTimeout(() => {
      if (isMountedRef.current) {
        showSuccessNotification('Preferences saved! ✓');
      }
    }, 100);
  }, [showSuccessNotification]);

  // ISOLATED: Separate AnimatedSwitch components for each switch
  const NotificationsSwitch = useCallback(() => {
    return (
      <View style={styles.switchContainer}>
        <Switch
          value={notifications}
          onValueChange={handleNotificationsToggle}
          trackColor={{ 
            false: colors.switchTrackInactive, 
            true: colors.switchTrackActive 
          }}
          thumbColor={notifications ? colors.switchThumbActive : colors.switchThumbInactive}
          style={{ transform: [{ scale: 1.1 }] }}
        />
      </View>
    );
  }, [notifications, handleNotificationsToggle]);

  const AutoSyncSwitch = useCallback(() => {
    return (
      <View style={styles.switchContainer}>
        <Switch
          value={autoSync}
          onValueChange={handleAutoSyncToggle}
          trackColor={{ 
            false: colors.switchTrackInactive, 
            true: colors.switchTrackActive 
          }}
          thumbColor={autoSync ? colors.switchThumbActive : colors.switchThumbInactive}
          style={{ transform: [{ scale: 1.1 }] }}
        />
      </View>
    );
  }, [autoSync, handleAutoSyncToggle]);

  const OfflineModeSwitch = useCallback(() => {
    return (
      <View style={styles.switchContainer}>
        <Switch
          value={offlineMode}
          onValueChange={handleOfflineModeToggle}
          trackColor={{ 
            false: colors.switchTrackInactive, 
            true: colors.switchTrackActive 
          }}
          thumbColor={offlineMode ? colors.switchThumbActive : colors.switchThumbInactive}
          style={{ transform: [{ scale: 1.1 }] }}
        />
      </View>
    );
  }, [offlineMode, handleOfflineModeToggle]);

  const HapticFeedbackSwitch = useCallback(() => {
    return (
      <View style={styles.switchContainer}>
        <Switch
          value={hapticFeedback}
          onValueChange={handleHapticFeedbackToggle}
          trackColor={{ 
            false: colors.switchTrackInactive, 
            true: colors.switchTrackActive 
          }}
          thumbColor={hapticFeedback ? colors.switchThumbActive : colors.switchThumbInactive}
          style={{ transform: [{ scale: 1.1 }] }}
        />
      </View>
    );
  }, [hapticFeedback, handleHapticFeedbackToggle]);

  // Memoized FontSizeSlider with proper cleanup
  const FontSizeSlider = React.memo(() => {
    const trackWidth = SCREEN_WIDTH - 80;
    const sliderPosition = useRef(new Animated.Value((fontSize - 12) / 8)).current;
    const [isDragging, setIsDragging] = useState(false);
    const trackRef = useRef<View>(null);
    const [trackLayout, setTrackLayout] = useState({ x: 0, width: 0 });
    const sliderMountedRef = useRef(true);
    // ISOLATED: Dedicated timeout ref for slider only
    const sliderNotificationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    
    useEffect(() => {
      return () => {
        sliderMountedRef.current = false;
        if (sliderNotificationTimeoutRef.current) {
          clearTimeout(sliderNotificationTimeoutRef.current);
        }
        sliderPosition.stopAnimation();
      };
    }, []);

    const panResponder = useMemo(() => PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (event) => {
        if (!sliderMountedRef.current) return;
        
        setIsDragging(true);
        Vibration.vibrate(10);
        
        const { pageX } = event.nativeEvent;
        const relativeX = pageX - trackLayout.x;
        const percentage = Math.max(0, Math.min(1, relativeX / trackLayout.width));
        const newSize = 12 + percentage * 8;
        
        setFontSize(Math.round(newSize * 2) / 2);
        
        const animation = Animated.timing(sliderPosition, {
          toValue: percentage,
          duration: 100,
          useNativeDriver: false,
        });

        animation.start();
      },
      onPanResponderMove: (event, gestureState) => {
        if (!sliderMountedRef.current) return;
        
        const { pageX } = event.nativeEvent;
        const relativeX = pageX - trackLayout.x;
        const percentage = Math.max(0, Math.min(1, relativeX / trackLayout.width));
        const newSize = 12 + percentage * 8;
        
        setFontSize(Math.round(newSize * 2) / 2);
        sliderPosition.setValue(percentage);
      },
      onPanResponderRelease: () => {
        if (!sliderMountedRef.current) return;
        
        setIsDragging(false);
        Vibration.vibrate(20);
        
        // Clear only slider's notification timeout
        if (sliderNotificationTimeoutRef.current) {
          clearTimeout(sliderNotificationTimeoutRef.current);
        }
        
        sliderNotificationTimeoutRef.current = setTimeout(() => {
          if (sliderMountedRef.current && isMountedRef.current) {
            showSuccessNotification(`Font size: ${fontSize}px`);
          }
        }, 100);
      },
    }), [trackLayout, sliderPosition, fontSize, showSuccessNotification]);

    const onTrackLayout = useCallback((event: any) => {
      if (!sliderMountedRef.current) return;
      
      const { x, width } = event.nativeEvent.layout;
      event.target.measure((fx: number, fy: number, width: number, height: number, px: number, py: number) => {
        if (sliderMountedRef.current) {
          setTrackLayout({ x: px, width });
        }
      });
    }, []);

    const progressWidth = useMemo(() => sliderPosition.interpolate({
      inputRange: [0, 1],
      outputRange: [0, trackLayout.width || trackWidth],
      extrapolate: 'clamp',
    }), [sliderPosition, trackLayout.width, trackWidth]);

    const thumbPosition = useMemo(() => sliderPosition.interpolate({
      inputRange: [0, 1],
      outputRange: [0, (trackLayout.width || trackWidth) - 28],
      extrapolate: 'clamp',
    }), [sliderPosition, trackLayout.width, trackWidth]);

    const thumbScale = isDragging ? 1.2 : 1;

    return (
      <View style={styles.sliderContainer}>
        <View style={styles.sliderHeader}>
          <Text style={styles.sliderLabel}>Font Size</Text>
          <View style={[
            styles.sliderValueDisplay,
            isDragging && { backgroundColor: colors.secondary }
          ]}>
            <Text style={styles.sliderValueText}>{fontSize}px</Text>
          </View>
        </View>
        
        <View style={styles.sliderTrackContainer} {...panResponder.panHandlers}>
          <View 
            ref={trackRef}
            style={styles.sliderTrack}
            onLayout={onTrackLayout}
          >
            <Animated.View 
              style={[
                styles.sliderProgress,
                { width: progressWidth }
              ]} 
            />
          </View>
          <Animated.View
            style={[
              styles.sliderThumb,
              { 
                left: thumbPosition,
                transform: [{ scale: thumbScale }],
                backgroundColor: isDragging ? colors.secondary : colors.primary,
              }
            ]}
          />
        </View>

        <View style={styles.sliderLabels}>
          <Text style={styles.sliderLabelText}>Small (12px)</Text>
          <Text style={styles.sliderLabelText}>Large (20px)</Text>
        </View>
      </View>
    );
  });

  FontSizeSlider.displayName = 'FontSizeSlider';

  const handleModalSelect = useCallback((title: string, label: string, onSelect: (value: string) => void, value: string, onClose: () => void) => {
    onSelect(value);
    onClose();
    
    // Clear only modal's timeout
    if (modalTimeoutRef.current) {
      clearTimeout(modalTimeoutRef.current);
    }
    
    modalTimeoutRef.current = setTimeout(() => {
      if (isMountedRef.current) {
        showSuccessNotification(`${title}: ${label}`);
      }
    }, 100);
  }, [showSuccessNotification]);

  const OptionModal = React.memo(({ 
    visible, 
    onClose, 
    title, 
    options, 
    selectedValue, 
    onSelect 
  }: {
    visible: boolean;
    onClose: () => void;
    title: string;
    options: readonly any[];
    selectedValue: string;
    onSelect: (value: string) => void;
  }) => (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity style={{ flex: 1 }} onPress={onClose} />
        <Animated.View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
          </View>
          <ScrollView style={styles.modalContent}>
            {options.map((option, index) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.modalOption,
                  index === options.length - 1 && styles.modalOptionLast,
                  selectedValue === option.id && styles.modalOptionSelected,
                ]}
                onPress={() => handleModalSelect(title, option.label, onSelect, option.id, onClose)}
              >
                <Text style={{ fontSize: 20 }}>
                  {option.flag || <FontAwesome name={option.icon} size={20} />}
                </Text>
                <Text style={[
                  styles.modalOptionText,
                  selectedValue === option.id && styles.modalOptionSelectedText,
                ]}>
                  {option.label}
                </Text>
                {selectedValue === option.id && (
                  <FontAwesome name="check" size={16} color={colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>
        <TouchableOpacity style={{ flex: 1 }} onPress={onClose} />
      </View>
    </Modal>
  ));

  OptionModal.displayName = 'OptionModal';

  // Memoized values to prevent unnecessary recalculations
  const currentThemeLabel = useMemo(() => 
    THEME_OPTIONS.find(t => t.id === selectedTheme)?.label, 
    [selectedTheme]
  );

  const currentLanguageData = useMemo(() => 
    LANGUAGE_OPTIONS.find(l => l.id === selectedLanguage), 
    [selectedLanguage]
  );

  const currentUnitsLabel = useMemo(() => 
    selectedUnits === 'metric' ? 'Metric' : 'Imperial', 
    [selectedUnits]
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      {/* Animated Header */}
      <Animated.View 
        style={[
          styles.headerContainer,
          {
            transform: [{ translateY: headerAnim }],
          }
        ]}
      >
        <LinearGradient
          colors={[colors.gradientStart, colors.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <FontAwesome name="arrow-left" size={20} color="white" />
          </TouchableOpacity>
          
          <Text style={[styles.headerTitle, { color: 'white' }]}>Preferences</Text>
          
          <TouchableOpacity
            style={styles.headerActions}
            onPress={handleSavePress}
          >
            <FontAwesome name="check" size={18} color="white" />
          </TouchableOpacity>
        </LinearGradient>
      </Animated.View>

      {/* Success Notification */}
      {showNotification && (
        <Animated.View
          style={[
            styles.notificationContainer,
            {
              transform: [{ translateY: notificationAnim }],
            }
          ]}
        >
          <FontAwesome name="check-circle" size={20} color="white" />
          <Text style={styles.notificationText}>Settings updated successfully!</Text>
        </Animated.View>
      )}

      {/* Main Content */}
      <Animated.ScrollView
        style={[styles.scrollView, { opacity: fadeAnim }]}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
      >
        {/* Appearance Section */}
        <PreferenceSection title="Appearance" icon="paint-brush" badge="2">
          <PreferenceItem
            icon="adjust"
            title="Theme"
            subtitle={`Current: ${currentThemeLabel}`}
            rightElement={
              <TouchableOpacity onPress={() => setThemeModalVisible(true)}>
                <FontAwesome name="chevron-right" size={16} color={colors.textSecondary} />
              </TouchableOpacity>
            }
            onPress={() => setThemeModalVisible(true)}
            animated
            isLast
          />
        </PreferenceSection>

        {/* Font Size Section */}
        <FontSizeSlider />

        {/* Language & Region */}
        <PreferenceSection title="Language & Region" icon="globe" badge="2">
          <PreferenceItem
            icon="language"
            title="Language"
            subtitle="Change app language"
            rightElement={
              <TouchableOpacity onPress={() => setLanguageModalVisible(true)}>
                <Text style={styles.preferenceValue}>
                  {currentLanguageData?.flag} {currentLanguageData?.label}
                </Text>
              </TouchableOpacity>
            }
            onPress={() => setLanguageModalVisible(true)}
            animated
          />

          <PreferenceItem
            icon="calculator"
            title="Units"
            subtitle="Measurement units"
            rightElement={
              <TouchableOpacity onPress={() => setUnitsModalVisible(true)}>
                <Text style={styles.preferenceValue}>
                  {currentUnitsLabel}
                </Text>
              </TouchableOpacity>
            }
            onPress={() => setUnitsModalVisible(true)}
            animated
            isLast
          />
        </PreferenceSection>

        {/* Notifications & Sync */}
        <PreferenceSection title="Notifications & Sync" icon="bell" badge="3">
          <PreferenceItem
            icon="bell"
            iconColor={colors.warning}
            title="Push Notifications"
            subtitle="Receive push notifications"
            rightElement={NotificationsSwitch()}
            animated
          />

          <PreferenceItem
            icon="refresh"
            iconColor={colors.success}
            title="Auto Sync"
            subtitle="Automatically sync data"
            rightElement={AutoSyncSwitch()}
            animated
          />

          <PreferenceItem
            icon="wifi"
            iconColor={colors.accent}
            title="Offline Mode"
            subtitle="Use app without internet"
            rightElement={OfflineModeSwitch()}
            animated
            isLast
          />
        </PreferenceSection>

        {/* Accessibility */}
        <PreferenceSection title="Accessibility" icon="universal-access" badge="1">
          <PreferenceItem
            icon="hand-paper-o"
            iconColor={colors.secondary}
            title="Haptic Feedback"
            subtitle="Feel vibrations on interactions"
            rightElement={HapticFeedbackSwitch()}
            animated
            isLast
          />
        </PreferenceSection>

        {/* Feature Preview */}
        <View style={styles.previewCard}>
          <Text style={styles.previewTitle}>🚀 Coming Soon</Text>
          <Text style={styles.previewDescription}>
            More customization options including performance analytics preferences, 
            racing data sync settings, and personalized racing insights!
          </Text>
          <TouchableOpacity
            style={styles.animatedButton}
            onPress={() => {
              // Clear only coming soon button's timeout
              if (comingSoonTimeoutRef.current) {
                clearTimeout(comingSoonTimeoutRef.current);
              }
              comingSoonTimeoutRef.current = setTimeout(() => {
                if (isMountedRef.current) {
                  showSuccessNotification('Thanks for your interest! 🎉');
                }
              }, 100);
            }}
          >
            <FontAwesome name="star" size={16} color="white" />
            <Text style={styles.animatedButtonText}>Get Notified</Text>
          </TouchableOpacity>
        </View>
      </Animated.ScrollView>

      {/* Modals */}
      <OptionModal
        visible={languageModalVisible}
        onClose={() => setLanguageModalVisible(false)}
        title="Select Language"
        options={LANGUAGE_OPTIONS}
        selectedValue={selectedLanguage}
        onSelect={setSelectedLanguage}
      />

      <OptionModal
        visible={themeModalVisible}
        onClose={() => setThemeModalVisible(false)}
        title="Select Theme"
        options={THEME_OPTIONS}
        selectedValue={selectedTheme}
        onSelect={setSelectedTheme}
      />

      <OptionModal
        visible={unitsModalVisible}
        onClose={() => setUnitsModalVisible(false)}
        title="Select Units"
        options={UNIT_OPTIONS}
        selectedValue={selectedUnits}
        onSelect={setSelectedUnits}
      />
    </SafeAreaView>
  );
};

export default PreferencesScreen; 