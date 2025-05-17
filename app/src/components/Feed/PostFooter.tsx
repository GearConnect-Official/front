import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import styles from "../../styles/Feed/postFooterStyles";

interface PostFooterProps {
  username: string;
  caption: string;
  likes: number;
  commentsCount: number;
  timeAgo: string;
  onViewComments: () => void;
  onProfilePress: () => void;
}

const PostFooter: React.FC<PostFooterProps> = ({
  username,
  caption,
  likes,
  commentsCount,
  timeAgo,
  onViewComments,
  onProfilePress,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.likesCount}>{likes} likes</Text>

      <View style={styles.captionContainer}>
        <Text style={styles.caption}>
          <Text style={styles.usernameText} onPress={onProfilePress}>
            {username}
          </Text>{" "}
          {caption}
        </Text>
      </View>

      {commentsCount > 0 && (
        <TouchableOpacity
          style={styles.commentsLink}
          onPress={onViewComments}
          activeOpacity={0.7}
        >
          <Text style={styles.commentsLinkText}>
            View {commentsCount} comment{commentsCount > 1 ? "s" : ""}
          </Text>
        </TouchableOpacity>
      )}

      <Text style={styles.timeAgo}>{timeAgo}</Text>
    </View>
  );
};

export default PostFooter;
