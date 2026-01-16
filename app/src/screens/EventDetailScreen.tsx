import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { EventInterface } from '../services/EventInterface';
import { styles } from '../styles/screens/events/eventDetailStyles';
import {
  API_URL_EVENTS,
  API_URL_EVENTTAGS,
  API_URL_EVENTREVIEWS,
  API_URL_TAGS,
  API_URL_USERS,
} from '../config';
import { useAuth } from '../context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import EventDetailReview from '../components/EventDetailReview';
import EventResultsGrid from '../components/EventResults/EventResultsGrid';
import PerformanceService from '../services/performanceService';
import { Performance } from '../types/performance.types';
import EventTag from '../components/EventTag';
import { CloudinaryAvatar } from '../components/media/CloudinaryImage';
import { trackEvent, trackScreenView } from '../utils/mixpanelTracking';

const EventDetailScreen: React.FC = () => {
  const params = useLocalSearchParams();
  const router = useRouter();
  const eventId = params.eventId as string;
  const [event, setEvent] = useState<EventInterface | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const auth = useAuth();
  const user = auth?.user || null;
  const [userReview, setUserReview] = useState<
    EventInterface["reviews"][0] | null
  >(null);
  const [isOrganizer, setIsOrganizer] = useState<boolean>(false);
  const [eventPerformances, setEventPerformances] = useState<Performance[]>([]);
  const [loadingPerformances, setLoadingPerformances] = useState(false);
  const [organizersWithDetails, setOrganizersWithDetails] = useState<{
    userId: number | null;
    name: string;
    profilePicture?: string;
    profilePicturePublicId?: string;
  }[]>([]);

  function formatDate(data: string | number | Date) {
    if (!data) return "Date not available";
    try {
      const currentDate = new Date(data);
      if (isNaN(currentDate.getTime())) return "Invalid date";

      const day = currentDate.getDate().toString().padStart(2, "0");
      const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
      const year = currentDate.getFullYear();
      const formattedDate = `${day}/${month}/${year}`;
      return formattedDate;
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Date not available";
    }
  }
  const checkIfOrganizer = async (fetchedEvent: EventInterface) => {
    try {
      if (!user || !user.id) {
        setIsOrganizer(false);
        return;
      }
      // Check if the logged-in user is an organizer of the event
      const currentUserId =
        typeof user.id === 'object' && user.id !== null
          ? String(user.id)
          : String(user.id);
      // Check if fetchedEvent has a creatorId (primary organizer) or if user is in organizers array
      const primaryOrganizerId = fetchedEvent.creatorId || null;
      const organizers = (fetchedEvent as any).organizers || [];
      
      // Check if user is the primary organizer
      if (primaryOrganizerId) {
        const primaryOrganizerIdString = String(primaryOrganizerId);
        if (primaryOrganizerIdString === currentUserId) {
          setIsOrganizer(true);
          return;
        }
      }
      
      // Check if user is in the organizers array
      if (Array.isArray(organizers)) {
        const isInOrganizers = organizers.some((org: any) => org.userId === Number(currentUserId));
        if (isInOrganizers) {
          setIsOrganizer(true);
          return;
        }
      }
      
      setIsOrganizer(false);
    } catch (error) {
      console.error('Error checking if organizer:', error);
      setIsOrganizer(false);
    }
  };

  const checkIfReviewCreator = async (fetchedEvent: EventInterface) => {
    try {
      if (!user || !user.id) {
        return false;
      }
      const response = await fetch(
        `${API_URL_EVENTREVIEWS}/${fetchedEvent.id}/${user.id}`
      );
      if (!response.ok) {
        return false;
      }
      const data = await response.json();
      return Boolean(data && data.id);
    } catch (error) {
      console.error('Error checking if review creator:', error);
      return false;
    }
  };

  const checkIfUserHasReviewed = (reviews: EventInterface["reviews"]) => {
    if (!user || !user.id || !reviews || reviews.length === 0) {
      setUserReview(null);
      return false;
    }
    const existingReview = reviews.find((review) => {
      if (!review.userId) return false;
      const reviewUserId = String(review.userId);
      return reviewUserId === String(user.id);
    });

    setUserReview(existingReview || null);
    return Boolean(existingReview);
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Main event data fetch
      const response = await fetchWithRetry(
        API_URL_EVENTS + "/" + eventId,
        3, // number of retries
        1000 // delay between retries in ms
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Event not found. It may have been removed.");
        } else {
          throw new Error(
            `Server error: ${response.status} ${response.statusText}`
          );
        }
      }

      const fetchedEvent: EventInterface = await response.json();

      // Log pour debug - vérifier que les champs de tag sont reçus
      console.log('Fetched event tags:', {
        participationTagText: (fetchedEvent as any).participationTagText,
        participationTagColor: (fetchedEvent as any).participationTagColor
      });

      // Process additional data with graceful degradation
      const enhancedEvent = await Promise.all([
        enhanceEventWithTags(fetchedEvent),
        enhanceEventWithReviews(fetchedEvent),
        // enhanceEventWithProducts removed - RelatedProduct no longer linked to events
      ]).then(() => fetchedEvent);

      // User-specific checks
      await checkIfReviewCreator(enhancedEvent);
      await checkIfOrganizer(enhancedEvent);
      if (enhancedEvent.reviews && enhancedEvent.reviews.length > 0) {
        checkIfUserHasReviewed(enhancedEvent.reviews);
      }

      setEvent(enhancedEvent);

      // Load organizers with details
      await loadOrganizersWithDetails(enhancedEvent);

      // Load event performances
      await loadEventPerformances(parseInt(eventId));
      
      // Track event view
      trackEvent.viewed(eventId, enhancedEvent.name);
    } catch (error: any) {
      console.error("Error in fetchData:", error);

      // Provide user-friendly error messages based on error type
      if (error.message?.includes("Network request failed")) {
        setError(
          "Network connection error. Please check your internet connection."
        );
      } else if (error.message?.includes("Event not found")) {
        setError(error.message);
      } else if (error.message?.includes("Server error")) {
        setError("Server error occurred. Please try again later.");
      } else {
        setError("Failed to fetch event data. Please try again.");
      }

      setEvent(null);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId, user]);

  // Helper functions for retry logic and graceful degradation
  const fetchWithRetry = async (
    url: string,
    retriesLeft: number,
    delay: number
  ): Promise<Response> => {
    try {
      const response = await fetch(url);
      return response;
    } catch (error) {
      if (retriesLeft <= 0) throw error;

      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, delay));
      return fetchWithRetry(url, retriesLeft - 1, delay);
    }
  };

  const enhanceEventWithTags = async (
    eventData: EventInterface
  ): Promise<void> => {
    try {
      const fetchEventTags = await fetch(
        API_URL_EVENTTAGS + "/event/" + eventData.id
      );
      if (!fetchEventTags.ok) {
        console.warn(`Could not fetch tags: ${fetchEventTags.status}`);
        eventData.tags = [];
        return;
      }

      const eventTags = await fetchEventTags.json();
      if (!Array.isArray(eventTags)) {
        console.warn("Event tags response is not an array");
        eventData.tags = [];
        return;
      }

      const tagPromises = eventTags.map(async (tag) => {
        try {
          const tagResponse = await fetch(API_URL_TAGS + "/" + tag.tagId);
          if (tagResponse.ok) {
            return tagResponse.json();
          }
          return null;
        } catch (tagError) {
          console.warn(`Failed to fetch tag ${tag.tagId}`, tagError);
          return null;
        }
      });

      const tags = await Promise.all(tagPromises);
      eventData.tags = tags.filter((tag) => tag !== null);
    } catch (error) {
      console.error("Error processing tags:", error);
      eventData.tags = [];
    }
  };

  const enhanceEventWithReviews = async (
    eventData: EventInterface
  ): Promise<void> => {
    try {
      const fetchEventReviews = await fetch(
        API_URL_EVENTREVIEWS + "/event/" + eventData.id
      );
      if (!fetchEventReviews.ok) {
        console.warn(`Could not fetch reviews: ${fetchEventReviews.status}`);
        eventData.reviews = [];
        return;
      }

      const eventReviews = await fetchEventReviews.json();
      if (!Array.isArray(eventReviews)) {
        console.warn("Event reviews response is not an array");
        eventData.reviews = [];
        return;
      }

      const reviewPromises = eventReviews.map(async (review) => {
        if (!review.userId) {
          return { ...review, username: "Unknown User" };
        }

        try {
          const userResponse = await fetch(API_URL_USERS + "/" + review.userId);
          if (userResponse.ok) {
            const userData = await userResponse.json();

            const username =
              userData.username ||
              userData.name ||
              (userData.user ? userData.user.username : null) ||
              "Anonymous";

            const avatarUrl =
              userData.additionalData?.avatar ||
              userData.avatar ||
              "https://via.placeholder.com/30";

            return { ...review, username: username, avatar: avatarUrl };
          } else {
            return { ...review, username: "User #" + review.userId };
          }
        } catch (userError) {
          console.warn(`Failed to fetch user ${review.userId}`, userError);
          return { ...review, username: "Unknown User" };
        }
      });

      const reviewsWithUsernames = await Promise.all(reviewPromises);
      eventData.reviews = reviewsWithUsernames.filter(
        (review) => review !== null
      );
    } catch (error) {
      console.error("Error processing reviews:", error);
      eventData.reviews = [];
    }
  };

  // enhanceEventWithProducts removed - RelatedProduct no longer linked to events

  const loadOrganizersWithDetails = async (event: EventInterface) => {
    try {
      const organizers = (event as any).organizers;
      if (!organizers || !Array.isArray(organizers)) {
        // If no organizers array, just show the primary organizer (creatorId)
        const primaryOrganizer = (event as any).creator || (typeof event.creatorId === 'object' ? event.creatorId : null);
        if (primaryOrganizer || event.creatorId) {
          const primaryOrganizerId = primaryOrganizer?.id || (typeof event.creatorId === 'object' ? event.creatorId?.id : event.creatorId);
          const primaryOrganizerIdNum = typeof primaryOrganizerId === 'string' ? parseInt(primaryOrganizerId) : primaryOrganizerId;
          if (primaryOrganizerIdNum) {
            try {
              const userResponse = await fetch(`${API_URL_USERS}/${primaryOrganizerIdNum}`);
              if (userResponse.ok) {
                const userData = await userResponse.json();
                setOrganizersWithDetails([{
                  userId: primaryOrganizerIdNum,
                  name: userData.username || userData.name || primaryOrganizer?.name || primaryOrganizer?.username || 'Event Organizer',
                  profilePicture: userData.profilePicture,
                  profilePicturePublicId: userData.profilePicturePublicId,
                }]);
              } else {
                setOrganizersWithDetails([{
                  userId: primaryOrganizerIdNum,
                  name: primaryOrganizer?.name || primaryOrganizer?.username || 'Event Organizer',
                  profilePicture: primaryOrganizer?.profilePicture,
                  profilePicturePublicId: primaryOrganizer?.profilePicturePublicId,
                }]);
              }
            } catch (error) {
              console.warn(`Failed to fetch primary organizer ${primaryOrganizerIdNum}`, error);
              setOrganizersWithDetails([{
                userId: primaryOrganizerIdNum,
                name: primaryOrganizer?.name || primaryOrganizer?.username || 'Event Organizer',
                profilePicture: primaryOrganizer?.profilePicture,
                profilePicturePublicId: primaryOrganizer?.profilePicturePublicId,
              }]);
            }
          }
        }
        return;
      }

      // Fetch details for all organizers
      const organizersWithDetails = await Promise.all(
        organizers.map(async (org: { userId: number | null; name: string }) => {
          if (org.userId) {
            try {
              const userResponse = await fetch(`${API_URL_USERS}/${org.userId}`);
              if (userResponse.ok) {
                const userData = await userResponse.json();
                return {
                  userId: org.userId,
                  name: userData.username || userData.name || org.name,
                  profilePicture: userData.profilePicture,
                  profilePicturePublicId: userData.profilePicturePublicId,
                };
              }
            } catch (error) {
              console.warn(`Failed to fetch organizer ${org.userId}`, error);
            }
          }
          // For external organizers (no userId) or if fetch failed
          return {
            userId: org.userId,
            name: org.name,
          };
        })
      );

      setOrganizersWithDetails(organizersWithDetails);
    } catch (error) {
      console.error('Error loading organizers:', error);
      setOrganizersWithDetails([]);
    }
  };

  const loadEventPerformances = async (eventId: number) => {
    setLoadingPerformances(true);
    try {
      const response = await PerformanceService.getEventPerformances(eventId);
      if (response.success && response.data) {
        // Fetch user information for each performance
        const performancesWithUsers = await Promise.all(
          response.data.map(async (perf) => {
            try {
              const userResponse = await fetch(`${API_URL_USERS}/${perf.userId}`);
              if (userResponse.ok) {
                const userData = await userResponse.json();
                return {
                  ...perf,
                  userName: userData.username || userData.name || `User ${perf.userId}`,
                  userAvatar: userData.profilePicture || userData.additionalData?.avatar,
                };
              }
            } catch (error) {
              console.warn(`Failed to fetch user ${perf.userId}`, error);
            }
            return {
              ...perf,
              userName: `User ${perf.userId}`,
            };
          })
        );
        setEventPerformances(performancesWithUsers);
      }
    } catch (error) {
      console.error('Error loading event performances:', error);
      setEventPerformances([]);
    } finally {
      setLoadingPerformances(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (eventId) {
        fetchData();
        // Track screen view
        trackScreenView('Event Detail', { event_id: eventId });
      }
      return () => {
        setEvent(null);
        setError(null);
      };
    }, [eventId, fetchData])
  );

  // Keep the initial useEffect for first load
  useEffect(() => {
    if (!eventId) {
      setError("Invalid event ID.");
      return;
    }

    // Run the fetchData function when needed
    fetchData();

    // If we returned from managing products with a successful update, show a message
    if (params.updated === "true") {
      console.log("Products updated successfully!");
    }
  }, [eventId, params.updated, fetchData]);

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Event not found or failed to load.</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.goBackText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }
  if (event !== null) {
    const meteoInfo = event.meteo as any;

    // Helper function to safely get track condition information
    const getTrackConditionInfo = () => {
      if (!meteoInfo || typeof meteoInfo !== 'object') {
        return 'Track condition unavailable';
      }

      // Track condition
      if (meteoInfo.trackCondition) {
        const trackConditions: { [key: string]: string } = {
          'dry': '☀️ Dry',
          'damp': '💧 Damp',
          'wet': '🌧️ Wet',
          'mixed': '🌦️ Mixed',
          'slippery': '⚠️ Slippery',
          'drying': '🌤️ Drying'
        };
        return trackConditions[meteoInfo.trackCondition] || meteoInfo.trackCondition;
      }

      // Fallback to old format for backward compatibility
      if (meteoInfo.condition) {
        return meteoInfo.condition;
      }
      if (meteoInfo.temperature !== undefined) {
        return `${meteoInfo.temperature}°`;
      }

      return 'Track condition unavailable';
    };

    function handleReviewPress(): void {
      if (userReview) {
        if (user?.id !== undefined && user?.id !== null) {
          const userId = Number(user.id);
          router.push({
            pathname: "/(app)/modifyEventReview",
            params: { eventId, userId },
          });
        }
      } else {
        router.push({
          pathname: "/(app)/createEventReview",
          params: { eventId },
        });
      }
    }

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <FontAwesome name="arrow-left" size={20} color="#1A1A1A" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Event Details</Text>
            {isOrganizer ? (
              <TouchableOpacity
                style={styles.reviewButton}
                onPress={() =>
                  router.push({
                    pathname: "/(app)/editEvent",
                    params: { eventId },
                  })
                }
              >
                <Text style={styles.reviewText}>Modify</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.reviewButton}
                onPress={handleReviewPress}
              >
                <Text style={styles.reviewText}>
                  {userReview ? "Edit Review" : "Review"}
                </Text>
              </TouchableOpacity>
            )}
          </View>

        <ScrollView style={styles.scrollView}>
          <View style={styles.eventInfo}>
            <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
              <Text style={styles.eventTitle}>
                {event.name || 'Unnamed Event'}
              </Text>
              {event.participationTagText && event.participationTagColor && (
                <EventTag
                  text={event.participationTagText}
                  color={event.participationTagColor}
                />
              )}
            </View>
            {/* <Text style={styles.eventCategory}>{event.category}</Text> */}
          </View>

          {/* Organizers Section - En haut, séparés par type */}
          {organizersWithDetails.length > 0 && (
            <View style={{ paddingHorizontal: 16, paddingVertical: 16, backgroundColor: '#fff' }}>
              {/* Organisateurs avec profil GearConnect */}
              {organizersWithDetails.filter(org => org.userId !== null).length > 0 && (
                <View style={{ marginBottom: organizersWithDetails.filter(org => org.userId === null).length > 0 ? 20 : 0 }}>
                  {organizersWithDetails
                    .filter(org => org.userId !== null)
                    .map((org, index) => {
                      const handleOrganizerPress = () => {
                        if (org.userId) {
                          router.push({
                            pathname: '/userProfile',
                            params: { userId: org.userId.toString() },
                          });
                        }
                      };

                      return (
                        <TouchableOpacity
                          key={`gearconnect-${index}`}
                          onPress={handleOrganizerPress}
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 12,
                            marginBottom: index < organizersWithDetails.filter(org => org.userId !== null).length - 1 ? 12 : 0,
                          }}
                          activeOpacity={0.7}
                        >
                          {/* Profile Picture */}
                          {org.profilePicturePublicId ? (
                            <CloudinaryAvatar
                              publicId={org.profilePicturePublicId}
                              size={48}
                              style={{
                                width: 48,
                                height: 48,
                                borderRadius: 24,
                              }}
                              fallbackUrl={org.profilePicture}
                            />
                          ) : org.profilePicture ? (
                            <Image
                              source={{ uri: org.profilePicture }}
                              style={{
                                width: 48,
                                height: 48,
                                borderRadius: 24,
                              }}
                            />
                          ) : (
                            <View
                              style={{
                                width: 48,
                                height: 48,
                                borderRadius: 24,
                                backgroundColor: '#F0F0F0',
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}
                            >
                              <FontAwesome name="user" size={20} color="#999" />
                            </View>
                          )}
                          
                          {/* Name */}
                          <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: 16, fontWeight: '600', color: '#333' }}>
                              {org.name}
                            </Text>
                            <Text style={{ fontSize: 14, color: '#666', marginTop: 2 }}>
                              Organizer
                            </Text>
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                </View>
              )}

              {/* Organisateurs externes (sans profil GearConnect) */}
              {organizersWithDetails.filter(org => org.userId === null).length > 0 && (
                <View style={{ 
                  paddingTop: organizersWithDetails.filter(org => org.userId !== null).length > 0 ? 16 : 0,
                  borderTopWidth: organizersWithDetails.filter(org => org.userId !== null).length > 0 ? 1 : 0,
                  borderTopColor: '#E0E0E0',
                }}>
                  {organizersWithDetails
                    .filter(org => org.userId === null)
                    .map((org, index) => (
                      <View
                        key={`external-${index}`}
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 12,
                          marginBottom: index < organizersWithDetails.filter(org => org.userId === null).length - 1 ? 12 : 0,
                        }}
                      >
                        {/* Placeholder icon for external organizers */}
                        <View
                          style={{
                            width: 48,
                            height: 48,
                            borderRadius: 24,
                            backgroundColor: '#F0F0F0',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                        >
                          <FontAwesome name="user" size={20} color="#999" />
                        </View>
                        
                        {/* Name */}
                        <View style={{ flex: 1 }}>
                          <Text style={{ fontSize: 16, fontWeight: '600', color: '#333' }}>
                            {org.name}
                          </Text>
                          <Text style={{ fontSize: 14, color: '#666', marginTop: 2 }}>
                            Organizer
                          </Text>
                        </View>
                      </View>
                    ))}
                </View>
              )}
            </View>
          )}

          <View style={styles.descriptionContainer}>
            <View style={styles.aboutContainer}>
              <View style={styles.tagContainer}>
                {event?.tags && event.tags.length > 0 && (
                  event.tags.map((tag: any, index: number) => (
                    <Text
                      key={`tag-${index}-${
                        typeof tag === 'object' ? tag.id : tag
                      }`}
                      style={styles.tag as any}
                    >
                      {typeof tag === 'object' && tag !== null ? tag.name : tag}
                    </Text>
                  ))
                )}
              </View>
              {event.description && (
                <Text style={styles.description}>
                  {event.description}
                </Text>
              )}
            </View>
          </View>

            {/* 
         <Text style={styles.sectionTitle}>Best of Images</Text>
         {event.images[0] ? (
          <Image
            source={{ uri: event?.images[0] }}
            style={styles.mainEventImage}
          />
        ) : (
          <View style={styles.placeholderMainImage}>
            <Text>No Image Available</Text>
          </View>
        )}
        */}
          <Text style={styles.sectionTitle}>Event Details</Text>
          <View style={styles.detailRow}>
            <Ionicons name="location-outline" size={20} color="gray" />
            <Text style={styles.detailText}>
              {event.location && event.location.trim()
                ? event.location
                : 'No location available'}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="calendar-outline" size={20} color="gray" />
            <Text style={styles.detailText}>{formatDate(event.date)}</Text>
            <Ionicons
              name="flag-outline"
              size={20}
              color="gray"
              style={{ marginLeft: 10 }}
            />
            <Text style={styles.detailText}>{getTrackConditionInfo()}</Text>
          </View>
          {/* RelatedProductsSection removed - RelatedProduct no longer linked to events */}
          <EventDetailReview
            eventId={eventId}
            reviews={event.reviews || []}
            userReview={userReview}
            user={user}
            isOrganizer={isOrganizer}
          />
          {/* Results Grid */}
          <EventResultsGrid 
            performances={eventPerformances} 
            loading={loadingPerformances}
          />
          
          {/* Results Links */}
          {(event.meteo as any)?.eventResultsLink || (event.meteo as any)?.seasonResultsLink ? (
            <View style={{ marginVertical: 16, paddingHorizontal: 16 }}>
              <Text style={{ fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 12 }}>
                Official Results
              </Text>
              {(event.meteo as any)?.eventResultsLink && (
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: 12,
                    backgroundColor: '#FFF5F5',
                    borderRadius: 8,
                    marginBottom: 8,
                    borderWidth: 1,
                    borderColor: '#E10600',
                  }}
                  onPress={() => {
                    const url = (event.meteo as any).eventResultsLink;
                    if (url) {
                      Linking.openURL(url.startsWith('http') ? url : `https://${url}`).catch(err =>
                        console.error('Failed to open URL:', err)
                      );
                    }
                  }}
                >
                  <FontAwesome name="external-link" size={16} color="#E10600" style={{ marginRight: 8 }} />
                  <Text style={{ fontSize: 14, color: '#E10600', flex: 1, fontWeight: '600' }}>
                    Event Results
                  </Text>
                  <FontAwesome name="chevron-right" size={14} color="#E10600" />
                </TouchableOpacity>
              )}
              {(event.meteo as any)?.seasonResultsLink && (
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: 12,
                    backgroundColor: '#FFF5F5',
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: '#E10600',
                  }}
                  onPress={() => {
                    const url = (event.meteo as any).seasonResultsLink;
                    if (url) {
                      Linking.openURL(url.startsWith('http') ? url : `https://${url}`).catch(err =>
                        console.error('Failed to open URL:', err)
                      );
                    }
                  }}
                >
                  <FontAwesome name="external-link" size={16} color="#E10600" style={{ marginRight: 8 }} />
                  <Text style={{ fontSize: 14, color: '#E10600', flex: 1, fontWeight: '600' }}>
                    Season Standings
                  </Text>
                  <FontAwesome name="chevron-right" size={14} color="#E10600" />
                </TouchableOpacity>
              )}
            </View>
          ) : null}
          
          {/* Buttons */}
          <TouchableOpacity style={styles.shareButton}>
            <Text style={styles.shareText}>Share</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.addCalendarButton}>
            <Text style={styles.addCalendarText}>Add to Calendar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buyButton}>
            <Text style={styles.buyButtonText}>Buy a Ticket</Text>
          </TouchableOpacity>
        </ScrollView>
        </View>
      </SafeAreaView>

    );
  }


  // Add a loading state when event is null but there's no error
  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#4A80F0" />
        <Text style={styles.loadingText}>Loading event details...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.errorText}>
        Something went wrong. Please try again.
      </Text>
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.goBackText}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );

};


export default EventDetailScreen;
