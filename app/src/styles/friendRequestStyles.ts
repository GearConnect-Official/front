import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FBF9FA",
  },
  topBar: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 4,
    zIndex: 1,
    minHeight: 104,
  },
  topBarContent: {
    paddingHorizontal: 16,
    paddingTop: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 20,
    fontWeight: "500",
    color: "#000000",
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "500",
    color: "#000000",
    marginBottom: 16,
    marginTop: 16,
  },
  addNewButton: {
    backgroundColor: "#000000",
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 12,
    marginVertical: 12,
  },
  addNewButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
  },
  avatarContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 20,
  },
  nameContainer: {
    flex: 1,
    marginLeft: 8,
  },
  name: {
    fontSize: 16,
    color: "#000000",
  },
  actionButton: {
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#000000",
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  actionButtonText: {
    fontSize: 12,
    color: "#000000",
  },
});

export default styles;
