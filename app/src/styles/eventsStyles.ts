import { StyleSheet } from "react-native";
import theme from "./config";

const styles = StyleSheet.create({
  container: {
    ...theme.common.container,
    maxWidth: 480,
    width: "100%",
    marginLeft: "auto",
    marginRight: "auto",
  },
  scrollView: {
    flex: 1,
  },
  topBar: {
    backgroundColor: theme.colors.background.paper,
    ...theme.shadows.apply({}, 'topBar'),
    minHeight: theme.spacing.height.toolbar,
  },
  topBarContent: {
    ...theme.common.spaceBetween,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
  },
  topBarTitle: {
    ...theme.typography.h4,
    color: theme.colors.text.primary,
  },
  topBarIcon: {
    width: 24,
    height: 24,
  },
  topBarIcons: {
    ...theme.common.row,
    gap: theme.spacing.lg,
  },
  title: {
    ...theme.typography.h4,
    color: theme.colors.text.primary,
  },
  searchSection: {
    padding: theme.spacing.xs + 4,
  },
  searchBar: {
    ...theme.common.row,
    ...theme.borders.apply({}, { 
      width: 1, 
      color: theme.colors.border.medium, 
      radius: 'sm' 
    }),
    padding: theme.spacing.xxs,
  },
  searchInput: {
    flex: 1,
    ...theme.typography.body1,
    color: theme.colors.text.primary,
    paddingHorizontal: theme.spacing.xs + 4,
  },
  searchButton: {
    backgroundColor: theme.colors.primary.main,
    borderRadius: theme.borders.radius.xs,
    padding: theme.spacing.xs,
    justifyContent: "center",
    alignItems: "center",
  },
  searchIcon: {
    width: 20,
    height: 20,
  },
  searchInfo: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xxs,
  },
  tabGroup: {
    ...theme.common.row,
    paddingHorizontal: theme.spacing.xs + 4,
    marginTop: theme.spacing.xs + 4,
    gap: theme.spacing.xs,
  },
  tab: {
    flex: 1,
    flexDirection: "column",
    ...theme.borders.apply({}, { 
      width: 1, 
      color: theme.colors.border.medium, 
      radius: 'sm' 
    }),
    paddingVertical: theme.spacing.xs,
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.xxs,
  },

  tabIcon: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },

  tabText: {
    ...theme.typography.body1,
    textAlign: "center",
  },
  sectionTitle: {
    ...theme.typography.h5,
    color: theme.colors.text.primary,
    paddingHorizontal: theme.spacing.xs + 4,
    paddingTop: theme.spacing.md,
  },
  eventItem: {
    ...theme.common.row,
    alignItems: "center",
    padding: theme.spacing.xs + 4,
    gap: theme.spacing.xs,
  },
  eventIcon: {
    width: 32,
    height: 32,
    borderRadius: theme.borders.radius.round,
  },
  eventContent: {
    flex: 1,
  },
  eventTitle: {
    ...theme.typography.subtitle1,
    color: theme.colors.text.primary,
  },
  eventSubtitle: {
    ...theme.typography.body2,
    color: theme.colors.text.secondary,
  },
  eventDate: {
    ...theme.typography.body2,
    fontWeight: "500",
    color: theme.colors.text.primary,
    textAlign: "right",
  },
  emojiContainer: {
    width: 32,
    height: 32,
    borderRadius: theme.borders.radius.round,
    backgroundColor: theme.colors.grey[50],
    alignItems: "center",
    justifyContent: "center",
  },
  emojiText: {
    fontSize: 20,
  },
  activeTab: {
    backgroundColor: theme.colors.primary.main,
    borderRadius: theme.borders.radius.lg - 2,
  },

  activeTabText: {
    color: theme.colors.common.white,
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    ...theme.common.centerContent,
    padding: theme.spacing.lg,
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
  },
  retryButtonText: {
    color: theme.colors.common.white,
    ...theme.typography.button,
  },
});

export default styles;
