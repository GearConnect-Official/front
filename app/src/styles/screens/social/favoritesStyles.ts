import { StyleSheet, Dimensions } from 'react-native';
import theme from '../../config/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    ...theme.common.container,
  },
  
  // Header styles
  header: {
    ...theme.common.spaceBetween,
    paddingHorizontal: theme.spacing.md,
    paddingTop: 50,
    paddingBottom: theme.spacing.sm,
    backgroundColor: theme.colors.background.paper,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  
  backButton: {
    padding: theme.spacing.xs,
    borderRadius: 20,
  },
  
  headerTitle: {
    ...theme.typography.h5,
    color: theme.colors.text.primary,
  },
  
  headerSpacer: {
    width: 36, // Same width as back button for centering
  },
  
  // Loading states
  loadingContainer: {
    ...theme.common.centerContent,
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
  },
  
  loadingText: {
    ...theme.typography.body1,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.md,
    textAlign: 'center',
  },
  
  // Error state
  errorContainer: {
    ...theme.common.centerContent,
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
  },
  
  errorText: {
    ...theme.typography.body1,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.md,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  
  reloadButton: {
    backgroundColor: theme.colors.primary.main,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.sm,
    borderRadius: 25,
  },
  
  reloadButtonText: {
    ...theme.typography.subtitle1,
    color: theme.colors.common.white,
  },
  
  // Empty state
  emptyStateContainer: {
    ...theme.common.centerContent,
    flex: 1,
    paddingHorizontal: theme.spacing.xxxl,
    paddingVertical: 60,
  },
  
  emptyStateTitle: {
    ...theme.typography.h2,
    color: theme.colors.text.primary,
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.sm,
  },
  
  emptyStateDescription: {
    ...theme.typography.body1,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: theme.spacing.xxl,
  },
  
  goHomeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF5864',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  
  goHomeIcon: {
    marginRight: 8,
  },
  
  goHomeText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Footer loader
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  
  // Post list styles
  postSeparator: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 8,
  },
});

export default styles; 