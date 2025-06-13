import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
  RefreshControl,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams, useFocusEffect } from "expo-router";
import styles from "../styles/Profile/profileStyles";
import { useAuth } from "../context/AuthContext";
import ProfilePost from "../components/Feed/ProfilePost";
import favoritesService from "../services/favoritesService";
import postService from "../services/postService";
import ProfileMenu from "../components/Profile/ProfileMenu";
import { CloudinaryMedia } from "../components/media";
import { CloudinaryAvatar } from "../components/media/CloudinaryImage";
import { detectMediaType } from "../utils/mediaUtils";
import { defaultImages } from "../config/defaultImages";
import PerformanceService from "../services/performanceService";
import userService from "../services/userService";

// Screen width to calculate grid image dimensions
const NUM_COLUMNS = 3;

// Type for posts
interface Post {
  id: string;
  imageUrl: string;
  likes: number;
  comments: number;
  caption?: string;
  location?: string;
  timeAgo?: string;
  multipleImages?: boolean;
  isVideo: boolean;
  cloudinaryPublicId?: string;
  imageMetadata?: string;
}

// Type for favorites
interface FavoritePost {
  id: number;
  title: string;
  body: string;
  cloudinaryUrl?: string;
  cloudinaryPublicId?: string;
  imageMetadata?: string;
  user: {
    id: number;
    name: string;
    username: string;
    email: string;
  };
  createdAt: string;
  favorites?: { userId: number; postId: number }[];
  interactions?: any[];
  comments?: any[];
}

// Type for driver statistics (adapted for API data)
interface DriverStats {
  races: number;
  wins: number;
  podiums: number;
  bestPosition: number;
  averagePosition: number;
}

