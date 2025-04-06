import { StyleSheet, Dimensions, Platform, StatusBar } from 'react-native';
import theme from './config';

const { width, height } = Dimensions.get('window');
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 0;
const HEADER_HEIGHT = 56 + STATUSBAR_HEIGHT;
const SCREEN_WIDTH = width;
const SCREEN_HEIGHT = height;

const styles = StyleSheet.create({
  // Container styles
  container: {
    flex: 1,
    backgroundColor: theme.colors.grey[900],
  },
  safeArea: {
    flex: 1,
    paddingTop: STATUSBAR_HEIGHT,
  },
  contentContainer: {
    flex: 1,
  },

  // Header styles
  header: {
    height: 44,
    ...theme.common.spaceBetween,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.grey[900],
    borderBottomColor: theme.colors.grey[800],
    borderBottomWidth: 0.5,
    zIndex: 1,
  },
  headerLeft: {
    flex: 1,
    ...theme.common.row,
  },
  backButton: {
    marginRight: theme.spacing.md,
    padding: theme.spacing.xxs,
  },
  headerTitle: {
    color: theme.colors.common.white,
    fontSize: theme.typography.subtitle1.fontSize,
    fontWeight: theme.typography.subtitle1.fontWeight,
  },
  headerButton: {
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: theme.spacing.xs,
    zIndex: 2,
  },
  nextButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borders.radius.xs,
    backgroundColor: 'transparent',
    zIndex: 2,
  },
  nextButtonText: {
    color: theme.colors.status.info,
    fontSize: 15,
    fontWeight: '600',
  },
  nextButtonShare: {
    backgroundColor: theme.colors.status.info,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borders.radius.xs,
    zIndex: 2,
  },
  nextButtonShareText: {
    color: theme.colors.common.white,
    fontSize: 15,
    fontWeight: '600',
  },
  nextButtonDisabled: {
    opacity: 0.5,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonLoader: {
    marginHorizontal: theme.spacing.xs,
  },

  // Media Section styles
  mediaSectionContainer: {
    flex: 1,
    ...theme.common.centerContent,
    backgroundColor: theme.colors.grey[800],
    padding: theme.spacing.lg,
  },
  mediaButton: {
    ...theme.common.centerContent,
    padding: theme.spacing.xl,
    borderRadius: theme.borders.radius.lg,
    backgroundColor: theme.colors.status.info,
    ...theme.shadows.apply({}, 'md'),
  },
  mediaButtonText: {
    color: theme.colors.common.white,
    marginTop: theme.spacing.xs + 4,
    fontSize: theme.typography.button.fontSize,
    fontWeight: theme.typography.button.fontWeight,
    letterSpacing: 0.3,
  },

  // Image Cropper styles
  cropperContainer: {
    flex: 1,
    backgroundColor: theme.colors.grey[900],
  },
  cropperHeader: {
    ...theme.common.spaceBetween,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.grey[800],
  },
  cropperImage: {
    width: width,
    height: width,
    backgroundColor: theme.colors.grey[800],
  },
  cropperTools: {
    ...theme.common.row,
    justifyContent: 'space-around',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.grey[800],
  },
  cropperTool: {
    width: 44,
    height: 44,
    ...theme.common.centerContent,
    backgroundColor: theme.colors.grey[700],
    borderRadius: 22,
  },
  cropperToolText: {
    color: theme.colors.common.white,
    fontSize: theme.typography.caption.fontSize,
    marginTop: theme.spacing.xxs,
  },

  // Publication Form styles
  formContainer: {
    flex: 1,
    backgroundColor: theme.colors.grey[800],
  },
  userInfoContainer: {
    ...theme.common.row,
    padding: theme.spacing.md,
    borderBottomWidth: 0.5,
    borderBottomColor: theme.colors.grey[700],
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: theme.borders.radius.round,
    marginRight: theme.spacing.xs + 4,
  },
  headerText: {
    color: theme.colors.common.white,
    fontSize: 15,
    fontWeight: '600',
  },
  inputContainer: {
    padding: theme.spacing.md,
  },
  titleInput: {
    color: theme.colors.common.white,
    fontSize: theme.typography.h5.fontSize,
    fontWeight: theme.typography.h5.fontWeight,
    paddingVertical: theme.spacing.xs + 4,
    borderBottomWidth: 0.5,
    borderBottomColor: theme.colors.grey[700],
    marginBottom: theme.spacing.md,
  },
  descriptionInput: {
    color: theme.colors.common.white,
    fontSize: theme.typography.body1.fontSize,
    paddingVertical: theme.spacing.xs + 4,
    minHeight: 100,
    textAlignVertical: 'top',
    fontWeight: 'normal',
  },
  formScrollView: {
    flex: 1,
  },
  formImagePreview: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH,
    backgroundColor: theme.colors.grey[700],
  },
  formContent: {
    padding: theme.spacing.md,
    paddingBottom: Platform.OS === 'ios' ? 34 : theme.spacing.md,
  },
  
  // Preview Image styles
  previewContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: theme.colors.grey[900],
    ...theme.common.centerContent,
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  
  // Additional Options styles
  optionsContainer: {
    backgroundColor: theme.colors.grey[800],
  },
  optionItem: {
    ...theme.common.spaceBetween,
    padding: theme.spacing.md,
    borderBottomWidth: 0.5,
    borderBottomColor: theme.colors.grey[700],
  },
  optionText: {
    color: theme.colors.common.white,
    fontSize: theme.typography.body1.fontSize,
  },
  optionValue: {
    color: theme.colors.grey[600],
    fontSize: theme.typography.body1.fontSize,
  },

  // Error styles
  errorContainer: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.status.error,
    marginHorizontal: theme.spacing.md,
    marginTop: theme.spacing.md,
    borderRadius: theme.borders.radius.md,
  },
  errorText: {
    color: theme.colors.common.white,
    fontSize: theme.typography.caption.fontSize,
    textAlign: 'center',
  },

  // Image Viewer styles
  imageViewerContainer: {
    flex: 1,
    backgroundColor: theme.colors.grey[900],
  },
  imageControls: {
    ...theme.common.row,
    justifyContent: 'space-around',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.grey[900],
  },
  imageControlButton: {
    width: 44,
    height: 44,
    borderRadius: theme.borders.radius.round,
    backgroundColor: theme.colors.grey[700],
    ...theme.common.centerContent,
    ...theme.shadows.apply({}, 'md'),
  },
  fullScreenContainer: {
    flex: 1,
    backgroundColor: theme.colors.grey[900],
    ...theme.common.centerContent,
  },
  fullScreenImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    resizeMode: 'contain',
  },
  fullScreenCloseButton: {
    position: 'absolute',
    top: STATUSBAR_HEIGHT + 10,
    right: theme.spacing.md,
    width: 44,
    height: 44,
    borderRadius: theme.borders.radius.round,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    ...theme.common.centerContent,
    zIndex: 1,
  },
  zoomInstructions: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: theme.spacing.xs,
    alignItems: 'center',
  },
  zoomInstructionsText: {
    color: theme.colors.common.white,
    fontSize: theme.typography.caption.fontSize,
  },

  // New styles from the code block
  cropOverlayContainer: {
    flex: 1,
    backgroundColor: theme.colors.grey[900],
    paddingTop: STATUSBAR_HEIGHT,
  },
  cropHeader: {
    height: HEADER_HEIGHT - STATUSBAR_HEIGHT,
    ...theme.common.spaceBetween,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.grey[800],
  },
  cropConfirmText: {
    color: theme.colors.status.info,
    fontSize: 17,
    fontWeight: '600',
  },
  cropPreviewContainer: {
    flex: 1,
    backgroundColor: theme.colors.grey[900],
    ...theme.common.centerContent,
  },
  cropPreviewImage: {
    width: '100%',
    height: undefined,
    backgroundColor: theme.colors.grey[800],
  },
  cropGrid: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  cropGridLine: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  cropGridLineHorizontal: {
    width: '100%',
    height: 1,
  },
  cropGridLineVertical: {
    width: 1,
    height: '100%',
  },
  cropControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: theme.colors.grey[800],
    ...theme.common.row,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: Platform.OS === 'ios' ? 34 : theme.spacing.md,
  },
  cropControlButton: {
    ...theme.common.centerContent,
    padding: theme.spacing.xs + 4,
  },
  cropControlText: {
    color: theme.colors.common.white,
    marginTop: theme.spacing.xxs,
    fontSize: theme.typography.caption.fontSize,
  },

  controlButton: {
    width: 44,
    height: 44,
    borderRadius: theme.borders.radius.round,
    backgroundColor: theme.colors.grey[700],
    ...theme.common.centerContent,
    marginHorizontal: theme.spacing.xs,
  },
  
  controlButtonText: {
    color: theme.colors.common.white,
    fontSize: theme.typography.caption.fontSize,
    marginTop: theme.spacing.xxs,
  },

  aspectRatioControls: {
    ...theme.common.row,
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.grey[900],
    borderTopWidth: 1,
    borderTopColor: theme.colors.grey[700],
  },

  aspectRatioButton: {
    ...theme.common.row,
    padding: theme.spacing.xs + 4,
    borderRadius: theme.borders.radius.md,
    backgroundColor: theme.colors.grey[700],
  },

  aspectRatioButtonActive: {
    backgroundColor: theme.colors.grey[800],
    borderWidth: 1,
    borderColor: theme.colors.status.info,
  },

  aspectRatioButtonText: {
    color: theme.colors.common.white,
    marginLeft: theme.spacing.xs,
    fontSize: theme.typography.caption.fontSize,
    fontWeight: '600',
  },

  cropFrameContainer: {
    flex: 1,
    ...theme.common.centerContent,
    backgroundColor: theme.colors.grey[900],
  },

  cropFrame: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH,
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },

  cropImageContainer: {
    position: 'absolute',
    width: SCREEN_WIDTH * 1.5,
    height: SCREEN_WIDTH * 1.5,
  },

  cropImage: {
    width: '100%',
    height: '100%',
  },

  tagsContainer: {
    marginTop: theme.spacing.md,
    borderTopWidth: 0.5,
    borderTopColor: theme.colors.grey[700],
    paddingTop: theme.spacing.md,
  },
  tagsLabel: {
    color: theme.colors.common.white,
    fontSize: theme.typography.subtitle1.fontSize,
    fontWeight: theme.typography.subtitle1.fontWeight,
    marginBottom: theme.spacing.xs,
  },
  tagsInputContainer: {
    ...theme.common.row,
    marginBottom: theme.spacing.md,
  },
  tagInput: {
    flex: 1,
    color: theme.colors.common.white,
    backgroundColor: theme.colors.grey[700],
    borderRadius: theme.borders.radius.xs,
    padding: theme.spacing.xs,
    marginRight: theme.spacing.xs,
  },
  addTagButton: {
    backgroundColor: theme.colors.status.info,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borders.radius.xs,
  },
  addTagButtonText: {
    color: theme.colors.common.white,
    fontWeight: '600',
  },
  tagsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: theme.spacing.md,
  },
  tagItem: {
    ...theme.common.row,
    backgroundColor: theme.colors.status.info,
    borderRadius: theme.borders.radius.lg,
    padding: theme.spacing.xs,
    marginRight: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
  },
  tagText: {
    color: theme.colors.common.white,
    marginRight: theme.spacing.xs,
  },
  removeTagButton: {
    color: theme.colors.common.white,
    fontSize: 18,
    lineHeight: 18,
  },
  loadingContainer: {
    ...theme.common.centerContent,
    padding: theme.spacing.md,
  },
  loadingText: {
    color: theme.colors.common.white,
    marginTop: theme.spacing.xs,
    fontSize: theme.typography.body1.fontSize,
  },
});

export default styles; 