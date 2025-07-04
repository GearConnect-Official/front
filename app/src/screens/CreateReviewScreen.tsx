import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
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
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

type RootStackParamList = {
  CreateReview: {
    eventId: number;
  };
};

type CreateReviewScreenRouteProp = RouteProp<
  RootStackParamList,
  'CreateReview'
>;

const CreateReviewScreen: React.FC = () => {
  const { user } = useAuth();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<CreateReviewScreenRouteProp>();
  const { eventId } = route.params;
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const maxReviewLength = 190;
    const onSubmit = async () => {
      setLoading(true);
      setError(null);
      // Add logic to submit the review to your API
      console.log('Submitting review:', { eventId, reviewText, rating });
      if (!reviewText.trim()) {
        setError('Please enter a review text.');
        setLoading(false);
        return;
      }
      if (reviewText.length > maxReviewLength) {
        setError(`Review text cannot exceed ${maxReviewLength} characters.`);
        setLoading(false);
        return;
      }
      if (!rating) {
        setError('Please select a rating.');
        setLoading(false);
        return;
      }
      if (!user || !user.id) {
        setError('User not authenticated. Please log in.');
        setLoading(false);
        return;
      }
      try {
        const reviewData = {
          eventId: eventId,
          userId: user.id,
          note: rating,
          description: reviewText,
        };
        const createdReview = await eventService.createEventReview(reviewData);
        console.log('Review created successfully:', createdReview);
        navigation.goBack();
      } catch (error: any) {
        console.error('Error submitting review:', error);
        setError('Error submitting review. Please try again.');
      } finally {
        setLoading(false);
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
          <Text
            style={[
              styles.title,
              { flex: 1, textAlign: 'center', marginRight: 85 },
            ]}
          >
            Create Review
          </Text>
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
              placeholder={`Write your review here... (max ${maxReviewLength} characters)`}
              placeholderTextColor="#A0A0A0"
              multiline={true}
              value={reviewText}
              onChangeText={setReviewText}
              numberOfLines={5}
              textAlignVertical="top"
              maxLength={maxReviewLength}
            />
            <Text style={styles.characterCounter}>
              {reviewText.length}/{maxReviewLength}
            </Text>
          </View>
          {error && <Text style={styles.errorText}>{error}</Text>}
        </View>

        <TouchableOpacity
          style={[
            styles.submitButton,
            (!reviewText.trim() || rating === 0) && styles.disabledButton,
          ]}
          onPress={onSubmit}
          disabled={!reviewText.trim() || rating === 0}
        >
          <Text style={styles.submitButtonText}>
            {reviewText.trim() && rating > 0
              ? 'Post Review'
              : 'Add Rating & Review'}
          </Text>
          {reviewText.trim() && rating > 0 && (
            <FontAwesome
              name="paper-plane"
              size={16}
              color="#fff"
              style={{ marginLeft: 8 }}
            />
          )}
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CreateReviewScreen;
