import { StyleSheet } from 'react-native';
import theme from '../config/theme';

const authStyles = StyleSheet.create({
  container: {
    ...theme.common.container,
  },
  scrollViewContainer: {
    flexGrow: 1,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: theme.spacing.xl,
    paddingTop: 100,
    ...theme.common.centerContent,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: theme.spacing.md,
    width: 40,
    height: 40,
    borderRadius: theme.borders.radius.xs,
    justifyContent: "center",
    alignItems: "flex-start",
    zIndex: 1,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: theme.spacing.lg,
    resizeMode: "contain",
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xxl,
    textAlign: "center",
  },
  inputContainer: {
    width: "100%",
    marginBottom: theme.spacing.md,
  },
  input: {
    ...(theme.common.input as any),
    ...(theme.typography.body1 as any),
    color: theme.colors.text.primary,
  },
  inputError: {
    borderColor: theme.colors.status.error,
    borderWidth: 1,
  },
  passwordContainer: {
    width: "100%",
    height: theme.spacing.height.input,
    backgroundColor: theme.colors.background.input,
    borderRadius: theme.borders.radius.xs,
    ...theme.common.row,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
  },
  passwordInput: {
    flex: 1,
    height: "100%",
    paddingHorizontal: theme.spacing.md,
    ...theme.typography.body1,
    color: theme.colors.text.primary,
  },
  eyeIcon: {
    width: 40,
    height: "100%",
    ...theme.common.centerContent,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: theme.spacing.xxl,
  },
  forgotPasswordText: {
    ...theme.typography.body1,
    color: theme.colors.text.secondary,
  },
  errorMessage: {
    color: theme.colors.status.error,
    ...theme.typography.subtitle1,
    textAlign: "center",
    marginBottom: theme.spacing.md,
    width: "100%",
  },
  deletedAccountError: {
    color: "#E53935",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
    marginTop: 10,
    width: "100%",
  },
  fieldError: {
    color: "#E53935",
    fontSize: 14,
    marginTop: 5,
    marginBottom: 10,
  },
  loginButton: {
    width: "100%",
    height: 56,
    backgroundColor: theme.colors.primary.main,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 32,
  },
  loginButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 32,
    width: "100%",
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E8ECF4",
  },
  dividerText: {
    marginHorizontal: 16,
    color: "#6A707C",
    fontSize: 14,
  },
  socialButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 32,
  },
  socialButton: {
    width: "30%",
    height: 56,
    backgroundColor: "#F7F8F9",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E8ECF4",
  },
  registerContainer: {
    marginTop: "auto",
    marginBottom: 32,
  },
  registerText: {
    fontSize: 15,
    color: "#1E232C",
    textAlign: "center",
  },
  registerLink: {
    color: theme.colors.primary.main,
    fontWeight: "600",
  },
  placeholderColor: {
    color: "rgba(131, 145, 161, 1)",
  },
  errorContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    width: "100%",
  },
  generalError: {
    color: "#E53935",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
    width: "100%",
  },
}) as any;

export default authStyles;
