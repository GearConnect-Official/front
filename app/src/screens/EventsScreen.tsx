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
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import styles from "../styles/screens/events/eventsStyles";
import EventItem from "../components/items/EventItem";
import { useRouter, useFocusEffect } from "expo-router";
import { Event } from "../services/eventService";
import { LinearGradient } from "expo-linear-gradient";
import { API_URL_EVENTS, API_URL_USERS } from '../config';
import { useAuth } from "../context/AuthContext";
import userService from "../services/userService";
import PerformanceService from "../services/performanceService";
import eventService from "../services/eventService";
import { countEventsWithMissingInfo } from "../utils/eventMissingInfo";
import { trackScreenView } from "../utils/mixpanelTracking";

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
  const [joinedEventIds, setJoinedEventIds] = useState<Set<number>>(new Set());
  const [eventWinners, setEventWinners] = useState<Map<number, { userName: string; lapTime: string }>>(new Map());
  const [createdEvents, setCreatedEvents] = useState<Event[]>([]);
  const [missingInfoCount, setMissingInfoCount] = useState(0);
  const scrollX = React.useRef(new Animated.Value(0)).current;
  const router = useRouter();
  const auth = useAuth();
  const currentUserId = auth?.user?.id ? Number(auth.user.id) : undefined;

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

  // Charger les événements rejoints par l'utilisateur
  const fetchJoinedEvents = async () => {
    if (!currentUserId) return;
    
    try {
      const response = await userService.getJoinedEvents(currentUserId, 1, 100);
      if (response.success && response.data) {
        const joinedIds = new Set(
          response.data.events.map((event: any) => event.id)
        );
        setJoinedEventIds(joinedIds);
      }
    } catch (error) {
      console.error("Error fetching joined events:", error);
    }
  };

  // Charger les événements créés par l'utilisateur pour vérifier les infos manquantes
  const fetchCreatedEvents = async () => {
    if (!currentUserId) return;
    
    try {
      const response = await eventService.getEventsByUserId(currentUserId.toString());
      if (response && response.events) {
        setCreatedEvents(response.events);
        const missingCount = countEventsWithMissingInfo(response.events);
        setMissingInfoCount(missingCount);
      }
    } catch (error) {
      console.error("Error fetching created events:", error);
    }
  };

  // Fetch winners for events
  const fetchEventWinners = async (events: Event[]) => {
    const winnersMap = new Map<number, { userName: string; lapTime: string }>();
    
    await Promise.all(
      events.map(async (event) => {
        const eventId = typeof event.id === 'string' ? parseInt(event.id) : event.id;
        if (!eventId) return;

        try {
          const response = await PerformanceService.getEventPerformances(eventId);
          if (response.success && response.data && response.data.length > 0) {
            // Sort by race position and get the winner (position 1)
            const sorted = [...response.data].sort((a, b) => a.racePosition - b.racePosition);
            const winner = sorted[0];
            
            if (winner && winner.racePosition === 1) {
              // Fetch user info for winner
              try {
                const userResponse = await fetch(`${API_URL_USERS}/${winner.userId}`);
                if (userResponse.ok) {
                  const userData = await userResponse.json();
                  winnersMap.set(eventId, {
                    userName: userData.username || userData.name || `User ${winner.userId}`,
                    lapTime: winner.lapTime,
                  });
                } else {
                  winnersMap.set(eventId, {
                    userName: `User ${winner.userId}`,
                    lapTime: winner.lapTime,
                  });
                }
              } catch (error) {
                winnersMap.set(eventId, {
                  userName: `User ${winner.userId}`,
                  lapTime: winner.lapTime,
                });
              }
            }
          }
        } catch (error) {
          // Silently fail - not all events may have performances
          console.debug(`No performances found for event ${eventId}`);
        }
      })
    );

    setEventWinners(winnersMap);
  };

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    setIsNetworkError(false);
    try {
      // Charger les événements rejoints et créés en parallèle
      if (currentUserId) {
        fetchJoinedEvents();
        fetchCreatedEvents();
      }

      const response = await fetch(API_URL_EVENTS);
      if (!response.ok) {
        throw new Error(
          `Failed to fetch events: ${response.status} ${response.statusText}`
        );
      }
      const allEvents = await response.json();

      // Fetch organizers for each event (non-blocking, with error handling)
      // On charge d'abord les événements de base, puis on enrichit avec les organisateurs
      const eventsWithOrganizers = await Promise.all(
        allEvents.map(async (event: Event) => {
          try {
            const organizers = (event as any).organizers || [];
            const organizersWithDetails: { userId: number | null; name: string }[] = [];
            
            // Si pas d'organisateurs dans le tableau, inclure au moins le créateur
            if (organizers.length === 0 && event.creatorId) {
              try {
                const userResponse = await fetch(`${API_URL_USERS}/${event.creatorId}`);
                if (userResponse.ok) {
                  const user = await userResponse.json();
                  organizersWithDetails.push({
                    userId: event.creatorId,
                    name: user.username || user.name || 'Unknown',
                  });
                } else {
                  organizersWithDetails.push({
                    userId: event.creatorId,
                    name: 'Unknown',
                  });
                }
              } catch (error) {
                // En cas d'erreur, on utilise juste le nom par défaut
                organizersWithDetails.push({
                  userId: event.creatorId,
                  name: 'Unknown',
                });
              }
            } else if (organizers.length > 0) {
              // Récupérer les détails de chaque organisateur
              for (const org of organizers) {
                if (org.userId) {
                  try {
                    const userResponse = await fetch(`${API_URL_USERS}/${org.userId}`);
                    if (userResponse.ok) {
                      const user = await userResponse.json();
                      organizersWithDetails.push({
                        userId: org.userId,
                        name: user.username || user.name || org.name,
                      });
                    } else {
                      organizersWithDetails.push({
                        userId: org.userId,
                        name: org.name,
                      });
                    }
                  } catch (error) {
                    // En cas d'erreur, on utilise le nom de base
                    organizersWithDetails.push({
                      userId: org.userId,
                      name: org.name,
                    });
                  }
                } else {
                  // Organisateur externe
                  organizersWithDetails.push({
                    userId: null,
                    name: org.name,
                  });
                }
              }
            }
            
            return { ...event, organizers: organizersWithDetails };
          } catch (error) {
            // En cas d'erreur globale, retourner l'événement avec les organisateurs de base ou vide
            const baseOrganizers = (event as any).organizers || [];
            return { ...event, organizers: baseOrganizers };
          }
        })
      ).catch((error) => {
        // Si Promise.all échoue complètement, utiliser les événements de base sans organisateurs
        console.error('Error fetching organizers for events:', error);
        return allEvents.map((event: Event) => ({ ...event, organizers: (event as any).organizers || [] }));
      });

      const now = new Date();
      const upcomingEvents = eventsWithOrganizers.filter(
        (event: Event) => new Date(event.date) >= now
      );
      const passedEvents = eventsWithOrganizers.filter(
        (event: Event) => new Date(event.date) < now
      );

      // Define featured events (first 5 upcoming events)
      const featuredEvents = upcomingEvents.slice(0, 5);

      setFeatured(featuredEvents);
      setEvents({
        all: eventsWithOrganizers,
        upcoming: upcomingEvents,
        passed: passedEvents,
      });

      setFilteredEvents({
        all: eventsWithOrganizers,
        upcoming: upcomingEvents,
        passed: passedEvents,
      });

      // Fetch winners for all events
      await fetchEventWinners(eventsWithOrganizers);
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
      trackScreenView('Events');
      fetchEvents();
      fetchJoinedEvents();
      fetchCreatedEvents();
    }, [currentUserId])
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
    await Promise.all([
      fetchEvents(),
      fetchJoinedEvents(),
    ]);
    setRefreshing(false);
  }, [currentUserId]);

  const handleEventPress = (event: Event) => {
    // Vérifier si c'est le créateur avec des infos manquantes
    const eventId = typeof event.id === 'string' ? parseInt(event.id) : event.id;
    const isOrganizer = event.creatorId && currentUserId && event.creatorId === currentUserId;

    if (isOrganizer && eventId) {
      const { checkMissingEventInfo } = require('../utils/eventMissingInfo');
      const missingInfo = checkMissingEventInfo(event);
      
      if (missingInfo.hasMissingInfo) {
        // Naviguer vers le formulaire post-event
        router.push({
          pathname: '/(app)/postEventInfo',
          params: { eventId: eventId.toString() },
        });
        return;
      }
    }
    
    // Sinon, aller à la page de détail normale
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
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <View style={styles.topBarContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <FontAwesome name="arrow-left" size={24} color="#1E232C" />
          </TouchableOpacity>
          <Text style={styles.title}>Events</Text>
          <View style={styles.topBarIcons}>
            <TouchableOpacity
              style={styles.createButton}
              onPress={handleCreateEvent}
            >
              <FontAwesome name="plus" size={20} color="#fff" />
              <Text style={styles.createButtonText}>Create</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push('/(app)/myCreatedEvents')}
              style={{ position: 'relative' }}
            >
              <FontAwesome name="bell" size={24} color="#1E232C" />
              {missingInfoCount > 0 && (
                <View style={{
                  position: 'absolute',
                  top: -4,
                  right: -4,
                  backgroundColor: '#EF4444',
                  borderRadius: 10,
                  minWidth: 20,
                  height: 20,
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingHorizontal: 4,
                }}>
                  <Text style={{
                    color: '#fff',
                    fontSize: 10,
                    fontWeight: 'bold',
                  }}>
                    {missingInfoCount > 9 ? '9+' : missingInfoCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>
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
                <FontAwesome name="exclamation-triangle" size={50} color="#E10600" />
                <Text style={styles.errorText}>{error}</Text>
              </>
            )}
            <TouchableOpacity style={styles.retryButton} onPress={fetchEvents}>
              <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        ) : filteredEvents[activeTab]?.length === 0 ? (
          renderEmptyState()
        ) : (
          <View style={styles.eventsContainer}>
            <Text style={styles.sectionTitle}>
              {activeTab === 'all' && 'All Events'}
              {activeTab === 'upcoming' && 'Upcoming Events'}
              {activeTab === 'passed' && 'Past Events'}
            </Text>
            {filteredEvents[activeTab]?.map((event: Event, index: number) => {
              const eventId = typeof event.id === 'string' ? parseInt(event.id) : event.id;
              const isJoined = eventId ? joinedEventIds.has(eventId) : false;
              // Utiliser le nombre réel de participants depuis l'API
              const participantsCount = event.participantsCount || 0;
              
              const winner = eventId ? eventWinners.get(eventId) : null;
              
              return (
                <EventItem
                  key={event.id?.toString() || index.toString()}
                  title={event.name}
                  subtitle={`By: ${event.creators}`}
                  date={new Date(event.date).toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'short',
                  })}
                  emoji="🎉"
                  location={event.location}
                  attendees={participantsCount}
                  onPress={() => handleEventPress(event)}
                  eventId={eventId}
                  creatorId={event.creatorId}
                  currentUserId={currentUserId}
                  isJoined={isJoined}
                  winner={winner || undefined}
                  eventDate={event.date}
                  meteo={event.meteo}
                  finished={event.finished}
                  participationTagText={event.participationTagText}
                  participationTagColor={event.participationTagColor}
                  organizers={(event as any).organizers || []}
                  onJoinSuccess={() => {
                    // Mettre à jour uniquement l'état local pour le statut join
                    if (currentUserId && eventId) {
                      setJoinedEventIds((prev) => new Set(prev).add(eventId));
                      // Recharger les événements pour avoir le nombre de participants à jour depuis la DB
                      fetchEvents();
                    }
                  }}
                  onLeaveSuccess={() => {
                    // Mettre à jour uniquement l'état local pour le statut join
                    if (currentUserId && eventId) {
                      setJoinedEventIds((prev) => {
                        const newSet = new Set(prev);
                        newSet.delete(eventId);
                        return newSet;
                      });
                      // Recharger les événements pour avoir le nombre de participants à jour depuis la DB
                      fetchEvents();
                    }
                  }}
                />
              );
            })}
          </View>
        )}



          <View style={{ height: 60 }} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default EventsScreen;
