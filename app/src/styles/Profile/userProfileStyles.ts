import { StyleSheet } from "react-native";
import theme from "../config";

const styles = StyleSheet.create({
  container: {
    ...theme.common.container,
    backgroundColor: theme.colors.background.paper,
  },
  header: {
    alignItems: "center",
    paddingVertical: theme.spacing.xl + 6,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.grey[100],
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: theme.borders.radius.round,
    marginBottom: theme.spacing.sm + 3,
  },
  username: {
    ...theme.typography.h2,
    marginBottom: theme.spacing.xxs + 1,
    color: theme.colors.text.primary,
  },
  email: {
    ...theme.typography.body1,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs + 2,
  },
  infoContainer: {
    padding: theme.spacing.lg,
  },
  infoItem: {
    ...theme.common.row,
    paddingVertical: theme.spacing.sm + 3,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.grey[100],
  },
  infoText: {
    ...theme.typography.body1,
    marginLeft: theme.spacing.sm + 3,
    color: theme.colors.text.primary,
  },
  logoutItem: {
    marginTop: theme.spacing.lg,
    borderBottomWidth: 0,
  },
  logoutText: {
    color: theme.colors.status.error,
  },
});

export default styles;
