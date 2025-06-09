import * as React from "react";
import { View, ScrollView, ActivityIndicator } from "react-native";
import TopBar from "../components/CreateEvent/TopBar";
import CreateEvent from "../components/CreateEvent";
import styles from "../styles/createEventStyles";
import { useRouter, useLocalSearchParams } from "expo-router";
import eventService from "../services/eventService";

const EditEventScreen: React.FC = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = React.useState(true);
  const [eventData, setEventData] = React.useState(null);

  React.useEffect(() => {
    const fetchEvent = async () => {
      try {
        if (id) {
          const event = await eventService.getEventById(id.toString());
          setEventData(event);
        }
      } catch (error) {
        console.error("Failed to fetch event:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleCancel = () => {
    router.back();
  };

  const handleSuccess = () => {
    router.back(); // Navigate back after successful update
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#3a86ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TopBar title="Edit Event" onBackPress={handleCancel} />
      <ScrollView style={styles.contentContainer}>
        <CreateEvent 
          onCancel={handleCancel} 
          onSuccess={handleSuccess} 
          isEditing={true}
          initialData={eventData}
          eventId={id?.toString()}
        />
        <View style={styles.spacer} />
      </ScrollView>
    </View>
  );
};

export default EditEventScreen;