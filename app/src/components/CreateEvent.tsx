import * as React from "react";
import { View, Text, Alert } from "react-native";
import InputField from "./CreateEvent/InputField";
import ImageUpload from "./CreateEvent/ImageUpload";
import ActionButtons from "./CreateEvent/ActionButtons";
import styles from "../styles/createEventStyles";
import eventService, { Event } from "../services/eventService";

interface CreateEventProps {
  onCancel: () => void;
  onSuccess: () => void;
  initialData?: Partial<Event>;
}

const CreateEvent: React.FC<CreateEventProps> = ({
  onCancel,
  onSuccess,
  initialData = {},
}) => {
  const [formData, setFormData] = React.useState<Event>({
    name: initialData.name || "",
    creators: initialData.creators || "",
    location: initialData.location || "",
    date: initialData.date ? new Date(initialData.date) : new Date(),
    sponsors: initialData.sponsors || "",
    website: initialData.website || "",
    rankings: initialData.rankings || "",
    logo: initialData.logo,
    images: initialData.images || [],
  });

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleInputChange = (field: keyof Event, value: any) => {
    setFormData((prev) => {
      const updatedForm = { ...prev, [field]: value };
      return updatedForm;
    });
  };  

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
  
    // Vérification si tous les champs obligatoires sont remplis
    if (!formData.name.trim()) {
      setError("Event name is required");
      setLoading(false);
      return;
    }
  
    try {
      const eventData: Event = {
        ...formData,
        date: new Date(formData.date),
      };
    
      const createdEvent = await eventService.createEvent(eventData);
  
      Alert.alert("Success", "The event has been created successfully!", [
        { text: "OK", onPress: onSuccess },
      ]);
    } catch (err) {
      setError("Erreur lors de la création de l'événement");
      console.error("Error creating event:", err);
      Alert.alert("Error", "Failed to create event. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Logo</Text>
        <ImageUpload
          title="Upload the logo for the Event"
          buttonText="Upload"
          onImageSelected={(uri) => handleInputChange("logo", uri)}
        />
      </View>

      <InputField
        title="Event name"
        placeholder="Enter event name"
        info="Edit event name here"
        value={formData.name}
        onChangeText={(text) => handleInputChange("name", text)}
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
        value={formData.date.toISOString().split("T")[0]} // Affichage en YYYY-MM-DD
        onChangeText={(text) => {
          const newDate = new Date(text);
          if (!isNaN(newDate.getTime())) {
            handleInputChange("date", newDate);
          }
        }}
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
        <ImageUpload
          title="Upload your image"
          buttonText="Upload"
          onImageSelected={(uri) =>
            setFormData((prev) => ({
              ...prev,
              images: [...(prev.images || []), uri],
            }))
          }
        />
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <ActionButtons
        onCancel={onCancel}
        onSubmit={handleSubmit}
        submitText={loading ? "Creating..." : "Create"}
        disabled={loading}
      />
    </View>
  );
};

export default CreateEvent;
