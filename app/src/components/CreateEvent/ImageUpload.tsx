import * as React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { FontAwesome } from "@expo/vector-icons";
import styles from "../../styles/createEventStyles";

interface ImageUploadProps {
  title: string;
  buttonText: string;
  onImageSelected?: (uri: string) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  title,
  buttonText,
  onImageSelected,
}) => {
  const [image, setImage] = React.useState<string | null>(null);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;
        setImage(uri);
        onImageSelected?.(uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
    }
  };

  return (
    <View style={styles.imageUploadContainer}>
      <Text style={styles.imageUploadTitle}>{title}</Text>
      <TouchableOpacity style={styles.imageUploadButton} onPress={pickImage}>
        {image ? (
          <Image source={{ uri: image }} style={styles.uploadedImage} />
        ) : (
          <>
            <FontAwesome name="cloud-upload" size={24} color="#1E232C" />
            <Text style={styles.imageUploadButtonText}>{buttonText}</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default ImageUpload;