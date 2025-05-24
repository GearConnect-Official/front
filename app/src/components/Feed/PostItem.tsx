import React from "react";
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from "react-native";
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
      return (
        <Image
          source={{ uri: post.images[0] }}
          style={styles.postSingleImage}
          resizeMode="cover"
        />
      );
    } else {
      return (
        <FlatList
          data={post.images}
          renderItem={({ item }) => (
            <Image source={{ uri: item }} style={styles.postMultipleImage} />
          )}
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
        caption={post.caption}
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
