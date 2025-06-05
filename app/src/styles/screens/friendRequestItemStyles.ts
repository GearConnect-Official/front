import { StyleSheet } from "react-native";
import { colors, typography, spacing, borders, shadows } from "../config";

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.paper,
    borderRadius: borders.radius.md,
    marginBottom: spacing.sm,
    ...shadows.apply({}, "sm"),
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: "hidden",
    backgroundColor: colors.grey[100],
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  infoContainer: {
    flex: 1,
    marginLeft: spacing.md,
  },
  name: {
    ...typography.subtitle1,
    color: colors.text.primary,
    marginBottom: spacing.xxs,
  },
  mutualFriends: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  actionsContainer: {
    flexDirection: "row",
    padding: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  actionButton: {
    flex: 1,
    height: 40,
    borderRadius: borders.radius.sm,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: spacing.xs,
  },
  acceptButton: {
    backgroundColor: colors.primary.main,
  },
  declineButton: {
    backgroundColor: colors.grey[100],
  },
});

export default styles; 