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
import { useAnalytics } from "../hooks/useAnalytics";

interface CreateEventProps {
  onCancel: () => void;
  onSuccess: (event: Event) => void;
  initialData?: Partial<Event>;
}

const CreateEventForm: React.FC<CreateEventProps> = ({
  onCancel,
  onSuccess,
  initialData = {},
}) => {
  const authContext = useAuth();
  const user = authContext?.user;
  const { trackEventCreation, trackAppUsage } = useAnalytics();
  
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
        creators: String(user.id),
        rankings: formData.rankings.trim(),
        website: formData.website.trim(),
        sponsors: formData.sponsors.trim(),
        date: formattedDate,
        description: formData.description ? formData.description.trim() : "",
        // Les images sont traitées par eventService
        logo: formData.logo || "",
        images: formData.images || [],
      };
      
      const createdEvent = await eventService.createEvent(eventData);
      
      // Track the event creation
      if (trackEventCreation) {
        trackEventCreation({
          eventId: createdEvent.id?.toString() || Date.now().toString(),
          eventType: 'custom',
          creatorId: user.id.toString(),
          hasLocation: !!formData.location.trim(),
          hasImages: (formData.images?.length || 0) > 0 || !!formData.logo,
          categoryTags: [],
        });
      }

      onSuccess && onSuccess(createdEvent);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.error || error?.message || "Failed to create event";
      setError(errorMessage);
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

export default CreateEventForm;
