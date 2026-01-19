import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Animated,
  RefreshControl,
  FlatList,
  StatusBar,
  ActivityIndicator,
  NativeScrollEvent,
  NativeSyntheticEvent,
  FlatListProps,
  Share,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import * as Clipboard from 'expo-clipboard';
import { homeStyles as styles } from "../styles/screens";
import theme from "../styles/config/theme";
import StoryModal from "../components/modals/StoryModal";
import HierarchicalCommentsModal from "../components/modals/HierarchicalCommentsModal";
import PostItem, { Comment as PostItemComment, PostTag } from "../components/Feed/PostItem";
import { Post as APIPost } from "../services/postService";
import { formatPostDate, isPostFromToday } from "../utils/dateUtils";
import * as postService from '../services/postService';
import commentService from '../services/commentService';
import favoritesService from '../services/favoritesService';
import { useAuth } from '../context/AuthContext';
import useVisibilityTracker from '../hooks/useVisibilityTracker';
// Hooks complexes temporairement désactivés - version simple pour debug
import { detectMediaType } from '../utils/mediaUtils';
import { ApiError, ErrorType } from '../services/axiosConfig';
import { CloudinaryAvatar } from "../components/media/CloudinaryImage";
import { defaultImages } from "../config/defaultImages";
import userService from "../services/userService";
import { useMessage } from '../context/MessageContext';
import { MessageService } from '../services/messageService';
import { trackPost, trackScreenView } from '../utils/mixpanelTracking';

// Types
interface Story {
  id: string;
  username: string;
  avatar: string;
  viewed: boolean;
  content?: string;
}

interface UIPost {
  id: string;
  userId: number;  // ID de l'utilisateur qui a créé le post
  username: string;
  avatar: string;
  profilePicturePublicId?: string; // Nouveau : pour CloudinaryAvatar
  images: string[];
  imagePublicIds?: string[];  // Public IDs Cloudinary pour l'optimisation
  mediaTypes?: ('image' | 'video')[];  // Types de médias pour chaque élément
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

// Nom d'utilisateur courant
const CURRENT_USERNAME = "john_doe";

// Fonction helper pour convertir les posts de l'API au format d'UI
const convertApiPostToUiPost = (apiPost: APIPost, currentUserId: number): UIPost => {
  const images = apiPost.cloudinaryUrl ? [apiPost.cloudinaryUrl] : [];
  const imagePublicIds = apiPost.cloudinaryPublicId ? [apiPost.cloudinaryPublicId] : [];
  const mediaTypes: ('image' | 'video')[] = apiPost.imageMetadata ? 
    [detectMediaType(apiPost.cloudinaryUrl, apiPost.cloudinaryPublicId, apiPost.imageMetadata)] : 
    ['image'];

  const title = apiPost.title ? `${apiPost.title}` : '';
  const description = apiPost.body || '';

  const likes = apiPost.interactions?.filter((i: any) => i.like).length || 0;
  const liked = apiPost.interactions?.some((i: any) => i.like && i.userId === currentUserId) || false;

  const comments = apiPost.interactions?.filter((i: any) => i.comment).map((interaction: any) => ({
    id: interaction.id?.toString() || '',
    username: interaction.user?.username || `user_${interaction.userId}`,
    avatar: interaction.user?.profilePicturePublicId ? 
      '' : // On laisse vide, CloudinaryAvatar le gérera
      (interaction.user?.profilePicture || `https://via.placeholder.com/32`),
    profilePicturePublicId: interaction.user?.profilePicturePublicId, // Nouveau champ
    text: interaction.comment || '',
    timeAgo: formatPostDate(interaction.createdAt || new Date()),
    likes: 0,
  })) || [];

  const tags = apiPost.tags?.map((tagRelation: any) => ({
    id: tagRelation.tag.id,
    name: tagRelation.tag.name
  })) || [];

  // Créer l'avatar de l'utilisateur principal du post
  const userAvatar = (apiPost.user as any)?.profilePicturePublicId ? 
    '' : // On laisse vide pour CloudinaryAvatar
    ((apiPost.user as any)?.profilePicture || `https://via.placeholder.com/40`);

  return {
    id: apiPost.id?.toString() || '',
    userId: apiPost.userId,  // Inclure le userId pour la navigation vers le profil
    username: apiPost.user?.username || `user_${apiPost.userId}`,
    avatar: userAvatar,
    profilePicturePublicId: (apiPost.user as any)?.profilePicturePublicId,
    images,
    imagePublicIds,
    mediaTypes,
    title,
    description,
    tags,
    likes,
    liked,
    saved: (apiPost as any).isFavorited || false,
    comments,
    timeAgo: formatPostDate(apiPost.createdAt || new Date()),
    isFromToday: isPostFromToday(apiPost.createdAt || new Date()),
  };
};

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList) as React.ComponentType<FlatListProps<UIPost>>;

