import { StyleSheet } from 'react-native';
import theme from './config';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.paper,
  },
  topBar: {
    backgroundColor: theme.colors.background.paper,
  },
  titleBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs + 4,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.grey[200],
  },
  title: {
    fontSize: theme.typography.h4.fontSize,
    fontWeight: theme.typography.h4.fontWeight,
    marginLeft: 12,
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
  },
  reviewContainer: {
    flex: 1,
    padding: 16,
  },
  ratingContainer: {
    marginBottom: 24,
  },
  ratingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10,
  },
  starButton: {
    marginHorizontal: 6,
  },
  textAreaContainer: {
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 12,
    backgroundColor: '#F9F9F9',
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  textArea: {
    minHeight: 150,
    fontSize: 16,
    color: '#333',
    padding: 8,
  },
  submitButton: {
    backgroundColor: '#3a86ff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    margin: 16,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  disabledButton: {
    backgroundColor: '#B0C4DE',
  },
  deleteButton: {
    padding: 8,
    borderRadius: 8,
    marginLeft: 'auto',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: theme.colors.grey[500],
    marginTop: 10,
  },
  errorText: {
    color: theme.colors.status.error,
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
  },
});

export default styles;