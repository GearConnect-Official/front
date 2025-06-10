import * as React from "react";
import { View, ScrollView, ActivityIndicator, Text, TouchableOpacity, Alert } from "react-native";
import TopBar from "../components/CreateEvent/TopBar";
import ModifyEvent from "../components/ModifyEvent";
import styles from "../styles/screens/createEventStyles";
import { styles as editStyles } from "../styles/screens/editEventStyles";
import { useRouter, useLocalSearchParams } from "expo-router";
import eventService from "../services/eventService";
import { API_URL_EVENTS } from "../config";

const EditEventScreen: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const eventId = params.eventId as string;
  
  const [loading, setLoading] = React.useState(true);
  const [eventData, setEventData] = React.useState<any>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [deletingEvent, setDeletingEvent] = React.useState(false);

  React.useEffect(() => {
    const fetchEvent = async () => {
      try {
        if (!eventId) {
          console.error("No eventId provided in URL params");
          setError("No event ID provided");
          setLoading(false);
          return;
        }        // Fetch event data
          try {
          
          const event = await eventService.getEventById(eventId);
          
          if (!event) {
            console.error("Event not found or returned null");
            setError("Event not found");
          } else {
            const processedEventData = {
              ...event,
              // Ensure all fields exist
              name: event.name || "",
              location: event.location || "",
              creators: (typeof event.creators === 'string' ? event.creators : 
                         typeof event.creatorId === 'object' ? event.creatorId.id : 
                         event.creatorId) || "",
              date: event.date ? new Date(event.date) : new Date(),
              sponsors: event.sponsors || "",
              website: event.website || "",
              rankings: event.rankings || "",
              logo: event.logo || "",
              images: event.images || [],
              description: event.description || "",
            };
            
            setEventData(processedEventData);
          }
        } catch (error) {
          // More detailed error logging
          console.error("API request failed:", error);
          
          // Handle axios error response if available
          const axiosError = error as any;
          if (axiosError.response) {
            console.error("Response status:", axiosError.response.status);
            console.error("Response data:", axiosError.response.data);
          }
          
          throw error;
        }
      } catch (err) {
        console.error("Failed to fetch event:", err);
        setError("Failed to load event data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  const handleCancel = () => {
    router.back();
  };

  const handleSuccess = () => {
    router.back(); // Navigate back after successful update
  };
  const handleDeletePress = () => {
    Alert.alert(
      "Delete Event",
      "Are you sure you want to delete this event? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: deleteEvent
        }
      ]
    );
  };
  const deleteEvent = async () => {
    try {
      setDeletingEvent(true);
      await eventService.deleteEvent(eventId);

      Alert.alert(
        "Success",
        "Event deleted successfully",
        [{ text: "OK", onPress: () => router.replace("/(app)/events") }]
      );
    } catch (error) {
      console.error("Error deleting event:", error);
      
      Alert.alert(
        "Error",
        "Failed to delete event. Please try again."
      );
    } finally {
      setDeletingEvent(false);
    }
  };
  if (loading || deletingEvent) {
    return (
      <View style={editStyles.centeredContainer}>
        <ActivityIndicator size="large" color="#3a86ff" />
        <Text style={editStyles.loadingText}>
          {deletingEvent ? "Deleting event..." : "Loading event data..."}
        </Text>
      </View>
    );
  }

  if (error || !eventData) {
    return (
      <View style={editStyles.centeredContainer}>
        <Text style={editStyles.errorText}>{error || "Unable to load event data"}</Text>
        <TouchableOpacity 
          style={editStyles.button} 
          onPress={() => router.back()}
        >
          <Text style={editStyles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <TopBar 
        title="Edit Event" 
        onBackPress={handleCancel} 
        showDeleteButton={true}
        onDeletePress={handleDeletePress}
      />
      <ScrollView style={styles.contentContainer}>
        <ModifyEvent 
          onCancel={handleCancel} 
          onSuccess={handleSuccess}
          eventData={eventData}
          eventId={eventId}
        />
        <View style={styles.spacer} />
      </ScrollView>
    </View>
  );
};

export default EditEventScreen;