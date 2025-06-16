import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Image,
  Modal,
  TextInput,
  Alert,
  RefreshControl,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CloudinaryAvatar } from '../src/components/media/CloudinaryImage';
import { groupDetailScreenStyles as styles } from '../src/styles/screens/groups';

// Types pour les données du groupe
interface GroupMember {
  id: number;
  user: {
    id: number;
    name: string;
    username: string;
    profilePicture?: string;
    profilePicturePublicId?: string;
    isVerify: boolean;
  };
  nickname?: string;
  joinedAt: string;
  lastActiveAt: string;
  roles: {
    role: {
      id: number;
      name: string;
      color?: string;
      position: number;
    };
  }[];
}

interface GroupChannel {
  id: number;
  name: string;
  description?: string;
  type: 'TEXT' | 'VOICE' | 'ANNOUNCEMENT';
  position: number;
  isPrivate: boolean;
  _count: {
    messages: number;
  };
}

interface GroupCategory {
  id: number;
  name: string;
  position: number;
  channels: GroupChannel[];
}

interface GroupDetails {
  id: number;
  name: string;
  description?: string;
  icon?: string;
  iconPublicId?: string;
  isPublic: boolean;
  owner: {
    id: number;
    name: string;
    username: string;
    profilePicture?: string;
    profilePicturePublicId?: string;
  };
  members: GroupMember[];
  channels: GroupChannel[];
  categories: GroupCategory[];
  roles: {
    id: number;
    name: string;
    color?: string;
    position: number;
  }[];
  _count: {
    members: number;
  };
  createdAt: string;
}

