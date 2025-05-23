import { StyleSheet } from 'react-native';
import theme from './config';

const styles = StyleSheet.create({
  // Layout and Container Styles
  container: {
    ...theme.common.container,
    flex: 1,
    maxWidth: 480,
    width: '100%',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reviewContainer: {
    flex: 1,
    padding: 16,
  },

  // Header Styles
  topBar: {
    backgroundColor: theme.colors.background.paper,
    ...theme.shadows.apply({}, 'topBar'),
    minHeight: theme.spacing.height.toolbar,
  },
  titleBar: {
    ...theme.common.spaceBetween,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
  },
  title: {
    fontSize: theme.typography.h4.fontSize,
    fontWeight: theme.typography.h4.fontWeight,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Rating Styles
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

  // Review Text Area Styles
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

  // Button Styles
  submitButton: {
    backgroundColor: theme.colors.primary.main,
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
    backgroundColor: theme.colors.grey[300],
  },
  deleteButton: {
    padding: 8,
    borderRadius: 8,
    // marginLeft: 'auto',
  },

  // Status Styles
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
