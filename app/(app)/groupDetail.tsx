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
  Modal,
  Keyboard,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import theme from '../src/styles/config/theme';
import { conversationScreenStyles as styles } from '../src/styles/screens';
import chatService, { Message as ApiMessage } from '../src/services/chatService';
import { useAuth } from '../src/context/AuthContext';
import { CloudinaryAvatar } from '../src/components/media/CloudinaryImage';
import groupService, { GroupDetails } from '../src/services/groupService';
import AttachmentMenu from '../src/components/messaging/AttachmentMenu';
import VoiceRecorder from '../src/components/messaging/VoiceRecorder';
import AudioMessagePlayer from '../src/components/messaging/AudioMessagePlayer';
import MediaCarousel from '../src/components/messaging/MediaCarousel';
import ContactCard, { ContactData } from '../src/components/messaging/ContactCard';
import PollCard, { PollWithVotes, PollVote } from '../src/components/messaging/PollCard';
import PollCreator, { PollData } from '../src/components/messaging/PollCreator';
import DocumentCard, { DocumentData } from '../src/components/messaging/DocumentCard';
import LocationCard, { LocationData } from '../src/components/messaging/LocationCard';
import AppointmentCard, { AppointmentData } from '../src/components/messaging/AppointmentCard';
import AppointmentCreator from '../src/components/messaging/AppointmentCreator';
import * as DocumentPicker from 'expo-document-picker';
import { UserStatus, UserStatusDisplay } from '../src/types/userStatus';

// Extended Message type with isOwn property for UI
type Message = ApiMessage & {
  isOwn?: boolean;
};

