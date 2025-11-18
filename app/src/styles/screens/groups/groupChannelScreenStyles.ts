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
  messageTime: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
    fontSize: 11,
  },
  messageText: {
    ...theme.typography.body2,
    color: theme.colors.text.primary,
    lineHeight: 18,
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
});

export default styles; 