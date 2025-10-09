import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { ProfilePicture } from "../ui/ProfilePicture";
import { Post } from "../../types/post";
import { CloudinaryAvatar } from "../ui/media/CloudinaryImage";

interface PostItemProps {
  post: Post;
  onPress: () => void;
  onLike: () => void;
  onComment: () => void;
  onShare: () => void;
  onSave: () => void;
}

export const PostItem: React.FC<PostItemProps> = ({
  post,
  onPress,
  onLike,
  onComment,
  onShare,
  onSave,
}) => {
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffMinutes < 60) return `Il y a ${diffMinutes}m`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays < 7) return `Il y a ${diffDays}j`;
    return date.toLocaleDateString("fr-FR");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.userInfo} onPress={onPress}>
          <ProfilePicture
            publicId={post.user.profilePicturePublicId}
            imageUrl={post.user.profilePicture}
            size={40}
          />
          <View style={styles.userText}>
            <Text style={styles.username}>{post.user.name}</Text>
            <Text style={styles.time}>{formatDate(post.createdAt)}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.moreButton}>
          <FontAwesome name="ellipsis-h" size={16} color="#6A707C" />
        </TouchableOpacity>
      </View>

      {post.content && <Text style={styles.content}>{post.content}</Text>}

      {post.media && post.media.length > 0 && (
        <View style={styles.mediaContainer}>
          {post.media.map((media) => (
            <CloudinaryAvatar
              key={media.id}
              publicId={media.publicId}
              size={300}
              style={styles.media}
            />
          ))}
        </View>
      )}

      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={onLike}>
          <FontAwesome
            name={post.isLiked ? "heart" : "heart-o"}
            size={20}
            color={post.isLiked ? "#E10600" : "#6A707C"}
          />
          <Text style={styles.actionText}>{post._count.likes}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={onComment}>
          <FontAwesome name="comment-o" size={20} color="#6A707C" />
          <Text style={styles.actionText}>{post._count.comments}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={onShare}>
          <FontAwesome name="share" size={20} color="#6A707C" />
          <Text style={styles.actionText}>{post._count.shares}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={onSave}>
          <FontAwesome
            name={post.isSaved ? "bookmark" : "bookmark-o"}
            size={20}
            color={post.isSaved ? "#E10600" : "#6A707C"}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    marginBottom: 8,
    padding: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  userText: {
    marginLeft: 12,
  },
  username: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  time: {
    fontSize: 12,
    color: "#6A707C",
  },
  moreButton: {
    padding: 8,
  },
  content: {
    fontSize: 14,
    color: "#1A1A1A",
    marginBottom: 12,
  },
  mediaContainer: {
    marginBottom: 12,
  },
  media: {
    width: "100%",
    height: 300,
    borderRadius: 8,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
  },
  actionText: {
    marginLeft: 4,
    fontSize: 12,
    color: "#6A707C",
  },
});

export default PostItem;