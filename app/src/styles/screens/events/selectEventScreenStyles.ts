import { StyleSheet } from 'react-native';
import theme from '../../config/theme';

const selectEventScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
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
  },
  searchContainer: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border.medium,
    borderRadius: theme.borders.radius.sm,
    padding: theme.spacing.xxs,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    ...theme.typography.body1,
    color: theme.colors.text.primary,
    paddingHorizontal: theme.spacing.xs + 4,
  },
  searchIcon: {
    marginLeft: theme.spacing.xs,
    marginRight: theme.spacing.xs,
  },
  searchClearButton: {
    padding: theme.spacing.xs,
    marginLeft: theme.spacing.xs,
  },
  tabGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  tab: {
    flex: 1,
    flexDirection: "column",
    borderWidth: 1,
    borderColor: theme.colors.border.medium,
    borderRadius: theme.borders.radius.sm,
    paddingVertical: theme.spacing.xs,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: '#fff',
    marginHorizontal: theme.spacing.xxs / 2,
  },
  tabIcon: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  tabText: {
    ...theme.typography.body2,
    textAlign: "center",
  },
  activeTab: {
    backgroundColor: theme.colors.primary.main,
    borderRadius: 10,
    borderColor: theme.colors.primary.main,
  },
  activeTabText: {
    color: theme.colors.common.white,
    fontWeight: "bold",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: theme.spacing.lg,
  },
  eventsList: {
    paddingHorizontal: theme.spacing.md,
  },
  loadingText: {
    ...theme.typography.body1,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.md,
  },
  primaryButton: {
    backgroundColor: theme.colors.primary.main,
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.md,
  },
  primaryButtonText: {
    color: '#fff',
    ...theme.typography.button,
    fontWeight: 'bold',
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  emptyContainer: {
    padding: theme.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: theme.spacing.lg,
  },
  emptyText: {
    ...theme.typography.h6,
    color: theme.colors.text.primary,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xs,
  },
  emptySubtext: {
    ...theme.typography.body1,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  errorContainer: {
    padding: theme.spacing.lg,
    alignItems: "center",
  },
  errorText: {
    ...theme.typography.body1,
    color: theme.colors.status.error,
    marginBottom: theme.spacing.xs + 2,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: theme.colors.primary.main,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xs + 2,
    borderRadius: theme.borders.radius.sm,
    marginTop: theme.spacing.md,
  },
  retryButtonText: {
    color: theme.colors.common.white,
    ...theme.typography.button,
  },
});

export default selectEventScreenStyles;
