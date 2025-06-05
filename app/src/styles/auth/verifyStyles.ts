import { StyleSheet } from 'react-native';
import theme from '../config/theme';

const styles = StyleSheet.create({
  container: {
    ...theme.common.container,
    ...theme.common.centerContent,
    backgroundColor: theme.colors.background.paper,
    paddingHorizontal: theme.spacing.lg,
  },
  title: {
    ...theme.typography.h2,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  },
  subtitle: {
    ...theme.typography.body1,
    textAlign: 'center',
    marginBottom: theme.spacing.xl + 6,
    color: theme.colors.text.secondary,
  },
  loader: {
    marginTop: theme.spacing.lg,
  },
});

export default styles; 