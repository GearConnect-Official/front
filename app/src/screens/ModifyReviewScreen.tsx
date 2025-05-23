import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import {
  RouteProp,
  useNavigation,
  useRoute,
  NavigationProp,
} from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import styles from '../styles/reviewStyles';
import { useAuth } from '../context/AuthContext';
import eventService from '../services/eventService';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

type RootStackParamList = {
  ModifyReview: {
    eventId: number;
    userId: number;
  };
};

type ModifyReviewScreenRouteProp = RouteProp<
  RootStackParamList,
  'ModifyReview'
>;

const ModifyReviewScreen: React.FC = () => {
  const { user } = useAuth();
  const route = useRoute<ModifyReviewScreenRouteProp>();
  const { eventId, userId } = route.params;

  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reviewData, setReviewData] = useState<any>(null);

  useEffect(() => {
    const fetchReviewData = async () => {
      try {
        const review = await eventService.getEventReviewById(eventId, userId);
        setReviewData(review);
        setReviewText(review.description);
        setRating(review.note);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching review:', error);
        setError('Could not load review data. Please try again.');
        setLoading(false);
      }
    };

    fetchReviewData();
  }, [eventId, userId]);

  const onUpdate = async () => {
    setSubmitting(true);
    setError(null);

    if (!reviewText.trim()) {
      setError('Please enter a review text.');
      setSubmitting(false);
      return;
    }

    if (!rating) {
      setError('Please select a rating.');
      setSubmitting(false);
      return;
    }

    try {
      const updatedReviewData = {
        note: rating,
        description: reviewText,
      };

      await eventService.updateEventReview(eventId, userId, updatedReviewData);
      console.log('Review updated successfully');
      router.back();
    } catch (error: any) {
      console.error('Error updating review:', error);
      setError('Error updating review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Star rating component
  const RatingSelector = () => {
    return (
      <View style={styles.ratingContainer}>
        <Text style={styles.ratingLabel}>Your Rating:</Text>
        <View style={styles.starsContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity
              key={star}
              onPress={() => setRating(star)}
              style={styles.starButton}
            >
              <FontAwesome
                name={rating >= star ? 'star' : 'star-o'}
                size={30}
                color={rating >= star ? '#FFD700' : '#aaa'}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#4A80F0" />
        <Text style={styles.loadingText}>Loading review...</Text>
      </View>
    );
  }
  const handleDeleteReview = async () => {
    try {
      setSubmitting(true);
      await eventService.deleteEventReview(eventId, userId);
      console.log('Review deleted successfully');
      router.back();
    } catch (error) {
      console.error('Error deleting review:', error);
      setError('Failed to delete review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <View style={styles.titleBar}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <FontAwesome name="arrow-left" size={24} color="#1E232C" />
          </TouchableOpacity>
          <Text style={styles.title}>Edit Review</Text>
          <TouchableOpacity
            onPress={handleDeleteReview}
            style={styles.deleteButton}
            disabled={submitting}
          >
            <FontAwesome name="trash" size={24} color="#FF3B30" />
          </TouchableOpacity>
        </View>
      </View>

      <KeyboardAvoidingView
        style={styles.reviewContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={100}
      >
        <View>
          <RatingSelector />
          <View style={styles.textAreaContainer}>
            <TextInput
              style={styles.textArea}
              placeholder="Write your review here..."
              placeholderTextColor="#A0A0A0"
              multiline={true}
              value={reviewText}
              onChangeText={setReviewText}
              numberOfLines={5}
              textAlignVertical="top"
            />
          </View>

          {error && <Text style={styles.errorText}>{error}</Text>}
        </View>

        <TouchableOpacity
          style={[
            styles.submitButton,
            (submitting || !reviewText.trim() || rating === 0) &&
              styles.disabledButton,
          ]}
          onPress={onUpdate}
          disabled={submitting || !reviewText.trim() || rating === 0}
        >
          {submitting ? (
            <ActivityIndicator color="#FFF" size="small" />
          ) : (
            <>
              <Text style={styles.submitButtonText}>Update Review</Text>
              <FontAwesome
                name="save"
                size={16}
                color="#fff"
                style={{ marginLeft: 8 }}
              />
            </>
          )}
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ModifyReviewScreen;
