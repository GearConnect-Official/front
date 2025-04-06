import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  captionContainer: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'flex-start',
    backgroundColor: '#121212',
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  captionInput: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  }
});

export default styles; 