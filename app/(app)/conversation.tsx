import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import theme from '../src/styles/config/theme';
import { conversationScreenStyles as styles } from '../src/styles/screens';
import chatService, { Message as ApiMessage } from '../src/services/chatService';
import { useAuth } from '../src/context/AuthContext';

// Extended Message type with isOwn property for UI
type Message = ApiMessage & {
  isOwn?: boolean;
};

type UserStatus = 'Online' | 'Offline' | 'Do not disturb';

export default function ConversationScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [userStatus, setUserStatus] = useState<UserStatus>('Online'); // TODO: Fetch from API
  const flatListRef = useRef<FlatList>(null);
  const router = useRouter();
  const params = useLocalSearchParams();
  const { user } = useAuth() || {};
  
  const conversationId = params.conversationId as string;
  const conversationName = params.conversationName as string || 'Conversation';
  const currentUserId = user?.id ? parseInt(user.id.toString()) : undefined;

  // Get status color
  const getStatusColor = (status: UserStatus): string => {
    switch (status) {
      case 'Online':
        return '#25D366'; // WhatsApp green
      case 'Offline':
        return '#E10600'; // App red
      case 'Do not disturb':
        return '#FF9500'; // Orange
      default:
        return theme.colors.text.secondary;
    }
  };

  // Get status text
  const getStatusText = (status: UserStatus): string => {
    switch (status) {
      case 'Online':
        return 'Online';
      case 'Offline':
        return 'Offline';
      case 'Do not disturb':
        return 'Do not disturb';
      default:
        return 'Online';
    }
  };

  // Load messages from API
  const loadMessages = useCallback(async () => {
    if (!conversationId || !currentUserId) return;
    
    try {
      setLoading(true);
      const conversationIdNum = parseInt(conversationId);
      if (isNaN(conversationIdNum)) {
        Alert.alert('Error', 'Invalid conversation ID');
        return;
      }
      
      const response = await chatService.getMessages(conversationIdNum, currentUserId);
      // Backend returns array of messages directly
      if (response && Array.isArray(response)) {
        // Map API messages to UI format
        // isOwn = true if the message sender is the current logged-in user
        const formattedMessages: Message[] = response.map((msg: ApiMessage) => {
          const isOwnMessage = msg.sender.id === currentUserId;
          return {
            ...msg,
            isOwn: isOwnMessage,
          };
        });
        setMessages(formattedMessages);
      } else if (response && Array.isArray(response.messages)) {
        // Fallback if response is wrapped in an object
        const formattedMessages: Message[] = response.messages.map((msg: ApiMessage) => {
          const isOwnMessage = msg.sender.id === currentUserId;
          return {
            ...msg,
            isOwn: isOwnMessage,
          };
        });
        setMessages(formattedMessages);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
      Alert.alert('Error', 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  }, [conversationId, currentUserId]);

  // Load messages on mount and when conversationId or currentUserId changes
  useEffect(() => {
    if (conversationId && currentUserId) {
      loadMessages();
    }
  }, [conversationId, currentUserId, loadMessages]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  // Send a message
  const sendMessage = async () => {
    if (!newMessage.trim() || !conversationId || !currentUserId) return;

    const messageContent = newMessage.trim();
    const conversationIdNum = parseInt(conversationId);
    
    if (isNaN(conversationIdNum)) {
      Alert.alert('Error', 'Invalid conversation ID');
      return;
    }

    setSending(true);
    try {
      const sentMessage = await chatService.sendMessage(
        conversationIdNum,
        messageContent,
        currentUserId
      );
      
      if (sentMessage) {
        // Add sent message to list - always mark as own since current user sent it
        const newMsg: Message = {
          ...sentMessage,
          isOwn: sentMessage.sender.id === currentUserId,
        };
        setMessages(prev => [...prev, newMsg]);
        setNewMessage('');
      }
    } catch (error: any) {
      console.error('Error sending message:', error);
      Alert.alert('Error', error.response?.data?.error || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  // Format time for display
  const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true
    });
  };

  // Render a message
  const renderMessage = ({ item, index }: { item: Message; index: number }) => {
    const isOwn = item.isOwn ?? false;
    const previousMessage = index > 0 ? messages[index - 1] : null;
    
    // Show avatar logic: for own messages (left side) and other messages (right side)
    const showAvatar = isOwn 
      ? (index === 0 || 
         previousMessage?.sender?.id !== item.sender?.id ||
         (previousMessage && (new Date(item.createdAt).getTime() - new Date(previousMessage.createdAt).getTime()) > 300000))
      : (index === 0 || 
         previousMessage?.sender?.id !== item.sender?.id ||
         (previousMessage && (new Date(item.createdAt).getTime() - new Date(previousMessage.createdAt).getTime()) > 300000));
    
    // Group messages: same user, less than 5 minutes apart
    const isGrouped = previousMessage?.sender?.id === item.sender?.id &&
                     (new Date(item.createdAt).getTime() - new Date(previousMessage.createdAt).getTime()) < 300000;
    
    // Add margin top if it's a new group
    const isNewGroup = !isGrouped;

    return (
      <View style={[
        styles.messageContainer, 
        isOwn ? styles.ownMessageContainer : styles.otherMessageContainer,
        isNewGroup && styles.newMessageGroup
      ]}>
        {/* Avatar for own messages (left side) */}
        {isOwn && (
          <>
            {showAvatar ? (
              <TouchableOpacity 
                style={styles.ownAvatarContainer}
                onPress={() => {
                  if (item.sender?.id) {
                    router.push({
                      pathname: '/userProfile',
                      params: { userId: item.sender.id.toString() },
                    });
                  }
                }}
                activeOpacity={0.7}
              >
                {item.sender?.profilePicture || item.sender?.profilePicturePublicId ? (
                  <Image 
                    source={{ uri: item.sender.profilePicture || item.sender.profilePicturePublicId }} 
                    style={styles.messageAvatar} 
                  />
                ) : (
                  <View style={[styles.messageAvatar, styles.defaultMessageAvatar]}>
                    <FontAwesome name="user" size={16} color="#999" />
                  </View>
                )}
              </TouchableOpacity>
            ) : (
              <TouchableOpacity 
                style={styles.ownAvatarSpacer}
                onPress={() => {
                  if (item.sender?.id) {
                    router.push({
                      pathname: '/userProfile',
                      params: { userId: item.sender.id.toString() },
                    });
                  }
                }}
                activeOpacity={0.7}
              >
                {/* Invisible spacer that's still clickable */}
              </TouchableOpacity>
            )}
          </>
        )}
        
        {/* Message */}
        <View style={[
          styles.messageBubble, 
          isOwn ? styles.ownMessageBubble : styles.otherMessageBubble,
          isGrouped && styles.groupedMessage
        ]}>
          {/* Show sender name for ALL messages (including own) for clarity */}
          <Text style={[styles.senderName, isOwn && styles.ownSenderName]}>
            {item.sender?.name || item.sender?.username || 'Unknown User'}
          </Text>
          <Text style={[styles.messageText, isOwn && styles.ownMessageText]}>
            {item.content}
          </Text>
          {/* Timestamp inside bubble */}
          <View style={styles.messageTimeContainer}>
            <Text style={[styles.messageTime, isOwn && styles.ownMessageTime]}>
              {formatTime(item.createdAt)}
            </Text>
          </View>
        </View>

        {/* Avatar for other users' messages (right side) */}
        {!isOwn && (
          <>
            {showAvatar ? (
              <TouchableOpacity 
                style={styles.otherAvatarContainer}
                onPress={() => {
                  if (item.sender?.id) {
                    router.push({
                      pathname: '/userProfile',
                      params: { userId: item.sender.id.toString() },
                    });
                  }
                }}
                activeOpacity={0.7}
              >
                {item.sender?.profilePicture || item.sender?.profilePicturePublicId ? (
                  <Image 
                    source={{ uri: item.sender.profilePicture || item.sender.profilePicturePublicId }} 
                    style={styles.messageAvatar} 
                  />
                ) : (
                  <View style={[styles.messageAvatar, styles.defaultMessageAvatar]}>
                    <FontAwesome name="user" size={16} color="#999" />
                  </View>
                )}
              </TouchableOpacity>
            ) : (
              <TouchableOpacity 
                style={styles.otherAvatarSpacer}
                onPress={() => {
                  if (item.sender?.id) {
                    router.push({
                      pathname: '/userProfile',
                      params: { userId: item.sender.id.toString() },
                    });
                  }
                }}
                activeOpacity={0.7}
              >
                {/* Invisible spacer that's still clickable */}
              </TouchableOpacity>
            )}
          </>
        )}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <FontAwesome name="arrow-left" size={20} color={theme.colors.text.primary} />
        </TouchableOpacity>
        
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {conversationName}
          </Text>
          <Text style={[styles.headerSubtitle, { color: getStatusColor(userStatus) }]}>
            {getStatusText(userStatus)}
          </Text>
        </View>

        <View style={styles.headerActions}>
          {/* Video call button */}
          <TouchableOpacity 
            style={styles.headerActionButton}
            onPress={() => {
              // TODO: Implement video call
              console.log('Video call pressed');
            }}
            activeOpacity={0.7}
          >
            <FontAwesome name="video-camera" size={20} color={theme.colors.text.secondary} />
          </TouchableOpacity>

          {/* Voice call button */}
          <TouchableOpacity 
            style={styles.headerActionButton}
            onPress={() => {
              // TODO: Implement voice call
              console.log('Voice call pressed');
            }}
            activeOpacity={0.7}
          >
            <FontAwesome name="phone" size={18} color={theme.colors.text.secondary} />
          </TouchableOpacity>

          {/* More options button */}
          <TouchableOpacity 
            style={styles.headerActionButton}
            onPress={() => {
              // TODO: Show more options menu
              console.log('More options pressed');
            }}
            activeOpacity={0.7}
          >
            <FontAwesome name="ellipsis-v" size={16} color={theme.colors.text.secondary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Messages list */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#E10600" />
          <Text style={styles.loadingText}>Loading messages...</Text>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.messagesContainer}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <FontAwesome name="comment" size={40} color={theme.colors.text.secondary} />
              <Text style={styles.emptyStateText}>No messages yet. Start the conversation!</Text>
            </View>
          }
        />
      )}

      {/* Input area */}
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          {/* Attach button (like WhatsApp) */}
          <TouchableOpacity 
            style={styles.attachButton}
            onPress={() => {
              // TODO: Implement attach functionality (images, files, etc.)
              console.log('Attach button pressed');
            }}
            activeOpacity={0.7}
          >
            <FontAwesome name="plus" size={20} color={theme.colors.text.secondary} />
          </TouchableOpacity>
          
          <TextInput
            style={styles.textInput}
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Type your message..."
            placeholderTextColor={theme.colors.text.secondary}
            multiline
            maxLength={500}
          />
          
          {/* Send button or microphone button (like WhatsApp) */}
          {newMessage.trim() ? (
            <TouchableOpacity
              style={[styles.sendButton, styles.sendButtonActive]}
              onPress={sendMessage}
              disabled={sending || loading}
              activeOpacity={0.7}
            >
              {sending ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <FontAwesome 
                  name="send" 
                  size={16} 
                  color="white" 
                />
              )}
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.microphoneButton}
              onPress={() => {
                // TODO: Implement voice message recording
                console.log('Microphone pressed - start recording');
              }}
              activeOpacity={0.7}
            >
              <FontAwesome 
                name="microphone" 
                size={18} 
                color={theme.colors.text.secondary} 
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
} 