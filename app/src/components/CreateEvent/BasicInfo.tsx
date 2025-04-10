import * as React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import styles from "../../styles/createEventStyles";
import { Event } from "../../services/eventService";

interface BasicInfoProps {
  name: string;
  creators: string;
  location: string;
  date: Date;
  onInputChange: (field: keyof Event, value: any) => void;
}

const BasicInfo: React.FC<BasicInfoProps> = ({
  name,
  creators,
  location,
  date,
  onInputChange,
}) => {
  const [showDatePicker, setShowDatePicker] = React.useState(false);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      onInputChange("date", selectedDate);
    }
  };

  return (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Basic Information</Text>
      <Text style={styles.stepDescription}>
        Let's start with the essential details of your event
      </Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Event Name*</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter event name"
          value={name}
          onChangeText={(text) => onInputChange("name", text)}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Organizers</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter organizer name"
          value={creators}
          onChangeText={(text) => onInputChange("creators", text)}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Location*</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter event location"
          value={location}
          onChangeText={(text) => onInputChange("location", text)}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Date*</Text>
        <TouchableOpacity 
          style={styles.datePicker}
          onPress={() => setShowDatePicker(true)}
        >
          <Text>{date.toLocaleDateString('en-US')}</Text>
          <FontAwesome name="calendar" size={20} color="#666" />
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}
      </View>
    </View>
  );
};

export default BasicInfo; 