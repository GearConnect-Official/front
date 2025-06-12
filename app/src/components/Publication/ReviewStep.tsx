import React from 'react';
import { View, Text, Image, ScrollView, ActivityIndicator, Dimensions } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import styles from '../../styles/components/publicationStepStyles';
import theme from '../../styles/config/theme';
import CloudinaryMedia from '../media/CloudinaryMedia';

const SCREEN_WIDTH = Dimensions.get('window').width;

interface ReviewStepProps {
  imageUri: string;
  title: string;
  description: string;
  tags: string[];
  username: string;
  userAvatar: string;
  mediaType?: 'image' | 'video';
  publicId?: string;
  error?: string;
  isLoading?: boolean;
}

const ReviewStep: React.FC<ReviewStepProps> = ({
  imageUri,
  title,
  description,
  tags,
  username,
  userAvatar,
  mediaType,
  publicId,
  error,
  isLoading = false
}) => {
  return (
    <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
      <View style={styles.stepContainer}>
        <View style={styles.iconContainer}>
          <FontAwesome name="eye" size={40} color={theme.colors.primary.main} />
        </View>
        
        <Text style={styles.stepTitle}>Review your post</Text>
        <Text style={styles.stepDescription}>
          Here's how your post will appear to other users. Review everything before publishing.
        </Text>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Post Preview */}
        <View style={styles.previewContainer}>
          {/* Media Preview */}
          <View style={styles.previewImageContainer}>
            {publicId ? (
              <CloudinaryMedia
                publicId={publicId}
                mediaType={mediaType || 'auto'}
                width={SCREEN_WIDTH - 48}
                height={SCREEN_WIDTH - 48}
                style={styles.previewImage}
                fallbackUrl={imageUri}
                shouldPlay={mediaType === 'video'}
                isMuted={true}
                useNativeControls={mediaType === 'video'}
                isLooping={mediaType === 'video'}
              />
            ) : (
              <Image 
                source={{ uri: imageUri }} 
                style={styles.previewImage}
                resizeMode="cover"
              />
            )}
          </View>

          {/* User Info */}
          <View style={styles.previewUserInfo}>
            <Image 
              source={{ uri: userAvatar }} 
              style={styles.previewUserAvatar}
            />
            <Text style={styles.previewUsername}>{username}</Text>
            <Text style={styles.previewTime}>now</Text>
          </View>

          {/* Content */}
          <View style={styles.previewContent}>
            <Text style={styles.previewTitle}>{title}</Text>
            <Text style={styles.previewDescription}>{description}</Text>
            
            {tags.length > 0 && (
              <View style={styles.previewTags}>
                {tags.map((tag, index) => (
                  <Text key={index} style={styles.previewTag}>#{tag}</Text>
                ))}
              </View>
            )}
          </View>

          {/* Mock Interaction Buttons */}
          <View style={styles.previewActions}>
            <View style={styles.previewActionButton}>
              <FontAwesome name="heart-o" size={24} color={theme.colors.text.secondary} />
            </View>
            <View style={styles.previewActionButton}>
              <FontAwesome name="comment-o" size={24} color={theme.colors.text.secondary} />
            </View>
            <View style={styles.previewActionButton}>
              <FontAwesome name="share" size={24} color={theme.colors.text.secondary} />
            </View>
            <View style={[styles.previewActionButton, { marginLeft: 'auto' }]}>
              <FontAwesome name="bookmark-o" size={24} color={theme.colors.text.secondary} />
            </View>
          </View>
        </View>

        {/* Summary */}
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>Summary:</Text>
          <View style={styles.summaryItem}>
            <FontAwesome name="picture-o" size={16} color={theme.colors.text.secondary} />
            <Text style={styles.summaryText}>
              {mediaType === 'video' ? 'Video' : 'Image'} ready to share
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <FontAwesome name="pencil" size={16} color={theme.colors.text.secondary} />
            <Text style={styles.summaryText}>
              Title: {title.length}/100 characters
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <FontAwesome name="align-left" size={16} color={theme.colors.text.secondary} />
            <Text style={styles.summaryText}>
              Description: {description.length}/2200 characters
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <FontAwesome name="tags" size={16} color={theme.colors.text.secondary} />
            <Text style={styles.summaryText}>
              {tags.length} tag{tags.length !== 1 ? 's' : ''} added
            </Text>
          </View>
        </View>

        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary.main} />
            <Text style={styles.loadingText}>Publishing your post...</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default ReviewStep; 