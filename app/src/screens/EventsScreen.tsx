import React, { useState, useEffect } from 'react';
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
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import styles from '../styles/eventsStyles';
import EventItem from '../components/EventItem';
import { RootStackParamList } from '@/app/App';
import { NavigationProp } from '@react-navigation/native';
import { useNavigation } from 'expo-router';
import eventService, { Event } from '../services/eventService';

const EventsScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
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
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  interface TabItem {
    key: string;
    label: string;
    icon: keyof typeof FontAwesome.glyphMap;
  }

  const tabs: TabItem[] = [
    { key: 'all', label: 'All Events', icon: 'calendar' },
    { key: 'upcoming', label: 'Upcoming Events', icon: 'star' },
    { key: 'passed', label: 'Passed Events', icon: 'history' },
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
      setError('Erreur lors du chargement des événements');
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleSearch = () => {
    if (searchQuery.length >= 3) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      const filtered = {
        all: events.all.filter((event) =>
          event.name.toLowerCase().includes(lowerCaseQuery)
        ),
        upcoming: events.upcoming.filter((event) =>
          event.name.toLowerCase().includes(lowerCaseQuery)
        ),
        passed: events.passed.filter((event) =>
          event.name.toLowerCase().includes(lowerCaseQuery)
        ),
      };
      setFilteredEvents(filtered);
    } else {
      setFilteredEvents(events);
    }
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await fetchEvents();
    setRefreshing(false);
  }, []);

  const handleEventPress = (eventId: number) => {
    navigation.navigate('EventDetail', { eventId });
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
          <View style={styles.topBarIcons}>
            <TouchableOpacity
              onPress={() => navigation.navigate('CreateEvent' as never)}
            >
              <FontAwesome name="plus" size={28} color="#1E232C" />
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
        <View style={styles.searchSection}>
          <View style={styles.searchBar}>
            <TextInput
              style={styles.searchInput}
              placeholder="Enter name to search for event"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
            />
            <TouchableOpacity
              style={styles.searchButton}
              onPress={handleSearch}
            >
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
                color={activeTab === tab.key ? '#FFFFFF' : '#1E232C'}
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
              <Text style={styles.retryButtonText}>Réessayer</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            <Text style={styles.sectionTitle}>
              {activeTab === 'all' && 'All Events'}
              {activeTab === 'upcoming' && 'Upcoming Events'}
              {activeTab === 'passed' && 'Passed Events'}
            </Text>
            {filteredEvents[activeTab]?.map((event, index) => (
              <EventItem
                key={event.id || index}
                title={event.name}
                subtitle={`Location: ${event.location}`}
                date={new Date(event.date).toLocaleDateString()}
                emoji="🎉"
                onPress={() => handleEventPress(event.id)}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default EventsScreen;
