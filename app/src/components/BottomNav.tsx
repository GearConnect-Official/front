import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import FontAwesome from "react-native-vector-icons/FontAwesome";

const BottomNav: React.FC<BottomTabBarProps> = ({ navigation, state }) => {
  // Check: Ensure that `state` is defined before accessing `state.index`
  if (!state) {
    return null;
  }

  const routes = ["Home", "Network", "Publication", "Events", "Jobs"];

  return (
    <View style={styles.container}>
      {routes.map((route, index) => (
        <TouchableOpacity
          key={route}
          style={styles.tab}
          onPress={() => navigation.navigate(route)}
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

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "rgba(0, 0, 0, 0.1)",
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
  tabText: {
    fontSize: 12,
    marginTop: 4,
    color: "#6A707C",
  },
  activeTabText: {
    color: "#000",
    fontWeight: "bold",
  },
});

export default BottomNav;
