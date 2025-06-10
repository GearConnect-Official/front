import * as React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import styles from "../../styles/screens/createEventStyles";

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
    <View style={styles.topBar}>
      <View style={styles.titleBar}>
        <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={24} color="#1E232C" />
        </TouchableOpacity>
        <Text style={styles.title}>{title}</Text>
        {showDeleteButton && (
          <TouchableOpacity onPress={onDeletePress} style={styles.deleteButton}>
            <FontAwesome name="trash" size={24} color="#e74c3c" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default TopBar;