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
  Pressable,
  Keyboard,
  Modal,
  Dimensions,
  Animated,
  ScrollView,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import theme from '../src/styles/config/theme';
import { conversationScreenStyles as styles } from '../src/styles/screens';
import chatService, { Message as ApiMessage } from '../src/services/chatService';
import { useAuth } from '../src/context/AuthContext';
import { VerifiedAvatar } from '../src/components/media/VerifiedAvatar';
import AttachmentMenu, { SelectedMedia } from '../src/components/messaging/AttachmentMenu';
import VoiceRecorder from '../src/components/messaging/VoiceRecorder';
import AudioMessagePlayer from '../src/components/messaging/AudioMessagePlayer';
import MediaCarousel from '../src/components/messaging/MediaCarousel';
import ContactCard, { ContactData } from '../src/components/messaging/ContactCard';
import PollCard, { PollWithVotes } from '../src/components/messaging/PollCard';
import PollCreator, { PollData } from '../src/components/messaging/PollCreator';

// Extended Message type with isOwn property for UI
type Message = ApiMessage & {
  isOwn?: boolean;
};

type UserStatus = 'Online' | 'Offline' | 'Do not disturb';

const { width } = Dimensions.get('window');

export default function ConversationScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [highlightedMessageId, setHighlightedMessageId] = useState<number | null>(null);
  const [userStatus] = useState<UserStatus>('Online'); // TODO: Fetch from API (setUserStatus reserved for future API integration)
  const [showCallMenu, setShowCallMenu] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [audioDurations, setAudioDurations] = useState<{ [key: number]: number }>({});
  const [audioPositions, setAudioPositions] = useState<{ [key: number]: number }>({});
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(false);
  const [hasScrolledInitially, setHasScrolledInitially] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [showMessageOptions, setShowMessageOptions] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  const [editingPoll, setEditingPoll] = useState<PollData | null>(null);
  const [showPollCreator, setShowPollCreator] = useState(false);
  const [messagePosition, setMessagePosition] = useState<{ x: number; y: number; width: number; height: number } | undefined>(undefined);
  const flatListRef = useRef<FlatList>(null);
  const messageRefs = useRef<{ [key: number]: View | null }>({});
  const messageAnimations = useRef<{ [key: number]: Animated.Value }>({});
  const router = useRouter();
  const params = useLocalSearchParams();
  const { user } = useAuth() || {};
  
  const conversationId = params.conversationId as string;
  const conversationName = params.conversationName as string || 'Conversation';
  const currentUserId = user?.id ? parseInt(user.id.toString()) : undefined;

  // All emojis for picker (simplified - showing most common ones)
  const allEmojis = [
    '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙',
    '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥',
    '😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '🥵', '🥶', '😵', '🤯', '🤠', '🥳', '😎', '🤓', '🧐',
    '👋', '🤚', '🖐', '✋', '🖖', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👍',
    '👎', '✊', '👊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✍️', '💪', '🦾', '🦿', '🦵', '🦶', '👂', '🦻', '👃',
    '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟',
    '🔥', '💯', '✨', '⭐', '🌟', '💫', '⚡', '☄️', '💥', '💢', '💨', '💦', '💤', '🎉', '🎊', '🏆', '🥇', '🥈', '🥉', '🏅',
    '🎖', '🎗', '🎫', '🎟', '🎪', '🤹', '🎭', '🩹', '🎨', '🎬', '🎤', '🎧', '🎼', '🎹', '🥁', '🎷', '🎺', '🎸', '🪕', '🎻',
    '🎲', '♟️', '🎯', '🎳', '🎮', '🎰', '🧩',
    '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐽', '🐸', '🐵', '🙈', '🙉', '🙊', '🐒',
    '🐔', '🐧', '🐦', '🐤', '🐣', '🐥', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐞',
    '🐜', '🦟', '🦗', '🕷', '🦂', '🐢', '🐍', '🦎', '🦖', '🦕', '🐙', '🦑', '🦐', '🦞', '🦀', '🐡', '🐠', '🐟', '🐬', '🐳',
    '🐋', '🦈', '🐊', '🐅', '🐆', '🦓', '🦍', '🦧', '🐘', '🦛', '🦏', '🐪', '🐫', '🦒', '🦘', '🦬', '🐃', '🐂', '🐄', '🐎',
    '🍏', '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦',
    '🥬', '🥒', '🌶', '🌽', '🥕', '🥔', '🍠', '🥐', '🥯', '🍞', '🥖', '🥨', '🧀', '🥚', '🍳', '🥞', '🥓', '🥩', '🍗', '🍖',
    '🦴', '🌭', '🍔', '🍟', '🍕', '🥪', '🥙', '🌮', '🌯', '🥗', '🥘', '🥫', '🍝', '🍜', '🍲', '🍛', '🍣', '🍱', '🥟', '🦪',
    '🍤', '🍙', '🍚', '🍘', '🍥', '🥠', '🥮', '🍢', '🍡', '🍧', '🍨', '🍦', '🥧', '🧁', '🍰', '🎂', '🍮', '🍭', '🍬', '🍫',
    '🍿', '🍩', '🍪', '🌰', '🥜', '🍯', '🥛', '🍼', '🫖', '☕️', '🍵', '🧃', '🥤', '🧋', '🍶', '🍺', '🍻', '🥂', '🍷', '🥃',
  ];

  // Get status color
  const getStatusColor = (status: UserStatus): string => {
    switch (status) {
      case 'Online':
        return '#25D366'; // Green color for online status
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

  // Scroll to bottom when new messages arrive (only if already at bottom)
  useEffect(() => {
    if (messages.length > 0 && flatListRef.current && isScrolledToBottom) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages, isScrolledToBottom]);

  // Scroll to selected message when options modal opens
  useEffect(() => {
    if (showMessageOptions && selectedMessage) {
      const messageIndex = messages.findIndex(msg => msg.id === selectedMessage.id);
      if (messageIndex !== -1) {
        setTimeout(() => {
          flatListRef.current?.scrollToIndex({
            index: messageIndex,
            animated: true,
            viewPosition: 0.5, // Center the message
          });
        }, 100);
      }
    }
  }, [showMessageOptions, selectedMessage?.id, messages]);
  
  // Initial scroll to bottom on mount and when messages are loaded
  useEffect(() => {
    if (messages.length > 0 && flatListRef.current && !loading && !hasScrolledInitially) {
      // Use a longer timeout to ensure FlatList is fully rendered
      const timeoutId = setTimeout(() => {
        if (flatListRef.current) {
          flatListRef.current.scrollToEnd({ animated: false });
          setIsScrolledToBottom(true);
          setHasScrolledInitially(true);
        }
      }, 500);
      
      return () => clearTimeout(timeoutId);
    }
  }, [messages, loading, hasScrolledInitially]);

  // Scroll to selected message when options modal opens
  useEffect(() => {
    if (showMessageOptions && selectedMessage) {
      const messageIndex = messages.findIndex(msg => msg.id === selectedMessage.id);
      if (messageIndex !== -1) {
        setTimeout(() => {
          flatListRef.current?.scrollToIndex({
            index: messageIndex,
            animated: true,
            viewPosition: 0.3, // Position message in upper part to show reactions bar
          });
        }, 100);
      }
    } else if (!showMessageOptions && selectedMessage) {
      // Reset animation when modal closes
      const anim = messageAnimations.current[selectedMessage.id];
      if (anim) {
        Animated.spring(anim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }).start();
      }
    }
  }, [showMessageOptions, selectedMessage, messages]);

  // Scroll to bottom handler
  const scrollToBottom = useCallback(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
      setIsScrolledToBottom(true);
    }
  }, []);

  // Handle scroll events to detect if user is at bottom
  const handleScroll = useCallback((event: any) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const paddingToBottom = 150; // Threshold in pixels (increased for better detection)
    
    // Calculate if we're at bottom
    const scrollPosition = contentOffset.y + layoutMeasurement.height;
    const contentHeight = contentSize.height;
    const isAtBottom = scrollPosition >= contentHeight - paddingToBottom || contentHeight <= layoutMeasurement.height;
    
    setIsScrolledToBottom(isAtBottom);
  }, []);

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
      // If editing a message, update it instead of creating a new one
      if (editingMessage) {
        try {
          const updatedMessage = await chatService.updateMessage(
            editingMessage.id,
            messageContent,
            currentUserId
          );
          // Update local state with the updated message
          setMessages(prev => prev.map(msg => 
            msg.id === editingMessage.id 
              ? { 
                  ...updatedMessage, 
                  isOwn: updatedMessage.sender.id === currentUserId,
                  isEdited: true 
                }
              : msg
          ));
          setNewMessage('');
          setEditingMessage(null);
          setSelectedMessage(null);
          setShowMessageOptions(false);
          setShowEmojiPicker(false);
        } catch (error: any) {
          console.error('Error updating message:', error);
          Alert.alert('Error', error.response?.data?.error || 'Failed to update message');
        }
      } else {
        // Send new message
        const sentMessage = await chatService.sendMessage(
          conversationIdNum,
          messageContent,
          currentUserId,
          'TEXT',
          replyingTo?.id
        );
      
        if (sentMessage) {
          // Add sent message to list - always mark as own since current user sent it
          const newMsg: Message = {
            ...sentMessage,
            isOwn: sentMessage.sender.id === currentUserId,
          };
          setMessages(prev => [...prev, newMsg]);
          setNewMessage('');
          setReplyingTo(null); // Clear reply after sending
        }
      }
    } catch (error: any) {
      console.error('Error sending message:', error);
      Alert.alert('Error', error.response?.data?.error || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  // Handle long press on message to show options
  const handleLongPressMessage = (message: Message, event?: any) => {
    setSelectedMessage(message);
    
    // Initialize animation for this message if not exists
    if (!messageAnimations.current[message.id]) {
      messageAnimations.current[message.id] = new Animated.Value(1);
    }
    
    // Animate message bubble to scale up and highlight
    Animated.sequence([
      Animated.spring(messageAnimations.current[message.id], {
        toValue: 1.05,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
      Animated.spring(messageAnimations.current[message.id], {
        toValue: 1.02,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
    ]).start();
    
    // Get message position for menu placement
    if (event?.nativeEvent) {
      const { pageX, pageY } = event.nativeEvent;
      // Try to get message dimensions from ref
      const messageRef = messageRefs.current[message.id];
      if (messageRef) {
        messageRef.measure((x, y, width, height, pageX, pageY) => {
          setMessagePosition({ x: pageX, y: pageY, width, height });
          setShowMessageOptions(true);
        });
      } else {
        // Fallback: estimate position
        setMessagePosition({ x: pageX, y: pageY, width: 200, height: 50 });
        setShowMessageOptions(true);
      }
    } else {
      setShowMessageOptions(true);
    }
  };

  // Handle reply option
  const handleReply = () => {
    if (selectedMessage) {
      setReplyingTo(selectedMessage);
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
        setIsScrolledToBottom(true);
      }, 100);
    }
  };

  // Handle edit option
  const handleEditMessage = () => {
    if (selectedMessage) {
      setEditingMessage(selectedMessage);
      if (selectedMessage.content.startsWith('POLL:')) {
        // Handle poll editing
        try {
          const pollJson = selectedMessage.content.replace('POLL:', '');
          const pollData: PollData = JSON.parse(pollJson);
          setEditingPoll(pollData);
          setShowPollCreator(true);
        } catch (e) {
          console.error('Error parsing poll for edit:', e);
        }
      } else {
        // Handle text message editing
        setNewMessage(selectedMessage.content);
        setReplyingTo(null);
      }
    }
  };

  // Handle edit poll from gear icon
  const handleEditPoll = (message: Message) => {
    try {
      const pollJson = message.content.replace('POLL:', '');
      const pollData: PollData = JSON.parse(pollJson);
      setEditingPoll(pollData);
      setEditingMessage(message); // Set editingMessage so updateMessage is called instead of sendMessage
      setShowPollCreator(true);
    } catch (e) {
      console.error('Error parsing poll for edit:', e);
      Alert.alert('Error', 'Failed to load poll data');
    }
  };

  // Handle delete option
  const handleDeleteMessage = async () => {
    if (!selectedMessage || !currentUserId) return;
    
    Alert.alert(
      'Delete Message',
      'Are you sure you want to delete this message?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              // TODO: Implement delete message API call
              console.log('Delete message:', selectedMessage.id);
              // Remove from local state
              setMessages(prev => prev.filter(msg => msg.id !== selectedMessage.id));
            } catch (error: any) {
              console.error('Error deleting message:', error);
              Alert.alert('Error', 'Failed to delete message');
            }
          },
        },
      ]
    );
  };

  // Handle toggle reaction
  const handleToggleReaction = async (messageId: number, emoji: string) => {
    if (!currentUserId || !user) return;

    try {
      const currentUserName = user.name || 'You';
      
      // Optimistic update
      setMessages(prev => prev.map(msg => {
        if (msg.id !== messageId) return msg;

        const currentReactions = msg.reactions || [];
        const reactionIndex = currentReactions.findIndex(r => r.emoji === emoji);
        const userReacted = reactionIndex !== -1 && 
          currentReactions[reactionIndex].users.some(u => u.id === currentUserId);

        if (userReacted) {
          // Remove reaction
          const updatedReactions = currentReactions.map((reaction, idx) => {
            if (idx === reactionIndex) {
              const updatedUsers = reaction.users.filter(u => u.id !== currentUserId);
              if (updatedUsers.length === 0) {
                return null; // Remove reaction if no users left
              }
              return {
                ...reaction,
                count: reaction.count - 1,
                users: updatedUsers,
                currentUserReacted: false,
              };
            }
            return reaction;
          }).filter(Boolean) as typeof currentReactions;

          return {
            ...msg,
            reactions: updatedReactions,
          };
        } else {
          // Add reaction
          if (reactionIndex !== -1) {
            // Reaction exists, add user
            const updatedReactions = currentReactions.map((reaction, idx) => {
              if (idx === reactionIndex) {
                const newUser = { id: currentUserId, name: currentUserName };
                return {
                  ...reaction,
                  count: reaction.count + 1,
                  users: [...reaction.users, newUser],
                  currentUserReacted: true,
                };
              }
              return reaction;
            });
            return {
              ...msg,
              reactions: updatedReactions,
            };
          } else {
            // New reaction
            const newReaction = {
              emoji,
              count: 1,
              users: [{ id: currentUserId, name: currentUserName }],
              currentUserReacted: true,
            };
            return {
              ...msg,
              reactions: [...currentReactions, newReaction],
            };
          }
        }
      }));

      // API call
      await chatService.toggleReaction(messageId, emoji, currentUserId);
    } catch (error: any) {
      console.error('Error toggling reaction:', error);
      // Revert optimistic update on error
      await loadMessages();
    }
  };

  // Cancel reply
  const cancelReply = () => {
    setReplyingTo(null);
  };

  // Handle click on reply preview to scroll to original message
  const handleReplyClick = (replyToId: number) => {
    // Find the message index
    const messageIndex = messages.findIndex(msg => msg.id === replyToId);
    
    if (messageIndex !== -1) {
      // Scroll to the message
      setTimeout(() => {
        flatListRef.current?.scrollToIndex({ 
          index: messageIndex, 
          animated: true,
          viewPosition: 0.5 // Center the message
        });
      }, 100);

      // Highlight the message for 1 second
      setHighlightedMessageId(replyToId);
      setTimeout(() => {
        setHighlightedMessageId(null);
      }, 1000);
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

  // Format audio duration (e.g., "0:10", "1:23")
  const formatAudioDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Render a message
  const renderMessage = ({ item, index }: { item: Message; index: number }) => {
    const isOwn = item.isOwn ?? false;
    const previousMessage = index > 0 ? messages[index - 1] : null;
    
    // Initialize animation for this message if not exists
    if (!messageAnimations.current[item.id]) {
      messageAnimations.current[item.id] = new Animated.Value(1);
    }
    
    // Check if this is a system message (from GearConnect)
    const isSystemMessage = item.content?.startsWith('GearConnect:');
    
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

    // Render system message (centered)
    if (isSystemMessage) {
      return (
        <View style={styles.systemMessageContainer}>
          <Text style={styles.systemMessageText}>
            {item.content}
          </Text>
        </View>
      );
    }

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
                <VerifiedAvatar
                  publicId={item.sender?.profilePicturePublicId}
                  fallbackUrl={item.sender?.profilePicture}
                  size={36}
                  isVerify={item.sender?.isVerify || false}
                  style={styles.messageAvatar}
                />
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
        <View
          ref={(ref) => {
            if (ref) {
              messageRefs.current[item.id] = ref;
            }
          }}
          style={[
            styles.messageWrapper,
            highlightedMessageId === item.id && styles.highlightedMessage,
            selectedMessage?.id === item.id && styles.highlightedMessageBubble,
            selectedMessage?.id === item.id && styles.messageElevated,
          ]}
        >

          <Animated.View
            style={[
              {
                transform: [
                  {
                    scale: messageAnimations.current[item.id] || new Animated.Value(1),
                  },
                ],
              },
            ]}
          >
          <Pressable
            style={[
              styles.messageBubble, 
              isOwn ? styles.ownMessageBubble : styles.otherMessageBubble,
              isGrouped && styles.groupedMessage,
              selectedMessage?.id === item.id && styles.highlightedMessageBubble,
            ]}
            onLongPress={(event) => handleLongPressMessage(item, event)}
          >
            {/* Reply preview inside message bubble - clickable */}
            {item.replyTo && (
              <TouchableOpacity
                style={[styles.replyPreview, isOwn && styles.ownReplyPreview]}
                onPress={() => {
                  if (item.replyTo?.id) {
                    handleReplyClick(item.replyTo.id);
                  }
                }}
                activeOpacity={0.7}
                hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
              >
                <View style={[styles.replyLine, isOwn && styles.ownReplyLine]} />
                <View style={styles.replyPreviewContent}>
                  <Text style={[styles.replyAuthor, isOwn && styles.ownReplyAuthor]}>
                    {item.replyTo.sender.name || item.replyTo.sender.username}
                  </Text>
                  <Text 
                    style={[styles.replyPreviewText, isOwn && styles.ownReplyPreviewText]} 
                    numberOfLines={1}
                  >
                    {item.replyTo.content}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          
          {/* Show sender name for ALL messages (including own) for clarity */}
          <Text style={[styles.senderName, isOwn && styles.ownSenderName]}>
            {item.sender?.name || item.sender?.username || 'Unknown User'}
          </Text>
          
          {/* Render audio player if message type is AUDIO */}
          {item.messageType === 'AUDIO' ? (
            <AudioMessagePlayer
              audioUrl={item.content}
              isOwn={isOwn}
              onDurationLoaded={(duration) => {
                setAudioDurations(prev => ({ ...prev, [item.id]: duration }));
              }}
              onPositionUpdate={(position) => {
                setAudioPositions(prev => ({ ...prev, [item.id]: position }));
              }}
            />
          ) : item.messageType === 'IMAGE' ? (
            // Parse media from content (could be JSON array, JSON with caption, or single URL)
            (() => {
              try {
                // Check if content has a caption (format: "caption\nJSON")
                const parts = item.content.split('\n');
                let mediaData;
                
                if (parts.length > 1) {
                  // Has caption, JSON is after first newline
                  const jsonPart = parts.slice(1).join('\n');
                  try {
                    mediaData = JSON.parse(jsonPart);
                  } catch (e) {
                    // If JSON parsing fails, try to treat jsonPart as a URL, otherwise fallback
                    const possibleUri = jsonPart.trim();
                    const singleUri = possibleUri.startsWith('http://') || possibleUri.startsWith('https://')
                      ? possibleUri
                      : item.content.trim();
                    if (!singleUri || singleUri === 'null' || singleUri === '') {
                      return (
                        <View style={[styles.messageText, isOwn && styles.ownMessageText]}>
                          <Text>Media unavailable</Text>
                        </View>
                      );
                    }
                    
                    return (
                      <MediaCarousel
                        media={[{
                          uri: singleUri,
                          type: 'image',
                          secureUrl: singleUri,
                        }]}
                        isOwn={isOwn}
                      />
                    );
                  }
                } else {
                  // No caption, try to parse as JSON first
                  try {
                    mediaData = JSON.parse(item.content);
                  } catch (e) {
                    // Not JSON, treat as single URL (validate first)
                    const singleUri = item.content.trim();
                    if (!singleUri || singleUri === 'null' || singleUri === '') {
                      return (
                        <View style={[styles.messageText, isOwn && styles.ownMessageText]}>
                          <Text>Media unavailable</Text>
                        </View>
                      );
                    }
                    
                    return (
                      <MediaCarousel
                        media={[{
                          uri: singleUri,
                          type: 'image',
                          secureUrl: singleUri,
                        }]}
                        isOwn={isOwn}
                      />
                    );
                  }
                }
                
                if (Array.isArray(mediaData)) {
                  // Filter and validate media items
                  const validMedia = mediaData
                    .map((m: any) => {
                      const secureUrl = m.secureUrl || (typeof m === 'string' ? m : '');
                      const uri = secureUrl || m.uri || (typeof m === 'string' ? m : '');
                      
                      // Validate URI
                      if (!uri || uri === 'null' || uri.trim() === '') {
                        return null;
                      }
                      
                      return {
                        uri,
                        type: m.type || 'image',
                        secureUrl,
                        publicId: m.publicId,
                      };
                    })
                    .filter((m: any) => m !== null && (m.uri || m.secureUrl));
                  
                  // If no valid media, show placeholder
                  if (validMedia.length === 0) {
                    return (
                      <View style={[styles.messageText, isOwn && styles.ownMessageText]}>
                        <Text>Media unavailable</Text>
                      </View>
                    );
                  }
                  
                  return (
                    <>
                      {parts.length > 1 && (
                        <Text style={[styles.messageText, isOwn && styles.ownMessageText, { marginBottom: 8 }]}>
                          {parts[0]}
                        </Text>
                      )}
                      <MediaCarousel
                        media={validMedia}
                        isOwn={isOwn}
                      />
                    </>
                  );
                }
                
                // If parsed but not an array, treat as single URL (validate first)
                const singleUri = item.content.trim();
                if (!singleUri || singleUri === 'null' || singleUri === '') {
                  return (
                    <View style={[styles.messageText, isOwn && styles.ownMessageText]}>
                      <Text>Media unavailable</Text>
                    </View>
                  );
                }
                
                return (
                  <MediaCarousel
                    media={[{
                      uri: singleUri,
                      type: 'image',
                      secureUrl: singleUri,
                    }]}
                    isOwn={isOwn}
                  />
                );
              } catch (e) {
                // Fallback: treat as single URL (validate first)
                const singleUri = item.content.trim();
                if (!singleUri || singleUri === 'null' || singleUri === '') {
                  return (
                    <View style={[styles.messageText, isOwn && styles.ownMessageText]}>
                      <Text>Media unavailable</Text>
                    </View>
                  );
                }
                
                return (
                  <MediaCarousel
                    media={[{
                      uri: singleUri,
                      type: 'image',
                      secureUrl: singleUri,
                    }]}
                    isOwn={isOwn}
                  />
                );
              }
            })()
          ) : item.content.startsWith('CONTACT:') ? (
            // Parse contact data
            (() => {
              try {
                const contactJson = item.content.replace('CONTACT:', '');
                const contactData: ContactData = JSON.parse(contactJson);
                return (
                  <ContactCard
                    contact={contactData}
                    isOwn={isOwn}
                  />
                );
              } catch (e) {
                // Fallback to text if parsing fails
                return (
                  <Text style={[styles.messageText, isOwn && styles.ownMessageText]}>
                    {item.content}
                  </Text>
                );
              }
            })()
          ) : item.content.startsWith('POLL:') ? (
            // Parse poll data
            (() => {
              try {
                const pollJson = item.content.replace('POLL:', '');
                const pollData: PollData = JSON.parse(pollJson);
                const pollWithVotes: PollWithVotes = {
                  ...pollData,
                  messageId: item.id,
                  userVotes: [], // TODO: Get from backend
                  votes: [], // TODO: Get from backend
                  totalVotes: 0,
                };
                return (
                  <Pressable
                    onLongPress={(event) => handleLongPressMessage(item, event)}
                    style={selectedMessage?.id === item.id && styles.highlightedMessageBubble}
                  >
                    <PollCard
                      poll={pollWithVotes}
                      isOwn={isOwn}
                      currentUserId={currentUserId}
                      currentUserName={user?.name || undefined}
                      currentUserAvatar={(user as any)?.profilePicture || user?.photoURL}
                      currentUserAvatarPublicId={(user as any)?.profilePicturePublicId}
                      currentUserIsVerify={(user as any)?.isVerify}
                      onVote={async (optionId: string) => {
                        // TODO: Implement vote API call
                        console.log('Vote for option:', optionId, 'in poll:', item.id);
                      }}
                      onEdit={isOwn ? () => handleEditPoll(item) : undefined}
                      onDelete={isOwn ? () => handleLongPressMessage(item) : undefined}
                    />
                  </Pressable>
                );
              } catch (e) {
                // Fallback to text if parsing fails
                return (
                  <Text style={[styles.messageText, isOwn && styles.ownMessageText]}>
                    {item.content}
                  </Text>
                );
              }
            })()
          ) : (
            <Text style={[styles.messageText, isOwn && styles.ownMessageText]}>
              {item.content}
            </Text>
          )}

          {/* Reactions display */}
          {item.reactions && item.reactions.length > 0 && (
            <View style={styles.reactionsContainer}>
              {item.reactions.map((reaction, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.reactionChip,
                    reaction.currentUserReacted && styles.reactionChipActive,
                    isOwn && styles.ownReactionChip,
                  ]}
                  onPress={async () => {
                    // Toggle reaction: if user already reacted, remove it; otherwise add it
                    await handleToggleReaction(item.id, reaction.emoji);
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.reactionChipEmoji}>{reaction.emoji}</Text>
                  <Text style={[
                    styles.reactionChipCount,
                    isOwn && styles.ownReactionChipCount,
                  ]}>
                    {reaction.count}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
          
          {/* Duration for audio messages (bottom left) and Timestamp (bottom right) */}
          <View style={styles.messageTimeContainer}>
            {/* Audio duration on the left (current position if playing, else total duration) */}
            {item.messageType === 'AUDIO' && audioDurations[item.id] && (
              <Text style={[styles.messageTime, styles.audioDuration, isOwn && styles.ownMessageTime]}>
                {formatAudioDuration(audioPositions[item.id] ?? audioDurations[item.id])}
              </Text>
            )}
            {/* Timestamp on the right with edited indicator */}
            <View style={styles.messageTimeRow}>
              <Text style={[styles.messageTime, isOwn && styles.ownMessageTime]}>
                {formatTime(item.createdAt)}
              </Text>
              {item.isEdited && (
                <Text style={[styles.editedIndicator, isOwn && styles.ownEditedIndicator]}>
                  (edited)
                </Text>
              )}
            </View>
          </View>
          </Pressable>
          </Animated.View>
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
                <VerifiedAvatar
                  publicId={item.sender?.profilePicturePublicId}
                  fallbackUrl={item.sender?.profilePicture}
                  size={36}
                  isVerify={item.sender?.isVerify || false}
                  style={styles.messageAvatar}
                />
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
          {/* Video call button with dropdown */}
          <TouchableOpacity 
            style={styles.headerActionButton}
            onPress={() => setShowCallMenu(!showCallMenu)}
            activeOpacity={0.7}
          >
            <FontAwesome name="video-camera" size={20} color={theme.colors.text.secondary} />
            <FontAwesome name="chevron-down" size={12} color={theme.colors.text.secondary} style={{ marginLeft: 4 }} />
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
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContainer}
        showsVerticalScrollIndicator={true}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        onContentSizeChange={() => {
          // Always scroll to bottom on content size change if we haven't scrolled initially
          // or if user is already at bottom
          if (!hasScrolledInitially) {
            setTimeout(() => {
              flatListRef.current?.scrollToEnd({ animated: false });
              setIsScrolledToBottom(true);
              setHasScrolledInitially(true);
            }, 100);
          } else if (isScrolledToBottom) {
            flatListRef.current?.scrollToEnd({ animated: true });
          }
        }}
        onScrollToIndexFailed={(info) => {
          // Handle scroll to index failure
          const wait = new Promise(resolve => setTimeout(resolve, 500));
          wait.then(() => {
            flatListRef.current?.scrollToIndex({ index: info.index, animated: true });
          });
        }}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <FontAwesome name="comment" size={40} color={theme.colors.text.secondary} />
            <Text style={styles.emptyStateText}>No messages yet. Start the conversation!</Text>
          </View>
        }
        inverted={false}
      />
      )}
      
      {/* Scroll to bottom button */}
      {!loading && !isScrolledToBottom && (
        <TouchableOpacity
          style={styles.scrollToBottomButton}
          onPress={scrollToBottom}
          activeOpacity={0.7}
        >
          <FontAwesome name="chevron-down" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      )}

      {/* Reply preview */}
      {replyingTo && (
        <View style={styles.replyPreviewContainer}>
          <View style={styles.replyPreviewWrapper}>
            <View style={styles.replyPreviewLeft}>
              <View style={styles.replyPreviewLine} />
              <View style={styles.replyPreviewInfo}>
                <Text style={styles.replyPreviewName}>
                  {replyingTo.sender?.name || replyingTo.sender?.username || 'Unknown User'}
                </Text>
                <Text style={styles.replyPreviewMessage} numberOfLines={1}>
                  {replyingTo.content}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.replyPreviewClose}
              onPress={cancelReply}
              activeOpacity={0.7}
            >
              <FontAwesome name="times" size={16} color={theme.colors.text.secondary} />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Input area */}
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          {/* Text Input or Voice Recorder */}
          {!isRecordingVoice ? (
            <>
              {/* Attach button */}
              <TouchableOpacity 
                style={styles.attachButton}
                onPress={() => {
                  Keyboard.dismiss();
                  setShowAttachmentMenu(true);
                }}
                activeOpacity={0.7}
              >
                <FontAwesome name="plus" size={20} color={theme.colors.text.secondary} />
              </TouchableOpacity>
              
              <TextInput
                style={styles.textInput}
                value={newMessage}
                onChangeText={(text) => {
                  setNewMessage(text);
                  if (showAttachmentMenu) {
                    setShowAttachmentMenu(false);
                  }
                }}
                placeholder={editingMessage ? "Edit your message..." : "Type your message..."}
                placeholderTextColor={theme.colors.text.secondary}
                multiline
                maxLength={500}
              />
              
              {/* Cancel edit button (if editing) */}
              {editingMessage && (
                <TouchableOpacity
                  style={styles.cancelEditButton}
                  onPress={() => {
                    setEditingMessage(null);
                    setNewMessage('');
                    setSelectedMessage(null);
                    setShowMessageOptions(false);
                    setShowEmojiPicker(false);
                  }}
                  activeOpacity={0.7}
                >
                  <FontAwesome 
                    name="times" 
                    size={16} 
                    color={theme.colors.text.secondary} 
                  />
                </TouchableOpacity>
              )}
              
              {/* Send button or microphone button */}
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
                    Keyboard.dismiss();
                    setIsRecordingVoice(true);
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
            </>
          ) : (
            <VoiceRecorder
              onRecordingComplete={async (uri, duration) => {
                if (!currentUserId || !conversationId) return;
                
                setIsRecordingVoice(false);
                
                try {
                  setSending(true);
                  
                  // Upload audio to Cloudinary
                  const { cloudinaryService } = await import('../src/services/cloudinary.service');
                  const uploadResult = await cloudinaryService.uploadMedia(uri, {
                    folder: 'messages',
                    tags: ['message', 'audio'],
                    resource_type: 'auto',
                  });

                  // Send message with audio
                  await chatService.sendMessage(
                    parseInt(conversationId),
                    uploadResult.secure_url,
                    currentUserId,
                    'AUDIO',
                    replyingTo?.id
                  );
                  
                  // Reload messages
                  await loadMessages();
                } catch (error: any) {
                  console.error('Error sending voice message:', error);
                  Alert.alert('Error', error.response?.data?.error || 'Failed to send voice message');
                } finally {
                  setSending(false);
                }
              }}
              onCancel={() => {
                setIsRecordingVoice(false);
                console.log('Voice recording cancelled');
              }}
              disabled={sending || loading}
            />
          )}
        </View>
      </View>

      {/* Attachment Menu */}
      <AttachmentMenu
        visible={showAttachmentMenu}
        onClose={() => setShowAttachmentMenu(false)}
        conversationId={conversationId}
        onPhotosSelected={async (media, caption) => {
          if (!currentUserId) return;
          
          try {
            setSending(true);
            const conversationIdNum = parseInt(conversationId);
            
            // Group all media into a single message as JSON array (carousel)
            const mediaArray = media.map(m => ({
              uri: m.uri,
              type: m.type,
              secureUrl: m.secureUrl,
              publicId: m.publicId,
            }));

            // If there's a caption, prepend it to the JSON
            const content = caption
              ? `${caption}\n${JSON.stringify(mediaArray)}`
              : JSON.stringify(mediaArray);

            // Use IMAGE type for now (backend can handle both images and videos)
              await chatService.sendMessage(
                conversationIdNum,
                content,
                currentUserId,
              'IMAGE',
                replyingTo?.id
              );
            
            // Reload messages
            await loadMessages();
          } catch (error: any) {
            console.error('Error sending media:', error);
            Alert.alert('Error', error.response?.data?.error || 'Failed to send media');
          } finally {
            setSending(false);
          }
        }}
        onCameraSelected={async (media, caption) => {
          if (!currentUserId) return;
          
          try {
            setSending(true);
            const conversationIdNum = parseInt(conversationId);
            
            // Group camera media into a single message as JSON array
            const mediaArray = media.map(m => ({
              uri: m.uri,
              type: m.type,
              secureUrl: m.secureUrl,
              publicId: m.publicId,
            }));
            
            // If there's a caption, prepend it to the JSON
            const content = caption 
              ? `${caption}\n${JSON.stringify(mediaArray)}`
              : JSON.stringify(mediaArray);
            
            await chatService.sendMessage(
              conversationIdNum,
              content,
              currentUserId,
              'IMAGE',
              replyingTo?.id
            );
            
            // Reload messages
            await loadMessages();
          } catch (error: any) {
            console.error('Error sending camera image:', error);
            Alert.alert('Error', error.response?.data?.error || 'Failed to send image');
          } finally {
            setSending(false);
          }
        }}
        onLocationSelected={() => {
          // TODO: Implement location
          console.log('Location');
        }}
        onContactSelected={async (contact) => {
          if (!currentUserId) return;
          
          try {
            setSending(true);
            const conversationIdNum = parseInt(conversationId);
            
            // Send contact as JSON with special prefix to identify it
            const contactData = {
              type: 'contact',
              name: contact.name,
              phoneNumbers: contact.phoneNumbers,
              emails: contact.emails,
              organization: contact.organization,
              jobTitle: contact.jobTitle,
            };
            
            const contactMessage = `CONTACT:${JSON.stringify(contactData)}`;
            
            await chatService.sendMessage(
              conversationIdNum,
              contactMessage,
              currentUserId,
              'TEXT',
              replyingTo?.id
            );
            
            // Reload messages
            await loadMessages();
          } catch (error: any) {
            console.error('Error sending contact:', error);
            Alert.alert('Error', error.response?.data?.error || 'Failed to send contact');
          } finally {
            setSending(false);
          }
        }}
        onDocumentSelected={() => {
          // TODO: Implement document
          console.log('Document');
        }}
        onPollSelected={async (poll: PollData) => {
          if (!currentUserId) return;
          
          try {
            setSending(true);
            const conversationIdNum = parseInt(conversationId);
            
            // Send poll as JSON with special prefix to identify it
            const pollMessage = `POLL:${JSON.stringify(poll)}`;
            
            await chatService.sendMessage(
              conversationIdNum,
              pollMessage,
              currentUserId,
              'TEXT',
              replyingTo?.id
            );
            
            // Reload messages
            await loadMessages();
          } catch (error: any) {
            console.error('Error sending poll:', error);
            Alert.alert('Error', error.response?.data?.error || 'Failed to send poll');
          } finally {
            setSending(false);
          }
        }}
        onEventSelected={() => {
          // TODO: Implement event
          console.log('Event');
        }}
      />

      {/* Poll Creator for editing */}
      <PollCreator
        visible={showPollCreator}
        onSend={async (poll: PollData) => {
          if (!currentUserId || !editingPoll) return;
          
          try {
            setSending(true);
            const conversationIdNum = parseInt(conversationId);
            
            // If editing, we need to update the existing message
            if (editingMessage && editingMessage.content.startsWith('POLL:')) {
              const pollMessage = `POLL:${JSON.stringify(poll)}`;
              const updatedMessage = await chatService.updateMessage(
                editingMessage.id,
                pollMessage,
                currentUserId
              );
              // Update local state with the updated message
              setMessages(prev => prev.map(msg => 
                msg.id === editingMessage.id 
                  ? { 
                      ...updatedMessage, 
                      isOwn: updatedMessage.sender.id === currentUserId,
                      isEdited: true 
                    }
                  : msg
              ));
              setEditingMessage(null);
              setEditingPoll(null);
              setShowPollCreator(false);
            } else {
              // Send as new poll (shouldn't happen in edit mode, but just in case)
              const pollMessage = `POLL:${JSON.stringify(poll)}`;
              await chatService.sendMessage(
                conversationIdNum,
                pollMessage,
                currentUserId,
                'TEXT',
                replyingTo?.id
              );
              await loadMessages();
            }
          } catch (error: any) {
            console.error('Error saving poll:', error);
            Alert.alert('Error', error.response?.data?.error || 'Failed to save poll');
          } finally {
            setSending(false);
            setShowPollCreator(false);
            setEditingPoll(null);
            setEditingMessage(null);
          }
        }}
        onCancel={() => {
          setShowPollCreator(false);
          setEditingPoll(null);
          setEditingMessage(null);
        }}
        initialData={editingPoll || undefined}
      />

      {/* Unified Message Options Modal - New Logic */}
      {showMessageOptions && selectedMessage && (
        <Modal
          visible={showMessageOptions}
          transparent
          animationType="slide"
          onRequestClose={() => {
            setShowMessageOptions(false);
            setSelectedMessage(null);
            setMessagePosition(undefined);
            setShowEmojiPicker(false); // Reset emoji picker state
          }}
        >
          <TouchableOpacity
            style={styles.unifiedModalBackdrop}
            activeOpacity={1}
            onPress={() => {
              setShowMessageOptions(false);
              setSelectedMessage(null);
              setMessagePosition(undefined);
              setShowEmojiPicker(false); // Reset emoji picker state
            }}
          >
            <View style={styles.unifiedActionSheet} onStartShouldSetResponder={() => true}>
              <View style={styles.unifiedSheetHandle} />
              
              {/* Message preview section */}
              <View style={styles.unifiedMessagePreview}>
                <View style={styles.unifiedMessagePreviewContent}>
                  <View style={styles.unifiedMessagePreviewHeader}>
                    <VerifiedAvatar
                      publicId={selectedMessage.sender?.profilePicturePublicId}
                      fallbackUrl={selectedMessage.sender?.profilePicture}
                      size={32}
                      isVerify={selectedMessage.sender?.isVerify || false}
                      style={styles.unifiedMessagePreviewAvatar}
                    />
                    <View style={styles.unifiedMessagePreviewInfo}>
                      <Text style={styles.unifiedMessagePreviewName}>
                        {selectedMessage.sender?.name || selectedMessage.sender?.username || 'Unknown'}
                      </Text>
                      <Text style={styles.unifiedMessagePreviewTime}>
                        {formatTime(selectedMessage.createdAt)}
                      </Text>
                    </View>
                  </View>
                  <Text 
                    style={styles.unifiedMessagePreviewText}
                    numberOfLines={3}
                  >
                    {selectedMessage.content.startsWith('POLL:') 
                      ? '📊 Poll' 
                      : selectedMessage.content.startsWith('CONTACT:')
                      ? '👤 Contact'
                      : selectedMessage.messageType === 'IMAGE'
                      ? '📷 Photo'
                      : selectedMessage.messageType === 'AUDIO'
                      ? '🎤 Audio'
                      : selectedMessage.content.startsWith('GearConnect:')
                      ? selectedMessage.content.replace('GearConnect:', '')
                      : selectedMessage.content}
                  </Text>
                </View>
              </View>

              {/* Divider */}
              <View style={styles.unifiedDivider} />
              
              {/* Reactions section - integrated at top */}
              <View style={styles.unifiedReactionsSection}>
                <Text style={styles.unifiedSectionTitle}>React</Text>
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.unifiedReactionsRow}
                >
                  {['👍', '❤️', '😂', '😮', '😢', '🙏', '😭', '🔥', '💯', '👏', '🎉', '✨', '💪', '🤔', '😍', '😴', '🤮', '😡', '🤝', '🙌'].map((emoji, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.unifiedReactionButton}
                      onPress={async () => {
                        await handleToggleReaction(selectedMessage.id, emoji);
                        setShowMessageOptions(false);
                        setSelectedMessage(null);
                        setMessagePosition(undefined);
                        setShowEmojiPicker(false);
                      }}
                      activeOpacity={0.6}
                    >
                      <Text style={styles.unifiedReactionEmoji}>{emoji}</Text>
                    </TouchableOpacity>
                  ))}
                  <TouchableOpacity
                    style={styles.unifiedReactionButton}
                    onPress={() => {
                      setShowEmojiPicker(!showEmojiPicker);
                    }}
                    activeOpacity={0.6}
                  >
                    <View style={[styles.unifiedAddReactionButton, showEmojiPicker && styles.unifiedAddReactionButtonActive]}>
                      <FontAwesome name="plus" size={16} color="#8E8E93" />
                    </View>
                  </TouchableOpacity>
                </ScrollView>
              </View>

              {/* Emoji Picker - Expandable section */}
              {showEmojiPicker && (
                <View style={styles.emojiPickerContainer}>
                  <ScrollView 
                    style={styles.emojiPickerGrid}
                    contentContainerStyle={styles.emojiPickerGridContent}
                    showsVerticalScrollIndicator={false}
                  >
                    {allEmojis.map((emoji, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.emojiPickerItem}
                        onPress={async () => {
                          await handleToggleReaction(selectedMessage.id, emoji);
                          setShowEmojiPicker(false);
                          setShowMessageOptions(false);
                          setSelectedMessage(null);
                          setMessagePosition(undefined);
                        }}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.emojiPickerEmoji}>{emoji}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}

              {/* Divider */}
              <View style={styles.unifiedDivider} />

              {/* Actions section */}
              <View style={styles.unifiedActionsSection}>
                <TouchableOpacity
                  style={styles.unifiedActionRow}
                  onPress={() => {
                    handleReply();
                    setShowMessageOptions(false);
                    setSelectedMessage(null);
                    setMessagePosition(undefined);
                    setShowEmojiPicker(false);
                  }}
                  activeOpacity={0.7}
                >
                  <FontAwesome name="reply" size={22} color="#000000" />
                  <Text style={styles.unifiedActionLabel}>Reply</Text>
                </TouchableOpacity>

                {selectedMessage.isOwn && (
                  <>
                    <TouchableOpacity
                      style={styles.unifiedActionRow}
                      onPress={() => {
                        handleEditMessage();
                        setShowMessageOptions(false);
                        setSelectedMessage(null);
                        setMessagePosition(undefined);
                        setShowEmojiPicker(false);
                      }}
                      activeOpacity={0.7}
                    >
                      <FontAwesome name="edit" size={22} color="#000000" />
                      <Text style={styles.unifiedActionLabel}>Edit</Text>
                    </TouchableOpacity>
                    
                    <View style={styles.unifiedDivider} />
                    
                    <TouchableOpacity
                      style={styles.unifiedActionRow}
                      onPress={() => {
                        handleDeleteMessage();
                        setShowMessageOptions(false);
                        setSelectedMessage(null);
                        setMessagePosition(undefined);
                        setShowEmojiPicker(false);
                      }}
                      activeOpacity={0.7}
                    >
                      <FontAwesome name="trash" size={22} color="#FF3B30" />
                      <Text style={[styles.unifiedActionLabel, styles.unifiedActionLabelDanger]}>Delete</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>
          </TouchableOpacity>
        </Modal>
      )}

      {/* Call Menu Contextual */}
      {showCallMenu && (
        <>
          <TouchableOpacity
            style={styles.callMenuOverlay}
            activeOpacity={1}
            onPress={() => setShowCallMenu(false)}
          />
          <View style={styles.callMenu}>
            <TouchableOpacity
              style={styles.callMenuItem}
              onPress={() => {
                setShowCallMenu(false);
                // TODO: Implement voice call
                console.log('Voice call');
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.callMenuText}>Voice call</Text>
              <FontAwesome name="phone" size={18} color="#FFFFFF" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.callMenuItem}
              onPress={() => {
                setShowCallMenu(false);
                // TODO: Implement video call
                console.log('Video call');
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.callMenuText}>Video call</Text>
              <FontAwesome name="video-camera" size={18} color="#FFFFFF" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.callMenuItem}
              onPress={() => {
                setShowCallMenu(false);
                // TODO: Implement select people
                console.log('Select people');
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.callMenuText}>Select people</Text>
              <FontAwesome name="check" size={18} color="#FFFFFF" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.callMenuItem}
              onPress={() => {
                setShowCallMenu(false);
                // TODO: Implement send call link
                console.log('Send call link');
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.callMenuText}>Send call link</Text>
              <FontAwesome name="link" size={18} color="#FFFFFF" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.callMenuItem, styles.callMenuItemLast]}
              onPress={() => {
                setShowCallMenu(false);
                // TODO: Implement schedule call
                console.log('Schedule call');
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.callMenuText}>Schedule a call</Text>
              <FontAwesome name="calendar" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </>
      )}

    </KeyboardAvoidingView>
  );
} 