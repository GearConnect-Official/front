import * as React from "react";
import { View, Text, TextInput, ScrollView, Image } from "react-native";
import ImageUpload from "./ImageUpload";
import styles from "../../styles/createEventStyles";
import { Event } from "../../services/eventService";

interface MediaInfoProps {
  logo: string;
  images: string[];
  description: string;
  onInputChange: (field: keyof Event, value: any) => void;
  onAddImage: (uri: string) => void;
}

const MediaInfo: React.FC<MediaInfoProps> = ({
  logo,
  images,
  description,
  onInputChange,
  onAddImage,
}) => {
  return (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Media & Description</Text>
      <Text style={styles.stepDescription}>
        Add visuals to attract more participants
      </Text>

      <View style={styles.mediaSection}>
        <ImageUpload
          title="Event Logo"
          buttonText="Upload"
          onImageSelected={(uri) => onInputChange("logo", uri)}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Event Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Describe your event in detail..."
          value={description}
          onChangeText={(text) => onInputChange("description", text)}
          multiline
          numberOfLines={5}
          textAlignVertical="top"
        />
      </View>

      <View style={styles.mediaSection}>
        <Text style={styles.label}>Additional Photos</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.imagesRow}
        >
          {images && images.map((img, index) => (
            <Image 
              key={index} 
              source={{ uri: img }} 
              style={styles.imagePreview} 
            />
          ))}
          <ImageUpload
            title="+"
            buttonText=""
            onImageSelected={onAddImage}
          />
        </ScrollView>
      </View>
    </View>
  );
};

export default MediaInfo; 