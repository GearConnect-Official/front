import * as React from "react";
import { View, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import TopBar from "../components/CreateEvent/TopBar";
import CreateEvent from "../components/CreateEvent";
import styles from "../styles/createEventStyles";

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
      <TopBar title="Create Event" onBackPress={handleCancel} />
      <ScrollView style={styles.contentContainer}>
        <CreateEvent onCancel={handleCancel} onSuccess={handleSuccess} />
        <View style={styles.spacer} />
      </ScrollView>
    </View>
  );
};

export default CreateEventScreen;
