import { StyleSheet } from 'react-native';
import theme from '../../config/theme';

const styles = StyleSheet.create({
  container: {
    ...theme.common.container,
    ...theme.common.centerContent,
    backgroundColor: theme.colors.background.paper,
  },
  text: {
    ...theme.typography.body1,
    marginTop: theme.spacing.xs + 2,
    color: theme.colors.text.primary,
  },
});

export default styles; 