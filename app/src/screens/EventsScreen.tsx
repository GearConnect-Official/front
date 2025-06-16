import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
  Image,
  Animated,
  Dimensions,
  StatusBar,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import styles from "../styles/screens/events/eventsStyles";
import EventItem from "../components/items/EventItem";
import { useRouter, useFocusEffect } from "expo-router";
import { Event } from "../services/eventService";
import { LinearGradient } from "expo-linear-gradient";
import { API_URL_EVENTS, API_URL_USERS } from "../config";

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
  const [filteredEvents, setFilteredEvents] = useState<{
    [key: string]: Event[];
  }>({
    all: [],
    upcoming: [],
    passed: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isNetworkError, setIsNetworkError] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [featured, setFeatured] = useState<Event[]>([]);
  const scrollX = React.useRef(new Animated.Value(0)).current;
  const router = useRouter();

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
    setIsNetworkError(false);
    try {
      const response = await fetch(API_URL_EVENTS);
      if (!response.ok) {
        throw new Error(
          `Failed to fetch events: ${response.status} ${response.statusText}`
        );
      }
      const allEvents = await response.json();

      // fetch user name from API_URL_USERS by userId with event creatorId
      const eventsWithCreators = await Promise.all(
        allEvents.map(async (event: Event) => {
          try {
            const userResponse = await fetch(
              `${API_URL_USERS}/${event.creatorId}`
            );
            if (!userResponse.ok) {
              console.error(
                `Failed to fetch user for event ${event.id}: ${userResponse.status}`
              );
              return { ...event, creators: "Unknown" };
            }
            const user = await userResponse.json();
            return { ...event, creators: user.name };
          } catch (error) {
            console.error(
              `Error fetching creator for event ${event.id}:`,
              error
            );
            return { ...event, creators: "Unknown" };
          }
        })
      );

      const now = new Date();
      const upcomingEvents = eventsWithCreators.filter(
        (event: Event) => new Date(event.date) >= now
      );
      const passedEvents = eventsWithCreators.filter(
        (event: Event) => new Date(event.date) < now
      );

      // Define featured events (first 5 upcoming events)
      const featuredEvents = upcomingEvents.slice(0, 5);

      setFeatured(featuredEvents);
      setEvents({
        all: eventsWithCreators,
        upcoming: upcomingEvents,
        passed: passedEvents,
      });

      setFilteredEvents({
        all: eventsWithCreators,
        upcoming: upcomingEvents,
        passed: passedEvents,
      });
    } catch (err) {
      // Check if it's a network error (fetch API throws TypeError for network issues)
      if (
        err instanceof TypeError &&
        (err.message.includes("Network request failed") ||
          err.message.includes("Failed to fetch"))
      ) {
        setIsNetworkError(true);
        setError(
          "Your WiFi connection might not be working properly. Please check your internet connection and try again."
        );
      } else {
        setError("Unable to load events. Please try again later.");
      }
      // console.error("Error fetching events:", err);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchEvents();
    }, [])
  );

  const handleSearch = () => {
    if (searchQuery.length >= 3) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      const filtered = {
        all: events.all.filter((event: Event) =>
          event.name.toLowerCase().includes(lowerCaseQuery)
        ),
        upcoming: events.upcoming.filter((event: Event) =>
          event.name.toLowerCase().includes(lowerCaseQuery)
        ),
        passed: events.passed.filter((event: Event) =>
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
    router.push({
      pathname: "/(app)/eventDetail",
      params: { eventId: event.id },
    });
  };

  const handleCreateEvent = () => {
    router.push("/(app)/createEvent");
  };

  const renderFeaturedItem = ({
    item,
    index,
  }: {
    item: Event;
    index: number;
  }) => {
    const date = new Date(item.date);
    const formattedDate = date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    const inputRange = [
      (index - 1) * CARD_WIDTH,
      index * CARD_WIDTH,
      (index + 1) * CARD_WIDTH,
    ];

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.9, 1, 0.9],
      extrapolate: "clamp",
    });

    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.7, 1, 0.7],
      extrapolate: "clamp",
    });

    return (
      <TouchableOpacity
        onPress={() => handleEventPress(item)}
        activeOpacity={0.9}
      >
        <Animated.View
          style={{
            width: CARD_WIDTH,
            transform: [{ scale }],
            opacity,
            marginHorizontal: 10,
          }}
        >
          <View style={styles.featuredCard}>
            <Image
              source={{
                uri:
                  item.logo || "https://via.placeholder.com/300x200?text=Event",
              }}
              style={styles.featuredImage}
            />
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.8)"]}
              style={styles.featuredGradient}
            >
              <Text style={styles.featuredDate}>{formattedDate}</Text>
              <Text style={styles.featuredTitle}>{item.name}</Text>
              <Text style={styles.featuredLocation}>
                <FontAwesome name="map-marker" size={14} color="#fff" />
                {item.location}
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
      <Text style={styles.emptySubtext}>Be the first to create an event!</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <FontAwesome name="arrow-left" size={20} color="#1A1A1A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Events</Text>
          <View style={styles.placeholderRight} />
        </View>
        <View style={styles.contentContainer}>
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
                  keyExtractor={(item: Event) =>
                    item.id?.toString() || Math.random().toString()
                  }
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
                  onChangeText={(text: string) => {
                    setSearchQuery(text);
                    if (text === "") {
                      setFilteredEvents(events);
                    }
                  }}
                  onSubmitEditing={handleSearch}
                />
                <TouchableOpacity
                  style={styles.searchButton}
                  onPress={handleSearch}
                >
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
                {isNetworkError ? (
                  <>
                    <FontAwesome name="wifi" size={50} color="#E10600" />
                    <Text style={styles.errorTitle}>Connection Issue</Text>
                    <Text style={styles.errorText}>{error}</Text>
                  </>
                ) : (
                  <>
                    <FontAwesome
                      name="exclamation-triangle"
                      size={50}
                      color="#E10600"
                    />
                    <Text style={styles.errorText}>{error}</Text>
                  </>
                )}
                <TouchableOpacity
                  style={styles.retryButton}
                  onPress={fetchEvents}
                >
                  <Text style={styles.retryButtonText}>Try Again</Text>
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
                {filteredEvents[activeTab]?.map(
                  (event: Event, index: number) => (
                    <EventItem
                      key={event.id?.toString() || index.toString()}
                      title={event.name}
                      subtitle={`By: ${event.creators}`}
                      date={new Date(event.date).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "short",
                      })}
                      emoji="🎉"
                      location={event.location}
                      attendees={Math.floor(Math.random() * 100)}
                      onPress={() => handleEventPress(event)}
                    />
                  )
                )}
              </View>
            )}

            {/* CTA Section */}
            <View style={styles.ctaSection}>
              <LinearGradient
                colors={["#3a86ff", "#5e60ce"]}
                style={styles.ctaGradient}
              >
                <Text style={styles.ctaTitle}>Organize Your Own Event</Text>
                <Text style={styles.ctaText}>
                  Share your passion and meet new people
                </Text>
                <TouchableOpacity
                  style={styles.ctaButton}
                  onPress={handleCreateEvent}
                >
                  <Text style={styles.ctaButtonText}>Create Now</Text>
                  <FontAwesome name="arrow-right" size={16} color="#3a86ff" />
                </TouchableOpacity>
              </LinearGradient>
            </View>

            <View style={{ height: 60 }} />
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default EventsScreen;
