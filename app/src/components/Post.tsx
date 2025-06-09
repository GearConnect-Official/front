import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import styles from "../styles/components/postStyles";

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

export default Post;
