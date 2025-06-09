import { StyleSheet } from 'react-native';
import theme from '../config/theme';

export const feedbackMessageStyles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 40,
    left: theme.spacing.lg,
    right: theme.spacing.lg,
    padding: theme.spacing.sm,
    borderRadius: theme.borders.radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...theme.shadows.md,
    zIndex: 1000,
  },
  errorContainer: {
    backgroundColor: theme.colors.status.error,
  },
  warningContainer: {
    backgroundColor: theme.colors.status.warning,
  },
  successContainer: {
    backgroundColor: theme.colors.status.success,
  },
  infoContainer: {
    backgroundColor: theme.colors.primary.main,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: theme.spacing.sm,
  },
  message: {
    color: theme.colors.common.white,
    flex: 1,
    fontSize: theme.typography.sizes.sm,
  },
  closeButton: {
    padding: theme.spacing.xs,
  },
}); 