import { StyleSheet, Platform } from 'react-native';
import theme from '../../config/theme';

const myCreatedEventsStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 0,
    height: 56,
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    ...theme.typography.h5,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    flex: 1,
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  emptyText: {
    ...theme.typography.h6,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.md,
    textAlign: 'center',
  },
  statsContainer: {
    padding: theme.spacing.md,
    backgroundColor: '#f5f5f5',
    marginBottom: theme.spacing.sm,
  },
  statsText: {
    ...theme.typography.body1,
    color: theme.colors.text.primary,
  },
  warningText: {
    ...theme.typography.body1,
    color: '#F59E0B',
    fontWeight: '600',
    marginTop: theme.spacing.xs,
  },
  eventsList: {
    paddingBottom: theme.spacing.lg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default myCreatedEventsStyles;
