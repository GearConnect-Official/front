import { StyleSheet, Dimensions } from 'react-native';
import theme from './config';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.default,
  },
  animatedView: {
    flex: 1, 
    width: '100%'
  },
  spacerView: {
    width: theme.spacing.xl
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