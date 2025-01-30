import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 171,
    height: 171,
    marginBottom: 50,
  },
  loginButton: {
    backgroundColor: "#1E232C",
    width: 330,
    height: 56,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  loginText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#fff",
  },
  registerButton: {
    backgroundColor: "#fff",
    borderColor: "#1E232C",
    borderWidth: 1,
    width: 330,
    height: 56,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  registerText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#1E232C",
  },
  guestText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#8B01F4",
    marginTop: 20,
  },
});

export default styles;
