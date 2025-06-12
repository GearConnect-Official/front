import { StyleSheet } from 'react-native';
import theme from '../config/theme';

const styles = StyleSheet.create({
  captionContainer: {
    ...theme.common.row,
    padding: theme.spacing.md,
    alignItems: 'flex-start',
    backgroundColor: theme.colors.grey[900],
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: theme.borders.radius.round,
    marginRight: theme.spacing.xs + 4,
  },
  captionInput: {
    flex: 1,
    color: theme.colors.common.white,
    ...theme.typography.body1,
    minHeight: 100,
    textAlignVertical: 'top',
  }
});

export default styles; 