import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import styles from "../styles/friendRequestStyles";

interface FriendRequestItemProps {
  name: string;
  emoji: string;
  isRequest?: boolean;
  onAction: () => void;
}

const FriendRequestItem: React.FC<FriendRequestItemProps> = ({
  name,
  emoji,
  isRequest = false,
  onAction,
}) => {
  return (
    <View style={styles.itemContainer}>
      <View style={styles.avatarContainer}>
        <Text style={styles.avatarText}>{emoji}</Text>
      </View>
      <View style={styles.nameContainer}>
        <Text style={styles.name}>{name}</Text>
      </View>
      <TouchableOpacity style={styles.actionButton} onPress={onAction}>
        <Text style={styles.actionButtonText}>
          {isRequest ? "Accept" : "Add"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default FriendRequestItem;
