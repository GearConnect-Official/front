import { StyleSheet } from 'react-native';
import theme from '../config/theme';

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
  transformContainer: {
    // This property will be dynamically extended with pan transformations
  }
});

export default styles; 