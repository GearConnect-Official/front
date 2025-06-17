import { StyleSheet, Dimensions } from 'react-native';
import theme from "../config/theme";

const SCREEN_WIDTH = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background.paper,
    marginBottom: theme.spacing.xs,
  },
  header: {
    ...theme.common.row,
    alignItems: "center",
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: theme.spacing.xs,
  },
  username: {
    ...theme.typography.body2,
    fontWeight: theme.typography.weights.semiBold,
    color: theme.colors.primary.main,
    flex: 1,
  },
  timestamp: {
    ...theme.typography.caption,
    color: theme.colors.common.white,
  },
  postSingleImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH,
  },
  postMultipleImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  tagText: {
    color: '#E10600',
    fontSize: 14,
    marginRight: 8,
    marginBottom: 4,
  },
  videoIndicator: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  videoIndicatorText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
});

export default styles; 