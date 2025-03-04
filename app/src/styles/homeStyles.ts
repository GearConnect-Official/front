import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(251, 248, 249, 1)",
  },

  topBar: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
  },
  topBarImg: {
    width: 47,
    height: 47,
    borderRadius: 33.5,
  },
  topBarSearchInput: {
    flex: 1,
    marginHorizontal: 12,
    height: 40,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 6,
    paddingHorizontal: 12,
  },
  topBarIcons: {
    flexDirection: "row",
    gap: 8,
  },
  topBarIcon: {
    width: 24,
    height: 24,
  },
  content: {
    flex: 1,
    padding: 16,
  },
});

export default styles;
