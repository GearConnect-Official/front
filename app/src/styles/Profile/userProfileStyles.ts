import { StyleSheet } from "react-native";
import theme, { colors, spacing, borders, typography } from "../config";

const styles = StyleSheet.create({
  container: {
    ...theme.common.container,
    backgroundColor: colors.background.paper,
  },
  header: {
    alignItems: "center",
    paddingVertical: spacing.xl + 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey[100],
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: borders.radius.round,
    marginBottom: spacing.sm + 3,
  },
  username: {
    ...typography.h2,
    marginBottom: spacing.xxs + 1,
    color: colors.text.primary,
  },
  email: {
    ...typography.body1,
    color: colors.text.secondary,
    marginBottom: spacing.xs + 2,
  },
  infoContainer: {
    padding: spacing.lg,
  },
  infoItem: {
    ...theme.common.row,
    paddingVertical: spacing.sm + 3,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey[100],
  },
  infoText: {
    ...typography.body1,
    marginLeft: spacing.sm + 3,
    color: colors.text.primary,
  },
  logoutItem: {
    marginTop: spacing.lg,
    borderBottomWidth: 0,
  },
  logoutText: {
    color: colors.status.error,
  },
});

export default styles;
