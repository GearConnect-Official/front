import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
    marginBottom: 8,
  },
  userContainer: {
    flexDirection: "row",
    padding: 8,
    alignItems: "center",
    justifyContent: "space-between",
  },
  avatarContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 24,
  },
  userName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
  },
  userInfo: {
    fontSize: 14,
    color: "rgba(0, 0, 0, 0.5)",
  },
  moreButton: {
    padding: 8,
  },
  imageContainer: {
    width: "100%",
    height: 325,
  },
  contentImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  contentContainer: {
    padding: 12,
  },
  contentText: {
    fontSize: 14,
    color: "#000",
    marginBottom: 8,
  },
  hashtagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 8,
  },
  hashtagPill: {
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    borderRadius: 2,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  hashtagText: {
    fontSize: 12,
    color: "#000",
  },
  interactionContainer: {
    flexDirection: "row",
    gap: 10,
    paddingLeft: 6,
    marginTop: 8,
  },
  interactionButton: {
    padding: 4,
  },
});

export default styles; 