import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Alert,
  RefreshControl,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import favoritesService from '../services/favoritesService';
import PostItem, { Comment as PostItemComment, Post, PostTag } from '../components/Feed/PostItem';
import { Post as APIPost } from '../services/postService';
import { formatPostDate, isPostFromToday } from '../utils/dateUtils';
import styles from '../styles/screens/favoritesStyles';

const SCREEN_WIDTH = Dimensions.get('window').width;

interface UIPost {
  id: string;
  username: string;
  avatar: string;
  images: string[];
  imagePublicIds?: string[];
  mediaTypes?: ('image' | 'video')[];
  title: string;
  description: string;
  tags: PostTag[];
  likes: number;
  liked: boolean;
  saved: boolean;
  comments: PostItemComment[];
  timeAgo: string;
  isFromToday: boolean;
}

// Helper function to convert API post to UI post
const convertApiPostToUiPost = (apiPost: APIPost, currentUserId: number): UIPost => {
  const liked = apiPost.interactions?.some(
    (interaction) => interaction.userId === currentUserId && interaction.like
  ) || false;
  
  const likes = apiPost.interactions?.filter(interaction => interaction.like).length || 0;
  
  const comments = apiPost.interactions?.filter(interaction => interaction.comment)
    .map(interaction => ({
      id: `${interaction.userId}`,
      username: `user_${interaction.userId}`,
      avatar: `https://randomuser.me/api/portraits/men/${interaction.userId % 50}.jpg`,
      text: interaction.comment || '',
      timeAgo: '1h',
      likes: 0,
    })) || [];

  const images = [apiPost.image || apiPost.cloudinaryUrl || 'https://via.placeholder.com/300'];
  const imagePublicIds = apiPost.cloudinaryPublicId ? [apiPost.cloudinaryPublicId] : undefined;
  
  // Media type detection
  const detectMediaType = (): 'image' | 'video' => {
    if (apiPost.imageMetadata) {
      try {
        const metadata = JSON.parse(apiPost.imageMetadata);
        if (metadata.resource_type === 'video' || 
            metadata.mediaType === 'video' ||
            metadata.resourceType === 'video') {
          return 'video';
        }
        if (metadata.format && ['mp4', 'mov', 'avi', 'webm', 'mkv'].includes(metadata.format.toLowerCase())) {
          return 'video';
        }
      } catch (e) {
        console.warn('Failed to parse image metadata:', e);
      }
    }
    
    if (apiPost.cloudinaryUrl) {
      const videoExtensions = ['.mp4', '.mov', '.avi', '.mkv', '.webm', '.m4v'];
      const lowercaseUrl = apiPost.cloudinaryUrl.toLowerCase();
      
      if (videoExtensions.some(ext => lowercaseUrl.includes(ext)) ||
          lowercaseUrl.includes('/video/upload') || 
          lowercaseUrl.includes('/v_') ||
          lowercaseUrl.includes('f_mp4') || 
          lowercaseUrl.includes('f_webm') || 
          lowercaseUrl.includes('f_mov')) {
        return 'video';
      }
    }
    
    return 'image';
  };
  
  const detectedType = detectMediaType();
  const mediaTypes: ('image' | 'video')[] = [detectedType];
  
  const timeAgo = formatPostDate(apiPost.createdAt || new Date());
  
  const fullContent = `${apiPost.title || ''} ${apiPost.body || ''}`.trim();
  const title = apiPost.title || fullContent.substring(0, 60) || 'Untitled Post';
  const description = apiPost.body || fullContent || '';
  
  const tags: PostTag[] = apiPost.tags?.map(tagRelation => ({
    id: tagRelation.tag.id?.toString(),
    name: tagRelation.tag.name
  })) || [];

  return {
    id: apiPost.id?.toString() || '',
    username: apiPost.user?.username || `user_${apiPost.userId}`,
    avatar: apiPost.user?.imageUrl || `https://randomuser.me/api/portraits/men/${apiPost.userId % 50}.jpg`,
    images,
    imagePublicIds,
    mediaTypes,
    title,
    description,
    tags,
    likes,
    liked,
    saved: true, // Always true in favorites screen
    comments,
    timeAgo: timeAgo,
    isFromToday: isPostFromToday(apiPost.createdAt || new Date()),
  };
};

