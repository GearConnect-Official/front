import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import theme from '../src/styles/config/theme';
import { messagesScreenStyles as styles } from '../src/styles/screens';

// Types pour les données mockées
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
}

interface Conversation {
  id: number;
  name?: string;
  isGroup: boolean;
  participants: { user: User }[];
  messages: Message[];
  updatedAt: string;
}

// Données mockées pour les conversations
const mockConversations: Conversation[] = [
  {
    id: 1,
    isGroup: false,
    participants: [
      {
        user: {
          id: 2,
          name: 'Marc Dubois',
          username: 'marc.racing',
          profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
          isVerify: true
        }
      }
    ],
    messages: [
      {
        id: 1,
        content: 'Salut ! Prêt pour la course de demain ?',
        sender: {
          id: 2,
          name: 'Marc Dubois',
          username: 'marc.racing',
          isVerify: true
        },
        createdAt: '2024-01-15T10:30:00Z'
      }
    ],
    updatedAt: '2024-01-15T10:30:00Z'
  },
  {
    id: 2,
    name: 'Équipe Karting Pro',
    isGroup: true,
    participants: [
      {
        user: {
          id: 3,
          name: 'Sarah Martin',
          username: 'sarah.speed',
          profilePicture: 'https://images.unsplash.com/photo-1494790108755-2616b612b0bd?w=150&h=150&fit=crop&crop=face',
          isVerify: true
        }
      },
      {
        user: {
          id: 4,
          name: 'Julien Moreau',
          username: 'julien.pilot',
          profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
          isVerify: false
        }
      }
    ],
    messages: [
      {
        id: 2,
        content: 'Nouveau chrono sur le circuit de Nogaro !',
        sender: {
          id: 3,
          name: 'Sarah Martin',
          username: 'sarah.speed',
          isVerify: true
        },
        createdAt: '2024-01-15T09:15:00Z'
      }
    ],
    updatedAt: '2024-01-15T09:15:00Z'
  },
  {
    id: 3,
    isGroup: false,
    participants: [
      {
        user: {
          id: 5,
          name: 'Antoine Leclerc',
          username: 'antoine.f1',
          profilePicture: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
          isVerify: true
        }
      }
    ],
    messages: [
      {
        id: 3,
        content: 'Félicitations pour ta performance ! 🏆',
        sender: {
          id: 5,
          name: 'Antoine Leclerc',
          username: 'antoine.f1',
          isVerify: true
        },
        createdAt: '2024-01-14T16:45:00Z'
      }
    ],
    updatedAt: '2024-01-14T16:45:00Z'
  }
];

export default function MessagesScreen() {
  const [conversations] = useState<Conversation[]>(mockConversations);
  const [loading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  // Fonction pour gérer le rafraîchissement
  const onRefresh = async () => {
    setRefreshing(true);
    // Simuler un délai pour le rafraîchissement
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  // Fonction pour naviguer vers une conversation
  const openConversation = (conversation: Conversation) => {
    router.push({
      pathname: '/(app)/conversation',
      params: { 
        conversationId: conversation.id.toString(),
        conversationName: conversation.isGroup ? conversation.name : getConversationName(conversation)
      }
    });
  };

  // Fonction pour obtenir le nom d'une conversation
  const getConversationName = (conversation: Conversation): string => {
    if (conversation.isGroup) {
      return conversation.name || 'Groupe';
    }
    return conversation.participants[0]?.user.name || 'Utilisateur';
  };

  // Fonction pour obtenir l'image de profil d'une conversation
  const getConversationImage = (conversation: Conversation): string | undefined => {
    if (conversation.isGroup) {
      return undefined; // Pas d'image pour les groupes pour l'instant
    }
    return conversation.participants[0]?.user.profilePicture;
  };

  // Fonction pour formater la date
  const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return 'Aujourd\'hui';
    } else if (diffDays === 2) {
      return 'Hier';
    } else if (diffDays <= 7) {
      return `Il y a ${diffDays - 1} jours`;
    } else {
      return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
    }
  };

  // Rendu d'un élément de conversation
  const renderConversationItem = ({ item }: { item: Conversation }) => {
    const lastMessage = item.messages[0];
    const conversationName = getConversationName(item);
    const conversationImage = getConversationImage(item);

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
        </View>

        <View style={styles.conversationInfo}>
          <View style={styles.conversationHeader}>
            <Text style={styles.conversationName} numberOfLines={1}>
              {conversationName}
              {!item.isGroup && item.participants[0]?.user.isVerify && (
                <Text> </Text>
              )}
              {!item.isGroup && item.participants[0]?.user.isVerify && (
                <FontAwesome name="check-circle" size={14} color="#E10600" />
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
                : 'Aucun message'
              }
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // Action pour démarrer une nouvelle conversation
  const startNewConversation = () => {
    router.push('/(app)/newConversation');
  };

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
        <Text style={styles.headerTitle}>Messages</Text>
        <TouchableOpacity
          style={styles.newMessageButton}
          onPress={startNewConversation}
        >
          <FontAwesome name="edit" size={20} color="#E10600" />
        </TouchableOpacity>
      </View>

      {/* Liste des conversations */}
      <FlatList
        data={conversations}
        renderItem={renderConversationItem}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      {/* État de chargement */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#E10600" />
        </View>
      )}
    </View>
  );
} 