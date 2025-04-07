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
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    gap: 8,
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
    backgroundColor: '#f5f5f5',
    borderColor: '#e0e0e0',
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
  // Step indicator styles
  stepsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  stepDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 4,
  },
  activeStep: {
    backgroundColor: '#3a86ff',
  },
  stepWithLine: {
    marginRight: 20,
    position: 'relative',
  },
  // Step content styles
  stepContainer: {
    padding: 20,
  },
  stepTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  datePicker: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  // Media section styles
  mediaSection: {
    marginBottom: 24,
  },
  imagesRow: {
    flexDirection: 'row',
    marginTop: 8,
    height: 100,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  logoPreview: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  logoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 8,
  },
  uploadButton: {
    backgroundColor: '#3a86ff',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    gap: 8,
  },
  uploadButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
  // Preview section styles
  previewSection: {
    marginTop: 20,
  },
  previewCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  previewLogo: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginBottom: 12,
  },
  previewLogoPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  previewInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  previewBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: 12,
  },
  previewBadgeText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  // Navigation buttons styles
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  backButtonText: {
    color: '#666',
    fontWeight: '500',
  },
  nextButton: {
    backgroundColor: '#3a86ff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    gap: 8,
  },
  nextButtonText: {
    color: '#fff',
    fontWeight: '500',
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
  // Error message
  errorText: {
    color: 'red',
    textAlign: 'center',
    margin: 10,
  },
  // ScrollView
  scrollView: {
    flex: 1,
  },
});

export default styles;
