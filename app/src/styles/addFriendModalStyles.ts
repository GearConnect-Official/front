import { StyleSheet } from "react-native";
import theme from "./config";

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: theme.colors.background.paper,
    borderTopLeftRadius: theme.borders.radius.lg,
    borderTopRightRadius: theme.borders.radius.lg,
    paddingBottom: 30, // Extra padding for bottom to handle notch phones
    height: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  modalTitle: {
    ...theme.typography.h3,
    color: theme.colors.text.primary,
  },
  closeButton: {
    padding: theme.spacing.xs,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: theme.spacing.md,
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.grey[50],
    borderRadius: theme.borders.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
  },
  searchIcon: {
    marginRight: theme.spacing.xs,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: theme.colors.text.primary,
  },
  clearButton: {
    padding: theme.spacing.xs,
  },
  resultsList: {
    flex: 1,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.xl,
  },
  emptyStateText: {
    ...theme.typography.body1,
    color: theme.colors.text.secondary,
    textAlign: "center",
    marginTop: theme.spacing.md,
  },
  tipContainer: {
    padding: theme.spacing.md,
    alignItems: "center",
  },
  tipText: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
  },
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: theme.spacing.md,
  },
  userName: {
    ...theme.typography.subtitle1,
    color: theme.colors.text.primary,
    flex: 1,
  },
  addButton: {
    backgroundColor: theme.colors.primary.main,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default styles; 