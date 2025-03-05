import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(251, 249, 250, 1)",
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
  content: {
    flex: 1,
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
    padding: 12,
    gap: 8,
  },
  tab: {
    flex: 1,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
    borderRadius: 6,
    padding: 8,
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: "rgba(0, 0, 0, 0.05)",
  },
  tabText: {
    fontSize: 14,
    color: "#000",
  },
  section: {
    padding: 12,
  },
  sectionHeader: {
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "500",
    color: "#000",
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "rgba(0, 0, 0, 0.5)",
  },
  jobItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    gap: 8,
  },
  emojiContainer: {
    width: 32,
    height: 32,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  emoji: {
    fontSize: 20,
  },
  jobInfo: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 16,
    color: "#000",
  },
  jobDescription: {
    fontSize: 14,
    color: "rgba(0, 0, 0, 0.5)",
  },
  jobType: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
    width: 90,
    textAlign: "right",
  },
  createButton: {
    backgroundColor: "#000",
    borderRadius: 8,
    margin: 12,
    padding: 10,
    alignItems: "center",
  },
  createButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
});

export default styles;
