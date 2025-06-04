import { StyleSheet } from 'react-native';
import theme from '../config/theme';

export const errorBoundaryStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.background.paper,
  },
  errorImage: {
    width: 150,
    height: 150,
    marginBottom: theme.spacing.lg,
  },
  title: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    marginBottom: theme.spacing.sm,
    color: theme.colors.text.primary,
  },
  message: {
    fontSize: theme.typography.sizes.md,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
    color: theme.colors.text.secondary,
  },
  button: {
    backgroundColor: theme.colors.primary.main,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borders.radius.md,
  },
  buttonText: {
    color: theme.colors.common.white,
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.semiBold,
  },
}); 