export default function GroupDetailScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [highlightedMessageId, setHighlightedMessageId] = useState<number | null>(null);
  const [group, setGroup] = useState<GroupDetails | null>(null);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showCallMenu, setShowCallMenu] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [audioDurations, setAudioDurations] = useState<{ [key: number]: number }>({});
  const [audioPositions, setAudioPositions] = useState<{ [key: number]: number }>({});
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(false);
  const [hasScrolledInitially, setHasScrolledInitially] = useState(false);
  const [inviteCode, setInviteCode] = useState('');
  const [showAddMembers, setShowAddMembers] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [addingMembers, setAddingMembers] = useState(false);
  const [removingMember, setRemovingMember] = useState<number | null>(null);
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  const [editingPoll, setEditingPoll] = useState<PollData | null>(null);
  const [showPollCreator, setShowPollCreator] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<AppointmentData | null>(null);
  const [showAppointmentCreator, setShowAppointmentCreator] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const messageRefs = useRef<{ [key: number]: View | null }>({});
  const loadedGroupIdRef = useRef<string | null>(null); // Track which group is loaded
  const router = useRouter();
  const params = useLocalSearchParams();
  const { user } = useAuth() || {};
  
  const groupId = params.groupId as string;
  const currentUserId = user?.id ? parseInt(user.id.toString()) : undefined;

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

  // Load group details
  const loadGroupDetails = useCallback(async () => {
    if (!groupId || !currentUserId) return;
    
    try {
      const groupIdNum = parseInt(groupId);
      if (isNaN(groupIdNum)) {
        Alert.alert('Error', 'Invalid group ID');
        return;
      }
      const groupData = await groupService.getGroupDetails(groupIdNum, currentUserId);
      setGroup(groupData);
    } catch (error: any) {
      console.error('Error loading group details:', error);
      Alert.alert('Error', error.response?.data?.error || 'Failed to load group details');
    }
  }, [groupId, currentUserId]);

  // Load messages from API
  // Load poll votes for all poll messages
  const loadPollVotes = useCallback(async (messages: Message[]) => {
    if (!currentUserId) return messages;
    
    const pollMessages = messages.filter(msg => msg.content?.startsWith('POLL:'));
    if (pollMessages.length === 0) return messages;

    try {
      const votesPromises = pollMessages.map(async (msg) => {
        try {
          const votesData = await chatService.getPollVotes(msg.id, currentUserId);
          return { messageId: msg.id, votesData };
        } catch (error) {
          console.error(`Error loading votes for poll ${msg.id}:`, error);
          return { messageId: msg.id, votesData: null };
        }
      });

      const votesResults = await Promise.all(votesPromises);
      const votesMap = new Map(votesResults.map(r => [r.messageId, r.votesData]));

      // Update messages with votes
      return messages.map(msg => {
        if (msg.content?.startsWith('POLL:')) {
          const votesData = votesMap.get(msg.id);
          if (votesData) {
            return {
              ...msg,
              pollVotes: votesData.votes || [],
              pollUserVotes: votesData.userVotes || [],
            };
          }
        }
        return msg;
      });
    } catch (error) {
      console.error('Error loading poll votes:', error);
      return messages;
    }
  }, [currentUserId]);

  const loadMessages = useCallback(async (forceReload = false) => {
    if (!currentUserId || !group) return;

    // Reset loaded group ref if group changed
    if (loadedGroupIdRef.current !== groupId) {
      loadedGroupIdRef.current = null;
    }

    // Skip reload if group is already loaded and we're not forcing a reload
    if (!forceReload && loadedGroupIdRef.current === groupId) {
      return; // Group already loaded, skip
    }

    try {
      setLoading(true);
      const groupIdNum = parseInt(groupId);
      if (isNaN(groupIdNum)) {
        Alert.alert('Error', 'Invalid group ID');
        return;
      }

      const response = await groupService.getGroupMessages(groupIdNum, currentUserId);
      let formattedMessages: Message[] = [];
      if (response && Array.isArray(response)) {
        formattedMessages = response.map((msg: ApiMessage) => {
          const isOwnMessage = msg.sender.id === currentUserId;
          return {
            ...msg,
            isOwn: isOwnMessage,
          };
        });
      }

      // Load poll votes
      const messagesWithVotes = await loadPollVotes(formattedMessages);
      setMessages(messagesWithVotes);
      loadedGroupIdRef.current = groupId; // Mark group as loaded
    } catch (error) {
      console.error('Error loading messages:', error);
      Alert.alert('Error', 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  }, [currentUserId, group, groupId, loadPollVotes]);

  useEffect(() => {
    if (groupId && currentUserId) {
      loadGroupDetails();
      
      // Mark group conversation as read when opening it (only if group changed)
      const shouldReload = loadedGroupIdRef.current !== groupId;
      if (shouldReload) {
        const markAsRead = async () => {
          try {
            const groupIdNum = parseInt(groupId);
            await groupService.markGroupAsRead(groupIdNum, currentUserId);
          } catch (error) {
            console.error('Error marking group as read:', error);
          }
        };
        markAsRead();
      }
    }
  }, [groupId, currentUserId, loadGroupDetails]);

  useEffect(() => {
    if (group && currentUserId) {
      // Only reload if group changed
      const shouldReload = loadedGroupIdRef.current !== groupId;
      loadMessages(shouldReload);
    }
  }, [group, currentUserId, loadMessages, groupId]);

  // Scroll to bottom when new messages arrive (only if already at bottom)
  useEffect(() => {
    if (messages.length > 0 && flatListRef.current && isScrolledToBottom) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages, isScrolledToBottom]);
  
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

  // Send a message
  const sendMessage = async () => {
    if (!newMessage.trim() || !currentUserId || !group) return;

    const messageContent = newMessage.trim();
    const groupIdNum = parseInt(groupId);

    if (isNaN(groupIdNum)) {
      Alert.alert('Error', 'Invalid group ID');
      return;
    }

    setSending(true);
    try {
      const sentMessage = await groupService.sendGroupMessage(
        groupIdNum,
        messageContent,
        currentUserId,
        'TEXT',
        replyingTo?.id
      );

      if (sentMessage) {
        const newMsg: Message = {
          ...sentMessage,
          isOwn: sentMessage.sender.id === currentUserId,
        };
        setMessages(prev => [...prev, newMsg]);
        setNewMessage('');
        setReplyingTo(null);
        
        // Scroll to bottom after sending
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
          setIsScrolledToBottom(true);
        }, 100);
      }
    } catch (error: any) {
      console.error('Error sending message:', error);
      Alert.alert('Error', error.response?.data?.error || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  // Handle long press on message to reply
  const handleReplyToMessage = (message: Message) => {
    setReplyingTo(message);
  };

  // Cancel reply
  const cancelReply = () => {
    setReplyingTo(null);
  };

  // Handle click on reply preview to scroll to original message
  const handleReplyClick = (replyToId: number) => {
    const messageIndex = messages.findIndex(msg => msg.id === replyToId);

    if (messageIndex !== -1) {
      setTimeout(() => {
        flatListRef.current?.scrollToIndex({
          index: messageIndex,
          animated: true,
          viewPosition: 0.5
        });
      }, 100);

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

  // Create invite
  const createInvite = async () => {
    if (!groupId) return;
    
    try {
      const groupIdNum = parseInt(groupId);
      const invite = await groupService.createInvite(groupIdNum, currentUserId);
      setInviteCode(invite.code);
    } catch (error: any) {
      console.error('Error creating invite:', error);
      Alert.alert('Error', error.response?.data?.error || 'Failed to create invite');
    }
  };

  // Handle delete message
  const handleDeleteMessage = async (messageId: number) => {
    if (!currentUserId) return;
    
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
              const updatedMessage = await chatService.deleteMessage(messageId, currentUserId);
              // Update message in local state with system message
              setMessages(prev => prev.map(msg => 
                msg.id === messageId 
                  ? { ...updatedMessage, isOwn: msg.isOwn }
                  : msg
              ));
            } catch (error: any) {
              console.error('Error deleting message:', error);
              Alert.alert('Error', error.response?.data?.error || 'Failed to delete message');
            }
          },
        },
      ]
    );
  };

  // Handle delete group
  const handleDeleteGroup = () => {
    if (!group) return;
    
    Alert.alert(
      'Delete Group',
      `Are you sure you want to delete "${group.name}"? This action cannot be undone and all messages will be permanently deleted.`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const groupIdNum = parseInt(groupId);
              if (isNaN(groupIdNum)) {
                Alert.alert('Error', 'Invalid group ID');
                return;
    }
              await groupService.deleteGroup(groupIdNum, currentUserId);
              Alert.alert('Success', 'Group deleted successfully', [
                {
                  text: 'OK',
                  onPress: () => router.back(),
                },
              ]);
            } catch (error: any) {
              console.error('Error deleting group:', error);
              Alert.alert('Error', error.response?.data?.error || 'Failed to delete group');
    }
          },
        },
      ]
    );
  };

  // Format last active
  const formatLastActive = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return date.toLocaleDateString('en-US');
  };

  // Check if user can manage members (owner or admin)
  const canManageMembers = group && currentUserId && (
    group.owner?.id === currentUserId ||
    group.members?.some(m => 
      m.user.id === currentUserId && 
      m.roles?.some(mr => {
        try {
          const role = mr.role as any;
          if (role.permissions) {
            const permissions = JSON.parse(role.permissions);
            return permissions.manageMembers;
          }
          return false;
        } catch {
          return false;
        }
      })
    )
  );

  // Search for friends to add
  const searchFriends = async (query: string) => {
    if (!query.trim() || !currentUserId) {
      setSearchResults([]);
      return;
    }

    try {
      const friends = await chatService.getFriends(currentUserId);
      const filtered = friends.filter((friend: any) => {
        const name = friend.name?.toLowerCase() || '';
        const username = friend.username?.toLowerCase() || '';
        const search = query.toLowerCase();
        return (name.includes(search) || username.includes(search)) &&
               !group?.members?.some(m => m.user.id === friend.id);
      });
      setSearchResults(filtered);
    } catch (error) {
      console.error('Error searching friends:', error);
      setSearchResults([]);
    }
  };

  // Add members to group
  const handleAddMembers = async (memberIds: number[]) => {
    if (!group || !currentUserId || memberIds.length === 0) return;

    setAddingMembers(true);
    try {
      await groupService.addMembers(parseInt(groupId), memberIds, currentUserId);
      await loadGroupDetails();
      await loadMessages(true); // Force reload after adding members
      setShowAddMembers(false);
      setSearchQuery('');
      setSearchResults([]);
      Alert.alert('Success', 'Members added successfully');
    } catch (error: any) {
      console.error('Error adding members:', error);
      Alert.alert('Error', error.response?.data?.error || 'Failed to add members');
    } finally {
      setAddingMembers(false);
    }
  };

  // Remove member from group
  const handleRemoveMember = async (memberId: number, memberName: string) => {
    if (!group || !currentUserId) return;

    Alert.alert(
      'Remove Member',
      `Are you sure you want to remove ${memberName} from this group?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            setRemovingMember(memberId);
            try {
              await groupService.removeMember(parseInt(groupId), memberId, currentUserId);
              await loadGroupDetails();
              await loadMessages(true); // Force reload after removing member
              Alert.alert('Success', 'Member removed successfully');
            } catch (error: any) {
              console.error('Error removing member:', error);
              Alert.alert('Error', error.response?.data?.error || 'Failed to remove member');
            } finally {
              setRemovingMember(null);
            }
          },
        },
      ]
    );
  };

  // Render a message
  const renderMessage = ({ item, index }: { item: Message; index: number }) => {
    const isOwn = item.isOwn ?? false;
    const previousMessage = index > 0 ? messages[index - 1] : null;

    // Check if this is a system message (detected by content patterns)
    const isSystemMessage = item.content && (
      item.content.includes('joined the group') ||
      item.content.includes('left the group') ||
      item.content.includes('was deleted')
    );

    const showAvatar = isOwn
      ? (index === 0 ||
         previousMessage?.sender?.id !== item.sender?.id ||
         (previousMessage && (new Date(item.createdAt).getTime() - new Date(previousMessage.createdAt).getTime()) > 300000))
      : (index === 0 ||
         previousMessage?.sender?.id !== item.sender?.id ||
         (previousMessage && (new Date(item.createdAt).getTime() - new Date(previousMessage.createdAt).getTime()) > 300000));

    const isGrouped = previousMessage?.sender?.id === item.sender?.id &&
                     (new Date(item.createdAt).getTime() - new Date(previousMessage.createdAt).getTime()) < 300000;

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
              />
            )}
          </>
        )}

        <View
          ref={(ref) => {
            if (ref) {
              messageRefs.current[item.id] = ref;
            }
          }}
                style={[
            styles.messageWrapper,
            highlightedMessageId === item.id && styles.highlightedMessage
          ]}
        >
          <Pressable
            style={[
              styles.messageBubble,
              isOwn ? styles.ownMessageBubble : styles.otherMessageBubble,
              isGrouped && styles.groupedMessage
            ]}
            onLongPress={() => handleReplyToMessage(item)}
          >
            {item.replyTo && (
              <TouchableOpacity
                style={[styles.replyPreview, isOwn && styles.ownReplyPreview]}
                onPress={() => {
                  if (item.replyTo?.id) {
                    handleReplyClick(item.replyTo.id);
                  }
                }}
                activeOpacity={0.7}
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
                    } catch {
                    // If JSON parsing fails, try to treat jsonPart as a URL, otherwise fallback
                    const possibleUri = jsonPart.trim();
                    const singleUri = possibleUri.startsWith('http://') || possibleUri.startsWith('https://')
                      ? possibleUri
                      : item.content.trim();
                    if (!singleUri || singleUri === 'null' || singleUri === '') {
                      return (
                        <View>
                          <Text style={[styles.messageText, isOwn && styles.ownMessageText]}>Media unavailable</Text>
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
                    } catch {
                    // Not JSON, treat as single URL (validate first)
                    const singleUri = item.content.trim();
                    if (!singleUri || singleUri === 'null' || singleUri === '') {
                      return (
                        <View>
                          <Text style={[styles.messageText, isOwn && styles.ownMessageText]}>Media unavailable</Text>
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
                        if (!uri || uri === 'null' || uri.trim() === '' || typeof uri !== 'string') {
                          return null;
                        }
                        
                        return {
                          uri: uri as string,
                          type: (m.type || 'image') as 'image' | 'video',
                          secureUrl,
                          publicId: m.publicId,
                        };
                      })
                      .filter((m) => m !== null) as { uri: string; type: 'image' | 'video'; secureUrl?: string; publicId?: string }[];
                    
                    // If no valid media, show placeholder
                    if (validMedia.length === 0) {
                      return (
                        <View>
                          <Text style={[styles.messageText, isOwn && styles.ownMessageText]}>Media unavailable</Text>
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
                      <View>
                        <Text style={[styles.messageText, isOwn && styles.ownMessageText]}>Media unavailable</Text>
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
                } catch {
                  // Fallback: treat as single URL (validate first)
                  const singleUri = item.content.trim();
                  if (!singleUri || singleUri === 'null' || singleUri === '') {
                    return (
                      <View>
                        <Text style={[styles.messageText, isOwn && styles.ownMessageText]}>Media unavailable</Text>
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
              } catch {
                  // Fallback to text if parsing fails
                  return (
                    <Text style={[styles.messageText, isOwn && styles.ownMessageText]}>
                      {item.content}
                    </Text>
                  );
                }
              })()
            ) : item.content.startsWith('LOCATION:') ? (
              // Parse location data
              (() => {
                try {
                const locationJson = item.content.replace('LOCATION:', '');
                const locationData: LocationData = JSON.parse(locationJson);
                return (
                  <LocationCard
                    location={locationData}
                    isOwn={isOwn}
                  />
                );
              } catch {
                  // Fallback to text if parsing fails
                  return (
                    <Text style={[styles.messageText, isOwn && styles.ownMessageText]}>
                      {item.content}
                    </Text>
                  );
              }
            })()
            ) : item.content.startsWith('APPOINTMENT:') ? (
              // Parse appointment data
              (() => {
                try {
                const appointmentJson = item.content.replace('APPOINTMENT:', '');
                const appointmentData: AppointmentData = JSON.parse(appointmentJson);
                return (
                  <AppointmentCard
                    appointment={appointmentData}
                    isOwn={isOwn}
                  />
                );
              } catch {
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
                  
                  // Get votes from message (loaded by loadPollVotes)
                  const pollVotes = (item as any).pollVotes || [];
                  const pollUserVotes = (item as any).pollUserVotes || [];
                  
                  // Format votes for PollCard
                  const formattedVotes: PollVote[] = pollVotes.map((vote: any) => ({
                    optionId: vote.optionId,
                    userId: vote.userId,
                    userName: vote.userName,
                    userAvatar: vote.userAvatar,
                    userAvatarPublicId: vote.userAvatarPublicId,
                    isVerify: vote.isVerify,
                  }));

                  const pollWithVotes: PollWithVotes = {
                    ...pollData,
                    messageId: item.id,
                    userVotes: pollUserVotes,
                    votes: formattedVotes,
                    totalVotes: formattedVotes.length,
                  };
                  return (
                    <PollCard
                      poll={pollWithVotes}
                      isOwn={isOwn}
                      currentUserId={currentUserId}
                      currentUserName={user?.name || undefined}
                      currentUserAvatar={(user as any)?.profilePicture || user?.photoURL}
                      currentUserAvatarPublicId={(user as any)?.profilePicturePublicId}
                      currentUserIsVerify={(user as any)?.isVerify}
                      onVote={async (optionId: string) => {
                        if (!currentUserId) return;
                        try {
                          await chatService.votePoll(item.id, optionId, currentUserId);
                          // Reload poll votes
                          const votesData = await chatService.getPollVotes(item.id, currentUserId);
                          // Update the specific message in the messages array
                          setMessages(prev => prev.map(msg => {
                            if (msg.id === item.id) {
                              return {
                                ...msg,
                                pollVotes: votesData.votes || [],
                                pollUserVotes: votesData.userVotes || [],
                              };
                            }
                            return msg;
                          }));
                        } catch (error: any) {
                          console.error('Error voting on poll:', error);
                          Alert.alert('Error', error.response?.data?.error || 'Failed to vote on poll');
                        }
                      }}
                      onEdit={isOwn ? () => handleEditPoll(item) : undefined}
                      onDelete={isOwn ? () => handleDeleteMessage(item.id) : undefined}
                    />
                  );
                } catch {
                  // Fallback to text if parsing fails
                  return (
                    <Text style={[styles.messageText, isOwn && styles.ownMessageText]}>
                      {item.content}
                    </Text>
                  );
                }
              })()
            ) : item.content.startsWith('DOCUMENT:') ? (
              // Parse document data
              (() => {
                try {
                const documentJson = item.content.replace('DOCUMENT:', '');
                const documentData: DocumentData = JSON.parse(documentJson);
                return (
                  <DocumentCard
                    document={documentData}
                    isOwn={isOwn}
                  />
                );
              } catch {
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
            
            {/* Duration for audio messages (bottom left) and Timestamp (bottom right) */}
            <View style={styles.messageTimeContainer}>
              {/* Audio duration on the left (current position if playing, else total duration) */}
              {item.messageType === 'AUDIO' && audioDurations[item.id] && (
                <Text style={[styles.messageTime, styles.audioDuration, isOwn && styles.ownMessageTime]}>
                  {formatAudioDuration(audioPositions[item.id] ?? audioDurations[item.id])}
                </Text>
              )}
              {/* Timestamp on the right */}
              <Text style={[styles.messageTime, isOwn && styles.ownMessageTime]}>
                {formatTime(item.createdAt)}
              </Text>
            </View>
          </Pressable>
        </View>

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
              />
            )}
          </>
        )}
      </View>
    );
  };

  if (loading && !group) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#E10600" />
          <Text style={styles.loadingText}>Loading group...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!group) {
  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Group not found</Text>
        </View>
      </SafeAreaView>
    );
  }

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

        <TouchableOpacity
          style={styles.headerInfo}
          onPress={() => setShowMembersModal(true)}
          activeOpacity={0.7}
        >
          <Text style={styles.headerTitle} numberOfLines={1}>
            {group.name}
          </Text>
          <Text style={styles.headerSubtitle}>
            {group._count?.members || group.members?.length || 0} members
          </Text>
        </TouchableOpacity>

        <View style={styles.headerActions}>
          {/* Delete group button (only for owner) */}
          {group.owner?.id === currentUserId && (
        <TouchableOpacity
              style={styles.headerActionButton}
              onPress={handleDeleteGroup}
              activeOpacity={0.7}
        >
              <FontAwesome name="trash" size={18} color="#E10600" />
        </TouchableOpacity>
          )}

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
          onScroll={(event) => {
            const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
            const paddingToBottom = 150; // Threshold in pixels (increased for better detection)
            
            // Calculate if we're at bottom
            const scrollPosition = contentOffset.y + layoutMeasurement.height;
            const contentHeight = contentSize.height;
            const isAtBottom = scrollPosition >= contentHeight - paddingToBottom || contentHeight <= layoutMeasurement.height;
            
            setIsScrolledToBottom(isAtBottom);
          }}
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
          onPress={() => {
            flatListRef.current?.scrollToEnd({ animated: true });
            setIsScrolledToBottom(true);
          }}
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
          
          {/* Text Input or Voice Recorder */}
          {!isRecordingVoice ? (
            <>
              <TextInput
                style={styles.textInput}
                value={newMessage}
                onChangeText={(text) => {
                  setNewMessage(text);
                  if (showAttachmentMenu) {
                    setShowAttachmentMenu(false);
                  }
                }}
                placeholder="Type your message..."
                placeholderTextColor={theme.colors.text.secondary}
                multiline
                maxLength={500}
              />

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
                    <FontAwesome name="send" size={16} color="white" />
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
                  <FontAwesome name="microphone" size={18} color={theme.colors.text.secondary} />
                </TouchableOpacity>
              )}
            </>
          ) : (
            <VoiceRecorder
              onRecordingComplete={async (uri, duration) => {
                if (!currentUserId || !group) return;
                
                setIsRecordingVoice(false);
                
                try {
                  setSending(true);
                  
                  // Upload audio to Cloudinary
                  const { cloudinaryService } = await import('../src/services/cloudinary.service.js');
                  const uploadResult = await cloudinaryService.uploadMedia(uri, {
                    folder: 'messages',
                    tags: ['message', 'audio', 'group'],
                    resource_type: 'auto',
                  });

                  // Send message with audio
                  await groupService.sendGroupMessage(
                    parseInt(groupId),
                    uploadResult.secure_url,
                    currentUserId,
                    'AUDIO',
                    replyingTo?.id
                  );
                  
                  // Reload messages
                  await loadMessages(true); // Force reload after sending voice message
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

      {/* Members Modal */}
      <Modal
        visible={showMembersModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => {
          setShowMembersModal(false);
          setShowAddMembers(false);
          setSearchQuery('');
          setSearchResults([]);
        }}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
          {/* Header */}
          <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' }}>
            <TouchableOpacity
              onPress={() => {
                if (showAddMembers) {
                  setShowAddMembers(false);
                  setSearchQuery('');
                  setSearchResults([]);
                } else {
                  setShowMembersModal(false);
                }
              }}
              >
              <FontAwesome name={showAddMembers ? "arrow-left" : "times"} size={24} color="#6A707C" />
            </TouchableOpacity>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginLeft: 16, flex: 1 }}>
              {showAddMembers ? 'Add Members' : 'Members'}
                    </Text>
            {!showAddMembers && canManageMembers && (
                  <TouchableOpacity
                onPress={() => setShowAddMembers(true)}
                style={{ padding: 8 }}
                  >
                <FontAwesome name="plus" size={20} color="#E10600" />
                  </TouchableOpacity>
            )}
            </View>

          {showAddMembers ? (
            /* Add Members View */
            <View style={{ flex: 1 }}>
              {/* Search Bar */}
              <View style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8 }}>
                  <FontAwesome name="search" size={16} color="#6A707C" />
              <TextInput
                    style={{ flex: 1, marginLeft: 8, fontSize: 16, color: '#1F2937' }}
                    placeholder="Search friends..."
                    placeholderTextColor="#9CA3AF"
                    value={searchQuery}
                    onChangeText={(text) => {
                      setSearchQuery(text);
                      searchFriends(text);
                    }}
                  />
                </View>
            </View>

              {/* Search Results */}
              <FlatList
                data={searchResults}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={{ flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' }}
                    onPress={() => handleAddMembers([item.id])}
                    disabled={addingMembers}
                  >
                    {item.profilePicturePublicId ? (
                      <CloudinaryAvatar publicId={item.profilePicturePublicId} size={40} />
                    ) : (
                      <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#D9D9D9', justifyContent: 'center', alignItems: 'center' }}>
                        <FontAwesome name="user" size={16} color="#6A707C" />
                      </View>
                    )}
                    <View style={{ marginLeft: 12, flex: 1 }}>
                      <Text style={{ fontSize: 16, fontWeight: '600' }}>{item.name}</Text>
                      <Text style={{ fontSize: 12, color: '#6A707C' }}>@{item.username}</Text>
                    </View>
                    {addingMembers ? (
                      <ActivityIndicator size="small" color="#E10600" />
                    ) : (
                      <FontAwesome name="plus-circle" size={24} color="#E10600" />
                    )}
                  </TouchableOpacity>
                )}
                ListEmptyComponent={
                  <View style={{ padding: 40, alignItems: 'center' }}>
                    <FontAwesome name="search" size={40} color="#D1D5DB" />
                    <Text style={{ marginTop: 16, fontSize: 16, color: '#6B7280' }}>
                      {searchQuery ? 'No friends found' : 'Search for friends to add'}
                    </Text>
                  </View>
                }
              />
            </View>
          ) : (
            /* Members List */
            <FlatList
              data={group.members}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => {
                const isOwner = item.user.id === group.owner?.id;
                const canRemove = canManageMembers && !isOwner && item.user.id !== currentUserId;
                
                // Get user status
                const userStatus = item.user.status || 'OFFLINE';
                
                // Determine if user is actually online (check lastSeenAt if status is ONLINE)
                let actualStatus = userStatus;
                if (userStatus === 'ONLINE' && item.user.lastSeenAt) {
                  const lastSeen = new Date(item.user.lastSeenAt);
                  const now = new Date();
                  const diffMinutes = (now.getTime() - lastSeen.getTime()) / (1000 * 60);
                  if (diffMinutes > 5) {
                    actualStatus = 'OFFLINE';
                  }
                }
                const finalStatusDisplay = actualStatus === 'ONLINE' 
                  ? UserStatusDisplay[UserStatus.ONLINE]
                  : UserStatusDisplay[UserStatus.OFFLINE];
                
                const handleNavigateToProfile = () => {
                  if (item.user.id) {
                    setShowMembersModal(false);
                    // Small delay to ensure modal closes before navigation
                    setTimeout(() => {
                      router.push({
                        pathname: '/userProfile',
                        params: { userId: item.user.id.toString() },
                      });
                    }, 100);
                  }
                };

                return (
                  <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' }}>
                    <TouchableOpacity
                      onPress={handleNavigateToProfile}
                      activeOpacity={0.7}
                      style={{ position: 'relative' }}
                    >
                      {item.user.profilePicturePublicId ? (
                        <CloudinaryAvatar publicId={item.user.profilePicturePublicId} size={40} />
                      ) : (
                        <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#D9D9D9', justifyContent: 'center', alignItems: 'center' }}>
                          <FontAwesome name="user" size={16} color="#6A707C" />
                        </View>
                      )}
                      {/* Status indicator */}
                      <View style={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        width: 12,
                        height: 12,
                        borderRadius: 6,
                        backgroundColor: finalStatusDisplay.color,
                        borderWidth: 2,
                        borderColor: '#FFFFFF',
                      }} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={handleNavigateToProfile}
                      activeOpacity={0.7}
                      style={{ marginLeft: 12, flex: 1 }}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <Text style={{ fontSize: 16, fontWeight: '600' }}>{item.user.name}</Text>
                        {isOwner && (
                          <View style={{ backgroundColor: '#E10600', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 }}>
                            <Text style={{ fontSize: 10, color: '#FFFFFF', fontWeight: '600' }}>Owner</Text>
                          </View>
                        )}
                      </View>
                      <Text style={{ fontSize: 12, color: finalStatusDisplay.color }}>
                        {finalStatusDisplay.label}
                      </Text>
                    </TouchableOpacity>
                    {canRemove && (
                      <TouchableOpacity
                        onPress={() => handleRemoveMember(item.user.id, item.user.name)}
                        disabled={removingMember === item.user.id}
                        style={{ padding: 8 }}
                      >
                        {removingMember === item.user.id ? (
                          <ActivityIndicator size="small" color="#E10600" />
                        ) : (
                          <FontAwesome name="times-circle" size={24} color="#E10600" />
                        )}
                      </TouchableOpacity>
                    )}
                  </View>
                );
              }}
              ListEmptyComponent={
                <View style={{ padding: 40, alignItems: 'center' }}>
                  <FontAwesome name="users" size={40} color="#D1D5DB" />
                  <Text style={{ marginTop: 16, fontSize: 16, color: '#6B7280' }}>No members</Text>
                </View>
              }
            />
          )}
        </SafeAreaView>
      </Modal>

      {/* Invite Modal */}
      <Modal
        visible={showInviteModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowInviteModal(false)}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' }}>
            <TouchableOpacity onPress={() => setShowInviteModal(false)}>
              <FontAwesome name="times" size={24} color="#6A707C" />
            </TouchableOpacity>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginLeft: 16, flex: 1 }}>Invite Members</Text>
          </View>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
            {!inviteCode ? (
              <>
                <FontAwesome name="user-plus" size={48} color="#E10600" />
                <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 16, marginBottom: 8 }}>Invite people to join {group.name}</Text>
                <Text style={{ fontSize: 14, color: '#6A707C', textAlign: 'center', marginBottom: 24 }}>
                  Create an invite link to allow other users to join this group
                </Text>
                <TouchableOpacity
                  style={{ backgroundColor: '#E10600', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 }}
                  onPress={createInvite}
                >
                  <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '600' }}>Create Invite</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>Invite link created!</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6', padding: 16, borderRadius: 8, marginBottom: 16, width: '100%' }}>
                  <Text style={{ flex: 1, fontSize: 16 }}>{inviteCode}</Text>
                  <TouchableOpacity onPress={() => Alert.alert('Copied!', 'Invite code copied to clipboard')}>
                    <FontAwesome name="copy" size={16} color="#E10600" />
                  </TouchableOpacity>
                </View>
                <Text style={{ fontSize: 14, color: '#6A707C', textAlign: 'center' }}>
                  Share this code with people you want to invite
                </Text>
              </>
            )}
          </View>
        </SafeAreaView>
      </Modal>

      {/* Attachment Menu */}
      <AttachmentMenu
        visible={showAttachmentMenu}
        onClose={() => setShowAttachmentMenu(false)}
        groupId={groupId}
        onPhotosSelected={async (media, caption) => {
          if (!currentUserId || !group) return;
          
          try {
            setSending(true);
            const groupIdNum = parseInt(groupId);
            
            // Group all media into a single message as JSON array
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
            await groupService.sendGroupMessage(
              groupIdNum,
              content,
              currentUserId,
              'IMAGE',
              replyingTo?.id
            );
            
            // Reload messages
            await loadMessages(true); // Force reload after sending media
          } catch (error: any) {
            console.error('Error sending media:', error);
            Alert.alert('Error', error.response?.data?.error || 'Failed to send media');
          } finally {
            setSending(false);
          }
        }}
        onCameraSelected={async (media, caption) => {
          if (!currentUserId || !group) return;
          
          try {
            setSending(true);
            const groupIdNum = parseInt(groupId);
            
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
            
            await groupService.sendGroupMessage(
              groupIdNum,
              content,
              currentUserId,
              'IMAGE',
              replyingTo?.id
            );
            
            // Reload messages
            await loadMessages(true); // Force reload after sending camera image
          } catch (error: any) {
            console.error('Error sending camera image:', error);
            Alert.alert('Error', error.response?.data?.error || 'Failed to send image');
          } finally {
            setSending(false);
          }
        }}
        onLocationSelected={async () => {
          if (!currentUserId || !group) return;
          
          try {
            // Request location permission and get current position
            const { requestForegroundPermissionsAsync, getCurrentPositionAsync } = await import('expo-location');
            
            // Request permission
            const { status } = await requestForegroundPermissionsAsync();
            if (status !== 'granted') {
              Alert.alert(
                'Permission refusée',
                'L\'accès à la localisation est nécessaire pour partager votre position.',
                [{ text: 'OK' }]
              );
              return;
            }

            setSending(true);
            const groupIdNum = parseInt(groupId);
            
            // Get current position
            const location = await getCurrentPositionAsync({
              accuracy: 6, // High accuracy
            });

            // Try to get address from coordinates (reverse geocoding)
            let address: string | undefined;
            try {
              const { reverseGeocodeAsync } = await import('expo-location');
              const [result] = await reverseGeocodeAsync({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              });
              
              // Format address
              const addressParts = [];
              if (result.street) addressParts.push(result.street);
              if (result.city) addressParts.push(result.city);
              if (result.postalCode) addressParts.push(result.postalCode);
              if (result.country) addressParts.push(result.country);
              address = addressParts.join(', ') || undefined;
            } catch {
              console.log('Reverse geocoding failed, continuing without address');
            }

            // Create location data
            const locationData: LocationData = {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              address: address,
            };

            // Send message with location
            const locationMessage = `LOCATION:${JSON.stringify(locationData)}`;
            await groupService.sendGroupMessage(
              groupIdNum,
              locationMessage,
              currentUserId,
              'TEXT',
              replyingTo?.id
            );
            
            // Reload messages
            await loadMessages(true); // Force reload after sending location
          } catch (error: any) {
            console.error('Error sending location:', error);
            Alert.alert('Error', error.response?.data?.error || error.message || 'Failed to send location');
          } finally {
            setSending(false);
          }
        }}
        onContactSelected={async (contact) => {
          if (!currentUserId || !group) return;
          
          try {
            setSending(true);
            const groupIdNum = parseInt(groupId);
            
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
            
            await groupService.sendGroupMessage(
              groupIdNum,
              contactMessage,
              currentUserId,
              'TEXT',
              replyingTo?.id
            );
            
            // Reload messages
            await loadMessages(true); // Force reload after sending contact
          } catch (error: any) {
            console.error('Error sending contact:', error);
            Alert.alert('Error', error.response?.data?.error || 'Failed to send contact');
          } finally {
            setSending(false);
          }
        }}
        onDocumentSelected={async () => {
          if (!currentUserId || !group) return;
          
          try {
            // Open native document picker directly
            const result = await DocumentPicker.getDocumentAsync({
              type: '*/*',
              copyToCacheDirectory: true,
              multiple: false,
            });

            if (result.canceled) {
              return;
            }

            const document = result.assets[0];
            
            if (!document.uri) {
              Alert.alert('Error', 'Failed to access document');
              return;
            }

            // Security validation
            const { validateFileSafety } = await import('../src/utils/fileSecurity.js');
            const validation = validateFileSafety(document.name || 'document', document.mimeType);
            
            if (!validation.isValid) {
              Alert.alert(
                'Security Error',
                validation.error || 'This file type is not allowed for security reasons.',
                [{ text: 'OK' }]
              );
              return;
            }

            // Verify file exists and has content before uploading (same checks as download)
            const FileSystem = await import('expo-file-system');
            const fileInfo = await FileSystem.getInfoAsync(document.uri);
            
            if (!fileInfo.exists) {
              Alert.alert('Error', 'File does not exist at the provided location');
              return;
            }
            
            if (!fileInfo.size || fileInfo.size === 0) {
              Alert.alert('Error', 'File is empty (0 bytes). Please select a valid file.');
              return;
            }
            
            // Verify file size matches what DocumentPicker reported
            if (document.size && fileInfo.size !== document.size) {
              console.warn(`File size mismatch: DocumentPicker reported ${document.size}, FileSystem reports ${fileInfo.size}`);
            }
            
            console.log('📄 Document file info:', {
              uri: document.uri,
              name: document.name,
              size: fileInfo.size,
              reportedSize: document.size,
              mimeType: document.mimeType,
            });

            setSending(true);
            const groupIdNum = parseInt(groupId);
            
            // Upload document to Cloudinary
            const { cloudinaryService } = await import('../src/services/cloudinary.service.js');
            
            // Clean filename for Cloudinary public_id (remove special chars, keep extension)
            const originalName = document.name || 'document';
            const nameParts = originalName.split('.');
            nameParts.pop(); // Remove extension
            const baseName = nameParts.join('.').replace(/[^a-zA-Z0-9._-]/g, '_') || 'document';
            const cleanPublicId = `${baseName}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
            
            const uploadResult = await cloudinaryService.uploadMedia(document.uri, {
              folder: 'messages/documents',
              tags: ['message', 'document'],
              resource_type: 'raw', // Use 'raw' for documents
              public_id: cleanPublicId, // Use cleaned original filename
            });

            // Create document data
            const documentData: DocumentData = {
              name: document.name || 'document',
              uri: document.uri,
              secureUrl: uploadResult.secure_url,
              publicId: uploadResult.public_id,
              mimeType: document.mimeType,
              size: document.size,
            };

            // Send message with document
            const documentMessage = `DOCUMENT:${JSON.stringify(documentData)}`;
            await groupService.sendGroupMessage(
              groupIdNum,
              documentMessage,
              currentUserId,
              'FILE',
              replyingTo?.id
            );
            
            // Reload messages
            await loadMessages(true); // Force reload after sending document
          } catch (error: any) {
            console.error('Error sending document:', error);
            Alert.alert('Error', error.response?.data?.error || error.message || 'Failed to send document');
          } finally {
            setSending(false);
          }
        }}
        onPollSelected={async (poll: PollData) => {
          if (!currentUserId || !group) return;
          
          try {
            setSending(true);
            const groupIdNum = parseInt(groupId);
            
            // Send poll as JSON with special prefix to identify it
            const pollMessage = `POLL:${JSON.stringify(poll)}`;
            
            await groupService.sendGroupMessage(
              groupIdNum,
              pollMessage,
              currentUserId,
              'TEXT',
              replyingTo?.id
            );
            
            // Reload messages
            await loadMessages(true); // Force reload after sending poll
          } catch (error: any) {
            console.error('Error sending poll:', error);
            Alert.alert('Error', error.response?.data?.error || 'Failed to send poll');
          } finally {
            setSending(false);
          }
        }}
        onAppointmentSelected={() => {
          setShowAppointmentCreator(true);
        }}
      />

      {/* Poll Creator for editing */}
      <PollCreator
        visible={showPollCreator}
        onSend={async (poll: PollData) => {
          if (!currentUserId || !group) return;
          
          try {
            setSending(true);
            const groupIdNum = parseInt(groupId);
            
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
              await groupService.sendGroupMessage(
                groupIdNum,
                pollMessage,
                currentUserId,
                'TEXT',
                replyingTo?.id
              );
              await loadMessages(true); // Force reload after updating message
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

      {/* Appointment Creator Modal */}
      <AppointmentCreator
        visible={showAppointmentCreator}
        onSend={async (appointment: AppointmentData) => {
          if (!currentUserId || !group) return;
          
          try {
            setSending(true);
            const groupIdNum = parseInt(groupId);
            
            // If editing, we need to update the existing message
            if (editingMessage && editingMessage.content.startsWith('APPOINTMENT:')) {
              const appointmentMessage = `APPOINTMENT:${JSON.stringify(appointment)}`;
              const updatedMessage = await chatService.updateMessage(
                editingMessage.id,
                appointmentMessage,
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
              setEditingAppointment(null);
              setShowAppointmentCreator(false);
            } else {
              // Send as new appointment
              const appointmentMessage = `APPOINTMENT:${JSON.stringify(appointment)}`;
              await groupService.sendGroupMessage(
                groupIdNum,
                appointmentMessage,
                currentUserId,
                'TEXT',
                replyingTo?.id
              );
              await loadMessages(true); // Force reload after updating message
            }
          } catch (error: any) {
            console.error('Error saving appointment:', error);
            Alert.alert('Error', error.response?.data?.error || 'Failed to save appointment');
          } finally {
            setSending(false);
            setShowAppointmentCreator(false);
            setEditingAppointment(null);
            setEditingMessage(null);
          }
        }}
        onCancel={() => {
          setShowAppointmentCreator(false);
          setEditingAppointment(null);
          setEditingMessage(null);
        }}
        initialData={editingAppointment || undefined}
      />

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
