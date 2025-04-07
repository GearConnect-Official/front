import { StyleSheet } from 'react-native';
import theme from './config';

const styles = StyleSheet.create({
  container: {
    ...theme.common.container,
    backgroundColor: theme.colors.background.paper,
    width: "100%",
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xs,
    paddingBottom: theme.spacing.xxxl,
    alignItems: "center",
  },
  backButton: {
    alignSelf: "flex-start",
    width: 54,
    height: 54,
    borderRadius: theme.borders.radius.round,
    justifyContent: "center",
    paddingLeft: theme.spacing.xs,
  },
  logo: {
    width: 72,
    height: 72,
    marginTop: theme.spacing.lg + 2,
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.text.primary,
    textAlign: "center",
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.xxxl + 9,
  },
  input: {
    width: "100%",
    height: theme.spacing.height.input,
    backgroundColor: theme.colors.background.input,
    ...theme.borders.apply({}, { preset: 'input' }),
    paddingHorizontal: theme.spacing.padding.input,
    marginBottom: theme.spacing.sm + 3,
    fontSize: 15,
    color: theme.colors.text.secondary,
  },
  passwordContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.background.input,
    ...theme.borders.apply({}, { preset: 'input' }),
    marginBottom: theme.spacing.xxs + 1,
  },
  passwordInput: {
    flex: 1,
    height: theme.spacing.height.input,
    paddingHorizontal: theme.spacing.padding.input,
    fontSize: 15,
    color: theme.colors.text.secondary,
  },
  eyeIcon: {
    padding: theme.spacing.xs + 2,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: theme.spacing.xxxl + 20,
  },
  forgotPasswordText: {
    color: theme.colors.grey[600],
    fontSize: 14,
    fontWeight: "600",
  },
  loginButton: {
    width: "100%",
    height: theme.spacing.height.button,
    backgroundColor: theme.colors.primary.main,
    ...theme.borders.apply({}, { preset: 'button' }),
    justifyContent: "center",
    alignItems: "center",
    marginBottom: theme.spacing.xl + 6,
  },
  loginButtonText: {
    ...theme.typography.button,
    color: theme.colors.common.white,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: theme.spacing.lg + 2,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.grey[100],
  },
  dividerText: {
    color: theme.colors.grey[600],
    fontSize: 14,
    fontWeight: "600",
    marginHorizontal: theme.spacing.xs + 4,
  },
  socialButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: theme.spacing.lg,
  },
  socialButton: {
    width: 105,
    height: theme.spacing.height.button,
    ...theme.borders.apply({}, { preset: 'thin', radius: 'md' }),
    justifyContent: "center",
    alignItems: "center",
  },
  registerContainer: {
    marginTop: theme.spacing.xxxl + 35,
  },
  registerText: {
    ...theme.typography.body1,
    fontWeight: "500",
    textAlign: "center",
  },
  registerLink: {
    color: theme.colors.secondary.main,
    fontWeight: "700",
  },
});

export default styles; 