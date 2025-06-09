import * as React from "react";
import { View, ScrollView } from "react-native";
import TopBar from "../components/CreateEvent/TopBar";
import CreateEvent from "../components/CreateEvent";
import styles from "../styles/screens/createEventStyles";
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
      <TopBar title="Create Event" onBackPress={handleCancel} />
      <ScrollView style={styles.contentContainer}>
        <CreateEvent onCancel={handleCancel} onSuccess={handleSuccess} />
        <View style={styles.spacer} />
      </ScrollView>
    </View>
  );
};

export default CreateEventScreen;
