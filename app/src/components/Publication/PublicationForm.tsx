import React, { useState } from 'react';
import { View, TextInput, Image, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import styles from '../../styles/publicationStyles';

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

  return (
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
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.titleInput}
            placeholder="Add a title..."
            placeholderTextColor="#666"
            value={title}
            onChangeText={setTitle}
            editable={!isLoading}
          />
          <TextInput
            style={styles.descriptionInput}
            placeholder="Write your description..."
            placeholderTextColor="#666"
            value={description}
            onChangeText={setDescription}
            multiline
            editable={!isLoading}
          />

          <View style={styles.tagsContainer}>
            <Text style={styles.tagsLabel}>Tags:</Text>
            <View style={styles.tagsInputContainer}>
              <TextInput
                style={styles.tagInput}
                placeholder="Add tags..."
                placeholderTextColor="#666"
                value={tagInput}
                onChangeText={setTagInput}
                onSubmitEditing={handleAddTag}
                editable={!isLoading}
              />
              <TouchableOpacity 
                style={styles.addTagButton} 
                onPress={handleAddTag}
                disabled={isLoading}
              >
                <Text style={styles.addTagButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
            {tags.length > 0 && (
              <View style={styles.tagsList}>
                {tags.map((tag, index) => (
                  <View key={index} style={styles.tagItem}>
                    <Text style={styles.tagText}>{tag}</Text>
                    <TouchableOpacity 
                      onPress={() => handleRemoveTag(index)}
                      disabled={isLoading}
                    >
                      <Text style={styles.removeTagButton}>×</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>

        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text style={styles.loadingText}>Posting...</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default PublicationForm; 