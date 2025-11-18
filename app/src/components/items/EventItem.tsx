import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import theme from "../../styles/config";

interface EventItemProps {
  title: string;
  subtitle: string;
  date: string;
  icon?: string;
  emoji?: string;
  location?: string;
  attendees?: number;
  onPress?: () => void;
}

const EventItem: React.FC<EventItemProps> = ({
  title,
  subtitle,
  date,
  icon,
  emoji,
  location,
  attendees = 0,
  onPress,
}) => {
  return (
    <TouchableOpacity style={itemStyles.container} onPress={onPress}>
      <View style={itemStyles.headerRow}>
        {icon ? (
          <Image source={{ uri: icon }} style={itemStyles.eventIcon} />
        ) : emoji ? (
          <View style={itemStyles.emojiContainer}>
            <Text style={itemStyles.emojiText}>{emoji}</Text>
          </View>
        ) : (
          <View style={itemStyles.emojiContainer}>
            <FontAwesome name="calendar" size={20} color="#666" />
          </View>
        )}

        <View style={itemStyles.dateContainer}>
          <Text style={itemStyles.dateText}>{date}</Text>
        </View>
      </View>

      <View style={itemStyles.contentContainer}>
        <Text style={itemStyles.titleText} numberOfLines={2}>
          {title}
        </Text>
        <Text style={itemStyles.subtitleText} numberOfLines={1}>
          {subtitle}
        </Text>

        {location && (
          <View style={itemStyles.locationRow}>
            <FontAwesome name="map-marker" size={14} color="#666" />
            <Text style={itemStyles.locationText}>{location}</Text>
          </View>
        )}
      </View>

      <View style={itemStyles.footer}>
        <View style={itemStyles.attendeesContainer}>
          <FontAwesome name="users" size={14} color="#666" />
          <Text style={itemStyles.attendeesText}>{attendees} participants</Text>
        </View>

        <TouchableOpacity style={itemStyles.joinButton}>
          <Text style={itemStyles.joinButtonText}>Join</Text>
        </TouchableOpacity>
      </View>

      <View style={itemStyles.shimmer} />
    </TouchableOpacity>
  );
};

const itemStyles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  eventIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  emojiContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
  },
  emojiText: {
    fontSize: 24,
  },
  dateContainer: {
    backgroundColor: "#ffeaea", // redish background
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  dateText: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.primary.main,
  },
  contentContainer: {
    padding: 16,
  },
  titleText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  subtitleText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    gap: 6,
  },
  locationText: {
    fontSize: 14,
    color: "#666",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: "#f5f5f5",
    paddingTop: 12,
  },
  attendeesContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  attendeesText: {
    fontSize: 14,
    color: "#666",
  },
  joinButton: {
    backgroundColor: theme.colors.primary.main,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  joinButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  shimmer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 20,
    height: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    transform: [{ skewX: "-20deg" }],
  },
});

export default EventItem;
