import React from "react";
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { CloudinaryAvatar } from "../media/CloudinaryImage";
import { RecommendedUser } from "../../services/recommendationService";
import theme from "../../styles/config/theme";
import { useRouter } from "expo-router";

interface RecommendedUsersProps {
  users: RecommendedUser[];
  onFollowUser?: (userId: number) => void;
  followingUserIds?: number[];
  isLoading?: boolean;
}

/**
 * Composant pour afficher les utilisateurs recommandés dans le feed
 * S'intègre de manière native dans le flux de posts
 */
const RecommendedUsers: React.FC<RecommendedUsersProps> = ({
  users,
  onFollowUser,
  followingUserIds = [],
  isLoading = false
}) => {
  const router = useRouter();

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <FontAwesome name="users" size={16} color={theme.colors.primary} />
          <Text style={styles.title}>Utilisateurs suggérés</Text>
        </View>
        <ActivityIndicator size="small" color={theme.colors.primary} style={{ marginVertical: 20 }} />
      </View>
    );
  }

  if (!users || users.length === 0) {
    return null;
  }

  const navigateToProfile = (userId: number) => {
    router.push(`/userProfile?id=${userId}`);
  };

  const handleFollowPress = (userId: number) => {
    if (onFollowUser) {
      onFollowUser(userId);
    }
  };

  const renderUserItem = ({ item }: { item: RecommendedUser }) => {
    const isFollowing = followingUserIds.includes(item.id);
    
    return (
      <TouchableOpacity
        style={styles.userCard}
        onPress={() => navigateToProfile(item.id)}
        activeOpacity={0.7}
      >
        <CloudinaryAvatar
          publicId={item.profilePicture}
          imageUrl={item.imageUrl}
          size={50}
          style={styles.avatar}
        />
        
        <View style={styles.userInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.name} numberOfLines={1}>
              {item.name}
            </Text>
            {item.isVerify && (
              <FontAwesome
                name="check-circle"
                size={14}
                color={theme.colors.primary}
                style={styles.verifiedIcon}
              />
            )}
          </View>
          <Text style={styles.username} numberOfLines={1}>
            @{item.username}
          </Text>
          <View style={styles.statsRow}>
            <Text style={styles.stats}>
              {item.followersCount} followers • {item.postsCount} posts
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.followButton,
            isFollowing && styles.followingButton
          ]}
          onPress={() => handleFollowPress(item.id)}
        >
          <Text style={[
            styles.followButtonText,
            isFollowing && styles.followingButtonText
          ]}>
            {isFollowing ? "Abonné" : "Suivre"}
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <FontAwesome name="users" size={16} color={theme.colors.primary} />
        <Text style={styles.title}>Suggestions pour vous</Text>
      </View>
      
      <FlatList
        data={users}
        renderItem={renderUserItem}
        keyExtractor={(item) => `rec-user-${item.id}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = {
  container: {
    backgroundColor: "#fff",
    marginBottom: 10,
    paddingVertical: 15,
  },
  header: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  title: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: theme.colors.text,
    marginLeft: 8,
  },
  listContainer: {
    paddingHorizontal: 15,
  },
  userCard: {
    width: 200,
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  avatar: {
    marginBottom: 10,
  },
  userInfo: {
    flex: 1,
    marginBottom: 10,
  },
  nameRow: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    marginBottom: 2,
  },
  name: {
    fontSize: 15,
    fontWeight: "600" as const,
    color: theme.colors.text,
    maxWidth: 150,
  },
  verifiedIcon: {
    marginLeft: 4,
  },
  username: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginBottom: 6,
  },
  statsRow: {
    flexDirection: "row" as const,
  },
  stats: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  followButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center" as const,
  },
  followingButton: {
    backgroundColor: "#e9ecef",
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  followButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600" as const,
  },
  followingButtonText: {
    color: theme.colors.text,
  },
};

export default RecommendedUsers;