const FavoritesScreen: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<UIPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Load user's favorite posts
  const loadFavorites = useCallback(async (page = 1, limit = 10) => {
    if (!user?.id) {
      setLoadingError('Vous devez être connecté pour voir vos favoris');
      setIsLoading(false);
      return;
    }

    try {
      setLoadingError(null);
      const currentUserId = parseInt(user.id);
      
      const response = await favoritesService.getUserFavorites(currentUserId, page, limit);
      
      if (response.favorites && Array.isArray(response.favorites)) {
        const uiPosts = response.favorites.map(apiPost => convertApiPostToUiPost(apiPost, currentUserId));
        
        if (page === 1) {
          setFavorites(uiPosts);
        } else {
          setFavorites(prev => [...prev, ...uiPosts]);
        }
        
        setHasMorePosts(response.pagination.page < response.pagination.totalPages);
      } else {
        setLoadingError('Format de réponse API inattendu');
      }
    } catch (error) {
      console.error('Erreur lors du chargement des favoris:', error);
      setLoadingError('Impossible de charger vos favoris. Veuillez réessayer plus tard.');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
      setIsLoadingMore(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  const handleRefresh = () => {
    setRefreshing(true);
    setCurrentPage(1);
    loadFavorites(1);
  };

  const handleLoadMore = () => {
    if (!isLoadingMore && hasMorePosts) {
      setIsLoadingMore(true);
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      loadFavorites(nextPage);
    }
  };

  const handleRemoveFromFavorites = async (postId: string) => {
    if (!user?.id) return;

    const currentUserId = parseInt(user.id);

    try {
      await favoritesService.toggleFavorite(parseInt(postId), currentUserId);
      
      // Remove from local state
      setFavorites(prev => prev.filter(post => post.id !== postId));
      
      Alert.alert('Succès', 'Post retiré de vos favoris');
    } catch (error) {
      console.error('Erreur lors de la suppression des favoris:', error);
      Alert.alert('Erreur', 'Impossible de retirer ce post de vos favoris');
    }
  };

  const handleLike = () => {
    // Placeholder - could implement like functionality
    Alert.alert('Info', 'Fonctionnalité de like disponible sur l\'écran principal');
  };

  const handleComment = () => {
    // Placeholder - could implement comment functionality
    Alert.alert('Info', 'Fonctionnalité de commentaire disponible sur l\'écran principal');
  };

  const handleShare = () => {
    // Placeholder - could implement share functionality
    Alert.alert('Info', 'Fonctionnalité de partage disponible sur l\'écran principal');
  };

  const renderFavoritePost = ({ item }: { item: UIPost }) => (
    <PostItem
      post={item}
      onLike={() => handleLike()}
      onComment={() => handleComment()}
      onShare={() => handleShare()}
      onSave={() => handleRemoveFromFavorites(item.id)}
      onProfilePress={() => {}}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <FontAwesome name="bookmark-o" size={60} color="#CCCCCC" />
      <Text style={styles.emptyStateTitle}>Aucun favori</Text>
      <Text style={styles.emptyStateDescription}>
        Les posts que vous sauvegardez apparaîtront ici
      </Text>
      <TouchableOpacity 
        style={styles.goHomeButton}
        onPress={() => router.push('/(app)/(tabs)')}
      >
        <FontAwesome name="home" size={16} color="#FFFFFF" style={styles.goHomeIcon} />
        <Text style={styles.goHomeText}>Retour au fil</Text>
      </TouchableOpacity>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => router.back()}
      >
        <FontAwesome name="arrow-left" size={20} color="#000" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Mes Favoris</Text>
      <View style={styles.headerSpacer} />
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        {renderHeader()}
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF5864" />
          <Text style={styles.loadingText}>Chargement de vos favoris...</Text>
        </View>
      </View>
    );
  }

  if (loadingError) {
    return (
      <View style={styles.container}>
        {renderHeader()}
        <View style={styles.errorContainer}>
          <FontAwesome name="warning" size={50} color="#FF5864" />
          <Text style={styles.errorText}>{loadingError}</Text>
          <TouchableOpacity style={styles.reloadButton} onPress={() => loadFavorites()}>
            <Text style={styles.reloadButtonText}>Réessayer</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderHeader()}
      <FlatList
        data={favorites}
        renderItem={renderFavoritePost}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        ListEmptyComponent={renderEmptyState}
        ListFooterComponent={
          isLoadingMore ? (
            <View style={styles.footerLoader}>
              <ActivityIndicator size="small" color="#FF5864" />
            </View>
          ) : null
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default FavoritesScreen; 