import React from "react";
import { View, Image, TouchableOpacity } from "react-native";
import styles from "../../styles/feed/postHeaderStyles";
import PostOptionsButton from "./PostOptionsButton";
import { CloudinaryAvatar } from "../media/CloudinaryImage";
import { defaultImages } from "../../config/defaultImages";
import UsernameWithTag from "../UsernameWithTag";

interface PostHeaderProps {
  postId: string;
  username: string;
  avatar: string;
  profilePicturePublicId?: string;
  onProfilePress: () => void;
  currentUsername: string;
  userId?: number;
}

const PostHeader: React.FC<PostHeaderProps> = ({
  postId,
  username,
  avatar,
  profilePicturePublicId,
  onProfilePress,
  currentUsername,
  userId,
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
            fallbackUrl={avatar}
          />
        ) : avatar ? (
          <Image 
            source={{ uri: avatar }} 
            style={styles.avatar} 
          />
        ) : (
          <Image 
            source={defaultImages.profile} 
            style={styles.avatar} 
          />
        )}
        <UsernameWithTag
          username={username}
          userId={userId}
          usernameStyle={styles.username}
        />
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
