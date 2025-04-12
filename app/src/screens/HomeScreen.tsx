import React, { useState, useRef, useEffect } from "react";
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
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useRouter } from "expo-router";
import styles from "../styles/homeStyles";
import StoryModal from "../components/StoryModal";
import CommentsModal from "../components/CommentsModal";
import ShareModal from "../components/Feed/ShareModal";
import PostItem, { Post } from "../components/Feed/PostItem";

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

const SCREEN_WIDTH = Dimensions.get("window").width;
// Nom d'utilisateur courant
const CURRENT_USERNAME = "john_doe";
const CURRENT_USER_AVATAR = "https://randomuser.me/api/portraits/men/32.jpg";

const HomeScreen: React.FC = () => {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [stories, setStories] = useState<Story[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isStoryModalVisible, setIsStoryModalVisible] = useState(false);
  const [currentStoryId, setCurrentStoryId] = useState("");
  const [isCommentsModalVisible, setIsCommentsModalVisible] = useState(false);
  const [isShareModalVisible, setIsShareModalVisible] = useState(false);
  const [currentPostId, setCurrentPostId] = useState("");
  const scrollY = useRef(new Animated.Value(0)).current;
  const isHeaderVisible = useRef(true);
  const lastScrollY = useRef(0);

  // Simuler le chargement des données
  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
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

    // Préparons des commentaires d'exemple
    const exampleComments1 = [
      {
        id: "c1",
        username: "user123",
        avatar: "https://randomuser.me/api/portraits/women/76.jpg",
        text: "Great photo! I love the team atmosphere 👏",
        timeAgo: "30m",
        likes: 3,
      },
      {
        id: "c2",
        username: "julie_design",
        avatar: "https://randomuser.me/api/portraits/women/45.jpg",
        text: "Looks like you all had a great time!",
        timeAgo: "1h",
        likes: 0,
      },
    ];

    const exampleComments2 = [
      {
        id: "c3",
        username: "tech_enthusiast",
        avatar: "https://randomuser.me/api/portraits/men/22.jpg",
        text: "I can't wait to try this product! Where can we buy it?",
        timeAgo: "45m",
        likes: 12,
      },
      {
        id: "c4",
        username: "sarah_dev",
        avatar: "https://randomuser.me/api/portraits/women/37.jpg",
        text: "What are the technical specifications?",
        timeAgo: "1h",
        likes: 4,
      },
      {
        id: "c5",
        username: "marketing_pro",
        avatar: "https://randomuser.me/api/portraits/men/56.jpg",
        text: "Congrats on the launch! The design is superb.",
        timeAgo: "2h",
        likes: 8,
      },
    ];

    const exampleComments3 = [
      {
        id: "c6",
        username: "design_student",
        avatar: "https://randomuser.me/api/portraits/women/14.jpg",
        text: "This quote is so true. Thanks for the inspiration!",
        timeAgo: "3h",
        likes: 15,
      },
    ];

    // Realistic mock posts data
    const mockPosts: Post[] = [
      {
        id: "1",
        username: "john_doe",
        avatar: "https://randomuser.me/api/portraits/men/85.jpg",
        images: [
          "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
          "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
        ],
        caption:
          "Amazing day at work with the GearConnect team! #networking #team",
        likes: 124,
        liked: false,
        saved: false,
        comments: exampleComments1,
        timeAgo: "35m",
      },
      {
        id: "2",
        username: "tech_company",
        avatar: "https://randomuser.me/api/portraits/men/81.jpg",
        images: [
          "https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
        ],
        caption:
          "Our new product is finally available! Discover all its features on our website. #innovation #tech",
        likes: 457,
        liked: true,
        saved: true,
        comments: exampleComments2,
        timeAgo: "2h",
      },
      {
        id: "3",
        username: CURRENT_USERNAME,
        avatar: CURRENT_USER_AVATAR,
        images: [
          "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
          "https://images.unsplash.com/photo-1611095970111-fc87b5315dc3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
          "https://images.unsplash.com/photo-1542744094-3a95b1b9c9fe?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
        ],
        caption:
          "Design is not just what it looks like and feels like. Design is how it works. #uxdesign",
        likes: 892,
        liked: false,
        saved: false,
        comments: exampleComments3,
        timeAgo: "5h",
      },
      {
        id: "4",
        username: "travel_addict",
        avatar: "https://randomuser.me/api/portraits/women/52.jpg",
        images: [
          "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
          "https://images.unsplash.com/photo-1519046904884-53103b34b206?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
        ],
        caption:
          "Finally back on vacation! ☀️ Paradise exists and it's in the Maldives. #travel #beach #relaxation",
        likes: 1023,
        liked: false,
        saved: true,
        comments: [],
        timeAgo: "4h",
      },
    ];

    setStories(mockStories);
    setPosts(mockPosts);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    // Simuler un chargement
    setTimeout(() => {
      loadData();
      setRefreshing(false);
    }, 1500);
  };

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: false,
      listener: (event: any) => {
        const currentScrollY = event.nativeEvent.contentOffset.y;
        if (currentScrollY <= 0) {
          isHeaderVisible.current = true;
        } else {
          // Determiner la direction du scroll
          const direction =
            currentScrollY > lastScrollY.current ? "down" : "up";
          if (direction === "down" && isHeaderVisible.current) {
            isHeaderVisible.current = false;
          } else if (direction === "up" && !isHeaderVisible.current) {
            isHeaderVisible.current = true;
          }
        }
        lastScrollY.current = currentScrollY;
      },
    }
  );

  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, isHeaderVisible.current ? 0 : -60],
    extrapolate: "clamp",
  });

  const handleLike = (postId: string) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            liked: !post.liked,
            likes: post.liked ? post.likes - 1 : post.likes + 1,
          };
        }
        return post;
      })
    );
  };

  const handleSave = (postId: string) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          return { ...post, saved: !post.saved };
        }
        return post;
      })
    );
  };

  const handleViewStory = (storyId: string) => {
    setCurrentStoryId(storyId);
    setIsStoryModalVisible(true);
  };

  const handleStoryComplete = (storyId: string) => {
    setStories((prevStories) =>
      prevStories.map((story) => {
        if (story.id === storyId) {
          return { ...story, viewed: true };
        }
        return story;
      })
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

  const handleAddComment = (postId: string, text: string) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          const newComment = {
            id: `c${Date.now()}`,
            username: CURRENT_USERNAME,
            avatar: CURRENT_USER_AVATAR,
            text,
            timeAgo: "just now",
            likes: 0,
          };
          return {
            ...post,
            comments: [...post.comments, newComment],
          };
        }
        return post;
      })
    );
  };

  const getCurrentPostComments = () => {
    const post = posts.find((p) => p.id === currentPostId);
    return post ? post.comments : [];
  };

  const handleProfilePress = (username: string) => {
    // Naviguer vers le profil utilisateur
    if (username === CURRENT_USERNAME) {
      router.push('/(app)/profile');
    } else {
      router.push({
        pathname: '/(app)/userProfile',
        params: { username }
      });
    }
  };

  const handleNavigateToProfile = () => {
    router.push('/(app)/profile');
  };

  const renderStoryItem = ({ item }: { item: Story }) => (
    <TouchableOpacity
      style={styles.storyContainer}
      onPress={() => handleViewStory(item.id)}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.storyRing,
          item.viewed ? styles.storyRingViewed : styles.storyRingUnviewed,
        ]}
      >
        <Image source={{ uri: item.avatar }} style={styles.storyAvatar} />
      </View>
      <Text style={styles.storyUsername} numberOfLines={1}>
        {item.username}
      </Text>
    </TouchableOpacity>
  );

  const renderPost = ({ item }: { item: Post }) => (
    <PostItem
      post={item}
      onLike={handleLike}
      onSave={handleSave}
      onComment={handleViewComments}
      onShare={handleSharePost}
      onProfilePress={handleProfilePress}
      currentUsername={CURRENT_USERNAME}
    />
  );

  const handleCreatePost = () => {
    router.push('/(app)/publicationScreen');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Animated.View
        style={[
          styles.header,
          { transform: [{ translateY: headerTranslateY }] },
        ]}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>GearConnect</Text>
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.headerIcon}>
              <FontAwesome name="paper-plane-o" size={24} color="#262626" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.headerIcon}
              onPress={handleNavigateToProfile}
            >
              <Image
                source={{ uri: CURRENT_USER_AVATAR }}
                style={styles.headerProfileImage}
              />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>

      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListHeaderComponent={
          <View>
            <FlatList
              data={stories}
              renderItem={renderStoryItem}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.storiesList}
              contentContainerStyle={styles.storiesListContent}
            />
            <View style={styles.separator} />
          </View>
        }
      />

      <StoryModal
        isVisible={isStoryModalVisible}
        stories={stories}
        currentStoryId={currentStoryId}
        onClose={handleCloseStoryModal}
        onStoryComplete={handleStoryComplete}
      />

      <CommentsModal
        isVisible={isCommentsModalVisible}
        postId={currentPostId}
        comments={getCurrentPostComments()}
        onClose={handleCloseCommentsModal}
        onAddComment={handleAddComment}
      />

      <ShareModal
        visible={isShareModalVisible}
        onClose={handleCloseShareModal}
        postId={currentPostId}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;
