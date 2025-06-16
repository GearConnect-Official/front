import { StyleSheet, Dimensions } from 'react-native';
import theme from '../../config/theme';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.default,
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
    fontSize: 12,
    color: '#E10600',
    marginTop: 2,
  },
  moreButton: {
    padding: theme.spacing.sm,
  },
  messagesContainer: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: theme.spacing.sm,
    alignItems: 'flex-end',
  },
  ownMessageContainer: {
    justifyContent: 'flex-end',
  },
  avatarContainer: {
    marginRight: theme.spacing.sm,
  },
  messageAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  defaultMessageAvatar: {
    backgroundColor: theme.colors.background.input,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageBubble: {
    maxWidth: width * 0.75,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: 20,
  },
  otherMessageBubble: {
    backgroundColor: theme.colors.background.paper,
    borderBottomLeftRadius: 4,
  },
  ownMessageBubble: {
    backgroundColor: '#E10600',
    borderBottomRightRadius: 4,
  },
  messageWithoutAvatar: {
    marginLeft: 40, // Width of avatar + margin
  },
  messageText: {
    fontSize: 16,
    color: theme.colors.text.primary,
    lineHeight: 20,
  },
  ownMessageText: {
    color: 'white',
  },
  messageTime: {
    fontSize: 11,
    color: theme.colors.text.secondary,
    marginTop: 4,
    marginLeft: 40,
  },
  ownMessageTime: {
    textAlign: 'right',
    marginLeft: 0,
    marginRight: theme.spacing.sm,
  },
  inputContainer: {
    backgroundColor: theme.colors.background.paper,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: theme.colors.background.input,
    borderRadius: 25,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    minHeight: 45,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.text.primary,
    maxHeight: 100,
    marginRight: theme.spacing.sm,
  },
  sendButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.background.input,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonActive: {
    backgroundColor: '#E10600',
  },
});

export default styles; 