import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import styles from "../styles/bottomNavStyles";

const BottomNav: React.FC<BottomTabBarProps> = ({ navigation, state }) => {
  // Check: Ensure that `state` is defined before accessing `state.index`
  if (!state) {
    return null;
  }

  const routes = ["Home", "Network", "Publication", "Events", "Jobs"];

  const handleNavigation = (route: string) => {
    if (route === "Publication") {
      navigation.navigate("PublicationScreen");
    } else {
      navigation.navigate(route);
    }
  };

  return (
    <View style={styles.container}>
      {routes.map((route, index) => (
        <TouchableOpacity
          key={route}
          style={styles.tab}
          onPress={() => handleNavigation(route)}
        >
          <FontAwesome
            name={getIconName(route)}
            size={24}
            color={state.index === index ? "#000" : "#6A707C"}
          />
          <Text
            style={[
              styles.tabText,
              state.index === index && styles.activeTabText,
            ]}
          >
            {route}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

// Function to associate icons with pages
const getIconName = (routeName: string) => {
  switch (routeName) {
    case "Home":
      return "home";
    case "Network":
      return "users";
    case "Publication":
      return "plus-square";
    case "Events":
      return "calendar";
    case "Jobs":
      return "briefcase";
    default:
      return "circle";
  }
};

export default BottomNav;
