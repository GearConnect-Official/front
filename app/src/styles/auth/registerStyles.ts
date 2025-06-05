import { StyleSheet } from "react-native";
import theme from "../config/theme";

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.paper,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: theme.spacing.lg,
    paddingTop: 60,
    paddingBottom: theme.spacing.xl + 6,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 44,
    justifyContent: 'center',
    alignItems: 'flex-start',
    zIndex: 10,
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  title: {
    ...theme.typography.h2,
    color: theme.colors.text.primary,
    textAlign: "center",
    marginTop: theme.spacing.xxxl + 10,
    marginBottom: theme.spacing.xl + 6,
  },
  inputContainer: {
    width: "100%",
    marginBottom: theme.spacing.sm + 3,
  },
  input: {
    width: "100%",
    height: theme.spacing.height.input,
    backgroundColor: theme.colors.background.input,
    ...theme.borders.apply({}, { preset: 'input' }),
    paddingHorizontal: theme.spacing.sm + 3,
    ...theme.typography.body1,
  },
  inputError: {
    borderColor: theme.colors.status.error,
  },
  errorText: {
    ...theme.typography.error,
    marginTop: theme.spacing.xxs + 1,
    marginLeft: theme.spacing.xxs + 1,
  },
  registerButton: {
    backgroundColor: theme.colors.primary.main,
    width: "100%",
    height: theme.spacing.height.button,
    borderRadius: theme.borders.radius.md,
    ...theme.common.centerContent,
    marginVertical: theme.spacing.lg,
  },
  registerButtonText: {
    ...theme.typography.button,
    color: theme.colors.common.white,
  },
  orText: {
    ...theme.typography.subtitle2,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs + 2,
  },
  socialButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
  },
  socialButton: {
    width: 56,
    height: 56,
    ...theme.borders.apply({}, { 
      width: 1, 
      color: theme.colors.border.light, 
      radius: 'md' 
    }),
    ...theme.common.centerContent,
  },
  socialIcon: {
    width: 26,
    height: 26,
  },
});

export default styles;
