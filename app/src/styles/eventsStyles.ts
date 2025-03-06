import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(251, 249, 250, 1)",
    maxWidth: 480,
    width: "100%",
    marginLeft: "auto",
    marginRight: "auto",
  },
  scrollView: {
    flex: 1,
  },
  topBar: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 4,
    minHeight: 60,
  },
  topBarContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: "space-between",
  },
  topBarTitle: {
    fontSize: 20,
    fontWeight: "500",
    color: "#000",
  },
  topBarIcon: {
    width: 24,
    height: 24,
  },
  topBarIcons: {
    flexDirection: "row",
    gap: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "500",
    color: "rgba(0, 0, 0, 1)",
    fontFamily: "Roboto",
  },
  searchSection: {
    padding: 12,
  },
  searchBar: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
    borderRadius: 6,
    padding: 4,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#000",
    paddingHorizontal: 12,
  },
  searchButton: {
    backgroundColor: "#000",
    borderRadius: 4,
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  searchIcon: {
    width: 20,
    height: 20,
  },
  searchInfo: {
    fontSize: 14,
    color: "rgba(0, 0, 0, 0.5)",
    marginTop: 4,
  },
  tabGroup: {
    flexDirection: "row",
    paddingHorizontal: 12,
    marginTop: 12,
    gap: 8,
  },
  tab: {
    flex: 1,
    flexDirection: "column",
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
    borderRadius: 6,
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },

  tabIcon: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },

  tabText: {
    fontSize: 16,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "500",
    color: "black",
    paddingHorizontal: 12,
    paddingTop: 16,
  },
  eventItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    gap: 8,
  },
  eventIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  eventContent: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "black",
  },
  eventSubtitle: {
    fontSize: 14,
    color: "rgba(0, 0, 0, 0.5)",
  },
  eventDate: {
    fontSize: 14,
    fontWeight: "500",
    color: "black",
    textAlign: "right",
  },
  emojiContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    alignItems: "center",
    justifyContent: "center",
  },
  emojiText: {
    fontSize: 20,
  },
  activeTab: {
    backgroundColor: "#000",
    borderRadius: 10,
  },

  activeTabText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorContainer: {
    padding: 20,
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: "#FF0000",
    marginBottom: 10,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "#1E232C",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
  },
});

export default styles;
