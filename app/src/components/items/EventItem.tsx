import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import eventService from "../../services/eventService";
import { trackEvent } from "../../utils/mixpanelTracking";

interface EventItemProps {
  title: string;
  subtitle: string;
  date: string;
  icon?: string;
  emoji?: string;
  location?: string;
  attendees?: number;
  onPress?: () => void;
  eventId?: number;
  creatorId?: number;
  currentUserId?: number;
  isJoined?: boolean;
  onJoinSuccess?: () => void;
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
  eventId,
  creatorId,
  currentUserId,
  isJoined: initialIsJoined = false,
  onJoinSuccess,
}) => {
  const [isJoined, setIsJoined] = useState(initialIsJoined || (creatorId && currentUserId && creatorId === currentUserId));
  const [isJoining, setIsJoining] = useState(false);

  const handleJoin = async () => {
    if (!eventId || !currentUserId || isJoined || isJoining) {
      return;
    }

    setIsJoining(true);
    try {
      await eventService.joinEvent(eventId, currentUserId);
      setIsJoined(true);
      
      // Track event join
      trackEvent.joined(String(eventId), title);
      
      if (onJoinSuccess) {
        onJoinSuccess();
      }
    } catch (error: any) {
      console.error("Error joining event:", error);
      // On pourrait afficher un message d'erreur ici
    } finally {
      setIsJoining(false);
    }
  };

  // Si c'est le créateur, toujours afficher "Rejoint"
  const showJoined = isJoined || (creatorId && currentUserId && creatorId === currentUserId);

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
        <Text style={itemStyles.titleText} numberOfLines={2}>{title}</Text>
        <Text style={itemStyles.subtitleText} numberOfLines={1}>{subtitle}</Text>
        
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
        
        {showJoined ? (
          <View style={itemStyles.joinedBadge}>
            <FontAwesome name="check-circle" size={14} color="#10b981" />
            <Text style={itemStyles.joinedBadgeText}>Rejoint</Text>
          </View>
        ) : (
          <TouchableOpacity 
            style={[itemStyles.joinButton, isJoining && itemStyles.joinButtonDisabled]} 
            onPress={handleJoin}
            disabled={isJoining || !eventId || !currentUserId}
          >
            {isJoining ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={itemStyles.joinButtonText}>Join</Text>
            )}
          </TouchableOpacity>
        )}
      </View>

      <View style={itemStyles.shimmer} />
    </TouchableOpacity>
  );
};

const itemStyles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiText: {
    fontSize: 24,
  },
  dateContainer: {
    backgroundColor: '#f0f7ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  dateText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3a86ff',
  },
  contentContainer: {
    padding: 16,
  },
  titleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subtitleText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 6,
  },
  locationText: {
    fontSize: 14,
    color: '#666',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#f5f5f5',
    paddingTop: 12,
  },
  attendeesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  attendeesText: {
    fontSize: 14,
    color: '#666',
  },
  joinButton: {
    backgroundColor: '#3a86ff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  joinButtonDisabled: {
    opacity: 0.6,
  },
  joinButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  joinedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#d1fae5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  joinedBadgeText: {
    color: '#10b981',
    fontWeight: '600',
    fontSize: 14,
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 20,
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    transform: [{ skewX: '-20deg' }],
  }
});

export default EventItem;