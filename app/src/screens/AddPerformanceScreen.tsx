import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
  Alert,
  Modal,
  ActivityIndicator,
  Animated,
  KeyboardAvoidingView,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import { LinearGradient } from "expo-linear-gradient";

import { useAuth } from "../context/AuthContext";
import PerformanceService from "../services/performanceService";
import {
  PerformanceFormData,
  PerformanceFormErrors,
  RACE_CATEGORIES,
  TRACK_CONDITIONS,
  WEATHER_CONDITIONS,
  RaceCategory,
  CreatePerformanceData,
} from "../types/performance.types";
import {
  performanceStyles,
  THEME_COLORS,
  LAYOUT,
  TYPOGRAPHY,
} from "../styles/screens/performanceStyles";
import { useMessage } from '../context/MessageContext';
import MessageService from '../services/messageService';
import { QuickMessages } from '../utils/messageUtils';

const AddPerformanceScreen: React.FC = () => {
  const router = useRouter();
  const auth = useAuth();
  const user = auth?.user;
  const { showMessage, showError, showConfirmation } = useMessage();

  // Form state
  const [formData, setFormData] = useState<PerformanceFormData>({
    circuitName: "",
    lapTime: "",
    racePosition: "",
    totalParticipants: "",
    category: "karting",
    date: new Date(),
    notes: "",
    weather: "",
    trackCondition: "dry",
  });

  // Form validation errors
  const [errors, setErrors] = useState<PerformanceFormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  // Modal states
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showWeatherModal, setShowWeatherModal] = useState(false);
  const [showConditionModal, setShowConditionModal] = useState(false);

  // Animation
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  /**
   * Validate form data
   */
  const validateForm = (): boolean => {
    const newErrors: PerformanceFormErrors = {};

    // Circuit name validation
    if (!formData.circuitName.trim()) {
      newErrors.circuitName = "Circuit name is required";
    }

    // Lap time validation (MM:SS.sss format)
    const lapTimeRegex = /^\d+:\d{2}\.\d{3}$/;
    if (!formData.lapTime.trim()) {
      newErrors.lapTime = "Lap time is required";
    } else if (!lapTimeRegex.test(formData.lapTime)) {
      newErrors.lapTime = "Invalid format. Use MM:SS.sss (e.g., 1:23.456)";
    }

    // Position validation
    const racePosition = parseInt(formData.racePosition);
    if (!formData.racePosition.trim()) {
      newErrors.racePosition = "Position is required";
    } else if (isNaN(racePosition) || racePosition < 1) {
      newErrors.racePosition = "Position must be greater than 0";
    }

    // Participants validation
    const participants = parseInt(formData.totalParticipants);
    if (!formData.totalParticipants.trim()) {
      newErrors.totalParticipants = "Number of participants is required";
    } else if (isNaN(participants) || participants < 1) {
      newErrors.totalParticipants = "Participants must be greater than 0";
    } else if (racePosition > participants) {
      newErrors.racePosition =
        "Position cannot be greater than total participants";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    if (!user?.id) {
      showError("You must be logged in to add a performance");
      return;
    }

    setIsLoading(true);

    try {
      const performanceData: CreatePerformanceData = {
        circuitName: formData.circuitName.trim(),
        lapTime: formData.lapTime.trim(),
        racePosition: parseInt(formData.racePosition),
        totalParticipants: parseInt(formData.totalParticipants),
        category: formData.category,
        date: formData.date.toISOString().split("T")[0], // YYYY-MM-DD format
        notes: formData.notes.trim() || undefined,
        weather: formData.weather.trim() || undefined,
        trackCondition: formData.trackCondition,
      };

      const response = await PerformanceService.createPerformance(
        performanceData,
        user.id
      );

      if (response.success) {
        showConfirmation({
          title: "Performance Added",
          message: response.message || "Your performance has been saved successfully!",
          confirmText: "View Performances",
          cancelText: "Add Another",
          type: 'success',
          onConfirm: () => {
            router.push('/(app)/performances');
          },
          onCancel: () => {
            // Reset form
            setFormData({
              circuitName: "",
              lapTime: "",
              racePosition: "",
              totalParticipants: "",
              category: "karting",
              date: new Date(),
              notes: "",
              weather: "",
              trackCondition: "dry",
            });
            setErrors({});
          }
        });
      } else {
        const errorMessage = response.error || "Failed to save performance";
        setErrors({});
        showError(errorMessage);
      }
    } catch (error: any) {
      if (
        error?.code === "NETWORK_ERROR" ||
        error?.message?.includes("Network")
      ) {
        showError("Please check your internet connection and try again.");
      } else {
        showError("An unexpected error occurred while saving your performance");
      }
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle date change
   */
  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      setFormData({ ...formData, date: selectedDate });
    }
  };

  /**
   * Update form field and clear related errors
   */
  const updateField = (field: keyof PerformanceFormData, value: any) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  /**
   * Get category data
   */
  const getCategoryData = (category: RaceCategory) => {
    return (
      RACE_CATEGORIES.find((cat) => cat.value === category) ||
      RACE_CATEGORIES[0]
    );
  };

  /**
   * Get condition data
   */
  const getConditionData = (condition: "dry" | "wet" | "mixed") => {
    return (
      TRACK_CONDITIONS.find((cond) => cond.value === condition) ||
      TRACK_CONDITIONS[0]
    );
  };

  /**
   * Get weather data
   */
  const getWeatherData = (weather: string) => {
    return weather || WEATHER_CONDITIONS[0];
  };

  /**
   * Render input field with label and error
   */
  const renderInputField = (
    label: string,
    value: string,
    onChangeText: (text: string) => void,
    placeholder: string,
    error?: string,
    keyboardType: "default" | "numeric" = "default",
    multiline = false
  ) => {
    return (
      <View style={performanceStyles.inputGroup}>
        <Text style={performanceStyles.inputLabel}>{label}</Text>
        <TextInput
          style={[
            performanceStyles.textInput,
            error && performanceStyles.textInputError,
            multiline && {
              height: 100,
              textAlignVertical: "top",
              paddingTop: 12,
            },
          ]}
          placeholder={placeholder}
          placeholderTextColor={THEME_COLORS.TEXT_MUTED}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={multiline ? 4 : 1}
          maxLength={multiline ? 500 : undefined}
          submitBehavior={multiline ? "newline" : "submit"}
          returnKeyType={multiline ? "default" : "done"}
        />
        {error && <Text style={performanceStyles.errorText}>{error}</Text>}
        {multiline && (
          <Text
            style={{
              fontSize: 12,
              color: THEME_COLORS.TEXT_MUTED,
              textAlign: "right",
              marginTop: 4,
            }}
          >
            {value.length}/500
          </Text>
        )}
      </View>
    );
  };

  /**
   * Render selector button
   */
  const renderSelector = (
    label: string,
    value: string,
    emoji: string,
    onPress: () => void,
    color?: string
  ) => {
    return (
      <View style={performanceStyles.inputGroup}>
        <Text style={performanceStyles.inputLabel}>{label}</Text>
        <TouchableOpacity
          style={[
            performanceStyles.textInput,
            {
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: color
                ? `${color}15`
                : THEME_COLORS.CARD_BACKGROUND,
              borderColor: color || THEME_COLORS.BORDER,
            },
          ]}
          onPress={onPress}
        >
          <Text
            style={[
              performanceStyles.textInput,
              { borderWidth: 0, padding: 0, flex: 1 },
            ]}
          >
            {emoji} {value}
          </Text>
          <FontAwesome
            name="chevron-down"
            size={16}
            color={THEME_COLORS.TEXT_SECONDARY}
          />
        </TouchableOpacity>
      </View>
    );
  };

  /**
   * Render category selection modal
   */
  const renderCategoryModal = () => {
    return (
      <Modal
        visible={showCategoryModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCategoryModal(false)}
      >
        <View style={performanceStyles.modalOverlay}>
          <View style={performanceStyles.modalContent}>
            {/* Modal Header */}
            <View style={performanceStyles.modalHeader}>
              <Text style={performanceStyles.modalTitle}>
                Select Racing Category
              </Text>
              <TouchableOpacity
                onPress={() => setShowCategoryModal(false)}
                style={{ padding: LAYOUT.SPACING_XS }}
              >
                <FontAwesome
                  name="times"
                  size={18}
                  color={THEME_COLORS.TEXT_SECONDARY}
                />
              </TouchableOpacity>
            </View>

            {/* Modal Content */}
            <ScrollView style={performanceStyles.modalList}>
              {RACE_CATEGORIES.map((category) => (
                <TouchableOpacity
                  key={category.value}
                  style={[
                    performanceStyles.modalItem,
                    formData.category === category.value &&
                      performanceStyles.modalItemSelected,
                    formData.category === category.value && {
                      backgroundColor: `${THEME_COLORS.RACING_RED}20`,
                      borderColor: THEME_COLORS.RACING_RED,
                    },
                  ]}
                  onPress={() => {
                    updateField("category", category.value);
                    setShowCategoryModal(false);
                  }}
                >
                  <Text style={performanceStyles.modalItemEmoji}>
                    {category.emoji}
                  </Text>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={[
                        performanceStyles.modalItemText,
                        formData.category === category.value && {
                          color: THEME_COLORS.RACING_RED,
                          fontWeight: TYPOGRAPHY.WEIGHT_SEMIBOLD,
                        },
                      ]}
                    >
                      {category.label}
                    </Text>
                  </View>
                  {formData.category === category.value && (
                    <FontAwesome
                      name="check"
                      size={20}
                      color={THEME_COLORS.RACING_RED}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  const categoryData = getCategoryData(formData.category);
  const conditionData = getConditionData(formData.trackCondition);
  const weatherData = getWeatherData(formData.weather);

  return (
    <SafeAreaView style={performanceStyles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          style={performanceStyles.scrollContainer}
          contentContainerStyle={performanceStyles.contentContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
          automaticallyAdjustKeyboardInsets={true}
        >
          {/* Header */}
          <View style={performanceStyles.header}>
            <TouchableOpacity
              style={performanceStyles.headerButton}
              onPress={() => router.back()}
            >
              <FontAwesome
                name="arrow-left"
                size={20}
                color={THEME_COLORS.TEXT_PRIMARY}
              />
            </TouchableOpacity>

            <Text style={performanceStyles.headerTitle}>Add Performance</Text>

            <View style={performanceStyles.headerButton}>
              <FontAwesome
                name="plus"
                size={20}
                color={THEME_COLORS.RACING_RED}
              />
            </View>
          </View>

          {/* Hero Section */}
          <Animated.View
            style={[
              performanceStyles.heroSection,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <LinearGradient
              colors={[
                THEME_COLORS.RACING_GRADIENT_START,
                THEME_COLORS.RACING_GRADIENT_END,
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={performanceStyles.heroGradient}
            >
              <Text style={performanceStyles.heroTitle}>
                Record Your Race 🏁
              </Text>
              <Text style={performanceStyles.heroSubtitle}>
                Track every lap, celebrate every achievement, and watch your
                racing journey unfold
              </Text>
            </LinearGradient>
          </Animated.View>

          {/* Form */}
          <Animated.View
            style={[
              performanceStyles.formContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {/* Circuit Name */}
            {renderInputField(
              "Circuit Name *",
              formData.circuitName,
              (text) => updateField("circuitName", text),
              "e.g., Silverstone Circuit",
              errors.circuitName
            )}

            {/* Lap Time */}
            {renderInputField(
              "Best Lap Time *",
              formData.lapTime,
              (text) => updateField("lapTime", text),
              "MM:SS.sss (e.g., 1:23.456)",
              errors.lapTime,
              "default"
            )}

            {/* Position and Participants Row */}
            <View style={{ flexDirection: "row", gap: LAYOUT.SPACING_MD }}>
              <View style={{ flex: 1 }}>
                {renderInputField(
                  "Position *",
                  formData.racePosition,
                  (text) => updateField("racePosition", text),
                  "Final position",
                  errors.racePosition,
                  "numeric"
                )}
              </View>
              <View style={{ flex: 1 }}>
                {renderInputField(
                  "Total Participants *",
                  formData.totalParticipants,
                  (text) => updateField("totalParticipants", text),
                  "Total racers",
                  errors.totalParticipants,
                  "numeric"
                )}
              </View>
            </View>

            {/* Category Selector */}
            {renderSelector(
              "Racing Category *",
              categoryData.label,
              categoryData.emoji,
              () => setShowCategoryModal(true),
              categoryData.color
            )}

            {/* Date Selector */}
            <View style={performanceStyles.inputGroup}>
              <Text style={performanceStyles.inputLabel}>Race Date *</Text>
              <TouchableOpacity
                style={performanceStyles.textInput}
                onPress={() => setShowDatePicker(true)}
              >
                <Text
                  style={{
                    fontSize: TYPOGRAPHY.BODY,
                    color: THEME_COLORS.TEXT_PRIMARY,
                  }}
                >
                  📅{" "}
                  {formData.date.toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Track Condition Selector */}
            {renderSelector(
              "Track Conditions *",
              conditionData.label,
              conditionData.emoji,
              () => setShowConditionModal(true),
              conditionData.color
            )}

            {/* Weather Selector */}
            {renderSelector(
              "Weather (Optional)",
              weatherData || "Select weather",
              weatherData ? "" : "🌤️",
              () => setShowWeatherModal(true)
            )}

            {/* Notes */}
            {renderInputField(
              "Race Notes (Optional)",
              formData.notes,
              (text) => updateField("notes", text),
              "Share your experience, strategy, or memorable moments...",
              errors.notes,
              "default",
              true
            )}

            {/* Submit Button */}
            <TouchableOpacity
              style={[
                performanceStyles.primaryButton,
                {
                  marginTop: LAYOUT.SPACING_LG,
                  opacity: isLoading ? 0.7 : 1,
                },
              ]}
              onPress={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <>
                  <FontAwesome name="trophy" size={18} color="#FFFFFF" />
                  <Text style={performanceStyles.primaryButtonText}>
                    Save Performance
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>

        {/* Modals */}
        {renderCategoryModal()}

        {/* Weather Modal */}
        {showWeatherModal && (
          <Modal transparent animationType="slide">
            <View style={performanceStyles.modalOverlay}>
              <View style={performanceStyles.modalContent}>
                <View style={performanceStyles.modalHeader}>
                  <Text style={performanceStyles.modalTitle}>
                    Select Weather
                  </Text>
                  <TouchableOpacity onPress={() => setShowWeatherModal(false)}>
                    <FontAwesome
                      name="times"
                      size={24}
                      color={THEME_COLORS.TEXT_SECONDARY}
                    />
                  </TouchableOpacity>
                </View>
                <ScrollView style={performanceStyles.modalList}>
                  {WEATHER_CONDITIONS.map((weather, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        performanceStyles.modalItem,
                        formData.weather === weather &&
                          performanceStyles.modalItemSelected,
                      ]}
                      onPress={() => {
                        updateField("weather", weather);
                        setShowWeatherModal(false);
                      }}
                    >
                      <Text
                        style={[
                          performanceStyles.modalItemText,
                          formData.weather === weather &&
                            performanceStyles.modalItemTextSelected,
                        ]}
                      >
                        {weather}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>
          </Modal>
        )}

        {/* Track Condition Modal */}
        {showConditionModal && (
          <Modal transparent animationType="slide">
            <View style={performanceStyles.modalOverlay}>
              <View style={performanceStyles.modalContent}>
                <View style={performanceStyles.modalHeader}>
                  <Text style={performanceStyles.modalTitle}>
                    Select Track Condition
                  </Text>
                  <TouchableOpacity
                    onPress={() => setShowConditionModal(false)}
                  >
                    <FontAwesome
                      name="times"
                      size={24}
                      color={THEME_COLORS.TEXT_SECONDARY}
                    />
                  </TouchableOpacity>
                </View>
                <ScrollView style={performanceStyles.modalList}>
                  {TRACK_CONDITIONS.map((condition) => (
                    <TouchableOpacity
                      key={condition.value}
                      style={[
                        performanceStyles.modalItem,
                        formData.trackCondition === condition.value &&
                          performanceStyles.modalItemSelected,
                      ]}
                      onPress={() => {
                        updateField("trackCondition", condition.value);
                        setShowConditionModal(false);
                      }}
                    >
                      <Text style={performanceStyles.modalItemEmoji}>
                        {condition.emoji}
                      </Text>
                      <Text
                        style={[
                          performanceStyles.modalItemText,
                          formData.trackCondition === condition.value &&
                            performanceStyles.modalItemTextSelected,
                        ]}
                      >
                        {condition.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>
          </Modal>
        )}

        {/* Date Picker */}
        {showDatePicker && (
          <DateTimePicker
            value={formData.date}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={onDateChange}
            maximumDate={new Date()}
          />
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AddPerformanceScreen;
