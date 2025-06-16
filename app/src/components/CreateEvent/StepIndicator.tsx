import * as React from "react";
import { View } from "react-native";
import { createEventStyles as styles } from "../../styles/screens";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const StepIndicator: React.FC<StepIndicatorProps>  = ({
  currentStep,
  totalSteps,
}) => {
  return (
    <View style={styles.stepsContainer}>
      {Array.from({ length: totalSteps }).map((_, index) => (
        <View 
          key={index} 
          style={[
            styles.stepDot, 
            currentStep >= index + 1 && styles.activeStep,
            index < totalSteps - 1 && styles.stepWithLine
          ]}
        />
      ))}
    </View>
  );
};

export default StepIndicator; 