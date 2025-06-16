import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text, ActivityIndicator, Alert, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import followService from '../services/followService';
import { FollowStats } from '../types/follow.types';
import { useAuth } from '../context/AuthContext';

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
      Alert.alert('Erreur', 'Vous devez être connecté pour suivre des utilisateurs');
      return;
    }

    const currentUserId = Number(user.id);
    
    // Vérifier qu'on ne peut pas se suivre soi-même
    if (currentUserId === targetUserId) {
      Alert.alert('Erreur', 'Vous ne pouvez pas vous suivre vous-même');
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
          'Erreur',
          response.error || 'Une erreur est survenue lors de l\'action'
        );
      }
    } catch (error) {
      console.error('Error in follow action:', error);
      Alert.alert('Erreur', 'Une erreur inattendue est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  const getButtonStyle = () => {
    // Style de base
    const baseStyle = {
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    };

    // Style pour le mode icône (circulaire)
    if (iconOnly) {
      const iconBaseStyle = {
        ...baseStyle,
        width: 36,
        height: 36,
        borderRadius: 18,
      };

      if (disabled) {
        return {
          ...iconBaseStyle,
          backgroundColor: '#E5E5E5',
        };
      }

      if (isFollowing) {
        return {
          ...iconBaseStyle,
          backgroundColor: '#E0E0E0',
        };
      } else {
        return {
          ...iconBaseStyle,
          backgroundColor: '#E10600',
        };
      }
    }

    // Style pour le mode texte (rectangulaire)
    const textBaseStyle = {
      ...baseStyle,
      flex: 1,
      paddingVertical: 10,
      borderRadius: 8,
    };

    if (disabled) {
      return {
        ...textBaseStyle,
        backgroundColor: '#E5E5E5',
      };
    }

    if (isFollowing) {
      return {
        ...textBaseStyle,
        backgroundColor: '#E0E0E0',
      };
    } else {
      return {
        ...textBaseStyle,
        backgroundColor: '#E10600',
      };
    }
  };

  const getTextStyle = () => {
    const baseStyle = {
      fontSize: 14,
      fontWeight: '600' as const,
    };

    if (disabled) {
      return {
        ...baseStyle,
        color: '#9CA3AF',
      };
    }

    // Texte blanc quand pas suivi (fond rouge), noir quand suivi (fond gris)
    return {
      ...baseStyle,
      color: isFollowing ? '#1E1E1E' : '#FFFFFF',
    };
  };

  const getButtonText = () => {
    if (isLoading) return '';
    return isFollowing ? 'Suivi(e)' : 'Suivre';
  };

  const getIcon = () => {
    if (isFollowing) {
      return 'person-remove';
    } else {
      return 'person-add';
    }
  };

  const getIconColor = () => {
    if (disabled) return '#9CA3AF';
    return isFollowing ? '#1E1E1E' : '#FFFFFF';
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
          color={disabled ? '#9CA3AF' : isFollowing ? '#1E1E1E' : '#FFFFFF'}
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

export default FollowButton; 