import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  animatedView: {
    flex: 1, 
    width: '100%'
  },
  spacerView: {
    width: 24
  },
  animatedImage: {
    transform: []
  },
  cropFrameSquare: {
    aspectRatio: 1
  },
  cropFramePortrait: {
    aspectRatio: 4/5
  },
  transformContainer: {
    // Cette propriété sera étendue dynamiquement avec les transformations du pan
  }
});

export default styles; 