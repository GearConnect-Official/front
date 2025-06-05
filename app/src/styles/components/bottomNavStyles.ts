import { StyleSheet } from 'react-native';
import theme from '../config/theme';

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: theme.colors.background.paper,
    paddingVertical: theme.spacing.xs,
    ...theme.shadows.apply({}, 'bottomBar'),
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.medium,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing.xs,
  },
  tabText: {
    ...theme.typography.caption,
    marginTop: theme.spacing.xxs,
    color: theme.colors.text.secondary,
  },
  activeTabText: {
    color: theme.colors.text.primary,
    fontWeight: "bold",
  },
});

export default styles; 