import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import styles from '../../styles/components/publicationStepStyles';
import theme from '../../styles/config/theme';

interface TagsStepProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  isLoading?: boolean;
}

const SUGGESTED_TAGS = [
  'racing', 'f1', 'circuit', 'karting', 'driving', 'motorsport', 
  'performance', 'mechanics', 'car', 'speed', 'competition',
  'vintage', 'modified', 'tuning', 'drift', 'track'
];

const TagsStep: React.FC<TagsStepProps> = ({
  tags,
  onTagsChange,
  isLoading = false
}) => {
  const [tagInput, setTagInput] = useState('');

  const handleAddTag = () => {
    const trimmedInput = tagInput.trim().toLowerCase();
    if (trimmedInput && !tags.includes(trimmedInput) && tags.length < 10) {
      onTagsChange([...tags, trimmedInput]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (index: number) => {
    const newTags = [...tags];
    newTags.splice(index, 1);
    onTagsChange(newTags);
  };

  const handleAddSuggestedTag = (tag: string) => {
    if (!tags.includes(tag) && tags.length < 10) {
      onTagsChange([...tags, tag]);
    }
  };

  const filteredSuggestions = SUGGESTED_TAGS.filter(tag => 
    !tags.includes(tag) && 
    tag.toLowerCase().includes(tagInput.toLowerCase())
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.stepContainer}>
          <View style={styles.iconContainer}>
            <FontAwesome name="tags" size={40} color={theme.colors.primary.main} />
          </View>
          
          <Text style={styles.stepTitle}>Add tags (optional)</Text>
          <Text style={styles.stepDescription}>
            Tags help people discover your content. You can add up to 10 tags to categorize your post.
          </Text>

          {/* Current Tags */}
          {tags.length > 0 && (
            <View style={styles.currentTagsSection}>
              <Text style={styles.inputLabel}>Your tags ({tags.length}/10):</Text>
              <View style={styles.tagsContainer}>
                {tags.map((tag, index) => (
                  <View key={index} style={styles.tagItem}>
                    <Text style={styles.tagText}>#{tag}</Text>
                    <TouchableOpacity 
                      onPress={() => handleRemoveTag(index)}
                      disabled={isLoading}
                      style={styles.removeTagButton}
                    >
                      <FontAwesome name="times" size={14} color={theme.colors.text.secondary} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Add New Tag */}
          {tags.length < 10 && (
            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>Add a new tag:</Text>
              <View style={styles.tagInputContainer}>
                <TextInput
                  style={styles.tagInput}
                  placeholder="Type a tag..."
                  placeholderTextColor={theme.colors.text.secondary}
                  value={tagInput}
                  onChangeText={setTagInput}
                  onSubmitEditing={handleAddTag}
                  returnKeyType="done"
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isLoading}
                  maxLength={30}
                />
                <TouchableOpacity 
                  style={[
                    styles.addTagButton,
                    (!tagInput.trim() || isLoading) && styles.disabledButton
                  ]} 
                  onPress={handleAddTag}
                  disabled={isLoading || !tagInput.trim()}
                >
                  <FontAwesome name="plus" size={16} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Suggested Tags */}
          <View style={styles.suggestionsSection}>
            <Text style={styles.inputLabel}>
              {tagInput.trim() ? 'Matching suggestions:' : 'Popular tags:'}
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.suggestionsList}>
                {(tagInput.trim() ? filteredSuggestions : SUGGESTED_TAGS.filter(tag => !tags.includes(tag)))
                  .slice(0, 8)
                  .map((tag, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.suggestionTag}
                      onPress={() => handleAddSuggestedTag(tag)}
                      disabled={isLoading || tags.length >= 10}
                    >
                      <Text style={styles.suggestionTagText}>#{tag}</Text>
                    </TouchableOpacity>
                  ))
                }
              </View>
            </ScrollView>
          </View>

          <View style={styles.tipsContainer}>
            <Text style={styles.tipsTitle}>Tag tips:</Text>
            <View style={styles.tipItem}>
              <FontAwesome name="check-circle" size={16} color={theme.colors.status.success} />
              <Text style={styles.tipText}>Use specific terms people might search for</Text>
            </View>
            <View style={styles.tipItem}>
              <FontAwesome name="check-circle" size={16} color={theme.colors.status.success} />
              <Text style={styles.tipText}>Include car brands, models, or event names</Text>
            </View>
            <View style={styles.tipItem}>
              <FontAwesome name="check-circle" size={16} color={theme.colors.status.success} />
              <Text style={styles.tipText}>Add location tags for local discovery</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default TagsStep; 