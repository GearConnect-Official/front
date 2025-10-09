import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  productCard: {
    height: 150,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  deleteButton: {
    padding: 8,
    backgroundColor: '#ffebee',
    borderRadius: 20,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
  },
  emptyMessage: {
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 16,
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
    borderStyle: 'dashed',
  },
  horizontalContentContainer: {
    paddingLeft: 4,
    paddingRight: 16,
    paddingBottom: 16,
    paddingTop: 8,
    marginBottom: 10,
  },
  verticalContentContainer: {
    padding: 8,
    width: '100%',
  },
  productName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  productLink: {
    color: '#3a86ff',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});


// Export par défaut factice pour Expo Router
export default () => null;