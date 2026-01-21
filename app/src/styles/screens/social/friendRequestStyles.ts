import { Platform, StatusBar, StyleSheet } from "react-native";
import theme from "./config";

// Racing color palette inspired by automotive and racing world
const THEME_COLORS = {
  primary: "#E10600", // Racing Red
  secondary: "#1E1E1E", // Racing Black
  tertiary: "#2D9CDB", // Accent Blue
  quaternary: "#F0C419", // Accent Yellow
  background: "#FFFFFF",
  card: "#F2F2F2",
  cardLight: "#F8F8F8",
  textPrimary: "#1E1E1E",
  textSecondary: "#6E6E6E",
  border: "#E0E0E0",
  success: "#27AE60", // Green for positive badges
};

const STATUSBAR_HEIGHT =
  Platform.OS === "ios" ? 28 : StatusBar.currentHeight || 0;
const HEADER_HEIGHT = 56 + STATUSBAR_HEIGHT;

const styles = StyleSheet.create({
  container: {
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
    height: 56,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  menuButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  placeholderRight: {
    width: 40,
    height: 40,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A1A",
    flex: 1,
    textAlign: "center",
  },
  content: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
    backgroundColor: THEME_COLORS.background,
  },
  tabsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: THEME_COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: THEME_COLORS.border,
    paddingVertical: 10,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    position: "relative",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: THEME_COLORS.primary,
  },
  tabText: {
    fontSize: 12,
    fontWeight: "500",
    marginTop: 4,
  },
  badge: {
    position: "absolute",
    top: 5,
    right: "25%",
    backgroundColor: THEME_COLORS.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: THEME_COLORS.background,
    fontSize: 12,
    fontWeight: "bold",
  },
  section: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: THEME_COLORS.textPrimary,
    marginBottom: 15,
  },
  requestCard: {
    flexDirection: "row",
    backgroundColor: THEME_COLORS.cardLight,
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: THEME_COLORS.secondary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  avatarImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 15,
  },
  requestInfo: {
    flex: 1,
  },
  requestName: {
    fontSize: 16,
    fontWeight: "600",
    color: THEME_COLORS.textPrimary,
    marginBottom: 4,
  },
  requestMutual: {
    fontSize: 14,
    color: THEME_COLORS.textSecondary,
    marginBottom: 10,
  },
  requestActions: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  acceptButton: {
    backgroundColor: THEME_COLORS.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 10,
  },
  acceptButtonText: {
    color: THEME_COLORS.background,
    fontWeight: "600",
    fontSize: 14,
  },
  declineButton: {
    backgroundColor: THEME_COLORS.card,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  declineButtonText: {
    color: THEME_COLORS.textPrimary,
    fontWeight: "600",
    fontSize: 14,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: THEME_COLORS.textPrimary,
    marginTop: 15,
    marginBottom: 5,
  },
  emptySubtitle: {
    fontSize: 14,
    color: THEME_COLORS.textSecondary,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: THEME_COLORS.primary,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  // Styles pour les amis
  friendCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: THEME_COLORS.cardLight,
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: THEME_COLORS.secondary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  friendInfo: {
    flex: 1,
    marginLeft: 0,
  },
  friendName: {
    fontSize: 16,
    fontWeight: "600",
    color: THEME_COLORS.textPrimary,
    marginBottom: 4,
  },
  friendStatus: {
    fontSize: 14,
    color: THEME_COLORS.textSecondary,
  },
  messageButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: THEME_COLORS.background,
  },
  // Styles pour les demandes envoyées
  sentCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: THEME_COLORS.cardLight,
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: THEME_COLORS.secondary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sentInfo: {
    flex: 1,
    marginLeft: 0,
  },
  sentName: {
    fontSize: 16,
    fontWeight: "600",
    color: THEME_COLORS.textPrimary,
    marginBottom: 4,
  },
  sentStatus: {
    fontSize: 14,
    color: THEME_COLORS.textSecondary,
  },
  cancelButton: {
    backgroundColor: THEME_COLORS.card,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  cancelButtonText: {
    color: THEME_COLORS.textPrimary,
    fontWeight: "600",
    fontSize: 14,
  },
});

export default styles;
