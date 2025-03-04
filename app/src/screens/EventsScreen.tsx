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
import styles from "../styles/eventsStyles";
import EventItem from "../components/EventItem";
import { RootStackParamList } from "@/app/App";
import { NavigationProp } from "@react-navigation/native";
import { useNavigation } from "expo-router";

const EventsScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState("recommended");
  const [searchQuery, setSearchQuery] = useState("");
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  interface TabItem {
    key: string;
    label: string;
    icon: keyof typeof FontAwesome.glyphMap;
  }

  const eventsData = {
    followed: [
      {
        icon: "🎤",
        title: "Open circuit Débutant Val de Vienne",
        subtitle: "Category: Open day, Free Entry",
        date: "January 26, 2025",
      },
      {
        icon: "📅",
        title: "Workshop",
        subtitle: "Learn new skills",
        date: "May 20, 2023",
      },
      {
        icon: "🎉",
        title: "Music Concert",
        subtitle: "Live performance",
        date: "June 5, 2023",
      },
    ],
    recommended: [
      {
        icon: "🎭",
        title: "Theatre Play",
        subtitle: "Dramatic performance",
        date: "August 15, 2023",
      },
      {
        icon: "🌟",
        title: "Art Exhibition",
        subtitle: "Local artists' works",
        date: "July 10, 2023",
      },
    ],
    passed: [
      {
        icon: "🏎️",
        title: "Course karting RKC",
        subtitle: "Category : Race, French Championship",
        date: "January 17, 2025",
      },
      {
        icon: "🌟",
        title: "Art Exhibition",
        subtitle: "Local artists' works",
        date: "July 10, 2023",
      },
    ],
  };
  const tabs: TabItem[] = [
    { key: "followed", label: "Events from Followed", icon: "users" },
    { key: "recommended", label: "Recommended Events", icon: "star" },
    { key: "passed", label: "Passed Events", icon: "history" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <View style={styles.topBarContent}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <FontAwesome name="arrow-left" size={24} color="#1E232C" />
          </TouchableOpacity>
          <Text style={styles.title}>Events</Text>
          <View style={styles.topBarIcons}>
            <TouchableOpacity
              onPress={() => navigation.navigate("CreateEvent" as never)}
            >
              <FontAwesome name="plus" size={28} color="#1E232C" />
            </TouchableOpacity>
            <TouchableOpacity>
              <FontAwesome name="bell" size={24} color="#1E232C" />
            </TouchableOpacity>
          </View>
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
            {activeTab === "followed" && "Events from Followed"}
            {activeTab === "recommended" && "Recommended Events"}
            {activeTab === "passed" && "Passed Events"}
          </Text>
          {eventsData[activeTab as keyof typeof eventsData].map(
            (event, index) => (
              <EventItem
                key={index}
                icon={event.icon}
                title={event.title}
                subtitle={event.subtitle}
                date={event.date}
              />
            )
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EventsScreen;
