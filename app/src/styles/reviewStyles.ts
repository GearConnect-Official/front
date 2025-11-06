import { StyleSheet } from 'react-native';
import theme, { colors, spacing, typography, shadows } from './config';

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
    backgroundColor: colors.background.paper,
    ...shadows.apply({}, 'topBar'),
    minHeight: spacing.height.toolbar,
  },
  titleBar: {
    ...theme.common.spaceBetween,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  title: {
    fontSize: typography.h4.fontSize,
    fontWeight: typography.h4.fontWeight,
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
  characterCounter: {
    textAlign: 'right',
    fontSize: 12,
    color: '#666',
    marginTop: 5,
    marginRight: 10,
  },

  // Button Styles
  submitButton: {
    backgroundColor: colors.primary.main,
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
    backgroundColor: colors.grey[300],
  },
  deleteButton: {
    padding: 8,
    borderRadius: 8,
    // marginLeft: 'auto',
  },

  // Status Styles
  loadingText: {
    fontSize: 16,
    color: colors.grey[500],
    marginTop: 10,
  },
  errorText: {
    color: colors.status.error,
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
  },
});

export default styles;
