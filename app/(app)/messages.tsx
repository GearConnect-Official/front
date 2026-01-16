import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import theme from '../src/styles/config/theme';
import { messagesScreenStyles as styles } from '../src/styles/screens';
import chatService, { Conversation, MessageRequest } from '../src/services/chatService';
import { useAuth } from '../src/context/AuthContext';

// Tab types
type TabType = 'messages' | 'requests' | 'commercial';

export default function MessagesScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('messages');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [requests, setRequests] = useState<MessageRequest[]>([]);
  const [commercial, setCommercial] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  const { user } = useAuth() || {};

  const loadConversations = useCallback(async () => {
    try {
      setLoading(true);
      const currentUserId = user?.id ? parseInt(user.id.toString()) : null;
      const response = currentUserId 
        ? await chatService.getConversations(currentUserId)
        : await chatService.getConversations();
      if (response) {
        setConversations(response.conversations || []);
        setRequests(response.requests || []);
        setCommercial(response.commercial || []);
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Load conversations on mount
  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  // Handle refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await loadConversations();
    setRefreshing(false);
  };

  // Navigate to a conversation
  const openConversation = (conversation: Conversation) => {
    router.push({
      pathname: '/(app)/conversation',
      params: { 
        conversationId: conversation.id.toString(),
        conversationName: conversation.isGroup ? conversation.name : getConversationName(conversation)
      }
    });
  };

  // Get conversation name
  const getConversationName = (conversation: Conversation): string => {
    if (conversation.isGroup) {
      return conversation.name || 'Group';
    }
    // For private conversations, find the other participant
    const otherParticipant = conversation.participants.find(
      p => p.user.id !== Number(user?.id)
    );
    return otherParticipant?.user.name || 'User';
  };

  // Get conversation profile image
  const getConversationImage = (conversation: Conversation): string | undefined => {
    if (conversation.isGroup) {
      return undefined; // No image for groups yet
    }
    // For private conversations, find the other participant
    const otherParticipant = conversation.participants.find(
      p => p.user.id !== Number(user?.id)
    );
    return otherParticipant?.user.profilePicture || otherParticipant?.user.profilePicturePublicId;
  };

  // Fonction pour obtenir l'autre participant
  const getOtherParticipant = (conversation: Conversation) => {
    return conversation.participants.find(
      p => p.user.id !== Number(user?.id)
    )?.user;
  };

  // Format date for display
  const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return 'Today';
    } else if (diffDays === 2) {
      return 'Yesterday';
    } else if (diffDays <= 7) {
      return `${diffDays - 1} days ago`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  // Accept a message request
  const handleAcceptRequest = async (request: MessageRequest) => {
    try {
      const currentUserId = user?.id ? parseInt(user.id.toString()) : undefined;
      const conversation = await chatService.acceptRequest(request.id, currentUserId);
      await loadConversations();
      // Navigate to created conversation
      if (conversation) {
        router.push({
          pathname: '/(app)/conversation',
          params: {
            conversationId: conversation.id.toString(),
            conversationName: request.from.name,
          },
        });
      }
    } catch (error: any) {
      console.error('Error accepting request:', error);
      Alert.alert('Error', error.response?.data?.error || 'Unable to accept request');
    }
  };

  // Reject a message request
  const handleRejectRequest = async (request: MessageRequest) => {
    try {
      const currentUserId = user?.id ? parseInt(user.id.toString()) : undefined;
      await chatService.rejectRequest(request.id, currentUserId);
      await loadConversations();
    } catch (error: any) {
      console.error('Error rejecting request:', error);
      Alert.alert('Error', error.response?.data?.error || 'Unable to reject request');
    }
  };

  // Render conversation item
  const renderConversationItem = ({ item }: { item: Conversation }) => {
    const lastMessage = item.messages[0];
    const conversationName = getConversationName(item);
    const conversationImage = getConversationImage(item);
    const otherParticipant = getOtherParticipant(item);

    return (
      <TouchableOpacity
        style={styles.conversationItem}
        onPress={() => openConversation(item)}
        activeOpacity={0.7}
      >
        <View style={styles.avatarContainer}>
          {conversationImage ? (
            <Image source={{ uri: conversationImage }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.defaultAvatar]}>
              <FontAwesome 
                name={item.isGroup ? "users" : "user"} 
                size={24} 
                color={theme.colors.text.secondary} 
              />
            </View>
          )}
          {item.isGroup && (
            <View style={styles.groupIndicator}>
              <FontAwesome name="users" size={12} color="white" />
            </View>
          )}
          {item.isCommercial && (
            <View style={styles.commercialIndicator}>
              <FontAwesome name="briefcase" size={12} color="white" />
            </View>
          )}
        </View>

        <View style={styles.conversationInfo}>
          <View style={styles.conversationHeader}>
            <Text style={styles.conversationName} numberOfLines={1}>
              {conversationName}
              {!item.isGroup && otherParticipant?.isVerify && (
                <>
                  <Text> </Text>
                  <FontAwesome name="check-circle" size={14} color="#E10600" />
                </>
              )}
            </Text>
            <Text style={styles.messageTime}>
              {formatTime(item.updatedAt)}
            </Text>
          </View>

          <View style={styles.messagePreview}>
            <Text style={styles.lastMessage} numberOfLines={2}>
              {lastMessage ? 
                (item.isGroup ? `${lastMessage.sender.name}: ${lastMessage.content}` : lastMessage.content)
                : 'No messages'
              }
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // Render request item
  const renderRequestItem = ({ item }: { item: MessageRequest }) => {
    return (
      <View style={styles.requestItem}>
        <View style={styles.avatarContainer}>
          {item.from.profilePicture ? (
            <Image source={{ uri: item.from.profilePicture }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.defaultAvatar]}>
              <FontAwesome name="user" size={24} color={theme.colors.text.secondary} />
            </View>
          )}
        </View>

        <View style={styles.conversationInfo}>
          <View style={styles.conversationHeader}>
            <Text style={styles.conversationName} numberOfLines={1}>
              {item.from.name}
              {item.from.isVerify && (
                <>
                  <Text> </Text>
                  <FontAwesome name="check-circle" size={14} color="#E10600" />
                </>
              )}
            </Text>
            <Text style={styles.messageTime}>
              {formatTime(item.createdAt)}
            </Text>
          </View>

          {item.message && (
            <View style={styles.messagePreview}>
              <Text style={styles.lastMessage} numberOfLines={2}>
                {item.message}
              </Text>
            </View>
          )}

          <View style={styles.requestActions}>
            <TouchableOpacity
              style={[styles.requestButton, styles.acceptButton]}
              onPress={() => handleAcceptRequest(item)}
            >
              <Text style={styles.acceptButtonText}>Accepter</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.requestButton, styles.rejectButton]}
              onPress={() => handleRejectRequest(item)}
            >
              <Text style={styles.rejectButtonText}>Rejeter</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  // Start a new conversation
  const startNewConversation = () => {
    router.push('/(app)/newConversation');
  };

  // Navigate to groups
  const navigateToGroups = () => {
    router.push('/(app)/groups');
  };

  // Get data based on active tab
  const getCurrentData = () => {
    switch (activeTab) {
      case 'messages':
        return conversations;
      case 'requests':
        return requests;
      case 'commercial':
        return commercial;
      default:
        return [];
    }
  };

  // Get pending requests count
  const pendingRequestsCount = requests.filter(r => r.status === 'pending').length;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <FontAwesome name="arrow-left" size={20} color="#6A707C" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chats</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.groupsButton}
            onPress={navigateToGroups}
          >
            <FontAwesome name="users" size={20} color="#E10600" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.newMessageButton}
            onPress={startNewConversation}
          >
            <FontAwesome name="edit" size={20} color="#E10600" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Onglets */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'messages' && styles.activeTab]}
          onPress={() => setActiveTab('messages')}
        >
          <Text style={[styles.tabText, activeTab === 'messages' && styles.activeTabText]}>
            Chats
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'requests' && styles.activeTab]}
          onPress={() => setActiveTab('requests')}
        >
          <Text style={[styles.tabText, activeTab === 'requests' && styles.activeTabText]}>
            Requests
          </Text>
          {pendingRequestsCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {pendingRequestsCount > 9 ? '9+' : pendingRequestsCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'commercial' && styles.activeTab]}
          onPress={() => setActiveTab('commercial')}
        >
          <Text style={[styles.tabText, activeTab === 'commercial' && styles.activeTabText]}>
            Commercial
          </Text>
        </TouchableOpacity>
      </View>

      {/* List based on active tab */}
      {activeTab === 'requests' ? (
        <FlatList
          data={requests.filter(r => r.status === 'pending')}
          renderItem={renderRequestItem}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <FontAwesome name="inbox" size={40} color={theme.colors.text.secondary} />
              <Text style={styles.emptyText}>No pending requests</Text>
            </View>
          }
        />
      ) : (
        <FlatList
          data={getCurrentData() as Conversation[]}
          renderItem={renderConversationItem}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <FontAwesome 
                name={activeTab === 'commercial' ? "briefcase" : "comments"} 
                size={40} 
                color={theme.colors.text.secondary} 
              />
              <Text style={styles.emptyText}>
                {activeTab === 'commercial' 
                  ? 'No commercial conversations' 
                  : 'No conversations'}
              </Text>
            </View>
          }
        />
      )}

      {/* Loading state */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#E10600" />
        </View>
      )}
    </View>
  );
} 