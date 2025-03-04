import React, { useState } from "react";
import {
  View,
  TextInput,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Post from "../components/Post";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import styles from "../styles/homeStyles";

const MOCK_POSTS = [
  {
    id: "1",
    user: {
      name: "Benjamin Tisserand",
      avatar:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/59578035b2529a8b6527913374e8ea84a83d97f531c0c7dc081d7e0011ac79fc?placeholderIfAbsent=true&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/59578035b2529a8b6527913374e8ea84a83d97f531c0c7dc081d7e0011ac79fc?placeholderIfAbsent=true&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/59578035b2529a8b6527913374e8ea84a83d97f531c0c7dc081d7e0011ac79fc?placeholderIfAbsent=true&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/59578035b2529a8b6527913374e8ea84a83d97f531c0c7dc081d7e0011ac79fc?placeholderIfAbsent=true&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/59578035b2529a8b6527913374e8ea84a83d97f531c0c7dc081d7e0011ac79fc?placeholderIfAbsent=true&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/59578035b2529a8b6527913374e8ea84a83d97f531c0c7dc081d7e0011ac79fc?placeholderIfAbsent=true&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/59578035b2529a8b6527913374e8ea84a83d97f531c0c7dc081d7e0011ac79fc?placeholderIfAbsent=true&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/59578035b2529a8b6527913374e8ea84a83d97f531c0c7dc081d7e0011ac79fc?placeholderIfAbsent=true",
      location: "Val de Vienne Circuit, France",
      timeAgo: "2 hours ago",
    },
    content: {
      text: "Pole position and Winner of Val de Vienne Beginner Open Circuit!!! 🏁🥇🔛🔝",
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
      timeAgo: "2 days ago",
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
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => navigation.navigate("Profile" as never)}
        >
          <Image
            source={{
              uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/f3d67917c6442fafa158ab0bdb706f7194e5a329b13b72692715ec90abbf8ce7?placeholderIfAbsent=true&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/f3d67917c6442fafa158ab0bdb706f7194e5a329b13b72692715ec90abbf8ce7?placeholderIfAbsent=true&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/f3d67917c6442fafa158ab0bdb706f7194e5a329b13b72692715ec90abbf8ce7?placeholderIfAbsent=true&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/f3d67917c6442fafa158ab0bdb706f7194e5a329b13b72692715ec90abbf8ce7?placeholderIfAbsent=true&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/f3d67917c6442fafa158ab0bdb706f7194e5a329b13b72692715ec90abbf8ce7?placeholderIfAbsent=true&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/f3d67917c6442fafa158ab0bdb706f7194e5a329b13b72692715ec90abbf8ce7?placeholderIfAbsent=true&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/f3d67917c6442fafa158ab0bdb706f7194e5a329b13b72692715ec90abbf8ce7?placeholderIfAbsent=true&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/f3d67917c6442fafa158ab0bdb706f7194e5a329b13b72692715ec90abbf8ce7?placeholderIfAbsent=true",
            }}
            style={styles.topBarImg}
          />
        </TouchableOpacity>
        <TextInput
          style={styles.topBarSearchInput}
          placeholder="Search..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <View style={styles.topBarIcons}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <FontAwesome name="bell" size={24} color="#1E232C" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <FontAwesome name="comment" size={24} color="#1E232C" />
          </TouchableOpacity>
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

export default HomeScreen;
