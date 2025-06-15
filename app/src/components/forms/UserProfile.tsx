import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import styles from '../../styles/Profile/userProfileStyles';
import { useMessage } from '../../context/MessageContext';
import MessageService from '../../services/messageService';

interface UserProfileProps {
  navigateToHome?: () => void;
  onLogout?: () => void;
  user?: any;
}

const UserProfile: React.FC<UserProfileProps> = ({
  navigateToHome,
  onLogout,
  user,
}) => {
  const { logout } = useAuth();
  const { showConfirmation, showError } = useMessage();

  const handleLogout = () => {
    showConfirmation({
      ...MessageService.CONFIRMATIONS.LOGOUT,
      onConfirm: () => {
        if (onLogout) {
          onLogout();
        }
      }
    });
  };

  const handleError = (error: string) => {
    showError(error);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{
            uri:
              user?.photoURL ||
              "https://cdn.builder.io/api/v1/image/assets/TEMP/f3d67917c6442fafa158ab0bdb706f7194e5a329b13b72692715ec90abbf8ce7?placeholderIfAbsent=true",
          }}
          style={styles.profileImage}
        />
        <Text style={styles.username}>{user?.username || "Username"}</Text>
        <Text style={styles.email}>{user?.email || "email@example.com"}</Text>
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.infoItem}>
          <FontAwesome name="user" size={18} color="#1E232C" />
          <Text style={styles.infoText}>Account Information</Text>
        </View>

        <View style={styles.infoItem}>
          <FontAwesome name="bell" size={18} color="#1E232C" />
          <Text style={styles.infoText}>Notifications</Text>
        </View>

        <View style={styles.infoItem}>
          <FontAwesome name="lock" size={18} color="#1E232C" />
          <Text style={styles.infoText}>Privacy & Security</Text>
        </View>

        <View style={styles.infoItem}>
          <FontAwesome name="cog" size={18} color="#1E232C" />
          <Text style={styles.infoText}>Settings</Text>
        </View>

        <TouchableOpacity
          style={[styles.infoItem, styles.logoutItem]}
          onPress={handleLogout}
        >
          <FontAwesome name="sign-out" size={18} color="#FF4C4C" />
          <Text style={[styles.infoText, styles.logoutText]}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default UserProfile;
