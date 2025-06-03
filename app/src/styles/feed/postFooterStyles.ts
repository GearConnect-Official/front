import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingBottom: 16,
  },
  
  // Likes Section
  likesCount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#262626',
    marginBottom: 8,
  },
  
  // Title Section
  titleContainer: {
    marginBottom: 6,
  },
  titleText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#262626',
    lineHeight: 20,
  },
  
  // Description Section
  descriptionContainer: {
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#262626',
    lineHeight: 18,
  },
  seeMoreText: {
    fontSize: 14,
    color: '#8E8E8E',
    fontWeight: '500',
  },
  
  // Tags Section
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
    alignItems: 'center',
  },
  tagPill: {
    backgroundColor: '#F0F2F5',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 6,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#E4E6EA',
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1877F2',
  },
  moreTagsText: {
    fontSize: 12,
    color: '#8E8E8E',
    fontWeight: '500',
    marginLeft: 4,
  },
  
  // Comments Section
  commentsLink: {
    marginBottom: 8,
  },
  commentsLinkText: {
    fontSize: 14,
    color: '#8E8E8E',
    fontWeight: '500',
  },
  
  // Time Section
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  timeAgo: {
    fontSize: 12,
    color: '#8E8E8E',
    fontWeight: '400',
    marginLeft: 4,
  },
});

export default styles; 