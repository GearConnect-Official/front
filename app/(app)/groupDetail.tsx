import React, { useState, useEffect, useCallback } from "react";
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
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { CloudinaryAvatar } from "../src/components/media/CloudinaryImage";
import { groupDetailScreenStyles as styles } from "../src/styles/screens/groups";
import groupService, { GroupDetails, GroupChannel, GroupMember } from "../src/services/groupService";
import { useAuth } from "../src/context/AuthContext";

const GroupDetailScreen: React.FC = () => {
  const router = useRouter();
  const { groupId } = useLocalSearchParams();
  const { user } = useAuth() || {};
  const [group, setGroup] = useState<GroupDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState<"channels" | "members">(
    "channels"
  );
  const [showCreateChannelModal, setShowCreateChannelModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [newChannelName, setNewChannelName] = useState("");
  const [newChannelDescription, setNewChannelDescription] = useState("");
  const [newChannelType, setNewChannelType] = useState<
    "TEXT" | "VOICE" | "ANNOUNCEMENT"
  >("TEXT");
  const [inviteCode, setInviteCode] = useState("");
  const [creating, setCreating] = useState(false);

  const loadGroupDetails = useCallback(async () => {
    if (!groupId) return;
    
    try {
      setLoading(true);
      const currentUserId = user?.id ? parseInt(user.id.toString()) : undefined;
      const groupIdNum = parseInt(groupId as string);
      if (isNaN(groupIdNum)) {
        Alert.alert('Error', 'Invalid group ID');
        return;
      }
      const groupData = await groupService.getGroupDetails(groupIdNum, currentUserId);
      setGroup(groupData);
    } catch (error: any) {
      console.error("Error loading group details:", error);
      Alert.alert('Error', error.response?.data?.error || 'Failed to load group details');
    } finally {
      setLoading(false);
    }
  }, [groupId, user?.id]);

  useEffect(() => {
    if (groupId && user?.id) {
      loadGroupDetails();
    }
  }, [groupId, user?.id, loadGroupDetails]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadGroupDetails();
    setRefreshing(false);
  };

  const openChannel = (channel: GroupChannel) => {
    router.push({
      pathname: "/(app)/groupChannel",
      params: {
        groupId: groupId as string,
        channelId: channel.id.toString(),
        channelName: channel.name,
        channelType: channel.type,
      },
    });
  };

  const createChannel = async () => {
    if (!newChannelName.trim() || !groupId) {
      Alert.alert("Error", "Channel name is required");
      return;
    }

    setCreating(true);
    try {
      const currentUserId = user?.id ? parseInt(user.id.toString()) : undefined;
      const groupIdNum = parseInt(groupId as string);
      await groupService.createChannel(
        groupIdNum,
        newChannelName.trim(),
        newChannelDescription.trim() || undefined,
        newChannelType,
        currentUserId
      );
      setShowCreateChannelModal(false);
      setNewChannelName("");
      setNewChannelDescription("");
      setNewChannelType("TEXT");
      Alert.alert("Success", "Channel created successfully!");
      loadGroupDetails();
    } catch (error: any) {
      console.error("Error creating channel:", error);
      Alert.alert("Error", error.response?.data?.error || "Failed to create channel");
    } finally {
      setCreating(false);
    }
  };

  const createInvite = async () => {
    if (!groupId) return;
    
    try {
      const currentUserId = user?.id ? parseInt(user.id.toString()) : undefined;
      const groupIdNum = parseInt(groupId as string);
      const invite = await groupService.createInvite(groupIdNum, currentUserId);
      setInviteCode(invite.code);
    } catch (error: any) {
      console.error("Error creating invite:", error);
      Alert.alert("Error", error.response?.data?.error || "Failed to create invite");
    }
  };

  const copyInviteCode = async () => {
    // TODO: Use Clipboard API when available
    Alert.alert(
      "Copied!",
      "Invite code copied to clipboard"
    );
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

  const getChannelIconColor = (type: string) => {
    switch (type) {
      case "VOICE":
        return "#10B981";
      case "ANNOUNCEMENT":
        return "#F59E0B";
      default:
        return "#6A707C";
    }
  };

  const formatLastActive = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Today";
    if (diffDays === 2) return "Yesterday";
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return date.toLocaleDateString("en-US");
  };

  const getHighestRole = (member: GroupMember) => {
    return member.roles.reduce((highest, current) => {
      return current.role.position > (highest?.role.position || 0)
        ? current
        : highest;
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
        <Text style={styles.channelName}>{item.name}</Text>
        {item.description && (
          <Text style={styles.channelDescription} numberOfLines={1}>
            {item.description}
          </Text>
        )}
      </View>
      <View style={styles.channelMeta}>
        {item._count.messages > 0 && (
          <Text style={styles.messageCount}>{item._count.messages}</Text>
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
            <Image
              source={{ uri: item.user.profilePicture }}
              style={styles.avatar}
            />
          ) : (
            <View style={[styles.avatar, styles.defaultAvatar]}>
              <FontAwesome name="user" size={16} color="#6A707C" />
            </View>
          )}
          {/* Status en ligne (pour futures implémentations) */}
          <View style={[styles.onlineStatus, { backgroundColor: "#10B981" }]} />
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
              <Text
                style={[
                  styles.memberRole,
                  { color: highestRole.role.color || "#6A707C" },
                ]}
              >
                {highestRole.role.name}
              </Text>
            )}
            <Text style={styles.memberLastActive}>
              {formatLastActive(item.lastActiveAt || item.joinedAt)}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.memberAction}
          onPress={() =>
            router.push({
              pathname: "/(app)/conversation",
              params: {
                conversationId: `direct_${item.user.id}`,
                conversationName: item.user.name,
              },
            })
          }
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
          <Text style={styles.loadingText}>Loading...</Text>
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
            {group._count.members} members
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
          style={[styles.tab, selectedTab === "channels" && styles.activeTab]}
          onPress={() => setSelectedTab("channels")}
        >
          <FontAwesome
            name="hashtag"
            size={16}
            color={selectedTab === "channels" ? "#E10600" : "#6A707C"}
          />
            <Text
              style={[
                styles.tabText,
                selectedTab === "channels" && styles.activeTabText,
              ]}
            >
              Channels
            </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, selectedTab === "members" && styles.activeTab]}
          onPress={() => setSelectedTab("members")}
        >
          <FontAwesome
            name="users"
            size={16}
            color={selectedTab === "members" ? "#E10600" : "#6A707C"}
          />
          <Text
            style={[
              styles.tabText,
              selectedTab === "members" && styles.activeTabText,
            ]}
          >
            Members
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {selectedTab === "channels" ? (
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
              Members ({group.members.length})
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
            <Text style={styles.modalTitle}>Create Channel</Text>
            <TouchableOpacity
              onPress={createChannel}
              disabled={creating || !newChannelName.trim()}
            >
              <Text
                style={[
                  styles.modalAction,
                  (!newChannelName.trim() || creating) &&
                    styles.modalActionDisabled,
                ]}
              >
                {creating ? "Creating..." : "Create"}
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Channel Type</Text>
              <View style={styles.channelTypeContainer}>
                {["TEXT", "VOICE", "ANNOUNCEMENT"].map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.channelTypeButton,
                      newChannelType === type && styles.channelTypeButtonActive,
                    ]}
                    onPress={() => setNewChannelType(type as any)}
                  >
                    <FontAwesome
                      name={getChannelIcon(type)}
                      size={16}
                      color={newChannelType === type ? "#FFFFFF" : "#6A707C"}
                    />
                    <Text
                      style={[
                        styles.channelTypeText,
                        newChannelType === type && styles.channelTypeTextActive,
                      ]}
                    >
                      {type === "TEXT"
                        ? "Text"
                        : type === "VOICE"
                        ? "Voice"
                        : "Announcement"}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Channel Name *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="channel-name"
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
                placeholder="Channel description (optional)"
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
            <Text style={styles.modalTitle}>Invite Members</Text>
            <View />
          </View>

          <View style={styles.modalContent}>
            {!inviteCode ? (
              <View style={styles.inviteContainer}>
                <FontAwesome name="user-plus" size={48} color="#E10600" />
                <Text style={styles.inviteTitle}>
                  Invite people to join {group.name}
                </Text>
                <Text style={styles.inviteDescription}>
                  Create an invite link to allow other users to join this group
                </Text>
                <TouchableOpacity
                  style={styles.createInviteButton}
                  onPress={createInvite}
                >
                  <Text style={styles.createInviteText}>
                    Create Invite
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.inviteCodeContainer}>
                <Text style={styles.inviteCodeTitle}>
                  Invite link created!
                </Text>
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
                  Share this code with people you want to invite
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
