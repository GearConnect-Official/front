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
import { useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import AddFriendModal from "../components/modals/AddFriendModal";
import styles from "../styles/screens/friendRequestStyles";

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

const FriendsScreen: React.FC = () => {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("friends");
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
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <FontAwesome name="arrow-left" size={20} color={THEME_COLORS.secondary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: THEME_COLORS.secondary }]}>Friends</Text>
        <View style={styles.placeholderRight}></View>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={THEME_COLORS.primary} />
        }
      >
        {/* Tabs navigation section */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'friends' && styles.activeTab]} 
            onPress={() => setActiveTab('friends')}
          >
            <FontAwesome 
              name="users" 
              size={22} 
              color={activeTab === 'friends' ? THEME_COLORS.primary : THEME_COLORS.textSecondary} 
            />
            <Text style={[
              styles.tabText, 
              { color: activeTab === 'friends' ? THEME_COLORS.primary : THEME_COLORS.textSecondary }
            ]}>
              Mes amis
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'requests' && styles.activeTab]} 
            onPress={() => setActiveTab('requests')}
          >
            <FontAwesome 
              name="user-plus" 
              size={22} 
              color={activeTab === 'requests' ? THEME_COLORS.primary : THEME_COLORS.textSecondary} 
            />
            <Text style={[
              styles.tabText, 
              { color: activeTab === 'requests' ? THEME_COLORS.primary : THEME_COLORS.textSecondary }
            ]}>
              Reçues
            </Text>
            {/* Badge pour nouvelles demandes */}
            <View style={styles.badge}>
              <Text style={styles.badgeText}>2</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'sent' && styles.activeTab]} 
            onPress={() => setActiveTab('sent')}
          >
            <FontAwesome 
              name="paper-plane" 
              size={22} 
              color={activeTab === 'sent' ? THEME_COLORS.primary : THEME_COLORS.textSecondary} 
            />
            <Text style={[
              styles.tabText, 
              { color: activeTab === 'sent' ? THEME_COLORS.primary : THEME_COLORS.textSecondary }
            ]}>
              Envoyées
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content based on active tab */}
        <View style={styles.mainContainer}>
          {/* Onglet Mes amis */}
          {activeTab === "friends" && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Mes amis • 12</Text>
              
              {/* Liste des amis */}
              <View style={styles.friendCard}>
                <Image
                  source={{ uri: "https://images.pexels.com/photos/1680172/pexels-photo-1680172.jpeg" }}
                  style={styles.avatarImage}
                />
                <View style={styles.friendInfo}>
                  <Text style={styles.friendName}>Marc Dubois</Text>
                  <Text style={styles.friendStatus}>🏁 Pilote GT3 • En ligne</Text>
                </View>
                <TouchableOpacity style={styles.messageButton}>
                  <FontAwesome name="comment" size={18} color={THEME_COLORS.primary} />
                </TouchableOpacity>
              </View>

              <View style={styles.friendCard}>
                <Image
                  source={{ uri: "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg" }}
                  style={styles.avatarImage}
                />
                <View style={styles.friendInfo}>
                  <Text style={styles.friendName}>Sophie Martin</Text>
                  <Text style={styles.friendStatus}>🏎️ Formule 4 • Hors ligne</Text>
                </View>
                <TouchableOpacity style={styles.messageButton}>
                  <FontAwesome name="comment" size={18} color={THEME_COLORS.textSecondary} />
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Onglet Demandes reçues */}
          {activeTab === "requests" && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Demandes d'amis</Text>
              <View style={styles.requestCard}>
                <Image
                  source={{ uri: "https://images.pexels.com/photos/1680172/pexels-photo-1680172.jpeg" }}
                  style={styles.avatarImage}
                />
                <View style={styles.requestInfo}>
                  <Text style={styles.requestName}>John Doe</Text>
                  <Text style={styles.requestMutual}>🏁 5 amis en commun • Pilote amateur</Text>
                  <View style={styles.requestActions}>
                    <TouchableOpacity style={styles.acceptButton} onPress={handleAcceptRequest}>
                      <Text style={styles.acceptButtonText}>Accepter</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.declineButton}>
                      <Text style={styles.declineButtonText}>Refuser</Text>
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
                  <Text style={styles.requestMutual}>🏎️ 2 amis en commun • Karting</Text>
                  <View style={styles.requestActions}>
                    <TouchableOpacity style={styles.acceptButton} onPress={handleAcceptRequest}>
                      <Text style={styles.acceptButtonText}>Accepter</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.declineButton}>
                      <Text style={styles.declineButtonText}>Refuser</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          )}

          {/* Onglet Demandes envoyées */}
          {activeTab === "sent" && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Demandes envoyées</Text>
              
              <View style={styles.sentCard}>
                <Image
                  source={{ uri: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg" }}
                  style={styles.avatarImage}
                />
                <View style={styles.sentInfo}>
                  <Text style={styles.sentName}>Alex Rodriguez</Text>
                  <Text style={styles.sentStatus}>🏁 Demande envoyée il y a 2 jours</Text>
                </View>
                <TouchableOpacity style={styles.cancelButton}>
                  <Text style={styles.cancelButtonText}>Annuler</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.sentCard}>
                <Image
                  source={{ uri: "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg" }}
                  style={styles.avatarImage}
                />
                <View style={styles.sentInfo}>
                  <Text style={styles.sentName}>Lisa Chen</Text>
                  <Text style={styles.sentStatus}>🏎️ Demande envoyée il y a 5 jours</Text>
                </View>
                <TouchableOpacity style={styles.cancelButton}>
                  <Text style={styles.cancelButtonText}>Annuler</Text>
                </TouchableOpacity>
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

export default FriendsScreen;

