import { StyleSheet } from "react-native";
import theme from "./config";

const styles = StyleSheet.create({
  container: {
    ...theme.common.container,
    backgroundColor: theme.colors.background.paper,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: 50,
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
  logoContainer: {
    marginTop: theme.spacing.lg + 2,
    alignItems: "center",
  },
  logo: {
    width: 72,
    height: 72,
  },
  title: {
    color: theme.colors.text.primary,
    ...theme.typography.h1,
    marginTop: theme.spacing.xxxl,
    textAlign: "center",
  },
  subtitle: {
    color: theme.colors.text.secondary,
    ...theme.typography.body1,
    marginTop: theme.spacing.xs + 2,
    textAlign: "center",
  },
  input: {
    backgroundColor: theme.colors.background.input,
    borderColor: theme.colors.border.light,
    ...theme.borders.apply({}, { preset: 'input' }),
    marginTop: theme.spacing.xxxl + 9,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md + 3,
    width: "100%",
    color: theme.colors.text.secondary,
  },
  sendCodeButton: {
    backgroundColor: theme.colors.primary.main,
    borderRadius: theme.borders.radius.md,
    marginTop: theme.spacing.xl + 6,
    paddingVertical: theme.spacing.md + 3,
    width: "100%",
    height: 56,
    justifyContent: "center",
    alignItems: "center",
  },
  sendCodeText: {
    ...theme.typography.button,
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: "600",
  },
  rememberPasswordContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: theme.spacing.multiply(20),
  },
  rememberPasswordText: {
    ...theme.typography.body1,
    fontWeight: "500",
  },
  loginText: {
    ...theme.typography.body1,
    fontWeight: "700",
    color: theme.colors.secondary.main,
  },
});

export default styles;
