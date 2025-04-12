import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import styles from "../styles/jobsStyles";
import JobItem from "../components/JobItem";
import { useRouter } from "expo-router";
import theme from "../styles/config";

// Racing color palette
const RACING_COLORS = {
  primary: '#E10600', // Racing Red
  secondary: '#1E1E1E', // Racing Black
  background: '#FFFFFF',
  textPrimary: '#1E1E1E',
  textSecondary: '#6E6E6E',
  card: '#F8F8F8',
  redLight: '#FF3333',
  redDark: '#CC0000',
};

const JobsScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState("suggested");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  interface TabItem {
    key: string;
    label: string;
    icon: keyof typeof FontAwesome.glyphMap;
  }
  interface Job {
    icon: keyof typeof FontAwesome.glyphMap;
    title: string;
    subtitle: string;
    type: string;
  }

  interface JobsData {
    followed: Job[];
    suggested: Job[];
    applied: Job[];
  }

  const jobsData: JobsData = {
    followed: [
      {
        icon: "microphone",
        title: "Marketing Manager",
        subtitle: "Join our creative team",
        type: "Full-time",
      },
    ],
    suggested: [
      {
        icon: "car",
        title: "Manager",
        subtitle: "Join our creative team",
        type: "Part-time",
      },
      {
        icon: "wrench",
        title: "Race Engineer",
        subtitle: "Ferrari Racing Team",
        type: "Full-time",
      },
      {
        icon: "tachometer",
        title: "Performance Analyst",
        subtitle: "Alpine F1 Team",
        type: "Full-time",
      },
    ],
    applied: [
      {
        icon: "car",
        title: "F1 Driver Position",
        subtitle: "Click to learn more",
        type: "F1 Driver Career",
      },
    ],
  };

  const tabs: TabItem[] = [
    { key: "followed", label: "Following", icon: "users" },
    { key: "suggested", label: "Suggestions", icon: "star" },
    { key: "applied", label: "Applications", icon: "history" },
  ];

  const handleSearch = () => {
    if (searchQuery.length >= 3) {
      setIsLoading(true);
      // Simuler la recherche
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  };

  const handleJobPress = (job: Job) => {
    // Navigation vers le détail du job
    console.log("Job pressed:", job.title);
  };

  const handleCreateJob = () => {
    router.push('/(app)/createJobOffer');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <View style={styles.topBarContent}>
          <TouchableOpacity onPress={() => router.back()}>
            <FontAwesome name="arrow-left" size={24} color="#1E232C" />
          </TouchableOpacity>
          <Text style={styles.title}>Jobs</Text>
          <View style={styles.topBarIcons}>
            <TouchableOpacity
              style={styles.createButton}
              onPress={handleCreateJob}
            >
              <FontAwesome name="plus" size={20} color="#fff" />
              <Text style={styles.createButtonText}>Create</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <FontAwesome name="bell" size={24} color="#1E232C" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView style={localStyles.scrollContent}>
        {/* Search Section */}
        <View style={localStyles.searchSection}>
          <View style={localStyles.searchBar}>
            <FontAwesome name="search" size={18} color={RACING_COLORS.textSecondary} />
            <TextInput
              style={localStyles.searchInput}
              placeholder="Search for a job or company"
              placeholderTextColor={RACING_COLORS.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <FontAwesome name="times-circle" size={18} color={RACING_COLORS.textSecondary} />
              </TouchableOpacity>
            )}
          </View>
          {searchQuery.length > 0 && searchQuery.length < 3 && (
            <Text style={localStyles.searchInfo}>Enter at least 3 characters</Text>
          )}
        </View>

        {/* Tabs Section */}
        <View style={localStyles.tabGroup}>
          {tabs.map((tab: TabItem) => (
            <TouchableOpacity
              key={tab.key}
              onPress={() => setActiveTab(tab.key)}
              style={[
                localStyles.tab,
                activeTab === tab.key ? localStyles.activeTab : {},
              ]}
            >
              <FontAwesome
                name={tab.icon}
                size={18}
                color={activeTab === tab.key ? "#FFFFFF" : RACING_COLORS.textPrimary}
                style={localStyles.tabIcon}
              />
              <Text
                style={[
                  localStyles.tabText,
                  activeTab === tab.key ? localStyles.activeTabText : {},
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Jobs List Section */}
        <View style={localStyles.jobsSection}>
          <View style={localStyles.sectionHeader}>
            <Text style={localStyles.sectionTitle}>
              {activeTab === "followed" && "Followed Jobs"}
              {activeTab === "suggested" && "Job Suggestions"}
              {activeTab === "applied" && "Submitted Applications"}
            </Text>
            <Text style={localStyles.jobCount}>
              {jobsData[activeTab as keyof typeof jobsData].length} results
            </Text>
          </View>

          {isLoading ? (
            <View style={localStyles.loadingContainer}>
              <ActivityIndicator size="large" color={RACING_COLORS.primary} />
              <Text style={localStyles.loadingText}>Searching...</Text>
            </View>
          ) : jobsData[activeTab as keyof typeof jobsData].length === 0 ? (
            <View style={localStyles.emptyContainer}>
              <FontAwesome name="search" size={50} color={RACING_COLORS.textSecondary} />
              <Text style={localStyles.emptyText}>No jobs found</Text>
              <Text style={localStyles.emptySubtext}>
                Try modifying your search criteria
              </Text>
            </View>
          ) : (
            jobsData[activeTab as keyof typeof jobsData].map((job, index) => (
              <JobItem
                key={index}
                icon={job.icon}
                title={job.title}
                subtitle={job.subtitle}
                type={job.type}
                onPress={() => handleJobPress(job)}
              />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  scrollContent: {
    flex: 1,
  },
  topBar: {
    backgroundColor: RACING_COLORS.secondary,
    paddingVertical: 12,
  },
  topBarContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topBarTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: RACING_COLORS.background,
  },
  searchSection: {
    padding: 16,
    backgroundColor: RACING_COLORS.background,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    marginBottom: 16,
    shadowColor: RACING_COLORS.secondary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 45,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 15,
    color: RACING_COLORS.textPrimary,
  },
  searchInfo: {
    color: RACING_COLORS.textSecondary,
    fontSize: 12,
    marginTop: 6,
    marginLeft: 4,
  },
  tabGroup: {
    flexDirection: "row",
    backgroundColor: RACING_COLORS.background,
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: "hidden",
    height: 50,
    marginBottom: 16,
    shadowColor: RACING_COLORS.secondary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
  },
  activeTab: {
    backgroundColor: RACING_COLORS.primary,
  },
  tabIcon: {
    marginRight: 6,
  },
  tabText: {
    fontSize: 13,
    fontWeight: "500",
    color: RACING_COLORS.textPrimary,
  },
  activeTabText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  jobsSection: {
    paddingVertical: 8,
    flex: 1,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: RACING_COLORS.textPrimary,
  },
  jobCount: {
    fontSize: 13,
    color: RACING_COLORS.textSecondary,
  },
  loadingContainer: {
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    color: RACING_COLORS.textSecondary,
    marginTop: 12,
    fontSize: 14,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  emptyText: {
    color: RACING_COLORS.textPrimary,
    fontSize: 16,
    fontWeight: "600",
    marginTop: 16,
  },
  emptySubtext: {
    color: RACING_COLORS.textSecondary,
    textAlign: "center",
    fontSize: 14,
    marginTop: 8,
  },
});

export default JobsScreen;
