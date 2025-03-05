import * as React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import styles from "../../styles/createEventStyles";

interface TopBarProps {
  title: string;
  onBackPress?: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ title, onBackPress }) => {
  return (
    <View style={styles.topBar}>
      <View style={styles.titleBar}>
        <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={24} color="#1E232C" />
        </TouchableOpacity>
        <Text style={styles.title}>{title}</Text>
      </View>
    </View>
  );
};

export default TopBar;