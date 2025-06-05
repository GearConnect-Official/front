import { StyleSheet } from "react-native";
import { colors, typography, spacing, borders } from "../config";

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: colors.background.paper,
    borderTopLeftRadius: borders.radius.lg,
    borderTopRightRadius: borders.radius.lg,
    paddingBottom: 30, // Extra padding for bottom to handle notch phones
    height: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  modalTitle: {
    ...typography.h3,
    color: colors.text.primary,
  },
  closeButton: {
    padding: spacing.xs,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: spacing.md,
    padding: spacing.sm,
    backgroundColor: colors.grey[50],
    borderRadius: borders.radius.md,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  searchIcon: {
    marginRight: spacing.xs,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: colors.text.primary,
  },
  clearButton: {
    padding: spacing.xs,
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
    padding: spacing.xl,
  },
  emptyStateText: {
    ...typography.body1,
    color: colors.text.secondary,
    textAlign: "center",
    marginTop: spacing.md,
  },
  tipContainer: {
    padding: spacing.md,
    alignItems: "center",
  },
  tipText: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: spacing.md,
  },
  userName: {
    ...typography.subtitle1,
    color: colors.text.primary,
    flex: 1,
  },
  addButton: {
    backgroundColor: colors.primary.main,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default styles; 