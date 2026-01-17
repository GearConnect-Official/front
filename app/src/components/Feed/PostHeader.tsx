import React from "react";
import { View, Image, TouchableOpacity } from "react-native";
import styles from "../../styles/feed/postHeaderStyles";
import PostOptionsButton from "./PostOptionsButton";
import { VerifiedAvatar } from "../media/VerifiedAvatar";
import { defaultImages } from "../../config/defaultImages";
import UsernameWithTag from "../UsernameWithTag";

interface PostHeaderProps {
  postId: string;
  username: string;
  avatar: string;
  profilePicturePublicId?: string;
  isVerify?: boolean;
  onProfilePress: () => void;
  currentUsername: string;
  userId?: number;
}

const PostHeader: React.FC<PostHeaderProps> = ({
  postId,
  username,
  avatar,
  profilePicturePublicId,
  isVerify = false,
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
        <VerifiedAvatar
            publicId={profilePicturePublicId}
          fallbackUrl={avatar || defaultImages.profile}
            size={32}
          isVerify={isVerify}
            quality="auto"
            format="auto"
            style={styles.avatar} 
          />
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
