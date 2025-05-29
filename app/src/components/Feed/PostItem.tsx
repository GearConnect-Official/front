import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from "react-native";
import { CloudinaryMedia } from "../";
import PostHeader from "./PostHeader";
import PostActions from "./PostActions";
import PostFooter from "./PostFooter";
import styles from "../../styles/feed/postItemStyles";
const SCREEN_WIDTH = Dimensions.get("window").width;

export interface Comment {
  id: string;
  username: string;
  avatar: string;
  text: string;
  timeAgo: string;
  likes: number;
}

export interface Post {
  id: string;
  username: string;
  avatar: string;
  images: string[];
  imagePublicIds?: string[]; // Public IDs Cloudinary pour l'optimisation
  mediaTypes?: ('image' | 'video')[]; // Types de médias pour chaque élément
  caption: string;
  likes: number;
  liked: boolean;
  saved: boolean;
  comments: Comment[];
  timeAgo: string;
}

interface PostItemProps {
  post: Post;
  onLike: (postId: string) => void;
  onSave: (postId: string) => void;
  onComment: (postId: string) => void;
  onShare: (postId: string) => void;
  onProfilePress: (username: string) => void;
  currentUsername?: string;
}

const PostItem: React.FC<PostItemProps> = ({
  post,
  onLike,
  onSave,
  onComment,
  onShare,
  onProfilePress,
  currentUsername = "john_doe",
}) => {
  const renderPostImages = () => {
    if (post.images.length === 1) {
      const publicId = post.imagePublicIds?.[0];
      const mediaType = post.mediaTypes?.[0] || 'auto';
      return publicId ? (
        <CloudinaryMedia
          publicId={publicId}
          mediaType={mediaType}
          width={SCREEN_WIDTH}
          height={SCREEN_WIDTH}
          crop="fill"
          quality="auto"
          format="auto"
          style={styles.postSingleImage}
          fallbackUrl={post.images[0]}
          shouldPlay={false}
          isMuted={true}
          useNativeControls={true}
        />
      ) : (
        <CloudinaryMedia
          publicId=""
          mediaType={mediaType}
          fallbackUrl={post.images[0]}
          width={SCREEN_WIDTH}
          height={SCREEN_WIDTH}
          style={styles.postSingleImage}
          shouldPlay={false}
          isMuted={true}
          useNativeControls={true}
        />
      );
    } else {
      return (
        <FlatList
          data={post.images}
          renderItem={({ item, index }) => {
            const publicId = post.imagePublicIds?.[index];
            const mediaType = post.mediaTypes?.[index] || 'auto';
            return publicId ? (
              <CloudinaryMedia
                publicId={publicId}
                mediaType={mediaType}
                width={SCREEN_WIDTH}
                height={SCREEN_WIDTH}
                crop="fill"
                quality="auto"
                format="auto"
                style={styles.postMultipleImage}
                fallbackUrl={item}
                shouldPlay={false}
                isMuted={true}
                useNativeControls={true}
              />
            ) : (
              <CloudinaryMedia
                publicId=""
                mediaType={mediaType}
                fallbackUrl={item}
                width={SCREEN_WIDTH}
                height={SCREEN_WIDTH}
                style={styles.postMultipleImage}
                shouldPlay={false}
                isMuted={true}
                useNativeControls={true}
              />
            );
          }}
          keyExtractor={(_, index) => index.toString()}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          snapToInterval={SCREEN_WIDTH}
          decelerationRate="fast"
        />
      );
    }
  };

  const handleDoubleTapLike = () => {
    if (!post.liked) {
      onLike(post.id);
    }
  };

  return (
    <View style={styles.container}>
      <PostHeader
        postId={post.id}
        username={post.username}
        avatar={post.avatar}
        onProfilePress={() => onProfilePress(post.username)}
        currentUsername={currentUsername}
      />

      <TouchableOpacity
        activeOpacity={1}
        onPress={handleDoubleTapLike}
        delayLongPress={180}
      >
        {renderPostImages()}
      </TouchableOpacity>

      <PostActions
        postId={post.id}
        liked={post.liked}
        saved={post.saved}
        onLike={() => onLike(post.id)}
        onComment={() => onComment(post.id)}
        onShare={() => onShare(post.id)}
        onSave={() => onSave(post.id)}
      />

      <PostFooter
        username={post.username}
        title={post.caption.split('\n')[0]}
        description={post.caption}
        likes={post.likes}
        commentsCount={post.comments.length}
        timeAgo={post.timeAgo}
        onViewComments={() => onComment(post.id)}
        onProfilePress={() => onProfilePress(post.username)}
      />
    </View>
  );
};

export default PostItem;
