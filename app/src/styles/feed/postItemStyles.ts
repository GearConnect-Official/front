import { StyleSheet, Dimensions } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
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
});

export default styles; 