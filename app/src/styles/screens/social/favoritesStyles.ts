import { StyleSheet, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  
  // Header styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  
  backButton: {
    padding: 8,
    borderRadius: 20,
  },
  
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  
  headerSpacer: {
    width: 36, // Same width as back button for centering
  },
  
  // Loading states
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },
  
  // Error state
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 20,
  },
  
  reloadButton: {
    backgroundColor: '#FF5864',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  
  reloadButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Empty state
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333333',
    marginTop: 24,
    marginBottom: 12,
  },
  
  emptyStateDescription: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  
  goHomeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF5864',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  
  goHomeIcon: {
    marginRight: 8,
  },
  
  goHomeText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Footer loader
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  
  // Post list styles
  postSeparator: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 8,
  },
});

export default styles; 