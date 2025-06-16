import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
  Switch
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import theme from '../src/styles/config/theme';
import { newConversationScreenStyles as styles } from '../src/styles/screens';

// Types pour les utilisateurs
interface User {
  id: number;
  name: string;
  username: string;
  profilePicture?: string;
  isVerify: boolean;
  description?: string;
}

// Données mockées d'utilisateurs pour la recherche
const mockUsers: User[] = [
  {
    id: 2,
    name: 'Marc Dubois',
    username: 'marc.racing',
    profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    isVerify: true,
    description: 'Pilote de karting professionnel'
  },
  {
    id: 3,
    name: 'Sarah Martin',
    username: 'sarah.speed',
    profilePicture: 'https://images.unsplash.com/photo-1494790108755-2616b612b0bd?w=150&h=150&fit=crop&crop=face',
    isVerify: true,
    description: 'Championne F3 2023'
  },
  {
    id: 4,
    name: 'Julien Moreau',
    username: 'julien.pilot',
    profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    isVerify: false,
    description: 'Passionné de course automobile'
  },
  {
    id: 5,
    name: 'Antoine Leclerc',
    username: 'antoine.f1',
    profilePicture: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    isVerify: true,
    description: 'Ingénieur mécanique et pilote'
  },
  {
    id: 6,
    name: 'Camille Rousseau',
    username: 'camille.drift',
    profilePicture: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    isVerify: false,
    description: 'Spécialiste drift et circuit'
  },
  {
    id: 7,
    name: 'Thomas Bernard',
    username: 'thomas.endurance',
    profilePicture: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
    isVerify: true,
    description: 'Pilote d\'endurance Le Mans'
  }
];

