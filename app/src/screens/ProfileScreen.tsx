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
import ProfileMenu from "../components/Profile/ProfileMenu";
import { CloudinaryMedia } from '../components/media';
import { detectMediaType } from '../utils/mediaUtils';
import PerformanceService from '../services/performanceService';

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

// Type for driver statistics (adapted for API data)
interface DriverStats {
  races: number;
  wins: number;
  podiums: number;
  championshipPosition?: number;
  bestPosition?: number;
  averagePosition?: number;
}

// Définir l'interface des props
interface ProfileScreenProps {
  userId?: number;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ userId }) => {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("posts");
  const [posts, setPosts] = useState<Post[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [favorites, setFavorites] = useState<FavoritePost[]>([]);
  const [eventFilter, setEventFilter] = useState<
    "all" | "organized" | "participated"
  >("all");
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
    championshipPosition: 0,
    bestPosition: 0,
    averagePosition: 0,
  });
  const [isLoadingDriverStats, setIsLoadingDriverStats] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [postModalVisible, setPostModalVisible] = useState(false);
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(false);
  const [favoritesPage, setFavoritesPage] = useState(1);
  const [hasMoreFavorites, setHasMoreFavorites] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  const loadMockData = () => {
    // Simulated posts for the grid
    const mockPosts: Post[] = [
      {
        id: "1",
        imageUrl:
          "https://images.pexels.com/photos/12801367/pexels-photo-12801367.jpeg",
        likes: 128,
        comments: 14,
        location: "Monza Circuit",
        multipleImages: true,
        caption:
          "Amazing day at Monza Circuit. Preparing for the upcoming season! 🏎️ #F3 #Racing #Monza",
        timeAgo: "2 days",
      },
      {
        id: "2",
        imageUrl:
          "https://images.pexels.com/photos/12316494/pexels-photo-12316494.jpeg",
        likes: 253,
        comments: 32,
        location: "Paul Ricard Circuit",
        caption:
          "Testing at Paul Ricard. Perfect conditions and good team performance. Ready for competition! 💪",
        timeAgo: "1 week",
      },
      {
        id: "3",
        imageUrl:
          "https://images.pexels.com/photos/12120915/pexels-photo-12120915.jpeg",
        likes: 86,
        comments: 9,
        location: "Cormeilles Karting",
        multipleImages: true,
        caption:
          "Back to basics with a karting session. Nothing better to perfect your technique!",
        timeAgo: "2 weeks",
      },
      {
        id: "4",
        imageUrl:
          "https://images.pexels.com/photos/1719647/pexels-photo-1719647.jpeg",
        likes: 176,
        comments: 21,
        caption:
          "New custom helmet for the season! What do you think? #Racing #Equipment",
        timeAgo: "3 weeks",
      },
      {
        id: "5",
        imageUrl:
          "https://images.pexels.com/photos/9660/business-car-vehicle-black-and-white.jpg",
        likes: 142,
        comments: 17,
        location: "Spa-Francorchamps Circuit",
        caption:
          "Race weekend at Spa. A legendary track with changing weather conditions!",
        timeAgo: "1 month",
      },
      {
        id: "6",
        imageUrl:
          "https://images.pexels.com/photos/2804393/pexels-photo-2804393.jpeg",
        likes: 95,
        comments: 7,
        caption:
          "While waiting for the next race, focus on physical training 🏃‍♂️",
        timeAgo: "1 month",
      },
      {
        id: "7",
        imageUrl:
          "https://images.pexels.com/photos/109699/pexels-photo-109699.jpeg",
        likes: 204,
        comments: 27,
        multipleImages: true,
        caption:
          "Visiting the team factory. Amazing to see the work of engineers and mechanics!",
        timeAgo: "2 months",
      },
      {
        id: "8",
        imageUrl:
          "https://images.pexels.com/photos/12801381/pexels-photo-12801381.jpeg",
        likes: 118,
        comments: 12,
        caption:
          "Analyzing data from the last race. Always looking to improve! 📊",
        timeAgo: "2 months",
      },
      {
        id: "9",
        imageUrl:
          "https://images.pexels.com/photos/15825503/pexels-photo-15825503/free-photo-of-voiture-de-course-de-formule-1-et-drapeaux-a-damier.jpeg",
        likes: 163,
        comments: 19,
        location: "Circuit de Barcelona-Catalunya",
        caption:
          "First tests in Barcelona. The new car looks promising! 🏎️ #Testing #F3 #Barcelona",
        timeAgo: "3 months",
      },
    ];

    // Simulated events
    const mockEvents: Event[] = [
      {
        id: "1",
        title: "F3 Championship - Round 1",
        imageUrl:
          "https://images.pexels.com/photos/12138012/pexels-photo-12138012.jpeg",
        date: "March 15-17, 2023",
        location: "Monza Circuit, Italy",
        description:
          "First round of the 2023 F3 championship. Qualifying P3, race 1 result: P2, race 2: P1.",
        result: "Victory",
        participants: 22,
      },
      {
        id: "2",
        title: "Exhibition Race - 4h of Le Mans",
        imageUrl:
          "https://images.pexels.com/photos/12062013/pexels-photo-12062013.jpeg",
        date: "April 5-6, 2023",
        location: "Circuit des 24h du Mans, France",
        description: "Exhibition race before the 24h of Le Mans.",
        result: "P4",
        participants: 30,
      },
      {
        id: "3",
        title: "F3 Championship - Round 2",
        imageUrl:
          "https://images.pexels.com/photos/2399249/pexels-photo-2399249.jpeg",
        date: "April 29 - May 1, 2023",
        location: "Paul Ricard Circuit, France",
        description:
          "Second round of the 2023 F3 championship. Qualifying P1, race 1: P1, race 2: DNF (technical issue).",
        result: "Victory / DNF",
        participants: 22,
      },
      {
        id: "4",
        title: "Karting Day - Young Drivers Promotion",
        imageUrl:
          "https://images.pexels.com/photos/8985459/pexels-photo-8985459.jpeg",
        date: "May 15, 2023",
        location: "Cormeilles Karting, France",
        description:
          "Introduction day organized for young drivers. Experience sharing and coaching.",
        isOrganizer: true,
        participants: 15,
      },
      {
        id: "5",
        title: "F3 Championship - Round 3",
        imageUrl:
          "https://images.pexels.com/photos/265881/pexels-photo-265881.jpeg",
        date: "May 20-22, 2023",
        location: "Circuit de Barcelona-Catalunya, Spain",
        description:
          "Third round of the 2023 F3 championship. Qualifying P5, race 1: P4, race 2: P3.",
        result: "P3",
        participants: 22,
      },
      {
        id: "6",
        title: "Advanced Driving Course",
        imageUrl:
          "https://images.pexels.com/photos/14777754/pexels-photo-14777754.jpeg",
        date: "June 10, 2023",
        location: "Magny-Cours Circuit, France",
        description:
          "Driving course for experienced drivers. Advanced techniques and telemetry analysis.",
        isOrganizer: true,
        participants: 8,
      },
    ];

    setPosts(mockPosts);
    setEvents(mockEvents);
  };

  const loadDriverStats = useCallback(async () => {
    if (!user?.id) return;

    try {
      setIsLoadingDriverStats(true);
      
      const response = await PerformanceService.getUserStats(user.id);
      
      if (response.success && response.data) {
        const apiStats = response.data;
        
        // Mapper les données de l'API vers notre interface DriverStats
        setDriverStats({
          races: apiStats.totalRaces || 0,
          wins: apiStats.wins || 0,
          podiums: apiStats.podiumFinishes || 0,
          bestPosition: apiStats.bestPosition || 0,
          averagePosition: apiStats.averagePosition || 0,
        });
      }
    } catch (error) {
      console.error('Error loading driver stats:', error);
    } finally {
      setIsLoadingDriverStats(false);
    }
  }, [user?.id]);

  const loadFavorites = useCallback(async (page: number = 1, reset: boolean = false) => {
    if (!user?.id) return;

    try {
      if (reset) {
        setIsLoadingFavorites(true);
        setFavoritesPage(1);
      }

      const favoritesService = require('../services/favoritesService').default;
      const response = await favoritesService.getUserFavorites(user.id, page, 10);

      if (response.success && response.data) {
        if (reset) {
          setFavorites(response.data);
        } else {
          setFavorites(prev => [...prev, ...response.data]);
        }
        
        setHasMoreFavorites(response.data.length === 10);
        setStats(prev => ({ ...prev, saved: response.count || prev.saved }));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setIsLoadingFavorites(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadMockData();
    
    // Charger les performances réelles depuis l'API
    if (user?.id) {
      loadDriverStats();
      loadFavorites(1, true);
    }
  }, [userId, user?.id, loadDriverStats, loadFavorites]);

  const handleRemoveFromFavorites = async (postId: number) => {
    if (!user?.id || !postId) return;

    try {
      await favoritesService.toggleFavorite(postId, Number(user.id));
      
      // Retirer le favori de la liste locale
      setFavorites(prev => prev.filter(fav => fav.id !== postId));
      
      // Mettre à jour les stats
      setStats(prev => ({ ...prev, saved: Math.max(0, (prev.saved || 0) - 1) }));
      
    } catch (error) {
      console.error('❌ Error removing from favorites:', error);
    }
  };

  const onRefreshProfile = async () => {
    setRefreshing(true);
    
    // Recharger les données selon l'onglet actif
    if (activeTab === 'saved' && user?.id) {
      await loadFavorites(1, true);
    }
    
    // Recharger les statistiques de performance
    if (user?.id) {
      await loadDriverStats();
    }
    
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
      await signOut();
      router.replace("/auth");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handlePerformancesPress = () => {
    router.push("/performances");
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
          {rowItems.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={styles.postTile}
              activeOpacity={0.8}
              onPress={() => handlePostPress(item)}
            >
              <Image
                source={{ uri: item.imageUrl }}
                style={styles.postTileImage}
              />
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
    if (favorites.length === 0 && !isLoadingFavorites) {
      return renderEmptyComponent();
    }

    // Rendu des favoris sans FlatList pour éviter les VirtualizedLists imbriquées
    return (
      <View style={styles.favoritesContainer}>
        {favorites.map((item, index) => {
          const mediaType = detectMediaType(item.cloudinaryUrl, item.cloudinaryPublicId, item.imageMetadata);
          const isVideo = mediaType === 'video';

          return (
            <TouchableOpacity
              key={`${item.id}-${index}`}
              style={styles.favoriteItem}
              activeOpacity={0.8}
              onPress={() => {
                // Naviguer vers le détail du post
                router.push({
                  pathname: '/(app)/postDetail',
                  params: { postId: item.id.toString() }
                });
              }}
            >
              <View style={styles.favoriteImageContainer}>
                {isVideo ? (
                  <CloudinaryMedia
                    publicId={item.cloudinaryPublicId || ''}
                    mediaType={mediaType}
                    width={300}
                    height={200}
                    crop="fill"
                    quality="auto"
                    format="mp4"
                    style={styles.favoriteImage}
                    fallbackUrl={item.cloudinaryUrl || 'https://via.placeholder.com/300x300?text=No+Image'}
                    shouldPlay={false}
                    isMuted={true}
                    useNativeControls={false}
                    isLooping={false}
                  />
                ) : (
                  <Image
                    source={{ uri: item.cloudinaryUrl || 'https://via.placeholder.com/300x300?text=No+Image' }}
                    style={styles.favoriteImage}
                    resizeMode="cover"
                  />
                )}
                <TouchableOpacity 
                  style={styles.removeFavoriteButton}
                  onPress={() => handleRemoveFromFavorites(item.id)}
                >
                  <FontAwesome name="times" size={16} color="#E10600" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.favoriteContent}>
                <View style={styles.favoriteHeader}>
                  <View style={styles.favoriteUserAvatar}>
                    <FontAwesome name="user" size={16} color="#6E6E6E" />
                  </View>
                  <Text style={styles.favoriteUsername}>
                    @{item.user?.username || 'Unknown User'}
                  </Text>
                </View>
                
                <Text style={styles.favoriteTitle} numberOfLines={1}>
                  {item.title || 'Sans titre'}
                </Text>
                
                <Text style={styles.favoriteDescription} numberOfLines={2}>
                  {item.body || 'Aucune description disponible'}
                </Text>
                
                <View style={styles.favoriteMeta}>
                  <Text style={styles.favoriteDate}>
                    {item.createdAt ? new Date(item.createdAt).toLocaleDateString('fr-FR') : 'Date inconnue'}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
        
        {isLoadingFavorites && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#E10600" />
            <Text style={styles.loadingText}>Chargement...</Text>
          </View>
        )}
        
        {hasMoreFavorites && !isLoadingFavorites && favorites.length > 0 && (
          <TouchableOpacity 
            style={styles.loadMoreButton}
            onPress={loadMoreFavorites}
          >
            <Text style={styles.loadMoreText}>Charger plus</Text>
          </TouchableOpacity>
        )}
      </View>
    );
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
      ) : activeTab === "events" ? (
        <>
          <FontAwesome name="calendar-plus-o" size={60} color="#CCCCCC" />
          <Text style={styles.emptyTitle}>No Events</Text>
          <Text style={styles.emptySubtitle}>
            Your races, championships and training sessions will appear here.
          </Text>
          <TouchableOpacity style={styles.shareButton}>
            <Text style={styles.shareButtonText}>Create Event</Text>
          </TouchableOpacity>
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefreshProfile}
            colors={['#E10600']}
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
            <View style={styles.profileInfo}>
              <Image
                source={{
                  uri: "https://images.pexels.com/photos/3482523/pexels-photo-3482523.jpeg",
                }}
                style={styles.profileAvatar}
              />

              <View style={styles.profileDetails}>
                <Text style={styles.displayName}>Esteban Dardillac</Text>
                <View style={styles.statsContainer}>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>
                      {formatNumber(stats.posts)}
                    </Text>
                    <Text style={styles.statLabel}>Posts</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>
                      {formatNumber(stats.followers)}
                    </Text>
                    <Text style={styles.statLabel}>Followers</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>
                      {formatNumber(stats.following)}
                    </Text>
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

            {/* Driver statistics - SECTION MISE EN VALEUR */}
            <TouchableOpacity style={styles.statsCard} onPress={handlePerformancesPress}>
              <View style={{
                position: 'absolute',
                top: 5,
                right: 10,
                backgroundColor: '#FF6B1A',
                borderRadius: 12,
                paddingHorizontal: 8,
                paddingVertical: 3,
                zIndex: 1
              }}>
                <Text style={{
                  color: '#FFFFFF',
                  fontSize: 10,
                  fontWeight: 'bold'
                }}>
                  📊 TRACK NOW
                </Text>
              </View>
              
              {isLoadingDriverStats ? (
                <View style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingVertical: 20
                }}>
                  <ActivityIndicator size="small" color="#E10600" />
                  <Text style={{
                    fontSize: 12,
                    color: '#6E6E6E',
                    marginTop: 8
                  }}>
                    Loading performance data...
                  </Text>
                </View>
              ) : (
                <>
                  <View style={styles.statColumn}>
                    <FontAwesome
                      name="flag-checkered"
                      size={20}
                      style={[styles.statIcon, { color: '#E10600' }]}
                    />
                    <Text style={styles.driverStatLabel}>Races</Text>
                    <Text style={[styles.driverStatValue, { color: '#E10600', fontWeight: 'bold' }]}>
                      {driverStats.races}
                    </Text>
                  </View>
                  <View style={styles.divider} />
                  <View style={styles.statColumn}>
                    <FontAwesome 
                      name="trophy" 
                      size={20} 
                      style={[styles.statIcon, { color: '#FFD700' }]} 
                    />
                    <Text style={styles.driverStatLabel}>Wins</Text>
                    <Text style={[styles.driverStatValue, { color: '#FFD700', fontWeight: 'bold' }]}>
                      {driverStats.wins}
                    </Text>
                  </View>
                  <View style={styles.divider} />
                  <View style={styles.statColumn}>
                    <FontAwesome
                      name="certificate"
                      size={20}
                      style={[styles.statIcon, { color: '#C0C0C0' }]}
                    />
                    <Text style={styles.driverStatLabel}>Podiums</Text>
                    <Text style={[styles.driverStatValue, { color: '#C0C0C0', fontWeight: 'bold' }]}>
                      {driverStats.podiums}
                    </Text>
                  </View>
                </>
              )}
              
              {/* Indication que c'est cliquable */}
              <View style={{
                position: 'absolute',
                bottom: 5,
                right: 10,
                flexDirection: 'row',
                alignItems: 'center'
              }}>
                <Text style={{
                  fontSize: 12,
                  color: '#E10600',
                  fontWeight: '600',
                  marginRight: 5
                }}>
                  View Details
                </Text>
                <FontAwesome 
                  name="chevron-right" 
                  size={12} 
                  color="#E10600" 
                />
              </View>
            </TouchableOpacity>

            {/* Featured stories */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.highlightsContainer}
              contentContainerStyle={styles.highlightsContent}
            >
              <TouchableOpacity key="highlight-1" style={styles.highlightItem}>
                <View style={styles.highlightImageContainer}>
                  <Image
                    source={{
                      uri: "https://images.pexels.com/photos/12012678/pexels-photo-12012678.jpeg",
                    }}
                    style={styles.highlightImage}
                  />
                </View>
                <Text style={styles.highlightText}>F3 2023</Text>
              </TouchableOpacity>
              <TouchableOpacity key="highlight-2" style={styles.highlightItem}>
                <View style={styles.highlightImageContainer}>
                  <Image
                    source={{
                      uri: "https://images.pexels.com/photos/461705/pexels-photo-461705.jpeg",
                    }}
                    style={styles.highlightImage}
                  />
                </View>
                <Text style={styles.highlightText}>Victories</Text>
              </TouchableOpacity>
              <TouchableOpacity key="highlight-3" style={styles.highlightItem}>
                <View style={styles.highlightImageContainer}>
                  <Image
                    source={{
                      uri: "https://images.pexels.com/photos/12120941/pexels-photo-12120941.jpeg",
                    }}
                    style={styles.highlightImage}
                  />
                </View>
                <Text style={styles.highlightText}>Karting</Text>
              </TouchableOpacity>
              <TouchableOpacity key="highlight-4" style={styles.highlightItem}>
                <View style={styles.highlightImageContainer}>
                  <Image
                    source={{
                      uri: "https://images.pexels.com/photos/17236741/pexels-photo-17236741/free-photo-of-sport-auto-rapide-puissant.jpeg",
                    }}
                    style={styles.highlightImage}
                  />
                </View>
                <Text style={styles.highlightText}>Team</Text>
              </TouchableOpacity>
              <TouchableOpacity
                key="highlight-new"
                style={styles.highlightItem}
              >
                <View style={styles.highlightImageContainer}>
                  <View style={styles.newHighlightPlus}>
                    <FontAwesome name="plus" size={24} color="#1E1E1E" />
                  </View>
                </View>
                <Text style={styles.highlightText}>New</Text>
              </TouchableOpacity>
            </ScrollView>
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
              style={[styles.tab, activeTab === "events" && styles.activeTab]}
              onPress={() => setActiveTab("events")}
            >
              <FontAwesome
                name="calendar"
                size={22}
                color={activeTab === "events" ? "#E10600" : "#6E6E6E"}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.performanceTab,
                activeTab === "performances" && styles.activePerformanceTab
              ]}
              onPress={() => handlePerformancesPress()}
            >
              <View style={{ alignItems: 'center', position: 'relative' }}>
                <FontAwesome
                  name="tachometer"
                  size={24}
                  color={activeTab === "performances" ? "#FFFFFF" : "#E10600"}
                />
                <View style={{
                  position: 'absolute',
                  top: -8,
                  right: -12,
                  backgroundColor: '#FF6B1A',
                  borderRadius: 8,
                  paddingHorizontal: 4,
                  paddingVertical: 1,
                  minWidth: 24,
                  alignItems: 'center'
                }}>
                  <Text style={{
                    color: '#FFFFFF',
                    fontSize: 9,
                    fontWeight: 'bold',
                    textAlign: 'center'
                  }}>
                    🔥
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === "reels" && styles.activeTab]}
              onPress={() => setActiveTab("reels")}
            >
              <FontAwesome
                name="film"
                size={22}
                color={activeTab === "reels" ? "#E10600" : "#6E6E6E"}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === "saved" && styles.activeTab]}
              onPress={() => setActiveTab("saved")}
            >
              <FontAwesome
                name="bookmark-o"
                size={22}
                color={activeTab === "saved" ? "#E10600" : "#6E6E6E"}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Tab content */}
        <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
          {activeTab === "posts"
            ? renderPostsGrid()
            : activeTab === "events"
            ? renderEventsList()
            : activeTab === "saved"
            ? renderFavoritesGrid()
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
      />

      {/* Modal to display a post in detail */}
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
