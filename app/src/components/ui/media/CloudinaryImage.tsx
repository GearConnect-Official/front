import React from "react";
import { Image, ImageStyle, View } from "react-native";
import { Video, ResizeMode } from "expo-av";

interface CloudinaryImageProps {
  publicId: string;
  size?: number;
  style?: ImageStyle;
  isVideo?: boolean;
  paused?: boolean;
}

export const CloudinaryAvatar: React.FC<CloudinaryImageProps> = ({
  publicId,
  size = 40,
  style,
  isVideo = false,
  paused = false,
}) => {
  const imageUrl = `https://res.cloudinary.com/${process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_fill,h_${size},w_${size},r_max/${publicId}`;
  const videoUrl = `https://res.cloudinary.com/${process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload/${publicId}`;

  if (isVideo) {
    return (
      <View style={[{ width: size, height: size }, style]}>
        <Video
          source={{ uri: videoUrl }}
          style={{ width: "100%", height: "100%" }}
          resizeMode={ResizeMode.COVER}
          isLooping
          shouldPlay={!paused}
        />
      </View>
    );
  }

  return (
    <Image
      source={{ uri: imageUrl }}
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
        style,
      ]}
    />
  );
};

// Default export to prevent Expo Router warnings
export { default } from '../../../NoRoute';