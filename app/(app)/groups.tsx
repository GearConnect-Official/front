import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
  ActivityIndicator,
  TextInput,
  Modal,
  Alert,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import theme from "../src/styles/config/theme";
import { CloudinaryAvatar } from "../src/components/media/CloudinaryImage";
import { groupsScreenStyles as styles } from "../src/styles/screens/groups";

// Types pour les groupes
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
  type: "TEXT" | "VOICE" | "ANNOUNCEMENT";
  position: number;
  isPrivate: boolean;
  _count: {
    messages: number;
  };
}

interface Group {
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
  _count: {
    members: number;
  };
  createdAt: string;
}

const GroupsScreen: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDescription, setNewGroupDescription] = useState("");
  const [newGroupIsPublic, setNewGroupIsPublic] = useState(false);
  const [inviteCode, setInviteCode] = useState("");
  const [creating, setCreating] = useState(false);
  const [joining, setJoining] = useState(false);
  const router = useRouter();

  // Données mockées pour le développement
  const mockGroups: Group[] = [
    {
      id: 1,
      name: "Passionés de F1",
      description: "Communauté dédiée à la Formule 1 et aux sports automobiles",
      isPublic: true,
      owner: {
        id: 1,
        name: "Marc Dubois",
        username: "marc.racing",
        profilePicture:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      },
      members: [
        {
          id: 1,
          user: {
            id: 2,
            name: "Sarah Martin",
            username: "sarah.speed",
            profilePicture:
              "https://images.unsplash.com/photo-1494790108755-2616b612b0bd?w=150&h=150&fit=crop&crop=face",
            isVerify: true,
          },
          joinedAt: "2024-01-10T10:00:00Z",
          roles: [
            {
              role: {
                id: 1,
                name: "Admin",
                color: "#E10600",
                position: 100,
              },
            },
          ],
        },
      ],
      channels: [
        {
          id: 1,
          name: "général",
          description: "Discussion générale",
          type: "TEXT",
          position: 0,
          isPrivate: false,
          _count: { messages: 156 },
        },
        {
          id: 2,
          name: "résultats-courses",
          description: "Discussions sur les résultats",
          type: "TEXT",
          position: 1,
          isPrivate: false,
          _count: { messages: 89 },
        },
      ],
      _count: { members: 47 },
      createdAt: "2024-01-05T09:00:00Z",
    },
    {
      id: 2,
      name: "Karting Amateur",
      description: "Groupe pour les amateurs de karting",
      isPublic: false,
      owner: {
        id: 3,
        name: "Antoine Leclerc",
        username: "antoine.f1",
        profilePicture:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      },
      members: [],
      channels: [
        {
          id: 3,
          name: "général",
          type: "TEXT",
          position: 0,
          isPrivate: false,
          _count: { messages: 23 },
        },
      ],
      _count: { members: 12 },
      createdAt: "2024-01-12T14:30:00Z",
    },
  ];

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    try {
      setLoading(true);
      // TODO: Remplacer par l'appel API réel
      // const response = await fetch('/api/groups');
      // const data = await response.json();
      // setGroups(data);

      // Simuler un délai de chargement
      setTimeout(() => {
        setGroups(mockGroups);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error loading groups:", error);
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadGroups();
    setRefreshing(false);
  };

  const openGroup = (group: Group) => {
    router.push({
      pathname: "/(app)/groupDetail",
      params: {
        groupId: group.id.toString(),
        groupName: group.name,
      },
    });
  };

  const createGroup = async () => {
    if (!newGroupName.trim()) {
      Alert.alert("Erreur", "Le nom du groupe est requis");
      return;
    }

    setCreating(true);
    try {
      // TODO: Appel API pour créer le groupe
      console.log("Creating group:", {
        name: newGroupName,
        description: newGroupDescription,
        isPublic: newGroupIsPublic,
      });

      // Simuler la création
      setTimeout(() => {
        setShowCreateModal(false);
        setNewGroupName("");
        setNewGroupDescription("");
        setNewGroupIsPublic(false);
        setCreating(false);
        Alert.alert("Succès", "Groupe créé avec succès !");
        loadGroups();
      }, 1000);
    } catch (error) {
      console.error("Error creating group:", error);
      Alert.alert("Erreur", "Impossible de créer le groupe");
      setCreating(false);
    }
  };

  const joinGroup = async () => {
    if (!inviteCode.trim()) {
      Alert.alert("Erreur", "Le code d'invitation est requis");
      return;
    }

    setJoining(true);
    try {
      // TODO: Appel API pour rejoindre le groupe
      console.log("Joining group with code:", inviteCode);

      // Simuler le join
      setTimeout(() => {
        setShowJoinModal(false);
        setInviteCode("");
        setJoining(false);
        Alert.alert("Succès", "Vous avez rejoint le groupe !");
        loadGroups();
      }, 1000);
    } catch (error) {
      console.error("Error joining group:", error);
      Alert.alert("Erreur", "Code d'invitation invalide ou expiré");
      setJoining(false);
    }
  };

  const formatMemberCount = (count: number): string => {
    if (count === 1) return "1 membre";
    return `${count} membres`;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getChannelIcon = (type: string) => {
    switch (type) {
      case "VOICE":
        return "volume-up";
      case "ANNOUNCEMENT":
        return "bullhorn";
      default:
        return "hashtag";
    }
  };

  const renderGroupItem = ({ item }: { item: Group }) => (
    <TouchableOpacity
      style={styles.groupItem}
      onPress={() => openGroup(item)}
      activeOpacity={0.7}
    >
      <View style={styles.groupHeader}>
        <View style={styles.groupIconContainer}>
          {item.iconPublicId ? (
            <CloudinaryAvatar
              publicId={item.iconPublicId}
              size={50}
              style={styles.groupIcon}
            />
          ) : item.icon ? (
            <Image source={{ uri: item.icon }} style={styles.groupIcon} />
          ) : (
            <View style={[styles.groupIcon, styles.defaultGroupIcon]}>
              <FontAwesome name="users" size={24} color="#6A707C" />
            </View>
          )}
          {item.isPublic && (
            <View style={styles.publicBadge}>
              <FontAwesome name="globe" size={10} color="white" />
            </View>
          )}
        </View>

        <View style={styles.groupInfo}>
          <Text style={styles.groupName} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.groupDescription} numberOfLines={2}>
            {item.description || "Aucune description"}
          </Text>

          <View style={styles.groupMeta}>
            <View style={styles.metaItem}>
              <FontAwesome name="users" size={12} color="#6A707C" />
              <Text style={styles.metaText}>
                {formatMemberCount(item._count.members)}
              </Text>
            </View>
            <View style={styles.metaItem}>
              <FontAwesome name="hashtag" size={12} color="#6A707C" />
              <Text style={styles.metaText}>
                {item.channels.length} channels
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.groupActions}>
          <FontAwesome name="chevron-right" size={16} color="#6A707C" />
        </View>
      </View>

      <View style={styles.groupChannels}>
        {item.channels.slice(0, 3).map((channel, index) => (
          <View key={channel.id} style={styles.channelPreview}>
            <FontAwesome
              name={getChannelIcon(channel.type)}
              size={12}
              color="#6A707C"
            />
            <Text style={styles.channelName}>{channel.name}</Text>
            {channel._count.messages > 0 && (
              <Text style={styles.messageCount}>{channel._count.messages}</Text>
            )}
          </View>
        ))}
        {item.channels.length > 3 && (
          <Text style={styles.moreChannels}>
            +{item.channels.length - 3} autres channels
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#E10600" />
          <Text style={styles.loadingText}>Chargement des groupes...</Text>
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
        <Text style={styles.headerTitle}>Groupes</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => setShowJoinModal(true)}
            activeOpacity={0.7}
          >
            <FontAwesome name="sign-in" size={20} color="#E10600" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => setShowCreateModal(true)}
            activeOpacity={0.7}
          >
            <FontAwesome name="plus" size={20} color="#E10600" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Liste des groupes */}
      <FlatList
        data={groups}
        renderItem={renderGroupItem}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <FontAwesome name="users" size={60} color="#CCCCCC" />
            <Text style={styles.emptyTitle}>Aucun groupe</Text>
            <Text style={styles.emptyDescription}>
              Créez votre premier groupe ou rejoignez un groupe existant
            </Text>
          </View>
        }
      />

      {/* Modal création de groupe */}
      <Modal
        visible={showCreateModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowCreateModal(false)}>
              <FontAwesome name="times" size={24} color="#6A707C" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Créer un groupe</Text>
            <TouchableOpacity
              onPress={createGroup}
              disabled={creating || !newGroupName.trim()}
            >
              <Text
                style={[
                  styles.modalAction,
                  (!newGroupName.trim() || creating) &&
                    styles.modalActionDisabled,
                ]}
              >
                {creating ? "Création..." : "Créer"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nom du groupe *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Nom de votre groupe"
                value={newGroupName}
                onChangeText={setNewGroupName}
                maxLength={100}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Description</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                placeholder="Description du groupe (optionnel)"
                value={newGroupDescription}
                onChangeText={setNewGroupDescription}
                multiline
                numberOfLines={4}
                maxLength={500}
              />
            </View>

            <TouchableOpacity
              style={styles.checkboxGroup}
              onPress={() => setNewGroupIsPublic(!newGroupIsPublic)}
            >
              <View
                style={[
                  styles.checkbox,
                  newGroupIsPublic && styles.checkboxChecked,
                ]}
              >
                {newGroupIsPublic && (
                  <FontAwesome name="check" size={12} color="white" />
                )}
              </View>
              <View style={styles.checkboxLabel}>
                <Text style={styles.checkboxText}>Groupe public</Text>
                <Text style={styles.checkboxDescription}>
                  Les groupes publics peuvent être découverts par d&apos;autres
                  utilisateurs
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Modal rejoindre un groupe */}
      <Modal
        visible={showJoinModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowJoinModal(false)}>
              <FontAwesome name="times" size={24} color="#6A707C" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Rejoindre un groupe</Text>
            <TouchableOpacity
              onPress={joinGroup}
              disabled={joining || !inviteCode.trim()}
            >
              <Text
                style={[
                  styles.modalAction,
                  (!inviteCode.trim() || joining) && styles.modalActionDisabled,
                ]}
              >
                {joining ? "Connexion..." : "Rejoindre"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Code d&apos;invitation</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Ex: A1B2C3D4"
                value={inviteCode}
                onChangeText={setInviteCode}
                maxLength={8}
                autoCapitalize="characters"
              />
              <Text style={styles.inputHint}>
                Demandez le code d&apos;invitation à un membre du groupe
              </Text>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

export default GroupsScreen;