export default function NewConversationScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [isGroupChat, setIsGroupChat] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const router = useRouter();

  // Fonction de recherche d'utilisateurs (mockée)
  const searchUsers = (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const filtered = mockUsers.filter(user => 
      user.name.toLowerCase().includes(query.toLowerCase()) ||
      user.username.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(filtered);
  };

  // Effet pour la recherche avec délai
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchUsers(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Fonction pour sélectionner/déselectionner un utilisateur
  const toggleUserSelection = (user: User) => {
    setSelectedUsers(prev => {
      const isSelected = prev.some(u => u.id === user.id);
      if (isSelected) {
        return prev.filter(u => u.id !== user.id);
      } else {
        // Limite pour les groupes
        if (isGroupChat && prev.length >= 9) { // Max 10 participants avec l'utilisateur actuel
          Alert.alert('Limite atteinte', 'Un groupe peut contenir maximum 10 participants.');
          return prev;
        }
        return [...prev, user];
      }
    });
  };

  // Fonction pour démarrer une conversation
  const startConversation = () => {
    if (selectedUsers.length === 0) {
      Alert.alert('Erreur', 'Veuillez sélectionner au moins un participant.');
      return;
    }

    if (selectedUsers.length === 1 && !isGroupChat) {
      // Conversation privée
      const user = selectedUsers[0];
      router.push({
        pathname: '/(app)/conversation',
        params: { 
          conversationId: `mock_${user.id}`,
          conversationName: user.name
        }
      });
    } else {
      // Groupe
      setShowGroupModal(true);
    }
  };

  // Fonction pour créer un groupe
  const createGroup = () => {
    if (!groupName.trim()) {
      Alert.alert('Erreur', 'Veuillez donner un nom au groupe.');
      return;
    }

    if (selectedUsers.length < 2) {
      Alert.alert('Erreur', 'Un groupe doit contenir au moins 2 participants.');
      return;
    }

    // Simuler la création du groupe
    setShowGroupModal(false);
    router.push({
      pathname: '/(app)/conversation',
      params: { 
        conversationId: `group_${Date.now()}`,
        conversationName: groupName
      }
    });
  };

  // Rendu d'un utilisateur dans les résultats de recherche
  const renderUser = ({ item }: { item: User }) => {
    const isSelected = selectedUsers.some(u => u.id === item.id);

    return (
      <TouchableOpacity
        style={[styles.userItem, isSelected && styles.selectedUserItem]}
        onPress={() => toggleUserSelection(item)}
        activeOpacity={0.7}
      >
        <View style={styles.userInfo}>
          {item.profilePicture ? (
            <Image source={{ uri: item.profilePicture }} style={styles.userAvatar} />
          ) : (
            <View style={[styles.userAvatar, styles.defaultAvatar]}>
              <FontAwesome name="user" size={20} color={theme.colors.text.secondary} />
            </View>
          )}

          <View style={styles.userDetails}>
            <View style={styles.userNameRow}>
              <Text style={styles.userName}>{item.name}</Text>
              {item.isVerify && (
                <FontAwesome name="check-circle" size={14} color="#E10600" style={styles.verifyIcon} />
              )}
            </View>
            <Text style={styles.userUsername}>@{item.username}</Text>
            {item.description && (
              <Text style={styles.userDescription} numberOfLines={1}>
                {item.description}
              </Text>
            )}
          </View>
        </View>

        <View style={styles.selectionIndicator}>
          {isSelected ? (
            <FontAwesome name="check-circle" size={20} color="#E10600" />
          ) : (
            <View style={styles.emptyCircle} />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  // Rendu d'un utilisateur sélectionné
  const renderSelectedUser = ({ item }: { item: User }) => (
    <TouchableOpacity
      style={styles.selectedUserChip}
      onPress={() => toggleUserSelection(item)}
    >
      {item.profilePicture ? (
        <Image source={{ uri: item.profilePicture }} style={styles.chipAvatar} />
      ) : (
        <View style={[styles.chipAvatar, styles.defaultChipAvatar]}>
          <FontAwesome name="user" size={12} color={theme.colors.text.secondary} />
        </View>
      )}
      <Text style={styles.chipName} numberOfLines={1}>{item.name}</Text>
      <FontAwesome name="times" size={12} color={theme.colors.text.secondary} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <FontAwesome name="arrow-left" size={20} color="#E10600" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Nouvelle conversation</Text>

        <TouchableOpacity
          style={[styles.nextButton, selectedUsers.length > 0 && styles.nextButtonActive]}
          onPress={startConversation}
          disabled={selectedUsers.length === 0}
        >
          <Text style={[styles.nextButtonText, selectedUsers.length > 0 && styles.nextButtonTextActive]}>
            Suivant
          </Text>
        </TouchableOpacity>
      </View>

      {/* Barre de recherche */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <FontAwesome name="search" size={16} color={theme.colors.text.secondary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Rechercher des pilotes..."
            placeholderTextColor={theme.colors.text.secondary}
          />
        </View>
      </View>

      {/* Option groupe */}
      <View style={styles.groupOption}>
        <View style={styles.groupOptionLeft}>
          <FontAwesome name="users" size={20} color="#E10600" />
          <Text style={styles.groupOptionText}>Créer un groupe</Text>
        </View>
        <Switch
          value={isGroupChat}
          onValueChange={setIsGroupChat}
          trackColor={{ false: theme.colors.border.light, true: '#E10600' }}
        />
      </View>

      {/* Utilisateurs sélectionnés */}
      {selectedUsers.length > 0 && (
        <View style={styles.selectedUsersContainer}>
          <Text style={styles.selectedUsersTitle}>
            Sélectionnés ({selectedUsers.length})
          </Text>
          <FlatList
            data={selectedUsers}
            renderItem={renderSelectedUser}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.selectedUsersList}
          />
        </View>
      )}

      {/* Liste des résultats de recherche */}
      <FlatList
        data={searchResults}
        renderItem={renderUser}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.usersList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          searchQuery.trim() ? (
            <View style={styles.emptyState}>
              <FontAwesome name="search" size={40} color={theme.colors.text.secondary} />
              <Text style={styles.emptyStateText}>
                Aucun pilote trouvé pour "{searchQuery}"
              </Text>
            </View>
          ) : (
            <View style={styles.emptyState}>
              <FontAwesome name="users" size={40} color={theme.colors.text.secondary} />
              <Text style={styles.emptyStateText}>
                Recherchez des pilotes pour démarrer une conversation
              </Text>
            </View>
          )
        }
      />

      {/* Modal de création de groupe */}
      <Modal
        visible={showGroupModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowGroupModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Créer un groupe</Text>
            
            <TextInput
              style={styles.groupNameInput}
              value={groupName}
              onChangeText={setGroupName}
              placeholder="Nom du groupe (ex: Équipe Karting Pro)"
              placeholderTextColor={theme.colors.text.secondary}
              maxLength={50}
            />

            <Text style={styles.participantsText}>
              {selectedUsers.length + 1} participants
            </Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowGroupModal(false)}
              >
                <Text style={styles.cancelButtonText}>Annuler</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.createButton}
                onPress={createGroup}
              >
                <Text style={styles.createButtonText}>Créer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
} 