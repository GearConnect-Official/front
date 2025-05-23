import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { RouteProp } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import { EventInterface } from '../services/EventInterface';
import styles from '../styles/eventDetailStyles';
import {
  API_URL_EVENTS,
  API_URL_EVENTTAGS,
  API_URL_EVENTREVIEWS,
  API_URL_RELATEDPRODUCTS,
  API_URL_TAGS,
  API_URL_USERS,
} from '../config';
import { useAuth } from '../context/AuthContext';
import eventService from '../services/eventService';
import tagService from '../services/tagService';
import userService from '../services/userService';
import EventDetailReview from '../components/EventDetailReview';
import { ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type RootStackParamList = {
  EventDetail: { eventId: string };
  // Add other routes as needed
};

type EventDetailScreenRouteProp = RouteProp<RootStackParamList, 'EventDetail'>;

interface MeteoInfo {
  condition: string;
  temperature: number | string;
}

const EventDetailScreen: React.FC = () => {
  const params = useLocalSearchParams();
  const router = useRouter();
  const eventId = params.eventId as string;
  const [event, setEvent] = useState<EventInterface | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [userReview, setUserReview] = useState<
    EventInterface['reviews'][0] | null
  >(null);
  const [isReviewCreator, setIsReviewCreator] = useState<boolean>(false);
  const [isCreator, setIsCreator] = useState<boolean>(false);

  function formatDate(data: string | number | Date) {
    if (!data) return 'Date not available';
    try {
      const currentDate = new Date(data);
      if (isNaN(currentDate.getTime())) return 'Invalid date';

      const day = currentDate.getDate().toString().padStart(2, '0');
      const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
      const year = currentDate.getFullYear();
      const formattedDate = `${day}/${month}/${year}`;
      return formattedDate;
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Date not available';
    }
  }
  const checkIfCreator = async (fetchedEvent: EventInterface) => {
    try {
      if (!user || !user.id) {
        setIsCreator(false);
        return;
      }
      // Check if the logged-in user is the creator of the event
      const currentUserId =
        typeof user.id === 'object' && user.id !== null
          ? String(user.id)
          : String(user.id);
      // Check if fetchedEvent has a creatorId or userId property
      const eventCreatorId = fetchedEvent.creatorId || null;
      if (!eventCreatorId) {
        setIsCreator(false);
        return;
      }
      // Convert to string for comparison
      const creatorIdString = String(eventCreatorId);
      // Compare the IDs
      const isCreator = creatorIdString === currentUserId;
      setIsCreator(isCreator);
    } catch (error) {
      console.error('Error checking if creator:', error);
      setIsCreator(false);
    }
  };

  const checkIfReviewCreator = async (fetchedEvent: EventInterface) => {
    try {
      if (!user || !user.id) {
        setIsReviewCreator(false);
        return false;
      }
      const response = await fetch(
        `${API_URL_EVENTREVIEWS}/${fetchedEvent.id}/${user.id}`
      );
      if (!response.ok) {
        setIsReviewCreator(false);
        return false;
      }
      const data = await response.json();
      const isReviewCreator = Boolean(data && data.id);
      setIsReviewCreator(isReviewCreator);
      return isReviewCreator;
    } catch (error) {
      console.error('Error checking if creator:', error);
      setIsReviewCreator(false);
      return false;
    }
  };

  const checkIfUserHasReviewed = (reviews: EventInterface['reviews']) => {
    if (!user || !user.id || !reviews || reviews.length === 0) {
      setUserReview(null);
      return false;
    }
    const currentUserId =
      typeof user.id === 'object' && user.id !== null
        ? String(user.id)
        : String(user.id);
    const existingReview = reviews.find((review) => {
      if (!review.userId) return false;
      const reviewUserId = String(review.userId);
      return reviewUserId === currentUserId;
    });

    setUserReview(existingReview || null);
    return Boolean(existingReview);
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Main event data fetch
      const response = await fetchWithRetry(
        API_URL_EVENTS + '/' + eventId,
        3, // number of retries
        1000 // delay between retries in ms
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Event not found. It may have been removed.');
        } else {
          throw new Error(
            `Server error: ${response.status} ${response.statusText}`
          );
        }
      }

      const fetchedEvent: EventInterface = await response.json();

      // Process additional data with graceful degradation
      const enhancedEvent = await Promise.all([
        enhanceEventWithTags(fetchedEvent),
        enhanceEventWithReviews(fetchedEvent),
        enhanceEventWithProducts(fetchedEvent),
      ]).then(() => fetchedEvent);

      // User-specific checks
      await checkIfReviewCreator(enhancedEvent);
      await checkIfCreator(enhancedEvent);
      if (enhancedEvent.reviews && enhancedEvent.reviews.length > 0) {
        checkIfUserHasReviewed(enhancedEvent.reviews);
      }

      setEvent(enhancedEvent);
    } catch (error: any) {
      console.error('Error in fetchData:', error);

      // Provide user-friendly error messages based on error type
      if (error.message?.includes('Network request failed')) {
        setError(
          'Network connection error. Please check your internet connection.'
        );
      } else if (error.message?.includes('Event not found')) {
        setError(error.message);
      } else if (error.message?.includes('Server error')) {
        setError('Server error occurred. Please try again later.');
      } else {
        setError('Failed to fetch event data. Please try again.');
      }

      setEvent(null);
    } finally {
      setLoading(false);
    }
  };

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
        API_URL_EVENTTAGS + '/event/' + eventData.id
      );
      if (!fetchEventTags.ok) {
        console.warn(`Could not fetch tags: ${fetchEventTags.status}`);
        eventData.tags = [];
        return;
      }

      const eventTags = await fetchEventTags.json();
      if (!Array.isArray(eventTags)) {
        console.warn('Event tags response is not an array');
        eventData.tags = [];
        return;
      }

      const tagPromises = eventTags.map(async (tag) => {
        try {
          const tagResponse = await fetch(API_URL_TAGS + '/' + tag.tagId);
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
      console.error('Error processing tags:', error);
      eventData.tags = [];
    }
  };

  const enhanceEventWithReviews = async (
    eventData: EventInterface
  ): Promise<void> => {
    try {
      const fetchEventReviews = await fetch(
        API_URL_EVENTREVIEWS + '/event/' + eventData.id
      );
      if (!fetchEventReviews.ok) {
        console.warn(`Could not fetch reviews: ${fetchEventReviews.status}`);
        eventData.reviews = [];
        return;
      }

      const eventReviews = await fetchEventReviews.json();
      if (!Array.isArray(eventReviews)) {
        console.warn('Event reviews response is not an array');
        eventData.reviews = [];
        return;
      }

      const reviewPromises = eventReviews.map(async (review) => {
        if (!review.userId) {
          return { ...review, username: 'Unknown User' };
        }

        try {
          const userResponse = await fetch(API_URL_USERS + '/' + review.userId);
          if (userResponse.ok) {
            const userData = await userResponse.json();

            const username =
              userData.username ||
              userData.name ||
              (userData.user ? userData.user.username : null) ||
              'Anonymous';

            const avatarUrl =
              userData.additionalData?.avatar ||
              userData.avatar ||
              'https://via.placeholder.com/30';

            return { ...review, username: username, avatar: avatarUrl };
          } else {
            return { ...review, username: 'User #' + review.userId };
          }
        } catch (userError) {
          console.warn(`Failed to fetch user ${review.userId}`, userError);
          return { ...review, username: 'Unknown User' };
        }
      });

      const reviewsWithUsernames = await Promise.all(reviewPromises);
      eventData.reviews = reviewsWithUsernames.filter(
        (review) => review !== null
      );
    } catch (error) {
      console.error('Error processing reviews:', error);
      eventData.reviews = [];
    }
  };

  const enhanceEventWithProducts = async (
    eventData: EventInterface
  ): Promise<void> => {
    try {
      const fetchRelatedProducts = await fetch(
        API_URL_RELATEDPRODUCTS + '/event/' + eventData.id
      );
      if (!fetchRelatedProducts.ok) {
        console.warn(
          `Could not fetch related products: ${fetchRelatedProducts.status}`
        );
        eventData.relatedProducts = [];
        return;
      }

      const relatedProducts = await fetchRelatedProducts.json();
      eventData.relatedProducts = Array.isArray(relatedProducts)
        ? relatedProducts
        : [];
    } catch (error) {
      console.error('Error processing related products:', error);
      eventData.relatedProducts = [];
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (eventId) {
        fetchData();
      }
      return () => {
        setEvent(null);
        setError(null);
      };
    }, [eventId])
  );

  // Keep the initial useEffect for first load
  useEffect(() => {
    if (!eventId) {
      setError('Invalid event ID.');
      return;
    }
    fetchData();
  }, [eventId]);

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
    const meteoInfo = event.meteo as MeteoInfo | string | undefined;

    // Helper function to safely get weather information
    const getWeatherInfo = () => {
      if (!meteoInfo) return 'Weather info unavailable';

      if (typeof meteoInfo === 'object' && meteoInfo !== null) {
        const condition = meteoInfo.condition || 'No condition available';
        const temperature =
          meteoInfo.temperature !== undefined
            ? `${meteoInfo.temperature}°`
            : '';
        return `${condition}${temperature ? ', ' + temperature : ''}`;
      }

      return typeof meteoInfo === 'string' && meteoInfo.trim()
        ? meteoInfo
        : 'Weather info unavailable';
    };

    function handleReviewPress(): void {
      if (userReview) {
        if (user?.id !== undefined && user?.id !== null) {
          const userId = Number(user.id);
          router.push({
            pathname: '/(app)/modifyEventReview',
            params: { eventId, userId },
          });
        }
      } else {
        router.push({
          pathname: '/(app)/createEventReview',
          params: { eventId },
        });
      }
    }

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
            <Text style={styles.headerTitle}>Event Details</Text>
            {isCreator ? (
              <TouchableOpacity
                style={styles.reviewButton}
                onPress={() => router.push({
                  pathname: '/(app)/modifyEvent',
                  params: { eventId }
                })}
              >
                <Text style={styles.reviewText}>Modify</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.reviewButton}
                onPress={handleReviewPress}
              >
                <Text style={styles.reviewText}>
                  {userReview ? 'Edit Review' : 'Review'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <ScrollView style={styles.scrollView}>
          <View style={styles.eventInfo}>
            <Text style={styles.eventTitle}>
              {event.name || 'Unnamed Event'}
            </Text>
            {/* <Text style={styles.eventCategory}>{event.category}</Text> */}
          </View>
          <View style={styles.descriptionContainer}>
            {/* {event?.images?.[0] ? (
            <Image
               source={{ uri: event.images[0] }}
               style={styles.eventImage}
             />
           ) : (
             <View style={styles.placeholderImage}>
             <Text>No Image Available</Text>
             </View>
             )} */}
            <View style={styles.aboutContainer}>
              <Text style={styles.aboutTitle}>About</Text>
              <View style={styles.tagContainer}>
                {event?.tags && event.tags.length > 0 ? (
                  event.tags.map((tag, index) => (
                    <Text
                      key={`tag-${index}-${
                        typeof tag === 'object' ? tag.id : tag
                      }`}
                      style={styles.tag}
                    >
                      {typeof tag === 'object' && tag !== null ? tag.name : tag}
                    </Text>
                  ))
                ) : (
                  <Text style={styles.noTagsText}>No tags available</Text>
                )}
              </View>
              <Text style={styles.description}>
                {event.description ||
                  'No description available for this event.'}
              </Text>
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
              name="cloud-outline"
              size={20}
              color="gray"
              style={{ marginLeft: 10 }}
            />
            <Text style={styles.detailText}>{getWeatherInfo()}</Text>
          </View>
          <Text style={styles.sectionTitle}>Related Products</Text>
          {event.relatedProducts && event.relatedProducts.length > 0 ? (
            <FlatList
              horizontal
              data={event.relatedProducts}
              keyExtractor={(item) => `product-${item.id}`}
              renderItem={({ item }) => (
                <View style={styles.productCard}>
                  <Image
                    source={require('../../assets/images/Google-logo.png')}
                    style={styles.productImage}
                  />
                  <Text style={styles.productTitle}>
                    {item.name || 'Unnamed Product'}
                  </Text>
                  <Text style={styles.productPrice}>
                    Price:{' '}
                    {item.price !== undefined && item.price !== null
                      ? `${item.price}€`
                      : 'Not available'}
                  </Text>
                </View>
              )}
            />
          ) : (
            <View style={styles.noProductsContainer}>
              <Text style={styles.noProductsText}>
                No related products available
              </Text>
            </View>
          )}
          <EventDetailReview
            eventId={eventId}
            reviews={event.reviews || []}
            userReview={userReview}
            user={user}
            isCreator={isCreator}
          />
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
