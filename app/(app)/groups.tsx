import React, { useState, useEffect, useCallback } from 'react';
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
  ViewStyle,
  TextStyle,
  ImageStyle,
  StyleProp,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CloudinaryAvatar } from '../src/components/media/CloudinaryImage';
import { groupsScreenStyles as styles } from '../src/styles/screens/groups';
import groupService, { Group } from '../src/services/groupService';
import { useAuth } from '../src/context/AuthContext';

const GroupsScreen: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDescription, setNewGroupDescription] = useState('');
  const [newGroupIsPublic, setNewGroupIsPublic] = useState(false);
  const [inviteCode, setInviteCode] = useState('');
  const [creating, setCreating] = useState(false);
  const [joining, setJoining] = useState(false);
  const router = useRouter();
  const { user } = useAuth() || {};

  const loadGroups = useCallback(async () => {
    try {
      setLoading(true);
      const currentUserId = user?.id ? parseInt(user.id.toString()) : undefined;
      const fetchedGroups = await groupService.getGroups(currentUserId);
      setGroups(fetchedGroups);
    } catch (error) {
      console.error('Error loading groups:', error);
      Alert.alert('Error', 'Failed to load groups');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadGroups();
  }, [loadGroups]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadGroups();
    setRefreshing(false);
  };

  const openGroup = (group: Group) => {
    router.push({
      pathname: '/(app)/groupDetail',
      params: { 
        groupId: group.id.toString(),
        groupName: group.name 
      }
    });
  };

  const createGroup = async () => {
    if (!newGroupName.trim()) {
      Alert.alert('Error', 'Group name is required');
      return;
    }

    setCreating(true);
    try {
      const currentUserId = user?.id ? parseInt(user.id.toString()) : undefined;
      await groupService.createGroup(
        newGroupName.trim(),
        newGroupDescription.trim() || undefined,
        newGroupIsPublic,
        currentUserId
      );
      setShowCreateModal(false);
      setNewGroupName('');
      setNewGroupDescription('');
      setNewGroupIsPublic(false);
      Alert.alert('Success', 'Group created successfully!');
      loadGroups();
    } catch (error: any) {
      console.error('Error creating group:', error);
      Alert.alert('Error', error.response?.data?.error || 'Failed to create group');
    } finally {
      setCreating(false);
    }
  };

  const joinGroup = async () => {
    if (!inviteCode.trim()) {
      Alert.alert('Error', 'Invite code is required');
      return;
    }

    setJoining(true);
    try {
      const currentUserId = user?.id ? parseInt(user.id.toString()) : undefined;
      await groupService.joinGroup(inviteCode.trim().toUpperCase(), currentUserId);
      setShowJoinModal(false);
      setInviteCode('');
      Alert.alert('Success', 'You joined the group!');
      loadGroups();
    } catch (error: any) {
      console.error('Error joining group:', error);
      Alert.alert('Error', error.response?.data?.error || 'Invalid or expired invite code');
    } finally {
      setJoining(false);
    }
  };

  const formatMemberCount = (count: number): string => {
    if (count === 1) return '1 member';
    return `${count} members`;
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

  const renderGroupItem = ({ item }: { item: Group }) => (
    <TouchableOpacity
      style={styles.groupItem as StyleProp<ViewStyle>}
      onPress={() => openGroup(item)}
      activeOpacity={0.7}
    >
      <View style={styles.groupHeader as StyleProp<ViewStyle>}>
        <View style={styles.groupIconContainer as StyleProp<ViewStyle>}>
          {item.iconPublicId ? (
            <CloudinaryAvatar
              publicId={item.iconPublicId}
              size={50}
              style={styles.groupIcon as StyleProp<ImageStyle>}
            />
          ) : item.icon ? (
            <Image source={{ uri: item.icon }} style={styles.groupIcon as StyleProp<ImageStyle>} />
          ) : (
            <View style={[styles.groupIcon as StyleProp<ViewStyle>, styles.defaultGroupIcon as StyleProp<ViewStyle>]}>
              <FontAwesome name="users" size={24} color="#6A707C" />
            </View>
          )}
          {item.isPublic && (
            <View style={styles.publicBadge as StyleProp<ViewStyle>}>
              <FontAwesome name="globe" size={10} color="white" />
            </View>
          )}
        </View>

        <View style={styles.groupInfo as StyleProp<ViewStyle>}>
          <Text style={styles.groupName as StyleProp<TextStyle>} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.groupDescription as StyleProp<TextStyle>} numberOfLines={2}>
            {item.description || 'Aucune description'}
          </Text>
          
          <View style={styles.groupMeta as StyleProp<ViewStyle>}>
            <View style={styles.metaItem as StyleProp<ViewStyle>}>
              <FontAwesome name="users" size={12} color="#6A707C" />
              <Text style={styles.metaText as StyleProp<TextStyle>}>
                {formatMemberCount(item._count.members)}
              </Text>
            </View>
            <View style={styles.metaItem as StyleProp<ViewStyle>}>
              <FontAwesome name="hashtag" size={12} color="#6A707C" />
              <Text style={styles.metaText as StyleProp<TextStyle>}>
                {item.channels.length} channels
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.groupActions as StyleProp<ViewStyle>}>
          <FontAwesome name="chevron-right" size={16} color="#6A707C" />
        </View>
      </View>

      <View style={styles.groupChannels as StyleProp<ViewStyle>}>
        {item.channels.slice(0, 3).map((channel, index) => (
          <View key={channel.id} style={styles.channelPreview as StyleProp<ViewStyle>}>
            <FontAwesome 
              name={getChannelIcon(channel.type)} 
              size={12} 
              color="#6A707C" 
            />
            <Text style={styles.channelName as StyleProp<TextStyle>}>
              {channel.name}
            </Text>
            {channel._count.messages > 0 && (
              <Text style={styles.messageCount as StyleProp<TextStyle>}>
                {channel._count.messages}
              </Text>
            )}
          </View>
        ))}
        {item.channels.length > 3 && (
          <Text style={styles.moreChannels as StyleProp<TextStyle>}>
            +{item.channels.length - 3} autres channels
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container as StyleProp<ViewStyle>}>
        <View style={styles.loadingContainer as StyleProp<ViewStyle>}>
          <ActivityIndicator size="large" color="#E10600" />
          <Text style={styles.loadingText as StyleProp<TextStyle>}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container as StyleProp<ViewStyle>}>
      {/* Header */}
      <View style={styles.header as StyleProp<ViewStyle>}>
        <TouchableOpacity
          style={styles.backButton as StyleProp<ViewStyle>}
          onPress={() => router.back()}
        >
          <FontAwesome name="arrow-left" size={20} color="#6A707C" />
        </TouchableOpacity>
        <Text style={styles.headerTitle as StyleProp<TextStyle>}>Groups</Text>
        <View style={styles.headerActions as StyleProp<ViewStyle>}>
          <TouchableOpacity
            style={styles.headerButton as StyleProp<ViewStyle>}
            onPress={() => setShowJoinModal(true)}
            activeOpacity={0.7}
          >
            <FontAwesome name="sign-in" size={20} color="#E10600" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerButton as StyleProp<ViewStyle>}
            onPress={() => setShowCreateModal(true)}
            activeOpacity={0.7}
          >
            <FontAwesome name="plus" size={20} color="#E10600" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Groups list */}
      <FlatList
        data={groups}
        renderItem={renderGroupItem}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.listContainer as StyleProp<ViewStyle>}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer as StyleProp<ViewStyle>}>
            <FontAwesome name="users" size={60} color="#CCCCCC" />
            <Text style={styles.emptyTitle as StyleProp<TextStyle>}>No groups</Text>
            <Text style={styles.emptyDescription as StyleProp<TextStyle>}>
              Create your first group or join an existing one
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
        <SafeAreaView style={styles.modalContainer as StyleProp<ViewStyle>}>
          <View style={styles.modalHeader as StyleProp<ViewStyle>}>
            <TouchableOpacity onPress={() => setShowCreateModal(false)}>
              <FontAwesome name="times" size={24} color="#6A707C" />
            </TouchableOpacity>
            <Text style={styles.modalTitle as StyleProp<TextStyle>}>Create Group</Text>
            <TouchableOpacity
              onPress={createGroup}
              disabled={creating || !newGroupName.trim()}
            >
              <Text style={[
                styles.modalAction as StyleProp<TextStyle>,
                (!newGroupName.trim() || creating) && (styles.modalActionDisabled as StyleProp<TextStyle>)
              ]}>
                {creating ? 'Creating...' : 'Create'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent as StyleProp<ViewStyle>}>
            <View style={styles.inputGroup as StyleProp<ViewStyle>}>
              <Text style={styles.inputLabel as StyleProp<TextStyle>}>Group Name *</Text>
              <TextInput
                style={styles.textInput as StyleProp<TextStyle>}
                placeholder="Your group name"
                value={newGroupName}
                onChangeText={setNewGroupName}
                maxLength={100}
              />
            </View>

            <View style={styles.inputGroup as StyleProp<ViewStyle>}>
              <Text style={styles.inputLabel as StyleProp<TextStyle>}>Description</Text>
              <TextInput
                style={[styles.textInput as StyleProp<TextStyle>, styles.textArea as StyleProp<TextStyle>]}
                placeholder="Group description (optional)"
                value={newGroupDescription}
                onChangeText={setNewGroupDescription}
                multiline
                numberOfLines={4}
                maxLength={500}
              />
            </View>

            <TouchableOpacity
              style={styles.checkboxGroup as StyleProp<ViewStyle>}
              onPress={() => setNewGroupIsPublic(!newGroupIsPublic)}
            >
              <View style={[styles.checkbox as StyleProp<ViewStyle>, newGroupIsPublic && (styles.checkboxChecked as StyleProp<ViewStyle>)]}>
                {newGroupIsPublic && (
                  <FontAwesome name="check" size={12} color="white" />
                )}
              </View>
              <View style={styles.checkboxLabel as StyleProp<ViewStyle>}>
                <Text style={styles.checkboxText as StyleProp<TextStyle>}>Public group</Text>
                <Text style={styles.checkboxDescription as StyleProp<TextStyle>}>
                  Public groups can be discovered by other users
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
        <SafeAreaView style={styles.modalContainer as StyleProp<ViewStyle>}>
          <View style={styles.modalHeader as StyleProp<ViewStyle>}>
            <TouchableOpacity onPress={() => setShowJoinModal(false)}>
              <FontAwesome name="times" size={24} color="#6A707C" />
            </TouchableOpacity>
            <Text style={styles.modalTitle as StyleProp<TextStyle>}>Join Group</Text>
            <TouchableOpacity
              onPress={joinGroup}
              disabled={joining || !inviteCode.trim()}
            >
              <Text style={[
                styles.modalAction as StyleProp<TextStyle>,
                (!inviteCode.trim() || joining) && (styles.modalActionDisabled as StyleProp<TextStyle>)
              ]}>
                {joining ? 'Joining...' : 'Join'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent as StyleProp<ViewStyle>}>
            <View style={styles.inputGroup as StyleProp<ViewStyle>}>
              <Text style={styles.inputLabel as StyleProp<TextStyle>}>Invite Code</Text>
              <TextInput
                style={styles.textInput as StyleProp<TextStyle>}
                placeholder="e.g., A1B2C3D4"
                value={inviteCode}
                onChangeText={setInviteCode}
                maxLength={8}
                autoCapitalize="characters"
              />
              <Text style={styles.inputHint as StyleProp<TextStyle>}>
                Ask a group member for the invite code
              </Text>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

export default GroupsScreen; 