const HomeScreen: React.FC = () => {
  const router = useRouter();
  const authContext = useAuth();
  const user = authContext?.user;
  const { showError, showInfo, showMessage } = useMessage();
  const [stories, setStories] = useState<Story[]>([]);
  const [isStoryModalVisible, setIsStoryModalVisible] = useState(false);
  const [currentStoryId, setCurrentStoryId] = useState("");
  const [isCommentsModalVisible, setIsCommentsModalVisible] = useState(false);
  const [currentPostId, setCurrentPostId] = useState("");
  const [currentUserData, setCurrentUserData] = useState<any>(null);
  const scrollY = useRef(new Animated.Value(0)).current;
  const isHeaderVisible = useRef(true);
  const lastScrollY = useRef(0);

  // Track screen view
  useEffect(() => {
    trackScreenView('Home');
  }, []);

  // Version simple et robuste - pas de cache complexe pour l'instant
  const [posts, setPosts] = useState<UIPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  
  // Debounce pour éviter les appels multiples
  const lastFetchTime = useRef<number>(0);
  const isCurrentlyFetching = useRef<boolean>(false);

  // Fonction de chargement - seulement pour initial + infinite scroll
  const loadPosts = useCallback(async (page = 1, append = false) => {
    // Protection contre les appels multiples
    if (isCurrentlyFetching.current) {
      console.log('🚫 POST FETCH BLOCKED - Already fetching');
      return;
    }
    
    // Debouncing léger seulement pour refresh manual
    const now = Date.now();
    if (!append && page === 1 && now - lastFetchTime.current < 1000) {
      console.log('🚫 POST FETCH BLOCKED - Manual refresh too soon');
      return;
    }

    isCurrentlyFetching.current = true;
    lastFetchTime.current = now;
    
    try {
      console.log('🔄 FETCHING POSTS - Page:', page, 'Append:', append);
      
      if (!append) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }
      
      setLoadingError(null);
      
      const currentUserId = user?.id ? parseInt(user.id.toString()) : null;
      const response = currentUserId 
        ? await postService.default.getPosts(page, 10, currentUserId)
        : await postService.default.getAllPosts();
      
      if (Array.isArray(response)) {
        const sortedPosts = [...response].sort((a, b) => {
          const dateA = new Date(a.createdAt || 0);
          const dateB = new Date(b.createdAt || 0);
          return dateB.getTime() - dateA.getTime();
        });
        
        const uiPosts = sortedPosts.map(apiPost => convertApiPostToUiPost(apiPost, currentUserId || 1));
        
        if (append) {
          setPosts(prev => [...prev, ...uiPosts]);
        } else {
          setPosts(uiPosts);
        }
        
        setHasMore(uiPosts.length === 10);
        setCurrentPage(page);
      }
      
    } catch (error) {
      console.error('❌ ERROR FETCHING POSTS:', error);
      setLoadingError('Unable to load posts');
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
      setRefreshing(false);
      isCurrentlyFetching.current = false;
    }
  }, [user?.id]);

  // Simple handlers without complex cache
  const handleLike = async (postId: string) => {
    if (!user?.id) {
      showError('You must be logged in to like posts');
      return;
    }

    try {
      const currentUserId = parseInt(user.id.toString());
      console.log('👍 Liking post:', postId);
      
      // Get current post state before toggle
      const currentPost = posts.find(p => p.id === postId);
      const wasLiked = currentPost?.liked || false;
      
      await postService.default.toggleLike(parseInt(postId), currentUserId);
      
      // Track the action
      trackPost.liked(postId, !wasLiked);
      
      // Simple optimistic update
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
          : post
      ));
    } catch (error) {
      console.error('❌ Error liking post:', error);
      showError('Failed to like post');
    }
  };

  const handleSave = async (postId: string) => {
    if (!user?.id) {
      showError('You must be logged in to save posts');
      return;
    }

    try {
      const currentUserId = parseInt(user.id.toString());
      console.log('💾 Saving post:', postId);
      
      // Get current post state before toggle
      const currentPost = posts.find(p => p.id === postId);
      const wasSaved = currentPost?.saved || false;
      
      await favoritesService.toggleFavorite(parseInt(postId), currentUserId);
      
      // Track the action
      trackPost.saved(postId, !wasSaved);
      
      // Simple optimistic update
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { ...post, saved: !post.saved }
          : post
      ));
    } catch (error) {
      console.error('❌ Error saving post:', error);
      showError('Failed to save post');
    }
  };

  // Hook de visibilité pour tracker les posts visibles
  const {
    viewabilityConfigCallbackPairs,
    isPostVisible,
    isPostCurrentlyVisible,
  } = useVisibilityTracker({
    minimumViewTime: 300, // 300ms pour être considéré comme visible
    itemVisiblePercentThreshold: 60, // 60% de l'item doit être visible
  });

  // Charger les données du profil utilisateur connecté
  const loadCurrentUserData = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      console.log('🔄 HomeScreen: Loading current user data...', user.id);
      const response = await userService.getProfile(Number(user.id));
      if (response.success && response.data) {
        console.log('✅ HomeScreen: Current user data loaded:', {
          username: response.data.username,
          hasProfilePicture: !!response.data.profilePicture,
          hasProfilePicturePublicId: !!response.data.profilePicturePublicId,
        });
        setCurrentUserData(response.data);
      }
    } catch (error) {
      console.error("❌ HomeScreen: Error loading current user data:", error);
    }
  }, [user?.id]);

  // Vérifier si on a une erreur réseau
  const isNetworkError = loadingError?.includes('Connection') || loadingError?.includes('Network');

  // Simulation du chargement des données des stories (à remplacer par un appel API réel plus tard)
  const loadStories = useCallback(() => {
    // Utiliser la vraie photo de profil pour l'utilisateur connecté
    const currentUserAvatar = currentUserData?.profilePicturePublicId ? 
      '' : // CloudinaryAvatar le gérera dans le composant story
      (currentUserData?.profilePicture || (user as any)?.profilePicture || "https://via.placeholder.com/40");

    // Stories mock data avec des images réalistes
    const mockStories: Story[] = [
      {
        id: "1",
        username: user?.username || currentUserData?.username || CURRENT_USERNAME,
        avatar: currentUserAvatar,
        viewed: false,
        content:
          "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      },
      {
        id: "2",
        username: "John",
        avatar: "https://randomuser.me/api/portraits/men/41.jpg",
        viewed: false,
        content:
          "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      },
      {
        id: "3",
        username: "Marie",
        avatar: "https://randomuser.me/api/portraits/women/64.jpg",
        viewed: false,
        content:
          "https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      },
      {
        id: "4",
        username: "Alex",
        avatar: "https://randomuser.me/api/portraits/men/61.jpg",
        viewed: true,
        content:
          "https://images.unsplash.com/photo-1546336502-94aa5d6c8bd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      },
      {
        id: "5",
        username: "Emma",
        avatar: "https://randomuser.me/api/portraits/women/33.jpg",
        viewed: true,
        content:
          "https://images.unsplash.com/photo-1513151233558-d860c5398176?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      },
      {
        id: "6",
        username: "Tom",
        avatar: "https://randomuser.me/api/portraits/men/91.jpg",
        viewed: true,
        content:
          "https://images.unsplash.com/photo-1519834022364-8dec37f38d05?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      },
    ];

    setStories(mockStories);
  }, [currentUserData, user]);

  // Charger les données une seule fois au montage
  useEffect(() => {
    console.log('🚀 HomeScreen mounted - Loading initial data');
    
    // Charger les stories (mock data)
    const loadInitialStories = () => {
      const mockStories: Story[] = [
        {
          id: "1",
          username: "Your story",
          avatar: "https://via.placeholder.com/40",
          viewed: false,
          content: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        },
        {
          id: "2",
          username: "John",
          avatar: "https://randomuser.me/api/portraits/men/41.jpg",
          viewed: false,
          content: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        }
      ];
      setStories(mockStories);
    };

    loadInitialStories();
    
    // Charger les posts initiaux
    if (posts.length === 0) {
      loadPosts(1, false);
    }
    
    // Charger les données utilisateur si on a un user
    if (user?.id) {
      loadCurrentUserData();
    }
  }, []); // Une seule fois au montage

  // Recharger les posts seulement quand l'utilisateur change
  useEffect(() => {
    if (user?.id) {
      console.log('👤 User changed - Reloading posts');
      loadPosts(1, false);
      loadCurrentUserData();
    }
  }, [user?.id]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadPosts(1, false); // Recharger depuis la page 1
  }, [loadPosts]);

  const handleLoadMore = useCallback(() => {
    if (!isLoadingMore && hasMore && !isCurrentlyFetching.current) {
      console.log('📊 INFINITE SCROLL TRIGGERED - Loading more posts, page:', currentPage + 1);
      loadPosts(currentPage + 1, true);
    } else {
      console.log('🚫 INFINITE SCROLL BLOCKED:', { 
        isLoadingMore, 
        hasMore, 
        isCurrentlyFetching: isCurrentlyFetching.current 
      });
    }
  }, [isLoadingMore, hasMore, currentPage, loadPosts]);

 // const handleViewStory = (storyId: string) => {
 //   setCurrentStoryId(storyId);
 //   setIsStoryModalVisible(true);
 // };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  //const handleStoryComplete = (storyId: string) => {
  //  setStories((prevStories) =>
  //    prevStories.map((story) =>
  //      story.id === storyId ? { ...story, viewed: true } : story
  //    )
  //  );
  //};

  const handleCloseStoryModal = () => {
    setIsStoryModalVisible(false);
  };

  const handleViewComments = (postId: string) => {
    setCurrentPostId(postId);
    setIsCommentsModalVisible(true);
    // Track that comments modal was opened (we'll track actual comment creation separately)
  };

  const handleCloseCommentsModal = async () => {
    setIsCommentsModalVisible(false);
    // Plus de rechargement automatique - on garde les posts en l'état
    console.log('💬 Comments modal closed - No automatic reload');
  };

  const handleProfilePress = (username: string, userId?: number) => {
    if (username === CURRENT_USERNAME) {
      handleNavigateToProfile();
    } else {
      // Naviguer vers le profil d'un autre utilisateur
      if (userId) {
        router.push({
          pathname: '/userProfile',
          params: { userId: userId.toString() },
        });
      } else {
        console.log("Navigate to profile: username provided but no userId:", username);
      }
    }
  };

  const handleNavigateToProfile = () => {
    router.push("/profile");
  };

  const handleNavigateToMessages = () => {
    router.push("/(app)/messages");
  };

  const renderSeparator = () => {
    return (
      <View style={styles.dateSeperatorContainer}>
        <View style={styles.dateSeparatorLine} />
        <Text style={styles.dateSeparatorText}>Earlier</Text>
        <View style={styles.dateSeparatorLine} />
      </View>
    );
  };

//  const renderStoryItem = ({ item }: { item: Story }) => (
//    <TouchableOpacity
//      style={styles.storyItem}
//      onPress={() => handleViewStory(item.id)}
//      activeOpacity={0.7}
//    >
//      <View
//        style={[
//          styles.storyRing,
//          item.viewed ? styles.storyRingViewed : styles.storyRingUnviewed,
//        ]}
//      >
//        <Image source={{ uri: item.avatar }} style={styles.storyAvatar} />
//      </View>
//      <Text style={styles.storyUsername}>
//        {item.username === CURRENT_USERNAME ? "Your story" : item.username}
//      </Text>
//    </TouchableOpacity>
//  );

  // Fonction de rendu des posts avec gestion des séparateurs de date
  const renderPost = ({ item, index }: { item: UIPost; index: number }) => {
    // Vérifier si nous devons afficher un séparateur avant ce post
    const previousPost = index > 0 ? posts[index - 1] : null;
    const needsSeparator = previousPost && previousPost.isFromToday && !item.isFromToday;

    // Calculer la visibilité du post
    const postIsVisible = isPostVisible(item.id);
    const postIsCurrentlyVisible = isPostCurrentlyVisible(item.id);

    console.log('📱 Rendering post:', {
      postId: item.id,
      index,
      postIsVisible,
      postIsCurrentlyVisible,
      hasVideo: item.mediaTypes?.some(type => type === 'video'),
    });

    return (
      <>
        {needsSeparator && renderSeparator()}
        <PostItem
          post={item}
          onLike={handleLike}
          onSave={handleSave}
          onComment={handleViewComments}
          onShare={handleSharePost}
          onProfilePress={handleProfilePress}
          currentUsername={CURRENT_USERNAME}
          isVisible={postIsVisible}
          isCurrentlyVisible={postIsCurrentlyVisible}
        />
      </>
    );
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleCreatePost = () => {
    // Naviguer vers l'écran de création
    router.push("/publication");
  };

  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <FontAwesome name="camera" size={60} color={theme.colors.grey[300]} />
      <Text style={styles.emptyStateTitle}>No posts yet</Text>
      <Text style={styles.emptyStateDescription}>
        Be the first to share your passion for cars!
      </Text>
      <TouchableOpacity 
        style={styles.createPostButton}
        onPress={() => router.push('/publication')}
      >
        <FontAwesome name="plus" size={16} color={theme.colors.common.white} style={styles.createPostIcon} />
        <Text style={styles.createPostText}>Create my first post</Text>
      </TouchableOpacity>
    </View>
  );

  // Plus de rechargement automatique sur focus - comme Instagram
  // Si on veut refresh, on fait pull-to-refresh manuellement

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: true,
      listener: (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const currentY = event.nativeEvent.contentOffset.y;
        isHeaderVisible.current = currentY <= lastScrollY.current;
        lastScrollY.current = currentY;
      },
    }
  );

  const handleSharePost = async (postId: string) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    
    try {
      console.log('Sharing post:', postId);
      trackPost.shared(postId, 'native');
      
      // Créer le lien du post (à adapter en production)
      const postLink = `https://gearconnect.app/post/${postId}`;
      
      // Créer le message de partage
      const shareMessage = post.title 
        ? `${post.title}\n\n${post.description || ''}\n\n${postLink}`
        : `${post.description || 'Découvre ce post sur GearConnect!'}\n\n${postLink}`;

      // Utiliser l'API Share native de React Native
      const result = await Share.share({
        message: shareMessage,
        title: post.title || 'Partager ce post',
      });

      if (result.action === Share.sharedAction) {
        console.log('✅ Post shared successfully');
        if (result.activityType) {
          console.log('📱 Shared via:', result.activityType);
        }
      } else if (result.action === Share.dismissedAction) {
        console.log('❌ Share dismissed');
      }
      
    } catch (error) {
      console.error('❌ Error sharing post:', error);
      // Fallback: copier dans le presse-papiers
      const postLink = `https://gearconnect.app/post/${postId}`;
      await Clipboard.setStringAsync(postLink);
      showMessage(MessageService.SUCCESS.CONTENT_COPIED);
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
      showMessage(MessageService.SUCCESS.CONTENT_COPIED);
      // Fallback: copier dans le presse-papiers
      Clipboard.setStringAsync(content);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleAddComment = async (postId: string, text: string) => {
    if (!text.trim() || !user?.id) return;

    const currentUserId = parseInt(user.id.toString());
    
    // Track comment
    trackPost.commented(postId, text.length);

    // Utiliser la vraie photo de profil de l'utilisateur connecté
    const userAvatar = currentUserData?.profilePicturePublicId ? 
      '' : // CloudinaryAvatar le gérera
      (currentUserData?.profilePicture || (user as any)?.profilePicture || "https://via.placeholder.com/40");

    const newComment: PostItemComment = {
      id: Date.now().toString(),
      username: user.username || currentUserData?.username || CURRENT_USERNAME,
      avatar: userAvatar,
      profilePicturePublicId: currentUserData?.profilePicturePublicId, // Ajouter le champ Cloudinary
      text,
      timeAgo: "Now",
      likes: 0,
    };

    try {
      // Utiliser la nouvelle méthode addComment
      await postService.default.addComment(parseInt(postId), currentUserId, text);
      console.log('💬 Comment added successfully - No automatic reload');
      
    } catch {
      // console.error('Error when adding comment:', error);
      showError('Unable to add a comment at the moment.');
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getCurrentPostComments = () => {
    const post = posts.find((p) => p.id === currentPostId);
    if (!post) return [];
    
    // Convertir les commentaires UI en commentaires API
    return post.comments.map(comment => ({
      id: comment.id,
      postId: parseInt(currentPostId),
      userId: 1, // ID de l'utilisateur courant
      content: comment.text,
      createdAt: new Date(),
      user: {
        id: 1,
        name: comment.username,
        username: comment.username,
      }
    }));
  };

  const renderNetworkErrorState = () => (
    <View style={styles.networkErrorContainer}>
      <FontAwesome name="wifi" style={styles.networkErrorIcon} />
      <Text style={styles.networkErrorTitle}>Connection Issue</Text>
      <Text style={styles.networkErrorDescription}>
        Your WiFi connection might not be working properly. Please check your internet connection and try again.
      </Text>
      <TouchableOpacity style={styles.reloadButton} onPress={handleRefresh}>
        <Text style={styles.reloadButtonText}>Try Again</Text>
      </TouchableOpacity>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary.main} />
      </View>
    );
  }

  if (isNetworkError) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background.paper} />

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.appTitle}>GearConnect</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.headerIconBtn}
              onPress={() => router.push('/userSearch')}
            >
              <FontAwesome name="search" size={22} color={theme.colors.text.secondary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.headerIconBtn, styles.notificationButton]}
              onPress={handleNavigateToMessages}
            >
              <FontAwesome name="comments" size={22} color={theme.colors.text.secondary} />
              {/* Badge pour futures notifications */}
              {/* <View style={styles.notificationBadge} /> */}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.headerIconBtn}
              onPress={handleNavigateToProfile}
            >
              {currentUserData?.profilePicturePublicId ? (
                <CloudinaryAvatar
                  publicId={currentUserData.profilePicturePublicId}
                  size={32}
                  quality="auto"
                  format="auto"
                  style={styles.profileImage}
                  fallbackUrl={currentUserData?.profilePicture}
                />
              ) : currentUserData?.profilePicture || (user as any)?.profilePicture ? (
                <Image 
                  source={{ 
                    uri: currentUserData?.profilePicture || (user as any)?.profilePicture 
                  }} 
                  style={styles.profileImage}
                />
              ) : (
                <Image 
                  source={defaultImages.profile} 
                  style={styles.profileImage}
                />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Network Error State */}
        {renderNetworkErrorState()}
      </SafeAreaView>
    );
  }

  if (loadingError) {
    return (
      <View style={styles.errorContainer}>
        <FontAwesome name="warning" style={styles.warningIcon} />
        <Text style={styles.errorText}>{loadingError}</Text>
        <TouchableOpacity style={styles.reloadButton} onPress={handleRefresh}>
          <Text style={styles.reloadButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background.paper} translucent={true} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.appTitle}>GearConnect</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.headerIconBtn}
            onPress={() => router.push('/userSearch')}
          >
            <FontAwesome name="search" size={22} color={theme.colors.text.secondary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.headerIconBtn, styles.notificationButton]}
            onPress={handleNavigateToMessages}
          >
            <FontAwesome name="comments" size={22} color={theme.colors.text.secondary} />
            {/* Badge pour futures notifications */}
            {/* <View style={styles.notificationBadge} /> */}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerIconBtn}
            onPress={handleNavigateToProfile}
          >
            {currentUserData?.profilePicturePublicId ? (
              <CloudinaryAvatar
                publicId={currentUserData.profilePicturePublicId}
                size={32}
                quality="auto"
                format="auto"
                style={styles.profileImage}
                fallbackUrl={currentUserData?.profilePicture}
              />
            ) : currentUserData?.profilePicture || (user as any)?.profilePicture ? (
              <Image 
                source={{ 
                  uri: currentUserData?.profilePicture || (user as any)?.profilePicture 
                }} 
                style={styles.profileImage}
              />
            ) : (
              <Image 
                source={defaultImages.profile} 
                style={styles.profileImage}
              />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content */}
      <AnimatedFlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item: UIPost) => item.id}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs}
//        ListHeaderComponent={
//          <View style={styles.storiesContainer}>
//            <FlatList
//              renderItem={renderStoryItem}
//              keyExtractor={(item) => item.id}
//              horizontal
//              showsHorizontalScrollIndicator={false}
//              contentContainerStyle={styles.storiesList}
//            />
//          </View>
//        }
        ListEmptyComponent={renderEmptyState}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.05}
        ListFooterComponent={
          isLoadingMore ? (
            <View style={styles.footerLoader}>
              <ActivityIndicator size="small" color={theme.colors.primary.main} />
            </View>
          ) : null
        }
      />

      {/* Story Modal */}
      <StoryModal
        isVisible={isStoryModalVisible}
        stories={stories}
        currentStoryId={currentStoryId}
        onClose={handleCloseStoryModal}
        onStoryComplete={() => {
          // Handle story completion if needed
          handleCloseStoryModal();
        }}
      />

      {/* Comments Modal */}
      <HierarchicalCommentsModal
        isVisible={isCommentsModalVisible}
        postId={parseInt(currentPostId)}
        onClose={handleCloseCommentsModal}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;

