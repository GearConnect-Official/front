import React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import styles from "../styles/profileStyles";
import { useNavigation } from "@react-navigation/native";
import FontAwesome from "react-native-vector-icons/FontAwesome";

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <View style={styles.topBarContent}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <FontAwesome name="arrow-left" size={24} color="#1E232C" />
          </TouchableOpacity>
          <Text style={styles.topBarTitle}>User profile</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <FontAwesome name="bell" size={24} color="#1E232C" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>Esteban Dardillac</Text>
              <Text style={styles.profileRole}>Driver in f3</Text>
              <Text style={styles.profileChampionship}>
                Karting Fr championship
              </Text>
            </View>
            <Image
              source={{
                uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/1700bd4f8231f8853f0a5973513a1c8fbd6fb0764f71cc78d7743b4bd71c79ee",
              }}
              style={styles.profileAvatar}
            />
          </View>
        </View>

        <View style={styles.tabGroup}>
          <TouchableOpacity style={styles.tab}>
            <Image
              source={{
                uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/dca4c5bba01002d2d65a77915ada12862f517ea66050949c8b8b8d24487bb250",
              }}
              style={styles.tabIcon}
            />
            <Text style={styles.tabText}>FriendList</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab}>
            <Image
              source={{
                uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/77af5aef860e3e7103ab3175c8bf0d426865ecccc3771d02a312fb31dc17eaae",
              }}
              style={styles.tabIcon}
            />
            <Text style={styles.tabText}>Experience</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab}>
            <Image
              source={{
                uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/315acbe16b6c672c56469bfc0dee1ed52c620f2eeda576d7b174cd9ecaf9065c",
              }}
              style={styles.tabIcon}
            />
            <Text style={styles.tabText}>My Events</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab}>
            <Image
              source={{
                uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/9d8a6d559734f34467ff9622156821ff3572dbd873bbee0e410d265aa9a226e0?placeholderIfAbsent=true&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/9d8a6d559734f34467ff9622156821ff3572dbd873bbee0e410d265aa9a226e0?placeholderIfAbsent=true&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/9d8a6d559734f34467ff9622156821ff3572dbd873bbee0e410d265aa9a226e0?placeholderIfAbsent=true&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/9d8a6d559734f34467ff9622156821ff3572dbd873bbee0e410d265aa9a226e0?placeholderIfAbsent=true&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/9d8a6d559734f34467ff9622156821ff3572dbd873bbee0e410d265aa9a226e0?placeholderIfAbsent=true&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/9d8a6d559734f34467ff9622156821ff3572dbd873bbee0e410d265aa9a226e0?placeholderIfAbsent=true&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/9d8a6d559734f34467ff9622156821ff3572dbd873bbee0e410d265aa9a226e0?placeholderIfAbsent=true&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/9d8a6d559734f34467ff9622156821ff3572dbd873bbee0e410d265aa9a226e0?placeholderIfAbsent=true",
              }}
              style={styles.tabIcon}
            />
            <Text style={styles.tabText}>My Results</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pilot</Text>
          <Text style={styles.sectionSubtitle}>
            Software Engineer at ABC Inc.
          </Text>

          <View style={styles.infoItem}>
            <Image
              source={{
                uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/63a7272b9eed65bad6d9ed7ad98ae93c2a47fe496fe72285ff1bb9c4e7a66cb7",
              }}
              style={styles.infoIcon}
            />
            <Text style={styles.infoTitle}>2015 - Present</Text>
            <Text style={styles.infoSubtitle}>Full-time</Text>
          </View>

          <View style={styles.infoItem}>
            <Image
              source={{
                uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/6c8ad329f4c2055e00c9dc01db19466f7d2d34876cc380be7b72f442b41dc284",
              }}
              style={styles.infoIcon}
            />
            <Text style={styles.infoTitle}>Location</Text>
            <Text style={styles.infoSubtitle}>San Francisco, CA</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Events I attended</Text>
            <Image
              source={{
                uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/ee6824f3fe83ab73781604f7b0d311455952afa15f2f220845c45dd3c1074335",
              }}
              style={styles.sectionIcon}
            />
          </View>

          <View style={styles.eventCard}>
            <Image
              source={{
                uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/be16d124c072203f4c7e4964e1c65b26abecafb8b6dff77d49b8076a20a0703f?placeholderIfAbsent=true&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/be16d124c072203f4c7e4964e1c65b26abecafb8b6dff77d49b8076a20a0703f?placeholderIfAbsent=true&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/be16d124c072203f4c7e4964e1c65b26abecafb8b6dff77d49b8076a20a0703f?placeholderIfAbsent=true&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/be16d124c072203f4c7e4964e1c65b26abecafb8b6dff77d49b8076a20a0703f?placeholderIfAbsent=true&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/be16d124c072203f4c7e4964e1c65b26abecafb8b6dff77d49b8076a20a0703f?placeholderIfAbsent=true&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/be16d124c072203f4c7e4964e1c65b26abecafb8b6dff77d49b8076a20a0703f?placeholderIfAbsent=true&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/be16d124c072203f4c7e4964e1c65b26abecafb8b6dff77d49b8076a20a0703f?placeholderIfAbsent=true&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/be16d124c072203f4c7e4964e1c65b26abecafb8b6dff77d49b8076a20a0703f?placeholderIfAbsent=true",
              }}
              style={styles.eventImage}
            />
            <View style={styles.eventInfo}>
              <Text style={styles.eventTitle}>Course Karting RKC</Text>
              <Text style={styles.eventResult}>Victory</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Events I've organized</Text>
          <View style={styles.eventCard}>
            <Image
              source={{
                uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/59769d4a5ce342f7171b3d99e95d2ab9ee8b2590995a3882c02db3205cf60a92?placeholderIfAbsent=true&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/59769d4a5ce342f7171b3d99e95d2ab9ee8b2590995a3882c02db3205cf60a92?placeholderIfAbsent=true&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/59769d4a5ce342f7171b3d99e95d2ab9ee8b2590995a3882c02db3205cf60a92?placeholderIfAbsent=true&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/59769d4a5ce342f7171b3d99e95d2ab9ee8b2590995a3882c02db3205cf60a92?placeholderIfAbsent=true&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/59769d4a5ce342f7171b3d99e95d2ab9ee8b2590995a3882c02db3205cf60a92?placeholderIfAbsent=true&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/59769d4a5ce342f7171b3d99e95d2ab9ee8b2590995a3882c02db3205cf60a92?placeholderIfAbsent=true&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/59769d4a5ce342f7171b3d99e95d2ab9ee8b2590995a3882c02db3205cf60a92?placeholderIfAbsent=true&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/59769d4a5ce342f7171b3d99e95d2ab9ee8b2590995a3882c02db3205cf60a92?placeholderIfAbsent=true",
              }}
              style={styles.eventImage}
            />
            <View style={styles.eventInfo}>
              <Text style={styles.eventTitle}>
                Open circuit Débutant Val de Vienne
              </Text>
              <Text style={styles.eventVenue}>Circuit Val de Vienne</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>CV</Text>
            <Image
              source={{
                uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/15bdba380251bf0ea6f2e242a6d57bc644bbb6c7d984338cda01f102a3174439",
              }}
              style={styles.sectionIcon}
            />
          </View>

          <View style={styles.cvCard}>
            <Text style={styles.cvText}>Add your CV</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;
