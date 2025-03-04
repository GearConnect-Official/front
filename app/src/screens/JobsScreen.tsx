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
import styles from "../styles/jobsStyles";

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
          <TouchableOpacity>
            <FontAwesome name="bell" size={24} color="#1E232C" />
          </TouchableOpacity>
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
              <FontAwesome name="search" size={20} color="white" />
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
          onPress={() => navigation.navigate("CreateJobOffer" as never)}
        >
          <Text style={styles.createButtonText}>Create a job offer</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default JobsScreen;
