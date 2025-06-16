import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text, ActivityIndicator, Alert } from 'react-native';
import followService from '../services/followService';
import { FollowStats } from '../types/follow.types';

interface FollowButtonProps {
  targetUserId: number;
  initialFollowState?: boolean;
  onFollowStateChange?: (isFollowing: boolean, stats?: FollowStats) => void;
  size?: 'small' | 'medium' | 'large';
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
}

const FollowButton: React.FC<FollowButtonProps> = ({
  targetUserId,
  initialFollowState = false,
  onFollowStateChange,
  size = 'medium',
  variant = 'primary',
  disabled = false,
}) => {
  const [isFollowing, setIsFollowing] = useState(initialFollowState);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsFollowing(initialFollowState);
  }, [initialFollowState]);

  const handleFollowPress = async () => {
    if (isLoading || disabled) return;

    setIsLoading(true);
    try {
      const response = isFollowing
        ? await followService.unfollowUser(targetUserId)
        : await followService.followUser(targetUserId);

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
    // Style de base similaire au bouton "Modifier le profil"
    const baseStyle = {
      flex: 1,
      paddingVertical: 10,
      borderRadius: 8,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    };

    if (disabled) {
      return {
        ...baseStyle,
        backgroundColor: '#E5E5E5',
      };
    }

    // Style suivant le profil - rouge quand pas suivi, gris quand suivi
    if (isFollowing) {
      return {
        ...baseStyle,
        backgroundColor: '#E0E0E0', // Gris comme le bouton message
      };
    } else {
      return {
        ...baseStyle,
        backgroundColor: '#E10600', // Rouge racing comme le bouton "Modifier le profil"
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

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={handleFollowPress}
      disabled={disabled || isLoading}
      activeOpacity={0.7}
    >
      {isLoading ? (
        <ActivityIndicator
          size="small"
          color={disabled ? '#9CA3AF' : isFollowing ? '#1E1E1E' : '#FFFFFF'}
        />
      ) : (
        <Text style={getTextStyle()}>{getButtonText()}</Text>
      )}
    </TouchableOpacity>
  );
};

export default FollowButton; 