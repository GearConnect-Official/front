import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 30,
  },
  backButton: {
    width: 54,
    height: 54,
    borderRadius: 32,
  },
  logoContainer: {
    marginTop: 22,
    alignItems: "center",
  },
  logo: {
    width: 72,
    height: 72,
  },
  title: {
    color: "#1E232C",
    fontSize: 30,
    fontWeight: "700",
    marginTop: 18,
  },
  subtitle: {
    color: "#8391A1",
    fontSize: 16,
    marginTop: 10,
  },
  input: {
    backgroundColor: "rgba(247, 248, 249, 1)",
    borderColor: "rgba(218, 218, 218, 1)",
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 57,
    paddingHorizontal: 20,
    paddingVertical: 19,
    width: "100%",
    color: "rgba(131, 145, 161, 1)",
  },
  sendCodeButton: {
    backgroundColor: "#1E232C",
    borderRadius: 8,
    marginTop: 30,
    paddingVertical: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  sendCodeText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 15,
  },
  rememberPasswordContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 320,
  },
  rememberPasswordText: {
    fontFamily: "Urbanist",
    fontWeight: "500",
    fontSize: 15,
  },
  loginText: {
    fontFamily: "Urbanist",
    fontWeight: "700",
    color: "rgba(139,1,244,1)",
    fontSize: 15,
  },
});

export default styles;
