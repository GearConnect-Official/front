import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { HierarchicalComment as CommentType } from '../../services/commentService';
import { formatPostDate } from '../../utils/dateUtils';
import { hierarchicalCommentStyles as styles } from '../../styles/components/hierarchicalCommentStyles';

interface HierarchicalCommentProps {
  comment: CommentType;
  currentUserId: number;
  onReply: (commentId: number, parentUsername: string) => void;
  onLike: (commentId: number) => void;
  onEdit: (commentId: number, content: string) => void;
  onDelete: (commentId: number) => void;
  onLoadMoreReplies?: (commentId: number) => void;
  level?: number; // Niveau de profondeur pour l'indentation
  maxLevel?: number; // Niveau maximum d'indentation
}

const HierarchicalComment: React.FC<HierarchicalCommentProps> = ({
  comment,
  currentUserId,
  onReply,
  onLike,
  onEdit,
  onDelete,
  onLoadMoreReplies,
  level = 0,
  maxLevel = 3,
}) => {
  const [showReplies, setShowReplies] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  const isOwnComment = comment.userId === currentUserId;
  const hasLiked = comment.likes.some(like => like.userId === currentUserId);
  const likesCount = comment._count?.likes || 0;
  const repliesCount = comment._count?.replies || 0;

  const handleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);
    try {
      await onLike(comment.id);
    } finally {
      setIsLiking(false);
    }
  };

  const handleEdit = () => {
    Alert.prompt(
      'Modifier le commentaire',
      'Modifiez votre commentaire',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Modifier',
          onPress: (text) => {
            if (text && text.trim()) {
              onEdit(comment.id, text.trim());
            }
          },
        },
      ],
      'plain-text',
      comment.content
    );
  };

  const handleDelete = () => {
    Alert.alert(
      'Supprimer le commentaire',
      'Êtes-vous sûr de vouloir supprimer ce commentaire ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => onDelete(comment.id),
        },
      ]
    );
  };

  const handleReply = () => {
    onReply(comment.id, comment.user.username);
  };

  const toggleReplies = () => {
    if (!showReplies && repliesCount > 0 && (!comment.replies || comment.replies.length === 0)) {
      // Charger les réponses si elles ne sont pas encore chargées
      onLoadMoreReplies?.(comment.id);
    }
    setShowReplies(!showReplies);
  };

  const marginLeft = Math.min(level, maxLevel) * 16; // Indentation limitée

  return (
    <View style={[styles.container, { marginLeft }]}>
      {/* Main comment */}
      <View style={styles.commentContainer}>
        <View style={styles.avatarContainer}>
          <Image
            source={{
              uri: `https://randomuser.me/api/portraits/${comment.userId % 2 === 0 ? 'men' : 'women'}/${(comment.userId % 50) + 1}.jpg`
            }}
            style={styles.avatar}
          />
          {level > 0 && <View style={styles.threadLine} />}
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.header}>
            <Text style={styles.username}>{comment.user.username}</Text>
            <Text style={styles.timestamp}>{formatPostDate(comment.createdAt)}</Text>
          </View>

          <Text style={styles.content}>{comment.content}</Text>

          <View style={styles.actions}>
            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={handleReply}
              disabled={level >= maxLevel}
            >
              <FontAwesome 
                name="reply" 
                size={14} 
                color={level >= maxLevel ? "#ccc" : "#666"} 
              />
              <Text style={[styles.actionText, level >= maxLevel && styles.disabledText]}>
                Répondre
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={handleLike}
              disabled={isLiking}
            >
              {isLiking ? (
                <ActivityIndicator size="small" color="#666" />
              ) : (
                <FontAwesome 
                  name={hasLiked ? "heart" : "heart-o"} 
                  size={14} 
                  color={hasLiked ? "#e91e63" : "#666"} 
                />
              )}
              {likesCount > 0 && (
                <Text style={[styles.actionText, hasLiked && styles.likedText]}>
                  {likesCount}
                </Text>
              )}
            </TouchableOpacity>

            {isOwnComment && (
              <>
                <TouchableOpacity style={styles.actionButton} onPress={handleEdit}>
                  <FontAwesome name="edit" size={14} color="#666" />
                  <Text style={styles.actionText}>Modifier</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton} onPress={handleDelete}>
                  <FontAwesome name="trash" size={14} color="#666" />
                  <Text style={styles.actionText}>Supprimer</Text>
                </TouchableOpacity>
              </>
            )}
          </View>

          {/* Show replies toggle */}
          {repliesCount > 0 && (
            <TouchableOpacity style={styles.showRepliesButton} onPress={toggleReplies}>
              <View style={styles.repliesIndicator} />
              <Text style={styles.showRepliesText}>
                {showReplies ? 'Masquer' : 'Afficher'} {repliesCount} réponse{repliesCount > 1 ? 's' : ''}
              </Text>
              <FontAwesome 
                name={showReplies ? "chevron-up" : "chevron-down"} 
                size={12} 
                color="#666" 
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Replies */}
      {showReplies && comment.replies && comment.replies.length > 0 && (
        <View style={styles.repliesContainer}>
          {comment.replies.map((reply) => (
            <HierarchicalComment
              key={reply.id}
              comment={reply}
              currentUserId={currentUserId}
              onReply={onReply}
              onLike={onLike}
              onEdit={onEdit}
              onDelete={onDelete}
              onLoadMoreReplies={onLoadMoreReplies}
              level={level + 1}
              maxLevel={maxLevel}
            />
          ))}
        </View>
      )}
    </View>
  );
};

export default HierarchicalComment; 