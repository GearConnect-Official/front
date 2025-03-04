import * as React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import styles from "../../styles/createEventStyles";

interface ImageUploadProps {
  title: string;
  buttonText: string;
  onUpload?: () => void;
  imageUri?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  title,
  buttonText,
  onUpload,
  imageUri,
}) => {
  const handleUploadPress = () => {
    if (onUpload) {
      onUpload();
    } else {
      console.log("Upload pressed");
      // Default image picker logic could go here
    }
  };

  return (
    <View style={styles.imageUploadContainer}>
      <View style={styles.imageUploadHeader}>
        <Text style={styles.imageUploadTitle}>{title}</Text>
        <TouchableOpacity
          onPress={handleUploadPress}
          style={styles.uploadButton}
        >
          <Text style={styles.uploadButtonText}>{buttonText}</Text>
        </TouchableOpacity>
      </View>

      {imageUri && (
        <Image
          source={{ uri: imageUri }}
          style={styles.uploadedImage}
          resizeMode="cover"
        />
      )}
    </View>
  );
};

export default ImageUpload;