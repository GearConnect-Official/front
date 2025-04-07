import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import styles from "../../styles/feed/postHeaderStyles";
import PostOptionsButton from './PostOptionsButton';

interface PostHeaderProps {
  postId: string;
  username: string;
  avatar: string;
  onProfilePress: () => void;
  currentUsername?: string;
}

const PostHeader: React.FC<PostHeaderProps> = ({
  postId,
  username,
  avatar,
  onProfilePress,
  currentUsername
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.userInfo} onPress={onProfilePress} activeOpacity={0.8}>
        <Image source={{ uri: avatar }} style={styles.avatar} />
        <Text style={styles.username}>{username}</Text>
      </TouchableOpacity>
      
      <PostOptionsButton 
        postId={postId} 
        username={username} 
        currentUsername={currentUsername}
      />
    </View>
  );
};

export default PostHeader; 