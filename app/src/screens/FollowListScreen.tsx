import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  Alert,
  TextInput,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import followService from '../services/followService';
import FollowButton from '../components/FollowButton';
import { FollowUser } from '../types/follow.types';
import { CloudinaryAvatar } from '../components/media/CloudinaryImage';
import { useAuth } from '../context/AuthContext';

type TabType = 'followers' | 'following';

const FollowListScreen: React.FC = () => {
  const { userId, initialTab = 'followers' } = useLocalSearchParams<{
    userId: string;
    initialTab?: string;
  }>();
  const router = useRouter();
  const { user } = useAuth() || {};

  const [activeTab, setActiveTab] = useState<TabType>(initialTab as TabType);
  const [followers, setFollowers] = useState<FollowUser[]>([]);
  const [following, setFollowing] = useState<FollowUser[]>([]);
  const [filteredFollowers, setFilteredFollowers] = useState<FollowUser[]>([]);
  const [filteredFollowing, setFilteredFollowing] = useState<FollowUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  const targetUserId = parseInt(userId as string);

  useEffect(() => {
    loadData();
  }, [targetUserId]);

  useEffect(() => {
    filterUsers();
  }, [searchQuery, followers, following]);

  const loadData = async (refresh = false) => {
    if (refresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    try {
      const [followersResponse, followingResponse] = await Promise.all([
        followService.getFollowers(targetUserId),
        followService.getFollowing(targetUserId),
      ]);

      // Récupérer les données de base
      let followersData: FollowUser[] = [];
      let followingData: FollowUser[] = [];

      if (followersResponse.success && followersResponse.data) {
        followersData = followersResponse.data.followers;
        setFollowersCount(followersResponse.data.totalCount);
      }

      if (followingResponse.success && followingResponse.data) {
        followingData = followingResponse.data.following;
        setFollowingCount(followingResponse.data.totalCount);
      }

      // Vérifier l'état de follow pour l'utilisateur connecté
      if (user && user.id) {
        const currentUserId = Number(user.id);
        const allUserIds = [
          ...followersData.map(f => f.id),
          ...followingData.map(f => f.id)
        ].filter(id => id !== currentUserId); // Exclure l'utilisateur connecté

        if (allUserIds.length > 0) {
          try {
            const followStatusResponse = await followService.checkFollowingStatus(allUserIds, currentUserId);
            if (followStatusResponse.success && followStatusResponse.data) {
              const followedUserIds = followStatusResponse.data;
              
              // Mettre à jour l'état de follow pour les followers
              followersData = followersData.map(user => ({
                ...user,
                isFollowing: followedUserIds.includes(user.id),
              }));
              
              // Mettre à jour l'état de follow pour les following
              followingData = followingData.map(user => ({
                ...user,
                isFollowing: followedUserIds.includes(user.id),
              }));
            }
          } catch (error) {
            console.warn('Could not check follow status for list users:', error);
          }
        }
      }

      setFollowers(followersData);
      setFollowing(followingData);
    } catch (error) {
      console.error('Error loading follow data:', error);
      Alert.alert('Erreur', 'Impossible de charger les données');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const filterUsers = () => {
    const query = searchQuery.toLowerCase().trim();
    
    if (!query) {
      setFilteredFollowers(followers);
      setFilteredFollowing(following);
      return;
    }

    const filterFn = (user: FollowUser) => 
      user.username.toLowerCase().includes(query) ||
      (user.name && user.name.toLowerCase().includes(query));

    setFilteredFollowers(followers.filter(filterFn));
    setFilteredFollowing(following.filter(filterFn));
  };

  const onRefresh = useCallback(() => {
    loadData(true);
  }, [targetUserId]);

  const navigateToProfile = (user: FollowUser) => {
    router.push({
      pathname: '/userProfile',
      params: { userId: user.id.toString() },
    });
  };

  const handleFollowStateChange = (userId: number, isFollowing: boolean) => {
    // Mettre à jour l'état dans les deux listes
    setFollowers(prev => 
      prev.map(user => 
        user.id === userId 
          ? { ...user, isFollowing }
          : user
      )
    );
    
    setFollowing(prev => 
      prev.map(user => 
        user.id === userId 
          ? { ...user, isFollowing }
          : user
      )
    );
  };

  const renderUserItem = ({ item }: { item: FollowUser }) => (
    <TouchableOpacity
      style={styles.userItem}
      onPress={() => navigateToProfile(item)}
      activeOpacity={0.95}
    >
      <View style={styles.userInfo}>
        <View style={styles.avatarContainer}>
          {item.profilePicturePublicId ? (
            <CloudinaryAvatar
              publicId={item.profilePicturePublicId}
              size={54}
              quality="auto"
              format="auto"
              style={styles.avatar}
              fallbackUrl={item.profilePicture}
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>
                {(item.username || 'U')[0].toUpperCase()}
              </Text>
            </View>
          )}
        </View>
        
        <View style={styles.userDetails}>
          <Text style={styles.username} numberOfLines={1}>
            {item.username}
          </Text>
          {item.name && (
            <Text style={styles.name} numberOfLines={1}>
              {item.name}
            </Text>
          )}
        </View>
      </View>
      
      <View style={styles.followButtonContainer}>
        <FollowButton
          targetUserId={item.id}
          initialFollowState={item.isFollowing}
          onFollowStateChange={(isFollowing) => 
            handleFollowStateChange(item.id, isFollowing)
          }
          size="small"
          variant="primary"
          iconOnly={true}
        />
      </View>
    </TouchableOpacity>
  );

  const renderTabButton = (tab: TabType, title: string, count: number) => (
    <TouchableOpacity
      style={[styles.tabButton, activeTab === tab && styles.activeTabButton]}
      onPress={() => setActiveTab(tab)}
    >
      <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
        {title}
      </Text>
      <Text style={[styles.tabCount, activeTab === tab && styles.activeTabCount]}>
        {count}
      </Text>
    </TouchableOpacity>
  );

  const getCurrentData = () => {
    return activeTab === 'followers' ? filteredFollowers : filteredFollowing;
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons
        name={activeTab === 'followers' ? 'people-outline' : 'person-add-outline'}
        size={64}
        color="#9CA3AF"
      />
      <Text style={styles.emptyTitle}>
        {activeTab === 'followers' ? 'Aucun follower' : 'Aucun abonnement'}
      </Text>
      <Text style={styles.emptyDescription}>
        {searchQuery
          ? 'Aucun résultat trouvé pour votre recherche'
          : activeTab === 'followers'
          ? 'Cet utilisateur n\'a pas encore de followers'
          : 'Cet utilisateur ne suit personne pour le moment'}
      </Text>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Abonnements</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        {renderTabButton('followers', 'Followers', followersCount)}
        {renderTabButton('following', 'Abonnements', followingCount)}
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* List */}
      <FlatList
        data={getCurrentData()}
        renderItem={renderUserItem}
        keyExtractor={(item) => `${activeTab}-${item.id}`}
        style={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={
          getCurrentData().length === 0 ? styles.emptyListContainer : undefined
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  headerRight: {
    width: 40,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 8,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  activeTabButton: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    marginRight: 6,
  },
  activeTabText: {
    color: '#111827',
  },
  tabCount: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9CA3AF',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    textAlign: 'center',
  },
  activeTabCount: {
    color: '#3B82F6',
    backgroundColor: '#EBF4FF',
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    paddingVertical: 4,
  },
  list: {
    flex: 1,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    width: 54,
    height: 54,
    borderRadius: 27,
    marginRight: 12,
  },
  avatarPlaceholder: {
    width: 54,
    height: 54,
    borderRadius: 27,
    marginRight: 12,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#111827',
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  name: {
    fontSize: 14,
    color: '#6B7280',
  },
  followButtonContainer: {
    padding: 8,
  },
  emptyListContainer: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default FollowListScreen; 