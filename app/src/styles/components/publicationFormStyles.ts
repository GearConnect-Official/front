import { StyleSheet } from 'react-native';
import theme from '../config/theme';

// Character limit
export const MAX_DESCRIPTION_LENGTH = 2200;

// Popular suggested tags
export const SUGGESTED_TAGS = [
  'racing', 'f1', 'circuit', 'karting', 'driving', 'motorsport', 
  'performance', 'mechanics', 'car', 'speed', 'competition'
];

export const publicationFormStyles = StyleSheet.create({
  // Input sections
  inputSection: {
    marginBottom: theme.spacing.lg,
  },
  inputLabel: {
    color: theme.colors.text.primary,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: theme.spacing.xs,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  charCounter: {
    color: theme.colors.text.secondary,
    fontSize: 14,
  },
  charCounterWarning: {
    color: theme.colors.status.error,
  },
  helperText: {
    color: theme.colors.text.secondary,
    fontSize: 12,
    marginTop: theme.spacing.xxs + 2,
  },

  // Suggestions
  suggestionsContainer: {
    marginTop: theme.spacing.md,
  },
  suggestionsTitle: {
    color: theme.colors.text.secondary,
    fontSize: 14,
    marginBottom: theme.spacing.xs,
  },
  suggestionsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  suggestionTag: {
    backgroundColor: theme.colors.grey[100],
    borderRadius: theme.borders.radius.lg,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xxs + 2,
    marginRight: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
  },
  suggestionTagText: {
    color: theme.colors.primary.main,
    fontSize: 14,
  },

  // Buttons
  disabledButton: {
    opacity: 0.5,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.md,
    marginTop: theme.spacing.xs + 2,
  },
  loadingText: {
    color: theme.colors.text.primary,
    marginTop: theme.spacing.xs + 2,
    fontSize: 16,
  },

  // Preview button
  previewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xxs + 2,
    borderRadius: theme.borders.radius.lg,
    backgroundColor: theme.colors.grey[50],
  },
  previewButtonText: {
    color: theme.colors.primary.main,
    fontSize: 14,
    fontWeight: '500',
    marginLeft: theme.spacing.xxs + 2,
  },

  // Preview mode styles
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background.paper,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  previewCloseButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  previewCloseText: {
    color: theme.colors.primary.main,
    fontSize: 14,
    fontWeight: '500',
    marginLeft: theme.spacing.xxs + 2,
  },
  previewContent: {
    padding: theme.spacing.md,
  },
  previewUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  previewPostTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs + 2,
  },
  previewDescription: {
    fontSize: 16,
    color: theme.colors.text.primary,
    lineHeight: 22,
    marginBottom: theme.spacing.md,
  },
  previewTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: theme.spacing.xs + 2,
  },
  previewTag: {
    color: theme.colors.primary.main,
    fontSize: 14,
    marginRight: theme.spacing.xs,
    marginBottom: theme.spacing.xxs + 1,
  },
  previewNoContent: {
    color: theme.colors.text.secondary,
    fontStyle: 'italic',
    marginVertical: theme.spacing.xs + 2,
  },

  // Debug info
  debugInfo: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.7)',
    color: 'white',
    padding: theme.spacing.xxs + 1,
    borderRadius: theme.borders.radius.xs,
    fontSize: 12,
  },
});

// Default export to prevent Expo Router warnings
export { default } from '../../NoRoute'; 