import React, { useState, useRef, useEffect, useCallback } from "react";
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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter, useFocusEffect } from "expo-router";
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import * as Clipboard from 'expo-clipboard';
import styles from "../styles/screens/homeStyles";
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
import { detectMediaType } from '../utils/mediaUtils';
import { ApiError, ErrorType } from '../services/axiosConfig';
import { CloudinaryAvatar } from "../components/media/CloudinaryImage";
import { defaultImages } from "../config/defaultImages";
import userService from "../services/userService";
import { useMessage } from '../context/MessageContext';

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
  const images = apiPost.cloudinaryUrl ? [apiPost.cloudinaryUrl] : 
                 apiPost.image ? [(apiPost.image as any).url] : [];
  
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
  const { showError, showInfo } = useMessage();
  const [refreshing, setRefreshing] = useState(false);
  const [stories, setStories] = useState<Story[]>([]);
  const [posts, setPosts] = useState<UIPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [isNetworkError, setIsNetworkError] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isStoryModalVisible, setIsStoryModalVisible] = useState(false);
  const [currentStoryId, setCurrentStoryId] = useState("");
  const [isCommentsModalVisible, setIsCommentsModalVisible] = useState(false);
  const [currentPostId, setCurrentPostId] = useState("");
  const [currentUserData, setCurrentUserData] = useState<any>(null);
  const scrollY = useRef(new Animated.Value(0)).current;
  const isHeaderVisible = useRef(true);
  const lastScrollY = useRef(0);

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

  // Fonction pour charger les posts depuis l'API
  const loadPosts = useCallback(async (page = 1, limit = 10) => {
    try {
      setLoadingError(null);
      setIsNetworkError(false);
      const currentUserId = user?.id ? parseInt(user.id.toString()) : null;
      
      // Utiliser la nouvelle méthode getPosts avec userId pour récupérer l'état des favoris
      const response = currentUserId 
        ? await postService.default.getPosts(page, limit, currentUserId)
        : await postService.default.getAllPosts();
      
      if (Array.isArray(response)) {
        // Trier les posts du plus récent au plus ancien
        const sortedPosts = [...response].sort((a, b) => {
          const dateA = new Date(a.createdAt || 0);
          const dateB = new Date(b.createdAt || 0);
          return dateB.getTime() - dateA.getTime();
        });
        
        // Transformer les posts API en posts UI en utilisant l'ID utilisateur réel
        const uiPosts = sortedPosts.map(apiPost => convertApiPostToUiPost(apiPost, currentUserId || 1));
        
        setPosts(uiPosts);
        setHasMorePosts(uiPosts.length === limit);
      } else {
        setLoadingError('Unexpected API response format');
      }
    } catch (error) {
      // Check if it's a network error using the ApiError interface
      const apiError = error as ApiError;
      if (apiError.type === ErrorType.NETWORK) {
        setIsNetworkError(true);
        setLoadingError('Connection issue detected');
      } else {
        setLoadingError('Unable to load posts. Please try again later.');
      }
    } finally {
      setIsLoading(false);
      setRefreshing(false);
      setIsLoadingMore(false);
    }
  }, [user?.id]);

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

  // Charger les données au démarrage
  useEffect(() => {
    loadPosts();
    loadStories();
    loadCurrentUserData(); // Charger aussi les données utilisateur
  }, [loadPosts, loadStories, loadCurrentUserData]);

  const handleRefresh = () => {
    setRefreshing(true);
    setCurrentPage(1);
    loadPosts(1);
  };

  const handleLoadMore = () => {
    if (!isLoadingMore && hasMorePosts) {
      setIsLoadingMore(true);
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      loadPosts(nextPage);
    }
  };

  const handleLike = async (postId: string) => {
    if (!user?.id) {
      showError('Vous devez être connecté pour liker un post');
      return;
    }

    const currentUserId = parseInt(user.id.toString());
    
    // Optimistically update UI
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              liked: !post.liked,
              likes: post.liked ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    );

    try {
      // Utiliser la nouvelle méthode toggleLike
      await postService.default.toggleLike(parseInt(postId), currentUserId);
      
      // Recharger les posts pour synchroniser avec la base de données
      // On fait ça de manière silencieuse pour éviter les clignotements
      setTimeout(() => {
        loadPosts();
      }, 500);
      
    } catch (_error) {
      // console.error('Erreur lors du toggle du like:', error);
      
      // En cas d'erreur, annuler l'optimistic update
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                liked: !post.liked,
                likes: post.liked ? post.likes + 1 : post.likes - 1,
              }
            : post
        )
      );
      showError('Impossible d\'ajouter un like pour le moment.');
    }
  };

  const handleSave = async (postId: string) => {
    if (!user?.id) {
      showError('Vous devez être connecté pour sauvegarder un post');
      return;
    }

    const currentUserId = parseInt(user.id.toString());
    
    // Optimistically update UI
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId ? { ...post, saved: !post.saved } : post
      )
    );

    try {
      // Utiliser le service des favoris pour persister en base de données
      await favoritesService.toggleFavorite(parseInt(postId), currentUserId);
      
      // Recharger les posts pour synchroniser avec la base de données
      // On fait ça de manière silencieuse pour éviter les clignotements
      setTimeout(() => {
        loadPosts();
      }, 500);
      
    } catch (_error) {
      // console.error('Erreur lors du toggle des favoris:', error);
      
      // En cas d'erreur, annuler l'optimistic update
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, saved: !post.saved } : post
        )
      );
      showError('Impossible de sauvegarder ce post pour le moment.');
    }
  };

  const handleViewStory = (storyId: string) => {
    setCurrentStoryId(storyId);
    setIsStoryModalVisible(true);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleStoryComplete = (storyId: string) => {
    setStories((prevStories) =>
      prevStories.map((story) =>
        story.id === storyId ? { ...story, viewed: true } : story
      )
    );
  };

  const handleCloseStoryModal = () => {
    setIsStoryModalVisible(false);
  };

  const handleViewComments = (postId: string) => {
    setCurrentPostId(postId);
    setIsCommentsModalVisible(true);
  };

  const handleCloseCommentsModal = async () => {
    setIsCommentsModalVisible(false);
    
    // Mettre à jour le nombre de commentaires pour le post actuel
    if (currentPostId && user?.id) {
      try {
        // Récupérer le nombre réel de commentaires depuis l'API des commentaires hiérarchiques
        const response = await commentService.getCommentsByPost(parseInt(currentPostId), 1, 1);
        const realCommentsCount = response.pagination.totalItems;
        
        // Mettre à jour le post dans le state local avec le nouveau nombre de commentaires
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === currentPostId
              ? {
                  ...post,
                  comments: Array(realCommentsCount).fill(null).map((_, index) => ({
                    id: `comment-${index}`,
                    username: 'user',
                    avatar: '',
                    text: '',
                    timeAgo: '',
                    likes: 0,
                  })), // Créer un tableau factice de la bonne taille pour le compteur
                }
              : post
          )
        );
      } catch (_error) {
        // console.error('Erreur lors de la mise à jour du compteur de commentaires:', error);
        // En cas d'erreur, on recharge simplement tous les posts après un délai
        setTimeout(() => {
          loadPosts();
        }, 500);
      }
    }
  };

  const handleProfilePress = (username: string) => {
    if (username === CURRENT_USERNAME) {
      handleNavigateToProfile();
    } else {
      // Pourrait naviguer vers le profil d'un autre utilisateur
      console.log("Navigate to profile:", username);
    }
  };

  const handleNavigateToProfile = () => {
    router.push("/profile");
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

  const renderStoryItem = ({ item }: { item: Story }) => (
    <TouchableOpacity
      style={styles.storyItem}
      onPress={() => handleViewStory(item.id)}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.storyRing,
          { borderColor: item.viewed ? "#8e8e8e" : "#FF5864" },
        ]}
      >
        <Image source={{ uri: item.avatar }} style={styles.storyAvatar} />
      </View>
      <Text style={styles.storyUsername}>
        {item.username === CURRENT_USERNAME ? "Your story" : item.username}
      </Text>
    </TouchableOpacity>
  );

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
    // Rafraîchir la liste des posts avant de naviguer
    loadPosts();
    // Naviguer vers l'écran de création
    router.push("/publication");
  };

  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <FontAwesome name="camera" size={60} color="#CCCCCC" />
      <Text style={styles.emptyStateTitle}>No posts yet</Text>
      <Text style={styles.emptyStateDescription}>
        Be the first to share your passion for cars!
      </Text>
      <TouchableOpacity 
        style={styles.createPostButton}
        onPress={() => router.push('/publication')}
      >
        <FontAwesome name="plus" size={16} color="#FFFFFF" style={styles.createPostIcon} />
        <Text style={styles.createPostText}>Create my first post</Text>
      </TouchableOpacity>
    </View>
  );

  // Rafraîchir la liste des posts lorsque l'écran est focus
  useFocusEffect(
    React.useCallback(() => {
      loadPosts();
      loadCurrentUserData(); // Rafraîchir aussi les données utilisateur
    }, [loadPosts, loadCurrentUserData])
  );

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
      console.log('📤 Sharing post:', postId);
      
      // TODO: PRODUCTION - Quand l'app sera déployée en production, modifier cette fonction pour :
      // 1. Partager un lien direct vers le post dans l'app (ex: https://gearconnect.app/post/123)
      // 2. Inclure une preview du post avec titre/description/image miniature
      // 3. Ne plus partager directement l'URL Cloudinary mais plutôt rediriger vers le post complet
      // 4. Permettre aux utilisateurs externes de voir le post même sans avoir l'app installée
      // 5. Ajouter des métadonnées Open Graph pour un meilleur affichage sur les réseaux sociaux
      
      // Vérifier si le partage est disponible sur l'appareil
      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        showError('Le partage n\'est pas disponible sur cet appareil');
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
      
    } catch (_error) {
      // console.error('❌ Error sharing post:', error);
      showError('Impossible de partager ce post');
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
      showInfo('Contenu copié dans le presse-papiers');
      // Fallback: copier dans le presse-papiers
      Clipboard.setStringAsync(content);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleAddComment = async (postId: string, text: string) => {
    if (!text.trim() || !user?.id) return;

    const currentUserId = parseInt(user.id.toString());

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

    // Optimistic update
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: [...post.comments, newComment],
            }
          : post
      )
    );

    try {
      // Utiliser la nouvelle méthode addComment
      await postService.default.addComment(parseInt(postId), currentUserId, text);
      
      // Recharger les posts après un délai pour synchroniser
      setTimeout(() => {
        loadPosts();
      }, 500);
      
    } catch (_error) {
      // console.error('Erreur lors de l\'ajout du commentaire:', error);
      
      // En cas d'erreur, annuler l'optimistic update
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                comments: post.comments.filter((c) => c.id !== newComment.id),
              }
            : post
        )
      );
      showError('Impossible d\'ajouter un commentaire pour le moment.');
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
      <FontAwesome name="wifi" size={60} color="#E10600" />
      <Text style={styles.networkErrorTitle}>Connection Issue</Text>
      <Text style={styles.networkErrorDescription}>
        Your WiFi connection might not be working properly. Please check your internet connection and try again.
      </Text>
      <TouchableOpacity style={styles.reloadButton} onPress={() => loadPosts()}>
        <Text style={styles.reloadButtonText}>Try Again</Text>
      </TouchableOpacity>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF5864" />
      </View>
    );
  }

  if (isNetworkError) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.appTitle}>GearConnect</Text>
          </View>
          <View style={styles.headerRight}>
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
        <FontAwesome name="warning" size={50} color="#FF5864" />
        <Text style={styles.errorText}>{loadingError}</Text>
        <TouchableOpacity style={styles.reloadButton} onPress={() => loadPosts()}>
          <Text style={styles.reloadButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" translucent={true} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.appTitle}>GearConnect</Text>
        </View>
        <View style={styles.headerRight}>
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
        ListHeaderComponent={
          <View style={styles.storiesContainer}>
            <FlatList
              data={stories}
              renderItem={renderStoryItem}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.storiesList}
            />
          </View>
        }
        ListEmptyComponent={renderEmptyState}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isLoadingMore ? (
            <View style={styles.footerLoader}>
              <ActivityIndicator size="small" color="#FF5864" />
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

