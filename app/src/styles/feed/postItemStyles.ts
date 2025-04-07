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
});

export default styles; 