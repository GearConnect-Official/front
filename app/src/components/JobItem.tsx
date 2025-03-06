import React from "react";
import { View, Text } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import styles from "../styles/jobsStyles";

interface JobItemProps {
  icon: keyof typeof FontAwesome.glyphMap;
  title: string;
  subtitle: string;
  type: string;
}

const JobItem: React.FC<JobItemProps> = ({ icon, title, subtitle, type }) => {
  return (
    <View style={styles.jobItem}>
      <View style={styles.jobIconContainer}>
        <FontAwesome name={icon} size={24} color="#1E232C" />
      </View>
      <View style={styles.jobContent}>
        <Text style={styles.jobTitle}>{title}</Text>
        <Text style={styles.jobSubtitle}>{subtitle}</Text>
      </View>
      <Text style={styles.jobType}>{type}</Text>
    </View>
  );
};

export default JobItem;
