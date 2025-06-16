import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import theme from '../src/styles/config/theme';
import { conversationScreenStyles as styles } from '../src/styles/screens';

// Types pour les messages
interface User {
  id: number;
  name: string;
  username: string;
  profilePicture?: string;
  isVerify: boolean;
}

interface Message {
  id: number;
  content: string;
  sender: User;
  createdAt: string;
  isOwn: boolean;
}

// Données mockées pour les messages d'une conversation
const mockMessages: Message[] = [
  {
    id: 1,
    content: 'Salut ! Prêt pour la course de demain ?',
    sender: {
      id: 2,
      name: 'Marc Dubois',
      username: 'marc.racing',
      profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      isVerify: true
    },
    createdAt: '2024-01-15T10:30:00Z',
    isOwn: false
  },
  {
    id: 2,
    content: 'Absolument ! J\'ai fait quelques tours d\'entraînement hier, mes chronos sont plutôt bons 🏁',
    sender: {
      id: 1,
      name: 'Moi',
      username: 'me',
      isVerify: false
    },
    createdAt: '2024-01-15T10:32:00Z',
    isOwn: true
  },
  {
    id: 3,
    content: 'Super ! Quel est ton meilleur temps sur ce circuit ?',
    sender: {
      id: 2,
      name: 'Marc Dubois',
      username: 'marc.racing',
      profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      isVerify: true
    },
    createdAt: '2024-01-15T10:35:00Z',
    isOwn: false
  },
  {
    id: 4,
    content: 'J\'ai réussi un 1:24.567 hier ! Mon objectif pour demain c\'est de passer sous les 1:24',
    sender: {
      id: 1,
      name: 'Moi',
      username: 'me',
      isVerify: false
    },
    createdAt: '2024-01-15T10:37:00Z',
    isOwn: true
  },
  {
    id: 5,
    content: 'Excellent temps ! Ça va être serré, moi j\'ai fait 1:24.234 🔥',
    sender: {
      id: 2,
      name: 'Marc Dubois',
      username: 'marc.racing',
      profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      isVerify: true
    },
    createdAt: '2024-01-15T10:40:00Z',
    isOwn: false
  },
  {
    id: 6,
    content: 'Wow ! Quel est ton secret ? Tu as modifié quelque chose sur ta voiture ?',
    sender: {
      id: 1,
      name: 'Moi',
      username: 'me',
      isVerify: false
    },
    createdAt: '2024-01-15T10:42:00Z',
    isOwn: true
  }
];

export default function ConversationScreen() {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const [loading] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const conversationName = params.conversationName as string || 'Conversation';

  // Faire défiler vers le bas quand de nouveaux messages arrivent
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  // Fonction pour envoyer un message
  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const messageContent = newMessage.trim();
    setNewMessage('');
    
    // Créer un nouveau message mocké
    const newMsg: Message = {
      id: Date.now(),
      content: messageContent,
      sender: {
        id: 1,
        name: 'Moi',
        username: 'me',
        isVerify: false
      },
      createdAt: new Date().toISOString(),
      isOwn: true
    };

    // Ajouter le message à la liste
    setMessages(prev => [...prev, newMsg]);

    // Simuler une réponse automatique (pour demo)
    setTimeout(() => {
      const autoReply: Message = {
        id: Date.now() + 1,
        content: 'Message reçu ! 👍',
        sender: {
          id: 2,
          name: 'Marc Dubois',
          username: 'marc.racing',
          profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
          isVerify: true
        },
        createdAt: new Date().toISOString(),
        isOwn: false
      };
      setMessages(prev => [...prev, autoReply]);
    }, 2000);
  };

  // Fonction pour formater l'heure
  const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Rendu d'un message
  const renderMessage = ({ item, index }: { item: Message; index: number }) => {
    const isOwn = item.isOwn;
    const showAvatar = !isOwn && (index === 0 || messages[index - 1]?.sender.id !== item.sender.id);
    const showTime = index === messages.length - 1 || 
                    messages[index + 1]?.sender.id !== item.sender.id ||
                    (new Date(messages[index + 1]?.createdAt).getTime() - new Date(item.createdAt).getTime()) > 300000; // 5 min

    return (
      <View style={[styles.messageContainer, isOwn && styles.ownMessageContainer]}>
        {/* Avatar pour les messages des autres */}
        {showAvatar && (
          <View style={styles.avatarContainer}>
            {item.sender.profilePicture ? (
              <Image source={{ uri: item.sender.profilePicture }} style={styles.messageAvatar} />
            ) : (
              <View style={[styles.messageAvatar, styles.defaultMessageAvatar]}>
                <FontAwesome name="user" size={16} color={theme.colors.text.secondary} />
              </View>
            )}
          </View>
        )}
        
        {/* Message */}
        <View style={[
          styles.messageBubble, 
          isOwn ? styles.ownMessageBubble : styles.otherMessageBubble,
          !showAvatar && !isOwn && styles.messageWithoutAvatar
        ]}>
          <Text style={[styles.messageText, isOwn && styles.ownMessageText]}>
            {item.content}
          </Text>
        </View>

        {/* Heure */}
        {showTime && (
          <Text style={[styles.messageTime, isOwn && styles.ownMessageTime]}>
            {formatTime(item.createdAt)}
          </Text>
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
          <FontAwesome name="arrow-left" size={20} color="#E10600" />
        </TouchableOpacity>
        
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {conversationName}
          </Text>
          <Text style={styles.headerSubtitle}>En ligne</Text>
        </View>

        <TouchableOpacity style={styles.moreButton}>
          <FontAwesome name="ellipsis-v" size={16} color={theme.colors.text.secondary} />
        </TouchableOpacity>
      </View>

      {/* Liste des messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.messagesContainer}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      {/* Zone de saisie */}
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.textInput}
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Tapez votre message..."
            placeholderTextColor={theme.colors.text.secondary}
            multiline
            maxLength={500}
          />
          
          <TouchableOpacity
            style={[styles.sendButton, newMessage.trim() && styles.sendButtonActive]}
            onPress={sendMessage}
            disabled={!newMessage.trim() || loading}
          >
            <FontAwesome 
              name="send" 
              size={16} 
              color={newMessage.trim() ? 'white' : theme.colors.text.secondary} 
            />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
} 