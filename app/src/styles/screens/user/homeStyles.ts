import { StyleSheet, Dimensions } from 'react-native';
import theme from '../../config/theme';

const SCREEN_WIDTH = Dimensions.get('window').width;

const styles = StyleSheet.create({
  safeArea: {
    ...theme.common.container,
  },
  header: {
    height: 56,
    ...theme.common.spaceBetween,
    paddingHorizontal: theme.spacing.sm + 3,
    backgroundColor: theme.colors.background.paper,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
    zIndex: 10,
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    ...theme.common.row,
  },
  headerIconBtn: {
    padding: theme.spacing.xs,
    marginLeft: theme.spacing.xs,
    position: 'relative',
  },
  notificationButton: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#E10600',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
    borderWidth: 2,
    borderColor: theme.colors.background.paper,
    zIndex: 1000,
    elevation: 10, // For Android shadow
    shadowColor: '#000', // For iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  notificationBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    lineHeight: 12,
  },
  profileImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  appTitle: {
    ...theme.typography.h2,
    color: theme.colors.text.primary,
  },
  storiesContainer: {
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  storiesList: {
    paddingHorizontal: theme.spacing.xs,
  },
  storyItem: {
    ...theme.common.centerContent,
    marginHorizontal: theme.spacing.xs,
  },
  storyRing: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2,
    padding: 2,
    marginBottom: theme.spacing.xxs,
  },
  storyRingUnviewed: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: theme.colors.primary.main,
  },
  storyRingViewed: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: theme.colors.grey[300],
  },
  storyAvatar: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
  },
  storyUsername: {
    ...theme.typography.caption,
    color: theme.colors.text.primary,
    marginTop: theme.spacing.xxs,
  },
  dateSeperatorContainer: {
    ...theme.common.row,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
  },
  dateSeparatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.border.light,
  },
  dateSeparatorText: {
    ...theme.typography.body2,
    color: theme.colors.text.secondary,
    marginHorizontal: theme.spacing.xs,
  },
  footerLoader: {
    paddingVertical: theme.spacing.md,
    ...theme.common.centerContent,
  },
  loadingContainer: {
    ...theme.common.centerContent,
    flex: 1,
    backgroundColor: theme.colors.background.paper,
  },
  errorContainer: {
    ...theme.common.centerContent,
    flex: 1,
    backgroundColor: theme.colors.background.paper,
    padding: theme.spacing.lg,
  },
  networkErrorContainer: {
    ...theme.common.centerContent,
    flex: 1,
    backgroundColor: theme.colors.background.paper,
    padding: theme.spacing.lg,
  },
  networkErrorTitle: {
    ...theme.typography.h4,
    color: theme.colors.text.primary,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xs,
    textAlign: 'center',
  },
  networkErrorDescription: {
    ...theme.typography.body1,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: theme.spacing.xl,
    maxWidth: '85%',
  },
  errorText: {
    ...theme.typography.body1,
    color: theme.colors.text.primary,
    textAlign: 'center',
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  reloadButton: {
    backgroundColor: theme.colors.primary.main,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borders.radius.xs,
  },
  reloadButtonText: {
    ...theme.typography.button,
    color: theme.colors.common.white,
  },
  // Styles pour l'état vide
  emptyStateContainer: {
    ...theme.common.centerContent,
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xxxl,
    backgroundColor: theme.colors.background.paper,
  },
  emptyStateTitle: {
    ...theme.typography.h4,
    color: theme.colors.text.primary,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xs,
  },
  emptyStateDescription: {
    ...theme.typography.body1,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  createPostButton: {
    ...theme.common.row,
    backgroundColor: theme.colors.primary.main,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borders.radius.xs,
  },
  createPostIcon: {
    marginRight: theme.spacing.xs,
  },
  createPostText: {
    ...theme.typography.button,
    color: theme.colors.common.white,
  },
  postContainer: {
    marginBottom: theme.spacing.sm,
  },
  postHeader: {
    ...theme.common.spaceBetween,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs + 2,
  },
  postHeaderLeft: {
    ...theme.common.row,
  },
  postAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: theme.spacing.xs + 2,
  },
  postUsername: {
    ...theme.typography.body2,
    fontWeight: theme.typography.weights.semiBold,
    color: theme.colors.text.primary,
  },
  postSingleImage: {
    width: '100%',
    height: undefined,
    aspectRatio: 1,
  },
  postMultipleImage: {
    width: SCREEN_WIDTH,
    height: undefined,
    aspectRatio: 1,
  },
  postActions: {
    ...theme.common.spaceBetween,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs + 2,
  },
  postActionsLeft: {
    ...theme.common.row,
  },
  postAction: {
    marginRight: theme.spacing.md,
  },
  postFooter: {
    paddingHorizontal: theme.spacing.sm,
    paddingBottom: theme.spacing.sm,
  },
  likesCount: {
    ...theme.typography.body2,
    fontWeight: theme.typography.weights.semiBold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xxs,
  },
  captionContainer: {
    marginBottom: theme.spacing.xxs,
  },
  caption: {
    ...theme.typography.body2,
    color: theme.colors.text.primary,
    lineHeight: 18,
  },
  usernameText: {
    fontWeight: theme.typography.weights.semiBold,
    color: theme.colors.text.primary,
  },
  commentsLink: {
    marginVertical: theme.spacing.xxs,
  },
  commentsLinkText: {
    ...theme.typography.body2,
    color: theme.colors.text.secondary,
  },
  timeAgo: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xxs,
  },
  activityIndicator: {
    ...theme.common.centerContent,
    flex: 1,
  },
  // Styles pour les icônes
  networkErrorIcon: {
    width: 60,
    height: 60,
    color: theme.colors.primary.main,
  },
  warningIcon: {
    width: 50,
    height: 50,
    color: theme.colors.primary.main,
  },
});

export default styles;
