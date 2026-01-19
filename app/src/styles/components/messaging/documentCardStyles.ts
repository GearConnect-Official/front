import { StyleSheet, Dimensions } from 'react-native';
import theme from '../../config/theme';

const { width: screenWidth } = Dimensions.get('window');
const MAX_CARD_WIDTH = screenWidth * 0.90;
const MIN_CARD_WIDTH = screenWidth * 0.70;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5F5F7',
    borderRadius: 16,
    padding: screenWidth * 0.03,
    marginVertical: theme.spacing.xs,
    maxWidth: MAX_CARD_WIDTH,
    minWidth: MIN_CARD_WIDTH,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    flexShrink: 0,
  },
  ownContainer: {
    backgroundColor: theme.colors.primary.main,
    borderColor: theme.colors.primary.main,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: '100%',
    flexWrap: 'nowrap',
  },
  iconContainer: {
    width: 50,
    minHeight: 50,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: screenWidth * 0.025,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
    flexShrink: 0,
    alignSelf: 'flex-start',
  },
  ownIconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  nameContainer: {
    width: '100%',
    flexShrink: 1,
  },
  documentInfo: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingRight: screenWidth * 0.025,
    marginRight: screenWidth * 0.015,
    minWidth: 0,
    flexShrink: 1,
    maxWidth: '100%',
  },
  documentName: {
    fontSize: screenWidth * 0.042,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: screenWidth * 0.01,
    lineHeight: screenWidth * 0.058,
    flexShrink: 1,
    includeFontPadding: false,
  },
  seeMoreButton: {
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  seeMoreText: {
    fontSize: screenWidth * 0.035,
    color: theme.colors.primary.main,
    fontWeight: '600',
  },
  ownSeeMoreText: {
    color: 'rgba(255, 255, 255, 0.9)',
  },
  ownDocumentName: {
    color: '#FFFFFF',
  },
  documentMeta: {
    gap: 4,
    marginTop: 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  documentType: {
    fontSize: screenWidth * 0.035,
    color: theme.colors.text.secondary,
    fontWeight: '500',
    flexShrink: 1,
  },
  ownDocumentType: {
    color: 'rgba(255, 255, 255, 0.9)',
  },
  documentSize: {
    fontSize: screenWidth * 0.035,
    color: theme.colors.text.secondary,
    fontWeight: '600',
    flexShrink: 1,
  },
  ownDocumentSize: {
    color: 'rgba(255, 255, 255, 0.9)',
  },
  actionsContainer: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: screenWidth * 0.015,
    width: 50,
    flexShrink: 0,
    marginLeft: screenWidth * 0.015,
    alignSelf: 'flex-start',
  },
  extensionBadge: {
    backgroundColor: theme.colors.grey[200],
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    minWidth: 30,
    alignItems: 'center',
  },
  ownExtensionBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  extensionText: {
    fontSize: screenWidth * 0.027,
    fontWeight: '700',
    color: theme.colors.text.secondary,
    letterSpacing: 0.5,
  },
  ownExtensionText: {
    color: 'rgba(255, 255, 255, 0.9)',
  },
  downloadButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  ownDownloadButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
});

export default styles;
