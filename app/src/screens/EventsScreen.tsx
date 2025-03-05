import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import styles from "../styles/eventsStyles";
import EventItem from "../components/EventItem";
import { RootStackParamList } from "@/app/App";
import { NavigationProp } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { MOCK_EVENTS } from "../data/mock"; // Import mock events

const EventsScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState("recommended");
  const [searchQuery, setSearchQuery] = useState("");
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handleEventPress = (eventId: number) => {
    navigation.navigate("EventDetail", { eventId });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <View style={styles.topBarContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <FontAwesome name="arrow-left" size={24} color="#1E232C" />
          </TouchableOpacity>
          </TouchableOpacity>
          <Text style={styles.title}>Events</Text>
          <View style={styles.topBarIcons}>
            <TouchableOpacity
              onPress={() => navigation.navigate("CreateEvent" as never)}
            >
              <FontAwesome name="plus" size={28} color="#1E232C" />
            </TouchableOpacity>
            <TouchableOpacity>
              <FontAwesome name="bell" size={24} color="#1E232C" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView>
        <View style={styles.searchSection}>
          <View style={styles.searchBar}>
            <TextInput
              style={styles.searchInput}
              placeholder="Enter name to search for event"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <TouchableOpacity style={styles.searchButton}>
              <FontAwesome name="search" size={20} color="white" />
            </TouchableOpacity>
          </View>
          <Text style={styles.searchInfo}>Type at least 3 characters</Text>
        </View>

        <View style={styles.tabGroup}>
          {tabs.map((tab: TabItem) => (
            <TouchableOpacity
              key={tab.key}
              onPress={() => setActiveTab(tab.key)}
              style={[
                styles.tab,
                activeTab === tab.key ? styles.activeTab : {},
              ]}
            >
              <FontAwesome
                name={tab.icon}
                size={20}
                color={activeTab === tab.key ? "#FFFFFF" : "#1E232C"}
                style={styles.tabIcon}
              />
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab.key ? styles.activeTabText : {},
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View>
          <Text style={styles.sectionTitle}>Events from Followed</Text>
          {MOCK_EVENTS.map((event) => (
            <EventItem
              key={event.id}
              icon={event.images[0]}
              title={event.title}
              subtitle={event.category}
              date={event.details.date}
              onPress={() => handleEventPress(event.id)}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EventsScreen;