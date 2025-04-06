import { StyleSheet } from "react-native";

// Palette de couleurs inspirée du monde automobile et du racing
const THEME_COLORS = {
  primary: '#E10600', // Rouge Racing
  secondary: '#1E1E1E', // Noir Racing
  tertiary: '#2D9CDB', // Bleu pour accent
  quaternary: '#F0C419', // Jaune pour accent
  background: '#FFFFFF',
  card: '#F2F2F2',
  cardLight: '#F8F8F8',
  textPrimary: '#1E1E1E',
  textSecondary: '#6E6E6E',
  border: '#E0E0E0',
  success: '#27AE60', // Vert pour badges positifs
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME_COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: THEME_COLORS.background,
    borderBottomWidth: 0,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  menuButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  placeholderRight: {
    width: 40,
    height: 40,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: THEME_COLORS.secondary,
  },
  content: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
    backgroundColor: THEME_COLORS.background,
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: THEME_COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: THEME_COLORS.border,
    paddingVertical: 10,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: THEME_COLORS.primary,
  },
  section: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: THEME_COLORS.textPrimary,
    marginBottom: 15,
  },
  requestCard: {
    flexDirection: 'row',
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
    fontWeight: '600',
    color: THEME_COLORS.textPrimary,
    marginBottom: 4,
  },
  requestMutual: {
    fontSize: 14,
    color: THEME_COLORS.textSecondary,
    marginBottom: 10,
  },
  requestActions: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
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
    fontWeight: '600',
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
    fontWeight: '600',
    fontSize: 14,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: THEME_COLORS.textPrimary,
    marginTop: 15,
    marginBottom: 5,
  },
  emptySubtitle: {
    fontSize: 14,
    color: THEME_COLORS.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: THEME_COLORS.primary,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default styles;
