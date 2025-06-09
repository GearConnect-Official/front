import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useRouter } from "expo-router";
import styles from "../styles/Profile/profileStyles";
import { useAuth } from "../context/AuthContext";
import ProfilePost from "../components/Feed/ProfilePost";
import favoritesService from "../services/favoritesService";
import postService from "../services/postService";
import ProfileMenu from "../components/Profile/ProfileMenu";
import { CloudinaryMedia } from "../components/media";
import { detectMediaType } from "../utils/mediaUtils";
import { defaultImages } from "../config/defaultImages";

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

// Type for events
interface Event {
  id: string;
  title: string;
  imageUrl: string;
  date: string;
  location: string;
  description?: string;
  participants?: number;
  isOrganizer?: boolean;
  result?: string; // For race results
}

// Type for driver statistics
interface DriverStats {
  races: number;
  wins: number;
  podiums: number;
  championshipPosition?: number;
}

// Définir l'interface des props
interface ProfileScreenProps {
  userId?: number;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ userId }) => {
  const router = useRouter();
  const auth = useAuth();
  const [activeTab, setActiveTab] = useState<string>("posts");
  const [posts, setPosts] = useState<Post[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [favorites, setFavorites] = useState<FavoritePost[]>([]);
  const [eventFilter, setEventFilter] = useState<
    "all" | "organized" | "participated"
  >("all");
  const [stats, setStats] = useState({
    posts: 0,
    followers: 1248,
    following: 420,
    saved: 0,
  });
  const [driverStats] = useState<DriverStats>({
    races: 12,
    wins: 3,
    podiums: 7,
    championshipPosition: 2,
  });
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [postModalVisible, setPostModalVisible] = useState(false);
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(false);
  const [favoritesPage, setFavoritesPage] = useState(1);
  const [hasMoreFavorites, setHasMoreFavorites] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);
  const [likedPosts, setLikedPosts] = useState<Post[]>([]);
  const [isLoadingLikedPosts, setIsLoadingLikedPosts] = useState(false);

  useEffect(() => {
    if (!auth?.user?.id) return;
    loadUserPosts();
    loadFavorites(1, true);
    loadLikedPosts();
  }, [userId, auth?.user?.id]);

  const loadUserPosts = async () => {
    try {
      setIsLoadingPosts(true);
      const userPosts = await postService.getUserPosts(Number(auth?.user?.id));

      if (!Array.isArray(userPosts)) {
        console.error("Expected array of posts but got:", userPosts);
        return;
      }

      // Convertir les posts de l'API en format attendu par l'interface
      const formattedPosts = userPosts.map((post: any) => ({
        id: post.id.toString(),
        imageUrl: post.cloudinaryUrl || "https://via.placeholder.com/300",
        likes: post.interactions?.filter((i: any) => i.like).length || 0,
        comments: post.interactions?.filter((i: any) => i.comment).length || 0,
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

  const loadFavorites = async (page: number = 1, reset: boolean = false) => {
    if (!auth?.user?.id || isLoadingFavorites) return;

    try {
      setIsLoadingFavorites(true);
      const response = await favoritesService.getUserFavorites(
        Number(auth?.user?.id),
        page
      );

      if (!response.favorites || !Array.isArray(response.favorites)) {
        console.error("Expected array of favorites but got:", response);
        return;
      }

      // Convertir les posts de l'API en format FavoritePost
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

      if (reset) {
        setFavorites(formattedFavorites);
      } else {
        setFavorites((prev) => [...prev, ...formattedFavorites]);
      }

      // Mettre à jour le nombre de favoris dans les stats
      if (reset) {
        setStats((prev) => ({ ...prev, saved: response.pagination.total }));
      }

      setHasMoreFavorites(page < response.pagination.totalPages);
      setFavoritesPage(page);
    } catch (error) {
      console.error("Error loading favorites:", error);
    } finally {
      setIsLoadingFavorites(false);
    }
  };

  const handleRemoveFromFavorites = async (postId: number) => {
    if (!auth?.user?.id || !postId) return;

    try {
      await favoritesService.toggleFavorite(postId, Number(auth?.user?.id));

      // Retirer le favori de la liste locale
      setFavorites((prev) => prev.filter((fav) => fav.id !== postId));

      // Mettre à jour les stats
      setStats((prev) => ({
        ...prev,
        saved: Math.max(0, (prev.saved || 0) - 1),
      }));
    } catch (error) {
      console.error("❌ Error removing from favorites:", error);
    }
  };

  const onRefreshProfile = async () => {
    setRefreshing(true);

    // Recharger les données selon l'onglet actif
    if (activeTab === "saved" && auth?.user?.id) {
      await loadFavorites(1, true);
    }
    // Ici on pourrait ajouter le rechargement des autres onglets

    setRefreshing(false);
  };

  const loadMoreFavorites = () => {
    if (hasMoreFavorites && !isLoadingFavorites) {
      loadFavorites(favoritesPage + 1, false);
    }
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
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
    // Here you could open a comments modal
  };

  const handleSharePost = (postId: string) => {
    console.log(`Share post ${postId}`);
    // Here you could open a share modal
  };

  const handleProfilePress = (username: string) => {
    console.log(`Navigate to profile of ${username}`);
    // Since we're already on the profile, this function would be more useful
    // if we were navigating to other profiles from the current profile
  };

  const handleEventPress = (eventId: string) => {
    router.push({
      pathname: "/(app)/eventDetail",
      params: { eventId },
    });
  };

  const handleSettingsPress = () => {
    setMenuVisible(false);
    router.push("/settings");
  };

  const handleEditProfilePress = () => {
    setMenuVisible(false);
    router.push("/editProfile");
  };

  const handlePreferencesPress = () => {
    setMenuVisible(false);
    router.push("/preferences");
  };

  const handleLogoutPress = async () => {
    setMenuVisible(false);
    try {
      await auth?.logout();
      // No need to manually redirect as it's handled in the logout function
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const loadLikedPosts = async () => {
    try {
      setIsLoadingLikedPosts(true);
      const response = await postService.getLikedPosts(Number(auth?.user?.id));

      if (!Array.isArray(response)) {
        console.error("Expected array of posts but got:", response);
        return;
      }

      // Convertir les posts de l'API en format attendu
      const formattedLikedPosts = response.map((post: any) => ({
        id: post.id.toString(),
        imageUrl: post.cloudinaryUrl || "https://via.placeholder.com/300",
        likes: post.interactions?.filter((i: any) => i.like).length || 0,
        comments: post.interactions?.filter((i: any) => i.comment).length || 0,
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

  const renderEventItem = ({ item }: { item: Event }) => (
    <TouchableOpacity
      style={styles.eventCard}
      activeOpacity={0.8}
      onPress={() => handleEventPress(item.id)}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.eventImage} />
      <View style={styles.eventOverlay}>
        {item.isOrganizer && (
          <View style={styles.organizerBadge}>
            <FontAwesome name="star" size={12} color="#FFFFFF" />
            <Text style={styles.organizerText}>Organizer</Text>
          </View>
        )}
        {item.result && (
          <View style={styles.resultBadge}>
            <Text style={styles.resultText}>{item.result}</Text>
          </View>
        )}
      </View>
      {item.result === "Victory" && (
        <View style={styles.achievementBadge}>
          <FontAwesome name="trophy" size={12} color="#FFFFFF" />
          <Text style={styles.achievementText}>1st place</Text>
        </View>
      )}
      <View style={styles.eventInfo}>
        <Text style={styles.eventTitle}>{item.title}</Text>
        <View style={styles.eventMeta}>
          <View style={styles.eventMetaItem}>
            <FontAwesome
              name="calendar"
              size={14}
              color="#6E6E6E"
              style={styles.eventMetaIcon}
            />
            <Text style={styles.eventMetaText}>{item.date}</Text>
          </View>
          <View style={styles.eventMetaItem}>
            <FontAwesome
              name="map-marker"
              size={14}
              color="#6E6E6E"
              style={styles.eventMetaIcon}
            />
            <Text style={styles.eventMetaText}>{item.location}</Text>
          </View>
          {item.participants && (
            <View style={styles.eventMetaItem}>
              <FontAwesome
                name="users"
                size={14}
                color="#6E6E6E"
                style={styles.eventMetaIcon}
              />
              <Text style={styles.eventMetaText}>
                {item.participants} participants
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

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

  const renderEventsList = () => {
    if (events.length === 0) {
      return renderEmptyComponent();
    }

    // Filter events based on active filter
    const filteredEvents = events.filter((event) => {
      if (eventFilter === "all") return true;
      if (eventFilter === "organized") return !!event.isOrganizer;
      if (eventFilter === "participated") return !event.isOrganizer; // Assuming that all non-organized events are participated
      return true;
    });

    // If no events match the filter, display an appropriate message
    if (filteredEvents.length === 0) {
      return (
        <View style={[styles.emptyContainer, { flex: 1, minHeight: 300 }]}>
          <FontAwesome name="calendar-times-o" size={60} color="#CCCCCC" />
          <Text style={styles.emptyTitle}>
            {eventFilter === "organized"
              ? "No events organized"
              : "No participation"}
          </Text>
          <Text style={styles.emptySubtitle}>
            {eventFilter === "organized"
              ? "Events you organize will appear here."
              : "Events you participate in will appear here."}
          </Text>
          <TouchableOpacity style={styles.shareButton}>
            <Text style={styles.shareButtonText}>Create Event</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.eventsContainer}>
        {/* Event filters */}
        <View style={styles.eventFiltersContainer}>
          <TouchableOpacity
            style={[
              styles.eventFilterButton,
              eventFilter === "all" && styles.activeEventFilter,
            ]}
            onPress={() => setEventFilter("all")}
          >
            <Text
              style={[
                styles.eventFilterText,
                eventFilter === "all" && styles.activeEventFilterText,
              ]}
            >
              All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.eventFilterButton,
              eventFilter === "organized" && styles.activeEventFilter,
            ]}
            onPress={() => setEventFilter("organized")}
          >
            <Text
              style={[
                styles.eventFilterText,
                eventFilter === "organized" && styles.activeEventFilterText,
              ]}
            >
              Organized
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.eventFilterButton,
              eventFilter === "participated" && styles.activeEventFilter,
            ]}
            onPress={() => setEventFilter("participated")}
          >
            <Text
              style={[
                styles.eventFilterText,
                eventFilter === "participated" && styles.activeEventFilterText,
              ]}
            >
              Participated
            </Text>
          </TouchableOpacity>
        </View>

        {/* List of filtered events */}
        {filteredEvents.map((item) => (
          <View key={item.id}>{renderEventItem({ item })}</View>
        ))}
      </View>
    );
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

  const { user } = auth;

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
              <Image
                source={
                  user?.photoURL
                    ? { uri: user.photoURL }
                    : defaultImages.profile
                }
                style={styles.profileImage}
              />
              <View style={styles.profileInfo}>
                <Text style={styles.username}>{user?.username || "User"}</Text>
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

            {/* Bio and information */}
            <View style={styles.bioSection}>
              <Text style={styles.bioText}>
                🏎️ F3 Driver | Karting Fr Championship 🏆
              </Text>
              <Text style={styles.bioText}>Ambassador @racing_gear</Text>
              <TouchableOpacity style={styles.websiteLink}>
                <Text style={styles.websiteText}>
                  circuits-passion.com/esteban
                </Text>
              </TouchableOpacity>
            </View>

            {/* Driver statistics */}
            <View style={styles.statsCard}>
              <View style={styles.statColumn}>
                <FontAwesome
                  name="flag-checkered"
                  size={20}
                  style={styles.statIcon}
                />
                <Text style={styles.driverStatLabel}>Races</Text>
                <Text style={styles.driverStatValue}>{driverStats.races}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.statColumn}>
                <FontAwesome name="trophy" size={20} style={styles.statIcon} />
                <Text style={styles.driverStatLabel}>Wins</Text>
                <Text style={styles.driverStatValue}>{driverStats.wins}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.statColumn}>
                <FontAwesome
                  name="certificate"
                  size={20}
                  style={styles.statIcon}
                />
                <Text style={styles.driverStatLabel}>Podiums</Text>
                <Text style={styles.driverStatValue}>
                  {driverStats.podiums}
                </Text>
              </View>
            </View>
          </View>

          {/* Tabs */}
          <View style={styles.tabsContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === "posts" && styles.activeTab]}
              onPress={() => setActiveTab("posts")}
            >
              <FontAwesome
                name="th"
                size={22}
                color={activeTab === "posts" ? "#E10600" : "#6E6E6E"}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === "reels" && styles.activeTab]}
              onPress={() => setActiveTab("reels")}
            >
              <FontAwesome
                name="play-circle-o"
                size={22}
                color={activeTab === "reels" ? "#E10600" : "#6E6E6E"}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === "liked" && styles.activeTab]}
              onPress={() => setActiveTab("liked")}
            >
              <FontAwesome
                name="heart-o"
                size={22}
                color={activeTab === "liked" ? "#E10600" : "#6E6E6E"}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === "favorites" && styles.activeTab,
              ]}
              onPress={() => setActiveTab("favorites")}
            >
              <FontAwesome
                name="bookmark-o"
                size={22}
                color={activeTab === "favorites" ? "#E10600" : "#6E6E6E"}
              />
            </TouchableOpacity>
          </View>
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
      />

      <Modal
        visible={postModalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={handleClosePostModal}
      >
        <SafeAreaView style={styles.container}>
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
