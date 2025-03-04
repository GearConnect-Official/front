import * as React from "react";
import { View, Text } from "react-native";
import InputField from "./CreateEvent/InputField";
import ImageUpload from "./CreateEvent/ImageUpload";
import ActionButtons from "./CreateEvent/ActionButtons";
import styles from "../styles/createEventStyles";

interface CreateEventProps {
  onCancel: () => void;
  onSubmit: (formData: any) => void;
  initialData?: {
    eventName?: string;
    creators?: string;
    location?: string;
    date?: string;
    sponsors?: string;
    website?: string;
    rankings?: string;
  };
}

const CreateEvent: React.FC<CreateEventProps> = ({
  onCancel,
  onSubmit,
  initialData = {},
}) => {
  const [formData, setFormData] = React.useState({
    eventName: initialData.eventName || "",
    creators: initialData.creators || "",
    location: initialData.location || "",
    date: initialData.date || "",
    sponsors: initialData.sponsors || "",
    website: initialData.website || "www.valdevienne-circuit.com",
    rankings: initialData.rankings || "Val_de_Vienne_Rankings_2025.xls",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Logo</Text>
        <ImageUpload
          title="Upload the logo for the Event"
          buttonText="Upload"
        />
      </View>

      <InputField
        title="Event name"
        placeholder="Enter event name"
        info="Edit event name here"
        value={formData.eventName}
        onChangeText={(text) => handleInputChange("eventName", text)}
      />

      <InputField
        title="People who created it"
        placeholder="Enter creators' names"
        info="Add or modify event creators"
        value={formData.creators}
        onChangeText={(text) => handleInputChange("creators", text)}
      />

      <InputField
        title="Location"
        placeholder="Enter event location"
        info="Change event location here"
        value={formData.location}
        onChangeText={(text) => handleInputChange("location", text)}
      />

      <InputField
        title="Date"
        placeholder="Select event date"
        info="Change event date here"
        value={formData.date}
        onChangeText={(text) => handleInputChange("date", text)}
      />

      <InputField
        title="Sponsors"
        placeholder="Enter event sponsors"
        info="Add or modify event sponsors"
        value={formData.sponsors}
        onChangeText={(text) => handleInputChange("sponsors", text)}
      />

      <InputField
        title="Organizer's website"
        placeholder="www.valdevienne-circuit.com"
        info="Add link to organizer's website if available"
        value={formData.website}
        onChangeText={(text) => handleInputChange("website", text)}
      />

      <InputField
        title="Rankings"
        placeholder="Val_de_Vienne_Rankings_2025.xls"
        info="Download or modify the rankings file here"
        value={formData.rankings}
        onChangeText={(text) => handleInputChange("rankings", text)}
      />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Images</Text>
        <ImageUpload title="Upload your image" buttonText="Upload" />
      </View>

      <ActionButtons onCancel={onCancel} onSubmit={handleSubmit} />
    </View>
  );
};

export default CreateEvent;