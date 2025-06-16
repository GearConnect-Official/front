import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import FollowButton from '../components/FollowButton';
import followService from '../services/followService';
import { CloudinaryAvatar } from '../components/media/CloudinaryImage';
import { useAuth } from '../context/AuthContext';

// Type pour les résultats de recherche (adapté à la réponse API)
interface SearchUser {
  id: number;
  username: string;
  name?: string;
  profilePicture?: string;
  profilePicturePublicId?: string;
  isVerify: boolean;
  isFollowing?: boolean;
}

const UserSearchScreen: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth() || {}; // Récupérer l'utilisateur connecté
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
  const [pagination, setPagination] = useState({
    totalCount: 0,
    currentPage: 1,
    totalPages: 0,
    hasMore: false,
  });

  const searchUsers = async (query: string, page: number = 1) => {
    if (!query.trim() || query.trim().length < 2) {
      setSearchResults([]);
      setHasSearched(false);
      setPagination({ totalCount: 0, currentPage: 1, totalPages: 0, hasMore: false });
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    try {
      const response = await followService.searchUsers(query.trim(), 20, page);
      
      if (response.success && response.data) {
        // Filtrer l'utilisateur connecté des résultats
        const filteredUsers = user && user.id 
          ? response.data.users.filter(searchUser => searchUser.id !== Number(user.id))
          : response.data.users;

        let usersWithFollowState = filteredUsers.map(user => ({
          ...user,
          isFollowing: false, // Valeur par défaut
        }));

        // Vérifier l'état de follow réel si l'utilisateur est connecté
        if (user && user.id && filteredUsers.length > 0) {
          const currentUserId = Number(user.id);
          const userIds = filteredUsers.map(u => u.id);
          
          try {
            const followStatusResponse = await followService.checkFollowingStatus(userIds, currentUserId);
            if (followStatusResponse.success && followStatusResponse.data) {
              const followedUserIds = followStatusResponse.data;
              
              // Mettre à jour l'état de follow pour chaque utilisateur
              usersWithFollowState = usersWithFollowState.map(user => ({
                ...user,
                isFollowing: followedUserIds.includes(user.id),
              }));
            }
          } catch (error) {
            console.warn('Could not check follow status:', error);
          }
        }
        
        if (page === 1) {
          setSearchResults(usersWithFollowState);
        } else {
          setSearchResults(prev => [...prev, ...usersWithFollowState]);
        }
        
        setPagination(response.data.pagination);
      } else {
        if (page === 1) {
          setSearchResults([]);
          setPagination({ totalCount: 0, currentPage: 1, totalPages: 0, hasMore: false });
        }
        console.error('Search failed:', response.error);
      }
      
    } catch (error) {
      console.error('Error searching users:', error);
      if (page === 1) {
        setSearchResults([]);
        setPagination({ totalCount: 0, currentPage: 1, totalPages: 0, hasMore: false });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchInputChange = (text: string) => {
    setSearchQuery(text);
    
    // Clear existing timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    // Set new timeout for debouncing
    const timeout = setTimeout(() => {
      searchUsers(text, 1);
    }, 500);
    
    setSearchTimeout(timeout);
  };

  const loadMoreResults = () => {
    if (!isLoading && pagination.hasMore) {
      searchUsers(searchQuery, pagination.currentPage + 1);
    }
  };

  const navigateToProfile = (user: SearchUser) => {
    router.push({
      pathname: '/userProfile',
      params: { userId: user.id.toString() },
    });
  };

  const handleFollowStateChange = (userId: number, isFollowing: boolean) => {
    setSearchResults(prev => 
      prev.map(user => 
        user.id === userId 
          ? { ...user, isFollowing }
          : user
      )
    );
  };

  const renderUserItem = ({ item }: { item: SearchUser }) => (
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
                {(item.username || item.name || 'U')[0].toUpperCase()}
              </Text>
            </View>
          )}
          {item.isVerify && (
            <View style={styles.verifyBadge}>
              <Ionicons name="checkmark" size={12} color="#FFFFFF" />
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

  const renderEmptyState = () => {
    if (!hasSearched) {
      return (
        <View style={styles.emptyState}>
          <Ionicons name="search-outline" size={64} color="#9CA3AF" />
          <Text style={styles.emptyTitle}>Rechercher des utilisateurs</Text>
          <Text style={styles.emptyDescription}>
            Tapez un nom d'utilisateur ou un nom pour commencer la recherche
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.emptyState}>
        <Ionicons name="person-outline" size={64} color="#9CA3AF" />
        <Text style={styles.emptyTitle}>Aucun résultat</Text>
        <Text style={styles.emptyDescription}>
          Aucun utilisateur trouvé pour "{searchQuery}"
        </Text>
      </View>
    );
  };

  const renderFooter = () => {
    if (!pagination.hasMore) return null;
    
    return (
      <View style={styles.footerContainer}>
        {isLoading ? (
          <ActivityIndicator size="small" color="#3B82F6" />
        ) : (
          <TouchableOpacity style={styles.loadMoreButton} onPress={loadMoreResults}>
            <Text style={styles.loadMoreText}>Charger plus</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Rechercher</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher des utilisateurs..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={handleSearchInputChange}
            autoCapitalize="none"
            autoFocus
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => {
              setSearchQuery('');
              setSearchResults([]);
              setHasSearched(false);
              setPagination({ totalCount: 0, currentPage: 1, totalPages: 0, hasMore: false });
              if (searchTimeout) {
                clearTimeout(searchTimeout);
              }
            }}>
              <Ionicons name="close-circle" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Results Info */}
      {hasSearched && !isLoading && (
        <View style={styles.resultsInfo}>
          <Text style={styles.resultsText}>
            {pagination.totalCount} résultat{pagination.totalCount > 1 ? 's' : ''} trouvé{pagination.totalCount > 1 ? 's' : ''}
          </Text>
        </View>
      )}

      {/* Loading State */}
      {isLoading && searchResults.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Recherche en cours...</Text>
        </View>
      ) : (
        /* Results List */
        <FlatList
          data={searchResults}
          renderItem={renderUserItem}
          keyExtractor={(item) => item.id.toString()}
          style={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyState}
          ListFooterComponent={renderFooter}
          onEndReached={loadMoreResults}
          onEndReachedThreshold={0.5}
          contentContainerStyle={
            searchResults.length === 0 ? styles.emptyListContainer : styles.listContainer
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
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
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
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
  resultsInfo: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
  },
  resultsText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  list: {
    flex: 1,
  },
  listContainer: {
    paddingTop: 8,
    paddingBottom: 24,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    marginRight: 16,
    borderWidth: 2,
    borderColor: '#F3F4F6',
  },
  avatarPlaceholder: {
    width: 54,
    height: 54,
    borderRadius: 27,
    marginRight: 16,
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#6B7280',
  },
  verifyBadge: {
    position: 'absolute',
    top: -2,
    right: 12,
    backgroundColor: '#10B981',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  userDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  username: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  name: {
    fontSize: 15,
    color: '#6B7280',
    fontWeight: '500',
  },
  followButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerContainer: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  loadMoreButton: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  loadMoreText: {
    color: '#374151',
    fontSize: 15,
    fontWeight: '600',
  },
  emptyListContainer: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 48,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginTop: 20,
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '500',
  },
});

export default UserSearchScreen; 