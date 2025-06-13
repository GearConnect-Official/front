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
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import userService from "../services/userService";
import styles from "../styles/Profile/editProfileStyles";
import * as ImagePicker from "expo-image-picker";
import { FontAwesome } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";

const EditProfileScreen: React.FC = () => {
  const router = useRouter();
  const { user, updateUser } = useAuth() || {};
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    username: "",
    name: "",
    description: "",
  });

  useEffect(() => {
    if (!user?.id) {
      Alert.alert("Error", "You must be logged in to edit your profile", [
        { text: "OK", onPress: () => router.back() },
      ]);
      return;
    }
    loadUserProfile();
  }, [user?.id]);

  const loadUserProfile = async () => {
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
        });
      } else {
        setError(response.error || "Failed to load profile data");
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      setError("An unexpected error occurred while loading the profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImagePick = async () => {
    try {
      // Demander la permission d'accéder à la galerie
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Please allow access to your photo library to change your profile picture."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0].uri) {
        setIsLoading(true);
        setError(null);
        const response = await userService.uploadProfilePicture(
          Number(user?.id),
          result.assets[0].uri
        );

        if (response.success && response.data) {
          setFormData((prev) => ({
            ...prev,
            profilePicture: response.data.profilePicture,
          }));
          Alert.alert("Success", "Profile picture updated successfully");
        } else {
          setError(response.error || "Failed to upload profile picture");
          Alert.alert(
            "Error",
            response.error || "Failed to upload profile picture"
          );
        }
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      setError("An unexpected error occurred while picking the image");
      Alert.alert("Error", "Failed to pick image");
    }
  };

  const validateForm = async () => {
    if (!user?.id) {
      setError("You must be logged in to edit your profile");
      return false;
    }

    try {
      // Vérifier si au moins un champ a été modifié
      const response = await userService.getProfile(Number(user.id));
      const currentData =
        response.success && response.data ? response.data : null;

      if (currentData) {
        const hasChanges =
          (formData.username.trim() || "") !== (currentData.username || "") ||
          (formData.name.trim() || "") !== (currentData.name || "") ||
          (formData.description.trim() || "") !==
            (currentData.description || "");

        if (!hasChanges) {
          setIsLoading(false);
          router.back();
          return false;
        }
      }
      return true;
    } catch (error) {
      console.error("Error validating form:", error);
      return true; // En cas d'erreur, on permet la soumission
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
        username: formData.username.trim() || undefined,
        name: formData.name.trim() || undefined,
        description: formData.description.trim() || undefined,
      });

      setIsLoading(false);

      if (updateResponse.success) {
        // Mettre à jour l'utilisateur dans le contexte d'authentification
        if (updateUser) {
          updateUser({
            username: formData.username.trim() || null,
            name: formData.name.trim() || null,
          });
        }

        // Forcer un rafraîchissement des données du profil
        await loadUserProfile();

        Alert.alert(
          "Success",
          updateResponse.message || "Profile updated successfully",
          [
            {
              text: "OK",
              onPress: () => {
                // Retourner à l'écran précédent avec un paramètre pour forcer le rafraîchissement
                router.back();
                router.setParams({ refresh: Date.now().toString() });
              },
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
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView style={styles.scrollView}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Text style={styles.backButtonText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Edit Profile</Text>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSubmit}
              disabled={isLoading}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <View style={styles.form}>
            {/* <TouchableOpacity
              style={styles.profilePictureContainer}
              onPress={handleImagePick}
            >
              {formData.profilePicture ? (
                <Image
                  source={{ uri: formData.profilePicture }}
                  style={styles.profilePicture}
                />
              ) : (
                <View style={styles.profilePicturePlaceholder}>
                  <FontAwesome name="camera" size={24} color="#999" />
                </View>
              )} */}
            <View style={styles.editIconContainer}>
              <FontAwesome name="pencil" size={16} color="#FFF" />
            </View>
            {/* </TouchableOpacity> */}

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
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default EditProfileScreen;
