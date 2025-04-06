import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 1)",
    width: "100%",
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 30,
    alignItems: "center",
  },
  backButton: {
    alignSelf: "flex-start",
    width: 54,
    height: 54,
    borderRadius: 32,
    justifyContent: "center",
    paddingLeft: 10,
  },
  logo: {
    width: 72,
    height: 72,
    marginTop: 22,
  },
  title: {
    color: "#1E232C",
    fontSize: 30,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 18,
    marginBottom: 57,
  },
  input: {
    width: "100%",
    height: 56,
    backgroundColor: "rgba(247, 248, 249, 1)",
    borderWidth: 1,
    borderColor: "rgba(218, 218, 218, 1)",
    borderRadius: 8,
    paddingHorizontal: 20,
    marginBottom: 15,
    fontSize: 15,
    color: "rgba(131, 145, 161, 1)",
  },
  passwordContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(247, 248, 249, 1)",
    borderWidth: 1,
    borderColor: "rgba(218, 218, 218, 1)",
    borderRadius: 8,
    marginBottom: 5,
  },
  passwordInput: {
    flex: 1,
    height: 56,
    paddingHorizontal: 20,
    fontSize: 15,
    color: "rgba(131, 145, 161, 1)",
  },
  eyeIcon: {
    padding: 10,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 68,
  },
  forgotPasswordText: {
    color: "#6A707C",
    fontSize: 14,
    fontWeight: "600",
  },
  loginButton: {
    width: "100%",
    height: 56,
    backgroundColor: "#1E232C",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  loginButtonText: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "600",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 22,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E8ECF4",
  },
  dividerText: {
    color: "#6A707C",
    fontSize: 14,
    fontWeight: "600",
    marginHorizontal: 12,
  },
  socialButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 20,
  },
  socialButton: {
    width: 105,
    height: 56,
    borderWidth: 1,
    borderColor: "#E8ECF4",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  registerContainer: {
    marginTop: 83,
  },
  registerText: {
    fontSize: 15,
    fontWeight: "500",
    textAlign: "center",
  },
  registerLink: {
    color: "#8B01F4",
    fontWeight: "700",
  },
});

export default styles; 