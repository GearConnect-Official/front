import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import eventService from "../../services/eventService";
import { checkMissingEventInfo } from "../../utils/eventMissingInfo";
import { eventItemStyles } from "../../styles/components/items";
import EventTag from "../EventTag";

const itemStyles = eventItemStyles;

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
  onLeaveSuccess?: () => void;
  winner?: {
    userName: string;
    lapTime: string;
  } | null;
  eventDate?: Date | string;
  meteo?: {
    trackCondition?: 'dry' | 'wet' | 'mixed' | 'damp' | 'slippery' | 'drying';
    [key: string]: any;
  };
  finished?: boolean;
  participationTagText?: string;
  participationTagColor?: string;
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
  onLeaveSuccess,
  winner,
  eventDate,
  meteo,
  finished = false,
  participationTagText,
  participationTagColor,
}) => {
  // Vérifier si l'événement est terminé : soit finished = true, soit la date est passée
  const eventDateObj = eventDate ? (typeof eventDate === 'string' ? new Date(eventDate) : eventDate) : null;
  const isDatePassed = eventDateObj ? new Date(eventDateObj) < new Date() : false;
  const isEventFinished = finished === true || isDatePassed;
  
  const [isJoined, setIsJoined] = useState(!isEventFinished && (initialIsJoined || (creatorId && currentUserId && creatorId === currentUserId)));
  const [isJoining, setIsJoining] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  // Vérifier si des infos manquent (seulement pour les organisateurs)
  const isOrganizer = creatorId && currentUserId && creatorId === currentUserId;
  const missingInfo = isOrganizer && eventDate ? checkMissingEventInfo({
    date: typeof eventDate === 'string' ? new Date(eventDate) : eventDate,
    meteo: meteo || {},
  } as any) : null;

  // Synchroniser l'état local avec les props
  useEffect(() => {
    const isOrganizer = creatorId && currentUserId && creatorId === currentUserId;
    // Un événement est "joined" seulement s'il n'est pas terminé
    const eventDateObj = eventDate ? (typeof eventDate === 'string' ? new Date(eventDate) : eventDate) : null;
    const isDatePassed = eventDateObj ? new Date(eventDateObj) < new Date() : false;
    const isEventFinished = finished === true || isDatePassed;
    setIsJoined(!isEventFinished && (initialIsJoined || isOrganizer));
  }, [initialIsJoined, creatorId, currentUserId, finished, eventDate]);

  const handleJoin = async () => {
    // Ne pas permettre de rejoindre un événement terminé
    if (!eventId || !currentUserId || isJoined || isJoining || isEventFinished) {
      return;
    }

    setIsJoining(true);
    try {
      await eventService.joinEvent(eventId, currentUserId);
      setIsJoined(true);
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

  const handleLeave = () => {
    if (!eventId || !currentUserId || !isJoined || isLeaving) {
      return;
    }

    // Ne pas permettre au créateur de quitter son propre événement
    if (creatorId && creatorId === currentUserId) {
      return;
    }

    Alert.alert(
      "Leave Event",
      "Are you sure you want to leave this event?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Leave",
          style: "destructive",
          onPress: async () => {
            setIsLeaving(true);
            try {
              await eventService.leaveEvent(eventId, currentUserId);
              setIsJoined(false);
              if (onLeaveSuccess) {
                onLeaveSuccess();
              }
            } catch (error: any) {
              console.error("Error leaving event:", error);
              Alert.alert("Error", "Failed to leave the event. Please try again.");
            } finally {
              setIsLeaving(false);
            }
          },
        },
      ]
    );
  };

  // Si l'événement est terminé (finished = true OU date passée), toujours afficher "End"
  // Sinon, afficher "Joined" si l'utilisateur a rejoint ou est le créateur
  const showFinished = isEventFinished;
  const showJoined = !showFinished && (isJoined || isOrganizer);

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
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginBottom: 4 }}>
              <Text style={itemStyles.titleText} numberOfLines={2}>{title}</Text>
              {participationTagText && participationTagColor && (
                <EventTag
                  text={participationTagText}
                  color={participationTagColor}
                />
              )}
            </View>
            <Text style={itemStyles.subtitleText} numberOfLines={1}>{subtitle}</Text>
          </View>
          {missingInfo?.hasMissingInfo && (
            <View style={itemStyles.missingInfoBadge}>
              <FontAwesome name="exclamation-triangle" size={14} color="#F59E0B" />
              <Text style={itemStyles.missingInfoText}>{missingInfo.missingCount}</Text>
            </View>
          )}
        </View>
        
        {location && (
          <View style={itemStyles.locationRow}>
            <FontAwesome name="map-marker" size={14} color="#666" />
            <Text style={itemStyles.locationText}>{location}</Text>
          </View>
        )}

        {winner && (
          <View style={itemStyles.winnerContainer}>
            <FontAwesome name="trophy" size={14} color="#FFD700" />
            <Text style={itemStyles.winnerText}>
              Winner: {winner.userName} ({winner.lapTime})
            </Text>
          </View>
        )}

      </View>

      <View style={itemStyles.footer}>
        <View style={itemStyles.attendeesContainer}>
          <FontAwesome name="users" size={14} color="#666" />
          <Text style={itemStyles.attendeesText}>{attendees} participants</Text>
        </View>
        
        {/* Priorité : afficher "End" si l'événement est terminé, sinon "Joined" si rejoint */}
        {isEventFinished ? (
          <View style={itemStyles.finishedBadge}>
            <FontAwesome name="flag-checkered" size={14} color="#E10600" />
            <Text style={itemStyles.finishedBadgeText}>End</Text>
          </View>
        ) : showJoined ? (
          <TouchableOpacity 
            style={itemStyles.joinedBadge}
            onPress={isOrganizer ? undefined : handleLeave}
            disabled={isOrganizer || isLeaving}
          >
            {isLeaving ? (
              <ActivityIndicator size="small" color="#10b981" />
            ) : (
              <>
                <FontAwesome name="check-circle" size={14} color="#10b981" />
                <Text style={itemStyles.joinedBadgeText}>Joined</Text>
              </>
            )}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={[itemStyles.joinButton, isJoining && itemStyles.joinButtonDisabled]} 
            onPress={handleJoin}
            disabled={isJoining || !eventId || !currentUserId || isEventFinished}
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

export default EventItem;