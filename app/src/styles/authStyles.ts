import { StyleSheet } from "react-native";
import theme from "./config";

const authStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollViewContainer: {
    flexGrow: 1,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 100,
    alignItems: "center",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "flex-start",
    zIndex: 1,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
    resizeMode: "contain",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1E232C",
    marginBottom: 32,
    textAlign: "center",
  },
  inputContainer: {
    width: "100%",
    marginBottom: 16,
  },
  input: {
    width: "100%",
    height: 56,
    backgroundColor: "#F7F8F9",
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 15,
    color: "#1E232C",
    borderWidth: 1,
    borderColor: "#E8ECF4",
  },
  inputError: {
    borderColor: "#E53935",
    borderWidth: 1,
  },
  passwordContainer: {
    width: "100%",
    height: 56,
    backgroundColor: "#F7F8F9",
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E8ECF4",
  },
  passwordInput: {
    flex: 1,
    height: "100%",
    paddingHorizontal: 16,
    fontSize: 15,
    color: "#1E232C",
  },
  eyeIcon: {
    width: 40,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 32,
  },
  forgotPasswordText: {
    fontSize: 15,
    color: "#6A707C",
  },
  errorMessage: {
    color: theme.colors.status.error,
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 16,
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
});

export default authStyles;
