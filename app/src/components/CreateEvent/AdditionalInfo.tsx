import * as React from "react";
import { View, Text, TextInput, Image } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { createEventStyles as styles } from "../../styles/screens";
import { Event } from "../../services/eventService";

interface AdditionalInfoProps {
  logo: string;
  name: string;
  location: string;
  date: Date;
  website: string;
  sponsors: string;
  onInputChange: (field: keyof Event, value: any) => void;
}

const AdditionalInfo: React.FC<AdditionalInfoProps> = ({
  logo,
  name,
  location,
  date,
  website,
  sponsors,
  onInputChange,
}) => {
  return (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Additional Details</Text>
      <Text style={styles.stepDescription}>
        Final information to complete your event
      </Text>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Website</Text>
        <TextInput
          style={styles.input}
          placeholder="www.example.com"
          value={website}
          onChangeText={(text) => onInputChange("website", text)}
          returnKeyType="next"
          blurOnSubmit={false}
          keyboardType="url"
        />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Sponsors</Text>
        <TextInput
          style={styles.input}
          placeholder="Sponsor names separated by commas"
          value={sponsors}
          onChangeText={(text) => onInputChange("sponsors", text)}
          returnKeyType="done"
          blurOnSubmit={true}
        />
      </View>
      <View style={styles.previewSection}>
        <Text style={styles.sectionTitle}>Preview</Text>
        <View style={styles.previewCard}>
          {logo ? (
            <Image source={{ uri: logo }} style={styles.previewLogo} />
          ) : (
            <View style={styles.previewLogoPlaceholder}>
              <FontAwesome name="calendar" size={32} color="#E53935" />
            </View>
          )}
          <Text style={styles.previewTitle}>{name || "Event Name"}</Text>
          <Text style={styles.previewInfo}>
            <FontAwesome name="map-marker" size={14} color="#666" />
            {location || "Location"}
          </Text>
          <Text style={styles.previewInfo}>
            <FontAwesome name="calendar" size={14} color="#666" />
            {date.toLocaleDateString("en-US")}
          </Text>
          <View style={styles.previewBadge}>
            <Text style={styles.previewBadgeText}>Ready to publish!</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default AdditionalInfo;
