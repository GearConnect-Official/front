import { StyleSheet, Dimensions } from 'react-native';
import theme from '../../config/theme';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.grey[50], // Fond clair de l'app
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingTop: 60,
    paddingBottom: theme.spacing.md,
    backgroundColor: theme.colors.background.paper,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  backButton: {
    padding: theme.spacing.sm,
    marginRight: theme.spacing.sm,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  headerSubtitle: {
    fontSize: 13,
    color: theme.colors.primary.main,
    marginTop: 2,
  },
  moreButton: {
    padding: theme.spacing.sm,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerActionButton: {
    padding: theme.spacing.xs,
    marginLeft: theme.spacing.sm,
  },
  messagesContainer: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.sm,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
  },
  loadingText: {
    marginTop: theme.spacing.md,
    fontSize: 14,
    color: theme.colors.text.secondary,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacing.xl * 2,
  },
  emptyStateText: {
    marginTop: theme.spacing.md,
    fontSize: 14,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 1,
    paddingHorizontal: theme.spacing.xs,
    alignItems: 'flex-end',
    width: '100%',
  },
  ownMessageContainer: {
    justifyContent: 'flex-start', // Own messages on the left
    flexDirection: 'row',
  },
  otherMessageContainer: {
    justifyContent: 'flex-end', // Other messages on the right
    flexDirection: 'row',
  },
  newMessageGroup: {
    marginTop: 8,
  },
  // Avatar containers for own messages (left side)
  ownAvatarContainer: {
    width: 32,
    height: 32,
    marginRight: theme.spacing.xs,
    marginBottom: 2,
    alignSelf: 'flex-end',
  },
  ownAvatarSpacer: {
    width: 32,
    height: 32,
    marginRight: theme.spacing.xs,
    marginBottom: 2,
    alignSelf: 'flex-end',
  },
  // Avatar containers for other messages (right side)
  otherAvatarContainer: {
    width: 32,
    height: 32,
    marginLeft: theme.spacing.xs,
    marginBottom: 2,
    alignSelf: 'flex-end',
  },
  otherAvatarSpacer: {
    width: 32,
    height: 32,
    marginLeft: theme.spacing.xs,
    marginBottom: 2,
    alignSelf: 'flex-end',
  },
  messageAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.background.input,
  },
  defaultMessageAvatar: {
    backgroundColor: '#D9D9D9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageBubble: {
    maxWidth: width * 0.75,
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  groupedMessage: {
    marginTop: 2,
  },
  messageTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 4,
    paddingTop: 2,
  },
  otherMessageBubble: {
    backgroundColor: theme.colors.background.paper,
    // WhatsApp-style bubble shape: rounded corners with tail pointing to avatar
    // For messages on the right, tail points to right avatar (bottom-right corner)
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 4, // Tail effect - less rounded corner pointing to right avatar
    alignSelf: 'flex-end', // Other messages on the right
  },
  ownMessageBubble: {
    backgroundColor: '#E10600', // Rouge racing de l'app
    // WhatsApp-style bubble shape: rounded corners with tail pointing to avatar
    // For messages on the left, tail points to left avatar (bottom-left corner)
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderBottomLeftRadius: 4, // Tail effect - less rounded corner pointing to left avatar
    borderBottomRightRadius: 18,
    alignSelf: 'flex-start', // Own messages on the left
  },
  messageWithoutAvatar: {
    marginLeft: 0,
  },
  senderName: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  ownSenderName: {
    color: theme.colors.common.white, // White text for own messages
  },
  messageText: {
    fontSize: 15,
    color: theme.colors.text.primary,
    lineHeight: 20,
    letterSpacing: 0.2,
  },
  ownMessageText: {
    color: theme.colors.common.white,
  },
  messageTime: {
    fontSize: 11,
    color: theme.colors.text.secondary,
    marginLeft: 0,
    paddingLeft: 4,
  },
  ownMessageTime: {
    color: 'rgba(255, 255, 255, 0.8)',
    marginLeft: 0,
    paddingLeft: 4,
  },
  inputContainer: {
    backgroundColor: theme.colors.grey[100],
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
    paddingHorizontal: theme.spacing.sm,
    paddingTop: theme.spacing.xs,
    paddingBottom: theme.spacing.xl,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background.paper,
    borderRadius: 21,
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: 4,
    minHeight: 42,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
  },
  attachButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.xs,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: theme.colors.text.primary,
    maxHeight: 100,
    marginRight: theme.spacing.xs,
    paddingVertical: 8,
    paddingHorizontal: theme.spacing.xs,
    textAlignVertical: 'center',
  },
  sendButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#E10600',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonActive: {
    backgroundColor: '#E10600',
  },
  microphoneButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default styles; 