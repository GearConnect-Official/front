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
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '@/app/App';
import { EventInterface } from '../services/EventInterface';
import styles from '../styles/eventDetailStyles';
import { API_URL } from '../config'; //until we have a .env file working

type EventDetailScreenRouteProp = RouteProp<RootStackParamList, 'EventDetail'>;

const EventDetailScreen: React.FC = () => {
  const route = useRoute<EventDetailScreenRouteProp>();
  const navigation = useNavigation();
  const { eventId } = route.params;
  const [event, setEvent] = useState<EventInterface | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const response = await fetch(`${API_URL}/events/${eventId}`);
      if (!response.ok) {
        throw new Error(
          `Failed to fetch events: ${response.status} ${response.statusText}`
        );
      }
      const fetchedEvent: EventInterface = await response.json();
      setEvent(fetchedEvent);
      setError(null);
    } catch (error) {
      setEvent(null);
      setError('Failed to fetch event data');
    }
  };
  console.log('eventId:', eventId);
  console.log('event:', event);

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
          <TouchableOpacity style={styles.reviewButton}>
            <Text style={styles.reviewText}>Review</Text>
          </TouchableOpacity>
          {/* <Text style={styles.eventCategory}>{event.category}</Text> */}
        </View>

        {/* 
         <View style={styles.descriptionContainer}>
           {event?.images?.[0] ? (
            <Image
               source={{ uri: event.images[0] }}
               style={styles.eventImage}
             />
           ) : (
             <View style={styles.placeholderImage}>
               <Text>No Image Available</Text>
             </View>
           )}
           <View style={styles.aboutContainer}>
             <Text style={styles.aboutTitle}>About</Text>
             <View style={styles.tagContainer}>
               {event?.tags?.map((tag, index) => (
                <Text key={index} style={styles.tag}>
                  {tag}
                </Text>
               ))}
            </View>
             <Text style={styles.description}>{event.description}</Text>
          </View>
         </View>
          */}
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
          <Text style={styles.detailText}>
            {event.date || 'No date available'}
          </Text>
          <Ionicons
            name="time-outline"
            size={20}
            color="gray"
            style={{ marginLeft: 10 }}
          />
          {/* <Text style={styles.detailText}>{event.meteo}</Text> */}
        </View>
        {/*
         <Text style={styles.sectionTitle}>Related Products</Text>
         <FlatList
          horizontal
          data={event.relatedProducts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.productCard}>
              <Text style={styles.productTag}>{item.tag}</Text>
              <Image source={{ uri: item.image }} style={styles.productImage} />
              <Text style={styles.productTitle}>{item.title}</Text>
              <Text style={styles.productPrice}>Price: {item.price}</Text>
            </View>
          )}
        />
*/}
        {/* 

        <Text style={styles.sectionTitle}>Customer Reviews</Text>
        <FlatList
          horizontal
          data={event.reviews}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
              <View style={styles.reviewCard}>
                <Image
                  source={{ uri: item.avatar }}
                  style={styles.reviewAvatar}
                />
                <Text style={styles.reviewUser}>{item.user}</Text>
                <Text>{item.comment}</Text>
              </View>
            )}
          />
  */}

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
