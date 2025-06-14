import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  Image,
  StatusBar,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import userService from "../services/userService";
import styles from "../styles/Profile/editProfileStyles";
import * as ImagePicker from "expo-image-picker";
import { FontAwesome } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import ProfilePictureUpload from "../components/Profile/ProfilePictureUpload";

interface FormData {
  username: string;
  name: string;
  description: string;
  profilePicture: string;
  profilePicturePublicId?: string;
}

const EditProfileScreen: React.FC = () => {
  const router = useRouter();
  const { user, updateUser } = useAuth() || {};
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    username: "",
    name: "",
    description: "",
    profilePicture: "",
    profilePicturePublicId: "",
  });

  useEffect(() => {
    if (!user?.id) {
      Alert.alert("Error", "You must be logged in to edit your profile", [
        { text: "OK", onPress: () => router.back() },
      ]);
      return;
    }
    fetchUserProfile();
  }, [user?.id]);

  const fetchUserProfile = async () => {
    if (!user?.id) return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await userService.getProfile(Number(user.id));
      if (response.success && response.data) {
        setFormData({
          username: response.data.username || "",
          name: response.data.name || "",
          description: response.data.description || "",
          profilePicture: response.data.profilePicture || "",
          profilePicturePublicId: response.data.profilePicturePublicId || "",
        });
      } else {
        setError(response.error || "Failed to load profile data");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfilePictureUpload = async (cloudinaryUrl: string, publicId: string) => {
    try {
      setError(null);
      console.log('🔄 EditProfileScreen: Updating profile picture...', {
        cloudinaryUrl,
        publicId,
        userId: user?.id
      });

      const response = await userService.updateProfilePictureCloudinary(
        Number(user?.id),
        cloudinaryUrl,
        publicId
      );

      console.log('📸 EditProfileScreen: Profile picture update response:', response);

      if (response.success && response.data) {
        // Mettre à jour le formData local
        setFormData((prev) => ({
          ...prev,
          profilePicture: cloudinaryUrl,
          profilePicturePublicId: publicId,
        }));

        // Mettre à jour le contexte d'authentification si disponible
        if (updateUser) {
          updateUser({
            ...user,
            profilePicture: cloudinaryUrl,
            profilePicturePublicId: publicId,
          });
        }

        // Rafraîchir les données du profil depuis le serveur
        await fetchUserProfile();

        console.log('✅ EditProfileScreen: Profile picture updated successfully');
      } else {
        console.error('❌ EditProfileScreen: Failed to update profile picture:', response.error);
        setError(response.error || "Failed to update profile picture");
      }
    } catch (error: any) {
      console.error("❌ EditProfileScreen: Error updating profile picture:", error);
      setError("An unexpected error occurred while updating profile picture");
    }
  };

  const handleProfilePictureError = (error: string) => {
    setError(error);
  };

  const validateForm = async () => {
    if (!user?.id) {
      setError("You must be logged in to edit your profile");
      return false;
    }

    try {
      const response = await userService.getProfile(Number(user.id));
      const currentData =
        response.success && response.data ? response.data : null;

      if (currentData) {
        const hasChanges =
          formData.username !== (currentData.username || "") ||
          formData.name !== (currentData.name || "") ||
          formData.description !== (currentData.description || "");

        if (!hasChanges) {
          setIsLoading(false);
          router.back();
          return false;
        }
      }
      return true;
    } catch (error) {
      console.error("Error validating form:", error);
      return true;
    }
  };

  const handleSubmit = async () => {
    if (!user?.id) {
      setError("You must be logged in to edit your profile");
      return;
    }

    setIsLoading(true);
    setError(null);

    if (!validateForm()) {
      return;
    }

    try {
      const updateResponse = await userService.updateProfile(Number(user.id), {
        username: formData.username || undefined,
        name: formData.name || undefined,
        description: formData.description || undefined,
      });

      setIsLoading(false);

      if (updateResponse.success) {
        if (updateUser) {
          updateUser({
            username: formData.username || null,
            name: formData.name || null,
          });
        }

        await fetchUserProfile();

        Alert.alert(
          "Success",
          updateResponse.message || "Profile updated successfully",
          [
            {
              text: "OK",
            },
          ]
        );
      } else {
        setError(updateResponse.error || "Failed to update profile");
        Alert.alert(
          "Error",
          updateResponse.error || "Failed to update profile"
        );
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error updating profile:", error);
      setError("An unexpected error occurred while updating the profile");
      Alert.alert("Error", "Failed to update profile");
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E10600" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFFFFF"
        translucent={false}
      />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Edit Profile</Text>
        <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <ScrollView style={styles.scrollView}>
        <View style={styles.form}>
          <ProfilePictureUpload
            currentProfilePicture={formData.profilePicture}
            currentPublicId={formData.profilePicturePublicId}
            onUploadComplete={handleProfilePictureUpload}
            onUploadError={handleProfilePictureError}
            userId={Number(user?.id)}
            size={120}
          />

          <View style={styles.formSection}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={styles.input}
              value={formData.username}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, username: text }))
              }
              placeholder="Enter your username"
            />

            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, name: text }))
              }
              placeholder="Enter your name"
            />

            <Text style={styles.label}>Bio</Text>
            <TextInput
              style={[styles.input, styles.bioInput]}
              value={formData.description}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, description: text }))
              }
              placeholder="Write something about yourself"
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditProfileScreen;
