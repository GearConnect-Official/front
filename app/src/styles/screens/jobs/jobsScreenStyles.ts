import { StyleSheet } from 'react-native';
import theme from '../../config/theme';

// Racing color palette pour Jobs
export const RACING_COLORS = {
  primary: '#E10600', // Racing Red
  secondary: '#1E1E1E', // Racing Black
  background: '#FFFFFF',
  textPrimary: '#1E1E1E',
  textSecondary: '#6E6E6E',
  card: '#F8F8F8',
  redLight: '#FF3333',
  redDark: '#CC0000',
};

export const jobsScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  scrollContent: {
    flex: 1,
  },
  topBar: {
    backgroundColor: RACING_COLORS.secondary,
    paddingVertical: theme.spacing.md,
  },
  topBarContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.lg,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topBarTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold,
    color: RACING_COLORS.background,
  },
  searchSection: {
    padding: theme.spacing.lg,
    backgroundColor: RACING_COLORS.background,
    borderBottomLeftRadius: theme.borders.radius.lg,
    borderBottomRightRadius: theme.borders.radius.lg,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.sm,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: theme.borders.radius.md,
    paddingHorizontal: theme.spacing.md,
    height: 45,
  },
  searchInput: {
    flex: 1,
    marginLeft: theme.spacing.sm,
    fontSize: theme.typography.sizes.md,
    color: RACING_COLORS.textPrimary,
  },
  searchInfo: {
    color: RACING_COLORS.textSecondary,
    fontSize: theme.typography.sizes.xs,
    marginTop: theme.spacing.xs,
    marginLeft: theme.spacing.xs,
  },
  tabGroup: {
    flexDirection: "row",
    backgroundColor: RACING_COLORS.background,
    marginHorizontal: theme.spacing.lg,
    borderRadius: theme.borders.radius.md,
    overflow: "hidden",
    height: 50,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.sm,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing.md,
  },
  activeTab: {
    backgroundColor: RACING_COLORS.primary,
  },
  tabIcon: {
    marginRight: theme.spacing.xs,
  },
  tabText: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.medium,
    color: RACING_COLORS.textPrimary,
  },
  activeTabText: {
    color: "#FFFFFF",
    fontWeight: theme.typography.weights.bold,
  },
  jobsSection: {
    paddingVertical: theme.spacing.sm,
    flex: 1,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.bold,
    color: RACING_COLORS.textPrimary,
  },
  jobCount: {
    fontSize: theme.typography.sizes.sm,
    color: RACING_COLORS.textSecondary,
  },
  loadingContainer: {
    padding: theme.spacing.xl * 2,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    color: RACING_COLORS.textSecondary,
    marginTop: theme.spacing.md,
    fontSize: theme.typography.sizes.sm,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing.xl * 2,
  },
  emptyText: {
    color: RACING_COLORS.textPrimary,
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.semiBold,
    marginTop: theme.spacing.lg,
  },
  emptySubtext: {
    color: RACING_COLORS.textSecondary,
    textAlign: "center",
    fontSize: theme.typography.sizes.sm,
    marginTop: theme.spacing.sm,
  },
});

// Default export to prevent Expo Router warnings
export { default } from '../../../NoRoute'; 