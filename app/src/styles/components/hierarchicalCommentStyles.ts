import { StyleSheet } from 'react-native';

export const hierarchicalCommentStyles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  commentContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  threadLine: {
    position: 'absolute',
    left: 16,
    top: 32,
    bottom: -16,
    width: 2,
    backgroundColor: '#e1e8ed',
  },
  contentContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  username: {
    fontWeight: '600',
    fontSize: 14,
    color: '#14171a',
    marginRight: 8,
  },
  timestamp: {
    fontSize: 12,
    color: '#657786',
  },
  content: {
    fontSize: 14,
    color: '#14171a',
    lineHeight: 18,
    marginBottom: 8,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 4,
    paddingVertical: 2,
  },
  actionText: {
    fontSize: 12,
    color: '#657786',
    marginLeft: 4,
  },
  disabledText: {
    color: '#ccc',
  },
  likedText: {
    color: '#e91e63',
  },
  showRepliesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingVertical: 4,
  },
  repliesIndicator: {
    width: 16,
    height: 2,
    backgroundColor: '#1da1f2',
    marginRight: 8,
  },
  showRepliesText: {
    fontSize: 12,
    color: '#1da1f2',
    fontWeight: '500',
    marginRight: 4,
  },
  repliesContainer: {
    marginTop: 8,
    paddingLeft: 0,
  },
}); 

// Export par défaut factice pour Expo Router
export default () => null;