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
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 16,
  },
  imageUploadHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  imageUploadTitle: {
    fontSize: 16,
  },
  uploadButton: {
    backgroundColor: "#3B82F6",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  uploadButtonText: {
    color: "#FFFFFF",
    fontWeight: "500",
  },
  uploadedImage: {
    width: "100%",
    height: 160,
    borderRadius: 8,
    marginTop: 16,
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
    backgroundColor: "#3B82F6",
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
});

export default styles; 