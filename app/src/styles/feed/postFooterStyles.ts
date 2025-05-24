import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  likesCount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#262626',
    marginBottom: 8,
  },
  captionContainer: {
    marginBottom: 8,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: '#262626',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#262626',
    lineHeight: 18,
    marginBottom: 2,
  },
  seeMore: {
    color: '#E10600',
    fontSize: 13,
    fontWeight: '500',
    marginTop: 2,
    marginBottom: 4,
  },
  usernameText: {
    fontWeight: '600',
  },
  commentsLink: {
    marginBottom: 8,
  },
  commentsLinkText: {
    fontSize: 14,
    color: '#8e8e8e',
  },
  timeAgo: {
    fontSize: 12,
    color: '#8e8e8e',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  tagText: {
    color: '#E10600',
    fontSize: 14,
    marginRight: 8,
    marginBottom: 4,
  },
  separator: {
    height: 1,
    backgroundColor: '#ececec',
    marginVertical: 16,
    borderRadius: 2,
  },
});

export default styles; 