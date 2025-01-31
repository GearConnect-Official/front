import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import FontAwesome from "react-native-vector-icons/FontAwesome";

const JobsScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("People we follow");
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <View style={styles.topBarContent}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <FontAwesome name="arrow-left" size={24} color="#1E232C" />
          </TouchableOpacity>
          <Text style={styles.topBarTitle}>Job offers</Text>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {/* Search Section */}
        <View style={styles.searchSection}>
          <View style={styles.searchBar}>
            <TextInput
              style={styles.searchInput}
              placeholder="Enter name to search for job"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <TouchableOpacity style={styles.searchButton}>
              <Image
                source={{
                  uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/75fb92fb82e9260abd72c4ed61bb49e6ea1c8833f38a4e010350c3aea8619646",
                }}
                style={styles.searchIcon}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.searchInfo}>Type at least 3 characters</Text>
        </View>

        {/* Tab Group */}
        <View style={styles.tabGroup}>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === "People we follow" && styles.activeTab,
            ]}
            onPress={() => setActiveTab("People we follow")}
          >
            <Text style={styles.tabText}>People we follow</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === "Suggested offers" && styles.activeTab,
            ]}
            onPress={() => setActiveTab("Suggested offers")}
          >
            <Text style={styles.tabText}>Suggested offers</Text>
          </TouchableOpacity>
        </View>

        {/* People We Follow Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>People we follow</Text>
            <Text style={styles.sectionSubtitle}>
              List of job offers from people you follow
            </Text>
          </View>

          {/* Job Items */}
          <View style={styles.jobItem}>
            <View style={styles.emojiContainer}>
              <Text style={styles.emoji}>👤</Text>
            </View>
            <View style={styles.jobInfo}>
              <Text style={styles.jobTitle}>Seul Offre qui marche</Text>
              <Text style={styles.jobDescription}>Cliquez dessus pls</Text>
            </View>
            <Text style={styles.jobType}>Devenir Pilote de F1</Text>
          </View>

          <View style={styles.jobItem}>
            <View style={styles.emojiContainer}>
              <Text style={styles.emoji}>🏢</Text>
            </View>
            <View style={styles.jobInfo}>
              <Text style={styles.jobTitle}>Titre de l'offre 2</Text>
              <Text style={styles.jobDescription}>
                Description de l'offre 2
              </Text>
            </View>
            <Text style={styles.jobType}>Additional data</Text>
          </View>
        </View>

        {/* Suggested Offers Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Suggested offers</Text>
            <Text style={styles.sectionSubtitle}>
              List of recommended job offers
            </Text>
          </View>

          <View style={styles.jobItem}>
            <View style={styles.emojiContainer}>
              <Text style={styles.emoji}>🌟</Text>
            </View>
            <View style={styles.jobInfo}>
              <Text style={styles.jobTitle}>Titre de l'offre 3</Text>
              <Text style={styles.jobDescription}>
                Description de l'offre 3
              </Text>
            </View>
            <Text style={styles.jobType}>Additional data</Text>
          </View>

          <View style={styles.jobItem}>
            <View style={styles.emojiContainer}>
              <Text style={styles.emoji}>💼</Text>
            </View>
            <View style={styles.jobInfo}>
              <Text style={styles.jobTitle}>Titre de l'offre 4</Text>
              <Text style={styles.jobDescription}>
                Description de l'offre 4
              </Text>
            </View>
            <Text style={styles.jobType}>Additional data</Text>
          </View>
        </View>

        {/* Create Job Button */}
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => navigation.navigate("CreateJobOffer")}
        >
          <Text style={styles.createButtonText}>Create a job offer</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(251, 249, 250, 1)",
  },
  topBar: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 3,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  topBarContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  topBarTitle: {
    fontSize: 20,
    fontWeight: "500",
    color: "#000",
  },
  content: {
    flex: 1,
  },
  searchSection: {
    padding: 12,
  },
  searchBar: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
    borderRadius: 6,
    padding: 4,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#000",
    paddingHorizontal: 12,
  },
  searchButton: {
    backgroundColor: "#000",
    borderRadius: 4,
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  searchIcon: {
    width: 20,
    height: 20,
  },
  searchInfo: {
    fontSize: 14,
    color: "rgba(0, 0, 0, 0.5)",
    marginTop: 4,
  },
  tabGroup: {
    flexDirection: "row",
    padding: 12,
    gap: 8,
  },
  tab: {
    flex: 1,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
    borderRadius: 6,
    padding: 8,
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: "rgba(0, 0, 0, 0.05)",
  },
  tabText: {
    fontSize: 14,
    color: "#000",
  },
  section: {
    padding: 12,
  },
  sectionHeader: {
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "500",
    color: "#000",
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "rgba(0, 0, 0, 0.5)",
  },
  jobItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    gap: 8,
  },
  emojiContainer: {
    width: 32,
    height: 32,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  emoji: {
    fontSize: 20,
  },
  jobInfo: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 16,
    color: "#000",
  },
  jobDescription: {
    fontSize: 14,
    color: "rgba(0, 0, 0, 0.5)",
  },
  jobType: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
    width: 90,
    textAlign: "right",
  },
  createButton: {
    backgroundColor: "#000",
    borderRadius: 8,
    margin: 12,
    padding: 10,
    alignItems: "center",
  },
  createButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
});

export default JobsScreen;
