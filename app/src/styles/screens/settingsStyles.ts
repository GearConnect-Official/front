import { StyleSheet } from 'react-native';
import theme from '../config/theme';

// Color constants extracted from theme for direct use in the component
export const colors = {
  iconPrimary: theme.colors.primary.main,
  iconError: theme.colors.status.error,
  iconChevron: theme.colors.grey[400],
  switchTrackInactive: theme.colors.grey[300],
  switchTrackActive: `${theme.colors.primary.main}80`,
  switchThumbActive: theme.colors.primary.main,
  switchThumbInactive: theme.colors.grey[50],
  statusBarBackground: theme.colors.background.paper,
  activityIndicator: theme.colors.primary.main,
  textPrimary: theme.colors.text.primary,
};

export default StyleSheet.create({
  container: {
    ...theme.common.container,
    backgroundColor: theme.colors.background.paper,
  },
  header: {
    ...theme.common.spaceBetween,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
    ...theme.shadows.apply({}, 'xs'),
  },
  backButton: {
    padding: theme.spacing.xs,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    ...theme.typography.h4,
    color: theme.colors.text.primary,
  },
  placeholderRight: {
    width: 40,
    height: 40,
    borderRadius: theme.borders.radius.round / 2,
  },
  scrollView: {
    flex: 1,
  },
  sectionContainer: {
    marginBottom: theme.spacing.sm,
  },
  sectionContent: {
    marginHorizontal: 0,
  },
  sectionTitle: {
    ...theme.typography.subtitle1,
    color: theme.colors.primary.main,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    paddingLeft: theme.spacing.md,
  },
  settingsItem: {
    ...theme.common.spaceBetween,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.background.input,
    ...theme.borders.apply({}, { radius: 'md' }),
    marginBottom: theme.spacing.xs,
    marginHorizontal: theme.spacing.md,
    ...theme.shadows.apply({}, 'xs'),
  },
  settingsItemLeft: {
    ...theme.common.row,
    flex: 1,
  },
  settingsItemRight: {
    ...theme.common.centerContent,
  },
  iconContainer: {
    width: 40,
    height: 40,
    ...theme.common.centerContent,
    backgroundColor: theme.colors.background.paper,
    ...theme.borders.apply({}, { radius: 'sm' }),
    marginRight: theme.spacing.sm,
  },
  destructiveIconContainer: {
    backgroundColor: `${theme.colors.status.error}15`,
  },
  settingsItemTextContainer: {
    flex: 1,
  },
  settingsItemTitle: {
    ...theme.typography.subtitle1,
    color: theme.colors.text.primary,
  },
  destructiveText: {
    color: theme.colors.status.error,
  },
  settingsItemSubtitle: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xxs,
  },
  settingsItemValue: {
    ...theme.typography.body2,
    color: theme.colors.text.secondary,
    marginRight: theme.spacing.xs,
  },
  separator: {
    height: 1,
    backgroundColor: theme.colors.border.light,
    marginVertical: theme.spacing.xs,
    marginHorizontal: theme.spacing.md,
  },
  loadingContainer: {
    flex: 1,
    ...theme.common.centerContent,
    padding: theme.spacing.lg,
  },
  loadingText: {
    ...theme.typography.body2,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
  bottomSpace: {
    height: theme.spacing.xxxl,
  },
});
