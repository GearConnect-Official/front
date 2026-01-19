import { StyleSheet } from "react-native";
import theme from "../config/theme";

const styles = StyleSheet.create({
  // Avatar styles
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    borderWidth: 2,
    borderColor: theme.colors.border.light,
  },
  avatarPlaceholder: {
    backgroundColor: theme.colors.grey[100],
    ...theme.common.centerContent,
    borderWidth: 2,
    borderColor: theme.colors.border.light,
  },
  avatarText: {
    ...theme.typography.subtitle1,
    color: theme.colors.text.secondary,
  },

  // Loading states
  loadingContainer: {
    ...theme.common.centerContent,
    backgroundColor: theme.colors.grey[50],
  },
  uploadingContainer: {
    ...theme.common.centerContent,
    backgroundColor: theme.colors.grey[50],
  },
  uploadingText: {
    ...theme.typography.caption,
    color: theme.colors.primary.main,
    marginTop: theme.spacing.xs,
  },

  // Error states
  errorContainer: {
    ...theme.common.centerContent,
    backgroundColor: theme.colors.status.error + "15", // 15% opacity
  },
  errorText: {
    ...theme.typography.caption,
    color: theme.colors.status.error,
    marginTop: theme.spacing.xs,
  },

  // Retry button
  retryButton: {
    backgroundColor: theme.colors.status.error,
    borderRadius: theme.borders.radius.md,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    marginTop: theme.spacing.xs,
  },
  retryButtonText: {
    ...theme.typography.caption,
    color: theme.colors.common.white,
  },

  // Image styles
  imageContainer: {
    position: "relative",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imagePlaceholder: {
    backgroundColor: theme.colors.grey[100],
    ...theme.common.centerContent,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
  },
  imagePlaceholderText: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
  },

  // Gallery error states
  galleryErrorContainer: {
    ...theme.common.centerContent,
    backgroundColor: theme.colors.status.error + "15", // 15% opacity
  },
  galleryErrorText: {
    ...theme.typography.caption,
    color: theme.colors.status.error,
    marginTop: theme.spacing.xs,
  },

  // Gallery retry button
  galleryRetryButton: {
    backgroundColor: theme.colors.status.error,
    borderRadius: theme.borders.radius.md,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    marginTop: theme.spacing.xs,
  },
  galleryRetryButtonText: {
    ...theme.typography.caption,
    color: theme.colors.common.white,
  },

  // Progress indicator
  progressContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    ...theme.common.centerContent,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  progressText: {
    ...theme.typography.caption,
    color: theme.colors.common.white,
    marginTop: theme.spacing.xs,
  },
});

export default styles;

export const cloudinaryImageStyles = StyleSheet.create({
  avatar: {
    borderRadius: 25,
  },
  thumbnail: {
    borderRadius: 8,
  },
  heroImage: {
    width: "100%",
    borderRadius: 12,
  },
});

export const cloudinaryImageUploadStyles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#E53935",
    borderStyle: "dashed",
  },
  uploadButtonDisabled: {
    opacity: 0.6,
  },
  uploadButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#E53935",
    fontWeight: "500",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFEBEE",
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  errorText: {
    flex: 1,
    color: "#FF3B30",
    fontSize: 14,
  },
  previewContainer: {
    marginTop: 16,
  },
  imagePreview: {
    position: "relative",
    marginRight: 12,
  },
  previewImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  removeButton: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "#FF3B30",
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  limitText: {
    marginTop: 8,
    fontSize: 12,
    color: "#8E8E93",
    textAlign: "center",
  },
});

export const cloudinaryVideoUploadStyles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F2F2F7",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#007AFF",
    borderStyle: "dashed",
  },
  uploadButtonDisabled: {
    opacity: 0.6,
  },
  uploadButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#007AFF",
    fontWeight: "500",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFEBEE",
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  errorText: {
    flex: 1,
    color: "#FF3B30",
    fontSize: 14,
  },
  previewContainer: {
    marginTop: 16,
  },
  videoPreview: {
    position: "relative",
    marginRight: 12,
    borderRadius: 8,
    overflow: "hidden",
  },
  previewVideo: {
    width: 120,
    height: 120,
    borderRadius: 8,
  },
  videoInfo: {
    position: "absolute",
    bottom: 4,
    left: 4,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  videoDuration: {
    color: "white",
    fontSize: 10,
    fontWeight: "600",
  },
  videoSize: {
    color: "white",
    fontSize: 9,
    marginTop: 1,
  },
  removeButton: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "#FF3B30",
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  limitText: {
    marginTop: 8,
    fontSize: 12,
    color: "#8E8E93",
    textAlign: "center",
  },
});
