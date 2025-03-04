import React from "react";
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import FriendRequestItem from "../components/FriendRequestItem";
import styles from "../styles/friendRequestStyles";

const FriendRequestScreen: React.FC = () => {
  const navigation = useNavigation();

  const handleAcceptRequest = () => {
    // Implement accept request logic
  };

  const handleAddFriend = () => {
    // Implement add friend logic
  };

  const handleAddNewFriend = () => {
    // Implement add new friend logic
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <View style={styles.topBarContent}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <FontAwesome name="arrow-left" size={24} color="#1E232C" />
          </TouchableOpacity>
          <Text style={styles.title}>Friend Requests</Text>
          <View style={{ width: 24 }} />
        </View>
      </View>

      <ScrollView style={styles.mainContent}>
        <View>
          <Text style={styles.sectionTitle}>Friend Requests</Text>
          <FriendRequestItem
            name="John Doe"
            emoji="👥"
            isRequest
            onAction={handleAcceptRequest}
          />
          <FriendRequestItem
            name="Jane Smith"
            emoji="👥"
            isRequest
            onAction={handleAcceptRequest}
          />
          <FriendRequestItem
            name="Alex Johnson"
            emoji="👥"
            isRequest
            onAction={handleAcceptRequest}
          />
        </View>

        <View>
          <Text style={styles.sectionTitle}>Recommended Friends</Text>
          <FriendRequestItem
            name="Sarah Brown"
            emoji="👤"
            onAction={handleAddFriend}
          />
          <FriendRequestItem
            name="Mike White"
            emoji="👤"
            onAction={handleAddFriend}
          />
          <FriendRequestItem
            name="Emily Black"
            emoji="👤"
            onAction={handleAddFriend}
          />
        </View>

        <TouchableOpacity
          style={styles.addNewButton}
          onPress={handleAddNewFriend}
        >
          <Text style={styles.addNewButtonText}>Add New Friend</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default FriendRequestScreen;
