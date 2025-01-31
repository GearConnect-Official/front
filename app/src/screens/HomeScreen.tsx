import React, { useState } from "react";
import { View, TextInput, Image, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Post from "../components/Post";

const MOCK_POSTS = [
  {
    id: "1",
    user: {
      name: "Benjamin Tisserand",
      avatar:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/59578035b2529a8b6527913374e8ea84a83d97f531c0c7dc081d7e0011ac79fc?placeholderIfAbsent=true&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/59578035b2529a8b6527913374e8ea84a83d97f531c0c7dc081d7e0011ac79fc?placeholderIfAbsent=true&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/59578035b2529a8b6527913374e8ea84a83d97f531c0c7dc081d7e0011ac79fc?placeholderIfAbsent=true&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/59578035b2529a8b6527913374e8ea84a83d97f531c0c7dc081d7e0011ac79fc?placeholderIfAbsent=true&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/59578035b2529a8b6527913374e8ea84a83d97f531c0c7dc081d7e0011ac79fc?placeholderIfAbsent=true&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/59578035b2529a8b6527913374e8ea84a83d97f531c0c7dc081d7e0011ac79fc?placeholderIfAbsent=true&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/59578035b2529a8b6527913374e8ea84a83d97f531c0c7dc081d7e0011ac79fc?placeholderIfAbsent=true&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/59578035b2529a8b6527913374e8ea84a83d97f531c0c7dc081d7e0011ac79fc?placeholderIfAbsent=true",
      location: "Val de Vienne, France",
      timeAgo: "2 hours ago",
    },
    content: {
      text: "Pole position and Winner of Open Circuit Debutant Val de Vienne !!! 🏁🥇🔛🔝",
      image:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/30264f1652771c8cd0e2b3807c3b5672ecc12d3e9a755488f02bc94b317b63a0?placeholderIfAbsent=true&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/30264f1652771c8cd0e2b3807c3b5672ecc12d3e9a755488f02bc94b317b63a0?placeholderIfAbsent=true&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/30264f1652771c8cd0e2b3807c3b5672ecc12d3e9a755488f02bc94b317b63a0?placeholderIfAbsent=true&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/30264f1652771c8cd0e2b3807c3b5672ecc12d3e9a755488f02bc94b317b63a0?placeholderIfAbsent=true&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/30264f1652771c8cd0e2b3807c3b5672ecc12d3e9a755488f02bc94b317b63a0?placeholderIfAbsent=true&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/30264f1652771c8cd0e2b3807c3b5672ecc12d3e9a755488f02bc94b317b63a0?placeholderIfAbsent=true&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/30264f1652771c8cd0e2b3807c3b5672ecc12d3e9a755488f02bc94b317b63a0?placeholderIfAbsent=true&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/30264f1652771c8cd0e2b3807c3b5672ecc12d3e9a755488f02bc94b317b63a0?placeholderIfAbsent=true",
      hashtags: ["kart", "poleposition"],
    },
  },
  {
    id: "2",
    user: {
      name: "Romain JAHIER",
      avatar:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/08fab03da4410e0c912c207be5fcb8d4b98279630642d79a9c97ce869d62bd65?placeholderIfAbsent=true&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/08fab03da4410e0c912c207be5fcb8d4b98279630642d79a9c97ce869d62bd65?placeholderIfAbsent=true&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/08fab03da4410e0c912c207be5fcb8d4b98279630642d79a9c97ce869d62bd65?placeholderIfAbsent=true&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/08fab03da4410e0c912c207be5fcb8d4b98279630642d79a9c97ce869d62bd65?placeholderIfAbsent=true&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/08fab03da4410e0c912c207be5fcb8d4b98279630642d79a9c97ce869d62bd65?placeholderIfAbsent=true&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/08fab03da4410e0c912c207be5fcb8d4b98279630642d79a9c97ce869d62bd65?placeholderIfAbsent=true&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/08fab03da4410e0c912c207be5fcb8d4b98279630642d79a9c97ce869d62bd65?placeholderIfAbsent=true&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/08fab03da4410e0c912c207be5fcb8d4b98279630642d79a9c97ce869d62bd65?placeholderIfAbsent=true",
      location: "Paris, France",
      timeAgo: "2 days",
    },
    content: {
      text: "The Ferraris' pit stop were on fire this week-end 🔥🔥",
      image:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/fe6ee81c77dd4b7f4be2bdec60e98e4cbdeb5388a90a17afadaf28c723d48c5d?placeholderIfAbsent=true&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/fe6ee81c77dd4b7f4be2bdec60e98e4cbdeb5388a90a17afadaf28c723d48c5d?placeholderIfAbsent=true&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/fe6ee81c77dd4b7f4be2bdec60e98e4cbdeb5388a90a17afadaf28c723d48c5d?placeholderIfAbsent=true&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/fe6ee81c77dd4b7f4be2bdec60e98e4cbdeb5388a90a17afadaf28c723d48c5d?placeholderIfAbsent=true&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/fe6ee81c77dd4b7f4be2bdec60e98e4cbdeb5388a90a17afadaf28c723d48c5d?placeholderIfAbsent=true&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/fe6ee81c77dd4b7f4be2bdec60e98e4cbdeb5388a90a17afadaf28c723d48c5d?placeholderIfAbsent=true&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/fe6ee81c77dd4b7f4be2bdec60e98e4cbdeb5388a90a17afadaf28c723d48c5d?placeholderIfAbsent=true&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/fe6ee81c77dd4b7f4be2bdec60e98e4cbdeb5388a90a17afadaf28c723d48c5d?placeholderIfAbsent=true",
      hashtags: ["ferrari", "pitstop"],
    },
  },
];

const HomeScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [searchQuery, setSearchQuery] = useState("");
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
          <Image
            source={{
              uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/f3d67917c6442fafa158ab0bdb706f7194e5a329b13b72692715ec90abbf8ce7?placeholderIfAbsent=true&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/f3d67917c6442fafa158ab0bdb706f7194e5a329b13b72692715ec90abbf8ce7?placeholderIfAbsent=true&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/f3d67917c6442fafa158ab0bdb706f7194e5a329b13b72692715ec90abbf8ce7?placeholderIfAbsent=true&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/f3d67917c6442fafa158ab0bdb706f7194e5a329b13b72692715ec90abbf8ce7?placeholderIfAbsent=true&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/f3d67917c6442fafa158ab0bdb706f7194e5a329b13b72692715ec90abbf8ce7?placeholderIfAbsent=true&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/f3d67917c6442fafa158ab0bdb706f7194e5a329b13b72692715ec90abbf8ce7?placeholderIfAbsent=true&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/f3d67917c6442fafa158ab0bdb706f7194e5a329b13b72692715ec90abbf8ce7?placeholderIfAbsent=true&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/f3d67917c6442fafa158ab0bdb706f7194e5a329b13b72692715ec90abbf8ce7?placeholderIfAbsent=true",
            }}
            style={styles.logo}
          />
        </TouchableOpacity>
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <View style={styles.headerIcons}>
          <Image
            source={{
              uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/49fa5218ed2fe72461d4e2d2164de74d2448a901a3c1f0b5c3960007c22947dc",
            }}
            style={styles.headerIcon}
          />
          <Image
            source={{
              uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/88ef24f9928e7ba186b3a5c5925a6fbafbf915b1a522f10f1c9bc0c3863e49b2",
            }}
            style={styles.headerIcon}
          />
        </View>
      </View>

      <ScrollView style={styles.content}>
        {MOCK_POSTS.map((post) => (
          <Post key={post.id} {...post} />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(251, 248, 249, 1)",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
  },
  logo: {
    width: 67,
    height: 67,
    borderRadius: 33.5,
  },
  searchInput: {
    flex: 1,
    marginHorizontal: 12,
    height: 40,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 6,
    paddingHorizontal: 12,
  },
  headerIcons: {
    flexDirection: "row",
    gap: 8,
  },
  headerIcon: {
    width: 24,
    height: 24,
  },
  content: {
    flex: 1,
    padding: 16,
  },
});

export default HomeScreen;
