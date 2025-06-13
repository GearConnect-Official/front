import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import styles from "../../styles/feed/postHeaderStyles";
import PostOptionsButton from "./PostOptionsButton";
import { CloudinaryAvatar } from "../media/CloudinaryImage";
import { defaultImages } from "../../config/defaultImages";

interface PostHeaderProps {
  postId: string;
  username: string;
  avatar: string;
  profilePicturePublicId?: string;
  onProfilePress: () => void;
  currentUsername: string;
}

const PostHeader: React.FC<PostHeaderProps> = ({
  postId,
  username,
  avatar,
  profilePicturePublicId,
  onProfilePress,
  currentUsername,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.userInfo}
        onPress={onProfilePress}
        activeOpacity={0.8}
      >
        {profilePicturePublicId ? (
          <CloudinaryAvatar
            publicId={profilePicturePublicId}
            size={32}
            quality="auto"
            format="auto"
            style={styles.avatar}
            fallbackUrl={avatar || defaultImages.profile}
          />
        ) : (
          <Image 
            source={{ uri: avatar || defaultImages.profile }} 
            style={styles.avatar} 
          />
        )}
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
