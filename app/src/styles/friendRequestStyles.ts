import { StyleSheet } from "react-native";
import theme from "./config";

const styles = StyleSheet.create({
  container: {
    ...theme.common.container,
  },
  topBar: {
    backgroundColor: theme.colors.background.paper,
    ...theme.shadows.apply({}, 'topBar'),
    minHeight: theme.spacing.height.toolbar,
  },
  topBarContent: {
    ...theme.common.spaceBetween,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
  },
  topBarTitle: {
    ...theme.typography.h4,
    color: theme.colors.text.primary,
  },
  topBarIcon: {
    width: 24,
    height: 24,
  },
  title: {
    ...theme.typography.h4,
    color: theme.colors.text.primary,
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: theme.spacing.xs + 4,
    paddingTop: theme.spacing.lg,
  },
  sectionTitle: {
    ...theme.typography.h5,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
    marginTop: theme.spacing.md,
  },
  addNewButton: {
    backgroundColor: theme.colors.primary.main,
    borderRadius: theme.borders.radius.md,
    padding: theme.spacing.xs + 4,
    marginHorizontal: theme.spacing.xs + 4,
    marginVertical: theme.spacing.xs + 4,
  },
  addNewButtonText: {
    color: theme.colors.common.white,
    ...theme.typography.button,
    textAlign: "center",
  },
  itemContainer: {
    ...theme.common.row,
    alignItems: "center",
    paddingVertical: theme.spacing.xs + 4,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.medium,
  },
  avatarContainer: {
    width: 32,
    height: 32,
    borderRadius: theme.borders.radius.round,
    backgroundColor: theme.colors.grey[50],
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 20,
  },
  nameContainer: {
    flex: 1,
    marginLeft: theme.spacing.xs,
  },
  name: {
    ...theme.typography.subtitle1,
    color: theme.colors.text.primary,
  },
  actionButton: {
    borderRadius: theme.borders.radius.xs,
    borderWidth: 1,
    borderColor: theme.colors.primary.main,
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: theme.spacing.xxs - 1,
  },
  actionButtonText: {
    ...theme.typography.caption,
    color: theme.colors.primary.main,
  },
});

export default styles;
