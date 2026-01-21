import { StyleSheet } from 'react-native';
import theme from '../../config/theme';

// Color constants extracted from theme for direct use in the component
export const colors = {
  iconPrimary: theme.colors.primary.main,
  textPrimary: theme.colors.text.primary,
  textSecondary: theme.colors.text.secondary,
  statusBarBackground: theme.colors.background.paper,
  borderLight: theme.colors.border.light,
};

export default StyleSheet.create({
  container: {
    ...theme.common.container,
    backgroundColor: theme.colors.background.paper,
  },
  header: {
    ...theme.common.spaceBetween,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 0,
    height: 56,
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
    flex: 1,
    textAlign: 'center',
  },
  placeholderRight: {
    width: 40,
    height: 40,
    borderRadius: theme.borders.radius.round / 2,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: theme.spacing.md,
  },
  title: {
    ...theme.typography.h3,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  metadata: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.lg,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    ...theme.typography.h5,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
    fontWeight: '600',
  },
  sectionContent: {
    ...theme.typography.body1,
    color: theme.colors.text.primary,
    lineHeight: 24,
  },
  bulletPoint: {
    marginLeft: theme.spacing.md,
    marginTop: theme.spacing.xs,
  },
  bottomSpace: {
    height: theme.spacing.xxxl,
  },
});

