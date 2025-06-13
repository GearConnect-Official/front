import { StyleSheet } from "react-native";
import theme from "../config";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.paper,
    paddingTop: 50,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background.paper,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.grey[100],
    backgroundColor: theme.colors.background.paper,
  },
  backButton: {
    padding: theme.spacing.sm,
  },
  backButtonText: {
    color: theme.colors.primary.main,
    fontSize: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.text.primary,
  },
  saveButton: {
    padding: theme.spacing.sm,
  },
  saveButtonText: {
    color: theme.colors.primary.main,
    fontSize: 16,
    fontWeight: "bold",
  },
  errorContainer: {
    padding: theme.spacing.md,
    backgroundColor: "#FFEBEE",
    marginHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.md,
    borderRadius: theme.borders.radius.sm,
  },
  errorText: {
    color: "#D32F2F",
    fontSize: 14,
  },
  form: {
    padding: theme.spacing.lg,
    alignItems: "center",
  },
  profilePictureContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: theme.spacing.xl,
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
    backgroundColor: theme.colors.grey[100],
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.grey[200],
  },
  editIconContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: theme.colors.primary.main,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: theme.colors.background.paper,
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
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.grey[200],
    borderRadius: theme.borders.radius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    fontSize: 16,
    color: theme.colors.text.primary,
  },
  bioInput: {
    height: 120,
    textAlignVertical: "top",
    paddingTop: theme.spacing.sm,
  },
});

export default styles;