const GroupDetailScreen: React.FC = () => {
  const router = useRouter();
  const { groupId, groupName } = useLocalSearchParams();
  const [group, setGroup] = useState<GroupDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'channels' | 'members'>('channels');
  const [showCreateChannelModal, setShowCreateChannelModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [newChannelName, setNewChannelName] = useState('');
  const [newChannelDescription, setNewChannelDescription] = useState('');
  const [newChannelType, setNewChannelType] = useState<'TEXT' | 'VOICE' | 'ANNOUNCEMENT'>('TEXT');
  const [inviteCode, setInviteCode] = useState('');
  const [creating, setCreating] = useState(false);

  // Données mockées pour le développement
  const mockGroupDetails: GroupDetails = {
    id: 1,
    name: 'Passionés de F1',
    description: 'Communauté dédiée à la Formule 1 et aux sports automobiles',
    isPublic: true,
    owner: {
      id: 1,
      name: 'Marc Dubois',
      username: 'marc.racing',
      profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    },
    members: [
      {
        id: 1,
        user: {
          id: 1,
          name: 'Marc Dubois',
          username: 'marc.racing',
          profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
          isVerify: true,
        },
        joinedAt: '2024-01-05T09:00:00Z',
        lastActiveAt: '2024-01-15T14:30:00Z',
        roles: [
          {
            role: {
              id: 1,
              name: 'Owner',
              color: '#E10600',
              position: 1000,
            }
          }
        ]
      },
      {
        id: 2,
        user: {
          id: 2,
          name: 'Sarah Martin',
          username: 'sarah.speed',
          profilePicture: 'https://images.unsplash.com/photo-1494790108755-2616b612b0bd?w=150&h=150&fit=crop&crop=face',
          isVerify: true,
        },
        joinedAt: '2024-01-10T10:00:00Z',
        lastActiveAt: '2024-01-15T12:15:00Z',
        roles: [
          {
            role: {
              id: 2,
              name: 'Admin',
              color: '#E10600',
              position: 100,
            }
          }
        ]
      },
      {
        id: 3,
        user: {
          id: 3,
          name: 'Antoine Leclerc',
          username: 'antoine.f1',
          profilePicture: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
          isVerify: true,
        },
        nickname: 'Speedy',
        joinedAt: '2024-01-12T14:30:00Z',
        lastActiveAt: '2024-01-15T09:45:00Z',
        roles: [
          {
            role: {
              id: 3,
              name: 'Membre',
              color: '#6A707C',
              position: 1,
            }
          }
        ]
      },
      {
        id: 4,
        user: {
          id: 4,
          name: 'Julien Moreau',
          username: 'julien.pilot',
          profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
          isVerify: false,
        },
        joinedAt: '2024-01-13T16:20:00Z',
        lastActiveAt: '2024-01-14T18:30:00Z',
        roles: [
          {
            role: {
              id: 3,
              name: 'Membre',
              color: '#6A707C',
              position: 1,
            }
          }
        ]
      },
    ],
    channels: [
      {
        id: 1,
        name: 'général',
        description: 'Discussion générale sur la F1',
        type: 'TEXT',
        position: 0,
        isPrivate: false,
        _count: { messages: 1247 }
      },
      {
        id: 2,
        name: 'résultats-courses',
        description: 'Discussions sur les résultats des courses',
        type: 'TEXT',
        position: 1,
        isPrivate: false,
        _count: { messages: 89 }
      },
      {
        id: 3,
        name: 'analyses-techniques',
        description: 'Analyses techniques des voitures',
        type: 'TEXT',
        position: 2,
        isPrivate: false,
        _count: { messages: 234 }
      },
      {
        id: 4,
        name: 'annonces',
        description: 'Annonces importantes',
        type: 'ANNOUNCEMENT',
        position: 3,
        isPrivate: false,
        _count: { messages: 12 }
      },
      {
        id: 5,
        name: 'discussion-vocale',
        description: 'Channel vocal pour les discussions',
        type: 'VOICE',
        position: 4,
        isPrivate: false,
        _count: { messages: 0 }
      },
    ],
    categories: [],
    roles: [
      { id: 1, name: 'Owner', color: '#E10600', position: 1000 },
      { id: 2, name: 'Admin', color: '#E10600', position: 100 },
      { id: 3, name: 'Membre', color: '#6A707C', position: 1 },
    ],
    _count: { members: 47 },
    createdAt: '2024-01-05T09:00:00Z'
  };

  useEffect(() => {
    loadGroupDetails();
  }, [groupId]);

  const loadGroupDetails = async () => {
    try {
      setLoading(true);
      // TODO: Remplacer par l'appel API réel
      // const response = await fetch(`/api/groups/${groupId}`);
      // const data = await response.json();
      // setGroup(data);
      
      // Simuler un délai de chargement
      setTimeout(() => {
        setGroup(mockGroupDetails);
        setLoading(false);
      }, 800);
    } catch (error) {
      console.error('Error loading group details:', error);
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadGroupDetails();
    setRefreshing(false);
  };

  const openChannel = (channel: GroupChannel) => {
    router.push({
      pathname: '/(app)/groupChannel',
      params: { 
        groupId: groupId as string,
        channelId: channel.id.toString(),
        channelName: channel.name,
        channelType: channel.type 
      }
    });
  };

  const createChannel = async () => {
    if (!newChannelName.trim()) {
      Alert.alert('Erreur', 'Le nom du channel est requis');
      return;
    }

    setCreating(true);
    try {
      // TODO: Appel API pour créer le channel
      console.log('Creating channel:', {
        name: newChannelName,
        description: newChannelDescription,
        type: newChannelType
      });
      
      setTimeout(() => {
        setShowCreateChannelModal(false);
        setNewChannelName('');
        setNewChannelDescription('');
        setNewChannelType('TEXT');
        setCreating(false);
        Alert.alert('Succès', 'Channel créé avec succès !');
        loadGroupDetails();
      }, 1000);
    } catch (error) {
      console.error('Error creating channel:', error);
      Alert.alert('Erreur', 'Impossible de créer le channel');
      setCreating(false);
    }
  };

  const createInvite = async () => {
    try {
      // TODO: Appel API pour créer l'invitation
      const mockInviteCode = Math.random().toString(36).substring(2, 10).toUpperCase();
      setInviteCode(mockInviteCode);
    } catch (error) {
      console.error('Error creating invite:', error);
      Alert.alert('Erreur', 'Impossible de créer l\'invitation');
    }
  };

  const copyInviteCode = () => {
    // TODO: Copier dans le presse-papiers
    Alert.alert('Copié !', 'Le code d\'invitation a été copié dans le presse-papiers');
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

  const getChannelIconColor = (type: string) => {
    switch (type) {
      case 'VOICE':
        return '#10B981';
      case 'ANNOUNCEMENT':
        return '#F59E0B';
      default:
        return '#6A707C';
    }
  };

  const formatLastActive = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Aujourd\'hui';
    if (diffDays === 2) return 'Hier';
    if (diffDays <= 7) return `Il y a ${diffDays - 1} jours`;
    return date.toLocaleDateString('fr-FR');
  };

  const getHighestRole = (member: GroupMember) => {
    return member.roles.reduce((highest, current) => {
      return current.role.position > (highest?.role.position || 0) ? current : highest;
    }, member.roles[0] || null);
  };

  const renderChannelItem = ({ item }: { item: GroupChannel }) => (
    <TouchableOpacity
      style={styles.channelItem}
      onPress={() => openChannel(item)}
      activeOpacity={0.7}
    >
      <View style={styles.channelIcon}>
        <FontAwesome 
          name={getChannelIcon(item.type)} 
          size={18} 
          color={getChannelIconColor(item.type)} 
        />
      </View>
      <View style={styles.channelInfo}>
        <Text style={styles.channelName}>
          {item.name}
        </Text>
        {item.description && (
          <Text style={styles.channelDescription} numberOfLines={1}>
            {item.description}
          </Text>
        )}
      </View>
      <View style={styles.channelMeta}>
        {item._count.messages > 0 && (
          <Text style={styles.messageCount}>
            {item._count.messages}
          </Text>
        )}
        <FontAwesome name="chevron-right" size={12} color="#9CA3AF" />
      </View>
    </TouchableOpacity>
  );

  const renderMemberItem = ({ item }: { item: GroupMember }) => {
    const highestRole = getHighestRole(item);
    const displayName = item.nickname || item.user.name;
    
    return (
      <View style={styles.memberItem}>
        <View style={styles.memberAvatar}>
          {item.user.profilePicturePublicId ? (
            <CloudinaryAvatar
              publicId={item.user.profilePicturePublicId}
              size={40}
              style={styles.avatar}
            />
          ) : item.user.profilePicture ? (
            <Image source={{ uri: item.user.profilePicture }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.defaultAvatar]}>
              <FontAwesome name="user" size={16} color="#6A707C" />
            </View>
          )}
          {/* Status en ligne (pour futures implémentations) */}
          <View style={[styles.onlineStatus, { backgroundColor: '#10B981' }]} />
        </View>
        
        <View style={styles.memberInfo}>
          <View style={styles.memberNameRow}>
            <Text style={styles.memberName} numberOfLines={1}>
              {displayName}
            </Text>
            {item.user.isVerify && (
              <FontAwesome name="check-circle" size={14} color="#E10600" />
            )}
          </View>
          <View style={styles.memberMetaRow}>
            {highestRole && (
              <Text style={[
                styles.memberRole,
                { color: highestRole.role.color || '#6A707C' }
              ]}>
                {highestRole.role.name}
              </Text>
            )}
            <Text style={styles.memberLastActive}>
              {formatLastActive(item.lastActiveAt)}
            </Text>
          </View>
        </View>
        
        <TouchableOpacity
          style={styles.memberAction}
          onPress={() => router.push({
            pathname: '/(app)/conversation',
            params: { 
              conversationId: `direct_${item.user.id}`,
              conversationName: item.user.name
            }
          })}
        >
          <FontAwesome name="comment" size={16} color="#6A707C" />
        </TouchableOpacity>
      </View>
    );
  };

  if (loading || !group) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Chargement du groupe...</Text>
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
        
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {group.name}
          </Text>
          <Text style={styles.headerSubtitle}>
            {group._count.members} membres
          </Text>
        </View>

        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => setShowInviteModal(true)}
        >
          <FontAwesome name="user-plus" size={20} color="#E10600" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'channels' && styles.activeTab]}
          onPress={() => setSelectedTab('channels')}
        >
          <FontAwesome 
            name="hashtag" 
            size={16} 
            color={selectedTab === 'channels' ? '#E10600' : '#6A707C'} 
          />
          <Text style={[
            styles.tabText,
            selectedTab === 'channels' && styles.activeTabText
          ]}>
            Channels
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'members' && styles.activeTab]}
          onPress={() => setSelectedTab('members')}
        >
          <FontAwesome 
            name="users" 
            size={16} 
            color={selectedTab === 'members' ? '#E10600' : '#6A707C'} 
          />
          <Text style={[
            styles.tabText,
            selectedTab === 'members' && styles.activeTabText
          ]}>
            Membres
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {selectedTab === 'channels' ? (
        <View style={styles.content}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Channels</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setShowCreateChannelModal(true)}
            >
              <FontAwesome name="plus" size={16} color="#E10600" />
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={group.channels}
            renderItem={renderChannelItem}
            keyExtractor={(item) => item.id.toString()}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            showsVerticalScrollIndicator={false}
          />
        </View>
      ) : (
        <View style={styles.content}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Membres ({group.members.length})
            </Text>
          </View>
          
          <FlatList
            data={group.members}
            renderItem={renderMemberItem}
            keyExtractor={(item) => item.id.toString()}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}

      {/* Modal création de channel */}
      <Modal
        visible={showCreateChannelModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowCreateChannelModal(false)}>
              <FontAwesome name="times" size={24} color="#6A707C" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Créer un channel</Text>
            <TouchableOpacity
              onPress={createChannel}
              disabled={creating || !newChannelName.trim()}
            >
              <Text style={[
                styles.modalAction,
                (!newChannelName.trim() || creating) && styles.modalActionDisabled
              ]}>
                {creating ? 'Création...' : 'Créer'}
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Type de channel</Text>
              <View style={styles.channelTypeContainer}>
                {['TEXT', 'VOICE', 'ANNOUNCEMENT'].map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.channelTypeButton,
                      newChannelType === type && styles.channelTypeButtonActive
                    ]}
                    onPress={() => setNewChannelType(type as any)}
                  >
                    <FontAwesome 
                      name={getChannelIcon(type)} 
                      size={16} 
                      color={newChannelType === type ? '#FFFFFF' : '#6A707C'} 
                    />
                    <Text style={[
                      styles.channelTypeText,
                      newChannelType === type && styles.channelTypeTextActive
                    ]}>
                      {type === 'TEXT' ? 'Texte' : type === 'VOICE' ? 'Vocal' : 'Annonces'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nom du channel *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="nom-du-channel"
                value={newChannelName}
                onChangeText={setNewChannelName}
                maxLength={100}
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Description</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                placeholder="Description du channel (optionnel)"
                value={newChannelDescription}
                onChangeText={setNewChannelDescription}
                multiline
                numberOfLines={3}
                maxLength={200}
              />
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Modal invitation */}
      <Modal
        visible={showInviteModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowInviteModal(false)}>
              <FontAwesome name="times" size={24} color="#6A707C" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Inviter des membres</Text>
            <View />
          </View>

          <View style={styles.modalContent}>
            {!inviteCode ? (
              <View style={styles.inviteContainer}>
                <FontAwesome name="user-plus" size={48} color="#E10600" />
                <Text style={styles.inviteTitle}>
                  Inviter des personnes à rejoindre {group.name}
                </Text>
                <Text style={styles.inviteDescription}>
                  Créez un lien d&apos;invitation pour permettre à d&apos;autres utilisateurs de rejoindre ce groupe
                </Text>
                <TouchableOpacity
                  style={styles.createInviteButton}
                  onPress={createInvite}
                >
                  <Text style={styles.createInviteText}>Créer une invitation</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.inviteCodeContainer}>
                <Text style={styles.inviteCodeTitle}>Lien d&apos;invitation créé !</Text>
                <View style={styles.inviteCodeBox}>
                  <Text style={styles.inviteCodeText}>{inviteCode}</Text>
                  <TouchableOpacity
                    style={styles.copyButton}
                    onPress={copyInviteCode}
                  >
                    <FontAwesome name="copy" size={16} color="#E10600" />
                  </TouchableOpacity>
                </View>
                <Text style={styles.inviteCodeDescription}>
                  Partagez ce code avec les personnes que vous souhaitez inviter
                </Text>
              </View>
            )}
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

export default GroupDetailScreen; 