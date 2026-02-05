import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Animated,
  Platform,
  Dimensions,
} from 'react-native';
import MapView, { Marker, Region, PROVIDER_GOOGLE } from 'react-native-maps';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import {
  MOCK_EVENTS,
  EVENT_CATEGORIES,
  DEFAULT_REGION,
  MapEvent,
  EventCategory,
} from '../mocks/eventMapMockData';
import styles from '../styles/screens/events/eventMapStyles';
import theme from '../styles/config/theme';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.72 + 12; // card width + marginRight

const EventMapScreen: React.FC = () => {
  const router = useRouter();
  const mapRef = useRef<MapView>(null);
  const scrollRef = useRef<ScrollView>(null);
  const cardSlideAnim = useRef(new Animated.Value(300)).current;

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategories, setActiveCategories] = useState<Set<EventCategory>>(new Set());
  const [selectedEvent, setSelectedEvent] = useState<MapEvent | null>(null);
  const [filteredEvents, setFilteredEvents] = useState<MapEvent[]>(MOCK_EVENTS);
  const [_region, setRegion] = useState<Region>(DEFAULT_REGION);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  // Request location permission and get user location
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        try {
          const loc = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          });
          setUserLocation({
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
          });
        } catch {
          // Use default Paris location
        }
      }
    })();
  }, []);

  // Filter events
  useEffect(() => {
    let events = MOCK_EVENTS;

    if (activeCategories.size > 0) {
      events = events.filter((e) => activeCategories.has(e.category));
    }

    if (searchQuery.length >= 2) {
      const query = searchQuery.toLowerCase();
      events = events.filter(
        (e) =>
          e.name.toLowerCase().includes(query) ||
          e.location.toLowerCase().includes(query) ||
          e.organizer.toLowerCase().includes(query)
      );
    }

    setFilteredEvents(events);
  }, [activeCategories, searchQuery]);

  // Animate bottom card in/out
  useEffect(() => {
    if (selectedEvent) {
      Animated.spring(cardSlideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start();
    } else {
      Animated.timing(cardSlideAnim, {
        toValue: 300,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [selectedEvent]);

  const toggleCategory = useCallback((cat: EventCategory) => {
    setActiveCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) {
        next.delete(cat);
      } else {
        next.add(cat);
      }
      return next;
    });
    setSelectedEvent(null);
  }, []);

  const getCategoryInfo = (category: EventCategory) => {
    return EVENT_CATEGORIES.find((c) => c.key === category)!;
  };

  const handleMarkerPress = useCallback((event: MapEvent) => {
    setSelectedEvent(event);
    mapRef.current?.animateToRegion(
      {
        latitude: event.latitude - 0.15,
        longitude: event.longitude,
        latitudeDelta: 0.8,
        longitudeDelta: 0.8,
      },
      350
    );
  }, []);

  const handleMapPress = useCallback(() => {
    setSelectedEvent(null);
  }, []);

  const handleLocateMe = useCallback(() => {
    if (userLocation) {
      mapRef.current?.animateToRegion(
        {
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 0.5,
          longitudeDelta: 0.5,
        },
        400
      );
    } else {
      mapRef.current?.animateToRegion(DEFAULT_REGION, 400);
    }
    setSelectedEvent(null);
  }, [userLocation]);

  const handleCarouselCardPress = useCallback((event: MapEvent) => {
    setSelectedEvent(event);
    mapRef.current?.animateToRegion(
      {
        latitude: event.latitude - 0.15,
        longitude: event.longitude,
        latitudeDelta: 0.8,
        longitudeDelta: 0.8,
      },
      350
    );
  }, []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderMarker = (event: MapEvent) => {
    const catInfo = getCategoryInfo(event.category);
    const isSelected = selectedEvent?.id === event.id;

    return (
      <Marker
        key={event.id}
        coordinate={{ latitude: event.latitude, longitude: event.longitude }}
        onPress={() => handleMarkerPress(event)}
        tracksViewChanges={false}
      >
        <View style={styles.markerContainer}>
          <View
            style={[
              styles.markerBubble,
              { backgroundColor: catInfo.color },
              event.isJoined && styles.markerBubbleJoined,
              isSelected && { transform: [{ scale: 1.2 }] },
            ]}
          >
            <FontAwesome
              name={catInfo.icon as any}
              size={16}
              color="#fff"
            />
          </View>
          <View
            style={[
              styles.markerArrow,
              { borderTopColor: event.isJoined ? theme.colors.status.success : catInfo.color },
            ]}
          />
        </View>
      </Marker>
    );
  };

  const renderCarouselCard = (event: MapEvent) => {
    const catInfo = getCategoryInfo(event.category);
    const fillRatio = event.participantsCount / event.maxParticipants;

    return (
      <TouchableOpacity
        key={event.id}
        style={styles.carouselCard}
        activeOpacity={0.9}
        onPress={() => handleCarouselCardPress(event)}
      >
        <View style={styles.carouselCardContent}>
          <View style={styles.carouselCardTop}>
            <View style={[styles.carouselCardCategory, { backgroundColor: catInfo.color }]}>
              <Text style={styles.carouselCardCategoryText}>{catInfo.label}</Text>
            </View>
            <Text style={styles.carouselCardPrice}>{event.price}</Text>
          </View>

          <Text style={styles.carouselCardTitle} numberOfLines={1}>
            {event.name}
          </Text>

          <View style={styles.carouselCardInfo}>
            <FontAwesome name="map-marker" size={12} color={theme.colors.text.secondary} />
            <Text style={styles.carouselCardInfoText} numberOfLines={1}>
              {event.location}
            </Text>
          </View>

          <View style={styles.carouselCardInfo}>
            <FontAwesome name="calendar" size={11} color={theme.colors.text.secondary} />
            <Text style={styles.carouselCardInfoText}>
              {formatDate(event.date)} - {formatTime(event.date)}
            </Text>
          </View>

          <View style={styles.carouselCardFooter}>
            <View style={styles.carouselCardParticipants}>
              <FontAwesome name="users" size={11} color={theme.colors.text.secondary} />
              <Text style={styles.carouselCardParticipantsText}>
                {event.participantsCount}/{event.maxParticipants}
              </Text>
              <View style={styles.carouselCardProgressBar}>
                <View
                  style={[
                    styles.carouselCardProgressFill,
                    {
                      width: `${Math.min(fillRatio * 100, 100)}%`,
                      backgroundColor: fillRatio > 0.8 ? theme.colors.status.warning : catInfo.color,
                    },
                  ]}
                />
              </View>
            </View>

            {event.isJoined && (
              <View style={styles.carouselCardJoinedBadge}>
                <FontAwesome name="check-circle" size={10} color={theme.colors.status.success} />
                <Text style={styles.carouselCardJoinedText}>Inscrit</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderBottomCard = () => {
    if (!selectedEvent) return null;

    const catInfo = getCategoryInfo(selectedEvent.category);
    const fillRatio = selectedEvent.participantsCount / selectedEvent.maxParticipants;

    return (
      <Animated.View
        style={[
          styles.bottomCardContainer,
          { transform: [{ translateY: cardSlideAnim }] },
        ]}
      >
        <View style={styles.bottomCard}>
          <View style={styles.bottomCardHandle} />

          <View style={styles.bottomCardHeader}>
            <View style={styles.bottomCardHeaderLeft}>
              <View style={styles.bottomCardCategory}>
                <FontAwesome name={catInfo.icon as any} size={12} color={catInfo.color} />
                <Text style={[styles.bottomCardCategoryText, { color: catInfo.color }]}>
                  {catInfo.label}
                </Text>
              </View>
              <Text style={styles.bottomCardTitle} numberOfLines={2}>
                {selectedEvent.name}
              </Text>
            </View>
            <Text style={styles.bottomCardPrice}>{selectedEvent.price}</Text>
          </View>

          <View style={styles.bottomCardInfoRow}>
            <View style={styles.bottomCardInfoItem}>
              <FontAwesome name="map-marker" size={14} color={theme.colors.primary.main} />
              <Text style={styles.bottomCardInfoText} numberOfLines={1}>
                {selectedEvent.location}
              </Text>
            </View>
            <View style={styles.bottomCardInfoItem}>
              <FontAwesome name="calendar" size={13} color={theme.colors.primary.main} />
              <Text style={styles.bottomCardInfoText}>
                {formatDate(selectedEvent.date)}
              </Text>
            </View>
            <View style={styles.bottomCardInfoItem}>
              <FontAwesome name="clock-o" size={14} color={theme.colors.primary.main} />
              <Text style={styles.bottomCardInfoText}>
                {formatTime(selectedEvent.date)}
              </Text>
            </View>
            <View style={styles.bottomCardInfoItem}>
              <FontAwesome name="users" size={13} color={theme.colors.primary.main} />
              <Text style={styles.bottomCardInfoText}>
                {selectedEvent.participantsCount}/{selectedEvent.maxParticipants}
              </Text>
            </View>
          </View>

          <Text style={styles.bottomCardDescription} numberOfLines={2}>
            {selectedEvent.description}
          </Text>

          <View style={styles.bottomCardActions}>
            <TouchableOpacity
              style={styles.detailButton}
              onPress={() =>
                router.push({
                  pathname: '/(app)/eventDetail',
                  params: { eventId: selectedEvent.id.toString() },
                })
              }
            >
              <Text style={styles.detailButtonText}>Voir les details</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.joinButton,
                selectedEvent.isJoined && styles.joinButtonJoined,
              ]}
              onPress={() => {
                // Mock toggle join
                const updated = filteredEvents.map((e) =>
                  e.id === selectedEvent.id ? { ...e, isJoined: !e.isJoined } : e
                );
                setFilteredEvents(updated);
                setSelectedEvent({ ...selectedEvent, isJoined: !selectedEvent.isJoined });
              }}
            >
              <Text
                style={[
                  styles.joinButtonText,
                  selectedEvent.isJoined && styles.joinButtonTextJoined,
                ]}
              >
                {selectedEvent.isJoined ? 'Inscrit' : "S'inscrire"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Map */}
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={DEFAULT_REGION}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        showsUserLocation
        showsMyLocationButton={false}
        showsCompass={false}
        onPress={handleMapPress}
        onRegionChangeComplete={setRegion}
        mapPadding={{ top: 140, right: 0, bottom: 200, left: 0 }}
      >
        {filteredEvents.map(renderMarker)}
      </MapView>

      {/* Top overlay: back button + search + filters */}
      <View style={styles.topBarOverlay} pointerEvents="box-none">
        <View style={styles.topBarRow}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <FontAwesome name="arrow-left" size={18} color={theme.colors.text.primary} />
          </TouchableOpacity>

          <View style={styles.searchBarContainer}>
            <FontAwesome name="search" size={15} color={theme.colors.text.secondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Rechercher un evenement..."
              placeholderTextColor={theme.colors.text.hint}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <FontAwesome name="times-circle" size={16} color={theme.colors.text.secondary} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.categoryContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryScroll}
          >
            {EVENT_CATEGORIES.map((cat) => {
              const isActive = activeCategories.has(cat.key);
              return (
                <TouchableOpacity
                  key={cat.key}
                  style={[
                    styles.categoryChip,
                    isActive && { backgroundColor: cat.color },
                  ]}
                  onPress={() => toggleCategory(cat.key)}
                  activeOpacity={0.7}
                >
                  <FontAwesome
                    name={cat.icon as any}
                    size={12}
                    color={isActive ? '#fff' : cat.color}
                  />
                  <Text
                    style={[
                      styles.categoryChipText,
                      isActive && styles.categoryChipTextActive,
                    ]}
                  >
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </View>

      {/* Event count badge */}
      <View style={styles.eventCountBadge}>
        <Text style={styles.eventCountText}>
          {filteredEvents.length} evenement{filteredEvents.length !== 1 ? 's' : ''} trouves
        </Text>
      </View>

      {/* Locate me button */}
      <TouchableOpacity style={styles.locateButton} onPress={handleLocateMe}>
        <FontAwesome name="crosshairs" size={22} color={theme.colors.primary.main} />
      </TouchableOpacity>

      {/* Bottom: carousel or selected card */}
      {selectedEvent ? (
        renderBottomCard()
      ) : (
        <View style={styles.carouselContainer}>
          <ScrollView
            ref={scrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carouselScroll}
            snapToInterval={CARD_WIDTH}
            decelerationRate="fast"
            snapToAlignment="start"
          >
            {filteredEvents.length > 0 ? (
              filteredEvents.map(renderCarouselCard)
            ) : (
              <View style={styles.emptyCarouselCard}>
                <FontAwesome name="search" size={28} color={theme.colors.grey[300]} />
                <Text style={styles.emptyText}>Aucun evenement dans cette zone</Text>
              </View>
            )}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

export default EventMapScreen;
