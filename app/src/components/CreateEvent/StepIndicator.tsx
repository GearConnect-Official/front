import * as React from "react";
import { TouchableOpacity, View } from "react-native";
import { createEventStyles as styles } from "../../styles/screens";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  totalSteps,
}) => {
  return (
    <View style={styles.stepsContainer}>
      <View>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <FontAwesome name="arrow-left" size={20} color="#1A1A1A" />
        </TouchableOpacity>
      </View>
      <View style={styles.stepDotContainer}>
        {Array.from({ length: totalSteps }).map((_, index) => (
          <View
            key={index}
            style={[
              styles.stepDot,
              currentStep >= index + 1 && styles.activeStep,
              index < totalSteps - 1 && styles.stepWithLine,
            ]}
          />
        ))}
      </View>
      <View style={styles.placeholderRight} />
    </View>
  );
};

export default StepIndicator;
