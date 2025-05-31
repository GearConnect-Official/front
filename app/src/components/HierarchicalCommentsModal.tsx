import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Keyboard,
  Dimensions,
  ScrollView,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useAuth } from '../context/AuthContext';
import commentService, { HierarchicalComment, CommentsResponse } from '../services/commentService';
import HierarchicalCommentComponent from './Feed/HierarchicalComment';

interface HierarchicalCommentsModalProps {
  isVisible: boolean;
  postId: number;
  onClose: () => void;
}

const { height: screenHeight } = Dimensions.get('window');

const HierarchicalCommentsModal: React.FC<HierarchicalCommentsModalProps> = ({
  isVisible,
  postId,
  onClose,
}) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<HierarchicalComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreComments, setHasMoreComments] = useState(true);
  const [replyToComment, setReplyToComment] = useState<{
    commentId: number;
    username: string;
  } | null>(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const textInputRef = useRef<TextInput>(null);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
        setIsKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardHeight(0);
        setIsKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidHideListener?.remove();
      keyboardDidShowListener?.remove();
    };
  }, []);

  useEffect(() => {
    if (isVisible && postId) {
      loadComments();
    }
  }, [isVisible, postId]);

  const loadComments = async (page = 1) => {
    try {
      setIsLoading(true);
      const response: CommentsResponse = await commentService.getCommentsByPost(postId, page);
      
      if (page === 1) {
        setComments(response.comments);
      } else {
        setComments(prev => [...prev, ...response.comments]);
      }

      setHasMoreComments(response.pagination.currentPage < response.pagination.totalPages);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error loading comments:', error);
      Alert.alert('Erreur', 'Impossible de charger les commentaires');
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
    if (!newComment.trim() || !user?.id || isSubmitting) return;

    try {
      setIsSubmitting(true);
      
      const commentData = {
        postId,
        userId: parseInt(user.id),
        content: newComment.trim(),
        parentId: replyToComment?.commentId,
      };

      const newCommentResponse = await commentService.createComment(commentData);
      
      if (replyToComment) {
        // Si c'est une réponse, mettre à jour le commentaire parent
        setComments(prev => updateCommentWithReply(prev, replyToComment.commentId, newCommentResponse));
        setReplyToComment(null);
      } else {
        // Si c'est un nouveau commentaire de niveau racine, l'ajouter en haut
        setComments(prev => [newCommentResponse, ...prev]);
      }
      
      setNewComment('');
      // Fermer le clavier après envoi
      Keyboard.dismiss();
    } catch (error) {
      console.error('Error adding comment:', error);
      Alert.alert('Erreur', 'Impossible d\'ajouter le commentaire');
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateCommentWithReply = (
    comments: HierarchicalComment[], 
    parentId: number, 
    newReply: HierarchicalComment
  ): HierarchicalComment[] => {
    return comments.map(comment => {
      if (comment.id === parentId) {
        return {
          ...comment,
          replies: [...(comment.replies || []), newReply],
          _count: {
            ...comment._count,
            replies: comment._count.replies + 1,
          },
        };
      }
      if (comment.replies && comment.replies.length > 0) {
        return {
          ...comment,
          replies: updateCommentWithReply(comment.replies, parentId, newReply),
        };
      }
      return comment;
    });
  };

  const handleReply = (commentId: number, parentUsername: string) => {
    setReplyToComment({ commentId, username: parentUsername });
    setNewComment(`@${parentUsername} `);
    // Focus sur le champ de saisie
    setTimeout(() => {
      textInputRef.current?.focus();
    }, 100);
  };

  const handleLike = async (commentId: number) => {
    if (!user?.id) return;

    try {
      await commentService.toggleCommentLike(commentId, parseInt(user.id));
      
      // Mettre à jour l'état local
      setComments(prev => updateCommentLike(prev, commentId, parseInt(user.id)));
    } catch (error) {
      console.error('Error toggling comment like:', error);
      Alert.alert('Erreur', 'Impossible de liker le commentaire');
    }
  };

  const updateCommentLike = (
    comments: HierarchicalComment[], 
    commentId: number, 
    userId: number
  ): HierarchicalComment[] => {
    return comments.map(comment => {
      if (comment.id === commentId) {
        const hasLiked = comment.likes.some(like => like.userId === userId);
        const newLikes = hasLiked
          ? comment.likes.filter(like => like.userId !== userId)
          : [...comment.likes, { commentId, userId, createdAt: new Date() }];
        
        return {
          ...comment,
          likes: newLikes,
          _count: {
            ...comment._count,
            likes: newLikes.length,
          },
        };
      }
      if (comment.replies && comment.replies.length > 0) {
        return {
          ...comment,
          replies: updateCommentLike(comment.replies, commentId, userId),
        };
      }
      return comment;
    });
  };

  const handleEdit = async (commentId: number, content: string) => {
    if (!user?.id) return;

    try {
      const updatedComment = await commentService.updateComment(
        commentId, 
        content, 
        parseInt(user.id)
      );
      
      setComments(prev => updateCommentContent(prev, commentId, updatedComment));
    } catch (error) {
      console.error('Error editing comment:', error);
      Alert.alert('Erreur', 'Impossible de modifier le commentaire');
    }
  };

  const handleDelete = async (commentId: number) => {
    if (!user?.id) return;

    try {
      await commentService.deleteComment(commentId, parseInt(user.id));
      setComments(prev => removeComment(prev, commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
      Alert.alert('Erreur', 'Impossible de supprimer le commentaire');
    }
  };

  const updateCommentContent = (
    comments: HierarchicalComment[], 
    commentId: number, 
    updatedComment: HierarchicalComment
  ): HierarchicalComment[] => {
    return comments.map(comment => {
      if (comment.id === commentId) {
        return updatedComment;
      }
      if (comment.replies && comment.replies.length > 0) {
        return {
          ...comment,
          replies: updateCommentContent(comment.replies, commentId, updatedComment),
        };
      }
      return comment;
    });
  };

  const removeComment = (
    comments: HierarchicalComment[], 
    commentId: number
  ): HierarchicalComment[] => {
    return comments
      .filter(comment => comment.id !== commentId)
      .map(comment => {
        if (comment.replies && comment.replies.length > 0) {
          return {
            ...comment,
            replies: removeComment(comment.replies, commentId),
          };
        }
        return comment;
      });
  };

  const handleLoadMoreReplies = async (commentId: number) => {
    try {
      const response = await commentService.getCommentReplies(commentId);
      setComments(prev => updateCommentReplies(prev, commentId, response.replies));
    } catch (error) {
      console.error('Error loading replies:', error);
      Alert.alert('Erreur', 'Impossible de charger les réponses');
    }
  };

  const updateCommentReplies = (
    comments: HierarchicalComment[], 
    commentId: number, 
    replies: HierarchicalComment[]
  ): HierarchicalComment[] => {
    return comments.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          replies: replies,
        };
      }
      if (comment.replies && comment.replies.length > 0) {
        return {
          ...comment,
          replies: updateCommentReplies(comment.replies, commentId, replies),
        };
      }
      return comment;
    });
  };

  const cancelReply = () => {
    setReplyToComment(null);
    setNewComment('');
    Keyboard.dismiss();
  };

  const renderComment = ({ item }: { item: HierarchicalComment }) => (
    <HierarchicalCommentComponent
      comment={item}
      currentUserId={parseInt(user?.id || '0')}
      onReply={handleReply}
      onLike={handleLike}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onLoadMoreReplies={handleLoadMoreReplies}
    />
  );

  const adjustedHeight = screenHeight - keyboardHeight;
  const inputBottomPosition = isKeyboardVisible ? keyboardHeight + 20 : 20;

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle="fullScreen"
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <FontAwesome name="times" size={24} color="#666" />
          </TouchableOpacity>
          <Text style={styles.title}>Commentaires</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Comments List */}
        <View style={[styles.commentsContainer, { marginBottom: inputBottomPosition + 80 }]}>
          <ScrollView
            style={styles.commentsScrollView}
            contentContainerStyle={styles.commentsContentContainer}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="interactive"
            showsVerticalScrollIndicator={false}
          >
            {comments.length === 0 && !isLoading ? (
              <View style={styles.emptyContainer}>
                <FontAwesome name="comment-o" size={50} color="#ccc" />
                <Text style={styles.emptyText}>Aucun commentaire pour le moment</Text>
                <Text style={styles.emptySubtext}>Soyez le premier à commenter !</Text>
              </View>
            ) : (
              comments.map((item) => (
                <View key={item.id.toString()}>
                  {renderComment({ item })}
                </View>
              ))
            )}
            
            {isLoading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#1da1f2" />
              </View>
            )}
          </ScrollView>
        </View>

        {/* Fixed Input Container */}
        <View style={[
          styles.fixedInputWrapper,
          { bottom: inputBottomPosition }
        ]}>
          {/* Reply indicator */}
          {replyToComment && (
            <View style={styles.replyIndicator}>
              <Text style={styles.replyText}>
                En réponse à @{replyToComment.username}
              </Text>
              <TouchableOpacity onPress={cancelReply}>
                <FontAwesome name="times" size={16} color="#666" />
              </TouchableOpacity>
            </View>
          )}

          {/* Input */}
          <View style={styles.inputContainer}>
            <TextInput
              ref={textInputRef}
              style={styles.textInput}
              placeholder={replyToComment ? "Écrivez votre réponse..." : "Ajoutez un commentaire..."}
              value={newComment}
              onChangeText={setNewComment}
              multiline
              maxLength={500}
              textAlignVertical="top"
              returnKeyType="send"
              blurOnSubmit={false}
              onSubmitEditing={handleAddComment}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                (!newComment.trim() || isSubmitting) && styles.sendButtonDisabled,
              ]}
              onPress={handleAddComment}
              disabled={!newComment.trim() || isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <FontAwesome name="send" size={16} color="#fff" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e8ed',
    backgroundColor: '#fff',
    zIndex: 1000,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  closeButton: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#14171a',
  },
  headerSpacer: {
    width: 40,
  },
  commentsContainer: {
    flex: 1,
  },
  commentsScrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  commentsContentContainer: {
    paddingVertical: 10,
    paddingBottom: 20,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    minHeight: 200,
  },
  emptyText: {
    fontSize: 16,
    color: '#657786',
    marginTop: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#8899a6',
    marginTop: 4,
    textAlign: 'center',
  },
  fixedInputWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e1e8ed',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  replyIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f7f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e8ed',
  },
  replyText: {
    fontSize: 14,
    color: '#1da1f2',
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: Platform.OS === 'ios' ? 20 : 16,
    backgroundColor: '#fff',
    minHeight: 70,
    maxHeight: 120,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e1e8ed',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 12,
    maxHeight: 80,
    minHeight: 40,
    fontSize: 14,
    lineHeight: 18,
    backgroundColor: '#fff',
  },
  sendButton: {
    backgroundColor: '#1da1f2',
    borderRadius: 20,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 40,
    minHeight: 40,
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
  },
});

export default HierarchicalCommentsModal; 