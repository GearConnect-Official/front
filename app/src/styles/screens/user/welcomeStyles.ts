import { StyleSheet } from "react-native";
import theme from "../../config/theme";

const styles = StyleSheet.create({
  container: {
    ...theme.common.container,
    backgroundColor: theme.colors.background.paper,
    ...theme.common.centerContent,
  },
  logo: {
    width: 171,
    height: 171,
    marginBottom: theme.spacing.xxxl + 2,
  },
  loginButton: {
    backgroundColor: theme.colors.primary.main,
    width: 330,
    height: theme.spacing.height.button,
    borderRadius: theme.borders.radius.md,
    ...theme.common.centerContent,
    marginBottom: theme.spacing.sm + 3,
  },
  loginText: {
    ...theme.typography.button,
    color: theme.colors.common.white,
  },
  registerButton: {
    backgroundColor: theme.colors.background.paper,
    borderColor: theme.colors.primary.main,
    borderWidth: 1,
    width: 330,
    height: theme.spacing.height.button,
    borderRadius: theme.borders.radius.md,
    ...theme.common.centerContent,
  },
  registerText: {
    ...theme.typography.button,
    color: theme.colors.primary.main,
  },
  guestText: {
    ...theme.typography.subtitle2,
    color: theme.colors.secondary.main,
    marginTop: theme.spacing.lg,
  },
});

export default styles;
