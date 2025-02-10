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
import { useNavigation } from "@react-navigation/native"; // Ensure correct import

const EventsScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState("events");
  const [searchQuery, setSearchQuery] = useState("");
  const navigation = useNavigation<NavigationProp<RootStackParamList>>(); // Ensure correct type

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
          <EventItem
            icon="https://cdn.builder.io/api/v1/image/assets/TEMP/195e688422d05c9500d42aa0c3cae55c033638dbc5d497a4a86fb4a31b4d5a46?placeholderIfAbsent=true&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/195e688422d05c9500d42aa0c3cae55c033638dbc5d497a4a86fb4a31b4d5a46?placeholderIfAbsent=true&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/195e688422d05c9500d42aa0c3cae55c033638dbc5d497a4a86fb4a31b4d5a46?placeholderIfAbsent=true&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/195e688422d05c9500d42aa0c3cae55c033638dbc5d497a4a86fb4a31b4d5a46?placeholderIfAbsent=true&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/195e688422d05c9500d42aa0c3cae55c033638dbc5d497a4a86fb4a31b4d5a46?placeholderIfAbsent=true&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/195e688422d05c9500d42aa0c3cae55c033638dbc5d497a4a86fb4a31b4d5a46?placeholderIfAbsent=true&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/195e688422d05c9500d42aa0c3cae55c033638dbc5d497a4a86fb4a31b4d5a46?placeholderIfAbsent=true&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/195e688422d05c9500d42aa0c3cae55c033638dbc5d497a4a86fb4a31b4d5a46?placeholderIfAbsent=true"
            title="Open circuit Débutant Val de Vienne"
            subtitle="Category: Open day, Free Entry"
            date="January 26, 2025"
            onPress={() => handleEventPress(1)} // Pass the event ID
          />
          <EventItem
            emoji="📅"
            title="Workshop"
            subtitle="Learn new skills"
            date="May 20, 2023"
            onPress={() => handleEventPress(2)} // Pass the event ID
          />
          <EventItem
            emoji="🎉"
            title="Music Concert"
            subtitle="Live performance"
            date="June 5, 2023"
            onPress={() => handleEventPress(3)} // Pass the event ID
          />
        </View>

        <View>
          <Text style={styles.sectionTitle}>Recommended Events</Text>
          <EventItem
            emoji="🎭"
            title="Theatre Play"
            subtitle="Dramatic performance"
            date="August 15, 2023"
            onPress={() => handleEventPress(4)} // Pass the event ID
          />
          <EventItem
            emoji="🌟"
            title="Art Exhibition"
            subtitle="Local artists' works"
            date="July 10, 2023"
            onPress={() => handleEventPress(5)} // Pass the event ID
          />
          <EventItem
            emoji="🎭"
            title="Theatre Play"
            subtitle="Dramatic performance"
            date="August 15, 2023"
            onPress={() => handleEventPress(6)} // Pass the event ID
          />
        </View>

        <View>
          <Text style={styles.sectionTitle}>Passed Events</Text>
          <EventItem
            icon="https://cdn.builder.io/api/v1/image/assets/TEMP/1ae1df285602cf46cd4ba3b1b4a0a29ef7376257d3eeb0eef5f42599d72d904b?placeholderIfAbsent=true&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/1ae1df285602cf46cd4ba3b1b4a0a29ef7376257d3eeb0eef5f42599d72d904b?placeholderIfAbsent=true&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/1ae1df285602cf46cd4ba3b1b4a0a29ef7376257d3eeb0eef5f42599d72d904b?placeholderIfAbsent=true&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/1ae1df285602cf46cd4ba3b1b4a0a29ef7376257d3eeb0eef5f42599d72d904b?placeholderIfAbsent=true&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/1ae1df285602cf46cd4ba3b1b4a0a29ef7376257d3eeb0eef5f42599d72d904b?placeholderIfAbsent=true&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/1ae1df285602cf46cd4ba3b1b4a0a29ef7376257d3eeb0eef5f42599d72d904b?placeholderIfAbsent=true&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/1ae1df285602cf46cd4ba3b1b4a0a29ef7376257d3eeb0eef5f42599d72d904b?placeholderIfAbsent=true&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/1ae1df285602cf46cd4ba3b1b4a0a29ef7376257d3eeb0eef5f42599d72d904b?placeholderIfAbsent=true"
            title="Course karting RKC"
            subtitle="Category : Race, French Championship"
            date="January 17, 2025"
            onPress={() => handleEventPress(7)} // Pass the event ID
          />
          <EventItem
            emoji="🌟"
            title="Art Exhibition"
            subtitle="Local artists' works"
            date="July 10, 2023"
            onPress={() => handleEventPress(8)} // Pass the event ID
          />
          <EventItem
            emoji="🎭"
            title="Theatre Play"
            subtitle="Dramatic performance"
            date="August 15, 2023"
            onPress={() => handleEventPress(9)} // Pass the event ID
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EventsScreen;