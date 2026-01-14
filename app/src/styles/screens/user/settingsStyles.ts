import { StyleSheet, Dimensions, Platform, StatusBar } from "react-native";
import theme from "../../config/theme";

const { width } = Dimensions.get("window");
const STATUSBAR_HEIGHT =
  Platform.OS === "ios" ? 44 : StatusBar.currentHeight || 0;
const HEADER_HEIGHT = 56 + STATUSBAR_HEIGHT;

// Color constants extracted from theme for direct use in the component
export const colors = {
  iconPrimary: theme.colors.primary.main,
  iconError: theme.colors.status.error,
  iconChevron: theme.colors.grey[400],
  switchTrackInactive: theme.colors.grey[300],
  switchTrackActive: `${theme.colors.primary.main}80`,
  switchThumbActive: theme.colors.primary.main,
  switchThumbInactive: theme.colors.grey[50],
  statusBarBackground: "#FFFFFF",
  activityIndicator: theme.colors.primary.main,
  textPrimary: theme.colors.text.primary,
};

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 0,
    height: HEADER_HEIGHT,
    marginTop: -STATUSBAR_HEIGHT,
    paddingTop: STATUSBAR_HEIGHT,
  },
  backButton: {
    marginRight: 15,
    padding: 8,
    position: "relative",
    zIndex: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  placeholderRight: {
    width: 40,
    height: 40,
  },
  contentContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  sectionContainer: {
    marginBottom: theme.spacing.sm,
  },
  sectionContent: {
    marginHorizontal: 0,
  },
  sectionTitle: {
    ...theme.typography.subtitle1,
    color: theme.colors.text.primary,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    paddingLeft: theme.spacing.md,
  },
  settingsItem: {
    ...theme.common.spaceBetween,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.background.input,
    ...theme.borders.apply({}, { radius: "md" }),
    marginBottom: theme.spacing.xs,
    marginHorizontal: theme.spacing.md,
    ...theme.shadows.apply({}, "xs"),
  },
  settingsItemLeft: {
    ...theme.common.row,
    flex: 1,
  },
  settingsItemRight: {
    ...theme.common.centerContent,
  },
  iconContainer: {
    width: 40,
    height: 40,
    ...theme.common.centerContent,
    backgroundColor: theme.colors.background.paper,
    ...theme.borders.apply({}, { radius: "sm" }),
    marginRight: theme.spacing.sm,
  },
  destructiveIconContainer: {
    backgroundColor: `${theme.colors.status.error}15`,
  },
  settingsItemTextContainer: {
    flex: 1,
  },
  settingsItemTitle: {
    ...theme.typography.subtitle1,
    color: theme.colors.text.primary,
  },
  destructiveText: {
    color: theme.colors.status.error,
  },
  settingsItemSubtitle: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xxs,
  },
  settingsItemValue: {
    ...theme.typography.body2,
    color: theme.colors.text.secondary,
    marginRight: theme.spacing.xs,
  },
  separator: {
    height: 1,
    backgroundColor: theme.colors.border.light,
    marginVertical: theme.spacing.xs,
    marginHorizontal: theme.spacing.md,
  },
  loadingContainer: {
    flex: 1,
    ...theme.common.centerContent,
    padding: theme.spacing.lg,
  },
  loadingText: {
    ...theme.typography.body2,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
  bottomSpace: {
    height: theme.spacing.xxxl,
  },
});
