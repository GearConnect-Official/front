import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import styles from "../styles/eventsStyles";

interface EventItemProps {
  title: string;
  subtitle: string;
  date: string;
  icon?: string;
  emoji?: string;
  onPress: () => void; // Add onPress prop
}

const EventItem: React.FC<EventItemProps> = ({
  title,
  subtitle,
  date,
  icon,
  emoji,
  onPress, // Destructure onPress prop
}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.eventItem}>
      {icon ? (
        <Image source={{ uri: icon }} style={styles.eventIcon} />
      ) : emoji ? (
        <View style={styles.emojiContainer}>
          <Text style={styles.emojiText}>{emoji}</Text>
        </View>
      ) : null}

      <View style={styles.eventContent}>
        <Text style={styles.eventTitle}>{title}</Text>
        <Text style={styles.eventSubtitle}>{subtitle}</Text>
      </View>

      <Text style={styles.eventDate}>{date}</Text>
    </TouchableOpacity>
  );
};

export default EventItem;