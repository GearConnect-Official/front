import * as React from 'react';
import {
  View,
  Text,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import BasicInfo from './CreateEvent/BasicInfo';
import NavigationButtons from './CreateEvent/NavigationButtons';
import { createEventStyles as styles } from '../styles/screens';
import eventService, { Event } from '../services/eventService';
import { useAuth } from '../context/AuthContext';
import MediaInfo from './CreateEvent/MediaInfo';
import AdditionalInfo from './CreateEvent/AdditionalInfo';

interface ModifyEventProps {
  onCancel: () => void;
  onSuccess: () => void;
  eventData: Event;
  eventId: string;
}

// Custom hook to manage form state and validation
const useEventForm = (initialData: Event) => {
  const [formData, setFormData] = React.useState<Event>(initialData);
  const [error, setError] = React.useState<string | null>(null);

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Event name is required');
      return false;
    }

    if (!formData.location.trim()) {
      setError('Event location is required');
      return false;
    }

    setError(null);
    return true;
  };

  const handleInputChange = (field: keyof Event, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddImage = (uri: string) => {
    setFormData((prev) => ({
      ...prev,
      images: [...(prev.images || []), uri],
    }));
  };

  return {
    formData,
    error,
    setError,
    validateForm,
    handleInputChange,
    handleAddImage,
  };
};

const ModifyEvent: React.FC<ModifyEventProps> = ({
  onCancel,
  onSuccess,
  eventData,
  eventId,
}) => {
  const auth = useAuth();
  const user = auth?.user;
  const [loading, setLoading] = React.useState(false);
  const [currentStep, setCurrentStep] = React.useState(1);
  const totalSteps = 3;
  // Initialize form with event data
  const initialFormData: Event = {
    name: eventData?.name || '',
    creators: eventData?.creators || '',
    location: eventData?.location || '',
    date: eventData?.date ? new Date(eventData.date) : new Date(),
    sponsors: eventData?.sponsors || '',
    website: eventData?.website || '',
    rankings: eventData?.rankings || '',
    logo: eventData?.logo || '',
    images: eventData?.images || [],
    description: eventData?.description || '',
    logoPublicId: eventData?.logoPublicId || '',
    imagePublicIds: eventData?.imagePublicIds || [],
    creatorId: eventData?.creatorId,
    meteo: eventData?.meteo || {},
  };

  const {
    formData,
    error,
    setError,
    validateForm,
    handleInputChange,
    handleAddImage,
  } = useEventForm(initialFormData);
  const handleSubmit = async () => {
    console.log('🚀 Starting event update process...');
    setLoading(true);

    if (!validateForm()) {
      console.log('❌ Form validation failed');
      setLoading(false);
      return;
    }

    if (!user) {
      console.log('❌ User not logged in');
      setError('You must be logged in to update this event');
      setLoading(false);
      return;
    }

    if (!eventId) {
      console.log('❌ Event ID is missing');
      setError('Event ID is missing');
      setLoading(false);
      return;
    }

    console.log('📋 Form data before processing:', formData);
    console.log('🆔 Event ID:', eventId);
    console.log('👤 User:', user);

    try {
      // Format date properly
      const formattedDate = new Date(formData.date);
      console.log('📅 Formatted date:', formattedDate);

      // Create a clean object with properties that need to be updated
      const updatedData: Partial<Event> = {
        name: formData.name.trim(),
        location: formData.location.trim(),
        rankings: formData.rankings.trim(),
        website: formData.website.trim(),
        sponsors: formData.sponsors.trim(),
        date: formattedDate,
        description: formData.description ? formData.description.trim() : '',
        logo: formData.logo || '',
        images: formData.images || [],
        meteo: formData.meteo || {},
      };

      console.log('📤 Data to be sent for update:', updatedData);

      // Update the event details
      console.log('🔄 Calling eventService.updateEvent...');
      const result = await eventService.updateEvent(eventId, updatedData);
      console.log('✅ Update result:', result);

      Alert.alert('Success', 'Event has been updated successfully!', [
        { text: 'OK', onPress: onSuccess },
      ]);
    } catch (err: any) {
      console.error('❌ Error updating event:', err);
      console.error('📋 Error details:', {
        message: err?.message,
        response: err?.response?.data,
        status: err?.response?.status
      });

      const errorMessage =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        'An unexpected error occurred. Please try again.';

      console.log('📝 Final error message:', errorMessage);
      setError(`Error: ${errorMessage}`);
      Alert.alert(
        'Error',
        'Unable to update the event. Please check your data and try again.'
      );
    } finally {
      setLoading(false);
      console.log('🏁 Update process finished');
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
  };  const renderStepContent = () => {
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
            logo={formData.logo || ''}
            logoPublicId={eventData?.logoPublicId}
            images={formData.images || []}
            imagePublicIds={eventData?.imagePublicIds}
            description={formData.description || ''}
            onInputChange={handleInputChange}
            onAddImage={(uri: string, publicId: string) => handleAddImage(uri)}
            onLogoChange={(url: string) => handleInputChange('logo', url)}
          />
        );
      case 3:
        return (
          <AdditionalInfo
            logo={formData.logo || ''}
            name={formData.name}
            location={formData.location}
            date={formData.date}
            website={formData.website}
            sponsors={formData.sponsors}
            meteo={formData.meteo as any}
            onInputChange={handleInputChange}
          />
        );
      default:
        return null;
    }
  };  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      enabled
    >
      <View style={[styles.container, { flex: 1 }]}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={true}
          nestedScrollEnabled={true}
          removeClippedSubviews={false}
          scrollEnabled={true}
          bounces={true}
        >          
        {renderStepContent()}
        </ScrollView> 
        
        <NavigationButtons
          currentStep={currentStep}
          isLastStep={currentStep === totalSteps}
          loading={loading}
          onPrev={prevStep}
          onNext={nextStep}
          onSubmit={handleSubmit}
          isEditing={true}
        />
        
        {error && (
          <Text style={styles.errorText}>
            {error}
          </Text>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

export default ModifyEvent;
