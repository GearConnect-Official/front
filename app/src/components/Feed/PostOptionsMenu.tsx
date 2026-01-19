import React, { useState } from 'react';
import {
  View,
  Modal,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useAuth } from "../../context/AuthContext";
import followService from '../../services/followService';
import { trackSocial } from '../../utils/mixpanelTracking';

interface PostOptionsMenuProps {
  visible: boolean;
  onClose: () => void;
  onReport: () => void;
  onCopyLink: () => void;
  isOwnPost: boolean;
  position?: { x: number; y: number };
  postUserId?: number; // ID de l'utilisateur qui a créé le post (pour unfollow)
}

const PostOptionsMenu: React.FC<PostOptionsMenuProps> = ({
  visible,
  onClose,
  onReport,
  onCopyLink,
  isOwnPost,
  position = { x: 0, y: 0 },
  postUserId,
}) => {
  const { width } = Dimensions.get('window');
  const menuWidth = 200;
  const menuX = Math.max(0, position.x - menuWidth - 8);
  const auth = useAuth();
  const { user } = auth || {};
  const [isUnfollowLoading, setIsUnfollowLoading] = useState(false);

  const handleUnfollow = async () => {
    if (isUnfollowLoading) return;

    if (!user || !user.id) {
      Alert.alert('Error', 'You must be logged in to unfollow users');
      return;
    }

    if (!postUserId) {
      Alert.alert('Error', 'Unable to unfollow this user');
      onClose();
      return;
    }

    const currentUserId = Number(user.id);

    if (currentUserId === postUserId) {
      Alert.alert('Error', 'You cannot unfollow yourself');
      onClose();
      return;
    }

    setIsUnfollowLoading(true);
    try {
      const response = await followService.unfollowUser(postUserId, currentUserId);

      if (response.success) {
        trackSocial.unfollowed(String(postUserId));
        Alert.alert('Success', 'User unfollowed');
      } else {
        Alert.alert('Error', response.error || 'Failed to unfollow user');
      }
    } catch (error) {
      console.error('Error unfollowing user:', error);
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setIsUnfollowLoading(false);
      onClose();
    }
  };


  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View 
              style={[
                styles.menuContainer,
                {
                  position: 'absolute',
                  left: menuX,
                  top: position.y + 8,
                }
              ]}
            >
              {isOwnPost ? (
                <>
                  <TouchableOpacity style={styles.option} onPress={onCopyLink}>
                    <FontAwesome name="link" size={20} color="#262626" />
                    <Text style={styles.optionText}>Copy link</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.option}>
                    <FontAwesome name="pencil" size={20} color="#262626" />
                    <Text style={styles.optionText}>Edit</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.option}>
                    <FontAwesome name="archive" size={20} color="#262626" />
                    <Text style={styles.optionText}>Archive</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={[styles.option, styles.deleteOption]}>
                    <FontAwesome name="trash" size={20} color="#E1306C" />
                    <Text style={[styles.optionText, styles.deleteText]}>Delete</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  {/* <TouchableOpacity style={styles.option} onPress={onReport}>
                    <FontAwesome name="flag" size={20} color="#262626" />
                    <Text style={styles.optionText}>Report</Text>
                  </TouchableOpacity> */}
                  
                  <TouchableOpacity 
                    style={styles.option} 
                    onPress={handleUnfollow}
                    disabled={isUnfollowLoading}
                  >
                    {isUnfollowLoading ? (
                      <ActivityIndicator size="small" color="#262626" />
                    ) : (
                      <FontAwesome name="user-times" size={20} color="#262626" />
                    )}
                    <Text style={styles.optionText}>Unfollow</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.option} onPress={onCopyLink}>
                    <FontAwesome name="link" size={20} color="#262626" />
                    <Text style={styles.optionText}>Copy link</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  menuContainer: {
    width: 200,
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },
  optionText: {
    fontSize: 16,
    marginLeft: 16,
    color: '#262626',
  },
  deleteOption: {
    borderBottomWidth: 0,
  },
  deleteText: {
    color: '#E1306C',
  },
});

export default PostOptionsMenu; 
