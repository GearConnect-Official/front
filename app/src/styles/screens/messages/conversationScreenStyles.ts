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
    position: 'relative',
  },
  callMenuOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  callMenu: {
    position: 'absolute',
    top: 70,
    right: theme.spacing.md,
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    minWidth: 200,
    zIndex: 1001,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  callMenuItem: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  callMenuItemLast: {
    borderBottomWidth: 0,
  },
  callMenuText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  // Attachment menu styles
  attachmentMenuOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    backgroundColor: 'transparent',
  },
  attachmentMenu: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#000000',
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
    paddingHorizontal: theme.spacing.md,
    zIndex: 1001,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  attachmentMenuKeyboardButton: {
    alignSelf: 'flex-end',
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  attachmentGrid: {
    paddingVertical: theme.spacing.sm,
  },
  attachmentRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: theme.spacing.lg,
  },
  attachmentOption: {
    alignItems: 'center',
    width: width / 4 - theme.spacing.md,
  },
  attachmentIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  attachmentLabel: {
    color: '#FFFFFF',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
  messagesContainer: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.sm,
    flexGrow: 1,
  },
  messagesList: {
    flex: 1,
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
  messageWrapper: {
    width: '100%',
  },
  highlightedMessage: {
    backgroundColor: 'rgba(225, 6, 0, 0.2)',
    borderRadius: 8,
    padding: 4,
    marginHorizontal: -4,
    marginVertical: 2,
    animation: 'fadeOut 1s ease-out',
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
    justifyContent: 'space-between',
    alignItems: 'center',
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
  audioDuration: {
    marginRight: 'auto',
    paddingLeft: 0,
    paddingRight: 4,
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
    position: 'relative',
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
  // Reply preview styles (in input area)
  replyPreviewContainer: {
    backgroundColor: theme.colors.grey[100],
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
    paddingHorizontal: Math.max(theme.spacing.sm, width * 0.04),
    paddingVertical: theme.spacing.xs,
    zIndex: 1, // Lower than audio player
    pointerEvents: 'box-none', // Allow touches to pass through to audio player
  },
  replyPreviewWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.background.paper,
    borderRadius: theme.borders.radius.sm,
    padding: theme.spacing.xs,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.primary.main,
    maxWidth: '100%',
    minWidth: 0, // Allow shrinking
  },
  replyPreviewLeft: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    minWidth: 0, // Allow shrinking
    flexShrink: 1,
  },
  replyPreviewLine: {
    width: 3,
    height: '100%',
    backgroundColor: theme.colors.primary.main,
    marginRight: theme.spacing.xs,
    borderRadius: 2,
    flexShrink: 0,
  },
  replyPreviewInfo: {
    flex: 1,
    minWidth: 0, // Allow shrinking
    flexShrink: 1,
  },
  replyPreviewName: {
    fontSize: Math.max(12, width * 0.032),
    fontWeight: '600',
    color: theme.colors.primary.main,
    marginBottom: 2,
    flexShrink: 1,
  },
  replyPreviewMessage: {
    fontSize: Math.max(11, width * 0.03),
    color: theme.colors.text.secondary,
    flexShrink: 1,
  },
  replyPreviewClose: {
    padding: theme.spacing.xs,
    marginLeft: theme.spacing.xs,
    flexShrink: 0,
  },
  // Reply preview styles (inside message bubble) - clickable
  replyPreview: {
    pointerEvents: 'auto', // Allow interaction with reply preview itself
    flexDirection: 'row',
    marginBottom: theme.spacing.xs,
    paddingBottom: theme.spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 4,
    padding: Math.max(theme.spacing.xs, width * 0.02),
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    maxWidth: '100%',
    minWidth: 0, // Allow shrinking
    alignSelf: 'flex-start',
  },
  ownReplyPreview: {
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  replyLine: {
    width: Math.max(2, width * 0.008),
    minHeight: 20,
    backgroundColor: theme.colors.primary.main,
    marginRight: Math.max(theme.spacing.xs, width * 0.02),
    borderRadius: 2,
    flexShrink: 0,
  },
  ownReplyLine: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  replyPreviewContent: {
    flex: 1,
    minWidth: 0, // Allow shrinking
    flexShrink: 1,
  },
  replyAuthor: {
    fontSize: Math.max(11, width * 0.028),
    fontWeight: '600',
    color: theme.colors.primary.main,
    marginBottom: 2,
    flexShrink: 1,
  },
  ownReplyAuthor: {
    color: 'rgba(255, 255, 255, 0.9)',
  },
  replyPreviewText: {
    fontSize: Math.max(10, width * 0.026),
    color: theme.colors.text.secondary,
    flexShrink: 1,
  },
  ownReplyPreviewText: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  // System message styles (centered)
  systemMessageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    marginVertical: theme.spacing.xs,
  },
  systemMessageText: {
    fontSize: Math.max(12, width * 0.03),
    color: theme.colors.text.secondary,
    textAlign: 'center',
    fontStyle: 'italic',
    backgroundColor: theme.colors.grey[100],
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borders.radius.md,
    overflow: 'hidden',
  },
  scrollToBottomButton: {
    position: 'absolute',
    bottom: 100,
    right: theme.spacing.md,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1000,
  },
});

export default styles; 