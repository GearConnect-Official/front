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
  const [activeTab, setActiveTab] = useState("events");
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
          <Text style={styles.title}>Events</Text>
          <Image
            source={{
              uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/43626c4467817d5c97a941ca2aa49658b61e2881710abcbf8801ae2a3234ff60",
            }}
            style={{ width: 24, height: 24 }}
          />
        </View>
      </View>

      <ScrollView>
        <View style={styles.searchContainer}>
          <View style={styles.searchField}>
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
          <TouchableOpacity style={styles.tab}>
            <Image
              source={{
                uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/e5b8fcc042d5d563e5476d082ed6310f68a06d3f12bbebb37bfc6229bc160a72",
              }}
              style={styles.tabIcon}
            />
            <Text style={styles.tabText}>Events from Followed</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.tab}>
            <Image
              source={{
                uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/1d9095950120850a446df3be385deadd007e47887f6ef267f2a4349ef3389f19",
              }}
              style={styles.tabIcon}
            />
            <Text style={styles.tabText}>Recommended Events</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.tab}>
            <Image
              source={{
                uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/82962f34b9d95c74114173326d8f23d375293ebf5f78fa77fda3cd880dec7b16",
              }}
              style={styles.tabIcon}
            />
            <Text style={styles.tabText}>Passed Events</Text>
          </TouchableOpacity>
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