import { StyleSheet, Dimensions } from 'react-native';
import theme from '../config/theme';

const SCREEN_WIDTH = Dimensions.get('window').width;

const styles = StyleSheet.create({
  // Container styles
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.paper,
  },
  scrollContainer: {
    flex: 1,
  },
  stepContainer: {
    padding: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
  },

  // Icon and title styles
  iconContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.text.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  stepDescription: {
    fontSize: 16,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: theme.spacing.xl,
  },

  // Input section styles
  inputSection: {
    marginBottom: theme.spacing.lg,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  charCounter: {
    fontSize: 14,
    color: theme.colors.text.secondary,
  },
  charCounterWarning: {
    color: theme.colors.status.warning,
  },

  // Input styles
  titleInput: {
    backgroundColor: theme.colors.background.input,
    borderColor: theme.colors.border.light,
    borderWidth: 1,
    borderRadius: theme.borders.radius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text.primary,
    minHeight: 56,
  },
  descriptionInput: {
    backgroundColor: theme.colors.background.input,
    borderColor: theme.colors.border.light,
    borderWidth: 1,
    borderRadius: theme.borders.radius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    fontSize: 16,
    color: theme.colors.text.primary,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: theme.colors.status.error,
    borderWidth: 2,
  },

  // Error styles
  errorContainer: {
    backgroundColor: theme.colors.status.errorLight,
    borderRadius: theme.borders.radius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  errorText: {
    color: theme.colors.status.error,
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },

  // Tags styles
  currentTagsSection: {
    marginBottom: theme.spacing.lg,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: theme.spacing.sm,
  },
  tagItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.grey[100],
    borderRadius: theme.borders.radius.lg,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    marginRight: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
    borderWidth: 1,
    borderColor: theme.colors.primary.main,
  },
  tagText: {
    color: theme.colors.primary.main,
    fontSize: 14,
    fontWeight: '600',
    marginRight: theme.spacing.xs,
  },
  removeTagButton: {
    padding: 2,
  },

  // Tag input styles
  tagInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  tagInput: {
    flex: 1,
    backgroundColor: theme.colors.background.input,
    borderColor: theme.colors.border.light,
    borderWidth: 1,
    borderRadius: theme.borders.radius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    fontSize: 16,
    color: theme.colors.text.primary,
    height: 48,
  },
  addTagButton: {
    backgroundColor: theme.colors.primary.main,
    borderRadius: theme.borders.radius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 48,
  },
  disabledButton: {
    opacity: 0.5,
  },

  // Suggestions styles
  suggestionsSection: {
    marginBottom: theme.spacing.lg,
  },
  suggestionsList: {
    flexDirection: 'row',
    paddingVertical: theme.spacing.sm,
  },
  suggestionTag: {
    backgroundColor: theme.colors.grey[100],
    borderRadius: theme.borders.radius.lg,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    marginRight: theme.spacing.xs,
  },
  suggestionTagText: {
    color: theme.colors.primary.main,
    fontSize: 14,
    fontWeight: '500',
  },

  // Tips styles
  tipsContainer: {
    backgroundColor: theme.colors.grey[50],
    borderRadius: theme.borders.radius.md,
    padding: theme.spacing.md,
    marginTop: theme.spacing.lg,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  tipText: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    marginLeft: theme.spacing.sm,
    flex: 1,
  },

  // Preview styles
  previewContainer: {
    backgroundColor: theme.colors.background.paper,
    borderRadius: theme.borders.radius.lg,
    marginBottom: theme.spacing.lg,
    overflow: 'hidden',
    ...theme.shadows.medium,
  },
  previewImageContainer: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: theme.colors.grey[100],
  },
  previewImage: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: theme.borders.radius.lg,
    borderTopRightRadius: theme.borders.radius.lg,
  },
  previewUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  previewUserAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: theme.spacing.sm,
  },
  previewUsername: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.primary,
    flex: 1,
  },
  previewTime: {
    fontSize: 12,
    color: theme.colors.text.secondary,
  },
  previewContent: {
    padding: theme.spacing.md,
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  previewDescription: {
    fontSize: 16,
    color: theme.colors.text.primary,
    lineHeight: 22,
    marginBottom: theme.spacing.sm,
  },
  previewTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: theme.spacing.xs,
  },
  previewTag: {
    color: theme.colors.primary.main,
    fontSize: 14,
    fontWeight: '500',
    marginRight: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  previewActions: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
  },
  previewActionButton: {
    marginRight: theme.spacing.lg,
  },

  // Summary styles
  summaryContainer: {
    backgroundColor: theme.colors.grey[50],
    borderRadius: theme.borders.radius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  summaryText: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    marginLeft: theme.spacing.sm,
    flex: 1,
  },

  // Loading styles
  loadingContainer: {
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  loadingText: {
    fontSize: 16,
    color: theme.colors.text.primary,
    marginTop: theme.spacing.sm,
    fontWeight: '500',
  },
});

export default styles; 