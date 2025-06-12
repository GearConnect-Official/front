import * as React from "react";
import { View, ScrollView } from "react-native";
import TopBar from "../components/CreateEvent/TopBar";
import CreateEventForm from "../components/CreateEventForm";
import styles from "../styles/screens/createEventStyles";
import { useRouter } from "expo-router";
import { useScreenTracking } from "../hooks/useAnalytics";

const CreateEventScreen: React.FC = () => {
  const router = useRouter();

  // Automatic screen tracking
  useScreenTracking('CreateEventScreen', { 
    feature: 'event_creation',
    step: 'initial_view'
  });

  const handleCancel = () => {
    router.back();
  };

  const handleSuccess = () => {
    router.back(); // Naviguer après succès
  };

  return (
    <View style={styles.container}>
      <TopBar title="Create Event" onBackPress={handleCancel} />
      <ScrollView style={styles.contentContainer}>
        <CreateEventForm onCancel={handleCancel} onSuccess={handleSuccess} />
        <View style={styles.spacer} />
      </ScrollView>
    </View>
  );
};

export default CreateEventScreen;
