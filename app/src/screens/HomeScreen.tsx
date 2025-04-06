import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Post from "../components/Post";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import styles from "../styles/homeStyles";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../styles/ThemeProvider";

const MOCK_POSTS = [
  {
    id: "1",
    user: {
      name: "Benjamin Tisserand",
      avatar:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/59578035b2529a8b6527913374e8ea84a83d97f531c0c7dc081d7e0011ac79fc?placeholderIfAbsent=true&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/59578035b2529a8b6527913374e8ea84a83d97f531c0c7dc081d7e0011ac79fc?placeholderIfAbsent=true&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/59578035b2529a8b6527913374e8ea84a83d97f531c0c7dc081d7e0011ac79fc?placeholderIfAbsent=true&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/59578035b2529a8b6527913374e8ea84a83d97f531c0c7dc081d7e0011ac79fc?placeholderIfAbsent=true&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/59578035b2529a8b6527913374e8ea84a83d97f531c0c7dc081d7e0011ac79fc?placeholderIfAbsent=true&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/59578035b2529a8b6527913374e8ea84a83d97f531c0c7dc081d7e0011ac79fc?placeholderIfAbsent=true&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/59578035b2529a8b6527913374e8ea84a83d97f531c0c7dc081d7e0011ac79fc?placeholderIfAbsent=true&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/59578035b2529a8b6527913374e8ea84a83d97f531c0c7dc081d7e0011ac79fc?placeholderIfAbsent=true",
      location: "Val de Vienne Circuit, France",
      timeAgo: "2 hours ago",
    },
    content: {
      text: "Pole position and Winner of Val de Vienne Beginner Open Circuit!!! 🏁🥇🔛🔝",
      image:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/30264f1652771c8cd0e2b3807c3b5672ecc12d3e9a755488f02bc94b317b63a0?placeholderIfAbsent=true&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/30264f1652771c8cd0e2b3807c3b5672ecc12d3e9a755488f02bc94b317b63a0?placeholderIfAbsent=true&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/30264f1652771c8cd0e2b3807c3b5672ecc12d3e9a755488f02bc94b317b63a0?placeholderIfAbsent=true&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/30264f1652771c8cd0e2b3807c3b5672ecc12d3e9a755488f02bc94b317b63a0?placeholderIfAbsent=true&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/30264f1652771c8cd0e2b3807c3b5672ecc12d3e9a755488f02bc94b317b63a0?placeholderIfAbsent=true&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/30264f1652771c8cd0e2b3807c3b5672ecc12d3e9a755488f02bc94b317b63a0?placeholderIfAbsent=true&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/30264f1652771c8cd0e2b3807c3b5672ecc12d3e9a755488f02bc94b317b63a0?placeholderIfAbsent=true&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/30264f1652771c8cd0e2b3807c3b5672ecc12d3e9a755488f02bc94b317b63a0?placeholderIfAbsent=true",
      hashtags: ["kart", "poleposition"],
    },
  },
  {
    id: "2",
    user: {
      name: "Romain JAHIER",
      avatar:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/08fab03da4410e0c912c207be5fcb8d4b98279630642d79a9c97ce869d62bd65?placeholderIfAbsent=true&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/08fab03da4410e0c912c207be5fcb8d4b98279630642d79a9c97ce869d62bd65?placeholderIfAbsent=true&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/08fab03da4410e0c912c207be5fcb8d4b98279630642d79a9c97ce869d62bd65?placeholderIfAbsent=true&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/08fab03da4410e0c912c207be5fcb8d4b98279630642d79a9c97ce869d62bd65?placeholderIfAbsent=true&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/08fab03da4410e0c912c207be5fcb8d4b98279630642d79a9c97ce869d62bd65?placeholderIfAbsent=true&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/08fab03da4410e0c912c207be5fcb8d4b98279630642d79a9c97ce869d62bd65?placeholderIfAbsent=true&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/08fab03da4410e0c912c207be5fcb8d4b98279630642d79a9c97ce869d62bd65?placeholderIfAbsent=true&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/08fab03da4410e0c912c207be5fcb8d4b98279630642d79a9c97ce869d62bd65?placeholderIfAbsent=true",
      location: "Paris, France",
      timeAgo: "2 days ago",
    },
    content: {
      text: "The Ferraris' pit stop were on fire this week-end 🔥🔥",
      image:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/fe6ee81c77dd4b7f4be2bdec60e98e4cbdeb5388a90a17afadaf28c723d48c5d?placeholderIfAbsent=true&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/fe6ee81c77dd4b7f4be2bdec60e98e4cbdeb5388a90a17afadaf28c723d48c5d?placeholderIfAbsent=true&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/fe6ee81c77dd4b7f4be2bdec60e98e4cbdeb5388a90a17afadaf28c723d48c5d?placeholderIfAbsent=true&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/fe6ee81c77dd4b7f4be2bdec60e98e4cbdeb5388a90a17afadaf28c723d48c5d?placeholderIfAbsent=true&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/fe6ee81c77dd4b7f4be2bdec60e98e4cbdeb5388a90a17afadaf28c723d48c5d?placeholderIfAbsent=true&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/fe6ee81c77dd4b7f4be2bdec60e98e4cbdeb5388a90a17afadaf28c723d48c5d?placeholderIfAbsent=true&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/fe6ee81c77dd4b7f4be2bdec60e98e4cbdeb5388a90a17afadaf28c723d48c5d?placeholderIfAbsent=true&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/fe6ee81c77dd4b7f4be2bdec60e98e4cbdeb5388a90a17afadaf28c723d48c5d?placeholderIfAbsent=true",
      hashtags: ["ferrari", "pitstop"],
    },
  },
];

const HomeScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [searchQuery, setSearchQuery] = useState("");
  const navigation = useNavigation();
  const { user, logout, getCurrentUser } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { theme, isDarkMode, toggleTheme } = useTheme();

  // Refresh user info when component mounts
  useEffect(() => {
    const refreshUserInfo = async () => {
      await getCurrentUser();
    };
    refreshUserInfo();
  }, []);

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Logout",
          onPress: async () => {
            await logout();
          },
          style: "destructive"
        }
      ]
    );
  };

  // Styles spécifiques pour le thème
  const themeCardStyle = {
    padding: 16,
    marginBottom: 16,
    backgroundColor: isDarkMode ? theme.colors.background.paper : '#F7F8F9',
    borderRadius: 8,
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
  };

  const themeTextStyle = { 
    fontSize: 16, 
    fontWeight: '500' as const, 
    color: isDarkMode ? theme.colors.text.primary : '#1E232C' 
  };

  const themeButtonStyle = {
    backgroundColor: theme.colors.primary.main,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  };

  const themeButtonTextStyle = { 
    color: '#FFFFFF', 
    fontWeight: '500' as const 
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => setShowUserMenu(!showUserMenu)}
          style={styles.profileButton}
        >
          <Image
            source={{
              uri: user?.photoURL|| "https://cdn.builder.io/api/v1/image/assets/TEMP/f3d67917c6442fafa158ab0bdb706f7194e5a329b13b72692715ec90abbf8ce7?placeholderIfAbsent=true"
            }}
            style={styles.topBarImg}
          />
          {showUserMenu && (
            <View style={styles.userMenu}>
              <TouchableOpacity 
                style={styles.userMenuItem}
                onPress={() => navigation.navigate("Profile" as never)}
              >
                <FontAwesome name="user" size={16} color="#1E232C" />
                <Text style={styles.userMenuItemText}>Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.userMenuItem}
                onPress={() => navigation.navigate("ThemeExample" as never)}
              >
                <FontAwesome name="paint-brush" size={16} color="#1E232C" />
                <Text style={styles.userMenuItemText}>Thème</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.userMenuItem}
                onPress={handleLogout}
              >
                <FontAwesome name="sign-out" size={16} color="#1E232C" />
                <Text style={styles.userMenuItemText}>Logout</Text>
              </TouchableOpacity>
            </View>
          )}
        </TouchableOpacity>
        
        <TextInput
          style={styles.topBarSearchInput}
          placeholder="Search..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <View style={styles.topBarIcons}>
          <TouchableOpacity>
            <FontAwesome name="bell" size={24} color="#1E232C" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {MOCK_POSTS.map((post) => (
          <Post key={post.id} {...post} />
        ))}
      </ScrollView>
    </View>
  );
};

export default HomeScreen;
