import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  RefreshControl,
  Image,
  FlatList,
  Animated,
  Dimensions,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import styles from "../styles/eventsStyles";
import EventItem from "../components/EventItem";
import { RootStackParamList } from "@/app/App";
import { NavigationProp, useIsFocused } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import eventService, { Event } from "../services/eventService";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.8;

const EventsScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [events, setEvents] = useState<{ [key: string]: Event[] }>({
    all: [],
    upcoming: [],
    passed: [],
  });
  const [filteredEvents, setFilteredEvents] = useState<{ [key: string]: Event[] }>({
    all: [],
    upcoming: [],
    passed: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [featured, setFeatured] = useState<Event[]>([]);
  const scrollX = React.useRef(new Animated.Value(0)).current;
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const isFocused = useIsFocused();

  interface TabItem {
    key: string;
    label: string;
    icon: keyof typeof FontAwesome.glyphMap;
  }

  const tabs: TabItem[] = [
    { key: "all", label: "All Events", icon: "calendar" },
    { key: "upcoming", label: "Upcoming Events", icon: "star" },
    { key: "passed", label: "Passed Events", icon: "history" },
  ];

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const allEvents = await eventService.getAllEvents();
      
      const now = new Date();
      const upcomingEvents = allEvents.filter(
        (event: Event) => new Date(event.date) >= now
      );
      const passedEvents = allEvents.filter(
        (event: Event) => new Date(event.date) < now
      );

      // Define featured events (first 5 upcoming events)
      const featuredEvents = upcomingEvents.slice(0, 5);

      setFeatured(featuredEvents);
      setEvents({
        all: allEvents,
        upcoming: upcomingEvents,
        passed: passedEvents,
      });

      setFilteredEvents({
        all: allEvents,
        upcoming: upcomingEvents,
        passed: passedEvents,
      });

    } catch (err) {
      setError("Error loading events");
      console.error("Error fetching events:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      fetchEvents();
    }
  }, [isFocused]);

  const handleSearch = () => {
    if (searchQuery.length >= 3) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      const filtered = {
        all: events.all.filter(event =>
          event.name.toLowerCase().includes(lowerCaseQuery)
        ),
        upcoming: events.upcoming.filter(event =>
          event.name.toLowerCase().includes(lowerCaseQuery)
        ),
        passed: events.passed.filter(event =>
          event.name.toLowerCase().includes(lowerCaseQuery)
        ),
      };
      setFilteredEvents(filtered);
    } else if (searchQuery === "") {
      setFilteredEvents(events);
    }
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await fetchEvents();
    setRefreshing(false);
  }, []);

  const handleEventPress = (event: Event) => {
    // Navigation to event details (to be implemented)
    Alert.alert("Event Selected", `You selected ${event.name}`);
  };

  const renderFeaturedItem = ({ item, index }: { item: Event; index: number }) => {
    const date = new Date(item.date);
    const formattedDate = date.toLocaleDateString('en-US', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });

    const inputRange = [
      (index - 1) * CARD_WIDTH,
      index * CARD_WIDTH,
      (index + 1) * CARD_WIDTH,
    ];

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.9, 1, 0.9],
      extrapolate: 'clamp',
    });

    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.7, 1, 0.7],
      extrapolate: 'clamp',
    });

    return (
      <TouchableOpacity
        onPress={() => handleEventPress(item)}
        activeOpacity={0.9}
      >
        <Animated.View style={{
          width: CARD_WIDTH,
          transform: [{ scale }],
          opacity,
          marginHorizontal: 10,
        }}>
          <View style={styles.featuredCard}>
            <Image
              source={{ uri: item.logo || 'https://via.placeholder.com/300x200?text=Event' }}
              style={styles.featuredImage}
            />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.8)']}
              style={styles.featuredGradient}
            >
              <Text style={styles.featuredDate}>{formattedDate}</Text>
              <Text style={styles.featuredTitle}>{item.name}</Text>
              <Text style={styles.featuredLocation}>
                <FontAwesome name="map-marker" size={14} color="#fff" /> {item.location}
              </Text>
              <View style={styles.featuredActions}>
                <TouchableOpacity style={styles.featuredButton}>
                  <Text style={styles.featuredButtonText}>Join</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.featuredIconButton}>
                  <FontAwesome name="share" size={16} color="#fff" />
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <FontAwesome name="calendar-o" size={64} color="#ccc" />
      <Text style={styles.emptyText}>No events found</Text>
      <Text style={styles.emptySubtext}>
        Be the first to create an event!
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <View style={styles.topBarContent}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <FontAwesome name="arrow-left" size={24} color="#1E232C" />
          </TouchableOpacity>
          <Text style={styles.title}>Events</Text>
          <View style={styles.topBarIcons}>
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => navigation.navigate("CreateEvent" as never)}
            >
              <FontAwesome name="plus" size={20} color="#fff" />
              <Text style={styles.createButtonText}>Create</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <FontAwesome name="bell" size={24} color="#1E232C" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Hero section */}
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>Discover Amazing Events</Text>
          <Text style={styles.heroSubtitle}>
            Join the community and share your passions
          </Text>
        </View>

        {/* Featured events carousel */}
        {featured.length > 0 && (
          <View style={styles.featuredSection}>
            <Text style={styles.sectionTitle}>Featured Events</Text>
            <Animated.FlatList
              data={featured}
              keyExtractor={(item) => item.id || Math.random().toString()}
              renderItem={renderFeaturedItem}
              horizontal
              showsHorizontalScrollIndicator={false}
              pagingEnabled
              snapToInterval={CARD_WIDTH + 20}
              decelerationRate="fast"
              contentContainerStyle={{ paddingHorizontal: 10 }}
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                { useNativeDriver: true }
              )}
            />
          </View>
        )}

        <View style={styles.searchSection}>
          <View style={styles.searchBar}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search for an event"
              value={searchQuery}
              onChangeText={(text) => {
                setSearchQuery(text);
                if (text === "") {
                  setFilteredEvents(events);
                }
              }}
              onSubmitEditing={handleSearch}
            />
            <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
              <FontAwesome name="search" size={20} color="white" />
            </TouchableOpacity>
          </View>
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

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#1E232C" />
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchEvents}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : filteredEvents[activeTab]?.length === 0 ? (
          renderEmptyState()
        ) : (
          <View style={styles.eventsContainer}>
            <Text style={styles.sectionTitle}>
              {activeTab === "all" && "All Events"}
              {activeTab === "upcoming" && "Upcoming Events"}
              {activeTab === "passed" && "Past Events"}
            </Text>
            {filteredEvents[activeTab]?.map((event, index) => (
              <EventItem
                key={event.id || index}
                title={event.name}
                subtitle={`By: ${event.creators}`}
                date={new Date(event.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                emoji="🎉"
                location={event.location}
                attendees={Math.floor(Math.random() * 100)}
                onPress={() => handleEventPress(event)}
              />
            ))}
          </View>
        )}

        {/* CTA Section */}
        <View style={styles.ctaSection}>
          <LinearGradient
            colors={['#3a86ff', '#5e60ce']}
            style={styles.ctaGradient}
          >
            <Text style={styles.ctaTitle}>Organize Your Own Event</Text>
            <Text style={styles.ctaText}>
              Share your passion and meet new people
            </Text>
            <TouchableOpacity 
              style={styles.ctaButton}
              onPress={() => navigation.navigate("CreateEvent" as never)}
            >
              <Text style={styles.ctaButtonText}>Create Now</Text>
              <FontAwesome name="arrow-right" size={16} color="#3a86ff" />
            </TouchableOpacity>
          </LinearGradient>
        </View>
        
        <View style={{ height: 60 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default EventsScreen;
