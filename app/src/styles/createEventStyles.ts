import { StyleSheet } from "react-native";
import theme from "./config";

const styles = StyleSheet.create({
  container: {
    ...theme.common.container,
    backgroundColor: theme.colors.background.paper,
  },
  contentContainer: {
    padding: theme.spacing.md,
  },
  spacer: {
    height: theme.spacing.xl,
  },
  // TopBar styles
  topBar: {
    backgroundColor: theme.colors.background.paper,
  },
  statusBar: {
    ...theme.common.spaceBetween,
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.multiply(5), // 40/8
    paddingBottom: theme.spacing.xs,
  },
  titleBar: {
    ...theme.common.row,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs + 4,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.grey[200],
  },
  backButton: {
    marginRight: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.h4.fontSize,
    fontWeight: theme.typography.h4.fontWeight,
  },
  // InputField styles
  inputContainer: {
    marginBottom: theme.spacing.xl,
  },
  inputTitle: {
    fontSize: theme.typography.h5.fontSize,
    fontWeight: theme.typography.h5.fontWeight,
    marginBottom: theme.spacing.xxs,
  },
  input: {
    ...theme.borders.apply({}, { 
      width: 1, 
      color: theme.colors.grey[300], 
      radius: 'md' 
    }),
    paddingHorizontal: theme.spacing.xs + 4,
    paddingVertical: theme.spacing.xs,
    fontSize: theme.typography.body1.fontSize,
    fontWeight: theme.typography.body1.fontWeight,
    marginBottom: theme.spacing.xxs,
  },
  inputInfo: {
    fontSize: theme.typography.caption.fontSize,
    fontWeight: theme.typography.caption.fontWeight,
    color: theme.colors.grey[600],
  },
  // ImageUpload styles
  imageUploadContainer: {
    marginBottom: theme.spacing.md,
  },
  imageUploadTitle: {
    fontSize: theme.typography.subtitle1.fontSize,
    fontWeight: theme.typography.subtitle1.fontWeight,
    marginBottom: theme.spacing.xs,
    color: theme.colors.text.primary,
  },
  imageUploadButton: {
    backgroundColor: theme.colors.background.input,
    borderRadius: theme.borders.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.grey[100],
    borderStyle: "dashed",
    padding: theme.spacing.md,
    ...theme.common.centerContent,
    height: 150,
  },
  imageUploadButtonText: {
    color: theme.colors.text.primary,
    marginTop: theme.spacing.xs,
    fontSize: theme.typography.caption.fontSize,
    fontWeight: theme.typography.caption.fontWeight,
  },
  uploadedImage: {
    width: "100%",
    height: "100%",
    borderRadius: theme.borders.radius.md,
  },
  // Section styles
  section: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: theme.typography.h5.fontSize,
    fontWeight: theme.typography.h5.fontWeight,
    marginBottom: theme.spacing.xs,
  },
  // Action buttons styles
  actionButtonsContainer: {
    ...theme.common.spaceBetween,
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.md,
  },
  actionButton: {
    flex: 1,
    paddingVertical: theme.spacing.xs + 4,
    borderRadius: theme.borders.radius.md,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: theme.colors.grey[200],
    marginRight: theme.spacing.xs,
  },
  submitButton: {
    backgroundColor: theme.colors.primary.main,
    marginLeft: theme.spacing.xs,
  },
  cancelButtonText: {
    color: theme.colors.grey[800],
    fontWeight: "500",
  },
  submitButtonText: {
    color: theme.colors.common.white,
    fontWeight: "500",
  },
  disabledButton: {
    backgroundColor: theme.colors.grey[400],
    opacity: 0.7,
  },
  disabledButtonText: {
    color: theme.colors.common.white,
    opacity: 0.7,
  },
  errorText: {
    color: theme.colors.status.error,
    fontSize: theme.typography.caption.fontSize,
    fontWeight: theme.typography.caption.fontWeight,
    textAlign: "center",
    marginVertical: theme.spacing.xs + 2,
  },
});

export default styles;
