import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useRoute, useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '@/app/App';
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

type EventDetailScreenRouteProp = RouteProp<RootStackParamList, 'EventDetail'>;

interface MeteoInfo {
  condition: string;
  temperature: number | string;
}

// Create a star rating component
const StarRating: React.FC<{ rating: number; maxRating?: number }> = ({
  rating,
  maxRating = 5,
}) => {
  return (
    <View style={styles.starContainer}>
      {Array.from({ length: maxRating }).map((_, index) => (
        <Ionicons
          key={`star-${index}`}  // Changed to ensure uniqueness
          name={index < rating ? 'star' : 'star-outline'}
          size={14}
          color={index < rating ? '#FFD700' : '#aaa'}
          style={{ marginHorizontal: 1 }}
        />
      ))}
    </View>
  );
};

// Create a separate functional component for review items
const ReviewItem: React.FC<{ 
  item: EventInterface['reviews'][0],
  isCurrentUserReview?: boolean 
}> = ({
  item,
  isCurrentUserReview = false
}) => {
  const [showFullText, setShowFullText] = useState(false);
  const isTextLong = item.description?.length > 200;

  return (
    <View style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        <Image
          source={ item.avatar  ? { uri: item.avatar } : require('../../assets/images/logo-rounded.png')}
          style={styles.reviewAvatar}
        />
        <View style={styles.reviewUserInfo}>
          <Text style={styles.reviewUser}>
            {item.username}
          </Text>
          <StarRating rating={item.note} />
        </View>
      </View>
      <Text style={styles.reviewDescription}>
        {showFullText
          ? item.description
          : isTextLong
          ? item.description.substring(0, 200) + '...'
          : item.description}
      </Text>
      {isTextLong && (
        <TouchableOpacity
          onPress={() => setShowFullText(!showFullText)}
          style={styles.showMoreButton}
        >
          <Text style={styles.showMoreButtonText}>
            {showFullText ? 'Show less' : 'Show more'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const EventDetailScreen: React.FC = () => {
  const route = useRoute<EventDetailScreenRouteProp>();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { eventId } = route.params;
  const [event, setEvent] = useState<EventInterface | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth(); 
  const [userReview, setUserReview] = useState<EventInterface['reviews'][0] | null>(null);
  const [isCreator, setIsCreator] = useState<boolean>(false);

  function formatDate(data: string | number | Date) {
    const currentDate = new Date(data);
    const day = currentDate.getDate().toString().padStart(2, '0');
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const year = currentDate.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;
    return formattedDate;
  }

  const checkIfReviewCreator = async (fetchedEvent: EventInterface) => {
    try{
      if (!user || !user.id) {
        setIsCreator(false);
        return;
      }
      const response = await fetch(`${API_URL_EVENTREVIEWS}/${fetchedEvent.id}/${user.id}`)
      if (!response.ok) {
        throw new Error(`Failed to fetch review: ${response.status} ${response.statusText}`);
      }

    } catch (error) {
      console.error('Error checking if creator:', error);
      setIsCreator(false);
    }
  };

  const checkIfUserHasReviewed = (reviews: EventInterface['reviews']) => {
    if (!user || !user.id || !reviews || reviews.length === 0) {
      setUserReview(null);
      return;
    }
    
    const currentUserId = typeof user.id === 'object' ? String(user.id) : user.id.toString();
    
    // Find if user has already left a review
    const existingReview = reviews.find(review => {
      if (!review.userId) return false;
      
      const reviewUserId = typeof review.userId === 'object' 
        ? review.userId.id || review.userId.toString()
        : String(review.userId);
        
      return reviewUserId === currentUserId;
    });
    
    setUserReview(existingReview || null);
  };

  const fetchData = async () => {
    try {
      // const fetchEvent = await eventService.getEventById(eventId);
      const response = await fetch(`${API_URL_EVENTS}/${eventId}`);
      console.log('Event response:', response);
      if (!response.ok) {
        throw new Error(
          `Failed to fetch events: ${response.status} ${response.statusText}`
        );
      }
      const fetchedEvent: EventInterface = await response.json();
      // Fetch event tags
      try {
        // const fetchEventTags = await eventService.getEventTagsByEventId(eventId);
        const fetchEventTags = await fetch(
          `${API_URL_EVENTTAGS}/event/${eventId}`
        );
        if (!fetchEventTags.ok) {
          throw new Error(
            `Failed to fetch event tags: ${fetchEventTags.status} ${fetchEventTags.statusText}`
          );
        }
        if (fetchEventTags.ok) {
          const eventTags = await fetchEventTags.json();
          if (Array.isArray(eventTags)) {
            const tagPromises = eventTags.map(async (tag) => {
              // const tagResponse = await tagService.getTagById(tag.tagId);
              const tagResponse = await fetch(`${API_URL_TAGS}/${tag.tagId}`);
              if (tagResponse.ok) {
                return tagResponse.json();
              }
              return null;
            });
            const tags = await Promise.all(tagPromises);
            fetchedEvent.tags = tags.filter((tag) => tag !== null);
          }
        }
      } catch (tagError) {
        console.error('Error fetching tags:', tagError);
        console.log('No tags found for this event');
      }
      // Fetch event reviews
      try {
        // const fetchEventReviews = await eventService.getEventReviews(eventId);
        const fetchEventReviews = await fetch(
          `${API_URL_EVENTREVIEWS}/event/${eventId}`);
        if (fetchEventReviews.ok) {
          const eventReviews = await fetchEventReviews.json();
          if (Array.isArray(eventReviews)) {
            const reviewPromises = eventReviews.map(async (review) => {
              if (!review.userId) {
                console.warn('Review missing userId:', review);
                return { ...review, username: 'Unknown User' };
              }

              try {
                // const userResponse = await userService.getUserById(review.userId);
                const userResponse = await fetch(
                  `${API_URL_USERS}/${review.userId}`);
                if (userResponse.ok) {
                  const userData = await userResponse.json();
                  // Check various possibilities for username
                  const username =
                    userData.username ||
                    userData.name ||
                    (userData.user ? userData.user.username : null) ||
                    'Anonymous';                  
                  // Access avatar from additionalData
                  const avatarUrl = userData.additionalData?.avatar || 
                                   userData.avatar || 
                                   'https://via.placeholder.com/30';
                  
                  return {
                    ...review,
                    username: username,
                    avatar: avatarUrl
                  };
                } else {
                  console.error(
                    'Failed to fetch user:',
                    userResponse.status,
                    userResponse.statusText
                  );
                  return { ...review, username: 'User #' + review.userId };
                }
              } catch (userError) {
                console.error('Error fetching user data:', userError);
                return { ...review, username: 'Unknown User' };
              }
            });

            const reviewsWithUsernames = await Promise.all(reviewPromises);
            fetchedEvent.reviews = reviewsWithUsernames.filter(
              (review) => review !== null
            );
          } else {
            console.warn('Event reviews is not an array:', eventReviews);
            fetchedEvent.reviews = [];
          }
        } else {
          console.error(
            'Failed to fetch reviews:',
            fetchEventReviews.status,
            fetchEventReviews.statusText
          );
          fetchedEvent.reviews = [];
        }
      } catch (reviewError) {
        console.error('Error fetching reviews:', reviewError);
        fetchedEvent.reviews = [];
      }
      // Fetch related products
      try {
        // const fetchRelatedProducts = await eventService.getRelatedProductsByEventId(eventId);
        const fetchRelatedProducts = await fetch(
          `${API_URL_RELATEDPRODUCTS}/event/${eventId}`
        );
        if (fetchRelatedProducts.ok) {
          const relatedProducts = await fetchRelatedProducts.json();
          fetchedEvent.relatedProducts = relatedProducts;
        }
      } catch (productError) {
        console.error('Error fetching related products:', productError);
      }
      // After fetching event data and before setting the state
      checkIfReviewCreator(fetchedEvent);
      
      // After setting all the review data
      if (fetchedEvent.reviews && fetchedEvent.reviews.length > 0) {
        checkIfUserHasReviewed(fetchedEvent.reviews);
      }
      setEvent(fetchedEvent);
      setError(null);
    } catch (error) {
      console.error('Error in fetchData:', error);
      setEvent(null);
      setError('Failed to fetch event data');
    }
  };

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
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.goBackText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (event !== null) {
    const meteoInfo = event.meteo as MeteoInfo | string | undefined;

    function handleReviewPress(eventId: any): void {
      if (userReview) {
        navigation.navigate('ModifyReview', { eventId, reviewId: userReview.id, isEdit: true });
      } else {
        navigation.navigate('CreateReview', { eventId });
      }
    }

    return (
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Event Details</Text>
        </View>

        <View style={styles.eventInfo}>
          <Text style={styles.eventTitle}>{event.name}</Text>
          <TouchableOpacity style={styles.reviewButton} onPress={() => handleReviewPress(eventId)}>
            <Text style={styles.reviewText}>{userReview ? 'Edit Review' : 'Review'}</Text>
          </TouchableOpacity>
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
              {event?.tags?.map((tag, index) => (
                <Text key={`tag-${index}-${typeof tag === 'object' ? tag.id : tag}`} style={styles.tag}>
                  {typeof tag === 'object' && tag !== null ? tag.name : tag}
                </Text>
              ))}
            </View>
            <Text style={styles.description}>{event.description}</Text>
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
            {event.location || 'No location available'}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="calendar-outline" size={20} color="gray" />
          <Text style={styles.detailText}>{formatDate(event.date)}</Text>
          <Ionicons
            name="time-outline"
            size={20}
            color="gray"
            style={{ marginLeft: 10 }}
          />
          <Text style={styles.detailText}>
            {typeof meteoInfo === 'object'
              ? `${meteoInfo.condition}, ${meteoInfo.temperature}°`
              : meteoInfo || 'Weather info unavailable'}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Related Products</Text>
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
              <Text style={styles.productTitle}>{item.name}</Text>
              <Text style={styles.productPrice}>Price: {item.price}€</Text>
            </View>
          )}
        />

        <Text style={styles.sectionTitle}>Reviews</Text>
        <FlatList
          horizontal
          data={event.reviews}
          keyExtractor={(item, index) => item.id ? `review-${item.id}` : `review-index-${index}`}
          renderItem={({ item }) => (
            <ReviewItem 
              item={item} 
              isCurrentUserReview={userReview && userReview.id === item.id}
            />
          )}
        />

        {/* Buttons */}

        <TouchableOpacity style={styles.shareButton}>
          <Text>Share</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.addCalendarButton}>
          <Text style={{ color: 'black', fontWeight: 'bold' }}>
            Add to Calendar
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buyButton}>
          <Text style={{ color: 'white', fontWeight: 'bold' }}>
            Buy a Ticket
          </Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }
};

export default EventDetailScreen;
