import { StyleSheet } from 'react-native';
import theme from '../config/theme';

const styles = StyleSheet.create({
  // Icon button styles
  iconButtonBase: {
    ...theme.common.centerContent,
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  iconButtonDisabled: {
    ...theme.common.centerContent,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.grey[200],
  },
  iconButtonFollowing: {
    ...theme.common.centerContent,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.grey[300],
  },
  iconButtonNotFollowing: {
    ...theme.common.centerContent,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.primary.main,
  },

  // Text button styles
  textButtonBase: {
    ...theme.common.centerContent,
    flex: 1,
    paddingVertical: theme.spacing.xs + 2,
    borderRadius: theme.borders.radius.xs,
  },
  textButtonDisabled: {
    ...theme.common.centerContent,
    flex: 1,
    paddingVertical: theme.spacing.xs + 2,
    borderRadius: theme.borders.radius.xs,
    backgroundColor: theme.colors.grey[200],
  },
  textButtonFollowing: {
    ...theme.common.centerContent,
    flex: 1,
    paddingVertical: theme.spacing.xs + 2,
    borderRadius: theme.borders.radius.xs,
    backgroundColor: theme.colors.grey[300],
  },
  textButtonNotFollowing: {
    ...theme.common.centerContent,
    flex: 1,
    paddingVertical: theme.spacing.xs + 2,
    borderRadius: theme.borders.radius.xs,
    backgroundColor: theme.colors.primary.main,
  },

  // Text styles
  textBase: {
    ...theme.typography.body2,
    fontWeight: theme.typography.weights.semiBold,
  },
  textDisabled: {
    ...theme.typography.body2,
    fontWeight: theme.typography.weights.semiBold,
    color: theme.colors.text.disabled,
  },
  textFollowing: {
    ...theme.typography.body2,
    fontWeight: theme.typography.weights.semiBold,
    color: theme.colors.text.primary,
  },
  textNotFollowing: {
    ...theme.typography.body2,
    fontWeight: theme.typography.weights.semiBold,
    color: theme.colors.common.white,
  },
});

export default styles; 