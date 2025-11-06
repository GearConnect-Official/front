import { StyleSheet, Dimensions } from 'react-native';
import theme from '../config/theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Récupération des couleurs depuis le thème
const colors = {
  primary: theme.colors.primary.main,
  background: theme.colors.background.default,
  cardBackground: theme.colors.background.paper,
  textPrimary: theme.colors.text.primary,
  textSecondary: theme.colors.text.secondary,
  border: theme.colors.border.light,
  shadow: theme.colors.common.black,
  success: theme.colors.status.success,
  overlay: 'rgba(0, 0, 0, 0.5)',
  ripple: 'rgba(0, 0, 0, 0.1)',
};

export default StyleSheet.create({
  // Main container
  container: {
    ...theme.common.container,
  },

  // Header styles with gradient - FIXED: Removed extra spacing
  headerContainer: {
    backgroundColor: colors.background,
    paddingTop: 0, // Changed from 50 to 0
    paddingBottom: 0,
    ...theme.shadows.apply({}, 'sm'),
    zIndex: 1000,
  },

  headerGradient: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm + 3,
    paddingTop: theme.spacing.lg, // Added specific top padding
    ...theme.common.spaceBetween,
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    ...theme.common.centerContent,
    ...theme.shadows.apply({}, 'xs'),
  },

  headerTitle: {
    ...theme.typography.h2,
    color: colors.textPrimary,
    textAlign: 'center',
    flex: 1,
    marginHorizontal: theme.spacing.lg,
  },

  headerActions: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    ...theme.common.centerContent,
  },

  // Animated scroll view
  scrollView: {
    flex: 1,
    backgroundColor: colors.background,
  },

  scrollContent: {
    paddingBottom: theme.spacing.xl,
  },

  // Section styles with animations
  sectionContainer: {
    marginHorizontal: theme.spacing.md,
    marginVertical: theme.spacing.xs,
    backgroundColor: colors.cardBackground,
    borderRadius: theme.borders.radius.md,
    overflow: 'hidden',
    ...theme.shadows.apply({}, 'sm'),
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  sectionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    flex: 1,
  },

  sectionBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 24,
    alignItems: 'center',
  },

  sectionBadgeText: {
    color: colors.background,
    fontSize: 12,
    fontWeight: '600',
  },

  // Preference item styles
  preferenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.background,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },

  preferenceItemLast: {
    borderBottomWidth: 0,
  },

  preferenceIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    backgroundColor: colors.cardBackground,
  },

  preferenceContent: {
    flex: 1,
  },

  preferenceTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textPrimary,
    marginBottom: 2,
  },

  preferenceSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 18,
  },

  preferenceValue: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },

  preferenceRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // Switch styles with animation
  switchContainer: {
    transform: [{ scale: 1.1 }],
  },

  // IMPROVED: Enhanced slider styles
  sliderContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: colors.cardBackground,
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },

  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },

  sliderLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textPrimary,
  },

  sliderValueDisplay: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    minWidth: 50,
    alignItems: 'center',
  },

  sliderValueText: {
    color: colors.background,
    fontSize: 14,
    fontWeight: '600',
  },

  sliderTrackContainer: {
    height: 40,
    justifyContent: 'center',
    marginBottom: 10,
  },

  sliderTrack: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    position: 'relative',
  },

  sliderProgress: {
    height: 8,
    backgroundColor: colors.primary,
    borderRadius: 4,
    position: 'absolute',
    left: 0,
    top: 0,
  },

  sliderThumb: {
    width: 28,
    height: 28,
    backgroundColor: colors.primary,
    borderRadius: 14,
    position: 'absolute',
    top: -10,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
    borderWidth: 3,
    borderColor: colors.background,
  },

  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
  },

  sliderLabelText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },

  // Picker styles
  pickerContainer: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },

  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  pickerText: {
    fontSize: 16,
    color: colors.textPrimary,
    fontWeight: '500',
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalContainer: {
    width: SCREEN_WIDTH * 0.85,
    maxHeight: SCREEN_HEIGHT * 0.7,
    backgroundColor: colors.background,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },

  modalHeader: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.cardBackground,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
    textAlign: 'center',
  },

  modalContent: {
    maxHeight: SCREEN_HEIGHT * 0.5,
  },

  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },

  modalOptionLast: {
    borderBottomWidth: 0,
  },

  modalOptionSelected: {
    backgroundColor: colors.ripple,
  },

  modalOptionText: {
    fontSize: 16,
    color: colors.textPrimary,
    flex: 1,
    marginLeft: 12,
  },

  modalOptionSelectedText: {
    color: colors.primary,
    fontWeight: '600',
  },

  // Color picker styles
  colorPickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },

  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    margin: 4,
    borderWidth: 3,
    borderColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },

  colorOptionSelected: {
    borderColor: colors.primary,
    transform: [{ scale: 1.1 }],
  },

  // Feature preview card
  previewCard: {
    marginHorizontal: 16,
    marginVertical: 8,
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 20,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },

  previewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },

  previewDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },

  // Animated button
  animatedButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },

  animatedButtonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },

  // Progress indicators
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },

  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },

  progressText: {
    marginLeft: 12,
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },

  // Loading states
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },

  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },

  // Ripple effect
  rippleEffect: {
    position: 'absolute',
    backgroundColor: colors.ripple,
    borderRadius: 50,
  },

  // Floating action button
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },

  // Notification styles
  notificationContainer: {
    position: 'absolute',
    top: 100,
    left: 16,
    right: 16,
    backgroundColor: colors.success,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 1000,
  },

  notificationText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 12,
    flex: 1,
  },
});

export { colors }; 