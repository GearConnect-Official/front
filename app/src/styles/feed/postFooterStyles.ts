import { StyleSheet } from 'react-native';
import theme from "../config/theme";

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  
  // Likes Section
  likesCount: {
    ...theme.typography.body2,
    fontWeight: theme.typography.weights.semiBold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xxs,
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
    marginBottom: theme.spacing.xxs,
  },
  commentsLinkText: {
    ...theme.typography.body2,
    color: theme.colors.text.secondary,
  },
  
  // Time Section
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.xxs,
  },
  timeAgo: {
    ...theme.typography.body2,
    color: theme.colors.text.secondary,
  },
  
  caption: {
    marginBottom: theme.spacing.xxs,
  },
  captionText: {
    ...theme.typography.body1,
    color: theme.colors.text.primary,
    lineHeight: 18,
  },
  username: {
    fontWeight: theme.typography.weights.semiBold,
  },
  viewComments: {
    marginBottom: theme.spacing.xxs,
  },
  viewCommentsText: {
    ...theme.typography.body2,
    color: theme.colors.text.secondary,
  },
  addComment: {
    ...theme.common.row,
    alignItems: "center",
    paddingVertical: theme.spacing.xs,
  },
  commentInputContainer: {
    flex: 1,
    backgroundColor: theme.colors.background.default,
    borderRadius: theme.borders.radius.lg,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    marginLeft: theme.spacing.xs,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
  },
  commentInput: {
    ...theme.typography.caption,
    color: theme.colors.primary.main,
    maxHeight: 40,
  },
  postButton: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
    marginLeft: theme.spacing.xs,
  },
  actionButtons: {
    ...theme.common.row,
    alignItems: "center",
    paddingVertical: theme.spacing.xs,
  },
  actionButton: {
    marginRight: theme.spacing.lg,
  },
  likeButton: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
  },
});

export default styles; 