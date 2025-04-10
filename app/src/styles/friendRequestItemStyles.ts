import { StyleSheet } from "react-native";
import theme from "./config";

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background.paper,
    borderRadius: theme.borders.radius.md,
    marginBottom: theme.spacing.sm,
    ...theme.shadows.apply({}, "sm"),
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    padding: theme.spacing.md,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: "hidden",
    backgroundColor: theme.colors.grey[100],
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  infoContainer: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  name: {
    ...theme.typography.subtitle1,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xxs,
  },
  mutualFriends: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
  },
  actionsContainer: {
    flexDirection: "row",
    padding: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
  },
  actionButton: {
    flex: 1,
    height: 40,
    borderRadius: theme.borders.radius.sm,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: theme.spacing.xs,
  },
  acceptButton: {
    backgroundColor: theme.colors.primary.main,
  },
  declineButton: {
    backgroundColor: theme.colors.grey[100],
  },
});

export default styles; 