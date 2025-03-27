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
  profileSection: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
    padding: 16,
    marginBottom: 12,
  },
  avatarContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "500",
    color: "#000",
    marginBottom: 4,
  },
  profileRole: {
    fontSize: 14,
    color: "rgba(0, 0, 0, 0.5)",
    marginBottom: 4,
  },
  profileChampionship: {
    fontSize: 14,
    color: "#FF0000",
  },
  profileAvatar: {
    width: 67,
    height: 71,
    borderRadius: 1000,
  },
  tabGroup: {
    flexDirection: "row",
    padding: 12,
    gap: 8,
  },
  tab: {
    flex: 1,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
    padding: 8,
    alignItems: "center",
  },
  tabIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  tabText: {
    marginTop: 4,
    fontSize: 14,
    textAlign: "center",
  },
  section: {
    padding: 12,
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "500",
    color: "#000",
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: "rgba(0, 0, 0, 0.5)",
    marginBottom: 16,
  },
  sectionIcon: {
    width: 24,
    height: 24,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
  },
  infoIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  infoTitle: {
    flex: 1,
    fontSize: 18,
    color: "#000",
  },
  infoSubtitle: {
    fontSize: 18,
    fontWeight: "500",
    color: "#000",
    textAlign: "right",
  },
  eventCard: {
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
    overflow: "hidden",
    marginBottom: 8,
  },
  eventImage: {
    width: "100%",
    height: 164,
    resizeMode: "cover",
  },
  eventInfo: {
    padding: 8,
    paddingBottom: 52,
  },
  eventTitle: {
    fontSize: 16,
    color: "#000",
    marginBottom: 4,
  },
  eventResult: {
    fontSize: 20,
    fontWeight: "500",
    color: "#000",
    position: "absolute",
    left: 8,
    bottom: 8,
  },
  eventVenue: {
    fontSize: 18,
    fontWeight: "500",
    color: "#000",
    position: "absolute",
    left: 8,
    bottom: 8,
  },
  cvCard: {
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
    height: 353,
    backgroundColor: "rgba(170, 168, 168, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  cvText: {
    fontSize: 24,
    fontWeight: "500",
    color: "#000",
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1E232C",
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  uploadButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
});

export default styles;
