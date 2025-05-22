import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Animated,
  RefreshControl,
  FlatList,
  Dimensions,
  StatusBar,
  ActivityIndicator,
  Alert,
  NativeScrollEvent,
  NativeSyntheticEvent,
  FlatListProps,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useRouter } from "expo-router";
import styles from "../styles/homeStyles";
import StoryModal from "../components/StoryModal";
import CommentsModal from "../components/CommentsModal";
import ShareModal from "../components/Feed/ShareModal";
import PostItem from "../components/Feed/PostItem";
import { Post as APIPost } from "../services/postService";
import { formatPostDate, isPostFromToday } from "../utils/dateUtils";
import * as postService from '../services/postService';
import { useFocusEffect } from '@react-navigation/native';

// Types
interface Story {
  id: string;
  username: string;
  avatar: string;
  viewed: boolean;
  content?: string;
}

interface Comment {
  id: string;
  username: string;
  avatar: string;
  text: string;
  timeAgo: string;
  likes: number;
}

interface UIPost {
  id: string;
  username: string;
  avatar: string;
  images: string[];
  caption: string;
  likes: number;
  liked: boolean;
  saved: boolean;
  comments: Comment[];
  timeAgo: string;
  isFromToday: boolean;
}

const SCREEN_WIDTH = Dimensions.get("window").width;
// Nom d'utilisateur courant
const CURRENT_USERNAME = "john_doe";
const CURRENT_USER_AVATAR = "https://randomuser.me/api/portraits/men/32.jpg";

// Fonction helper pour convertir les posts de l'API au format d'UI
const convertApiPostToUiPost = (apiPost: APIPost, currentUserId: number): UIPost => {
  const timeAgo = formatPostDate(apiPost.createdAt || new Date());
  
  return {
    id: apiPost.id?.toString() || '',
    username: apiPost.userId.toString(), // À remplacer par le vrai username lorsque disponible
    avatar: "https://randomuser.me/api/portraits/men/32.jpg", // Placeholder jusqu'à ce que nous ayons des vraies images
    images: apiPost.image ? [apiPost.image] : ["https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"], // Placeholder
    caption: `${apiPost.title} - ${apiPost.body}`,
    likes: apiPost.interactions?.filter(i => i.type === 'like')?.length || 0,
    liked: apiPost.interactions?.some(i => i.type === 'like' && i.userId === currentUserId) || false,
    saved: false, // Pas encore implémenté dans l'API
    comments: apiPost.interactions?.filter(i => i.type === 'comment')?.map(c => ({
      id: c.id?.toString() || '',
      username: c.userId.toString(), // À remplacer par le vrai username
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      text: c.content || '',
      timeAgo: formatPostDate(c.createdAt),
      likes: 0
    })) || [],
    timeAgo: timeAgo,
    isFromToday: isPostFromToday(apiPost.createdAt || new Date())
  };
};

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList) as React.ComponentType<FlatListProps<UIPost>>;

