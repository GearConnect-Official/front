import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import { useAuth } from '../src/context/AuthContext';
import eventService, { Event } from '../src/services/eventService';
import EventItem from '../src/components/items/EventItem';
import { checkMissingEventInfo, countEventsWithMissingInfo } from '../src/utils/eventMissingInfo';
import { API_URL_USERS } from '../src/config';
import { StyleSheet } from 'react-native';
import theme from '../src/styles/config/theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    ...theme.typography.h5,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
  },
  content: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  emptyText: {
    ...theme.typography.h6,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.md,
    textAlign: 'center',
  },
  statsContainer: {
    padding: theme.spacing.md,
    backgroundColor: '#f5f5f5',
    marginBottom: theme.spacing.sm,
  },
  statsText: {
    ...theme.typography.body1,
    color: theme.colors.text.primary,
  },
  warningText: {
    ...theme.typography.body1,
    color: '#F59E0B',
    fontWeight: '600',
    marginTop: theme.spacing.xs,
  },
  eventsList: {
    paddingBottom: theme.spacing.lg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const MyCreatedEventsScreen: React.FC = () => {
  const router = useRouter();
  const auth = useAuth();
  const currentUserId = auth?.user?.id ? Number(auth.user.id) : undefined;

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [eventsWithCreators, setEventsWithCreators] = useState<any[]>([]);

  const fetchCreatedEvents = async () => {
    if (!currentUserId) return;

    setLoading(true);
    try {
      const response = await eventService.getEventsByUserId(currentUserId.toString());
      
      if (response && response.events) {
        // Fetch creator names for each event
        const eventsWithCreatorInfo = await Promise.all(
          response.events.map(async (event: any) => {
            try {
              const userResponse = await fetch(`${API_URL_USERS}/${event.creatorId}`);
              if (userResponse.ok) {
                const user = await userResponse.json();
                return {
                  ...event,
                  creators: user.name || user.username || 'Unknown',
                };
              }
            } catch (error) {
              console.error(`Error fetching creator for event ${event.id}:`, error);
            }
            return {
              ...event,
              creators: 'Unknown',
            };
          })
        );

        setEvents(response.events);
        setEventsWithCreators(eventsWithCreatorInfo);
      }
    } catch (error) {
      console.error('Error fetching created events:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchCreatedEvents();
    }, [currentUserId])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchCreatedEvents();
    setRefreshing(false);
  }, [currentUserId]);

  const missingInfoCount = countEventsWithMissingInfo(events);

  const handleEventPress = (event: Event) => {
    // Vérifier si des infos manquent
    const missingInfo = checkMissingEventInfo(event);
    const eventId = typeof event.id === 'string' ? parseInt(event.id) : event.id;
    
    if (missingInfo.hasMissingInfo && eventId) {
      // Naviguer vers le formulaire post-event
      router.push({
        pathname: '/(app)/postEventInfo',
        params: { eventId: eventId.toString() },
      });
    } else {
      // Sinon, aller à la page de détail normale
      router.push({
        pathname: '/(app)/eventDetail',
        params: { eventId: event.id },
      });
    }
  };

  if (loading && events.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => router.back()}
          >
            <FontAwesome name="arrow-left" size={20} color="#1E232C" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Created Events</Text>
          <View style={styles.headerButton} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#E10600" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => router.back()}
        >
          <FontAwesome name="arrow-left" size={20} color="#1E232C" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Created Events</Text>
        <View style={styles.headerButton} />
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {missingInfoCount > 0 && (
          <View style={styles.statsContainer}>
            <Text style={styles.warningText}>
              ⚠️ {missingInfoCount} event{missingInfoCount > 1 ? 's' : ''} with missing information
            </Text>
            <Text style={[styles.statsText, { fontSize: 12, marginTop: 4, color: theme.colors.text.secondary }]}>
              Only events with missing information are displayed below
            </Text>
          </View>
        )}

        {events.length === 0 ? (
          <View style={styles.emptyContainer}>
            <FontAwesome name="calendar-o" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No events created yet</Text>
            <TouchableOpacity
              style={{
                marginTop: 16,
                padding: 12,
                backgroundColor: '#E10600',
                borderRadius: 8,
              }}
              onPress={() => router.push('/(app)/createEvent')}
            >
              <Text style={{ color: '#fff', fontWeight: '600' }}>
                Create Your First Event
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.eventsList}>
            {eventsWithCreators
              .filter((event: any) => {
                // Filtrer pour ne garder que les événements avec des informations manquantes
                const missingInfo = checkMissingEventInfo(event);
                return missingInfo.hasMissingInfo;
              })
              .map((event: any, index: number) => {
                const eventId = typeof event.id === 'string' ? parseInt(event.id) : event.id;
                const missingInfo = checkMissingEventInfo(event);
                
                return (
                  <EventItem
                    key={event.id?.toString() || index.toString()}
                    title={event.name}
                    subtitle={`By: ${event.creators || 'Unknown'}`}
                    date={new Date(event.date).toLocaleDateString('en-US', {
                      day: 'numeric',
                      month: 'short',
                    })}
                    emoji="🎉"
                    location={event.location}
                    attendees={event.participantsCount || 0}
                    onPress={() => handleEventPress(event)}
                    eventId={eventId}
                    creatorId={event.creatorId}
                    currentUserId={currentUserId}
                    isJoined={true}
                    eventDate={event.date}
                    meteo={event.meteo}
                    finished={event.finished}
                  />
                );
              })}
            {eventsWithCreators.filter((event: any) => {
              const missingInfo = checkMissingEventInfo(event);
              return missingInfo.hasMissingInfo;
            }).length === 0 && (
              <View style={styles.emptyContainer}>
                <FontAwesome name="check-circle" size={64} color="#10b981" />
                <Text style={styles.emptyText}>All events are complete!</Text>
                <Text style={[styles.emptyText, { fontSize: 14, marginTop: 8 }]}>
                  All your events have all the required information filled in.
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default MyCreatedEventsScreen;
