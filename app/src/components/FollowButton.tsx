import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text, ActivityIndicator, Alert, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import followService from '../services/followService';
import { FollowStats } from '../types/follow.types';
import { useAuth } from '../context/AuthContext';
import theme from '../styles/config/theme';

interface FollowButtonProps {
  targetUserId: number;
  initialFollowState?: boolean;
  onFollowStateChange?: (isFollowing: boolean, stats?: FollowStats) => void;
  size?: 'small' | 'medium' | 'large';
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
  iconOnly?: boolean;
}

const FollowButton: React.FC<FollowButtonProps> = ({
  targetUserId,
  initialFollowState = false,
  onFollowStateChange,
  size = 'medium',
  variant = 'primary',
  disabled = false,
  iconOnly = false,
}) => {
  const [isFollowing, setIsFollowing] = useState(initialFollowState);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth() || {};

  useEffect(() => {
    setIsFollowing(initialFollowState);
  }, [initialFollowState]);

  const handleFollowPress = async () => {
    if (isLoading || disabled) return;

    // Vérifier que l'utilisateur est connecté
    if (!user || !user.id) {
      Alert.alert('Error', 'You must be logged in to follow users');
      return;
    }

    const currentUserId = Number(user.id);
    
    // Vérifier qu'on ne peut pas se suivre soi-même
    if (currentUserId === targetUserId) {
      Alert.alert('Error', 'You cannot follow yourself');
      return;
    }

    setIsLoading(true);
    try {
      const response = isFollowing
        ? await followService.unfollowUser(targetUserId, currentUserId)
        : await followService.followUser(targetUserId, currentUserId);

      if (response.success && response.data) {
        const newFollowState = response.data.isFollowing;
        setIsFollowing(newFollowState);
        
        if (onFollowStateChange) {
          onFollowStateChange(newFollowState, {
            followersCount: response.data.followersCount,
            followingCount: response.data.followingCount,
            isFollowing: newFollowState,
          });
        }
      } else {
        Alert.alert(
          'Error',
          response.error || 'An error occurred during the action'
        );
      }
    } catch (error) {
      console.error('Error in follow action:', error);
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const getButtonStyle = () => {
    if (iconOnly) {
      if (disabled) return styles.iconButtonDisabled;
      return isFollowing ? styles.iconButtonFollowing : styles.iconButtonNotFollowing;
    }

    if (disabled) return styles.textButtonDisabled;
    return isFollowing ? styles.textButtonFollowing : styles.textButtonNotFollowing;
  };

  const getTextStyle = () => {
    if (disabled) return styles.textDisabled;
    return isFollowing ? styles.textFollowing : styles.textNotFollowing;
  };

  const getButtonText = () => {
    if (isLoading) return '';
    return isFollowing ? 'Following' : 'Follow';
  };

  const getIcon = () => {
    if (isFollowing) {
      return 'person-remove';
    } else {
      return 'person-add';
    }
  };

  const getIconColor = () => {
    if (disabled) return theme.colors.text.disabled;
    return isFollowing ? theme.colors.text.primary : theme.colors.common.white;
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={handleFollowPress}
      disabled={disabled || isLoading || !user}
      activeOpacity={0.7}
    >
      {isLoading ? (
        <ActivityIndicator
          size="small"
          color={disabled ? theme.colors.text.disabled : isFollowing ? theme.colors.text.primary : theme.colors.common.white}
        />
      ) : iconOnly ? (
        <Ionicons
          name={getIcon()}
          size={18}
          color={getIconColor()}
        />
      ) : (
        <Text style={getTextStyle()}>{getButtonText()}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Icon button styles
  iconButtonBase: {
    ...theme.common.centerContent,
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  iconButtonDisabled: {
    ...theme.common.centerContent,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.grey[200],
  },
  iconButtonFollowing: {
    ...theme.common.centerContent,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.grey[300],
  },
  iconButtonNotFollowing: {
    ...theme.common.centerContent,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.primary.main,
  },

  // Text button styles
  textButtonBase: {
    ...theme.common.centerContent,
    flex: 1,
    paddingVertical: theme.spacing.xs + 2,
    borderRadius: theme.borders.radius.xs,
  },
  textButtonDisabled: {
    ...theme.common.centerContent,
    flex: 1,
    paddingVertical: theme.spacing.xs + 2,
    borderRadius: theme.borders.radius.xs,
    backgroundColor: theme.colors.grey[200],
  },
  textButtonFollowing: {
    ...theme.common.centerContent,
    flex: 1,
    paddingVertical: theme.spacing.xs + 2,
    borderRadius: theme.borders.radius.xs,
    backgroundColor: theme.colors.grey[300],
  },
  textButtonNotFollowing: {
    ...theme.common.centerContent,
    flex: 1,
    paddingVertical: theme.spacing.xs + 2,
    borderRadius: theme.borders.radius.xs,
    backgroundColor: theme.colors.primary.main,
  },

  // Text styles
  textBase: {
    ...theme.typography.body2,
    fontWeight: theme.typography.weights.semiBold,
  },
  textDisabled: {
    ...theme.typography.body2,
    fontWeight: theme.typography.weights.semiBold,
    color: theme.colors.text.disabled,
  },
  textFollowing: {
    ...theme.typography.body2,
    fontWeight: theme.typography.weights.semiBold,
    color: theme.colors.text.primary,
  },
  textNotFollowing: {
    ...theme.typography.body2,
    fontWeight: theme.typography.weights.semiBold,
    color: theme.colors.common.white,
  },
});

export default FollowButton; 