// Définir l'interface des props
interface ProfileScreenProps {
  userId?: number;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({
  userId: propUserId,
}) => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const auth = useAuth();
  const [activeTab, setActiveTab] = useState<string>("posts");
  const [posts, setPosts] = useState<Post[]>([]);
  const [favorites, setFavorites] = useState<FavoritePost[]>([]);
  const [stats, setStats] = useState({
    posts: 0,
    followers: 0,
    following: 0,
    saved: 0,
  });
  const [driverStats, setDriverStats] = useState<DriverStats>({
    races: 0,
    wins: 0,
    podiums: 0,
    bestPosition: 0,
    averagePosition: 0,
  });
  const [isLoadingDriverStats, setIsLoadingDriverStats] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [postModalVisible, setPostModalVisible] = useState(false);
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);
  const [likedPosts, setLikedPosts] = useState<Post[]>([]);
  const [isLoadingLikedPosts, setIsLoadingLikedPosts] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [isLoadingUserData, setIsLoadingUserData] = useState(false);

  // Get user from auth context and determine which user ID to use
  const { user } = auth || {};
  const effectiveUserId =
    propUserId || (user?.id ? Number(user.id) : undefined);

  // Function to fetch user data
  const fetchUserData = async () => {
    if (!effectiveUserId) return;

    setIsLoadingUserData(true);
    try {
      console.log('🔄 ProfileScreen: Fetching user data for user:', effectiveUserId);
      const response = await userService.getProfile(effectiveUserId);
      if (response.success && response.data) {
        console.log('✅ ProfileScreen: User data fetched:', {
          username: response.data.username,
          hasProfilePicture: !!response.data.profilePicture,
          hasProfilePicturePublicId: !!response.data.profilePicturePublicId,
        });
        setUserData(response.data);
      } else {
        console.error("❌ ProfileScreen: Failed to fetch user data:", response.error);
      }
    } catch (error) {
      console.error("❌ ProfileScreen: Error fetching user data:", error);
    } finally {
      setIsLoadingUserData(false);
    }
  };

  // Rafraîchir les données utilisateur quand on revient sur l'écran
  useFocusEffect(
    React.useCallback(() => {
      console.log('👁️ ProfileScreen: Screen focused, refreshing user data...');
      fetchUserData();
    }, [effectiveUserId])
  );

  // Load all data when component mounts or user changes
  useEffect(() => {
    if (!effectiveUserId) return;

    const loadAllData = async () => {
      try {
        // Load user data
        await fetchUserData();

        // Load user posts
        const loadUserPostsAsync = async () => {
          setIsLoadingPosts(true);
          try {
            const userPosts = await postService.getUserPosts(effectiveUserId);

            if (!Array.isArray(userPosts)) {
              console.error("Expected array of posts but got:", userPosts);
              return;
            }

            const formattedPosts = userPosts.map((post: any) => ({
              id: post.id.toString(),
              imageUrl: post.cloudinaryUrl || "https://via.placeholder.com/300",
              likes: post.interactions?.filter((i: any) => i.like).length || 0,
              comments:
                post.interactions?.filter((i: any) => i.comment).length || 0,
              caption: post.title ? `${post.title}\n${post.body}` : post.body,
              location: "",
              timeAgo: new Date(post.createdAt).toLocaleDateString(),
              multipleImages: false,
              isVideo:
                detectMediaType(
                  post.cloudinaryUrl,
                  post.cloudinaryPublicId,
                  post.imageMetadata
                ) === "video",
              cloudinaryPublicId: post.cloudinaryPublicId,
              imageMetadata: post.imageMetadata,
            }));

            setPosts(formattedPosts);
            setStats((prev) => ({ ...prev, posts: formattedPosts.length }));
          } catch (error) {
            console.error("Error loading user posts:", error);
          } finally {
            setIsLoadingPosts(false);
          }
        };

        // Load favorites
        const loadFavoritesAsync = async () => {
          setIsLoadingFavorites(true);
          try {
            const response = await favoritesService.getUserFavorites(
              effectiveUserId,
              1
            );

            if (!response.favorites || !Array.isArray(response.favorites)) {
              console.error("Expected array of favorites but got:", response);
              return;
            }

            const formattedFavorites = response.favorites.map((post: any) => ({
              id: post.id,
              title: post.title,
              body: post.body,
              cloudinaryUrl: post.cloudinaryUrl,
              cloudinaryPublicId: post.cloudinaryPublicId,
              imageMetadata: post.imageMetadata,
              user: post.user,
              createdAt: post.createdAt,
              favorites: post.favorites,
              interactions: post.interactions,
              comments: post.comments,
            }));

            setFavorites(formattedFavorites);
            setStats((prev) => ({ ...prev, saved: response.pagination.total }));
          } catch (error) {
            console.error("Error loading favorites:", error);
          } finally {
            setIsLoadingFavorites(false);
          }
        };

        // Load liked posts
        const loadLikedPostsAsync = async () => {
          setIsLoadingLikedPosts(true);
          try {
            const response = await postService.getLikedPosts(effectiveUserId);

            if (!Array.isArray(response)) {
              console.error("Expected array of posts but got:", response);
              return;
            }

            const formattedLikedPosts = response.map((post: any) => ({
              id: post.id.toString(),
              imageUrl: post.cloudinaryUrl || "https://via.placeholder.com/300",
              likes: post.interactions?.filter((i: any) => i.like).length || 0,
              comments:
                post.interactions?.filter((i: any) => i.comment).length || 0,
              caption: post.title ? `${post.title}\n${post.body}` : post.body,
              location: "",
              timeAgo: new Date(post.createdAt).toLocaleDateString(),
              multipleImages: false,
              isVideo:
                detectMediaType(
                  post.cloudinaryUrl,
                  post.cloudinaryPublicId,
                  post.imageMetadata
                ) === "video",
              cloudinaryPublicId: post.cloudinaryPublicId,
              imageMetadata: post.imageMetadata,
            }));

            setLikedPosts(formattedLikedPosts);
          } catch (error) {
            console.error("Error loading liked posts:", error);
          } finally {
            setIsLoadingLikedPosts(false);
          }
        };

        // Load driver stats
        const loadDriverStatsAsync = async () => {
          setIsLoadingDriverStats(true);
          try {
            const response = await PerformanceService.getUserStats(
              effectiveUserId
            );

            if (response.success && response.data) {
              const apiStats = response.data;

              setDriverStats({
                races: apiStats.totalRaces || 0,
                wins: apiStats.wins || 0,
                podiums: apiStats.podiumFinishes || 0,
                bestPosition: apiStats.bestPosition || 0,
                averagePosition: apiStats.averagePosition || 0,
              });
            }
          } catch (error) {
            console.error("Error loading driver stats:", error);
          } finally {
            setIsLoadingDriverStats(false);
          }
        };

        // Execute all data loading in parallel
        await Promise.all([
          loadUserPostsAsync(),
          loadFavoritesAsync(),
          loadLikedPostsAsync(),
          loadDriverStatsAsync(),
        ]);
      } catch (error) {
        console.error("Error loading profile data:", error);
      }
    };

    loadAllData();
  }, [effectiveUserId, params.refresh]);

  const onRefreshProfile = async () => {
    setRefreshing(true);
    try {
      await fetchUserData();
      // Recharger les données selon l'onglet actif
      if (activeTab === "favorites" && effectiveUserId) {
        setIsLoadingFavorites(true);
        const response = await favoritesService.getUserFavorites(
          effectiveUserId,
          1
        );

        if (response.favorites && Array.isArray(response.favorites)) {
          const formattedFavorites = response.favorites.map((post: any) => ({
            id: post.id,
            title: post.title,
            body: post.body,
            cloudinaryUrl: post.cloudinaryUrl,
            cloudinaryPublicId: post.cloudinaryPublicId,
            imageMetadata: post.imageMetadata,
            user: post.user,
            createdAt: post.createdAt,
            favorites: post.favorites,
            interactions: post.interactions,
            comments: post.comments,
          }));

          setFavorites(formattedFavorites);
          setStats((prev) => ({ ...prev, saved: response.pagination.total }));
        }
        setIsLoadingFavorites(false);
      }

      // Recharger les statistiques de performance
      if (effectiveUserId) {
        setIsLoadingDriverStats(true);
        const response = await PerformanceService.getUserStats(effectiveUserId);

        if (response.success && response.data) {
          const apiStats = response.data;

          setDriverStats({
            races: apiStats.totalRaces || 0,
            wins: apiStats.wins || 0,
            podiums: apiStats.podiumFinishes || 0,
            bestPosition: apiStats.bestPosition || 0,
            averagePosition: apiStats.averagePosition || 0,
          });
        }
        setIsLoadingDriverStats(false);
      }
    } catch (error) {
      console.error("Error refreshing profile data:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const handlePostPress = (post: Post) => {
    setSelectedPost(post);
    setPostModalVisible(true);
  };

  const handleClosePostModal = () => {
    setPostModalVisible(false);
    setSelectedPost(null);
  };

  const handleLikePost = (postId: string) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            likes: post.likes + 1,
          };
        }
        return post;
      })
    );
  };

  const handleCommentPost = (postId: string) => {
    console.log(`Open comments for post ${postId}`);
  };

  const handleSharePost = (postId: string) => {
    console.log(`Share post ${postId}`);
  };

  const handleProfilePress = (username: string) => {
    console.log(`Navigate to profile of ${username}`);
  };

  const handleEventPress = (eventId: string) => {
    router.push({
      pathname: "/(app)/eventDetail",
      params: { eventId },
    });
  };

  const handleSettingsPress = () => {
    setMenuVisible(false);
    router.push("/(app)/settings");
  };

  const handleEditProfilePress = () => {
    setMenuVisible(false);
    router.push({
      pathname: "/editProfile",
      params: { userId: effectiveUserId },
    });
  };

  const handlePreferencesPress = () => {
    setMenuVisible(false);
    router.push("/preferences");
  };

  const handleLogoutPress = async () => {
    setMenuVisible(false);
    try {
      await auth?.logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handlePerformancesPress = () => {
    router.push("/performances");
  };

  const renderPostsGrid = () => {
    if (isLoadingPosts) {
      return (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="#E10600" />
        </View>
      );
    }

    if (posts.length === 0) {
      return renderEmptyComponent();
    }

    // Calculate the number of rows needed to display all posts
    const rows = Math.ceil(posts.length / NUM_COLUMNS);
    const postRows = [];

    for (let i = 0; i < rows; i++) {
      const rowItems = posts.slice(i * NUM_COLUMNS, (i + 1) * NUM_COLUMNS);
      const row = (
        <View key={`row-${i}`} style={{ flexDirection: "row" }}>
          {rowItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.postTile}
              activeOpacity={0.8}
              onPress={() => handlePostPress(item)}
            >
              {item.isVideo ? (
                <CloudinaryMedia
                  publicId={item.cloudinaryPublicId || ""}
                  mediaType="video"
                  width={300}
                  height={300}
                  crop="fill"
                  quality="auto"
                  format="mp4"
                  style={styles.postTileImage}
                  fallbackUrl={item.imageUrl}
                  shouldPlay={false}
                  isMuted={true}
                  useNativeControls={false}
                  isLooping={false}
                />
              ) : (
                <Image
                  source={{ uri: item.imageUrl }}
                  style={styles.postTileImage}
                />
              )}
              {item.multipleImages && (
                <View style={styles.multipleImagesIcon}>
                  <FontAwesome name="clone" size={14} color="#FFFFFF" />
                </View>
              )}
            </TouchableOpacity>
          ))}
          {/* Fill the row with empty spaces if needed */}
          {Array(NUM_COLUMNS - rowItems.length)
            .fill(0)
            .map((_, index) => (
              <View
                key={`empty-${i}-${index}`}
                style={[styles.postTile, { backgroundColor: "transparent" }]}
              />
            ))}
        </View>
      );
      postRows.push(row);
    }

    return <View style={styles.postsContainer}>{postRows}</View>;
  };

  const renderReelsGrid = () => {
    if (isLoadingPosts) {
      return (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="#E10600" />
        </View>
      );
    }

    const videoPosts = posts.filter((post) => post.isVideo);

    if (videoPosts.length === 0) {
      return renderEmptyComponent();
    }

    // Calculate the number of rows needed to display all video posts
    const rows = Math.ceil(videoPosts.length / NUM_COLUMNS);
    const postRows = [];

    for (let i = 0; i < rows; i++) {
      const rowItems = videoPosts.slice(i * NUM_COLUMNS, (i + 1) * NUM_COLUMNS);
      const row = (
        <View key={`row-${i}`} style={{ flexDirection: "row" }}>
          {rowItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.postTile}
              activeOpacity={0.8}
              onPress={() => handlePostPress(item)}
            >
              <CloudinaryMedia
                publicId={item.cloudinaryPublicId || ""}
                mediaType="video"
                width={300}
                height={300}
                crop="fill"
                quality="auto"
                format="mp4"
                style={styles.postTileImage}
                fallbackUrl={item.imageUrl}
                shouldPlay={false}
                isMuted={true}
                useNativeControls={false}
                isLooping={false}
              />
            </TouchableOpacity>
          ))}
          {/* Fill the row with empty spaces if needed */}
          {Array(NUM_COLUMNS - rowItems.length)
            .fill(0)
            .map((_, index) => (
              <View
                key={`empty-${i}-${index}`}
                style={[styles.postTile, { backgroundColor: "transparent" }]}
              />
            ))}
        </View>
      );
      postRows.push(row);
    }

    return <View style={styles.postsContainer}>{postRows}</View>;
  };

  const renderFavoritesGrid = () => {
    if (isLoadingFavorites) {
      return (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="#E10600" />
        </View>
      );
    }

    if (favorites.length === 0) {
      return (
        <View style={[styles.emptyContainer, { flex: 1, minHeight: 300 }]}>
          <FontAwesome name="bookmark-o" size={60} color="#CCCCCC" />
          <Text style={styles.emptyTitle}>No Saved Posts</Text>
          <Text style={styles.emptySubtitle}>
            Posts you save will appear here.
          </Text>
        </View>
      );
    }

    const rows = Math.ceil(favorites.length / NUM_COLUMNS);
    const postRows = [];

    for (let i = 0; i < rows; i++) {
      const rowItems = favorites.slice(i * NUM_COLUMNS, (i + 1) * NUM_COLUMNS);
      const row = (
        <View key={`row-${i}`} style={{ flexDirection: "row" }}>
          {rowItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.postTile}
              activeOpacity={0.8}
              onPress={() => {
                router.push({
                  pathname: "/(app)/postDetail",
                  params: { postId: item.id.toString() },
                });
              }}
            >
              {detectMediaType(
                item.cloudinaryUrl,
                item.cloudinaryPublicId,
                item.imageMetadata
              ) === "video" ? (
                <CloudinaryMedia
                  publicId={item.cloudinaryPublicId || ""}
                  mediaType="video"
                  width={300}
                  height={300}
                  crop="fill"
                  quality="auto"
                  format="mp4"
                  style={styles.postTileImage}
                  fallbackUrl={item.cloudinaryUrl}
                  shouldPlay={false}
                  isMuted={true}
                  useNativeControls={false}
                  isLooping={false}
                />
              ) : (
                <Image
                  source={{
                    uri:
                      item.cloudinaryUrl ||
                      "https://via.placeholder.com/300x300?text=No+Image",
                  }}
                  style={styles.postTileImage}
                />
              )}
            </TouchableOpacity>
          ))}
          {Array(NUM_COLUMNS - rowItems.length)
            .fill(0)
            .map((_, index) => (
              <View
                key={`empty-${i}-${index}`}
                style={[styles.postTile, { backgroundColor: "transparent" }]}
              />
            ))}
        </View>
      );
      postRows.push(row);
    }

    return <View style={styles.postsContainer}>{postRows}</View>;
  };

  const renderLikedPostsGrid = () => {
    if (isLoadingLikedPosts) {
      return (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="#E10600" />
        </View>
      );
    }

    if (likedPosts.length === 0) {
      return (
        <View style={[styles.emptyContainer, { flex: 1, minHeight: 300 }]}>
          <FontAwesome name="heart-o" size={60} color="#CCCCCC" />
          <Text style={styles.emptyTitle}>No Liked Posts</Text>
          <Text style={styles.emptySubtitle}>
            Posts you like will appear here.
          </Text>
        </View>
      );
    }

    // Calculate the number of rows needed to display all posts
    const rows = Math.ceil(likedPosts.length / NUM_COLUMNS);
    const postRows = [];

    for (let i = 0; i < rows; i++) {
      const rowItems = likedPosts.slice(i * NUM_COLUMNS, (i + 1) * NUM_COLUMNS);
      const row = (
        <View key={`row-${i}`} style={{ flexDirection: "row" }}>
          {rowItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.postTile}
              activeOpacity={0.8}
              onPress={() => handlePostPress(item)}
            >
              {item.isVideo ? (
                <CloudinaryMedia
                  publicId={item.cloudinaryPublicId || ""}
                  mediaType="video"
                  width={300}
                  height={300}
                  crop="fill"
                  quality="auto"
                  format="mp4"
                  style={styles.postTileImage}
                  fallbackUrl={item.imageUrl}
                  shouldPlay={false}
                  isMuted={true}
                  useNativeControls={false}
                  isLooping={false}
                />
              ) : (
                <Image
                  source={{ uri: item.imageUrl }}
                  style={styles.postTileImage}
                />
              )}
              {item.multipleImages && (
                <View style={styles.multipleImagesIcon}>
                  <FontAwesome name="clone" size={14} color="#FFFFFF" />
                </View>
              )}
            </TouchableOpacity>
          ))}
          {/* Fill the row with empty spaces if needed */}
          {Array(NUM_COLUMNS - rowItems.length)
            .fill(0)
            .map((_, index) => (
              <View
                key={`empty-${i}-${index}`}
                style={[styles.postTile, { backgroundColor: "transparent" }]}
              />
            ))}
        </View>
      );
      postRows.push(row);
    }

    return <View style={styles.postsContainer}>{postRows}</View>;
  };

  const renderEmptyComponent = () => (
    <View style={[styles.emptyContainer, { flex: 1, minHeight: 300 }]}>
      {activeTab === "posts" ? (
        <>
          <FontAwesome name="camera" size={60} color="#CCCCCC" />
          <Text style={styles.emptyTitle}>No Posts</Text>
          <Text style={styles.emptySubtitle}>
            Photos and videos from your races and training sessions will appear
            here.
          </Text>
          <TouchableOpacity style={styles.shareButton}>
            <Text style={styles.shareButtonText}>Share a Photo</Text>
          </TouchableOpacity>
        </>
      ) : activeTab === "liked" ? (
        <>
          <FontAwesome name="heart-o" size={60} color="#CCCCCC" />
          <Text style={styles.emptyTitle}>No Liked Posts</Text>
          <Text style={styles.emptySubtitle}>
            Your liked posts will appear here.
          </Text>
        </>
      ) : activeTab === "reels" ? (
        <>
          <FontAwesome name="film" size={60} color="#CCCCCC" />
          <Text style={styles.emptyTitle}>No Videos</Text>
          <Text style={styles.emptySubtitle}>
            Share the best moments from your races and circuits.
          </Text>
          <TouchableOpacity style={styles.shareButton}>
            <Text style={styles.shareButtonText}>Add a Video</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <FontAwesome name="bookmark-o" size={60} color="#CCCCCC" />
          <Text style={styles.emptyTitle}>No Saved Items</Text>
          <Text style={styles.emptySubtitle}>
            Save circuits, posts and events to find them easily.
          </Text>
        </>
      )}
    </View>
  );

  if (!auth) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#E10600" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefreshProfile}
            colors={["#E10600"]}
            tintColor="#E10600"
          />
        }
      >
        {/* Header with name and back button */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <FontAwesome name="arrow-left" size={20} color="#1E1E1E" />
          </TouchableOpacity>
          <Text style={styles.username}>Profile</Text>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => setMenuVisible(true)}
          >
            <FontAwesome name="ellipsis-v" size={20} color="#1E1E1E" />
          </TouchableOpacity>
        </View>

        {/* Profile section with avatar and statistics */}
        <View style={styles.profileContainer}>
          <View style={styles.profileSection}>
            <View style={styles.profileHeader}>
              {/* Photo de profil optimisée avec Cloudinary */}
              {userData?.profilePicturePublicId ? (
                <CloudinaryAvatar
                  publicId={userData.profilePicturePublicId}
                  size={80}
                  quality="auto"
                  format="auto"
                  style={styles.profileImage}
                  fallbackUrl={userData?.profilePicture || defaultImages.profile}
                />
              ) : (
                <Image
                  source={
                    userData?.profilePicture
                      ? { uri: userData.profilePicture }
                      : defaultImages.profile
                  }
                  style={styles.profileImage}
                />
              )}
              <View style={styles.profileInfo}>
                <Text style={styles.username}>
                  {userData?.username || user?.username || "User"}
                </Text>
                <View style={styles.statsContainer}>
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{stats.posts}</Text>
                    <Text style={styles.statLabel}>Posts</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{stats.followers}</Text>
                    <Text style={styles.statLabel}>Followers</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{stats.following}</Text>
                    <Text style={styles.statLabel}>Following</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Bio */}
            <View style={styles.bioSection}>
              <Text style={styles.bioText}>
                {userData?.description || user?.description || "Description"}
              </Text>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtonsContainer}>
              <TouchableOpacity
                style={[styles.actionButton, styles.followButton]}
                onPress={() => console.log("Follow pressed")}
              >
                <Text style={styles.followButtonText}>Suivre</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.messageButton]}
                onPress={() => console.log("Message pressed")}
              >
                <Text style={styles.messageButtonText}>Message</Text>
              </TouchableOpacity>
            </View>

            {/* Driver statistics - SECTION MISE EN VALEUR */}
            <TouchableOpacity
              style={styles.performanceCard}
              onPress={handlePerformancesPress}
            >
              {/* Gradient Background Effect */}
              <View style={styles.performanceGradient}>
                {/* Header avec badge premium */}
                <View style={styles.performanceHeader}>
                  <View style={styles.performanceBadge}>
                    <Text style={styles.performanceBadgeText}>
                      ⚡ PERFORMANCE
                    </Text>
                  </View>
                  <View style={styles.performanceTitle}>
                    <Text style={styles.performanceTitleText}>
                      Track Your Racing Journey
                    </Text>
                    <Text style={styles.performanceSubtitle}>
                      Unlock detailed analytics & insights
                    </Text>
                  </View>
                </View>

                {isLoadingDriverStats ? (
                  <View style={styles.performanceLoading}>
                    <ActivityIndicator size="large" color="#E10600" />
                    <Text style={styles.performanceLoadingText}>
                      Loading performance data...
                    </Text>
                  </View>
                ) : (
                  <View style={styles.performanceStats}>
                    <View style={styles.performanceStatItem}>
                      <View
                        style={[
                          styles.performanceStatIcon,
                          { backgroundColor: "rgba(225, 6, 0, 0.1)" },
                        ]}
                      >
                        <FontAwesome
                          name="flag-checkered"
                          size={28}
                          color="#E10600"
                        />
                      </View>
                      <View style={styles.performanceStatContent}>
                        <Text style={styles.performanceStatValue}>
                          {driverStats.races}
                        </Text>
                        <Text style={styles.performanceStatLabel}>Races</Text>
                      </View>
                    </View>

                    <View style={styles.performanceStatDivider} />

                    <View style={styles.performanceStatItem}>
                      <View
                        style={[
                          styles.performanceStatIcon,
                          { backgroundColor: "rgba(255, 215, 0, 0.15)" },
                        ]}
                      >
                        <FontAwesome name="trophy" size={28} color="#FFD700" />
                      </View>
                      <View style={styles.performanceStatContent}>
                        <Text
                          style={[
                            styles.performanceStatValue,
                            { color: "#FFD700" },
                          ]}
                        >
                          {driverStats.wins}
                        </Text>
                        <Text style={styles.performanceStatLabel}>
                          Victories
                        </Text>
                      </View>
                    </View>

                    <View style={styles.performanceStatDivider} />

                    <View style={styles.performanceStatItem}>
                      <View
                        style={[
                          styles.performanceStatIcon,
                          { backgroundColor: "rgba(192, 192, 192, 0.15)" },
                        ]}
                      >
                        <FontAwesome name="trophy" size={28} color="#C0C0C0" />
                      </View>
                      <View style={styles.performanceStatContent}>
                        <Text
                          style={[
                            styles.performanceStatValue,
                            { color: "#C0C0C0" },
                          ]}
                        >
                          {driverStats.podiums}
                        </Text>
                        <Text style={styles.performanceStatLabel}>Podiums</Text>
                      </View>
                    </View>
                  </View>
                )}

                {/* Call to Action */}
                <View style={styles.performanceCTA}>
                  <View style={styles.performanceCTAContent}>
                    <Text style={styles.performanceCTAText}>
                      View Detailed Analytics
                    </Text>
                    <Text style={styles.performanceCTASubtext}>
                      Race history • Lap times • Progress tracking
                    </Text>
                  </View>
                  <View style={styles.performanceCTAIcon}>
                    <FontAwesome
                      name="chevron-right"
                      size={16}
                      color="#FFFFFF"
                    />
                  </View>
                </View>

                {/* Decorative Elements */}
                <View style={styles.performanceDecorative}>
                  <View style={styles.performanceCircle1} />
                  <View style={styles.performanceCircle2} />
                  <View style={styles.performanceCircle3} />
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "posts" && styles.activeTabButton,
            ]}
            onPress={() => setActiveTab("posts")}
          >
            <FontAwesome
              name="th-large"
              size={24}
              color={activeTab === "posts" ? "#E10600" : "#666666"}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "liked" && styles.activeTabButton,
            ]}
            onPress={() => setActiveTab("liked")}
          >
            <FontAwesome
              name="heart"
              size={24}
              color={activeTab === "liked" ? "#E10600" : "#666666"}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "favorites" && styles.activeTabButton,
            ]}
            onPress={() => setActiveTab("favorites")}
          >
            <FontAwesome
              name="bookmark"
              size={24}
              color={activeTab === "favorites" ? "#E10600" : "#666666"}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "reels" && styles.activeTabButton,
            ]}
            onPress={() => setActiveTab("reels")}
          >
            <FontAwesome
              name="film"
              size={24}
              color={activeTab === "reels" ? "#E10600" : "#666666"}
            />
          </TouchableOpacity>
        </View>

        <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
          {activeTab === "posts"
            ? renderPostsGrid()
            : activeTab === "liked"
            ? renderLikedPostsGrid()
            : activeTab === "favorites"
            ? renderFavoritesGrid()
            : activeTab === "reels"
            ? renderReelsGrid()
            : renderEmptyComponent()}
        </View>
      </ScrollView>

      <ProfileMenu
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        onSettingsPress={handleSettingsPress}
        onEditProfilePress={handleEditProfilePress}
        onPreferencesPress={handlePreferencesPress}
        onLogoutPress={handleLogoutPress}
        onPerformancesPress={handlePerformancesPress}
        userId={effectiveUserId || 0}
      />

      <Modal
        visible={postModalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={handleClosePostModal}      >
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
          <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" translucent={true} />
          {selectedPost && (
            <ProfilePost
              post={{
                ...selectedPost,
                username: "esteban_dardillac",
                userAvatar:
                  "https://images.pexels.com/photos/3482523/pexels-photo-3482523.jpeg",
              }}
              onClose={handleClosePostModal}
              onLike={handleLikePost}
              onComment={handleCommentPost}
              onShare={handleSharePost}
              onProfilePress={handleProfilePress}
            />
          )}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

export default ProfileScreen;
