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
        const usersWithFollowState = response.data.users.map(user => ({
          ...user,
          isFollowing: false, // TODO: Déterminer l'état de follow réel
        }));
        
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
      activeOpacity={0.7}
    >
      <View style={styles.userInfo}>
        {item.profilePicturePublicId ? (
          <CloudinaryAvatar
            publicId={item.profilePicturePublicId}
            size={48}
            quality="auto"
            format="auto"
            style={styles.avatar}
            fallbackUrl={item.profilePicture}
          />
        ) : (
          <Image
            source={{
              uri: item.profilePicture || 'https://via.placeholder.com/48x48/CCCCCC/FFFFFF?text=U',
            }}
            style={styles.avatar}
          />
        )}
        <View style={styles.userDetails}>
          <View style={styles.userNameContainer}>
            <Text style={styles.username}>{item.username}</Text>
            {item.isVerify && (
              <Ionicons name="checkmark-circle" size={16} color="#3B82F6" style={styles.verifyIcon} />
            )}
          </View>
          {item.name && <Text style={styles.name}>{item.name}</Text>}
        </View>
      </View>
      <FollowButton
        targetUserId={item.id}
        initialFollowState={item.isFollowing}
        onFollowStateChange={(isFollowing) => 
          handleFollowStateChange(item.id, isFollowing)
        }
        size="small"
        variant="outline"
      />
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
    backgroundColor: '#FFFFFF',
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
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
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
  resultsInfo: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  resultsText: {
    fontSize: 14,
    color: '#6B7280',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
  list: {
    flex: 1,
  },
  listContainer: {
    paddingBottom: 20,
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
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  userNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  verifyIcon: {
    marginLeft: 4,
  },
  name: {
    fontSize: 14,
    color: '#6B7280',
  },
  footerContainer: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  loadMoreButton: {
    paddingHorizontal: 24,
    paddingVertical: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
  },
  loadMoreText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '500',
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

export default UserSearchScreen; 