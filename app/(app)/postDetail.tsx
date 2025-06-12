import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Share } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Clipboard from 'expo-clipboard';
import { useAuth } from '../src/context/AuthContext';
import PostItem, { Post } from '../src/components/Feed/PostItem';
import HierarchicalCommentsModal from '../src/components/modals/HierarchicalCommentsModal';
import postService, { PostTagRelation, Interaction } from '../src/services/postService';
import favoritesService from '../src/services/favoritesService';
import { formatPostDate } from '../src/utils/dateUtils';
import { detectMediaType } from '../src/utils/mediaUtils';
import styles from '../src/styles/screens/postDetailStyles';

const PostDetailScreen: React.FC = () => {
  const router = useRouter();
  const authContext = useAuth();
  const user = authContext?.user;
  const { postId } = useLocalSearchParams<{ postId: string }>();
  
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [commentsVisible, setCommentsVisible] = useState(false);

  const loadPost = useCallback(async () => {
    try {
      setLoading(true);
      const response = await postService.getPostById(Number(postId), user?.id ? Number(user.id) : undefined);
      
      if (response) {
        const detectedType = detectMediaType(response.cloudinaryUrl, response.cloudinaryPublicId, response.imageMetadata);
        const mediaTypes: ('image' | 'video')[] = [detectedType];

        const uiPost: Post = {
          id: response.id.toString(),
          username: response.user?.username || response.user?.name || 'Unknown User',
          avatar: response.user?.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(response.user?.username || 'User')}&background=E10600&color=fff`,
          images: response.cloudinaryUrl ? [response.cloudinaryUrl] : [],
          imagePublicIds: response.cloudinaryPublicId ? [response.cloudinaryPublicId] : [],
          mediaTypes,
          title: response.title || '',
          description: response.body || '',
          tags: response.tags?.map((tagRelation: PostTagRelation) => ({
            id: tagRelation.tag.id.toString(),
            name: tagRelation.tag.name
          })) || [],
          likes: response.interactions?.filter((interaction: Interaction) => interaction.like).length || 0,
          liked: response.interactions?.some((interaction: Interaction) => interaction.userId === Number(user?.id) && interaction.like) || false,
          saved: response.isFavorited || false,
          comments: [],
          timeAgo: formatPostDate(response.createdAt),
        };
        
        console.log('📊 Post loaded successfully:', {
          id: uiPost.id,
          title: uiPost.title,
          mediaType: detectedType,
          commentsCount: uiPost.comments.length,
          liked: uiPost.liked,
          saved: uiPost.saved
        });
        
        setPost(uiPost);
      }
    } catch (error) {
      console.error('❌ Error loading post:', error);
      Alert.alert('Erreur', 'Impossible de charger le post');
      router.back();
    } finally {
      setLoading(false);
    }
  }, [postId, user?.id, router]);

  useEffect(() => {
    if (postId) {
      loadPost();
    }
  }, [postId, loadPost]);

  // Debug des modals
  useEffect(() => {
    console.log('🎭 Modal states changed:', {
      commentsVisible,
      postId
    });
  }, [commentsVisible, postId]);

  const handleLike = async (postId: string) => {
    if (!user?.id || !post) return;
    
    // Store original state before optimistic update
    const originalLiked = post.liked;
    const originalLikes = post.likes;
    
    try {
      // Optimistic update
      setPost(prev => prev ? {
        ...prev,
        liked: !prev.liked,
        likes: prev.liked ? prev.likes - 1 : prev.likes + 1
      } : prev);
      
      // API call
      await postService.default.toggleLike(parseInt(postId), parseInt(user.id));
      console.log('🔄 Like post:', postId);
    } catch (error) {
      console.error('❌ Error liking post:', error);
      // Revert to original state
      setPost(prev => prev ? {
        ...prev,
        liked: originalLiked,
        likes: originalLikes
      } : prev);
      Alert.alert('Erreur', 'Impossible d\'ajouter un like pour le moment.');
    }
  };

  const handleSave = async (postId: string) => {
    if (!user?.id || !post) return;
    
    // Store original state before optimistic update
    const originalSaved = post.saved;
    
    try {
      // Optimistic update
      setPost(prev => prev ? {
        ...prev,
        saved: !prev.saved
      } : prev);
      
      await favoritesService.toggleFavorite(Number(postId), Number(user.id));
    } catch (error) {
      console.error('❌ Error saving post:', error);
      // Revert to original state
      setPost(prev => prev ? {
        ...prev,
        saved: originalSaved
      } : prev);
      Alert.alert('Erreur', 'Impossible de sauvegarder ce post pour le moment.');
    }
  };

  const handleComment = () => {
    console.log('📝 Opening comments for post:', post?.id);
    setCommentsVisible(true);
  };

  const handleShare = async () => {
    if (!post) return;
    
    try {
      console.log('📤 Sharing post:', post.id);
      
      const shareMessage = `${post.title}\n\n${post.description}\n\nVu sur GearConnect`;
      const shareUrl = `https://gearconnect.app/post/${post.id}`;
      
      const result = await Share.share({
        message: `${shareMessage}\n${shareUrl}`,
        url: shareUrl,
      });

      if (result.action === Share.sharedAction) {
        console.log('Post shared successfully');
      } else if (result.action === Share.dismissedAction) {
        console.log('Share dismissed');
      }
      
    } catch (error) {
      console.error('❌ Error sharing post:', error);
      Alert.alert('Erreur', 'Impossible de partager ce post');
    }
  };

  const handleProfilePress = (username: string) => {
    router.push({
      pathname: '/(app)/userProfile',
      params: { username }
    });
  };

  const handleBack = useCallback(() => {
    // Fermer tous les modals d'abord
    if (commentsVisible) {
      setCommentsVisible(false);
      return;
    }
    // Ensuite retourner à la page précédente
    router.back();
  }, [commentsVisible, router]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <FontAwesome name="arrow-left" size={20} color="#262626" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Post</Text>
          <View style={styles.backButton} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#E10600" />
          <Text style={styles.loadingText}>Chargement...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!post) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <FontAwesome name="arrow-left" size={20} color="#262626" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Post</Text>
          <View style={styles.backButton} />
        </View>
        <View style={styles.errorContainer}>
          <FontAwesome name="exclamation-circle" size={60} color="#CCCCCC" />
          <Text style={styles.errorTitle}>Post introuvable</Text>
          <Text style={styles.errorSubtitle}>Ce post n&apos;existe plus ou a été supprimé</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={20} color="#262626" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Post</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <PostItem
          post={post}
          onLike={handleLike}
          onSave={handleSave}
          onComment={handleComment}
          onShare={handleShare}
          onProfilePress={handleProfilePress}
          currentUsername={user?.username || undefined}
          isVisible={true}
          isCurrentlyVisible={true}
        />
      </ScrollView>

      {/* Comments Modal */}
      <HierarchicalCommentsModal
        isVisible={commentsVisible}
        onClose={() => setCommentsVisible(false)}
        postId={Number(post.id)}
      />
    </SafeAreaView>
  );
};

export default PostDetailScreen; 