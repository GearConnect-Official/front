import { StyleSheet, Dimensions } from "react-native";
import theme from "../config/theme";

const screenWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    ...theme.common.centerContent,
  },
  menuContainer: {
    position: "absolute",
    top: 60,
    right: 16,
    backgroundColor: theme.colors.background.paper,
    borderRadius: theme.borders.radius.lg,
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.xxs,
    width: Math.min(180, screenWidth * 0.45),
    shadowColor: theme.colors.common.black,
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
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.borders.radius.sm,
    justifyContent: "space-between",
  },
  menuIcon: {
    width: 18,
    textAlign: "center",
  },
  separator: {
    height: 1,
    backgroundColor: theme.colors.border.light,
    marginVertical: theme.spacing.sm,
  },
  menuText: {
    ...theme.typography.body1,
    color: theme.colors.text.primary,
    textAlign: "center",
  },
  logoutButton: {
    backgroundColor: theme.colors.primary.main,
    borderRadius: theme.borders.radius.md,
    paddingVertical: theme.spacing.sm,
    marginTop: theme.spacing.md,
    borderWidth: 2,
    borderColor: theme.colors.common.white,
  },
  logoutText: {
    ...theme.typography.button,
    color: theme.colors.common.white,
    textAlign: "center",
  },
  cancelButton: {
    backgroundColor: theme.colors.grey[200],
    borderRadius: theme.borders.radius.md,
    paddingVertical: theme.spacing.sm,
    marginTop: theme.spacing.xs,
  },
  cancelText: {
    ...theme.typography.button,
    color: theme.colors.text.primary,
    textAlign: "center",
  },
});

export default styles;
