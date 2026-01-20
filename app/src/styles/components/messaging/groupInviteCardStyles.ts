import { StyleSheet, Dimensions } from 'react-native';
import theme from '../../config/theme';

const { width: screenWidth } = Dimensions.get('window');
const MAX_CARD_WIDTH = screenWidth * 0.85;
const MIN_CARD_WIDTH = screenWidth * 0.70;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 12,
    marginVertical: 4,
    maxWidth: MAX_CARD_WIDTH,
    minWidth: MIN_CARD_WIDTH,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  ownContainer: {
    backgroundColor: theme.colors.primary.main,
    borderColor: theme.colors.primary.main,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: screenWidth * 0.12,
    height: screenWidth * 0.12,
    borderRadius: screenWidth * 0.06,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 2,
    borderColor: theme.colors.primary.main,
  },
  ownIconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderColor: '#FFFFFF',
  },
  infoContainer: {
    flex: 1,
  },
  groupName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  ownGroupName: {
    color: '#FFFFFF',
  },
  inviteText: {
    fontSize: 12,
    color: '#6A707C',
  },
  ownInviteText: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  joinButton: {
    backgroundColor: theme.colors.primary.main,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 40,
  },
  ownJoinButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  joinButtonDisabled: {
    opacity: 0.6,
  },
  joinButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  ownJoinButtonText: {
    color: '#FFFFFF',
  },
});

export default styles;
