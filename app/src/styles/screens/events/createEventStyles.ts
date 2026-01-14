import { StyleSheet, Dimensions, Platform, StatusBar } from "react-native";
import theme from "../../config/theme";

const { width } = Dimensions.get("window");
const STATUSBAR_HEIGHT =
  Platform.OS === "ios" ? 28 : StatusBar.currentHeight || 0;

// Hauteur responsive pour la progress bar : proportionnelle à la largeur, clampée
const progressBarHeight = Math.round(Math.max(6, Math.min(12, width * 0.02)));

export default StyleSheet.create({
  container: {
    ...theme.common.container,
    backgroundColor: theme.colors.background.paper,
  },

  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background.paper,
  },

  scrollView: {
    flex: 1,
  },

  scrollViewContent: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.lg * 2,
    flexGrow: 1,
  },

  stepsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    // réduire l'épaisseur de la nav bar : pas de height fixe, paddings plus petits
    paddingVertical: Platform.OS === "ios" ? 8 : 6,
    backgroundColor: "#fff",
    borderBottomWidth: 0,
    // laisser un petit top offset pour iOS mais plus discret
    paddingTop: Platform.OS === "android" ? STATUSBAR_HEIGHT + 2 : Math.round(STATUSBAR_HEIGHT / 4),
    elevation: 0,
  },

  // bouton retour large centralisé (utilisé par StepIndicator)
  backButtonLarge: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },

  placeholderRight: {
    width: 40,
    height: 36,
  },

  backButton: {
    padding: 8,
    borderRadius: 10,
  },

  stepIndicatorRow: {
    flex: 1,
    marginHorizontal: 6,
    justifyContent: "center",
  },

  progressBarBackground: {
    height: progressBarHeight,
    backgroundColor: theme.colors.grey[200],
    borderRadius: 999,
    overflow: "hidden",
  },
  progressBarFill: {
    height: progressBarHeight,
    backgroundColor: theme.colors.primary.main,
    borderRadius: 999,
  },

  // Step content
  stepContainer: {
    backgroundColor: "#fff",
    marginHorizontal: 0,
    marginTop: theme.spacing.md,
    padding: 18,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    minHeight: 360,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#222",
    marginBottom: 6,
  },
  stepDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 14,
  },

  // Inputs
  inputGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#FAFAFB",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    borderWidth: 1,
    borderColor: theme.colors.grey[200],
    color: "#111",
  },
  textArea: {
    height: 140,
    textAlignVertical: "top",
  },
  inputInfo: {
    fontSize: 12,
    color: theme.colors.grey[600],
    marginTop: 6,
  },

  // Date picker
  datePicker: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FAFAFB",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: theme.colors.grey[200],
  },

  // Media
  imageUploadContainer: {
    marginBottom: theme.spacing.md,
  },
  imageUploadButton: {
    backgroundColor: "#F7F8FA",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.grey[200],
    borderStyle: "dashed",
    padding: theme.spacing.md,
    alignItems: "center",
    justifyContent: "center",
    height: 140,
  },
  imageUploadButtonText: {
    color: theme.colors.primary.main,
    marginTop: theme.spacing.xs,
    fontSize: 13,
    fontWeight: "600",
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 8,
  },
  addImageButton: {
    width: 100,
    height: 100,
    borderRadius: 10,
    backgroundColor: "#F2F5F9",
    alignItems: "center",
    justifyContent: "center",
  },

  // Preview card
  previewSection: {
    marginTop: 18,
  },
  previewCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
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
    backgroundColor: "#F2F2F5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#222",
    marginBottom: 8,
    textAlign: "center",
  },
  previewInfo: {
    fontSize: 13,
    color: "#666",
    marginBottom: 6,
  },
  previewBadge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
    marginTop: 12,
    backgroundColor: theme.colors.primary.main,
  },
  previewBadgeText: {
    color: "#fff",
    fontWeight: "700",
  },

  // Buttons area (fixé en bas visuellement)
  buttonsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 18,
    gap: 12,
    borderTopWidth: 0,
    backgroundColor: "transparent",
    marginTop: 12,
  },
  // pour occuper la place du bouton Back à la première étape
  navSpacer: {
    width: 110,
    height: 48,
  },
  backButtonText: {
    color: "#666",
    fontWeight: "600",
    marginLeft: 8,
  },
  backSmall: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 48,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: theme.colors.grey[200],
  },

  nextButton: {
    height: 48,
    minWidth: 160,
    backgroundColor: theme.colors.primary.main,
    paddingHorizontal: 18,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  nextButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },

  // Action buttons (submit/cancel)
  actionButtonsContainer: {
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.md,
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: theme.spacing.xs + 6,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: theme.colors.grey[100],
    marginRight: theme.spacing.xs,
  },
  submitButton: {
    backgroundColor: theme.colors.primary.main,
    marginLeft: theme.spacing.xs,
  },
  cancelButtonText: {
    color: "#444",
    fontWeight: "600",
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "700",
  },

  // Errors
  errorText: {
    color: "#D32F2F",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 12,
    fontWeight: "600",
  },
});