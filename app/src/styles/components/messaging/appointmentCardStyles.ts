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
  pastContainer: {
    opacity: 0.7,
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
  pastIconContainer: {
    opacity: 0.6,
  },
  eventInfo: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingRight: screenWidth * 0.025,
    marginRight: screenWidth * 0.015,
    minWidth: 0,
    flexShrink: 1,
    maxWidth: '100%',
  },
  eventTitle: {
    fontSize: screenWidth * 0.042,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: screenWidth * 0.015,
    lineHeight: screenWidth * 0.058,
    flexShrink: 1,
    includeFontPadding: false,
  },
  ownEventTitle: {
    color: '#FFFFFF',
  },
  eventDetails: {
    gap: 6,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 4,
  },
  detailText: {
    fontSize: screenWidth * 0.035,
    color: theme.colors.text.secondary,
    fontWeight: '500',
    flexShrink: 1,
    flex: 1,
  },
  ownDetailText: {
    color: 'rgba(255, 255, 255, 0.9)',
  },
  descriptionText: {
    fontStyle: 'italic',
  },
  pastBadge: {
    alignSelf: 'flex-start',
    marginTop: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: theme.colors.grey[300],
  },
  pastBadgeText: {
    fontSize: screenWidth * 0.03,
    fontWeight: '600',
    color: theme.colors.text.secondary,
  },
  ownPastBadgeText: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
});

export default styles;
