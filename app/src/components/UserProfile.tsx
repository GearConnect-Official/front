import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useAuth } from '../context/AuthContext';

interface UserProfileProps {
  navigateToHome?: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ navigateToHome }) => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Logout",
          onPress: async () => {
            await logout();
          },
          style: "destructive"
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image 
          source={{ 
            uri: user?.avatar || 'https://cdn.builder.io/api/v1/image/assets/TEMP/f3d67917c6442fafa158ab0bdb706f7194e5a329b13b72692715ec90abbf8ce7?placeholderIfAbsent=true'
          }} 
          style={styles.profileImage} 
        />
        <Text style={styles.username}>{user?.username || 'Username'}</Text>
        <Text style={styles.email}>{user?.email || 'email@example.com'}</Text>
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
        
        <TouchableOpacity style={[styles.infoItem, styles.logoutItem]} onPress={handleLogout}>
          <FontAwesome name="sign-out" size={18} color="#FF4C4C" />
          <Text style={[styles.infoText, styles.logoutText]}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#E8ECF4',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#1E232C',
  },
  email: {
    fontSize: 16,
    color: '#6A707C',
    marginBottom: 10,
  },
  infoContainer: {
    padding: 20,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E8ECF4',
  },
  infoText: {
    fontSize: 16,
    marginLeft: 15,
    color: '#1E232C',
  },
  logoutItem: {
    marginTop: 20,
    borderBottomWidth: 0,
  },
  logoutText: {
    color: '#FF4C4C',
  },
});

export default UserProfile; 