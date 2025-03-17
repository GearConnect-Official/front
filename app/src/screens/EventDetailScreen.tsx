import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '@/app/App';
import eventService from '../services/eventService';

type EventDetailScreenRouteProp = RouteProp<RootStackParamList, 'EventDetail'>;

interface Event {
  id: string;
  title: string;
  category: string;
  description: string;
  images: string[];
  tags: string[];
  details: {
    location: string;
    date: string;
    time: string;
  };
  relatedProducts: {
    id: string;
    tag: string;
    image: string;
    title: string;
    price: string;
  }[];
  reviews: {
    id: string;
    user: string;
    comment: string;
    avatar: string;
  }[];
}

const EventDetailScreen: React.FC = () => {
  const route = useRoute<EventDetailScreenRouteProp>();
  const navigation = useNavigation();
  const { eventId } = route.params;
  const [event, setEvent] = useState<Event | null>(null);

  const fetchData = async () => {
    try {
      const fetchedEvent = await eventService.getEventById(eventId);
      if (!fetchedEvent) {
        setEvent(null);
      } else {
        setEvent(fetchedEvent);
      }
    } catch (error) {
      setEvent(null);
    }
  };

  useEffect(() => {
    fetchData();
  }, [eventId]);

  if (!event) {
    return (
      <View style={styles.container}>
        <Text>Event not found</Text>
      </View>
    );
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
        <Text style={styles.eventTitle}>{event.title}</Text>
        <TouchableOpacity style={styles.reviewButton}>
          <Text style={styles.reviewText}>Review</Text>
        </TouchableOpacity>
        <Text style={styles.eventCategory}>{event.category}</Text>
      </View>

      <View style={styles.descriptionContainer}>
        {event.images[0] ? (
          <Image source={{ uri: event.images[0] }} style={styles.eventImage} />
        ) : (
          <View style={styles.placeholderImage}>
            <Text>No Image Available</Text>
          </View>
        )}
        <View style={styles.aboutContainer}>
          <Text style={styles.aboutTitle}>About</Text>
          <View style={styles.tagContainer}>
            {event.tags.map((tag, index) => (
              <Text key={index} style={styles.tag}>
                {tag}
              </Text>
            ))}
          </View>
          <Text style={styles.description}>{event.description}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Best of Images</Text>
      {event.images[0] ? (
        <Image
          source={{ uri: event.images[0] }}
          style={styles.mainEventImage}
        />
      ) : (
        <View style={styles.placeholderMainImage}>
          <Text>No Image Available</Text>
        </View>
      )}

      <Text style={styles.sectionTitle}>Event Details</Text>
      <View style={styles.detailRow}>
        <Ionicons name="location-outline" size={20} color="gray" />
        <Text style={styles.detailText}>{event.details.location}</Text>
      </View>
      <View style={styles.detailRow}>
        <Ionicons name="calendar-outline" size={20} color="gray" />
        <Text style={styles.detailText}>{event.details.date}</Text>
        <Ionicons
          name="time-outline"
          size={20}
          color="gray"
          style={{ marginLeft: 10 }}
        />
        <Text style={styles.detailText}>{event.details.time}</Text>
      </View>

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

      <Text style={styles.sectionTitle}>Customer Reviews</Text>
      <FlatList
        horizontal
        data={event.reviews}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.reviewCard}>
            <Image source={{ uri: item.avatar }} style={styles.reviewAvatar} />
            <Text style={styles.reviewUser}>{item.user}</Text>
            <Text>{item.comment}</Text>
          </View>
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
        <Text style={{ color: 'white', fontWeight: 'bold' }}>Buy a Ticket</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    gap: 4,
    borderBottomWidth: 1,
    paddingBottom: 10,
    marginBottom: 10,
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  reviewButton: { backgroundColor: 'black', padding: 8, borderRadius: 5 },
  reviewText: { color: 'white' },
  eventInfo: { flex: 1, flexDirection: 'row', marginBottom: 10 },
  eventTitle: { fontSize: 20, fontWeight: 'bold' },
  eventCategory: { color: 'gray' },
  descriptionContainer: { flexDirection: 'row', marginBottom: 10 },
  eventImage: { width: 50, height: 50, borderRadius: 10, marginRight: 10 },
  placeholderImage: {
    width: 50,
    height: 50,
    borderRadius: 10,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ddd',
  },
  aboutContainer: { flex: 1 },
  aboutTitle: { fontWeight: 'bold' },
  tagContainer: { flexDirection: 'row', marginTop: 5 },
  tag: { backgroundColor: '#ddd', padding: 5, borderRadius: 5, marginRight: 5 },
  description: { marginTop: 5 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginVertical: 10 },
  mainEventImage: { width: '100%', height: 200, borderRadius: 10 },
  placeholderMainImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ddd',
  },
  detailRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 5 },
  detailText: { marginLeft: 5 },
  productCard: {
    padding: 10,
    marginRight: 10,
    borderWidth: 1,
    borderRadius: 10,
  },
  productImage: { width: 80, height: 80 },
  productTitle: { fontWeight: 'bold' },
  productTag: { backgroundColor: 'black', color: 'white', padding: 5 },
  productPrice: { marginTop: 5 },
  reviewUser: { fontWeight: 'bold' },
  shareButton: {
    backgroundColor: '#ddd',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  reviewCard: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
    marginRight: 10,
  },
  reviewAvatar: { width: 30, height: 30, borderRadius: 15 },
  buyButton: {
    backgroundColor: 'black',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  addCalendarButton: {
    backgroundColor: '#ddd',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
});

export default EventDetailScreen;
