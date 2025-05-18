import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../styles/eventDetailStyles';
import { EventInterface } from '../services/EventInterface';

// Create a star rating component
const StarRating: React.FC<{ rating: number; maxRating?: number }> = ({
  rating,
  maxRating = 5,
}) => {
  return (
    <View style={styles.starContainer}>
      {Array.from({ length: maxRating }).map((_, index) => (
        <Ionicons
          key={`star-${index}`}
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
  item: EventInterface['reviews'][0];
  isCurrentUserReview?: boolean;
}> = ({ item, isCurrentUserReview = false }) => {
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

interface EventDetailReviewProps {
  eventId: string | number;
  reviews: EventInterface['reviews'];
  userReview: EventInterface['reviews'][0] | null;
  user: any;
}

const EventDetailReview: React.FC<EventDetailReviewProps> = ({
  eventId,
  reviews,
  userReview,
  user
}) => {
  return (
    <View>
      <Text style={styles.sectionTitle}>Reviews</Text>
      
      <FlatList
        horizontal
        data={reviews || []}
        keyExtractor={(item, index) => `review-index-${index}`}
        renderItem={({ item }) => (
          <ReviewItem
            item={item}
            isCurrentUserReview={userReview !== null && item.userId === userReview.userId}
          />
        )}
      />
    </View>
  );
};

export default EventDetailReview;