const HomeScreen: React.FC = () => {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [stories, setStories] = useState<Story[]>([]);
  const [posts, setPosts] = useState<UIPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isStoryModalVisible, setIsStoryModalVisible] = useState(false);
  const [currentStoryId, setCurrentStoryId] = useState("");
  const [isCommentsModalVisible, setIsCommentsModalVisible] = useState(false);
  const [isShareModalVisible, setIsShareModalVisible] = useState(false);
  const [currentPostId, setCurrentPostId] = useState("");
  const scrollY = useRef(new Animated.Value(0)).current;
  const isHeaderVisible = useRef(true);
  const lastScrollY = useRef(0);

  // Fonction pour charger les posts depuis l'API
  const loadPosts = useCallback(async (page = 1, limit = 10) => {
    try {
      setLoadingError(null);
      const response = await postService.default.getAllPosts();
      
      if (Array.isArray(response)) {
        // Trier les posts du plus récent au plus ancien
        const sortedPosts = [...response].sort((a, b) => {
          const dateA = new Date(a.createdAt || 0);
          const dateB = new Date(b.createdAt || 0);
          return dateB.getTime() - dateA.getTime();
        });
        
        // Transformer les posts API en posts UI
        const uiPosts = sortedPosts.map(apiPost => convertApiPostToUiPost(apiPost, 1)); // 1 est l'ID utilisateur courant
        
        setPosts(uiPosts);
        setHasMorePosts(uiPosts.length === limit);
      } else {
        setLoadingError('Format de réponse API inattendu');
      }
    } catch (error) {
      console.error('Erreur lors du chargement des posts:', error);
      setLoadingError('Impossible de charger les posts. Veuillez réessayer plus tard.');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
      setIsLoadingMore(false);
    }
  }, []);

  // Simulation du chargement des données des stories (à remplacer par un appel API réel plus tard)
  const loadStories = useCallback(() => {
    // Stories mock data avec des images réalistes
    const mockStories: Story[] = [
      {
        id: "1",
        username: CURRENT_USERNAME,
        avatar: CURRENT_USER_AVATAR,
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
  }, []);

  // Charger les données au démarrage
  useEffect(() => {
    loadPosts();
    loadStories();
  }, [loadPosts, loadStories]);

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
      // Mise à jour côté API
      await postService.default.addInteraction(parseInt(postId), {
        type: 'like',
        userId: 1, // Utiliser l'ID de l'utilisateur connecté
      });
    } catch (error) {
      console.error('Erreur lors de l\'ajout du like:', error);
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
      Alert.alert('Erreur', 'Impossible d\'ajouter un like pour le moment.');
    }
  };

  const handleSave = (postId: string) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId ? { ...post, saved: !post.saved } : post
      )
    );
  };

  const handleViewStory = (storyId: string) => {
    setCurrentStoryId(storyId);
    setIsStoryModalVisible(true);
  };

  const handleStoryComplete = (storyId: string) => {
    // Mise à jour de l'état "viewed" de l'histoire
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

  const handleCloseCommentsModal = () => {
    setIsCommentsModalVisible(false);
  };

  const handleSharePost = (postId: string) => {
    setCurrentPostId(postId);
    setIsShareModalVisible(true);
  };

  const handleCloseShareModal = () => {
    setIsShareModalVisible(false);
  };

  const handleAddComment = async (postId: string, text: string) => {
    if (!text.trim()) return;

    const newComment: Comment = {
      id: Date.now().toString(),
      username: CURRENT_USERNAME,
      avatar: CURRENT_USER_AVATAR,
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
      // API update
      await postService.default.addInteraction(parseInt(postId), {
        type: 'comment',
        userId: 1, // Utiliser l'ID de l'utilisateur connecté
        content: text
      });
    } catch (error) {
      console.error('Erreur lors de l\'ajout du commentaire:', error);
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
      Alert.alert('Erreur', 'Impossible d\'ajouter un commentaire pour le moment.');
    }
  };

  const getCurrentPostComments = () => {
    const post = posts.find((p) => p.id === currentPostId);
    return post ? post.comments : [];
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
        />
      </>
    );
  };

  const handleCreatePost = () => {
    // Rafraîchir la liste des posts avant de naviguer
    loadPosts();
    // Naviguer vers l'écran de création
    router.push("/publication");
  };

  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <FontAwesome name="camera" size={60} color="#CCCCCC" />
      <Text style={styles.emptyStateTitle}>Aucun post pour le moment</Text>
      <Text style={styles.emptyStateDescription}>
        Soyez le premier à partager votre passion pour les voitures !
      </Text>
      <TouchableOpacity 
        style={styles.createPostButton}
        onPress={() => setIsStoryModalVisible(true)}
      >
        <FontAwesome name="plus" size={16} color="#FFFFFF" style={styles.createPostIcon} />
        <Text style={styles.createPostText}>Créer mon premier post</Text>
      </TouchableOpacity>
    </View>
  );

  // Rafraîchir la liste des posts lorsque l'écran est focus
  useFocusEffect(
    React.useCallback(() => {
      loadPosts();
    }, [])
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

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF5864" />
      </View>
    );
  }

  if (loadingError) {
    return (
      <View style={styles.errorContainer}>
        <FontAwesome name="warning" size={50} color="#FF5864" />
        <Text style={styles.errorText}>{loadingError}</Text>
        <TouchableOpacity style={styles.reloadButton} onPress={() => loadPosts()}>
          <Text style={styles.reloadButtonText}>Réessayer</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <Animated.View
        style={[
          styles.header,
          {
            transform: [
              {
                translateY: scrollY.interpolate({
                  inputRange: [0, 50],
                  outputRange: [0, -50],
                  extrapolate: "clamp",
                }),
              },
            ],
          },
        ]}
      >
        <View style={styles.headerLeft}>
          <Text style={styles.appTitle}>GearConnect</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.headerIconBtn}
            onPress={() => setIsStoryModalVisible(true)}
          >
            <FontAwesome name="plus-square-o" size={26} color="#000" />
          </TouchableOpacity>
        </View>
      </Animated.View>

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
      <CommentsModal
        isVisible={isCommentsModalVisible}
        comments={getCurrentPostComments()}
        onClose={handleCloseCommentsModal}
        onAddComment={(text: string) => handleAddComment(currentPostId, text)}
        postId={currentPostId}
      />

      {/* Share Modal */}
      <ShareModal
        visible={isShareModalVisible}
        onClose={handleCloseShareModal}
        postId={currentPostId}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;
