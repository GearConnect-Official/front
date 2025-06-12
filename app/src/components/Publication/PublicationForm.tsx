import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  Image, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import styles from '../../styles/screens/publicationStyles';
import { publicationFormStyles, MAX_DESCRIPTION_LENGTH, SUGGESTED_TAGS } from '../../styles/components/publicationFormStyles';
import theme from '../../styles/config/theme';
import CloudinaryMedia from '../media/CloudinaryMedia';

const SCREEN_WIDTH = Dimensions.get('window').width;

interface FormErrors {
  title?: string;
  description?: string;
  image?: string;
  general?: string;
}

interface PublicationFormProps {
  imageUri: string;
  username: string;
  userAvatar: string;
  title: string;
  description: string;
  tags: string[];
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  setTags: (tags: string[]) => void;
  isLoading?: boolean;
  mediaType?: 'image' | 'video';
  publicId?: string;
  errors?: FormErrors;
}

const PublicationForm: React.FC<PublicationFormProps> = ({
  imageUri,
  username,
  userAvatar,
  title,
  description,
  tags,
  setTitle,
  setDescription,
  setTags,
  isLoading = false,
  mediaType,
  publicId,
  errors = {}
}) => {
  const [tagInput, setTagInput] = useState('');
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const handleAddTag = () => {
    const trimmedInput = tagInput.trim();
    if (trimmedInput && !tags.includes(trimmedInput)) {
      const newTags = [...tags, trimmedInput];
      setTags(newTags);
      setTagInput('');
    }
  };

  const handleRemoveTag = (index: number) => {
    const newTags = [...tags];
    newTags.splice(index, 1);
    setTags(newTags);
  };
  
  const handleAddSuggestedTag = (tag: string) => {
    if (!tags.includes(tag)) {
      setTags([...tags, tag]);
    }
  };
  
  const togglePreviewMode = () => {
    setIsPreviewMode(!isPreviewMode);
  };
  
  const descriptionCharactersLeft = MAX_DESCRIPTION_LENGTH - description.length;
  const isDescriptionLimitWarning = descriptionCharactersLeft <= 50;
  const filteredSuggestions = SUGGESTED_TAGS.filter(tag => 
    !tags.includes(tag) && tag.toLowerCase().includes(tagInput.toLowerCase())
  );

  if (isPreviewMode) {
    return (
      <View style={styles.formContainer}>
        <View style={publicationFormStyles.previewHeader}>
          <Text style={publicationFormStyles.previewTitle}>Post Preview</Text>
          <TouchableOpacity
            style={publicationFormStyles.previewCloseButton}
            onPress={togglePreviewMode}
          >
            <FontAwesome name="edit" size={18} color={theme.colors.primary.main} />
            <Text style={publicationFormStyles.previewCloseText}>Edit</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView>
          <View style={styles.formImagePreview}>
            {publicId ? (
              <CloudinaryMedia
                publicId={publicId}
                mediaType={mediaType || 'auto'}
                width={SCREEN_WIDTH}
                height={SCREEN_WIDTH}
                style={styles.formImagePreview}
                fallbackUrl={imageUri}
                shouldPlay={mediaType === 'video'}
                isMuted={true}
                useNativeControls={mediaType === 'video'}
                isLooping={mediaType === 'video'}
              />
            ) : (
              <Image 
                source={{ uri: imageUri }} 
                style={styles.formImagePreview}
                resizeMode="cover"
              />
            )}
          </View>
          
          <View style={publicationFormStyles.previewContent}>
            <View style={publicationFormStyles.previewUserInfo}>
              <Image 
                source={{ uri: userAvatar }} 
                style={styles.userAvatar}
              />
              <Text style={styles.headerText}>{username}</Text>
            </View>
            
            <Text style={publicationFormStyles.previewPostTitle}>{title || "Untitled"}</Text>
            
            {description ? (
              <Text style={publicationFormStyles.previewDescription}>{description}</Text>
            ) : (
              <Text style={publicationFormStyles.previewNoContent}>No description</Text>
            )}
            
            {tags.length > 0 ? (
              <View style={publicationFormStyles.previewTags}>
                {tags.map((tag, index) => (
                  <Text key={index} style={publicationFormStyles.previewTag}>#{tag}</Text>
                ))}
              </View>
            ) : (
              <Text style={publicationFormStyles.previewNoContent}>No tags</Text>
            )}
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={100}
    >
      <ScrollView style={styles.formContainer}>
        <View style={styles.formImagePreview}>
          {publicId ? (
            <CloudinaryMedia
              publicId={publicId}
              mediaType={mediaType || 'auto'}
              width={SCREEN_WIDTH}
              height={SCREEN_WIDTH}
              style={styles.formImagePreview}
              fallbackUrl={imageUri}
              shouldPlay={mediaType === 'video'}
              isMuted={true}
              useNativeControls={mediaType === 'video'}
              isLooping={mediaType === 'video'}
            />
          ) : (
            <Image 
              source={{ uri: imageUri }} 
              style={styles.formImagePreview}
              resizeMode="cover"
            />
          )}
        </View>
        
        <View style={styles.formContent}>
          <View style={styles.userInfoContainer}>
            <Image 
              source={{ uri: userAvatar }} 
              style={styles.userAvatar}
            />
            <Text style={styles.headerText}>{username}</Text>
            
            <TouchableOpacity
              style={publicationFormStyles.previewButton}
              onPress={togglePreviewMode}
              disabled={isLoading}
            >
              <FontAwesome name="eye" size={16} color={theme.colors.primary.main} />
              <Text style={publicationFormStyles.previewButtonText}>Preview</Text>
            </TouchableOpacity>
          </View>

          {/* Image error message */}
          {errors.image && (
            <View style={publicationFormStyles.errorContainer}>
              <Text style={publicationFormStyles.errorText}>{errors.image}</Text>
            </View>
          )}

          {/* General error message */}
          {errors.general && (
            <View style={publicationFormStyles.errorContainer}>
              <Text style={publicationFormStyles.errorText}>{errors.general}</Text>
            </View>
          )}

          <View style={styles.inputContainer}>
            <View style={publicationFormStyles.inputSection}>
              <Text style={publicationFormStyles.inputLabel}>Title *</Text>
              <TextInput
                style={[
                  styles.titleInput,
                  errors.title && publicationFormStyles.inputError
                ]}
                placeholder="Enter your title"
                placeholderTextColor={theme.colors.text.secondary}
                value={title}
                onChangeText={setTitle}
                editable={!isLoading}
                maxLength={100}
              />
              {errors.title && (
                <Text style={publicationFormStyles.fieldError}>{errors.title}</Text>
              )}
            </View>

            <View style={publicationFormStyles.inputSection}>
              <View style={publicationFormStyles.labelRow}>
                <Text style={publicationFormStyles.inputLabel}>Description</Text>
                <Text style={[
                  publicationFormStyles.charCounter,
                  isDescriptionLimitWarning && publicationFormStyles.charCounterWarning
                ]}>
                  {descriptionCharactersLeft}
                </Text>
              </View>
              <TextInput
                style={[
                  styles.descriptionInput,
                  errors.description && publicationFormStyles.inputError
                ]}
                placeholder="Write your description"
                placeholderTextColor={theme.colors.text.secondary}
                value={description}
                onChangeText={text => setDescription(text.slice(0, MAX_DESCRIPTION_LENGTH))}
                multiline
                editable={!isLoading}
              />
              {errors.description && (
                <Text style={publicationFormStyles.fieldError}>{errors.description}</Text>
              )}
              <Text style={publicationFormStyles.helperText}>
                Share details about your photo, the circuit, the event...
              </Text>
            </View>

            <View style={publicationFormStyles.inputSection}>
              <Text style={publicationFormStyles.inputLabel}>Tags</Text>
              
              {tags.length > 0 && (
                <View style={styles.tagsContainer}>
                  {tags.map((tag, index) => (
                    <View key={index} style={styles.tagItem}>
                      <Text style={styles.tagText}>#{tag}</Text>
                      <TouchableOpacity 
                        onPress={() => handleRemoveTag(index)}
                        disabled={isLoading}
                      >
                        <FontAwesome name="times" size={14} color={theme.colors.text.secondary} />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
              
              <View style={styles.tagInputContainer}>
                <TextInput
                  style={styles.tagInput}
                  placeholder="Add tags"
                  placeholderTextColor={theme.colors.text.secondary}
                  value={tagInput}
                  onChangeText={setTagInput}
                  onSubmitEditing={handleAddTag}
                  returnKeyType="done"
                  blurOnSubmit={true}
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isLoading}
                />
              </View>
              
              <TouchableOpacity 
                style={[
                  styles.addTagButton,
                  (!tagInput.trim() || isLoading) && publicationFormStyles.disabledButton
                ]} 
                onPress={handleAddTag}
                disabled={isLoading || !tagInput.trim()}
              >
                <Text style={styles.addTagButtonText}>Add</Text>
              </TouchableOpacity>
              
              {tagInput.trim() && filteredSuggestions.length > 0 ? (
                <View style={publicationFormStyles.suggestionsContainer}>
                  <Text style={publicationFormStyles.suggestionsTitle}>Suggestions:</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View style={publicationFormStyles.suggestionsList}>
                      {filteredSuggestions.map((tag, index) => (
                        <TouchableOpacity
                          key={index}
                          style={publicationFormStyles.suggestionTag}
                          onPress={() => handleAddSuggestedTag(tag)}
                          disabled={isLoading}
                        >
                          <Text style={publicationFormStyles.suggestionTagText}>#{tag}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </ScrollView>
                </View>
              ) : !tagInput.trim() ? (
                <View style={publicationFormStyles.suggestionsContainer}>
                  <Text style={publicationFormStyles.suggestionsTitle}>Popular tags:</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View style={publicationFormStyles.suggestionsList}>
                      {SUGGESTED_TAGS.filter(tag => !tags.includes(tag)).slice(0, 8).map((tag, index) => (
                        <TouchableOpacity
                          key={index}
                          style={publicationFormStyles.suggestionTag}
                          onPress={() => handleAddSuggestedTag(tag)}
                          disabled={isLoading}
                        >
                          <Text style={publicationFormStyles.suggestionTagText}>#{tag}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </ScrollView>
                </View>
              ) : null}
            </View>
          </View>

          {isLoading && (
            <View style={publicationFormStyles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.colors.primary.main} />
              <Text style={publicationFormStyles.loadingText}>Publishing...</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default PublicationForm; 