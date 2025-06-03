import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
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
          key={`star-${index}`} // Changed to ensure uniqueness
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
const ReviewItem: React.FC<{ item: EventInterface['reviews'][0] }> = ({
  item,
}) => {
  const [showFullText, setShowFullText] = useState(false);
  const isTextLong = item.description?.length > 200;

  return (
    <View style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        <Image
          source={
            item.avatar
              ? { uri: item.avatar }
              : require('../../assets/images/logo-rounded.png')
          }
          style={styles.reviewAvatar}
        />
        <View style={styles.reviewUserInfo}>
          <Text style={styles.reviewUser}>{item.username}</Text>
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

const ModifyEventDetailScreen: React.FC = () => {
  const params = useLocalSearchParams();
  const router = useRouter();
  const eventId = params.eventId as string;
  const [event, setEvent] = useState<EventInterface | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCreator, setIsCreator] = useState(false);
  const { user } = useAuth(); // Move this hook call to component level

  // States for editing individual fields
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editedName, setEditedName] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [editedLocation, setEditedLocation] = useState('');
  const [editedDate, setEditedDate] = useState('');

  function formatDate(data: string | number | Date) {
    const currentDate = new Date(data);
    const day = currentDate.getDate().toString().padStart(2, '0');
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const year = currentDate.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;
    return formattedDate;
  }

  const checkIfCreator = async (fetchedEvent: EventInterface) => {
    try {
      console.log('Fetched Event:', fetchedEvent);
      console.log('Current User ID:', user?.id);

      if (user && fetchedEvent.creatorId && user.id) {
        // Convert both to strings for comparison if they might be different types
        const eventCreatorId =
          typeof fetchedEvent.creatorId === 'object'
            ? fetchedEvent.creatorId.id || fetchedEvent.creatorId.toString()
            : String(fetchedEvent.creatorId);

        const currentUserId =
          typeof user.id === 'object' ? String(user.id) : user.id.toString();

        setIsCreator(eventCreatorId === currentUserId);
        console.log('Creator check:', {
          eventCreatorId,
          currentUserId,
          isCreator: eventCreatorId === currentUserId,
        });
      } else {
        setIsCreator(false);
      }
    } catch (error) {
      console.error('Error checking if creator:', error);
      setIsCreator(false);
    }
  };

  const fetchData = async () => {
    try {
      const response = await fetch(API_URL_EVENTS + '/' + eventId);
      if (!response.ok) {
        throw new Error(
          `Failed to fetch events: ${response.status} ${response.statusText}`
        );
      }
      const fetchedEvent: EventInterface = await response.json();

      // Check if current user is the creator
      await checkIfCreator(fetchedEvent);

      // Fetch event tags
      try {
        const fetchEventTags = await fetch(
          API_URL_EVENTTAGS + '/event/' + eventId
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
              const tagResponse = await fetch(API_URL_TAGS + '/' + tag.tagId);
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
        const fetchEventReviews = await fetch(
          API_URL_EVENTREVIEWS + '/event/' + eventId
        );
        if (fetchEventReviews.ok) {
          const eventReviews = await fetchEventReviews.json();
          if (Array.isArray(eventReviews)) {
            const reviewPromises = eventReviews.map(async (review) => {
              if (!review.userId) {
                console.warn('Review missing userId:', review);
                return { ...review, username: 'Unknown User' };
              }

              try {
                const userResponse = await fetch(
                  API_URL_USERS + '/' + review.userId
                );
                if (userResponse.ok) {
                  const userData = await userResponse.json();
                  // Check various possibilities for username
                  const username =
                    userData.username ||
                    userData.name ||
                    (userData.user ? userData.user.username : null) ||
                    'Anonymous';

                  // Access avatar from additionalData
                  const avatarUrl =
                    userData.additionalData?.avatar ||
                    userData.avatar ||
                    'https://via.placeholder.com/30';

                  return {
                    ...review,
                    username: username,
                    avatar: avatarUrl,
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
        const fetchRelatedProducts = await fetch(
          API_URL_RELATEDPRODUCTS + '/event/' + eventId
        );
        if (fetchRelatedProducts.ok) {
          const relatedProducts = await fetchRelatedProducts.json();
          fetchedEvent.relatedProducts = relatedProducts;
        }
      } catch (productError) {
        console.error('Error fetching related products:', productError);
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

  // Handler to start editing a specific field
  const handleStartEdit = (fieldName: string, currentValue: string) => {
    setEditingField(fieldName);
    switch (fieldName) {
      case 'name':
        setEditedName(currentValue);
        break;
      case 'description':
        setEditedDescription(currentValue);
        break;
      case 'location':
        setEditedLocation(currentValue);
        break;
      case 'date':
        setEditedDate(currentValue);
        break;
    }
  };

  // Handler to save changes to a specific field
  const handleSaveField = async (fieldName: string) => {
    if (!event) return;

    let updatedValue = '';
    switch (fieldName) {
      case 'name':
        updatedValue = editedName;
        break;
      case 'description':
        updatedValue = editedDescription;
        break;
      case 'location':
        updatedValue = editedLocation;
        break;
      case 'date':
        updatedValue = editedDate;
        break;
    }

    try {
      const response = await fetch(`${API_URL_EVENTS}/${eventId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ [fieldName]: updatedValue }),
      });

      if (response.ok) {
        // Update local state with the edited value
        setEvent((prevEvent) => {
          if (!prevEvent) return null;
          return {
            ...prevEvent,
            [fieldName]: updatedValue,
          };
        });

        // Reset editing state
        setEditingField(null);
      } else {
        console.error(`Failed to update ${fieldName}`);
      }
    } catch (error) {
      console.error(`Error updating ${fieldName}:`, error);
    }
  };
  // Handler to cancel editing
  const handleCancelEdit = () => {
    setEditingField(null);
  };

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

    return (
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Event Details</Text>
        </View>{' '}
        <View style={styles.eventInfo}>
          <View style={styles.fieldContainer}>
            {editingField === 'name' ? (
              <View style={styles.editFieldContainer}>
                <TextInput
                  style={styles.editInput}
                  value={editedName}
                  onChangeText={setEditedName}
                  placeholder="Event Name"
                />
                <View style={styles.editActionsRow}>
                  <TouchableOpacity
                    style={styles.saveButton}
                    onPress={() => handleSaveField('name')}
                  >
                    <Ionicons name="checkmark" size={20} color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={handleCancelEdit}
                  >
                    <Ionicons name="close" size={20} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={styles.fieldRow}>
                <Text style={styles.eventTitle}>{event.name}</Text>
                {isCreator && (
                  <TouchableOpacity
                    style={styles.fieldEditButton}
                    onPress={() => handleStartEdit('name', event.name)}
                  >
                    <Ionicons name="pencil" size={18} color="#4a90e2" />
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>

          {!isCreator && (
            <TouchableOpacity style={styles.reviewButton}>
              <Text style={styles.reviewText}>Review</Text>
            </TouchableOpacity>
          )}
        </View>{' '}
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
            <View style={styles.fieldRow}>
              <Text style={styles.aboutTitle}>About</Text>
              {isCreator && (
                <TouchableOpacity
                  style={styles.fieldEditButton}
                  onPress={() =>
                    handleStartEdit('description', event.description)
                  }
                >
                  <Ionicons name="pencil" size={18} color="#4a90e2" />
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.tagContainer}>
              {event?.tags?.map((tag, index) => (
                <Text
                  key={`tag-${index}-${typeof tag === 'object' ? tag.id : tag}`}
                  style={styles.tag}
                >
                  {typeof tag === 'object' && tag !== null ? tag.name : tag}
                </Text>
              ))}
            </View>

            {editingField === 'description' ? (
              <View style={styles.editFieldContainer}>
                <TextInput
                  style={[
                    styles.editInput,
                    { height: 120, textAlignVertical: 'top' },
                  ]}
                  value={editedDescription}
                  onChangeText={setEditedDescription}
                  placeholder="Event Description"
                  multiline
                />
                <View style={styles.editActionsRow}>
                  <TouchableOpacity
                    style={styles.saveButton}
                    onPress={() => handleSaveField('description')}
                  >
                    <Ionicons name="checkmark" size={20} color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={handleCancelEdit}
                  >
                    <Ionicons name="close" size={20} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <Text style={styles.description}>{event.description}</Text>
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
            */}{' '}
        <Text style={styles.sectionTitle}>Event Details</Text>
        <View style={styles.detailRow}>
          <Ionicons name="location-outline" size={20} color="gray" />
          {editingField === 'location' ? (
            <View style={{ flex: 1, marginLeft: 5 }}>
              <TextInput
                style={styles.editInput}
                value={editedLocation}
                onChangeText={setEditedLocation}
                placeholder="Event Location"
              />
              <View style={styles.editActionsRow}>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={() => handleSaveField('location')}
                >
                  <Ionicons name="checkmark" size={20} color="white" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={handleCancelEdit}
                >
                  <Ionicons name="close" size={20} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Text style={styles.detailText}>
                {event.location || 'No location available'}
              </Text>
              {isCreator && (
                <TouchableOpacity
                  style={styles.fieldEditButton}
                  onPress={() =>
                    handleStartEdit('location', event.location || '')
                  }
                >
                  <Ionicons name="pencil" size={18} color="#4a90e2" />
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>{' '}
        <View style={styles.detailRow}>
          <Ionicons name="calendar-outline" size={20} color="gray" />
          {editingField === 'date' ? (
            <View style={{ flex: 1, marginLeft: 5 }}>
              <TextInput
                style={styles.editInput}
                value={editedDate}
                onChangeText={setEditedDate}
                placeholder="Event Date (DD/MM/YYYY)"
              />
              <View style={styles.editActionsRow}>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={() => handleSaveField('date')}
                >
                  <Ionicons name="checkmark" size={20} color="white" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={handleCancelEdit}
                >
                  <Ionicons name="close" size={20} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View
              style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}
            >
              <Text style={styles.detailText}>{formatDate(event.date)}</Text>
              {isCreator && (
                <TouchableOpacity
                  style={[styles.fieldEditButton, { marginLeft: 5 }]}
                  onPress={() =>
                    handleStartEdit('date', formatDate(event.date))
                  }
                >
                  <Ionicons name="pencil" size={18} color="#4a90e2" />
                </TouchableOpacity>
              )}
            </View>
          )}

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
          keyExtractor={(item, index) =>
            item.id ? `review-${item.id}` : `review-index-${index}`
          }
          renderItem={({ item }) => <ReviewItem item={item} />}
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

export default ModifyEventDetailScreen;
