import { StyleSheet } from "react-native";
import theme from "./config";

const styles = StyleSheet.create({
  container: {
    ...theme.common.container,
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
    alignItems: "center",
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
  },
  tabIcon: {
    justifyContent: "center",
    alignItems: "center",
  },
  tabText: {
    ...theme.typography.body1,
    textAlign: "center",
  },
  activeTab: {
    backgroundColor: theme.colors.primary.main,
    borderRadius: theme.borders.radius.lg - 2,
  },
  activeTabText: {
    color: theme.colors.common.white,
    fontWeight: "bold",
  },
  sectionTitle: {
    ...theme.typography.h5,
    color: theme.colors.text.primary,
    paddingHorizontal: theme.spacing.xs + 4,
    paddingVertical: theme.spacing.md,
  },
  jobItem: {
    ...theme.common.row,
    alignItems: "center",
    padding: theme.spacing.xs + 4,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.medium,
  },

  jobIconContainer: {
    width: 40,
    height: 40,
    borderRadius: theme.borders.radius.round,
    backgroundColor: theme.colors.grey[50],
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing.xs + 4,
  },

  jobContent: {
    flex: 1,
  },

  jobTitle: {
    ...theme.typography.subtitle1,
    color: theme.colors.text.primary,
  },

  jobSubtitle: {
    ...theme.typography.body2,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xxs,
  },

  jobType: {
    ...theme.typography.body2,
    fontWeight: "500",
    color: theme.colors.text.primary,
    textAlign: "right",
  },

  noJobsText: {
    textAlign: "center",
    ...theme.typography.body1,
    color: theme.colors.text.secondary,
    paddingVertical: theme.spacing.lg,
  },
});

export default styles;
