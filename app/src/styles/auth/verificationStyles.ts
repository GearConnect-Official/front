import { StyleSheet } from "react-native";
import theme from "../config/theme";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 100,
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
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1E232C",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#6A707C",
    lineHeight: 24,
    marginBottom: 32,
  },
  input: {
    width: "100%",
    height: 56,
    backgroundColor: "#F7F8F9",
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 15,
    color: "#1E232C",
    marginBottom: 16,
  },
  errorText: {
    color: "#E53935",
    fontSize: 14,
    marginBottom: 16,
  },
  sendCodeButton: {
    width: "100%",
    height: 56,
    backgroundColor: theme.colors.primary.main,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  sendCodeText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  resendButton: {
    width: "100%",
    height: 56,
    justifyContent: "center",
    alignItems: "center",
  },
  resendText: {
    fontSize: 16,
    color: theme.colors.primary.main,
    fontWeight: "600",
  },
  disabledButton: {
    opacity: 0.5,
  },
});

export default styles;
