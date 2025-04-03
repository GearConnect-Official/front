import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(251, 248, 249, 1)",
  },

  topBar: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
  },
  topBarImg: {
    width: 47,
    height: 47,
    borderRadius: 33.5,
  },
  topBarSearchInput: {
    flex: 1,
    marginHorizontal: 12,
    height: 40,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 6,
    paddingHorizontal: 12,
  },
  topBarIcons: {
    flexDirection: "row",
    gap: 20,
  },
  topBarIcon: {
    width: 24,
    height: 24,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  
  // User menu styles
  profileButton: {
    position: 'relative',
  },
  userMenu: {
    position: 'absolute',
    top: 55,
    left: 0,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 100,
    width: 150,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  userMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  userMenuItemText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#1E232C',
  },
  
  // Welcome section
  welcomeSection: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E232C',
  },
});

export default styles;
