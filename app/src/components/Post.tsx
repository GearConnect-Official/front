import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";

interface PostProps {
  user: {
    name: string;
    avatar: string;
    location: string;
    timeAgo: string;
  };
  content: {
    text: string;
    image: string;
    hashtags: string[];
  };
}

const Post: React.FC<PostProps> = ({ user, content }) => {
  return (
    <View style={styles.container}>
      <View style={styles.userContainer}>
        <View style={styles.avatarContainer}>
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
          <View>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userInfo}>
              {user.timeAgo} - {user.location}
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.moreButton}>
          <Text>•••</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.imageContainer}>
        <Image source={{ uri: content.image }} style={styles.contentImage} />
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.contentText}>{content.text}</Text>

        <View style={styles.hashtagsContainer}>
          {content.hashtags.map((tag, index) => (
            <View key={index} style={styles.hashtagPill}>
              <Text style={styles.hashtagText}>#{tag}</Text>
            </View>
          ))}
        </View>

        <View style={styles.interactionContainer}>
          <TouchableOpacity style={styles.interactionButton}>
            <FontAwesome name="heart" size={16} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.interactionButton}>
            <FontAwesome name="comment" size={16} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.interactionButton}>
            <FontAwesome name="share" size={16} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.interactionButton}>
            <FontAwesome name="bookmark" size={16} color="#000" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

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

export default Post;
