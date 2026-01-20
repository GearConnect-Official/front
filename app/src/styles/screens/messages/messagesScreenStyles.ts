import { Platform, StatusBar, StyleSheet } from "react-native";
import theme from "../../config/theme";
import { THEME_COLORS } from "../user/performanceStyles";

const STATUSBAR_HEIGHT =
  Platform.OS === "ios" ? 26 : StatusBar.currentHeight || 0;
const HEADER_HEIGHT = 56 + STATUSBAR_HEIGHT;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.default,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: THEME_COLORS.BACKGROUND,
    borderBottomWidth: 0,
    height: HEADER_HEIGHT,
    marginTop: Platform.OS === "ios" ? STATUSBAR_HEIGHT : 0,
    paddingTop: STATUSBAR_HEIGHT,
  },
  backButton: {
    padding: theme.spacing.sm,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.colors.text.primary,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  groupsButton: {
    padding: theme.spacing.sm,
  },
  newMessageButton: {
    padding: theme.spacing.sm,
  },
  listContainer: {
    paddingVertical: theme.spacing.sm,
  },
  conversationItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.background.paper,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  avatarContainer: {
    position: "relative",
    marginRight: theme.spacing.md,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  defaultAvatar: {
    backgroundColor: theme.colors.background.input,
    justifyContent: "center",
    alignItems: "center",
  },
  groupIndicator: {
    position: "absolute",
    bottom: -2,
    right: -2,
    backgroundColor: "#E10600",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  conversationInfo: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  conversationName: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text.primary,
    flex: 1,
  },
  messageTime: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    marginLeft: theme.spacing.sm,
  },
  messagePreview: {
    flexDirection: "row",
    alignItems: "center",
  },
  lastMessage: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    flex: 1,
  },
  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  // Onglets
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.background.paper,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  tab: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#E10600',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.text.secondary,
  },
  activeTabText: {
    color: '#E10600',
    fontWeight: '600',
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: '20%',
    backgroundColor: '#E10600',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  // Demandes de discussion
  requestItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.background.paper,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  requestActions: {
    flexDirection: 'row',
    marginTop: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  requestButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  acceptButton: {
    backgroundColor: '#E10600',
  },
  acceptButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  rejectButton: {
    backgroundColor: theme.colors.background.input,
  },
  rejectButtonText: {
    color: theme.colors.text.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  requestStatusText: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    fontStyle: 'italic',
    marginLeft: theme.spacing.xs,
  },
  commercialIndicator: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#F59E0B',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacing.xl * 2,
  },
  emptyText: {
    marginTop: theme.spacing.md,
    fontSize: 16,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  // Section headers for requests
  sectionHeader: {
    backgroundColor: theme.colors.background.default,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  sectionHeaderText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  // Sub-tabs for requests
  subTabsContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.background.paper,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
    paddingHorizontal: theme.spacing.md,
  },
  subTab: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    marginHorizontal: theme.spacing.xs,
  },
  activeSubTab: {
    borderBottomColor: '#E10600',
  },
  subTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.text.secondary,
  },
  activeSubTabText: {
    color: '#E10600',
    fontWeight: '600',
  },
  subTabBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#E10600',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  subTabBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  swipeActionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginVertical: 4,
  },
  swipeAction: {
    width: 100,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteAction: {
    backgroundColor: '#FFA500',
  },
  deleteAction: {
    backgroundColor: '#E10600',
  },
  swipeActionButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  swipeActionText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
});

export default styles;
