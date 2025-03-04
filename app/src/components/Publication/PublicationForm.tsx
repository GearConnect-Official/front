import React, { useState } from 'react';
import { View, TextInput, Image, Text, ScrollView } from 'react-native';
import styles from '../../styles/publicationStyles';

interface PublicationFormProps {
  imageUri: string;
  username: string;
  userAvatar: string;
  title: string;
  description: string;
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
}

const PublicationForm: React.FC<PublicationFormProps> = ({
  imageUri,
  username,
  userAvatar,
  title,
  description,
  setTitle,
  setDescription
}) => {
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
          />
          <TextInput
            style={styles.descriptionInput}
            placeholder="Write your description..."
            placeholderTextColor="#666"
            value={description}
            onChangeText={setDescription}
            multiline
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default PublicationForm; 