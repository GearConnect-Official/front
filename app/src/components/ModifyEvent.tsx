import * as React from "react";
import {
  View,
  Text,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import BasicInfo from "./CreateEvent/BasicInfo";
import NavigationButtons from "./CreateEvent/NavigationButtons";
import styles from "../styles/screens/createEventStyles";
import eventService, { Event } from "../services/eventService";
import { useAuth } from "../context/AuthContext";
import MediaInfo from "./CreateEvent/MediaInfo";
import AdditionalInfo from "./CreateEvent/AdditionalInfo";

interface ModifyEventProps {
  onCancel: () => void;
  onSuccess: () => void;
  eventData: Event;
  eventId: string;
}

const ModifyEvent: React.FC<ModifyEventProps> = ({
  onCancel,
  onSuccess,
  eventData,
  eventId
}) => {  const auth = useAuth();
  const user = auth?.user;
  
  // Validate inputs once on component mount
  React.useEffect(() => {
    if (!eventData) {
      console.error("ModifyEvent: Event data is missing");
    }
    if (!eventId) {
      console.error("ModifyEvent: Event ID is missing");
    }
    
    // Debug output suppressed to prevent excessive logging
  }, [eventData, eventId]);
  
  const [formData, setFormData] = React.useState<Event>({
    name: eventData?.name || "",
    creators: eventData?.creators || "",
    location: eventData?.location || "",
    date: eventData?.date ? new Date(eventData.date) : new Date(),
    sponsors: eventData?.sponsors || "",
    website: eventData?.website || "",
    rankings: eventData?.rankings || "",
    logo: eventData?.logo || "",
    images: eventData?.images || [],
    description: eventData?.description || "",
  });

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [currentStep, setCurrentStep] = React.useState(1);
  const totalSteps = 3;

  const handleInputChange = (field: keyof Event, value: any) => {
    setFormData((prev) => {
      const updatedForm = { ...prev, [field]: value };
      return updatedForm;
    });
  };  
  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
  
    // Validation of required fields
    if (!formData.name.trim()) {
      setError("Event name is required");
      setLoading(false);
      return;
    }

    if (!formData.location.trim()) {
      setError("Event location is required");
      setLoading(false);
      return;
    }
    
    if (!user) {
      setError("You must be logged in to update this event");
      setLoading(false);
      return;
    }

    if (!eventId) {
      setError("Event ID is missing");
      setLoading(false);
      return;
    }
  
  try {
      // Format date properly
      const formattedDate = new Date(formData.date);
      
      // Create a clean object with all properties that need to be updated
      const updatedData: Partial<Event> = {
        name: formData.name.trim(),
        location: formData.location.trim(),
        rankings: formData.rankings.trim(),
        website: formData.website.trim(),
        sponsors: formData.sponsors.trim(),
        date: formattedDate,
        description: formData.description ? formData.description.trim() : "",
        logo: formData.logo || "",
        images: formData.images || [],
      };
      
      // Debug logging
      console.log("Updating event:", eventId);
      console.log("Update data:", JSON.stringify(updatedData, null, 2));
      
      try {
        const result = await eventService.updateEvent(eventId, updatedData);
        console.log("Server response:", result);
        
        Alert.alert(
          "Success", 
          "Event has been updated successfully!", 
          [{ text: "OK", onPress: onSuccess }]
        );
      } catch (updateError: any) {
        console.error("API error updating event:", updateError);
        
        // More detailed error logging
        if (updateError.response) {
          console.error("Response status:", updateError.response.status);
          console.error("Response data:", updateError.response.data);
        }
        
        throw updateError;
      }
    } catch (err: any) {
      console.error("Error updating event:", err);
      
      // Log more details about the error for debugging
      if (err?.response) {
        console.error("Response data:", err.response.data);
        console.error("Response status:", err.response.status);
        console.error("Response headers:", err.response.headers);
      }
      
      // Show a more specific error message
      if (err?.response?.data?.error) {
        setError(`Error: ${err.response.data.error}`);
      } else if (err?.response?.data?.message) {
        setError(`Error: ${err.response.data.message}`);
      } else if (err?.message) {
        setError(`Error: ${err.message}`);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
      Alert.alert("Error", "Unable to update the event. Please check your data and try again.");
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleAddImage = (uri: string, publicId: string) => {
    setFormData((prev) => ({
      ...prev,
      images: [...(prev.images || []), uri],
      // Store the publicIds if your backend requires them
    }));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <BasicInfo
            name={formData.name}
            creators={formData.creators}
            location={formData.location}
            date={formData.date}
            onInputChange={handleInputChange}
          />
        );
      case 2:
        return (
          <MediaInfo
            logo={formData.logo || ""}
            logoPublicId={eventData?.logoPublicId}
            images={formData.images || []}
            imagePublicIds={eventData?.imagePublicIds}
            description={formData.description || ""}
            onInputChange={handleInputChange}
            onAddImage={handleAddImage}
            onLogoChange={(url: string, publicId: string) => handleInputChange('logo', url)}
          />
        );
      case 3:
        return (
          <AdditionalInfo
            logo={formData.logo || ""}
            name={formData.name}
            location={formData.location}
            date={formData.date}
            website={formData.website}
            sponsors={formData.sponsors}
            onInputChange={handleInputChange}
          />
        );
      default:
        return null;
    }
  };

  const isLastStep = currentStep === totalSteps;
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>

        
        <ScrollView style={styles.scrollView}>
          {renderStepContent()}
        </ScrollView>        <NavigationButtons
          currentStep={currentStep}
          isLastStep={isLastStep}
          loading={loading}
          onPrev={prevStep}
          onNext={nextStep}
          onSubmit={handleSubmit}
          isEditing={true}
        />
        
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    </KeyboardAvoidingView>
  );
};

export default ModifyEvent;
