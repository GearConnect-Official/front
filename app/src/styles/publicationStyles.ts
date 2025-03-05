import { StyleSheet, Dimensions, Platform, StatusBar } from 'react-native';

const { width, height } = Dimensions.get('window');
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 0;
const HEADER_HEIGHT = 56 + STATUSBAR_HEIGHT;
const SCREEN_WIDTH = width;
const SCREEN_HEIGHT = height;

const styles = StyleSheet.create({
  // Container styles
  container: {
    flex: 1,
    backgroundColor: '#000',
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: '#000',
    borderBottomColor: '#262626',
    borderBottomWidth: 0.5,
    zIndex: 1,
  },
  headerLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 16,
    padding: 4,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  headerButton: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    zIndex: 2,
  },
  nextButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    backgroundColor: 'transparent',
    zIndex: 2,
  },
  nextButtonText: {
    color: '#0095F6',
    fontSize: 15,
    fontWeight: '600',
  },
  nextButtonShare: {
    backgroundColor: '#0095F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    zIndex: 2,
  },
  nextButtonShareText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  nextButtonDisabled: {
    opacity: 0.5,
  },

  // Media Section styles
  mediaSectionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
    padding: 20,
  },
  mediaButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    borderRadius: 16,
    backgroundColor: '#0095F6',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  mediaButtonText: {
    color: '#fff',
    marginTop: 12,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.3,
  },

  // Image Cropper styles
  cropperContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  cropperHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#121212',
  },
  cropperImage: {
    width: width,
    height: width,
    backgroundColor: '#121212',
  },
  cropperTools: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#121212',
  },
  cropperTool: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#262626',
    borderRadius: 22,
  },
  cropperToolText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 4,
  },

  // Publication Form styles
  formContainer: {
    flex: 1,
    backgroundColor: '#121212',
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#262626',
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  headerText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  inputContainer: {
    padding: 16,
  },
  titleInput: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#262626',
    marginBottom: 16,
  },
  descriptionInput: {
    color: '#fff',
    fontSize: 16,
    paddingVertical: 12,
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
    backgroundColor: '#262626',
  },
  formContent: {
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
  },
  
  // Preview Image styles
  previewContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  
  // Additional Options styles
  optionsContainer: {
    backgroundColor: '#121212',
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#262626',
  },
  optionText: {
    color: '#fff',
    fontSize: 16,
  },
  optionValue: {
    color: '#666',
    fontSize: 16,
  },

  // Error styles
  errorContainer: {
    padding: 16,
    backgroundColor: '#FF3B30',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
  },
  errorText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },

  // Image Viewer styles
  imageViewerContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  imageControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: '#000',
  },
  imageControlButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#262626',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  fullScreenContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    resizeMode: 'contain',
  },
  fullScreenCloseButton: {
    position: 'absolute',
    top: STATUSBAR_HEIGHT + 10,
    right: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  zoomInstructions: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 8,
    alignItems: 'center',
  },
  zoomInstructionsText: {
    color: '#fff',
    fontSize: 14,
  },

  // New styles from the code block
  cropOverlayContainer: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: STATUSBAR_HEIGHT,
  },
  cropHeader: {
    height: HEADER_HEIGHT - STATUSBAR_HEIGHT,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#121212',
  },
  cropConfirmText: {
    color: '#0095F6',
    fontSize: 17,
    fontWeight: '600',
  },
  cropPreviewContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cropPreviewImage: {
    width: '100%',
    height: undefined,
    backgroundColor: '#121212',
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
    backgroundColor: '#121212',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: Platform.OS === 'ios' ? 34 : 16, // Ajustement pour iPhone X et plus
  },
  cropControlButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  cropControlText: {
    color: '#fff',
    marginTop: 4,
    fontSize: 12,
  },

  controlButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#262626',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  
  controlButtonText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 4,
  },

  aspectRatioControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#000',
    borderTopWidth: 1,
    borderTopColor: '#262626',
  },

  aspectRatioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#262626',
  },

  aspectRatioButtonActive: {
    backgroundColor: '#1C1C1C',
    borderWidth: 1,
    borderColor: '#0095F6',
  },

  aspectRatioButtonText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
  },

  cropFrameContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
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
});

export default styles; 