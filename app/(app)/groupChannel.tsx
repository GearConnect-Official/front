import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Pressable,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CloudinaryAvatar } from '../src/components/media/CloudinaryImage';
import { groupChannelScreenStyles as styles } from '../src/styles/screens/groups';

// Types pour les messages du channel
interface ChannelMessage {
  id: number;
  content: string;
  sender: {
    id: number;
    name: string;
    username: string;
    profilePicture?: string;
    profilePicturePublicId?: string;
    isVerify: boolean;
  };
  messageType: 'TEXT' | 'IMAGE' | 'FILE' | 'SYSTEM';
  isEdited: boolean;
  isPinned: boolean;
  replyTo?: {
    id: number;
    content: string;
    sender: {
      name: string;
      username: string;
    };
  };
  reactions: {
    emoji: string;
    count: number;
    users: { id: number; name: string }[];
  }[];
  createdAt: string;
  updatedAt: string;
}

const GroupChannelScreen: React.FC = () => {
  const router = useRouter();
  const { groupId, channelId, channelName, channelType } = useLocalSearchParams();
  const [messages, setMessages] = useState<ChannelMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [replyingTo, setReplyingTo] = useState<ChannelMessage | null>(null);
  const flatListRef = useRef<FlatList>(null);

  // Données mockées pour le développement
  const mockMessages: ChannelMessage[] = [
    {
      id: 1,
      content: 'Salut tout le monde ! Quelqu\'un a vu la course d\'hier ?',
      sender: {
        id: 1,
        name: 'Marc Dubois',
        username: 'marc.racing',
        profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        isVerify: true,
      },
      messageType: 'TEXT',
      isEdited: false,
      isPinned: false,
      reactions: [
        { emoji: '🏎️', count: 3, users: [{ id: 2, name: 'Sarah' }, { id: 3, name: 'Antoine' }] },
        { emoji: '👍', count: 1, users: [{ id: 4, name: 'Julien' }] }
      ],
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z'
    },
    {
      id: 2,
      content: 'Oui ! Hamilton a fait une remontée incroyable 🔥',
      sender: {
        id: 2,
        name: 'Sarah Martin',
        username: 'sarah.speed',
        profilePicture: 'https://images.unsplash.com/photo-1494790108755-2616b612b0bd?w=150&h=150&fit=crop&crop=face',
        isVerify: true,
      },
      messageType: 'TEXT',
      isEdited: false,
      isPinned: false,
      replyTo: {
        id: 1,
        content: 'Salut tout le monde ! Quelqu\'un a vu la course d\'hier ?',
        sender: {
          name: 'Marc Dubois',
          username: 'marc.racing'
        }
      },
      reactions: [
        { emoji: '🔥', count: 5, users: [] }
      ],
      createdAt: '2024-01-15T10:32:00Z',
      updatedAt: '2024-01-15T10:32:00Z'
    },
    {
      id: 3,
      content: 'J\'ai hâte de voir le prochain GP ! 🏆',
      sender: {
        id: 3,
        name: 'Antoine Leclerc',
        username: 'antoine.f1',
        profilePicture: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
        isVerify: true,
      },
      messageType: 'TEXT',
      isEdited: true,
      isPinned: false,
      reactions: [],
      createdAt: '2024-01-15T10:35:00Z',
      updatedAt: '2024-01-15T10:36:00Z'
    },
    {
      id: 4,
      content: 'Antoine Leclerc a rejoint le channel',
      sender: {
        id: 0,
        name: 'Système',
        username: 'system',
        isVerify: false,
      },
      messageType: 'SYSTEM',
      isEdited: false,
      isPinned: false,
      reactions: [],
      createdAt: '2024-01-15T08:00:00Z',
      updatedAt: '2024-01-15T08:00:00Z'
    }
  ];

  useEffect(() => {
    loadMessages();
  }, [channelId]);

  const loadMessages = async () => {
    try {
      setLoading(true);
      // TODO: Remplacer par l'appel API réel
      // const response = await fetch(`/api/groups/${groupId}/channels/${channelId}/messages`);
      // const data = await response.json();
      // setMessages(data.messages);
      
      // Simuler un délai de chargement
      setTimeout(() => {
        setMessages(mockMessages.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()));
        setLoading(false);
        // Scroll to bottom after loading
        setTimeout(() => scrollToBottom(), 100);
      }, 800);
    } catch (error) {
      console.error('Error loading messages:', error);
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    setSending(true);
    try {
      const messageContent = newMessage.trim();
      setNewMessage('');
      setReplyingTo(null);

      // TODO: Appel API pour envoyer le message
      console.log('Sending message:', {
        content: messageContent,
        replyToId: replyingTo?.id || null
      });

      // Simuler l'envoi du message
      const newMsg: ChannelMessage = {
        id: messages.length + 1,
        content: messageContent,
        sender: {
          id: 999, // ID de l'utilisateur connecté
          name: 'Moi',
          username: 'current_user',
          isVerify: false,
        },
        messageType: 'TEXT',
        isEdited: false,
        isPinned: false,
        replyTo: replyingTo ? {
          id: replyingTo.id,
          content: replyingTo.content,
          sender: replyingTo.sender
        } : undefined,
        reactions: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setMessages(prev => [...prev, newMsg]);
      setSending(false);
      
      // Scroll to bottom after sending
      setTimeout(() => scrollToBottom(), 100);
    } catch (error) {
      console.error('Error sending message:', error);
      setSending(false);
      Alert.alert('Erreur', 'Impossible d\'envoyer le message');
    }
  };

  const addReaction = (messageId: number, emoji: string) => {
    // TODO: Appel API pour ajouter une réaction
    console.log('Adding reaction:', { messageId, emoji });
    
    setMessages(prev => prev.map(message => {
      if (message.id === messageId) {
        const existingReaction = message.reactions.find(r => r.emoji === emoji);
        if (existingReaction) {
          // Increment count
          return {
            ...message,
            reactions: message.reactions.map(r => 
              r.emoji === emoji ? { ...r, count: r.count + 1 } : r
            )
          };
        } else {
          // Add new reaction
          return {
            ...message,
            reactions: [...message.reactions, { emoji, count: 1, users: [] }]
          };
        }
      }
      return message;
    }));
  };

  const replyToMessage = (message: ChannelMessage) => {
    setReplyingTo(message);
  };

  const cancelReply = () => {
    setReplyingTo(null);
  };

  const scrollToBottom = () => {
    flatListRef.current?.scrollToEnd({ animated: true });
  };

  const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Aujourd\'hui';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Hier';
    } else {
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    }
  };

  const getChannelIcon = (type: string) => {
    switch (type) {
      case 'VOICE':
        return 'volume-up';
      case 'ANNOUNCEMENT':
        return 'bullhorn';
      default:
        return 'hashtag';
    }
  };

  const renderMessage = ({ item, index }: { item: ChannelMessage; index: number }) => {
    const isSystemMessage = item.messageType === 'SYSTEM';
    const previousMessage = index > 0 ? messages[index - 1] : null;
    const showDate = !previousMessage || 
      formatDate(item.createdAt) !== formatDate(previousMessage.createdAt);

    return (
      <View>
        {showDate && (
          <View style={styles.dateSeparator}>
            <View style={styles.dateLine} />
            <Text style={styles.dateText}>
              {formatDate(item.createdAt)}
            </Text>
            <View style={styles.dateLine} />
          </View>
        )}

        {isSystemMessage ? (
          <View style={styles.systemMessage}>
            <FontAwesome name="info-circle" size={14} color="#6A707C" />
            <Text style={styles.systemMessageText}>
              {item.content}
            </Text>
            <Text style={styles.systemMessageTime}>
              {formatTime(item.createdAt)}
            </Text>
          </View>
        ) : (
          <View style={styles.messageContainer}>
            {/* Reply preview */}
            {item.replyTo && (
              <View style={styles.replyContainer}>
                <View style={styles.replyLine} />
                <Text style={styles.replyText}>
                  <Text style={styles.replyAuthor}>
                    {item.replyTo.sender.name}
                  </Text>
                  {' '}
                  <Text numberOfLines={1}>
                    {item.replyTo.content}
                  </Text>
                </Text>
              </View>
            )}

            <View style={styles.messageContent}>
              <View style={styles.messageAvatar}>
                {item.sender.profilePicturePublicId ? (
                  <CloudinaryAvatar
                    publicId={item.sender.profilePicturePublicId}
                    size={36}
                    style={styles.avatar}
                  />
                ) : item.sender.profilePicture ? (
                  <Image source={{ uri: item.sender.profilePicture }} style={styles.avatar} />
                ) : (
                  <View style={[styles.avatar, styles.defaultAvatar]}>
                    <FontAwesome name="user" size={14} color="#6A707C" />
                  </View>
                )}
              </View>

              <View style={styles.messageBody}>
                <View style={styles.messageHeader}>
                  <Text style={styles.senderName}>
                    {item.sender.name}
                  </Text>
                  {item.sender.isVerify && (
                    <FontAwesome name="check-circle" size={12} color="#E10600" />
                  )}
                  <Text style={styles.messageTime}>
                    {formatTime(item.createdAt)}
                  </Text>
                  {item.isEdited && (
                    <Text style={styles.editedLabel}>
                      (modifié)
                    </Text>
                  )}
                  {item.isPinned && (
                    <FontAwesome name="thumb-tack" size={10} color="#F59E0B" />
                  )}
                </View>

                <Pressable
                  onLongPress={() => replyToMessage(item)}
                  style={styles.messageTextContainer}
                >
                  <Text style={styles.messageText}>
                    {item.content}
                  </Text>
                </Pressable>

                {/* Reactions */}
                {item.reactions.length > 0 && (
                  <View style={styles.reactionsContainer}>
                    {item.reactions.map((reaction, idx) => (
                      <TouchableOpacity
                        key={idx}
                        style={styles.reactionButton}
                        onPress={() => addReaction(item.id, reaction.emoji)}
                      >
                        <Text style={styles.reactionEmoji}>
                          {reaction.emoji}
                        </Text>
                        <Text style={styles.reactionCount}>
                          {reaction.count}
                        </Text>
                      </TouchableOpacity>
                    ))}
                    
                    {/* Add reaction button */}
                    <TouchableOpacity
                      style={styles.addReactionButton}
                      onPress={() => {
                        // Show emoji picker - for now just add a random emoji
                        const emojis = ['👍', '❤️', '😂', '😮', '😢', '😡', '🏎️', '🏆', '🔥'];
                        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
                        addReaction(item.id, randomEmoji);
                      }}
                    >
                      <FontAwesome name="plus" size={12} color="#6A707C" />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          </View>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Chargement des messages...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <FontAwesome name="arrow-left" size={20} color="#6A707C" />
        </TouchableOpacity>
        
        <View style={styles.channelInfo}>
          <FontAwesome 
            name={getChannelIcon(channelType as string)} 
            size={18} 
            color="#6A707C" 
          />
          <Text style={styles.channelName}>
            {channelName}
          </Text>
        </View>

        <TouchableOpacity style={styles.headerButton}>
          <FontAwesome name="users" size={18} color="#6A707C" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.headerButton}
          onPress={() => router.push({
            pathname: '/(app)/groupDetail',
            params: { 
              groupId: groupId as string,
              groupName: channelName as string
            }
          })}
        >
          <FontAwesome name="cog" size={18} color="#6A707C" />
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <KeyboardAvoidingView 
        style={styles.chatContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollToBottom()}
        />

        {/* Reply preview */}
        {replyingTo && (
          <View style={styles.replyPreview}>
            <View style={styles.replyPreviewContent}>
              <Text style={styles.replyPreviewLabel}>
                Répondre à {replyingTo.sender.name}
              </Text>
              <Text style={styles.replyPreviewText} numberOfLines={2}>
                {replyingTo.content}
              </Text>
            </View>
            <TouchableOpacity onPress={cancelReply}>
              <FontAwesome name="times" size={16} color="#6A707C" />
            </TouchableOpacity>
          </View>
        )}

        {/* Message input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.messageInput}
            placeholder={`Écrire dans ${channelName}`}
            value={newMessage}
            onChangeText={setNewMessage}
            multiline
            maxLength={2000}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              (!newMessage.trim() || sending) && styles.sendButtonDisabled
            ]}
            onPress={sendMessage}
            disabled={!newMessage.trim() || sending}
          >
            <FontAwesome 
              name={sending ? "circle-o-notch" : "paper-plane"} 
              size={16} 
              color={(!newMessage.trim() || sending) ? "#9CA3AF" : "#E10600"} 
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default GroupChannelScreen; 