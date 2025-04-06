import { StyleSheet } from "react-native";
import theme from './config/theme';

const styles = StyleSheet.create({
  container: {
    ...theme.common.container,
  },

  topBar: {
    ...theme.common.row,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background.paper,
    ...theme.borders.apply({}, { 
      width: 1, 
      color: theme.colors.border.medium, 
      radius: 'none'
    }),
  },
  topBarImg: {
    width: 47,
    height: 47,
    borderRadius: 33.5,
  },
  topBarSearchInput: {
    flex: 1,
    marginHorizontal: theme.spacing.xs + 4,
    height: theme.spacing.height.smallButton,
    ...theme.borders.apply({}, { 
      width: 1, 
      color: theme.colors.border.dark, 
      radius: 'xs'
    }),
    paddingHorizontal: theme.spacing.xs + 4,
  },
  topBarIcons: {
    flexDirection: "row",
    gap: theme.spacing.lg,
  },
  topBarIcon: {
    width: 24,
    height: 24,
  },
  content: {
    flex: 1,
    padding: theme.spacing.md,
  },
  
  // User menu styles
  profileButton: {
    position: 'relative',
  },
  userMenu: {
    position: 'absolute',
    top: 55,
    left: 0,
    backgroundColor: theme.colors.background.paper,
    borderRadius: theme.borders.radius.md,
    ...theme.shadows.apply({}, 'sm'),
    zIndex: 100,
    width: 150,
    ...theme.borders.apply({}, { 
      preset: 'thin', 
      color: theme.colors.border.medium
    }),
  },
  userMenuItem: {
    ...theme.common.row,
    padding: theme.spacing.xs + 4,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  userMenuItemText: {
    marginLeft: theme.spacing.xs + 2,
    fontSize: theme.typography.body1.fontSize,
    color: theme.colors.text.primary,
  },
  
  // Welcome section
  welcomeSection: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background.paper,
    ...theme.borders.apply({}, { 
      width: 1, 
      color: theme.colors.border.medium, 
      radius: 'none'
    }),
  },
  welcomeText: {
    ...theme.typography.h5,
    color: theme.colors.text.primary,
  },
});

export default styles;
