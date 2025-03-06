import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  contentContainer: {
    padding: 16,
  },
  spacer: {
    height: 32,
  },
  // TopBar styles
  topBar: {
    backgroundColor: "#FFFFFF",
  },
  statusBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 8,
  },
  titleBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
  },
  // InputField styles
  inputContainer: {
    marginBottom: 24,
  },
  inputTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    marginBottom: 4,
  },
  inputInfo: {
    fontSize: 14,
    color: "#6B7280",
  },
  // ImageUpload styles
  imageUploadContainer: {
    marginBottom: 16,
  },
  imageUploadTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
    color: "#1E232C",
  },
  imageUploadButton: {
    backgroundColor: "#F7F8F9",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E8ECF4",
    borderStyle: "dashed",
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    height: 150,
  },
  imageUploadButtonText: {
    color: "#1E232C",
    marginTop: 8,
    fontSize: 14,
  },
  uploadedImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  // Section styles
  section: {
    marginTop: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  // Action buttons styles
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#E5E7EB",
    marginRight: 8,
  },
  submitButton: {
    backgroundColor: "#1E232C",
    marginLeft: 8,
  },
  cancelButtonText: {
    color: "#1F2937",
    fontWeight: "500",
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontWeight: "500",
  },
  disabledButton: {
    backgroundColor: "#A0A0A0",
    opacity: 0.7,
  },
  disabledButtonText: {
    color: "#FFFFFF",
    opacity: 0.7,
  },
  errorText: {
    color: "#FF0000",
    fontSize: 14,
    textAlign: "center",
    marginVertical: 10,
  },
});

export default styles;
