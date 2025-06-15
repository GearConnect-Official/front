import { StyleSheet, Dimensions } from "react-native";
import theme from "../config";

const { width: screenWidth } = Dimensions.get("window");

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  menuContainer: {
    position: "absolute",
    top: 60,
    right: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 4,
    width: Math.min(180, screenWidth * 0.45), // Responsive: max 180px ou 45% de l'écran
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    justifyContent: "space-between",
  },
  menuIconContainer: {
    position: "relative",
    marginRight: 12,
  },
  menuIcon: {
    width: 18,
    textAlign: "center",
  },
  notificationBadge: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "#E10600",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  menuText: {
    fontSize: 15,
    fontWeight: "500",
    flex: 1,
    textAlign: "right",
    marginLeft: 10,
  },
  separator: {
    height: 1,
    backgroundColor: "#E5E5E5",
    marginVertical: 6,
    marginHorizontal: 12,
  },
});

export default styles;
