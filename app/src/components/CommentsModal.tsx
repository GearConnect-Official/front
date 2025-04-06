import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

interface Comment {
  id: string;
  username: string;
  avatar: string;
  text: string;
  timeAgo: string;
  likes: number;
}

interface CommentsModalProps {
  isVisible: boolean;
  postId: string;
  comments: Comment[];
  onClose: () => void;
  onAddComment: (postId: string, text: string) => void;
}

const CommentsModal: React.FC<CommentsModalProps> = ({
  isVisible,
  postId,
  comments,
  onClose,
  onAddComment,
}) => {
  const [newComment, setNewComment] = useState('');

  const handleSubmitComment = () => {
    if (newComment.trim()) {
      onAddComment(postId, newComment);
      setNewComment('');
    }
  };

  const renderCommentItem = ({ item }: { item: Comment }) => (
    <View style={styles.commentItem}>
      <Image source={{ uri: item.avatar }} style={styles.commentAvatar} />
      <View style={styles.commentContent}>
        <View style={styles.commentHeader}>
          <Text style={styles.commentUsername}>{item.username}</Text>
          <Text style={styles.commentText}>{item.text}</Text>
        </View>
        <View style={styles.commentFooter}>
          <Text style={styles.commentTime}>{item.timeAgo}</Text>
          <TouchableOpacity style={styles.commentAction}>
            <Text style={styles.commentActionText}>Répondre</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity style={styles.likeButton}>
        <FontAwesome name="heart-o" size={12} color="#8E8E8E" />
      </TouchableOpacity>
    </View>
  );

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <FontAwesome name="arrow-left" size={20} color="#262626" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Commentaires</Text>
          <TouchableOpacity>
            <FontAwesome name="paper-plane-o" size={20} color="#262626" />
          </TouchableOpacity>
        </View>

        <FlatList
          data={comments}
          renderItem={renderCommentItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.commentsList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <FontAwesome name="comments-o" size={60} color="#CCCCCC" />
              <Text style={styles.emptyText}>Aucun commentaire pour le moment</Text>
              <Text style={styles.emptySubText}>Soyez le premier à commenter</Text>
            </View>
          }
        />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
          style={styles.inputContainer}
        >
          <Image
            source={{ uri: 'https://via.placeholder.com/150' }}
            style={styles.userAvatar}
          />
          <TextInput
            style={styles.input}
            placeholder="Ajouter un commentaire..."
            placeholderTextColor="#8E8E8E"
            multiline
            value={newComment}
            onChangeText={setNewComment}
          />
          <TouchableOpacity
            onPress={handleSubmitComment}
            disabled={!newComment.trim()}
            style={[
              styles.postButton,
              !newComment.trim() && styles.postButtonDisabled,
            ]}
          >
            <Text
              style={[
                styles.postButtonText,
                !newComment.trim() && styles.postButtonTextDisabled,
              ]}
            >
              Publier
            </Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50,
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#DBDBDB',
  },
  closeButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#262626',
  },
  commentsList: {
    paddingHorizontal: 16,
    paddingTop: 12,
    flexGrow: 1,
  },
  commentItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  commentUsername: {
    fontWeight: '600',
    color: '#262626',
    marginRight: 4,
  },
  commentText: {
    color: '#262626',
  },
  commentFooter: {
    flexDirection: 'row',
    marginTop: 4,
  },
  commentTime: {
    fontSize: 12,
    color: '#8E8E8E',
    marginRight: 12,
  },
  commentAction: {
    marginRight: 12,
  },
  commentActionText: {
    fontSize: 12,
    color: '#8E8E8E',
  },
  likeButton: {
    paddingHorizontal: 8,
    justifyContent: 'flex-start',
    paddingTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 0.5,
    borderTopColor: '#DBDBDB',
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  input: {
    flex: 1,
    minHeight: 36,
    maxHeight: 80,
    padding: 8,
    fontSize: 14,
    color: '#262626',
  },
  postButton: {
    marginLeft: 8,
    paddingHorizontal: 8,
  },
  postButtonDisabled: {
    opacity: 0.5,
  },
  postButtonText: {
    color: '#0095F6',
    fontWeight: '600',
  },
  postButtonTextDisabled: {
    color: '#0095F6',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#262626',
    marginTop: 20,
  },
  emptySubText: {
    fontSize: 14,
    color: '#8E8E8E',
    marginTop: 4,
  },
});

export default CommentsModal; 