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
  const [activeTab, setActiveTab] = useState("Following");
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
              placeholder="Search for jobs"
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
              activeTab === "Following" && styles.activeTab,
            ]}
            onPress={() => setActiveTab("Following")}
          >
            <Text style={styles.tabText}>Following</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === "Suggested" && styles.activeTab,
            ]}
            onPress={() => setActiveTab("Suggested")}
          >
            <Text style={styles.tabText}>Suggested</Text>
          </TouchableOpacity>
        </View>

        {/* People We Follow Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Following</Text>
            <Text style={styles.sectionSubtitle}>
              Job offers from people you follow
            </Text>
          </View>

          {/* Job Items */}
          <View style={styles.jobItem}>
            <View style={styles.emojiContainer}>
              <Text style={styles.emoji}>👤</Text>
            </View>
            <View style={styles.jobInfo}>
              <Text style={styles.jobTitle}>F1 Driver Position</Text>
              <Text style={styles.jobDescription}>Click to learn more</Text>
            </View>
            <Text style={styles.jobType}>F1 Driver Career</Text>
          </View>

          <View style={styles.jobItem}>
            <View style={styles.emojiContainer}>
              <Text style={styles.emoji}>🏢</Text>
            </View>
            <View style={styles.jobInfo}>
              <Text style={styles.jobTitle}>Job Title 2</Text>
              <Text style={styles.jobDescription}>
                Job Description 2
              </Text>
            </View>
            <Text style={styles.jobType}>Additional Info</Text>
          </View>
        </View>

        {/* Suggested Offers Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Suggested</Text>
            <Text style={styles.sectionSubtitle}>
              Recommended job opportunities
            </Text>
          </View>

          <View style={styles.jobItem}>
            <View style={styles.emojiContainer}>
              <Text style={styles.emoji}>🌟</Text>
            </View>
            <View style={styles.jobInfo}>
              <Text style={styles.jobTitle}>Job Title 3</Text>
              <Text style={styles.jobDescription}>
                Job Description 3
              </Text>
            </View>
            <Text style={styles.jobType}>Additional Info</Text>
          </View>

          <View style={styles.jobItem}>
            <View style={styles.emojiContainer}>
              <Text style={styles.emoji}>💼</Text>
            </View>
            <View style={styles.jobInfo}>
              <Text style={styles.jobTitle}>Job Title 4</Text>
              <Text style={styles.jobDescription}>
                Job Description 4
              </Text>
            </View>
            <Text style={styles.jobType}>Additional Info</Text>
          </View>
        </View>

        {/* Create Job Button */}
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => navigation.navigate("CreateJobOffer" as never)}
        >
          <Text style={styles.createButtonText}>Create Job Offer</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default JobsScreen;
