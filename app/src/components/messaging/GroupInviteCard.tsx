import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import theme from '../../styles/config/theme';
import groupService from '../../services/groupService';
import { CloudinaryAvatar } from '../media/CloudinaryImage';

const { width: screenWidth } = Dimensions.get('window');
const MAX_CARD_WIDTH = screenWidth * 0.85;
const MIN_CARD_WIDTH = screenWidth * 0.70;

export interface GroupInviteData {
  inviteCode: string;
  groupName?: string;
  groupIcon?: string;
  groupIconPublicId?: string;
}

interface GroupInviteCardProps {
  inviteData: GroupInviteData;
  isOwn: boolean;
  currentUserId: number;
}

const GroupInviteCard: React.FC<GroupInviteCardProps> = ({ inviteData, isOwn, currentUserId }) => {
  const [joining, setJoining] = useState(false);
  const [groupInfo, setGroupInfo] = useState<{ name?: string; iconPublicId?: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Try to fetch group info from the invite code if not provided
    if (!inviteData.groupName && inviteData.inviteCode) {
      // We could fetch group info here, but for now we'll use what's provided
      // The backend endpoint would need to return group info when joining
    }
  }, [inviteData]);

  const handleJoin = async () => {
    if (joining) return;

    setJoining(true);
    try {
      const result = await groupService.joinGroup(inviteData.inviteCode, currentUserId);
      
      // Update group info if available
      if (result.group) {
        setGroupInfo({
          name: result.group.name,
          iconPublicId: result.group.iconPublicId,
        });
      }
      
      Alert.alert(
        'Success',
        `You've joined ${result.group.name}!`,
        [
          {
            text: 'OK',
            onPress: () => {
              // Navigate to the group
              router.push({
                pathname: '/(app)/groupDetail',
                params: {
                  groupId: result.group.id.toString(),
                },
              });
            },
          },
        ]
      );
    } catch (error: any) {
      console.error('Error joining group:', error);
      const errorMessage = error.response?.data?.error || 'Failed to join group';
      Alert.alert('Error', errorMessage);
    } finally {
      setJoining(false);
    }
  };

  const displayName = inviteData.groupName || groupInfo?.name || 'Group Invitation';

  return (
    <View style={[styles.container, isOwn && styles.ownContainer]}>
      <View style={styles.content}>
        {/* Group Icon or Default Icon */}
        <View style={[styles.iconContainer, isOwn && styles.ownIconContainer]}>
          {inviteData.groupIconPublicId || groupInfo?.iconPublicId ? (
            <CloudinaryAvatar
              publicId={inviteData.groupIconPublicId || groupInfo?.iconPublicId || ''}
              size={screenWidth * 0.12}
            />
          ) : (
            <FontAwesome
              name="users"
              size={screenWidth * 0.06}
              color={isOwn ? '#FFFFFF' : theme.colors.primary.main}
            />
          )}
        </View>

        <View style={styles.infoContainer}>
          <Text
            style={[styles.groupName, isOwn && styles.ownGroupName]}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {displayName}
          </Text>

          <Text style={[styles.inviteText, isOwn && styles.ownInviteText]}>
            Group Invitation
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.joinButton, isOwn && styles.ownJoinButton, joining && styles.joinButtonDisabled]}
        onPress={handleJoin}
        disabled={joining}
        activeOpacity={0.7}
      >
        {joining ? (
          <ActivityIndicator size="small" color={isOwn ? '#FFFFFF' : '#FFFFFF'} />
        ) : (
          <Text style={[styles.joinButtonText, isOwn && styles.ownJoinButtonText]}>
            Join
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 12,
    marginVertical: 4,
    maxWidth: MAX_CARD_WIDTH,
    minWidth: MIN_CARD_WIDTH,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  ownContainer: {
    backgroundColor: theme.colors.primary.main,
    borderColor: theme.colors.primary.main,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: screenWidth * 0.12,
    height: screenWidth * 0.12,
    borderRadius: screenWidth * 0.06,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 2,
    borderColor: theme.colors.primary.main,
  },
  ownIconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderColor: '#FFFFFF',
  },
  infoContainer: {
    flex: 1,
  },
  groupName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  ownGroupName: {
    color: '#FFFFFF',
  },
  inviteText: {
    fontSize: 12,
    color: '#6A707C',
  },
  ownInviteText: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  joinButton: {
    backgroundColor: theme.colors.primary.main,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 40,
  },
  ownJoinButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  joinButtonDisabled: {
    opacity: 0.6,
  },
  joinButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  ownJoinButtonText: {
    color: '#FFFFFF',
  },
});

export default GroupInviteCard;
