import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import PostOptionsMenu from './PostOptionsMenu';

interface PostOptionsButtonProps {
  postId: string;
  username: string;
  currentUsername?: string;
}

const PostOptionsButton: React.FC<PostOptionsButtonProps> = ({
  postId,
  username,
  currentUsername = 'Vous'
}) => {
  const [showOptions, setShowOptions] = useState(false);

  const handleOptionsPress = () => {
    setShowOptions(true);
  };

  const handleCloseOptions = () => {
    setShowOptions(false);
  };

  const handleCopyLink = () => {
    console.log(`Copying link for post ${postId}`);
    setShowOptions(false);
  };

  const handleReport = () => {
    console.log(`Reporting post ${postId}`);
    setShowOptions(false);
  };

  return (
    <>
      <TouchableOpacity 
        onPress={handleOptionsPress}
        style={styles.optionsButton}
        activeOpacity={0.7}
        hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
      >
        <FontAwesome name="ellipsis-h" size={16} color="#262626" />
      </TouchableOpacity>

      <PostOptionsMenu
        visible={showOptions}
        onClose={handleCloseOptions}
        onReport={handleReport}
        onCopyLink={handleCopyLink}
        isOwnPost={username === currentUsername}
      />
    </>
  );
};

const styles = StyleSheet.create({
  optionsButton: {
    padding: 8,
  }
});

export default PostOptionsButton; 