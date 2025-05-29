import * as React from "react";
import { View, Text, TextInput, ScrollView } from "react-native";
import { CloudinaryImage, CloudinaryImageUpload } from "../";
import { CloudinaryUploadResponse } from "../../services/cloudinary.service";
import ImageUpload from "./ImageUpload";
import styles from "../../styles/createEventStyles";
import { Event } from "../../services/eventService";

interface MediaInfoProps {
  logo: string;
  logoPublicId?: string;
  images: string[];
  imagePublicIds?: string[];
  description: string;
  onInputChange: (field: keyof Event, value: any) => void;
  onAddImage: (url: string, publicId: string) => void;
  onLogoChange: (url: string, publicId: string) => void;
}

const MediaInfo: React.FC<MediaInfoProps> = ({
  logo,
  logoPublicId,
  images,
  imagePublicIds = [],
  description,
  onInputChange,
  onAddImage,
  onLogoChange,
}) => {
  const handleAdditionalImageUpload = (response: CloudinaryUploadResponse) => {
    onAddImage(response.secure_url, response.public_id);
  };

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
          onImageSelected={onLogoChange}
          folder="events/logos"
          tags={['event', 'logo']}
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
          {images && images.map((imageUrl, index) => {
            const publicId = imagePublicIds[index];
            return publicId ? (
              <CloudinaryImage
                key={index}
                publicId={publicId}
                width={100}
                height={100}
                style={styles.imagePreview}
              />
            ) : (
              <CloudinaryImage
                key={index}
                publicId=""
                fallbackUrl={imageUrl}
                width={100}
                height={100}
                style={styles.imagePreview}
              />
            );
          })}
          
          <CloudinaryImageUpload
            onUploadComplete={handleAdditionalImageUpload}
            folder="events/gallery"
            tags={['event', 'gallery']}
            allowMultiple={false}
            buttonText="+"
            showPreview={false}
            style={styles.addImageButton}
          />
        </ScrollView>
      </View>
    </View>
  );
};

export default MediaInfo; 