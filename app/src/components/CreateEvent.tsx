import * as React from "react";
import {
  View,
  Text,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import StepIndicator from "./CreateEvent/StepIndicator";
import BasicInfo from "./CreateEvent/BasicInfo";
import NavigationButtons from "./CreateEvent/NavigationButtons";
import styles from "../styles/screens/createEventStyles";
import eventService, { Event } from "../services/eventService";
import { useAuth } from "../context/AuthContext";
import MediaInfo from "./CreateEvent/MediaInfo";
import AdditionalInfo from "./CreateEvent/AdditionalInfo";

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
  const { user } = useAuth();
  
  const [formData, setFormData] = React.useState<Event>({
    name: initialData.name || "",
    creators: initialData.creators || "",
    location: initialData.location || "",
    date: initialData.date ? new Date(initialData.date) : new Date(),
    sponsors: initialData.sponsors || "",
    website: initialData.website || "",
    rankings: initialData.rankings || "",
    logo: initialData.logo || "",
    images: initialData.images || [],
    description: initialData.description || "",
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
  
    // Vérification si tous les champs obligatoires sont remplis
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
    
    if (!user || !user.id) {
      setError("You must be logged in to create an event");
      setLoading(false);
      return;
    }
  
    try {
      // Format date properly
      const formattedDate = new Date(formData.date);
      
      // Create a clean object with all required properties
      const eventData: Event = {
        name: formData.name.trim(),
        location: formData.location.trim(),
        // Utiliser l'ID utilisateur comme creatorId
        creators: user.id,
        rankings: formData.rankings.trim(),
        website: formData.website.trim(),
        sponsors: formData.sponsors.trim(),
        date: formattedDate,
        description: formData.description ? formData.description.trim() : "",
        // Les images sont traitées par eventService
        logo: formData.logo || "",
        images: formData.images || [],
      };
      
      // Afficher toutes les données envoyées pour débogage
      console.log("Données avant envoi:", JSON.stringify(eventData, null, 2));
      
      const createdEvent = await eventService.createEvent(eventData);
      console.log("Réponse du serveur:", createdEvent);
  
      Alert.alert(
        "Success", 
        "Your event has been created successfully! It's now visible to the entire community.", 
        [{ text: "Great!", onPress: onSuccess }]
      );
    } catch (err: any) {
      console.error("Error creating event:", err);
      
      // Log more details about the error for debugging
      if (err?.response) {
        console.error("Response data:", err.response.data);
        console.error("Response status:", err.response.status);
        console.error("Response headers:", err.response.headers);
      }
      
      // Afficher un message d'erreur plus précis
      if (err?.response?.data?.error) {
        setError(`Error: ${err.response.data.error}`);
      } else if (err?.response?.data?.message) {
        setError(`Error: ${err.response.data.message}`);
      } else if (err?.message) {
        setError(`Error: ${err.message}`);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
      Alert.alert("Error", "Unable to create the event. Please check your data and try again.");
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

  const handleAddImage = (uri: string) => {
    setFormData((prev) => ({
      ...prev,
      images: [...(prev.images || []), uri],
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
            images={formData.images || []}
            description={formData.description || ""}
            onInputChange={handleInputChange}
            onAddImage={handleAddImage}
            onLogoChange={(logo: string) => handleInputChange('logo', logo)}
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
        <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />
        <ScrollView style={styles.scrollView}>
          {renderStepContent()}
        </ScrollView>
        
        <NavigationButtons
          currentStep={currentStep}
          isLastStep={isLastStep}
          loading={loading}
          onPrev={prevStep}
          onNext={nextStep}
          onSubmit={handleSubmit}
        />
        
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    </KeyboardAvoidingView>
  );
};

export default CreateEvent;
