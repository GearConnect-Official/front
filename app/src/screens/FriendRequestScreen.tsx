import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
  Animated,
  RefreshControl,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import FriendRequestItem from "../components/FriendRequestItem";
import AddFriendModal from "../components/AddFriendModal";
import styles from "../styles/friendRequestStyles";

// Racing color palette inspired by automotive and racing world
const THEME_COLORS = {
  primary: '#E10600', // Racing Red
  secondary: '#1E1E1E', // Racing Black
  tertiary: '#2D9CDB', // Accent Blue
  background: '#FFFFFF',
  card: '#F2F2F2',
  cardLight: '#F8F8F8',
  textPrimary: '#1E1E1E',
  textSecondary: '#6E6E6E',
  border: '#E0E0E0',
};

const FriendRequestScreen: React.FC = () => {
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("requests");
  const [isAddFriendModalVisible, setIsAddFriendModalVisible] = useState(false);
  const scrollY = new Animated.Value(0);

  const handleRefresh = () => {
    setRefreshing(true);
    // Simulate loading
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleAcceptRequest = () => {
    // Implement accept request logic
  };

  const handleAddFriend = (userId: string) => {
    // Implement add friend logic
    console.log(`Adding friend with ID: ${userId}`);
    setIsAddFriendModalVisible(false);
  };

  const handleAddNewFriend = () => {
    setIsAddFriendModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Fixed header */}
      <View style={[styles.header, { backgroundColor: THEME_COLORS.background }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <FontAwesome name="arrow-left" size={20} color={THEME_COLORS.secondary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: THEME_COLORS.secondary }]}>Network</Text>
        <View style={styles.placeholderRight}></View>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={THEME_COLORS.primary} />
        }
      >
        {/* Tabs filter section */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'requests' && styles.activeTab]} 
            onPress={() => setActiveTab('requests')}
          >
            <FontAwesome 
              name="user-plus" 
              size={22} 
              color={activeTab === 'requests' ? THEME_COLORS.primary : THEME_COLORS.textSecondary} 
            />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'connections' && styles.activeTab]} 
            onPress={() => setActiveTab('connections')}
          >
            <FontAwesome 
              name="users" 
              size={22} 
              color={activeTab === 'connections' ? THEME_COLORS.primary : THEME_COLORS.textSecondary} 
            />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'suggestions' && styles.activeTab]} 
            onPress={() => setActiveTab('suggestions')}
          >
            <FontAwesome 
              name="user-circle" 
              size={22} 
              color={activeTab === 'suggestions' ? THEME_COLORS.primary : THEME_COLORS.textSecondary} 
            />
          </TouchableOpacity>
        </View>

        {/* Tabs filter section */}
        <View style={styles.mainContainer}>
          {activeTab === "requests" && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Friend Requests</Text>
              <View style={styles.requestCard}>
                <Image
                  source={{ uri: "https://images.pexels.com/photos/1680172/pexels-photo-1680172.jpeg" }}
                  style={styles.avatarImage}
                />
                <View style={styles.requestInfo}>
                  <Text style={styles.requestName}>John Doe</Text>
                  <Text style={styles.requestMutual}>5 mutual friends</Text>
                  <View style={styles.requestActions}>
                    <TouchableOpacity style={styles.acceptButton} onPress={handleAcceptRequest}>
                      <Text style={styles.acceptButtonText}>Accept</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.declineButton}>
                      <Text style={styles.declineButtonText}>Decline</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              
              <View style={styles.requestCard}>
                <Image
                  source={{ uri: "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg" }}
                  style={styles.avatarImage}
                />
                <View style={styles.requestInfo}>
                  <Text style={styles.requestName}>Jane Smith</Text>
                  <Text style={styles.requestMutual}>2 mutual friends</Text>
                  <View style={styles.requestActions}>
                    <TouchableOpacity style={styles.acceptButton} onPress={handleAcceptRequest}>
                      <Text style={styles.acceptButtonText}>Accept</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.declineButton}>
                      <Text style={styles.declineButtonText}>Decline</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          )}

          {activeTab === "connections" && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Your Connections</Text>
              {/* Add connections list here */}
              <View style={styles.emptyContainer}>
                <FontAwesome name="users" size={60} color="#CCCCCC" />
                <Text style={styles.emptyTitle}>No Connections</Text>
                <Text style={styles.emptySubtitle}>Start connecting with other motorsport enthusiasts</Text>
              </View>
            </View>
          )}

          {activeTab === "suggestions" && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Suggestions</Text>
              {/* Add suggestions list here */}
              <View style={styles.emptyContainer}>
                <FontAwesome name="user-circle" size={60} color="#CCCCCC" />
                <Text style={styles.emptyTitle}>No Suggestions</Text>
                <Text style={styles.emptySubtitle}>We'll suggest connections based on your interests</Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Floating button */}
      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: THEME_COLORS.primary }]}
        onPress={handleAddNewFriend}
      >
        <FontAwesome name="user-plus" size={24} color="#FFFFFF" />
      </TouchableOpacity>
      
      <AddFriendModal
        visible={isAddFriendModalVisible}
        onClose={() => setIsAddFriendModalVisible(false)}
        onAddFriend={handleAddFriend}
      />
    </SafeAreaView>
  );
};

export default FriendRequestScreen;
