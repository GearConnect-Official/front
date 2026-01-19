import * as React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { createEventStyles as styles } from "../../styles/screens";
import { router } from "expo-router";

interface TopBarProps {
  title: string;
  onBackPress?: () => void;
  showDeleteButton?: boolean;
  onDeletePress?: () => void;
}

const TopBar: React.FC<TopBarProps> = ({
  title,
  onBackPress,
  showDeleteButton,
  onDeletePress,
}) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <FontAwesome name="arrow-left" size={20} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create an Event</Text>
        <View style={styles.placeholderRight} />
      </View>
    </SafeAreaView>
  );
};

export default TopBar;
