import { StyleSheet } from "react-native";
import { colors, spacing, borders } from "../config";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.paper,
    paddingTop: 50,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background.paper,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey[100],
    backgroundColor: colors.background.paper,
  },
  backButton: {
    padding: spacing.sm,
  },
  backButtonText: {
    color: colors.primary.main,
    fontSize: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text.primary,
  },
  saveButton: {
    padding: spacing.sm,
  },
  saveButtonText: {
    color: colors.primary.main,
    fontSize: 16,
    fontWeight: "bold",
  },
  errorContainer: {
    padding: spacing.md,
    backgroundColor: "#FFEBEE",
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    borderRadius: borders.radius.sm,
  },
  errorText: {
    color: "#D32F2F",
    fontSize: 14,
  },
  form: {
    padding: spacing.lg,
    alignItems: "center",
  },
  profilePictureContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: spacing.xl,
    position: "relative",
  },
  profilePicture: {
    width: "100%",
    height: "100%",
    borderRadius: 60,
  },
  profilePicturePlaceholder: {
    width: "100%",
    height: "100%",
    borderRadius: 60,
    backgroundColor: colors.grey[100],
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.grey[200],
  },
  editIconContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: colors.primary.main,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: colors.background.paper,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 20,
  },
  formSection: {
    width: "100%",
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  label: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.grey[200],
    borderRadius: borders.radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 16,
    color: colors.text.primary,
  },
  bioInput: {
    height: 120,
    textAlignVertical: "top",
    paddingTop: spacing.sm,
  },
});

export default styles;
