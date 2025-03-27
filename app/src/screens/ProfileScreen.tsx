import React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import styles from "../styles/profileStyles";
import { useNavigation } from "@react-navigation/native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import * as DocumentPicker from "expo-document-picker";

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation();

  const handleUploadCV = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
      });
      if (result.canceled) {
        console.log("Upload cancelled");
      } else if (result.assets && result.assets.length > 0) {
        console.log("Uploaded file URI:", result.assets[0].uri);
      }
    } catch (error) {
      console.log("Error picking document:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <View style={styles.topBarContent}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <FontAwesome name="arrow-left" size={24} color="#1E232C" />
          </TouchableOpacity>
          <Text style={styles.topBarTitle}>User profile</Text>
          <TouchableOpacity>
            <FontAwesome name="bell" size={24} color="#1E232C" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>Esteban Dardillac</Text>
              <Text style={styles.profileRole}>Driver in f3</Text>
              <Text style={styles.profileChampionship}>
                Karting Fr championship
              </Text>
            </View>
            <Image
              source={{
                uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/1700bd4f8231f8853f0a5973513a1c8fbd6fb0764f71cc78d7743b4bd71c79ee",
              }}
              style={styles.profileAvatar}
            />
          </View>
        </View>

        <View style={styles.tabGroup}>
          <TouchableOpacity style={styles.tab}>
            <FontAwesome name="users" size={24} color="#1E232C" />
            <Text style={styles.tabText}>FriendList</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab}>
            <FontAwesome name="briefcase" size={24} color="#1E232C" />
            <Text style={styles.tabText}>Experience</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab}>
            <FontAwesome name="calendar" size={24} color="#1E232C" />
            <Text style={styles.tabText}>My Events</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab}>
            <FontAwesome name="trophy" size={24} color="#1E232C" />
            <Text style={styles.tabText}>My Results</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pilot</Text>
          <Text style={styles.sectionSubtitle}>
            Software Engineer at ABC Inc.
          </Text>

          <View style={styles.infoItem}>
            <Image
              source={{
                uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/63a7272b9eed65bad6d9ed7ad98ae93c2a47fe496fe72285ff1bb9c4e7a66cb7",
              }}
              style={styles.infoIcon}
            />
            <Text style={styles.infoTitle}>2015 - Present</Text>
            <Text style={styles.infoSubtitle}>Full-time</Text>
          </View>

          <View style={styles.infoItem}>
            <Image
              source={{
                uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/6c8ad329f4c2055e00c9dc01db19466f7d2d34876cc380be7b72f442b41dc284",
              }}
              style={styles.infoIcon}
            />
            <Text style={styles.infoTitle}>Location</Text>
            <Text style={styles.infoSubtitle}>San Francisco, CA</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Events I attended</Text>
            <Image
              source={{
                uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/ee6824f3fe83ab73781604f7b0d311455952afa15f2f220845c45dd3c1074335",
              }}
              style={styles.sectionIcon}
            />
          </View>

          <View style={styles.eventCard}>
            <Image
              source={{
                uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/be16d124c072203f4c7e4964e1c65b26abecafb8b6dff77d49b8076a20a0703f?placeholderIfAbsent=true&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/be16d124c072203f4c7e4964e1c65b26abecafb8b6dff77d49b8076a20a0703f?placeholderIfAbsent=true&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/be16d124c072203f4c7e4964e1c65b26abecafb8b6dff77d49b8076a20a0703f?placeholderIfAbsent=true&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/be16d124c072203f4c7e4964e1c65b26abecafb8b6dff77d49b8076a20a0703f?placeholderIfAbsent=true&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/be16d124c072203f4c7e4964e1c65b26abecafb8b6dff77d49b8076a20a0703f?placeholderIfAbsent=true&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/be16d124c072203f4c7e4964e1c65b26abecafb8b6dff77d49b8076a20a0703f?placeholderIfAbsent=true&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/be16d124c072203f4c7e4964e1c65b26abecafb8b6dff77d49b8076a20a0703f?placeholderIfAbsent=true&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/be16d124c072203f4c7e4964e1c65b26abecafb8b6dff77d49b8076a20a0703f?placeholderIfAbsent=true",
              }}
              style={styles.eventImage}
            />
            <View style={styles.eventInfo}>
              <Text style={styles.eventTitle}>Course Karting RKC</Text>
              <Text style={styles.eventResult}>Victory</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Events I've organized</Text>
          <View style={styles.eventCard}>
            <Image
              source={{
                uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/59769d4a5ce342f7171b3d99e95d2ab9ee8b2590995a3882c02db3205cf60a92?placeholderIfAbsent=true&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/59769d4a5ce342f7171b3d99e95d2ab9ee8b2590995a3882c02db3205cf60a92?placeholderIfAbsent=true&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/59769d4a5ce342f7171b3d99e95d2ab9ee8b2590995a3882c02db3205cf60a92?placeholderIfAbsent=true&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/59769d4a5ce342f7171b3d99e95d2ab9ee8b2590995a3882c02db3205cf60a92?placeholderIfAbsent=true&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/59769d4a5ce342f7171b3d99e95d2ab9ee8b2590995a3882c02db3205cf60a92?placeholderIfAbsent=true&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/59769d4a5ce342f7171b3d99e95d2ab9ee8b2590995a3882c02db3205cf60a92?placeholderIfAbsent=true&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/59769d4a5ce342f7171b3d99e95d2ab9ee8b2590995a3882c02db3205cf60a92?placeholderIfAbsent=true&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/59769d4a5ce342f7171b3d99e95d2ab9ee8b2590995a3882c02db3205cf60a92?placeholderIfAbsent=true",
              }}
              style={styles.eventImage}
            />
            <View style={styles.eventInfo}>
              <Text style={styles.eventTitle}>
                Val de Vienne Beginner Open Circuit
              </Text>
              <Text style={styles.eventVenue}>Val de Vienne Circuit</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>CV</Text>
            <FontAwesome name="file-pdf-o" size={24} color="#1E232C" />
          </View>

          <TouchableOpacity
            style={styles.uploadButton}
            onPress={handleUploadCV}
          >
            <FontAwesome name="upload" size={24} color="#FFF" />
            <Text style={styles.uploadButtonText}>Upload Your CV</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;
