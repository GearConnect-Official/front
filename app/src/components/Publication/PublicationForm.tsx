import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  Image, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator,
  StyleSheet,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import styles from '../../styles/publicationStyles';

// Racing color palette
const THEME_COLORS = {
  primary: '#E10600', // Racing Red
  secondary: '#1E1E1E', // Racing Black
  background: '#FFFFFF',
  textPrimary: '#1E1E1E',
  textSecondary: '#6E6E6E',
  border: '#E0E0E0',
  card: '#F2F2F2',
  cardLight: '#F8F8F8',
};

// Popular suggested tags
const SUGGESTED_TAGS = [
  'racing', 'f1', 'circuit', 'karting', 'driving', 'motorsport', 
  'performance', 'mechanics', 'car', 'speed', 'competition'
];

// Character limit
const MAX_DESCRIPTION_LENGTH = 500;

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
  isLoading = false
}) => {
  const [tagInput, setTagInput] = useState('');
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
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
        <View style={localStyles.previewHeader}>
          <Text style={localStyles.previewTitle}>Post Preview</Text>
          <TouchableOpacity
            style={localStyles.previewCloseButton}
            onPress={togglePreviewMode}
          >
            <FontAwesome name="edit" size={18} color={THEME_COLORS.primary} />
            <Text style={localStyles.previewCloseText}>Edit</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView>
          <View style={styles.formImagePreview}>
            <Image 
              source={{ uri: imageUri }} 
              style={styles.formImagePreview}
              resizeMode="cover"
            />
          </View>
          
          <View style={localStyles.previewContent}>
            <View style={localStyles.previewUserInfo}>
              <Image 
                source={{ uri: userAvatar }} 
                style={styles.userAvatar}
              />
              <Text style={styles.headerText}>{username}</Text>
            </View>
            
            <Text style={localStyles.previewPostTitle}>{title || "Untitled"}</Text>
            
            {description ? (
              <Text style={localStyles.previewDescription}>{description}</Text>
            ) : (
              <Text style={localStyles.previewNoContent}>No description</Text>
            )}
            
            {tags.length > 0 ? (
              <View style={localStyles.previewTags}>
                {tags.map((tag, index) => (
                  <Text key={index} style={localStyles.previewTag}>#{tag}</Text>
                ))}
              </View>
            ) : (
              <Text style={localStyles.previewNoContent}>No tags</Text>
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
          <Image 
            source={{ uri: imageUri }} 
            style={styles.formImagePreview}
            resizeMode="cover"
          />
        </View>
        
        <View style={styles.formContent}>
          <View style={styles.userInfoContainer}>
            <Image 
              source={{ uri: userAvatar }} 
              style={styles.userAvatar}
            />
            <Text style={styles.headerText}>{username}</Text>
            
            <TouchableOpacity
              style={localStyles.previewButton}
              onPress={togglePreviewMode}
              disabled={isLoading}
            >
              <FontAwesome name="eye" size={16} color={THEME_COLORS.primary} />
              <Text style={localStyles.previewButtonText}>Preview</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <View style={localStyles.inputSection}>
              <Text style={localStyles.inputLabel}>Title</Text>
              <TextInput
                style={styles.titleInput}
                placeholder="Enter your title"
                placeholderTextColor={THEME_COLORS.textSecondary}
                value={title}
                onChangeText={setTitle}
                editable={!isLoading}
                maxLength={100}
              />
            </View>

            <View style={localStyles.inputSection}>
              <View style={localStyles.labelRow}>
                <Text style={localStyles.inputLabel}>Description</Text>
                <Text style={[
                  localStyles.charCounter,
                  isDescriptionLimitWarning && localStyles.charCounterWarning
                ]}>
                  {descriptionCharactersLeft}
                </Text>
              </View>
              <TextInput
                style={styles.descriptionInput}
                placeholder="Write your description"
                placeholderTextColor={THEME_COLORS.textSecondary}
                value={description}
                onChangeText={text => {
                  if (text.length <= MAX_DESCRIPTION_LENGTH) {
                    setDescription(text);
                  }
                }}
                multiline
                editable={!isLoading}
              />
              <Text style={localStyles.helperText}>
                Share details about your photo, the circuit, the event...
              </Text>
            </View>

            <View style={localStyles.inputSection}>
              <Text style={localStyles.inputLabel}>Tags</Text>
              
              {tags.length > 0 && (
                <View style={styles.tagsContainer}>
                  {tags.map((tag, index) => (
                    <View key={index} style={styles.tagItem}>
                      <Text style={styles.tagText}>#{tag}</Text>
                      <TouchableOpacity 
                        onPress={() => handleRemoveTag(index)}
                        disabled={isLoading}
                      >
                        <FontAwesome name="times" size={14} color={THEME_COLORS.textSecondary} />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
              
              <View style={styles.tagInputContainer}>
                <TextInput
                  style={styles.tagInput}
                  placeholder="Add tags"
                  placeholderTextColor={THEME_COLORS.textSecondary}
                  value={tagInput}
                  onChangeText={setTagInput}
                  onSubmitEditing={handleAddTag}
                  editable={!isLoading}
                />
              </View>
              
              <TouchableOpacity 
                style={[
                  styles.addTagButton,
                  (!tagInput.trim() || isLoading) && localStyles.disabledButton
                ]} 
                onPress={handleAddTag}
                disabled={isLoading || !tagInput.trim()}
              >
                <Text style={styles.addTagButtonText}>Add</Text>
              </TouchableOpacity>
              
              {tagInput.trim() && filteredSuggestions.length > 0 ? (
                <View style={localStyles.suggestionsContainer}>
                  <Text style={localStyles.suggestionsTitle}>Suggestions:</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View style={localStyles.suggestionsList}>
                      {filteredSuggestions.map((tag, index) => (
                        <TouchableOpacity
                          key={index}
                          style={localStyles.suggestionTag}
                          onPress={() => handleAddSuggestedTag(tag)}
                          disabled={isLoading}
                        >
                          <Text style={localStyles.suggestionTagText}>#{tag}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </ScrollView>
                </View>
              ) : tags.length === 0 && tagInput.length === 0 ? (
                <View style={localStyles.suggestionsContainer}>
                  <Text style={localStyles.suggestionsTitle}>Popular tags:</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View style={localStyles.suggestionsList}>
                      {SUGGESTED_TAGS.slice(0, 8).map((tag, index) => (
                        <TouchableOpacity
                          key={index}
                          style={localStyles.suggestionTag}
                          onPress={() => handleAddSuggestedTag(tag)}
                          disabled={isLoading}
                        >
                          <Text style={localStyles.suggestionTagText}>#{tag}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </ScrollView>
                </View>
              ) : null}
            </View>
          </View>

          {isLoading && (
            <View style={localStyles.loadingContainer}>
              <ActivityIndicator size="large" color={THEME_COLORS.primary} />
              <Text style={localStyles.loadingText}>Publishing...</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const localStyles = StyleSheet.create({
  inputSection: {
    marginBottom: 20,
  },
  inputLabel: {
    color: THEME_COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  charCounter: {
    color: THEME_COLORS.textSecondary,
    fontSize: 14,
  },
  charCounterWarning: {
    color: THEME_COLORS.primary,
  },
  helperText: {
    color: THEME_COLORS.textSecondary,
    fontSize: 12,
    marginTop: 6,
  },
  suggestionsContainer: {
    marginTop: 16,
  },
  suggestionsTitle: {
    color: THEME_COLORS.textSecondary,
    fontSize: 14,
    marginBottom: 8,
  },
  suggestionsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  suggestionTag: {
    backgroundColor: THEME_COLORS.card,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  suggestionTagText: {
    color: THEME_COLORS.primary,
    fontSize: 14,
  },
  disabledButton: {
    opacity: 0.5,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    marginTop: 10,
  },
  loadingText: {
    color: THEME_COLORS.textPrimary,
    marginTop: 10,
    fontSize: 16,
  },
  previewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: THEME_COLORS.cardLight,
  },
  previewButtonText: {
    color: THEME_COLORS.primary,
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: THEME_COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: THEME_COLORS.border,
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: THEME_COLORS.textPrimary,
  },
  previewCloseButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  previewCloseText: {
    color: THEME_COLORS.primary,
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
  previewContent: {
    padding: 16,
  },
  previewUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  previewPostTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: THEME_COLORS.textPrimary,
    marginBottom: 10,
  },
  previewDescription: {
    fontSize: 16,
    color: THEME_COLORS.textPrimary,
    lineHeight: 22,
    marginBottom: 16,
  },
  previewTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  previewTag: {
    color: THEME_COLORS.primary,
    fontSize: 14,
    marginRight: 8,
    marginBottom: 5,
  },
  previewNoContent: {
    color: THEME_COLORS.textSecondary,
    fontStyle: 'italic',
    marginVertical: 10,
  },
});

export default PublicationForm; 