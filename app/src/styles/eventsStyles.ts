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
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  topBar: {
    backgroundColor: "rgba(255, 255, 255, 1)",
    shadowColor: "rgba(0, 0, 0, 0.12)",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 4,
    zIndex: 1,
    minHeight: 104,
  },
  topBarContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 18,
  },
  title: {
    fontSize: 20,
    fontWeight: "500",
    color: "rgba(0, 0, 0, 1)",
    fontFamily: "Roboto",
  },
  searchContainer: {
    paddingHorizontal: 12,
    marginTop: 12,
  },
  searchField: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: "white",
    maxWidth: 360,
    marginHorizontal: "auto",
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "rgba(0, 0, 0, 0.5)",
    paddingVertical: 8,
  },
  searchButton: {
    backgroundColor: "black",
    borderRadius: 4,
    padding: 8,
  },
  searchInfo: {
    color: "rgba(0, 0, 0, 0.5)",
    fontSize: 14,
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
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
    borderRadius: 6,
    padding: 4,
    alignItems: "center",
  },
  tabIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  tabText: {
    marginTop: 4,
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
});

export default styles;
