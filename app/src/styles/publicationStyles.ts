import { StyleSheet, Dimensions, Platform, StatusBar } from 'react-native';
import theme from './config';

const { width, height } = Dimensions.get('window');
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 0;
const HEADER_HEIGHT = 56 + STATUSBAR_HEIGHT;
const SCREEN_WIDTH = width;
const SCREEN_HEIGHT = height;

// Palette de couleurs inspirée du monde automobile et du racing
const THEME_COLORS = {
  primary: '#E10600', // Rouge Racing
  secondary: '#1E1E1E', // Noir Racing
  tertiary: '#2D9CDB', // Bleu pour accent
  quaternary: '#F0C419', // Jaune pour accent
  background: '#FFFFFF',
  card: '#F2F2F2',
  cardLight: '#F8F8F8',
  textPrimary: '#1E1E1E',
  textSecondary: '#6E6E6E',
  border: '#E0E0E0',
  success: '#27AE60', // Vert pour badges positifs
};

const styles = StyleSheet.create({
  // Container styles
  container: {
    flex: 1,
    backgroundColor: THEME_COLORS.background,
  },
  safeArea: {
    flex: 1,
    paddingTop: STATUSBAR_HEIGHT,
  },
  contentContainer: {
    flex: 1,
    paddingTop: HEADER_HEIGHT,
  },

  // Header styles
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: THEME_COLORS.background,
    borderBottomWidth: 0,
  },
  headerLeft: {
    flex: 1,
    ...theme.common.row,
  },
  backButton: {
    marginRight: 15,
    padding: 8,
    position: 'relative',
    zIndex: 20,
  },
  headerTitle: {
    color: THEME_COLORS.textPrimary,
    fontSize: 18,
    fontWeight: '700',
  },
  placeholderRight: {
    width: 40,
    height: 40,
  },
  headerButton: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    zIndex: 2,
  },
  nextButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: 'transparent',
    zIndex: 2,
  },
  nextButtonText: {
    color: THEME_COLORS.primary,
    fontSize: 15,
    fontWeight: '600',
  },
  nextButtonShare: {
    backgroundColor: THEME_COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    zIndex: 2,
  },
  nextButtonShareText: {
    color: THEME_COLORS.background,
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
    marginHorizontal: 10,
  },
  cropConfirmText: {
    color: THEME_COLORS.primary,
    fontSize: 16,
    fontWeight: '600',
  },

  // Media Section styles
  mediaSectionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: THEME_COLORS.cardLight,
    padding: 24,
  },
  mediaButton: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    borderRadius: 16,
    backgroundColor: THEME_COLORS.primary,
    shadowColor: THEME_COLORS.secondary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  mediaButtonText: {
    color: THEME_COLORS.background,
    marginTop: 12,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.3,
  },

  // Image Cropper styles
  cropperContainer: {
    flex: 1,
    backgroundColor: THEME_COLORS.background,
  },
  cropperHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: THEME_COLORS.cardLight,
  },
  cropperImage: {
    width: width,
    height: width,
    backgroundColor: THEME_COLORS.cardLight,
  },
  cropperTools: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: THEME_COLORS.cardLight,
  },
  cropperTool: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: THEME_COLORS.card,
    borderRadius: 8,
    shadowColor: THEME_COLORS.secondary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cropperToolText: {
    color: THEME_COLORS.textPrimary,
    fontSize: 12,
    marginTop: 4,
  },

  // Publication Form styles
  formContainer: {
    flex: 1,
    backgroundColor: THEME_COLORS.background,
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: THEME_COLORS.border,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 10,
    marginRight: 12,
  },
  headerText: {
    color: THEME_COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  inputContainer: {
    padding: theme.spacing.md,
  },
  titleInput: {
    color: THEME_COLORS.textPrimary,
    fontSize: 20,
    fontWeight: '600',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: THEME_COLORS.border,
    marginBottom: 16,
  },
  descriptionInput: {
    color: THEME_COLORS.textPrimary,
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
    backgroundColor: THEME_COLORS.card,
  },
  formContent: {
    padding: theme.spacing.md,
    paddingBottom: Platform.OS === 'ios' ? 34 : theme.spacing.md,
  },
  
  // Preview Image styles
  previewContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: THEME_COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  
  // Additional Options styles
  optionsContainer: {
    backgroundColor: THEME_COLORS.background,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: THEME_COLORS.border,
  },
  optionText: {
    color: THEME_COLORS.textPrimary,
    fontSize: 16,
  },
  optionValue: {
    color: THEME_COLORS.textSecondary,
    fontSize: 16,
  },

  // Error styles
  errorContainer: {
    padding: 16,
    backgroundColor: '#e74c3c',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
  },
  errorText: {
    color: THEME_COLORS.background,
    fontSize: 14,
    textAlign: 'center',
  },

  // Image Viewer styles
  imageViewerContainer: {
    flex: 1,
    backgroundColor: THEME_COLORS.background,
  },
  imageControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: THEME_COLORS.cardLight,
  },
  
  // Tag styles
  tagsContainer: {
    marginTop: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tagItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME_COLORS.cardLight,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    color: THEME_COLORS.textPrimary,
    marginRight: 6,
  },
  tagInputContainer: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: THEME_COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  tagInput: {
    color: THEME_COLORS.textPrimary,
    fontSize: 16,
    paddingVertical: 8,
  },
  addTagButton: {
    backgroundColor: THEME_COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-end',
    marginTop: 12,
  },
  addTagButtonText: {
    color: THEME_COLORS.background,
    fontWeight: '600',
  },
});

export default styles; 