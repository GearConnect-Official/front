import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Animated,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import styles from "../../styles/screens/friendRequestItemStyles";

interface FriendRequestItemProps {
  name: string;
  mutualFriends?: number;
  onAccept: () => void;
  onDecline: () => void;
}

const FriendRequestItem: React.FC<FriendRequestItemProps> = ({
  name,
  mutualFriends,
  onAccept,
  onDecline,
}) => {
  const scaleValue = new Animated.Value(1);

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ scale: scaleValue }],
        },
      ]}
    >
      <TouchableOpacity
        style={styles.content}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.7}
      >
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: "https://via.placeholder.com/50" }}
            style={styles.avatar}
          />
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{name}</Text>
          {mutualFriends !== undefined && (
            <Text style={styles.mutualFriends}>
              {mutualFriends} mutual friends
            </Text>
          )}
        </View>
      </TouchableOpacity>
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.acceptButton]}
          onPress={onAccept}
        >
          <FontAwesome name="check" size={16} color="#FFFFFF" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.declineButton]}
          onPress={onDecline}
        >
          <FontAwesome name="times" size={16} color="#1E232C" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

export default FriendRequestItem;
