import { StyleSheet } from 'react-native';
import theme from '../../config/theme';

const styles = StyleSheet.create({
  container: {
    ...theme.common.container,
  },
  loadingContainer: {
    ...theme.common.centerContent,
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
  },
  loadingText: {
    ...theme.typography.body1,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.md,
  },
  header: {
    ...theme.common.spaceBetween,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
    backgroundColor: theme.colors.background.paper,
  },
  backButton: {
    padding: theme.spacing.xs,
  },
  headerTitle: {
    ...theme.typography.h5,
    color: theme.colors.text.primary,
    flex: 1,
    textAlign: 'center',
  },
  headerActions: {
    ...theme.common.row,
    gap: theme.spacing.sm,
  },
  headerButton: {
    padding: theme.spacing.xs,
  },
  messagesList: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
  },
  messageItem: {
    ...theme.common.row,
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 0.5,
    borderBottomColor: theme.colors.border.light,
  },
  messageAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: theme.spacing.sm,
    backgroundColor: theme.colors.background.paper,
  },
  messageContent: {
    flex: 1,
  },
  messageHeader: {
    ...theme.common.row,
    alignItems: 'baseline',
    marginBottom: theme.spacing.xxs,
  },
  messageUsername: {
    ...theme.typography.caption,
    fontWeight: theme.typography.weights.semiBold,
    color: theme.colors.text.primary,
    marginRight: theme.spacing.xs,
  },
  messageInputContainer: {
    ...theme.common.row,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.grey[100],
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
  },
  messageInput: {
    flex: 1,
    backgroundColor: theme.colors.grey[100],
    borderRadius: theme.borders.radius.md,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    ...theme.typography.body1,
    color: theme.colors.text.primary,
    maxHeight: 100,
  },
  sendButton: {
    marginLeft: theme.spacing.xs,
    backgroundColor: theme.colors.primary.main,
    borderRadius: theme.borders.radius.round,
    padding: theme.spacing.xs,
    ...theme.common.centerContent,
  },
  membersButton: {
    ...theme.common.row,
    alignItems: 'center',
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.grey[100],
    borderRadius: theme.borders.radius.md,
    marginHorizontal: theme.spacing.md,
    marginVertical: theme.spacing.xs,
  },
  membersText: {
    ...theme.typography.body2,
    color: theme.colors.text.primary,
    marginLeft: theme.spacing.xs,
  },
  emptyContainer: {
    ...theme.common.centerContent,
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
  },
  emptyText: {
    ...theme.typography.body1,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginTop: theme.spacing.md,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: theme.colors.background.paper,
  },
  modalHeader: {
    ...theme.common.spaceBetween,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  modalTitle: {
    ...theme.typography.h5,
    color: theme.colors.text.primary,
  },
  modalCloseButton: {
    padding: theme.spacing.xs,
  },
  membersList: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
  },
  memberItem: {
    ...theme.common.row,
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 0.5,
    borderBottomColor: theme.colors.border.light,
  },
  memberAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: theme.spacing.sm,
    backgroundColor: theme.colors.grey[100],
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    ...theme.typography.subtitle1,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xxs,
  },
  memberRole: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
  },
  // Date separator styles
  dateSeparator: {
    ...theme.common.row,
    alignItems: 'center',
    marginVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
  },
  dateLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.border.light,
  },
  dateText: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
    marginHorizontal: theme.spacing.sm,
    fontSize: 11,
  },
  // System message styles
  systemMessage: {
    ...theme.common.row,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    marginVertical: theme.spacing.xs,
  },
  systemMessageText: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
    marginLeft: theme.spacing.xs,
    fontSize: 11,
  },
  systemMessageTime: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
    marginLeft: theme.spacing.xs,
    fontSize: 10,
  },
  // Message container styles
  messageContainer: {
    ...theme.common.row,
    marginVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    alignItems: 'flex-start',
  },
  ownMessageContainer: {
    justifyContent: 'flex-start', // Own messages on the left
  },
  otherMessageContainer: {
    justifyContent: 'flex-end', // Other messages on the right
    flexDirection: 'row-reverse', // Reverse order for right alignment
  },
  // Reply styles
  replyContainer: {
    ...theme.common.row,
    marginBottom: theme.spacing.xs,
    paddingLeft: theme.spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.primary.main,
  },
  ownReplyContainer: {
    borderLeftColor: 'rgba(255, 255, 255, 0.5)', // Lighter border for own messages
  },
  ownReplyText: {
    color: 'rgba(255, 255, 255, 0.9)', // Lighter text for own messages
  },
  replyLine: {
    width: 3,
    backgroundColor: theme.colors.primary.main,
    marginRight: theme.spacing.xs,
  },
  replyText: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
    fontSize: 11,
    flex: 1,
  },
  replyAuthor: {
    fontWeight: theme.typography.weights.semiBold,
    color: theme.colors.text.primary,
  },
  // Avatar styles
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  defaultAvatar: {
    backgroundColor: theme.colors.grey[200],
    ...theme.common.centerContent,
  },
  // Message body styles
  messageBody: {
    flex: 1,
    marginHorizontal: theme.spacing.xs,
  },
  ownMessageBody: {
    backgroundColor: '#E10600', // Rouge racing de l'app
    borderRadius: theme.borders.radius.md,
    padding: theme.spacing.sm,
    maxWidth: '75%',
  },
  senderName: {
    ...theme.typography.subtitle2,
    fontWeight: theme.typography.weights.semiBold,
    color: theme.colors.text.primary,
    marginRight: theme.spacing.xs,
  },
  ownSenderName: {
    color: theme.colors.common.white, // White text for own messages
  },
  editedLabel: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
    fontSize: 10,
    fontStyle: 'italic',
    marginLeft: theme.spacing.xs,
  },
  ownEditedLabel: {
    color: 'rgba(255, 255, 255, 0.8)', // Semi-transparent white for own messages
  },
  messageTextContainer: {
    marginTop: theme.spacing.xxs,
  },
  ownMessageTextContainer: {
    // No additional styling needed, text color handled by ownMessageText
  },
  messageText: {
    ...theme.typography.body1,
    color: theme.colors.text.primary,
    fontSize: 15,
    lineHeight: 20,
  },
  ownMessageText: {
    color: theme.colors.common.white, // White text for own messages
  },
  messageTime: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
    fontSize: 11,
    marginLeft: theme.spacing.xs,
  },
  ownMessageTime: {
    color: 'rgba(255, 255, 255, 0.8)', // Semi-transparent white for own messages
  },
  // Reactions styles
  reactionsContainer: {
    ...theme.common.row,
    flexWrap: 'wrap',
    marginTop: theme.spacing.xs,
    gap: theme.spacing.xs,
  },
  reactionButton: {
    ...theme.common.row,
    alignItems: 'center',
    backgroundColor: theme.colors.grey[100],
    borderRadius: theme.borders.radius.md,
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
  },
  reactionEmoji: {
    fontSize: 14,
    marginRight: 4,
  },
  reactionCount: {
    ...theme.typography.caption,
    color: theme.colors.text.primary,
    fontSize: 11,
    fontWeight: theme.typography.weights.medium,
  },
  addReactionButton: {
    ...theme.common.centerContent,
    width: 24,
    height: 24,
    backgroundColor: theme.colors.grey[100],
    borderRadius: theme.borders.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
  },
  // Channel info styles
  channelInfo: {
    ...theme.common.row,
    alignItems: 'center',
    flex: 1,
    marginLeft: theme.spacing.sm,
  },
  channelName: {
    ...theme.typography.h6,
    color: theme.colors.text.primary,
    marginLeft: theme.spacing.xs,
  },
  // Chat container
  chatContainer: {
    flex: 1,
  },
  // Reply preview styles
  replyPreview: {
    ...theme.common.row,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    backgroundColor: theme.colors.grey[50],
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
  },
  replyPreviewContent: {
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  replyPreviewLabel: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
    fontSize: 11,
    fontWeight: theme.typography.weights.semiBold,
  },
  replyPreviewText: {
    ...theme.typography.caption,
    color: theme.colors.text.primary,
    fontSize: 11,
    marginTop: 2,
  },
  // Input container
  inputContainer: {
    ...theme.common.row,
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.background.paper,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});

export default styles; 