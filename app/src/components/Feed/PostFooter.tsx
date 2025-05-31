import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import styles from "../../styles/Feed/postFooterStyles";

interface PostFooterProps {
  username: string;
  title: string;
  description: string;
  likes: number;
  commentsCount: number;
  timeAgo: string;
  tags?: string[];
  onViewComments: () => void;
  onProfilePress: () => void;
}

const MAX_DESCRIPTION_LINES = 3;

const PostFooter: React.FC<PostFooterProps> = ({
  username,
  title,
  description,
  likes,
  commentsCount,
  timeAgo,
  tags = [],
  onViewComments,
  onProfilePress,
}) => {
  const [showFullDescription, setShowFullDescription] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.separator} />
      <Text style={styles.likesCount}>{likes} likes</Text>

      <View style={styles.captionContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text
          style={styles.description}
          numberOfLines={showFullDescription ? undefined : MAX_DESCRIPTION_LINES}
        >
          {description}
        </Text>
        {description.length > 120 && !showFullDescription && (
          <TouchableOpacity onPress={() => setShowFullDescription(true)}>
            <Text style={styles.seeMore}>Voir plus</Text>
          </TouchableOpacity>
        )}
        {description.length > 120 && showFullDescription && (
          <TouchableOpacity onPress={() => setShowFullDescription(false)}>
            <Text style={styles.seeMore}>Voir moins</Text>
          </TouchableOpacity>
        )}
      </View>

      {tags.length > 0 && (
        <View style={styles.tagsContainer}>
          {tags.map((tag, index) => (
            <Text key={index} style={styles.tagText}>#{tag}</Text>
          ))}
        </View>
      )}

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
