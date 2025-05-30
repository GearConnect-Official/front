import React, { useState, useEffect } from 'react';
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
  ActivityIndicator,
  Alert,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { formatPostDate } from '../utils/dateUtils';
import postService from '../services/postService';
import { Comment } from '../services/postService';
import { useAuth } from '../context/AuthContext';

interface CommentsModalProps {
  isVisible: boolean;
  postId: number;
  comments: Comment[];
  onClose: () => void;
  onAddComment: (postId: string, text: string) => void;
}

const CommentsModal: React.FC<CommentsModalProps> = ({
  isVisible,
  postId,
  comments: initialComments,
  onClose,
  onAddComment,
}) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreComments, setHasMoreComments] = useState(true);
  const [editingComment, setEditingComment] = useState<Comment | null>(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    if (isVisible) {
      loadComments();
    }
  }, [isVisible]);

  const loadComments = async (page = 1) => {
    try {
      setIsLoading(true);
      const response = await postService.getComments(postId, page);
      const newComments = response.interactions.map((interaction: any) => ({
        id: `${interaction.postId}-${interaction.userId}`,
        postId: interaction.postId,
        userId: interaction.userId,
        content: interaction.comment || '',
        createdAt: new Date(interaction.createdAt),
        user: interaction.user
      }));

      if (page === 1) {
        setComments(newComments);
      } else {
        setComments(prev => [...prev, ...newComments]);
      }

      setHasMoreComments(newComments.length === response.pagination.itemsPerPage);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error loading comments:', error);
      Alert.alert('Error', 'Failed to load comments');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (!isLoading && hasMoreComments) {
      loadComments(currentPage + 1);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !user?.id) return;

    try {
      setIsLoading(true);
      await postService.addComment(postId, parseInt(user.id), newComment.trim());
      setNewComment('');
      // Recharger les commentaires pour avoir l'ordre correct
      loadComments(1);
    } catch (error) {
      console.error('Error adding comment:', error);
      Alert.alert('Error', 'Failed to add comment');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditComment = async (comment: Comment) => {
    try {
      setIsLoading(true);
      await postService.editComment(comment.postId, comment.userId, editText);
      setEditingComment(null);
      setEditText('');
      // Recharger les commentaires
      loadComments(1);
    } catch (error) {
      console.error('Error editing comment:', error);
      Alert.alert('Error', 'Failed to edit comment');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteComment = async (comment: Comment) => {
    Alert.alert(
      'Delete Comment',
      'Are you sure you want to delete this comment?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsLoading(true);
              await postService.deleteComment(comment.postId, comment.userId);
              // Recharger les commentaires
              loadComments(1);
            } catch (error) {
              console.error('Error deleting comment:', error);
              Alert.alert('Error', 'Failed to delete comment');
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  const renderComment = ({ item: comment }: { item: Comment }) => (
    <View style={styles.commentContainer}>
      {editingComment?.id === comment.id ? (
        <View style={styles.editContainer}>
          <TextInput
            style={styles.editInput}
            value={editText}
            onChangeText={setEditText}
            multiline
            placeholder="Edit your comment..."
          />
          <View style={styles.editActions}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => handleEditComment(comment)}
            >
              <FontAwesome name="check" size={16} color="#4CAF50" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => {
                setEditingComment(null);
                setEditText('');
              }}
            >
              <FontAwesome name="times" size={16} color="#F44336" />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <>
          <View style={styles.commentHeader}>
            <Text style={styles.username}>{comment.user?.username || 'Unknown'}</Text>
            <Text style={styles.timestamp}>{formatPostDate(comment.createdAt)}</Text>
          </View>
          <Text style={styles.commentText}>{comment.content}</Text>
          <View style={styles.commentActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => {
                setEditingComment(comment);
                setEditText(comment.content);
              }}
            >
              <FontAwesome name="edit" size={16} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleDeleteComment(comment)}
            >
              <FontAwesome name="trash" size={16} color="#666" />
            </TouchableOpacity>
          </View>
        </>
      )}
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
          <Text style={styles.headerTitle}>Comments</Text>
          <TouchableOpacity>
            <FontAwesome name="paper-plane-o" size={20} color="#262626" />
          </TouchableOpacity>
        </View>

        <FlatList
          data={comments}
          renderItem={renderComment}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.commentsList}
          showsVerticalScrollIndicator={false}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isLoading ? (
              <ActivityIndicator size="small" color="#000" style={styles.loader} />
            ) : null
          }
          ListEmptyComponent={
            !isLoading ? (
              <View style={styles.emptyContainer}>
                <FontAwesome name="comments-o" size={60} color="#CCCCCC" />
                <Text style={styles.emptyText}>No comments yet</Text>
                <Text style={styles.emptySubText}>Be the first to comment</Text>
              </View>
            ) : null
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
            placeholder="Add a comment..."
            placeholderTextColor="#8E8E8E"
            multiline
            value={newComment}
            onChangeText={setNewComment}
          />
          <TouchableOpacity
            onPress={handleAddComment}
            disabled={!newComment.trim() || isLoading}
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
              Post
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
  commentContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  username: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  timestamp: {
    color: '#666',
    fontSize: 12,
  },
  commentText: {
    fontSize: 14,
    lineHeight: 20,
  },
  commentActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
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
  editContainer: {
    marginTop: 8,
  },
  editInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
  },
  editActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  editButton: {
    padding: 8,
    marginLeft: 8,
  },
  loader: {
    padding: 16,
  },
});

export default CommentsModal; 