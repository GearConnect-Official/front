import { StyleSheet } from "react-native";
import theme from "../config/theme";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: theme.colors.background.paper,
    paddingTop: theme.spacing.lg,
    paddingBottom: 30,
    ...theme.shadows.apply({}, "bottomBar"),
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.medium,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 0,
    paddingBottom: 0,
  },
  tabText: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
  },
  activeTabText: {
    color: theme.colors.text.primary,
    fontWeight: "bold",
  },
});

export default styles;
