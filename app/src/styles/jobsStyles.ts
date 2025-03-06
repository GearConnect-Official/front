import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FBF9FA",
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
    color: "#1E232C",
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
    alignItems: "center",
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
  },
  tabIcon: {
    justifyContent: "center",
    alignItems: "center",
  },
  tabText: {
    fontSize: 16,
    textAlign: "center",
  },
  activeTab: {
    backgroundColor: "#000",
    borderRadius: 10,
  },
  activeTabText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "500",
    color: "#000",
    paddingHorizontal: 12,
    paddingVertical: 16,
  },
  jobItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
  },

  jobIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  jobContent: {
    flex: 1,
  },

  jobTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },

  jobSubtitle: {
    fontSize: 14,
    color: "rgba(0, 0, 0, 0.6)",
    marginTop: 2,
  },

  jobType: {
    fontSize: 14,
    fontWeight: "500",
    color: "#000",
    textAlign: "right",
  },

  noJobsText: {
    textAlign: "center",
    fontSize: 16,
    color: "rgba(0, 0, 0, 0.5)",
    paddingVertical: 20,
  },
});

export default styles;
