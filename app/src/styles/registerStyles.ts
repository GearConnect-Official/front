import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1E232C",
    textAlign: "center",
    marginBottom: 30,
  },
  input: {
    width: "100%",
    height: 56,
    backgroundColor: "#F7F8F9",
    borderColor: "#DADADA",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  registerButton: {
    backgroundColor: "#1E232C",
    width: "100%",
    height: 56,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  registerButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  orText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#6A707C",
    marginBottom: 10,
  },
  socialButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
  },
  socialButton: {
    width: 56,
    height: 56,
    borderWidth: 1,
    borderColor: "#DADADA",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  socialIcon: {
    width: 26,
    height: 26,
  },
});

export default styles;
