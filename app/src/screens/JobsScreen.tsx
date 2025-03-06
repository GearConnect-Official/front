import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import styles from "../styles/jobsStyles";
import JobItem from "../components/JobItem";
import { RootStackParamList } from "@/app/App";
import { NavigationProp } from "@react-navigation/native";
import { useNavigation } from "expo-router";

const JobsScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState("suggested");
  const [searchQuery, setSearchQuery] = useState("");
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

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
    { key: "followed", label: "Jobs from followed", icon: "users" },
    { key: "suggested", label: "Suggested jobs", icon: "star" },
    { key: "applied", label: "Applied jobs", icon: "history" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <View style={styles.topBarContent}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <FontAwesome name="arrow-left" size={24} color="#1E232C" />
          </TouchableOpacity>
          <Text style={styles.topBarTitle}>Jobs</Text>
          <TouchableOpacity>
            <FontAwesome name="bell" size={24} color="#1E232C" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView>
        <View style={styles.searchSection}>
          <View style={styles.searchBar}>
            <TextInput
              style={styles.searchInput}
              placeholder="Enter name to search for event"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <TouchableOpacity style={styles.searchButton}>
              <FontAwesome name="search" size={20} color="white" />
            </TouchableOpacity>
          </View>
          <Text style={styles.searchInfo}>Type at least 3 characters</Text>
        </View>

        <View style={styles.tabGroup}>
          {tabs.map((tab: TabItem) => (
            <TouchableOpacity
              key={tab.key}
              onPress={() => setActiveTab(tab.key)}
              style={[
                styles.tab,
                activeTab === tab.key ? styles.activeTab : {},
              ]}
            >
              <FontAwesome
                name={tab.icon}
                size={20}
                color={activeTab === tab.key ? "#FFFFFF" : "#1E232C"}
                style={styles.tabIcon}
              />
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab.key ? styles.activeTabText : {},
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View>
          <Text style={styles.sectionTitle}>
            {activeTab === "followed" && "Jobs from Followed"}
            {activeTab === "suggested" && "Suggested Jobs"}
            {activeTab === "applied" && "Applied Jobs"}
          </Text>
          {jobsData[activeTab as keyof typeof jobsData].map((job, index) => (
            <JobItem
              key={index}
              icon={job.icon}
              title={job.title}
              subtitle={job.subtitle}
              type={job.type}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default JobsScreen;
