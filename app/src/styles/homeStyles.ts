import { StyleSheet, Dimensions } from 'react-native';
import theme from './config';

const SCREEN_WIDTH = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 0.5,
    borderBottomColor: '#DBDBDB',
    zIndex: 1000,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 44,
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#262626',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    marginLeft: 20,
  },
  headerProfileImage: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#DBDBDB',
  },
  storiesList: {
    paddingVertical: 10,
  },
  storiesListContent: {
    paddingHorizontal: 8,
  },
  storyContainer: {
    alignItems: 'center',
    marginHorizontal: 8,
    width: 80,
  },
  storyRing: {
    width: 68,
    height: 68,
    borderRadius: 34,
    padding: 2,
    marginBottom: 4,
  },
  storyRingUnviewed: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#E1306C',
  },
  storyRingViewed: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#DBDBDB',
  },
  storyAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  storyUsername: {
    fontSize: 12,
    color: '#262626',
    textAlign: 'center',
  },
  separator: {
    height: 1,
    backgroundColor: '#EFEFEF',
  },
  postContainer: {
    marginBottom: 12,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  postHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
  },
  postUsername: {
    fontSize: 14,
    fontWeight: '600',
    color: '#262626',
  },
  postSingleImage: {
    width: '100%',
    height: undefined,
    aspectRatio: 1,
  },
  postMultipleImage: {
    width: 420,
    height: 420,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  postActionsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postAction: {
    marginRight: 16,
  },
  postFooter: {
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  likesCount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#262626',
    marginBottom: 4,
  },
  captionContainer: {
    marginBottom: 4,
  },
  caption: {
    fontSize: 14,
    fontWeight: '400',
    color: '#262626',
    lineHeight: 18,
  },
  captionUsername: {
    fontWeight: '600',
    color: '#262626',
  },
  commentsLink: {
    marginVertical: 4,
  },
  commentsLinkText: {
    fontSize: 14,
    color: '#8E8E8E',
  },
  postTime: {
    fontSize: 12,
    color: '#8E8E8E',
    marginTop: 4,
  },
  activityIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default styles;
