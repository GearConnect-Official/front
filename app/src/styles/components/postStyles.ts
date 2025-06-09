import { StyleSheet } from 'react-native';
import theme from '../config/theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background.paper,
    borderRadius: theme.borders.radius.sm,
    ...theme.borders.apply({}, { 
      width: 1, 
      color: theme.colors.border.medium 
    }),
    marginBottom: theme.spacing.xs,
  },
  userContainer: {
    ...theme.common.spaceBetween,
    padding: theme.spacing.xs,
    alignItems: "center",
  },
  avatarContainer: {
    ...theme.common.row,
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: theme.borders.radius.round,
  },
  userName: {
    ...theme.typography.subtitle1,
    color: theme.colors.text.primary,
  },
  userInfo: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
  },
  moreButton: {
    padding: theme.spacing.xs,
  },
  imageContainer: {
    width: "100%",
    height: 325,
  },
  contentImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  contentContainer: {
    padding: theme.spacing.xs + 4,
  },
  contentText: {
    ...theme.typography.body2,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  hashtagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.xs - 2,
    marginBottom: theme.spacing.xs,
  },
  hashtagPill: {
    backgroundColor: theme.colors.grey[50],
    borderRadius: theme.borders.radius.xs - 2,
    ...theme.borders.apply({}, { 
      width: 1, 
      color: theme.colors.border.medium 
    }),
    paddingHorizontal: theme.spacing.xxs,
    paddingVertical: theme.spacing.xxs - 2,
  },
  hashtagText: {
    ...theme.typography.caption,
    color: theme.colors.text.primary,
  },
  interactionContainer: {
    ...theme.common.row,
    gap: theme.spacing.xs + 2,
    paddingLeft: theme.spacing.xs - 2,
    marginTop: theme.spacing.xs,
  },
  interactionButton: {
    padding: theme.spacing.xxs,
  },
});

export default styles; 