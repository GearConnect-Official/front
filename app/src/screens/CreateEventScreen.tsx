import * as React from "react";
import { View, ScrollView } from "react-native";
import TopBar from "../components/CreateEvent/TopBar";
import CreateEventForm from "../components/CreateEventForm";
import { createEventStyles as styles } from "../styles/screens";
import { useRouter } from "expo-router";

const CreateEventScreen: React.FC = () => {
  const router = useRouter();

  const handleCancel = () => {
    router.back();
  };

  const handleSuccess = () => {
    router.back(); // Naviguer après succès
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.contentContainer}>
        <CreateEventForm onCancel={handleCancel} onSuccess={handleSuccess} />
        <View style={styles.spacer} />
      </ScrollView>
    </View>
  );
};

export default CreateEventScreen;
