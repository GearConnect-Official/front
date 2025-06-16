import { StyleSheet } from "react-native";
import theme from "../config/theme";

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    ...theme.common.centerContent,
  },
  container: {
    backgroundColor: theme.colors.background.paper,
    borderRadius: theme.borders.radius.lg,
    padding: theme.spacing.lg,
    width: "80%",
    maxWidth: 300,
    ...theme.shadows.apply({}, 'md'),
  },
  title: {
    ...theme.typography.h5,
    color: theme.colors.text.primary,
    textAlign: "center",
    marginBottom: theme.spacing.lg,
  },
  menuItem: {
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  lastMenuItem: {
    borderBottomWidth: 0,
  },
  menuText: {
    ...theme.typography.body1,
    color: theme.colors.text.primary,
    textAlign: "center",
  },
  logoutButton: {
    backgroundColor: theme.colors.primary.main,
    borderRadius: theme.borders.radius.md,
    paddingVertical: theme.spacing.sm,
    marginTop: theme.spacing.md,
    borderWidth: 2,
    borderColor: theme.colors.common.white,
  },
  logoutText: {
    ...theme.typography.button,
    color: theme.colors.common.white,
    textAlign: "center",
  },
  cancelButton: {
    backgroundColor: theme.colors.grey[200],
    borderRadius: theme.borders.radius.md,
    paddingVertical: theme.spacing.sm,
    marginTop: theme.spacing.xs,
  },
  cancelText: {
    ...theme.typography.button,
    color: theme.colors.text.primary,
    textAlign: "center",
  },
});

export default styles;
