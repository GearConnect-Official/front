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
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import * as Clipboard from 'expo-clipboard';
import { useAuth } from '../src/context/AuthContext';
import PostItem, { Post } from '../src/components/Feed/PostItem';
import HierarchicalCommentsModal from '../src/components/modals/HierarchicalCommentsModal';
import postService, { PostTagRelation, Interaction } from '../src/services/postService';
import favoritesService from '../src/services/favoritesService';
import { formatPostDate } from '../src/utils/dateUtils';
import styles from '../src/styles/screens/postDetailStyles';

const PostDetailScreen: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { postId } = useLocalSearchParams<{ postId: string }>();
  
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [commentsVisible, setCommentsVisible] = useState(false);

  const loadPost = useCallback(async () => {
    try {
      setLoading(true);
      const response = await postService.getPostById(Number(postId), user?.id ? Number(user.id) : undefined);
      
      if (response) {
        const uiPost: Post = {
          id: response.id.toString(),
          username: response.user?.username || response.user?.name || 'Unknown User',
          avatar: response.user?.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(response.user?.username || 'User')}&background=E10600&color=fff`,
          images: response.cloudinaryUrl ? [response.cloudinaryUrl] : [],
          imagePublicIds: response.cloudinaryPublicId ? [response.cloudinaryPublicId] : [],
          mediaTypes: ['image'],
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
    if (!user?.id) return;
    
    try {
      // Optimistic update
      setPost(prev => prev ? {
        ...prev,
        liked: !prev.liked,
        likes: prev.liked ? prev.likes - 1 : prev.likes + 1
      } : prev);
      
      // API call would go here
      console.log('🔄 Like post:', postId);
    } catch (error) {
      console.error('❌ Error liking post:', error);
      // Revert optimistic update
      setPost(prev => prev ? {
        ...prev,
        liked: !prev.liked,
        likes: prev.liked ? prev.likes + 1 : prev.likes - 1
      } : prev);
    }
  };

  const handleSave = async (postId: string) => {
    if (!user?.id) return;
    
    try {
      // Optimistic update
      setPost(prev => prev ? {
        ...prev,
        saved: !prev.saved
      } : prev);
      
      await favoritesService.toggleFavorite(Number(postId), Number(user.id));
    } catch (error) {
      console.error('❌ Error saving post:', error);
      // Revert optimistic update
      setPost(prev => prev ? {
        ...prev,
        saved: !prev.saved
      } : prev);
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
      
      // TODO: PRODUCTION - Quand l'app sera déployée en production, modifier cette fonction pour :
      // 1. Partager un lien direct vers le post dans l'app (ex: https://gearconnect.app/post/123)
      // 2. Inclure une preview du post avec titre/description/image miniature
      // 3. Ne plus partager directement l'URL Cloudinary mais plutôt rediriger vers le post complet
      // 4. Permettre aux utilisateurs externes de voir le post même sans avoir l'app installée
      
      // Vérifier si le partage est disponible sur l'appareil
      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert('Erreur', 'Le partage n&apos;est pas disponible sur cet appareil');
        return;
      }

      // Créer le contenu à partager
      const shareContent = `${post.title}\n\n${post.description}\n\nVu sur GearConnect`;
      
      // Si le post a une image, on peut essayer de la partager aussi
      if (post.images.length > 0) {
        try {
          // Partager avec l'image (si possible)
          await Sharing.shareAsync(post.images[0], {
            mimeType: 'image/jpeg',
            dialogTitle: 'Partager ce post',
            UTI: 'public.jpeg'
          });
        } catch (imageError) {
          console.log('⚠️ Image sharing failed, falling back to text:', imageError);
          // Fallback vers le partage de texte
          await shareTextContent(shareContent);
        }
      } else {
        // Partager seulement le texte
        await shareTextContent(shareContent);
      }
      
    } catch (error) {
      console.error('❌ Error sharing post:', error);
      Alert.alert('Erreur', 'Impossible de partager ce post');
    }
  };

  const shareTextContent = async (content: string) => {
    // Pour le texte, on peut utiliser l'API Web Share ou créer un fichier temporaire
    try {
      // Créer un fichier temporaire avec le contenu
      const tempFile = `${FileSystem.documentDirectory}temp_share.txt`;
      await FileSystem.writeAsStringAsync(tempFile, content);
      
      await Sharing.shareAsync(tempFile, {
        mimeType: 'text/plain',
        dialogTitle: 'Partager ce post',
      });
      
      // Nettoyer le fichier temporaire
      await FileSystem.deleteAsync(tempFile, { idempotent: true });
    } catch (error) {
      console.log('⚠️ Text file sharing failed:', error);
      Alert.alert('Info', 'Contenu copié dans le presse-papiers', [
        { text: 'OK', onPress: () => {
          // Fallback: copier dans le presse-papiers
          Clipboard.setStringAsync(content);
        }}
      ]);
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
          currentUsername={user?.username}
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