import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import styles from "../styles/profileStyles";
import { useNavigation } from "@react-navigation/native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import UserProfile from "../components/UserProfile";
import { useAuth } from "../context/AuthContext";

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("profile");

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <View style={styles.topBarContent}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <FontAwesome name="arrow-left" size={24} color="#1E232C" />
          </TouchableOpacity>
          <Text style={styles.topBarTitle}>Profile</Text>
          <View style={{ width: 24 }} />
        </View>
      </View>

      <View style={styles.tabBar}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'profile' && styles.activeTab]} 
          onPress={() => setActiveTab('profile')}
        >
          <Text style={[styles.tabText, activeTab === 'profile' && styles.activeTabText]}>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'events' && styles.activeTab]} 
          onPress={() => setActiveTab('events')}
        >
          <Text style={[styles.tabText, activeTab === 'events' && styles.activeTabText]}>Events</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'results' && styles.activeTab]} 
          onPress={() => setActiveTab('results')}
        >
          <Text style={[styles.tabText, activeTab === 'results' && styles.activeTabText]}>Results</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {activeTab === 'profile' ? (
          <UserProfile />
        ) : activeTab === 'events' ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Events I attended</Text>
            
            <View style={styles.eventCard}>
              <Image
                source={{
                  uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/be16d124c072203f4c7e4964e1c65b26abecafb8b6dff77d49b8076a20a0703f?placeholderIfAbsent=true",
                }}
                style={styles.eventImage}
              />
              <View style={styles.eventInfo}>
                <Text style={styles.eventTitle}>Course Karting RKC</Text>
                <Text style={styles.eventResult}>Victory</Text>
              </View>
            </View>
            
            <Text style={styles.sectionTitle}>Events I've organized</Text>
            <View style={styles.eventCard}>
              <Image
                source={{
                  uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/59769d4a5ce342f7171b3d99e95d2ab9ee8b2590995a3882c02db3205cf60a92?placeholderIfAbsent=true",
                }}
                style={styles.eventImage}
              />
              <View style={styles.eventInfo}>
                <Text style={styles.eventTitle}>
                  Val de Vienne Beginner Open Circuit
                </Text>
                <Text style={styles.eventVenue}>Val de Vienne Circuit</Text>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>My Results</Text>
            
            <View style={styles.resultCard}>
              <View style={styles.resultHeader}>
                <Text style={styles.resultEvent}>Course Karting RKC</Text>
                <Text style={styles.resultDate}>March 15, 2023</Text>
              </View>
              <View style={styles.resultDetails}>
                <View style={styles.resultItem}>
                  <Text style={styles.resultLabel}>Position:</Text>
                  <Text style={styles.resultValue}>1st</Text>
                </View>
                <View style={styles.resultItem}>
                  <Text style={styles.resultLabel}>Best Lap:</Text>
                  <Text style={styles.resultValue}>1:23.456</Text>
                </View>
                <View style={styles.resultItem}>
                  <Text style={styles.resultLabel}>Championship Points:</Text>
                  <Text style={styles.resultValue}>25</Text>
                </View>
              </View>
            </View>
            
            <View style={styles.resultCard}>
              <View style={styles.resultHeader}>
                <Text style={styles.resultEvent}>Val de Vienne Circuit</Text>
                <Text style={styles.resultDate}>February 28, 2023</Text>
              </View>
              <View style={styles.resultDetails}>
                <View style={styles.resultItem}>
                  <Text style={styles.resultLabel}>Position:</Text>
                  <Text style={styles.resultValue}>3rd</Text>
                </View>
                <View style={styles.resultItem}>
                  <Text style={styles.resultLabel}>Best Lap:</Text>
                  <Text style={styles.resultValue}>1:24.789</Text>
                </View>
                <View style={styles.resultItem}>
                  <Text style={styles.resultLabel}>Championship Points:</Text>
                  <Text style={styles.resultValue}>15</Text>
                </View>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;
